import apiClient from "./apiClient";
import {
  ArtPiece,
  CreateArtPieceInput,
  UpdateArtPieceInput,
  UpdateMediaInput,
  ApiResponse,
} from "../types";

export interface GetByModuleParams {
  year: number | string;
  module: number | string;
}

export interface GetBySubjectParams {
  year: number | string;
  module: number | string;
  subject: string;
}

export type SaveArtPieceParams = CreateArtPieceInput;
export type UpdateArtPieceParams = UpdateArtPieceInput & {
  id: string | number;
};

// Get one
const getArtPiece = async (
  id: string | number,
): Promise<ApiResponse<ArtPiece>> => {
  return await apiClient
    .get<ApiResponse<ArtPiece>>(`/artPiece/${id}`)
    .then((response) => response.data);
};

// Get by year by module
const getArtPiecesByYearByModule = async ({
  year,
  module,
}: GetByModuleParams): Promise<ApiResponse<ArtPiece[]>> => {
  return await apiClient
    .get<ApiResponse<ArtPiece[]>>("/artPiece/module", {
      params: {
        year: typeof year === "string" ? parseInt(year, 10) : year,
        module: typeof module === "string" ? parseInt(module, 10) : module,
      },
    })
    .then((response) => response.data);
};

// Get by year by module by subject
const getArtPiecesByYearByModuleBySubject = async ({
  year,
  module,
  subject,
}: GetBySubjectParams): Promise<ApiResponse<ArtPiece[]>> => {
  return await apiClient
    .get<ApiResponse<ArtPiece[]>>("/artPiece/subject", {
      params: {
        year: typeof year === "string" ? parseInt(year, 10) : year,
        module: typeof module === "string" ? parseInt(module, 10) : module,
        subject,
      },
    })
    .then((response) => response.data);
};

// Get portfolio items
const getPortfolioPieces = async (): Promise<ApiResponse<ArtPiece[]>> => {
  return await apiClient
    .get<ApiResponse<ArtPiece[]>>("/artPiece/portfolio")
    .then((response) => response.data);
};

// Save
const saveArtPiece = async ({
  title,
  description,
  year,
  module,
  subject,
  media,
}: SaveArtPieceParams): Promise<ApiResponse<ArtPiece>> => {
  return await apiClient
    .post<ApiResponse<ArtPiece>>("/artPiece", {
      title,
      description,
      year: typeof year === "string" ? parseInt(year, 10) : year,
      module: typeof module === "string" ? parseInt(module, 10) : module,
      subject,
      media: media.map((item, index) => ({
        locationReference: item.locationReference,
        order: item.order ?? index + 1,
      })),
    })
    .then((response) => response.data);
};

// Delete
const deleteArtPiece = async (
  id: string | number,
): Promise<{ message: string }> => {
  return await apiClient
    .delete<{ message: string }>(`/artPiece/${id}`)
    .then((response) => response.data);
};

// Update
const updateArtPiece = async (
  params: UpdateArtPieceParams,
): Promise<ApiResponse<ArtPiece>> => {
  const {
    id,
    title,
    description,
    year,
    module,
    subject,
    deletedMedia,
    updatedMedia,
    newMedia,
  } = params;
  return await apiClient
    .put<ApiResponse<ArtPiece>>(`/artPiece/${id}`, {
      ...(title !== undefined ? { title } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(year !== undefined
        ? { year: typeof year === "string" ? parseInt(year, 10) : year }
        : {}),
      ...(module !== undefined
        ? {
            module: typeof module === "string" ? parseInt(module, 10) : module,
          }
        : {}),
      ...(subject !== undefined ? { subject } : {}),
      ...(deletedMedia !== undefined ? { deletedMedia } : {}),
      ...(updatedMedia !== undefined ? { updatedMedia } : {}),
      ...(newMedia !== undefined ? { newMedia } : {}),
    })
    .then((response) => response.data);
};

// Update media
const updateMedia = async (
  artPieceId: string | number,
  updatedMedia?: UpdateMediaInput["updatedMedia"],
  deletedMedia?: (string | number)[],
  newMedia?: UpdateMediaInput["newMedia"],
): Promise<void> => {
  return await apiClient
    .put<void>(`/media/${artPieceId}`, {
      ...(deletedMedia ? { deletedMedia: deletedMedia.map(String) } : {}),
      ...(updatedMedia
        ? {
            updatedMedia: updatedMedia.map((item) => ({
              id: String(item.id),
              ...(item.order !== undefined ? { order: item.order } : {}),
            })),
          }
        : {}),
      ...(newMedia
        ? {
            newMedia: newMedia.map((item, index) => ({
              locationReference: item.locationReference,
              order: item.order ?? index + 1,
            })),
          }
        : {}),
    })
    .then((response) => response.data);
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
