/* =========================================================
   MJ AGENCY — Météo réelle pour l'interface du masque

   Fonction serverless Vercel. Elle interroge Open-Meteo, qui ne
   demande aucune clé, et BigDataCloud pour retrouver le nom de la
   commune. Aucun secret n'est en jeu ici : la route existe surtout
   pour deux raisons.

   1. Elle sait où se trouve le visiteur même s'il refuse la
      géolocalisation du navigateur : Vercel pose la latitude, la
      longitude et la ville de l'adresse IP dans les en-têtes de la
      requête. C'est approximatif — à la ville près — mais c'est réel.
   2. Elle normalise les réponses des deux services en un seul objet,
      pour que la page n'ait qu'un format à lire.

   Appel : GET /api/meteo            → position déduite de l'IP
           GET /api/meteo?lat=&lon=  → position exacte du navigateur
   ========================================================= */

/* Codes météo de l'OMM, traduits. La deuxième valeur est un pictogramme
   dessiné côté page : on transmet une clé, pas une image. */
const CIEL = {
  0:  ['Ciel dégagé',            'soleil'],
  1:  ['Plutôt dégagé',          'soleil'],
  2:  ['Partiellement nuageux',  'nuage-soleil'],
  3:  ['Couvert',                'nuage'],
  45: ['Brouillard',             'brume'],
  48: ['Brouillard givrant',     'brume'],
  51: ['Bruine légère',          'pluie'],
  53: ['Bruine',                 'pluie'],
  55: ['Bruine dense',           'pluie'],
  56: ['Bruine verglaçante',     'pluie'],
  57: ['Bruine verglaçante',     'pluie'],
  61: ['Pluie faible',           'pluie'],
  63: ['Pluie',                  'pluie'],
  65: ['Forte pluie',            'pluie'],
  66: ['Pluie verglaçante',      'pluie'],
  67: ['Pluie verglaçante',      'pluie'],
  71: ['Neige faible',           'neige'],
  73: ['Neige',                  'neige'],
  75: ['Fortes chutes de neige', 'neige'],
  77: ['Grésil',                 'neige'],
  80: ['Averses',                'pluie'],
  81: ['Averses',                'pluie'],
  82: ['Averses violentes',      'pluie'],
  85: ['Averses de neige',       'neige'],
  86: ['Averses de neige',       'neige'],
  95: ['Orage',                  'orage'],
  96: ['Orage et grêle',         'orage'],
  99: ['Orage et grêle',         'orage'],
};

/* Sète, siège de l'agence : dernier recours si l'IP ne dit rien. */
const REPLI = { lat: 43.4053, lon: 3.6934, ville: 'Sète' };

const nombre = v => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

/* Une valeur venue d'un en-tête HTTP peut être encodée (Sète → S%C3%A8te). */
function entete(req, nom) {
  const v = req.headers[nom];
  if (!v) return '';
  try { return decodeURIComponent(String(v)); } catch { return String(v); }
}

/* Nom de commune à partir des coordonnées. Facultatif : si le service
   ne répond pas, on garde ce que Vercel avait deviné. */
async function commune(lat, lon) {
  const url = 'https://api.bigdatacloud.net/data/reverse-geocode-client'
            + `?latitude=${lat}&longitude=${lon}&localityLanguage=fr`;
  try {
    const rep = await fetch(url, { signal: AbortSignal.timeout(3500) });
    if (!rep.ok) return null;
    const d = await rep.json();
    return {
      ville: d.city || d.locality || d.principalSubdivision || null,
      pays: d.countryName || null,
    };
  } catch {
    return null;
  }
}

module.exports = async (req, res) => {
  // Dix minutes de cache en périphérie : la météo ne change pas à la
  // seconde, et le masque interroge la route à chaque ouverture.
  res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=1800');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'Méthode non autorisée' });
  }

  const q = req.query || {};

  // Priorité au GPS du navigateur, repli sur l'IP, puis sur Sète.
  let lat = nombre(q.lat);
  let lon = nombre(q.lon);
  let precise = lat !== null && lon !== null;
  let ville = '';
  let pays = '';

  if (!precise) {
    lat = nombre(entete(req, 'x-vercel-ip-latitude'));
    lon = nombre(entete(req, 'x-vercel-ip-longitude'));
    ville = entete(req, 'x-vercel-ip-city');
    pays = entete(req, 'x-vercel-ip-country');
  }

  let source = precise ? 'gps' : (lat !== null ? 'ip' : 'defaut');
  if (lat === null || lon === null) {
    lat = REPLI.lat; lon = REPLI.lon; ville = REPLI.ville;
  }

  // Bornes : une coordonnée hors du globe ne sert personne.
  lat = Math.max(-90, Math.min(90, lat));
  lon = Math.max(-180, Math.min(180, lon));

  const url = 'https://api.open-meteo.com/v1/forecast'
    + `?latitude=${lat.toFixed(4)}&longitude=${lon.toFixed(4)}`
    + '&current=temperature_2m,apparent_temperature,relative_humidity_2m,'
    + 'precipitation,weather_code,wind_speed_10m,wind_direction_10m,is_day'
    + '&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset'
    + '&timezone=auto&forecast_days=1';

  try {
    // Les deux appels sont indépendants : on les lance ensemble, et le
    // nom de commune n'a pas le droit de faire échouer la météo.
    const [repMeteo, lieu] = await Promise.all([
      fetch(url, { signal: AbortSignal.timeout(6000) }),
      commune(lat, lon).catch(() => null),
    ]);

    if (!repMeteo.ok) {
      console.error('Open-Meteo', repMeteo.status);
      return res.status(502).json({ ok: false, error: 'Météo indisponible', code: 'METEO-' + repMeteo.status });
    }

    const d = await repMeteo.json();
    const cur = d.current || {};
    const jour = d.daily || {};
    const code = Number(cur.weather_code);
    const [libelle, icone] = CIEL[code] || ['Conditions inconnues', 'nuage'];

    if (lieu && lieu.ville) { ville = lieu.ville; pays = lieu.pays || pays; }

    return res.status(200).json({
      ok: true,
      source,
      ville: ville || 'Position inconnue',
      pays: pays || '',
      temp: Math.round(cur.temperature_2m),
      ressenti: Math.round(cur.apparent_temperature),
      humidite: Math.round(cur.relative_humidity_2m),
      pluie: cur.precipitation,
      vent: Math.round(cur.wind_speed_10m),
      ventDir: Math.round(cur.wind_direction_10m),
      jour: cur.is_day === 1,
      code,
      libelle,
      icone,
      max: Array.isArray(jour.temperature_2m_max) ? Math.round(jour.temperature_2m_max[0]) : null,
      min: Array.isArray(jour.temperature_2m_min) ? Math.round(jour.temperature_2m_min[0]) : null,
      lever: Array.isArray(jour.sunrise) ? jour.sunrise[0] : null,
      coucher: Array.isArray(jour.sunset) ? jour.sunset[0] : null,
      fuseau: d.timezone || null,
    });
  } catch (err) {
    console.error('Météo injoignable', err);
    return res.status(502).json({ ok: false, error: 'Météo indisponible', code: 'INJOIGNABLE' });
  }
};
