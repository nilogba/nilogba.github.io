"use client"

import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { TRAVEL_PLACES } from "@/app/data/travel-places"

const GlobeComponent = dynamic(() => import("@/app/components/travel/globe"), { ssr: false })

const TOKEN_KEY = "travel_token"

export default function TravelPage() {
    const [phase, setPhase] = useState<"loading" | "gate" | "globe">("loading")
    const [passkey, setPasskey] = useState("")
    const [error, setError] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [thumbnails, setThumbnails] = useState<Record<string, string>>({})
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const token = sessionStorage.getItem(TOKEN_KEY)
        setPhase(token ? "globe" : "gate")
    }, [])

    useEffect(() => {
        if (phase === "gate") inputRef.current?.focus()
    }, [phase])

    // Fetch first-photo thumbnails for each place once the globe is unlocked
    useEffect(() => {
        if (phase !== "globe") return
        const token = sessionStorage.getItem(TOKEN_KEY)
        if (!token) return

        TRAVEL_PLACES.forEach((place) => {
            fetch(`/api/travel/photos/${place.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((r) => r.json())
                .then((data) => {
                    const firstUrl: string | undefined = data.photos?.[0]?.url
                    if (!firstUrl) return
                    // Inject Cloudinary thumbnail transform
                    const thumbUrl = firstUrl.replace("/upload/", "/upload/w_160,h_120,c_fill,q_70/")
                    setThumbnails((prev) => ({ ...prev, [place.id]: thumbUrl }))
                })
                .catch(() => {})
        })
    }, [phase])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setSubmitting(true)
        setError("")

        try {
            const res = await fetch("/api/travel/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ passkey }),
            })
            const data = await res.json()

            if (data.ok) {
                sessionStorage.setItem(TOKEN_KEY, data.token)
                setPhase("globe")
            } else {
                setError("Not quite. Try again.")
                setPasskey("")
                inputRef.current?.focus()
            }
        } catch {
            setError("Something went wrong. Try again.")
        } finally {
            setSubmitting(false)
        }
    }

    if (phase === "loading") {
        return <div className="min-h-screen bg-[#0a0f1e]" />
    }

    if (phase === "gate") {
        return (
            <div className="min-h-screen bg-[#0a0f1e] flex flex-col items-center justify-center px-4">
                <div className="flex flex-col items-center gap-8 w-full max-w-xs">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-white/30">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.2" />
                        <ellipse cx="12" cy="12" rx="4" ry="10" stroke="currentColor" strokeWidth="1.2" />
                        <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1.2" />
                        <line x1="4.5" y1="7" x2="19.5" y2="7" stroke="currentColor" strokeWidth="1.2" />
                        <line x1="4.5" y1="17" x2="19.5" y2="17" stroke="currentColor" strokeWidth="1.2" />
                    </svg>

                    <div className="flex flex-col items-center gap-2 text-center">
                        <p className="text-white/80 font-medium">you know the word</p>
                        <p className="text-white/30 text-sm">type the passkey to enter</p>
                    </div>

                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
                        <input
                            ref={inputRef}
                            type="text"
                            value={passkey}
                            onChange={(e) => setPasskey(e.target.value)}
                            placeholder="passkey"
                            autoComplete="off"
                            spellCheck={false}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-white/30 text-center tracking-widest"
                        />
                        <button
                            type="submit"
                            disabled={submitting || !passkey}
                            className="w-full bg-white/10 hover:bg-white/15 disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-lg py-3 text-white text-sm font-medium"
                        >
                            {submitting ? "…" : "Enter"}
                        </button>
                        {error && <p className="text-center text-red-400/80 text-xs">{error}</p>}
                    </form>

                    <Link href="/" className="text-white/20 hover:text-white/40 text-xs transition-colors">
                        ← Back home
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div style={{ position: "fixed", inset: 0, background: "#0a0f1e" }}>
            <GlobeComponent places={TRAVEL_PLACES} thumbnails={thumbnails} />

            <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-4 pointer-events-none">
                <Link href="/" className="text-white/40 hover:text-white/70 text-sm transition-colors pointer-events-auto">
                    ← Home
                </Link>
                <div className="flex flex-col items-end gap-0.5">
                    <p className="text-white/50 text-xs tracking-[1.5px] uppercase font-medium">Travel</p>
                    <p className="text-white/20 text-[10px]">{TRAVEL_PLACES.length} places · scroll to zoom</p>
                </div>
            </div>
        </div>
    )
}
