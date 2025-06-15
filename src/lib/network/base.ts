import axios from "axios";

const getUserToken = () => {
  const accessToken = localStorage.getItem("access-token");
  const token = accessToken ? JSON.parse(accessToken) : null;
  return token;
};

export const base = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${getUserToken()}`,
  },
});
