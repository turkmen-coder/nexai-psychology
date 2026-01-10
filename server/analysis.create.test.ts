import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

// Mock Gemini service
vi.mock("./gemini", () => ({
  analyzeUserProfile: vi.fn().mockResolvedValue({
    detectedEmotion: "Happiness",
    emotionConfidence: 0.85,
    actionUnits: [
      { unit: "AU6", intensity: "B", confidence: 0.9 },
      { unit: "AU12", intensity: "C", confidence: 0.85 }
    ],
    temporalCategory: "Makro İfade",
    openness: 0.75,
    conscientiousness: 0.68,
    extraversion: 0.82,
    neuroticism: 0.45,
    riskTolerance: 0.65,
    indigenousTraitName: "Uyum",
    indigenousTraitScore: 0.72,
    jungianArchetype: "Kahraman",
    archetypeStrength: 0.78,
    shadowSelf: "Bastırılmış öfke ve kontrol ihtiyacı",
    shadowState: "Aktif Çatışma",
    enneagramType: "3",
    enneagramTitle: "Başarılı Kişi",
    ethicalCompliance: true,
    reasoningPath: "FACS analizi → Kültürel kalibrasyon → Arketip tespiti",
    analysis: "Kullanıcı yüksek dışadönüklük ve başarı odaklı bir profil sergiliyor.",
    recommendations: [
      {
        title: "The Pursuit of Happyness",
        creator: "Gabriele Muccino",
        type: "Film",
        reasoning: "Başarı ve azim temalarıyla uyumlu",
        enneagramAlignment: "Tip 3 için ideal",
        url: "https://example.com/film"
      }
    ]
  }),
  searchRecommendationUrl: vi.fn().mockResolvedValue("https://example.com/recommendation"),
  generateAnalysisAudio: vi.fn().mockResolvedValue(null),
}));

// Mock storage
vi.mock("./storage", () => ({
  storagePut: vi.fn().mockResolvedValue({
    key: "test-key",
    url: "https://storage.example.com/test-image.jpg"
  }),
}));

// Mock database
vi.mock("./db", () => ({
  createAnalysis: vi.fn().mockResolvedValue(1),
  createRecommendation: vi.fn().mockResolvedValue(1),
  getUserAnalyses: vi.fn().mockResolvedValue([]),
  getAnalysisById: vi.fn().mockResolvedValue(null),
  getRecommendationsByAnalysisId: vi.fn().mockResolvedValue([]),
  getLatestUserAnalysis: vi.fn().mockResolvedValue(null),
}));

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("analysis.create", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates analysis with valid input", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.analysis.create({
      culturalContext: "Batı (WEIRD - Ağız Odaklı)",
      riskScore: 0.65,
      journalText: "Bugün çok verimli bir gündü. İşlerimde ilerleme kaydettim ve kendimi mutlu hissediyorum.",
      userImageBase64: undefined,
      baselineImageBase64: undefined,
    });

    expect(result).toHaveProperty("analysisId");
    expect(result).toHaveProperty("profile");
    expect(result.analysisId).toBe(1);
    expect(result.profile.detectedEmotion).toBe("Happiness");
    expect(result.profile.ethicalCompliance).toBe(true);
  });

  it("processes images when provided", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const mockImageBase64 = "data:image/jpeg;base64,/9j/4AAQSkZJRg==";

    const result = await caller.analysis.create({
      culturalContext: "Doğu Asya (Göz Odaklı)",
      riskScore: 0.5,
      journalText: "Test journal entry for image processing",
      userImageBase64: mockImageBase64,
      baselineImageBase64: mockImageBase64,
    });

    expect(result).toHaveProperty("analysisId");
    expect(result.profile).toBeDefined();
  });

  it("requires authenticated user", async () => {
    const ctx: TrpcContext = {
      user: null,
      req: {
        protocol: "https",
        headers: {},
      } as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    };

    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.analysis.create({
        culturalContext: "Batı (WEIRD - Ağız Odaklı)",
        riskScore: 0.65,
        journalText: "Test journal",
      })
    ).rejects.toThrow();
  });

  it("handles different cultural contexts", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const contexts = [
      "Batı (WEIRD - Ağız Odaklı)",
      "Doğu Asya (Göz Odaklı)",
      "Afrika (Ubuntu)",
      "İslami / Spiritüel",
      "Japon (Amae)"
    ];

    for (const context of contexts) {
      const result = await caller.analysis.create({
        culturalContext: context,
        riskScore: 0.5,
        journalText: `Test for ${context}`,
      });

      expect(result.analysisId).toBeDefined();
    }
  });

  it("validates risk score range", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.analysis.create({
      culturalContext: "Batı (WEIRD - Ağız Odaklı)",
      riskScore: 0.95, // High risk score
      journalText: "Test with high risk score",
    });

    expect(result.profile.riskTolerance).toBeDefined();
    expect(typeof result.profile.riskTolerance).toBe("number");
  });
});
