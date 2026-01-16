"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, ArrowRight } from 'lucide-react';

interface ContactStepProps {
    onNext: (data: { name: string, email: string, phone: string }) => void;
}

export default function ContactStep({ onNext }: ContactStepProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        value = value.replace(/^(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d)(\d{4})$/, '$1-$2');
        setPhone(value);
    };

    const handleSubmit = () => {
        if (!name.trim()) {
            setError('Por favor, informe seu nome para continuarmos.');
            return;
        }
        // Email/Phone optional or required? User said "incluir no final o campo... pra pessoa preencher".
        // Usually Totem requires at least one contact. Let's require Name only strictly, others nice to have?
        // Let's require Name.
        onNext({ name, email, phone });
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-primary)' }}>
                    Quase lá!
                </h2>
                <p style={{ fontSize: '1.125rem', color: 'var(--color-text-muted)', marginBottom: '3rem' }}>
                    Para finalizarmos, precisamos apenas de alguns dados para identificar sua resposta.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>

                    {/* Name */}
                    <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontWeight: 600, fontSize: '1.1rem', color: 'var(--color-text-main)' }}>
                            <User size={20} className="text-primary" />
                            Nome Completo
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => { setName(e.target.value); setError(''); }}
                            className="input"
                            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', borderRadius: '12px' }}
                            placeholder="Digite seu nome"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontWeight: 600, fontSize: '1.1rem', color: 'var(--color-text-main)' }}>
                            <Phone size={20} className="text-primary" />
                            WhatsApp
                        </label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={handlePhoneChange}
                            className="input"
                            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', borderRadius: '12px' }}
                            placeholder="(11) 99999-9999"
                            inputMode="numeric"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontWeight: 600, fontSize: '1.1rem', color: 'var(--color-text-main)' }}>
                            <Mail size={20} className="text-primary" />
                            Email (Opcional)
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input"
                            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', borderRadius: '12px' }}
                            placeholder="seu@email.com"
                        />
                    </div>

                    {error && (
                        <div style={{ color: 'var(--color-error)', background: 'rgba(239,68,68,0.1)', padding: '1rem', borderRadius: '8px', marginTop: '0.5rem' }}>
                            {error}
                        </div>
                    )}
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    className="btn btn-primary"
                    style={{
                        marginTop: '3rem',
                        width: '100%',
                        padding: '1.25rem',
                        fontSize: '1.25rem',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.75rem'
                    }}
                >
                    Finalizar Pesquisa
                    <ArrowRight size={24} />
                </motion.button>

            </motion.div>
        </div>
    );
}
