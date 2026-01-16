"use client";

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface WelcomeStepProps {
    onStart: () => void;
}

export default function WelcomeStep({ onStart }: WelcomeStepProps) {
    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'linear-gradient(135deg, #005C97 0%, #363795 100%)', // Blue Gradient "Lindão"
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            color: 'white',
            padding: '2rem',
            textAlign: 'center',
            zIndex: 50
        }}>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                style={{ maxWidth: '600px', width: '100%' }}
            >
                {/* Logo Placeholder - White Version */}
                <motion.img
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    src="/logo-dark.svg"
                    alt="PortoBay"
                    style={{ height: '134px', marginBottom: '3rem', filter: 'brightness(0) invert(1)' }}
                />

                <h1 style={{
                    color: '#FFFFFF',
                    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                    fontWeight: 700,
                    marginBottom: '1.5rem',
                    lineHeight: 1.1,
                    textShadow: '0 4px 10px rgba(0,0,0,0.2)'
                }}>
                    Sua opinião constrói<br />nossa excelência.
                </h1>

                <p style={{
                    fontSize: '1.5rem',
                    opacity: 0.9,
                    marginBottom: '4rem',
                    lineHeight: 1.5,
                    fontWeight: 300
                }}>
                    Participe da nossa breve pesquisa de satisfação.
                </p>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onStart}
                    style={{
                        background: 'white',
                        color: '#005C97',
                        border: 'none',
                        padding: '1.5rem 4rem',
                        fontSize: '1.75rem',
                        fontWeight: 700,
                        borderRadius: '999px',
                        cursor: 'pointer',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '1rem',
                        width: '100%',
                        maxWidth: '400px',
                        margin: '0 auto'
                    }}
                >
                    Iniciar Pesquisa
                    <ArrowRight size={32} />
                </motion.button>
            </motion.div>

            {/* Footer / Decorative */}
            <div style={{ position: 'absolute', bottom: '2rem', opacity: 0.5, fontSize: '0.875rem' }}>
                Toque para começar
            </div>
        </div>
    );
}
