import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

//attach Token to every request
instance.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));

  //check if user has token
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});
export default instance;
