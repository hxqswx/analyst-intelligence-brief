export const weekRange    = "May 20 – 27, 2026"
export const publishedAt  = "Tuesday, May 27, 2026 · 06:00 UTC"

// synthesis ────────────────────────────────────────────────────────────────────
export const synthesis = {
  topic: {
    en: "The AI CapEx Reckoning: Is the $500B Infrastructure Bet Paying Off?",
    zh: "AI 资本支出大考：5000 亿美元的基础设施押注是否物有所值？",
  },
  summary: {
    en: "This week's dominant cross-sector debate converges on a single question: are the trillion-dollar bets on AI infrastructure translating into measurable economic returns — or is the industry building a capital-intensive house of cards? GPT-5's launch and Claude 4's release (AI) demonstrate frontier capability leaps, yet Microsoft and Google face pointed investor pressure over ballooning CapEx with delayed revenue visibility (Finance). Meanwhile, NVIDIA's chip pricing collapse, the EU AI Act's compliance burden, and Apple's on-device AI bet (Technology) all reflect an industry simultaneously at peak excitement and peak scrutiny. The Fed's rate-hold decision is now explicitly linked to AI-driven productivity debates. Whether AI delivers GDP-scale productivity gains — or triggers a correction — is the question every analyst, policymaker, and CFO is stress-testing this week.",
    zh: "本周各行业交汇的核心辩题指向同一个问题：天文数字的 AI 基础设施投资是否正在转化为可衡量的经济回报，还是整个行业正在建造一栋资本密集型的空中楼阁？GPT-5 的发布和 Claude 4 的推出（AI 领域）展示了前沿能力的飞跃，而微软和 Google 却在资本支出飙升、商业化收入可见度迟迟不明的局面下承受着投资者的尖锐质询（金融领域）。与此同时，英伟达芯片价格崩溃、欧盟 AI 法案的合规负担以及苹果的端侧 AI 押注（科技领域），共同描绘出一个行业同时处于巅峰兴奋与巅峰审视之中的图景。美联储维持利率的决定现已明确与 AI 生产力争论挂钩。AI 究竟能否带来 GDP 规模的生产力飞跃，还是会引发市场回调——是每一位分析师、政策制定者和 CFO 本周都在压力测试的终极问题。",
  },
  sectors:      ["AI", "Technology", "Finance"],
  debateScore:  97,
}

