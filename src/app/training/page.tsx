"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Divider from "../components/divider"
import ActivityCard, { StravaActivity } from "../components/training/activity-card"
import StatsBar from "../components/training/stats-bar"
import MonthlyLoad from "../components/training/monthly-load"
const HIKE_TYPES = ["Hike", "VirtualHike", "Walk"]

interface StravaStats {
    all_run_totals: { count: number; distance: number; elevation_gain: number }
    ytd_run_totals: { count: number; distance: number; elevation_gain: number }
    biggest_ride_distance: number
}

interface TrainingData {
    activities: StravaActivity[]
    stats: StravaStats
}

export default function TrainingPage() {
    const [data, setData] = useState<TrainingData | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch("/api/strava/activities")
            .then((r) => r.json())
            .then((json) => {
                if (json.error) setError(json.error)
                else setData(json)
            })
            .catch(() => setError("Failed to load Strava data"))
            .finally(() => setLoading(false))
    }, [])

    const mainActivities = data?.activities.filter((a) => !HIKE_TYPES.includes(a.type)).slice(0, 20) ?? []
    const hikes = data?.activities.filter((a) => HIKE_TYPES.includes(a.type)) ?? []

    return (
        <main>
            <section>
                <div className="container">
                    <div className="border-x border-primary/10">

                        {/* Header */}
                        <div className="flex flex-col max-w-3xl mx-auto py-10 px-4 sm:px-7">
                            <Link href="/" className="inline-flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors mb-4">
                                ← Home
                            </Link>
                            <div className="flex flex-col gap-1">
                                <p className="text-sm tracking-[2px] text-primary uppercase font-medium">Training</p>
                                <p className="text-secondary text-sm">Running log · powered by Strava</p>
                            </div>
                        </div>

                        {/* Loading */}
                        {loading && (
                            <div className="border-t border-primary/10">
                                <div className="max-w-3xl mx-auto px-4 sm:px-7 py-24 flex items-center justify-center">
                                    <p className="text-secondary text-sm animate-pulse">Loading Strava data…</p>
                                </div>
                            </div>
                        )}

                        {/* Error */}
                        {!loading && error && (
                            <div className="border-t border-primary/10">
                                <div className="max-w-3xl mx-auto px-4 sm:px-7 py-16 flex flex-col gap-3">
                                    <p className="text-sm font-medium text-primary">Strava not connected</p>
                                    <p className="text-sm text-secondary">{error}</p>
                                </div>
                            </div>
                        )}

                        {/* Data */}
                        {!loading && data && (
                            <>
                                {/* Stats bar */}
                                <StatsBar stats={data.stats} />

                                {/* Monthly load chart */}
                                <div className="border-t border-primary/10">
                                    <div className="max-w-3xl mx-auto px-4 sm:px-7 py-8">
                                        <MonthlyLoad activities={data.activities} />
                                    </div>
                                </div>

                                {/* Recent activities grid */}
                                <div className="border-t border-primary/10">
                                    <div className="max-w-3xl mx-auto px-4 sm:px-7 pt-6 pb-2">
                                        <p className="text-sm tracking-[2px] text-primary uppercase font-medium">Recent Activities</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 border-t border-primary/10">
                                    {mainActivities.map((activity, index) => (
                                        <ActivityCard
                                            key={activity.id}
                                            activity={activity}
                                            isRightCol={index % 2 === 1}
                                        />
                                    ))}
                                </div>

                            </>
                        )}
                    </div>
                </div>
            </section>
            <Divider />
        </main>
    )
}
