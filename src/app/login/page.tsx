import type { Metadata } from 'next';
import { Suspense } from 'react';
import { LoginForm } from '@/components/admin/LoginForm';
import { SITE_NAME } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Admin Login',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4 py-12">
      <h1 className="mb-1 text-xl font-bold">{SITE_NAME} Admin</h1>
      <p className="mb-6 text-sm text-ink/60">Sign in to manage phones, brands, and news.</p>
      <Suspense fallback={<p className="text-sm text-ink/50">Loading…</p>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}