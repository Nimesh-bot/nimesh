'use client'

import { useState } from 'react'

interface HobbyItem {
    name: string
    sub: string
    tag: string
    featured?: boolean
}

interface Hobby {
    id: string
    label: string
    glyph: string
    color: string
    description: string
    items: HobbyItem[]
}

const HOBBIES: Hobby[] = [
    {
        id: 'gaming',
        label: 'Gaming',
        glyph: '🎮',
        color: 'var(--primary)',
        description: 'MMORPG · RPG · FPS · Action',
        items: [
            { name: 'Final Fantasy XIV', sub: 'MMORPG · PC / PS5', tag: 'Main', featured: true },
            { name: 'Last of Us', sub: 'Action · PC', tag: 'Best' },
            { name: 'Uncharted 4', sub: 'Action · PC', tag: 'Top 5' },
            { name: 'World Of Warcraft', sub: 'MMORPG · PC', tag: 'Top 10' },
            { name: 'Valorant', sub: 'FPS · PC', tag: 'Socially' },
        ],
    },
    {
        id: 'anime',
        label: 'Anime',
        glyph: '📺',
        color: 'var(--secondary)',
        description: 'Slice of Life · Action · Drama',
        items: [
            { name: 'Haikyuu', sub: 'Sports · Shonen', tag: 'All-time', featured: true },
            { name: 'Frieren', sub: 'Fantasy · Slice of Life', tag: 'Top 5' },
            { name: 'Steins Gate', sub: 'Sci-fi · Mystery', tag: 'Top 5' },
            { name: 'Horimiya', sub: 'Romance · Slice of Life', tag: 'Top 5' },
            { name: 'Apothecary Diaries', sub: 'Slice of Life · Mystery', tag: 'Top 5' },
        ],
    },
    {
        id: 'music',
        label: 'Music',
        glyph: '🎵',
        color: 'var(--warning)',
        description: 'J-Pop · Indie · Alternative',
        items: [
            { name: 'Ado', sub: 'J-Pop · Rock', tag: 'Top Artist', featured: true },
            { name: 'YOASOBI', sub: 'J-Pop · Story-driven', tag: 'Favorite' },
            { name: 'Baby Metal', sub: 'Kawai Metal', tag: 'Favorite' },
            { name: 'Tuki', sub: 'J-Pop', tag: 'Favorite' },
        ],
    },
]

