import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import chatRestriction from './middleware/chatRestriction';
import userCheck from './middleware/userCheck';
import startCommand from './commands/start';
import registerDomainCommand from './commands/registerDomain';
import { BotContext } from '../types/telegraf.types';

dotenv.config();

if (!process.env.TELEGRAM_BOT_TOKEN) {
  throw new Error('TELEGRAM_BOT_TOKEN is not set in .env file');
}

const bot = new Telegraf<BotContext>(process.env.TELEGRAM_BOT_TOKEN);

bot.use(chatRestriction);
bot.use(userCheck);

bot.command('start', startCommand);
bot.command('registerdomain', registerDomainCommand);
bot.command('help', startCommand);

bot.catch((err: unknown, ctx: BotContext) => {
  console.error('Bot error:', err);
  ctx.reply('An error occurred. Please try again later.');
});

export default bot;