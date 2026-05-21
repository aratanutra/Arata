import AdminSessionProvider from "@/components/admin/AdminSessionProvider";

export const metadata = {
  title: "Aeternyx™ Admin",
  description: "Content management console for Aeternyx™"
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminSessionProvider>
      <div className="min-h-screen bg-obsidian text-text-primary">{children}</div>
    </AdminSessionProvider>
  );
}
