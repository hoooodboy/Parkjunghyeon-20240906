import axios from "axios";

const { VITE_APP_API_HOST } = import.meta.env;

export const getAPIHost = () => {
  return VITE_APP_API_HOST;
};

export const api = axios.create({
  baseURL: getAPIHost(),
  // withCredentials: true,
});

export default api;
