'use client';

import { LoginCredentials, User } from '@/lib/auth.types';

// Mock user data for demonstration
const MOCK_USERS: User[] = [
    {
        id: '1',
        name: '张三',
        email: 'zhangsan@example.com',
        avatar: '/images/dashboard/avatar.png',
    },
    {
        id: '2',
        name: '李四',
        email: 'lisi@example.com',
        avatar: '/images/dashboard/avatar.png',
    },
];

// Mock authentication service
export class AuthService {
    // Simulate API delay
    private static async delay(ms: number = 500) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Mock login function
    static async login(credentials: LoginCredentials): Promise<{ success: boolean; user?: User; error?: string }> {
        await this.delay();

        // Simple validation
        if (!credentials.email || !credentials.password) {
            return { success: false, error: '请填写用户名和密码' };
        }

        // Find user by email (in a real app, this would be an API call)
        const user = MOCK_USERS.find(u => u.email === credentials.email);

        if (!user) {
            return { success: false, error: '用户不存在' };
        }

        // In a real app, we would verify the password hash here
        // For mock purposes, we'll just check if password is not empty
        if (!credentials.password) {
            return { success: false, error: '密码错误' };
        }

        // Store user in localStorage if "remember me" is checked
        if (credentials.rememberMe) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            // For session-only storage, we could use sessionStorage instead
            sessionStorage.setItem('user', JSON.stringify(user));
        }

        return { success: true, user };
    }

    // Mock logout function
    static async logout(): Promise<void> {
        await this.delay();
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
    }

    // Check if user is authenticated
    static isAuthenticated(): boolean {
        const user = localStorage.getItem('user') || sessionStorage.getItem('user');
        return !!user;
    }

    // Get current user from storage
    static getCurrentUser(): User | null {
        try {
            // Check localStorage first (for "remember me" users)
            const localStorageUser = localStorage.getItem('user');
            if (localStorageUser) {
                return JSON.parse(localStorageUser);
            }

            // Check sessionStorage (for session-only users)
            const sessionStorageUser = sessionStorage.getItem('user');
            if (sessionStorageUser) {
                return JSON.parse(sessionStorageUser);
            }

            return null;
        } catch (error) {
            console.error('Error parsing user data from storage:', error);
            return null;
        }
    }
}