import { AdminNavbar } from "@/components/admin/admin-navbar";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  console.log(session);
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
