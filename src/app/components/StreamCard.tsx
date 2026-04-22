import { Link } from "react-router"; // Hoặc "react-router" tùy setup của bạn
import { Eye } from "lucide-react";
import { streamApi } from "../../../api";

interface StreamCardProps {
  stream: any; // Nhận nguyên cục dữ liệu từ API
  channelName: string;
  title: string;
  game: string;
  viewers: number;
  thumbnail: string;
}

export function StreamCard({
  stream, // Lấy stream ra ở đây
  channelName,
  title,
  game,
  viewers,
  thumbnail,
}: StreamCardProps) {
  const channelSlug = channelName.toLowerCase().replace(/\s+/g, "");

  return (
    <Link
      to={`/channel/${channelSlug}`}
      // ✅ CHỈ TRUYỀN DỮ LIỆU (OBJECT), KHÔNG TRUYỀN HÀM (API)
      state={{ streamData: stream }} 
      className="group cursor-pointer block"
    >
      {/* Phần Thumbnail */}
      <div className="relative aspect-video bg-[#1f1f23] rounded overflow-hidden mb-2">
        <img
          src={thumbnail || "https://via.placeholder.com/400x225?text=No+Thumbnail"} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        
        {/* Nhãn LIVE màu đỏ */}
        <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase">
          LIVE
        </div>

        {/* Số người xem */}
        <div className="absolute bottom-2 left-2 bg-black/80 text-white px-2 py-0.5 rounded text-xs flex items-center gap-1">
          <Eye className="w-3.5 h-3.5" />
          <span>{viewers.toLocaleString()}</span>
        </div>
      </div>

      {/* Phần Thông tin kênh */}
      <div className="flex gap-3">
        {/* Avatar mặc định (Gradient) */}
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex-shrink-0" />
        
        <div className="flex-1 min-w-0">
          {/* Tiêu đề Stream */}
          <h3 className="font-semibold text-sm text-white truncate group-hover:text-purple-400 transition-colors">
            {title}
          </h3>
          
          {/* Tên Channel */}
          <p className="text-sm text-gray-400 hover:text-white transition-colors">
            {channelName}
          </p>
          
          {/* Tên Game */}
          <p className="text-xs text-gray-400 mt-0.5">
            {game}
          </p>
        </div>
      </div>
    </Link>
  );
}