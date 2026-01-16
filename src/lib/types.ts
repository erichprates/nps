export type NPSResponse = {
    id: string;
    date: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    experienceType: string;
    score: number;
    comment: string;
    reason: string;
    origin: string;
    // New fields
    feelings?: string[];
    keyPoints?: string[];
    expectations?: string;
    improvementAreas?: string[];
    improvementOther?: string;
    suggestions?: string;
    experienceScore?: number;
    experienceLabel?: string;
    surveyCategory: 'pos-venda' | 'pre-venda';
};


export type User = {
    email: string;
    name: string;
};
