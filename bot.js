require('dotenv').config();
const { Telegraf } = require('telegraf');
const express = require('express'); // Добавляем Express для сервера

const bot = new Telegraf(process.env.BOT_TOKEN);
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware для обработки JSON
app.use(express.json());

// Обработчик команды /start
bot.start((ctx) => {
  console.log('Получена команда /start от', ctx.from.id);
  ctx.reply('Привет! Бот работает на сервере 🚀');
});

// Кнопка с веб-приложением
bot.command('menu', (ctx) => {
  ctx.reply('Откройте меню:', {
    reply_markup: {
      inline_keyboard: [
        [{
          text: '🛍️ Открыть магазин', 
          web_app: { url: process.env.WEBAPP_URL || 'https://test-web-app-tawny.vercel.app' }
        }]
      ]
    }
  });
});

// Обработка ошибок
bot.catch((err, ctx) => {
  console.error('Ошибка бота:', err);
  ctx.reply('Произошла ошибка 😢');
});

// Настройка вебхука
app.post('/webhook', (req, res) => {
  bot.handleUpdate(req.body, res);
});

// Локальный запуск (для разработки)
if (process.env.NODE_ENV === 'development') {
  bot.launch();
  app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
  });
}

// Экспорт для сервера (Vercel/Render)
module.exports = app;

// Грациозное завершение
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));