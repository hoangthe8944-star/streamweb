const DEFAULT_MEDIA_SERVER_URL = "http://localhost:8888";
const DEFAULT_THUMBNAIL_SERVER_URL = "http://localhost:5297";

const normalizeBaseUrl = (value?: string) => value?.trim().replace(/\/+$/, "") ?? "";

const isLocalUrl = (value: string) =>
  value.includes("://localhost") || value.includes("://127.0.0.1");

const getApiOrigin = () => {
  const apiUrl = normalizeBaseUrl(import.meta.env.VITE_API_URL);
  if (!apiUrl) {
    return "";
  }

  try {
    return new URL(apiUrl).origin;
  } catch {
    return "";
  }
};

const isLocalFrontend = () => {
  if (typeof window === "undefined") {
    return true;
  }

  return (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  );
};

export const getMediaServerUrl = () => {
  const configuredUrl =
    normalizeBaseUrl(import.meta.env.VITE_MEDIA_SERVER_URL) ||
    DEFAULT_MEDIA_SERVER_URL;

  if (!isLocalFrontend() && isLocalUrl(configuredUrl)) {
    return "";
  }

  return configuredUrl;
};

export const getThumbnailServerUrl = () => {
  return (
    normalizeBaseUrl(import.meta.env.VITE_THUMBNAIL_SERVER_URL) ||
    DEFAULT_THUMBNAIL_SERVER_URL
  );
};
