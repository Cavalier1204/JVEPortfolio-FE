import axios from "axios";
import { ArtPiece, MediaItem } from "../types";

const publicUrl = `${import.meta.env.VITE_API_LINK}/public`;
const protectedUrl = `${import.meta.env.VITE_API_LINK}/api`;

export interface GetByModuleParams {
  year: number | string;
  module: number | string;
}

export interface GetBySubjectParams {
  year: number | string;
  module: number | string;
  subject: string;
}

export interface SaveArtPieceParams {
  title: string;
  description: string;
  year: number;
  module: number;
  subject: string;
  media: MediaItem[] | any[];
}

export interface UpdateArtPieceParams {
  id: string | number;
  title: string;
  description: string;
  year: number;
  module: number;
  subject: string;
}

// Get one
const getArtPiece = async (id: string | number): Promise<ArtPiece> => {
  return await axios
    .get<ArtPiece>(`${publicUrl}/${id}`)
    .then((response) => response.data);
};

// Get by year by module
const getArtPiecesByYearByModule = async ({
  year,
  module,
}: GetByModuleParams): Promise<{ data: ArtPiece[] }> => {
  return await axios
    .get<{ data: ArtPiece[] }>(`${publicUrl}/module`, {
      params: {
        year: typeof year === "string" ? parseInt(year) : year,
        module: typeof module === "string" ? parseInt(module) : module,
      },
    })
    .then((response) => response.data);
};

// Get by year by module by subject
const getArtPiecesByYearByModuleBySubject = async ({
  year,
  module,
  subject,
}: GetBySubjectParams): Promise<{ data: ArtPiece[] }> => {
  return await axios
    .get<{ data: ArtPiece[] }>(`${publicUrl}/subject`, {
      params: {
        year: typeof year === "string" ? parseInt(year) : year,
        module: typeof module === "string" ? parseInt(module) : module,
        subject,
      },
    })
    .then((response) => response.data);
};

// Get portfolio items
const getPortfolioPieces = async (): Promise<{ data: ArtPiece[] }> => {
  return await axios
    .get<{ data: ArtPiece[] }>(`${publicUrl}/portfolio`)
    .then((response) => response.data);
};

// Save
const saveArtPiece = async (
  { title, description, year, module, subject, media }: SaveArtPieceParams,
  accessToken: string | null,
): Promise<ArtPiece> => {
  return await axios
    .post<ArtPiece>(
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
const deleteArtPiece = async (
  id: string | number,
  accessToken: string | null,
) => {
  return await axios.delete(`${protectedUrl}/artpiece/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

// Update
const updateArtPiece = async (
  { id, title, description, year, module, subject }: UpdateArtPieceParams,
  accessToken: string | null,
): Promise<ArtPiece> => {
  return await axios
    .put<ArtPiece>(
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
  artPieceId: string | number,
  updatedMedia: any[],
  deletedMedia: (string | number)[],
  newMedia: any,
  accessToken: string | null,
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
