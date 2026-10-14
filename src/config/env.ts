function required(name: string): string {
  const value =
    import.meta.env[name] ??
    (typeof process !== "undefined" ? process.env[name] : undefined);
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export const env = {
  NODE_ENV: import.meta.env.MODE ?? "development",
  BACKEND_URL: required("VITE_BACKEND_URL"),
  BUNNY_NET: {
    STORAGE_URL: required("VITE_BUNNY_NET_STORAGE_URL"),
    CDN_URL: required("VITE_BUNNY_NET_CDN_URL"),
    API_KEY: required("VITE_BUNNY_NET_API_KEY"),
  },
};

export default env;
