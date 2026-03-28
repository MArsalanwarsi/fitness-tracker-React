import axios from "axios";
// http://localhost:5000/

const api = axios.create({
    baseURL: `https://fitness-tracker-express.vercel.app`,
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
    baseURL: `https://fitness-tracker-express.vercel.app/exercise`,
    headers: {
        "Content-Type": "application/json",
    },
});

export const categoryCrudApi = axios.create({
       baseURL: `https://fitness-tracker-express.vercel.app/category`,
    headers: {
        "Content-Type": "application/json",
    },
})
export default api;