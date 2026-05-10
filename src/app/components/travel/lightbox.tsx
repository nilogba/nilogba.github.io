"use client"

import { useEffect, useCallback } from "react"
import Image from "next/image"

interface Photo {
    url: string
    width: number
    height: number
    publicId: string
}

interface LightboxProps {
    photos: Photo[]
    index: number
    onClose: () => void
    onNext: () => void
    onPrev: () => void
}

export default function Lightbox({ photos, index, onClose, onNext, onPrev }: LightboxProps) {
    const photo = photos[index]

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

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
            onClick={onClose}
        >
            {/* Close */}
            <button
                className="absolute top-4 right-5 text-white/70 hover:text-white text-2xl font-light leading-none"
                onClick={onClose}
                aria-label="Close"
            >
                ×
            </button>

            {/* Counter */}
            <p className="absolute top-5 left-1/2 -translate-x-1/2 text-white/50 text-xs tabular-nums">
                {index + 1} / {photos.length}
            </p>

            {/* Prev */}
            {photos.length > 1 && (
                <button
                    className="absolute left-4 text-white/60 hover:text-white text-3xl px-2"
                    onClick={(e) => { e.stopPropagation(); onPrev() }}
                    aria-label="Previous"
                >
                    ‹
                </button>
            )}

            {/* Image */}
            <div
                className="relative max-w-[90vw] max-h-[85vh]"
                style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
                onClick={(e) => e.stopPropagation()}
            >
                <Image
                    src={photo.url}
                    alt=""
                    fill
                    className="object-contain"
                    sizes="90vw"
                    priority
                />
            </div>

            {/* Next */}
            {photos.length > 1 && (
                <button
                    className="absolute right-4 text-white/60 hover:text-white text-3xl px-2"
                    onClick={(e) => { e.stopPropagation(); onNext() }}
                    aria-label="Next"
                >
                    ›
                </button>
            )}
        </div>
    )
}
