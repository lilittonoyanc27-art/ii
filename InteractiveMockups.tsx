import React, { useState } from "react";
import { MessageSquareText, Send, FileText, Mail, ShieldAlert, Sparkles, Check, CheckCheck, Play, Pause, RefreshCw } from "lucide-react";
import { MOCK_CONTENT_ITEMS } from "./data";

// Type definitions inside the component for safety
interface MockupsProps {
  activeTab: "widget" | "bot" | "agent" | "mail";
}

export default function InteractiveMockups({ activeTab }: MockupsProps) {
  switch (activeTab) {
    case "widget":
      return <WidgetMockup />;
    case "bot":
      return <TelegramMockup />;
    case "agent":
      return <ContentAgentMockup />;
    case "mail":
      return <MailAssistantMockup />;
    default:
      return <WidgetMockup />;
  }
}

// 1. WEBSITE WIDGET MOCKUP
function WidgetMockup() {
  const [messages, setMessages] = useState([
    { id: 1, role: "model", text: "Здравствуйте! Я ИИ-консультант TuStart AI. Чем могу помочь вашему бизнесу сегодня?" },
    { id: 2, role: "user", text: "Вы можете интегрировать ИИ с нашей CRM Bitrix24?" },
    { id: 3, role: "model", text: "Да, абсолютно! Виджет бесшовно синхронизируется с Bitrix24, amoCRM и другими популярными CRM. Все контакты клиентов и история переписки автоматически передаются менеджерам в реальном времени. Хотите протестировать?" }
  ]);
  const [inp, setInp] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inp.trim()) return;
    const userMsg = { id: Date.now(), role: "user", text: inp };
    setMessages(prev => [...prev, userMsg]);
    setInp("");

    // Simulate smart support auto-reply
    setTimeout(() => {
      const answers = [
        "Отличный вопрос! База знаний загружается в виде файлов PDF, CSV или ссылок на ваш сайт. Наш ИИ обучается за 3 минуты и отвечает строго на основе этих данных.",
        "Да, у нас есть гибкая настройка дизайна виджета. Вы сможете изменить фирменную иконку, цвета кнопок и шрифты под стиль вашего сайта.",
        "Конечно, если ИИ сталкивается со сложным вопросом, он вежливо предлагает переключить чат на живого сотрудника поддержки, отправив ему СМС или пуш в Telegram."
      ];
      const randomAnswer = answers[Math.floor(Math.random() * answers.length)];
      setMessages(prev => [...prev, { id: Date.now() + 1, role: "model", text: randomAnswer }]);
    }, 1000);
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[480px]">
      {/* Browser address bar */}
      <div className="bg-slate-950/80 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex space-x-2">
          <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block"></span>
          <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block"></span>
        </div>
        <div className="flex-1 max-w-sm mx-4">
          <div className="bg-slate-900 border border-slate-800/80 text-[11px] text-slate-400 py-1 px-3 rounded-md text-center font-mono truncate">
            https://yourcompany.ru
          </div>
        </div>
        <div className="w-12"></div>
      </div>

      {/* Mock Site Content under browser */}
      <div className="flex-1 p-6 relative bg-slate-950 flex flex-col justify-between overflow-hidden">
        {/* Background mockup styling */}
        <div className="opacity-20 star-pattern pointer-events-none">
          <div className="h-6 w-3/4 bg-slate-800 rounded mb-3"></div>
          <div className="h-4 w-1/2 bg-slate-800 rounded mb-8"></div>
          <div className="grid grid-cols-3 gap-3">
            <div className="h-20 bg-slate-800/60 rounded"></div>
            <div className="h-20 bg-slate-800/60 rounded"></div>
            <div className="h-20 bg-slate-800/60 rounded"></div>
          </div>
        </div>

        {/* Floating Chat Widget popup in the lower right corner */}
        <div className="absolute right-4 bottom-4 w-80 bg-slate-900 border border-indigo-500/40 rounded-xl overflow-hidden shadow-2xl flex flex-col h-[340px] z-10">
          <div className="bg-gradient-to-r from-cyan-600 to-indigo-600 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <h4 className="text-xs font-semibold text-white">Поддержка онлайн</h4>
            </div>
            <span className="text-[10px] text-slate-200">TuStart</span>
          </div>

          <div className="flex-grow p-3 space-y-3 overflow-y-auto text-[11px]">
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-lg px-3 py-2 ${m.role === "user" ? "bg-indigo-600 text-white rounded-br-none" : "bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700/60"}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="p-2 bg-slate-950 border-t border-slate-800 flex items-center space-x-1">
            <input
              type="text"
              value={inp}
              onChange={e => setInp(e.target.value)}
              placeholder="Спросите ИИ-ассистента..."
              className="flex-grow bg-slate-900 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white p-1.5 rounded-md transition-colors">
              <Send size={12} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// 2. TELEGRAM BOT MOCKUP
