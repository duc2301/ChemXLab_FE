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
    email: string;
    exp: number;
    iss: string;
    aud: string;
    AvatarUrl: string;
    Role: string;
}