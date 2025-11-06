import { BotContext } from '../../types/telegraf.types';
import User from '../../models/User';

const startCommand = async (ctx: BotContext): Promise<void> => {
  try {
    if (ctx.from) {
      const telegramId = ctx.from.id;
      const username = ctx.from.username?.toLowerCase().trim();
      
      if (username) {
        let user = await User.findOne({ username });
        
        if (user) {
          if (!user.telegramId) {
            user.telegramId = telegramId;
          }
          if (ctx.from.first_name) {
            user.firstName = ctx.from.first_name;
          }
          if (ctx.from.last_name) {
            user.lastName = ctx.from.last_name;
          }
          await user.save();
        }
      }
    }
  } catch (error) {
    console.error('User data update error:', error);
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