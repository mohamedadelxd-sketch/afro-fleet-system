 "use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { supabase } from "../lib/supabase";
import type { Session } from "@supabase/supabase-js";

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function signIn(e: FormEvent) {
    e.preventDefault();
    if (!supabase) return setMessage("بيانات ربط Supabase غير مكتملة في إعدادات Vercel.");
    setBusy(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    setMessage(error ? `تعذر تسجيل الدخول: ${error.message}` : "تم تسجيل الدخول.");
  }

  async function uploadPhoto(e: FormEvent) {
    e.preventDefault();
    if (!supabase || !session?.user) return;
    if (!file) return setMessage("اختار صورة العداد أولاً.");
    if (!file.type.startsWith("image/")) return setMessage("الملف لازم يكون صورة.");
    if (file.size > 8 * 1024 * 1024) return setMessage("حجم الصورة أكبر من 8 ميجابايت.");
    setBusy(true);
    setMessage("");
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${session.user.id}/${Date.now()}-${safeName}`;
    const { error } = await supabase.storage.from("Odometer-photos").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type
    });
    setBusy(false);
    setMessage(error ? `فشل رفع الصورة: ${error.message}` : "تم رفع الصورة بنجاح. ستظهر للإدارة بعد ربطها بسجل قراءة العداد.");
    setFile(null);
    const input = document.getElementById("Odometer-photo") as HTMLInputElement | null;
    if (input) input.value = "";
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setMessage("تم تسجيل الخروج.");
  }

  if (!supabase) {
    return <main className="shell"><section className="panel"><h1>Afro Egypt Fleet</h1><p>إعدادات الاتصال بـ Supabase غير موجودة. أضف متغيرات البيئة في Vercel ثم أعد النشر.</p></section></main>;
  }

  return (
    <main className="shell">
      <header className="top">
        <div><p className="eyebrow">AFRO EGYPT</p><h1>نظام متابعة عدادات السيارات</h1><p className="muted">إدارة قراءات الكيلومترات وصور العدادات</p></div>
        <span className="tag">نسخة تجريبية أولى</span>
      </header>

      {!session ? (
        <section className="panel narrow">
          <h2>تسجيل الدخول</h2>
          <p className="muted">استخدم حساب السائق أو حساب الإدارة الذي تم إنشاؤه في Supabase.</p>
          <form onSubmit={signIn} className="form">
            <label>البريد الإلكتروني<input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="name@example.com" /></label>
            <label>كلمة المرور<input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="كلمة المرور" /></label>
            <button disabled={busy}>{busy ? "جارٍ التنفيذ..." : "دخول"}</button>
          </form>
        </section>
      ) : (
        <section className="panel">
          <div className="userline"><div><h2>أهلاً بك</h2><p className="muted">{session.user.email}</p></div><button className="secondary" onClick={signOut}>تسجيل خروج</button></div>
          <div className="notice"><strong>رفع صورة العداد</strong><p>التقط صورة واضحة يظهر فيها رقم الكيلومترات بالكامل، ثم ارفعها هنا.</p></div>
          <form onSubmit={uploadPhoto} className="form">
            <label>صورة عداد السيارة<input id="odometer-photo" type="file" accept="image/*" capture="environment" onChange={e => setFile(e.target.files?.[0] ?? null)} required /></label>
            {file && <p className="muted">الملف المختار: {file.name}</p>}
            <button disabled={busy}>{busy ? "جارٍ رفع الصورة..." : "رفع صورة العداد"}</button>
          </form>
          <p className="small muted">ملاحظة: هذه النسخة تختبر تسجيل الدخول ورفع الصور فقط. قراءة الأرقام آليًا واعتماد الكيلومترات والتقارير ستُضاف بعد اختبار الربط والصلاحيات.</p>
        </section>
      )}
      {message && <div className="message" role="status">{message}</div>}
      <footer>Afro Egypt Fleet · نظام داخلي قيد التطوير</footer>
    </main>
  );
}
