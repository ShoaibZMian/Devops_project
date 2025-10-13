import axios from "axios";

const ip = process.env.REACT_APP_HOST_IP_ADDRESS;

const defaultOptions = {
    headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        'Access-Control-Allow-Origin': '*',
    },
};

// Only set baseURL if ip is defined and not empty
if (ip && ip.trim() !== '') {
    defaultOptions.baseURL = ip;
}

console.log('You are connected to the backend server');

// Create a single axios instance
const instance = axios.create(defaultOptions);

// Add request interceptor to include JWT token in all requests
// This runs for EVERY request, so it gets the token fresh each time
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Export the configured instance directly
export default instance;

// For backwards compatibility, also export as a function
export const httpService = () => instance;





