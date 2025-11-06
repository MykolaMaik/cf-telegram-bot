import { Document, Model } from 'mongoose';

export interface IDomain {
  domainName: string;
  zoneId: string;
  nsServers: string[];
  createdAt?: Date;
}

export interface IDomainDocument extends IDomain, Document {}

export interface IDomainModel extends Model<IDomainDocument> {}