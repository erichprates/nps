"use client";

import { useState, useMemo } from 'react';
import { NPSResponse } from "@/lib/types";
import ResponseList from "./ResponseList";
import ResponseDetailsModal from "./ResponseDetailsModal";
import { Search, Users, LayoutGrid } from 'lucide-react';
import styles from "./DashboardStats.module.css";
import { useSearchParams } from 'next/navigation';

export default function ResponsesContainer({ initialData }: { initialData: NPSResponse[] }) {
    const searchParams = useSearchParams();
    const initialFilter = searchParams.get('filter') as 'all' | 'promoter' | 'neutral' | 'detractor';

    const [filter, setFilter] = useState<'all' | 'promoter' | 'neutral' | 'detractor'>(initialFilter || 'all');
    const [surveyCategory, setSurveyCategory] = useState<'geral' | 'pos-venda' | 'pre-venda'>('geral');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedResponse, setSelectedResponse] = useState<NPSResponse | null>(null);

    // Filter Logic
    const filteredData = useMemo(() => {
        return initialData.filter(response => {
            // Category Filter
            if (surveyCategory !== 'geral' && response.surveyCategory !== surveyCategory) return false;

            // Score Filter
            if (filter === 'promoter' && response.score < 9) return false;
            if (filter === 'neutral' && (response.score < 7 || response.score > 8)) return false;
            if (filter === 'detractor' && response.score > 6) return false;

            // Search Query
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const nameMatch = response.customerName?.toLowerCase().includes(query);
                const emailMatch = response.customerEmail?.toLowerCase().includes(query);
                const phoneMatch = response.customerPhone?.toLowerCase().includes(query);
                if (!nameMatch && !emailMatch && !phoneMatch) return false;
            }

            return true;
        });
    }, [initialData, surveyCategory, filter, searchQuery]);

    const stats = useMemo(() => {
        const categoryData = surveyCategory === 'geral'
            ? initialData
            : initialData.filter(d => d.surveyCategory === surveyCategory);

        return {
            all: categoryData.length,
            promoters: categoryData.filter(r => r.score >= 9).length,
            neutrals: categoryData.filter(r => r.score >= 7 && r.score <= 8).length,
            detractors: categoryData.filter(r => r.score <= 6).length
        };
    }, [initialData, surveyCategory]);

    return (
        <div>
            {/* Consolidated Filter Bar */}
            <div className={styles.filterBar}>
                {/* Search */}
                <div className={styles.searchWrapper}>
                    <Search className={styles.searchIcon} size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por nome, email ou telefone..."
                        className={styles.searchInput}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Categories - Segmented Control */}
                <div className={styles.segmentedControl}>
                    <button
                        onClick={() => setSurveyCategory('geral')}
                        className={`${styles.segmentButton} ${surveyCategory === 'geral' ? styles.segmentButtonActive : ''}`}
                    >
                        GERAL
                    </button>
                    <button
                        onClick={() => setSurveyCategory('pos-venda')}
                        className={`${styles.segmentButton} ${surveyCategory === 'pos-venda' ? styles.segmentButtonActive : ''}`}
                    >
                        PÓS-VENDAS
                    </button>
                    <button
                        onClick={() => setSurveyCategory('pre-venda')}
                        className={`${styles.segmentButton} ${surveyCategory === 'pre-venda' ? styles.segmentButtonActive : ''}`}
                    >
                        PRÉ-VENDA
                    </button>
                </div>

                {/* Score Status Filters */}
                <div className={styles.statusFilter}>
                    <div
                        className={`${styles.statusBadge} ${styles.all} ${filter !== 'all' ? styles.statusBadgeInactive : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        <LayoutGrid size={14} />
                        TODAS ({stats.all})
                    </div>
                    <div
                        className={`${styles.statusBadge} ${styles.promoter} ${filter !== 'promoter' && filter !== 'all' ? styles.statusBadgeInactive : ''}`}
                        onClick={() => setFilter('promoter')}
                    >
                        <Users size={14} />
                        PROMOTORES ({stats.promoters})
                    </div>
                    <div
                        className={`${styles.statusBadge} ${styles.neutral} ${filter !== 'neutral' && filter !== 'all' ? styles.statusBadgeInactive : ''}`}
                        onClick={() => setFilter('neutral')}
                    >
                        <Users size={14} />
                        NEUTROS ({stats.neutrals})
                    </div>
                    <div
                        className={`${styles.statusBadge} ${styles.detractor} ${filter !== 'detractor' && filter !== 'all' ? styles.statusBadgeInactive : ''}`}
                        onClick={() => setFilter('detractor')}
                    >
                        <Users size={14} />
                        DETRATORES ({stats.detractors})
                    </div>
                </div>
            </div>

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
