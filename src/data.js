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

// ── China news ─────────────────────────────────────────────────────────────────
export const chinaNews = [
  {
    id: 11, rank: 1,
    category: "AI",
    region: "china",
    date: "May 22, 2026",
    impact: "High",
    sources: [
      { name: "36氪",     url: "https://36kr.com" },
      { name: "机器之心", url: "https://jiqizhixin.com" },
      { name: "SCMP",     url: "https://scmp.com" },
    ],
    tags: ["DeepSeek", "开源", "LLM", "MoE"],
    title: {
      en: "DeepSeek V4 Open-Sources 685B MoE Model, Rivals GPT-5 at 1% of the Cost",
      zh: "DeepSeek V4 开源 6850 亿 MoE 模型，成本仅为 GPT-5 的 1%",
    },
    summary: {
      en: "DeepSeek released V4, a 685B parameter Mixture-of-Experts model trained for under $3M — roughly 1% of GPT-5's estimated compute budget. The model achieves comparable performance on coding, math, and reasoning benchmarks and is fully open-sourced. Within 48 hours, over 200,000 developers forked the weights globally.",
      zh: "DeepSeek 发布 V4，这是一个 6850 亿参数的混合专家模型，训练成本不足 300 万美元——约为 GPT-5 估算算力成本的 1%。该模型在编码、数学和推理基准测试中达到可比水平，并完全开源。48 小时内，全球逾 20 万名开发者下载了模型权重。",
    },
    whyItMatters: {
      en: "DeepSeek V4 is the most direct challenge yet to the premise that frontier AI requires massive capital concentration. Its cost efficiency undermines the CapEx moat narrative of US hyperscalers and validates China's 'efficient scaling' research direction. For US policymakers, it complicates chip export control strategy: restricted hardware didn't prevent frontier capability development.",
      zh: "DeepSeek V4 是迄今对「前沿 AI 需要大量资本集中」这一前提最直接的挑战。其成本效益颠覆了美国超大规模云厂商资本支出护城河的叙事，并验证了中国「高效扩展」研究方向。对美国政策制定者而言，这使芯片出口管制战略更加复杂：受限算力并未阻止前沿能力的发展。",
    },
  },
  {
    id: 12, rank: 2,
    category: "AI",
    region: "china",
    date: "May 21, 2026",
    impact: "High",
    sources: [
      { name: "新浪科技", url: "https://tech.sina.com.cn" },
      { name: "钛媒体",   url: "https://tmtpost.com" },
      { name: "Bloomberg",url: "https://bloomberg.com" },
    ],
    tags: ["百度", "文心大模型", "端云一体", "商业化"],
    title: {
      en: "Baidu ERNIE 5.0 Launches Unified Cloud-Edge Deployment — 430 Enterprise Clients",
      zh: "百度文心大模型 5.0 发布端云一体化方案，企业客户突破 430 家",
    },
    summary: {
      en: "Baidu unveiled ERNIE 5.0 with a new unified cloud-edge architecture that allows the same model to run across data centers, edge servers, and devices. The company announced 430 enterprise customers deploying ERNIE in production — a 3× increase from Q4 2025 — across manufacturing automation, financial risk management, and healthcare diagnostics.",
      zh: "百度发布文心大模型 5.0，采用全新端云一体化架构，同一模型可跨数据中心、边缘服务器和终端设备部署运行。公司宣布企业客户数突破 430 家，较 2025 年四季度增长 3 倍，覆盖制造业自动化、金融风险管理和医疗诊断等领域。",
    },
    whyItMatters: {
      en: "Baidu's enterprise deployment numbers signal that Chinese AI is crossing the chasm from demonstrations to revenue-generating production — a gap analysts have long doubted. ERNIE's edge deployment capability addresses China's data sovereignty requirements that prevent many enterprises from using US cloud AI. For investors, the trajectory finally provides evidence for Baidu's AI transformation thesis.",
      zh: "百度的企业部署数据表明，中国 AI 正在跨越从演示到产生收入生产部署之间的鸿沟。文心模型的端侧部署能力满足了中国数据主权要求，而这些要求阻止了许多企业使用美国云 AI 服务。对投资者而言，这一收入轨迹终于为百度 AI 转型逻辑提供了佐证。",
    },
  },
  {
    id: 13, rank: 3,
    category: "Technology",
    region: "china",
    date: "May 24, 2026",
    impact: "High",
    sources: [
      { name: "腾讯科技",       url: "https://tech.qq.com" },
      { name: "财新网",         url: "https://caixin.com" },
      { name: "The Information",url: "https://www.theinformation.com" },
    ],
    tags: ["腾讯", "混元", "微信", "AI生态"],
    title: {
      en: "Tencent Hunyuan Fully Integrated Into WeChat — 3 Billion Monthly Active AI Calls",
      zh: "腾讯混元全面融入微信生态，月活跃 AI 调用量突破 30 亿次",
    },
    summary: {
      en: "Tencent announced that Hunyuan AI is now deeply embedded across WeChat — search, mini-programs, official accounts, and payments — recording 3 billion monthly active API calls. WeChat's 1.35 billion monthly active users now interact with AI-powered features without explicit awareness of the underlying model.",
      zh: "腾讯宣布混元 AI 已深度嵌入微信全生态——搜索、小程序、公众号和支付——月活跃 API 调用量突破 30 亿次。微信 13.5 亿月活用户现在在无感知的情况下与 AI 功能进行交互，无需了解底层模型。",
    },
    whyItMatters: {
      en: "WeChat is arguably the world's most important digital platform by daily active engagement. Hunyuan's invisible integration means Tencent has achieved AI distribution at a scale rivalling Apple's iOS 20 announcement — without the fanfare. This 'silent AI rollout' model may become the dominant global pattern: embedded, contextual, and invisible rather than subscription-based.",
      zh: "按日活跃度衡量，微信可以说是全球最重要的数字平台。混元的无感知整合意味着腾讯在 AI 分发规模上已可比肩苹果 iOS 20 的发布——却未获同等关注。这种「静默式 AI 推送」模式可能成为全球主导的部署模式：嵌入式、情境化、无感知，而非订阅制。",
    },
  },
  {
    id: 14, rank: 4,
    category: "AI",
    region: "china",
    date: "May 20, 2026",
    impact: "Medium",
    sources: [
      { name: "工信部官网",  url: "https://miit.gov.cn" },
      { name: "人民日报",   url: "https://people.com.cn" },
      { name: "Reuters",   url: "https://reuters.com" },
    ],
    tags: ["工信部", "AI监管", "行业规范", "政策"],
    title: {
      en: "MIIT Releases Binding LLM Industry Standards — Finance and Healthcare First",
      zh: "工信部发布大模型行业应用强制规范，金融与医疗率先落地",
    },
    summary: {
      en: "China's MIIT published binding technical standards for LLM deployment in regulated industries, with finance and healthcare as the first sectors. The standards require domestic model certification, output audit trails, and AI content watermarking. The framework applies to all models serving more than 1 million users in China, covering both domestic and foreign AI providers.",
      zh: "工业和信息化部发布受监管行业大模型部署强制性技术规范，金融和医疗健康为首批落地行业。规范要求国内模型认证、输出内容审计追踪及 AI 内容水印。该框架适用于在中国服务超过 100 万用户的所有模型，涵盖国内外 AI 提供商。",
    },
    whyItMatters: {
      en: "China's binding AI standards — arriving 6 months before the EU's equivalent enforcement — represent a different regulatory philosophy: prescriptive technical standards rather than risk-tiered principles. Foreign AI providers face a binary choice: comply with China's certification regime (including source code review) or exit the market. Domestic players (Baidu, Huawei, Alibaba Cloud) are structurally advantaged. This accelerates global AI supply chain bifurcation.",
      zh: "中国的 AI 强制规范——比欧盟等效执法早 6 个月——代表着不同的监管哲学：规定性技术标准而非风险分级原则。外国 AI 提供商面临二选一：遵守中国认证制度（包括源代码审查）或退出市场。国内企业（百度、华为、阿里云）具有结构性优势。这进一步加速全球 AI 供应链分裂。",
    },
  },
  {
    id: 15, rank: 5,
    category: "Finance",
    region: "china",
    date: "May 26, 2026",
    impact: "Medium",
    sources: [
      { name: "Wind 资讯", url: "https://wind.com.cn" },
      { name: "证券时报",  url: "https://stcn.com" },
      { name: "Financial Times", url: "https://ft.com" },
    ],
    tags: ["A股", "算力", "AI概念股", "北向资金"],
    title: {
      en: "China A-Share AI Infrastructure Sector Surges 8.3% Weekly — Foreign Inflows Accelerate",
      zh: "A 股 AI 算力板块单周涨幅 8.3%，北向资金加速流入",
    },
    summary: {
      en: "China's A-share AI infrastructure sector posted an 8.3% weekly gain, led by domestic GPU chipmakers Cambricon, Biren, and Horizon Robotics. Northbound capital flows via Stock Connect reached a weekly high of ¥18.7B as foreign institutional investors rapidly increased exposure to China's domestic AI ecosystem following DeepSeek V4's release and the MIIT regulatory framework.",
      zh: "中国 A 股 AI 基础设施板块单周上涨 8.3%，国产 GPU 芯片商寒武纪、壁仞科技和地平线机器人领涨。沪深港通北向资金周净流入创阶段新高达 187 亿元，外资机构在 DeepSeek V4 发布和工信部规范出台后快速加仓中国 AI 生态。",
    },
    whyItMatters: {
      en: "Foreign capital re-rating China's domestic AI semiconductor sector is a significant shift after years of geopolitical risk underweight. The confluence of domestic model capability validation (DeepSeek V4) and policy clarity (MIIT standards) is resolving key investment uncertainties. China's AI infrastructure stocks now offer global portfolio managers a credible alternative to the US AI trade at lower valuations with domestic policy tailwinds.",
      zh: "在多年地缘政治风险导致仓位低配之后，外资重新评估中国 AI 半导体板块是重大转变。国内模型能力验证（DeepSeek V4）与政策明确性（工信部规范）的双重汇合，正在消除关键投资不确定性。中国 AI 基础设施股票现在以更低估值和国内政策顺风，为全球组合经理提供对标美国 AI 交易的可信替代选项。",
    },
  },
]

