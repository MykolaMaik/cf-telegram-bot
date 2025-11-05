import cloudflareService from '../../services/cloudflare';
import Domain from '../../models/Domain';
import { BotContext } from '../../types/telegraf.types';

const registerDomainCommand = async (ctx: BotContext): Promise<void> => {
  try {
    if (!ctx.message || !('text' in ctx.message)) {
      return;
    }

    const commandParts = ctx.message.text.split(' ');
    
    if (commandParts.length < 2) {
      await ctx.reply('Usage: /registerdomain example.com');
      return;
    }

    const domainName = commandParts[1].trim().toLowerCase();

    await ctx.reply(`Registering domain ${domainName}...`);

    const result = await cloudflareService.registerDomain(domainName);

    const domain = new Domain({
      domainName: result.domainName,
      zoneId: result.zoneId
    });
    await domain.save();

    let responseMessage = `✅ Domain ${domainName} successfully registered!\n\n`;
    responseMessage += `🆔 Zone ID: ${result.zoneId}\n`;
    responseMessage += `📊 Status: ${result.status}\n\n`;
    
    if (result.nsServers.length > 0) {
      responseMessage += `📡 NS servers:\n`;
      result.nsServers.forEach((ns) => {
        responseMessage += `• ${ns}\n`;
      });
    }

    await ctx.reply(responseMessage);
  } catch (error) {
    console.error('Domain registration error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    await ctx.reply(`Error: ${errorMessage}`);
  }
};

export default registerDomainCommand;