import mongoose, { Schema } from 'mongoose';
import { IUserDocument, IUserModel } from '../types/user.types';

const userSchema = new Schema<IUserDocument>({
  telegramId: {
    type: Number,
    required: false
  },
  username: {
    type: String,
    required: true,
    unique: true
  }
});

const User: IUserModel = mongoose.model<IUserDocument, IUserModel>('User', userSchema);

export default User;