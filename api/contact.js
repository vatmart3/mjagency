/* =========================================================
   MJ AGENCY — Réception du formulaire de contact

   Fonction serverless Vercel : le navigateur poste ici, et c'est
   ce code — pas le visiteur — qui parle à Resend. La clé d'API vit
   dans les variables d'environnement du projet, jamais dans la page.
   C'est toute la différence avec un service côté client, où la clé
   est lisible dans le code source par n'importe qui.

   Variables à définir dans Vercel (Settings → Environment Variables) :
     RESEND_API_KEY  — obligatoire, générée sur resend.com/api-keys
     MAIL_FROM       — expéditeur, ex. « MJ Agency <contact@mjagency.eu> »
                       Tant que le domaine n'est pas vérifié chez Resend,
                       laisser vide : on retombe sur onboarding@resend.dev,
                       qui ne sait écrire qu'au titulaire du compte.
     MAIL_TO         — destinataire, si différent de la valeur par défaut
   ========================================================= */

const DESTINATAIRE_PAR_DEFAUT = 'vatmart3@gmail.com';
const EXPEDITEUR_PAR_DEFAUT   = 'MJ Agency <onboarding@resend.dev>';

/* Bornes volontairement larges : elles n'existent que pour empêcher
   qu'un automate ne pousse mégaoctet sur mégaoctet dans la boîte. */
const MAX = { nom: 120, email: 160, societe: 160, budget: 60, message: 4000 };

const coupe = (v, n) => String(v == null ? '' : v).trim().slice(0, n);
const estEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

/* Une valeur qui finit dans un en-tête ne doit pas pouvoir en ouvrir
   un second : on retire les retours à la ligne. */
const uneLigne = v => v.replace(/[\r\n]+/g, ' ');

const echappe = v => String(v)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

/* ---------------------------------------------------------------------
   Alerte immédiate — WhatsApp ou SMS

   Facultative, et surtout : elle ne conditionne jamais la réponse. Si le
   service d'alerte tombe, l'email est déjà parti et la demande n'est pas
   perdue — on ne fait pas échouer un formulaire à cause d'une notification.

   Par défaut le message ne contient que le prénom et le créneau. Les
   coordonnées du prospect restent dans l'email, qui passe par un
   prestataire en règle. Faire transiter des données personnelles par un
   service gratuit de notification est un choix qui vous engage : il faut
   le poser sciemment, avec ALERTE_DETAIL=complet.

   Variables :
     ALERTE_CANAL   callmebot | twilio | free-mobile   (absente = pas d'alerte)
     ALERTE_TEL     numéro destinataire, format +33…
     ALERTE_DETAIL  minimal (défaut) | complet
   --------------------------------------------------------------------- */
async function alerter(c) {
  const canal = String(process.env.ALERTE_CANAL || '').trim().toLowerCase();
  if (!canal || canal === 'off') return;

  const tel = String(process.env.ALERTE_TEL || '').trim();
  const complet = String(process.env.ALERTE_DETAIL || '').toLowerCase() === 'complet';

  const texte = [
    `Nouvelle demande — ${c.nom}`,
    c.date ? `Créneau : ${c.date} ${c.heure}` : null,
    complet ? `Email : ${c.email}` : null,
    complet && c.societe ? `Société : ${c.societe}` : null,
    complet && c.budget ? `Budget : ${c.budget}` : null,
    complet && c.message ? `\n${c.message.slice(0, 500)}` : null,
    complet ? null : 'Détails dans votre boîte mail.'
  ].filter(Boolean).join('\n');

  // Une notification ne doit pas faire patienter le visiteur : au-delà de
  // cinq secondes, on abandonne et on laisse l'email faire son travail.
  const signal = AbortSignal.timeout(5000);

  if (canal === 'callmebot') {
    const u = new URL('https://api.callmebot.com/whatsapp.php');
    u.searchParams.set('phone', tel);
    u.searchParams.set('text', texte);
    u.searchParams.set('apikey', String(process.env.CALLMEBOT_APIKEY || ''));
    return fetch(u, { signal });
  }

  if (canal === 'twilio') {
    const sid = String(process.env.TWILIO_SID || '');
    const corps = new URLSearchParams({
      To: String(process.env.ALERTE_TEL_TWILIO || tel),
      From: String(process.env.TWILIO_FROM || ''),
      Body: texte
    });
    return fetch(`https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(sid)}/Messages.json`, {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${sid}:${process.env.TWILIO_TOKEN || ''}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: corps,
      signal
    });
  }

  if (canal === 'free-mobile') {
    const u = new URL('https://smsapi.free-mobile.fr/sendmsg');
    u.searchParams.set('user', String(process.env.FREE_USER || ''));
    u.searchParams.set('pass', String(process.env.FREE_PASS || ''));
    u.searchParams.set('msg', texte);
    return fetch(u, { signal });
  }

  console.warn('ALERTE_CANAL inconnu :', canal);
}

