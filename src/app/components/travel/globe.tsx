"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import Globe, { GlobeMethods } from "react-globe.gl"
import { useRouter } from "next/navigation"
import { TravelPlace } from "@/app/data/travel-places"

interface Props {
    places: TravelPlace[]
    thumbnails: Record<string, string>
}

export default function GlobeComponent({ places, thumbnails }: Props) {
    const globeRef = useRef<GlobeMethods | undefined>(undefined)
    const [dims, setDims] = useState<{ w: number; h: number } | null>(null)
    const router = useRouter()

    // Window dimensions for explicit canvas sizing
    useEffect(() => {
        const update = () => setDims({ w: window.innerWidth, h: window.innerHeight })
        update()
        window.addEventListener("resize", update)
        return () => window.removeEventListener("resize", update)
    }, [])

    // Auto-rotate
    useEffect(() => {
        if (!dims) return
        const t = setTimeout(() => {
            const ctrl = globeRef.current?.controls() as { autoRotate: boolean; autoRotateSpeed: number } | undefined
            if (ctrl) {
                ctrl.autoRotate = true
                ctrl.autoRotateSpeed = 0.4
            }
        }, 600)
        return () => clearTimeout(t)
    }, [dims])

    // Hover label — plain name when no thumbnail, thumbnail card when available
    const pointLabel = useCallback(
        (d: object) => {
            const p = d as TravelPlace
            const thumb = thumbnails[p.id]
            if (thumb) {
                return [
                    `<div style="font-family:ui-sans-serif,sans-serif;border-radius:8px;overflow:hidden;`,
                    `border:1px solid rgba(252,76,2,0.7);box-shadow:0 4px 20px rgba(0,0,0,0.6)">`,
                    `<img src="${thumb}" style="width:160px;height:110px;object-fit:cover;display:block">`,
                    `<div style="background:rgba(10,15,30,0.95);padding:7px 10px">`,
                    `<div style="color:#fff;font-size:12px;font-weight:600">${p.name}</div>`,
                    `<div style="color:rgba(255,255,255,0.4);font-size:10px;margin-top:2px">${p.country} · ${p.year}</div>`,
                    `</div></div>`,
                ].join("")
            }
            return `<div style="font-family:ui-sans-serif,sans-serif;background:rgba(10,15,30,0.9);color:#fff;padding:6px 10px;border-radius:6px;font-size:12px;border:1px solid rgba(252,76,2,0.5)">${p.name}</div>`
        },
        [thumbnails]
    )

    const onPointClick = useCallback(
        (point: object) => {
            const p = point as TravelPlace
            if (p?.id) router.push(`/travel/${p.id}`)
        },
        [router]
    )

    return (
        <div style={{ width: "100%", height: "100%" }}>
            {dims && (
                <Globe
                    ref={globeRef}
                    width={dims.w}
                    height={dims.h}
                    globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                    bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
                    backgroundImageUrl="https://unpkg.com/three-globe/example/img/night-sky.png"
                    backgroundColor="rgba(0,0,0,0)"
                    atmosphereColor="#4a9ed4"
                    atmosphereAltitude={0.2}
                    pointsData={places}
                    pointLat="lat"
                    pointLng="lng"
                    pointColor={() => "#FC4C02"}
                    pointAltitude={0.02}
                    pointRadius={0.6}
                    pointLabel={pointLabel}
                    onPointClick={onPointClick}
                    ringsData={places}
                    ringLat="lat"
                    ringLng="lng"
                    ringColor={() => "#FC4C02"}
                    ringMaxRadius={3}
                    ringPropagationSpeed={1.5}
                    ringRepeatPeriod={900}
                />
            )}
        </div>
    )
}
