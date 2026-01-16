import { createServerClient } from './supabase';
import { NPSResponse } from './types';

export async function getSurveyResults(): Promise<NPSResponse[]> {
    const supabase = await createServerClient();

    try {
        const { data, error } = await supabase
            .from('responses')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Supabase fetch error:", error);
            return [];
        }

        if (!data) return [];

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
            origin: row.origin,
            feelings: row.feelings,
            keyPoints: row.key_points,
            expectations: row.expectations,
            improvementAreas: row.improvement_areas,
            improvementOther: row.improvement_other,
            suggestions: row.suggestions,
            experienceScore: row.experience_score,
            experienceLabel: row.experience_label,
            surveyCategory: row.survey_category
        }));


    } catch (error) {
        console.error("Error fetching survey results:", error);
        return [];
    }
}
