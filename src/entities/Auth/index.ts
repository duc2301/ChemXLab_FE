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