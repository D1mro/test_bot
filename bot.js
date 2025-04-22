require('dotenv').config();
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

// Обработчик команды /start
bot.start((ctx) => {
  console.log('Получена команда /start от', ctx.from.id);
  ctx.reply('Привет! Бот работает локально 🚀');
});

// Кнопка с веб-приложением
bot.command('menu', (ctx) => {
  ctx.reply('Откройте меню:', {
    reply_markup: {
      inline_keyboard: [
        [{
          text: '🛍️ Открыть магазин',
          web_app: { url: 'https://test-web-app-tawny.vercel.app' }
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

// Запуск бота
console.log('Бот запускается...');
bot.launch()
  .then(() => console.log('Бот успешно запущен!'))
  .catch(err => console.error('Ошибка запуска:', err));

// Грациозное завершение
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));