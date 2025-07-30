import axios from "axios";

const api = axios.create({
  baseURL: "https://skillbridge-teko.vercel.app/api",
});

export default api;
