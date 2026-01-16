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

export type CorrelationData = {
    name: string;
    promoterCount: number;
    neutralCount: number;
    detractorCount: number;
    total: number;
    promoterPercentage: number;
};

export type Insight = {
    type: 'positive' | 'negative' | 'neutral';
    title: string;
    description: string;
    action?: string;
};

export type TimeFilter = 'day' | 'week' | 'month' | 'year';

function calculateNPS(promoters: number, detractors: number, total: number) {
    if (total === 0) return 0;
    return Math.round(((promoters - detractors) / total) * 100);
}

export function getTrendData(data: NPSResponse[], filter: TimeFilter = 'day'): TrendData[] {
    const grouped = data.reduce((acc, row) => {
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
        } else if (filter === 'week') {
            // Simple week calculation: Year-WXX
            const firstDayOfYear = new Date(Number(year), 0, 1);
            const pastDaysOfYear = (new Date(Number(year), Number(month) - 1, Number(day)).getTime() - firstDayOfYear.getTime()) / 86400000;
            const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
            key = `${year}-W${weekNumber.toString().padStart(2, '0')}`;
            label = `S${weekNumber}/${year.slice(2)}`;
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

export function getCorrelationData(data: NPSResponse[], field: 'feelings' | 'keyPoints' | 'improvementAreas'): CorrelationData[] {
    const grouped = data.reduce((acc, row) => {
        const values = row[field] || [];
        values.forEach(val => {
            if (!acc[val]) {
                acc[val] = { name: val, promoterCount: 0, neutralCount: 0, detractorCount: 0, total: 0 };
            }
            acc[val].total += 1;
            if (row.score >= 9) acc[val].promoterCount += 1;
            else if (row.score <= 6) acc[val].detractorCount += 1;
            else acc[val].neutralCount += 1;
        });
        return acc;
    }, {} as Record<string, { name: string, promoterCount: number, neutralCount: number, detractorCount: number, total: number }>);

    return Object.values(grouped).map(item => ({
        ...item,
        promoterPercentage: Math.round((item.promoterCount / (item.total || 1)) * 100)
    })).sort((a, b) => b.total - a.total);
}

export function getSmartInsights(data: NPSResponse[]): Insight[] {
    const insights: Insight[] = [];
    if (data.length < 3) return insights;

    // Filters for "filler" or neutral values that shouldn't be insights
    const neutralFillers = ['Nada se destacou', 'Indiferente', 'Nada a melhorar', 'Não informado'];

    // 1. Feelings correlation
    const feelings = getCorrelationData(data, 'feelings')
        .filter(f => !neutralFillers.includes(f.name));

    const topFeeling = feelings[0];
    if (topFeeling && topFeeling.promoterPercentage > 70) {
        insights.push({
            type: 'positive',
            title: `Forte associação: ${topFeeling.name}`,
            description: `${topFeeling.promoterPercentage}% das pessoas que se sentem "${topFeeling.name}" são promotoras.`,
            action: 'Use este sentimento em campanhas de marketing.'
        });
    }

    // 2. Detractor improvement areas
    const improvements = getCorrelationData(data, 'improvementAreas')
        .filter(i => !neutralFillers.includes(i.name));

    const mostRequested = improvements.find(i => i.detractorCount > 0);
    if (mostRequested) {
        insights.push({
            type: 'negative',
            title: `Atenção: ${mostRequested.name}`,
            description: `${mostRequested.detractorCount} detratores apontaram "${mostRequested.name}" como ponto de melhoria.`,
            action: 'Revise este processo interno imediatamente.'
        });
    }

    // 3. Promoter factors
    const keyPoints = getCorrelationData(data, 'keyPoints')
        .filter(k => !neutralFillers.includes(k.name));

    const keyDriver = keyPoints[0];
    if (keyDriver && keyDriver.promoterPercentage > 60) {
        insights.push({
            type: 'positive',
            title: `Diferencial: ${keyDriver.name}`,
            description: `"${keyDriver.name}" é o fator que mais gera encantamento.`,
            action: 'Fortaleça e padronize este ponto entre toda a equipe.'
        });
    }


    // 4. NPS vs Experience Mismatches
    const highNpsLowExp = data.filter(d => d.score >= 9 && (d.experienceScore ?? 0) <= 2);
    if (highNpsLowExp.length > 0) {
        insights.push({
            type: 'negative',
            title: 'Promotores sob risco',
            description: `${highNpsLowExp.length} clientes deram nota alta, mas tiveram vivência negativa (Termômetro baixo).`,
            action: 'Analise estes casos; eles podem não voltar apesar da nota alta.'
        });
    }

    const lowNpsHighExp = data.filter(d => d.score <= 6 && (d.experienceScore ?? 0) >= 8);
    if (lowNpsHighExp.length > 0) {
        insights.push({
            type: 'positive',
            title: 'Oportunidade de Recuperação',
            description: `${lowNpsHighExp.length} detratores tiveram uma excelente vivência técnica (Termômetro alto).`,
            action: 'Contate-os; a nota baixa pode ser apenas um detalhe pontual fácil de resolver.'
        });
    }


    return insights;
}

export type ExperienceFactor = {
    name: string;
    score: number;
    type: 'positive' | 'negative' | 'neutral';
};

export function calculateExperienceScore(response: Partial<NPSResponse>): { score: number; label: string; factors: ExperienceFactor[] } {
    let score = 0;
    const factors: ExperienceFactor[] = [];

    // Pergunta 2: Sentimentos
    const feelingWeights: Record<string, number> = {
        // Pós
        'Seguro': 2, 'Confortável': 2, 'Bem atendido': 3, 'Respeitado': 3,
        // Pré
        'Excelente': 3,
        // Common
        'Indiferente': 0, 'Confuso': -3
    };
    (response.feelings || []).forEach(f => {
        const weight = feelingWeights[f] || 0;
        score += weight;
        if (weight !== 0) {
            factors.push({ name: f, score: weight, type: weight > 0 ? 'positive' : 'negative' });
        }
    });

    // Pergunta 3: Pontos marcantes
    const pointWeights: Record<string, number> = {
        // Pós
        'Atendimento': 3, 'Transparência e confiança': 3, 'Agilidade no processo': 2, 'Documentação': 1,
        // Pré
        'Agilidade no atendimento': 3, 'Clareza com as informações': 3, 'Conhecimento do(a) Atendente(a)': 3, 'Transparência': 2,
        // Common
        'Nada se destacou': 0
    };
    (response.keyPoints || []).forEach(p => {
        const weight = pointWeights[p] || 0;
        score += weight;
        if (weight !== 0) {
            factors.push({ name: p, score: weight, type: weight > 0 ? 'positive' : 'negative' });
        }
    });

    // Pergunta 4: Expectativa
    const expWeights: Record<string, number> = {
        'Acima do esperado': 3, 'Dentro do esperado': 1, 'Abaixo do esperado': -4
    };
    const expWeight = expWeights[response.expectations || ''] || 0;
    score += expWeight;
    if (expWeight !== 0) {
        factors.push({ name: response.expectations!, score: expWeight, type: expWeight > 0 ? 'positive' : 'negative' });
    }

    // Pergunta 5: Melhorias
    const impWeights: Record<string, number> = {
        'Nada a melhorar': 3, 'Clareza das informações': -2, 'Organização do processo': -2,
        'Comunicação': -2, 'Tempo de resposta': -2, 'Outro:': -1
    };
    (response.improvementAreas || []).forEach(i => {
        const weight = impWeights[i] || 0;
        score += weight;
        if (weight !== 0) {
            factors.push({ name: i, score: weight, type: weight > 0 ? 'positive' : 'negative' });
        }
    });

    let label = 'Regular';

    // Normalize logic:
    // Max theoretical: ~16-18 points
    // Min theoretical: ~(-12) points
    // Index = ((Score + 12) / 30) * 100
    const normalizedIndex = Math.min(100, Math.max(0, Math.round(((score + 10) / 28) * 100)));

    if (normalizedIndex >= 85) label = 'Encantamento';
    else if (normalizedIndex <= 45) label = 'Atrito';

    return { score: normalizedIndex, label, factors };
}


