export type SubjectType =
  | "WERKPRAKTIJK_1"
  | "WERKPRAKTIJK_2"
  | "THEORIE"
  | "SKILLS"
  | "POSITIONERING"
  | "PORTFOLIO";

export interface MediaItem {
  id?: string | number;
  artPieceId?: string | number;
  createdAt?: string;
  locationReference: string;
  order: number;
  preview?: string;
  url?: string;
}

export interface ArtPiece {
  id: string | number;
  title: string;
  description: string;
  year: number;
  module: number;
  subject: SubjectType | string;
  media: MediaItem[];
}

export interface Claims {
  [key: string]: unknown;
}

export interface AuthState {
  isAuthenticated: boolean;
  claims: Claims | null;
}

export interface AuthContextType {
  authState: AuthState;
  login: (token: string) => void;
  logout: () => void;
}

export type SchoolYears = Record<string, number[]>;

export interface SubjectItem {
  enumName: string;
  displayName: string;
}

export interface ModuleCategory {
  title: string;
  subjects: SubjectItem[];
}

export type ModulesMap = Record<string, ModuleCategory>;
