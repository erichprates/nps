"use client";

import { ArrowRight, ChevronLeft } from 'lucide-react';
import styles from './FeedbackStep.module.css';
import { useState } from 'react';

interface OpenFeedbackStepProps {
    onNext: (feedback: string) => void;
    question: string;
    initialValue?: string;
    onBack?: () => void;
    nextLabel?: string;
}

export default function OpenFeedbackStep({ onNext, question, initialValue = '', onBack, nextLabel = 'Continuar' }: OpenFeedbackStepProps) {
    const [feedback, setFeedback] = useState(initialValue);

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <h2 className={styles.question}>{question}</h2>

                <textarea
                    className={styles.textarea}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Digite sua resposta aqui..."
                    autoFocus
                />

                <div className={styles.actions} style={{ display: 'flex', gap: '1rem', justifyContent: 'center', width: '100%' }}>
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="btn btn-outline"
                            style={{ flex: '0 0 auto', padding: '1rem 2rem', borderRadius: '12px' }}
                        >
                            Voltar
                        </button>
                    )}
                    <button
                        className="btn btn-primary"
                        onClick={() => onNext(feedback)}
                        style={{ flex: 1, padding: '1rem', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 700 }}
                    >
                        {nextLabel} <ArrowRight size={20} style={{ marginLeft: '8px' }} />
                    </button>
                </div>
            </div>
        </div>
    );
}

