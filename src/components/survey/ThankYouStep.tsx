import styles from './IntroStep.module.css'; // Reusing Intro styles for consistency
import { CheckCircle } from 'lucide-react';

export default function ThankYouStep() {
    return (
        <div className={styles.container}>
            <div className={styles.card} style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: '1.5rem', color: 'var(--color-success)', display: 'flex', justifyContent: 'center' }}>
                    <CheckCircle size={64} />
                </div>

                <h1 className={styles.title}>
                    Obrigado!
                </h1>

                <p className={styles.description}>
                    Obrigado por compartilhar sua experiência com a PortoBay.
                    Sua opinião faz parte da evolução dos nossos empreendimentos.
                </p>

                <p style={{ fontSize: '0.875rem', color: '#999', marginTop: '2rem' }}>
                    Seus dados são confidenciais e usados apenas para melhoria do atendimento.
                </p>
            </div>
        </div>
    );
}
