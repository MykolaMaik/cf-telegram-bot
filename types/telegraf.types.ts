import { Context } from 'telegraf';
import { IUserDocument } from './user.types';

export interface BotContext extends Context {
  user?: IUserDocument;
}

export type MiddlewareFn = (ctx: BotContext, next: () => Promise<void>) => Promise<void> | void;