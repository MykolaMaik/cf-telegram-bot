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

    if (!/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/.test(domainName)) {
      await ctx.reply('Invalid domain name.');
      return;
    }

    const existingDomain = await Domain.findOne({ domainName });
    if (existingDomain) {
      await ctx.reply(
        `⚠️ Domain ${domainName} already registered.\n\n` +
        `NS servers:\n${existingDomain.nsServers.map(ns => `• ${ns}`).join('\n')}`
      );
      return;
    }

    const processingMsg = await ctx.reply(`⏳ Registering domain ${domainName}...`);

    const result = await cloudflareService.registerDomain(domainName);

    const userId = ctx.user ? ctx.user._id : null;
    const domain = new Domain({
      domainName: result.domainName,
      zoneId: result.zoneId,
      nsServers: result.nsServers,
      userId: userId
    });
    await domain.save();

    let responseMessage = `✅ Domain ${domainName} successfully registered!\n\n`;
    responseMessage += `🆔 Zone ID: ${result.zoneId}\n`;
    responseMessage += `📊 Status: ${result.status}\n\n`;
    responseMessage += `📡 NS servers, which need to be added to the registrar:\n\n`;
    
    if (result.nsServers.length > 0) {
      result.nsServers.forEach((ns, index) => {
        responseMessage += `${index + 1}. ${ns}\n`;
      });
    } else {
      responseMessage += '⚠️ NS servers will be available after the zone is activated';
    }

    if (processingMsg && 'message_id' in processingMsg) {
      await ctx.telegram.editMessageText(
        ctx.chat!.id,
        processingMsg.message_id,
        undefined,
        responseMessage
      );
    }
  } catch (error) {
    console.error('Error registering domain:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    ctx.reply(
      `❌ Error registering domain: ${errorMessage}\n\n` +
      'Check the correctness of the domain name and the Cloudflare API settings.'
    );
  }
};

export default registerDomainCommand;