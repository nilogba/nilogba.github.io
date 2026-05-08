interface StravaStats {
    all_run_totals: { count: number; distance: number; elevation_gain: number }
    ytd_run_totals: { count: number; distance: number; elevation_gain: number }
    biggest_ride_distance: number
}

interface Props {
    stats: StravaStats
}

export default function StatsBar({ stats }: Props) {
    const ytdKm = (stats.ytd_run_totals.distance / 1000).toFixed(0)
    const totalKm = (stats.all_run_totals.distance / 1000).toFixed(0)
    const elevKm = (stats.all_run_totals.elevation_gain / 1000).toFixed(1)

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-primary/10">
            {/* Total Distance — violet */}
            <div className="relative flex flex-col gap-3 px-5 py-6 border-r border-b border-primary/10 overflow-hidden bg-violet-50/60">
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-violet-500" />
                <div className="flex items-center gap-2">
                    <span className="text-xs text-violet-500 font-medium uppercase tracking-widest">Distance</span>
                </div>
                <div className="flex flex-col gap-0.5">
                    <p className="text-2xl sm:text-3xl font-light text-violet-700 tabular-nums">{totalKm}</p>
                    <p className="text-base text-violet-400 font-light">km</p>
                </div>
                <p className="text-xs text-secondary">all time · running</p>
            </div>

            {/* Total Runs — Strava orange */}
            <div className="relative flex flex-col gap-3 px-5 py-6 border-b border-primary/10 overflow-hidden bg-orange-50/60 sm:border-r">
                <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: "#FC4C02" }} />
                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium uppercase tracking-widest" style={{ color: "#FC4C02" }}>Runs</span>
                </div>
                <div className="flex flex-col gap-0.5">
                    <p className="text-2xl sm:text-3xl font-light tabular-nums" style={{ color: "#C83C00" }}>{stats.all_run_totals.count}</p>
                    <p className="text-base font-light" style={{ color: "#FC4C02", opacity: 0.5 }}>activities</p>
                </div>
                <p className="text-xs text-secondary">all time · running</p>
            </div>

            {/* Elevation — teal */}
            <div className="relative flex flex-col gap-3 px-5 py-6 border-r border-b border-primary/10 overflow-hidden bg-teal-50/60">
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-teal-500" />
                <div className="flex items-center gap-2">
                    <span className="text-xs text-teal-600 font-medium uppercase tracking-widest">Elevation</span>
                </div>
                <div className="flex flex-col gap-0.5">
                    <p className="text-2xl sm:text-3xl font-light text-teal-700 tabular-nums">{elevKm}</p>
                    <p className="text-base text-teal-400 font-light">km ↑</p>
                </div>
                <p className="text-xs text-secondary">all time · running</p>
            </div>

            {/* This Year — amber */}
            <div className="relative flex flex-col gap-3 px-5 py-6 border-b border-primary/10 overflow-hidden bg-amber-50/60">
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-amber-400" />
                <div className="flex items-center gap-2">
                    <span className="text-xs text-amber-600 font-medium uppercase tracking-widest">This Year</span>
                </div>
                <div className="flex flex-col gap-0.5">
                    <p className="text-2xl sm:text-3xl font-light text-amber-700 tabular-nums">{ytdKm}</p>
                    <p className="text-base text-amber-400 font-light">km</p>
                </div>
                <p className="text-xs text-secondary">{stats.ytd_run_totals.count} runs · {new Date().getFullYear()}</p>
            </div>
        </div>
    )
}
