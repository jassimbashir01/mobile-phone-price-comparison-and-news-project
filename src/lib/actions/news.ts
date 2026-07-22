'use server';

import { requireRole } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { pingIndexNow, triggerRevalidate } from '@/lib/revalidate';
import { newsSchema, type NewsFormValues } from '@/lib/validation/news';

export async function createNews(values: NewsFormValues, coverImagePublicId: string | null) {
  await requireRole(['admin', 'editor']);
  const parsed = newsSchema.parse(values);

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('news')
    .insert({
      brand_id: parsed.brand_id || null,
      title: parsed.title,
      slug: parsed.slug,
      excerpt: parsed.excerpt || null,
      body: parsed.body,
      is_published: parsed.is_published,
      published_at: parsed.is_published ? parsed.published_at || new Date().toISOString() : null,
      cover_image_public_id: coverImagePublicId,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  await triggerRevalidate(['/', '/news', `/news/${parsed.slug}`]);
  await pingIndexNow(['/', `/news/${parsed.slug}`]);
  return data;
}

export async function updateNews(id: string, values: NewsFormValues, coverImagePublicId: string | null) {
  await requireRole(['admin', 'editor']);
  const parsed = newsSchema.parse(values);

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('news')
    .update({
      brand_id: parsed.brand_id || null,
      title: parsed.title,
      slug: parsed.slug,
      excerpt: parsed.excerpt || null,
      body: parsed.body,
      is_published: parsed.is_published,
      published_at: parsed.is_published ? parsed.published_at || new Date().toISOString() : null,
      cover_image_public_id: coverImagePublicId,
    })
    .eq('id', id);

  if (error) throw new Error(error.message);
  await triggerRevalidate(['/', '/news', `/news/${parsed.slug}`]);
  await pingIndexNow(['/', `/news/${parsed.slug}`]);
}

export async function deleteNews(id: string, slug: string) {
  await requireRole(['admin']);
  const supabase = createAdminClient();
  const { error } = await supabase.from('news').delete().eq('id', id);
  if (error) throw new Error(error.message);
  await triggerRevalidate(['/', '/news', `/news/${slug}`]);
}