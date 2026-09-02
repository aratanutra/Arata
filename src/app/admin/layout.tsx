import AdminSessionProvider from "@/components/admin/AdminSessionProvider";

export const metadata = {
  title: "AETERNYX™ Admin",
  description: "Content management console for AETERNYX™"
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminSessionProvider>
      <div className="min-h-screen bg-paper text-ink">{children}</div>
    </AdminSessionProvider>
  );
}
