import  { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HorizontalScroll = ({ items, renderItem, itemClass = "" }) => {
  const scrollRef = useRef(null);
  const containerRef = useRef(null);
  const [visibleItemCount, setVisibleItemCount] = useState(4);
  const [itemWidth, setItemWidth] = useState(0);

  useEffect(() => {
    const updateVisibleItems = () => {
      if (containerRef.current && scrollRef.current?.firstChild) {
        const containerWidth = containerRef.current.offsetWidth;
        const firstItem = scrollRef.current.firstChild;
        const itemWidthWithGap = firstItem.offsetWidth + parseInt(window.getComputedStyle(firstItem).marginRight);

        setItemWidth(itemWidthWithGap);
        const count = Math.max(1, Math.floor(containerWidth / itemWidthWithGap));
        setVisibleItemCount(count);
      }
    };

    updateVisibleItems();
    window.addEventListener("resize", updateVisibleItems);

    return () => window.removeEventListener("resize", updateVisibleItems);
  }, [items]);

  const scroll = (direction) => {
    if (scrollRef.current && itemWidth > 0) {
      const scrollAmount = itemWidth * visibleItemCount;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex items-center w-full" ref={containerRef}>
      <button
        className="p-2 rounded-full hover:bg-gray-100 transition hidden md:block"
        onClick={() => scroll("left")}
        aria-label="Scroll left"
      >
        <ChevronLeft className="text-gray-400" size={36} />
      </button>
      <div
        ref={scrollRef}
        className="flex gap-8 overflow-hidden scrollbar-hide py-4 px-2 w-full"
        style={{ scrollBehavior: "smooth" }}
      >
        {items.map((item, idx) => (
          <div key={idx} className={`flex-shrink-0 ${itemClass}`}>
            {renderItem(item)}
          </div>
        ))}
      </div>
      <button
        className="p-2 rounded-full hover:bg-gray-100 transition hidden md:block"
        onClick={() => scroll("right")}
        aria-label="Scroll right"
      >
        <ChevronRight className="text-gray-400" size={36} />
      </button>
    </div>
  );
};

export default HorizontalScroll;