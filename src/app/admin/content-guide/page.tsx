import type { Metadata } from 'next';
import { ContentGuidancePanel } from '@/components/admin/ContentGuidancePanel';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminContentGuidePage() {
  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">Content Guide</h1>
      <p className="mb-6 text-sm text-ink/60">
        Reference targets for content depth across the site — not enforced
        limits. Google explicitly penalizes content written to hit a word
        count rather than to be genuinely useful, so treat these as a floor
        for &quot;is this actually thorough,&quot; not a target to pad toward.
      </p>
      <ContentGuidancePanel />
    </div>
  );
}