// ── Overseas news ──────────────────────────────────────────────────────────────
export const overseasNews = [
  {
    id: 1, rank: 1,
    category: "AI",
    region: "overseas",
    date: "May 22, 2026",
    impact: "High",
    sources: [
      { name: "Reuters",        url: "https://reuters.com/technology" },
      { name: "The Verge",      url: "https://theverge.com" },
      { name: "Bloomberg Tech", url: "https://bloomberg.com/technology" },
    ],
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
    region: "overseas",
    date: "May 21, 2026",
    impact: "High",
    sources: [
      { name: "Wall Street Journal", url: "https://wsj.com" },
      { name: "Financial Times",     url: "https://ft.com" },
      { name: "CNBC",                url: "https://cnbc.com" },
    ],
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
      en: "The Fed's acknowledgment of AI as a macro variable is a watershed moment. It signals that monetary policy is now entangled with technology sector trajectories. Markets moved sharply: tech stocks rallied 2.1% on rate-hold relief, but bond yields rose on concerns that AI-driven wage displacement may delay the return to 2% inflation.",
      zh: "美联储将 AI 纳入宏观变量是一个历史性时刻，标志着货币政策与科技行业轨迹深度绑定。市场大幅波动：科技股因维持利率而上涨 2.1%，但债券收益率因 AI 引发工资压缩可能延迟通胀回落 2% 的担忧而走高。",
    },
  },
  {
    id: 3, rank: 3,
    category: "Technology",
    region: "overseas",
    date: "May 20, 2026",
    impact: "High",
    sources: [
      { name: "Tom's Hardware", url: "https://www.tomshardware.com" },
      { name: "The Register",   url: "https://www.theregister.com" },
      { name: "Bloomberg",      url: "https://bloomberg.com" },
    ],
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
      en: "The GPU pricing collapse reshapes AI infrastructure economics: training costs fall dramatically, but companies holding H100 inventory face write-down risk. For startups, inference-at-scale becomes newly affordable. For NVIDIA, the upgrade cycle drives revenue but also validates the moat; AMD's reactive roadmap shift confirms NVIDIA's architectural lead remains at least 18 months ahead.",
      zh: "GPU 价格崩溃重塑 AI 基础设施经济格局：训练成本大幅下降，但持有 H100 库存的企业面临计提减值风险。对初创企业而言，大规模推理成本首次变得可承受。AMD 的被动式路线图调整证明英伟达在架构上的领先优势至少仍有 18 个月。",
    },
  },
  {
    id: 4, rank: 4,
    category: "AI",
    region: "overseas",
    date: "May 23, 2026",
    impact: "High",
    sources: [
      { name: "Politico Europe", url: "https://www.politico.eu" },
      { name: "Reuters",         url: "https://reuters.com" },
      { name: "TechCrunch",      url: "https://techcrunch.com" },
    ],
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
      en: "This marks the transition from AI regulation as theory to material corporate risk. Companies operating in the EU must now treat AI compliance with the same urgency as GDPR. For US-based AI companies, EU market access now requires costly certification pipelines, fragmenting the global AI deployment landscape.",
      zh: "这标志着 AI 监管从理论走向实质性企业风险。在欧盟运营的企业现在必须以不亚于 GDPR 的紧迫感对待 AI 合规。对美国 AI 企业来说，进入欧盟市场如今需要高成本的认证流程，全球 AI 部署格局由此出现碎片化。",
    },
  },
  {
    id: 5, rank: 5,
    category: "Finance",
    region: "overseas",
    date: "May 20, 2026",
    impact: "High",
    sources: [
      { name: "Bloomberg",               url: "https://bloomberg.com" },
      { name: "Financial Times",         url: "https://ft.com" },
      { name: "Morgan Stanley Research", url: "https://www.morganstanley.com/ideas" },
    ],
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
      en: "The gap between AI infrastructure investment and AI-attributed revenue is the defining financial tension of 2026. Wall Street's patience — which sustained tech valuations through 2024–25 — is visibly shortening. This creates a bifurcated market: companies with clear AI-to-revenue conversion narratives outperform, while those in 'investment mode' face multiple compression.",
      zh: "AI 基础设施投入与 AI 归因收入之间的差距是 2026 年最核心的财务矛盾。华尔街的耐心——正是它支撑着 2024-25 年的科技估值——正在明显收缩。这造成市场分化：AI 收入转化逻辑清晰的企业跑赢市场，而仍处于「投资期」的企业则面临估值倍数压缩。",
    },
  },
  {
    id: 6, rank: 6,
    category: "AI",
    region: "overseas",
    date: "May 24, 2026",
    impact: "High",
    sources: [
      { name: "Anthropic Blog", url: "https://anthropic.com/news" },
      { name: "The Verge",      url: "https://theverge.com" },
      { name: "VentureBeat",    url: "https://venturebeat.com" },
    ],
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
      en: "Claude 4 directly competes with GPT-5 for enterprise contracts in regulated industries (legal, pharma, financial services) where safety and explainability are procurement differentiators. Computer use 2.0 enables agentic workflows at scale previously requiring custom RPA tooling.",
      zh: "Claude 4 在强调安全性和可解释性的受监管行业（法律、医药、金融服务）的企业合同争夺中直接挑战 GPT-5。电脑操控 2.0 可大规模实现此前需要定制 RPA 工具才能完成的智能体工作流。",
    },
  },
  {
    id: 7, rank: 7,
    category: "Technology",
    region: "overseas",
    date: "May 26, 2026",
    impact: "High",
    sources: [
      { name: "9to5Mac",         url: "https://9to5mac.com" },
      { name: "Bloomberg",       url: "https://bloomberg.com" },
      { name: "The Information", url: "https://www.theinformation.com" },
    ],
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
      en: "On-device AI of this caliber fundamentally disrupts the cloud AI service model. Apple's 1.5B active device installed base represents an instant distribution channel for private, latency-free AI — a direct competitive threat to OpenAI, Anthropic, and Google's consumer AI subscriptions. AAPL surged 6.8% on the day.",
      zh: "这一级别的端侧 AI 从根本上颠覆了云端 AI 服务模式。苹果 15 亿台活跃设备构成无与伦比的即时分发渠道，对 OpenAI、Anthropic 和 Google 的消费级 AI 订阅构成直接威胁。AAPL 当日大涨 6.8%。",
    },
  },
  {
    id: 8, rank: 8,
    category: "Finance",
    region: "overseas",
    date: "May 25, 2026",
    impact: "Medium",
    sources: [
      { name: "CoinDesk",         url: "https://coindesk.com" },
      { name: "Bloomberg Crypto", url: "https://bloomberg.com/crypto" },
      { name: "Reuters",          url: "https://reuters.com" },
    ],
    tags: ["Bitcoin", "Crypto", "Treasury", "Institutional"],
    title: {
      en: "Bitcoin Holds $75,000 as Institutional AI Treasury Demand Builds Steadily",
      zh: "比特币企稳 75,000 美元，机构 AI 国库战略稳步积累",
    },
    summary: {
      en: "Bitcoin consolidated around $75,000 as MicroStrategy, Marathon Digital, and two sovereign wealth funds disclosed combined $8B in new BTC purchases over Q2. A new institutional narrative is forming: AI companies and tech firms are treating Bitcoin as a hedge against AI-driven currency debasement and as a reserve asset in AI-to-AI micropayment networks.",
      zh: "比特币在 75,000 美元附近企稳整固。MicroStrategy、Marathon Digital 以及两家主权财富基金公布二季度合计 80 亿美元的新增比特币购入计划。一种新的机构叙事正在形成：AI 公司和科技企业将比特币视为对冲 AI 引发货币贬值的工具，以及 AI 间微支付网络的储备资产。",
    },
    whyItMatters: {
      en: "The convergence of AI infrastructure economics and crypto treasury strategy is a new market dynamic. If AI-native companies adopt BTC as a reserve asset at scale, it creates structural demand decoupled from speculative retail cycles. AI-to-AI micropayment use cases are accelerating Layer 2 Bitcoin adoption in enterprise settings.",
      zh: "AI 基础设施经济学与加密货币国库战略的交汇是全新的市场动态。若 AI 原生企业大规模将比特币纳入储备资产，将产生脱离零售投机周期的结构性需求。AI 间微支付场景正在加速推动比特币 Layer 2 在企业场景的采用。",
    },
  },
  {
    id: 9, rank: 9,
    category: "Technology",
    region: "overseas",
    date: "May 21, 2026",
    impact: "High",
    sources: [
      { name: "CISA Advisory", url: "https://www.cisa.gov/news-events/cybersecurity-advisories" },
      { name: "CrowdStrike",   url: "https://crowdstrike.com/blog" },
      { name: "Wired",         url: "https://wired.com" },
    ],
    tags: ["Cybersecurity", "AI Security", "Supply Chain", "APT"],
    title: {
      en: "Critical Zero-Day in LangChain Exploited in State-Sponsored Supply Chain Attack",
      zh: "LangChain 框架遭国家级黑客利用关键零日漏洞发动供应链攻击",
    },
    summary: {
      en: "CISA issued an emergency directive after a state-sponsored threat actor (attributed to APT41) exploited a critical deserialization vulnerability in LangChain v0.3.x, compromising AI agent pipelines at 47 identified organizations including three defense contractors and a major US bank. Patches were released within 18 hours.",
      zh: "CISA 发布紧急指令，指出国家级威胁行为者（归因为 APT41）利用 LangChain v0.3.x 版本中的严重反序列化漏洞，入侵了 47 个已确认机构的 AI 智能体管道，包括三家国防承包商和一家大型美国银行。补丁在 18 小时内发布。",
    },
    whyItMatters: {
      en: "This is the first high-profile, state-sponsored attack explicitly targeting AI application infrastructure. LangChain's position as the dominant AI orchestration framework means the blast radius is uniquely broad. The incident catalyzes AI-specific security tooling as a standalone market category and forces every enterprise with an AI agent deployment to conduct immediate security audits.",
      zh: "这是首次有高知名度、国家级支持的攻击明确以 AI 应用基础设施为目标。LangChain 作为主流 AI 编排框架的地位使得此次攻击的波及范围尤为广泛。此事件将 AI 专属安全工具推上独立市场品类的轨道，也迫使所有已部署 AI 智能体的企业立即开展安全审计。",
    },
  },
  {
    id: 10, rank: 10,
    category: "AI",
    region: "overseas",
    date: "May 23, 2026",
    impact: "High",
    sources: [
      { name: "Nature",        url: "https://nature.com" },
      { name: "DeepMind Blog", url: "https://deepmind.google/research" },
      { name: "STAT News",     url: "https://www.statnews.com" },
    ],
    tags: ["DeepMind", "Biotech", "Drug Discovery", "Science"],
    title: {
      en: "Google DeepMind AlphaFold 4 Maps Full Human Proteome Interactions",
      zh: "谷歌 DeepMind AlphaFold 4 绘制完整人类蛋白质组互作图谱",
    },
    summary: {
      en: "Google DeepMind published AlphaFold 4 in Nature, achieving 94% accuracy in predicting the full human protein-protein interaction network. The model simultaneously outputs predicted drug-binding pockets, reducing pre-clinical drug discovery timelines from 4–6 years to under 18 months in early trials.",
      zh: "谷歌 DeepMind 在《自然》杂志发表 AlphaFold 4，在预测完整人类蛋白质-蛋白质相互作用网络方面达到 94% 的准确率。该模型同时输出预测的药物结合口袋，在早期试验中将临床前药物发现周期从 4-6 年压缩至 18 个月以内。",
    },
    whyItMatters: {
      en: "AlphaFold 4 is the clearest demonstration to date that AI is delivering transformative, measurable scientific value. Pharma stocks (Pfizer, Roche, Moderna) moved 3–8% on the news. It also signals that AI's most significant near-term GDP impact may come from healthcare and biotech rather than software productivity.",
      zh: "AlphaFold 4 是迄今为止 AI 带来可量化、可变革科学价值最清晰的证明。大型药企股票（辉瑞、罗氏、Moderna）因此消息上涨 3-8%。它还预示着 AI 在近期内最显著的 GDP 影响可能来自医疗健康和生物技术，而非软件生产力。",
    },
  },
]

// combined + derived ──────────────────────────────────────────────────────────
export const news = [...chinaNews, ...overseasNews]

export const categoryMeta = {
  AI:         { count: news.filter(n => n.category === "AI").length },
  Technology: { count: news.filter(n => n.category === "Technology").length },
  Finance:    { count: news.filter(n => n.category === "Finance").length },
  china:      { count: chinaNews.length },
  overseas:   { count: overseasNews.length },
}
