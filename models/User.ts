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
  },
  firstName: {
    type: String,
    required: false,
    default: ''
  },
  lastName: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User: IUserModel = mongoose.model<IUserDocument, IUserModel>('User', userSchema);

export default User;