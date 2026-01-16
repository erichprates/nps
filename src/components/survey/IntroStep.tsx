import styles from './IntroStep.module.css';
import { ArrowRight } from 'lucide-react';

interface IntroStepProps {
    onStart: () => void;
    customerName?: string;
}

export default function IntroStep({ onStart, customerName }: IntroStepProps) {
    return (
        <div className={styles.container}>
            <div className={styles.logoWrapper}>
                <img src="/logo.svg" alt="PortoBay" style={{ width: '200px', height: 'auto' }} />
            </div>

            <div className={styles.card}>
                <h1 className={styles.title}>
                    {customerName ? `Olá, ${customerName}!` : 'Olá!'}
                    <br />
                    Como foi sua experiência?
                </h1>

                <p className={styles.description}>
                    Sua opinião nos ajuda a melhorar cada etapa do seu atendimento.
                    Leva menos de um minuto.
                </p>

                <button onClick={onStart} className={styles.button}>
                    Começar Pesquisa
                    <ArrowRight size={20} />
                </button>
            </div>

            <p style={{ marginTop: '2rem', fontSize: '0.875rem', color: '#999' }}>
                PortoBay Construtora
            </p>
        </div>
    );
}
