"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import Divider from "../../components/divider"
import Lightbox from "@/app/components/travel/lightbox"

const TOKEN_KEY = "travel_token"

interface Photo {
    url: string
    width: number
    height: number
    publicId: string
}

export default function TravelPlacePage() {
    const params = useParams()
    const router = useRouter()
    const placeId = params.place as string
    const placeName = placeId.charAt(0).toUpperCase() + placeId.slice(1)

    const [photos, setPhotos] = useState<Photo[]>([])
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
                else setPhotos(data.photos ?? [])
            })
            .catch(() => setError("Failed to load photos"))
            .finally(() => setLoading(false))
    }, [placeId, router])

    const nextPhoto = useCallback(
        () => setLightboxIndex((i) => (i === null ? null : (i + 1) % photos.length)),
        [photos.length]
    )
    const prevPhoto = useCallback(
        () => setLightboxIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length)),
        [photos.length]
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
                                    <p className="text-secondary text-sm">{photos.length} photos</p>
                                )}
                            </div>
                        </div>

                        {/* Loading */}
                        {loading && (
                            <div className="border-t border-primary/10 py-24 flex justify-center">
                                <p className="text-secondary text-sm animate-pulse">Loading photos…</p>
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
                        {!loading && !error && photos.length === 0 && (
                            <div className="border-t border-primary/10 py-24 flex justify-center">
                                <p className="text-secondary text-sm">No photos in this folder.</p>
                            </div>
                        )}

                        {/* Photo grid */}
                        {!loading && photos.length > 0 && (
                            <div className="border-t border-primary/10">
                                <div className="grid grid-cols-2 sm:grid-cols-3">
                                    {photos.map((photo, i) => (
                                        <button
                                            key={photo.publicId}
                                            onClick={() => setLightboxIndex(i)}
                                            className="relative aspect-square overflow-hidden bg-primary/5 group"
                                        >
                                            <Image
                                                src={photo.url}
                                                alt=""
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                sizes="(max-width: 640px) 50vw, 33vw"
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
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
                    photos={photos}
                    index={lightboxIndex}
                    onClose={() => setLightboxIndex(null)}
                    onNext={nextPhoto}
                    onPrev={prevPhoto}
                />
            )}
        </main>
    )
}
