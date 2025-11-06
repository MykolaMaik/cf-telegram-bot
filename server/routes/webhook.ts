import express, { Request, Response } from 'express';
import bot from '../../bot/bot';
import { APIResponse } from '../../types/express.types';

const router = express.Router();

router.post('/', async (req: Request, res: Response<APIResponse>) => {
  try {
    const clientIP = req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'Unknown';
    const method = req.method;
    const url = req.protocol + '://' + req.get('host') + req.originalUrl;
    const body = JSON.stringify(req.body, null, 2);
    const headers = JSON.stringify(req.headers, null, 2);

    let message = `Received POST request\n\n`;
    message += `URL: ${url}\n`;
    message += `Method: ${method}\n`;
    message += `IP: ${clientIP}\n\n`;
    
    if (Object.keys(req.body).length > 0) {
      message += `Body:\n\`\`\`json\n${body}\n\`\`\`\n\n`;
    }
    
    message += `Headers:\n\`\`\`json\n${headers}\`\`\``;

    const chatId = process.env.ALLOWED_CHAT_ID;
    if (chatId) {
      await bot.telegram.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    } else {
      console.warn('ALLOWED_CHAT_ID not set, message not sent');
    }

    return res.status(200).json({ success: true, message: 'Webhook received and processed' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ success: false, error: errorMessage });
  }
});

router.get('/', async (req: Request, res: Response<APIResponse>) => {
  try {
    const clientIP = req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'Unknown';
    const method = req.method;
    const url = req.protocol + '://' + req.get('host') + req.originalUrl;
    const query = JSON.stringify(req.query, null, 2);

    let message = `Received GET request\n\n`;
    message += `URL: ${url}\n`;
    message += `Method: ${method}\n`;
    message += `IP: ${clientIP}\n\n`;
    
    if (Object.keys(req.query).length > 0) {
      message += `Query parameters:\n\`\`\`json\n${query}\n\`\`\``;
    }

    const chatId = process.env.ALLOWED_CHAT_ID;
    if (chatId) {
      await bot.telegram.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    } else {
      console.warn('ALLOWED_CHAT_ID not set, message not sent');
    }

    return res.status(200).json({ success: true, message: 'Webhook received and processed' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ success: false, error: errorMessage });
  }
});

export default router;