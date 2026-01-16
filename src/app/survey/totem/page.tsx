import { Suspense } from 'react';
import SurveyContainer from "@/components/survey/SurveyContainer";

export default function TotemPage() {
    return (
        <Suspense fallback={<div>Carregando totem...</div>}>
            <SurveyContainer isTotem={true} />
        </Suspense>
    );
}

