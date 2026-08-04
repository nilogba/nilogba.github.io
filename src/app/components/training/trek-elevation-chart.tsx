"use client"

import { useState } from "react"

interface Trek {
    name: string
    peakMeters: number
    date: string
    sortKey: string
}

const TREKS: Trek[] = [
    { name: "Meghalaya Root Bridge", peakMeters: 600,  date: "2024",     sortKey: "2024-05" },
    { name: "Kashmir Great Lakes",   peakMeters: 4200, date: "2024",     sortKey: "2024-07" },
    { name: "Triund Trek",           peakMeters: 2850, date: "2025",     sortKey: "2025-01" },
    { name: "Annapurna Base Camp",   peakMeters: 4130, date: "2025",     sortKey: "2025-05" },
    { name: "Hampta Pass",           peakMeters: 4270, date: "Aug 2025", sortKey: "2025-08" },
    { name: "Brahmatal",             peakMeters: 3640, date: "Jan 2026", sortKey: "2026-01" },
    { name: "Chopta Chandrashila",   peakMeters: 4000, date: "Mar 2026", sortKey: "2026-03" },
    { name: "Bhrigu Lake",           peakMeters: 4269, date: "Jun 2026", sortKey: "2026-06" },
]

const REFS = [
    { label: "EBC",     meters: 5364, note: "Everest Base Camp" },
    { label: "Rohtang", meters: 3978, note: "Rohtang Pass" },
]

const MAX_M = 5500
const VW = 640
const VH = 320
const PAD = { t: 25, r: 48, b: 88, l: 52 }
const CW = VW - PAD.l - PAD.r
const CH = VH - PAD.t - PAD.b
const BOTTOM = PAD.t + CH

const MONTH_ABBR = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

function toMonths(sk: string) {
    const [y, m] = sk.split("-").map(Number)
    return y * 12 + m
}

function fmtDate(sk: string) {
    const [y, m] = sk.split("-").map(Number)
    return `${MONTH_ABBR[m - 1]} '${String(y).slice(2)}`
}

const GRID = [1000, 2000, 3000, 4000, 5000]

