import { NextRequest, NextResponse } from "next/server"
import { createHmac } from "crypto"

export async function POST(req: NextRequest) {
    const { passkey } = await req.json()
    const expected = process.env.TRAVEL_PASSKEY

    if (!expected || passkey !== expected) {
        return NextResponse.json({ ok: false }, { status: 401 })
    }

    const token = createHmac("sha256", expected)
        .update("travel-access")
        .digest("hex")

    return NextResponse.json({ ok: true, token })
}
