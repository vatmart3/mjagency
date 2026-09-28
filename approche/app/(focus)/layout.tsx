import { AuthGate } from "@/components/AuthGate";

/** Écrans plein écran (mode Appel) : pas de dock, tout l'espace pour le script. */
export default function FocusLayout({ children }: { children: React.ReactNode }) {
  return <AuthGate>{children}</AuthGate>;
}
