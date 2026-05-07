"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const slides = [
    { type: "video" as const, src: "/videos/freekick.MP4", label: "Free Kick", duration: 7000 },
    { type: "video" as const, src: "/videos/kashmir.MP4", label: "Kashmir", duration: 5000 },
    { type: "image" as const, src: "/videos/trophy.jpg", label: "Trophy", duration: 4000 },
    { type: "video" as const, src: "/videos/pushup.MP4", label: "Push Up", duration: 5000 },
];

const MediaCarousel = () => {
    const [current, setCurrent] = useState(0);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const advance = () => setCurrent(c => (c + 1) % slides.length);
    const goTo = (index: number) => setCurrent(index);
    const prev = () => setCurrent(c => (c - 1 + slides.length) % slides.length);

    useEffect(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(advance, slides[current].duration);
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [current]);

    return (
        <section>
            <div className="container">
                <div className="border-x border-primary/10">
                    <div className="flex flex-col max-w-3xl mx-auto py-10 px-4 sm:px-7">
                        <p className="text-sm tracking-[2px] text-primary uppercase font-medium">Highlights</p>
                    </div>
                    <div className="border-t border-primary/10">
                        <div className="relative max-w-3xl mx-auto px-4 sm:px-7 py-8">
                            <div
                                className="relative w-full overflow-hidden rounded-xl bg-black"
                                style={{ aspectRatio: "16/9" }}
                            >
                                {slides.map((slide, i) => (
                                    <div
                                        key={i}
                                        className="absolute inset-0 transition-opacity duration-300"
                                        style={{ opacity: i === current ? 1 : 0 }}
                                    >
                                        {slide.type === "video" ? (
                                            <video
                                                src={slide.src}
                                                className="w-full h-full object-cover"
                                                autoPlay
                                                muted
                                                loop
                                                playsInline
                                                preload="auto"
                                            />
                                        ) : (
                                            <Image
                                                src={slide.src}
                                                alt={slide.label}
                                                fill
                                                sizes="(max-width: 768px) 100vw, 768px"
                                                className="object-cover"
                                            />
                                        )}
                                    </div>
                                ))}

                                <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                    <p className="text-xs font-medium text-primary">{slides[current].label}</p>
                                </div>

                                <button
                                    onClick={prev}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-white/90 backdrop-blur-sm hover:bg-white border border-primary/10 rounded-full transition-colors"
                                    aria-label="Previous"
                                >
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M10 12L6 8L10 4" stroke="#1C212B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>
                                <button
                                    onClick={advance}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-white/90 backdrop-blur-sm hover:bg-white border border-primary/10 rounded-full transition-colors"
                                    aria-label="Next"
                                >
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M6 4L10 8L6 12" stroke="#1C212B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>
                            </div>

                            <div className="flex items-center justify-center gap-2 mt-5">
                                {slides.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => goTo(i)}
                                        className={`rounded-full transition-all duration-300 ${i === current ? "w-6 h-2 bg-primary" : "w-2 h-2 bg-primary/20 hover:bg-primary/40"}`}
                                        aria-label={`Go to slide ${i + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MediaCarousel;
