export interface Payment {
    id: string;
    userId: string;
    packageId: string;
    amount: number;
    status: 'PENDING' | 'CANCEL' | 'PAID';
    currency: string;
    createdAt?: string;
    paymentMethod: string;
    transactionCode: string;
    qrUrl?: string;
}