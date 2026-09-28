import { Dock } from "@/components/Dock";
import { AuthGate } from "@/components/AuthGate";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate>
      <div className="page mx-auto w-full max-w-[1240px] px-4 md:px-8">{children}</div>
      <Dock />
    </AuthGate>
  );
}
