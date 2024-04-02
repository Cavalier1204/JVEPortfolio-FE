import axios from "axios";

const publicUrl = `${process.env.REACT_APP_API_LINK}/public/artpiece`;
const protectedUrl = `${process.env.REACT_APP_API_LINK}/api/artpiece`;

// Get one
const getArtPiece = async (id) => {
  return await axios
    .get(`${publicUrl}/${id}`)
    .then((response) => response.data);
};

// Get by year by module
const getManyArtPieces = async (year, module) => {
  return await axios
    .get(publicUrl, {
      params: {
        year: year,
        module: module,
      },
    })
    .then((response) => response.data);
};

// Save
const saveArtPiece = async (artpiece, accessToken) => {
  return await axios
    .post(protectedUrl, artpiece, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data);
};

// Delete
const deleteArtPiece = async (id, accessToken) => {
  return await axios.delete(`${protectedUrl}/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export default {
  getArtPiece,
  getManyArtPieces,
  saveArtPiece,
  deleteArtPiece,
};
