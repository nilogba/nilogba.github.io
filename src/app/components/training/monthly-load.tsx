"use client"

interface Activity {
    start_date_local: string
    distance: number
    type: string
}

interface Props {
    activities: Activity[]
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const RUN_TYPES = ["Run", "TrailRun", "VirtualRun"]

export default function MonthlyLoad({ activities }: Props) {
    const now = new Date()

    // Last 6 months
    const months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
        return { year: d.getFullYear(), month: d.getMonth(), label: MONTHS[d.getMonth()] }
    })

    const data = months.map(({ year, month, label }) => {
        // start_date_local is local time displayed as UTC, e.g. "2026-04-11T06:30:00Z"
        // Parse just the date string prefix to avoid timezone confusion
        const runs = activities.filter((a) => {
            const prefix = a.start_date_local?.slice(0, 7) // "YYYY-MM"
            if (!prefix) return false
            const [y, m] = prefix.split("-").map(Number)
            return y === year && m - 1 === month && RUN_TYPES.includes(a.type)
        })
        const km = runs.reduce((sum, a) => sum + a.distance / 1000, 0)
        return { label, km, count: runs.length, year, month }
    })

    const maxKm = Math.max(...data.map((d) => d.km), 1)
    const isCurrentMonth = (d: typeof data[0]) =>
        d.year === now.getFullYear() && d.month === now.getMonth()

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-baseline justify-between">
                <p className="text-xs tracking-[1.5px] text-secondary uppercase font-medium">Monthly Running Volume</p>
                <p className="text-xs text-secondary">{data.reduce((s, d) => s + d.km, 0).toFixed(0)} km shown</p>
            </div>
            <div className="flex items-end gap-2" style={{ height: "100px" }}>
                {data.map((d) => {
                    const pct = (d.km / maxKm) * 100
                    const isCurrent = isCurrentMonth(d)
                    return (
                        <div key={`${d.year}-${d.month}`} className="flex flex-col items-center gap-1.5 flex-1">
                            <div className="relative w-full flex flex-col items-center justify-end" style={{ height: "80px" }}>
                                {d.km > 0 && (
                                    <p className={`text-[10px] mb-1 font-medium tabular-nums ${isCurrent ? "text-violet-600" : "text-secondary"}`}>
                                        {d.km.toFixed(0)}
                                    </p>
                                )}
                                <div
                                    className={`w-full rounded-sm transition-all ${
                                        isCurrent ? "bg-violet-500" : "bg-primary/15 hover:bg-primary/25"
                                    }`}
                                    style={{ height: `${Math.max(pct * 0.6, d.km > 0 ? 3 : 1)}%`, minHeight: d.km > 0 ? "4px" : "2px" }}
                                    title={`${d.km.toFixed(1)} km · ${d.count} runs`}
                                />
                            </div>
                            <p className={`text-[10px] ${isCurrent ? "text-violet-500 font-semibold" : "text-secondary"}`}>
                                {d.label}
                            </p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
