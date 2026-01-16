import { getSurveyResults } from "@/lib/dataFetch";
import ResponsesContainer from "@/components/admin/ResponsesContainer";

// Force dynamic rendering to ensure fresh data
export const dynamic = 'force-dynamic';

export default async function ResponsesPage() {
    // Fetch data on the server
    const data = await getSurveyResults();

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ marginBottom: 0 }}>Respostas das Pesquisas</h1>
            </div>

            {/* Pass data to Client Component */}
            <ResponsesContainer initialData={data} />
        </div>
    );
}
