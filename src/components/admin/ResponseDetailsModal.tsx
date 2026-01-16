"use client";

import { createPortal } from 'react-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Calendar, MessageSquare, Star, Folder, Mail, Phone, Pencil, Save, Building, Loader2 } from 'lucide-react';
import { NPSResponse } from "@/lib/types";
import styles from './ResponseDetailsModal.module.css';
import { updateResponse } from '@/lib/actions';

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
        email: '',
        phone: '',
        origin: ''
    });

    useEffect(() => {
        setMounted(true);
        if (response) {
            document.body.style.overflow = 'hidden';
            setEditForm({
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
                email: editForm.email,
                phone: editForm.phone,
                origin: editForm.origin
            });

            // In a real app we'd optimistic update or re-fetch. 
            // Here we assume success and update local prop 'response' visually? 
            // Actually 'response' prop comes from parent. Parent needs to know?
            // Since we called revalidatePath in server action, the parent List *should* refresh if we close?
            // Or we can just close the modal to force refresh.
            // User UX suggestion: Switch back to view mode, showing new data.
            // But verify: we can't mutate 'response' prop directly.
            // For now, let's close modal on success to refresh data from server?
            // Or just keep it simple: Show 'Saved' and switch mode. 
            // Note: Since we can't easily update the 'response' prop without parent callback, 
            // editing visuals might revert if we don't update local state or parent.
            // Let's force a window reload or rely on revalidate.
            // Best UX: close modal.
            onClose();
            // Or: window.location.reload(); // Aggressive.

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
                                <h2 style={{ fontSize: '1.25rem', margin: 0, marginBottom: '0.25rem', color: 'var(--color-text-main)', lineHeight: 1.2 }}>{response.customerName}</h2>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                                    <Calendar size={14} />
                                    <span>{response.date}</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.statsGrid} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))' }}>
                            <div className={styles.statCard}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                                    <Star size={16} />
                                    <span>Nota</span>
                                </div>
                                <div style={{ fontSize: '2rem', fontWeight: 700, color: getScoreColor(response.score) }}>
                                    {response.score}
                                </div>
                            </div>

                            <div className={styles.statCard}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                                    <Folder size={16} />
                                    <span>Categoria</span>
                                </div>
                                <div style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-main)', wordBreak: 'break-word' }}>
                                    {response.experienceType || 'N/A'}
                                </div>
                            </div>

                            <div className={styles.statCard}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                                    <Building size={16} />
                                    <span>Empreendimento</span>
                                </div>
                                {isEditing ? (
                                    <select
                                        className="input"
                                        style={{ width: '100%', fontSize: '0.9rem', padding: '0.25rem' }}
                                        value={editForm.origin}
                                        onChange={e => setEditForm({ ...editForm, origin: e.target.value })}
                                    >
                                        {PROJECTS.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                ) : (
                                    <div style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--color-text-main)', wordBreak: 'break-word' }}>
                                        {response.origin || 'Link Direto'}
                                    </div>
                                )}
                            </div>
                        </div>

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

                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--color-text-main)', fontWeight: 600 }}>
                                <MessageSquare size={18} />
                                <span>Feedback do Cliente</span>
                            </div>
                            <div className={styles.feedbackContainer} style={{ fontStyle: response.comment ? 'normal' : 'italic' }}>
                                {response.comment || response.reason || "Nenhum comentário adicional fornecido."}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return createPortal(modalContent, document.body);
}
