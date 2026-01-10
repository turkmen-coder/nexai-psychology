import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, float, json, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Analysis table - stores psychological profile analysis results
 */
export const analyses = mysqlTable("analyses", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  culturalContext: varchar("culturalContext", { length: 64 }).notNull(),
  riskScore: float("riskScore").notNull(),
  journalText: text("journalText").notNull(),
  userImageUrl: text("userImageUrl"),
  baselineImageUrl: text("baselineImageUrl"),
  
  // Personality traits
  detectedEmotion: varchar("detectedEmotion", { length: 64 }),
  emotionConfidence: float("emotionConfidence"),
  openness: float("openness"),
  conscientiousness: float("conscientiousness"),
  extraversion: float("extraversion"),
  neuroticism: float("neuroticism"),
  riskTolerance: float("riskTolerance"),
  
  // Archetypes and types
  jungianArchetype: varchar("jungianArchetype", { length: 128 }),
  archetypeStrength: float("archetypeStrength"),
  enneagramType: varchar("enneagramType", { length: 32 }),
  enneagramTitle: varchar("enneagramTitle", { length: 128 }),
  
  // Shadow analysis
  shadowSelf: text("shadowSelf"),
  shadowState: varchar("shadowState", { length: 64 }),
  indigenousTraitName: varchar("indigenousTraitName", { length: 128 }),
  indigenousTraitScore: float("indigenousTraitScore"),
  
  // Analysis metadata
  temporalCategory: varchar("temporalCategory", { length: 64 }),
  ethicalCompliance: boolean("ethicalCompliance").default(true),
  reasoningPath: text("reasoningPath"),
  analysis: text("analysis"),
  
  // Action units stored as JSON
  actionUnits: json("actionUnits"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Analysis = typeof analyses.$inferSelect;
export type InsertAnalysis = typeof analyses.$inferInsert;

/**
 * Recommendations table - stores content recommendations for each analysis
 */
export const recommendations = mysqlTable("recommendations", {
  id: int("id").autoincrement().primaryKey(),
  analysisId: int("analysisId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  creator: varchar("creator", { length: 255 }),
  type: varchar("type", { length: 64 }).notNull(),
  reasoning: text("reasoning"),
  enneagramAlignment: varchar("enneagramAlignment", { length: 128 }),
  url: text("url"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Recommendation = typeof recommendations.$inferSelect;
export type InsertRecommendation = typeof recommendations.$inferInsert;
