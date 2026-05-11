import { resource_api, Axios } from "./baseApi";
const resource = "admins";
export const apiListAdmins = () =>
    Axios.get(`${resource_api}/${resource}`);
export const apiUpdateAdmin = (id, payload) =>
    Axios.put(`${resource_api}/${resource}/${id}`, payload);
export const apiDeleteAdmin = (id) =>
    Axios.delete(`${resource_api}/${resource}/${id}`);
