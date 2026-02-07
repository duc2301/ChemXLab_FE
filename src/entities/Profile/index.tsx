export interface UpdateProfileForm {
  fullName: string;
  avatarUrl?: string;
}

export interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}