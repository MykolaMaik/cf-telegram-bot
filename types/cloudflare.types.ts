export interface CloudflareZone {
    id: string;
    name: string;
    status: string;
    name_servers: string[];
  }
  
  export interface RegisterDomainResult {
    zoneId: string;
    domainName: string;
    status: string;
    nsServers: string[];
  }