export default function TrekElevationChart() {
    const [hovered, setHovered] = useState<Trek | null>(null)

    const sorted = [...TREKS].sort((a, b) => a.sortKey.localeCompare(b.sortKey))
    const months = sorted.map(t => toMonths(t.sortKey))
    const minM = months[0]
    const maxM = months[months.length - 1]

    const xOf = (sk: string) => PAD.l + ((toMonths(sk) - minM) / (maxM - minM)) * CW
    const yOf = (m: number) => PAD.t + (1 - m / MAX_M) * CH

    const pts = sorted.map(t => ({ x: xOf(t.sortKey), y: yOf(t.peakMeters), trek: t }))
    const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")
    const areaPath = `${linePath} L${pts[pts.length - 1].x.toFixed(1)},${BOTTOM} L${pts[0].x.toFixed(1)},${BOTTOM} Z`

    return (
        <div className="border-t border-primary/10">
            <div className="max-w-3xl mx-auto px-4 sm:px-7 pt-8 pb-10">
                <div className="flex flex-col gap-1 mb-6">
                    <p className="text-xs tracking-[1.5px] text-secondary uppercase font-medium">Peak Elevations</p>
                    <p className="text-secondary text-sm">Highest point reached on each trek, chronologically</p>
                </div>

                <div style={{ overflow: "visible" }}>
                    <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full" overflow="visible">
                        <defs>
                            <linearGradient id="trekAreaFill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#0d9488" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="#0d9488" stopOpacity="0.01" />
                            </linearGradient>
                        </defs>

                        {/* Y axis */}
                        <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={BOTTOM}
                            stroke="#1C212B" strokeOpacity={0.1} strokeWidth={1} />

                        {/* X axis */}
                        <line x1={PAD.l} y1={BOTTOM} x2={PAD.l + CW} y2={BOTTOM}
                            stroke="#1C212B" strokeOpacity={0.1} strokeWidth={1} />

                        {/* Y gridlines */}
                        {GRID.map(m => {
                            const y = yOf(m)
                            return (
                                <g key={m}>
                                    <line x1={PAD.l} y1={y} x2={PAD.l + CW} y2={y}
                                        stroke="#1C212B" strokeOpacity={0.06} strokeWidth={1} />
                                    <text x={PAD.l - 7} y={y + 4} textAnchor="end"
                                        fontSize={10} fill="#677084">
                                        {`${m / 1000}km`}
                                    </text>
                                </g>
                            )
                        })}

                        {/* Reference lines */}
                        {REFS.map(ref => {
                            const y = yOf(ref.meters)
                            return (
                                <g key={ref.label}>
                                    <line x1={PAD.l} y1={y} x2={PAD.l + CW} y2={y}
                                        stroke="#0d9488" strokeOpacity={0.28} strokeWidth={1}
                                        strokeDasharray="4 3" />
                                    <text x={PAD.l + CW + 5} y={y + 4} fontSize={9}
                                        fill="#0d9488" fillOpacity={0.7}>
                                        {ref.label}
                                    </text>
                                </g>
                            )
                        })}

                        {/* Area fill */}
                        <path d={areaPath} fill="url(#trekAreaFill)" />

                        {/* Line */}
                        <path d={linePath} fill="none" stroke="#0d9488" strokeWidth={2}
                            strokeOpacity={0.8} strokeLinejoin="round" strokeLinecap="round" />

                        {/* Points */}
                        {pts.map(({ x, y, trek }) => {
                            const isHov = hovered?.name === trek.name
                            return (
                                <g key={trek.name}
                                    onMouseEnter={() => setHovered(trek)}
                                    onMouseLeave={() => setHovered(null)}
                                    style={{ cursor: "default" }}>
                                    {isHov && (
                                        <circle cx={x} cy={y} r={10} fill="#0d9488" fillOpacity={0.12} />
                                    )}
                                    <circle cx={x} cy={y} r={isHov ? 5.5 : 4}
                                        fill="white" stroke="#0d9488"
                                        strokeWidth={isHov ? 2.5 : 1.8} />

                                    {/* Elevation above dot */}
                                    <text x={x} y={y - 10} textAnchor="middle"
                                        fontSize={9.5} fill="#0d9488" fontWeight="600">
                                        {trek.peakMeters >= 1000
                                            ? `${(trek.peakMeters / 1000).toFixed(1)}k`
                                            : trek.peakMeters}
                                    </text>

                                    {/* Date below x-axis */}
                                    <text transform={`translate(${x}, ${BOTTOM + 10}) rotate(-42)`}
                                        textAnchor="end" fontSize={9.5} fill="#677084">
                                        {fmtDate(trek.sortKey)}
                                    </text>

                                    {/* Trek name */}
                                    <text transform={`translate(${x}, ${BOTTOM + 23}) rotate(-42)`}
                                        textAnchor="end" fontSize={9} fill="#1C212B" fillOpacity={0.5}>
                                        {trek.name.length > 14 ? trek.name.slice(0, 13) + "…" : trek.name}
                                    </text>
                                </g>
                            )
                        })}

                        {/* Tooltip */}
                        {hovered && (() => {
                            const x = xOf(hovered.sortKey)
                            const y = yOf(hovered.peakMeters)
                            const tw = 148, th = 44
                            const tx = Math.min(Math.max(x - tw / 2, PAD.l), PAD.l + CW - tw)
                            const ty = Math.max(y - th - 12, PAD.t)
                            return (
                                <g style={{ pointerEvents: "none" }}>
                                    <rect x={tx} y={ty} width={tw} height={th} rx={5}
                                        fill="#1C212B" fillOpacity={0.93} />
                                    <text x={tx + 10} y={ty + 15} fontSize={11}
                                        fill="white" fontWeight="500">
                                        {hovered.name}
                                    </text>
                                    <text x={tx + 10} y={ty + 31} fontSize={10}
                                        fill="white" fillOpacity={0.5}>
                                        {hovered.peakMeters.toLocaleString()}m · {hovered.date}
                                    </text>
                                </g>
                            )
                        })()}
                    </svg>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-x-5 gap-y-1 mt-1 pt-4 border-t border-primary/10">
                    {REFS.map(ref => (
                        <div key={ref.label} className="flex items-center gap-1.5">
                            <svg width="18" height="8" viewBox="0 0 18 8">
                                <line x1="0" y1="4" x2="18" y2="4"
                                    stroke="#0d9488" strokeWidth="1.5"
                                    strokeDasharray="4 3" strokeOpacity="0.6" />
                            </svg>
                            <span className="text-[10px] text-secondary">
                                {ref.note} · {ref.meters.toLocaleString()}m
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
