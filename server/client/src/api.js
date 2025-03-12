import axios from "axios"

const api = axios.create({
    // baseURL:'https://writeora.onrender.com',
    baseURL:'http://localhost:5000',
});

export default api;