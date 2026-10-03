import Link from "next/link";
import { redirect } from "next/navigation";
import { getUserAndProfile } from "@/lib/supabase/server";
import { ADMIN_LINKS } from "@/lib/admin/resources";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, profile } = await getUserAndProfile();
  if (!user) redirect("/login");
  if (!profile || !["admin", "owner"].includes(profile.role)) {
    return <p className="panel p-6">หน้านี้สำหรับแอดมินเท่านั้น ให้เจ้าของระบบตั้งค่า role ของคุณเป็น admin ในตาราง profiles</p>;
  }
  return (
    <div>
      <nav className="mb-4 flex gap-1 overflow-x-auto" aria-label="เมนูแอดมิน">
        <Link href="/admin" className="badge shrink-0">แดชบอร์ด</Link>
        {ADMIN_LINKS.map(([k, l]) => <Link key={k} href={`/admin/${k}`} className="badge shrink-0 hover:border-accent">{l}</Link>)}
      </nav>
      {children}
    </div>
  );
}
