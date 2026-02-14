'use client'

import { useState } from 'react'
import { icons } from '@/app/icons';
import Image from 'next/image';

type Rank = 'S' | 'A' | 'B' | 'C'

interface Spell {
    name: string
    rank: Rank
    glyph: string
    desc: string
}

interface School {
    id: string
    label: string
    glyph: string
    color: string
    spells: Spell[]
}

const SCHOOLS: School[] = [
    {
        id: 'web',
        label: 'Web',
        glyph: '⬡',
        color: 'var(--primary)',
        spells: [
            { name: 'TypeScript', rank: 'S', glyph: icons.typescript, desc: 'Typed superset of JavaScript' },
            { name: 'React', rank: 'S', glyph: icons.react, desc: 'Component-based UI library' },
            { name: 'Next.js', rank: 'A', glyph: icons.next, desc: 'Full-stack React framework' },
            { name: 'Angular', rank: 'B', glyph: icons.angular, desc: 'Enterprise web framework' },
            { name: 'Vue', rank: 'B', glyph: icons.vue, desc: 'Framework and ecosystem deisnged for building web interfaces.' },
            { name: 'Tailwind CSS', rank: 'A', glyph: icons.tailwind, desc: 'Utility-first CSS framework' },
        ],
    },
    {
        id: 'mobile',
        label: 'Mobile',
        glyph: '◈',
        color: 'var(--secondary)',
        spells: [
            { name: 'React Native', rank: 'B', glyph: icons.react, desc: 'Cross-platform mobile framework' },
            { name: 'Flutter', rank: 'A', glyph: icons.flutter, desc: 'Cross-platform UI toolkit operating across iOS, Android, Web and Desktop.' },
        ],
    },
    {
        id: 'backend',
        label: 'Backend',
        glyph: '⬢',
        color: 'var(--success)',
        spells: [
            { name: 'Node.js', rank: 'B', glyph: icons.node, desc: 'Server-side JavaScript runtime' },
            { name: 'Nest Js', rank: 'B', glyph: icons.nest, desc: 'Progressive Node.js framwork with advanced efficiency, scalability and maintainability ' },
            { name: 'Python', rank: 'C', glyph: icons.python, desc: 'Scripting and automation' },
            { name: 'PostgreSQL', rank: 'C', glyph: icons.postgres, desc: 'Relational database' },
        ],
    },
    {
        id: 'tools',
        label: 'Tools',
        glyph: '⚙',
        color: 'var(--warning)',
        spells: [
            { name: 'Git', rank: 'A', glyph: icons.github, desc: 'Version control system' },
            { name: 'Three.js', rank: 'B', glyph: icons.threejs, desc: '3D WebGL rendering library' },
            { name: 'Figma', rank: 'A', glyph: icons.figma, desc: 'UI / UX design tool' },
            { name: 'Docker', rank: 'C', glyph: icons.docker, desc: 'Container platform' },
        ],
    },
]

function rankColor(rank: Rank) {
    if (rank === 'S') return 'var(--primary)'
    if (rank === 'A') return 'var(--success)'
    if (rank === 'B') return 'var(--secondary)'
    return 'var(--muted)'
}

function SpellCard({ spell, schoolColor }: { spell: Spell; schoolColor: string }) {
    const rc = rankColor(spell.rank)
    return (
        <div
            className="relative flex flex-col gap-1.5 p-3 rounded font-mono group transition-all cursor-default"
            style={{
                background: 'var(--surface)',
                border: '1px solid var(--glass-border)',
            }}
        >
            {/* Hover glow */}
            <div
                className="absolute inset-0 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{ boxShadow: `0 0 14px ${schoolColor}33, inset 0 0 10px ${schoolColor}11` }}
            />

            {/* Glyph badge + rank */}
            <div className="flex items-center justify-between">
                <div
                    className="w-8 h-8 flex items-center justify-center rounded text-[10px] font-black shrink-0"
                    style={{
                        background: `${schoolColor}22`,
                        border: `1px solid ${schoolColor}55`,
                        color: schoolColor,
                    }}
                >
                    {
                        spell.glyph.includes("/") ?
                            <Image
                                src={spell.glyph}
                                width={18}
                                height={18}
                                alt={spell.name}
                            />
                            :
                            spell.glyph
                    }
                </div>
                <span
                    className="text-[9px] font-black px-1.5 py-0.5 rounded"
                    style={{
                        color: rc,
                        background: `${rc}22`,
                        border: `1px solid ${rc}44`,
                    }}
                >
                    {spell.rank}
                </span>
            </div>

            {/* Divider */}
            <div className="h-px w-full" style={{ background: 'var(--glass-border)' }} />

            {/* Name + desc */}
            <p className="text-[11px] font-bold" style={{ color: 'var(--body)' }}>
                {spell.name}
            </p>
            <p className="text-[9px] leading-relaxed" style={{ color: 'var(--muted)' }}>
                {spell.desc}
            </p>
        </div>
    )
}

