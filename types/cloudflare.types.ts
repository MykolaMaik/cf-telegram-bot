export interface CloudflareZone {
    id: string;
    name: string;
    status: string;
    name_servers: string[];
    account?: {
      id: string;
    };
  }
  
  export interface RegisterDomainResult {
    zoneId: string;
    domainName: string;
    status: string;
    nsServers: string[];
    success: boolean;
  }

  export interface DNSRecord {
    id: string;
    type: string;
    name: string;
    content: string;
    ttl: number;
    priority?: number;
    proxied?: boolean;
    locked?: boolean;
    created_on?: string;
    modified_on?: string;
  }
  
  export interface CreateDNSRecordData {
    type: string;
    name: string;
    content: string;
    ttl?: number;
    priority?: number | null;
  }
  
  export interface UpdateDNSRecordData {
    type: string;
    name: string;
    content: string;
    ttl?: number;
    priority?: number | null;
  }

  export interface CloudflareAPIError {
    code: number;
    message: string;
  }
  
  export interface CloudflareAPIResponse<T> {
    success: boolean;
    errors?: CloudflareAPIError[];
    messages?: string[];
    result?: T;
    result_info?: {
      page: number;
      per_page: number;
      count: number;
      total_count: number;
    };
  }