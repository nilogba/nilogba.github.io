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
    resource_type: "image" | "video"
}

interface CloudinarySearchResponse {
    resources: CloudinaryResource[]
    total_count: number
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

    const limit = req.nextUrl.searchParams.get("limit") ?? "50"
    const typeFilter = req.nextUrl.searchParams.get("type") // "image" | "video" | null
    const maxResults = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 500)

    // Cloudinary new folder system uses asset_folder metadata, not path prefix
    let expression = `asset_folder="travel/${place}"`
    if (typeFilter === "image") expression += " AND resource_type:image"
    else if (typeFilter === "video") expression += " AND resource_type:video"

    const searchUrl = new URL(`https://api.cloudinary.com/v1_1/${cloudName}/resources/search`)
    searchUrl.searchParams.set("expression", expression)
    searchUrl.searchParams.set("max_results", String(maxResults))

    const res = await fetch(searchUrl.toString(), {
        headers: {
            Authorization: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")}`,
        },
        cache: "no-store",
    })

    if (!res.ok) {
        return NextResponse.json({ error: "Failed to fetch photos" }, { status: 502 })
    }

    const data: CloudinarySearchResponse = await res.json()
    const items = (data.resources ?? []).map((r) => ({
        url: r.secure_url,
        width: r.width,
        height: r.height,
        publicId: r.public_id,
        resourceType: r.resource_type,
    }))

    return NextResponse.json({ photos: items, total: data.total_count })
}
