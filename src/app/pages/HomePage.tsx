import { useEffect, useState } from "react";
import { StreamCard } from "../components/StreamCard";
import { CategoryCard } from "../components/CategoryCard";
import streamApi, { Stream } from "../../../api/streamApi";
import categoryApi, { CategoryDto } from "../../../api/categoryApi";
import { DEFAULT_STREAM_IMAGE, getStreamThumbnail } from "../utils/streamThumbnail";

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

        const [streamsRes, categoriesRes] = await Promise.all([
          streamApi.getLiveStreams(),
          categoryApi.getAllCategories(),
        ]);

        setLiveStreams(streamsRes.data);
        setCategories(categoriesRes.data);
      } catch (err) {
        console.error("Loi khi tai du lieu trang chu:", err);
        setError("Khong the ket noi den may chu. Vui long thu lai sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <div className="p-6 text-center h-[80vh] flex flex-col items-center justify-center bg-[#0e0e10]">
        <p className="text-red-500 mb-4 font-medium text-lg">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-purple-600 px-8 py-3 rounded-xl text-white font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/20"
        >
          THU LAI NGAY
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 custom-scrollbar overflow-y-auto h-full bg-[#0e0e10]">
      <section className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 bg-purple-600 rounded-full shadow-[0_0_15px_rgba(147,51,234,0.5)]" />
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">
              Kenh dang phat truc tiep
            </h2>
          </div>
          <button className="text-purple-400 text-sm font-bold hover:text-purple-300 transition-colors">
            Xem tat ca
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
                stream={stream}
                channelName={stream.streamerName}
                title={stream.title}
                game={stream.categoryName || "Dang tro chuyen"}
                viewers={stream.viewersCount}
                thumbnail={getStreamThumbnail(stream)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-[#1f1f23]/50 p-20 rounded-3xl text-center border border-white/5 backdrop-blur-sm">
            <div className="inline-flex p-4 rounded-full bg-white/5 mb-4 text-white/20">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-white/40 text-xl font-medium">Hien khong co ai phat song luc nay.</p>
            <p className="text-white/20 text-sm mt-2">Hay quay lai sau hoac theo doi them streamer moi.</p>
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1.5 h-8 bg-gray-700 rounded-full" />
          <h2 className="text-2xl font-black text-white/90 uppercase tracking-tighter">
            Danh muc noi bat
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
                thumbnail={category.coverImageUrl || DEFAULT_STREAM_IMAGE}
                activeStreamsCount={category.activeStreamsCount}
                isFreeToPlay={category.isFreeToPlay}
                tags={category.steamTags}
              />
            ))}
          </div>
        ) : (
          <p className="text-white/40 text-center py-10">Khong tim thay danh muc nao.</p>
        )}
      </section>
    </div>
  );
}
