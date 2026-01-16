"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function DistributionPieChart({ promoters, neutrals, detractors }: { promoters: number, neutrals: number, detractors: number }) {
    const data = [
        { name: 'Promotores', value: promoters, colorId: 'gradient-promoter' },
        { name: 'Neutros', value: neutrals, colorId: 'gradient-neutral' },
        { name: 'Detratores', value: detractors, colorId: 'gradient-detractor' },
    ].filter(item => item.value > 0);

    if (data.length === 0) return <p>Sem dados</p>;

    return (
        <div style={{ width: '100%', height: 250 }}>

            <ResponsiveContainer>
                <PieChart>
                    <defs>
                        <linearGradient id="gradient-promoter" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#34D399" />
                            <stop offset="100%" stopColor="#059669" />
                        </linearGradient>
                        <linearGradient id="gradient-neutral" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#FBBF24" />
                            <stop offset="100%" stopColor="#D97706" />
                        </linearGradient>
                        <linearGradient id="gradient-detractor" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#F87171" />
                            <stop offset="100%" stopColor="#DC2626" />
                        </linearGradient>
                    </defs>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                        cornerRadius={6}
                    >

                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`url(#${entry.colorId})`} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            borderRadius: '12px',
                            border: 'none',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                            background: 'var(--color-surface)',
                            color: 'var(--color-text-main)'
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
