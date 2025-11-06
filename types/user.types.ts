import { Document, Model } from 'mongoose';

export interface IUser {
  telegramId?: number;
  username: string;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  createdAt?: Date;
}

export interface IUserDocument extends IUser, Document {
  _id: Document['_id'];
}

export interface IUserModel extends Model<IUserDocument> {}