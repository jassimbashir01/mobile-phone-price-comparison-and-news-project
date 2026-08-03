import { supabase } from '@/lib/supabase/public';

export const revalidate = 60; // check at most once a minute

export async function GET() {
  const { data } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'cache_version')
    .maybeSingle();

  const version = (data?.value as { version?: number } | null)?.version ?? 0;
  return Response.json({ version });
}