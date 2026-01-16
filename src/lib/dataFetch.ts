import { supabase, createServerClient } from './supabase';
import { NPSResponse } from './types';

export async function getSurveyResults(): Promise<NPSResponse[]> {
    try {
        const supabase = await createServerClient();
        const { data, error } = await supabase
            .from('responses')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return data.map((row) => ({
            id: row.id,
            date: new Date(row.created_at).toLocaleString('pt-BR'),
            customerName: row.customer_name,
            customerEmail: row.customer_email,
            customerPhone: row.customer_phone,
            experienceType: row.experience_type,
            score: row.score,
            comment: row.comment,
            reason: row.reason,
            origin: row.origin
        }));
    } catch (error) {
        console.error("Error fetching survey results:", error);
        return [];
    }
}


