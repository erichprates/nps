import { createAdminClient } from '@/lib/supabase';
import { redirect } from 'next/navigation';

export default async function ShortLinkPage({ params }: { params: Promise<{ code: string }> }) {
    const { code } = await params;

    // Use admin client to bypass RLS
    const supabase = await createAdminClient();

    const { data, error } = await supabase
        .from('short_links')
        .select('long_url')
        .eq('code', code)
        .single();

    if (error || !data) {
        console.error(`Short link lookup failed for code '${code}':`, error);
        redirect('/');
    }

    redirect(data.long_url);
}
