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