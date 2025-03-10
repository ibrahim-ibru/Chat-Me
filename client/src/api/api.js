

// the above is backend code and from this frontend code
// /client/src/api/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api",
});

// Attach token to every request if user is logged in
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;

