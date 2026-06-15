import React, { useState, useEffect, useRef } from "react";
import { 
  MessageSquareText, 
  Send, 
  FileText, 
  Mail, 
  Bot, 
  Zap, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  Check, 
  ShieldCheck, 
  LineChart, 
  Coins, 
  ChevronRight, 
  Menu, 
  X,
  Play,
  RotateCcw,
  HelpingHand
} from "lucide-react";
import { PRODUCT_DETAILS, PERSONAS, PRICING_PLANS } from "./data";
import { Message, QualificationResult } from "./types";
import InteractiveMockups from "./InteractiveMockups";

export default function App() {
  // Navigation states
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // Product tab selection (Widget, Bot, Agent, Mail)
  const [activeProduct, setActiveProduct] = useState<"widget" | "bot" | "agent" | "mail">("widget");

  // Chat Sandbox states
  const [selectedPersonaId, setSelectedPersonaId] = useState("ecommerce");
  const [chatMessages, setChatMessages] = useState<Record<string, Message[]>>({
    ecommerce: [
      { id: "e1", role: "model", text: "Здравствуйте! Я ИИ-консультант магазина гаджетов SmartSpace. С радостью отвечу на вопросы про товары, гарантию или экспресс-доставку за 2 часа! Оформите покупку со скидкой 10% по промокоду TUSTART10.", timestamp: new Date() }
    ],
    edtech: [
      { id: "ed1", role: "model", text: "Приветствую! Я виртуальный координатор SkillGrow. Помогаю выбрать профессию мечты в IT с гарантией трудоустройства по договору. Какое направление вас интересует? У нас сейчас можно взять первые 2 недели занятий бесплатно!", timestamp: new Date() }
    ],
    clinic: [
      { id: "cl1", role: "model", text: "Здравствуйте! Я заботливый ИИ-администратор клиники «Здоровье и Забота». С радостью сориентирую вас по расписанию врачей и помогу записаться на терапию со скидкой 20%. К какому врачу вы планируете визит?", timestamp: new Date() }
    ],
    legal: [
      { id: "l1", role: "model", text: "Приветствую! На связи ИИ-ассистент группы «Защита и Право». Помогаю провести экспресс-квалификацию вашей проблемы и записать вас на часовую консультацию юриста по специальной стоимости 1500 рублей вместо 3000 рублей. Опишите вашу проблему.", timestamp: new Date() }
    ]
  });
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Dynamic pricing calculations
  const [queriesRange, setQueriesRange] = useState(3000); // monthly queries expected
  const [selectedPricingPlan, setSelectedPricingPlan] = useState("business");

  // Audit Lead wizard
  const [leadStep, setLeadStep] = useState(1);
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [targetAgent, setTargetAgent] = useState("widget");
  const [businessGoal, setBusinessGoal] = useState("");
  const [isQualifying, setIsQualifying] = useState(false);
  const [qualificationResult, setQualificationResult] = useState<QualificationResult | null>(null);

  // Scroll mockups into viewport
  const scrollIntoView = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsMobileMenuOpen(false);
  };

  // Chat scroll anchor
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, selectedPersonaId]);

  // Adjust recommended pricing plan based on custom query range slider
  useEffect(() => {
    if (queriesRange <= 500) {
      setSelectedPricingPlan("start");
    } else if (queriesRange <= 2500) {
      setSelectedPricingPlan("business");
    } else if (queriesRange <= 10000) {
      setSelectedPricingPlan("pro");
    } else {
      setSelectedPricingPlan("byok");
    }
  }, [queriesRange]);

  // Handle playground client-side message submit to server API
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userText = chatInput;
    setChatInput("");
    setIsChatLoading(true);

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      role: "user",
      text: userText,
      timestamp: new Date()
    };

    // Update state instantly (user side)
    const currentHistory = chatMessages[selectedPersonaId] || [];
    setChatMessages(prev => ({
      ...prev,
      [selectedPersonaId]: [...currentHistory, userMsg]
    }));

    try {
      const payloadHistory = currentHistory.map(m => ({
        role: m.role,
        text: m.text
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          persona: selectedPersonaId,
          history: payloadHistory
        })
      });

      const data = await res.json();
      
      const modelMsg: Message = {
        id: `model-${Date.now()}`,
        role: "model",
        text: data.text || "Извините, я временно отключился от базы знаний.",
        timestamp: new Date()
      };

      setChatMessages(prev => ({
        ...prev,
        [selectedPersonaId]: [...prev[selectedPersonaId], modelMsg]
      }));
    } catch (err) {
      console.error(err);
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        role: "model",
        text: "Извините, произошел сбой сети. Проверьте подключение.",
        timestamp: new Date()
      };
      setChatMessages(prev => ({
        ...prev,
        [selectedPersonaId]: [...prev[selectedPersonaId], errorMsg]
      }));
    } finally {
      setIsChatLoading(false);
    }
  };

  // Predefined questions quick-click
  const handleQuickQuestion = (question: string) => {
    setChatInput(question);
  };

  // Reset sandbox chat
  const handleClearChat = () => {
    const defaultMessages: Record<string, string> = {
      ecommerce: "Здравствуйте! Я ИИ-консультант магазина гаджетов SmartSpace. С радостью отвечу на вопросы про товары, гарантию или экспресс-доставку за 2 часа! Оформите покупку со скидкой 10% по промокоду TUSTART10.",
      edtech: "Приветствую! Я виртуальный координатор SkillGrow. Помогаю выбрать профессию мечты в IT с гарантией трудоустройства по договору. Какое направление вас интересует? У нас сейчас можно взять первые 2 недели занятий бесплатно!",
      clinic: "Здравствуйте! Я заботливый ИИ-администратор клиники «Здоровье и Забота». С радостью сориентирую вас по расписанию врачей и помогу записаться на терапию со скидкой 20%. К какому врачу вы планируете визит?",
      legal: "Приветствую! На связи ИИ-ассистент группы «Защита и Право». Помогаю провести экспресс-квалификацию вашей проблемы и записать вас на часовую консультацию юриста по специальной стоимости 1500 рублей вместо 3000 рублей. Опишите вашу проблему."
    };

    setChatMessages(prev => ({
      ...prev,
      [selectedPersonaId]: [
        { id: `init-${Date.now()}`, role: "model", text: defaultMessages[selectedPersonaId], timestamp: new Date() }
      ]
    }));
  };

  // Run lead qualifying generator logic using backend API
  const handleGenerateAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !businessType.trim()) return;

    setIsQualifying(true);
    setLeadStep(3); // transition to animated analyzer state

    try {
      const res = await fetch("/api/qualify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          businessType,
          selectedAgent: targetAgent === "widget" ? "ИИ-виджет на сайт" : targetAgent === "bot" ? "ИИ-бот в Telegram" : targetAgent === "agent" ? "Панель контент-агента" : "Mail Ассистент",
          taskGoal: businessGoal
        })
      });

      const data = await res.json();
      setQualificationResult(data);
      setLeadStep(4); // transition to results view
    } catch (err) {
      console.error(err);
      // Fail fallback already covered on API proxy
    } finally {
      setIsQualifying(false);
    }
  };

  const handleResetAudit = () => {
    setLeadStep(1);
    setBusinessName("");
    setBusinessType("");
    setBusinessGoal("");
    setQualificationResult(null);
  };

  // ROI / Savings calculations parameters
  const getSavingsHours = () => {
    // 1 query with human usually takes ~4 minutes (drafting, responding, reading)
    const baseMinutesPerQuery = 4;
    return Math.floor((queriesRange * baseMinutesPerQuery) / 60);
  };

  const getMoneySaved = () => {
    // Average pay for support operator is about 350 rubles per hour (including taxes, workspace, infrastructure)
    const costPerHour = 380;
    return getSavingsHours() * costPerHour;
  };

  // Selected details of current selected tab
  const activeProductData = PRODUCT_DETAILS.find(p => p.id === activeProduct) || PRODUCT_DETAILS[0];
  const activePersonaData = PERSONAS.find(p => p.id === selectedPersonaId) || PERSONAS[0];

  return (
    <div className="relative min-h-screen bg-[#07011d] text-slate-100 flex flex-col font-sans selection:bg-brand-pink selection:text-white overflow-hidden">
      {/* Background high-energy mesh glow */}
      <div className="mesh-glow-container">
        <div className="mesh-glow-1"></div>
        <div className="mesh-glow-2"></div>
        <div className="mesh-glow-3"></div>
      </div>

      {/* FIXED NAV BAR */}
      <header id="nav_header" className="sticky top-0 w-full bg-[#07011d]/75 backdrop-blur-xl border-b border-[#a855f7]/20 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Logo with clean branding */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => scrollIntoView("hero_container")}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-pink via-brand-purple to-brand-cyan flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-brand-purple/30 animate-pulse">
              T
            </div>
            <div>
              <span className="font-display font-bold text-xl tracking-tight text-white">TuStart</span>
              <span className="text-brand-pink font-display font-semibold text-xs ml-1 bg-brand-pink/15 border border-brand-pink/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider text-glow-pink">AI</span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
            <button 
              onClick={() => scrollIntoView("products_section")} 
              className="hover:text-white transition-colors cursor-pointer"
            >
              Продукты
            </button>
            <button 
              onClick={() => scrollIntoView("examples_section")} 
              className="hover:text-white transition-colors cursor-pointer"
            >
              Примеры
            </button>
            <button 
              onClick={() => scrollIntoView("sandbox_section")} 
              className="hover:text-white transition-colors cursor-pointer"
            >
              ИИ-Тестдрайв
            </button>
            <button 
              onClick={() => scrollIntoView("tariffs_section")} 
              className="hover:text-white transition-colors cursor-pointer"
            >
              Тарифы
            </button>
          </nav>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={() => scrollIntoView("tariffs_section")}
              className="text-sm font-semibold text-slate-300 hover:text-white px-4 py-2 border border-slate-800 hover:border-slate-700 rounded-xl transition-all cursor-pointer bg-slate-950/50"
            >
              Войти
            </button>
            <button 
              onClick={() => scrollIntoView("audit_wizard_section")}
              className="btn-vibrant-gradient text-white font-bold text-sm px-5 py-3 rounded-xl transition-all active:scale-95 cursor-pointer leading-none"
            >
              Оставить заявку
            </button>
          </div>

          {/* Mobile hamburger button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-slate-200 hover:text-white p-2 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile slide-down navigation menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-slate-950 border-b border-slate-900 px-4 pt-2 pb-6 space-y-3 shadow-2xl">
            <button 
              onClick={() => scrollIntoView("products_section")} 
              className="block w-full text-left text-sm font-semibold py-3 text-slate-300 hover:text-white border-b border-slate-900"
            >
              Продукты
            </button>
            <button 
              onClick={() => scrollIntoView("examples_section")} 
              className="block w-full text-left text-sm font-semibold py-3 text-slate-300 hover:text-white border-b border-slate-900"
            >
              Примеры
            </button>
            <button 
              onClick={() => scrollIntoView("sandbox_section")} 
              className="block w-full text-left text-sm font-semibold py-3 text-slate-300 hover:text-white border-b border-slate-900"
            >
              ИИ-Тестдрайв
            </button>
            <button 
              onClick={() => scrollIntoView("tariffs_section")} 
              className="block w-full text-left text-sm font-semibold py-3 text-slate-300 hover:text-white border-b border-slate-900"
            >
              Тарифы
            </button>
            <div className="pt-4 flex flex-col space-y-3">
              <button 
                onClick={() => scrollIntoView("tariffs_section")}
                className="w-full text-center text-sm font-semibold py-3 border border-slate-800 rounded-xl text-slate-300"
              >
                Войти
              </button>
              <button 
                onClick={() => scrollIntoView("audit_wizard_section")}
                className="w-full text-center bg-brand-blue text-white font-semibold py-3 rounded-xl"
              >
                Оставить заявку
              </button>
            </div>
          </div>
        )}
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-grow">
        
        {/* HERO SECTION */}
        <section id="hero_container" className="relative pt-12 pb-20 md:py-28 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            
            {/* Pulsing small badge */}
            <div className="inline-flex items-center space-x-2.5 bg-gradient-to-r from-brand-pink/15 to-brand-fuchsia/15 border border-brand-pink/30 rounded-full px-4 py-2 mb-6 shadow-lg shadow-brand-pink/5 transition-transform hover:scale-105">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-pink opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-pink"></span>
              </span>
              <span className="text-xs font-bold text-brand-pink tracking-wider uppercase font-mono">Платформа ИИ-инструментов для бизнеса</span>
            </div>

            {/* Giant display heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-display text-white max-w-5xl mx-auto leading-[1.12]">
              ИИ-команда, которая <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-brand-cyan via-brand-pink to-brand-fuchsia bg-clip-text text-transparent text-glow-cyan">
                работает за вас
              </span>
            </h1>

            {/* Subtitle description */}
            <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Наш ИИ-консультант отвечает посетителям в чат-виджете, ведёт диалоги в мессенджерах, пишет экспертный контент и разбирает входящую почту — круглосуточно, заменяя рутину. Запуск за 1 день, без единой строчки кода.
            </p>

            {/* CTA action buttons */}
            <div className="mt-10 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button 
                onClick={() => scrollIntoView("sandbox_section")}
                className="w-full sm:w-auto btn-vibrant-gradient text-white font-bold text-base px-8 py-4 rounded-xl transition-all active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Протестировать ИИ</span>
                <Sparkles size={16} className="text-brand-cyan" />
              </button>
              <button 
                onClick={() => scrollIntoView("products_section")}
                className="w-full sm:w-auto text-slate-100 hover:text-white font-bold text-base px-8 py-4 border border-[#a855f7]/30 hover:border-brand-pink/50 bg-[#120a30]/60 rounded-xl transition-all cursor-pointer hover:shadow-[0_0_15px_rgba(168,85,247,0.2)]"
              >
                Что вы получите
              </button>
            </div>

            {/* Live stats metrics horizontal bar */}
            <div className="mt-18 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-[#a855f7]/20 glass-panel rounded-3xl p-6">
              <div className="flex flex-col items-center py-2 md:py-0">
                <span className="text-2xl sm:text-3xl font-extrabold text-brand-cyan tracking-tight font-display text-glow-cyan">&lt;1 дня</span>
                <span className="text-xs text-slate-300 mt-1 font-medium font-sans">от первой заявки до запуска</span>
              </div>
              <div className="flex flex-col items-center py-4 md:py-0">
                <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display text-glow-pink">GPT-5 • Claude 3.5</span>
                <span className="text-xs text-slate-300 mt-1 font-medium font-sans">самые быстрые и современные модели</span>
              </div>
              <div className="flex flex-col items-center py-2 md:py-0">
                <span className="text-2xl sm:text-3xl font-extrabold text-brand-pink tracking-tight font-display text-glow-pink">24/7/365</span>
                <span className="text-xs text-slate-300 mt-1 font-medium font-sans">отвечает без усталости и выходных</span>
              </div>
            </div>

          </div>
        </section>

        {/* PRODUCT PORTFOLIO CARDS */}
        <section id="products_section" className="py-20 bg-[#07011d]/20 border-y border-[#a855f7]/15 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold text-brand-pink uppercase tracking-widest font-mono text-glow-pink">Наши продукты</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white mt-2 leading-tight">
                Закроем задачи, на которые не хватает рук
              </h2>
              <p className="text-slate-400 text-sm sm:text-base mt-4">
                Каждый ИИ-ассистент работает независимо на собственной корпоративной базе знаний, полностью заменяя выполнение рутинных задач вашего отдела поддержки, контента и администрации.
              </p>
            </div>

            {/* Responsive Products Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Product buttons selector (left on desktop, top on mobile) */}
              <div className="lg:col-span-4 space-y-3">
                {PRODUCT_DETAILS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setActiveProduct(p.id as any)}
                    className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-center space-x-4 ${
                      activeProduct === p.id 
                        ? "bg-[#180a3a]/80 border-brand-pink shadow-lg shadow-brand-pink/25 text-white scale-[1.02]" 
                        : "bg-[#0c0522]/40 border-[#a855f7]/10 hover:border-[#a855f7]/30 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${
                      activeProduct === p.id ? p.colorClass : "from-slate-800 to-slate-900"
                    } flex items-center justify-center text-white flex-shrink-0 shadow`}>
                      {p.id === "widget" && <MessageSquareText size={18} />}
                      {p.id === "bot" && <Send size={18} className="translate-x-[-1px] translate-y-[1px]" />}
                      {p.id === "agent" && <FileText size={18} />}
                      {p.id === "mail" && <Mail size={18} />}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold tracking-wide">{p.title}</h3>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{p.subtitle}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Active Product Details & Live Mockup Render (right) */}
              <div className="lg:col-span-8 glass-panel rounded-3xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center min-h-[480px]">
                
                {/* Text and list */}
                <div className="md:col-span-5 space-y-6">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-cyan bg-brand-cyan/15 border border-brand-cyan/30 px-3 py-1 rounded-full text-glow-cyan">{activeProductData.badge}</span>
                    <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white font-display pt-2">{activeProductData.title}</h3>
                  </div>
                  
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {activeProductData.description}
                  </p>

                  <ul className="space-y-3">
                    {activeProductData.features.map((f, i) => (
                      <li key={i} className="flex items-start space-x-2.5 text-xs text-slate-300">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5">
                          <Check size={10} />
                        </span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <button 
                    onClick={() => scrollIntoView("audit_wizard_section")}
                    className="w-full bg-[#120a30]/80 hover:bg-[#1a0f44] hover:text-white text-slate-200 border border-[#a855f7]/30 hover:border-brand-pink/50 px-5 py-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(236,72,153,0.2)]"
                  >
                    <span>{activeProductData.buttonText}</span>
                    <ArrowRight size={12} />
                  </button>
                </div>

                {/* Display interactive simulated panel mockup */}
                <div className="md:col-span-7">
                  <InteractiveMockups activeTab={activeProduct} />
                </div>

              </div>

            </div>

          </div>
        </section>

        {/* HOW IT LOOKS CUSTOMER GALLERY / MOCKUPS SECTION */}
        <section id="examples_section" className="py-20 border-b border-[#a855f7]/15">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-bold text-brand-pink uppercase tracking-widest font-mono text-glow-pink">Примеры интерфейсов</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white mt-2 leading-tight">
                Как это выглядит на практике
              </h2>
              <p className="text-slate-400 text-sm sm:text-base mt-2">
                Поглядите на интерактивные мокапы наших систем в действии. Полная адаптивность, чистота и гармоничное встраивание в любой корпоративный брендбук.
              </p>
            </div>

            {/* Quick 2-column showcase of widget & telegram integration */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Box 1: AI website widget interface preview */}
              <div className="glass-panel p-6 sm:p-8 rounded-3xl flex flex-col justify-between">
                <div className="space-y-4 mb-6">
                  <div className="inline-flex items-center space-x-2 bg-brand-cyan/15 border border-brand-cyan/30 px-3 py-1 rounded-full">
                    <MessageSquareText size={12} className="text-brand-cyan" />
                    <span className="text-[10px] text-brand-cyan font-bold uppercase tracking-widest text-glow-cyan">Чат-виджет на вашем сайте</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-white leading-tight">Чат-виджет в углу страницы за 1 минуту</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                     Поверх любого интернет-магазина или лендинга подключается легкий виджет одной строчкой скрипта. Он автоматически запоминает ваш каталог и моментально отвечает на входящие вопросы, полностью беря на себя лидогенерацию.
                  </p>
                </div>
                <div className="bg-[#050212] border border-[#a855f7]/20 rounded-2xl p-4 space-y-3 relative overflow-hidden h-44 flex flex-col justify-center">
                  <div className="space-y-2 max-w-[85%] bg-[#120a30]/95 border border-[#a855f7]/30 rounded-xl p-3 text-xs text-slate-200">
                    <p className="font-semibold text-brand-cyan text-[10px] mb-1 text-glow-cyan">💡 Поддержка ИИ-Консультант:</p>
                    <p>Здравствуйте! Наша доставка работает 24/7. По промокоду **TUSTART** подарю бесплатный подбор!</p>
                  </div>
                  <div className="inline-flex self-end bg-gradient-to-r from-brand-pink to-brand-purple text-white rounded-xl px-3 py-1.5 text-xs font-semibold">
                    Вау, быстро отвечаешь!
                  </div>
                </div>
              </div>

              {/* Box 2: Telegram Bot Integration preview */}
              <div className="bg-slate-900/40 p-6 sm:p-8 rounded-3xl border border-slate-900/80 flex flex-col justify-between hover:scale-[1.01] transition-transform">
                <div className="space-y-4 mb-6">
                  <div className="inline-flex items-center space-x-2 bg-indigo-950/60 border border-indigo-800/40 px-3 py-1 rounded-full">
                    <Bot size={12} className="text-indigo-400" />
                    <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wide">ИИ-Бот в мессенджере</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-white leading-tight">Telegram-боты, которые никогда не спят</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Подключается через официальный Telegram API к вашему корпоративному аккаунту. Может без труда переводить диалоги из голосовых файлов в текст, анализировать PDF прайс-листы и координироваться с CRM.
                  </p>
                </div>
                <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 space-y-2 relative overflow-hidden h-44 flex flex-col justify-center">
                  <div className="flex justify-start">
                    <div className="bg-slate-900/90 rounded-lg p-2.5 text-xs text-slate-200">
                      🎤 **Голосовое** (0:09) записано. <br/>
                      <span className="italic text-slate-400 text-[10px]">Расшифровано: «Запишите меня на ремонт кулера на среду»</span>
                    </div>
                  </div>
                  <div className="bg-blue-600 rounded-lg p-2.5 text-xs inline-block self-end text-white">
                    Запись создана на среду в 15:30.
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* CHAT PLAYGROUND SANDBOX ("ИИ-Консультант") - VERY ENGAGING */}
        <section id="sandbox_section" className="py-20 bg-[#07011d]/20 border-b border-[#a855f7]/15 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold text-brand-pink uppercase tracking-widest font-mono text-glow-pink">Живой ИИ-тестдрайв</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white mt-2 leading-tight">
                Пообщайтесь с ИИ прямо сейчас
              </h2>
              <p className="text-slate-400 text-sm sm:text-base mt-3">
                Выберите нужное направление бизнеса ниже. Вы будете общаться с настоящим обученным ИИ-консультантом. Попробуйте спросить его о ценах, условиях или акциях!
              </p>
            </div>

            {/* Sandbox Container Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Persona selector options (left - 4 items) */}
              <div className="lg:col-span-4 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4 font-mono">Выберите пресет бизнеса:</h3>
                  {PERSONAS.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPersonaId(p.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-center space-x-3.5 ${
                        selectedPersonaId === p.id 
                          ? "bg-brand-pink/15 border-brand-pink text-white shadow-md shadow-brand-pink/15 scale-[1.01]" 
                          : "bg-[#0c0522]/40 border-[#a855f7]/10 hover:border-[#a855f7]/30 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <span className="text-2xl">{p.avatar}</span>
                      <div className="flex-grow">
                        <div className="text-xs font-bold text-white">{p.name}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{p.subtitle}</div>
                      </div>
                      <ChevronRight size={14} className={selectedPersonaId === p.id ? "text-brand-pink text-glow-pink" : "text-slate-600"} />
                    </button>
                  ))}
                </div>

                {/* Info summary card of selected active assistant */}
                <div className="bg-[#120a30]/50 border border-[#a855f7]/20 rounded-2xl p-4 text-xs space-y-2 hidden lg:block leading-relaxed">
                  <div className="font-bold text-brand-pink font-display text-glow-pink">💡 Текущая роль:</div>
                  <p className="text-slate-300">{activePersonaData.description}</p>
                </div>
              </div>

              {/* Chat frame (right - 8 items) */}
              <div className="lg:col-span-8 glass-panel rounded-3xl p-4 sm:p-6 flex flex-col justify-between h-[520px] relative">
                
                {/* Header of sandbox chat */}
                <div className="flex items-center justify-between border-b border-[#a855f7]/25 pb-4 mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{activePersonaData.avatar}</span>
                    <div>
                      <h4 className="text-sm font-bold text-white font-display">{activePersonaData.name}</h4>
                      <p className="text-[10px] text-brand-pink font-medium flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-pink inline-block animate-ping"></span>
                        <span>ИИ Онлайн • Отвечает по базе знаний</span>
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={handleClearChat}
                    className="text-slate-300 hover:text-white px-3 py-1.5 border border-[#a855f7]/30 hover:border-brand-pink/50 bg-[#050212] rounded-lg text-[10px] font-semibold transition-all flex items-center space-x-1 cursor-pointer leading-none hover:shadow-[0_0_10px_rgba(236,72,153,0.15)]"
                  >
                    <RotateCcw size={10} />
                    <span>Сбросить диалог</span>
                  </button>
                </div>

                {/* Live Message History log */}
                <div className="flex-grow overflow-y-auto space-y-4 px-1 pr-2">
                  {(chatMessages[selectedPersonaId] || []).map((m, idx) => (
                    <div key={m.id || idx} className={`flex ${m.role === "user" ? "justify-end" : "justify-start animate-fade-in"}`}>
                      <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                        m.role === "user" 
                          ? "bg-gradient-to-r from-brand-pink via-brand-purple to-brand-cyan text-white rounded-br-none shadow-md" 
                          : "bg-[#050212]/90 text-slate-100 rounded-bl-none border border-[#a855f7]/25"
                      }`}>
                        {m.text}
                      </div>
                    </div>
                  ))}

                  {/* Typing Indicator loading state */}
                  {isChatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-[#050212]/90 border border-[#a855f7]/35 text-slate-200 rounded-2xl rounded-bl-none px-4 py-3 text-xs flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 bg-brand-pink rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-brand-pink rounded-full animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-1.5 h-1.5 bg-brand-pink rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        <span className="text-[10px] text-brand-pink/80 font-mono pl-1 text-glow-pink">ИИ-консультант подбирает ответ...</span>
                      </div>
                    </div>
                  )}
                  <div ref={chatBottomRef} />
                </div>

                {/* Suggested prompt bubbles helper */}
                <div className="mt-4">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2 font-mono">Быстрый запуск (нажмите на вопрос):</div>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                    {activePersonaData.suggestedQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleQuickQuestion(q)}
                        className="bg-[#050212]/85 hover:bg-[#0c0522] border border-[#a855f7]/15 hover:border-brand-pink/50 rounded-lg px-3 py-1.5 text-[10px] text-slate-300 hover:text-white transition-all text-left cursor-pointer font-sans"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input action form */}
                <form onSubmit={handleSendMessage} className="mt-4 pt-4 border-t border-[#a855f7]/20 flex items-center space-x-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    placeholder="Напишите ответ или вопрос консультанту..."
                    className="flex-grow bg-[#050212] border border-[#a855f7]/25 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-pink/60 transition-all focus:bg-[#07011d]"
                  />
                  <button 
                    type="submit" 
                    disabled={isChatLoading || !chatInput.trim()}
                    className="btn-vibrant-gradient disabled:opacity-30 disabled:hover:scale-100 text-white p-3 rounded-xl transition-all active:scale-95 cursor-pointer flex-shrink-0"
                  >
                    <Send size={14} className="translate-x-[-1px] translate-y-[1px]" />
                  </button>
                </form>

              </div>

            </div>

          </div>
        </section>

        {/* PRICING SELECTOR WITH DETAILED METRICS CALCULATOR (ROI GRAPH) */}
        <section id="tariffs_section" className="py-20 bg-[#07011d]/10 border-b border-[#a855f7]/15">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-bold text-brand-pink uppercase tracking-widest font-mono text-glow-pink">Стоимость интеграции</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white mt-2 leading-tight">
                Платите за результат, а не за токены
              </h2>
              <p className="text-slate-400 text-sm sm:text-base mt-2">
                Честные, прозрачные тарифы. Выберите готовый фиксированный пакет или подключите свой собственный API-ключ. Запросы списываются по факту реального использования.
              </p>
            </div>

            {/* HIGH-QUALITY INTERACTIVE ESTIMATION CALCULATOR */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl mb-14 max-w-4xl mx-auto">
              <div className="flex items-center space-x-2.5 mb-6">
                <div className="w-8 h-8 rounded-lg bg-brand-cyan/15 border border-brand-cyan/35 text-brand-cyan flex items-center justify-center text-glow-cyan">
                  <LineChart size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">Калькулятор окупаемости интеграции</h4>
                  <p className="text-[10px] text-slate-400 font-sans">Оцените часы работы менеджеров, сэкономленные за счёт ИИ</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                
                {/* Range Slider controls */}
                <div className="md:col-span-7 space-y-4">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-slate-300 font-semibold">Объём запросов в месяц:</span>
                    <span className="text-brand-cyan font-bold font-mono text-base text-glow-cyan">{queriesRange.toLocaleString()} шт.</span>
                  </div>
                  
                  <input
                    type="range"
                    min={200}
                    max={20000}
                    step={100}
                    value={queriesRange}
                    onChange={e => setQueriesRange(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-pink"
                  />

                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>200 запр.</span>
                    <span>5 000 запр.</span>
                    <span>10 000 запр.</span>
                    <span>20 000 запр.</span>
                  </div>
                </div>

                {/* Savings outcome display */}
                <div className="md:col-span-5 bg-[#050212]/92 p-5 rounded-2xl border border-[#a855f7]/25 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-sm font-semibold text-slate-400">Сэкономлено времени:</div>
                    <div className="text-xl sm:text-2xl font-bold font-display text-emerald-400 mt-1 font-mono">~{getSavingsHours()} ч.</div>
                    <p className="text-[10px] text-slate-550 mt-0.5">работы операторов</p>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-400">Эквивалент выгоды:</div>
                    <div className="text-xl sm:text-2xl font-bold font-display text-brand-pink mt-1 font-mono text-glow-pink">~{getMoneySaved().toLocaleString()} ₽</div>
                    <p className="text-[10px] text-slate-550 mt-0.5">сокращение ФОТ</p>
                  </div>
                </div>

              </div>
              
              {/* Highlight badge about our recommendation */}
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between bg-brand-pink/10 border border-brand-pink/30 p-3 rounded-xl gap-2 mt-4 text-center sm:text-left">
                <span className="text-xs text-brand-pink font-semibold text-glow-pink">
                  🚀 Оптимальный выбор при таком объёме: <span className="text-white font-bold">Тариф «{PRICING_PLANS.find(p => p.id === selectedPricingPlan)?.name}»</span>
                </span>
                <span className="text-[10px] font-mono text-slate-300 bg-[#0c0522] px-2.5 py-1 rounded-md border border-[#a855f7]/20 shadow">
                  Базовая стоимость: {PRICING_PLANS.find(p => p.id === selectedPricingPlan)?.price.toLocaleString()} ₽ / мес
                </span>
              </div>
            </div>

            {/* PRICING PLAN GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
              {PRICING_PLANS.map(plan => (
                <div
                  key={plan.id}
                  className={`relative rounded-3xl p-6 flex flex-col justify-between transition-all hover:translate-y-[-4px] ${
                    plan.id === selectedPricingPlan
                      ? "bg-[#180a3a]/80 border-brand-pink ring-1 ring-brand-pink/30 shadow-xl shadow-brand-pink/25 scale-[1.01]"
                      : "bg-[#0c0522]/40 border-[#a855f7]/10 hover:border-[#a855f7]/30 text-slate-400"
                  }`}
                >
                  {/* Recommended badge */}
                  {plan.badge && (
                    <span className="absolute top-4 right-4 bg-brand-pink text-white font-bold font-display text-[9px] px-2.5 py-1 rounded-full shadow-lg shadow-brand-pink/25 tracking-wider uppercase">
                      {plan.badge}
                    </span>
                  )}

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider font-mono">тарифный план</span>
                      <h3 className="text-lg font-bold text-white font-display leading-tight">{plan.name}</h3>
                    </div>

                    <div className="flex items-baseline space-x-1">
                      <span className="text-3xl font-extrabold text-white font-display tracking-tight text-glow-pink">{plan.price.toLocaleString()} ₽</span>
                      <span className="text-xs text-slate-400">/{plan.period}</span>
                    </div>

                    <p className="text-[11px] text-slate-300 leading-snug">{plan.description}</p>

                    <div className="border-t border-[#a855f7]/15 md:py-2"></div>

                    <ul className="space-y-2.5">
                      {plan.features.map((feat, i) => (
                        <li key={i} className="flex items-center space-x-2 text-xs text-slate-200">
                          <span className="w-4 h-4 rounded-full bg-brand-pink/10 border border-brand-pink/25 flex items-center justify-center text-brand-pink flex-shrink-0">
                            <span className="w-1.5 h-1.5 bg-brand-pink rounded-full text-glow-pink"></span>
                          </span>
                          <span className="leading-tight">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 pt-4">
                    <button 
                      onClick={() => scrollIntoView("audit_wizard_section")}
                      className={`w-full font-bold text-xs py-3 rounded-xl transition-all cursor-pointer text-center ${
                        plan.id === selectedPricingPlan
                          ? "btn-vibrant-gradient text-white shadow-lg"
                          : "bg-[#0a041f] hover:bg-[#120a30] text-slate-300 border border-[#a855f7]/25 hover:border-brand-pink/40 hover:shadow-[0_0_12px_rgba(236,72,153,0.15)]"
                      }`}
                    >
                      Начать на «{plan.name}»
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* INTERACTIVE LEAD FORM WIZARD (AUDIT SCAN WITH REAL GEMINI RUN) */}
        <section id="audit_wizard_section" className="py-20 bg-slate-950/80 border-b border-slate-900 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest font-mono">Индивидуальный разбор</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white mt-2 leading-tight">
                Готовы попробовать?
              </h2>
              <p className="text-slate-450 text-sm sm:text-base mt-2">
                Заполните за 30 секунд параметры вашего бизнеса. Наш ИИ проведёт моментальный квалификационный анализ и покажет классные идеи прямо на экране!
              </p>
            </div>

            {/* Smart Step Wizard UI Frame */}
            <div className="bg-slate-900/40 border border-indigo-500/20 max-w-3xl mx-auto rounded-3xl overflow-hidden shadow-2xl relative">
              
              {/* Stepper bar layout of current state */}
              {leadStep <= 3 && (
                <div className="bg-slate-950 px-6 py-4 border-b border-slate-850 flex items-center justify-between text-xs font-mono">
                  <span className={`font-semibold ${leadStep >= 1 ? "text-indigo-400" : "text-slate-500"}`}>1. Описание бизнеса</span>
                  <ChevronRight size={12} className="text-slate-700" />
                  <span className={`font-semibold ${leadStep >= 2 ? "text-indigo-400" : "text-slate-500"}`}>2. Выбор ИИ-агента</span>
                  <ChevronRight size={12} className="text-slate-700" />
                  <span className={`font-semibold ${leadStep >= 3 ? "text-indigo-400" : "text-slate-500"}`}>3. ИИ-Квалификация</span>
                </div>
              )}

              {/* Lead form controller contents */}
              <div className="p-6 sm:p-8">
                
                {/* STEP 1: BUSINESS BASE SPECS */}
                {leadStep === 1 && (
                  <form onSubmit={() => setLeadStep(2)} className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-white font-display">Расскажите о вашей задаче</h3>
                      <p className="text-xs text-slate-400 leading-snug">
                        Укажите название проекта и вашу сферу деятельности. Это поможет нашему ИИ-анализатору сформировать наиболее выгодный сценарий.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-300 font-sans">Имя компании или бренда:</label>
                        <input
                          type="text"
                          required
                          value={businessName}
                          onChange={e => setBusinessName(e.target.value)}
                          placeholder="Пример: МебельЛюкс, FitClub..."
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-300 font-sans">Отрасль деятельности / Ниша:</label>
                        <input
                          type="text"
                          required
                          value={businessType}
                          onChange={e => setBusinessType(e.target.value)}
                          placeholder="Пример: Стоматология, Кофейня..."
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-300 font-sans">Основная цель внедрения ИИ-ассистента (необязательно):</label>
                      <textarea
                        value={businessGoal}
                        onChange={e => setBusinessGoal(e.target.value)}
                        placeholder="Например: хочу чтобы ИИ консультировал по ценам мебели 24/7 и помогал записывать на бесплатный замер..."
                        className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none"
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={!businessName.trim() || !businessType.trim()}
                        className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-xs px-6 py-3.5 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer leading-none"
                      >
                        <span>Далее к ИИ-агентам</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </form>
                )}

                {/* STEP 2: CHOOSE TARGET AI AGENT ACTION */}
                {leadStep === 2 && (
                  <form onSubmit={handleGenerateAudit} className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-white font-display">Какой ИИ-Инструмент вас интересует больше?</h3>
                      <p className="text-xs text-slate-400">Выберите приоритетный ИИ-продукт, на котором хотите сосредоточить первоначальную интеграцию.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setTargetAgent("widget")}
                        className={`p-4 rounded-xl border text-left flex items-start space-x-3 transition-all cursor-pointer ${
                          targetAgent === "widget" ? "bg-indigo-600/10 border-indigo-500" : "bg-slate-950/60 border-slate-850"
                        }`}
                      >
                        <MessageSquareText size={16} className="text-cyan-400 mt-1 flex-shrink-0" />
                        <div>
                          <div className="text-xs font-bold text-white">ИИ-Виджет на сайт</div>
                          <p className="text-[10px] text-slate-500 mt-1">Чат-виджет для вопросов покупателей прямо на главной странице.</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setTargetAgent("bot")}
                        className={`p-4 rounded-xl border text-left flex items-start space-x-3 transition-all cursor-pointer ${
                          targetAgent === "bot" ? "bg-indigo-600/10 border-indigo-500" : "bg-slate-950/60 border-slate-850"
                        }`}
                      >
                        <Send size={16} className="text-blue-500 mt-1 flex-shrink-0" />
                        <div>
                          <div className="text-xs font-bold text-white">Telegram ИИ-Бот</div>
                          <p className="text-[10px] text-slate-500 mt-1">Автономный бот для чатов группы или поддержки в личке.</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setTargetAgent("agent")}
                        className={`p-4 rounded-xl border text-left flex items-start space-x-3 transition-all cursor-pointer ${
                          targetAgent === "agent" ? "bg-indigo-600/10 border-indigo-500" : "bg-slate-950/60 border-slate-850"
                        }`}
                      >
                        <FileText size={16} className="text-pink-400 mt-1 flex-shrink-0" />
                        <div>
                          <div className="text-xs font-bold text-white">Контент-Агент</div>
                          <p className="text-[10px] text-slate-500 mt-1">ИИ будет самостоятельно анализировать статьи и собирать посты.</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setTargetAgent("mail")}
                        className={`p-4 rounded-xl border text-left flex items-start space-x-3 transition-all cursor-pointer ${
                          targetAgent === "mail" ? "bg-indigo-600/10 border-indigo-500" : "bg-slate-950/60 border-slate-850"
                        }`}
                      >
                        <Mail size={16} className="text-purple-400 mt-1 flex-shrink-0" />
                        <div>
                          <div className="text-xs font-bold text-white">Mail Ассистент</div>
                          <p className="text-[10px] text-slate-500 mt-1">Ежедневные сжатые дайджесты и автоматизация черновиков писем.</p>
                        </div>
                      </button>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <button
                        type="button"
                        onClick={() => setLeadStep(1)}
                        className="text-xs font-bold text-slate-400 hover:text-white px-4 py-2 border border-slate-800 rounded-xl cursor-pointer bg-slate-950/60"
                      >
                        Назад
                      </button>
                      <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-6 py-3.5 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer leading-none"
                      >
                        <span>Запустить ИИ-Анализ</span>
                        <Sparkles size={12} className="text-cyan-300" />
                      </button>
                    </div>
                  </form>
                )}

                {/* STEP 3: RUNNING SPINNER ANALYZER STEP */}
                {leadStep === 3 && (
                  <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 flex items-center justify-center border border-indigo-500/20 text-indigo-400 animate-spin">
                      <Sparkles size={24} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white font-display">TuStart ИИ анализирует вашу заявку...</h4>
                      <p className="text-xs text-slate-500 max-w-sm">
                        ИИ изучает отрасль "{businessType}" и формирует оптимальную технологическую конфигурацию, применимые идеи и пилотный оффер.
                      </p>
                    </div>
                  </div>
                )}

                {/* STEP 4: AUDIT RESULTS RENDER */}
                {leadStep === 4 && qualificationResult && (
                  <div className="space-y-6">
                    
                    {/* Header score card */}
                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 flex flex-col sm:flex-row justify-between items-center gap-4">
                      <div className="space-y-1 text-center sm:text-left">
                        <span className="text-[9px] font-bold text-green-400 bg-green-950 px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">Анализ завершён</span>
                        <h4 className="text-base font-bold text-white font-display mt-1">Рекомендации для {businessName || "вашего проекта"}</h4>
                        <div className="text-[10px] text-slate-500">Спецификация для направления: {businessType}</div>
                      </div>

                      <div className="text-center sm:text-right bg-slate-900 border border-slate-800 px-5 py-3 rounded-xl flex-shrink-0 min-w-36">
                        <div className="text-3xl font-extrabold text-indigo-400 font-display transition-all font-mono">+{qualificationResult.efficiencyBoost}%</div>
                        <div className="text-[10px] text-slate-400 mt-0.5 font-sans leading-tight">Прогноз автоматизации рутины</div>
                      </div>
                    </div>

                    {/* Stack recommend list */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Left: Stack info */}
                      <div className="bg-slate-95 w-full border border-slate-850/60 p-4 rounded-xl space-y-3">
                        <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Рекомендуемая связка ИИ:</h5>
                        <ul className="space-y-2">
                          {qualificationResult.recommendedStack.map((stk, idx) => (
                            <li key={idx} className="flex items-center space-x-2 text-xs text-slate-200">
                              <span className="w-4 h-4 rounded bg-indigo-600 text-white flex items-center justify-center">
                                <Check size={10} />
                              </span>
                              <span className="font-semibold">{stk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Right: Simulated Preview message */}
                      <div className="bg-slate-95 w-full border border-slate-850/60 p-4 rounded-xl space-y-2">
                        <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Тестовый приветственный оффер:</h5>
                        <p className="text-[11px] text-indigo-200 italic leading-relaxed bg-slate-900 p-2.5 rounded-lg border border-slate-850">
                          {qualificationResult.welcomeMessage}
                        </p>
                      </div>

                    </div>

                    {/* 3 custom implementation ideas */}
                    <div className="space-y-2.5">
                      <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">3 конкретных шага внедрения от нашего ИИ:</h5>
                      <div className="grid grid-cols-1 gap-2.5">
                        {qualificationResult.keyIdeas.map((idea, idx) => (
                          <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 flex items-start space-x-3 text-xs leading-relaxed text-slate-300">
                            <span className="w-5 h-5 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan font-bold flex-shrink-0">
                              {idx + 1}
                            </span>
                            <span>{idea}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Retrying / match again block */}
                    <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-850/60 pt-5 gap-3">
                      <button
                        type="button"
                        onClick={handleResetAudit}
                        className="text-xs font-semibold text-slate-400 hover:text-white flex items-center space-x-1 cursor-pointer"
                      >
                        <RotateCcw size={12} />
                        <span>Собрать заново</span>
                      </button>

                      <div className="flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={() => {
                            alert("Ваша квалификационная заявка успешно отправлена нашему ведущему архитектору! Мы свяжемся с вами в течение 15 минут.");
                            handleResetAudit();
                          }}
                          className="bg-brand-blue hover:bg-brand-blue/90 text-white font-bold text-xs px-5 py-3.5 rounded-xl transition-all shadow shadow-indigo-600/10 cursor-pointer"
                        >
                          Сохранить эти идеи и запустить пилот 🚀
                        </button>
                      </div>
                    </div>

                  </div>
                )}

              </div>

            </div>

          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-900 py-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Logo and copys */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-base">
              T
            </div>
            <div>
              <span className="font-bold text-slate-300 text-sm font-display">TuStart AI</span>
              <p className="text-[10px] text-slate-500 mt-0.5">© 2026 TuStart. Все права защищены.</p>
            </div>
          </div>

          {/* Slogans */}
          <div className="text-center md:text-right space-y-1">
            <p className="text-slate-400 font-medium">Платформа автоматизации бизнеса на базе современных ИИ-моделей</p>
            <p className="text-[10px] text-slate-600 font-mono">Поддержка • Telegram • Автокопирайтинг • Mail Ассистент</p>
          </div>

        </div>
      </footer>
    </div>
  );
}
