import { PhoneWizard } from '@/components/admin/PhoneWizard';
import { getActiveBrands } from '@/queries/brands';

export default async function NewPhonePage() {
  const brands = await getActiveBrands();
  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">New Phone</h1>
      <PhoneWizard brands={brands} />
    </div>
  );
}