
export interface Procedure {
    name: string;
    defaultCost: number;
}

export const commonProcedures: Procedure[] = [
    { name: 'Regular Cleaning', defaultCost: 80 },
    { name: 'Deep Cleaning', defaultCost: 200 },
    { name: 'Composite Filling', defaultCost: 150 },
    { name: 'Amalgam Filling', defaultCost: 120 },
    { name: 'Root Canal', defaultCost: 1100 },
    { name: 'Porcelain Crown', defaultCost: 800 },
    { name: 'Zirconia Crown', defaultCost: 1200 },
    { name: 'Tooth Extraction', defaultCost: 150 },
    { name: 'Surgical Extraction', defaultCost: 300 },
    { name: 'Dental Implant', defaultCost: 2500 },
    { name: 'Teeth Whitening', defaultCost: 500 },
    { name: 'Veneer', defaultCost: 900 },
    { name: 'Dental Sealant', defaultCost: 50 },
];
