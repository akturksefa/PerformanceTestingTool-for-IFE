# ✈️ IFE Performance Test Tool

**IFE Performance Test Tool**, Uçak İçi Eğlence (IFE) sistemlerinizin dayanıklılığını ve performansını ölçmek için tasarlanmış profesyonel bir test merkezidir. Bu araç, yüzlerce yolcunun aynı anda sistemi kullanmaya çalıştığı senaryoları simüle ederek sistemin sınırlarını keşfetmenizi sağlar.

---

## 🌟 Öne Çıkan Özellikler

### 💺 Dinamik Koltuk Eşleme (Dynamic Seat Mapping)
Sadece bir veri göndermekle kalmaz, her bir kullanıcıyı gerçek bir koltuğa atar. Bu özellik sayesinde:
- **Otomatik Atama:** Her istek farklı bir `seatId` (A, B, C...) ile gönderilir.
- **Kabin Düzeni:** Koltuk sıraları ve sütunları otomatik artırılarak uçak kabini simüle edilir.
- **Gerçekçi Veri:** Sistemin her yolcu için benzersiz verilerle nasıl başa çıktığını test edersiniz.

### ⏱️ Akıllı Hız Kontrolü (Interval Setting)
Tüm kullanıcıları bir anda sisteme salmak yerine, aralarına milisaniyelik gecikmeler ekleyebilirsiniz. 
- **Ramp-up Simülasyonu:** Sistem üzerindeki yükün kademeli artışını ölçün.
- **Kontrollü Akış:** Sunucu kaynaklarını daha hassas test edin.

### 🔍 Gelişmiş Yanıt Denetçisi (Response Inspector)
Test sonuçlarında sadece "başarılı/başarısız" görmezsiniz. Herhangi bir satıra tıklayarak açılan panelde:
- **Tam İçerik:** Sunucunun döndürdüğü tam JSON veya metin içeriğini görün.
- **Hata Analizi:** Hangi isteğin neden başarısız olduğunu teknik detaylarıyla yakalayın.
- **Görsel Büyüteç:** Seçilen satır için özel bir "Inspector" penceresi açılır.

### 📊 Görsel Telemetri (Bento Dashboard)
Modern ve şık bir arayüz üzerinde:
- **Canlı Grafikler:** Gecikme sürelerini (ms) anlık takip edin.
- **Hata Oranları:** Başarı yüzdesini dinamik kartlar üzerinden görün.

---

## 🚀 Nasıl Kullanılır? (Adım Adım)

Uygulamayı kullanmaya başlamak çok basittir:

1.  **URL Girin:** Test etmek istediğiniz API adresini en üstteki "Endpoint URL" kısmına yazın.
2.  **Kullanıcı Sayısını Seçin:** Sürgüyü kaydırarak simüle etmek istediğiniz yolcu sayısını (1-200) belirleyin.
3.  **İstek Aralığını Ayarlayın:** "Request Interval" sürgüsüyle isteklerin kaç milisaniye arayla gönderileceğini seçin.
4.  **Metot ve Veri Seçimi:** `POST` veya `PUT` seçerseniz, alt kısımda bir JSON kutusu açılır. Buraya ana şablon verinizi yazın.
5.  **Dinamik Koltukları Açın:** "Dynamic Seats" butonuna tıklayarak koltuk verilerinin otomatik üretilmesini sağlayın.
6.  **Testi Başlatın:** "START TEST" butonuna basın ve sonuçların akışını izleyin!

---

## 🛠️ Teknik Kurulum (Yerel Çalıştırma)

Eğer bu projeyi kendi bilgisayarınızda çalıştırmak isterseniz:

1.  **Node.js Yükleyin:** Bilgisayarınızda [Node.js](https://nodejs.org/) kurulu olduğundan emin olun.
2.  **Bağımlılıkları Kurun:**
    ```bash
    npm install
    ```
3.  **Geliştirme Modunda Çalıştırın:**
    ```bash
    npm run dev
    ```
4.  Tarayıcınızdan `http://localhost:3000` adresine gidin.

---

## 📋 Gereksinimler

- **Modern Web Tarayıcısı:** Chrome, Edge veya Firefox tavsiye edilir.
- **İnternet Bağlantısı:** Test edilecek URL'ye erişim sağlanabilmelidir.

> **💡 İpucu:** Test sonuçlarındaki herhangi bir satıra tıklayarak sunucu cevabını (response body) detaylıca inceleyebilirsiniz!

---
*Developed for IFE Excellence.*
