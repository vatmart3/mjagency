// Compression côté navigateur, avant tout envoi : côté long ramené à ~1500 px,
// JPEG ~0,85. Une photo de téléphone de 4 Mo tombe autour de 250 Ko — l'envoi
// est rapide, et l'analyse coûte moins de jetons.

const COTE_LONG = 1500;
const QUALITE = 0.85;
const POIDS_CIBLE = 600 * 1024; // au-delà, on redescend la qualité
const COTE_MINIATURE = 360;

export type PhotoPreparee = {
  id: string;
  blob: Blob; // JPEG compressé, celui qui part à l'analyse
  miniature: Blob; // petit JPEG pour l'historique
  url: string; // object URL pour l'aperçu
  largeur: number;
  hauteur: number;
};

export class ErreurImage extends Error {}

async function decoder(fichier: Blob): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === "function") {
    try {
      // « from-image » applique l'orientation EXIF des photos de téléphone.
      return await createImageBitmap(fichier, { imageOrientation: "from-image" });
    } catch {
      // certains navigateurs refusent l'option : on retente via <img>
    }
  }
  const url = URL.createObjectURL(fichier);
  try {
    const img = new Image();
    img.decoding = "async";
    img.src = url;
    await img.decode();
    return img;
  } catch {
    throw new ErreurImage(
      fichier.type.includes("heic") || fichier.type.includes("heif")
        ? "Format HEIC non lu par ce navigateur. Sur iPhone, choisis « Le plus compatible » dans Réglages › Appareil photo › Formats."
        : "Cette image n'a pas pu être lue.",
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}

function dessiner(source: CanvasImageSource, l: number, h: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = l;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new ErreurImage("Le navigateur ne peut pas traiter l'image.");
  ctx.fillStyle = "#fff"; // les PNG transparents deviennent blancs, pas noirs
  ctx.fillRect(0, 0, l, h);
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source, 0, 0, l, h);
  return canvas;
}

function versBlob(canvas: HTMLCanvasElement, qualite: number): Promise<Blob> {
  return new Promise((ok, ko) =>
    canvas.toBlob((b) => (b ? ok(b) : ko(new ErreurImage("Compression impossible."))), "image/jpeg", qualite),
  );
}

function dimensions(l: number, h: number, coteMax: number) {
  const r = Math.min(1, coteMax / Math.max(l, h));
  return { l: Math.round(l * r), h: Math.round(h * r) };
}

export async function preparerPhoto(fichier: Blob): Promise<PhotoPreparee> {
  const source = await decoder(fichier);
  const l0 = "naturalWidth" in source ? source.naturalWidth : source.width;
  const h0 = "naturalHeight" in source ? source.naturalHeight : source.height;
  if (!l0 || !h0) throw new ErreurImage("Cette image est vide.");

  const { l, h } = dimensions(l0, h0, COTE_LONG);
  const canvas = dessiner(source, l, h);
  let qualite = QUALITE;
  let blob = await versBlob(canvas, qualite);
  while (blob.size > POIDS_CIBLE && qualite > 0.6) {
    qualite -= 0.08;
    blob = await versBlob(canvas, qualite);
  }

  const m = dimensions(l0, h0, COTE_MINIATURE);
  const miniature = await versBlob(dessiner(source, m.l, m.h), 0.78);
  if ("close" in source) source.close();

  return { id: crypto.randomUUID(), blob, miniature, url: URL.createObjectURL(blob), largeur: l, hauteur: h };
}
