export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface AuthContextType {
    user: User | null;
    login: (credentials: LoginCredentials) => Promise<boolean>;
    logout: () => void;
    isLoading: boolean;
}