export type TalkAbstractEntry = {
  match: string[];
  abstract: string;
};

export const TALK_ABSTRACTS: TalkAbstractEntry[] = [
  {
    match: ['flight mode ai'],
    abstract: `Cloud AI is powerful until the network disappears. I learned this while building QuAI, a writing assistant I use every day. The interface could stay the same, but a reliable offline route required much more than running llama.cpp on my laptop.

In this session, we’ll turn that prototype into a cross-platform product. We’ll trace how llamadart delivers prebuilt runtimes at build time and exposes llama.cpp and LiteRT-LM through one Dart API across mobile, desktop, and web. Then we’ll use ordinary Flutter and Dart code to stream local chat, reuse cached models, and switch a Genkit app between Gemini and an in-process local model.

Expect architecture, practical trade-offs, and live demos, not a tour of C++ build flags. You’ll leave knowing how to add a dependable offline path to an AI app, what each runtime can support, and why offline AI is a product reliability and privacy feature, not just a fallback for airplane mode.`,
  },
  {
    match: ["ai isn't magic", 'ai isn’t magic', 'wins the race'],
    abstract: `AI feels like magic — type a prompt, get a miracle. It isn't. It's a highly engineered, high-maintenance machine, and most teams crash when they drop a 2026 agent onto 2020 infrastructure.

In this session, we pop the hood. Using a Formula 1 lens, we tour the three pillars that decide whether your AI wins or stalls: Compute (CPUs, GPUs, and TPUs — which engine for which race, from Axion to Blackwell to Ironwood), Network (why 500 ms of latency doesn't make your app slow, it makes your AI sound stupid), and Security (defending not just the model, but the agent — prompt injection, tool poisoning, and the new agent-to-agent attack surface).

You'll leave able to audit your compute, own your network path, and layer your defenses — and knowing why the AI era needs fewer drivers and far more constructors.`,
  },
  {
    match: [
      'gdg) on campus',
      'student perspectives',
      'perspectives étudiantes',
    ],
    abstract: `Google Developer Groups (GDG) on Campus is a student-led community program supported by Google for Developers that helps students bridge the gap between theory and practice through peer-to-peer learning, workshops, and other events. We are a global network of student clubs with a clear mission: we actively empower students with industry-relevant technical skills, portfolio-building projects, and direct access to a global developer network.

Come join executives from GDG Polytechnique, GDG McGill, GDG Concordia, and GDG ÉTS — moderated by Stefania Pecore (Women Techmakers Montreal) — for a closing keynote chat about our own chapters, the tangible opportunities we provide to students, and how you can get involved with the chapter at your university (or even start your own).`,
  },
  {
    match: [
      'career coaching 1:1',
      'mentorat de carrière 1:1',
      'career & professional development 1:1',
    ],
    abstract: `Kickstart Your Tech Career: Get 1:1 mentorship from a seasoned pro. Whether you’re a student or an experienced developer, get personalized guidance in cloud, AI, data, security, and consulting to fast-track your professional journey.`,
  },
  {
    match: [
      'montreal tech community',
      'communauté tech montréalaise',
      'shaping montreal',
      'façonnent l’avenir numérique',
    ],
    abstract: `As the technology sector rapidly evolves, the most resilient and inclusive innovations often emerge not from corporate boardrooms, but from grassroots community ecosystems. This panel brings together leaders from three distinct community-driven tech groups in Montreal to explore the intersection of technology, local engagement, and social impact.

Representing diverse facets of Montreal’s vibrant tech landscape, the panelists from GDG, AI Tinkerers and Women Techmakers Montreal will discuss the challenges and triumphs of building and sustaining volunteer-led technology communities in a bilingual, multicultural urban center. Attendees will gain insights into how grassroots collectives foster talent, drive localized solutions to community challenges, and democratize access to digital skills.

Key Discussion Themes:
• Accessible AI for All Levels: Creating inclusive learning environments and pathways for people passionate about artificial intelligence, regardless of their background or current level of technical expertise.
• Ecosystem Synergy & Community Collaboration: How distinct tech groups share resources, mentor one another, and partner with local stakeholders to strengthen Montreal's tech ecosystem.`,
  },
  {
    match: ['harness engineering', 'securing autonomous ai agents on gcp'],
    abstract: `You wouldn’t replace static type checking and schema validation with an optimistic README comment, so why trust production agents to plain English system prompts?

In 2023, we tuned prompts; in 2024, context and RAG. Today, agents trigger external state mutations, and the bottleneck has shifted from model reasoning to outer infrastructure. Natural language offers zero guarantees against injection or drift. Adopting Zero-Trust AI means enforcing deterministic contracts at the boundary rather than in text.

In this session, we unpack Harness Engineering on GCP to turn probabilistic agents into resilient, auditable systems.`,
  },
  {
    match: ['agentic mobile testing', 'maestro mcp'],
    abstract: `Mobile E2E testing often fails for reasons that have little to do with business logic: brittle selectors, slow feedback loops, unreliable CI environments, permission dialogs, flaky waits, and poor debugging visibility. Flutter teams usually feel this pain once their app grows beyond a few critical flows.

In this session, we will explore how Maestro and its MCP server can help build a more practical E2E testing workflow for Flutter applications. We will start from a real Flutter screen, expose reliable semantic identifiers, write readable Maestro flows, then use MCP to inspect the running app, generate or execute flows, debug failures, and reason about test behavior from an AI-assisted environment.

The goal is not to replace test strategy with AI. The goal is to reduce the friction around authoring, running, and debugging E2E tests while keeping the engineering discipline where it belongs: stable selectors, deterministic flows, good CI boundaries, and meaningful coverage.`,
  },
  {
    match: ['building the doomsday course', 'agentic coding coach'],
    abstract: `The Doomsday Course hands every attendee a robot and asks them to program it from a browser tab, in Rust, Kotlin or Python, with an AI agent teaching the language as they go. This talk is how we built it, and what that taught us about designing a teaching experience instead of a demo.

The hard part was not the robots. It was working out what the AI agent may do. An assistant that answers every question writes the program for you, and nobody learns a language. So every capability on the unit starts locked behind a puzzle, and the agent is grounded in the harness and asked to explain rather than solve. Most of the architecture follows from that one decision.

The rest is the build. How the course is marked out so the software knows where a robot is and whether a sentry can see it. What runs on the units, and the small API attendee code may call. How three toolchains compile on a server and land on a moving robot seconds after someone hits run. Why the client is a terminal and a bank of security cameras rather than an editor. Where the video goes, and how to build a real-time telepresence experience.`,
  },
  {
    match: ['the doomsday course'],
    abstract: `Welcome, Hackers. Bring a laptop. Pick Rust, Kotlin or Python, no prior knowledge required, and let our AI secret agent teach you the basics. Take control of your Mobile Remote Units, infiltrate a secure facility, find the codes, reach the control room. Ensure world peace!

You get a browser tab, a mission, and no manual. Somewhere on the course there is a Mobile Remote Unit you cannot reach yet, and disarm codes you'll discover once you can. Earn your way in, collect them, and reach the control room without being seen by the sentries.

Learn as you go. Every capability is locked until you work out how to reach it, and each unlock is a concept you now own. Every unit streams camera and telemetry to the wall, so the room watches each run together and can learn from everyone else's mistakes.`,
  },
  {
    match: ['ouvrir la boîte noire', 'interprétabilité mécaniste'],
    abstract: `Les grands modèles de langage (LLM) sont souvent perçus comme des boîtes noires opaques dont le fonctionnement interne demeure complexe à déchiffrer. L'interprétabilité mécaniste cherche à résoudre ce problème en décompilant les poids des réseaux de neurones pour révéler des algorithmes lisibles et compréhensibles par l'humain.

Comment s'assurer qu'un agent fondé sur un grand modèle de langage (LLM) est véritablement aligné et non simplement en train de produire des réponses trompeuses ? À mesure que les modèles gagnent en autonomie, l'analyse de leurs seules entrées et sorties ne suffit plus. L'interprétabilité mécaniste cherche à résoudre ce problème en décompilant les poids des réseaux de neurones pour révéler les algorithmes sous-jacents, à la manière d'une décompilation de code binaire en code source.

Dans cette présentation, nous explorerons les fondements de cette approche, du phénomène d'apprentissage abrupt (grokking) jusqu'à l'utilisation des autoencodeurs épars (Sparse Autoencoders ou SAE) pour démêler les concepts représentés par le modèle. Nous présenterons Kiji Inspector, un pipeline développé au Dataiku 575 lab pour analyser le comportement des agents au moment précis de leur prise de décision.`,
  },
  {
    match: ['ai-driven troubleshooting', 'google cloud infrastructure'],
    abstract: `Troubleshooting complex cloud infrastructure issues is one of the most time-consuming and high-pressure tasks a modern operations team faces. When an application goes down or a service pipeline breaks, engineers are often forced into a cycle of manual, disjointed steps: hunting through log drains, executing repetitive CLI inspect commands, and cross-referencing configuration files to locate a single point of failure.

In this hands-on workshop, you will learn how to bridge the gap between static LLM reasoning and the live state of your Google Cloud environment. Using the Antigravity CLI and the Model Context Protocol (MCP), you will discover how to grant secure, real-time context to Gemini models so they can actively inspect, analyze, and diagnose live infrastructure issues across your Google Cloud projects.`,
  },
  {
    match: ['work at google'],
    abstract: `For many developers, working at Google is a top career goal. But how do you get there, beyond the typical "do more LeetCode" advice?

Drawing from my own winding journey to a role at Google, I'll demystify the entire process—from studying and applying to interviewing. I'll share some uncomfortable truths but also some comforting advice I learned along the way.

Whether you're a student or a seasoned pro, you'll leave this session with a clearer roadmap and actionable advice for your own journey.`,
  },
  {
    match: ['from vibe-coded to trusted', 'gemini enterprise agent platform'],
    abstract: `Building an agent is easy now. Trusting it is the hard part. I take one vibe-coded agent, an ambient expense approver, through the four themes of Gemini Enterprise Agent Platform, using real results from my own project.

Build: an ADK 2.0 graph where code makes the rules, Gemini only assesses risk, and a human approves anything risky; a prompt injection never reaches the model.
Scale: one command to Agent Runtime, with sessions that survive a human pause.
Govern: Agent Identity and an Agent Gateway with Model Armor set to fail closed, proven with requests that must be blocked (200, 403, 403).
Optimize: an eval gate where a deterministic check caught a PII leak the LLM judges missed, and an online monitor where one prompt change lifted groundedness from 0.70 to 0.96 on the same 12 requests.

Includes what went wrong and what is still not covered. Code and setup guides on GitHub: https://github.com/Jiayinzhuo/geap-ambient-expense-agent

Key takeaways:
1. Let code decide what you know; use the model only where judgment helps, and keep a human on risky decisions.
2. Keep policy outside the model, fail closed, and test with a request that should be blocked.
3. Put a deterministic check beside your LLM judge: an average can hide one bad case.
4. Change one thing and measure it; verify from raw output, not summaries.
5. Vibe coding still needs review.`,
  },
  {
    match: [
      'from black belts to small language models',
      'taekwondo ai journey',
    ],
    abstract: `What happens when you combine an interest in Taekwondo with Flutter, local AI, embeddings, and retrieval-augmented generation?

In this talk, I’ll share my journey building an AI-powered Taekwondo application designed to answer questions using a specialized body of martial arts knowledge. What started as an experiment with large language models quickly became a much deeper exploration of how to make AI answers accurate, grounded, fast, and practical on a mobile device.

We’ll look at the evolution of the application—from early experiments with cloud and local models to building a RAG pipeline using Flutter, Gemma, embeddings, and Supabase. I’ll discuss some of the problems that turned out to be much harder than expected: choosing what context to retrieve, handling small language models, improving retrieval quality, preventing hallucinations, and determining whether a bad answer was caused by the model, the prompt, or the data supplied to it.

Along the way, I’ll share the approaches that worked, the ones that definitely didn’t, and the lessons I learned about building domain-specific AI applications outside of a demo environment.`,
  },
  {
    match: ['off the edge', 'grading google ai edge'],
    abstract: `AI already helps us learn, write and decide. Can it help us move better?

Getting better at a physical skill takes someone who can see what you cannot: your own body in motion. That asks a machine to understand space rather than words, then say something worth acting on.

This talk asks how far that has come, using an application built for the purpose and a sport where the answer can be checked: jumping rope. Someone who practises it can grade the answer, so the model gets no benefit of the doubt.

It runs on Google Cloud. Google AI Edge's Pose Landmarker measures the body. Gemini video understanding is asked for the harder thing: not a description of the video, but advice that changes the next session.

How far does a pose model go on real footage, when the object this sport is built around fills 0.058% of the picture and blurs in every frame? Is Gemini genuinely useful as a coach, or only convincing? And when the measurement and the advice disagree, which one do you believe?

We walk the whole route, run the app live on real sessions, and close with what practitioners made of the coaching and a grade for each.`,
  },
  {
    match: ['under the hood of gemini enterprise', 'no-code agents'],
    abstract: `Generative AI has evolved past simple text prompts; today, organizations demand secure, scalable infrastructure that can transition smoothly from prototype to production. In this session, we peel back the layers of Gemini Enterprise to explore what it takes to build production-grade AI solutions.

We will start under the hood by examining the core architecture of Gemini Enterprise. From there, we transition from architecture to action. You will see a live walkthrough of how to build and deploy no-code AI agents, orchestrate complex multi-step workflows, and leverage powerful end-user features designed to drive daily productivity.

Whether you are an architect designing enterprise systems or a builder looking to rapidly prototype intelligent automation, you will leave with a clear roadmap for harnessing the full potential of Gemini Enterprise for your enterprise.`,
  },
  {
    match: ['terminal to stadium', 'sports pa announcer'],
    abstract: `Producing stadium-quality sports introductions historically required studio time, manual audio splicing, and expensive voice actors. Now, with a little Python, some structured JSON, and Google’s latest Gemini TTS and Lyria models, you can synthesize the arena experience right from your terminal.

In this talk, I will demonstrate TeamHypeAI, a tool that instantly generates and mixes rapid-fire PA announcements, custom entrance music, and dynamic audio ducking directly from a CLI. We will explore a developer-first approach to defining rosters and timing parameters, creating a complete, customizable player hype track for under ten cents.`,
  },
  {
    match: ['from data to action', 'cloud databases'],
    abstract: `Grounding AI agents in enterprise database data is key to reliable, hallucination-free actions and responses. By combining agent skills with the Model Context Protocol (MCP), agents gain secure, real-time access to the data layer.

Join this session to explore how to create an AI agent with the Google ADK framework and use two distinct architectures for MCP servers connecting to your database.`,
  },
  {
    match: ['personal productivity assistant on cloud run'],
    abstract: `Running a coffee shop isn't just about the coffee. It's schedules, inventory, staffing, and a dozen small operational tasks that eat up a manager's day before the doors even open.

In this lab, you'll build a personal productivity assistant on Cloud Run designed to take that load off a coffee shop manager's plate. You'll give it the ability to help with real daily operations, things like managing schedules, tracking tasks, and keeping the day organized, so the manager can spend less time on logistics and more time running the shop. Along the way, you'll see how Cloud Run handles a long-running, always-available assistant without the overhead of managing your own infrastructure.

By the end, you'll have a working assistant built for a real operational role, not just a demo that answers questions. Bring a laptop and know your way around Python. That's all you need.`,
  },
  {
    match: ['android appfunctions', 'exposing your app to ai agents'],
    abstract: `AI agents are changing the way users interact with Android apps. AppFunctions gives developers a direct, structured way to participate in this future by exposing selected app capabilities as typed, callable tools that the operating system and on-device AI agents can discover and invoke.

In this practical session, we will build an agent-ready Android feature using Kotlin and the AppFunctions Jetpack library.

Attendees will leave with the knowledge and implementation roadmap needed to prepare their Android apps for the agentic era.`,
  },
  {
    match: ['beyond push-to-talk', 'real-time fact-checking agents'],
    abstract: `Most voice agents wait for you to finish, then answer. That works for a chatbot. It fails on an incident call when someone says the outage started after the deploy and the logs say otherwise, or on a sales call when someone promises a feature that doesn't exist.

In this session we build an agent that listens to a live conversation, checks claims while people are still talking, and speaks up only when something is wrong.

It runs on the Gemini Live API. We'll cover streaming audio into a live session and turning speech into claims you can check, Google Search grounding for public facts, function calling into your own data like logs or release notes, deciding when an agent should interrupt and when it should stay quiet, and what to do when the session drops or the Wi-Fi dies.

You'll leave with a pattern you can reuse for incident bridges, support and sales calls, meetings and live teaching, interviews.

Live demo: the agent is listening to this talk, and it's allowed to interrupt me.`,
  },
  {
    match: ['attention attention everywhere'],
    abstract: `Everyone knows the line "attention is all you need". Far fewer could say what attention actually computes.

This talk starts from a single sentence with an ambiguous pronoun and works forward until the attention formula appears on its own. Not presented and explained, but derived, one step at a time, with real numbers on screen throughout. Why comparing two embeddings directly fails. Why that failure forces every token to be split into three separate projections. What each projection does and what actually moves between tokens.

Then it stops explaining and starts checking. The same math is run against the real weights of an open model, pulled out layer by layer, head by head, and recomputed by hand. The first measurement comes back wrong, and why it comes back wrong turns out to be more interesting than the mechanism itself.`,
  },
  {
    match: ['automatisez la gestion des admissions', 'google apps script'],
    abstract: `Gérer les inscriptions et l'envoi des communications de suivi (acceptations, listes d'attente, refus) pour un événement peut rapidement devenir un goulet d'étranglement manuel. Et si vous pouviez combiner la puissance des LLMs de Google et l'automatisation sans serveur pour faire tout cela en quelques lignes de code ?

Cet atelier pratique vous guide pas à pas dans la création d'un système intelligent de gestion des admissions d'événements. Vous apprendrez à connecter Google Forms et Google Sheets pour centraliser les candidatures, puis à exploiter l'API Gemini (via Google AI Studio) et Google Apps Script pour générer et envoyer automatiquement des e-mails personnalisés et contextuels selon le statut de chaque candidat (Approuvé, Liste d'attente, Refusé).`,
  },
  {
    match: ['think fast and slow', 'system one decisions in google adk'],
    abstract: `AI agents often use the same generative model for every decision: choosing a specialist, judging risk, checking evidence, or deciding whether to continue. That flexibility is useful, but it can make agent loops slower, more expensive, and harder to control.

This session builds a fast-and-slow agent with Google ADK, Gemini, and Jev, a System One model designed for typed, probabilistic decisions. Jev handles narrow judgments such as routing, complexity, sensitivity, and action risk. Gemini handles planning and generation. Python code keeps control of thresholds, permissions, and execution.

In the live demo, a request is classified by Jev, sent to an ADK specialist, checked before a consequential tool call, and escalated when confidence is low. We will inspect the API response, ADK callback, policy branch, trace, and latency. We will also test an ambiguous request and an unavailable endpoint to show how the system fails safely.

Attendees will leave with a practical pattern for using fast decision models alongside generative models—plus an open-source reference implementation with the ADK integration, System One adapter, evaluation fixtures, and failure tests.`,
  },
  {
    match: ['gemini live: architecting', 'pricing conversational experiences'],
    abstract: `Learn how to architect, build, and price, end-to-end conversational voice experiences using Gemini Live and Firebase with DealCalm.com as case study.

We will dive deep into Gemini Live’s most powerful capabilities: sub-second barge-in interruptions, native Voice Activity Detection (VAD), live function calling, and low-latency bidirectional streaming, to show you how to build speech interfaces that feel genuinely human.

Next, we will tackle the elephant in the room: API costs. We’ll break down real-world token burn rates, explore how context caching slashes streaming costs, calculate the true cost per voice minute, and review practical metering strategies to ensure your product scales profitably without burning through margins.

Finally, you'll see how to build a profitable model of a micro-SaaS, taking into consideration the operational costs and customer lifetime value.

Developers and founders alike will walk away with the practical blueprint to build next-generation voice AI products, paired with the financial clarity needed to price them sustainably.`,
  },
  {
    match: ['building applications with google ai studio and databases'],
    abstract: `Have an idea to build something but wondering where to start? In this session, I will show you how to build modern applications using Google AI Studio and Google Cloud databases, creating a persistent data layer ready to scale and transition to the enterprise level.

We will walk through the entire journey: choosing the right database, end-to-end development, deployment, maintenance, and security.`,
  },
  {
    match: ['edge ai on mobile', 'practical approaches and challenges'],
    abstract: `Leverage edge AI to deliver instant, private, and offline-ready intelligence in your mobile apps at no cost. We’ll explore practical ways to use on-device foundation models like Gemini-nano and Apple Intelligence and explain the balance between the powerful benefits of edge AI and its unique technical trade-offs to ship smarter and delightful mobile experiences.`,
  },
  {
    match: ['meet the gold team', 'beyond red, blue and purple'],
    abstract: `Red teams ask: Can I break it?
Blue teams ask: Can I detect and stop it?
Purple teams ask: Can Red and Blue learn from each other?

But there is another question we rarely ask: Why did it break in the first place?

That is the job of a Gold Team: a Governance-Oriented LLM Defense team dedicated to taking AI governance to another level of understanding. Because you cannot govern what you do not understand.

During this talk, Faustin Bouchard will introduce the first Gold approach to understanding LLM failure: reconstructing the logical steps an LLM goes through to reach a decision, then examining how and why each of those steps can fail when the system encounters an adversarial prompt. And, surprisingly, once you see the structure, it becomes remarkably simple.`,
  },
  {
    match: ['building real-time rag systems', 'multimodal live api'],
    abstract: `This session will demonstrate how to build a real-time Retrieval Augmented Generation (RAG) system using Gemini 3.7 and the new Multimodal Live API. Participants will explore how to generate both text and audio responses grounded in enterprise documents, with a retail customer support assistant as a working example.

We will walk through:
• Using Gemini 3.7 Flash, Google DeepMind’s fastest multimodal model, to deliver high-quality, low-latency outputs.
• Leveraging the Multimodal Live API for interactive text and audio streaming.
• Applying RAG techniques to build grounded, context-aware assistants.
• Integrating the solution with enterprise data to enhance customer experiences.

By the end of the session, attendees will gain practical experience in developing real-time, multimodal AI applications that improve customer engagement and support; unlocking the power of Gemini 3.7 for enterprise-ready solutions.`,
  },
  {
    match: [
      'agents working together',
      'orchestration with adk and a2a',
      'teach your coding agent',
    ],
    abstract: `One agent can answer a question. A team of agents can run a workflow, but only if they're coordinated well. This talk shows how to move from a single agent to a multi-agent system using Google's Agent Development Kit (ADK) and the Agent2Agent (A2A) protocol.

We'll cover the core orchestration patterns (sequential, parallel fan-out, supervisor routing, and critic loops), connect agents across services with A2A, and run a live pipeline end to end. We'll also look at what happens when it breaks, and how tracing and evals help you find and fix the problem.

You'll leave with a practical checklist for deciding when multi-agent is worth it and how to run it in production.`,
  },
  {
    match: [
      'démocratiser la santé numérique',
      'synthèse vocale',
      'diaspora mondiale santé',
    ],
    abstract: `Comment passer à l'échelle une plateforme de santé tout en rendant l'information médicale accessible à tous ? À travers le projet Diaspora Mondiale Santé, découvrez comment combiner les Progressive Web Apps (PWA), Google Cloud et la synthèse vocale en 243 langues pour sécuriser et démocratiser l'accès aux conseils de santé et à la pharmacopée.

Nous aborderons l'architecture technique, l'optimisation des performances Web, et le rôle de l'IA pour offrir un accompagnement patient éthique, transparent et universel.`,
  },
  {
    match: ['six agents, one patient record', 'google adk retrospective'],
    abstract: `We hear a lot about how to build multi-agent systems, but much less about what gets harder once several agents have to work together. I built a healthcare AI workflow with six specialized agents using Google ADK. With six agents, the patient's context had to cross every boundary between them.

In this lightning talk, I'll follow one synthetic patient record through a real execution trace and show where the handoffs introduced context-transfer overhead, latency, and new debugging challenges, and what I'd change if I built the system again.`,
  },
  {
    match: ['webmcp proposal', 'the web could be agentic'],
    abstract: `As more and more businesses and developers rely on agentic automation, connecting and interfacing with the web becomes a clear use case. Join me in a first look at a proposed interface that promises to open the web to two distinct APIs that will allow AI agents to automate actions in ANY website (including Flutter Web apps) with ease.`,
  },
  {
    match: ['shipping ai inside a health system', '90% you don'],
    abstract: `The demo always works. The deployment is where things fall apart.

In healthcare, the distance between a good prototype and something running in production is huge, and most of the time it has nothing to do with the model. It is the data you are not allowed to touch. It is privacy you cannot trade away. It is trust you earn one workflow at a time, in front of people who have watched pilots quietly disappear before.

I work on data and AI systems inside a Canadian health system, so I spend my days in that gap. This talk walks through the unglamorous work that decides whether AI ships or dies: the data foundation, the compliance guardrails, the human trust loop, and the organizational reality no benchmark measures.

If you are a founder or tech leader looking at healthcare, or any regulated, high-stakes space, you will leave knowing what to plan for on day one and where the real advantage sits.`,
  },
  {
    match: [
      'plateforme agentique',
      'retour d’expérience sur nova',
      "retour d'expérience sur nova",
    ],
    abstract: `Face à la complexité des flux de travail en entreprise, la simple intégration de LLMs ne suffit plus. Comment concevoir, industrialiser et commercialiser une véritable plateforme d'agents autonomes ?

Cette session propose un retour d'expérience (REX) complet sur le développement de Nova, la plateforme agentique d'oXya Canada. Nous explorerons sous le capot bien d'autres facettes indispensables : les choix d'architecture, l'utilisation de Google ADK et de la Gemini Agent Platform, l'intégration des Data Agents de BigQuery, la gestion fine des autorisations, ainsi que les patterns et les nombreux enseignements tirés de nos déploiements clients pour transformer des processus complexes en workflows agentiques fluides et sécurisés.`,
  },
];

export function getTalkAbstract(
  title?: string,
  explicitAbstract?: string,
): string | null {
  if (explicitAbstract && explicitAbstract.trim().length > 0) {
    return explicitAbstract.trim();
  }
  if (!title) return null;
  const normalized = title.toLowerCase().trim();
  for (const entry of TALK_ABSTRACTS) {
    if (entry.match.some((m) => normalized.includes(m))) {
      return entry.abstract;
    }
  }
  return null;
}
