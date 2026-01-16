"use client";

import { useActionState } from 'react';
import { login } from '@/lib/authActions';
// @ts-ignore
import styles from './login.module.css';

const initialState = {
    error: '',
};

export default function AdminLogin() {
    const [state, formAction, isPending] = useActionState(login, initialState);

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                    <img src="/logo.svg" alt="PortoBay" style={{ width: '180px', height: 'auto' }} />
                </div>

                <form action={formAction}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Email Corporativo</label>
                        <input
                            type="email"
                            name="email"
                            className={styles.input}
                            placeholder="seu.nome@portobay.com.br"
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Senha</label>
                        <input
                            type="password"
                            name="password"
                            className={styles.input}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {state?.error && <p className={styles.errorMessage}>{state.error}</p>}

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isPending}>
                        {isPending ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
            </div>
        </div>
    );
}
