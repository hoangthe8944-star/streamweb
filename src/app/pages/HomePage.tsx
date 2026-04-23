import { useEffect, useState } from "react";
import { StreamCard } from "../components/StreamCard";
import { CategoryCard } from "../components/CategoryCard";
import streamApi, { Stream } from "../../../api/streamApi";
import categoryApi, { CategoryDto } from "../../../api/categoryApi";

export function HomePage() {
  const [liveStreams, setLiveStreams] = useState<Stream[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // QUAN TRỌNG: Kiểm tra xem cổng Backend của bạn là 7100 hay 5297 và sửa tại đây
  const BACKEND_URL = "http://localhost:5297";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [streamsRes, categoriesRes] = await Promise.all([
          streamApi.getLiveStreams(),
          categoryApi.getAllCategories(),
        ]);

        setLiveStreams(streamsRes.data);
        setCategories(categoriesRes.data);
      } catch (err: any) {
        console.error("Lỗi khi tải dữ liệu trang chủ:", err);
        setError("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /**
   * Hàm lấy Thumbnail thông minh:
   * 1. Nếu có link ảnh từ DB (User tự upload) -> Dùng link đó.
   * 2. Nếu không có -> Dùng ảnh screenshot tự động khớp với tên StreamKey.
   * 3. Thêm tham số thời gian ?t=... để trình duyệt không lấy ảnh cũ (Refresh thumbnail).
   */
  const getStreamThumbnail = (stream: Stream) => {
    if (stream.thumbnail && stream.thumbnail.startsWith('http')) {
      return stream.thumbnail;
    }

    // Tạo chuỗi thời gian để tránh bị cache ảnh cũ
    const version = new Date().getTime();
    const PORT = "5297"; // Đảm bảo đây là cổng đúng với backend của bạn
    return `http://localhost:${PORT}/thumbnails/${stream.streamKey}.jpg?v=${version}`;
  };

  // Ảnh mặc định cực đẹp từ Unsplash nếu mọi thứ đều lỗi
  const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80";

  if (error) {
    return (
      <div className="p-6 text-center h-[80vh] flex flex-col items-center justify-center bg-[#0e0e10]">
        <p className="text-red-500 mb-4 font-medium text-lg">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-purple-600 px-8 py-3 rounded-xl text-white font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/20"
        >
          THỬ LẠI NGAY
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 custom-scrollbar overflow-y-auto h-full bg-[#0e0e10]">
      {/* SECTION: STREAM ĐANG LIVE */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 bg-purple-600 rounded-full shadow-[0_0_15px_rgba(147,51,234,0.5)]" />
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">
              Kênh đang phát trực tiếp
            </h2>
          </div>
          <button className="text-purple-400 text-sm font-bold hover:text-purple-300 transition-colors">
            Xem tất cả
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="aspect-video bg-white/5 animate-pulse rounded-xl" />
                <div className="h-4 w-3/4 bg-white/5 animate-pulse rounded" />
                <div className="h-3 w-1/2 bg-white/5 animate-pulse rounded" />
              </div>
            ))}
          </div>
        ) : liveStreams.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {liveStreams.map((stream) => (
              <StreamCard
                key={stream.id}
                channelName={stream.streamerName}
                title={stream.title}
                game={stream.categoryName || "Đang trò chuyện"}
                viewers={stream.viewersCount}
                thumbnail={getStreamThumbnail(stream)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-[#1f1f23]/50 p-20 rounded-3xl text-center border border-white/5 backdrop-blur-sm">
            <div className="inline-flex p-4 rounded-full bg-white/5 mb-4 text-white/20">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            </div>
            <p className="text-white/40 text-xl font-medium">Hiện không có ai phát sóng lúc này.</p>
            <p className="text-white/20 text-sm mt-2">Hãy quay lại sau hoặc theo dõi thêm streamer mới!</p>
          </div>
        )}
      </section>

      {/* PHẦN DANH MỤC PHỔ BIẾN */}
      <section>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1.5 h-8 bg-gray-700 rounded-full" />
          <h2 className="text-2xl font-black text-white/90 uppercase tracking-tighter">
            Danh mục nổi bật
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-white/5 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                id={category.id}
                name={category.name}
                slug={category.slug}
                viewers={category.currentViewers ?? 0}
                thumbnail={category.coverImageUrl || DEFAULT_IMAGE}
                activeStreamsCount={category.activeStreamsCount}
                isFreeToPlay={category.isFreeToPlay}
                tags={category.steamTags}
              />
            ))}
          </div>
        ) : (
          <p className="text-white/40 text-center py-10">Không tìm thấy danh mục nào.</p>
        )}
      </section>
    </div>
  );
}