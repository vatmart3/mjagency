// Copie robuste : l'API Clipboard quand elle est là, sinon l'ancien
// execCommand qui marche encore sur les vieux Safari iOS.
export async function copier(texte: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(texte);
      vibrer();
      return true;
    }
  } catch {
    // on tente le repli
  }
  const zone = document.createElement("textarea");
  zone.value = texte;
  zone.setAttribute("readonly", "");
  zone.style.cssText = "position:fixed;top:0;left:0;opacity:0;font-size:16px";
  document.body.appendChild(zone);
  zone.select();
  zone.setSelectionRange(0, texte.length);
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  zone.remove();
  if (ok) vibrer();
  return ok;
}

function vibrer() {
  try {
    navigator.vibrate?.(12);
  } catch {
    // pas de vibreur : rien à faire
  }
}
