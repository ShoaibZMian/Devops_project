import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    [key: string]: any;
    exp?: number;
}

export const getToken = (): string | null => {
    return localStorage.getItem('token');
};

export const decodeToken = (token: string): DecodedToken | null => {
    try {
        return jwtDecode<DecodedToken>(token);
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

export const getUserRoles = (): string[] => {
    const token = getToken();
    if (!token) return [];

    const decoded = decodeToken(token);
    if (!decoded) return [];

    // JWT roles can be stored in different claims
    // Check common claim names
    const roles = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
        || decoded.role
        || decoded.roles;

    if (!roles) return [];

    // Role can be a string or array
    return Array.isArray(roles) ? roles : [roles];
};

export const isAdmin = (): boolean => {
    const roles = getUserRoles();
    return roles.includes('Admin');
};

export const isAuthenticated = (): boolean => {
    const token = getToken();
    if (!token) return false;

    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return false;

    // Check if token is expired
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
};

export const logout = (): void => {
    localStorage.removeItem('token');
};

export const getUserName = (): string | null => {
    const token = getToken();
    if (!token) return null;

    const decoded = decodeToken(token);
    if (!decoded) return null;

    return decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname']
        || decoded.given_name
        || decoded.name
        || null;
};
