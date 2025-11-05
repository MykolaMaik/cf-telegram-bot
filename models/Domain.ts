import mongoose, { Schema } from 'mongoose';
import { IDomainDocument, IDomainModel } from '../types/domain.types';

const domainSchema = new Schema<IDomainDocument>({
  domainName: {
    type: String,
    required: true,
    unique: true
  },
  zoneId: {
    type: String,
    required: true
  }
});

const Domain: IDomainModel = mongoose.model<IDomainDocument, IDomainModel>('Domain', domainSchema);

export default Domain;