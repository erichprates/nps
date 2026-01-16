"use client";

import { ChevronLeft } from 'lucide-react';
import styles from './NPSScoreStep.module.css';

interface NPSScoreStepProps {
    onSelect: (score: number) => void;
    currentScore: number | null;
    onBack?: () => void;
}

export default function NPSScoreStep({ onSelect, currentScore, onBack }: NPSScoreStepProps) {
    const scores = Array.from({ length: 11 }, (_, i) => i);

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

            <h2 className={styles.question}>
                De 0 a 10, qual a chance de você recomendar a PortoBay Construtora para um amigo ou familiar?
            </h2>

            <div className={styles.scaleGrid}>
                {scores.map((score) => (
                    <button
                        key={score}
                        className={`${styles.scoreBtn} ${currentScore === score ? styles.selected : ''}`}
                        onClick={() => onSelect(score)}
                        data-score={score}
                        aria-label={`Nota ${score}`}
                        type="button"
                    >
                        {score}
                    </button>
                ))}
            </div>

            <div className={styles.labels}>
                <span>Pouco provável</span>
                <span>Muito provável</span>
            </div>
        </div>
    );
}
