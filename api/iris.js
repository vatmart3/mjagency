/* =========================================================
   MJ AGENCY — IRIS, la voix du masque

   Fonction serverless Vercel : le masque (spider.html) poste ici,
   et c'est ce code — pas le navigateur — qui parle à l'API Claude.
   La clé d'API vit dans les variables d'environnement du projet ;
   elle n'apparaît jamais dans le code de la page, donc personne ne
   peut la lire depuis son téléphone.

   Variable à définir dans Vercel (Settings → Environment Variables) :
     ANTHROPIC_API_KEY — obligatoire, générée sur console.anthropic.com

   Sans cette clé, la route répond 503 avec un code : la page bascule
   alors sur son mode hors ligne, qui sait encore donner l'heure et
   la météo. L'interface ne tombe jamais en panne, elle se dégrade.
   ========================================================= */

const MODELE = 'claude-opus-5';

/* Bornes volontairement larges : elles n'existent que pour empêcher
   qu'un automate ne pousse mégaoctet sur mégaoctet dans l'API. */
const MAX = { message: 2000, tours: 12, contexte: 600 };

/* La réponse est lue à voix haute. Au-delà de trois phrases, on parle
   par-dessus l'utilisateur : la brièveté est une contrainte technique
   autant qu'un parti pris. */
const MAX_JETONS = 320;

const coupe = (v, n) => String(v == null ? '' : v).trim().slice(0, n);

/* Le corps arrive parfois déjà décodé, parfois en texte brut. */
function corps(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  try { return JSON.parse(req.body || '{}'); } catch { return {}; }
}

/* ---------------------------------------------------------------------
   La consigne système

   Elle porte tout le caractère d'IRIS : une intelligence embarquée qui
   répond dans l'oreille, pas un assistant qui rédige. Le contexte réel
   (heure, ville, météo, tenue) y est injecté à chaque appel pour qu'elle
   réponde « il fait 21 degrés » plutôt que « je ne peux pas savoir ».
   --------------------------------------------------------------------- */
function consigne(ctx) {
  const faits = [
    ctx.heure   && `Heure locale : ${ctx.heure}`,
    ctx.date    && `Date : ${ctx.date}`,
    ctx.ville   && `Position approximative : ${ctx.ville}`,
    ctx.meteo   && `Météo actuelle sur place : ${ctx.meteo}`,
    ctx.tenue   && `Tenue active : ${ctx.tenue}`,
  ].filter(Boolean);

  return `Tu es IRIS, l'intelligence embarquée dans le masque d'un justicier masqué. Tu lui parles dans l'oreille pendant qu'il est en mouvement, en français.

Ta voix : calme, nette, un peu synthétique, avec un humour sec très occasionnel. Tu es une alliée, pas une servante — tu peux le contredire ou lui dire qu'une idée est mauvaise.

Contraintes de forme, non négociables :
- Ta réponse est LUE À VOIX HAUTE. Trois phrases maximum, une seule le plus souvent.
- Jamais de listes, de titres, d'astérisques, d'emoji ni de mise en forme : du texte parlé, uniquement.
- Écris les nombres comme on les dit ("vingt-et-un degrés", "quatorze heures trente").
- Pas de formule d'ouverture ni de conclusion. Tu réponds, tu t'arrêtes.
- Si tu ignores quelque chose, dis-le en quatre mots et propose la suite.

Données de mission dont tu disposes à cet instant :
${faits.length ? faits.join('\n') : 'Aucune donnée capteur disponible.'}

Utilise ces données comme des faits que tu observes toi-même. Ne dis jamais qu'elles t'ont été « fournies » : tu les lis sur tes propres capteurs.`;
}

/* ---------------------------------------------------------------------
   Appel à l'API Claude

   On tente d'abord avec le repli côté serveur (`fallbacks`) : si les
   classificateurs de sécurité déclinent la demande, l'API rejoue la
   requête sur un autre modèle sans que l'utilisateur voie l'accroc.
   C'est une fonctionnalité en bêta ; si l'en-tête est refusé, on
   relance une fois la même requête sans elle plutôt que de tomber.
   --------------------------------------------------------------------- */
