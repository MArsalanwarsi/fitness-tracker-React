import axios from "axios";


const api = axios.create({
    baseURL: `http://localhost:5000`,
    headers: {
        "Content-Type": "application/json",
    },
});

export const exceriseApi = axios.create({
    baseURL: `https://exercisedb.dev/api/v1`,
    headers: {
        "Content-Type": "application/json",
    },
});

export const excesiseCrudApi = axios.create({
    baseURL: `http://localhost:5000/exercise`,
    headers: {
        "Content-Type": "application/json",
    },
});

export const categoryCrudApi = axios.create({
       baseURL: `http://localhost:5000/category`,
    headers: {
        "Content-Type": "application/json",
    },
})
export default api;