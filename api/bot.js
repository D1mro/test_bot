require('dotenv').config();
const { Telegraf } = require('telegraf');
const express = require('express');

// Инициализация
const bot = new Telegraf(process.env.BOT_TOKEN);
const app = express();

// Middleware
app.use(express.json());

// ========== Обработчики команд ========== //
bot.start((ctx) => {
  console.log(`Новый пользователь: ${ctx.from.id}`);
  return ctx.reply('Бот успешно работает на Vercel! 🚀');
});

bot.command('shop', (ctx) => {
  return ctx.reply('Откройте магазин:', {
    reply_markup: {
      inline_keyboard: [
        [{
          text: '🛍️ Магазин',
          web_app: { url: process.env.WEBAPP_URL || 'https://your-web-app.vercel.app' }
        }]
      ]
    }
  });
});

// ========== Обработчик для Vercel ========== //
app.post('/api/bot', (req, res) => {
  try {
    console.log('Получен вебхук:', req.body);
    return bot.handleUpdate(req.body, res);
  } catch (err) {
    console.error('Ошибка обработки вебхука:', err);
    return res.status(200).send();
  }
});

// Проверка работоспособности
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'running',
    bot: 'Telegram Bot',
    webhook: 'POST /api/bot'
  });
});

// ========== Экспорт для Vercel ========== //
module.exports = app;

// ========== Локальный запуск ========== //
if (process.env.NODE_ENV === 'development') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    bot.launch()
      .then(() => console.log('Бот запущен в режиме разработки'))
      .catch(console.error);
  });
}