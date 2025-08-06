import axios from "axios";

const baseURL = import.meta.env.VITE_API_SUPPORT_URL

const httpClient = axios.create({
    baseURL
});

httpClient.interceptors.request.use(function(config) {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization='Bearer '+token
    return config;
});
httpClient.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        return Promise.reject(error);
    }
);

export default httpClient;
