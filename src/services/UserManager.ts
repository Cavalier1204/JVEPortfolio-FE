import axios from "axios";
import TokenManager from "./TokenManager";
import { Claims } from "../types";

const url = `${import.meta.env.VITE_API_LINK}/signin`;

const signin = async (username: string, password: string): Promise<Claims> => {
  return axios
    .post<{ token: string }>(url, { username, password })
    .then((response) => response.data.token)
    .then((token) => TokenManager.setAccessToken(token));
};

export default {
  signin,
};
