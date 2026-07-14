import type { PhoneWithDetails } from '@/types/database';

function Row({ label, a, b }: { label: string; a: React.ReactNode; b: React.ReactNode }) {
  if ((a === null || a === undefined || a === '') && (b === null || b === undefined || b === ''))
    return null;
  const differs = String(a ?? '') !== String(b ?? '');
  return (
    <tr className="border-b border-border last:border-0">
      <th scope="row" className="w-1/4 bg-surface px-3 py-2 text-left text-xs font-medium text-ink/60">
        {label}
      </th>
      <td className={`px-3 py-2 text-sm ${differs ? 'bg-accent/10 font-medium' : ''}`}>{a ?? '—'}</td>
      <td className={`px-3 py-2 text-sm ${differs ? 'bg-accent/10 font-medium' : ''}`}>{b ?? '—'}</td>
    </tr>
  );
}

function boolLabel(v: boolean | undefined) {
  return v === undefined ? undefined : v ? 'Yes' : 'No';
}

export function CompareSpecTable({
  phoneA,
  phoneB,
}: {
  phoneA: PhoneWithDetails;
  phoneB: PhoneWithDetails;
}) {
  const a = phoneA.specs;
  const b = phoneB.specs;

  return (
    <div className="mt-6 overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[600px] border-collapse">
        <thead>
          <tr className="border-b border-border bg-primary-light">
            <th className="px-3 py-2 text-left text-xs font-semibold text-primary-dark">Spec</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-primary-dark">{phoneA.name}</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-primary-dark">{phoneB.name}</th>
          </tr>
        </thead>
        <tbody>
          <Row
            label="Price"
            a={phoneA.price_pkr ? `Rs. ${phoneA.price_pkr.toLocaleString('en-PK')}` : undefined}
            b={phoneB.price_pkr ? `Rs. ${phoneB.price_pkr.toLocaleString('en-PK')}` : undefined}
          />
          <Row label="Network" a={a?.network_type} b={b?.network_type} />
          <Row label="Operating System" a={a?.os} b={b?.os} />
          <Row label="Processor" a={a?.processor} b={b?.processor} />
          <Row
            label="Display Size"
            a={a?.display_size ? `${a.display_size}"` : undefined}
            b={b?.display_size ? `${b.display_size}"` : undefined}
          />
          <Row label="Display Type" a={a?.display_type} b={b?.display_type} />
          <Row label="RAM" a={a?.ram_gb ? `${a.ram_gb} GB` : undefined} b={b?.ram_gb ? `${b.ram_gb} GB` : undefined} />
          <Row
            label="Storage"
            a={a?.storage_gb ? `${a.storage_gb} GB` : undefined}
            b={b?.storage_gb ? `${b.storage_gb} GB` : undefined}
          />
          <Row
            label="Main Camera"
            a={a?.main_camera_mp ? `${a.main_camera_mp} MP` : undefined}
            b={b?.main_camera_mp ? `${b.main_camera_mp} MP` : undefined}
          />
          <Row label="Video Recording" a={boolLabel(a?.video_recording)} b={boolLabel(b?.video_recording)} />
          <Row
            label="Battery"
            a={a?.battery_mah ? `${a.battery_mah} mAh` : undefined}
            b={b?.battery_mah ? `${b.battery_mah} mAh` : undefined}
          />
          <Row label="Bluetooth" a={boolLabel(a?.bluetooth)} b={boolLabel(b?.bluetooth)} />
          <Row label="WiFi" a={boolLabel(a?.wifi)} b={boolLabel(b?.wifi)} />
          <Row label="Dual SIM" a={boolLabel(a?.dual_sim)} b={boolLabel(b?.dual_sim)} />
          <Row label="FM Radio" a={boolLabel(a?.fm_radio)} b={boolLabel(b?.fm_radio)} />
          <Row label="Memory Card" a={boolLabel(a?.memory_card)} b={boolLabel(b?.memory_card)} />
        </tbody>
      </table>
      <p className="border-t border-border bg-surface px-3 py-2 text-[11px] text-ink/40">
        Highlighted cells indicate a difference between the two phones.
      </p>
    </div>
  );
}