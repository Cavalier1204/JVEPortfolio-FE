import axios from "axios";

const apiUrl = `${import.meta.env.VITE_API_LINK}/health`;

export default function checkServerHealth() {
  return axios.get(apiUrl);
}
