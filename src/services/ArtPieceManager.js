import axios from "axios";

const publicUrl = `${process.env.REACT_APP_API_LINK}/public`;
const protectedUrl = `${process.env.REACT_APP_API_LINK}/api`;

// Get one
const getArtPiece = async (id) => {
  return await axios
    .get(`${publicUrl}/${id}`)
    .then((response) => response.data);
};

// Get by year by module
const getArtPiecesByYearByModule = async ({ year, module }) => {
  return await axios
    .get(`${publicUrl}/module`, {
      params: {
        year: parseInt(year),
        module: parseInt(module),
      },
    })
    .then((response) => response.data);
};

// Get by year by module by subject
const getArtPiecesByYearByModuleBySubject = async ({
  year,
  module,
  subject,
}) => {
  return await axios
    .get(`${publicUrl}/subject`, {
      params: {
        year: parseInt(year),
        module: parseInt(module),
        subject: subject,
      },
    })
    .then((response) => response.data);
};

// Get portfolio items
const getPortfolioPieces = async () => {
  return await axios
    .get(`${publicUrl}/portfolio`)
    .then((response) => response.data);
};

// Save
const saveArtPiece = async (
  { title, description, year, module, subject, media },
  accessToken,
) => {
  return await axios
    .post(
      `${protectedUrl}/artpiece`,
      { title, description, year, module, subject, media },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
    .then((response) => response.data);
};

// Delete
const deleteArtPiece = async (id, accessToken) => {
  return await axios.delete(`${protectedUrl}/artpiece/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

// Update
const updateArtPiece = async (
  { id, title, description, year, module, subject },
  accessToken,
) => {
  return await axios
    .put(
      `${protectedUrl}/artpiece/${id}`,
      { title, description, year, module, subject },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
    .then((response) => response.data);
};

// Update media
const updateMedia = async (
  artPieceId,
  updatedMedia,
  deletedMedia,
  newMedia,
  accessToken,
) => {
  return await axios.put(
    `${protectedUrl}/media/${artPieceId}`,
    { updatedMedia, deletedMedia, newMedia },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

export default {
  getArtPiece,
  getArtPiecesByYearByModule,
  getArtPiecesByYearByModuleBySubject,
  getPortfolioPieces,
  saveArtPiece,
  deleteArtPiece,
  updateArtPiece,
  updateMedia,
};
