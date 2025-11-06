import axios from 'axios';
import dotenv from 'dotenv';
import { RegisterDomainResult } from '../types/cloudflare.types';

dotenv.config();

const baseURL = 'https://api.cloudflare.com/client/v4';

async function registerDomain(domainName: string): Promise<RegisterDomainResult> {
  const token = process.env.CLOUDFLARE_API_TOKEN;
  
  if (!token) {
    throw new Error('CLOUDFLARE_API_TOKEN is not set');
  }

  try {
    const response = await axios.post(`${baseURL}/zones`, {
      name: domainName
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data.success && response.data.result) {
      return {
        zoneId: response.data.result.id,
        domainName: response.data.result.name,
        status: response.data.result.status,
        nsServers: response.data.result.name_servers || []
      };
    } else {
      const errorMsg = response.data.errors?.[0]?.message || 'Domain registration error';
      throw new Error(errorMsg);
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMsg = error.response.data?.errors?.[0]?.message || 'Cloudflare API error';
      throw new Error(errorMsg);
    }
    throw error;
  }
}

export default {
  registerDomain
};