'use client'

import { useRef, useCallback } from 'react'

interface Job {
    role: string
    company: string
    period: string
    type: string
    points: string[]
}

const JOBS: Job[] = [
    {
        role: 'Software Engineer',
        company: 'Triplet R&D',
        period: 'Sep 2024 — Present',
        type: 'Full-time',
        points: [
            'Contributed to development of a local television application with 5,000+ active users across Android, iOS, and TV platforms.',
            'Improved user experience and video playback performance, reducing crashes on TV environments.',
            'Assisted backend development and management dashboard implementation.',
            'Refactored frontend architecture to improve maintainability and code clarity.',
            'Integrated Azure-based speech processing with OpenAI to generate speaker-distinguished transcripts from audio data.',
            'Collaborated within a cross-functional team (12–20 members) in a Japanese development environment.',
            'Developed custom analytical and visualization tools within a licensed proprietary environment.',
            'Implemented data processing and visualization components not supported by default system capabilities.',
        ],
    },
    {
        role: 'Software Engineer',
        company: 'CSI Solution',
        period: 'Jan 2024 — Aug 2024',
        type: 'Full-time',
        points: [
            'Selected for a Japanese client project after an initial trial period based on rapid performance improvement.',
            'Developed mobile applications in Flutter for a Japanese company while collaborating remotely with a fully Japanese team.',
            'Contributed to Odoo-based system customization and Vue.js frontend features.',
            'Successfully transitioned to a Japan-based role following project contribution.'
        ],
    },
    {
        role: 'Frontend Developer',
        company: 'Bitmosys Labs',
        period: 'Mar 2022 — Dec 2023',
        type: 'Internship → Full-time',
        points: [
            'Developed and maintained a dental service web portal and mobile application serving 2,000+ users.',
            'Implemented WebSocket-based real-time job request system to improve responsiveness and operational efficiency.',
            'Optimized frontend performance by restructuring async processes and improving memory handling for heavy operations.',
            'Worked in a startup environment with high ownership across frontend and backend systems.',
        ],
    },
]

export default function CareerScreen() {
    const scrollRef = useRef<HTMLDivElement>(null)
    const dragRef = useRef<{ startY: number; scrollTop: number } | null>(null)

    const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        if (!scrollRef.current) return
        e.currentTarget.setPointerCapture(e.pointerId)
        dragRef.current = { startY: e.clientY, scrollTop: scrollRef.current.scrollTop }
    }, [])

    const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        if (!dragRef.current || !scrollRef.current) return
        const delta = dragRef.current.startY - e.clientY
        scrollRef.current.scrollTop = dragRef.current.scrollTop + delta
    }, [])

    const handlePointerUp = useCallback(() => {
        dragRef.current = null
    }, [])

    return (
        <div className="h-full flex flex-col font-mono" style={{ background: 'var(--card)' }}>

            {/* Header */}
            <div
                className="flex items-center gap-3 px-4 py-3 border-b border-primary/20 shrink-0"
                style={{ background: 'var(--surface)' }}
            >
                <div
                    className="w-8 h-8 flex items-center justify-center rounded text-base"
                    style={{
                        background: 'var(--gradient-bg)',
                        border: '1px solid var(--primary)',
                        boxShadow: '0 0 10px var(--primary-glow-sm)',
                        color: 'var(--primary)',
                    }}
                >
                    ◈
                </div>
                <div>
                    <p className="text-[11px] font-bold tracking-[0.15em]" style={{ color: 'var(--primary)' }}>
                        CAREER HISTORY
                    </p>
                    <p className="text-[9px] tracking-widest" style={{ color: 'var(--muted)' }}>
                        {JOBS.length} positions  ·  {new Date().getFullYear() - 2022}+ years experience
                    </p>
                </div>
            </div>

            {/* Scrollable / draggable timeline */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto overflow-x-hidden select-none"
                style={{ cursor: dragRef.current ? 'grabbing' : 'grab' }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
            >
                <div className="relative px-6 py-4">

                    {/* Vertical spine */}
                    <div
                        className="absolute top-0 bottom-0 w-px"
                        style={{ left: 30, background: 'linear-gradient(to bottom, var(--primary), var(--secondary), transparent)' }}
                    />

                    <div className="flex flex-col gap-6">
                        {JOBS.map((job, idx) => (
                            <div key={idx} className="relative flex gap-4">

                                {/* Node on the spine */}
                                <div className="shrink-0 flex flex-col items-center" style={{ width: 24 }}>
                                    <div
                                        className="w-3 h-3 rounded-full -ml-3 mt-1 z-10"
                                        style={{
                                            background: idx === 0 ? 'var(--primary)' : 'var(--surface)',
                                            border: `2px solid ${idx === 0 ? 'var(--primary)' : 'var(--secondary)'}`,
                                            boxShadow: idx === 0 ? '0 0 8px var(--primary-glow)' : 'none',
                                        }}
                                    />
                                </div>

                                {/* Card */}
                                <div
                                    className="flex-1 rounded-lg mb-1"
                                    style={{
                                        background: 'var(--surface)',
                                        border: `1px solid ${idx === 0 ? 'var(--primary)' : 'var(--glass-border)'}`,
                                        boxShadow: idx === 0 ? '0 0 12px var(--primary-glow-sm)' : 'none',
                                    }}
                                >
                                    {/* Card header */}
                                    <div className="px-3 pt-3 pb-2 border-b border-primary/10">
                                        <div className="flex items-start justify-between gap-2 flex-wrap">
                                            <div>
                                                <p
                                                    className="text-[12px] font-bold"
                                                    style={{ color: idx === 0 ? 'var(--primary)' : 'var(--success)' }}
                                                >
                                                    {job.role}
                                                </p>
                                                <p className="text-[11px] font-semibold mt-0.5" style={{ color: 'var(--body)' }}>
                                                    {job.company}
                                                </p>
                                            </div>
                                            {idx === 0 && (
                                                <span
                                                    className="text-[8px] px-1.5 py-0.5 rounded border border-success/30 shrink-0"
                                                    style={{ color: 'var(--success)', background: 'rgba(74,222,128,0.08)' }}
                                                >
                                                    ● Current
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                                            <span className="text-[9px]" style={{ color: 'var(--muted)' }}>{job.period}</span>
                                            <span className="text-[9px]" style={{ color: 'var(--subtle)' }}>·</span>
                                            <span className="text-[9px]" style={{ color: 'var(--subtle)' }}>{job.type}</span>
                                        </div>
                                    </div>

                                    {/* Bullet points */}
                                    <ul className="px-3 py-2.5 space-y-1.5">
                                        {job.points.map((point, i) => (
                                            <li key={i} className="flex gap-2">
                                                <span
                                                    className="shrink-0 mt-0.75"
                                                    style={{ color: 'var(--primary)', fontSize: 8 }}
                                                >
                                                    ▸
                                                </span>
                                                <span className="text-[10px] leading-relaxed" style={{ color: 'var(--body)', opacity: 0.85 }}>
                                                    {point}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}

                        {/* Timeline end marker */}
                        <div className="relative flex gap-4">
                            <div className="shrink-0" style={{ width: 24 }}>
                                <div
                                    className="w-3 h-3 rounded-full mt-1 z-10 flex items-center justify-center"
                                    style={{ border: '2px solid var(--subtle)' }}
                                />
                            </div>
                            <p className="text-[9px] mt-1 tracking-widest" style={{ color: 'var(--subtle)' }}>
                                — ORIGIN  ·  2022
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
