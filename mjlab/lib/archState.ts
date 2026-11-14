/* État partagé, mutable, lu à chaque image par les scènes 3D.
   Écrit par ScrollTrigger et le pointeur — jamais de rendu React. */
export const archState = {
  pointer: { x: 0, y: 0 },
  /** Section activités : 0 → 1 sur toute la durée du pin */
  activities: { progress: 0, active: 0 },
  /** CTA final : 0 = arche ouverte, 1 = anneau fermé */
  ring: { progress: 0 },
};

if (typeof window !== "undefined") {
  window.addEventListener(
    "pointermove",
    (e) => {
      archState.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      archState.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    },
    { passive: true }
  );
}
