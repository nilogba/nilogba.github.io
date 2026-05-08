import { NextRequest, NextResponse } from "next/server"

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

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    if (!process.env.STRAVA_CLIENT_ID || !process.env.STRAVA_REFRESH_TOKEN) {
        return NextResponse.json({ error: "Strava not configured" }, { status: 503 })
    }

    try {
        const token = await getAccessToken()

        const [activityRes, photosRes] = await Promise.all([
            fetch(`https://www.strava.com/api/v3/activities/${id}?include_all_efforts=true`, {
                headers: { Authorization: `Bearer ${token}` },
                next: { revalidate: 3600 },
            }),
            fetch(`https://www.strava.com/api/v3/activities/${id}/photos?photo_sources=true&size=600`, {
                headers: { Authorization: `Bearer ${token}` },
                next: { revalidate: 3600 },
            }),
        ])

        if (!activityRes.ok) {
            return NextResponse.json({ error: "Activity not found" }, { status: 404 })
        }

        const [activity, photos] = await Promise.all([
            activityRes.json(),
            photosRes.ok ? photosRes.json() : Promise.resolve([]),
        ])

        return NextResponse.json({ activity, photos })
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error"
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
