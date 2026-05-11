import { resource_api, Axios } from "./baseApi";

export const apiUpdateProfile = (payload) =>
    Axios.put(`${resource_api}/auth/profile`, payload);

export const apiUpdateEmail = (payload) =>
    Axios.put(`${resource_api}/auth/profile/email`, payload);

export const apiUpdatePassword = (payload) =>
    Axios.put(`${resource_api}/auth/profile/password`, payload);
