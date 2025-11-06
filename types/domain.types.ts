import { Document, Model, Types } from 'mongoose';

export interface IDomain {
  domainName: string;
  zoneId: string;
  nsServers: string[];
  createdAt?: Date;
  userId?: Types.ObjectId | string | null;
}

export interface IDomainDocument extends IDomain, Document {
  _id: Document['_id'];
}

export interface IDomainModel extends Model<IDomainDocument> {}