import { resource_api, Axios } from "./baseApi";
const resource = "gadm";
export const apiGetStates = (params) =>
    Axios.get(`${resource_api}/${resource}/states`, { params });
export const apiGetCities = (params) =>
    Axios.get(`${resource_api}/${resource}/cities`, { params });
export const apiGetBarangays = (params) =>
    Axios.get(`${resource_api}/${resource}/barangays`, { params });
