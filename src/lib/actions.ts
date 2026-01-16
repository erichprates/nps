"use server";

import { createServerClient, createAdminClient } from "./supabase";
import { SurveyState } from "@/components/survey/types";
import { revalidatePath } from 'next/cache';
import { calculateExperienceScore } from './analytics';

export async function submitSurvey(data: SurveyState) {
    if (!data.npsScore && data.npsScore !== 0) {
        throw new Error("NPS Score is required");
    }

    console.log("Submitting survey data:", data);
    const { score: expScore, label: expLabel } = calculateExperienceScore(data as any);

    const supabase = await createAdminClient();
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
            origin: data.origin || 'Link Direto',
            feelings: data.feelings,
            key_points: data.keyPoints,
            expectations: data.expectations,
            improvement_areas: data.improvementAreas,
            improvement_other: data.improvementOther,
            suggestions: data.suggestions,
            experience_score: expScore,
            experience_label: expLabel,
            survey_category: data.surveyCategory
        })

        .select()
        .single();


    if (error) {
        console.error("Submission error details:", JSON.stringify(error, null, 2));
        return { success: false, error: 'Falha ao gravar no banco: ' + error.message };
    }

    revalidatePath('/admin/dashboard');
    revalidatePath('/admin/responses');

    return { success: true, id: insertedData.id };
}

export async function updateResponse(id: string, data: { name?: string, email?: string, phone?: string, origin?: string }) {
    try {
        const supabase = await createServerClient();
        const { error } = await supabase
            .from('responses')
            .update({
                customer_name: data.name,
                customer_email: data.email,
                customer_phone: data.phone,
                origin: data.origin
            })
            .eq('id', id);

        if (error) throw error;

        revalidatePath('/admin/dashboard');
        revalidatePath('/admin/responses');
        return { success: true };
    } catch (error) {
        console.error("Update error:", error);
        return { success: false, error: 'Falha ao atualizar dados.' };
    }
}

export async function generateShortLink(longUrl: string) {
    try {
        const supabase = await createAdminClient();

        // 1. Check if already exists
        const { data: existing } = await supabase
            .from('short_links')
            .select('code')
            .eq('long_url', longUrl)
            .maybeSingle();

        if (existing) return { success: true, code: existing.code };

        // 2. Generate unique code
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        let isUnique = false;
        let attempts = 0;

        while (!isUnique && attempts < 10) {
            code = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
            const { data } = await supabase.from('short_links').select('code').eq('code', code).maybeSingle();
            if (!data) isUnique = true;
            attempts++;
        }

        if (!isUnique) throw new Error("Could not generate unique code");

        // 3. Save
        const { error } = await supabase.from('short_links').insert({ code, long_url: longUrl });
        if (error) throw error;

        return { success: true, code };

    } catch (error: any) {
        console.error("Short link error:", error);
        return { success: false, error: error.message };
    }
}


