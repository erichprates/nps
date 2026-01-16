"use client";

import { useState } from 'react';
import { Copy, Check, Link as LinkIcon, Scissors, Loader2 } from 'lucide-react';
import { generateShortLink } from '@/lib/actions';

const PROJECTS = [
    'PortoBay Praia Grande',
    'PortoBay Tenório',
    'PortoBay Verano'
];

export default function GenerateLinkPage() {
    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        project: PROJECTS[0],
        experienceType: '',
        surveyCategory: 'pos-venda'
    });

    const [generatedLink, setGeneratedLink] = useState('');
    const [shortLink, setShortLink] = useState('');
    const [isShortening, setIsShortening] = useState(false);
    const [copied, setCopied] = useState(false);

    const [errors, setErrors] = useState({ email: '', phone: '' });

    const validateForm = () => {
        let isValid = true;
        const newErrors = { email: '', phone: '' };

        // Validate Email (if provided)
        if (formData.customerEmail) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.customerEmail)) {
                newErrors.email = 'Formato de e-mail inválido.';
                isValid = false;
            }
        }

        // Validate Phone (if provided)
        // Must be exactly 15 chars: (XX) XXXXX-XXXX
        if (formData.customerPhone) {
            if (formData.customerPhone.length < 15) {
                newErrors.phone = 'Digite o número completo (DDD + 9 dígitos).';
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // ... previous logic remains
        let value = e.target.value;
        value = value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        value = value.replace(/^(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d)(\d{4})$/, '$1-$2');

        setFormData({ ...formData, customerPhone: value });
        if (errors.phone) setErrors({ ...errors, phone: '' }); // Clear error on change
    };

    const handleGenerate = async () => {
        if (!validateForm()) return;

        const baseUrl = window.location.origin;
        // ... rest of generation logic
        const params = new URLSearchParams();
        if (formData.customerName) params.append('n', formData.customerName);
        if (formData.project) params.append('p', formData.project);
        if (formData.customerEmail) params.append('e', formData.customerEmail);
        if (formData.customerPhone) params.append('t', formData.customerPhone);
        if (formData.surveyCategory === 'pre-venda') params.append('c', 'pre');

        const fullLongLink = `${baseUrl}/survey/share?${params.toString()}`;
        setGeneratedLink(fullLongLink);
        setShortLink('');
        setCopied(false);

        // Auto-shorten immediately
        setIsShortening(true);
        try {
            const res = await generateShortLink(fullLongLink);
            if (res.success) {
                setShortLink(`${baseUrl}/s/${res.code}`);
            } else {
                console.error("Erro ao encurtar:", res.error);
            }
        } catch (error) {
            console.error("Erro de conexão ao encurtar.");
        } finally {
            setIsShortening(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div style={{ maxWidth: '800px' }}>
            <h1 style={{ marginBottom: '2rem' }}>Gerar Link para WhatsApp</h1>

            <div className="card">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Tipo de Pesquisa</label>
                        <select
                            className="input"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontWeight: 600, color: 'var(--color-primary)' }}
                            value={formData.surveyCategory}
                            onChange={e => setFormData({ ...formData, surveyCategory: e.target.value as any })}
                        >
                            <option value="pos-venda">PÓS-VENDAS</option>
                            <option value="pre-venda">PRÉ-VENDA</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Empreendimento</label>
                        <select
                            className="input"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                            value={formData.project}
                            onChange={e => setFormData({ ...formData, project: e.target.value })}
                        >
                            {PROJECTS.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Nome do Cliente</label>
                        <input
                            type="text"
                            className="input"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                            placeholder="Ex: João Silva"
                            value={formData.customerName}
                            onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email (Opcional)</label>
                        <input
                            type="email"
                            className="input"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                            placeholder="cliente@email.com"
                            value={formData.customerEmail}
                            onChange={e => {
                                setFormData({ ...formData, customerEmail: e.target.value });
                                if (errors.email) setErrors({ ...errors, email: '' });
                            }}
                        />
                        {errors.email && <p style={{ color: 'var(--color-danger)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.email}</p>}
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>WhatsApp (Opcional)</label>
                        <input
                            type="tel"
                            className="input"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                            placeholder="(11) 98765-4321"
                            value={formData.customerPhone}
                            onChange={handlePhoneChange}
                            maxLength={15}
                        />
                        {errors.phone && <p style={{ color: 'var(--color-danger)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.phone}</p>}
                    </div>
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <button className="btn btn-primary" onClick={handleGenerate} disabled={isShortening} style={{ minWidth: '220px' }}>
                        {isShortening ? (
                            <><Loader2 size={20} className="spin" style={{ marginRight: 8 }} /> Gerando link...</>
                        ) : (
                            <><LinkIcon size={20} style={{ marginRight: 8 }} /> Gerar Link Curto</>
                        )}
                    </button>
                </div>

                {generatedLink && (
                    <div style={{ marginTop: '2rem', background: '#F8F9FA', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                        {isShortening && !shortLink && (
                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                                <Loader2 size={32} className="spin" style={{ color: 'var(--color-primary)', marginBottom: '1rem' }} />
                                <p style={{ fontWeight: 600, color: 'var(--color-text-muted)' }}>Encurtando link...</p>
                            </div>
                        )}



                        {shortLink && (
                            <>
                                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '2px solid var(--color-primary)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '1.5rem' }}>
                                    <p style={{ marginBottom: '1rem', fontSize: '1rem', color: 'var(--color-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Check size={20} /> Link Curto Pronto:
                                    </p>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <input
                                            readOnly
                                            value={shortLink}
                                            style={{ flex: 1, padding: '1rem', borderRadius: '8px', border: '1px solid var(--color-primary)', background: '#F0F7FF', fontWeight: 600, fontSize: '1.1rem', color: 'var(--color-primary)' }}
                                        />
                                        <button
                                            onClick={() => copyToClipboard(shortLink)}
                                            className="btn btn-primary"
                                            style={{ minWidth: '150px', fontSize: '1rem' }}
                                        >
                                            {copied ? <><Check size={20} /> Copiado</> : <><Copy size={20} /> Copiar</>}
                                        </button>
                                    </div>
                                    <p style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                                        💡 Link contém todos os dados e redirecionará automaticamente.
                                    </p>
                                </div>

                                <details style={{ borderTop: '1px solid #ddd', paddingTop: '1rem' }}>
                                    <summary style={{ cursor: 'pointer', fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: '0.75rem' }}>
                                        Ver Link Completo (Backup)
                                    </summary>
                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                                        <input
                                            readOnly
                                            value={generatedLink}
                                            style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd', background: 'white', fontSize: '0.75rem', color: '#666' }}
                                        />
                                        <button
                                            onClick={() => copyToClipboard(generatedLink)}
                                            className="btn-outline"
                                            style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}
                                        >
                                            Copiar
                                        </button>
                                    </div>
                                </details>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
