export const isDevelopment = false;

export const backendForAdminBaseUrl: string = isDevelopment ? 'http://localhost:5222':'https://prod-api.trendaiapp.com/bfa';
export const backendForFrontendBaseUrl: string = isDevelopment ? 'http://localhost:5271':'https://prod-api.trendaiapp.com/bff';

export const signalRUrl: string = isDevelopment ? 'http://localhost:5271/bff-hub':'https://prod-api.trendaiapp.com/bff/bff-hub';

export const refreshTokenEndpoint: string = '/UserApi/RefreshToken';
export const accessTokenCookieName: string = 'accessToken';
export const refreshTokenCookieName: string = 'refreshToken';
export const loginPageEndpoint: string = '/login';
export const registerPageEndpoint: string = '/register';
export const confirmAccountEndpoint: string = '/confirm-email';
export const forgotPasswordEndpoint: string = '/forgot-password';
export const resetPasswordEndpoint: string = '/reset-password';
export const twoFaLoginEndpoint: string = '/2falogin';
    