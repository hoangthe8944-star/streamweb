import { CategoryCard } from "../components/CategoryCard";
import { useState } from "react";

const ALL_CATEGORIES = [
  {
    name: "Just Chatting",
    viewers: 234567,
    thumbnail: "https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?w=400&h=533&fit=crop",
  },
  {
    name: "League of Legends",
    viewers: 189234,
    thumbnail: "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=400&h=533&fit=crop",
  },
  {
    name: "Minecraft",
    viewers: 156789,
    thumbnail: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=533&fit=crop",
  },
  {
    name: "Fortnite",
    viewers: 145678,
    thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=533&fit=crop",
  },
  {
    name: "Valorant",
    viewers: 123456,
    thumbnail: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=533&fit=crop",
  },
  {
    name: "Grand Theft Auto V",
    viewers: 98765,
    thumbnail: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=533&fit=crop",
  },
  {
    name: "Counter-Strike 2",
    viewers: 87654,
    thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=533&fit=crop",
  },
  {
    name: "World of Warcraft",
    viewers: 76543,
    thumbnail: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&h=533&fit=crop",
  },
  {
    name: "Dota 2",
    viewers: 65432,
    thumbnail: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=400&h=533&fit=crop",
  },
  {
    name: "Apex Legends",
    viewers: 54321,
    thumbnail: "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?w=400&h=533&fit=crop",
  },
  {
    name: "Music",
    viewers: 43210,
    thumbnail: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=533&fit=crop",
  },
  {
    name: "Art",
    viewers: 32109,
    thumbnail: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&h=533&fit=crop",
  },
];

const TAGS = ["All", "FPS", "RPG", "MOBA", "Strategy", "Sports", "Creative"];

export function BrowsePage() {
  const [selectedTag, setSelectedTag] = useState("All");

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-6">Browse</h1>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              selectedTag === tag
                ? "bg-white text-black"
                : "bg-white/10 hover:bg-white/20"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {ALL_CATEGORIES.map((category) => (
          <CategoryCard key={category.name} {...category} />
        ))}
      </div>
    </div>
  );
}
