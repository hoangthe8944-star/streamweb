import { useEffect, useState } from "react";
import { CategoryCard } from "../components/CategoryCard";
import { Loader2, Gamepad2, AlertCircle } from "lucide-react"; // Thêm AlertCircle
import categoryApi, { CategoryDto } from "../../../api/categoryApi";

export function BrowsePage() {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [genres, setGenres] = useState<string[]>(["All"]);
  const [selectedTag, setSelectedTag] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, genreRes] = await Promise.all([
          categoryApi.getAllCategories(),
          categoryApi.getGenresList()
        ]);
        setCategories(catRes.data || []);
        setGenres(["All", ...(genreRes.data || [])]);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu Browse:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Logic lọc đã được sửa lỗi toLowerCase/split
  const filteredCategories = selectedTag === "All"
    ? categories
    : categories.filter(cat => {
        const genreData = cat.genres;
        if (!genreData) return false;

        // Xử lý nếu là chuỗi "Action, RPG"
        if (typeof genreData === 'string') {
          return genreData.split(',').map(g => g.trim()).includes(selectedTag);
        }
        
        // Xử lý nếu là mảng ["Action", "RPG"]
        if (Array.isArray(genreData)) {
          return genreData.includes(selectedTag);
        }

        return false;
      });

  return (
    <div className="p-6 custom-scrollbar h-full overflow-y-auto bg-[#0e0e10]">
      <div className="flex items-center gap-3 mb-8">
        <Gamepad2 className="w-8 h-8 text-purple-500" />
        <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Duyệt tìm</h1>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 custom-scrollbar-horizontal">
        {genres.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all ${
              selectedTag === tag
                ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                : "bg-[#1f1f23] text-white/60 hover:bg-[#2c2c30] hover:text-white"
            }`}
          >
            {tag === "All" ? "Tất cả" : tag}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-purple-500" /></div>
      ) : filteredCategories.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {filteredCategories.map((category) => (
            <CategoryCard 
               key={category.id} 
               id={category.id}
               name={category.name}
               viewers={category.currentViewers}
               thumbnail={category.coverImageUrl || "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400"}
               activeStreamsCount={category.activeStreamsCount}
               slug={category.slug}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-[#1f1f23]/30 rounded-3xl border border-dashed border-white/10">
           <AlertCircle className="w-12 h-12 text-white/10 mb-4" />
           <p className="text-white/20 text-lg font-medium">Không tìm thấy danh mục nào.</p>
        </div>
      )}
    </div>
  );
}