function TelegramMockup() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const toggleVoice = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      let current = 0;
      const interval = setInterval(() => {
        current += 5;
        setProgress(current);
        if (current >= 100) {
          setIsPlaying(false);
          setProgress(0);
          clearInterval(interval);
        }
      }, 200);
    } else {
      setProgress(0);
    }
  };

  return (
    <div className="bg-slate-950 border border-slate-850 rounded-3xl p-4 shadow-2xl relative max-w-sm mx-auto overflow-hidden h-[480px] flex flex-col justify-between">
      {/* Smartphone notch and top bar */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-4 bg-slate-900 rounded-b-xl z-20 flex justify-center items-center">
        <span className="w-12 h-1 bg-slate-800 rounded-full inline-block"></span>
      </div>

      {/* Header bar of Telegram bot */}
      <div className="bg-slate-900/90 pt-4 pb-3 px-3 rounded-t-xl border-b border-slate-800 flex items-center justify-between z-10">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
            A
          </div>
          <div>
            <div className="text-xs font-semibold text-white">Aibo Support</div>
            <div className="text-[9px] text-green-400">в сети • отвечает мгновенно</div>
          </div>
        </div>
        <div className="text-[10px] text-slate-500 bg-slate-950 px-2 py-0.5 rounded-full font-mono">
          ИИ-бот
        </div>
      </div>

      {/* Telegram Chat History */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs">
        <div className="flex justify-start">
          <div className="bg-slate-900/90 text-slate-100 rounded-xl px-3 py-2 max-w-[85%] rounded-tl-none border border-slate-800">
            Привет! Чем помочь? 😊
          </div>
        </div>

        <div className="flex justify-end">
          <div className="bg-blue-600 text-white rounded-xl px-3 py-2 max-w-[85%] rounded-tr-none">
            Хочу записаться на консультацию завтра в первой половине дня
          </div>
        </div>

        <div className="flex justify-start">
          <div className="bg-slate-900/90 text-slate-100 rounded-xl px-3 py-2 max-w-[85%] rounded-tl-none border border-slate-800">
            Свободные слоты на завтра:<br/>
            📅 **9:30, 10:15, 11:00, 11:45.** Какое время удобнее для вас?
          </div>
        </div>

        <div className="flex justify-end">
          <div className="bg-blue-600 text-white rounded-xl px-3 py-2 max-w-[85%] rounded-tr-none">
            Давайте 10:15
          </div>
        </div>

        <div className="flex justify-start">
          <div className="bg-slate-900/90 text-slate-100 rounded-xl px-3 py-2 max-w-[85%] rounded-tl-none border border-slate-800">
            Записал на **10:15** ✅ Менеджер позвонит за час до встречи для подтверждения!
          </div>
        </div>

        {/* Simulated audio response */}
        <div className="flex justify-start">
          <div className="bg-slate-900/90 rounded-xl p-3 max-w-[85%] rounded-tl-none border border-indigo-900/30">
            <div className="flex items-center space-x-3">
              <button 
                onClick={toggleVoice} 
                className="w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer"
              >
                {isPlaying ? <Pause size={12} className="fill-current" /> : <Play size={12} className="ml-0.5 fill-current" />}
              </button>
              <div className="flex-grow">
                <div className="text-[10px] text-indigo-400 font-semibold mb-1">🎙️ Голосовой ответ (0:14)</div>
                {/* Audio wave simulator */}
                <div className="flex items-end space-x-[2px] h-4">
                  {[12, 16, 8, 4, 14, 18, 6, 12, 16, 10, 8, 14, 4, 10, 12, 18, 6].map((h, i) => (
                    <span 
                      key={i} 
                      className={`w-[3px] rounded-full transition-all duration-300 ${isPlaying ? 'bg-indigo-500' : 'bg-slate-700'}`}
                      style={{ 
                        height: isPlaying ? `${Math.random() * 100}%` : `${h}px`,
                        opacity: isPlaying ? 1 : 0.6
                      }}
                    ></span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-2 text-[10px] bg-slate-950/80 p-2 rounded text-slate-400 leading-snug border-l border-indigo-500 font-mono">
              ИИ расшифровал: «Запись оформлена, менеджер на связи. Встреча состоится онлайн в Zoom».
            </div>
          </div>
        </div>
      </div>

      {/* Input panel */}
      <div className="bg-slate-900 px-3 py-2 rounded-xl flex items-center justify-between border border-slate-800">
        <span className="text-slate-500 text-xs">Сообщение...</span>
        <button className="bg-blue-600 text-white p-1.5 rounded-full">
          <Send size={12} />
        </button>
      </div>
    </div>
  );
}

// 3. CONTENT AGENT MOCKUP
function ContentAgentMockup() {
  const [contentList, setContentList] = useState(MOCK_CONTENT_ITEMS);
  const [isSyncing, setIsSyncing] = useState(false);

  const triggerSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      // Shuffle list to simulate fresh generator crawl
      setContentList(prev => [...prev].reverse());
    }, 1500);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[480px]">
      {/* Content Agent Control Header */}
      <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center">
            <FileText size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">Контент-агент «Логистика»</h4>
            <div className="flex items-center space-x-1 text-[10px] text-green-400 font-mono mt-0.5">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block animate-pulse"></span>
              <span>Мониторинг активен</span>
            </div>
          </div>
        </div>

        <button 
          onClick={triggerSync}
          disabled={isSyncing}
          className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 px-3 py-1.5 rounded-lg text-xs leading-none transition-all cursor-pointer font-semibold"
        >
          <RefreshCw size={12} className={isSyncing ? "animate-spin" : ""} />
          <span>{isSyncing ? "Обновление..." : "Перезапустить"}</span>
        </button>
      </div>

      {/* Main Stats bar inside Mockup */}
      <div className="bg-slate-950/40 grid grid-cols-3 divide-x divide-slate-850 py-3 border-b border-slate-850">
        <div className="text-center px-2">
          <div className="text-xl font-bold font-display text-indigo-400">142</div>
          <div className="text-[10px] text-slate-500">статей готово</div>
        </div>
        <div className="text-center px-2">
          <div className="text-xl font-bold font-display text-indigo-400">8</div>
          <div className="text-[10px] text-slate-500">сайтов-доноров</div>
        </div>
        <div className="text-center px-2">
          <div className="text-xl font-bold font-display text-indigo-400">3х/день</div>
          <div className="text-[10px] text-slate-500">частота выгрузки</div>
        </div>
      </div>

      {/* Feed list */}
      <div className="flex-grow p-4 overflow-y-auto space-y-2.5">
        {contentList.map(item => (
          <div key={item.id} className="bg-slate-950/60 hover:bg-slate-950 border border-slate-850 hover:border-slate-800 p-3 rounded-xl transition-all flex items-start justify-between">
            <div className="space-y-1 pr-4">
              <div className="flex items-center space-x-2">
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                  item.status === 'active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                  item.status === 'ready' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 
                  'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                }`}>
                  {item.type}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">{item.meta}</span>
              </div>
              <h5 className="text-xs font-semibold text-slate-200 line-clamp-1 leading-normal">{item.title}</h5>
            </div>

            <div className="text-right whitespace-nowrap self-center">
              <span className={`text-[10px] font-mono leading-none flex items-center space-x-1 ${
                item.status === 'active' ? 'text-green-400' :
                item.status === 'ready' ? 'text-blue-400' :
                'text-yellow-400'
              }`}>
                <span className={`w-1 h-1 rounded-full ${
                  item.status === 'active' ? 'bg-green-500' :
                  item.status === 'ready' ? 'bg-blue-500' :
                  'bg-yellow-400'
                }`}></span>
                <span>{item.statusText}</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Control Action footer */}
      <div className="p-3 bg-slate-950/90 border-t border-slate-800 flex justify-end">
        <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-xs px-4 py-2 rounded-lg hover:opacity-90 active:scale-95 transition-all flex items-center space-x-1 leading-none shadow-lg shadow-purple-500/10">
          <span>Сгенерировать вне очереди</span>
          <Sparkles size={12} />
        </button>
      </div>
    </div>
  );
}

// 4. MAIL ASSISTENT MOCKUP
function MailAssistantMockup() {
  const [activeMode, setActiveMode] = useState<"digest" | "reply">("digest");

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[480px]">
      {/* Mail Header */}
      <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Mail size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">Mail Ассистент</h4>
            <div className="text-[10px] text-slate-400 font-mono">2 почтовых ящика подключено</div>
          </div>
        </div>

        {/* Mode Selector Tab */}
        <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800">
          <button 
            type="button"
            onClick={() => setActiveMode("digest")}
            className={`text-[10px] font-semibold px-2.5 py-1 rounded-md transition-all cursor-pointer ${activeMode === "digest" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
          >
            Дайджест (1)
          </button>
          <button 
            type="button"
            onClick={() => setActiveMode("reply")}
            className={`text-[10px] font-semibold px-2.5 py-1 rounded-md transition-all cursor-pointer ${activeMode === "reply" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
          >
            Авто-письма (2)
          </button>
        </div>
      </div>

      {/* Digest View */}
      {activeMode === "digest" ? (
        <div className="flex-1 p-5 flex flex-col justify-between overflow-y-auto bg-slate-950">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2.5">
              <h5 className="text-xs font-bold text-indigo-400 tracking-wide font-display uppercase">🗂️ КРАТКИЙ ДАЙДЖЕСТ: 47 ВХОДЯЩИХ ПИСЕМ</h5>
              <span className="text-[10px] text-slate-500 font-mono">Обновлено в 09:00</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              За ночь пришло **47 рабочих сообщений**. ИИ провёл синтаксический анализ и выделил **3 критические задачи** с наивысшим приоритетом:
            </p>

            <div className="space-y-3">
              <div className="bg-slate-900/80 border-l-2 border-red-500 p-3 rounded-r-xl space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-bold text-red-400 font-display">⚠️ Срочный Контракт</span>
                  <span className="text-[9px] text-slate-500 font-mono">Инвестор Альянс</span>
                </div>
                <p className="text-xs font-semibold text-slate-200">Требуется правка спецификации пункта 4.2 в договоре до 14:00!</p>
              </div>

              <div className="bg-slate-900/80 border-l-2 border-amber-500 p-3 rounded-r-xl space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-bold text-amber-400 font-display">📥 Техподдержка</span>
                  <span className="text-[9px] text-slate-500 font-mono">ГПБ Логистик (VIP)</span>
                </div>
                <p className="text-xs font-semibold text-slate-200">Сбой интегратора API. Менеджер Виктор вызвался на помощь.</p>
              </div>

              <div className="bg-slate-900/80 border-l-2 border-blue-500 p-3 rounded-r-xl space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-bold text-blue-400 font-display">💡 Лид с сайта</span>
                  <span className="text-[9px] text-slate-500 font-mono">ООО Мегатек</span>
                </div>
                <p className="text-xs font-semibold text-slate-200">Просят выслать оптовую смету на закупку 200 экранов.</p>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 italic bg-slate-900/50 p-2 border border-slate-850 rounded-lg text-center mt-3 font-mono">
            Остальные 44 письма классифицированы как низкоприоритетные рассылки.
          </div>
        </div>
      ) : (
        <div className="flex-1 p-5 flex flex-col justify-between overflow-y-auto bg-slate-950">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2.5">
              <h5 className="text-xs font-bold text-indigo-400 tracking-wide font-display uppercase">📝 ЧЕРНОВИКИ АВТООТВЕТОВ ИИ</h5>
              <span className="text-[10px] text-green-400 font-mono">Готовы к отправке</span>
            </div>

            <div className="space-y-3.5">
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-850 space-y-2">
                <div className="flex justify-between items-center text-[10px] border-b border-slate-850/60 pb-1.5">
                  <span className="text-slate-400">Кому: **office@megatec.ru**</span>
                  <span className="text-slate-500">По поводу: Смета поставки</span>
                </div>
                <p className="text-[11px] text-slate-300 italic max-h-16 overflow-y-auto">
                  «Уважаемый Алексей, спасибо за запрос! Мы подготовили расчет специальной оптовой скидки 15% на закупку 200 мониторов. Прикрепляем смету к письму...»
                </p>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-[9px] text-green-400 font-semibold flex items-center space-x-0.5">
                    <CheckCheck size={10} />
                    <span>ИИ сам заполнил цены из базы</span>
                  </span>
                  <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-[9px] px-2 py-1 rounded cursor-pointer leading-none">
                    Отправить
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-2">
                <div className="flex justify-between items-center text-[10px] border-b border-slate-850/60 pb-1.5">
                  <span className="text-slate-400">Кому: **hr@alliance.ru**</span>
                  <span className="text-slate-500">По поводу: Запись на созвон</span>
                </div>
                <p className="text-[11px] text-slate-300 italic max-h-16 overflow-y-auto">
                  «Здравствуйте, Кристина! С радостью созвонюсь с вами в пятницу в 12:00. Мой календарь синхронизирован. Высылаю ссылку на Zoom-встречу...»
                </p>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-[9px] text-indigo-400 font-semibold flex items-center space-x-0.5">
                    <CheckCheck size={10} />
                    <span>Интегрировано с Календарем</span>
                  </span>
                  <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-[9px] px-2 py-1 rounded cursor-pointer leading-none">
                    Отправить
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
