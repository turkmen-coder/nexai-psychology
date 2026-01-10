import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Camera, X } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (userImage: string, baselineImage: string) => void;
  onSkip: () => void;
}

export default function CameraCapture({ onCapture, onSkip }: CameraCaptureProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [baselineImage, setBaselineImage] = useState<string | null>(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'baseline' | 'expression'>('baseline');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError('Kameraya erişim izni verilmedi. Lütfen tarayıcı ayarlarınızı kontrol edin.');
      console.error('Camera access error:', err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL('image/jpeg', 0.8);

    if (step === 'baseline') {
      setBaselineImage(imageData);
      setStep('expression');
    } else {
      setUserImage(imageData);
      stopCamera();
      if (baselineImage) {
        onCapture(imageData, baselineImage);
      }
    }
  };

  const retake = () => {
    if (step === 'baseline') {
      setBaselineImage(null);
    } else {
      setUserImage(null);
      setStep('baseline');
      setBaselineImage(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-3xl font-serif text-white uppercase tracking-widest">
          Yüz İfadesi Analizi
        </h2>
        <p className="text-sm text-zinc-400">
          {step === 'baseline' 
            ? 'Önce nötr bir ifadeyle fotoğraf çekelim (baseline)'
            : 'Şimdi doğal ifadenizle bir fotoğraf daha'}
        </p>
      </div>

      <Card className="p-6 bg-zinc-900/40 border-white/10">
        <div className="space-y-6">
          {error ? (
            <div className="text-red-400 text-sm p-4 bg-red-500/10 rounded-lg">
              {error}
            </div>
          ) : (
            <>
              {/* Video önizleme */}
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover mirror"
                />
                <canvas ref={canvasRef} className="hidden" />
                
                {/* Çekilmiş görüntü önizlemesi */}
                {((step === 'baseline' && baselineImage) || (step === 'expression' && userImage)) && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                    <img
                      src={step === 'baseline' ? baselineImage! : userImage!}
                      alt="Captured"
                      className="max-w-full max-h-full object-contain mirror"
                    />
                  </div>
                )}
              </div>

              {/* Talimatlar */}
              <div className="text-xs text-zinc-500 space-y-1">
                {step === 'baseline' ? (
                  <>
                    <p>✓ Yüzünüzü kameraya doğru tutun</p>
                    <p>✓ Nötr bir ifade takının (gülümsemeyin)</p>
                    <p>✓ İyi aydınlatılmış bir ortamda olun</p>
                  </>
                ) : (
                  <>
                    <p>✓ Şimdi doğal ifadenizle bakın</p>
                    <p>✓ Rahat ve kendiniz olun</p>
                  </>
                )}
              </div>

              {/* Kontroller */}
              <div className="flex gap-4 justify-center">
                {((step === 'baseline' && !baselineImage) || (step === 'expression' && !userImage)) ? (
                  <Button
                    onClick={captureImage}
                    size="lg"
                    className="px-8 bg-white text-black hover:bg-gold font-display tracking-widest"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    FOTOĞRAF ÇEK
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={retake}
                      size="lg"
                      variant="outline"
                      className="px-8 font-display tracking-widest"
                    >
                      <X className="w-4 h-4 mr-2" />
                      YENİDEN ÇEK
                    </Button>
                    <Button
                      onClick={step === 'baseline' ? () => setStep('expression') : captureImage}
                      size="lg"
                      className="px-8 bg-white text-black hover:bg-gold font-display tracking-widest"
                    >
                      DEVAM ET
                    </Button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </Card>

      <Button
        onClick={() => {
          stopCamera();
          onSkip();
        }}
        variant="ghost"
        className="text-zinc-500 hover:text-white text-xs uppercase tracking-widest"
      >
        Bu adımı atla
      </Button>

      <style>{`
        .mirror {
          transform: scaleX(-1);
        }
      `}</style>
    </div>
  );
}
