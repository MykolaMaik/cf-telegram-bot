import dotenv from 'dotenv';
import { BotContext, MiddlewareFn } from '../../types/telegraf.types';

dotenv.config();

const chatRestriction: MiddlewareFn = (ctx: BotContext, next) => {
  const allowedChatId = process.env.ALLOWED_CHAT_ID;
  
  if (!allowedChatId) {
    return next();
  }

  if (ctx.chat && ctx.chat.id.toString() === allowedChatId.toString()) {
    return next();
  }

  if (ctx.chat && ctx.chat.type === 'private') {
    return next();
  }

  ctx.reply('You do not have access to this bot in this chat.');
  return;
};

export default chatRestriction;