async function appeler(cle, charge, avecRepli) {
  const entetes = {
    'content-type': 'application/json',
    'x-api-key': cle,
    'anthropic-version': '2023-06-01',
  };
  if (avecRepli) entetes['anthropic-beta'] = 'server-side-fallback-2026-07-01';

  return fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: entetes,
    body: JSON.stringify(avecRepli ? { ...charge, fallbacks: 'default' } : charge),
  });
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Méthode non autorisée' });
  }

  /* Cette route dépense une clé payante. Aucun en-tête CORS n'est posé,
     donc un navigateur tiers ne peut déjà pas l'appeler ; on refuse en
     plus les requêtes dont l'origine annoncée n'est pas la nôtre. Ce
     n'est pas un rempart — un script serveur n'envoie pas d'`Origin` —
     mais cela ferme le cas courant : une page ailleurs qui s'en sert.
     Voir le README : il n'y a pas de limitation de débit. */
  const origine = req.headers.origin;
  if (origine) {
    let hote = '';
    try { hote = new URL(origine).host; } catch { hote = 'x'; }
    if (hote !== req.headers.host) {
      return res.status(403).json({ ok: false, error: 'Origine refusée', code: 'ORIGINE' });
    }
  }

  const cle = process.env.ANTHROPIC_API_KEY;
  if (!cle) {
    // Pas de clé : la page a un mode dégradé, on le lui dit clairement.
    return res.status(503).json({ ok: false, error: 'Liaison non configurée', code: 'SANS-CLE' });
  }

  const c = corps(req);
  const ctx = c.contexte && typeof c.contexte === 'object' ? c.contexte : {};

  /* On ne renvoie à l'API que les derniers tours : la conversation d'un
     masque est un fil court, pas des archives. */
  const historique = Array.isArray(c.messages) ? c.messages.slice(-MAX.tours) : [];
  const messages = historique
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && String(m.content || '').trim())
    .map(m => ({ role: m.role, content: coupe(m.content, MAX.message) }));

  if (!messages.length || messages[messages.length - 1].role !== 'user') {
    return res.status(400).json({ ok: false, error: 'Aucune question' });
  }

  const charge = {
    model: MODELE,
    max_tokens: MAX_JETONS,
    // Effort bas : la latence compte plus que la profondeur quand la
    // réponse tient en une phrase et part directement en synthèse vocale.
    output_config: { effort: 'low' },
    system: consigne({
      heure: coupe(ctx.heure, MAX.contexte),
      date:  coupe(ctx.date,  MAX.contexte),
      ville: coupe(ctx.ville, MAX.contexte),
      meteo: coupe(ctx.meteo, MAX.contexte),
      tenue: coupe(ctx.tenue, MAX.contexte),
    }),
    messages,
  };

  try {
    let rep = await appeler(cle, charge, true);

    // L'en-tête bêta du repli peut être refusé selon le compte : on
    // réessaie une fois sans lui. Une conversation vaut mieux qu'un 400.
    if (rep.status === 400) {
      console.warn('Repli serveur refusé, nouvelle tentative sans');
      rep = await appeler(cle, charge, false);
    }

    if (!rep.ok) {
      // Le détail reste dans les journaux Vercel : il peut contenir des
      // informations sur la configuration du compte. Le masque ne reçoit
      // qu'un code, assez précis pour être rapporté, assez vague pour ne
      // rien révéler.
      console.error('Anthropic', rep.status, await rep.text().catch(() => ''));
      const code = rep.status === 401 || rep.status === 403 ? 'CLE-REFUSEE'
                 : rep.status === 429 ? 'QUOTA'
                 : rep.status >= 500 ? 'SERVICE'
                 : 'API-' + rep.status;
      return res.status(502).json({ ok: false, error: 'Liaison interrompue', code });
    }

    const data = await rep.json();

    // Un refus des classificateurs revient en HTTP 200 avec un contenu
    // vide : on vérifie le motif d'arrêt avant de lire le contenu.
    if (data.stop_reason === 'refusal') {
      return res.status(200).json({
        ok: true,
        texte: "Je ne peux pas traiter cette demande. On passe à autre chose ?",
        refus: true,
      });
    }

    const texte = (data.content || [])
      .filter(b => b && b.type === 'text')
      .map(b => b.text)
      .join('')
      .trim();

    if (!texte) {
      return res.status(502).json({ ok: false, error: 'Réponse vide', code: 'VIDE' });
    }

    return res.status(200).json({ ok: true, texte, modele: data.model || MODELE });
  } catch (err) {
    console.error('Anthropic injoignable', err);
    return res.status(502).json({ ok: false, error: 'Liaison interrompue', code: 'INJOIGNABLE' });
  }
};
