import axios, { type AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { accessTokenCookieName, backendForAdminBaseUrl } from '~/constants/configs';

export interface ApiErrorResponse {
    errors: string[];
}

export const AXIOS_INSTANCE: AxiosInstance = axios.create({
    baseURL: backendForAdminBaseUrl,
});

AXIOS_INSTANCE.interceptors.request.use((config) => {
    const accessToken = useCookie(accessTokenCookieName);
    if (accessToken.value && config.url != '/UserApi/RefreshToken') {
        config.headers.Authorization = `Bearer ${accessToken.value}`;
    }
    return config;
});

// Response interceptor
AXIOS_INSTANCE.interceptors.response.use(
    (response) => {
        if (response && response.data && response.data.errors && response.data.errors.length > 0) {
            const { $notification } = useNuxtApp();
            const errorMessage: string = Object.values(response.data.errors).join(' <br /> ');
            $notification.generalError('Error', errorMessage);
        }
        return response;
    },
    async (error: AxiosError<ApiErrorResponse>) => {
        const { $notification } = useNuxtApp();
        
        if(error.config?.url === '/UserApi/RefreshToken')
        {
            const authStore = useAuthStore();
            await authStore.logout();
            // Return a rejected promise instead of undefined
            return Promise.reject(error);
        }
        else if(error.status === 401)
        {
            // Prevent infinite loops by checking if we already tried to refresh
            if (!error.config._retry) {
                error.config._retry = true;
                
                const authStore = useAuthStore();
                try {
                    var response = await authStore.refreshTokensAsync();
                        
                    if(response)
                    {
                        return await AXIOS_INSTANCE.request(error.config as AxiosRequestConfig);
                    }
                    else
                    {
                        // If refresh fails, logout and reject
                        await authStore.logout();
                        return Promise.reject(error);
                    }
                } catch (refreshError) {
                    // Handle refresh token errors - logout and reject
                    const authStore = useAuthStore();
                    await authStore.logout();
                    return Promise.reject(refreshError);
                }
            } else {
                // Already tried to refresh, don't try again
                const authStore = useAuthStore();
                await authStore.logout();
                return Promise.reject(error);
            }
        }
        else if (error && error.response && error.response.data && error.response.data.errors && error.response.data.errors.length > 0) {
            const errorMessage: string = Object.values(error.response.data.errors).join(' <br /> ');
            $notification.generalError('Error', errorMessage);
        }
        else
        {
            $notification.generalError('Error', error.message);
        }
        
        // Always return a rejected promise for errors
        return Promise.reject(error);
    },
);

export const backendForAdminClient = <T>(
    config: AxiosRequestConfig,
    options?: AxiosRequestConfig,
): Promise<T> => {
    const source = axios.CancelToken.source();
    const promise = AXIOS_INSTANCE({
        ...config,
        ...options,
        cancelToken: source.token,
    }).then(({ data }) => data);

    promise.cancel = () => {
        source.cancel('Query was cancelled');
    };

    return promise;
};
