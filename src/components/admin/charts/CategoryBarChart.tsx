"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CategoryData } from '@/lib/analytics';

export default function CategoryBarChart({ data }: { data: CategoryData[] }) {
    if (data.length === 0) return <p>Sem dados</p>;

    // Helper to determine color based on NPS
    const getColor = (nps: number) => {
        if (nps >= 75) return '#10B981'; // Green
        if (nps >= 50) return '#F59E0B'; // Yellow
        return '#EF4444'; // Red
    };

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid stroke="#eee" horizontal={true} vertical={false} />
                    <XAxis type="number" domain={[-100, 100]} hide />
                    <YAxis
                        dataKey="name"
                        type="category"
                        width={100}
                        tick={{ fill: '#374151', fontSize: 13, fontWeight: 500 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Bar dataKey="nps" radius={[0, 4, 4, 0]} barSize={32}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getColor(entry.nps)} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
