'use client'

import Image from 'next/image'
import { useState } from 'react'

const STATS = [
    { label: 'Frontend', value: 90, tier: 'S' },
    { label: 'Mobile Dev', value: 85, tier: 'S' },
    { label: 'UI / UX', value: 72, tier: 'A' },
    { label: 'Backend', value: 58, tier: 'B' },
    { label: 'Sys Design', value: 52, tier: 'B' },
]

type Tab = 'about' | 'contact'

const TABS: { id: Tab; label: string }[] = [
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
]

function StatTierColor(tier: string) {
    if (tier === 'S') return 'var(--primary)';
    if (tier === 'A') return 'var(--success)';
    return 'var(--secondary)';
}

function StatBar({ label, value, tier }: { label: string; value: number; tier: string }) {
    const color = StatTierColor(tier);
    const filled = Math.round((value / 100) * 10);
    return (
        <div className="flex items-center gap-2">
            <span className="text-xs text-muted w-18 shrink-0">{label}</span>
            <div className="flex gap-0.5 flex-1">
                {Array.from({ length: 10 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex-1 h-2 rounded-sm"
                        style={{
                            background: i < filled ? color : 'var(--card)',
                            opacity: i < filled ? 1 : 0.4,
                        }}
                    />
                ))}
            </div>
            <span
                className="text-[10px] font-bold w-5 text-center rounded"
                style={{ color }}
            >
                {tier}
            </span>
        </div>
    )
}

export default function ProfileScreen() {
    const [activeTab, setActiveTab] = useState<Tab>('about')

    const calculateLevel = () => {
        const today = new Date();
        const birth = new Date("2001-05-31");

        let level = today.getFullYear() - birth.getFullYear();
        const expDifference = today.getMonth() - birth.getMonth();

        if (expDifference < 0 || (expDifference === 0 && today.getDate() - birth.getDate())) {
            level--;
        }

        return level;
    }

    const calculateExp = () => {
        const now = new Date();
        const y = now.getFullYear();

        const bdThisYear = new Date(y, 4, 31);
        const lastBd = now >= bdThisYear ? bdThisYear : new Date(y - 1, 4, 31);
        const nextBd = now >= bdThisYear ? new Date(y + 1, 4, 31) : bdThisYear;

        const elapsed = now.getTime() - lastBd.getTime();
        const total = nextBd.getTime() - lastBd.getTime();

        const exp = Math.round((elapsed / total) * 12000);
        const pct = Math.round((elapsed / total) * 100);
        return { exp, pct };
    }

    const { exp, pct } = calculateExp();

    return (
        <div className="font-mono text-body text-xs" style={{ background: 'var(--card)' }}>

            {/* ── Header: Portrait + Identity ──────────────────── */}
            <div
                className="flex gap-3 p-4 border-b border-primary/20"
                style={{ background: 'var(--surface)' }}
            >
                {/* Portrait frame */}
                <div className="relative shrink-0">
                    <div
                        className="w-18 h-18 flex items-center justify-center text-4xl"
                        style={{
                            background: 'var(--gradient-bg)',
                            border: '1px solid var(--primary)',
                            boxShadow: '0 0 12px var(--primary-glow-sm), inset 0 0 12px var(--primary-glow-sm)',
                        }}
                    >
                        <Image
                            src="/images/ore.webp"
                            width={64}
                            height={64}
                            alt="Profile picture"
                        />
                    </div>
                    {['top-0 left-0 border-t border-l', 'top-0 right-0 border-t border-r', 'bottom-0 left-0 border-b border-l', 'bottom-0 right-0 border-b border-r'].map((pos, i) => (
                        <div key={i} className={`absolute w-2.5 h-2.5 border-primary ${pos}`} />
                    ))}
                </div>

                {/* Identity block */}
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-sm font-bold text-white tracking-wider">NIMESH SHAKYA</span>
                        <span
                            className="text-[10px] border border-primary/40 px-1.5 py-px rounded"
                            style={{ color: 'var(--primary)', background: 'var(--primary-glow-sm)' }}
                        >
                            LVL {calculateLevel()}
                        </span>
                    </div>
                    <span className="text-primary text-[11px]">Software Engineer</span>
                    <span className="text-muted text-[10px]">📍 Sendai, Japan</span>

                    {/* XP bar */}
                    <div className="mt-1">
                        <div className="flex justify-between text-[9px] text-muted mb-0.5">
                            <span>EXP  {exp.toLocaleString()} / 12,000</span>
                            <span>{pct}%</span>
                        </div>
                        <div className="h-1.5 rounded-sm overflow-hidden" style={{ background: 'var(--card)' }}>
                            <div
                                className="h-full rounded-sm"
                                style={{ width: `${pct}%`, background: 'var(--gradient-cta)' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Status column */}
                <div className="flex flex-col gap-1 items-end shrink-0">
                    <span
                        className="text-[9px] px-1.5 py-0.5 rounded border border-success/30"
                        style={{ color: 'var(--success)', background: 'rgba(74,222,128,0.08)' }}
                    >
                        ● Active
                    </span>
                    <span
                        className="text-[9px] px-1.5 py-0.5 rounded border border-primary/30"
                        style={{ color: 'var(--primary)', background: 'var(--primary-glow-sm)' }}
                    >
                        🏢 Employed
                    </span>
                    <span
                        className="text-[9px] px-1.5 py-0.5 rounded border border-warning/30"
                        style={{ color: 'var(--warning)', background: 'rgba(234,179,8,0.08)' }}
                    >
                        💼 Available
                    </span>
                </div>
            </div>

            {/* ── Tabs ─────────────────────────────────────────── */}
            <div className="flex border-b border-primary/20" style={{ background: 'var(--surface)' }}>
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className="flex-1 py-2 text-[11px] font-semibold tracking-wide transition-colors"
                        style={{
                            color: activeTab === tab.id ? 'var(--primary)' : 'var(--muted)',
                            borderBottom: activeTab === tab.id ? '2px solid var(--primary)' : '2px solid transparent',
                            background: 'transparent',
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ── Tab Content ──────────────────────────────────── */}
            <div className="px-4 py-3">
                {activeTab === 'about' && (
                    <p
                        className="text-[11px] leading-relaxed"
                        style={{ color: 'var(--body)', opacity: 0.85 }}
                    >
                        I am a full-stack software engineer experienced in building scalable web and mobile applications, with a focus on real-time systems, performance optimization, and user-centered design. 
                        I have worked on production applications serving thousands of users, collaborating across cross-functional and international teams. 
                        As I continue growing as an engineer, I am now seeking opportunities to transition into game development and immersive simulation, particularly in XR (AR/VR/MR), 
                        where I can apply my engineering foundation to building interactive, responsive, and meaningful virtual environments.
                    </p>
                )}

                {activeTab === 'contact' && (
                    <div className="space-y-2">
                        {[
                            { key: 'Email', val: 'nimesh.ffxiv@gmail.com' },
                            { key: 'Location', val: 'Sendai, Miyagi Prefecture, JP' },
                            { key: 'Timezone', val: 'UTC+9  (JST)' },
                        ].map(({ key, val }) => (
                            <div key={key} className="flex gap-3 items-baseline">
                                <span className="text-[9px] text-muted w-14 shrink-0">{key}</span>
                                <span className="text-[10px]" style={{ color: 'var(--body)' }}>{val}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    )
}
