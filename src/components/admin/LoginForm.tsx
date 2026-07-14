'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser';
import { loginSchema, type LoginFormValues } from '@/lib/validation/auth';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [authError, setAuthError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginFormValues) {
    setAuthError('');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword(values);
    if (error) {
      setAuthError('Invalid email or password.');
      return;
    }
    const redirectTo = searchParams.get('redirectTo') || '/admin';
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">Email</label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary"
        />
        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium">Password</label>
        <input
          id="password"
          type="password"
          {...register('password')}
          className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary"
        />
        {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
      </div>
      {authError && <p className="text-sm text-red-600">{authError}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
      >
        {isSubmitting ? 'Signing in…' : 'Sign In'}
      </button>
    </form>
  );
}