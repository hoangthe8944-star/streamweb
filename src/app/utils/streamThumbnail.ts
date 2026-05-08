import type { Stream } from "../../../api/streamApi";

const DEFAULT_STREAM_IMAGE = "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80";
const THUMBNAIL_PORT = "5297";

export function getStreamThumbnail(stream?: Partial<Stream> | null) {
  if (stream?.thumbnail && stream.thumbnail.startsWith("http")) {
    return stream.thumbnail;
  }

  if (!stream?.streamKey) {
    return DEFAULT_STREAM_IMAGE;
  }

  return `http://localhost:${THUMBNAIL_PORT}/thumbnails/${stream.streamKey}.jpg?v=${Date.now()}`;
}

export { DEFAULT_STREAM_IMAGE };
