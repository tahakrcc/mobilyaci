# Wooden Universe üretim hızlı kontrolü

Her yayın sonrasında aşağıdaki sıra izlenir.

1. `SMOKE_BASE_URL=https://woodenuniverse.vercel.app npm run check:live` çalıştırılır.
2. 390 px, 768 px ve 1440 px genişlikte ana sayfa, koleksiyon, ürün detayı, tasarım ve takip sayfası kontrol edilir.
3. Üst menünün kaydırmada sabit kaldığı, mobil menünün açılıp kapandığı ve tüm bağlantıların doğru sayfaya gittiği doğrulanır.
4. Yönetici panelindeki Sistem Durumu alanında Neon, Blob, e-posta ve yönetici güvenliği yeşil görünmelidir.
5. Deneme görseli yüklenir; alternatif metinleri düzenlenir, katalogda odak noktası masaüstü/mobil için değiştirilir ve kayıt yayına alınır.
6. Deneme siparişi oluşturulur. Yönetici ve müşteri e-postaları kontrol edilir.
7. Sipariş yönetiminden durum, açıklama ve tahmini teslim güncellenir; müşterinin durum e-postası ve takip ekranı doğrulanır.
8. Deneme siparişi ve kullanılmayan deneme medyası temizlenir.
9. Katalog PDF bağlantısı indirilir ve dosyanın Wooden Universe kapak/iletişim sayfaları kontrol edilir.
10. Klavyeyle menü, formlar, butonlar ve odak halkaları dolaşılır; tarayıcı konsolunda hata bulunmadığı doğrulanır.

Test sonucu; tarih, canlı adres, commit, kontrolü yapan kişi ve başarısız maddeyle birlikte yayın notuna yazılır.
