"use client";

import { motion } from "framer-motion";

export const pageVariants = {
    initial: { opacity: 0, x: 20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -20 }
};

export const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
};

export default function AnimatedStep({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className={className}
        >
            {children}
        </motion.div>
    );
}
