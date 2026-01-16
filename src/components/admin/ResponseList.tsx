"use client";

import { useState, useEffect } from 'react';
import { NPSResponse } from "@/lib/types";
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import styles from './ResponseList.module.css';
import { motion, AnimatePresence } from 'framer-motion';

interface ResponseListProps {
    data: NPSResponse[];
    onSelectResponse: (response: NPSResponse) => void;
}

const ITEMS_PER_PAGE = 10;

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function ResponseList({ data, onSelectResponse }: ResponseListProps) {
    const [currentPage, setCurrentPage] = useState(1);

    // Reset page when data changes (e.g. filter applied)
    useEffect(() => {
        setCurrentPage(1);
    }, [data]);

    // Sort data by date descending (newest first)
    const sortedData = [...data].reverse();

    const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentData = sortedData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // Helpers
    const getScoreBadge = (score: number) => {
        if (score >= 9) return { bg: 'rgba(16, 185, 129, 0.1)', color: '#059669' };
        if (score <= 6) return { bg: 'rgba(239, 68, 68, 0.1)', color: '#DC2626' };
        return { bg: 'rgba(245, 158, 11, 0.1)', color: '#D97706' };
    };

    const formatPhoneNumber = (phone: string) => {
        if (!phone || phone === '-' || phone === 'undefined') return '-';
        const cleaned = ('' + phone).replace(/\D/g, '');
        if (cleaned.length === 11) {
            return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7)}`;
        } else if (cleaned.length === 10) {
            return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 6)}-${cleaned.substring(6)}`;
        }
        return phone;
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <motion.div
            className={`card ${styles.container}`}
            style={{ display: 'flex', flexDirection: 'column' }}
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            {data.length === 0 ? (
                <motion.div
                    variants={itemVariants}
                    style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}
                >
                    Nenhuma resposta encontrada para este filtro.
                </motion.div>
            ) : (
                <>
                    <motion.div variants={itemVariants} className={styles.tableContainer} style={{ flex: 1 }}>
                        <table className={styles.table}>
                            <thead className={styles.thead}>
                                <tr>
                                    <th className={styles.th}>Data</th>
                                    <th className={styles.th}>Cliente</th>
                                    <th className={styles.th}>Categoria</th>
                                    <th className={`${styles.th} ${styles.colEmail}`}>Email</th>
                                    <th className={`${styles.th} ${styles.colWhatsapp}`}>WhatsApp</th>
                                    <th className={styles.th} style={{ textAlign: 'center' }}>Nota</th>
                                    <th className={styles.th} style={{ textAlign: 'right' }}>Ação</th>
                                </tr>
                            </thead>
                            <tbody className={styles.tbody}>
                                {currentData.map((row, i) => {
                                    const style = getScoreBadge(row.score);
                                    // Extract just the date part (DD/MM/YYYY) and remove any trailing commas
                                    const dateOnly = row.date.split(' ')[0].replace(',', '');

                                    const rowClass = row.score >= 9 ? styles.trPromoter : row.score <= 6 ? styles.trDetractor : styles.trNeutral;

                                    return (
                                        <motion.tr
                                            key={row.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{
                                                duration: 0.15,
                                                delay: i * 0.01
                                            }}
                                            onClick={() => onSelectResponse(row)}
                                            className={`${styles.tr} ${rowClass}`}
                                        >
                                            <td className={`${styles.td} ${styles.colDate}`}>
                                                {dateOnly}
                                            </td>
                                            <td className={`${styles.td} ${styles.colClient}`} style={{ fontWeight: 700 }}>
                                                <div className={styles.clientBadgeContainer}>
                                                    {row.customerName}
                                                    {row.origin === 'Stand' && (
                                                        <span className={styles.totemBadge}>TOTEM</span>
                                                    )}
                                                    {/* Mobile only badge shown below name */}
                                                    <div className={styles.categoryBadgeMobile}>
                                                        <span className={`${styles.categoryBadge} ${row.surveyCategory === 'pre-venda' ? styles.categoryPre : styles.categoryPos}`}>
                                                            {row.surveyCategory === 'pre-venda' ? 'PRÉ-VENDA' : 'PÓS-VENDAS'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className={`${styles.td} ${styles.colCategory} ${styles.desktopOnly}`}>
                                                <span className={`${styles.categoryBadge} ${row.surveyCategory === 'pre-venda' ? styles.categoryPre : styles.categoryPos}`}>
                                                    {row.surveyCategory === 'pre-venda' ? 'PRÉ-VENDA' : 'PÓS-VENDAS'}
                                                </span>
                                            </td>
                                            <td className={`${styles.td} ${styles.colEmail}`}>
                                                {row.customerEmail !== '-' ? row.customerEmail : '-'}
                                            </td>
                                            <td className={`${styles.td} ${styles.colWhatsapp}`}>
                                                {row.customerPhone && row.customerPhone !== '-' ? (
                                                    <a
                                                        href={`https://wa.me/55${row.customerPhone.replace(/\D/g, '')}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{ color: '#16a34a', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        {formatPhoneNumber(row.customerPhone)}
                                                    </a>
                                                ) : '-'}
                                            </td>
                                            <td className={`${styles.td} ${styles.colScore}`}>
                                                <span className={styles.scoreBadge} style={{
                                                    background: style.bg,
                                                    color: style.color,
                                                }}>
                                                    {row.score}
                                                </span>
                                            </td>
                                            <td className={`${styles.td} ${styles.colAction}`} style={{ textAlign: 'right' }}>
                                                <button className={styles.actionBtn}>
                                                    <Search size={18} />
                                                    <span className={styles.actionText}>Detalhes</span>
                                                </button>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </motion.div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <motion.div variants={itemVariants} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderTop: '1px solid var(--color-border)' }}>
                            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                                {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, data.length)} de {data.length}
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="btn btn-outline"
                                    style={{ padding: '0.5rem', opacity: currentPage === 1 ? 0.5 : 1 }}
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="btn btn-outline"
                                    style={{ padding: '0.5rem', opacity: currentPage === totalPages ? 0.5 : 1 }}
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </>
            )}
        </motion.div>
    );
}
