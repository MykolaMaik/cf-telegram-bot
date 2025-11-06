import { BotContext, MiddlewareFn } from '../../types/telegraf.types';
import User from '../../models/User';

const userCheck: MiddlewareFn = async (ctx: BotContext, next) => {
  if (ctx.chat && ctx.chat.type !== 'private') {
    return next();
  }

  try {
    if (!ctx.from) {
      return;
    }

    const telegramId = ctx.from.id;
    const username = ctx.from.username?.toLowerCase().trim();
    
    let user = await User.findOne({ telegramId, isActive: true });

    if (!user && username) {
      user = await User.findOne({ username, isActive: true });
      
      if (user) {
        user.telegramId = telegramId;
        await user.save();
      }
    }

    if (!user) {
      ctx.reply(
        '❌ You do not have access to this bot.\n\n' +
        'Contact the administrator to get access.'
      );
      return;
    }

    ctx.user = user;
    return next();
  } catch (error) {
    console.error('User check error:', error);
    ctx.reply('An error occurred while checking access.');
    return;
  }
};

export default userCheck;