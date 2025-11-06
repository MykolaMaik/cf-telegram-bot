import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import chatRestriction from './middleware/chatRestriction';
import userCheck from './middleware/userCheck';
import startCommand from './commands/start';
import registerDomainCommand from './commands/registerDomain';
import {
  listDomainsCommand,
  listDNSCommand,
  createDNSCommand,
  handleCreateDNS,
  updateDNSCommand,
  handleUpdateDNS,
  deleteDNSCommand,
  handleDeleteDNS
} from './commands/dnsCommands';
import { BotContext } from '../types/telegraf.types';

dotenv.config();

if (!process.env.TELEGRAM_BOT_TOKEN) {
  throw new Error('TELEGRAM_BOT_TOKEN is not set in .env file');
}

const bot = new Telegraf<BotContext>(process.env.TELEGRAM_BOT_TOKEN);

bot.use(chatRestriction);
bot.use(userCheck);

bot.command('start', startCommand);
bot.command('help', startCommand);

bot.command('registerdomain', registerDomainCommand);

bot.command('listdomains', listDomainsCommand);
bot.command('listdns', listDNSCommand);

bot.command('createdns', (ctx: BotContext) => {
  if (!ctx.message || !('text' in ctx.message)) {
    return;
  }
  const commandParts = ctx.message.text.split(' ');
  if (commandParts.length > 1) {
    handleCreateDNS(ctx);
  } else {
    createDNSCommand(ctx);
  }
});

bot.command('updatedns', (ctx: BotContext) => {
  if (!ctx.message || !('text' in ctx.message)) {
    return;
  }
  const commandParts = ctx.message.text.split(' ');
  if (commandParts.length > 1) {
    handleUpdateDNS(ctx);
  } else {
    updateDNSCommand(ctx);
  }
});

bot.command('deletedns', (ctx: BotContext) => {
  if (!ctx.message || !('text' in ctx.message)) {
    return;
  }
  const commandParts = ctx.message.text.split(' ');
  if (commandParts.length > 1) {
    handleDeleteDNS(ctx);
  } else {
    deleteDNSCommand(ctx);
  }
});

bot.catch((err: unknown, ctx: BotContext) => {
  console.error('Bot error:', err);
  ctx.reply('An error occurred. Please try again later.');
});

export default bot;