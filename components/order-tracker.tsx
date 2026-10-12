"use client";

import { Check, LoaderCircle, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import type { Locale } from "@/lib/catalog";
import { orderStatuses } from "@/lib/catalog";

type Result = { order: { orderNumber: string; status: string; productType: string; woodType: string; epoxy: string; dimensions: string; estimatedDelivery: string | null; createdAt: string }; events: { id: string; status: string; publicNote: string; mediaUrl: string | null; createdAt: string }[] };

export function OrderTracker({ locale }: { locale: Locale }) {
  const tr = locale === "tr";
  const params = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(params.get("order") ?? "");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  async function search() {
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderNumber, email, trackingToken: params.get("token") || undefined }) });
      const body = await response.json();
      if (!response.ok) throw new Error();
      setResult(body);
    } catch { setError(tr ? "Sipariş bulunamadı. Kod ve e-posta adresini kontrol edin." : "Request not found. Check the code and email address."); }
    finally { setLoading(false); }
  }
  const currentIndex = result ? orderStatuses.findIndex((item) => item.id === result.order.status) : -1;
  return <div className="tracker-shell">
    <div className="tracker-intro"><p className="eyebrow">{tr ? "ATÖLYEDEN CANLI DURUM" : "LIVE FROM THE WORKSHOP"}</p><h1>{tr ? "Parçanızın yolculuğunu izleyin." : "Follow your piece’s journey."}</h1><p>{tr ? "Sipariş kodunuz ve talepte kullandığınız e-posta adresiyle üretim aşamalarını, fotoğrafları ve tahmini teslim tarihini görüntüleyin." : "Use your request code and email to see production milestones, photos and estimated delivery."}</p></div>
    {!result ? <div className="track-card"><label className="field"><span>{tr ? "Sipariş kodu" : "Request code"}</span><input value={orderNumber} onChange={(e) => setOrderNumber(e.target.value.toUpperCase())} placeholder="WU-2026-XXXXXXXX" /></label><label className="field"><span>E-mail</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value.toLowerCase())} /></label>{error && <p className="form-error">{error}</p>}<button className="button gold wide" onClick={search} disabled={loading}>{loading ? <LoaderCircle className="spin" /> : <Search />}{tr ? "Siparişi görüntüle" : "View request"}</button></div> : <div className="track-result"><div className="track-head"><div><small>{tr ? "SİPARİŞ" : "REQUEST"}</small><h2>{result.order.orderNumber}</h2></div><button className="text-button" onClick={() => setResult(null)}>{tr ? "Başka sipariş ara" : "Search another"}</button></div><div className="order-meta"><span>{result.order.productType}</span><span>{result.order.woodType}</span><span>{result.order.dimensions}</span>{result.order.estimatedDelivery && <span>{tr ? "Tahmini teslim" : "Estimated delivery"}: {result.order.estimatedDelivery}</span>}</div><div className="timeline">{orderStatuses.map((status, index) => { const event = result.events.find((item) => item.status === status.id); const completed = index <= currentIndex; return <div key={status.id} className={completed ? "timeline-item completed" : "timeline-item"}><i>{completed ? <Check size={15} /> : index + 1}</i><div><strong>{tr ? status.tr : status.en}</strong>{event && <><small>{new Date(event.createdAt).toLocaleDateString(tr ? "tr-TR" : "en-GB")}</small><p>{event.publicNote}</p>{event.mediaUrl && <img src={event.mediaUrl} alt="" />}</>}</div></div>; })}</div></div>}
  </div>;
}
