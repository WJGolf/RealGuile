import Link from "next/link";
import { PAGE_SIZE } from "@/lib/queries/characters";

export default function Pagination({ page, total, params }: { page: number; total: number; params: Record<string, string | undefined> }) {
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const href = (n: number) => {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v && k !== "page" && sp.set(k, v));
    sp.set("page", String(n));
    return `/characters?${sp.toString()}`;
  };
  return (
    <nav className="mt-4 flex items-center justify-between text-sm text-mute" aria-label="แบ่งหน้า">
      <span>{total.toLocaleString()} ตัวละคร</span>
      <div className="flex items-center gap-2">
        {page > 1 ? <Link className="btn-ghost" href={href(page - 1)}>ก่อนหน้า</Link> : <span className="btn-ghost opacity-40">ก่อนหน้า</span>}
        <span>หน้า {page} จาก {pages}</span>
        {page < pages ? <Link className="btn-ghost" href={href(page + 1)}>ถัดไป</Link> : <span className="btn-ghost opacity-40">ถัดไป</span>}
      </div>
    </nav>
  );
}
