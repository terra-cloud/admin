import { resource_api, Axios } from "./baseApi";
const resource = "firebase-configs";
export const apiListFirebaseConfigs = () =>
    Axios.get(`${resource_api}/${resource}`);
export const apiGetActiveFirebaseConfig = () =>
    Axios.get(`${resource_api}/${resource}/active`);
export const apiCreateFirebaseConfig = (payload) =>
    Axios.post(`${resource_api}/${resource}`, payload);
export const apiUpdateFirebaseConfig = (id, payload) =>
    Axios.put(`${resource_api}/${resource}/${id}`, payload);
export const apiDeleteFirebaseConfig = (id) =>
    Axios.delete(`${resource_api}/${resource}/${id}`);
export const apiSetActiveFirebaseConfig = (id) =>
    Axios.put(`${resource_api}/${resource}/${id}/activate`);
