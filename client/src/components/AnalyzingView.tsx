import { Loader2, Brain, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface AnalyzingViewProps {
  progress?: number;
}

export default function AnalyzingView({ progress = 0 }: AnalyzingViewProps) {
  const stages = [
    'FACS Action Units analiz ediliyor...',
    'Kültürel bağlam kalibre ediliyor...',
    'Jung arketipleri tespit ediliyor...',
    'Gölge benlik haritalanıyor...',
    'Big Five özellikleri hesaplanıyor...',
    'İçerik küratörü çalışıyor...',
  ];

  const currentStage = Math.min(Math.floor(progress / 16.67), stages.length - 1);

  return (
    <div className="max-w-2xl mx-auto text-center space-y-12 animate-fade-in min-h-[60vh] flex flex-col justify-center">
      <div className="space-y-6">
        <div className="flex items-center justify-center gap-4">
          <Brain className="w-12 h-12 text-gold animate-pulse" />
          <Sparkles className="w-8 h-8 text-gold animate-pulse delay-150" />
        </div>
        
        <h2 className="text-3xl font-serif text-white">
          Dijital Ruhunuz Analiz Ediliyor
        </h2>
        
        <p className="text-zinc-400 text-sm italic max-w-md mx-auto">
          Gemini 3 Pro modeli, psikolojik profilinizi derinlemesine inceliyor...
        </p>
      </div>

      <Card className="p-8 bg-zinc-900/40 border-white/10">
        <div className="space-y-6">
          {/* Progress bar */}
          <div className="relative h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold to-yellow-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>

          {/* Current stage */}
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="w-5 h-5 text-gold animate-spin" />
            <p className="text-sm text-zinc-300 font-display tracking-wider">
              {stages[currentStage]}
            </p>
          </div>

          {/* Stage indicators */}
          <div className="grid grid-cols-3 gap-2 pt-4">
            {stages.map((stage, idx) => (
              <div
                key={idx}
                className={`h-1 rounded-full transition-all duration-300 ${
                  idx <= currentStage ? 'bg-gold' : 'bg-zinc-800'
                }`}
              />
            ))}
          </div>
        </div>
      </Card>

      <div className="space-y-2 text-xs text-zinc-600">
        <p>🧠 FACS (Facial Action Coding System) uygulanıyor</p>
        <p>🌍 Kültürel kalibrasyon aktif</p>
        <p>🔒 EU AI Act uyumlu analiz</p>
      </div>
    </div>
  );
}
