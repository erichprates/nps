"use client";

import { motion } from 'framer-motion';

export default function ProgressBar({ current, total }: { current: number, total: number }) {
    const progress = Math.min((current / total) * 100, 100);

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '6px', background: 'rgba(0,0,0,0.05)', zIndex: 100 }}>
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
                style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
                    borderRadius: '0 4px 4px 0'
                }}
            />
        </div>
    );
}
