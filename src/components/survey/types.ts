export type SurveyStep =
    | 'WELCOME'
    | 'INTRO'
    | 'NPS_SCORE'
    | 'OPEN_FEEDBACK'
    | 'CONDITIONAL_FEEDBACK'
    | 'EXPERIENCE_TYPE'
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
}
