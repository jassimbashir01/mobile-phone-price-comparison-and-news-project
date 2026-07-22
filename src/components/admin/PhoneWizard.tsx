'use client';

import { useState } from 'react';
import { AdminStepper } from './AdminStepper';
import { AdminSuccessScreen } from './AdminSuccessScreen';
import { PhoneForm } from './PhoneForm';
import { ImageUploader, type ManagedImage } from './ImageUploader';
import { ExtendedSpecsForm } from './ExtendedSpecsForm';
import { savePhoneImages } from '@/lib/actions/phones';
import type { Brand } from '@/types/database';

const STEPS = ['Filtering Specs', 'Images', 'Full Specifications', 'Done'];

export function PhoneWizard({ brands }: { brands: Brand[] }) {
  const [step, setStep] = useState(1);
  const [createdPhone, setCreatedPhone] = useState<{
    id: string;
    slug: string;
    name: string;
  } | null>(null);
  const [images, setImages] = useState<ManagedImage[]>([]);
  const [imageError, setImageError] = useState('');
  const [savingImages, setSavingImages] = useState(false);

  // Step 1 finishes by creating the phone (PhoneForm's own create action),
  // which gives us the real phone_id every later step needs.
  function handlePhoneCreated(phone: { id: string; slug: string; name: string }) {
    setCreatedPhone(phone);
    setStep(2);
  }

  async function handleImagesNext() {
    if (!createdPhone) return;
    setImageError('');
    setSavingImages(true);
    try {
      await savePhoneImages(createdPhone.id, images, createdPhone.slug);
      setStep(3);
    } catch (e) {
      setImageError(e instanceof Error ? e.message : 'Failed to save images');
    } finally {
      setSavingImages(false);
    }
  }

  function handleSpecsSaved() {
    setStep(4);
  }

  return (
    <div>
      <AdminStepper steps={STEPS} currentStep={step} />

      {step === 1 && <PhoneForm brands={brands} onCreated={handlePhoneCreated} />}

      {step === 2 && createdPhone && (
        <div className="max-w-3xl space-y-4">
          <div>
            <h2 className="mb-1 text-sm font-semibold">Upload Images for {createdPhone.name}</h2>
            <p className="mb-3 text-xs text-ink/50">
              Add as many as you like, set one as primary, reorder with the
              arrows. You can skip this for now and add images later from the
              phone&apos;s edit page.
            </p>
            <ImageUploader images={images} onChange={setImages} />
          </div>
          {imageError && <p className="text-sm text-red-600">{imageError}</p>}
          <div className="flex gap-3">
            <button
              onClick={handleImagesNext}
              disabled={savingImages}
              className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
            >
              {savingImages ? 'Saving…' : 'Next: Full Specifications'}
            </button>
            <button
              onClick={() => setStep(3)}
              className="rounded-md border border-border px-5 py-2 text-sm text-ink/60 hover:border-primary"
            >
              Skip for now
            </button>
          </div>
        </div>
      )}

      {step === 3 && createdPhone && (
        <div className="max-w-3xl">
          <h2 className="mb-1 text-sm font-semibold">Full Specifications for {createdPhone.name}</h2>
          <p className="mb-3 text-xs text-ink/50">
            This is the detailed table shown publicly on the phone page. You can
            also skip this now and fill it in later from the phone&apos;s edit
            page.
          </p>
          <ExtendedSpecsForm
            phoneId={createdPhone.id}
            phoneSlug={createdPhone.slug}
            initialValues={null}
            onSaved={handleSpecsSaved}
          />
          <button
            onClick={() => setStep(4)}
            className="mt-3 text-xs text-ink/50 underline hover:text-primary"
          >
            Skip for now
          </button>
        </div>
      )}

      {step === 4 && createdPhone && (
        <AdminSuccessScreen
          title="Phone created"
          message={`${createdPhone.name} has been created and is now live.`}
          primaryHref="/admin/phones"
          primaryLabel="Check Phones"
          createAnotherHref="/admin/phones/new"
          createAnotherLabel="Create Another Phone"
        />
      )}
    </div>
  );
}