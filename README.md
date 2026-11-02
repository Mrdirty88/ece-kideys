# Ece Kıdeyş · Resmî web sitesi

Vite + React + TypeScript + Tailwind v4 + three / @react-three/fiber + motion + lenis.

## Yayına alma
`dist/` klasörünün içeriğini hosting'in (ör. Hostinger) `public_html` klasörüne yükleyin. Hepsi bu.

## Düzenleme
Tüm metinler, bağlantılar, e-posta ve logo yolu: `src/content.ts`
```
npm install
npm run dev      # geliştirme
npm run build    # dist/ üretir
```

## Notlar
- Talep formu ziyaretçinin e-posta uygulamasını, menajerlik adresine hazır metinle açar. `content.ts` içinde `whatsapp` doldurulursa "WhatsApp ile gönder" düğmesi de çıkar.
- İzmir Wellness Club logosu orijinal dosyadan, yalnız ekran görüntüsü çerçevesi kırpılarak kullanıldı.
- Hareket azaltma tercihinde ve WebGL olmayan cihazlarda statik hero görseli gösterilir.
