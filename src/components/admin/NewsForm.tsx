"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { newsSchema, type NewsFormValues } from "@/lib/validation/news";
import { createNews, updateNews } from "@/lib/actions/news";
import { SingleImageUploader } from "./SingleImageUploader";
import type { Brand, News } from "@/types/database";
import { AdminSuccessScreen } from "./AdminSuccessScreen";

export function NewsForm({ news, brands }: { news?: News; brands: Brand[] }) {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(
    news?.cover_image_public_id ?? null,
  );
  const [createdArticle, setCreatedArticle] = useState<{
    title: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewsFormValues>({
    resolver: zodResolver(newsSchema),
    defaultValues: news
      ? {
          brand_id: news.brand_id ?? "",
          title: news.title,
          slug: news.slug,
          excerpt: news.excerpt ?? "",
          body: news.body ?? "",
          is_published: news.is_published,
          published_at: news.published_at ?? "",
        }
      : { is_published: false },
  });

  async function onSubmit(values: NewsFormValues) {
    setServerError("");
    try {
      if (news) {
        await updateNews(news.id, values, coverImage);
        router.push("/admin/news");
        router.refresh();
      } else {
        const created = await createNews(values, coverImage);
        setCreatedArticle({ title: created.title });
      }
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Something went wrong");
    }
  }

  if (createdArticle) {
    return (
      <AdminSuccessScreen
        title="Article created"
        message={`"${createdArticle.title}" has been created.`}
        primaryHref="/admin/news"
        primaryLabel="Check News"
        createAnotherHref="/admin/news/new"
        createAnotherLabel="Create Another Article"
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-4">
      <div>
        <label htmlFor="brand_id" className="mb-1 block text-sm font-medium">
          Brand (optional)
        </label>
        <select
          id="brand_id"
          {...register("brand_id")}
          className="w-full rounded-md border border-border px-3 py-2 text-sm"
        >
          <option value="">— None —</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium">
          Title
        </label>
        <input
          id="title"
          {...register("title")}
          className="w-full rounded-md border border-border px-3 py-2 text-sm"
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>
        )}
      </div>
      <div>
        <label htmlFor="slug" className="mb-1 block text-sm font-medium">
          Slug
        </label>
        <input
          id="slug"
          {...register("slug")}
          className="w-full rounded-md border border-border px-3 py-2 text-sm"
        />
        {errors.slug && (
          <p className="mt-1 text-xs text-red-600">{errors.slug.message}</p>
        )}
      </div>
      <div>
        <label htmlFor="excerpt" className="mb-1 block text-sm font-medium">
          Excerpt
        </label>
        <textarea
          id="excerpt"
          rows={2}
          {...register("excerpt")}
          className="w-full rounded-md border border-border px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label htmlFor="body" className="mb-1 block text-sm font-medium">
          Body
        </label>
        <textarea
          id="body"
          rows={10}
          {...register("body")}
          className="w-full rounded-md border border-border px-3 py-2 text-sm"
        />
        {errors.body && (
          <p className="mt-1 text-xs text-red-600">{errors.body.message}</p>
        )}
        <p className="mt-1 text-xs text-ink/40">
          Separate paragraphs with a blank line.
        </p>
      </div>
      <div>
        <label
          htmlFor="cover-image-upload"
          className="mb-1 block text-sm font-medium"
        >
          Cover Image
        </label>
        <SingleImageUploader value={coverImage} onChange={setCoverImage} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" {...register("is_published")} />
        Published (visible on the public site)
      </label>
      {serverError && <p className="text-sm text-red-600">{serverError}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
      >
        {isSubmitting ? "Saving…" : news ? "Save Changes" : "Create Article"}
      </button>
    </form>
  );
}
