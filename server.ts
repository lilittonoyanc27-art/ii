import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lazy initialization of Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY") {
      console.warn("WARNING: GEMINI_API_KEY is not configured or uses placeholder. Falling back to local responsive simulation.");
      return null;
    }
    try {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    } catch (err) {
      console.error("Failed to initialize GoogleGenAI client:", err);
      return null;
    }
  }
  return aiClient;
}

// Business Consultant Persona definitions
const PERSONA_PROMPTS: Record<string, string> = {
  ecommerce: `Вы — профессиональный ИИ-консультант "TuStart AI" для интернет-магазина электроники и гаджетов SmartSpace.
Ваша цель — вежливо консультировать покупателей, отвечать на вопросы о доставке (доставляем за 2 часа по городу, бесплатно от 5000 рублей, гарантия 12 месяцев на всё) и помогать подбирать товары.
Держите ответы лаконичными, дружелюбными, профессиональными и полностью на русском языке. Всегда предлагайте скидку 10% по промокоду TUSTART10 для новых клиентов.`,

  edtech: `Вы — ведущий ИИ-координатор образовательной платформы "SkillGrow".
Вы консультируете будущих студентов по курсам программирования, веб-дизайна и ИИ-аналитики. 
Ваша цель — тепло и вовлекающе рассказать о программах (обучение 6-9 месяцев, трудоустройство гарантировано договором, рассрочка от 2500 рублей в месяц, первые 2 недели занятий — бесплатно).
Отвечайте структурированно, профессионально и на русском языке, помогайте выбрать направление.`,

  clinic: `Вы — заботливый ИИ-администратор современной семейной клиники "Здоровье и Забота".
Вы помогаете пациентам узнать о врачах клиники, графике работы и записаться на приём к терапевту, педиатру или кардиологу.
Напоминайте, что у нас современное оборудование, приём по записи без очередей, а первичная консультация терапевта стоит всего 1200 рублей (скидка 20% в этот месяц). 
Отвечайте предельно уважительно, чутко, профессионально и на русском языке.`,

  legal: `Вы — ведущий ИИ-ассистент юридической группы "Защита и Право".
Вы проводите первичную экспресс-квалификацию клиентов по вопросам защиты прав потребителей, разводов, недвижимости и споров по бизнесу.
Ваша цель — выслушать проблему, кратко подсказать общие юридические шаги, зафиксировать контакты и объяснить, что для детального разбора нужна часовая консультация (сейчас действует спец-цена: 1500 рублей вместо 3000 рублей).
Отвечайте строго, профессионально, убедительно и на русском языке.`
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Live Chat with simulated customizable models
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, persona, history } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const selectedPersona = persona || "ecommerce";
      const systemInstruction = PERSONA_PROMPTS[selectedPersona] || PERSONA_PROMPTS.ecommerce;

      const ai = getGeminiClient();

      if (!ai) {
        // High quality simulation fallback if API key is not present
        return res.json({
          text: getSimulatedResponse(selectedPersona, message, history || [])
        });
      }

      // Convert history format to system format
      // SDK chats format: [{ role: "user", parts: [{ text: "..." }] }]
      const formattedContents = [
        ...history.map((h: any) => ({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.text }]
        })),
        { role: "user", parts: [{ text: message }] }
      ];

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      return res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini Chat API Error:", error);
      return res.status(200).json({ 
        text: "Извините, произошла небольшая заминка на сервере при обработке запроса. Но я по-прежнему готов помочь вам как ИИ-консультант!" 
      });
    }
  });

  // API Route: Smart lead qualification mapping with structured recommendations (uses JSON output)
  app.post("/api/qualify", async (req, res) => {
    try {
      const { businessName, businessType, selectedAgent, taskGoal } = req.body;
      
      const ai = getGeminiClient();
      if (!ai) {
        // Simulated structured logic if key is omitted
        return res.json(getSimulatedQualification(businessName, businessType, selectedAgent, taskGoal));
      }

      const prompt = `Проведи детальный аудит интеграции ИИ для бизнеса.
Имя компании/проект: ${businessName || "Без названия"}
Отрасль/направление: ${businessType || "Услуги/Продажи"}
Выбранный главный ИИ-продукт: ${selectedAgent || "ИИ-виджет на сайт"}
Цель внедрения ассистента: ${taskGoal || "Автоматизировать общение с клиентами 24/7"}

Ты должен вернуть ответ строго в формате JSON со следующими свойствами:
1. recommendedStack: массив строк (какие именно ИИ-инструменты лучше связать, например ["ИИ-Виджет", "Mail Ассистент"])
2. efficiencyBoost: число процентов от 50 до 95 (прогнозируемый прирост автоматизации)
3. keyIdeas: массив из 3 конкретных и классных идей внедрения (например, "ИИ может автоматически рассчитывать примерную стоимость ремонта прямо в чате")
4. welcomeMessage: готовый текст приветственного сообщения, которое этот ИИ-ассистент напишет клиенту на сайте или в Telegram.

Пожалуйста, отвечай на русском языке.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recommendedStack: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of recommended AI tools to integrate"
              },
              efficiencyBoost: {
                type: Type.INTEGER,
                description: "Projected workflow automation efficiency percentage (50-95)"
              },
              keyIdeas: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "3 highly tailored ideas for implementing this client's goals"
              },
              welcomeMessage: {
                type: Type.STRING,
                description: "A tailored warm introductory message for their website widget or bot"
              }
            },
            required: ["recommendedStack", "efficiencyBoost", "keyIdeas", "welcomeMessage"]
          }
        }
      });

      const parsedResult = JSON.parse(response.text || "{}");
      return res.json(parsedResult);
    } catch (error) {
      console.error("Gemini Qualification API Error:", error);
      // Fail gracefully with simulated detailed analysis
      return res.json(getSimulatedQualification(
        req.body.businessName, 
        req.body.businessType, 
        req.body.selectedAgent, 
        req.body.taskGoal
      ));
    }
  });

  // Serve static assets and index.html in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server fully operational on http://0.0.0.0:${PORT}`);
  });
}

