"use client";

import { ArrowRight, Check, ChevronLeft } from 'lucide-react';
import styles from './ExperienceTypeStep.module.css';
import { useState } from 'react';

interface ExperienceTypeStepProps {
    onNext: (type: string) => void;
    onSubmit?: boolean; // If this is the last step
    onBack?: () => void;
}

const EXPERIENCE_OPTIONS = [
    'Atendimento comercial',
    'Visita ao estande',
    'Atendimento pós venda',
    'Entrega do imóvel',
    'Assistência técnica',
    'Outro'
];

export default function ExperienceTypeStep({ onNext, onSubmit = false, onBack }: ExperienceTypeStepProps) {
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (option: string) => {
        setSelected(option);
        // Auto advance or wait for button? 
        // Usually selection is enough, but user might want to confirm.
        // Let's force a "Submit" button logic since this is the last step.
    };

    return (
        <div className={styles.container}>
            {onBack && (
                <button
                    onClick={onBack}
                    style={{
                        position: 'absolute',
                        top: '1.5rem',
                        left: '1.5rem',
                        background: '#003366',
                        color: 'white',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.6rem 1.2rem',
                        borderRadius: '2rem',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        zIndex: 20,
                        transition: 'transform 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <ChevronLeft size={18} />
                    Voltar
                </button>
            )}
            <div className={styles.wrapper}>
                <h2 className={styles.question}>Qual tipo de experiência você avaliou?</h2>

                <div className={styles.optionsGrid}>
                    {EXPERIENCE_OPTIONS.map((option) => (
                        <button
                            key={option}
                            className={`${styles.optionBtn} ${selected === option ? styles.selected : ''}`}
                            onClick={() => handleSelect(option)}
                        >
                            {option}
                            {selected === option && <Check size={20} />}
                        </button>
                    ))}
                </div>

                {selected && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button className="btn btn-primary" onClick={() => onNext(selected)}>
                            {onSubmit ? 'Enviar Avaliação' : 'Continuar'}
                            {!onSubmit && <ArrowRight size={20} style={{ marginLeft: '8px' }} />}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
