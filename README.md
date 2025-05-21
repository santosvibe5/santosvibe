# Eastside RPG - Karakter Başvuru Sitesi

Bu web uygulaması, MTA sunucunuz için karakter başvuru formunu içerir. Oyuncular bu form aracılığıyla sunucunuza karakter başvurusu yapabilirler ve başvurular otomatik olarak Discord sunucunuza gönderilir.

## Özellikler

- Responsive tasarım (mobil ve masaüstü uyumlu)
- Form doğrulama (validation)
- Kullanıcı dostu arayüz
- Modern ve şık görünüm
- **Discord Webhook entegrasyonu** - Başvurular doğrudan Discord kanalınıza gönderilir

## Kurulum

1. `script.js` dosyasını açın
2. `DISCORD_WEBHOOK_URL` değişkenini kendi Discord webhook URL'niz ile değiştirin:
   ```javascript
   const DISCORD_WEBHOOK_URL = 'DISCORD_WEBHOOK_URL_BURAYA';
   ```
   Örnek:
   ```javascript
   const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1234567890/abcdefghijklmnopqrstuvwxyz';
   ```

## Discord Webhook Nasıl Oluşturulur

1. Discord sunucunuzda bir kanala sağ tıklayın
2. "Kanal Düzenle" seçeneğini seçin
3. "Entegrasyonlar" sekmesine tıklayın
4. "Webhook Oluştur" butonuna tıklayın
5. Webhook'a bir isim verin ve isteğe bağlı olarak bir avatar ekleyin
6. "Webhook URL'sini Kopyala" butonuna tıklayın
7. Bu URL'yi `script.js` dosyasındaki `DISCORD_WEBHOOK_URL` değişkenine yapıştırın

## Nasıl Kullanılır

1. `index.html` dosyasını bir web tarayıcısında açın
2. Formu doldurun ve "Başvuruyu Gönder" butonuna tıklayın
3. Başarılı bir şekilde gönderildiğinde onay mesajı görünecektir
4. Başvuru bilgileri otomatik olarak Discord kanalınıza gönderilecektir

## Dosyalar

- `index.html` - Ana HTML dosyası
- `styles.css` - CSS stil dosyası
- `script.js` - JavaScript fonksiyonları ve Discord webhook entegrasyonu

## Özelleştirme

Sitenin görünümünü değiştirmek için `styles.css` dosyasını düzenleyebilirsiniz. Arka plan görselini, renkleri ve yazı tiplerini kendi zevkinize göre ayarlayabilirsiniz.

Form alanlarını değiştirmek veya yeni alanlar eklemek için `index.html` dosyasını düzenleyebilirsiniz.

Discord webhook mesaj formatını değiştirmek için `script.js` dosyasındaki `webhookData` nesnesini düzenleyebilirsiniz.