export default function SkillsScreen({ isMobile = false }: { isMobile?: boolean }) {
    const [activeSchool, setActiveSchool] = useState<string>(SCHOOLS[0].id)
    const school = SCHOOLS.find(s => s.id === activeSchool)!

    const SchoolTab = ({ s }: { s: typeof SCHOOLS[0] }) => {
        const active = s.id === activeSchool
        return (
            <button
                onClick={() => setActiveSchool(s.id)}
                className="transition-all"
                style={isMobile ? {
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 14px',
                    flexShrink: 0,
                    background: active ? `${s.color}22` : 'transparent',
                    borderBottom: active ? `2px solid ${s.color}` : '2px solid transparent',
                    color: active ? s.color : 'var(--muted)',
                } : {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                    padding: '10px 0',
                    borderRadius: 6,
                    background: active ? `${s.color}22` : 'transparent',
                    border: active ? `1px solid ${s.color}55` : '1px solid transparent',
                    boxShadow: active ? `0 0 10px ${s.color}33` : 'none',
                }}
            >
                <span className={isMobile ? 'text-sm' : 'text-base'} style={{ color: active ? s.color : 'var(--muted)' }}>
                    {s.glyph}
                </span>
                <span
                    className="font-bold tracking-wider"
                    style={{ fontSize: 8, color: active ? s.color : 'var(--muted)' }}
                >
                    {s.label.toUpperCase()}
                </span>
                {!isMobile && (
                    <span style={{ fontSize: 8, color: active ? `${s.color}cc` : 'var(--subtle)' }}>
                        {s.spells.length}
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
                className="flex items-center justify-between px-4 py-3 border-b border-primary/20 shrink-0"
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
                            CODEX OF SKILLS
                        </p>
                        <p className="text-[9px] tracking-widest" style={{ color: 'var(--muted)' }}>
                            SPELLBOOK  ·  VOL. I
                        </p>
                    </div>
                </div>
                <span
                    className="text-[9px] px-2 py-1 rounded"
                    style={{ color: 'var(--muted)', border: '1px solid var(--glass-border)', background: 'var(--card)' }}
                >
                    {SCHOOLS.reduce((t, s) => t + s.spells.length, 0)} spells
                </span>
            </div>

            {/* ── Mobile: horizontal tab row ────────────────────── */}
            {isMobile && (
                <div
                    className="flex overflow-x-auto border-b border-primary/20 shrink-0"
                    style={{ background: 'var(--surface)' }}
                >
                    {SCHOOLS.map(s => <SchoolTab key={s.id} s={s} />)}
                </div>
            )}

            {/* ── Body ─────────────────────────────────────────── */}
            <div className="flex flex-1 min-h-0">

                {/* Desktop: left sidebar */}
                {!isMobile && (
                    <div
                        className="flex flex-col gap-1 p-2 border-r border-primary/20 shrink-0"
                        style={{ background: 'var(--surface)', width: 80 }}
                    >
                        <div className="h-px w-full mb-2" style={{ background: 'var(--primary-glow)' }} />
                        {SCHOOLS.map(s => <SchoolTab key={s.id} s={s} />)}
                        <div className="mt-auto flex flex-col items-center gap-1 pt-2">
                            <div className="h-px w-full" style={{ background: 'var(--primary-glow)' }} />
                            <span className="text-[10px]" style={{ color: 'var(--subtle)' }}>✦</span>
                        </div>
                    </div>
                )}

                {/* Content — spell grid */}
                <div className="flex-1 overflow-auto p-3">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-base" style={{ color: school.color }}>{school.glyph}</span>
                        <span className="text-[10px] font-bold tracking-[0.2em]" style={{ color: school.color }}>
                            {school.label.toUpperCase()} ARTS
                        </span>
                        <div className="flex-1 h-px" style={{ background: `${school.color}33` }} />
                        <span className="text-[9px]" style={{ color: 'var(--subtle)' }}>
                            ❖ {school.spells.length} entries
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        {school.spells.map(spell => (
                            <SpellCard key={spell.name} spell={spell} schoolColor={school.color} />
                        ))}
                    </div>

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
