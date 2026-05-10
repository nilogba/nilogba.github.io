import { NextRequest, NextResponse } from "next/server"
import { createHmac } from "crypto"

function verifyToken(token: string): boolean {
    const passkey = process.env.TRAVEL_PASSKEY
    if (!passkey) return false
    const expected = createHmac("sha256", passkey).update("travel-access").digest("hex")
    return token === expected
}

interface CloudinaryResource {
    public_id: string
    secure_url: string
    width: number
    height: number
}

interface CloudinaryResponse {
    resources: CloudinaryResource[]
}

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ place: string }> }
) {
    const { place } = await params
    const token = req.headers.get("authorization")?.replace("Bearer ", "") ?? ""

    if (!verifyToken(token)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!cloudName || !apiKey || !apiSecret) {
        return NextResponse.json({ error: "Cloudinary not configured" }, { status: 500 })
    }

    const prefix = `travel/${place}`
    const limit = req.nextUrl.searchParams.get("limit") ?? "50"
    const maxResults = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 500)
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload?prefix=${prefix}&max_results=${maxResults}`

    const response = await fetch(url, {
        headers: {
            Authorization: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")}`,
        },
        next: { revalidate: 86400 },
    })

    if (!response.ok) {
        return NextResponse.json({ error: "Failed to fetch photos" }, { status: 502 })
    }

    const data: CloudinaryResponse = await response.json()
    const photos = data.resources.map((r) => ({
        url: r.secure_url,
        width: r.width,
        height: r.height,
        publicId: r.public_id,
    }))

    return NextResponse.json({ photos })
}
