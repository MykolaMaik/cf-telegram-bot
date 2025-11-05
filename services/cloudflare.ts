import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const baseURL = 'https://api.cloudflare.com/client/v4';

async function registerDomain(domainName: string) {
  const token = process.env.CLOUDFLARE_API_TOKEN;
  
  if (!token) {
    throw new Error('CLOUDFLARE_API_TOKEN is not set in .env file');
  }

  const response = await axios.post(`${baseURL}/zones`, {
    name: domainName
  }, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  return {
    zoneId: response.data.result.id,
    domainName: response.data.result.name
  };
}

export default {
  registerDomain
};