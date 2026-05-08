const DEFAULT_THUMBNAIL_SERVER_URL = "http://localhost:5297";

const normalizeBaseUrl = (value?: string) => value?.trim().replace(/\/+$/, "") ?? "";

const isLocalHost = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
};

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
  const mediaServerUrl = normalizeBaseUrl(import.meta.env.VITE_MEDIA_SERVER_URL);
  if (isLocalHost() && mediaServerUrl) {
    return mediaServerUrl;
  }

  const apiOrigin = getApiOrigin();
  return apiOrigin ? `${apiOrigin}/api/Streams/hls` : "";
};

export const getHlsUrl = (streamKey: string) => {
  const mediaServerUrl = getMediaServerUrl();
  if (!mediaServerUrl || !streamKey) {
    return "";
  }

  const isDirectMediaServer = isLocalHost() && Boolean(normalizeBaseUrl(import.meta.env.VITE_MEDIA_SERVER_URL));
  return isDirectMediaServer
    ? `${mediaServerUrl}/live/${streamKey}/index.m3u8`
    : `${mediaServerUrl}/${streamKey}/index.m3u8`;
};

export const getThumbnailServerUrl = () => {
  return (
    normalizeBaseUrl(import.meta.env.VITE_THUMBNAIL_SERVER_URL) ||
    DEFAULT_THUMBNAIL_SERVER_URL
  );
};
