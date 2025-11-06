import axios from "axios";

const apiUrl = `${process.env.REACT_APP_API_LINK}/health`

export default async function checkServerHealth() {
  return await axios.get(apiUrl);
}