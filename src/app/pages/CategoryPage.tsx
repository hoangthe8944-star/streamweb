import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { StreamCard } from "../components/StreamCard";
import categoryApi, { CategoryDto } from "../../../api/categoryApi";
import streamApi, { Stream } from "../../../api/streamApi";
import { getStreamThumbnail } from "../utils/streamThumbnail";

export function CategoryPage() {
  const { categoryName } = useParams<{ categoryName: string }>();

  const [category, setCategory] = useState<CategoryDto | null>(null);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categoryName) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const [categoryRes, streamsRes] = await Promise.all([
          categoryApi.getAllCategories(),
          streamApi.getLiveStreams(),
        ]);

        const foundCategory = categoryRes.data.find(
          (c) => c.name.toLowerCase().replace(/\s+/g, "-") === categoryName
        );

        setCategory(foundCategory || null);

        const filteredStreams = streamsRes.data.filter(
          (s) => s.categoryName?.toLowerCase().replace(/\s+/g, "-") === categoryName
        );

        setStreams(filteredStreams);
      } catch (err) {
        console.error("Loi khi tai category:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryName]);

  const displayName =
    category?.name ||
    categoryName
      ?.split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const totalViewers = streams.reduce((sum, s) => sum + (s.viewersCount || 0), 0);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl mb-2">{displayName}</h1>
        <p className="text-white/60">
          {loading ? "Loading..." : `${totalViewers.toLocaleString()} viewers`}
        </p>
      </div>

      {loading ? (
        <div className="text-white/50">Dang tai streams...</div>
      ) : streams.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {streams.map((stream) => (
            <StreamCard
              key={stream.id}
              stream={stream}
              channelName={stream.streamerName}
              title={stream.title}
              game={stream.categoryName || ""}
              viewers={stream.viewersCount}
              thumbnail={getStreamThumbnail(stream)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-white/60">
          <p>No streams found for this category.</p>
        </div>
      )}
    </div>
  );
}
