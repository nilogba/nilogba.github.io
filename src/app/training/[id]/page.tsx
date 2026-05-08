"use client"

import { useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import Divider from "../../components/divider"

/* ── types ── */

interface SplitMetric {
    split: number
    distance: number
    moving_time: number
    average_speed: number
    average_heartrate?: number
    pace_zone?: number
}

interface Lap {
    lap_index: number
    name: string
    distance: number
    moving_time: number
    average_speed: number
    average_heartrate?: number
    average_cadence?: number
}

interface Activity {
    id: number
    name: string
    description?: string
    distance: number
    moving_time: number
    elapsed_time: number
    total_elevation_gain: number
    type: string
    sport_type: string
    start_date_local: string
    average_speed: number
    max_speed: number
    average_heartrate?: number
    max_heartrate?: number
    average_cadence?: number
    weighted_average_watts?: number
    kilojoules?: number
    suffer_score?: number
    elev_high?: number
    elev_low?: number
    splits_metric?: SplitMetric[]
    laps?: Lap[]
    device_name?: string
}

interface Photo {
    unique_id: string
    urls: { "600"?: string }
    caption?: string
}

/* ── helpers ── */

function fmtPace(mps: number) {
    if (!mps || mps <= 0) return "—"
    const spk = 1000 / mps
    return `${Math.floor(spk / 60)}:${Math.round(spk % 60).toString().padStart(2, "0")}`
}

function fmtTime(secs: number) {
    const h = Math.floor(secs / 3600)
    const m = Math.floor((secs % 3600) / 60)
    const s = secs % 60
    if (h > 0) return `${h}h ${m}m`
    return `${m}m ${s.toString().padStart(2, "0")}s`
}

function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-IN", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
    })
}

function fmtKm(m: number) {
    return `${(m / 1000).toFixed(2)} km`
}

const ZONE_COLORS = ["", "bg-blue-400", "bg-green-400", "bg-yellow-400", "bg-orange-400", "bg-red-500"]
const ZONE_LABELS = ["", "Z1 Recovery", "Z2 Aerobic", "Z3 Tempo", "Z4 Threshold", "Z5 Max"]

const TYPE_COLORS: Record<string, string> = {
    Run: "text-violet-700",
    TrailRun: "text-emerald-700",
    WeightTraining: "text-amber-700",
    Soccer: "text-green-700",
    Hike: "text-teal-700",
    Workout: "text-blue-700",
}

/* ── photo gallery ── */

function PhotoGallery({ photos }: { photos: Photo[] }) {
    const [active, setActive] = useState(0)
    const scrollRef = useRef<HTMLDivElement>(null)

    if (!photos.length) return null

    const mainUrl = photos[active]?.urls?.["600"]

    return (
        <div className="flex flex-col gap-3">
            {/* Main photo */}
            <div className="overflow-hidden rounded-lg aspect-[4/3] sm:aspect-[16/9] bg-primary/5">
                {mainUrl && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                        key={mainUrl}
                        src={mainUrl}
                        alt={`Photo ${active + 1}`}
                        className="w-full h-full object-cover transition-opacity duration-300"
                    />
                )}
            </div>
            {/* Thumbnails */}
            {photos.length > 1 && (
                <div ref={scrollRef} className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {photos.map((p, i) => {
                        const url = p.urls?.["600"]
                        if (!url) return null
                        return (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                                key={p.unique_id}
                                src={url}
                                alt={`Thumb ${i + 1}`}
                                onClick={() => setActive(i)}
                                className={`w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md shrink-0 cursor-pointer border-2 transition-all ${
                                    active === i ? "border-violet-500" : "border-transparent opacity-60 hover:opacity-100"
                                }`}
                            />
                        )
                    })}
                </div>
            )}
        </div>
    )
}

/* ── splits chart ── */

