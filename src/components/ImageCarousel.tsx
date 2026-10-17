"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Icon } from "./Icon";

type Img = { src: string; alt: string; width: number; height: number };

/**
 * Swipeable image carousel (native scroll-snap) with arrows, dots and keyboard support.
 * Controls only appear when there is more than one image.
 */
export function ImageCarousel({
  images, label, sizes, fit = "cover", priority = false,
}: { images: Img[]; label: string; sizes: string; fit?: "cover" | "contain"; priority?: boolean }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const many = images.length > 1;

  const scrollToIndex = (i: number) => {
    const el = track.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: i * el.clientWidth, behavior: reduce ? "auto" : "smooth" });
  };
  const step = (dir: 1 | -1) => scrollToIndex(Math.min(images.length - 1, Math.max(0, index + dir)));

  return (
    <div className={`carousel carousel--${fit}`} role="group" aria-roledescription="carousel" aria-label={label}>
      <div
        ref={track}
        className="carousel__track"
        tabIndex={many ? 0 : -1}
        onScroll={(e) => { const el = e.currentTarget; setIndex(Math.round(el.scrollLeft / el.clientWidth)); }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
          if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
        }}
      >
        {images.map((img, i) => (
          <div className="carousel__slide" key={img.src} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${images.length}`}>
            <Image src={img.src} alt={img.alt} width={img.width} height={img.height} sizes={sizes} priority={priority && i === 0} className="carousel__img" />
          </div>
        ))}
      </div>
      {many && (
        <>
          <button type="button" className="carousel__btn carousel__btn--prev" onClick={() => step(-1)} disabled={index === 0} aria-label="Previous image">
            <Icon name="arrow" size={18} />
          </button>
          <button type="button" className="carousel__btn carousel__btn--next" onClick={() => step(1)} disabled={index === images.length - 1} aria-label="Next image">
            <Icon name="arrow" size={18} />
          </button>
          <div className="carousel__dots">
            {images.map((img, i) => (
              <button key={img.src} type="button" className="carousel__dot" aria-label={`Show image ${i + 1}`} aria-current={i === index} onClick={() => scrollToIndex(i)} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
