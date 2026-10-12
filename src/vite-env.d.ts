/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_LINK: string;
  readonly VITE_BUNNY_CDN_URL: string;
  readonly VITE_BUNNY_STORAGE_URL: string;
  readonly VITE_BUNNY_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
