import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { Brain, Sparkles, Eye, Target, Globe, Shield } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  const handleStart = () => {
    if (isAuthenticated) {
      setLocation("/analysis");
    } else {
      window.location.href = getLoginUrl();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 p-6 flex justify-between items-center z-50 bg-zinc-950/80 backdrop-blur-sm border-b border-white/5">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-gold to-yellow-600 rounded-full animate-pulse" />
          <span className="font-serif font-bold text-2xl tracking-[0.3em] text-gold">NEXAI</span>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <>
              <Button
                onClick={() => setLocation("/history")}
                variant="ghost"
                className="text-zinc-400 hover:text-white text-sm uppercase tracking-wider"
              >
                Geçmiş
              </Button>
              <span className="text-zinc-500 text-sm">{user?.name}</span>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-4xl mx-auto text-center space-y-12 animate-fade-in">
          <div className="space-y-6">
            <h1 className="text-6xl md:text-8xl font-serif leading-tight">
              Dijital Ruh <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-500 to-gold">
                Küratörü
              </span>
            </h1>
            <p className="text-xl text-zinc-400 font-light max-w-2xl mx-auto leading-relaxed italic">
              "İnsanın söyledikleri ile yaptıkları arasındaki sessiz boşlukta, gerçek karakter saklıdır."
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={handleStart}
              size="lg"
              className="px-12 py-6 bg-white text-black font-display font-bold tracking-[0.4em] hover:bg-gold transition-all transform hover:scale-105 text-lg"
            >
              ANALİZE BAŞLA
            </Button>
            {!isAuthenticated && (
              <p className="text-xs text-zinc-500">
                Devam etmek için giriş yapmanız gerekiyor
              </p>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto mt-32 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Brain className="w-8 h-8" />}
            title="Psikolojik Profilleme"
            description="Google Gemini 3 ile Big Five, Jung arketipleri ve Enneagram analizi"
          />
          <FeatureCard
            icon={<Eye className="w-8 h-8" />}
            title="FACS Analizi"
            description="Yüz ifadesi ve Action Unit tespiti ile mikro-ifade okuma"
          />
          <FeatureCard
            icon={<Target className="w-8 h-8" />}
            title="BART Risk Testi"
            description="Davranışsal risk toleransı ölçümü ve bilinçdışı tepki analizi"
          />
          <FeatureCard
            icon={<Globe className="w-8 h-8" />}
            title="Kültürel Kalibrasyon"
            description="5 farklı kültürel bağlam için özelleştirilmiş analiz algoritmaları"
          />
          <FeatureCard
            icon={<Sparkles className="w-8 h-8" />}
            title="Gölge Benlik"
            description="Persona-davranış çatışma skoru ve bastırılmış duygu tespiti"
          />
          <FeatureCard
            icon={<Shield className="w-8 h-8" />}
            title="Etik Uyumluluk"
            description="EU AI Act standartlarına tam uyumlu güvenli analiz"
          />
        </div>

        {/* Methodology Section */}
        <div className="max-w-4xl mx-auto mt-32 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-serif text-white">Üçlü Sacayağı Metodu</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Nexai, geleneksel öneri sistemlerinin ötesine geçer. "Bu kişi kimdir ve ruhunun neye ihtiyacı var?" sorusuna odaklanır.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-8 bg-zinc-900/40 border border-white/10 rounded-2xl space-y-3">
              <div className="text-4xl">📝</div>
              <h3 className="text-xl font-display text-gold tracking-wider">BEYAN</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Kullanıcının kendini nasıl tanımladığı. Günlük metinleri ve öz-bildirim.
              </p>
            </div>
            <div className="p-8 bg-zinc-900/40 border border-white/10 rounded-2xl space-y-3">
              <div className="text-4xl">🎯</div>
              <h3 className="text-xl font-display text-gold tracking-wider">DAVRANIŞ</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                BART oyunu ile risk alırken bilinçdışı tepkiler ve gerçek davranış kalıpları.
              </p>
            </div>
            <div className="p-8 bg-zinc-900/40 border border-white/10 rounded-2xl space-y-3">
              <div className="text-4xl">🌍</div>
              <h3 className="text-xl font-display text-gold tracking-wider">KÜLTÜR</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Kullanıcının içinde bulunduğu toplumsal normlar ve kültürel çerçeve.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-2xl mx-auto mt-32 text-center space-y-8 p-12 bg-gradient-to-br from-zinc-900/60 to-zinc-900/40 border border-gold/20 rounded-3xl">
          <h2 className="text-3xl font-serif text-white">
            Dijital Ruhunuzu Keşfetmeye Hazır mısınız?
          </h2>
          <p className="text-zinc-400">
            Yapay zeka destekli psikolojik analiz ile kendinizi daha iyi tanıyın ve size özel içerik önerileri alın.
          </p>
          <Button
            onClick={handleStart}
            size="lg"
            className="px-12 py-6 bg-gold text-black font-display font-bold tracking-[0.4em] hover:bg-yellow-500 transition-all"
          >
            ŞİMDİ BAŞLA
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 mt-20">
        <div className="container mx-auto px-4 text-center text-xs text-zinc-600">
          <p>© 2026 Nexai. Tüm hakları saklıdır.</p>
          <p className="mt-2">EU AI Act uyumlu • GDPR compliant • Etik yapay zeka</p>
        </div>
      </footer>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="group p-8 bg-zinc-900/40 border border-white/5 hover:border-gold/30 rounded-2xl transition-all hover:transform hover:scale-105 space-y-4">
      <div className="text-gold group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-lg font-display text-white tracking-wider group-hover:text-gold transition-colors">
        {title}
      </h3>
      <p className="text-sm text-zinc-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
