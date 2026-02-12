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

export interface CreateUserForm {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
    avatarUrl?: string;
}

// ============== ELEMENT TYPES ==============
// Properties structure returned by the API
export interface ElementProperties {
    englishName?: string;
    category?: string;
    group?: number;
    period?: number;
    density?: string;
    meltingPoint?: string;
    boilingPoint?: string;
    discoverer?: string;
    yearDiscovered?: string;
    color_hex?: string;
    description?: string;
    electronConfiguration?: string;
    oxidationStates?: string[];
}

// From GET /api/elements
export interface ElementAdmin {
    id: number;
    symbol: string;
    name: string;
    atomicMass: number;
    properties: ElementProperties | string;
}
// POST /api/elements
export interface CreateElementForm {
    symbol: string;
    name: string;
    atomicMass: number;
    properties: string;
}
// PUT /api/elements/:id
export interface UpdateElementForm {
    symbol: string;
    name: string;
    atomicMass: number;
    properties: string;
}