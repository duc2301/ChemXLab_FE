// From GET /api/Dashboard?FromDate=...&ToDate=...
export interface DashboardTransaction {
    id: string;
    userId: string;
    packageId: string;
    amount: number;
    currency: string;
    paymentMethod: string;
    status: string; // "PAID" | "PENDING" | ...
    paidAt: string;
    qrUrl: string;
    transactionCode: string;
}
