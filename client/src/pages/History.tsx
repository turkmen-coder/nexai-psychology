import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';
import { ArrowLeft, Calendar, Brain, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function History() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  
  const { data: analyses, isLoading } = trpc.analysis.list.useQuery(undefined, {
    enabled: isAuthenticated,
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
          <span className="text-zinc-500 text-sm">{user?.name}</span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Brain className="w-8 h-8 text-gold" />
              <h1 className="text-4xl font-serif text-white uppercase tracking-widest">
                Analiz Geçmişi
              </h1>
            </div>
            <p className="text-zinc-400 text-sm">
              Geçmiş psikolojik profil analizlerinizi görüntüleyin
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-gold animate-spin" />
            </div>
          )}

          {/* Empty State */}
          {!isLoading && (!analyses || analyses.length === 0) && (
            <Card className="p-12 bg-zinc-900/40 border-white/10 text-center space-y-6">
              <div className="text-6xl">🧠</div>
              <div className="space-y-2">
                <h3 className="text-xl font-serif text-white">
                  Henüz analiz yapmadınız
                </h3>
                <p className="text-zinc-400 text-sm">
                  İlk psikolojik profil analizinizi oluşturmak için başlayın
                </p>
              </div>
              <Button
                onClick={() => setLocation('/analysis')}
                size="lg"
                className="px-8 bg-gold text-black font-display tracking-widest hover:bg-yellow-500"
              >
                İLK ANALİZİ BAŞLAT
              </Button>
            </Card>
          )}

          {/* Analysis List */}
          {!isLoading && analyses && analyses.length > 0 && (
            <div className="space-y-4">
              {analyses.map((analysis) => (
                <Card
                  key={analysis.id}
                  className="p-6 bg-zinc-900/40 border-white/10 hover:border-gold/30 transition-all cursor-pointer group"
                  onClick={() => {
                    // TODO: Detay sayfasına yönlendir veya modal aç
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      {/* Tarih ve Kültür */}
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 text-zinc-400">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {format(new Date(analysis.createdAt), 'dd MMMM yyyy, HH:mm', { locale: tr })}
                          </span>
                        </div>
                        <span className="text-gold text-xs uppercase tracking-wider">
                          {analysis.culturalContext}
                        </span>
                      </div>

                      {/* Günlük Metni (Kısaltılmış) */}
                      <p className="text-zinc-300 text-sm line-clamp-2">
                        {analysis.journalText}
                      </p>

                      {/* Özellikler */}
                      <div className="flex flex-wrap gap-3 text-xs">
                        {analysis.jungianArchetype && (
                          <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full">
                            {analysis.jungianArchetype}
                          </span>
                        )}
                        {analysis.enneagramType && (
                          <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full">
                            Tip {analysis.enneagramType}
                          </span>
                        )}
                        {analysis.detectedEmotion && (
                          <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full">
                            {analysis.detectedEmotion}
                          </span>
                        )}
                        {analysis.shadowState && (
                          <span className={`px-3 py-1 rounded-full ${
                            analysis.shadowState === 'Aktif Çatışma'
                              ? 'bg-red-500/10 text-red-400'
                              : 'bg-green-500/10 text-green-400'
                          }`}>
                            {analysis.shadowState}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Risk Skoru */}
                    <div className="text-center space-y-1">
                      <div className="text-2xl font-bold text-gold">
                        {Math.round(analysis.riskScore * 100)}
                      </div>
                      <div className="text-xs text-zinc-500 uppercase tracking-wider">
                        Risk
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* New Analysis Button */}
          {!isLoading && analyses && analyses.length > 0 && (
            <div className="flex justify-center pt-8">
              <Button
                onClick={() => setLocation('/analysis')}
                size="lg"
                className="px-8 bg-white text-black font-display tracking-widest hover:bg-gold"
              >
                YENİ ANALİZ OLUŞTUR
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
