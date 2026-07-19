'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { advertiseInquirySchema, type AdvertiseInquiryValues } from '@/lib/validation/advertise';
import { submitAdvertiseInquiry } from '@/lib/actions/advertise';

const PLACEMENT_LABELS: Record<AdvertiseInquiryValues['placement'], string> = {
  'homepage-banner': 'Homepage Banner',
  'sidebar-banner': 'Sidebar Banner',
  'featured-phone': 'Featured Phone Slot',
  'featured-price-range': 'Featured Price Range Section',
  other: 'Something else',
};

export function AdvertiseForm() {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdvertiseInquiryValues>({ resolver: zodResolver(advertiseInquirySchema) });

  async function onSubmit(values: AdvertiseInquiryValues) {
    const result = await submitAdvertiseInquiry(values);
    if (result.success) {
      setStatus('success');
      reset();
    } else {
      setStatus('error');
      setErrorMsg(result.error);
    }
  }

  if (status === 'success') {
    return (
      <p className="rounded-lg border border-primary bg-primary-light p-4 text-sm text-primary-dark">
        Thanks — your inquiry has been sent. We&apos;ll get back to you shortly.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium">Name</label>
        <input id="name" {...register('name')} className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary" />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
      </div>
      <div>
        <label htmlFor="company" className="mb-1 block text-sm font-medium">Company / Shop Name</label>
        <input id="company" {...register('company')} className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary" />
        {errors.company && <p className="mt-1 text-xs text-red-600">{errors.company.message}</p>}
      </div>
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">Email</label>
        <input id="email" type="email" {...register('email')} className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary" />
        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="placement" className="mb-1 block text-sm font-medium">Placement You&apos;re Interested In</label>
        <select id="placement" {...register('placement')} className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary">
          {Object.entries(PLACEMENT_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium">Tell us more</label>
        <textarea id="message" rows={5} {...register('message')} className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary" />
        {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>}
      </div>
      {status === 'error' && <p className="text-sm text-red-600">{errorMsg}</p>}
      <button type="submit" disabled={isSubmitting} className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50">
        {isSubmitting ? 'Sending…' : 'Send Inquiry'}
      </button>
    </form>
  );
}