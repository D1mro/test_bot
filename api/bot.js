require('dotenv').config();
const { Telegraf } = require('telegraf');
const express = require('express');

const bot = new Telegraf(process.env.BOT_TOKEN);
const app = express();

// Middleware для быстрой обработки JSON
app.use(express.json({ limit: '1mb' }));

// Быстрые обработчики команд
bot.start((ctx) => {
  ctx.reply('🚀 Бот работает на Vercel!').catch(console.error);
});

bot.command('menu', (ctx) => {
  ctx.reply('Выберите действие:', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Открыть магазин', web_app: { url: process.env.WEBAPP_URL } }]
      ]
    }
  }).catch(console.error);
});

// Оптимизированный обработчик вебхука
app.post('/api/bot', async (req, res) => {
  try {
    // Важно: не ждем завершения обработки
    bot.handleUpdate(req.body, res);
    
    // Отправляем подтверждение Telegram сразу
    res.status(200).end();
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(200).end(); // Всегда отвечаем Telegram
  }
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'running',
    timestamp: Date.now()
  });
});

// Экспорт для Vercel
module.exports = app;

// Локальный запуск (для разработки)
if (process.env.NODE_ENV === 'development') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Local server: http://localhost:${PORT}`);
    bot.launch().then(() => console.log('Bot started'));
  });
}