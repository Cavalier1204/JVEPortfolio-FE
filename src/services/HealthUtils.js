import axios from "axios";

const apiUrl = `${import.meta.env.VITE_API_LINK}/health`;

export default async function checkServerHealth() {
  return await axios.get(apiUrl);
}
