import { NextRequest, NextResponse } from "next/server"
import { createHmac } from "crypto"

function verifyToken(token: string): boolean {
    const passkey = process.env.TRAVEL_PASSKEY
    if (!passkey) return false
    const expected = createHmac("sha256", passkey).update("travel-access").digest("hex")
    return token === expected
}

interface CloudinaryFolder {
    name: string
    path: string
}

interface CloudinaryFoldersResponse {
    folders: CloudinaryFolder[]
}

export async function GET(req: NextRequest) {
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

    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/folders/travel`,
        {
            headers: {
                Authorization: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")}`,
            },
            next: { revalidate: 3600 },
        }
    )

    if (!res.ok) {
        return NextResponse.json({ error: "Failed to list folders" }, { status: 502 })
    }

    const data: CloudinaryFoldersResponse = await res.json()
    const folders = (data.folders ?? []).map((f) => ({
        id: f.name,
        name: f.name.charAt(0).toUpperCase() + f.name.slice(1),
        path: f.path,
    }))

    return NextResponse.json({ folders })
}
