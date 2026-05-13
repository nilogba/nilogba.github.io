"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import Divider from "../../components/divider"
import Lightbox, { MediaItem } from "@/app/components/travel/lightbox"

const TOKEN_KEY = "travel_token"

function videoThumbnailUrl(videoUrl: string): string {
    // Cloudinary: inject transformation to get a JPEG frame from the video
    return videoUrl
        .replace("/video/upload/", "/video/upload/so_0,f_jpg,q_70/")
        .replace(/\.[^/.]+$/, ".jpg")
}

export default function TravelPlacePage() {
    const params = useParams()
    const router = useRouter()
    const placeId = params.place as string
    const placeName = placeId.charAt(0).toUpperCase() + placeId.slice(1)

    const [items, setItems] = useState<MediaItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

    useEffect(() => {
        const token = sessionStorage.getItem(TOKEN_KEY)
        if (!token) {
            router.replace("/travel")
            return
        }

        fetch(`/api/travel/photos/${placeId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((r) => r.json())
            .then((data) => {
                if (data.error) setError(data.error)
                else setItems(data.photos ?? [])
            })
            .catch(() => setError("Failed to load media"))
            .finally(() => setLoading(false))
    }, [placeId, router])

    const nextItem = useCallback(
        () => setLightboxIndex((i) => (i === null ? null : (i + 1) % items.length)),
        [items.length]
    )
    const prevItem = useCallback(
        () => setLightboxIndex((i) => (i === null ? null : (i - 1 + items.length) % items.length)),
        [items.length]
    )

    return (
        <main>
            <section>
                <div className="container">
                    <div className="border-x border-primary/10">
                        {/* Header */}
                        <div className="max-w-3xl mx-auto px-4 sm:px-7 pt-10 pb-6">
                            <Link
                                href="/travel"
                                className="inline-flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors"
                            >
                                ← Travel
                            </Link>
                            <div className="mt-5 flex flex-col gap-1">
                                <p className="text-sm tracking-[2px] text-primary uppercase font-medium">Travel</p>
                                <h1 className="text-2xl sm:text-3xl font-normal">{placeName}</h1>
                                {!loading && !error && (
                                    <p className="text-secondary text-sm">{items.length} items</p>
                                )}
                            </div>
                        </div>

                        {/* Loading */}
                        {loading && (
                            <div className="border-t border-primary/10 py-24 flex justify-center">
                                <p className="text-secondary text-sm animate-pulse">Loading…</p>
                            </div>
                        )}

                        {/* Error */}
                        {!loading && error && (
                            <div className="border-t border-primary/10">
                                <div className="max-w-3xl mx-auto px-4 sm:px-7 py-16">
                                    <p className="text-secondary text-sm">{error}</p>
                                </div>
                            </div>
                        )}

                        {/* Empty */}
                        {!loading && !error && items.length === 0 && (
                            <div className="border-t border-primary/10 py-24 flex justify-center">
                                <p className="text-secondary text-sm">No media in this folder.</p>
                            </div>
                        )}

                        {/* Grid */}
                        {!loading && items.length > 0 && (
                            <div className="border-t border-primary/10">
                                <div className="grid grid-cols-2 sm:grid-cols-3">
                                    {items.map((item, i) => (
                                        <button
                                            key={item.publicId}
                                            onClick={() => setLightboxIndex(i)}
                                            className="relative aspect-square overflow-hidden bg-primary/5 group"
                                        >
                                            {item.resourceType === "video" ? (
                                                <>
                                                    {/* Video thumbnail via Cloudinary transform */}
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={videoThumbnailUrl(item.url)}
                                                        alt=""
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                    {/* Play icon overlay */}
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center group-hover:bg-black/70 transition-colors">
                                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="white">
                                                                <polygon points="3,1 13,7 3,13" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <Image
                                                        src={item.url}
                                                        alt=""
                                                        fill
                                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                        sizes="(max-width: 640px) 50vw, 33vw"
                                                    />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                                </>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
            <Divider />

            {lightboxIndex !== null && (
                <Lightbox
                    items={items}
                    index={lightboxIndex}
                    onClose={() => setLightboxIndex(null)}
                    onNext={nextItem}
                    onPrev={prevItem}
                />
            )}
        </main>
    )
}
