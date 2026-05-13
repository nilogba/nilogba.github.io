"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import Divider from "../components/divider"

const TOKEN_KEY = "travel_token"

interface Folder {
    id: string
    name: string
}

function PlaceCard({ folder, token }: { folder: Folder; token: string }) {
    const [thumb, setThumb] = useState<string | null>(null)

    useEffect(() => {
        fetch(`/api/travel/photos/${folder.id}?limit=1&type=image`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((r) => r.json())
            .then((data) => {
                const url: string | undefined = data.photos?.[0]?.url
                if (url) setThumb(url)
            })
            .catch(() => {})
    }, [folder.id, token])

    return (
        <Link
            href={`/travel/${folder.id}`}
            className="relative aspect-square overflow-hidden rounded-sm bg-primary/5 block group"
        >
            {thumb ? (
                <Image
                    src={thumb}
                    alt={folder.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, 33vw"
                />
            ) : (
                <div className="w-full h-full bg-primary/5 animate-pulse" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white text-sm font-medium leading-tight">{folder.name}</p>
            </div>
        </Link>
    )
}

export default function TravelPage() {
    const [phase, setPhase] = useState<"loading" | "gate" | "content">("loading")
    const [token, setToken] = useState("")
    const [folders, setFolders] = useState<Folder[]>([])
    const [foldersLoading, setFoldersLoading] = useState(false)
    const [passkey, setPasskey] = useState("")
    const [error, setError] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const saved = sessionStorage.getItem(TOKEN_KEY)
        if (saved) {
            setToken(saved)
            setPhase("content")
        } else {
            setPhase("gate")
        }
    }, [])

    useEffect(() => {
        if (phase === "gate") inputRef.current?.focus()
    }, [phase])

    // Fetch folder list from Cloudinary once authenticated
    useEffect(() => {
        if (phase !== "content" || !token) return
        setFoldersLoading(true)
        fetch("/api/travel/folders", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((r) => r.json())
            .then((data) => setFolders(data.folders ?? []))
            .catch(() => {})
            .finally(() => setFoldersLoading(false))
    }, [phase, token])

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
                setToken(data.token)
                setPhase("content")
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

    if (phase === "loading") return <main className="min-h-screen" />

    if (phase === "gate") {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center px-4">
                <div className="flex flex-col items-center gap-8 w-full max-w-xs">
                    <div className="flex flex-col items-center gap-2 text-center">
                        <p className="text-sm tracking-[2px] text-primary uppercase font-medium">Travel</p>
                        <p className="text-secondary text-sm">Enter the passkey to continue</p>
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
                            className="w-full border border-primary/15 rounded-lg px-4 py-3 text-primary text-sm focus:outline-none focus:border-primary/30 text-center tracking-widest"
                        />
                        <button
                            type="submit"
                            disabled={submitting || !passkey}
                            className="w-full bg-primary disabled:opacity-40 disabled:cursor-not-allowed rounded-lg py-3 text-white text-sm font-medium transition-opacity"
                        >
                            {submitting ? "…" : "Enter"}
                        </button>
                        {error && <p className="text-center text-red-500/80 text-xs">{error}</p>}
                    </form>
                    <Link href="/" className="text-secondary/50 hover:text-secondary text-xs transition-colors">
                        ← Home
                    </Link>
                </div>
            </main>
        )
    }

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
                                <p className="text-sm tracking-[2px] text-primary uppercase font-medium">Travel</p>
                                <h1 className="text-2xl sm:text-3xl font-normal">Places</h1>
                                <p className="text-secondary text-sm">
                                    {foldersLoading ? "Loading…" : `${folders.length} destinations`}
                                </p>
                            </div>
                        </div>

                        {/* Place tiles */}
                        <div className="border-t border-primary/10">
                            <div className="max-w-3xl mx-auto px-4 sm:px-7 py-6">
                                {foldersLoading ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className="aspect-square rounded-sm bg-primary/5 animate-pulse" />
                                        ))}
                                    </div>
                                ) : folders.length === 0 ? (
                                    <p className="text-secondary text-sm py-12 text-center">No destinations found.</p>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {folders.map((folder) => (
                                            <PlaceCard key={folder.id} folder={folder} token={token} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Divider />
        </main>
    )
}
