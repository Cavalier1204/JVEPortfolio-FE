import axios from "axios";

const url = `${process.env.REACT_APP_API_LINK}/signin`;

const signin = async (username, password) => {
  return await axios
    .post(url, username, password)
    .then((response) => response.data);
};

export default {
  signin,
};
