import { resource_api, Axios } from "./baseApi";
const resource = "auth";
export const apiLogin = (payload) =>
    Axios.post(`${resource_api}/${resource}/login`, payload);
export const apiLogout = () =>
    Axios.get(`${resource_api}/${resource}/logout`);
export const apiCheckUser = () =>
    Axios.get(`${resource_api}/${resource}/check-user`);
export const apiRegister = (payload) =>
    Axios.post(`${resource_api}/${resource}/register`, payload);
