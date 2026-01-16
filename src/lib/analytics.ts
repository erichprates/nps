import { NPSResponse } from "./types";

export type TrendData = {
    date: string; // Display label
    nps: number;
    total: number;
    sortKey: string; // Used for sorting correctly
};

export type CategoryData = {
    name: string;
    nps: number;
    total: number;
    promoters: number;
    neutrals: number;
    detractors: number;
};

export type TimeFilter = 'day' | 'month' | 'year';

function calculateNPS(promoters: number, detractors: number, total: number) {
    if (total === 0) return 0;
    return Math.round(((promoters - detractors) / total) * 100);
}

export function getTrendData(data: NPSResponse[], filter: TimeFilter = 'day'): TrendData[] {
    const grouped = data.reduce((acc, row) => {
        // Expected format: "DD/MM/YYYY, hh:mm:ss" from toLocaleString('pt-BR') 
        // or just "DD/MM/YYYY" from some inputs. Safely handle split.
        // If saving Date().toISOString(), we need to parse differently.
        // Assuming the current app saves "DD/MM/YYYY, hh:mm:ss" or similar as per earlier checks.

        // Let's rely on basic parsing assuming "DD/MM/YYYY" is at the start
        const datePart = row.date.split(',')[0].trim();
        const parts = datePart.split('/'); // ["DD", "MM", "YYYY"]

        if (parts.length < 3) return acc;

        let key = '';
        let label = '';

        const day = parts[0].padStart(2, '0');
        const month = parts[1].padStart(2, '0');
        const year = parts[2];

        if (filter === 'day') {
            key = `${year}-${month}-${day}`;
            label = `${day}/${month}`;
        } else if (filter === 'month') {
            key = `${year}-${month}`;
            label = `${month}/${year}`;
        } else {
            key = `${year}`;
            label = `${year}`;
        }

        if (!acc[key]) {
            acc[key] = { date: label, sortKey: key, total: 0, promoters: 0, detractors: 0 };
        }

        acc[key].total += 1;
        if (row.score >= 9) acc[key].promoters += 1;
        else if (row.score <= 6) acc[key].detractors += 1;

        return acc;
    }, {} as Record<string, { date: string, sortKey: string, total: number, promoters: number, detractors: number }>);

    return Object.values(grouped)
        .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
        .map(item => ({
            date: item.date,
            sortKey: item.sortKey,
            total: item.total,
            nps: calculateNPS(item.promoters, item.detractors, item.total)
        }));
}

export function getCategoryData(data: NPSResponse[]): CategoryData[] {
    const grouped = data.reduce((acc, row) => {
        const type = row.experienceType || 'Não informado';

        if (!acc[type]) {
            acc[type] = { name: type, total: 0, promoters: 0, neutrals: 0, detractors: 0 };
        }

        acc[type].total += 1;
        if (row.score >= 9) acc[type].promoters += 1;
        else if (row.score <= 6) acc[type].detractors += 1;
        else acc[type].neutrals += 1;

        return acc;
    }, {} as Record<string, Omit<CategoryData, 'nps'>>);

    return Object.values(grouped).map(item => ({
        ...item,
        nps: calculateNPS(item.promoters, item.detractors, item.total)
    })).sort((a, b) => b.nps - a.nps); // Sort best NPS first
}
