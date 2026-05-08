import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export interface StravaActivity {
    id: number
    name: string
    distance: number
    moving_time: number
    total_elevation_gain: number
    start_date_local: string
    start_date: string
    type: string
    sport_type: string
    average_speed: number
    average_heartrate?: number
    max_heartrate?: number
    average_cadence?: number
    suffer_score?: number
    total_photo_count: number
    primaryPhotoUrl?: string | null
    description?: string
}

function fmtDistance(m: number) { return `${(m / 1000).toFixed(1)} km` }
function fmtPace(mps: number) {
    if (mps <= 0) return "—"
    const s = 1000 / mps
    return `${Math.floor(s / 60)}:${Math.round(s % 60).toString().padStart(2, "0")} /km`
}
function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
}

// Per-type gradients: 4 variants, selected by id % 4 for variety
const GRADIENTS: Record<string, string[]> = {
    Run: [
        "linear-gradient(135deg,#ede9fe 0%,#c4b5fd 100%)",
        "linear-gradient(160deg,#e0e7ff 0%,#a5b4fc 100%)",
        "linear-gradient(125deg,#f5f3ff 0%,#ddd6fe 100%)",
        "linear-gradient(145deg,#eef2ff 0%,#c7d2fe 100%)",
    ],
    TrailRun: [
        "linear-gradient(135deg,#f0fdf4 0%,#86efac 100%)",
        "linear-gradient(160deg,#dcfce7 0%,#4ade80 100%)",
        "linear-gradient(125deg,#ecfdf5 0%,#a7f3d0 100%)",
        "linear-gradient(145deg,#f0fdf4 0%,#6ee7b7 100%)",
    ],
    WeightTraining: [
        "linear-gradient(135deg,#fff7ed 0%,#fdba74 100%)",
        "linear-gradient(160deg,#fef9c3 0%,#fde047 100%)",
        "linear-gradient(125deg,#ffedd5 0%,#fb923c 100%)",
        "linear-gradient(145deg,#fef3c7 0%,#fcd34d 100%)",
    ],
    Soccer: [
        "linear-gradient(135deg,#f0fdf4 0%,#86efac 100%)",
        "linear-gradient(160deg,#dcfce7 0%,#4ade80 100%)",
        "linear-gradient(125deg,#ecfdf5 0%,#a7f3d0 100%)",
        "linear-gradient(145deg,#f0fdf4 0%,#6ee7b7 100%)",
    ],
    Hike: [
        "linear-gradient(135deg,#f0fdfa 0%,#5eead4 100%)",
        "linear-gradient(160deg,#ccfbf1 0%,#2dd4bf 100%)",
        "linear-gradient(125deg,#ecfdf5 0%,#99f6e4 100%)",
        "linear-gradient(145deg,#f0fdfa 0%,#34d399 100%)",
    ],
    Workout: [
        "linear-gradient(135deg,#eff6ff 0%,#93c5fd 100%)",
        "linear-gradient(160deg,#dbeafe 0%,#60a5fa 100%)",
        "linear-gradient(125deg,#f0f9ff 0%,#7dd3fc 100%)",
        "linear-gradient(145deg,#eff6ff 0%,#a5b4fc 100%)",
    ],
}

const TYPE_ICONS: Record<string, string> = {
    Run: "🏃",
    TrailRun: "⛰",
    WeightTraining: "🏋",
    Soccer: "⚽",
    Hike: "🥾",
    Workout: "💪",
}

const TYPE_COLORS: Record<string, string> = {
    Run: "text-violet-700",
    TrailRun: "text-emerald-700",
    WeightTraining: "text-amber-700",
    Soccer: "text-green-700",
    Hike: "text-teal-700",
    Workout: "text-blue-700",
}

interface Props {
    activity: StravaActivity
    isRightCol?: boolean
}

export default function ActivityCard({ activity, isRightCol }: Props) {
    const photoUrl = activity.primaryPhotoUrl
    const variant = activity.id % 4
    const gradients = GRADIENTS[activity.type] || GRADIENTS.Run
    const bg = gradients[variant]
    const icon = TYPE_ICONS[activity.type] || "●"
    const typeColor = TYPE_COLORS[activity.type] || "text-primary"

    return (
        <Link
            href={`/training/${activity.id}`}
            className={`group flex flex-col gap-3.5 sm:gap-4 p-3.5 sm:p-5 hover:bg-primary/[0.015] transition-colors ${
                isRightCol ? "md:border-l md:border-primary/10" : ""
            }`}
        >
            {/* Image */}
            <div className="overflow-hidden rounded-lg aspect-[16/9] relative">
                {photoUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                        src={photoUrl}
                        alt={activity.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ease-in-out"
                    />
                ) : (
                    <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ background: bg }}
                    >
                        <span className="text-5xl opacity-25 select-none">{icon}</span>
                    </div>
                )}

                {/* Stats overlay on hover */}
                <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="flex gap-5">
                        {activity.distance > 0 && (
                            <div className="flex flex-col gap-0.5">
                                <span className="text-white/60 text-[9px] uppercase tracking-widest">Dist</span>
                                <span className="text-white text-sm font-medium">{fmtDistance(activity.distance)}</span>
                            </div>
                        )}
                        {activity.average_speed > 0 && activity.distance > 0 && (
                            <div className="flex flex-col gap-0.5">
                                <span className="text-white/60 text-[9px] uppercase tracking-widest">Pace</span>
                                <span className="text-white text-sm font-medium">{fmtPace(activity.average_speed)}</span>
                            </div>
                        )}
                        {activity.average_heartrate && (
                            <div className="flex flex-col gap-0.5">
                                <span className="text-white/60 text-[9px] uppercase tracking-widest">HR</span>
                                <span className="text-white text-sm font-medium">{Math.round(activity.average_heartrate)}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Text */}
            <div className="flex flex-col gap-1.5 px-0.5">
                <div className="flex items-start justify-between gap-2">
                    <h4 className="text-base leading-snug group-hover:text-violet-700 transition-colors">
                        {activity.name}
                    </h4>
                    <Badge variant="outline" className="shrink-0 py-0.5 px-2.5 rounded-lg mt-0.5">
                        <p className={`text-xs font-medium ${typeColor}`}>{activity.sport_type || activity.type}</p>
                    </Badge>
                </div>
                <p className="text-sm text-secondary">{fmtDate(activity.start_date_local)}</p>
                <div className="flex flex-wrap gap-1.5">
                    {activity.distance > 0 && (
                        <span className="text-xs bg-primary/5 text-primary px-2 py-0.5 rounded-full tabular-nums">
                            {fmtDistance(activity.distance)}
                        </span>
                    )}
                    {activity.average_speed > 0 && activity.distance > 0 && (
                        <span className="text-xs bg-primary/5 text-primary px-2 py-0.5 rounded-full tabular-nums">
                            {fmtPace(activity.average_speed)}
                        </span>
                    )}
                    {activity.average_heartrate && (
                        <span className="text-xs bg-primary/5 text-primary px-2 py-0.5 rounded-full tabular-nums">
                            ♥ {Math.round(activity.average_heartrate)}
                        </span>
                    )}
                    {activity.suffer_score ? (
                        <span className="text-xs bg-primary/5 text-secondary px-2 py-0.5 rounded-full tabular-nums">
                            RPE {activity.suffer_score}
                        </span>
                    ) : null}
                </div>
            </div>
        </Link>
    )
}
