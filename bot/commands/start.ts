import { BotContext } from '../../types/telegraf.types';

const startCommand = async (ctx: BotContext): Promise<void> => {
  const message = '👋 Welcome! I am a bot for managing Cloudflare.\n\n' +
    '📋 Available commands:\n\n' +
    '/registerdomain <domain> - Register a new domain\n' +
    '/help - Show help';

  await ctx.reply(message);
};

export default startCommand;