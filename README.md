# 🧠 NexAI - Yapay Zeka Destekli Psikolojik Analiz Platformu

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61dafb)](https://reactjs.org/)
[![tRPC](https://img.shields.io/badge/tRPC-11.6-398ccb)](https://trpc.io/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

> **Yapay zeka destekli psikolojik analiz ve kişilik profilleme platformu** - Google Gemini ile yüz ifadesi analizi, risk toleransı ölçümü ve kültürel kalibrasyon sistemi.

## 🌟 Özellikler

### 🎭 Kişilik Analizi
- **Big Five (OCEAN):** Dışadönüklük, Uyumluluk, Sorumluluk, Nevrotiklik, Deneyime Açıklık
- **MBTI Profilleme:** 16 kişilik tipi analizi
- **Jung Arketipleri:** Derin psikolojik profilleme
- **Enneagram:** 9 temel kişilik tipi

### 🎯 Risk Toleransı Ölçümü
- **BART (Balloon Analogue Risk Task):** Balon analojik risk görevi
- **Gerçek zamanlı risk profili:** Karar verme davranışı analizi
- **Kültürel kalibrasyon:** Batı, Doğu, Afrika çerçeveleri

### 📸 Yüz İfadesi Analizi
- **Google Gemini 3 entegrasyonu:** Görsel psikolojik analiz
- **Duygu tanıma:** Yüz ifadelerinden duygu durumu tespiti
- **Mikro ifade analizi:** Bilinçaltı tepkilerin değerlendirilmesi

### 🌍 Çoklu Kültür Desteği
- **Batı kültürü:** Bireysellik odaklı analiz
- **Doğu kültürü:** Toplulukçu değerler perspektifi
- **Afrika kültürü:** Ubuntu felsefesi çerçevesi

### 🎨 Modern Arayüz
- **Responsive tasarım:** Mobil ve masaüstü uyumlu
- **Dark/Light mode:** Kullanıcı tercihi destekli tema
- **Interaktif testler:** Kullanıcı dostu test deneyimi
- **Gerçek zamanlı sonuçlar:** Anlık analiz ve geri bildirim

## 🏗️ Teknoloji Stack

| Kategori | Teknoloji |
|----------|-----------|
| Frontend | React 19 + Tailwind CSS 4 + Wouter |
| Backend | Express 4 + tRPC 11 |
| Database | MySQL/TiDB + Drizzle ORM |
| AI Engine | Google Gemini 3 |
| Auth | Manus OAuth |
| Build | Vite |

## 🚀 Kurulum

### Gereksinimler

- Node.js 22+
- pnpm 10+
- MySQL 8+ (veya Manus yerleşik veritabanı)
- Google Gemini API anahtarı

### Adımlar

```bash
# Depoyu klonla
git clone https://github.com/turkmen-coder/nexai.git
cd nexai

# Bağımlılıkları yükle
pnpm install

# Ortam değişkenlerini ayarla
cp .env.example .env
# .env dosyasını düzenle

# Veritabanı şemasını oluştur
pnpm db:push

# Geliştirme sunucusunu başlat
pnpm dev
```

### Ortam Değişkenleri

```env
# Veritabanı
DATABASE_URL=mysql://user:password@host:port/database

# Kimlik Doğrulama (Manus OAuth)
JWT_SECRET=your-secret
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im

# Google Gemini
GEMINI_API_KEY=your-gemini-api-key
```

## 📖 Kullanım

### Kullanıcılar İçin

1. **Giriş Yap:** Manus OAuth ile kimlik doğrulama
2. **Test Seç:** Big Five, MBTI, BART veya Yüz Analizi
3. **Testi Tamamla:** Soruları yanıtla veya görsel yükle
4. **Sonuçları İncele:** Detaylı psikolojik profil raporunu gör
5. **Kültürel Bağlam:** Farklı kültürel perspektiflerle sonuçları değerlendir

### Geliştiriciler İçin

```typescript
// Örnek: Kişilik analizi
const { data: profile } = trpc.analysis.analyzePersonality.useQuery({
  responses: userResponses,
  culturalContext: "western"
});

// Örnek: Yüz ifadesi analizi
const { mutate: analyzeImage } = trpc.gemini.analyzeFacialExpression.useMutation();

analyzeImage({
  imageData: base64Image,
  analysisType: "emotion"
});
```

## 🧪 Test

```bash
# Tüm testleri çalıştır
pnpm test

# Belirli bir test dosyasını çalıştır
pnpm test server/services/analysis.test.ts

# İzleme modu
pnpm test --watch
```

## 📊 Proje Yapısı

```
nexai/
├── client/                 # Frontend React uygulaması
│   ├── src/
│   │   ├── pages/         # Sayfa bileşenleri
│   │   ├── components/    # Yeniden kullanılabilir UI bileşenleri
│   │   ├── lib/           # tRPC istemcisi
│   │   └── index.css      # Ana CSS
├── server/                # Backend Express + tRPC
│   ├── services/          # İş mantığı
│   │   ├── analysis.ts    # Psikolojik analiz
│   │   ├── gemini.ts      # Google Gemini entegrasyonu
│   │   └── cultural.ts    # Kültürel kalibrasyon
│   ├── routers.ts         # tRPC API rotaları
│   └── db.ts              # Veritabanı sorguları
├── drizzle/               # Veritabanı şeması
│   └── schema.ts
└── shared/                # Paylaşılan tipler ve sabitler
```

## 🔒 Güvenlik ve Gizlilik

- **GDPR Uyumlu:** Kullanıcılar verilerinin sahibidir
- **Şeffaf AI:** Tüm kararlar için açıklamalar
- **Veri Minimizasyonu:** Sadece gerekli veriler toplanır
- **Unutulma Hakkı:** Kullanıcılar tüm verilerini silebilir
- **Anonimleştirme:** Hassas veriler anonimleştirilir

## 🗺️ Yol Haritası

### Faz 1: Temel (✅ Tamamlandı)
- [x] Big Five kişilik analizi
- [x] BART risk testi
- [x] Google Gemini entegrasyonu
- [x] Temel UI ve tema

### Faz 2: Gelişmiş Özellikler (🚧 Devam Ediyor)
- [ ] MBTI ve Enneagram testleri
- [ ] Gelişmiş yüz ifadesi analizi
- [ ] Kültürel kalibrasyon sistemi
- [ ] PDF rapor oluşturma

### Faz 3: Genişleme (📅 Planlandı)
- [ ] Grup analizi özellikleri
- [ ] Longitudinal takip sistemi
- [ ] Mobil uygulama (React Native)
- [ ] API entegrasyonları

## 🤝 Katkıda Bulunma

Katkılar memnuniyetle karşılanır! Lütfen önce [Katkı Rehberi](CONTRIBUTING.md)'ni okuyun.

### Geliştirme İş Akışı

1. Depoyu fork edin
2. Özellik dalı oluşturun (`git checkout -b feature/harika-ozellik`)
3. Değişikliklerinizi commit edin (`git commit -m 'Harika özellik ekle'`)
4. Dalınıza push edin (`git push origin feature/harika-ozellik`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT Lisansı altında lisanslanmıştır - detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 🙏 Teşekkürler

- **Manus Platform** - Altyapı ve OAuth
- **Google Gemini** - AI analiz motoru
- **Drizzle ORM** - Tip güvenli veritabanı sorguları
- **tRPC** - Uçtan uca tip güvenli API'ler
- **Tailwind CSS** - Utility-first stil sistemi

## 📞 Destek

- **Sorunlar:** [GitHub Issues](https://github.com/turkmen-coder/nexai/issues)
- **E-posta:** support@nexai.app

---

**❤️ ile Yapay Zeka ve Psikoloji tutkusuyla geliştirildi**

*"Kendini tanımak, yapay zekanın gücüyle buluşuyor."*
