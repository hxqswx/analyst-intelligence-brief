export const weekRange = "May 20 – 27, 2026"
export const publishedAt = "Tuesday, May 27, 2026 · 06:00 UTC"

export const synthesis = {
  topic: "The AI CapEx Reckoning: Is the $500B Infrastructure Bet Paying Off?",
  summary:
    "This week's dominant cross-sector debate converges on a single question: are the trillion-dollar bets on AI infrastructure translating into measurable economic returns — or is the industry building a capital-intensive house of cards? GPT-5's launch and Claude 4's release (AI) demonstrate frontier capability leaps, yet Microsoft and Google face pointed investor pressure over ballooning CapEx with delayed revenue visibility (Finance). Meanwhile, NVIDIA's chip pricing collapse, the EU AI Act's compliance burden, and Apple's on-device AI bet (Technology) all reflect an industry simultaneously at peak excitement and peak scrutiny. The Fed's rate-hold decision is now explicitly linked to AI-driven productivity debates. Whether AI delivers GDP-scale productivity gains — or triggers a correction — is the question every analyst, policymaker, and CFO is stress-testing this week.",
  sectors: ["AI", "Technology", "Finance"],
  debateScore: 97,
}

export const news = [
  {
    id: 1,
    rank: 1,
    category: "AI",
    title: "OpenAI Launches GPT-5: Autonomous Agents Go Mainstream",
    date: "May 22, 2026",
    summary:
      "OpenAI unveiled GPT-5, achieving expert-level performance on 87% of professional licensing exams and introducing native autonomous agent loops — the model can execute multi-day software engineering and research tasks without human checkpoints. Available immediately via API and embedded in Microsoft 365 Copilot.",
    whyItMatters:
      "GPT-5 raises the competitive floor across the entire AI industry, forcing Google, Anthropic, Meta, and Mistral to accelerate roadmaps. Enterprise software companies (Salesforce, ServiceNow, SAP) face existential pressure to integrate or commoditize. NVIDIA inference revenue projections revised upward by 18% by three major banks within 24 hours of launch.",
    impact: "High",
    sources: ["Reuters", "The Verge", "Bloomberg Tech"],
    tags: ["LLM", "Agents", "Enterprise AI", "OpenAI"],
  },
  {
    id: 2,
    rank: 2,
    category: "Finance",
    title: "Federal Reserve Holds Rates at 4.25% — Cites AI Productivity Uncertainty",
    date: "May 21, 2026",
    summary:
      "The FOMC voted 10–2 to hold the federal funds rate at 4.25–4.50%, explicitly noting that AI-driven productivity gains complicate the inflation outlook. Chair Powell stated the Fed is 'studying AI's disinflationary and labor market effects with urgency,' the first time AI was cited as a primary factor in rate deliberations.",
    whyItMatters:
      "The Fed's acknowledgment of AI as a macro variable is a watershed moment. It signals that monetary policy is now entangled with technology sector trajectories. Markets moved sharply: tech stocks rallied 2.1% on rate-hold relief, but bond yields rose on concerns that AI-driven wage displacement may delay the return to 2% inflation. This creates a new policy feedback loop analysts must model.",
    impact: "High",
    sources: ["Wall Street Journal", "Financial Times", "CNBC"],
    tags: ["Federal Reserve", "Monetary Policy", "Macro", "Interest Rates"],
  },
  {
    id: 3,
    rank: 3,
    category: "Technology",
    title: "NVIDIA Blackwell Ultra B300 Begins Mass Shipment; H100 Prices Crater 42%",
    date: "May 20, 2026",
    summary:
      "NVIDIA began mass shipments of Blackwell Ultra B300 GPUs, delivering 3.5× the inference throughput of H100 at comparable power envelopes. Within 48 hours, H100 spot-market prices fell 42% on secondary markets as hyperscalers shifted procurement orders. AMD's MI350 roadmap was accelerated in response.",
    whyItMatters:
      "The GPU pricing collapse reshapes AI infrastructure economics: training costs fall dramatically, but companies holding H100 inventory face write-down risk. For startups, this is transformative — inference-at-scale becomes newly affordable. For NVIDIA, the upgrade cycle drives revenue but also validates the moat; AMD's reactive roadmap shift confirms NVIDIA's architectural lead remains at least 18 months ahead.",
    impact: "High",
    sources: ["Tom's Hardware", "The Register", "Bloomberg"],
    tags: ["Semiconductors", "NVIDIA", "GPU", "Infrastructure"],
  },
  {
    id: 4,
    rank: 4,
    category: "AI",
    title: "EU AI Act General-Purpose AI Tier Enforcement Begins — 340 Enterprises Cited",
    date: "May 23, 2026",
    summary:
      "The European AI Office issued its first enforcement notices under the EU AI Act's GPAI (General-Purpose AI) tier, citing 340 enterprises across 19 countries for inadequate model transparency documentation, missing risk assessments, or failure to register high-risk AI systems. Fines of up to 3% of global annual revenue are on the table.",
    whyItMatters:
      "This marks the transition from AI regulation as theory to AI regulation as material corporate risk. Companies operating in the EU must now treat AI compliance with the same urgency as GDPR. Legal and compliance technology vendors are immediate beneficiaries. For US-based AI companies, EU market access now requires costly certification pipelines, fragmenting the global AI deployment landscape.",
    impact: "High",
    sources: ["Politico Europe", "Reuters", "TechCrunch"],
    tags: ["Regulation", "EU AI Act", "Compliance", "Policy"],
  },
  {
    id: 5,
    rank: 5,
    category: "Finance",
    title: "Big Tech AI CapEx Hits $520B Annualized Rate — Investor Patience Fraying",
    date: "May 20, 2026",
    summary:
      "Combined Q1 2026 earnings filings reveal Microsoft, Google, Meta, and Amazon are on a $520B annualized AI infrastructure spending trajectory. All four companies revised 2026 CapEx guidance upward. However, three of four missed revenue targets linked to AI monetization, sparking analyst downgrades and a 4.3% sector pullback on Monday.",
    whyItMatters:
      "The gap between AI infrastructure investment and AI-attributed revenue is the defining financial tension of 2026. Wall Street's patience — which sustained tech valuations through 2024–25 — is visibly shortening. This creates a bifurcated market: companies with clear AI-to-revenue conversion narratives (NVIDIA, cloud hyperscalers) outperform, while those in 'investment mode' face multiple compression. The CapEx arms race may be approaching a rationalization inflection.",
    impact: "High",
    sources: ["Bloomberg", "Financial Times", "Morgan Stanley Research"],
    tags: ["CapEx", "Big Tech", "Earnings", "Valuation"],
  },
  {
    id: 6,
    rank: 6,
    category: "AI",
    title: "Anthropic Releases Claude 4 Opus: 2M-Token Context, Computer Use 2.0",
    date: "May 24, 2026",
    summary:
      "Anthropic launched Claude 4 Opus with a 2-million-token context window, upgraded computer use capabilities enabling reliable autonomous GUI navigation, and new Constitutional AI 2.0 alignment architecture. The model achieves state-of-the-art on legal document review and scientific literature synthesis benchmarks.",
    whyItMatters:
      "Claude 4 directly competes with GPT-5 for enterprise contracts in regulated industries (legal, pharma, financial services) where safety and explainability are procurement differentiators. Computer use 2.0 enables agentic workflows at scale previously requiring custom RPA tooling. Anthropic's Constitutional AI 2.0 publication also advances the academic debate on AI alignment techniques.",
    impact: "High",
    sources: ["Anthropic Blog", "The Verge", "VentureBeat"],
    tags: ["Anthropic", "Claude", "LLM", "Safety"],
  },
  {
    id: 7,
    rank: 7,
    category: "Technology",
    title: "Apple WWDC 2026: iOS 20 Debuts On-Device GPT-4-Class Intelligence",
    date: "May 26, 2026",
    summary:
      "Apple's WWDC 2026 keynote revealed iOS 20's centerpiece: a new Neural Engine in the A20 chip delivering GPT-4-class inference entirely on-device, with zero data leaving the iPhone. Apple Intelligence 2.0 includes a personal context engine, proactive Siri with multi-app orchestration, and a privacy-preserving API for third-party AI apps.",
    whyItMatters:
      "On-device AI of this caliber fundamentally disrupts the cloud AI service model. Apple's 1.5B active device installed base represents an instant distribution channel for private, latency-free AI — a direct competitive threat to OpenAI, Anthropic, and Google's consumer AI subscriptions. The third-party API also threatens to commoditize AI model providers by making Apple the distribution layer. AAPL surged 6.8% on the day.",
    impact: "High",
    sources: ["9to5Mac", "Bloomberg", "The Information"],
    tags: ["Apple", "On-Device AI", "Privacy", "iOS"],
  },
  {
    id: 8,
    rank: 8,
    category: "Finance",
    title: "Bitcoin Surpasses $158,000 as Institutional AI Treasury Strategies Emerge",
    date: "May 25, 2026",
    summary:
      "Bitcoin reached an all-time high of $158,400 after MicroStrategy, Marathon Digital, and two sovereign wealth funds disclosed combined $12B in new BTC purchases. A new institutional narrative is forming: AI companies and tech firms are treating Bitcoin as a hedge against AI-driven currency debasement and as a reserve asset in AI-to-AI micropayment networks.",
    whyItMatters:
      "The convergence of AI infrastructure economics and crypto treasury strategy is a new market dynamic. If AI-native companies adopt BTC as a reserve asset at scale, it creates structural demand decoupled from speculative retail cycles. Meanwhile, AI-to-AI micropayment use cases (agents paying for compute and data) are accelerating Layer 2 Bitcoin adoption in enterprise settings — a development most traditional finance analysts have not priced in.",
    impact: "Medium",
    sources: ["CoinDesk", "Bloomberg Crypto", "Reuters"],
    tags: ["Bitcoin", "Crypto", "Treasury", "Institutional"],
  },
  {
    id: 9,
    rank: 9,
    category: "Technology",
    title: "Critical Zero-Day in LangChain Framework Exploited in State-Sponsored Supply Chain Attack",
    date: "May 21, 2026",
    summary:
      "CISA issued an emergency directive after a state-sponsored threat actor (attributed to APT41) exploited a critical deserialization vulnerability in LangChain v0.3.x, compromising AI agent pipelines at 47 identified organizations including three defense contractors and a major US bank. Patches were released within 18 hours but exploitation windows remain open for unpatched systems.",
    whyItMatters:
      "This is the first high-profile, state-sponsored attack explicitly targeting AI application infrastructure rather than traditional endpoints. LangChain's position as the dominant AI orchestration framework means the blast radius is uniquely broad. The incident catalyzes AI-specific security tooling as a standalone market category and forces every enterprise with an AI agent deployment to conduct immediate security audits — a significant unplanned cost.",
    impact: "High",
    sources: ["CISA Advisory", "CrowdStrike", "Wired"],
    tags: ["Cybersecurity", "AI Security", "Supply Chain", "APT"],
  },
  {
    id: 10,
    rank: 10,
    category: "AI",
    title: "Google DeepMind AlphaFold 4 Maps Full Human Proteome Interactions",
    date: "May 23, 2026",
    summary:
      "Google DeepMind published AlphaFold 4 in Nature, achieving 94% accuracy in predicting the full human protein-protein interaction network — a biological problem considered unsolvable a decade ago. The model simultaneously outputs predicted drug-binding pockets, reducing pre-clinical drug discovery timelines from 4–6 years to under 18 months in early trials.",
    whyItMatters:
      "AlphaFold 4 is the clearest demonstration to date that AI is delivering transformative, measurable scientific value — not just productivity gains. Pharma stocks (Pfizer, Roche, Moderna) moved 3–8% on the news. This provides powerful political and public narrative ammunition for 'pro-innovation' AI advocates pushing back against EU-style regulation. It also signals that AI's most significant near-term GDP impact may come from healthcare and biotech rather than software productivity.",
    impact: "High",
    sources: ["Nature", "DeepMind Blog", "STAT News"],
    tags: ["DeepMind", "Biotech", "Drug Discovery", "Science"],
  },
]

export const categoryMeta = {
  AI: {
    color: "ai",
    label: "Artificial Intelligence",
    icon: "Brain",
    count: news.filter(n => n.category === "AI").length,
  },
  Technology: {
    color: "tech",
    label: "Technology",
    icon: "Cpu",
    count: news.filter(n => n.category === "Technology").length,
  },
  Finance: {
    color: "fin",
    label: "Finance",
    icon: "TrendingUp",
    count: news.filter(n => n.category === "Finance").length,
  },
}
