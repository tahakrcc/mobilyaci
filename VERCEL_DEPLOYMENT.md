# WoodenUniverse — Vercel kurulumu

Bu sürüm standart Next.js uygulamasıdır. Siparişler ve yönetilebilir içerikler Neon PostgreSQL'de, yüklenen görseller Vercel Blob'da tutulur.

## 1. Projeyi içe aktarın

Depoyu GitHub, GitLab veya Bitbucket'a gönderin ve Vercel'de **Add New → Project** ile içe aktarın. Framework otomatik olarak **Next.js** seçilir. Build komutu `npm run build` olmalıdır; Output Directory alanını boş bırakın.

## 2. Veritabanını bağlayın

Vercel projesinde **Storage → Create Database** bölümünden Neon PostgreSQL ekleyin. Entegrasyon `DATABASE_URL` değişkenini projeye eklemelidir.

İlk kurulumda veritabanı tablolarını oluşturun:

```bash
npm install
vercel link
vercel env pull .env.local
npm run db:migrate
```

## 3. Görsel depolamayı bağlayın

Vercel projesinde **Storage → Blob** ekleyin. `BLOB_READ_WRITE_TOKEN` otomatik eklenir.

## 4. Yönetici hesabını tanımlayın

Project Settings → Environment Variables altında aşağıdaki değerleri Production, Preview ve Development için ekleyin:

- `ADMIN_EMAIL`: yönetici e-posta adresi
- `ADMIN_PASSWORD`: uzun ve benzersiz bir parola
- `ADMIN_SESSION_SECRET`: en az 32 karakterlik rastgele bir değer
- `ADMIN_NAME`: panelde görünecek ad

Rastgele oturum anahtarı üretmek için:

```bash
openssl rand -base64 48
```

Yönetim paneli `/admin`, giriş ekranı `/admin/login` adresindedir.

## 5. Sipariş e-postalarını açın

Resend kullanıyorsanız şu değişkenleri ekleyin:

- `RESEND_API_KEY`
- `ORDER_NOTIFICATION_EMAIL`
- `ORDER_FROM_EMAIL` (ör. `WoodenUniverse <orders@alanadiniz.com>`)

Alan adı Resend'de doğrulanana kadar test gönderimleri için sağlayıcının izin verdiği test gönderen adresini kullanın.

## 6. Yayınlayın

Değişkenleri ve Storage bağlantılarını ekledikten sonra Vercel'de **Redeploy** çalıştırın. Ardından aşağıdaki akışları kontrol edin:

1. `/tr` ve `/en`
2. `/tr/design` üzerinden sipariş oluşturma
3. `/tr/track` üzerinden sipariş takibi
4. `/admin/login` üzerinden yönetici girişi
5. Admin panelinde metin düzenleme, sipariş durumu değiştirme ve görsel yükleme

Not: Eski Cloudflare D1/R2 verileri otomatik taşınmaz. Mevcut üretim verileri varsa ayrıca PostgreSQL/Blob taşıma işlemi gerekir.
