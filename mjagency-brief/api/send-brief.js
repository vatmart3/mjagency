/* =========================================================
   MJAGENCY — Envoi du brief validé

   Fonction serverless Vercel : la page poste le PDF du brief ici, et
   c'est ce code qui le transmet à Resend, en pièce jointe. La clé
   d'API vit dans les variables d'environnement du projet, jamais dans
   la page.

   Variables à définir dans Vercel (Settings → Environment Variables) :
     RESEND_API_KEY  — obligatoire, générée sur resend.com/api-keys
     MAIL_FROM       — expéditeur, ex. « MJAGENCY <brief@mjagency.eu> »
                       Tant que le domaine n'est pas vérifié chez Resend,
                       laisser vide : on retombe sur onboarding@resend.dev,
                       qui ne sait écrire qu'au titulaire du compte Resend.
     MAIL_TO         — destinataire, si différent de la valeur par défaut
   ========================================================= */

const DESTINATAIRE_PAR_DEFAUT = 'mjagency.officiel@gmail.com';
const EXPEDITEUR_PAR_DEFAUT   = 'MJAGENCY <onboarding@resend.dev>';

/* Un brief pèse une trentaine de Ko, un peu plus avec la signature.
   Vercel refuse de toute façon les corps de plus de 4,5 Mo : cette
   borne-ci ne sert qu'à répondre proprement avant. */
const PDF_MAX_BASE64 = 4 * 1024 * 1024;
const MAX = { company: 160, contactName: 120, phone: 40, email: 160, siteType: 80, budget: 60, recap: 20000 };

const coupe = (v, n) => String(v == null ? '' : v).trim().slice(0, n);
const estEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const uneLigne = v => v.replace(/[\r\n]+/g, ' ');
const echappe = v => String(v)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

function lireCorps(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  try { return JSON.parse(req.body || '{}'); } catch { return {}; }
}

module.exports = async (req, res) => {
  /* Ouvrir /api/send-brief dans un navigateur dit si la fonction est
     déployée et si la clé est posée — des booléens, jamais les valeurs. */
  if (req.method === 'GET') {
    return res.status(200).json({
      ok: true,
      service: 'send-brief',
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
  const c = {
    ref:         coupe(b.ref, 20),
    company:     coupe(b.company, MAX.company),
    contactName: coupe(b.contactName, MAX.contactName),
    phone:       coupe(b.phone, MAX.phone),
    email:       coupe(b.email, MAX.email),
    siteType:    coupe(b.siteType, MAX.siteType),
    budget:      coupe(b.budget, MAX.budget),
    recap:       coupe(b.recap, MAX.recap)
  };

  if (!/^MJ-\d{6}-[A-HJ-NP-Z2-9]{4}$/.test(c.ref)) {
    return res.status(400).json({ ok: false, error: 'Référence invalide', code: 'REF' });
  }
  if (!c.company || !c.contactName) {
    return res.status(400).json({ ok: false, error: 'Informations obligatoires manquantes', code: 'CHAMPS' });
  }

  // Le PDF arrive en base64 : on vérifie que c'en est un, et qu'il n'est pas démesuré.
  const pdf = typeof b.pdf === 'string' ? b.pdf.replace(/\s+/g, '') : '';
  if (!pdf || pdf.length > PDF_MAX_BASE64 || !/^[A-Za-z0-9+/]+={0,2}$/.test(pdf)) {
    return res.status(400).json({ ok: false, error: 'PDF invalide', code: 'PDF' });
  }
  if (Buffer.from(pdf.slice(0, 8), 'base64').toString('latin1').slice(0, 5) !== '%PDF-') {
    return res.status(400).json({ ok: false, error: 'PDF invalide', code: 'PDF' });
  }
  const filename = /^[A-Za-z0-9._-]{1,140}\.pdf$/.test(String(b.filename || ''))
    ? b.filename
    : `Brief-MJAGENCY-${c.ref}.pdf`;

  const cle = process.env.RESEND_API_KEY;
  if (!cle) {
    console.error('RESEND_API_KEY absente : ajoutez-la dans Settings → Environment Variables, puis redéployez.');
    return res.status(500).json({ ok: false, error: 'Service indisponible', code: 'CLE-ABSENTE' });
  }

  const sujet = uneLigne(`Brief site web — ${c.company} (${c.ref})`);
  const lignes = [
    ['Entreprise', c.company], ['Contact', c.contactName], ['Téléphone', c.phone],
    ['E-mail', c.email], ['Type de site', c.siteType], ['Budget', c.budget], ['Référence', c.ref]
  ].filter(([, v]) => v);

  const texte = [
    'Nouveau brief validé. Le PDF complet est en pièce jointe.',
    '',
    ...lignes.map(([k, v]) => `${k} : ${v}`),
    '',
    c.recap
  ].join('\n');

  const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:15px;line-height:1.6;color:#0B1220">
  <h2 style="font-size:19px;margin:0 0 6px">Nouveau brief validé</h2>
  <p style="margin:0 0 16px;color:#5A6475">Le PDF complet est en pièce jointe.</p>
  <table style="border-collapse:collapse">${
    lignes.map(([k, v]) =>
      `<tr><td style="padding:4px 16px 4px 0;color:#5A6475">${echappe(k)}</td><td style="padding:4px 0"><b>${echappe(v)}</b></td></tr>`
    ).join('')
  }</table>
  ${c.recap ? `<p style="margin:24px 0 6px;color:#5A6475">Récapitulatif</p>
  <p style="margin:0;white-space:pre-wrap;font-size:13.5px">${echappe(c.recap)}</p>` : ''}
</div>`;

  try {
    const rep = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${cle}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.MAIL_FROM || EXPEDITEUR_PAR_DEFAUT,
        to: [process.env.MAIL_TO || DESTINATAIRE_PAR_DEFAUT],
        // « Répondre » écrit au client, pas à nous
        ...(estEmail(c.email) ? { reply_to: c.email } : {}),
        subject: sujet,
        text: texte,
        html,
        attachments: [{ filename, content: pdf }]
      })
    });

    if (!rep.ok) {
      // Le détail reste dans les journaux Vercel ; le client ne reçoit qu'un code.
      console.error('Resend', rep.status, await rep.text().catch(() => ''));
      const code = rep.status === 401 || rep.status === 403 ? 'CLE-REFUSEE'
                 : rep.status === 422 ? 'EXPEDITEUR'
                 : rep.status === 429 ? 'QUOTA'
                 : 'RESEND-' + rep.status;
      return res.status(502).json({ ok: false, error: "L'envoi a échoué", code });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Resend injoignable', err);
    return res.status(502).json({ ok: false, error: "L'envoi a échoué", code: 'RESEND-INJOIGNABLE' });
  }
};
