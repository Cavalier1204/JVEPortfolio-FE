import axios from "axios";

const url = "http://localhost:8080/products";

const save = async (artpiece, accessToken) => {
  return await axios
    .post(url, artpiece, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data);
};

export default {
  save,
};
