export interface UpdateProfileForm {
  fullName: string;
  avatarUrl?: string;
}

export interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ISubscription {
  id: string;
  userId: string | null;
  packageId: string | null;
  startDate: string | null;
  endDate: string | null;
  isActive: boolean | null;
}

export interface IPaymentTransaction {
  id: string;
  userId: string | null;
  packageId: string | null;
  amount: number;
  currency: string | null;
  paymentMethod: string | null;
  status: string | null;
  qrUrl: string | null;
  transactionCode: string | null;
  paidAt: string | null;
}