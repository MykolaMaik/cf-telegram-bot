import { Document, Model } from 'mongoose';

export interface IUser {
  telegramId?: number;
  username: string;
}

export interface IUserDocument extends IUser, Document {}

export interface IUserModel extends Model<IUserDocument> {}