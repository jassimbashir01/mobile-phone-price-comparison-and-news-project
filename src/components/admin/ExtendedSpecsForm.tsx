'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RichTextEditor } from './RichTextEditor';
import { savePhoneExtendedSpecs } from '@/lib/actions/phoneExtendedSpecs';
import { EXTENDED_SPEC_GROUPS, type PhoneExtendedSpecsFormValues } from '@/lib/validation/phoneExtendedSpecs';
import type { PhoneExtendedSpecs } from '@/types/database';

export function ExtendedSpecsForm({
  phoneId,
  phoneSlug,
  initialValues,
}: {
  phoneId: string;
  phoneSlug: string;
  initialValues: PhoneExtendedSpecs | null;
}) {
  const router = useRouter();
  const [values, setValues] = useState<PhoneExtendedSpecsFormValues>(() => {
    const out: Record<string, string> = {};
    for (const group of EXTENDED_SPEC_GROUPS) {
      for (const field of group.fields) {
        out[field.key] = (initialValues?.[field.key as keyof PhoneExtendedSpecs] as string | null) ?? '';
      }
    }
    return out as PhoneExtendedSpecsFormValues;
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  function updateField(key: string, html: string) {
    setValues((prev) => ({ ...prev, [key]: html }));
    setSaved(false);
  }

  async function handleSave() {
    setError('');
    setSaving(true);
    try {
      await savePhoneExtendedSpecs(phoneId, phoneSlug, values);
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-xs text-ink/50">
        Leave any row blank and it simply won&apos;t appear on the public spec
        table — no need to delete or hide anything manually.
      </p>

      {EXTENDED_SPEC_GROUPS.map((group) => (
        <fieldset key={group.label} className="rounded-lg border border-border p-4">
          <legend className="px-1 text-sm font-semibold">{group.label}</legend>
          <div className="space-y-4">
            {group.fields.map((field) => (
              <div key={field.key}>
                <label className="mb-1 block text-sm font-medium">{field.label}</label>
                <RichTextEditor
                  value={values[field.key] ?? ''}
                  onChange={(html) => updateField(field.key, html)}
                  placeholder={`${field.label}…`}
                />
              </div>
            ))}
          </div>
        </fieldset>
      ))}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
      >
        {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save Full Specifications'}
      </button>
    </div>
  );
}