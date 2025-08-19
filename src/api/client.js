import axios from "axios";

const api = axios.create({
  baseURL: "https://romi-backend.fabiandev.org/api",
  withCredentials: false
});

const tokenStore = {
  get access() { return localStorage.getItem("accessToken"); },
  set access(v) { v ? localStorage.setItem("accessToken", v) : localStorage.removeItem("accessToken"); },
  get refresh() { return localStorage.getItem("refreshToken"); },
  set refresh(v) { v ? localStorage.setItem("refreshToken", v) : localStorage.removeItem("refreshToken"); }
};

api.interceptors.request.use((config) => {
  const tk = tokenStore.access;
  if (tk) config.headers.Authorization = `Bearer ${tk}`;
  return config;
});

let refreshing = null;
api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config;
    if (error?.response?.status === 401 && !original._retry && tokenStore.refresh) {
      original._retry = true;
      refreshing = refreshing ?? (async () => {
        try {
          const { data } = await axios.post(
            `${api.defaults.baseURL}/auth/refresh`,
            { refreshToken: tokenStore.refresh }
          );
          tokenStore.access = data.accessToken;
          tokenStore.refresh = data.refreshToken;
          return data.accessToken;
        } catch (e) {
          tokenStore.access = null;
          tokenStore.refresh = null;
          throw e;
        } finally {
          refreshing = null;
        }
      })();

      try {
        await refreshing;
        return api(original);
      } catch (e) {
      }
    }
    return Promise.reject(error);
  }
);

export { api, tokenStore };
