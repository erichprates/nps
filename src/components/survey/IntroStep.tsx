import styles from './IntroStep.module.css';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface IntroStepProps {
    onStart: () => void;
    customerName?: string;
    category?: 'pos-venda' | 'pre-venda';
}

export default function IntroStep({ onStart, customerName, category }: IntroStepProps) {
    const isPreVenda = category === 'pre-venda';

    return (
        <div className={`${styles.container} ${isPreVenda ? styles.preVenda : ''}`}>
            <div className={styles.logoWrapper}>
                <img
                    src="/logo.svg"
                    alt="PortoBay"
                    style={{
                        width: '336px',
                        height: 'auto',
                        filter: isPreVenda ? 'brightness(0) invert(1)' : 'none'
                    }}
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className={styles.card}
            >
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={styles.title}
                >
                    {customerName ? `Olá, ${customerName}!` : 'Olá!'}
                    <br />
                    Como foi sua experiência?
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className={styles.description}
                >
                    Sua opinião nos ajuda a melhorar cada etapa do seu atendimento.
                    Leva menos de um minuto.
                </motion.p>

                <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onStart}
                    className={styles.button}
                >
                    Começar Pesquisa
                    <ArrowRight size={20} />
                </motion.button>
            </motion.div>

            <p className={styles.footerText}>
                PortoBay Construtora
            </p>
        </div>
    );
}
