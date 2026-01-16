"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { NPSResponse } from "@/lib/types";
import { getTrendData, getCategoryData, TimeFilter } from "@/lib/analytics";
import NPSLineChart from "./charts/NPSLineChart";
import CategoryBarChart from "./charts/CategoryBarChart";
import DistributionPieChart from "./charts/DistributionPieChart";
import { Users, TrendingUp, Award, BarChart3, PieChart, User } from 'lucide-react';

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

interface DashboardStatsProps {
    data: NPSResponse[];
    selectedFilter: 'all' | 'promoter' | 'neutral' | 'detractor';
    onFilterSelect: (filter: 'all' | 'promoter' | 'neutral' | 'detractor') => void;
}

export default function DashboardStats({ data, selectedFilter, onFilterSelect }: DashboardStatsProps) {
    const [timeFilter, setTimeFilter] = useState<TimeFilter>('day');
    const total = data.length;

    if (total === 0) {
        return (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Nenhum dado encontrado</h3>
                <p style={{ color: 'var(--color-text-muted)' }}>Compartilhe o link da pesquisa para começar a receber respostas.</p>
            </div>
        );
    }

    // Analytics
    const promoters = data.filter(r => r.score >= 9).length;
    const detractors = data.filter(r => r.score <= 6).length;
    const neutrals = data.filter(r => r.score >= 7 && r.score <= 8).length;
    const nps = Math.round(((promoters - detractors) / total) * 100);

    const trendData = getTrendData(data, timeFilter);
    const categoryData = getCategoryData(data);

    // Color helpers for NPS Card
    const getNPSCardStyle = (score: number) => {
        // >= 50: Green (Excellent/Good)
        if (score >= 50) return {
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', // Emerald Gradient
            text: '#fff',
            iconColor: 'rgba(255,255,255,0.9)',
            label: 'Excelente'
        };

        // 0 to 49: Yellow (Improvement)
        if (score >= 0) return {
            background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', // Amber Gradient
            text: '#fff',
            iconColor: 'rgba(255,255,255,0.9)',
            label: 'Aperfeiçoar'
        };

        // < 0: Red (Critical)
        return {
            background: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)', // Red Gradient
            text: '#fff',
            iconColor: 'rgba(255,255,255,0.9)',
            label: 'Crítico'
        };
    };

    const npsStyle = getNPSCardStyle(nps);

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}
        >

            {/* Top Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <motion.div
                    variants={itemVariants}
                    className="card"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: npsStyle.background,
                        color: npsStyle.text,
                        border: 'none',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                    }}
                >
                    <div>
                        <p style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.25rem' }}>NPS Score</p>
                        <h2 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: 0, lineHeight: 1 }}>{nps}</h2>
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, opacity: 0.9 }}>
                            {npsStyle.label}
                        </span>
                    </div>
                    <div style={{ width: 56, height: 56, borderRadius: '16px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                        <Award size={32} color={npsStyle.iconColor} />
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Total Respostas</p>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: 0 }}>{total}</h2>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Todas as pesquisas</span>
                    </div>
                    <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'var(--color-background)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Users size={24} color="var(--color-primary)" />
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Satisfação</p>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: 0 }}>{Math.round((promoters / total) * 100)}%</h2>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Clientes Promotores</span>
                    </div>
                    <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'var(--color-background)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <TrendingUp size={24} color="#10B981" />
                    </div>
                </motion.div>
            </div>

            {/* Charts Row 1: Evolution (Line) approx 2/3 width, Distribution (Pie) 1/3 width */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <motion.div variants={itemVariants} className="card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <TrendingUp size={20} color="var(--color-text-muted)" />
                            <h3 style={{ fontSize: '1.125rem', margin: 0, color: 'var(--color-text-main)' }}>Evolução do NPS</h3>
                        </div>

                        {/* Date Filter */}
                        <div style={{ display: 'flex', background: 'var(--color-background)', borderRadius: '8px', padding: '4px' }}>
                            {['day', 'month', 'year'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setTimeFilter(f as TimeFilter)}
                                    style={{
                                        border: 'none',
                                        background: timeFilter === f ? 'var(--color-surface)' : 'transparent',
                                        color: timeFilter === f ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                        padding: '4px 12px',
                                        borderRadius: '6px',
                                        fontSize: '0.875rem',
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                        textTransform: 'capitalize',
                                        boxShadow: timeFilter === f ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
                                    }}
                                >
                                    {f === 'day' ? 'Dia' : f === 'month' ? 'Mês' : 'Ano'}
                                </button>
                            ))}
                        </div>
                    </div>
                    <NPSLineChart data={trendData} />
                </motion.div>

                <motion.div variants={itemVariants} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <PieChart size={20} color="var(--color-text-muted)" />
                        <h3 style={{ fontSize: '1.125rem', margin: 0, color: 'var(--color-text-main)' }}>Distribuição</h3>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', flex: 1, alignItems: 'center', gap: '2rem' }}>
                        {/* Chart Area */}
                        <div style={{ flex: '1 1 50%', minWidth: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <DistributionPieChart promoters={promoters} neutrals={neutrals} detractors={detractors} />
                        </div>

                        {/* Custom Legend - Now with Cards/Backgrounds - CLICKABLE */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: '1 1 50%', minWidth: 160 }}>
                            {/* Promoters Card */}
                            <div
                                onClick={() => onFilterSelect(selectedFilter === 'promoter' ? 'all' : 'promoter')}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.75rem',
                                    borderRadius: '12px',
                                    background: 'rgba(16, 185, 129, 0.1)',
                                    border: selectedFilter === 'promoter' ? '2px solid #10B981' : '1px solid rgba(16, 185, 129, 0.2)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    transform: selectedFilter === 'promoter' ? 'scale(1.02)' : 'scale(1)'
                                }}
                            >
                                <div style={{
                                    width: 36, height: 36, borderRadius: '8px',
                                    background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <User size={18} color="#fff" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Promotores</div>
                                    <div style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--color-text-main)' }}>{promoters}</div>
                                </div>
                            </div>

                            {/* Neutrals Card */}
                            <div
                                onClick={() => onFilterSelect(selectedFilter === 'neutral' ? 'all' : 'neutral')}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.75rem',
                                    borderRadius: '12px',
                                    background: 'rgba(245, 158, 11, 0.1)',
                                    border: selectedFilter === 'neutral' ? '2px solid #F59E0B' : '1px solid rgba(245, 158, 11, 0.2)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    transform: selectedFilter === 'neutral' ? 'scale(1.02)' : 'scale(1)'
                                }}
                            >
                                <div style={{
                                    width: 36, height: 36, borderRadius: '8px',
                                    background: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <User size={18} color="#fff" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Neutros</div>
                                    <div style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--color-text-main)' }}>{neutrals}</div>
                                </div>
                            </div>

                            {/* Detractors Card */}
                            <div
                                onClick={() => onFilterSelect(selectedFilter === 'detractor' ? 'all' : 'detractor')}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.75rem',
                                    borderRadius: '12px',
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    border: selectedFilter === 'detractor' ? '2px solid #EF4444' : '1px solid rgba(239, 68, 68, 0.2)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    transform: selectedFilter === 'detractor' ? 'scale(1.02)' : 'scale(1)'
                                }}
                            >
                                <div style={{
                                    width: 36, height: 36, borderRadius: '8px',
                                    background: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <User size={18} color="#fff" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Detratores</div>
                                    <div style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--color-text-main)' }}>{detractors}</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </motion.div>
            </div>

            {/* Charts Row 2: Category (Bar) Full width */}
            <motion.div variants={itemVariants} className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <BarChart3 size={20} color="var(--color-text-muted)" />
                    <h3 style={{ fontSize: '1.125rem', margin: 0, color: 'var(--color-text-main)' }}>NPS por Experiência</h3>
                </div>
                <CategoryBarChart data={categoryData} />
            </motion.div>

        </motion.div>
    );
}
