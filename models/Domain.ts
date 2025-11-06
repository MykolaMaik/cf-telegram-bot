import mongoose, { Schema } from 'mongoose';
import { IDomainDocument, IDomainModel } from '../types/domain.types';

const domainSchema = new Schema<IDomainDocument>({
  domainName: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  zoneId: {
    type: String,
    required: true
  },
  nsServers: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
});

const Domain: IDomainModel = mongoose.model<IDomainDocument, IDomainModel>('Domain', domainSchema);

export default Domain;