"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';

import IntroStep from './IntroStep';
import WelcomeStep from './WelcomeStep';
import ContactStep from './ContactStep';
import NPSScoreStep from './NPSScoreStep';
import OpenFeedbackStep from './OpenFeedbackStep';
import MultiSelectStep from './MultiSelectStep';
import SingleSelectStep from './SingleSelectStep';
import ThankYouStep from './ThankYouStep';
import AnimatedStep from './AnimatedStep';
import ProgressBar from './ProgressBar';

import { submitSurvey } from '@/lib/actions';
import { SurveyState } from './types';

interface SurveyContainerProps {
    isTotem?: boolean;
}

export default function SurveyContainer({ isTotem = false }: SurveyContainerProps) {
    const searchParams = useSearchParams();
    const customerNameParam = searchParams.get('n');
    const projectParam = searchParams.get('p');
    const emailParam = searchParams.get('e');
    const phoneParam = searchParams.get('t');
    const categoryParam = searchParams.get('c'); // 'pre' or 'pos'

    const detectedCategory: 'pos-venda' | 'pre-venda' = isTotem ? 'pre-venda' : (categoryParam === 'pre' ? 'pre-venda' : 'pos-venda');

    const initialState: SurveyState = {
        step: isTotem ? 'WELCOME' : 'INTRO',
        npsScore: null,
        openFeedback: '',
        conditionalFeedback: '',
        experienceType: '',
        customerName: customerNameParam || undefined,
        customerEmail: emailParam || undefined,
        customerPhone: phoneParam || undefined,
        origin: isTotem ? 'Stand' : (projectParam || undefined),
        feelings: [],
        keyPoints: [],
        expectations: '',
        improvementAreas: [],
        improvementOther: '',
        suggestions: '',
        surveyCategory: detectedCategory
    };

    const [surveyState, setSurveyState] = useState<SurveyState>(initialState);

    // Auto-reset logic for Totem
    useEffect(() => {
        if (isTotem && surveyState.step === 'THANK_YOU') {
            const timer = setTimeout(() => {
                setSurveyState(initialState);
            }, 5000); // 5 seconds reset
            return () => clearTimeout(timer);
        }
    }, [surveyState.step, isTotem]);

    const handleStart = () => {
        setSurveyState(prev => ({ ...prev, step: 'NPS_SCORE' }));
    };

    // Calculate Progress
    const getProgress = () => {
        switch (surveyState.step) {
            case 'WELCOME': return 0;
            case 'INTRO': return 0;
            case 'NPS_SCORE': return 1;
            case 'FEELINGS': return 2;
            case 'KEY_POINTS': return 3;
            case 'EXPECTATIONS': return 4;
            case 'IMPROVEMENTS': return 5;
            case 'SUGGESTIONS': return 6;
            case 'CONTACT': return 7;
            case 'SUBMITTING': return isTotem ? 7.5 : 6.5;
            case 'THANK_YOU': return isTotem ? 8 : 7;
            default: return 0;
        }
    };

    const getStepLabel = () => {
        switch (surveyState.step) {
            case 'NPS_SCORE': return 'Nota';
            case 'FEELINGS': return 'Sentimentos';
            case 'KEY_POINTS': return 'Destaques';
            case 'EXPECTATIONS': return 'Expectativas';
            case 'IMPROVEMENTS': return 'Melhorias';
            case 'SUGGESTIONS': return 'Sugestões';
            case 'CONTACT': return 'Identificação';
            default: return '';
        }
    }

    const totalSteps = isTotem ? 7 : 6; // Adjust total steps for label consistency

    const isSplash = surveyState.step === 'INTRO' || surveyState.step === 'WELCOME';
    const isPreVenda = surveyState.surveyCategory === 'pre-venda';

    return (
        <main style={{
            position: 'relative',
            overflow: isSplash ? 'hidden' : 'auto',
            height: isSplash ? '100dvh' : 'auto',
            minHeight: '100dvh',
            background: isPreVenda && isSplash ? 'var(--color-primary)' : 'var(--color-background)',
            display: 'flex',
            flexDirection: 'column',
            transition: 'background-color 0.3s ease'
        }}>
            {/* Hide Progress Bar on Welcome/ThankYou/Intro */}
            {surveyState.step !== 'THANK_YOU' && surveyState.step !== 'INTRO' && surveyState.step !== 'WELCOME' && surveyState.step !== 'SUBMITTING' && (
                <ProgressBar current={getProgress()} total={totalSteps} label={getStepLabel()} />
            )}

            {/* Survey Category Title */}
            {(surveyState.step === 'INTRO' || surveyState.step === 'WELCOME') && (
                <div style={{ position: 'absolute', top: '2rem', left: '0', right: '0', textAlign: 'center', zIndex: 10 }}>
                    <div style={{
                        display: 'inline-block',
                        padding: '0.4rem 1rem',
                        background: surveyState.surveyCategory === 'pre-venda' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '99px',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        letterSpacing: '0.1em',
                        color: surveyState.surveyCategory === 'pre-venda' ? 'white' : 'var(--color-primary)',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        {surveyState.surveyCategory === 'pre-venda' ? 'PRÉ-VENDA' : 'PÓS-VENDAS'}
                    </div>
                </div>
            )}

            <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingBottom: '2rem' }}>
                <AnimatePresence mode="wait">
                    {surveyState.step === 'WELCOME' && (
                        <AnimatedStep key="welcome">
                            <WelcomeStep onStart={handleStart} />
                        </AnimatedStep>
                    )}

                    {surveyState.step === 'INTRO' && (
                        <AnimatedStep key="intro">
                            <IntroStep
                                onStart={handleStart}
                                customerName={surveyState.customerName}
                                category={surveyState.surveyCategory}
                            />
                        </AnimatedStep>
                    )}

                    {surveyState.step === 'NPS_SCORE' && (
                        <AnimatedStep key="nps">
                            <NPSScoreStep
                                currentScore={surveyState.npsScore}
                                onSelect={(score) => {
                                    setSurveyState(prev => ({ ...prev, npsScore: score, step: 'FEELINGS' }));
                                }}
                                onBack={undefined}
                            />
                        </AnimatedStep>
                    )}

                    {surveyState.step === 'FEELINGS' && (
                        <AnimatedStep key="feelings">
                            <MultiSelectStep
                                title={surveyState.surveyCategory === 'pre-venda'
                                    ? "Como foi sua experiência com nosso atendimento?"
                                    : "Como você se sentiu ao fazer negócio com a PortoBay?"}
                                subtitle="Escolha até 2 opções"
                                options={surveyState.surveyCategory === 'pre-venda'
                                    ? ['Excelente', 'Confortável', 'Bem atendido', 'Respeitado', 'Confuso', 'Indiferente']
                                    : ['Seguro', 'Confortável', 'Bem atendido', 'Respeitado', 'Confuso', 'Indiferente']}
                                maxSelection={2}
                                initialValues={surveyState.feelings}
                                onNext={(selected) => setSurveyState(prev => ({ ...prev, feelings: selected, step: 'KEY_POINTS' }))}
                                onBack={() => setSurveyState(prev => ({ ...prev, step: 'NPS_SCORE' }))}
                            />
                        </AnimatedStep>
                    )}

                    {surveyState.step === 'KEY_POINTS' && (
                        <AnimatedStep key="key_points">
                            <MultiSelectStep
                                title="Qual pontos marcaram sua experiência?"
                                subtitle="Escolha até 2 opções"
                                options={surveyState.surveyCategory === 'pre-venda'
                                    ? ['Agilidade no atendimento', 'Clareza com as informações', 'Conhecimento do(a) Atendente(a)', 'Transparência', 'Nada se destacou']
                                    : ['Atendimento', 'Transparência e confiança', 'Agilidade no processo', 'Documentação', 'Nada se destacou']}
                                maxSelection={2}
                                initialValues={surveyState.keyPoints}
                                onNext={(selected) => setSurveyState(prev => ({ ...prev, keyPoints: selected, step: 'EXPECTATIONS' }))}
                                onBack={() => setSurveyState(prev => ({ ...prev, step: 'FEELINGS' }))}
                            />
                        </AnimatedStep>
                    )}

                    {surveyState.step === 'EXPECTATIONS' && (
                        <AnimatedStep key="expectations">
                            <SingleSelectStep
                                title="Nosso atendimento atendeu às suas expectativas?"
                                options={['Acima do esperado', 'Dentro do esperado', 'Abaixo do esperado']}
                                selected={surveyState.expectations}
                                onSelect={(option) => setSurveyState(prev => ({ ...prev, expectations: option, step: 'IMPROVEMENTS' }))}
                                onBack={() => setSurveyState(prev => ({ ...prev, step: 'KEY_POINTS' }))}
                            />
                        </AnimatedStep>
                    )}

                    {surveyState.step === 'IMPROVEMENTS' && (
                        <AnimatedStep key="improvements">
                            <MultiSelectStep
                                title="Teve algum ponto que poderia ser melhor?"
                                subtitle="Escolha até 2 opções"
                                options={surveyState.surveyCategory === 'pre-venda'
                                    ? ['Postura do atendente', 'Organização da apresentação', 'Comunicação', 'Clareza das informações', 'Nada a melhorar', 'Outro:']
                                    : ['Tempo de resposta', 'Clareza das informações', 'Organização do processo', 'Comunicação', 'Nada a melhorar', 'Outro:']}
                                maxSelection={2}
                                initialValues={surveyState.improvementAreas}
                                allowOther={true}
                                otherValue={surveyState.improvementOther}
                                onNext={(selected) => setSurveyState(prev => ({ ...prev, improvementAreas: selected, step: 'SUGGESTIONS' }))}
                                onBack={() => setSurveyState(prev => ({ ...prev, step: 'EXPECTATIONS' }))}
                            />
                        </AnimatedStep>
                    )}

                    {surveyState.step === 'SUGGESTIONS' && (
                        <AnimatedStep key="suggestions">
                            <OpenFeedbackStep
                                question="Se quiser, deixe aqui alguma sugestão para tornar sua experiência ainda melhor."
                                initialValue={surveyState.suggestions}
                                nextLabel={isTotem ? 'Continuar' : 'Enviar!'}
                                onNext={(val) => {
                                    if (isTotem) {
                                        setSurveyState(prev => ({ ...prev, suggestions: val, step: 'CONTACT' }));
                                    } else {
                                        const finalData = { ...surveyState, suggestions: val, step: 'SUBMITTING' as const };
                                        setSurveyState(finalData);
                                        handleSubmit(finalData);
                                    }
                                }}
                                onBack={() => setSurveyState(prev => ({ ...prev, step: 'IMPROVEMENTS' }))}
                            />
                        </AnimatedStep>
                    )}

                    {surveyState.step === 'CONTACT' && (
                        <AnimatedStep key="contact">
                            <ContactStep
                                nextLabel="Enviar!"
                                onNext={async (contactData) => {
                                    const finalData: SurveyState = {
                                        ...surveyState,
                                        customerName: contactData.name,
                                        customerEmail: contactData.email || '-',
                                        customerPhone: contactData.phone || '-',
                                        origin: isTotem ? 'Stand' : surveyState.origin,
                                        step: 'SUBMITTING'
                                    };
                                    setSurveyState(finalData);
                                    handleSubmit(finalData);
                                }}
                            />
                        </AnimatedStep>
                    )}

                    {surveyState.step === 'SUBMITTING' && (
                        <AnimatedStep key="submitting">
                            <div className="container flex-center" style={{ minHeight: '100vh', flexDirection: 'column' }}>
                                <div className="spinner"></div>
                                <h2 style={{ marginTop: '1rem', color: 'var(--color-primary)' }}>Enviando sua avaliação...</h2>
                            </div>
                        </AnimatedStep>
                    )}

                    {surveyState.step === 'THANK_YOU' && (
                        <AnimatedStep key="thankyou">
                            <ThankYouStep />
                        </AnimatedStep>
                    )}
                </AnimatePresence>
            </div>


        </main>
    );

    async function handleSubmit(finalData: SurveyState) {
        try {
            const result = await submitSurvey(finalData);
            if (result.success) {
                setSurveyState(prev => ({ ...prev, step: 'THANK_YOU' }));
            } else {
                alert("Erro ao enviar: " + result.error);
                setSurveyState(prev => ({ ...prev, step: isTotem ? 'CONTACT' : 'SUGGESTIONS' }));
            }
        } catch (err) {
            alert("Erro ao enviar: " + err);
            setSurveyState(prev => ({ ...prev, step: isTotem ? 'CONTACT' : 'SUGGESTIONS' }));
        }
    }
}

