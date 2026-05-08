import type { Stream } from "../../../api/streamApi";
import { getThumbnailServerUrl } from "./mediaUrl";

const DEFAULT_STREAM_IMAGE = "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80";

export function getStreamThumbnail(stream?: Partial<Stream> | null) {
  if (stream?.thumbnail && stream.thumbnail.startsWith("http")) {
    return stream.thumbnail;
  }

  if (!stream?.streamKey) {
    return DEFAULT_STREAM_IMAGE;
  }

  const thumbnailServerUrl = getThumbnailServerUrl();
  if (!thumbnailServerUrl) {
    return DEFAULT_STREAM_IMAGE;
  }

  return `${thumbnailServerUrl}/thumbnails/${stream.streamKey}.jpg?v=${Date.now()}`;
}

export { DEFAULT_STREAM_IMAGE };
