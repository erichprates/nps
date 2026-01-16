"use client";

import { motion } from 'framer-motion';

export default function ProgressBar({ current, total, label }: { current: number, total: number, label?: string }) {
    const progress = Math.min((current / total) * 100, 100);

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 100 }}>
            <div style={{ width: '100%', height: '6px', background: 'rgba(0,0,0,0.05)' }}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                    style={{
                        height: '100%',
                        background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
                        borderRadius: '0 4px 4px 0'
                    }}
                />
            </div>
            {label && (
                <div style={{
                    textAlign: 'center',
                    padding: '0.5rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--color-primary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    background: 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(4px)'
                }}>
                    Etapa {Math.ceil(current)} de {total}: {label}
                </div>
            )}
        </div>
    );
}

