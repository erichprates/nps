"use client";

import { useState } from 'react';
import styles from './MultiSelectStep.module.css';

interface MultiSelectStepProps {
    title: string;
    subtitle?: string;
    options: string[];
    maxSelection: number;
    initialValues: string[];
    onNext: (selected: string[]) => void;
    onBack: () => void;
    allowOther?: boolean;
    otherValue?: string;
}

export default function MultiSelectStep({
    title,
    subtitle,
    options,
    maxSelection,
    initialValues,
    onNext,
    onBack,
    allowOther,
    otherValue = ''
}: MultiSelectStepProps) {
    const [selected, setSelected] = useState<string[]>(initialValues);
    const [otherText, setOtherText] = useState(otherValue);
    const [showOtherInput, setShowOtherInput] = useState(otherValue !== '');

    const toggleOption = (option: string) => {
        if (option === 'Outro:' || option === 'Outro') {
            setShowOtherInput(!showOtherInput);
            if (selected.includes(option)) {
                setSelected(prev => prev.filter(i => i !== option));
            } else {
                if (selected.length < maxSelection) {
                    setSelected(prev => [...prev, option]);
                }
            }
            return;
        }

        if (selected.includes(option)) {
            setSelected(prev => prev.filter(i => i !== option));
        } else {
            if (selected.length < maxSelection) {
                setSelected(prev => [...prev, option]);
            }
        }
    };

    const handleNext = () => {
        onNext(selected);
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>{title}</h2>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

            <div className={styles.grid}>
                {options.map(option => (
                    <button
                        key={option}
                        onClick={() => toggleOption(option)}
                        className={`${styles.optionButton} ${selected.includes(option) ? styles.active : ''}`}
                    >
                        {option}
                    </button>
                ))}
            </div>

            {allowOther && showOtherInput && (
                <div className={styles.otherContainer}>
                    <textarea
                        className={styles.textarea}
                        placeholder="Conte-nos mais..."
                        value={otherText}
                        onChange={(e) => setOtherText(e.target.value)}
                    />
                </div>
            )}

            <div className={styles.actions}>
                <button onClick={onBack} className={styles.backButton}>Voltar</button>
                <button
                    onClick={() => {
                        if (allowOther && showOtherInput) {
                            // We pass the selection and the other text is handled in the container state
                            onNext(selected);
                        } else {
                            onNext(selected);
                        }
                    }}
                    className={styles.nextButton}
                    disabled={selected.length === 0}
                >
                    Continuar
                </button>
            </div>
        </div>
    );
}
