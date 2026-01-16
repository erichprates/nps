"use server";

import { createServerClient } from "./supabase";
import { SurveyState } from "@/components/survey/types";
import { revalidatePath } from 'next/cache';

export async function submitSurvey(data: SurveyState) {
    if (!data.npsScore && data.npsScore !== 0) {
        throw new Error("NPS Score is required");
    }

    const supabase = await createServerClient();
    const { data: insertedData, error } = await supabase
        .from('responses')
        .insert({
            customer_name: data.customerName || 'Anônimo',
            customer_email: data.customerEmail || '-',
            customer_phone: data.customerPhone || '-',
            experience_type: data.experienceType || 'Não informado',
            score: data.npsScore,
            comment: data.openFeedback || '',
            reason: data.conditionalFeedback || '',
            origin: data.origin || 'Link Direto'
        })
        .select()
        .single();

    if (error) {
        console.error("Submission error:", error);
        return { success: false, error: 'Failed to write to database' };
    }

    return { success: true, id: insertedData.id };
}

export async function updateResponse(id: string, data: { email?: string, phone?: string, origin?: string }) {
    try {
        const supabase = await createServerClient();
        const { error } = await supabase
            .from('responses')
            .update({
                customer_email: data.email,
                customer_phone: data.phone,
                origin: data.origin
            })
            .eq('id', id);

        if (error) throw error;

        revalidatePath('/admin/dashboard');
        return { success: true };
    } catch (error) {
        console.error("Update error:", error);
        return { success: false, error: 'Falha ao atualizar dados.' };
    }
}


