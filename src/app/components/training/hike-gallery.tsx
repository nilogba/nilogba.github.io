import Link from "next/link"
import { StravaActivity } from "./activity-card"

interface Props {
    hikes: StravaActivity[]
}

function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
}

// Gradient variety for hikes without photos
const HIKE_GRADIENTS = [
    "linear-gradient(135deg,#134e4a 0%,#065f46 100%)",
    "linear-gradient(135deg,#1e3a5f 0%,#0c4a6e 100%)",
    "linear-gradient(135deg,#3b1e6b 0%,#1e3a5f 100%)",
    "linear-gradient(135deg,#064e3b 0%,#065f46 100%)",
]

export default function HikeGallery({ hikes }: Props) {
    if (!hikes.length) return null

    return (
        <div className="border-t border-primary/10">
            {/* Section header */}
            <div className="max-w-3xl mx-auto px-4 sm:px-7 pt-8 pb-5">
                <div className="flex flex-col gap-1">
                    <p className="text-sm tracking-[2px] text-primary uppercase font-medium">Hikes & Treks</p>
                    <p className="text-secondary text-sm">{hikes.length} adventures in the mountains</p>
                </div>
            </div>

            {/* 3-col grid — full bleed to the edges of the content area */}
            <div className="border-t border-primary/10 grid grid-cols-2 sm:grid-cols-3">
                {hikes.map((hike, i) => {
                    const photoUrl = hike.primaryPhotoUrl
                    const bg = HIKE_GRADIENTS[hike.id % 4]
                    const isLastInRow3 = i % 3 === 2
                    const isLastInRow2 = i % 2 === 1

                    return (
                        <Link
                            key={hike.id}
                            href={`/training/${hike.id}`}
                            className={`group relative overflow-hidden aspect-square border-b border-primary/10
                                sm:${isLastInRow3 ? "" : "border-r border-primary/10"}
                                ${isLastInRow2 ? "" : "border-r border-primary/10 sm:border-r-0"}
                                ${isLastInRow3 ? "" : "sm:border-r sm:border-primary/10"}
                            `}
                        >
                            {/* Photo or gradient */}
                            {photoUrl ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img
                                    src={photoUrl}
                                    alt={hike.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-in-out"
                                />
                            ) : (
                                <div
                                    className="w-full h-full flex items-center justify-center"
                                    style={{ background: bg }}
                                >
                                    <span className="text-4xl opacity-30 select-none">⛰️</span>
                                </div>
                            )}

                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                            {/* Text overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                                <p className="text-white text-xs sm:text-sm font-medium leading-snug line-clamp-2">
                                    {hike.name}
                                </p>
                                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                    <span className="text-white/60 text-[10px]">{fmtDate(hike.start_date_local)}</span>
                                    {hike.distance > 0 && (
                                        <span className="text-white/60 text-[10px]">· {(hike.distance / 1000).toFixed(1)} km</span>
                                    )}
                                    {hike.total_elevation_gain > 10 && (
                                        <span className="text-white/60 text-[10px]">↑{Math.round(hike.total_elevation_gain)}m</span>
                                    )}
                                </div>
                            </div>

                            {/* Hover: subtle white overlay */}
                            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
