import axios from "axios";

const ip = process.env.REACT_APP_HOST_IP_ADDRESS;

const httpService = () => {
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

    let instance = axios.create(defaultOptions);

    return instance;
};

export default httpService;