// Fallback high-quality responses for the interactive playground when Gemini key is not ready
function getSimulatedResponse(persona: string, message: string, history: any[]): string {
  const msgLower = message.toLowerCase();

  if (persona === "ecommerce") {
    if (msgLower.includes("доставк") || msgLower.includes("привез") || msgLower.includes("как получит")) {
      return "🚚 Доставка у нас супер-быстрая! По городу доставляем всего за 2 часа курьером. При заказе от 5000 рублей доставка полностью бесплатная (если меньше — всего 290 рублей). Хотите оформить заказ или подсказать по наличию?";
    }
    if (msgLower.includes("скидк") || msgLower.includes("ценой") || msgLower.includes("дешев") || msgLower.includes("промок")) {
      return "🎉 Специально для вас у меня есть отличные новости! Вы можете заказать любой товар со скидкой 10% по промокоду **TUSTART10**. Просто введите его в корзине при оформлении!";
    }
    if (msgLower.includes("гарант") || msgLower.includes("сломает") || msgLower.includes("вернуть")) {
      return "🛡️ Мы на 100% уверены в качестве наших товаров! На всё оборудование действует официальная гарантия 12 месяцев. В случае любых вопросов наш сертифицированный сервисный центр сделает ремонт или замену оперативно.";
    }
    return `Здравствуйте! Я ваш умный ИИ-консультант магазина гаджетов SmartSpace. Рад ответить на любые вопросы! Помочь выбрать классный смартфон, наушники или рассказать про условия быстрой доставки за 2 часа? Не забудьте получить скидку 10% по промокоду **TUSTART10**!`;
  }

  if (persona === "edtech") {
    if (msgLower.includes("бесплат") || msgLower.includes("попроб")) {
      return "🎓 Абсолютно верно! Вы можете начать учиться совершенно бесплатно. Мы дарим полноценные первые 2 недели занятий, чтобы вы оценили программу, формат лекций и пообщались с личным ментором. Будет интересно!";
    }
    if (msgLower.includes("трудоустрой") || msgLower.includes("работ") || msgLower.includes("ваканс")) {
      return "💼 Наша главная цель — ваша новая работа! Мы гарантируем трудоустройство в IT-компании официально по договору. Если после успешного окончания курсов вы не найдете работу, мы вернем полную стоимость обучения. Наш карьерный центр поможет составить резюме и подготовит к собеседованиям!";
    }
    if (msgLower.includes("плат") || msgLower.includes("стоимост") || msgLower.includes("цен") || msgLower.includes("креди")) {
      return "💳 Мы делаем образование доступным. Стоимость обучения по рассрочке начинается всего от 2 500 рублей в месяц без процентов и переплат. Также у нас есть скидки до 40% на этой неделе при полной единовременной оплате. Какое направление вас привлекает больше всего — веб-разработка, дизайн или искусственный интеллект?";
    }
    return "Приветствую! Я виртуальный координатор SkillGrow. Помогаю освоить востребованные специальности в IT с гарантией трудоустройства. Какой курс вас интересует? У нас сейчас можно записаться на первые 2 недели тест-драйва бесплатно!";
  }

  if (persona === "clinic") {
    if (msgLower.includes("запис") || msgLower.includes("прием") || msgLower.includes("врач")) {
      return "📅 С радостью помогу вам записаться к нужному врачу! Пожалуйста, укажите, к какому специалисту вы хотите попасть (например, терапевт, педиатр, лор или кардиолог) и какое время для вас удобнее (утро или вторая половина дня)?";
    }
    if (msgLower.includes("цен") || msgLower.includes("анализ") || msgLower.includes("рубл")) {
      return "💎 Наша клиника предлагает одни из лучших условий семейной медицины! Первичный приём ведущего терапевта по акции сейчас стоит всего 1200 рублей вместо 1800 рублей. Все анализы можно сдать прямо у нас в день приёма без очередей.";
    }
    return "Здравствуйте! Я заботливый ИИ-администратор клиники «Здоровье и Забота». Отвечу на вопросы о графике работы специалистов, помогу выбрать терапевта или педиатра и запишу вас на удобное время. У нас уютно, нет очередей, а первичный приём врача сейчас идет со скидкой!";
  }

  if (persona === "legal") {
    if (msgLower.includes("консульт") || msgLower.includes("встреч") || msgLower.includes("офис")) {
      return "⚖️ Для детального разбора вашего вопроса необходима часовая консультация юриста. Сейчас у нас действует специальная акция: полноценный разбор документов и выработка стратегии стоят всего 1500 рублей вместо 3000 рублей. В какой день вам удобно созвониться или встретиться?";
    }
    if (msgLower.includes("суд") || msgLower.includes("иск") || msgLower.includes("договор")) {
      return "📋 Мы специализируемся на ведении дел под ключ. Наш адвокат подготовит претензию, исковое заявление, а также полностью представит ваши интересы в судебных заседаниях. Наш процент побед составляет более 92%. Опишите кратко вашу ситуацию, и я подскажу первые шаги!";
    }
    return "Приветствую! На связи ИИ-ассистент юридической группы «Защита и Право». Наша команда защищает интересы физических и юридических лиц в судах и спорах. По какому вопросу вам необходима помощь? Опишите ситуацию — я сориентирую по закону и помогу записаться на консультацию юриста по спец-цене!";
  }

  return "Здравствуйте! Я многоцелевой ИИ-консультант платформы TuStart AI. Отвечу на любой ваш вопрос со знанием дела!";
}

