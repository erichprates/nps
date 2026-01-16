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
};

export type User = {
    email: string;
    name: string;
};
