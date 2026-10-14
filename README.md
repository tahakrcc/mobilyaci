# WoodenUniverse

Siyah-gold görsel kimliğe sahip, Türkçe ve İngilizce çalışan özel ahşap/epoksi mobilya sitesi.

## Özellikler

- Animasyonlu ürün vitrini ve ağaç deneyimi
- Kişiye özel sipariş talebi
- Sipariş kodu ve e-posta ile üretim takibi
- Metin, çeviri, sipariş ve medya yönetimi için admin paneli
- Neon PostgreSQL veritabanı
- Vercel Blob görsel depolama
- Resend ile isteğe bağlı sipariş bildirimi

## Yerel geliştirme

```bash
cp .env.example .env.local
npm install
npm run db:migrate
npm run dev
```

Uygulama varsayılan olarak `http://localhost:3000` adresinde açılır.

## Kontroller

```bash
npm run build
npm run lint
```

Vercel kurulumu ve gerekli ortam değişkenleri için [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) dosyasını izleyin.
