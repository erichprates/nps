import SurveyContainer from "@/components/survey/SurveyContainer";
import { Suspense } from 'react';

// Force dynamic rendering to ensure search params are handled correctly on the server if needed,
// though SurveyContainer is a client component using useSearchParams.
export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Carregando...</div>}>
        <SurveyContainer />
      </Suspense>
    </main>
  );
}
