import { NextResponse } from "next/server"

const HIKE_TYPES = ["Hike", "VirtualHike", "Walk"]

async function getAccessToken(): Promise<string> {
    const res = await fetch("https://www.strava.com/oauth/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            client_id: process.env.STRAVA_CLIENT_ID,
            client_secret: process.env.STRAVA_CLIENT_SECRET,
            refresh_token: process.env.STRAVA_REFRESH_TOKEN,
            grant_type: "refresh_token",
        }),
    })
    if (!res.ok) throw new Error("Failed to refresh Strava access token")
    const data = await res.json()
    return data.access_token
}

async function fetchPhotoUrl(id: number, token: string): Promise<string | null> {
    try {
        const res = await fetch(
            `https://www.strava.com/api/v3/activities/${id}/photos?photo_sources=true&size=600`,
            { headers: { Authorization: `Bearer ${token}` }, next: { revalidate: 3600 } }
        )
        if (!res.ok) return null
        const photos = await res.json()
        return (Array.isArray(photos) && photos[0]?.urls?.["600"]) || null
    } catch {
        return null
    }
}

export async function GET() {
    if (!process.env.STRAVA_CLIENT_ID || !process.env.STRAVA_REFRESH_TOKEN) {
        return NextResponse.json(
            { error: "Strava not configured. Set STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, STRAVA_REFRESH_TOKEN in env vars." },
            { status: 503 }
        )
    }

    try {
        const token = await getAccessToken()
        const athleteId = process.env.STRAVA_ATHLETE_ID || "709593"

        // Single fetch of 200 activities covers ~12 months of history
        const [activitiesRes, statsRes] = await Promise.all([
            fetch("https://www.strava.com/api/v3/athlete/activities?per_page=200&page=1", {
                headers: { Authorization: `Bearer ${token}` },
                next: { revalidate: 3600 },
            }),
            fetch(`https://www.strava.com/api/v3/athletes/${athleteId}/stats`, {
                headers: { Authorization: `Bearer ${token}` },
                next: { revalidate: 3600 },
            }),
        ])

        const [activities, stats] = await Promise.all([
            activitiesRes.json(),
            statsRes.json(),
        ])

        const allActivities: any[] = activities || []

        // Determine which activities need photo URLs fetched:
        // - First 20 activities shown in the main grid (if they have photos)
        // - All hike activities (if they have photos)
        const mainGrid = allActivities.slice(0, 20).filter((a) => a.total_photo_count > 0)
        const hikes = allActivities.filter((a) => HIKE_TYPES.includes(a.type) && a.total_photo_count > 0)

        const needPhotoIds = new Set([...mainGrid.map((a) => a.id), ...hikes.map((a) => a.id)])

        // Fetch all photo URLs in parallel (each is cached 1h server-side)
        const photoEntries = await Promise.all(
            [...needPhotoIds].map(async (id) => {
                const url = await fetchPhotoUrl(id, token)
                return [id, url] as [number, string | null]
            })
        )
        const photoMap: Record<number, string> = Object.fromEntries(
            photoEntries.filter((entry): entry is [number, string] => entry[1] !== null)
        )

        // Embed photo URL into each activity
        const activitiesWithPhotos = allActivities.map((a) => ({
            ...a,
            primaryPhotoUrl: photoMap[a.id] || null,
        }))

        return NextResponse.json({ activities: activitiesWithPhotos, stats })
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error"
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
