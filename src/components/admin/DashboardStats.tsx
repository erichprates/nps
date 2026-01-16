"use client";

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { NPSResponse } from "@/lib/types";
import { getTrendData, getCategoryData, getCorrelationData, getSmartInsights, TimeFilter } from "@/lib/analytics";
import NPSLineChart from "./charts/NPSLineChart";
import CategoryBarChart from "./charts/CategoryBarChart";
import DistributionPieChart from "./charts/DistributionPieChart";
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle2, Lightbulb, ChevronDown, ChevronUp, Users, Award, MessageSquare } from 'lucide-react';
import styles from './DashboardStats.module.css';

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
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring" as const,
            stiffness: 100,
            damping: 15
        }
    }
};

const hoverVariants = {
    hover: {
        y: -5,
        scale: 1.02,
        transition: { type: "spring" as const, stiffness: 400, damping: 10 }
    },
    tap: { scale: 0.98 }
};

import { useRouter } from 'next/navigation';

interface DashboardStatsProps {
    data: NPSResponse[];
    selectedFilter?: 'all' | 'promoter' | 'neutral' | 'detractor';
    onFilterSelect?: (filter: 'all' | 'promoter' | 'neutral' | 'detractor') => void;
}

export default function DashboardStats({ data, selectedFilter, onFilterSelect }: DashboardStatsProps) {
    const router = useRouter();
    const [timeFilter, setTimeFilter] = useState<TimeFilter>('day');
    const [surveyCategory, setSurveyCategory] = useState<'geral' | 'pos-venda' | 'pre-venda'>('geral');
    const [showInsights, setShowInsights] = useState(true);
    const [showNPSRule, setShowNPSRule] = useState(false);
    const [showExpRule, setShowExpRule] = useState(false);

    const filteredByCategory = useMemo(() => {
        if (surveyCategory === 'geral') return data;
        return data.filter(d => d.surveyCategory === surveyCategory);
    }, [data, surveyCategory]);

    const promoters = filteredByCategory.filter(d => d.score >= 9);
    const neutrals = filteredByCategory.filter(d => d.score >= 7 && d.score <= 8);
    const detractors = filteredByCategory.filter(d => d.score <= 6);
    const total = filteredByCategory.length;

    const nps = total > 0 ? Math.round(((promoters.length - detractors.length) / total) * 100) : 0;

    const trendData = useMemo(() => getTrendData(filteredByCategory, timeFilter), [filteredByCategory, timeFilter]);
    const categoryData = useMemo(() => getCategoryData(filteredByCategory), [filteredByCategory]);

    // New strategic analysis
    const keyPointsData = useMemo(() => getCorrelationData(filteredByCategory, 'keyPoints'), [filteredByCategory]);
    const improvementsData = useMemo(() => getCorrelationData(filteredByCategory, 'improvementAreas'), [filteredByCategory]);
    const insights = useMemo(() => getSmartInsights(filteredByCategory), [filteredByCategory]);

    // Category comparison calculation
    const getCategoryNPS = (cat: string) => {
        const catData = data.filter(d => d.surveyCategory === cat);
        const p = catData.filter(d => d.score >= 9).length;
        const d = catData.filter(d => d.score <= 6).length;
        const t = catData.length;
        return t > 0 ? Math.round(((p - d) / t) * 100) : 0;
    };

    const getCategoryExp = (cat: string) => {
        const catData = data.filter(d => d.surveyCategory === cat);
        const t = catData.length;
        if (t === 0) return 0;
        const rawAvg = catData.reduce((acc, d) => acc + (d.experienceScore || 0), 0) / t;
        return Math.min(100, Math.round(rawAvg));
    };

    const preStats = { nps: getCategoryNPS('pre-venda'), exp: getCategoryExp('pre-venda') };
    const posStats = { nps: getCategoryNPS('pos-venda'), exp: getCategoryExp('pos-venda') };

    const getNPSStyle = (score: number) => {
        if (score >= 50) return { color: '#10B981' };
        if (score >= 0) return { color: '#3B82F6' };
        return { color: '#EF4444' };
    };

    const getNPSCardStyle = (score: number) => {
        if (score >= 50) return { color: '#ffffff', bg: '#10B981', label: 'Excelente' };
        if (score >= 0) return { color: '#ffffff', bg: '#3B82F6', label: 'Regular' };
        return { color: '#ffffff', bg: '#EF4444', label: 'Crítico' };
    };

    const npsStyle = getNPSCardStyle(nps);

    return (
        <motion.div
            className={styles.container}
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            <motion.div variants={itemVariants} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', background: 'white', padding: '0.4rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid var(--color-border)' }}>
                    <button
                        onClick={() => setSurveyCategory('geral')}
                        className={styles.filterBtn}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            background: surveyCategory === 'geral' ? 'var(--color-primary)' : 'transparent',
                            color: surveyCategory === 'geral' ? 'white' : 'var(--color-text-muted)',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        GERAL
                    </button>
                    <button
                        onClick={() => setSurveyCategory('pos-venda')}
                        className={styles.filterBtn}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            background: surveyCategory === 'pos-venda' ? 'var(--color-primary)' : 'transparent',
                            color: surveyCategory === 'pos-venda' ? 'white' : 'var(--color-text-muted)',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        PÓS-VENDAS
                    </button>
                    <button
                        onClick={() => setSurveyCategory('pre-venda')}
                        className={styles.filterBtn}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            background: surveyCategory === 'pre-venda' ? 'var(--color-primary)' : 'transparent',
                            color: surveyCategory === 'pre-venda' ? 'white' : 'var(--color-text-muted)',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        PRÉ-VENDA
                    </button>
                </div>
            </motion.div>


            {/* Executive Summary / Insights */}




            <motion.div className={styles.topGrid} variants={containerVariants}>
                {/* Main NPS Card */}
                <motion.div
                    className={styles.npsCardV2}
                    variants={itemVariants}
                    whileHover="hover"
                    whileTap="tap"
                    style={{ backgroundColor: npsStyle.bg, color: npsStyle.color }}
                >
                    <div className={styles.cardHeaderV2}>
                        <span>NPS Score</span>
                        <div className={styles.iconCircle}>
                            <Award size={20} />
                        </div>
                    </div>
                    <div className={styles.npsValueV2}>
                        {nps}
                    </div>
                    <div className={styles.npsLabelV2}>
                        {npsStyle.label}
                    </div>
                </motion.div>

                {/* Experience Index Card */}
                <motion.div
                    className={styles.statCard}
                    variants={itemVariants}
                    whileHover="hover"
                    whileTap="tap"
                >
                    <div className={styles.cardHeaderV2}>
                        <span>Índice Exp.</span>
                        <div className={styles.iconCircleOrange}>
                            <TrendingUp size={20} />
                        </div>
                    </div>
                    {(() => {
                        const rawAvg = (filteredByCategory.reduce((acc, d) => acc + (d.experienceScore || 0), 0) / (total || 1));
                        const avgScore = Math.min(100, rawAvg);
                        const color = avgScore >= 80 ? '#10B981' : avgScore <= 40 ? '#EF4444' : '#F59E0B';
                        const label = avgScore >= 80 ? "Sentimentos positivos" :
                            avgScore <= 40 ? "Jornada comprometida" :
                                "Sem diferenciais marcantes";

                        return (
                            <>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', width: '100%' }}>
                                    <div className={styles.statValue}>
                                        {avgScore.toFixed(0)}
                                    </div>
                                    <div className={styles.miniProgressContainer}>
                                        <motion.div
                                            className={styles.miniProgressBar}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min(100, Math.max(0, avgScore))}%` }}
                                            transition={{ type: "spring", stiffness: 50, damping: 20 }}
                                            style={{ backgroundColor: color }}
                                        ></motion.div>
                                    </div>
                                </div>
                                <div className={styles.statSub}>
                                    {label}
                                </div>
                            </>
                        );
                    })()}
                </motion.div>



                {/* Total Responses Card */}
                <motion.div
                    className={styles.statCard}
                    variants={itemVariants}
                    whileHover="hover"
                    whileTap="tap"
                >
                    <div className={styles.cardHeaderV2}>
                        <span>Total Respostas</span>
                        <div className={styles.iconCircleGrey}>
                            <Users size={20} />
                        </div>
                    </div>
                    <div className={styles.statValue}>
                        {total}
                    </div>
                    <div className={styles.statSub}>
                        Todas as pesquisas
                    </div>
                </motion.div>

                {/* Satisfaction Card */}
                <motion.div className={styles.statCard} variants={itemVariants}>
                    <div className={styles.cardHeaderV2}>
                        <span>Satisfação</span>
                        <div className={styles.iconCircleGreen}>
                            <TrendingUp size={20} />
                        </div>
                    </div>
                    <div className={styles.statValue}>
                        {total > 0 ? Math.round((promoters.length / total) * 100) : 0}%
                    </div>
                    <div className={styles.statSub}>
                        Clientes Promotores
                    </div>
                </motion.div>
            </motion.div>

            {/* Main Charts Row */}
            <motion.div className={styles.chartsGrid} variants={containerVariants}>
                <motion.div className={styles.chartCard} variants={itemVariants}>
                    <div className={styles.cardHeader}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <TrendingUp size={20} />
                            <h3 style={{ margin: 0 }}>Evolução do NPS</h3>
                        </div>
                        <div className={styles.filterTabs}>
                            <button onClick={() => setTimeFilter('day')} className={timeFilter === 'day' ? styles.active : ''}>Dia</button>
                            <button onClick={() => setTimeFilter('month')} className={timeFilter === 'month' ? styles.active : ''}>Mês</button>
                            <button onClick={() => setTimeFilter('year')} className={timeFilter === 'year' ? styles.active : ''}>Ano</button>
                        </div>
                    </div>
                    <div className={styles.chartBox}>
                        <NPSLineChart data={trendData} />
                    </div>
                </motion.div>

                {/* Distribution Card */}
                <motion.div className={styles.distributionCardV2} variants={itemVariants}>
                    <div className={styles.cardHeader}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <AlertCircle size={20} />
                            <h3 style={{ margin: 0 }}>Distribuição</h3>
                        </div>
                    </div>
                    <div className={styles.pieContainerV2}>
                        <DistributionPieChart
                            promoters={promoters.length}
                            neutrals={neutrals.length}
                            detractors={detractors.length}
                        />
                    </div>
                    <div className={styles.distLegendV2}>
                        <motion.div
                            className={styles.legendBoxPromoter}
                            whileHover="hover"
                            whileTap="tap"
                            variants={hoverVariants}
                            onClick={() => {
                                if (onFilterSelect) onFilterSelect('promoter');
                                else router.push('/admin/responses?filter=promoter');
                            }}>
                            <div className={styles.legendIconBoxGreen}><Users size={16} /></div>
                            <div className={styles.legendTextBox}>
                                <span>PROMOTORES</span>
                                <strong>{promoters.length}</strong>
                            </div>
                        </motion.div>
                        <motion.div
                            className={styles.legendBoxNeutral}
                            whileHover="hover"
                            whileTap="tap"
                            variants={hoverVariants}
                            onClick={() => {
                                if (onFilterSelect) onFilterSelect('neutral');
                                else router.push('/admin/responses?filter=neutral');
                            }}>
                            <div className={styles.legendIconBoxYellow}><Users size={16} /></div>
                            <div className={styles.legendTextBox}>
                                <span>NEUTROS</span>
                                <strong>{neutrals.length}</strong>
                            </div>
                        </motion.div>
                        <motion.div
                            className={styles.legendBoxDetractor}
                            whileHover="hover"
                            whileTap="tap"
                            variants={hoverVariants}
                            onClick={() => {
                                if (onFilterSelect) onFilterSelect('detractor');
                                else router.push('/admin/responses?filter=detractor');
                            }}>
                            <div className={styles.legendIconBoxRed}><Users size={16} /></div>
                            <div className={styles.legendTextBox}>
                                <span>DETRATORES</span>
                                <strong>{detractors.length}</strong>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>


            {/* Strategic Correlation Row */}
            <motion.div className={styles.chartsGrid} variants={containerVariants}>
                {/* Category Comparison Grid */}
                <motion.div className={styles.chartCard} variants={itemVariants}>
                    <div className={styles.sectionHeader}>
                        <TrendingUp className={styles.insightIcon} />
                        <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--color-primary)' }}>Comparativo por Segmento</h3>
                    </div>

                    <div className={styles.comparisonGridV2}>
                        <div className={styles.compColumn}>
                            <div className={styles.compHeader}>PÓS-VENDAS</div>
                            <div className={styles.compCard}>
                                <div className={styles.compStat}>
                                    <span className={styles.compLabelV2}>NPS SCORE</span>
                                    <span className={styles.compValueV2} style={{ color: getNPSStyle(posStats.nps).color }}>{posStats.nps}</span>
                                </div>
                                <div className={styles.compStat}>
                                    <span className={styles.compLabelV2}>ÍNDICE EXP.</span>
                                    <span className={styles.compValueV2} style={{ color: '#F59E0B' }}>{posStats.exp}</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.compDivider}></div>

                        <div className={styles.compColumn}>
                            <div className={styles.compHeader} style={{ color: '#0369A1' }}>PRÉ-VENDA</div>
                            <div className={styles.compCard}>
                                <div className={styles.compStat}>
                                    <span className={styles.compLabelV2}>NPS SCORE</span>
                                    <span className={styles.compValueV2} style={{ color: getNPSStyle(preStats.nps).color }}>{preStats.nps}</span>
                                </div>
                                <div className={styles.compStat}>
                                    <span className={styles.compLabelV2}>ÍNDICE EXP.</span>
                                    <span className={styles.compValueV2} style={{ color: '#F59E0B' }}>{preStats.exp}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Experience Distribution Bars */}
                <motion.div className={styles.chartCard} variants={itemVariants}>
                    <div className={styles.sectionHeader}>
                        <TrendingUp className={styles.insightIcon} />
                        <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--color-primary)' }}>Distribuição de Vivência</h3>
                    </div>

                    <div className={styles.thermometerBars} style={{ marginTop: '1rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        {['Encantamento', 'Regular', 'Atrito'].map(label => {
                            const count = filteredByCategory.filter(d => d.experienceLabel === label).length;
                            const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                            const color = label === 'Encantamento' ? '#10B981' : label === 'Atrito' ? '#EF4444' : '#F59E0B';
                            return (
                                <div key={label} className={styles.thermometerBarItem} style={{ marginBottom: '1.5rem' }}>
                                    <div className={styles.barHeader}>
                                        <span style={{ fontWeight: 700 }}>{label}</span>
                                        <span style={{ fontWeight: 700 }}>{percentage}%</span>
                                    </div>
                                    <div className={styles.barBg}>
                                        <motion.div
                                            className={styles.barFill}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            transition={{ type: "spring", stiffness: 50, damping: 20 }}
                                            style={{ backgroundColor: color }}
                                        ></motion.div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            </motion.div>






            {/* Executive Summary / Insights moved to bottom */}
            {insights.length > 0 && (
                <div className={styles.insightsSection} style={{ marginBottom: '2rem' }}>
                    <div
                        className={styles.sectionHeader}
                        onClick={() => setShowInsights(!showInsights)}
                        style={{ cursor: 'pointer', justifyContent: 'space-between', marginBottom: showInsights ? '1.5rem' : '0' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Lightbulb className={styles.insightIcon} />
                            <h3>Insights Estratégicos</h3>
                        </div>
                        {showInsights ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>

                    <AnimatePresence>
                        {showInsights && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                style={{ overflow: 'hidden' }}
                            >
                                <div className={styles.insightsGrid}>
                                    {insights.map((insight, b) => (
                                        <div key={b} className={`${styles.insightCard} ${styles[insight.type]}`}>
                                            <div className={styles.insightHeader}>
                                                {insight.type === 'positive' ? <CheckCircle2 size={18} /> :
                                                    insight.type === 'negative' ? <AlertCircle size={18} /> : null}
                                                <span className={styles.insightTitle}>{insight.title}</span>
                                            </div>
                                            <p className={styles.insightDesc}>{insight.description}</p>
                                            {insight.action && <span className={styles.insightAction}><strong>Sugestão:</strong> {insight.action}</span>}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            {/* Explanation of Rules (NPS & Thermometer) as Accordions */}
            <div className={styles.infoBox} style={{ marginTop: '2rem', padding: 0, overflow: 'hidden' }}>
                {/* NPS Accordion */}
                <div style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <div
                        onClick={() => setShowNPSRule(!showNPSRule)}
                        style={{
                            padding: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            background: showNPSRule ? '#F8FAFC' : 'transparent',
                            transition: 'background 0.2s'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div className={styles.infoBadge}>Regra de Negócio</div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Como é calculado o NPS (Net Promoter Score)?</h3>
                        </div>
                        {showNPSRule ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>

                    <AnimatePresence>
                        {showNPSRule && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                style={{ overflow: 'hidden' }}
                            >
                                <div style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}>
                                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                                        O NPS é a métrica padrão global para medir a fidelidade do cliente. A pontuação varia de <strong>-100 a +100</strong>.
                                    </p>
                                    <div className={styles.infoGrid}>
                                        <div className={styles.infoItem}>
                                            <div className={styles.statusDot} style={{ background: '#10B981' }}></div>
                                            <div>
                                                <strong>Promotores (Notas 9 e 10)</strong>
                                                <p>Clientes leais que continuam comprando e recomendam a PortoBay para outras pessoas.</p>
                                            </div>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <div className={styles.statusDot} style={{ background: '#3B82F6' }}></div>
                                            <div>
                                                <strong>Neutros (Notas 7 e 8)</strong>
                                                <p>Clientes satisfeitos, mas não entusiasmados, que podem mudar para a concorrência.</p>
                                            </div>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <div className={styles.statusDot} style={{ background: '#EF4444' }}></div>
                                            <div>
                                                <strong>Detratores (Notas 0 a 6)</strong>
                                                <p>Clientes insatisfeitos que podem prejudicar a imagem da marca através de comentários negativos.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{
                                        marginTop: '1.5rem',
                                        padding: '1rem',
                                        background: '#F1F5F9',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '1rem',
                                        fontSize: '0.95rem',
                                        border: '1px dashed #CBD5E1'
                                    }}>
                                        <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>Fórmula:</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800 }}>
                                            <span style={{ color: '#10B981' }}>% Promotores</span>
                                            <span style={{ color: '#64748B' }}>−</span>
                                            <span style={{ color: '#EF4444' }}>% Detratores</span>
                                            <span style={{ color: '#64748B' }}>=</span>
                                            <span style={{ color: 'var(--color-primary)', background: 'white', padding: '0.2rem 0.6rem', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>NPS Final</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Thermometer Accordion */}
                <div>
                    <div
                        onClick={() => setShowExpRule(!showExpRule)}
                        style={{
                            padding: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            background: showExpRule ? '#F8FAFC' : 'transparent',
                            transition: 'background 0.2s'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div className={styles.infoBadge} style={{ background: '#F59E0B' }}>Jornada</div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Como funciona o Termômetro de Experiência PortoBay?</h3>
                        </div>
                        {showExpRule ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>

                    <AnimatePresence>
                        {showExpRule && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                style={{ overflow: 'hidden' }}
                            >
                                <div style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}>
                                    <div className={styles.infoGrid}>
                                        <div className={styles.infoItem}>
                                            <div className={`${styles.statusDot} ${styles.excellent}`}></div>
                                            <div>
                                                <strong>Encantamento (80 a 100)</strong>
                                                <p>Superou as expectativas. Jornada fluida, sem atritos e com sentimentos positivos.</p>
                                            </div>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <div className={`${styles.statusDot} ${styles.regular}`}></div>
                                            <div>
                                                <strong>Regular (41 a 79)</strong>
                                                <p>Entrega o que foi prometido, mas sem diferenciais marcantes ou com pequenos ruídos.</p>
                                            </div>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <div className={`${styles.statusDot} ${styles.critical}`}></div>
                                            <div>
                                                <strong>Atrito (40 ou menos)</strong>
                                                <p>Jornada comprometida ou presença de falhas críticas de comunicação.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}

