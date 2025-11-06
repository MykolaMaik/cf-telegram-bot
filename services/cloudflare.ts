import axios, { AxiosInstance } from 'axios';
import dotenv from 'dotenv';
import {
  CloudflareZone,
  DNSRecord,
  CreateDNSRecordData,
  UpdateDNSRecordData,
  RegisterDomainResult,
  CloudflareAPIResponse
} from '../types/cloudflare.types';

dotenv.config();

class CloudflareService {
  private baseURL: string;
  private headers: Record<string, string>;
  private axiosInstance: AxiosInstance;

  constructor() {
    this.baseURL = 'https://api.cloudflare.com/client/v4';
    this.headers = {};

    if (process.env.CLOUDFLARE_API_TOKEN) {
      this.headers['Authorization'] = `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`;
    } else if (process.env.CLOUDFLARE_EMAIL && process.env.CLOUDFLARE_API_KEY) {
      this.headers['X-Auth-Email'] = process.env.CLOUDFLARE_EMAIL;
      this.headers['X-Auth-Key'] = process.env.CLOUDFLARE_API_KEY;
    } else {
      throw new Error('Cloudflare API authorization not configured in .env file');
    }
    
    this.headers['Content-Type'] = 'application/json';

    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      headers: this.headers
    });
  }

  async registerDomain(domainName: string): Promise<RegisterDomainResult> {
    try {
      const payload: {
        name: string;
        account?: { id: string };
      } = {
        name: domainName
      };
      
      if (process.env.CLOUDFLARE_ACCOUNT_ID) {
        payload.account = {
          id: process.env.CLOUDFLARE_ACCOUNT_ID
        };
      }

      const response = await this.axiosInstance.post<CloudflareAPIResponse<CloudflareZone>>(
        '/zones',
        payload
      );

      if (response.data.success && response.data.result) {
        const zone = response.data.result;
        return {
          success: true,
          zoneId: zone.id,
          domainName: zone.name,
          nsServers: zone.name_servers || [],
          status: zone.status
        };
      } else {
        const errorMsg = response.data.errors?.[0]?.message || 'Error registering domain';
        throw new Error(errorMsg);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMsg = (error.response.data as CloudflareAPIResponse<unknown>).errors?.[0]?.message || 'Cloudflare API error';
        throw new Error(errorMsg);
      }
      throw error;
    }
  }

  async getDNSRecords(zoneId: string): Promise<DNSRecord[]> {
    try {
      const response = await this.axiosInstance.get<CloudflareAPIResponse<DNSRecord[]>>(
        `/zones/${zoneId}/dns_records`
      );

      if (response.data.success && response.data.result) {
        return response.data.result;
      } else {
        const errorMsg = response.data.errors?.[0]?.message || 'Error getting DNS records';
        throw new Error(errorMsg);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMsg = (error.response.data as CloudflareAPIResponse<unknown>).errors?.[0]?.message || 'Cloudflare API error';
        throw new Error(errorMsg);
      }
      throw error;
    }
  }

  async createDNSRecord(zoneId: string, recordData: CreateDNSRecordData): Promise<DNSRecord> {
    try {
      const { type, name, content, ttl = 3600, priority = null } = recordData;
      
      const payload: {
        type: string;
        name: string;
        content: string;
        ttl: number;
        priority?: number;
      } = {
        type: type.toUpperCase(),
        name: name,
        content: content,
        ttl: ttl
      };

      if (priority !== null && (type.toUpperCase() === 'MX' || type.toUpperCase() === 'SRV')) {
        payload.priority = priority;
      }

      const response = await this.axiosInstance.post<CloudflareAPIResponse<DNSRecord>>(
        `/zones/${zoneId}/dns_records`,
        payload
      );

      if (response.data.success && response.data.result) {
        return response.data.result;
      } else {
        const errorMsg = response.data.errors?.[0]?.message || 'Error creating DNS record';
        throw new Error(errorMsg);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMsg = (error.response.data as CloudflareAPIResponse<unknown>).errors?.[0]?.message || 'Cloudflare API error';
        throw new Error(errorMsg);
      }
      throw error;
    }
  }

  async updateDNSRecord(zoneId: string, recordId: string, recordData: UpdateDNSRecordData): Promise<DNSRecord> {
    try {
      const { type, name, content, ttl = 3600, priority = null } = recordData;
      
      const payload: {
        type: string;
        name: string;
        content: string;
        ttl: number;
        priority?: number;
      } = {
        type: type.toUpperCase(),
        name: name,
        content: content,
        ttl: ttl
      };

      if (priority !== null && (type.toUpperCase() === 'MX' || type.toUpperCase() === 'SRV')) {
        payload.priority = priority;
      }

      const response = await this.axiosInstance.put<CloudflareAPIResponse<DNSRecord>>(
        `/zones/${zoneId}/dns_records/${recordId}`,
        payload
      );

      if (response.data.success && response.data.result) {
        return response.data.result;
      } else {
        const errorMsg = response.data.errors?.[0]?.message || 'Error updating DNS record';
        throw new Error(errorMsg);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMsg = (error.response.data as CloudflareAPIResponse<unknown>).errors?.[0]?.message || 'Cloudflare API error';
        throw new Error(errorMsg);
      }
      throw error;
    }
  }

  async deleteDNSRecord(zoneId: string, recordId: string): Promise<boolean> {
    try {
      const response = await this.axiosInstance.delete<CloudflareAPIResponse<{ id: string }>>(
        `/zones/${zoneId}/dns_records/${recordId}`
      );

      if (response.data.success) {
        return true;
      } else {
        const errorMsg = response.data.errors?.[0]?.message || 'Error deleting DNS record';
        throw new Error(errorMsg);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMsg = (error.response.data as CloudflareAPIResponse<unknown>).errors?.[0]?.message || 'Cloudflare API error';
        throw new Error(errorMsg);
      }
      throw error;
    }
  }

  async findDNSRecordByName(zoneId: string, name: string, type: string | null = null): Promise<DNSRecord | null> {
    try {
      const records = await this.getDNSRecords(zoneId);
      
      const zoneInfo = await this.getZoneInfo(zoneId);
      const domainName = zoneInfo.name;
      
      let searchNames: string[] = [name];
      
      if (!name.endsWith(`.${domainName}`) && name !== '@' && name !== domainName) {
        searchNames.push(`${name}.${domainName}`);
      }
      
      if (name === '@') {
        searchNames.push(domainName);
      }
      
      if (name === domainName) {
        searchNames.push('@');
      }
      
      const found = records.find((record: DNSRecord) => {
        const nameMatch = searchNames.some((searchName: string) => {
          return record.name === searchName;
        });
        
        if (type) {
          return nameMatch && record.type === type.toUpperCase();
        }
        return nameMatch;
      });
      
      return found || null;
    } catch (error) {
      throw error;
    }
  }

  async getZoneInfo(zoneId: string): Promise<CloudflareZone> {
    try {
      const response = await this.axiosInstance.get<CloudflareAPIResponse<CloudflareZone>>(
        `/zones/${zoneId}`
      );

      if (response.data.success && response.data.result) {
        return response.data.result;
      } else {
        const errorMsg = response.data.errors?.[0]?.message || 'Error getting zone information';
        throw new Error(errorMsg);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMsg = (error.response.data as CloudflareAPIResponse<unknown>).errors?.[0]?.message || 'Cloudflare API error';
        throw new Error(errorMsg);
      }
      throw error;
    }
  }
}

export default new CloudflareService();