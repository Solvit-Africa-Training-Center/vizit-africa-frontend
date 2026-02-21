import { redirect } from "next/navigation";
import { AdminNavbar } from "@/components/admin/admin-navbar";
import { getSession } from "@/lib/auth/session";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return redirect("/login");
  }
  return (
    <div className="min-h-screen bg-muted/30">
      <AdminNavbar />
      <main>{children}</main>
    </div>
  );
}
