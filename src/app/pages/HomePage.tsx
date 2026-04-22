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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Gọi đồng thời cả 2 API để tối ưu tốc độ
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

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-purple-600 px-4 py-2 rounded text-white"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* PHẦN STREAM ĐANG LIVE */}
      <section className="mb-12">
        <h2 className="text-xl mb-6 font-bold text-white hover:text-purple-400 cursor-pointer inline-block">
          Live Channels We Think You'll Like
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-video bg-white/5 animate-pulse rounded" />
            ))}
          </div>
        ) : liveStreams.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {liveStreams.map((stream) => (
              <StreamCard
                key={stream.id}
                channelName={stream.streamerName}
                title={stream.title}
                game={stream.categoryName || "Just Chatting"}
                viewers={stream.viewersCount}
                thumbnail={
                  stream.thumbnail ||
                  "https://via.placeholder.com/800x450?text=Live+Streaming"
                }
              />
            ))}
          </div>
        ) : (
          <div className="bg-[#1f1f23] p-8 rounded-lg text-center">
            <p className="text-white/40">Hiện không có kênh nào đang trực tuyến.</p>
          </div>
        )}
      </section>

      {/* PHẦN DANH MỤC PHỔ BIẾN */}
      <section>
        <h2 className="text-xl mb-6 font-bold text-white hover:text-purple-400 cursor-pointer inline-block">
          Popular Categories
        </h2>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-white/5 animate-pulse rounded" />
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                id={category.id}
                name={category.name}
                slug={category.slug}
                viewers={category.currentViewers ?? 0}
                thumbnail={category.coverImageUrl}
                activeStreamsCount={category.activeStreamsCount}
                isFreeToPlay={category.isFreeToPlay}
                tags={category.steamTags}
              />
            ))}
          </div>
        ) : (
          <p className="text-white/40 text-center">Không tìm thấy danh mục nào.</p>
        )}
      </section>
    </div>
  );
}