import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, Maximize, Settings } from "lucide-react";
import Hls from "hls.js";

interface VideoPlayerProps {
  streamKey: string; // 🔥 Cần truyền streamKey vào đây
  thumbnail: string;
  viewers: number;
  isLive?: boolean;
}

export function VideoPlayer({
  streamKey,
  thumbnail,
  viewers,
  isLive = true,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  // Link HLS từ Node Media Server của bạn
  const hlsUrl = `http://localhost:8000/live/${streamKey}/index.m3u8`;

  useEffect(() => {
    let hls: Hls;

    if (videoRef.current) {
      const video = videoRef.current;

      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(hlsUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          // video.play(); // Tự động chạy nếu muốn
        });
      } 
      // Dành cho Safari (hỗ trợ HLS gốc)
      else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = hlsUrl;
      }
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [hlsUrl]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  return (
    <div className="relative bg-black aspect-video w-full flex items-center justify-center group overflow-hidden">
      {/* Video Element */}
      <video
        ref={videoRef}
        poster={thumbnail} // Hiện thumbnail khi chưa load xong video
        className="w-full h-full object-contain"
        playsInline
      />

      {/* Overlay khi hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <div className="flex items-center gap-4">
          <button onClick={togglePlay} className="p-2 hover:bg-white/20 rounded transition-colors">
            {playing ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white" />}
          </button>

          <button className="p-2 hover:bg-white/20 rounded">
            <Volume2 className="w-5 h-5" />
          </button>

          <div className="flex-1">
            {/* Thanh tiến trình - Với livestream thường là thanh trạng thái thời gian thực */}
            <div className="h-1 bg-white/30 rounded-full">
              <div className="h-full bg-purple-500 rounded-full w-full shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
            </div>
          </div>

          <button className="p-2 hover:bg-white/20 rounded">
            <Settings className="w-5 h-5" />
          </button>

          <button 
             onClick={() => videoRef.current?.requestFullscreen()}
             className="p-2 hover:bg-white/20 rounded"
          >
            <Maximize className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* LIVE badge */}
      {isLive && (
        <div className="absolute top-4 left-4 bg-red-600 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider animate-pulse">
          LIVE
        </div>
      )}

      {/* viewers count */}
      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded text-xs font-medium">
        {viewers.toLocaleString()} viewers
      </div>
    </div>
  );
}