const DEFAULT_MEDIA_SERVER_URL = "http://localhost:8888";
const DEFAULT_THUMBNAIL_SERVER_URL = "http://localhost:5297";

const canUseLocalMediaServer = () => {
  if (typeof window === "undefined") {
    return true;
  }

  const hostname = window.location.hostname;
  return hostname === "localhost" || hostname === "127.0.0.1";
};

const normalizeBaseUrl = (value?: string) => value?.trim().replace(/\/+$/, "") ?? "";

export const getMediaServerUrl = () => {
  if (!canUseLocalMediaServer()) {
    return "";
  }

  return normalizeBaseUrl(import.meta.env.VITE_MEDIA_SERVER_URL) || DEFAULT_MEDIA_SERVER_URL;
};

export const getThumbnailServerUrl = () => {
  if (!canUseLocalMediaServer()) {
    return "";
  }

  return (
    normalizeBaseUrl(import.meta.env.VITE_THUMBNAIL_SERVER_URL) ||
    DEFAULT_THUMBNAIL_SERVER_URL
  );
};
