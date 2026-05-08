const DEFAULT_THUMBNAIL_SERVER_URL = "http://localhost:5297";

const normalizeBaseUrl = (value?: string) => value?.trim().replace(/\/+$/, "") ?? "";

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

export const getMediaServerUrl = () => {
  const apiOrigin = getApiOrigin();
  return apiOrigin ? `${apiOrigin}/api/Streams/hls` : "";
};

export const getThumbnailServerUrl = () => {
  return (
    normalizeBaseUrl(import.meta.env.VITE_THUMBNAIL_SERVER_URL) ||
    DEFAULT_THUMBNAIL_SERVER_URL
  );
};
