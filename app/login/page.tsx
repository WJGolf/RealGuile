"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const THAI_ERRORS: [string, string][] = [
  ["Invalid login credentials", "อีเมลหรือรหัสผ่านไม่ถูกต้อง"],
  ["User already registered", "อีเมลนี้สมัครสมาชิกแล้ว ลองเข้าสู่ระบบแทน"],
  ["Password should be at least", "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"],
  ["Email not confirmed", "อีเมลนี้ยังไม่ได้ยืนยัน ให้ปิด Confirm email ใน Supabase หรือยืนยันผู้ใช้นี้ในหน้า Authentication → Users"],
  ["Unable to validate email", "รูปแบบอีเมลไม่ถูกต้อง"],
  ["rate limit", "ลองหลายครั้งเกินไป กรุณารอสักครู่แล้วลองใหม่"],
];
const toThai = (m: string) => THAI_ERRORS.find(([k]) => m.toLowerCase().includes(k.toLowerCase()))?.[1] ?? m;

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setMsg("");
    const supabase = createClient();
    if (mode === "up") {
      const { data, error } = await supabase.auth.signUp({ email, password });
      setBusy(false);
      if (error) return setMsg(toThai(error.message));
      // With "Confirm email" turned off in Supabase, signUp returns a session and the user is signed in right away.
      if (data.session) { router.push("/"); router.refresh(); return; }
      return setMsg("สมัครสมาชิกแล้ว แต่ Supabase ยังเปิด Confirm email อยู่ ให้ปิดในหน้า Authentication → Sign In / Providers → Email แล้วลองใหม่");
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return setMsg(toThai(error.message));
    router.push("/"); router.refresh();
  }
  return (
    <form onSubmit={submit} className="panel mx-auto mt-10 max-w-sm space-y-3 p-6">
      <h1 className="font-display text-xl font-bold">{mode === "in" ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}</h1>
      <input className="input" type="email" required placeholder="อีเมล" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <div className="flex gap-2">
        <input className="input" type={show ? "text" : "password"} required minLength={6} placeholder="รหัสผ่าน (อย่างน้อย 6 ตัว)"
          autoComplete={mode === "in" ? "current-password" : "new-password"} value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="button" className="btn-ghost shrink-0" onClick={() => setShow(!show)} aria-pressed={show}>{show ? "ซ่อน" : "ดู"}</button>
      </div>
      {msg && <p className="text-sm text-gold" role="alert">{msg}</p>}
      <button className="btn w-full" disabled={busy}>{busy ? "กำลังดำเนินการ…" : mode === "in" ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}</button>
      <button type="button" className="text-sm text-mute underline" onClick={() => { setMode(mode === "in" ? "up" : "in"); setMsg(""); }}>
        {mode === "in" ? "ยังไม่มีบัญชี? สมัครสมาชิก" : "มีบัญชีแล้ว? เข้าสู่ระบบ"}
      </button>
    </form>
  );
}
