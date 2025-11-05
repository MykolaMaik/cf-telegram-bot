import { Context } from 'telegraf';
import { IUserDocument } from './user.types';

export interface BotContext extends Context {
  user?: IUserDocument;
}