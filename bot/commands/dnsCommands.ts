import cloudflareService from '../../services/cloudflare';
import Domain from '../../models/Domain';
import { BotContext } from '../../types/telegraf.types';
import { CreateDNSRecordData, UpdateDNSRecordData } from '../../types/cloudflare.types';

export const listDomainsCommand = async (ctx: BotContext): Promise<void> => {
  try {
    const domains = await Domain.find().sort({ createdAt: -1 });

    if (domains.length === 0) {
      await ctx.reply('📭 No domains registered.');
      return;
    }

    let message = '📋 Registered domains:\n\n';
    domains.forEach((domain, index) => {
      message += `${index + 1}. ${domain.domainName}\n`;
      message += `   Zone ID: ${domain.zoneId}\n`;
      if (domain.createdAt) {
        message += `   Date: ${new Date(domain.createdAt).toLocaleDateString('en-US')}\n\n`;
      }
    });

    ctx.reply(message);
  } catch (error) {
    console.error('Error getting list of domains:', error);
    ctx.reply('❌ Error getting list of domains.');
  }
};

export const listDNSCommand = async (ctx: BotContext): Promise<void> => {
  try {
    if (!ctx.message || !('text' in ctx.message)) {
      return;
    }

    const commandParts = ctx.message.text.split(' ');
    
    if (commandParts.length < 2) {
      await ctx.reply(
        '❌ Invalid command format.\n\n' +
        'Usage: /listdns example.com'
      );
      return;
    }

    const domainName = commandParts[1].trim().toLowerCase();

    const domain = await Domain.findOne({ domainName });
    if (!domain) {
      await ctx.reply(`❌ Domain ${domainName} not found in database.`);
      return;
    }

    const records = await cloudflareService.getDNSRecords(domain.zoneId);

    if (records.length === 0) {
      await ctx.reply(`📭 DNS records for domain ${domainName} are absent.`);
      return;
    }

    let message = `📋 DNS записи для ${domainName}:\n\n`;
    records.forEach((record, index) => {
      message += `${index + 1}. ${record.name}\n`;
      message += `   Type: ${record.type}\n`;
      message += `   Value: ${record.content}\n`;
      message += `   TTL: ${record.ttl}\n`;
      message += `   ID: ${record.id}\n\n`;
    });

    ctx.reply(message);
  } catch (error) {
    console.error('Error getting DNS records:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    ctx.reply(`❌ Error: ${errorMessage}`);
  }
};

export const createDNSCommand = async (ctx: BotContext): Promise<void> => {
  try {
    ctx.reply(
      '📝 For creating a DNS record, send a message in the format:\n\n' +
      '/createdns <domain> <type> <name> <value> [TTL] [priority]\n\n' +
      'Приклади:\n' +
      '/createdns example.com A @ 192.168.1.1\n' +
      '/createdns example.com CNAME www example.com\n' +
      '/createdns example.com MX @ mail.example.com 10\n\n' +
      'Or simply send the command with parameters immediately.'
    );
  } catch (error) {
    console.error('Error creating DNS record:', error);
    ctx.reply('❌ Error creating DNS record.');
  }
};

export const handleCreateDNS = async (ctx: BotContext): Promise<void> => {
  try {
    if (!ctx.message || !('text' in ctx.message)) {
      return;
    }

    const commandParts = ctx.message.text.split(' ').slice(1);
    
    if (commandParts.length < 4) {
      await ctx.reply(
        '❌ Not enough parameters.\n\n' +
        'Format: /createdns <domain> <type> <name> <value> [TTL] [priority]\n\n' +
        'Example: /createdns example.com A @ 192.168.1.1 3600'
      );
      return;
    }

    const [domainName, type, name, content, ttl, priority] = commandParts;

    const domain = await Domain.findOne({ domainName: domainName.trim().toLowerCase() });
    if (!domain) {
      await ctx.reply(`❌ Domain ${domainName} not found. First register it through /registerdomain`);
      return;
    }

    const recordData: CreateDNSRecordData = {
      type: type.toUpperCase(),
      name: name.trim(),
      content: content.trim(),
      ttl: ttl ? parseInt(ttl) : 3600,
      priority: priority ? parseInt(priority) : null
    };

    const result = await cloudflareService.createDNSRecord(domain.zoneId, recordData);

    ctx.reply(
      `DNS record successfully created!\n\n` +
      `Domain: ${domainName}\n` +
      `Type: ${result.type}\n` +
      `Name: ${result.name}\n` +
      `Value: ${result.content}\n` +
      `TTL: ${result.ttl}\n` +
      `ID: ${result.id}`
    );
  } catch (error) {
    console.error('Error creating DNS record:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    ctx.reply(`❌ Error: ${errorMessage}`);
  }
};

export const updateDNSCommand = async (ctx: BotContext): Promise<void> => {
  try {
    ctx.reply(
      '📝 For updating a DNS record, send a command in the format:\n\n' +
      '/updatedns <domain> <record_id> <type> <name> <value> [TTL] [priority]\n\n' +
      'Or use:\n' +
      '/updatedns <domain> <name> <type> <new_content> [TTL]\n\n' +
      'Example: /updatedns example.com @ A 192.168.1.2'
    );
  } catch (error) {
    console.error('Error updating DNS record:', error);
    ctx.reply('❌ Error updating DNS record.');
  }
};

export const handleUpdateDNS = async (ctx: BotContext): Promise<void> => {
  try {
    if (!ctx.message || !('text' in ctx.message)) {
      return;
    }

    const commandParts = ctx.message.text.split(' ').slice(1);
    
    if (commandParts.length < 4) {
      await ctx.reply(
        '❌ Not enough parameters.\n\n' +
        'Format: /updatedns <domain> <name> <type> <new_content> [TTL]\n\n' +
        'Or: /updatedns <domain> <record_id> <type> <name> <value> [TTL]'
      );
      return;
    }

    const [domainName, identifier, typeOrName, ...rest] = commandParts;

    const domain = await Domain.findOne({ domainName: domainName.trim().toLowerCase() });
    if (!domain) {
      await ctx.reply(`❌ Domain ${domainName} not found.`);
      return;
    }

    let recordId: string;
    let recordData: UpdateDNSRecordData;

    if (identifier.length > 20) {
      recordId = identifier;
      recordData = {
        type: typeOrName.toUpperCase(),
        name: rest[0],
        content: rest[1],
        ttl: rest[2] ? parseInt(rest[2]) : 3600,
        priority: rest[3] ? parseInt(rest[3]) : null
      };
    } else {
      const record = await cloudflareService.findDNSRecordByName(
        domain.zoneId,
        identifier,
        typeOrName
      );
      
      if (!record) {
        await ctx.reply(`❌ DNS record not found.`);
        return;
      }

      recordId = record.id;
      recordData = {
        type: record.type,
        name: record.name,
        content: rest[0] || record.content,
        ttl: rest[1] ? parseInt(rest[1]) : record.ttl,
        priority: record.priority || null
      };
    }

    const result = await cloudflareService.updateDNSRecord(domain.zoneId, recordId, recordData);

    ctx.reply(
      `DNS record successfully updated!\n\n` +
      `Domain: ${domainName}\n` +
      `Type: ${result.type}\n` +
      `Name: ${result.name}\n` +
      `Value: ${result.content}\n` +
      `TTL: ${result.ttl}`
    );
  } catch (error) {
    console.error('Error updating DNS record:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    ctx.reply(`❌ Error: ${errorMessage}`);
  }
};

export const deleteDNSCommand = async (ctx: BotContext): Promise<void> => {
  try {
    ctx.reply(
      '🗑️ For deleting a DNS record, send a command in the format:\n\n' +
      '/deletedns <domain> <record_id>\n\n' +
      'Or:\n' +
      '/deletedns <domain> <name> <type>\n\n' +
      'Example: /deletedns example.com @ A'
    );
  } catch (error) {
    console.error('Error deleting DNS record:', error);
    ctx.reply('❌ Error deleting DNS record.');
  }
};

export const handleDeleteDNS = async (ctx: BotContext): Promise<void> => {
  try {
    if (!ctx.message || !('text' in ctx.message)) {
      return;
    }

    const commandParts = ctx.message.text.split(' ').slice(1);
    
    if (commandParts.length < 2) {
      await ctx.reply(
        '❌ Not enough parameters.\n\n' +
        'Format: /deletedns <domain> <record_id>\n\n' +
        'Or: /deletedns <domain> <name> <type>'
      );
      return;
    }

    const [domainName, identifier, type] = commandParts;

    const domain = await Domain.findOne({ domainName: domainName.trim().toLowerCase() });
    if (!domain) {
      await ctx.reply(`❌ Domain ${domainName} not found.`);
      return;
    }

    let recordId: string;

    if (identifier.length > 20) {
      recordId = identifier;
    } else {
      const record = await cloudflareService.findDNSRecordByName(
        domain.zoneId,
        identifier,
        type
      );
      
      if (!record) {
        await ctx.reply(`❌ DNS record not found.`);
        return;
      }

      recordId = record.id;
    }

    await cloudflareService.deleteDNSRecord(domain.zoneId, recordId);

    ctx.reply(`DNS record successfully deleted!`);
  } catch (error) {
    console.error('Error deleting DNS record:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    ctx.reply(`❌ Error: ${errorMessage}`);
  }
};