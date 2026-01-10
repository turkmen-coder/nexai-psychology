import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { ExternalLink, Sparkles, Brain, Eye, Heart } from 'lucide-react';

interface ActionUnitInstance {
  unit: string;
  intensity: 'A' | 'B' | 'C' | 'D' | 'E';
  confidence: number;
}

interface Recommendation {
  title: string;
  creator: string;
  type: string;
  reasoning: string;
  enneagramAlignment?: string;
  url?: string;
}

interface PersonalityProfile {
  detectedEmotion: string;
  emotionConfidence: number;
  actionUnits: ActionUnitInstance[];
  temporalCategory: string;
  openness: number;
  conscientiousness: number;
  extraversion: number;
  neuroticism: number;
  riskTolerance: number;
  indigenousTraitName: string;
  indigenousTraitScore: number;
  jungianArchetype: string;
  archetypeStrength: number;
  shadowSelf: string;
  shadowState: string;
  enneagramType: string;
  enneagramTitle: string;
  ethicalCompliance: boolean;
  reasoningPath: string;
  analysis: string;
  recommendations: Recommendation[];
}

interface ResultsViewProps {
  profile: PersonalityProfile;
}

export default function ResultsView({ profile }: ResultsViewProps) {
  // Big Five için radar chart verisi
  const personalityData = [
    { trait: 'Açıklık', value: profile.openness * 100 },
    { trait: 'Sorumluluk', value: profile.conscientiousness * 100 },
    { trait: 'Dışadönüklük', value: profile.extraversion * 100 },
    { trait: 'Nevrotiklik', value: profile.neuroticism * 100 },
    { trait: 'Risk Toleransı', value: profile.riskTolerance * 100 },
  ];

  // Action Units için bar chart verisi
  const auData = profile.actionUnits.slice(0, 6).map(au => ({
    name: au.unit.split(' ')[0], // Sadece AU kodunu al
    value: au.confidence * 100,
  }));

  const getIntensityColor = (intensity: string) => {
    const colors = {
      'A': '#fbbf24', // amber
      'B': '#f59e0b', // amber-600
      'C': '#d97706', // amber-700
      'D': '#b45309', // amber-800
      'E': '#92400e', // amber-900
    };
    return colors[intensity as keyof typeof colors] || '#fbbf24';
  };

  const getShadowStateColor = (state: string) => {
    return state === 'Aktif Çatışma' ? 'text-red-400' : 'text-green-400';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-20">
      {/* Başlık */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Sparkles className="w-8 h-8 text-gold" />
          <h1 className="text-4xl font-serif text-white uppercase tracking-widest">
            Dijital Ruh Analizi
          </h1>
        </div>
        <p className="text-zinc-400 text-sm italic">
          Bilinçaltınızın haritası çıkarıldı
        </p>
      </div>

      {/* Ana Analiz */}
      <Card className="p-8 bg-zinc-900/40 border-white/10">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-gold" />
            <h2 className="text-2xl font-serif text-white">Psikolojik Profil</h2>
          </div>
          <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
            {profile.analysis}
          </p>
        </div>
      </Card>

      {/* Kişilik Özellikleri Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Big Five Radar Chart */}
        <Card className="p-6 bg-zinc-900/40 border-white/10">
          <h3 className="text-lg font-display text-white mb-6 tracking-widest">
            KİŞİLİK ÖZELLİKLERİ
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={personalityData}>
              <PolarGrid stroke="#3f3f46" />
              <PolarAngleAxis dataKey="trait" tick={{ fill: '#a1a1aa', fontSize: 12 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#71717a' }} />
              <Radar
                name="Kişilik"
                dataKey="value"
                stroke="#d4af37"
                fill="#d4af37"
                fillOpacity={0.3}
              />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        {/* Arketip ve Enneagram */}
        <Card className="p-6 bg-zinc-900/40 border-white/10 space-y-6">
          <div>
            <h3 className="text-lg font-display text-white mb-4 tracking-widest">
              ARKETİP ANALİZİ
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Jung Arketipi</p>
                <p className="text-xl text-gold font-serif">{profile.jungianArchetype}</p>
                <div className="mt-2 h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold"
                    style={{ width: `${profile.archetypeStrength * 100}%` }}
                  />
                </div>
              </div>
              <Separator className="bg-white/10" />
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Enneagram</p>
                <p className="text-xl text-white font-serif">
                  Tip {profile.enneagramType}
                </p>
                <p className="text-sm text-zinc-400">{profile.enneagramTitle}</p>
              </div>
              <Separator className="bg-white/10" />
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Kültürel Özellik</p>
                <p className="text-lg text-white">{profile.indigenousTraitName}</p>
                <div className="mt-2 h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${profile.indigenousTraitScore * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Gölge Benlik Analizi */}
      <Card className="p-8 bg-gradient-to-br from-zinc-900/60 to-zinc-900/40 border-white/10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Eye className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-serif text-white">Gölge Benlik</h3>
          </div>
          <p className="text-zinc-300 leading-relaxed">
            {profile.shadowSelf}
          </p>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-zinc-500">Durum:</span>
            <span className={`font-display tracking-wider ${getShadowStateColor(profile.shadowState)}`}>
              {profile.shadowState}
            </span>
          </div>
        </div>
      </Card>

      {/* Yüz İfadesi Analizi */}
      {profile.actionUnits && profile.actionUnits.length > 0 && (
        <Card className="p-6 bg-zinc-900/40 border-white/10">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6 text-red-400" />
              <h3 className="text-lg font-display text-white tracking-widest">
                FACS ANALİZİ
              </h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-zinc-400 mb-4">
                  Tespit Edilen Duygu: <span className="text-white font-display">{profile.detectedEmotion}</span>
                  <span className="text-zinc-500 ml-2">
                    ({Math.round(profile.emotionConfidence * 100)}% güven)
                  </span>
                </p>
                <p className="text-xs text-zinc-500">
                  Kategori: {profile.temporalCategory}
                </p>
              </div>
              
              <div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={auData} layout="horizontal">
                    <XAxis type="number" domain={[0, 100]} tick={{ fill: '#71717a', fontSize: 10 }} />
                    <YAxis type="category" dataKey="name" tick={{ fill: '#a1a1aa', fontSize: 10 }} width={60} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46' }}
                      labelStyle={{ color: '#d4af37' }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {auData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill="#d4af37" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {profile.actionUnits.slice(0, 6).map((au, idx) => (
                <div key={idx} className="p-3 bg-zinc-800/50 rounded-lg">
                  <p className="text-xs text-zinc-400">{au.unit}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="text-lg font-bold"
                      style={{ color: getIntensityColor(au.intensity) }}
                    >
                      {au.intensity}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {Math.round(au.confidence * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* İçerik Önerileri */}
      <div className="space-y-4">
        <h3 className="text-2xl font-serif text-white text-center">
          Ruhunuza Özel Kürasyon
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {profile.recommendations.map((rec, idx) => (
            <Card key={idx} className="p-6 bg-zinc-900/40 border-white/10 hover:border-gold/30 transition-all group">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-xs text-gold uppercase tracking-wider mb-1">
                      {rec.type}
                    </p>
                    <h4 className="text-lg font-serif text-white group-hover:text-gold transition-colors">
                      {rec.title}
                    </h4>
                    <p className="text-sm text-zinc-400">{rec.creator}</p>
                  </div>
                  {rec.url && (
                    <a
                      href={rec.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-500 hover:text-gold transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  {rec.reasoning}
                </p>
                {rec.enneagramAlignment && (
                  <p className="text-xs text-purple-400">
                    ⚡ {rec.enneagramAlignment}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Etik Uyumluluk */}
      {!profile.ethicalCompliance && (
        <Card className="p-4 bg-red-500/10 border-red-500/30">
          <p className="text-xs text-red-400 text-center">
            ⚠️ Bu analiz EU AI Act standartlarına uygunluk nedeniyle kısıtlanmıştır.
          </p>
        </Card>
      )}
    </div>
  );
}
