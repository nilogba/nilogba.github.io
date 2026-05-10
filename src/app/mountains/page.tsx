"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Divider from "../components/divider"
import HikeGallery from "../components/training/hike-gallery"
import TrekElevationChart from "../components/training/trek-elevation-chart"
import { StravaActivity } from "../components/training/activity-card"

const HIKE_TYPES = ["Hike", "VirtualHike", "Walk"]

export default function MountainsPage() {
    const [hikes, setHikes] = useState<StravaActivity[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch("/api/strava/activities")
            .then((r) => r.json())
            .then((json) => {
                const h = (json.activities || []).filter((a: StravaActivity) =>
                    HIKE_TYPES.includes(a.type)
                )
                setHikes(h)
            })
            .finally(() => setLoading(false))
    }, [])

    return (
        <main>
            <section>
                <div className="container">
                    <div className="border-x border-primary/10">
                        {/* Header */}
                        <div className="max-w-3xl mx-auto px-4 sm:px-7 pt-10 pb-6">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors"
                            >
                                ← Home
                            </Link>
                            <div className="mt-5 flex flex-col gap-2">
                                <p className="text-sm tracking-[2px] text-primary uppercase font-medium">Mountains</p>
                                <h1 className="text-2xl sm:text-3xl font-normal">Hikes & Treks</h1>
                                <p className="text-secondary text-sm">
                                    {hikes.length} adventures — from Hampta Pass to Ijen Volcano
                                </p>
                            </div>
                        </div>

                        {/* Elevation chart — static data, always visible */}
                        <TrekElevationChart />

                        {loading && (
                            <div className="border-t border-primary/10 py-24 flex justify-center">
                                <p className="text-secondary text-sm animate-pulse">Loading adventures…</p>
                            </div>
                        )}

                        {!loading && hikes.length > 0 && (
                            <HikeGallery hikes={hikes} />
                        )}

                        {!loading && hikes.length === 0 && (
                            <div className="border-t border-primary/10 py-24 flex justify-center">
                                <p className="text-secondary text-sm">No hikes found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
            <Divider />
        </main>
    )
}
