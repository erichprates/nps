"use client";

import { useState, useMemo } from 'react';
import { NPSResponse } from "@/lib/types";
import DashboardStats from "./DashboardStats";
import ResponseList from "./ResponseList";
import ResponseDetailsModal from "./ResponseDetailsModal";

export default function DashboardContainer({ initialData }: { initialData: NPSResponse[] }) {
    const [filter, setFilter] = useState<'all' | 'promoter' | 'neutral' | 'detractor'>('all');
    const [selectedResponse, setSelectedResponse] = useState<NPSResponse | null>(null);

    // Filter data based on selection
    const filteredData = useMemo(() => {
        if (filter === 'all') return initialData;

        return initialData.filter(response => {
            if (filter === 'promoter') return response.score >= 9;
            if (filter === 'neutral') return response.score >= 7 && response.score <= 8;
            if (filter === 'detractor') return response.score <= 6;
            return true;
        });
    }, [initialData, filter]);

    return (
        <div>
            <DashboardStats
                data={initialData}
                selectedFilter={filter}
                onFilterSelect={setFilter}
            />

            <h2 style={{ fontSize: '1.25rem', marginTop: '3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Respostas
                {filter !== 'all' && (
                    <span style={{
                        fontSize: '0.875rem',
                        fontWeight: 400,
                        color: 'var(--color-text-muted)',
                        background: 'var(--color-surface)',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        border: '1px solid var(--color-border)'
                    }}>
                        Filtro: {filter === 'promoter' ? 'Promotores' : filter === 'neutral' ? 'Neutros' : 'Detratores'}
                    </span>
                )}
            </h2>

            <ResponseList
                data={filteredData}
                onSelectResponse={setSelectedResponse}
            />

            <ResponseDetailsModal
                response={selectedResponse}
                onClose={() => setSelectedResponse(null)}
            />
        </div>
    );
}
