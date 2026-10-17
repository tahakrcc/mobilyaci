# Wooden Universe Uygulama Planı

## Hedef

Wooden Universe sitesini özel üretim ahşap/epoksi mobilya, sandalye ve masa-sandalye setlerini tek marka altında sunan; ödeme almadan teklif talebi oluşturan, sipariş takibi ve yönetim paneli bulunan iki dilli bir platforma dönüştürmek.

## 1. Marka ve katalog temeli — tamamlandı

- Lara Duru kaynak kataloğu Wooden Universe koleksiyon yapısına dönüştürüldü.
- 33 sandalye ve bar sandalyesi modeli tanımlandı.
- 13 kafe/restoran seti ve 4 büyük yemek seti tanımlandı.
- Kayın, çam, ceviz, meşe, kestane, dişbudak, iroko, sapelli ve sipo eklendi.
- Gerçek atölye ve ürün fotoğrafları ana sayfa ve mobilya koleksiyonuna bağlandı.
- Öncelikli kategoriler TV ünitesi, konsol ve kahve köşesi olarak işlendi.

## 2. Site mimarisi ve sayfalar — tamamlandı

- Mobilya merkezi ve sekiz kategori sayfası oluşturuldu.
- Sandalyeler liste ve model detay sayfaları oluşturuldu.
- Setler liste ve set detay sayfaları oluşturuldu.
- Üst menü ve mobil hamburger yeni sayfalara bağlandı.
- Ana sayfaya öncelikli mobilyalar bölümü eklendi.
- Siyah-gold tema, Blur Highlight ve 3D Text Reveal davranışları korundu.

## 3. Teklif oluşturucu — ilk sürüm tamamlandı

- Ürün seçenekleri TV ünitesi, konsol, kahve köşesi, masa, sehpa, çalışma masası, sandalye, bar sandalyesi, set, kitaplık ve bar ünitesi olarak genişletildi.
- Sandalye ve set akışında döşeme, model ve adet alanları gösteriliyor.
- Ödeme alınmadığı ve talebin teklif niteliğinde olduğu açıkça belirtiliyor.
- Mevcut sipariş kodu, e-posta bildirimi ve takip akışı korunuyor.

## 4. Yönetim paneli — katalog yönetimi tamamlandı

- Yeni mobilya, sandalye ve set ana sayfa metinleri TR/EN düzenleme alanlarına eklendi.
- Sandalye ve set kapak görselleri panelden değiştirilebilir hale getirildi.
- Mobilya, sandalye ve set ekleme, düzenleme, silme, pasife alma ve sıralama ekranı tamamlandı.
- Kapak görseli ve çoklu galeri görselleri katalog kayıtlarına bağlandı.
- Paneldeki değişiklikler veritabanında saklanıyor ve ana sayfa, koleksiyon ve detay sayfalarına yansıyor.
- Siparişlerde durum, müşteriye görünen açıklama, dahili not, tahmini teslim, teklif tutarı ve üretim fotoğrafı yönetimi eklendi.
- Medya kütüphanesi yüklenen görselleri listeliyor ve katalogda kullanılmak üzere adreslerini kopyalıyor.
- Sonraki adım: görsel odak noktası, alternatif metin ve mobil kırpma ayarları.

## 5. Veri tabanı ve dosya depolama — doğrulama bekliyor

- Yönetim paneline Neon tablo sorgusu, Vercel Blob, e-posta ve yönetici güvenliği durum göstergeleri eklendi.
- Neon şemasının üretim ortamında eksiksiz çalıştığı yönetici oturumundaki sistem durumu üzerinden doğrulanacak.
- Vercel Blob bağlantısı ve medya yükleme akışı yönetici oturumuyla gerçek dosya kullanılarak test edilecek.
- Katalog yönetim API uçları ve veritabanında JSON katalog kaydı tamamlandı; ayrı katalog tablolarına geçiş büyüme ihtiyacına göre değerlendirilecek.
- Yeni siparişte yönetici ve müşteriye, durum değişikliğinde müşteriye e-posta gönderme akışı tamamlandı.
- Resend gönderimi gerçek alıcıyla uçtan uca doğrulanacak.

## 6. Katalog yeniden markalama — sıradaki tasarım işi

- PDF içindeki eski marka adı ve iletişim bilgileri Wooden Universe olarak değiştirilecek.
- Kapak, bölüm başlıkları ve son iletişim sayfası siyah-gold marka sistemiyle yeniden tasarlanacak.
- Web için ayrı optimize ürün görselleri çıkarılacak.
- Yeni PDF indirilebilir katalog olarak siteye eklenecek.

## 7. Kalite ve yayın

- 390 px mobil ve 1280 px masaüstü temel kontrolleri tamamlandı; yatay taşma bulunmadı.
- Üretim derlemesi ve TypeScript kontrolü başarılı.
- Lint kontrolünde hata yok; mevcut görsel etiketleri için performans uyarıları bulunuyor.
- Katalog yönetimi ve üretim servisleri tamamlandıktan sonra sipariş oluşturma, admin güncelleme, e-posta ve takip uçtan uca tekrar test edilecek.
- Onaylanan sürüm GitHub ve Vercel üretim ortamına gönderilecek.

## Açık kalan işler — 17 Ekim 2026 denetimi

### Yönetim ve servis doğrulaması

- [ ] Yönetici hesabıyla üretim paneline girip Neon tablo durumunu doğrulamak.
- [ ] Vercel Blob'a gerçek bir görsel yükleyip medya kütüphanesi ve katalog kullanımını uçtan uca test etmek.
- [ ] Resend üzerinden yönetici bildirimi, müşteri onayı ve durum güncelleme e-postalarını gerçek alıcıyla test etmek.
- [ ] Sipariş oluşturma → admin güncelleme → müşteri takip ekranı akışını tek bir deneme siparişiyle tamamlamak.

### Medya yönetimi

- [ ] Görseller için odak noktası ve mobil kırpma ayarlarını yönetim paneline eklemek.
- [ ] Medya kütüphanesinde alternatif metinleri sonradan düzenleme ve kullanılmayan görseli silme işlemlerini eklemek.
- [ ] Mevcut `<img>` kullanımlarını performans önceliğine göre `next/image` ile optimize etmek.

### Katalog PDF'i

- [ ] Kaynak PDF'i Wooden Universe adı, iletişim bilgileri ve siyah-gold tasarım sistemiyle yeniden markalamak.
- [ ] PDF ürün görsellerinin web için optimize edilmiş sürümlerini çıkarmak.
- [ ] Yenilenen PDF'i siteye indirilebilir katalog olarak eklemek.

### Yayın öncesi son kontrol

- [ ] Güncel sürümü 390 px mobil, tablet ve masaüstünde yeniden görsel olarak kontrol etmek.
- [ ] Klavye kullanımı, odak görünürlüğü, form hata mesajları ve temel erişilebilirlik kontrolünü tamamlamak.
- [ ] Üretim ortamında temel sayfalar ve API'ler için tekrarlanabilir bir hızlı kontrol listesi hazırlamak.
