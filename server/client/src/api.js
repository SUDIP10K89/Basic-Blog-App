import axios from "axios"

const api = axios.create({
    baseURL:'https://blog-app-4j8r.onrender.com',
});

export default api;