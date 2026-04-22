import { X, Search } from "lucide-react";
import { useState } from "react";

const EMOJI_CATEGORIES = {
  Frequent: ["😂", "❤️", "😍", "🔥", "👍", "😊", "🎉", "💯", "👏", "🙌"],
  Smileys: [
    "😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃",
    "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "😚", "😙",
    "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔",
  ],
  Gestures: [
    "👍", "👎", "👌", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉",
    "👆", "👇", "☝️", "👋", "🤚", "🖐️", "✋", "🖖", "👏", "🙌",
    "🤲", "🤝", "🙏", "✍️", "💪", "🦾", "🦵", "🦿", "🦶", "👂",
  ],
  Animals: [
    "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯",
    "🦁", "🐮", "🐷", "🐸", "🐵", "🐔", "🐧", "🐦", "🐤", "🦆",
    "🦅", "🦉", "🦇", "🐺", "🐗", "🐴", "🦄", "🐝", "🐛", "🦋",
  ],
  Food: [
    "🍎", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍈", "🍒", "🍑",
    "🥭", "🍍", "🥥", "🥝", "🍅", "🍆", "🥑", "🥦", "🥬", "🥒",
    "🌶️", "🌽", "🥕", "🧄", "🧅", "🥔", "🍠", "🥐", "🍞", "🥖",
  ],
  Activities: [
    "⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱",
    "🏓", "🏸", "🏒", "🏑", "🥍", "🏏", "🥅", "⛳", "🏹", "🎣",
    "🥊", "🥋", "🎽", "🛹", "🛷", "⛸️", "🥌", "🎿", "⛷️", "🏂",
  ],
  Objects: [
    "⌚", "📱", "💻", "⌨️", "🖥️", "🖨️", "🖱️", "🖲️", "🕹️", "🗜️",
    "💾", "💿", "📀", "📼", "📷", "📸", "📹", "🎥", "📽️", "🎞️",
    "📞", "☎️", "📟", "📠", "📺", "📻", "🎙️", "🎚️", "🎛️", "🧭",
  ],
  Symbols: [
    "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔",
    "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "☮️",
    "✝️", "☪️", "🕉️", "☸️", "✡️", "🔯", "🕎", "☯️", "☦️", "🛐",
  ],
};

interface EmojiPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (emoji: string) => void;
  position?: { top?: number; bottom?: number; left?: number; right?: number };
}

export function EmojiPicker({ isOpen, onClose, onSelect, position }: EmojiPickerProps) {
  const [activeCategory, setActiveCategory] = useState("Frequent");
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  const positionStyles = position
    ? {
        top: position.top,
        bottom: position.bottom,
        left: position.left,
        right: position.right,
      }
    : { bottom: 60, right: 100 };

  const handleEmojiSelect = (emoji: string) => {
    onSelect(emoji);
    onClose();
  };

  const filteredEmojis = searchQuery
    ? Object.values(EMOJI_CATEGORIES)
        .flat()
        .filter((emoji) => emoji.includes(searchQuery))
    : EMOJI_CATEGORIES[activeCategory as keyof typeof EMOJI_CATEGORIES] || [];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Picker */}
      <div
        className="fixed w-80 h-96 bg-[#1f1f23] border border-white/20 rounded-lg shadow-2xl z-50 flex flex-col"
        style={positionStyles}
      >
        {/* Header */}
        <div className="p-3 border-b border-white/10">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Emojis</h3>
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search emojis"
              className="w-full bg-[#0e0e10] border border-white/20 rounded pl-8 pr-3 py-1.5 text-sm focus:outline-none focus:border-purple-600"
            />
          </div>
        </div>

        {/* Categories */}
        {!searchQuery && (
          <div className="flex gap-1 px-3 py-2 border-b border-white/10 overflow-x-auto">
            {Object.keys(EMOJI_CATEGORIES).map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-3 py-1 text-xs rounded whitespace-nowrap ${
                  activeCategory === category
                    ? "bg-purple-600 text-white"
                    : "bg-[#0e0e10] text-white/60 hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Emoji Grid */}
        <div className="flex-1 overflow-y-auto p-3">
          <div className="grid grid-cols-8 gap-1">
            {filteredEmojis.map((emoji, index) => (
              <button
                key={`${emoji}-${index}`}
                onClick={() => handleEmojiSelect(emoji)}
                className="aspect-square text-2xl hover:bg-white/10 rounded flex items-center justify-center transition-colors"
                title={emoji}
              >
                {emoji}
              </button>
            ))}
          </div>
          {filteredEmojis.length === 0 && (
            <div className="text-center text-white/60 py-8">
              <p>No emojis found</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
