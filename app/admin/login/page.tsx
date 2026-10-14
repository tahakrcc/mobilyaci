export const dynamic = "force-dynamic";

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <div className="brand admin-login-brand"><span className="brand-mark">WU</span><span className="brand-word">WOODEN<span>UNIVERSE</span></span></div>
        <p className="eyebrow">YÖNETİM PANELİ</p>
        <h1>Atölye yönetimine giriş</h1>
        <p>Siparişleri, site metinlerini ve görselleri yönetin.</p>
        {error && <div className="admin-login-error">E-posta veya parola hatalı.</div>}
        <form action="/api/admin/login" method="post">
          <label><span>E-posta</span><input name="email" type="email" autoComplete="username" required /></label>
          <label><span>Parola</span><input name="password" type="password" autoComplete="current-password" required /></label>
          <button className="button gold" type="submit">Giriş yap</button>
        </form>
        <Link href="/tr">← Siteye dön</Link>
      </section>
    </main>
  );
}
import Link from "next/link";

