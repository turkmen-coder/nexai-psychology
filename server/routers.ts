import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { 
  createAnalysis, 
  getUserAnalyses, 
  getAnalysisById,
  createRecommendation,
  getRecommendationsByAnalysisId,
  getLatestUserAnalysis
} from "./db";
import { 
  analyzeUserProfile, 
  searchRecommendationUrl,
  generateAnalysisAudio,
  type PersonalityProfile 
} from "./gemini";
import { storagePut } from "./storage";

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  analysis: router({
    /**
     * Yeni analiz oluştur
     */
    create: protectedProcedure
      .input(z.object({
        culturalContext: z.string(),
        riskScore: z.number(),
        journalText: z.string(),
        userImageBase64: z.string().optional(),
        baselineImageBase64: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const userId = ctx.user.id;

        // Görselleri S3'e yükle
        let userImageUrl: string | null = null;
        let baselineImageUrl: string | null = null;

        if (input.userImageBase64) {
          const imageData = input.userImageBase64.includes(',') 
            ? input.userImageBase64.split(',')[1] 
            : input.userImageBase64;
          const buffer = Buffer.from(imageData, 'base64');
          const key = `analyses/${userId}/${Date.now()}-user.jpg`;
          const result = await storagePut(key, buffer, 'image/jpeg');
          userImageUrl = result.url;
        }

        if (input.baselineImageBase64) {
          const imageData = input.baselineImageBase64.includes(',') 
            ? input.baselineImageBase64.split(',')[1] 
            : input.baselineImageBase64;
          const buffer = Buffer.from(imageData, 'base64');
          const key = `analyses/${userId}/${Date.now()}-baseline.jpg`;
          const result = await storagePut(key, buffer, 'image/jpeg');
          baselineImageUrl = result.url;
        }

        // Gemini ile analiz yap
        const profile: PersonalityProfile = await analyzeUserProfile(
          input.journalText,
          input.riskScore,
          input.culturalContext,
          userImageUrl,
          baselineImageUrl
        );

        // Analizi veritabanına kaydet
        const analysisId = await createAnalysis({
          userId,
          culturalContext: input.culturalContext,
          riskScore: input.riskScore,
          journalText: input.journalText,
          userImageUrl,
          baselineImageUrl,
          detectedEmotion: profile.detectedEmotion,
          emotionConfidence: profile.emotionConfidence,
          openness: profile.openness,
          conscientiousness: profile.conscientiousness,
          extraversion: profile.extraversion,
          neuroticism: profile.neuroticism,
          riskTolerance: profile.riskTolerance,
          jungianArchetype: profile.jungianArchetype,
          archetypeStrength: profile.archetypeStrength,
          enneagramType: profile.enneagramType,
          enneagramTitle: profile.enneagramTitle,
          shadowSelf: profile.shadowSelf,
          shadowState: profile.shadowState,
          indigenousTraitName: profile.indigenousTraitName,
          indigenousTraitScore: profile.indigenousTraitScore,
          temporalCategory: profile.temporalCategory,
          ethicalCompliance: profile.ethicalCompliance,
          reasoningPath: profile.reasoningPath,
          analysis: profile.analysis,
          actionUnits: profile.actionUnits,
        });

        // Önerileri kaydet
        for (const rec of profile.recommendations) {
          // URL'leri Google Search ile doğrula
          const url = rec.url || await searchRecommendationUrl(`${rec.title} ${rec.creator}`);
          
          await createRecommendation({
            analysisId,
            title: rec.title,
            creator: rec.creator,
            type: rec.type,
            reasoning: rec.reasoning,
            enneagramAlignment: rec.enneagramAlignment,
            url,
          });
        }

        return {
          analysisId,
          profile,
        };
      }),

    /**
     * Kullanıcının tüm analizlerini getir
     */
    list: protectedProcedure.query(async ({ ctx }) => {
      return getUserAnalyses(ctx.user.id);
    }),

    /**
     * Belirli bir analizi detaylarıyla getir
     */
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const analysis = await getAnalysisById(input.id);
        if (!analysis) {
          throw new Error("Analysis not found");
        }

        const recommendations = await getRecommendationsByAnalysisId(input.id);
        
        return {
          ...analysis,
          recommendations,
        };
      }),

    /**
     * Son analizi getir
     */
    getLatest: protectedProcedure.query(async ({ ctx }) => {
      const analysis = await getLatestUserAnalysis(ctx.user.id);
      if (!analysis) {
        return null;
      }

      const recommendations = await getRecommendationsByAnalysisId(analysis.id);
      
      return {
        ...analysis,
        recommendations,
      };
    }),

    /**
     * Analiz metnini sesli olarak oluştur
     */
    generateAudio: protectedProcedure
      .input(z.object({ text: z.string() }))
      .mutation(async ({ input }) => {
        const audioData = await generateAnalysisAudio(input.text);
        return { audioData };
      }),
  }),
});

export type AppRouter = typeof appRouter;
