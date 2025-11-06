import { BotContext } from '../../types/telegraf.types';

const startCommand = async (ctx: BotContext): Promise<void> => {
  try {
    if (ctx.user && ctx.from) {
      const updates: Partial<typeof ctx.user> = {};
      
      if (!ctx.user.telegramId && ctx.from.id) {
        updates.telegramId = ctx.from.id;
      }
      
      if (ctx.from.first_name && ctx.from.first_name !== ctx.user.firstName) {
        updates.firstName = ctx.from.first_name;
      }
      
      if (ctx.from.last_name && ctx.from.last_name !== ctx.user.lastName) {
        updates.lastName = ctx.from.last_name;
      }
      
      if (Object.keys(updates).length > 0) {
        Object.assign(ctx.user, updates);
        await ctx.user.save();
      }
    }
  } catch (error) {
    console.error('Error updating user data:', error);
  }
  
  let message = '👋 Welcome! I am a bot for managing Cloudflare.\n\n';
  message += '📋 Available commands:\n\n';
  message += '/registerdomain <domain> - Register a new domain\n';
  message += '/listdomains - Show all registered domains\n';
  message += '/listdns <domain> - Show all DNS records for a domain\n';
  message += '/createdns - Create a DNS record\n';
  message += '/updatedns - Update a DNS record\n';
  message += '/deletedns - Delete a DNS record\n';
  message += '/help - Show detailed help';

  await ctx.reply(message);
};

export default startCommand;