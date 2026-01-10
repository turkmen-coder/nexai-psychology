import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface BalloonGameProps {
  onComplete: (score: number) => void;
}

export default function BalloonGame({ onComplete }: BalloonGameProps) {
  const [balloonSize, setBalloonSize] = useState(50);
  const [round, setRound] = useState(1);
  const [totalPumps, setTotalPumps] = useState(0);
  const [roundPumps, setRoundPumps] = useState(0);
  const [popped, setPopped] = useState(false);
  const [collected, setCollected] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const maxRounds = 5;
  const maxSize = 200;
  const popThreshold = 150 + Math.random() * 50; // Her balon için rastgele patlama eşiği

  const pump = () => {
    if (popped || gameOver) return;

    const newSize = balloonSize + 15;
    setRoundPumps(prev => prev + 1);

    if (newSize >= popThreshold) {
      // Balon patladı
      setPopped(true);
      setTimeout(() => {
        nextRound(false);
      }, 1000);
    } else {
      setBalloonSize(newSize);
    }
  };

  const collect = () => {
    if (popped || gameOver) return;

    setCollected(prev => prev + roundPumps);
    setTotalPumps(prev => prev + roundPumps);
    nextRound(true);
  };

  const nextRound = (collected: boolean) => {
    if (round >= maxRounds) {
      // Oyun bitti
      const finalScore = calculateRiskScore();
      setGameOver(true);
      setTimeout(() => {
        onComplete(finalScore);
      }, 1500);
    } else {
      setRound(prev => prev + 1);
      setBalloonSize(50);
      setRoundPumps(0);
      setPopped(false);
    }
  };

  const calculateRiskScore = () => {
    // Risk skoru: toplam pompa sayısı / maksimum güvenli pompa sayısı
    // Daha fazla pompa = daha yüksek risk toleransı
    const avgPumpsPerRound = totalPumps / maxRounds;
    const riskScore = Math.min(avgPumpsPerRound / 10, 1); // 0-1 arası normalize
    return riskScore;
  };

  return (
    <div className="max-w-2xl mx-auto text-center space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-3xl font-serif text-white uppercase tracking-widest">
          BART: Risk Toleransı Testi
        </h2>
        <p className="text-sm text-zinc-400">
          Balonu şişir ve patlamadan önce topla. {maxRounds} tur.
        </p>
      </div>

      <Card className="p-8 bg-zinc-900/40 border-white/10">
        <div className="space-y-6">
          {/* Skor gösterimi */}
          <div className="flex justify-between text-sm text-zinc-400">
            <span>Tur: {round}/{maxRounds}</span>
            <span>Toplanan: {collected}</span>
            <span>Bu Tur: {roundPumps}</span>
          </div>

          {/* Balon */}
          <div className="flex items-center justify-center h-64">
            {popped ? (
              <div className="text-6xl animate-bounce">💥</div>
            ) : gameOver ? (
              <div className="space-y-4">
                <div className="text-4xl">✨</div>
                <p className="text-lg text-gold font-display">Analiz Tamamlandı</p>
              </div>
            ) : (
              <div
                className="rounded-full bg-gradient-to-br from-red-500 to-pink-500 transition-all duration-300 shadow-lg"
                style={{
                  width: `${balloonSize}px`,
                  height: `${balloonSize}px`,
                  boxShadow: `0 0 ${balloonSize / 2}px rgba(239, 68, 68, 0.5)`,
                }}
              />
            )}
          </div>

          {/* Kontroller */}
          {!gameOver && !popped && (
            <div className="flex gap-4 justify-center">
              <Button
                onClick={pump}
                size="lg"
                className="px-8 bg-white text-black hover:bg-gold font-display tracking-widest"
              >
                ŞİŞİR
              </Button>
              <Button
                onClick={collect}
                size="lg"
                variant="outline"
                className="px-8 font-display tracking-widest"
                disabled={roundPumps === 0}
              >
                TOPLA
              </Button>
            </div>
          )}

          {popped && (
            <p className="text-red-400 text-sm animate-pulse">
              Balon patladı! Bu turdaki puanlar kayboldu.
            </p>
          )}
        </div>
      </Card>

      <p className="text-xs text-zinc-500 italic max-w-md mx-auto">
        Bu oyun, bilinçdışı risk alma davranışlarınızı ölçer. Cesur olun ama dikkatli olun.
      </p>
    </div>
  );
}
