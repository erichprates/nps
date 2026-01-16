"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Link as LinkIcon, LogOut, MessageSquare } from 'lucide-react';
import styles from './AdminLayout.module.css';
import ThemeSwitcher from '../ThemeSwitcher';
import { useEffect, useState } from 'react';
import { getSession, logout } from '@/lib/authActions';

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [logoSrc, setLogoSrc] = useState('/logo.svg');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [userName, setUserName] = useState('Colaborador');

    useEffect(() => {
        const updateLogo = () => {
            const theme = document.documentElement.getAttribute('data-theme');
            setLogoSrc(theme === 'dark' ? '/logo-dark.svg' : '/logo.svg');
        };

        // Initial check
        updateLogo();

        // Listen for changes
        const observer = new MutationObserver(updateLogo);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

        return () => observer.disconnect();
    }, []);

    // Fetch session whenever path changes (e.g. after login)
    useEffect(() => {
        getSession().then(session => {
            if (session?.name) setUserName(session.name);
            else setUserName('Colaborador');
        });
    }, [pathname]);

    // Close sidebar when navigating
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);

    // If on login page, don't show layout
    if (pathname === '/admin') {
        return <>{children}</>;
    }

    const navItems = [
        { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/responses', label: 'Respostas', icon: MessageSquare },
        { href: '/admin/generate', label: 'Gerar Pesquisa', icon: LinkIcon },
    ];

    return (
        <div style={{ minHeight: '100vh', background: 'var(--color-background)' }}>
            {/* Mobile Header */}
            <header className={styles.mobileHeader}>
                <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {/* Hamburger - Absolute Left */}
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        style={{
                            position: 'absolute',
                            left: 0,
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--color-text-main)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            padding: '4px'
                        }}
                    >
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </button>

                    {/* Logo - Centered */}
                    <img src={logoSrc} alt="PortoBay" style={{ height: '56px', width: 'auto' }} />
                </div>
            </header>

            {/* Overlay */}
            <div
                className={`${styles.overlay} ${isSidebarOpen ? styles.open : ''}`}
                onClick={() => setIsSidebarOpen(false)}
            />

            <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
                <div style={{ padding: '0.5rem 0', marginBottom: '3rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img src={logoSrc} alt="PortoBay" style={{ width: '168px', height: 'auto' }} />
                    <button
                        className="btn-outline"
                        onClick={() => setIsSidebarOpen(false)}
                        style={{ border: 'none', padding: '4px', display: 'none' }} // Mobile close logic
                    >
                        <LogOut size={20} />
                    </button>
                </div>

                <nav className={styles.nav}>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                            >
                                <Icon size={20} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className={styles.userProfile}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random`} alt="User" />
                        </div>
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                            <p style={{ fontWeight: 600, color: 'var(--color-text-main)', fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {userName}
                            </p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                        <ThemeSwitcher />
                        <button
                            className="btn-outline"
                            onClick={() => logout()}
                            title="Sair"
                            style={{ padding: '0.5rem', border: 'none', display: 'flex', alignItems: 'center', color: 'var(--color-text-muted)' }}
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </aside>

            <main className={styles.mainContent}>
                {children}
            </main>
        </div>
    );
}
