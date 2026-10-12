import axios, { AxiosResponse } from "axios";

const apiUrl = `${import.meta.env.VITE_API_LINK}/health`;

export default function checkServerHealth(): Promise<AxiosResponse> {
  return axios.get(apiUrl);
}
