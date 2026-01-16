export type SurveyStep =
    | 'INTRO'
    | 'WELCOME'
    | 'NPS_SCORE'
    | 'FEELINGS'
    | 'KEY_POINTS'
    | 'EXPECTATIONS'
    | 'IMPROVEMENTS'
    | 'SUGGESTIONS'
    | 'CONTACT'
    | 'SUBMITTING'
    | 'THANK_YOU';

export interface SurveyState {
    step: SurveyStep;
    npsScore: number | null;
    openFeedback: string;
    conditionalFeedback: string;
    experienceType: string;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    origin?: string;
    // New fields
    feelings: string[];
    keyPoints: string[];
    expectations: string;
    improvementAreas: string[];
    improvementOther: string;
    suggestions: string;
    surveyCategory: 'pos-venda' | 'pre-venda';
}

