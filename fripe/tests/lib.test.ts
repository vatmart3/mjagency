import { test } from "node:test";
import assert from "node:assert/strict";
import { creerJeton, DUREE_SESSION_S, jetonValide, motDePasseCorrect, origineAutorisee } from "../lib/auth.ts";
import { formatPrix, toutCopier } from "../lib/format.ts";
import { messageUtilisateur, SYSTEM_PROMPT } from "../lib/prompt.ts";
import { _reinitialiserPourTests, verifierLimite } from "../lib/rate-limit.ts";
import { AnnonceSchema, InfosSchema, normaliserAnnonce, REGLAGES_DEFAUT, type Annonce } from "../lib/schema.ts";

const annonce: Annonce = {
  nom: "Sweat à capuche Nike",
  titre: "Sweat à capuche Nike gris chiné logo brodé",
  description: "Sweat à capuche Nike, coupe classique, très doux à l'intérieur.\n\n\n\nÉtat : très bon état.",
  prix: { conseille: 18.4, plancher: 22, marche_bas: 25, marche_haut: 12, justification: "Marque recherchée." },
  fiche: {
    categorie: "Hommes > Sweats et pulls > Sweats à capuche",
    marque: "Nike",
    taille: "M",
    etat: "Très bon état",
    couleurs: ["Gris"],
    matiere: "Coton",
  },
  a_verifier: [],
  confiance: "haute",
};

test("session : un jeton signé est valide, un jeton modifié ou expiré ne l'est pas", async () => {
  process.env.APP_PASSWORD = "phrase-de-test";
  delete process.env.SESSION_SECRET;
  const jeton = await creerJeton();
  assert.equal(await jetonValide(jeton), true);

  const [exp, sig] = jeton.split(".");
  assert.equal(await jetonValide(`${Number(exp) + 1}.${sig}`), false, "expiration falsifiée");
  assert.equal(await jetonValide(`${exp}.${sig.slice(0, -1)}A`), false, "signature falsifiée");
  assert.equal(await jetonValide(undefined), false);
  assert.equal(await jetonValide("n'importe quoi"), false);

  const plusTard = Date.now() + (DUREE_SESSION_S + 60) * 1000;
  assert.equal(await jetonValide(jeton, plusTard), false, "jeton expiré");

  process.env.APP_PASSWORD = "autre-phrase";
  assert.equal(await jetonValide(jeton), false, "changer le mot de passe déconnecte");
});

test("session : sans APP_PASSWORD, tout reste fermé", async () => {
  delete process.env.APP_PASSWORD;
  delete process.env.SESSION_SECRET;
  assert.equal(await motDePasseCorrect(""), false);
  assert.equal(await jetonValide("123.abc"), false);
  await assert.rejects(creerJeton());
});

test("mot de passe : comparaison exacte", async () => {
  process.env.APP_PASSWORD = "Fripe 2026 !";
  assert.equal(await motDePasseCorrect("Fripe 2026 !"), true);
  assert.equal(await motDePasseCorrect("fripe 2026 !"), false);
  assert.equal(await motDePasseCorrect(""), false);
});

test("origine : même hôte accepté, autre hôte refusé", () => {
  const req = (origin: string | null) =>
    new Request("https://fripe.example/api/analyze", {
      method: "POST",
      headers: { host: "fripe.example", ...(origin ? { origin } : {}) },
    });
  assert.equal(origineAutorisee(req("https://fripe.example")), true);
  assert.equal(origineAutorisee(req("https://malveillant.example")), false);
  assert.equal(origineAutorisee(req(null)), true);
});

test("limite de débit : fenêtre glissante", () => {
  _reinitialiserPourTests();
  const f = [{ limite: 3, dureeMs: 60_000 }];
  const t0 = 1_000_000;
  assert.equal(verifierLimite("ip", f, t0).ok, true);
  assert.equal(verifierLimite("ip", f, t0 + 1).ok, true);
  assert.equal(verifierLimite("ip", f, t0 + 2).ok, true);
  const refus = verifierLimite("ip", f, t0 + 3);
  assert.equal(refus.ok, false);
  if (!refus.ok) assert.equal(refus.reessayerDansS, 60);
  assert.equal(verifierLimite("autre-ip", f, t0 + 3).ok, true, "les IP sont séparées");
  assert.equal(verifierLimite("ip", f, t0 + 60_001).ok, true, "la fenêtre glisse");
});

test("normalisation : prix remis en ordre et arrondis, texte nettoyé", () => {
  const n = normaliserAnnonce(annonce);
  assert.equal(n.prix.conseille, 22);
  assert.equal(n.prix.plancher, 18);
  assert.equal(n.prix.marche_bas, 12);
  assert.equal(n.prix.marche_haut, 25);
  assert.ok(!n.description.includes("\n\n\n"));
  assert.equal(normaliserAnnonce({ ...annonce, prix: { ...annonce.prix, conseille: 4.3, plancher: 3.2 } }).prix.conseille, 4.5);
});

test("schéma : une annonce valide passe, un titre trop long est refusé", () => {
  assert.equal(AnnonceSchema.safeParse(annonce).success, true);
  assert.equal(AnnonceSchema.safeParse({ ...annonce, titre: "x".repeat(81) }).success, false);
  assert.equal(AnnonceSchema.safeParse({ ...annonce, fiche: { ...annonce.fiche, etat: "Comme neuf" } }).success, false);
});

test("infos : champs vides par défaut, état restreint à la liste Vinted", () => {
  assert.deepEqual(InfosSchema.parse({}), { marque: "", taille: "", defauts: "", mesures: "", precisions: "" });
  assert.equal(InfosSchema.safeParse({ etat: "Neuf" }).success, false);
  assert.equal(InfosSchema.safeParse({ etat: "Bon état", prixAchat: 49.9 }).success, true);
});

test("tout copier : les champs dans l'ordre du formulaire Vinted", () => {
  const texte = toutCopier(normaliserAnnonce(annonce));
  const ordre = ["TITRE\n", "DESCRIPTION\n", "Catégorie :", "Marque :", "Taille :", "État :", "Couleur :", "Matière :", "Prix :"];
  // Chaque champ doit apparaître après le précédent (la description peut
  // elle-même contenir « État : », d'où la recherche à partir du curseur).
  let curseur = 0;
  for (const m of ordre) {
    const p = texte.indexOf(m, curseur);
    assert.ok(p >= curseur, `« ${m.trim()} » présent et à sa place`);
    curseur = p + m.length;
  }
  assert.match(texte, /Prix : 22 € \(accepter jusqu'à 18 €\)/);
  assert.equal(formatPrix(4.5), "4,50 €");
});

test("prompt : les infos saisies et la signature sont transmises, le système est stable", () => {
  const m = messageUtilisateur({
    nbPhotos: 3,
    infos: InfosSchema.parse({ marque: "Sézane", etat: "Bon état", prixAchat: 120 }),
    reglages: { ...REGLAGES_DEFAUT, emojis: false, hashtags: false },
    consigne: "Plus court",
  });
  assert.match(m, /3 photos/);
  assert.match(m, /Marque : Sézane/);
  assert.match(m, /État : Bon état/);
  assert.match(m, /Prix d'achat d'origine : 120 €/);
  assert.match(m, /Aucun emoji/);
  assert.match(m, /Pas de hashtags/);
  assert.match(m, /Plus court/);
  assert.match(m, /Envoi rapide et soigné/);
  assert.ok(!SYSTEM_PROMPT.includes("${"), "aucune interpolation oubliée");
});
