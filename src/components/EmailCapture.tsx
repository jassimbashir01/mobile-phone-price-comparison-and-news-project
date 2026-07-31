'use client';

import { useState } from 'react';
import { subscribeEmail } from '@/lib/actions/emailCapture';

export function EmailCapture({ source = 'homepage' }: { source?: string }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setError('');
    const result = await subscribeEmail({ email, source });
    if (result.success) {
      setStatus('success');
      setEmail('');
    } else {
      setStatus('error');
      setError(result.error);
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-lg border border-primary bg-primary-light p-4 text-center text-sm text-primary-dark">
        You&apos;re subscribed — we&apos;ll email you about new phone launches and price drops.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="flex-1 rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
      >
        {status === 'loading' ? 'Subscribing…' : 'Notify Me'}
      </button>
      {status === 'error' && <p className="text-xs text-red-600 sm:absolute sm:mt-10">{error}</p>}
    </form>
  );
}