function SplitsChart({ splits }: { splits: SplitMetric[] }) {
    if (!splits?.length) return null

    const maxTime = Math.max(...splits.map((s) => s.moving_time / (s.distance / 1000)))

    return (
        <div className="flex flex-col gap-4">
            <p className="text-xs tracking-[1.5px] text-secondary uppercase font-medium">Per-km Splits</p>
            {/* Header */}
            <div className="grid grid-cols-[2rem_1fr_3rem_3rem_2.5rem] gap-2 text-[10px] text-secondary uppercase tracking-widest pb-1 border-b border-primary/10">
                <span>km</span>
                <span>pace</span>
                <span className="text-right">pace</span>
                <span className="text-right">hr</span>
                <span className="text-right">zone</span>
            </div>
            {splits.map((s) => {
                const secsPerKm = s.moving_time / (s.distance / 1000)
                const barPct = (secsPerKm / maxTime) * 100
                const zone = s.pace_zone || 0
                const barColor = ZONE_COLORS[zone] || "bg-primary/20"
                return (
                    <div key={s.split} className="grid grid-cols-[2rem_1fr_3rem_3rem_2.5rem] gap-2 items-center">
                        <span className="text-xs text-secondary font-mono">{s.split}</span>
                        <div className="h-4 bg-primary/5 rounded-sm overflow-hidden">
                            <div
                                className={`h-full rounded-sm ${barColor} opacity-70`}
                                style={{ width: `${barPct}%` }}
                            />
                        </div>
                        <span className="text-xs text-primary font-mono text-right">{fmtPace(s.average_speed)}</span>
                        <span className="text-xs text-secondary text-right">
                            {s.average_heartrate ? `${Math.round(s.average_heartrate)}` : "—"}
                        </span>
                        <span
                            className={`text-[10px] font-medium text-right ${
                                zone ? `text-${["", "blue", "green", "yellow", "orange", "red"][zone]}-500` : "text-secondary"
                            }`}
                        >
                            {zone ? `Z${zone}` : "—"}
                        </span>
                    </div>
                )
            })}
            {/* Zone legend */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 pt-2 border-t border-primary/10">
                {[1, 2, 3, 4, 5].map((z) => (
                    <div key={z} className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-sm ${ZONE_COLORS[z]} opacity-70`} />
                        <span className="text-[10px] text-secondary">{ZONE_LABELS[z]}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

/* ── main page ── */

export default function ActivityDetailPage() {
    const { id } = useParams<{ id: string }>()
    const [activity, setActivity] = useState<Activity | null>(null)
    const [photos, setPhotos] = useState<Photo[]>([])
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!id) return
        fetch(`/api/strava/activity/${id}`)
            .then((r) => r.json())
            .then((json) => {
                if (json.error) setError(json.error)
                else {
                    setActivity(json.activity)
                    setPhotos(json.photos || [])
                }
            })
            .catch(() => setError("Failed to load activity"))
            .finally(() => setLoading(false))
    }, [id])

    const typeColor = activity ? (TYPE_COLORS[activity.type] || "text-primary") : "text-primary"

    return (
        <main>
            <section>
                <div className="container">
                    <div className="border-x border-primary/10">
                        {/* Back nav */}
                        <div className="max-w-3xl mx-auto px-4 sm:px-7 pt-6 pb-0">
                            <Link
                                href="/training"
                                className="inline-flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors"
                            >
                                ← Training
                            </Link>
                        </div>

                        {loading && (
                            <div className="max-w-3xl mx-auto px-4 sm:px-7 py-20 flex items-center justify-center">
                                <p className="text-secondary text-sm animate-pulse">Loading activity…</p>
                            </div>
                        )}

                        {!loading && error && (
                            <div className="max-w-3xl mx-auto px-4 sm:px-7 py-16">
                                <p className="text-sm text-secondary">{error}</p>
                            </div>
                        )}

                        {!loading && activity && (
                            <div className="max-w-3xl mx-auto px-4 sm:px-7 py-8 flex flex-col gap-10">
                                {/* Title + meta */}
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-start gap-3 justify-between flex-wrap">
                                        <h1 className="text-xl sm:text-2xl md:text-3xl font-normal leading-snug">
                                            {activity.name}
                                        </h1>
                                        <Badge variant="outline" className="py-1 px-3 rounded-lg mt-1 shrink-0">
                                            <p className={`text-xs font-medium ${typeColor}`}>
                                                {activity.sport_type || activity.type}
                                            </p>
                                        </Badge>
                                    </div>
                                    <p className="text-secondary text-sm">{fmtDate(activity.start_date_local)}</p>
                                    {activity.device_name && (
                                        <p className="text-secondary text-xs">{activity.device_name}</p>
                                    )}
                                </div>

                                {/* Photos */}
                                {photos.length > 0 && <PhotoGallery photos={photos} />}

                                {/* Description */}
                                {activity.description && (
                                    <div className="flex flex-col gap-2 p-5 bg-primary/[0.03] rounded-lg border border-primary/10">
                                        <p className="text-xs tracking-[1.5px] text-secondary uppercase font-medium">Note</p>
                                        <p className="text-sm text-primary whitespace-pre-wrap leading-relaxed">
                                            {activity.description}
                                        </p>
                                    </div>
                                )}

                                {/* Key stats grid */}
                                <div className="flex flex-col gap-4">
                                    <p className="text-xs tracking-[1.5px] text-secondary uppercase font-medium">Stats</p>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {activity.distance > 0 && (
                                            <StatBox label="Distance" value={fmtKm(activity.distance)} />
                                        )}
                                        <StatBox label="Time" value={fmtTime(activity.moving_time)} />
                                        {activity.average_speed > 0 && activity.distance > 0 && (
                                            <StatBox label="Avg Pace" value={`${fmtPace(activity.average_speed)} /km`} />
                                        )}
                                        {activity.average_speed > 0 && activity.distance > 0 && (
                                            <StatBox label="Best Pace" value={`${fmtPace(activity.max_speed)} /km`} />
                                        )}
                                        {activity.total_elevation_gain > 0 && (
                                            <StatBox label="Elevation ↑" value={`${Math.round(activity.total_elevation_gain)} m`} />
                                        )}
                                        {activity.average_heartrate && (
                                            <StatBox label="Avg HR" value={`${Math.round(activity.average_heartrate)} bpm`} />
                                        )}
                                        {activity.max_heartrate && (
                                            <StatBox label="Max HR" value={`${Math.round(activity.max_heartrate)} bpm`} />
                                        )}
                                        {activity.average_cadence && (
                                            <StatBox label="Cadence" value={`${Math.round(activity.average_cadence * 2)} spm`} />
                                        )}
                                        {activity.kilojoules && (
                                            <StatBox label="Energy" value={`${Math.round(activity.kilojoules)} kJ`} />
                                        )}
                                        {activity.suffer_score && (
                                            <StatBox label="Suffer Score" value={activity.suffer_score.toString()} />
                                        )}
                                        {activity.weighted_average_watts && (
                                            <StatBox label="Power" value={`${activity.weighted_average_watts} W`} />
                                        )}
                                    </div>
                                </div>

                                {/* Per-km splits */}
                                {activity.splits_metric && activity.splits_metric.length > 0 && (
                                    <SplitsChart splits={activity.splits_metric} />
                                )}

                                {/* Laps (manual) - only if more than 1 lap */}
                                {activity.laps && activity.laps.length > 1 && (
                                    <div className="flex flex-col gap-4">
                                        <p className="text-xs tracking-[1.5px] text-secondary uppercase font-medium">Laps</p>
                                        <div className="flex flex-col divide-y divide-primary/10">
                                            <div className="grid grid-cols-[2rem_1fr_3rem_3rem_3rem] gap-2 py-2 text-[10px] text-secondary uppercase tracking-widest">
                                                <span>#</span>
                                                <span>distance · time</span>
                                                <span className="text-right">pace</span>
                                                <span className="text-right">hr</span>
                                                <span className="text-right">cad</span>
                                            </div>
                                            {activity.laps.map((lap) => (
                                                <div key={lap.lap_index} className="grid grid-cols-[2rem_1fr_3rem_3rem_3rem] gap-2 py-3 items-center">
                                                    <span className="text-xs text-secondary font-mono">{lap.lap_index}</span>
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-sm text-primary font-medium">{fmtKm(lap.distance)}</span>
                                                        <span className="text-xs text-secondary">{fmtTime(lap.moving_time)}</span>
                                                    </div>
                                                    <span className="text-xs text-primary font-mono text-right">{fmtPace(lap.average_speed)}</span>
                                                    <span className="text-xs text-secondary text-right">
                                                        {lap.average_heartrate ? Math.round(lap.average_heartrate) : "—"}
                                                    </span>
                                                    <span className="text-xs text-secondary text-right">
                                                        {lap.average_cadence ? Math.round(lap.average_cadence * 2) : "—"}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Strava link */}
                                <div className="pt-4 border-t border-primary/10">
                                    <a
                                        href={`https://www.strava.com/activities/${activity.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-secondary hover:text-primary transition-colors"
                                    >
                                        View on Strava →
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
            <Divider />
        </main>
    )
}

function StatBox({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col gap-1 p-4 border border-primary/10 rounded-lg bg-primary/[0.02]">
            <p className="text-[10px] text-secondary uppercase tracking-[1.5px] font-medium">{label}</p>
            <p className="text-base sm:text-lg font-normal text-primary leading-tight">{value}</p>
        </div>
    )
}
