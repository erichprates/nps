'use server';

import { createServerClient } from './supabase';
import { redirect } from 'next/navigation';

export async function login(prevState: any, formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { error: 'Preencha todos os campos.' };
    }

    try {
        const supabase = await createServerClient();
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return { error: 'Email ou senha incorretos.' };
        }

    } catch (error) {
        console.error("Login error:", error);
        return { error: 'Erro interno ao tentar logar.' };
    }

    redirect('/admin/dashboard');
}

export async function logout() {
    const supabase = await createServerClient();
    await supabase.auth.signOut();
    redirect('/admin');
}

export async function getSession() {
    const supabase = await createServerClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;

    return {
        name: session.user.user_metadata?.name || 'Administrador',
        email: session.user.email,
    };
}


