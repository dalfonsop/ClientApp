export interface Service{
    id: number;
    serviceName: string;
    serviceValue: number;
    servicesDetails: Detail[];
}

export interface Detail{
    id: number;
    description: string;
}