import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: 'Имя и телефон обязательны' });
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID || "-1003823027748";

    if (!token) {
      return res.status(500).json({ error: 'TELEGRAM_BOT_TOKEN не настроен в Vercel' });
    }

    const localDateTime = new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" });
    const messageText = `<b>Новая заявка с лендинга «Алхимик»</b>\n\n` +
                        `👤 <b>Имя:</b> ${name}\n` +
                        `📞 <b>Телефон:</b> ${phone}\n` +
                        `🌐 <b>Источник:</b> Vercel Landing\n` +
                        `📅 <b>Дата:</b> ${localDateTime}`;

    const telegramUrl = `https://api.telegram.org/bot${token}/sendMessage`;
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageText,
        parse_mode: 'HTML'
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(502).json({ error: data.description || 'Ошибка Telegram API' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
}
