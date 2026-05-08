import { useEffect, useRef, useState, useCallback } from "react";
import Hls from "hls.js";
import {
  Play, Pause, Volume2, VolumeX, Maximize, Minimize,
  Settings, Radio, Loader2, AlertCircle, RefreshCw
} from "lucide-react";
import { getMediaServerUrl } from "../utils/mediaUrl";

interface VideoPlayerProps {
  streamKey: string;
  thumbnail?: string;
  viewers: number;
  isLive?: boolean;
}

export function VideoPlayer({ streamKey, thumbnail, viewers, isLive = true }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const retryTimer = useRef<ReturnType<typeof setTimeout>>();
  const retryCount = useRef(0);
  const MAX_RETRIES = 5;
  const RETRY_DELAY_MS = 3000;

  // Khai báo các State
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [buffering, setBuffering] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false); // ĐÃ THÊM BIẾN NÀY ĐỂ HẾT LỖI
  const [fullscreen, setFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Link HLS từ MediaMTX: /live/key/index.m3u8
  const mediaServerUrl = getMediaServerUrl();
  const hlsUrl = mediaServerUrl
    ? `${mediaServerUrl}/live/${streamKey}/index.m3u8`
    : "";

  const initPlayer = useCallback((isRetry = false) => {
    const video = videoRef.current;
    if (!video || !streamKey) return;

    if (!hlsUrl) {
      setBuffering(false);
      setRetrying(false);
      setError("Chua co dia chi public cho media server. Hay dat VITE_MEDIA_SERVER_URL thanh URL HTTPS/Ngrok cua MediaMTX.");
      return;
    }

    // Cleanup instance cũ
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    clearTimeout(retryTimer.current);

    if (!isRetry) {
      retryCount.current = 0;
      setError(null);
    }

    setBuffering(true);
    setRetrying(isRetry);

    if (Hls.isSupported()) {
      const hls = new Hls({
        lowLatencyMode: true,
        backBufferLength: 0,
        manifestLoadingMaxRetry: 10,
        manifestLoadingRetryDelay: 1000,
      });

      hls.loadSource(hlsUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play()
          .then(() => {
            setPlaying(true);
            setBuffering(false);
            setRetrying(false);
            retryCount.current = 0;
          })
          .catch(() => {
            setBuffering(false);
            setRetrying(false);
          });
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          console.warn("HLS Error:", data.type);
          if (retryCount.current < MAX_RETRIES) {
            retryCount.current += 1;
            setRetrying(true);
            hls.destroy();
            retryTimer.current = setTimeout(() => initPlayer(true), RETRY_DELAY_MS);
          } else {
            setError("Streamer đang ngoại tuyến hoặc lỗi kết nối.");
            setBuffering(false);
            setRetrying(false);
          }
        }
      });

      hlsRef.current = hls;
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Dành cho Safari
      video.src = hlsUrl;
      video.play().catch(() => {});
    }
  }, [hlsUrl, streamKey]);

  useEffect(() => {
    initPlayer();
    return () => {
      hlsRef.current?.destroy();
      clearTimeout(retryTimer.current);
    };
  }, [initPlayer]);

  // Các hàm điều khiển
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) videoRef.current.pause(); else videoRef.current.play();
  };

  const toggleMute = () => setMuted(!muted);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) containerRef.current.requestFullscreen();
    else document.exitFullscreen();
  };

  return (
    <div
      ref={containerRef}
      className="relative bg-black aspect-video w-full select-none overflow-hidden group"
    >
      <video
        ref={videoRef}
        poster={thumbnail}
        className="w-full h-full object-contain"
        playsInline
        muted={muted}
      />

      {/* Overlay: Buffering hoặc Retrying */}
      {(buffering || retrying) && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 z-10">
          <Loader2 className="w-12 h-12 animate-spin text-white/80" />
          {retrying && <p className="text-white text-xs mt-2">Đang kết nối lại ({retryCount.current}/{MAX_RETRIES})...</p>}
        </div>
      )}

      {/* Overlay: Lỗi */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/80 z-20">
          <AlertCircle className="w-10 h-10 text-red-400" />
          <p className="text-sm text-white/70">{error}</p>
          <button
            onClick={() => initPlayer()}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors text-white"
          >
            <RefreshCw className="w-4 h-4" /> Thử lại ngay
          </button>
        </div>
      )}

      {/* Control Bar (Đơn giản hóa) */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-4">
          <button onClick={togglePlay} className="text-white">
            {playing ? <Pause /> : <Play />}
          </button>
          <button onClick={toggleMute} className="text-white">
            {muted ? <VolumeX /> : <Volume2 />}
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2 bg-red-600 px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase">
            <Radio className="w-3 h-3" /> LIVE
          </div>
          <button onClick={toggleFullscreen} className="text-white">
            <Maximize className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