function getSimulatedQualification(name: string, type: string, agent: string, goal: string) {
  const compName = name || "Ваш проект";
  const agentName = agent || "ИИ-виджет на сайт";
  const compType = type || "Бизнес услуги";

  let stack = [agentName];
  if (compType.toLowerCase().includes("магазин") || compType.toLowerCase().includes("торгов")) {
    stack.push("ИИ-бот в Telegram");
  } else {
    stack.push("Mail Ассистент");
  }

  const efficiency = Math.floor(Math.random() * 21) + 72; // Generates 72% to 92%

  const ideas = [
    `Автоматизация частых вопросов по отрасли "${compType}" — ИИ ответит на вопросы клиентов мгновенно 24/7 без привлечения живых сотрудников.`,
    `Интеграция с базой знаний позволит решать типичные проблемы клиентов за 15 секунд, снижая нагрузку на техподдержку до 80%.`,
    `Умная сегментация лидов: ИИ мгновенно выявляет горячих клиентов по их вопросам и бережно передает их вашему отделу продаж с полной сводкой в Telegram.`
  ];

  return {
    recommendedStack: stack,
    efficiencyBoost: efficiency,
    keyIdeas: ideas,
    welcomeMessage: `👋 Здравствуйте! Рады приветствовать вас в "${compName}". Я ваш персональный виртуальный помощник. Готов подсказать всё о наших услугах, помочь оформить заказ или записаться на консультацию. Какой вопрос вас интересует?`
  };
}

startServer();
