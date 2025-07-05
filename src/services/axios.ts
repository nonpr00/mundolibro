import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string | undefined,
  //withCredentials: true,
});

export default instance;