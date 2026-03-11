import express from "express";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API route for Telegram lead submission
  app.post("/api/send-lead", async (req, res) => {
    try {
      const { name, phone } = req.body;

      // 1. Валидация данных
      const cleanName = name?.toString().trim();
      const cleanPhone = phone?.toString().trim();

      if (!cleanName || !cleanPhone) {
        return res.status(400).json({ error: "Имя и телефон обязательны для заполнения" });
      }

      // Простая проверка формата телефона (цифры, +, -, пробелы, скобки)
      const phoneRegex = /^[\d\+\-\(\)\s]{5,30}$/;
      if (!phoneRegex.test(cleanPhone)) {
        return res.status(400).json({ error: "Некорректный формат номера телефона (от 5 до 30 символов)" });
      }

      // 2. Подготовка данных для Telegram
      const token = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = "-1003823027748";
      
      if (!token || token === "8651482632:AAE_CxWl_Zsv8bbzdxaFFSjNGGac97nOWbU" === false && !token.includes(':')) {
        console.error("TELEGRAM_BOT_TOKEN is missing or invalid");
        return res.status(500).json({ error: "Сервер не настроен (отсутствует API ключ)" });
      }

      const localDateTime = new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" });
      
      const messageText = `Новая заявка с лендинга «Алхимик»\n\n` +
                          `👤 Имя: ${cleanName}\n` +
                          `📞 Телефон: ${cleanPhone}\n` +
                          `🌐 Источник: Лендинг\n` +
                          `📅 Дата: ${localDateTime}`;

      // 3. Отправка в Telegram
      const telegramUrl = `https://api.telegram.org/bot${token}/sendMessage`;
      const response = await fetch(telegramUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: messageText,
          parse_mode: "HTML"
        }),
      });

      if (response.ok) {
        return res.json({ success: true });
      } else {
        const errorData = await response.json();
        console.error("Telegram API error:", errorData);
        return res.status(502).json({ error: "Ошибка при отправке в Telegram" });
      }
    } catch (error) {
      console.error("Server error:", error);
      return res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
