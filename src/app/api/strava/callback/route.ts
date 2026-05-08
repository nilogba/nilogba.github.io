import { NextRequest, NextResponse } from "next/server"

// One-time OAuth callback. Visit this URL to trigger it:
// https://www.strava.com/oauth/authorize?client_id=YOUR_ID&redirect_uri=http://localhost:3000/api/strava/callback&response_type=code&scope=read,activity:read
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get("code")
    const error = searchParams.get("error")

    if (error) {
        return NextResponse.json({ error: "Strava auth denied", detail: error }, { status: 400 })
    }

    if (!code) {
        return NextResponse.json({ error: "No code in callback" }, { status: 400 })
    }

    const clientId = process.env.STRAVA_CLIENT_ID
    const clientSecret = process.env.STRAVA_CLIENT_SECRET

    if (!clientId || !clientSecret) {
        return NextResponse.json({ error: "STRAVA_CLIENT_ID and STRAVA_CLIENT_SECRET must be set in .env.local" }, { status: 500 })
    }

    const tokenRes = await fetch("https://www.strava.com/oauth/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            code,
            grant_type: "authorization_code",
        }),
    })

    const tokens = await tokenRes.json()

    if (!tokenRes.ok) {
        return NextResponse.json({ error: "Token exchange failed", detail: tokens }, { status: 500 })
    }

    // Copy the refresh_token and athlete.id below into .env.local and Vercel env vars
    return NextResponse.json({
        message: "OAuth success! Copy these values into .env.local and Vercel env vars:",
        STRAVA_REFRESH_TOKEN: tokens.refresh_token,
        STRAVA_ATHLETE_ID: tokens.athlete?.id,
        athlete_name: `${tokens.athlete?.firstname} ${tokens.athlete?.lastname}`,
        expires_at: new Date(tokens.expires_at * 1000).toISOString(),
    })
}
