# 🧠 NexAI - AI-Powered Psychological Analysis Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61dafb)](https://reactjs.org/)
[![tRPC](https://img.shields.io/badge/tRPC-11.6-398ccb)](https://trpc.io/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

> **AI-powered psychological analysis and personality profiling platform** - Facial expression analysis, risk tolerance measurement, and cultural calibration system powered by Google Gemini.

## 🌟 Features

### 🎭 Personality Analysis
- **Big Five (OCEAN)**: Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism
- **MBTI Profiling**: 16 personality type analysis
- **Jung Archetypes**: Deep psychological profiling
- **Enneagram**: 9 core personality types

### 🎯 Risk Tolerance Measurement
- **BART (Balloon Analogue Risk Task)**: Balloon analogue risk task
- **Real-time risk profile**: Decision-making behavior analysis
- **Cultural calibration**: Western, Eastern, African frameworks

### 📸 Facial Expression Analysis
- **Google Gemini 3 integration**: Visual psychological analysis
- **Emotion recognition**: Emotion detection from facial expressions
- **Micro-expression analysis**: Evaluation of subconscious reactions

### 🌍 Multi-Cultural Support
- **Western culture**: Individualism-focused analysis
- **Eastern culture**: Collectivist values perspective
- **African culture**: Ubuntu philosophy framework

### 🎨 Modern Interface
- **Responsive design**: Mobile and desktop compatible
- **Dark/Light mode**: User preference-based theme
- **Interactive tests**: User-friendly test experience
- **Real-time results**: Instant analysis and feedback

## 🏗️ Technology Stack

| Category | Technology |
|----------|-----------|
| Frontend | React 19 + Tailwind CSS 4 + Wouter |
| Backend | Express 4 + tRPC 11 |
| Database | MySQL/TiDB + Drizzle ORM |
| AI Engine | Google Gemini 3 |
| Auth | Manus OAuth |
| Build | Vite |

## 🚀 Installation

### Requirements

- Node.js 22+
- pnpm 10+
- MySQL 8+ (or Manus built-in database)
- Google Gemini API key

### Steps

```bash
# Clone the repository
git clone https://github.com/turkmen-coder/nexai.git
cd nexai

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env file

# Create database schema
pnpm db:push

# Start development server
pnpm dev
```

### Environment Variables

```env
# Database
DATABASE_URL=mysql://user:password@host:port/database

# Authentication (Manus OAuth)
JWT_SECRET=your-secret
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im

# Google Gemini
GEMINI_API_KEY=your-gemini-api-key
```

## 📖 Usage

### For End Users

1. **Sign In**: Authenticate with Manus OAuth
2. **Select Test**: Big Five, MBTI, BART, or Facial Analysis
3. **Complete Test**: Answer questions or upload images
4. **Review Results**: View detailed psychological profile report
5. **Cultural Context**: Evaluate results from different cultural perspectives

### For Developers

```typescript
// Example: Personality analysis
const { data: profile } = trpc.analysis.analyzePersonality.useQuery({
  responses: userResponses,
  culturalContext: "western"
});

// Example: Facial expression analysis
const { mutate: analyzeImage } = trpc.gemini.analyzeFacialExpression.useMutation();

analyzeImage({
  imageData: base64Image,
  analysisType: "emotion"
});
```

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test server/services/analysis.test.ts

# Watch mode
pnpm test --watch
```

## 📊 Project Structure

```
nexai/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable UI components
│   │   ├── lib/           # tRPC client
│   │   └── index.css      # Main CSS
├── server/                # Backend Express + tRPC
│   ├── services/          # Business logic
│   │   ├── analysis.ts    # Psychological analysis
│   │   ├── gemini.ts      # Google Gemini integration
│   │   └── cultural.ts    # Cultural calibration
│   ├── routers.ts         # tRPC API routes
│   └── db.ts              # Database queries
├── drizzle/               # Database schema
│   └── schema.ts
└── shared/                # Shared types and constants
```

## 🔒 Security and Privacy

- **GDPR Compliant**: Users own their data
- **Transparent AI**: Explanations for all decisions
- **Data Minimization**: Only collect what's necessary
- **Right to Forget**: Users can delete all data
- **Anonymization**: Sensitive data is anonymized

## 🗺️ Roadmap

### Phase 1: Foundation (✅ Complete)
- [x] Big Five personality analysis
- [x] BART risk test
- [x] Google Gemini integration
- [x] Basic UI and theme

### Phase 2: Advanced Features (🚧 In Progress)
- [ ] MBTI and Enneagram tests
- [ ] Advanced facial expression analysis
- [ ] Cultural calibration system
- [ ] PDF report generation

### Phase 3: Expansion (📅 Planned)
- [ ] Group analysis features
- [ ] Longitudinal tracking system
- [ ] Mobile app (React Native)
- [ ] API integrations

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) first.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Manus Platform** - Infrastructure and OAuth
- **Google Gemini** - AI analysis engine
- **Drizzle ORM** - Type-safe database queries
- **tRPC** - End-to-end typesafe APIs
- **Tailwind CSS** - Utility-first styling

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/turkmen-coder/nexai/issues)
- **Email**: support@nexai.app

---

**Built with ❤️ and passion for AI and Psychology**

*"Self-knowledge meets the power of artificial intelligence."*
