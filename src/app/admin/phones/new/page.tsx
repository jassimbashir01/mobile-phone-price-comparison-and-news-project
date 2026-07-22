import { PhoneWizard } from '@/components/admin/PhoneWizard';
import { getAllBrandsAdmin } from '@/queries/admin';

export default async function NewPhonePage() {
  const brands = await getAllBrandsAdmin();
  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">New Phone</h1>
      <PhoneWizard brands={brands} />
    </div>
  );
}