"use client";

import styles from './SingleSelectStep.module.css';

interface SingleSelectStepProps {
    title: string;
    subtitle?: string;
    options: string[];
    selected: string;
    onSelect: (option: string) => void;
    onBack: () => void;
}

export default function SingleSelectStep({
    title,
    subtitle,
    options,
    selected,
    onSelect,
    onBack
}: SingleSelectStepProps) {
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>{title}</h2>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

            <div className={styles.grid}>
                {options.map(option => (
                    <button
                        key={option}
                        onClick={() => onSelect(option)}
                        className={`${styles.optionButton} ${selected === option ? styles.active : ''}`}
                    >
                        {option}
                    </button>
                ))}
            </div>

            <div className={styles.actions}>
                <button onClick={onBack} className={styles.backButton}>Voltar</button>
            </div>
        </div>
    );
}
