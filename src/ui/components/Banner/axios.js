import axios from "axios";

const instance = axios.create({
  baseURL: "https://movies2cbackend-production.up.railway.app/api",
});

export default instance;
