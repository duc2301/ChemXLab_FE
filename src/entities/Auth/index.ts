export interface LoginForm {
    email: string;
    password: string;
}

export interface RegisterForm {
    email: string;
    passwordHash: string;
    confirmPassword: string;
    fullName: string;
}

export interface JwtDecode {
    sub: string;
    UserId: string;
    email: string;
    exp: number;
    iss: string;
    aud: string;
    AvatarUrl: string;
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
}
export interface ForgotPasswordRequestDTO {
  email: string;
}

export interface VerifyOtpDTO {
  email: string;
  otpCode: string;
}

export interface ResetPasswordDTO {
  email: string;
  otpCode: string;
  newPassword: string;
  confirmPassword?: string; 
}

export interface ChangePasswordDTO {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserProfileDTO {
  id: string;
  fullName: string;
  email: string;
  role: string;
  avatarUrl: string;
}