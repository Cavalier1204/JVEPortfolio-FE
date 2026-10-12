import { MediaItem } from "./media";
import { SubjectType } from "./subject";

export interface ArtPiece {
  id: string;
  title: string;
  description?: string | null;
  year: number;
  module: number;
  subject: SubjectType | string;
  createdAt?: string;
  media: MediaItem[];
}

export interface CreateArtPieceInput {
  title: string;
  description?: string;
  year: number;
  module: number;
  subject: SubjectType | string;
  media: Array<{
    locationReference: string;
    order: number;
  }>;
}

export interface UpdateArtPieceInput {
  id?: string;
  title?: string;
  description?: string;
  year?: number;
  module?: number;
  subject?: SubjectType | string;
  deletedMedia?: string[];
  updatedMedia?: Array<{
    id: string;
    order?: number;
  }>;
  newMedia?: Array<{
    locationReference: string;
    order: number;
  }>;
}
