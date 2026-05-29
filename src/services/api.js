import axios from 'axios';


const api = axios.create({
    // baseURL: process.env.REACT_APP_API_URL,
    baseURL: "http://localhost:8080/api",
    headers: {
        'Content-Type': 'application/json',
    }
});

const pendingRequests = new Map();

const generateReqKey = (config) => [config.method, config.url, JSON.stringify(config.params)].join('&');

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const requestKey = generateReqKey(config);
  if (pendingRequests.has(requestKey)) {
    const abortController = pendingRequests.get(requestKey);
    abortController.abort();
  }
  
  const controller = new AbortController();
  config.signal = controller.signal;
  pendingRequests.set(requestKey, controller);
  
  return config;
});

api.interceptors.response.use(
  (response) => {
    pendingRequests.delete(generateReqKey(response.config));
    return response;
  },
  (error) => {
    if (!axios.isCancel(error) && error.config) {
      pendingRequests.delete(generateReqKey(error.config));
    }
    return Promise.reject(error);
  }
);

export default api;