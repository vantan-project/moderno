import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import clsx from "clsx";

export function FirstView() {
  const images = [
    "/first-view-1.png",
    "/first-view-2.png",
    "/first-view-3.png",
  ];

  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    const container = ref.current;
    const width = container.offsetWidth;

    const intervalId = setInterval(() => {
      if (!ref.current) return;
      let nextIndex = index + 1;
      if (nextIndex >= images.length) {
        nextIndex = 0;
      }
      container.scrollTo({
        left: nextIndex * width,
        behavior: "smooth",
      });
      setIndex(nextIndex);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [index, images.length]);

  const onScroll = () => {
    if (!ref.current) return;
    const scrollLeft = ref.current.scrollLeft;
    const width = ref.current.offsetWidth;
    const current = Math.round(scrollLeft / width);
    setIndex(current);
  };

  return (
    <div>
      <div
        ref={ref}
        onScroll={onScroll}
        className="flex gap-16 overflow-x-auto w-full snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
      >
        {images.map((src, i) => (
          <div key={i} className="min-w-full snap-start">
            <Image
              src={src}
              alt={`image-${i}`}
              width={1140}
              height={480}
              className="w-full h-[480px] object-cover rounded-2xl"
            />
          </div>
        ))}
      </div>

      <div className="w-full flex justify-center gap-12 py-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className={clsx(
              "w-4 h-4 rounded-full border border-void transition-all ease-out duration-700",
              index % 3 == i ? "bg-void" : "bg-transparent"
            )}
          ></div>
        ))}
      </div>
    </div>
  );
}
