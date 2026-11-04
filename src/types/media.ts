export interface MediaItem {
  id?: string;
  artPieceId?: string;
  createdAt?: string;
  locationReference: string;
  order: number;
  preview?: string;
  url?: string;
}

export interface UpdateMediaInput {
  deletedMedia?: string[];
  newMedia?: Array<{
    locationReference: string;
    order: number;
  }>;
  updatedMedia?: Array<{
    id: string;
    order?: number;
  }>;
}

export interface UploadedMediaItem {
  locationReference: string;
  order: number;
}
