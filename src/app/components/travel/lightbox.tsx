"use client"

import { useEffect, useCallback } from "react"

export interface MediaItem {
    url: string
    width: number
    height: number
    publicId: string
    resourceType: "image" | "video"
}

interface LightboxProps {
    items: MediaItem[]
    index: number
    onClose: () => void
    onNext: () => void
    onPrev: () => void
}

export default function Lightbox({ items, index, onClose, onNext, onPrev }: LightboxProps) {
    const item = items[index]

    const handleKey = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
            if (e.key === "ArrowRight") onNext()
            if (e.key === "ArrowLeft") onPrev()
        },
        [onClose, onNext, onPrev]
    )

    useEffect(() => {
        document.addEventListener("keydown", handleKey)
        document.body.style.overflow = "hidden"
        return () => {
            document.removeEventListener("keydown", handleKey)
            document.body.style.overflow = ""
        }
    }, [handleKey])

    if (!item) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/92"
            onClick={onClose}
        >
            {/* Close */}
            <button
                className="absolute top-4 right-5 text-white/60 hover:text-white text-3xl font-light leading-none z-10"
                onClick={onClose}
                aria-label="Close"
            >
                ×
            </button>

            {/* Counter */}
            <p className="absolute top-5 left-1/2 -translate-x-1/2 text-white/40 text-xs tabular-nums z-10">
                {index + 1} / {items.length}
            </p>

            {/* Prev */}
            {items.length > 1 && (
                <button
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-4xl px-3 py-6 z-10"
                    onClick={(e) => { e.stopPropagation(); onPrev() }}
                    aria-label="Previous"
                >
                    ‹
                </button>
            )}

            {/* Media */}
            <div onClick={(e) => e.stopPropagation()}>
                {item.resourceType === "video" ? (
                    // eslint-disable-next-line jsx-a11y/media-has-caption
                    <video
                        key={item.url}
                        src={item.url}
                        controls
                        autoPlay
                        playsInline
                        className="max-w-[90vw] max-h-[85vh] outline-none rounded-sm"
                    />
                ) : (
                    // Plain img — works without Next.js domain config
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={item.url}
                        alt=""
                        className="max-w-[90vw] max-h-[85vh] object-contain rounded-sm"
                    />
                )}
            </div>

            {/* Next */}
            {items.length > 1 && (
                <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-4xl px-3 py-6 z-10"
                    onClick={(e) => { e.stopPropagation(); onNext() }}
                    aria-label="Next"
                >
                    ›
                </button>
            )}
        </div>
    )
}
