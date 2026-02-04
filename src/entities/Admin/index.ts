// Admin Dashboard Types - Matching Backend API Responses

// ============== USER TYPES ==============
// From GET /api/User/GetAllUsers
export interface UserAdmin {
    id: string;
    email: string;
    passwordHash: string;
    fullName: string;
    role: string;  // "ADMIN" | "TEACHER" | "STUDENT"
    avatarUrl: string | null;
    createdAt: string;
}

// Form type for updating user (for future API)
export interface UpdateUserForm {
    id: string;
    fullName: string;
    role: string;
}

// ============== PACKAGE TYPES ==============
// From GET /api/packages
export interface PackageAdmin {
    id: number;
    name: string;
    price: number;
    durationDays: number;
    features: string[];
}

// Form types for creating/updating packages
// POST /api/packages
export interface CreatePackageForm {
    name: string;
    price: number;
    durationDays: number;
    features: string[];
}

// PUT /api/packages/:id
export interface UpdatePackageForm {
    name: string;
    price: number;
    durationDays: number;
    features: string[];
}

// ============== DASHBOARD TYPES ==============
// For dashboard statistics (mock data until API available)
export interface DashboardStats {
    totalUsers: number;
    totalRevenue: number;
    totalPackages: number;
    activeSubscriptions: number;
    monthlyRevenue: MonthlyRevenue[];
    recentTransactions: Transaction[];
}

export interface MonthlyRevenue {
    month: string;
    revenue: number;
    transactions: number;
}

export interface Transaction {
    id: string;
    userId: string;
    userEmail: string;
    userName: string;
    packageId: string;
    packageName: string;
    amount: number;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    createdAt: string;
}
