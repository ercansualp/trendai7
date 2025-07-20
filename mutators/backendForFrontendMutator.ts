import axios, { type AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { accessTokenCookieName, backendForFrontendBaseUrl } from '~/constants/configs';

export interface ApiErrorResponse {
    errors: string[];
}

export const AXIOS_INSTANCE: AxiosInstance = axios.create({
    baseURL: backendForFrontendBaseUrl,
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
        if (error && error.response && error.response.data && error.response.data.errors && error.response.data.errors.length > 0) {
            const errorMessage: string = Object.values(error.response.data.errors).join(' <br /> ');
            $notification.generalError('Error', errorMessage);
        }
        if (error.status === 401) {
            const { refreshTokenAsync } = useAuthStore();
            await refreshTokenAsync(undefined, error.config);
        }
        else
        {
            $notification.generalError('Error', error.message);
        }
        return Promise.reject(error);
    },
);

export const backendForFrontendClient = <T>(
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
