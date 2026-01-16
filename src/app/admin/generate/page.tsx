"use client";

import { useState } from 'react';
import { Copy, Check, Link as LinkIcon } from 'lucide-react';

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
        experienceType: ''
    });

    const [generatedLink, setGeneratedLink] = useState('');
    const [copied, setCopied] = useState(false);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        value = value.replace(/\D/g, ''); // Remove non-digits

        // Limit to 11 digits (DDD + 9 digits)
        if (value.length > 11) value = value.slice(0, 11);

        // Apply mask (XX) XXXXX-XXXX
        value = value.replace(/^(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d)(\d{4})$/, '$1-$2');

        setFormData({ ...formData, customerPhone: value });
    };

    const handleGenerate = () => {
        // In a real app, we might want to save this "invite" state to db
        // For now, we just encode params

        // Determine base URL (localhost in dev, production url in prod)
        const baseUrl = window.location.origin;

        // Construct params
        const params = new URLSearchParams();
        if (formData.customerName) params.append('n', formData.customerName);
        if (formData.project) params.append('p', formData.project); // p for project
        if (formData.customerEmail) params.append('e', formData.customerEmail);
        if (formData.customerPhone) params.append('t', formData.customerPhone);

        const link = `${baseUrl}/survey/share?${params.toString()}`;
        setGeneratedLink(link);
        setCopied(false);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div style={{ maxWidth: '800px' }}>
            <h1 style={{ marginBottom: '2rem' }}>Gerar Novo Link</h1>

            <div className="card">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
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
                            onChange={e => setFormData({ ...formData, customerEmail: e.target.value })}
                        />
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
                    </div>
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <button className="btn btn-primary" onClick={handleGenerate}>
                        <LinkIcon size={20} style={{ marginRight: 8 }} />
                        Gerar Link Personalizado
                    </button>
                </div>

                {generatedLink && (
                    <div style={{ marginTop: '2rem', background: '#F8F9FA', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                        <p style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Link para envio:</p>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                readOnly
                                value={generatedLink}
                                style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd', background: 'white' }}
                            />
                            <button
                                onClick={copyToClipboard}
                                className="btn"
                                style={{ background: copied ? 'var(--color-success)' : 'var(--color-primary)', color: 'white', minWidth: '120px' }}
                            >
                                {copied ? <><Check size={18} style={{ marginRight: 4 }} /> Copiado</> : <><Copy size={18} style={{ marginRight: 4 }} /> Copiar</>}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
