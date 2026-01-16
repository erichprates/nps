import { getSurveyResults } from "@/lib/dataFetch";
import DashboardContainer from "@/components/admin/DashboardContainer";

// Force dynamic rendering to ensure fresh data
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    // Fetch data on the server
    const data = await getSurveyResults();

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ marginBottom: 0 }}>Dashboard</h1>
            </div>

            {/* Pass data to Client Component for interactivity */}
            <DashboardContainer initialData={data} />
        </div>
    );
}
