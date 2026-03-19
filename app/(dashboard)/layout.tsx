import { Sidebar } from "@/components/sidebar";
import { SettingsProvider } from "@/components/settings-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SettingsProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </SettingsProvider>
  );
}
