import { GoogleGenerativeAI } from "@google/generative-ai";
import { ENV } from "./_core/env";

// Etik uyumluluk filtresi - EU AI Act standartlarına uygun
class EthicalComplianceFilter {
  private prohibitedKeywords = [
    "sexual orientation", "cinsel yönelim",
    "political views", "siyasi görüş", "politik",
    "religious affiliation", "dini inanç",
    "performance monitoring", "performans takibi",
    "race inference", "ırk çıkarımı", "ırk",
    "ethnic", "etnik"
  ];

  checkCompliance(text: string): boolean {
    const lowerText = text.toLowerCase();
    return !this.prohibitedKeywords.some(keyword => lowerText.includes(keyword));
  }
}

const filter = new EthicalComplianceFilter();

// Gemini API istemcisini oluştur
function getGeminiClient() {
  if (!ENV.geminiApiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
  }
  return new GoogleGenerativeAI(ENV.geminiApiKey);
}

// Kültürel bağlama göre sistem talimatı oluştur
function getSystemInstruction(culturalContext: string): string {
  return `SYSTEM ROLE: You are NEXAI CORE v4.6.0, an expert in Affective Computing and Facial Action Coding System (FACS).

ANALYSIS PROTOCOL (Strict FACS Implementation):
1. Action Unit (AU) Decoding:
   - Identify HAPPINESS (AU6+AU12). Flag "Social Mask" if ONLY AU12.
   - Identify SADNESS (AU1+AU4+AU15).
   - Identify FEAR (AU1+AU2+AU4+AU5+AU20+AU26).
   - Identify CONTEMPT (R12 or R14).
   - Identify ANGER (AU23 - Lip Tightener).
2. Temporal Categorization: Differentiate "Mikro İfade" (fleeting <0.5s) from "Makro İfade".
3. Cultural Calibration (Culture: ${culturalContext}).
4. Ethical Constraints (EU AI Act): No race, politics, or sexual orientation inference.
5. Bayesian Update: Consider previous expressions as prior probabilities.
6. Halo Effect Filter: Physical beauty must not bias personality scoring.

Response Format: Valid JSON following the PersonalityProfile schema.`;
}

export interface ActionUnitInstance {
  unit: string;
  intensity: 'A' | 'B' | 'C' | 'D' | 'E';
  confidence: number;
}

export interface Recommendation {
  title: string;
  creator: string;
  type: 'Film' | 'Kitap' | 'Müzik' | 'Sanat Eseri' | 'Mimari' | 'Felsefi Akım' | 'Deneyim' | 'Şiir' | 'Mekan';
  reasoning: string;
  enneagramAlignment?: string;
  url?: string;
}

export interface PersonalityProfile {
  detectedEmotion: string;
  emotionConfidence: number;
  actionUnits: ActionUnitInstance[];
  temporalCategory: 'Mikro İfade' | 'Makro İfade' | 'Statik';
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
  shadowState: 'Aktif Çatışma' | 'Entegre Benlik';
  enneagramType: string;
  enneagramTitle: string;
  ethicalCompliance: boolean;
  reasoningPath: string;
  analysis: string;
  recommendations: Recommendation[];
}

/**
 * Kullanıcı profilini analiz et
 */
export async function analyzeUserProfile(
  journalText: string,
  riskScore: number,
  culturalContext: string,
  userImageUrl?: string | null,
  baselineImageUrl?: string | null
): Promise<PersonalityProfile> {
  // Etik uyumluluk kontrolü
  if (!filter.checkCompliance(journalText)) {
    throw new Error("Etik Filtresi: İstek yasaklı kategori içermektedir.");
  }

  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    systemInstruction: getSystemInstruction(culturalContext),
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.8,
    },
  });

  // İçerik parçalarını oluştur
  const parts: any[] = [];

  // Baseline görüntü varsa ekle
  if (baselineImageUrl) {
    parts.push({ text: "NEUTRAL BASELINE IMAGE:" });
    parts.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: baselineImageUrl.includes(',') ? baselineImageUrl.split(',')[1] : baselineImageUrl
      }
    });
  }

  // Kullanıcı görüntüsü varsa ekle
  if (userImageUrl) {
    parts.push({ text: "ACTIVE EXPRESSION IMAGE:" });
    parts.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: userImageUrl.includes(',') ? userImageUrl.split(',')[1] : userImageUrl
      }
    });
  }

  // Bağlamsal veri ekle
  parts.push({
    text: `CONTEXTUAL DATA:
Narrative: "${journalText}"
Risk Score (BART): ${riskScore}
Cultural Context: ${culturalContext}

Please analyze this user's psychological profile and return a complete PersonalityProfile JSON object with all fields filled.`
  });

  const result = await model.generateContent(parts);
  const response = result.response;
  const text = response.text();

  let profile: PersonalityProfile;
  try {
    profile = JSON.parse(text);
  } catch (e) {
    throw new Error("Failed to parse Gemini response as JSON");
  }

  // Etik uyumluluk kontrolü - analiz metni
  if (!filter.checkCompliance(profile.analysis || "")) {
    profile.ethicalCompliance = false;
    profile.analysis = "EU AI Act İhlali tespit edildi. Analiz güvenlik nedeniyle kısıtlandı.";
  }

  return profile;
}

/**
 * Öneri için URL ara (Google Search Grounding)
 */
export async function searchRecommendationUrl(query: string): Promise<string | null> {
  try {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
    });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: `Find a URL for: "${query}"` }] }],
      // @ts-ignore - googleSearch tool may not be in current types
      tools: [{ googleSearch: {} }],
    });

    const response = result.response;
    // @ts-ignore - groundingMetadata may not be in types yet
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks && chunks.length > 0) {
      return chunks[0].web?.uri || null;
    }
    return null;
  } catch (e) {
    console.error("Search grounding error:", e);
    return null;
  }
}

/**
 * Analiz metnini sesli olarak oluştur (TTS)
 * Not: Gemini TTS özellikleri henüz SDK'da tam desteklenmediği için şimdilik null döner
 */
export async function generateAnalysisAudio(text: string): Promise<string | null> {
  // TODO: Gemini TTS API stable olduğunda implement edilecek
  return null;
}
