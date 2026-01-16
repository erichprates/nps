import { supabase } from '@/lib/supabase';
import { redirect } from 'next/navigation';

export default async function ShortLinkPage({ params }: { params: { code: string } }) {
    const { code } = params;

    const { data, error } = await supabase
        .from('short_links')
        .select('long_url')
        .eq('code', code)
        .single();

    if (error || !data) {
        redirect('/'); // Or a custom 404
    }

    redirect(data.long_url);
}
