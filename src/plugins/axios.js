import axios from "axios";
import { getAccessToken, setAccessToken, clearAuth } from "@/stores/auth";

const baseURL = import.meta.env.VITE_API_SUPPORT_URL

const httpClient = axios.create({
    baseURL,
    withCredentials: true
});

httpClient.interceptors.request.use(function(config) {
    const token = getAccessToken()
    if (token) config.headers.Authorization='Bearer '+token
    return config;
});

let isRefreshing = false
let failedQueue = []

function processQueue(error, token = null) {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error)
    else prom.resolve(token)
  })
  failedQueue = []
}

httpClient.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config
        const isLoginEndpoint = originalRequest?.url?.includes('/auth/login')
        const isRefreshEndpoint = originalRequest?.url?.includes('refresh-token')

        if (error.response?.status === 401 && !originalRequest?._retry && !isLoginEndpoint && !isRefreshEndpoint) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                }).then(token => {
                    originalRequest.headers.Authorization = 'Bearer ' + token
                    return httpClient(originalRequest)
                })
            }

            originalRequest._retry = true
            isRefreshing = true

            try {
                const { data } = await httpClient.post('/api/auth/refresh-token')
                const newToken = data?.access_token
                if (!newToken) throw new Error('No token in refresh response')
                setAccessToken(newToken)
                processQueue(null, newToken)
                originalRequest.headers.Authorization = 'Bearer ' + newToken
                return httpClient(originalRequest)
            } catch (refreshError) {
                processQueue(refreshError, null)
                clearAuth()
                window.location.href = '/login'
                return Promise.reject(refreshError)
            } finally {
                isRefreshing = false
            }
        }

        if (error.response?.status === 401 && !isLoginEndpoint) {
            clearAuth()
            window.location.href = '/login'
        }

        return Promise.reject(error)
    }
);

export default httpClient;