function lireCorps(req) {
  // Vercel décode déjà le JSON ; on gère quand même la chaîne brute,
  // pour ne pas dépendre d'un détail de la plateforme.
  if (req.body && typeof req.body === 'object') return req.body;
  try { return JSON.parse(req.body || '{}'); } catch { return {}; }
}

module.exports = async (req, res) => {
  /* Ouvrir /api/contact dans un navigateur envoie un GET. Plutôt que de
     répondre sèchement, on en fait un point de contrôle : il dit si la
     fonction est bien déployée et si la clé est configurée — deux booléens,
     jamais la clé elle-même ni aucune adresse. C'est ce qui permet de
     distinguer « pas déployé » de « mal configuré » sans lire les journaux. */
  if (req.method === 'GET') {
    return res.status(200).json({
      ok: true,
      service: 'contact',
      deploye: true,
      cleConfiguree: Boolean(process.env.RESEND_API_KEY),
      expediteurPersonnalise: Boolean(process.env.MAIL_FROM)
    });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ ok: false, error: 'Méthode non autorisée', code: 'METHODE' });
  }

  const b = lireCorps(req);

  // Piège à robots : le champ est invisible et hors du parcours clavier.
  // Rempli, c'est un automate — on répond « c'est parti » sans rien envoyer,
  // pour ne pas lui apprendre qu'il a été repéré.
  if (coupe(b.site, 50)) return res.status(200).json({ ok: true });

  const c = {
    nom:     coupe(b.nom, MAX.nom),
    email:   coupe(b.email, MAX.email),
    societe: coupe(b.societe, MAX.societe),
    budget:  coupe(b.budget, MAX.budget),
    message: coupe(b.message, MAX.message),
    date:    coupe(b.date, 40),
    heure:   coupe(b.heure, 20)
  };

  if (!c.nom)             return res.status(400).json({ ok: false, error: 'Nom manquant', code: 'NOM' });
  if (!estEmail(c.email)) return res.status(400).json({ ok: false, error: 'Email invalide', code: 'EMAIL' });

  const cle = process.env.RESEND_API_KEY;
  if (!cle) {
    console.error('RESEND_API_KEY absente : ajoutez-la dans Settings → Environment Variables, puis redéployez.');
    return res.status(500).json({ ok: false, error: 'Service indisponible', code: 'CLE-ABSENTE' });
  }

  const sujet = uneLigne(
    `Demande de rendez-vous — ${c.nom}${c.date ? ` (${c.date} ${c.heure})` : ''}`
  );

  const lignes = [
    ['Nom', c.nom], ['Email', c.email], ['Société', c.societe],
    ['Budget', c.budget], ['Rendez-vous', c.date ? `${c.date} à ${c.heure}` : '']
  ].filter(([, v]) => v);

  const texte = [
    ...lignes.map(([k, v]) => `${k} : ${v}`),
    '', 'Projet :', c.message || '(non renseigné)'
  ].join('\n');

  const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:15px;line-height:1.6;color:#1D1D1F">
  <h2 style="font-size:19px;margin:0 0 16px">Nouvelle demande depuis le site</h2>
  <table style="border-collapse:collapse">${
    lignes.map(([k, v]) =>
      `<tr><td style="padding:4px 16px 4px 0;color:#86868B">${k}</td><td style="padding:4px 0"><b>${echappe(v)}</b></td></tr>`
    ).join('')
  }</table>
  <p style="margin:20px 0 4px;color:#86868B">Projet</p>
  <p style="margin:0;white-space:pre-wrap">${echappe(c.message || '(non renseigné)')}</p>
</div>`;

  try {
    const rep = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${cle}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.MAIL_FROM || EXPEDITEUR_PAR_DEFAUT,
        to: [process.env.MAIL_TO || DESTINATAIRE_PAR_DEFAUT],
        reply_to: c.email,          // « Répondre » écrit au prospect, pas à nous
        subject: sujet,
        text: texte,
        html
      })
    });

    if (!rep.ok) {
      // Le détail reste dans les journaux Vercel : il peut contenir des
      // informations sur la configuration du compte. Le visiteur ne reçoit
      // qu'un code, assez précis pour être rapporté, assez vague pour ne
      // rien révéler.
      console.error('Resend', rep.status, await rep.text().catch(() => ''));
      const code = rep.status === 401 || rep.status === 403 ? 'CLE-REFUSEE'
                 : rep.status === 422 ? 'EXPEDITEUR'
                 : rep.status === 429 ? 'QUOTA'
                 : 'RESEND-' + rep.status;
      return res.status(502).json({ ok: false, error: "L'envoi a échoué", code });
    }

    // L'email est parti : à partir d'ici, plus rien ne doit pouvoir faire
    // échouer la demande. L'alerte est tentée, ses ratés sont journalisés.
    try {
      const r = await alerter(c);
      if (r && !r.ok) console.error('Alerte refusée', r.status, await r.text().catch(() => ''));
    } catch (err) {
      console.error('Alerte non partie', err);
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Resend injoignable', err);
    return res.status(502).json({ ok: false, error: "L'envoi a échoué", code: 'RESEND-INJOIGNABLE' });
  }
};
