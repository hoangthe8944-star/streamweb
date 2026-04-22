import { Link } from "react-router";

interface CategoryCardProps {
  id: number;
  name: string;
  slug?: string;
  viewers: number;
  thumbnail: string;
  activeStreamsCount?: number;
  genres?: string | string[]; // 🔥 sửa ở đây
  platforms?: string | string[];
  isFreeToPlay?: boolean;
  price?: number;
  currency?: string;
  metacriticScore?: number;
  steamReviewScore?: number;
  popularityRank?: number;
  tags?: string | string[];
}

export function CategoryCard({
  id,
  name,
  slug,
  viewers,
  thumbnail,
  activeStreamsCount,
  genres,
  platforms,
  isFreeToPlay,
  price,
  currency = "USD",
  metacriticScore,
  steamReviewScore,
  popularityRank,
  tags,
}: CategoryCardProps) {
  const linkTo = slug
    ? `/category/${slug}`
    : `/category/${name.toLowerCase().replace(/\s+/g, "-")}`;

  // ✅ FIX GENRES (không crash nữa)
  const genreList = Array.isArray(genres)
    ? genres.slice(0, 2)
    : typeof genres === "string"
    ? genres.split(",").map((g) => g.trim()).slice(0, 2)
    : [];

  const priceLabel = isFreeToPlay
    ? "Free to Play"
    : price != null
    ? `${currency === "USD" ? "$" : ""}${price.toLocaleString()}`
    : null;

  return (
    <Link to={linkTo} className="group cursor-pointer">
      {/* Thumbnail */}
      <div className="relative aspect-[3/4] bg-[#1f1f23] rounded overflow-hidden mb-2">
        <img
          src={thumbnail}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />

        {/* Popularity rank */}
        {popularityRank != null && popularityRank <= 10 && (
          <div className="absolute top-1 left-1 bg-purple-600 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
            #{popularityRank}
          </div>
        )}

        {/* Price */}
        {priceLabel && (
          <div
            className={`absolute bottom-1 right-1 text-[10px] font-semibold px-1.5 py-0.5 rounded ${
              isFreeToPlay
                ? "bg-green-600 text-white"
                : "bg-black/70 text-white"
            }`}
          >
            {priceLabel}
          </div>
        )}
      </div>

      {/* Name */}
      <h3 className="font-semibold text-sm truncate group-hover:text-purple-400">
        {name}
      </h3>

      {/* Viewers */}
      <p className="text-xs text-white/60">
        {viewers.toLocaleString()} viewers
        {activeStreamsCount != null && (
          <span className="ml-1">· {activeStreamsCount} streams</span>
        )}
      </p>

      {/* Genres */}
      {genreList.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {genreList.map((g, i) => (
            <span
              key={i}
              className="text-[10px] bg-white/10 text-white/70 px-1.5 py-0.5 rounded"
            >
              {g}
            </span>
          ))}
        </div>
      )}

      {/* Scores */}
      {(metacriticScore != null || steamReviewScore != null) && (
        <div className="flex gap-2 mt-1">
          {metacriticScore != null && (
            <span className="text-[10px] text-yellow-400 font-semibold">
              MC {metacriticScore}
            </span>
          )}
          {steamReviewScore != null && (
            <span className="text-[10px] text-blue-400 font-semibold">
              Steam {steamReviewScore}%
            </span>
          )}
        </div>
      )}
    </Link>
  );
}