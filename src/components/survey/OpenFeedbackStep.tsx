"use client";

import { ArrowRight, ChevronLeft } from 'lucide-react';
import styles from './FeedbackStep.module.css';
import { useState } from 'react';

interface OpenFeedbackStepProps {
    onNext: (feedback: string) => void;
    question: string;
    initialValue?: string;
    onBack?: () => void;
}

export default function OpenFeedbackStep({ onNext, question, initialValue = '', onBack }: OpenFeedbackStepProps) {
    const [feedback, setFeedback] = useState(initialValue);

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
                <h2 className={styles.question}>{question}</h2>

                <textarea
                    className={styles.textarea}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Digite sua resposta aqui..."
                    autoFocus
                />

                <div className={styles.actions}>
                    <button className="btn btn-primary" onClick={() => onNext(feedback)}>
                        Continuar <ArrowRight size={20} style={{ marginLeft: '8px' }} />
                    </button>
                </div>
            </div>
        </div>
    );
}
