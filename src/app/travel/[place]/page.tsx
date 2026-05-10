"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import Lightbox from "@/app/components/travel/lightbox"
import { TRAVEL_PLACES } from "@/app/data/travel-places"

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

    const place = TRAVEL_PLACES.find((p) => p.id === placeId)

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

    const openLightbox = (i: number) => setLightboxIndex(i)
    const closeLightbox = () => setLightboxIndex(null)
    const nextPhoto = useCallback(() => setLightboxIndex((i) => (i === null ? null : (i + 1) % photos.length)), [photos.length])
    const prevPhoto = useCallback(() => setLightboxIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length)), [photos.length])

    if (!place) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-secondary text-sm">Place not found.</p>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-white">
            {/* Header */}
            <div className="max-w-3xl mx-auto px-4 sm:px-7 pt-10 pb-6">
                <Link
                    href="/travel"
                    className="inline-flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors"
                >
                    ← Globe
                </Link>
                <div className="mt-5 flex flex-col gap-1">
                    <p className="text-sm tracking-[2px] text-primary uppercase font-medium">{place.country}</p>
                    <h1 className="text-2xl sm:text-3xl font-normal">{place.name}</h1>
                    <p className="text-secondary text-sm">{place.year}</p>
                </div>
            </div>

            {/* Loading */}
            {loading && (
                <div className="max-w-3xl mx-auto px-4 sm:px-7 py-16 flex justify-center">
                    <p className="text-secondary text-sm animate-pulse">Loading photos…</p>
                </div>
            )}

            {/* Error */}
            {!loading && error && (
                <div className="max-w-3xl mx-auto px-4 sm:px-7 py-12">
                    <p className="text-secondary text-sm">{error}</p>
                </div>
            )}

            {/* Empty */}
            {!loading && !error && photos.length === 0 && (
                <div className="max-w-3xl mx-auto px-4 sm:px-7 py-12">
                    <p className="text-secondary text-sm">No photos yet for this location.</p>
                    <p className="text-secondary/60 text-xs mt-1">
                        Upload to the <span className="font-mono">travel/{placeId}</span> folder in Cloudinary to see them here.
                    </p>
                </div>
            )}

            {/* Grid */}
            {!loading && photos.length > 0 && (
                <div className="max-w-3xl mx-auto px-4 sm:px-7 pb-16">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {photos.map((photo, i) => (
                            <button
                                key={photo.publicId}
                                onClick={() => openLightbox(i)}
                                className="relative aspect-square overflow-hidden rounded-sm bg-primary/5 hover:opacity-90 transition-opacity"
                            >
                                <Image
                                    src={photo.url}
                                    alt=""
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 640px) 50vw, 33vw"
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Lightbox */}
            {lightboxIndex !== null && (
                <Lightbox
                    photos={photos}
                    index={lightboxIndex}
                    onClose={closeLightbox}
                    onNext={nextPhoto}
                    onPrev={prevPhoto}
                />
            )}
        </main>
    )
}
