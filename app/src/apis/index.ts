import axios from "axios";
import { readLocal, TOKEN } from "../utils/localStorage";

export const baseRequest = axios.create({
  baseURL: process.env.REACT_APP_API_URL + "/api",
  withCredentials: true,
});

baseRequest.interceptors.request.use(
  (config) => {
    const token = readLocal(TOKEN);
    config.headers = {
      authorization: "bearer " + token,
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

baseRequest.interceptors.response.use(
  (res) => {
    // if (res.data.code === 2000) {
    //   // window.location.href = "/home";
    // }
    // if (res.data.code === 4000) {
    //   return Promise.reject(res);
    // }
    return Promise.resolve(res);
  },
  (error) => {
    // console.log("Return Error");
    return Promise.reject(error);
  }
);