export default function HobbiesScreen({ isMobile = false }: { isMobile?: boolean }) {
    const [activeHobby, setActiveHobby] = useState<string>(HOBBIES[0].id)
    const hobby = HOBBIES.find(h => h.id === activeHobby)!
    const featured = hobby.items.find(i => i.featured)
    const others = hobby.items.filter(i => !i.featured)

    const HobbyTab = ({ h }: { h: typeof HOBBIES[0] }) => {
        const active = h.id === activeHobby
        return (
            <button
                onClick={() => setActiveHobby(h.id)}
                className="transition-all"
                style={isMobile ? {
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 14px',
                    flexShrink: 0,
                    background: active ? `${h.color}22` : 'transparent',
                    borderBottom: active ? `2px solid ${h.color}` : '2px solid transparent',
                } : {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                    padding: '10px 0',
                    borderRadius: 6,
                    background: active ? `${h.color}22` : 'transparent',
                    border: active ? `1px solid ${h.color}55` : '1px solid transparent',
                    boxShadow: active ? `0 0 10px ${h.color}33` : 'none',
                }}
            >
                <span className={isMobile ? 'text-sm' : 'text-base'}>{h.glyph}</span>
                <span
                    className="font-bold tracking-wider"
                    style={{ fontSize: 8, color: active ? h.color : 'var(--muted)' }}
                >
                    {h.label.toUpperCase()}
                </span>
                {!isMobile && (
                    <span style={{ fontSize: 8, color: active ? `${h.color}cc` : 'var(--subtle)' }}>
                        {h.items.length}
                    </span>
                )}
            </button>
        )
    }

    return (
        <div
            className="font-mono text-xs h-full flex flex-col"
            style={{ background: 'var(--card)' }}
        >
            {/* ── Header ───────────────────────────────────────── */}
            <div
                className="flex items-center justify-between px-4 py-3 border-b border-primary/20 flex-shrink-0"
                style={{ background: 'var(--surface)' }}
            >
                <div className="flex items-center gap-3">
                    <div
                        className="w-8 h-8 flex items-center justify-center rounded text-base"
                        style={{
                            background: 'var(--gradient-bg)',
                            border: '1px solid var(--primary)',
                            boxShadow: '0 0 10px var(--primary-glow-sm)',
                            color: 'var(--primary)',
                        }}
                    >
                        ✦
                    </div>
                    <div>
                        <p className="text-[11px] font-bold tracking-[0.15em]" style={{ color: 'var(--primary)' }}>
                            HOBBIES & INTERESTS
                        </p>
                        <p className="text-[9px] tracking-widest" style={{ color: 'var(--muted)' }}>
                            {HOBBIES.length} categories
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Mobile: horizontal tab row ────────────────────── */}
            {isMobile && (
                <div
                    className="flex overflow-x-auto border-b border-primary/20 flex-shrink-0"
                    style={{ background: 'var(--surface)' }}
                >
                    {HOBBIES.map(h => <HobbyTab key={h.id} h={h} />)}
                </div>
            )}

            {/* ── Body: Sidebar + Detail ────────────────────────── */}
            <div className="flex flex-1 min-h-0">

                {/* Desktop: left sidebar */}
                {!isMobile && (
                    <div
                        className="flex flex-col gap-1 p-2 border-r border-primary/20 flex-shrink-0"
                        style={{ background: 'var(--surface)', width: 80 }}
                    >
                        <div className="h-px w-full mb-2" style={{ background: 'var(--primary-glow)' }} />
                        {HOBBIES.map(h => <HobbyTab key={h.id} h={h} />)}
                        <div className="mt-auto flex flex-col items-center gap-1 pt-2">
                            <div className="h-px w-full" style={{ background: 'var(--primary-glow)' }} />
                            <span className="text-[10px]" style={{ color: 'var(--subtle)' }}>✦</span>
                        </div>
                    </div>
                )}

                {/* Detail panel */}
                <div className="flex-1 overflow-auto p-3">

                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-base">{hobby.glyph}</span>
                        <span className="text-[10px] font-bold tracking-[0.2em]" style={{ color: hobby.color }}>
                            {hobby.label.toUpperCase()}
                        </span>
                        <div className="flex-1 h-px" style={{ background: `${hobby.color}33` }} />
                        <span className="text-[9px]" style={{ color: 'var(--subtle)' }}>
                            {hobby.description}
                        </span>
                    </div>

                    {/* Featured pick */}
                    {featured && (
                        <div className="mb-3">
                            <p className="text-[8px] tracking-[0.2em] mb-1.5" style={{ color: 'var(--muted)' }}>
                                — FAVORITE PICK
                            </p>
                            <div
                                className="p-3 rounded-lg"
                                style={{
                                    background: `${hobby.color}18`,
                                    border: `1px solid ${hobby.color}55`,
                                    boxShadow: `0 0 16px ${hobby.color}22`,
                                }}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <p className="text-[13px] font-bold" style={{ color: hobby.color }}>
                                            {featured.name}
                                        </p>
                                        <p className="text-[10px] mt-0.5" style={{ color: 'var(--muted)' }}>
                                            {featured.sub}
                                        </p>
                                    </div>
                                    <span
                                        className="text-[9px] font-bold px-2 py-0.5 rounded flex-shrink-0"
                                        style={{
                                            color: hobby.color,
                                            background: `${hobby.color}22`,
                                            border: `1px solid ${hobby.color}44`,
                                        }}
                                    >
                                        {featured.tag}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Others */}
                    {others.length > 0 && (
                        <div>
                            <p className="text-[8px] tracking-[0.2em] mb-1.5" style={{ color: 'var(--muted)' }}>
                                — OTHERS
                            </p>
                            <div className="flex flex-col gap-1.5">
                                {others.map(item => (
                                    <div
                                        key={item.name}
                                        className="flex items-center justify-between gap-3 px-3 py-2 rounded"
                                        style={{
                                            background: 'var(--surface)',
                                            border: '1px solid var(--glass-border)',
                                        }}
                                    >
                                        <div className="min-w-0">
                                            <p className="text-[11px] font-semibold truncate" style={{ color: 'var(--body)' }}>
                                                {item.name}
                                            </p>
                                            <p className="text-[9px]" style={{ color: 'var(--muted)' }}>
                                                {item.sub}
                                            </p>
                                        </div>
                                        <span
                                            className="text-[8px] px-1.5 py-0.5 rounded flex-shrink-0"
                                            style={{
                                                color: hobby.color,
                                                background: `${hobby.color}18`,
                                                border: `1px solid ${hobby.color}33`,
                                            }}
                                        >
                                            {item.tag}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-center gap-3 mt-4 pt-3 border-t border-primary/10">
                        <div className="h-px flex-1" style={{ background: 'var(--primary-glow)' }} />
                        <span className="text-[8px] tracking-[0.3em]" style={{ color: 'var(--subtle)' }}>
                            ✦  NIMESH SHAKYA  ✦
                        </span>
                        <div className="h-px flex-1" style={{ background: 'var(--primary-glow)' }} />
                    </div>
                </div>
            </div>
        </div>
    )
}
