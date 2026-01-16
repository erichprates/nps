import { Suspense } from 'react';
import SurveyContainer from "@/components/survey/SurveyContainer";

export default function SurveyPage() {
    return (
        <Suspense fallback={<div>Carregando pesquisa...</div>}>
            <SurveyContainer />
        </Suspense>
    );
}

