"use client";

import { createPortal } from 'react-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Calendar, MessageSquare, Star, Folder, Mail, Phone, Pencil, Save, Building, Loader2, CheckCircle2, TrendingUp, AlertCircle } from 'lucide-react';

import { NPSResponse } from "@/lib/types";
import styles from './ResponseDetailsModal.module.css';
import { updateResponse } from '@/lib/actions';
import { calculateExperienceScore } from '@/lib/analytics';


interface ResponseDetailsModalProps {
    response: NPSResponse | null;
    onClose: () => void;
}

const PROJECTS = [
    'PortoBay Praia Grande',
    'PortoBay Tenório',
    'PortoBay Verano'
];

export default function ResponseDetailsModal({ response, onClose }: ResponseDetailsModalProps) {
    const [mounted, setMounted] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Internal state for editing. Initialize when response changes.
    const [editForm, setEditForm] = useState({
        name: '',
        email: '',
        phone: '',
        origin: ''
    });

    useEffect(() => {
        setMounted(true);
        if (response) {
            document.body.style.overflow = 'hidden';
            setEditForm({
                name: response.customerName || '',
                email: response.customerEmail !== '-' ? response.customerEmail : '',
                phone: response.customerPhone !== '-' ? response.customerPhone : '',
                origin: response.origin || PROJECTS[0]
            });
            setIsEditing(false); // Reset edit mode on new response
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [response]);

    if (!mounted) return null;

    const handleSave = async () => {
        if (!response) return;
        setIsSaving(true);

        try {
            await updateResponse(response.id, {
                name: editForm.name,
                email: editForm.email,
                phone: editForm.phone,
                origin: editForm.origin
            });

            onClose();

        } catch (error) {
            alert('Erro ao salvar.');
        } finally {
            setIsSaving(false);
        }
    };

    // Helper to get score color
    const getScoreColor = (score: number) => {
        if (score >= 9) return 'var(--color-success)';
        if (score <= 6) return 'var(--color-error)';
        return '#F59E0B'; // Amber
    };

    const formatPhoneNumber = (phone: string) => {
        if (!phone || phone === '-' || phone === 'undefined') return 'Não informado';
        const cleaned = ('' + phone).replace(/\D/g, '');
        if (cleaned.length === 11) {
            return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7)}`;
        } else if (cleaned.length === 10) {
            return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 6)}-${cleaned.substring(6)}`;
        }
        return phone;
    };

    // Mask for input
    const handlePhoneChange = (val: string) => {
        val = val.replace(/\D/g, '');
        if (val.length > 11) val = val.slice(0, 11);
        val = val.replace(/^(\d{2})(\d)/, '($1) $2');
        val = val.replace(/(\d)(\d{4})$/, '$1-$2');
        setEditForm(prev => ({ ...prev, phone: val }));
    }

    const modalContent = (
        <AnimatePresence>
            {response && (
                <motion.div
                    key="backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className={styles.backdrop}
                >
                    <motion.div
                        key="modal"
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className={styles.modal}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header Actions */}
                        <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem' }}>
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="btn-outline"
                                    style={{ padding: '0.5rem', border: 'none', color: 'var(--color-primary)' }}
                                    title="Editar Dados"
                                >
                                    <Pencil size={20} />
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="btn-outline"
                                        style={{ padding: '0.5rem', border: 'none', color: 'var(--color-text-muted)' }}
                                        title="Cancelar"
                                        disabled={isSaving}
                                    >
                                        <X size={20} />
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="btn-primary"
                                        style={{ padding: '0.5rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}
                                        title="Salvar"
                                        disabled={isSaving}
                                    >
                                        {isSaving ? <Loader2 size={20} className="spin" /> : <Save size={20} />}
                                    </button>
                                </>
                            )}
                            {!isEditing && (
                                <button
                                    onClick={onClose}
                                    className={styles.closeButton}
                                    style={{ position: 'static' }}
                                >
                                    <X size={24} />
                                </button>
                            )}
                        </div>

                        <div className={styles.header} style={{ paddingRight: '6rem' }}>
                            <div className={styles.avatar}>
                                {response.customerName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                {isEditing ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', width: '100%' }}>
                                        <input
                                            type="text"
                                            className="input"
                                            style={{ fontSize: '1.25rem', fontWeight: 700, padding: '0.4rem', width: '100%' }}
                                            value={editForm.name}
                                            onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                            placeholder="Nome do cliente"
                                        />
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                                            <Calendar size={14} />
                                            <span>{response.date}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                                            <h2 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--color-text-main)', lineHeight: 1.2 }}>{response.customerName}</h2>
                                            <span className={`${styles.categoryBadge} ${response.surveyCategory === 'pre-venda' ? styles.categoryPre : styles.categoryPos}`}>
                                                {response.surveyCategory === 'pre-venda' ? 'PRÉ-VENDA' : 'PÓS-VENDAS'}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                                            <Calendar size={14} />
                                            <span>{response.date}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className={styles.statsGrid} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', marginBottom: '1.5rem' }}>
                            <div className={styles.statCard}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                                    <Star size={14} />
                                    <span>Nota NPS</span>
                                </div>
                                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: getScoreColor(response.score) }}>
                                    {response.score}
                                </div>
                            </div>

                            <div className={styles.statCard} style={{ background: response.experienceLabel === 'Encantamento' ? '#ECFDF5' : response.experienceLabel === 'Atrito' ? '#FEF2F2' : '#FFFBEB', borderColor: 'transparent' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                                    <TrendingUp size={14} />
                                    <span>Termômetro</span>
                                </div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: response.experienceLabel === 'Encantamento' ? '#059669' : response.experienceLabel === 'Atrito' ? '#DC2626' : '#D97706' }}>
                                    {Math.min(100, response.experienceScore ?? 0)}
                                </div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', opacity: 0.8 }}>
                                    {response.experienceLabel || 'Regular'}
                                </div>
                            </div>


                            <div className={styles.statCard}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                                    <Building size={14} />
                                    <span>Empreendimento</span>
                                </div>
                                {isEditing ? (
                                    <select
                                        className="input"
                                        style={{ width: '100%', fontSize: '0.85rem', padding: '0.25rem' }}
                                        value={editForm.origin}
                                        onChange={e => setEditForm({ ...editForm, origin: e.target.value })}
                                    >
                                        {PROJECTS.map(p => <option key={p} value={p}>{p}</option>)}
                                        <option value="Stand">Stand</option>
                                        <option value="Link Direto">Link Direto</option>
                                    </select>
                                ) : (
                                    <div style={{
                                        fontSize: '0.9rem',
                                        fontWeight: 700,
                                        color: response.origin === 'Stand' ? '#4F46E5' : 'var(--color-text-main)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}>
                                        {response.origin === 'Stand' && <CheckCircle2 size={14} />}
                                        {response.origin || 'Direto'}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Analysis of Contributors */}
                        {response.experienceScore !== undefined && (
                            <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid #E2E8F0' }}>
                                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                                    Análise Dinâmica de Vivência
                                </div>
                                {(() => {
                                    const { factors } = calculateExperienceScore(response);
                                    // Only show factors that actually have weight (positive or negative)
                                    const relevantFactors = factors.filter(f => f.score !== 0);

                                    if (relevantFactors.length === 0) {
                                        return <div style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Nenhum fator impactante detectado.</div>;
                                    }

                                    return (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                            {relevantFactors.map((f: any, i: number) => (
                                                <div key={i} style={{
                                                    display: 'flex', alignItems: 'center', gap: '0.3rem',
                                                    padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem',
                                                    background: f.type === 'positive' ? '#DCFCE7' : '#FEE2E2',
                                                    color: f.type === 'positive' ? '#166534' : '#991B1B',
                                                    border: `1px solid ${f.type === 'positive' ? '#86EFAC' : '#FECACA'}`
                                                }}>
                                                    {f.type === 'positive' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                                                    <span>{f.name}</span>
                                                    <span style={{ fontWeight: 800 }}>{f.score > 0 ? `+${f.score}` : f.score}</span>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })()}
                            </div>
                        )}


                        {/* Contact Info Section - Always visible now for editing purpose logic, or flexible */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div className={styles.statCard} style={{ padding: '0.75rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                                    <Mail size={14} />
                                    <span>Email</span>
                                </div>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        className="input"
                                        style={{ width: '100%', fontSize: '0.9rem', padding: '0.25rem' }}
                                        value={editForm.email}
                                        onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                                        placeholder="Email do cliente"
                                    />
                                ) : (
                                    <div style={{ fontSize: '0.9rem', color: 'var(--color-text-main)', wordBreak: 'break-all' }}>
                                        {response.customerEmail !== '-' ? response.customerEmail : '-'}
                                    </div>
                                )}
                            </div>

                            {(!isEditing && response.customerPhone !== '-') ? (
                                <a
                                    href={`https://wa.me/55${response.customerPhone.replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.statCard}
                                    style={{ padding: '0.75rem', display: 'block', textDecoration: 'none', background: '#25D366', borderColor: '#25D366' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', color: 'rgba(255,255,255,0.9)', fontSize: '0.8rem' }}>
                                        <Phone size={14} />
                                        <span>WhatsApp</span>
                                    </div>
                                    <div style={{ fontSize: '0.9rem', color: 'white', fontWeight: 600 }}>
                                        {formatPhoneNumber(response.customerPhone)}
                                    </div>
                                </a>
                            ) : (
                                <div className={styles.statCard} style={{ padding: '0.75rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                                        <Phone size={14} />
                                        <span>WhatsApp</span>
                                    </div>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            className="input"
                                            style={{ width: '100%', fontSize: '0.9rem', padding: '0.25rem' }}
                                            value={editForm.phone}
                                            onChange={e => handlePhoneChange(e.target.value)}
                                            placeholder="(00) 00000-0000"
                                            maxLength={15}
                                        />
                                    ) : (
                                        <div style={{ fontSize: '0.9rem', color: 'var(--color-text-main)' }}>
                                            -
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--color-text-main)', fontWeight: 600 }}>
                                    <Star size={16} className="text-amber-500" />
                                    <span>Sentimento Geral</span>
                                </div>
                                <div className={styles.tagCloud}>
                                    {response.feelings && response.feelings.length > 0 ? (
                                        response.feelings.map(f => <span key={f} className={styles.tag}>{f}</span>)
                                    ) : <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Não informado</span>}
                                </div>
                            </div>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--color-text-main)', fontWeight: 600 }}>
                                    <CheckCircle2 size={16} className="text-green-500" />
                                    <span>Pontos Fortes</span>
                                </div>
                                <div className={styles.tagCloud}>
                                    {response.keyPoints && response.keyPoints.length > 0 ? (
                                        response.keyPoints.map(p => <span key={p} className={styles.tag}>{p}</span>)
                                    ) : <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Não informado</span>}
                                </div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--color-text-main)', fontWeight: 600 }}>
                                <TrendingUp size={16} className="text-blue-500" />
                                <span>Expectativas vs Realidade</span>
                            </div>
                            <div style={{ fontSize: '0.95rem', color: 'var(--color-text-main)', padding: '0.75rem', background: '#F8FAFC', borderRadius: '8px' }}>
                                {response.expectations || 'Não informado'}
                            </div>
                        </div>

                        {response.improvementAreas && response.improvementAreas.length > 0 && (
                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--color-text-main)', fontWeight: 600 }}>
                                    <AlertCircle size={16} className="text-red-500" />
                                    <span>Oportunidades de Melhoria</span>
                                </div>
                                <div className={styles.tagCloud}>
                                    {response.improvementAreas.map(i => <span key={i} className={`${styles.tag} ${styles.negativeTag}`}>{i}</span>)}
                                    {response.improvementOther && <span className={`${styles.tag} ${styles.negativeTag}`}>{response.improvementOther}</span>}
                                </div>
                            </div>
                        )}

                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--color-text-main)', fontWeight: 600 }}>
                                <MessageSquare size={18} />
                                <span>Sugestões e Comentários</span>
                            </div>
                            <div className={styles.feedbackContainer}>
                                {response.suggestions || response.comment || response.reason || "Nenhum comentário adicional fornecido."}
                            </div>
                        </div>

                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return createPortal(modalContent, document.body);
}
