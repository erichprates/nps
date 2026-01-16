"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';

import IntroStep from './IntroStep';
import WelcomeStep from './WelcomeStep';
import ContactStep from './ContactStep';
import NPSScoreStep from './NPSScoreStep';
import OpenFeedbackStep from './OpenFeedbackStep';
import ExperienceTypeStep from './ExperienceTypeStep';
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

    const initialState: SurveyState = {
        step: isTotem ? 'WELCOME' : 'INTRO',
        npsScore: null,
        openFeedback: '',
        conditionalFeedback: '',
        experienceType: '',
        customerName: customerNameParam || undefined,
        customerEmail: emailParam || undefined,
        customerPhone: phoneParam || undefined,
        origin: isTotem ? 'Stand' : (projectParam || undefined)
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
            case 'OPEN_FEEDBACK': return 2;
            case 'CONDITIONAL_FEEDBACK': return 3;
            case 'EXPERIENCE_TYPE': return 4;
            case 'CONTACT': return 5;
            case 'SUBMITTING': return isTotem ? 5.5 : 4.5;
            case 'THANK_YOU': return isTotem ? 6 : 5;
            default: return 0;
        }
    };
    const totalSteps = isTotem ? 6 : 5;

    return (
        <main style={{ position: 'relative', overflowX: 'hidden', minHeight: '100vh', background: 'var(--color-background)' }}>
            {/* Hide Progress Bar on Welcome/ThankYou/Intro */}
            {surveyState.step !== 'THANK_YOU' && surveyState.step !== 'INTRO' && surveyState.step !== 'WELCOME' && (
                <ProgressBar current={getProgress()} total={totalSteps} />
            )}

            <AnimatePresence mode="wait">
                {surveyState.step === 'WELCOME' && (
                    <AnimatedStep key="welcome">
                        <WelcomeStep onStart={handleStart} />
                    </AnimatedStep>
                )}

                {surveyState.step === 'INTRO' && (
                    <AnimatedStep key="intro">
                        <IntroStep onStart={handleStart} customerName={surveyState.customerName} />
                    </AnimatedStep>
                )}

                {surveyState.step === 'NPS_SCORE' && (
                    <AnimatedStep key="nps">
                        <NPSScoreStep
                            currentScore={surveyState.npsScore}
                            onSelect={(score) => {
                                setSurveyState(prev => ({ ...prev, npsScore: score, step: 'OPEN_FEEDBACK' }));
                            }}
                            onBack={isTotem ? () => setSurveyState(initialState) : undefined}
                        />
                    </AnimatedStep>
                )}

                {surveyState.step === 'OPEN_FEEDBACK' && (
                    <AnimatedStep key="open">
                        <OpenFeedbackStep
                            question="Conte um pouco sobre a sua experiência com a PortoBay. O que funcionou bem e o que podemos melhorar?"
                            initialValue={surveyState.openFeedback}
                            onNext={(feedback) => {
                                setSurveyState(prev => ({ ...prev, openFeedback: feedback, step: 'CONDITIONAL_FEEDBACK' }));
                            }}
                            onBack={() => setSurveyState(prev => ({ ...prev, step: 'NPS_SCORE' }))}
                        />
                    </AnimatedStep>
                )}

                {surveyState.step === 'CONDITIONAL_FEEDBACK' && (
                    <AnimatedStep key="conditional">
                        <OpenFeedbackStep
                            question={
                                (surveyState.npsScore || 0) <= 8
                                    ? "O que poderíamos ter feito diferente para que sua avaliação fosse melhor?"
                                    : "Qual foi o principal motivo para você dar essa nota para a PortoBay?"
                            }
                            initialValue={surveyState.conditionalFeedback}
                            onNext={(feedback) => {
                                setSurveyState(prev => ({ ...prev, conditionalFeedback: feedback, step: 'EXPERIENCE_TYPE' }));
                            }}
                            onBack={() => setSurveyState(prev => ({ ...prev, step: 'OPEN_FEEDBACK' }))}
                        />
                    </AnimatedStep>
                )}

                {surveyState.step === 'EXPERIENCE_TYPE' && (
                    <AnimatedStep key="experience">
                        <ExperienceTypeStep
                            onSubmit={!isTotem} // If Totem, onSubmit is false because we have Contact step next
                            onNext={async (type) => {
                                if (isTotem) {
                                    // Go to Contact Step
                                    setSurveyState(prev => ({ ...prev, experienceType: type, step: 'CONTACT' }));
                                } else {
                                    // Submit directly
                                    setSurveyState(prev => ({ ...prev, experienceType: type, step: 'SUBMITTING' }));
                                    const finalData = { ...surveyState, experienceType: type };
                                    try {
                                        await submitSurvey(finalData);
                                        setSurveyState(prev => ({ ...prev, step: 'THANK_YOU' }));
                                    } catch (err) {
                                        alert("Erro ao enviar. Tente novamente.");
                                        setSurveyState(prev => ({ ...prev, step: 'EXPERIENCE_TYPE' }));
                                    }
                                }
                            }}
                            onBack={() => setSurveyState(prev => ({ ...prev, step: 'CONDITIONAL_FEEDBACK' }))}
                        />
                    </AnimatedStep>
                )}

                {surveyState.step === 'CONTACT' && (
                    <AnimatedStep key="contact">
                        <ContactStep
                            onNext={async (contactData) => {
                                // Map contact data to SurveyState keys
                                const finalData: SurveyState = {
                                    ...surveyState,
                                    customerName: contactData.name,
                                    customerEmail: contactData.email || '-',
                                    customerPhone: contactData.phone || '-',
                                    origin: 'Stand', // Ensure Stand origin
                                    step: 'SUBMITTING'
                                };

                                setSurveyState(finalData);

                                try {
                                    await submitSurvey(finalData);
                                    setSurveyState(prev => ({ ...prev, step: 'THANK_YOU' }));
                                } catch (err) {
                                    alert("Erro ao enviar: " + err);
                                    setSurveyState(prev => ({ ...prev, step: 'CONTACT' }));
                                }
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
        </main>
    );
}
