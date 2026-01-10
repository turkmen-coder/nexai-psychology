import { useState } from 'react';
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import BalloonGame from '@/components/BalloonGame';
import CameraCapture from '@/components/CameraCapture';
import AnalyzingView from '@/components/AnalyzingView';
import ResultsView from '@/components/ResultsView';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

type Step = 'intro' | 'context' | 'game' | 'camera' | 'journal' | 'analyzing' | 'results';

const culturalContexts = [
  { value: 'Batı (WEIRD - Ağız Odaklı)', label: 'Batı (WEIRD)', description: 'Ağız odaklı ifade okuma' },
  { value: 'Doğu Asya (Göz Odaklı)', label: 'Doğu Asya', description: 'Göz odaklı ifade okuma' },
  { value: 'Afrika (Ubuntu)', label: 'Afrika (Ubuntu)', description: 'Kolektif kimlik vurgusu' },
  { value: 'İslami / Spiritüel', label: 'İslami / Spiritüel', description: 'Manevi bağlam' },
  { value: 'Japon (Amae)', label: 'Japon (Amae)', description: 'Bağımlılık ve uyum' },
];

export default function Analysis() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  
  const [step, setStep] = useState<Step>('intro');
  const [culturalContext, setCulturalContext] = useState<string>('');
  const [riskScore, setRiskScore] = useState<number>(0);
  const [userImageBase64, setUserImageBase64] = useState<string>('');
  const [baselineImageBase64, setBaselineImageBase64] = useState<string>('');
  const [journalText, setJournalText] = useState<string>('');
  const [profile, setProfile] = useState<any>(null);
  const [progress, setProgress] = useState(0);

  const createAnalysisMutation = trpc.analysis.create.useMutation({
    onSuccess: (data) => {
      setProfile(data.profile);
      setStep('results');
      toast.success('Analiz tamamlandı!');
    },
    onError: (error) => {
      toast.error('Analiz sırasında bir hata oluştu: ' + error.message);
      setStep('journal');
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Card className="p-8 bg-zinc-900/40 border-white/10 text-center space-y-4">
          <p className="text-white">Bu sayfayı görüntülemek için giriş yapmalısınız.</p>
          <Button onClick={() => setLocation('/')}>Ana Sayfaya Dön</Button>
        </Card>
      </div>
    );
  }

  const handleAnalyze = async () => {
    if (journalText.length < 20) {
      toast.error('Lütfen en az 20 karakter yazın.');
      return;
    }

    setStep('analyzing');
    
    // Progress simülasyonu
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 500);

    try {
      await createAnalysisMutation.mutateAsync({
        culturalContext,
        riskScore,
        journalText,
        userImageBase64: userImageBase64 || undefined,
        baselineImageBase64: baselineImageBase64 || undefined,
      });
      clearInterval(interval);
      setProgress(100);
    } catch (error) {
      clearInterval(interval);
      setProgress(0);
    }
  };

  const reset = () => {
    setStep('intro');
    setCulturalContext('');
    setRiskScore(0);
    setUserImageBase64('');
    setBaselineImageBase64('');
    setJournalText('');
    setProfile(null);
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 p-6 flex justify-between items-center z-50 bg-zinc-950/80 backdrop-blur-sm border-b border-white/5">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-gold rounded-full animate-pulse" />
          <span className="font-serif font-bold text-xl tracking-[0.3em] text-gold">NEXAI</span>
        </div>
        <div className="flex items-center gap-4">
          <Button
            onClick={() => setLocation('/')}
            variant="ghost"
            size="sm"
            className="text-zinc-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Ana Sayfa
          </Button>
          {step !== 'intro' && step !== 'analyzing' && step !== 'results' && (
            <Button
              onClick={reset}
              variant="ghost"
              size="sm"
              className="text-zinc-500 hover:text-red-500 text-xs uppercase tracking-widest border border-white/10 px-3 py-1 rounded-full"
            >
              Sıfırla
            </Button>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-32 pb-20 min-h-screen flex flex-col justify-center">
        {step === 'intro' && (
          <div className="max-w-2xl mx-auto text-center space-y-12 animate-fade-in">
            <h1 className="text-6xl md:text-8xl font-serif leading-tight">
              Dijital Ruh <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-white">
                Küratörü
              </span>
            </h1>
            <p className="text-lg text-zinc-400 font-light max-w-lg mx-auto leading-relaxed italic">
              Davranışın, görüntün ve sözlerin arasındaki sessiz boşlukta gerçek karakterin saklıdır.
            </p>
            <Button
              onClick={() => setStep('context')}
              size="lg"
              className="px-12 py-5 bg-white text-black font-display font-bold tracking-[0.4em] hover:bg-gold transition-all transform hover:scale-105"
            >
              BAŞLAT
            </Button>
          </div>
        )}

        {step === 'context' && (
          <div className="max-w-4xl mx-auto space-y-12 animate-fade-in text-center">
            <h2 className="text-2xl font-serif text-white uppercase tracking-widest">
              Kültürel Kalibrasyon
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {culturalContexts.map((ctx) => (
                <button
                  key={ctx.value}
                  onClick={() => {
                    setCulturalContext(ctx.value);
                    setStep('game');
                  }}
                  className="group p-8 text-left border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-gold/50 transition-all rounded-3xl"
                >
                  <h3 className="text-lg font-display text-white group-hover:text-gold mb-3 tracking-widest">
                    {ctx.label}
                  </h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    {ctx.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'game' && (
          <BalloonGame
            onComplete={(score) => {
              setRiskScore(score);
              setStep('camera');
            }}
          />
        )}

        {step === 'camera' && (
          <CameraCapture
            onCapture={(userImg, baselineImg) => {
              setUserImageBase64(userImg);
              setBaselineImageBase64(baselineImg);
              setStep('journal');
            }}
            onSkip={() => setStep('journal')}
          />
        )}

        {step === 'journal' && (
          <div className="max-w-2xl mx-auto animate-fade-in space-y-10">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-serif text-white uppercase tracking-widest">
                Semantik Modelleme
              </h2>
              <p className="text-xs text-zinc-400">
                Zihninin o anki akışını bizimle paylaş.
              </p>
            </div>
            <Textarea
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              placeholder="Neler hissediyorsun? Bugün neler yaşadın? Aklından neler geçiyor?..."
              className="w-full h-64 bg-zinc-900/40 border border-white/10 p-8 rounded-3xl focus:border-gold/40 text-zinc-200 font-serif text-lg leading-relaxed shadow-inner resize-none"
            />
            <div className="flex flex-col items-center space-y-4">
              <Button
                onClick={handleAnalyze}
                disabled={journalText.length < 20 || createAnalysisMutation.isPending}
                size="lg"
                className="px-12 py-5 bg-white text-black font-display font-bold tracking-[0.4em] hover:bg-gold disabled:opacity-30 transition-all shadow-xl"
              >
                {createAnalysisMutation.isPending ? 'ANALİZ EDİLİYOR...' : 'ANALİZİ TAMAMLA'}
              </Button>
              <p className="text-xs text-zinc-500">
                En az 20 karakter gerekli • Mevcut: {journalText.length}
              </p>
            </div>
          </div>
        )}

        {step === 'analyzing' && <AnalyzingView progress={progress} />}

        {step === 'results' && profile && (
          <div className="space-y-8">
            <ResultsView profile={profile} />
            <div className="flex justify-center gap-4">
              <Button
                onClick={reset}
                variant="outline"
                size="lg"
                className="px-8 font-display tracking-widest"
              >
                YENİ ANALİZ
              </Button>
              <Button
                onClick={() => setLocation('/history')}
                size="lg"
                className="px-8 bg-gold text-black font-display tracking-widest hover:bg-yellow-500"
              >
                GEÇMİŞİ GÖRÜNTÜLE
              </Button>
            </div>
          </div>
        )}
      </main>

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
