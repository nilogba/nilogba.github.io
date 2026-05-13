import { NextResponse } from "next/server"

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
        cache: "no-store",
    })
    if (!res.ok) throw new Error("Failed to refresh token")
    const data = await res.json()
    return data.access_token
}

export async function GET() {
    if (!process.env.STRAVA_CLIENT_ID || !process.env.STRAVA_REFRESH_TOKEN) {
        return NextResponse.json({ error: "Strava not configured" }, { status: 503 })
    }

    try {
        const token = await getAccessToken()
        const athleteId = process.env.STRAVA_ATHLETE_ID || "709593"

        const [activitiesRes, statsRes] = await Promise.all([
            fetch("https://www.strava.com/api/v3/athlete/activities?per_page=200&page=1", {
                headers: { Authorization: `Bearer ${token}` },
                cache: "no-store",
            }),
            fetch(`https://www.strava.com/api/v3/athletes/${athleteId}/stats`, {
                headers: { Authorization: `Bearer ${token}` },
                cache: "no-store",
            }),
        ])

        const [activities, stats] = await Promise.all([
            activitiesRes.json(),
            statsRes.json(),
        ])

        return NextResponse.json({ activities, stats })
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error"
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
