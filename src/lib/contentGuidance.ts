// Guidance only — never enforced as a hard minimum. Google explicitly
// warns against optimizing to a word-count target; these are realistic
// targets for genuine depth per content type, based on 2026 AdSense
// approval and content-quality consensus (see admin Settings page for
// the reasoning behind each number).
export interface ContentGuidance {
  context: string;
  recommendedWords: string;
  note: string;
}

export const CONTENT_GUIDANCE: ContentGuidance[] = [
  {
    context: 'News Articles (body)',
    recommendedWords: '600–1,000 words',
    note: 'The strongest lever for ad revenue on this site — every article is a full page with 2 in-content ad slots. Short news posts under ~300 words read as thin content and hurt both AdSense standing and SEO.',
  },
  {
    context: 'Phone Overview',
    recommendedWords: '150–300 words',
    note: 'A genuine summary in your own words — who the phone suits, what stands out. Avoid restating the spec table; that duplicates the table below it.',
  },
  {
    context: 'Phone Description',
    recommendedWords: '300–600 words',
    note: 'Room for real detail: design impressions, camera/battery real-world notes, how it compares to its price bracket. This is what makes a phone page feel like a genuine review rather than a data sheet.',
  },
  {
    context: 'SEO Meta Description',
    recommendedWords: '20–30 words (roughly 150–160 characters)',
    note: 'This is what shows in Google search results, not on the page itself. Longer gets truncated by Google regardless of what you write.',
  },
  {
    context: 'Brand Description',
    recommendedWords: '50–120 words',
    note: 'A short, genuine description of the brand — avoid generic filler ("X is a leading smartphone manufacturer...") since that reads as thin content across every brand page if repeated with the same structure.',
  },
  {
    context: 'Offer / Deal Description',
    recommendedWords: '20–50 words',
    note: 'Short by nature — this is a listing, not an article. Keep it factual and specific to the actual deal.',
  },
  {
    context: 'Full Site (overall)',
    recommendedWords: '15–25+ genuinely original pages minimum before applying for AdSense',
    note: 'From current AdSense approval guidance: quality and specificity matter far more than hitting any word count — a handful of excellent, specific articles outperforms many thin ones. This applies to the site as a whole, not any single page.',
  },
];