// top 10 news ──────────────────────────────────────────────────────────────────
export const news = [
  {
    id: 1, rank: 1,
    category: "AI",
    date: "May 22, 2026",
    impact: "High",
    sources: ["Reuters", "The Verge", "Bloomberg Tech"],
    tags: ["LLM", "Agents", "Enterprise AI", "OpenAI"],
    title: {
      en: "OpenAI Launches GPT-5: Autonomous Agents Go Mainstream",
      zh: "OpenAI 发布 GPT-5：自主智能体正式走向主流",
    },
    summary: {
      en: "OpenAI unveiled GPT-5, achieving expert-level performance on 87% of professional licensing exams and introducing native autonomous agent loops — the model can execute multi-day software engineering and research tasks without human checkpoints. Available immediately via API and embedded in Microsoft 365 Copilot.",
      zh: "OpenAI 发布 GPT-5，在 87% 的专业资格考试中达到专家水平，并原生支持自主智能体循环——模型可在无需人工干预的情况下执行历时数天的软件工程和科研任务。已通过 API 及微软 365 Copilot 立即上线。",
    },
    whyItMatters: {
      en: "GPT-5 raises the competitive floor across the entire AI industry, forcing Google, Anthropic, Meta, and Mistral to accelerate roadmaps. Enterprise software companies (Salesforce, ServiceNow, SAP) face existential pressure to integrate or commoditize. NVIDIA inference revenue projections revised upward by 18% by three major banks within 24 hours of launch.",
      zh: "GPT-5 抬高了整个 AI 行业的竞争底线，迫使 Google、Anthropic、Meta 和 Mistral 加速研发路线图。企业软件公司（Salesforce、ServiceNow、SAP）面临整合或被边缘化的生死抉择。三家大型银行在发布后 24 小时内将英伟达推理收入预测上调 18%。",
    },
  },
  {
    id: 2, rank: 2,
    category: "Finance",
    date: "May 21, 2026",
    impact: "High",
    sources: ["Wall Street Journal", "Financial Times", "CNBC"],
    tags: ["Federal Reserve", "Monetary Policy", "Macro", "Interest Rates"],
    title: {
      en: "Federal Reserve Holds Rates at 4.25% — Cites AI Productivity Uncertainty",
      zh: "美联储维持利率 4.25%——首次将 AI 生产力不确定性纳入决策考量",
    },
    summary: {
      en: "The FOMC voted 10–2 to hold the federal funds rate at 4.25–4.50%, explicitly noting that AI-driven productivity gains complicate the inflation outlook. Chair Powell stated the Fed is 'studying AI's disinflationary and labor market effects with urgency,' the first time AI was cited as a primary factor in rate deliberations.",
      zh: "FOMC 以 10 比 2 票决定将联邦基金利率维持在 4.25%-4.50%，并明确指出 AI 驱动的生产力增长令通胀前景更加复杂。鲍威尔主席表示，美联储正在「紧迫研究 AI 对通缩和劳动力市场的影响」——这是 AI 首次作为利率决议的核心因素被公开提及。",
    },
    whyItMatters: {
      en: "The Fed's acknowledgment of AI as a macro variable is a watershed moment. It signals that monetary policy is now entangled with technology sector trajectories. Markets moved sharply: tech stocks rallied 2.1% on rate-hold relief, but bond yields rose on concerns that AI-driven wage displacement may delay the return to 2% inflation. This creates a new policy feedback loop analysts must model.",
      zh: "美联储将 AI 纳入宏观变量是一个历史性时刻，标志着货币政策与科技行业轨迹深度绑定。市场大幅波动：科技股因维持利率而上涨 2.1%，但债券收益率因 AI 引发工资压缩可能延迟通胀回落 2% 的担忧而走高，形成分析师必须纳入模型的新型政策反馈循环。",
    },
  },
  {
    id: 3, rank: 3,
    category: "Technology",
    date: "May 20, 2026",
    impact: "High",
    sources: ["Tom's Hardware", "The Register", "Bloomberg"],
    tags: ["Semiconductors", "NVIDIA", "GPU", "Infrastructure"],
    title: {
      en: "NVIDIA Blackwell Ultra B300 Begins Mass Shipment; H100 Prices Crater 42%",
      zh: "英伟达 Blackwell Ultra B300 开始量产出货，H100 现货价格暴跌 42%",
    },
    summary: {
      en: "NVIDIA began mass shipments of Blackwell Ultra B300 GPUs, delivering 3.5× the inference throughput of H100 at comparable power envelopes. Within 48 hours, H100 spot-market prices fell 42% on secondary markets as hyperscalers shifted procurement orders. AMD's MI350 roadmap was accelerated in response.",
      zh: "英伟达开始量产出货 Blackwell Ultra B300 GPU，在相近功耗下推理吞吐量是 H100 的 3.5 倍。48 小时内，随着超大规模数据中心运营商调整采购订单，H100 二级市场现货价格暴跌 42%。AMD 随即加速推进 MI350 路线图。",
    },
    whyItMatters: {
      en: "The GPU pricing collapse reshapes AI infrastructure economics: training costs fall dramatically, but companies holding H100 inventory face write-down risk. For startups, this is transformative — inference-at-scale becomes newly affordable. For NVIDIA, the upgrade cycle drives revenue but also validates the moat; AMD's reactive roadmap shift confirms NVIDIA's architectural lead remains at least 18 months ahead.",
      zh: "GPU 价格崩溃重塑 AI 基础设施经济格局：训练成本大幅下降，但持有 H100 库存的企业面临计提减值风险。对初创企业而言，大规模推理成本首次变得可承受。对英伟达而言，升级换代拉动营收的同时也巩固了护城河；AMD 的被动式路线图调整证明英伟达在架构上的领先优势至少仍有 18 个月。",
    },
  },
  {
    id: 4, rank: 4,
    category: "AI",
    date: "May 23, 2026",
    impact: "High",
    sources: ["Politico Europe", "Reuters", "TechCrunch"],
    tags: ["Regulation", "EU AI Act", "Compliance", "Policy"],
    title: {
      en: "EU AI Act General-Purpose AI Tier Enforcement Begins — 340 Enterprises Cited",
      zh: "欧盟 AI 法案通用 AI 条款正式执法，340 家企业首批受罚",
    },
    summary: {
      en: "The European AI Office issued its first enforcement notices under the EU AI Act's GPAI tier, citing 340 enterprises across 19 countries for inadequate model transparency documentation, missing risk assessments, or failure to register high-risk AI systems. Fines of up to 3% of global annual revenue are on the table.",
      zh: "欧洲 AI 办公室向 19 个国家的 340 家企业发出首批执法通知，理由包括：模型透明度文件不完整、风险评估缺失，或未能向监管机构注册高风险 AI 系统。最高处罚上限为全球年营收的 3%。",
    },
    whyItMatters: {
      en: "This marks the transition from AI regulation as theory to AI regulation as material corporate risk. Companies operating in the EU must now treat AI compliance with the same urgency as GDPR. Legal and compliance technology vendors are immediate beneficiaries. For US-based AI companies, EU market access now requires costly certification pipelines, fragmenting the global AI deployment landscape.",
      zh: "这标志着 AI 监管从理论走向实质性企业风险。在欧盟运营的企业现在必须以不亚于 GDPR 的紧迫感对待 AI 合规。法律科技和合规科技公司成为直接受益者。对于美国 AI 企业来说，进入欧盟市场如今需要高成本的认证流程，全球 AI 部署格局由此出现碎片化。",
    },
  },
  {
    id: 5, rank: 5,
    category: "Finance",
    date: "May 20, 2026",
    impact: "High",
    sources: ["Bloomberg", "Financial Times", "Morgan Stanley Research"],
    tags: ["CapEx", "Big Tech", "Earnings", "Valuation"],
    title: {
      en: "Big Tech AI CapEx Hits $520B Annualized Rate — Investor Patience Fraying",
      zh: "大科技公司 AI 基础设施年化支出达 5200 亿美元，投资者耐心开始消退",
    },
    summary: {
      en: "Combined Q1 2026 earnings filings reveal Microsoft, Google, Meta, and Amazon are on a $520B annualized AI infrastructure spending trajectory. All four companies revised 2026 CapEx guidance upward. However, three of four missed revenue targets linked to AI monetization, sparking analyst downgrades and a 4.3% sector pullback on Monday.",
      zh: "微软、Google、Meta 和亚马逊 2026 年一季度财报显示，AI 基础设施年化支出合计达 5200 亿美元，四家公司均上调全年资本支出指引。然而四家中有三家未能完成与 AI 商业化挂钩的收入目标，引发分析师下调评级，相关板块周一跌 4.3%。",
    },
    whyItMatters: {
      en: "The gap between AI infrastructure investment and AI-attributed revenue is the defining financial tension of 2026. Wall Street's patience — which sustained tech valuations through 2024–25 — is visibly shortening. This creates a bifurcated market: companies with clear AI-to-revenue conversion narratives outperform, while those in 'investment mode' face multiple compression. The CapEx arms race may be approaching a rationalization inflection.",
      zh: "AI 基础设施投入与 AI 归因收入之间的差距是 2026 年最核心的财务矛盾。华尔街的耐心——正是它支撑着 2024-25 年的科技估值——正在明显收缩。这造成市场分化：AI 收入转化逻辑清晰的企业跑赢市场，而仍处于「投资期」的企业则面临估值倍数压缩。CapEx 军备竞赛或许正在逼近理性化拐点。",
    },
  },
  {
    id: 6, rank: 6,
    category: "AI",
    date: "May 24, 2026",
    impact: "High",
    sources: ["Anthropic Blog", "The Verge", "VentureBeat"],
    tags: ["Anthropic", "Claude", "LLM", "Safety"],
    title: {
      en: "Anthropic Releases Claude 4 Opus: 2M-Token Context, Computer Use 2.0",
      zh: "Anthropic 发布 Claude 4 Opus：200 万 Token 上下文与电脑操控 2.0",
    },
    summary: {
      en: "Anthropic launched Claude 4 Opus with a 2-million-token context window, upgraded computer use capabilities enabling reliable autonomous GUI navigation, and new Constitutional AI 2.0 alignment architecture. The model achieves state-of-the-art on legal document review and scientific literature synthesis benchmarks.",
      zh: "Anthropic 发布 Claude 4 Opus，支持 200 万 Token 上下文窗口，升级后的电脑操控功能可可靠地自主完成图形界面导航，并引入全新的 Constitutional AI 2.0 对齐架构。该模型在法律文件审查和科学文献综合基准测试中达到业界领先水平。",
    },
    whyItMatters: {
      en: "Claude 4 directly competes with GPT-5 for enterprise contracts in regulated industries (legal, pharma, financial services) where safety and explainability are procurement differentiators. Computer use 2.0 enables agentic workflows at scale previously requiring custom RPA tooling. Anthropic's Constitutional AI 2.0 publication also advances the academic debate on AI alignment techniques.",
      zh: "Claude 4 在强调安全性和可解释性的受监管行业（法律、医药、金融服务）的企业合同争夺中直接挑战 GPT-5。电脑操控 2.0 可大规模实现此前需要定制 RPA 工具才能完成的智能体工作流。Anthropic 同步发表的 Constitutional AI 2.0 论文也推进了学术界关于 AI 对齐技术的前沿辩论。",
    },
  },
  {
    id: 7, rank: 7,
    category: "Technology",
    date: "May 26, 2026",
    impact: "High",
    sources: ["9to5Mac", "Bloomberg", "The Information"],
    tags: ["Apple", "On-Device AI", "Privacy", "iOS"],
    title: {
      en: "Apple WWDC 2026: iOS 20 Debuts On-Device GPT-4-Class Intelligence",
      zh: "苹果 WWDC 2026：iOS 20 推出本地运行的 GPT-4 级端侧 AI",
    },
    summary: {
      en: "Apple's WWDC 2026 keynote revealed iOS 20's centerpiece: a new Neural Engine in the A20 chip delivering GPT-4-class inference entirely on-device, with zero data leaving the iPhone. Apple Intelligence 2.0 includes a personal context engine, proactive Siri with multi-app orchestration, and a privacy-preserving API for third-party AI apps.",
      zh: "苹果 WWDC 2026 主题演讲揭示了 iOS 20 的核心：A20 芯片内置全新神经引擎，可完全在本地实现 GPT-4 级推理，数据无需离开 iPhone。Apple Intelligence 2.0 包含个人情境引擎、具备多应用编排能力的主动式 Siri，以及针对第三方 AI 应用的隐私保护 API。",
    },
    whyItMatters: {
      en: "On-device AI of this caliber fundamentally disrupts the cloud AI service model. Apple's 1.5B active device installed base represents an instant distribution channel for private, latency-free AI — a direct competitive threat to OpenAI, Anthropic, and Google's consumer AI subscriptions. The third-party API also threatens to commoditize AI model providers by making Apple the distribution layer. AAPL surged 6.8% on the day.",
      zh: "这一级别的端侧 AI 从根本上颠覆了云端 AI 服务模式。苹果 15 亿台活跃设备构成无与伦比的即时分发渠道，为私密、低延迟的 AI 服务提供支撑，对 OpenAI、Anthropic 和 Google 的消费级 AI 订阅构成直接威胁。第三方 API 还可能通过让苹果成为分发层而蚕食 AI 模型提供商的价值。AAPL 当日大涨 6.8%。",
    },
  },
  {
    id: 8, rank: 8,
    category: "Finance",
    date: "May 25, 2026",
    impact: "Medium",
    sources: ["CoinDesk", "Bloomberg Crypto", "Reuters"],
    tags: ["Bitcoin", "Crypto", "Treasury", "Institutional"],
    title: {
      en: "Bitcoin Surpasses $158,000 as Institutional AI Treasury Strategies Emerge",
      zh: "比特币突破 15.8 万美元，机构 AI 国库战略初现端倪",
    },
    summary: {
      en: "Bitcoin reached an all-time high of $158,400 after MicroStrategy, Marathon Digital, and two sovereign wealth funds disclosed combined $12B in new BTC purchases. A new institutional narrative is forming: AI companies and tech firms are treating Bitcoin as a hedge against AI-driven currency debasement and as a reserve asset in AI-to-AI micropayment networks.",
      zh: "MicroStrategy、Marathon Digital 以及两家主权财富基金公布合计 120 亿美元的新增比特币购入计划后，比特币触及历史新高 158,400 美元。一种新的机构叙事正在形成：AI 公司和科技企业将比特币视为对冲 AI 引发货币贬值的工具，以及 AI 间微支付网络的储备资产。",
    },
    whyItMatters: {
      en: "The convergence of AI infrastructure economics and crypto treasury strategy is a new market dynamic. If AI-native companies adopt BTC as a reserve asset at scale, it creates structural demand decoupled from speculative retail cycles. Meanwhile, AI-to-AI micropayment use cases are accelerating Layer 2 Bitcoin adoption in enterprise settings — a development most traditional finance analysts have not priced in.",
      zh: "AI 基础设施经济学与加密货币国库战略的交汇是全新的市场动态。若 AI 原生企业大规模将比特币纳入储备资产，将产生脱离零售投机周期的结构性需求。与此同时，AI 间微支付场景（智能体为算力和数据付费）正在加速推动比特币 Layer 2 在企业场景的采用——这是大多数传统金融分析师尚未定价的发展趋势。",
    },
  },
  {
    id: 9, rank: 9,
    category: "Technology",
    date: "May 21, 2026",
    impact: "High",
    sources: ["CISA Advisory", "CrowdStrike", "Wired"],
    tags: ["Cybersecurity", "AI Security", "Supply Chain", "APT"],
    title: {
      en: "Critical Zero-Day in LangChain Framework Exploited in State-Sponsored Supply Chain Attack",
      zh: "LangChain 框架遭国家级黑客利用关键零日漏洞发动供应链攻击",
    },
    summary: {
      en: "CISA issued an emergency directive after a state-sponsored threat actor (attributed to APT41) exploited a critical deserialization vulnerability in LangChain v0.3.x, compromising AI agent pipelines at 47 identified organizations including three defense contractors and a major US bank. Patches were released within 18 hours but exploitation windows remain open for unpatched systems.",
      zh: "CISA 发布紧急指令，指出国家级威胁行为者（归因为 APT41）利用 LangChain v0.3.x 版本中的严重反序列化漏洞，入侵了 47 个已确认机构的 AI 智能体管道，包括三家国防承包商和一家大型美国银行。补丁在 18 小时内发布，但未打补丁系统的利用窗口仍然存在。",
    },
    whyItMatters: {
      en: "This is the first high-profile, state-sponsored attack explicitly targeting AI application infrastructure rather than traditional endpoints. LangChain's position as the dominant AI orchestration framework means the blast radius is uniquely broad. The incident catalyzes AI-specific security tooling as a standalone market category and forces every enterprise with an AI agent deployment to conduct immediate security audits — a significant unplanned cost.",
      zh: "这是首次有高知名度、国家级支持的攻击明确以 AI 应用基础设施而非传统终端为目标。LangChain 作为主流 AI 编排框架的地位使得此次攻击的波及范围尤为广泛。此事件将 AI 专属安全工具推上独立市场品类的轨道，也迫使所有已部署 AI 智能体的企业立即开展安全审计——这是一笔重大的计划外支出。",
    },
  },
  {
    id: 10, rank: 10,
    category: "AI",
    date: "May 23, 2026",
    impact: "High",
    sources: ["Nature", "DeepMind Blog", "STAT News"],
    tags: ["DeepMind", "Biotech", "Drug Discovery", "Science"],
    title: {
      en: "Google DeepMind AlphaFold 4 Maps Full Human Proteome Interactions",
      zh: "谷歌 DeepMind AlphaFold 4 绘制完整人类蛋白质组互作图谱",
    },
    summary: {
      en: "Google DeepMind published AlphaFold 4 in Nature, achieving 94% accuracy in predicting the full human protein-protein interaction network — a biological problem considered unsolvable a decade ago. The model simultaneously outputs predicted drug-binding pockets, reducing pre-clinical drug discovery timelines from 4–6 years to under 18 months in early trials.",
      zh: "谷歌 DeepMind 在《自然》杂志发表 AlphaFold 4，在预测完整人类蛋白质-蛋白质相互作用网络方面达到 94% 的准确率——这一生物学难题十年前被认为无法解决。该模型同时输出预测的药物结合口袋，在早期试验中将临床前药物发现周期从 4-6 年压缩至 18 个月以内。",
    },
    whyItMatters: {
      en: "AlphaFold 4 is the clearest demonstration to date that AI is delivering transformative, measurable scientific value — not just productivity gains. Pharma stocks (Pfizer, Roche, Moderna) moved 3–8% on the news. This provides powerful narrative ammunition for pro-innovation AI advocates pushing back against EU-style regulation. It also signals that AI's most significant near-term GDP impact may come from healthcare and biotech rather than software productivity.",
      zh: "AlphaFold 4 是迄今为止 AI 带来可量化、可变革科学价值最清晰的证明——而非仅仅是生产力提升。大型药企股票（辉瑞、罗氏、Moderna）因此消息上涨 3-8%。此成果为推动「创新优先」的 AI 倡导者提供了有力的政治和公众叙事弹药，以抵制欧盟式监管。它还预示着 AI 在近期内最显著的 GDP 影响可能来自医疗健康和生物技术，而非软件生产力。",
    },
  },
]

// derived counts ───────────────────────────────────────────────────────────────
export const categoryMeta = {
  AI:         { count: news.filter(n => n.category === "AI").length },
  Technology: { count: news.filter(n => n.category === "Technology").length },
  Finance:    { count: news.filter(n => n.category === "Finance").length },
}
