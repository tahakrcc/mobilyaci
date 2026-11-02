"use client";

import { FormEvent, useState } from "react";
import { LoaderCircle, Save } from "lucide-react";

export function AdminPasswordSettings() {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = new FormData(form);
    const currentPassword = String(fields.get("currentPassword") ?? "");
    const newPassword = String(fields.get("newPassword") ?? "");
    const confirmation = String(fields.get("confirmation") ?? "");
    if (newPassword !== confirmation) { setMessage("Yeni şifreler eşleşmiyor."); return; }

    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmation }),
      });
      const result = (await response.json()) as { error?: string };
      if (response.ok) {
        form.reset();
        setMessage("Şifreniz değiştirildi. Diğer açık oturumlar geçersiz kılındı.");
      } else if (response.status === 401) {
        setMessage("Oturumunuz sona erdi. Yeniden giriş yapın.");
      } else {
        setMessage({
          "invalid-current-password": "Mevcut şifre yanlış veya şifre başka bir oturumda değiştirildi.",
          "invalid-password": "Yeni şifre 12–128 karakter olmalı.",
          "confirmation-mismatch": "Yeni şifreler eşleşmiyor.",
          "same-password": "Yeni şifre mevcut şifreden farklı olmalı.",
        }[result.error ?? ""] ?? "Şifre değiştirilemedi. Biraz sonra tekrar deneyin.");
      }
    } catch {
      setMessage("Bağlantı kurulamadı. Biraz sonra tekrar deneyin.");
    } finally {
      setSaving(false);
    }
  }

  return <section className="admin-card admin-password-settings">
    <h2>Şifre değiştir</h2>
    <p>Önce mevcut şifrenizi girin. Yeni şifreniz en az 12 karakter olmalı; değişiklikten sonra diğer oturumlar kapanır.</p>
    <form onSubmit={submit}>
      <label className="field"><span>Mevcut şifre</span><input type="password" name="currentPassword" autoComplete="current-password" maxLength={128} required /></label>
      <label className="field"><span>Yeni şifre</span><input type="password" name="newPassword" autoComplete="new-password" minLength={12} maxLength={128} required /></label>
      <label className="field"><span>Yeni şifreyi tekrar girin</span><input type="password" name="confirmation" autoComplete="new-password" minLength={12} maxLength={128} required /></label>
      <button className="button gold" disabled={saving}>{saving ? <LoaderCircle className="spin" /> : <Save />}Şifreyi değiştir</button>
    </form>
    {message && <p className="admin-notice" role="status" aria-live="polite">{message}</p>}
  </section>;
}
