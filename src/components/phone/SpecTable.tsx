import type { PhoneSpecs } from '@/types/database';

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === null || value === undefined || value === '') return null;
  return (
    <tr className="border-b border-border last:border-0">
      <th scope="row" className="w-1/3 bg-surface px-3 py-2 text-left text-xs font-medium text-ink/60">
        {label}
      </th>
      <td className="px-3 py-2 text-sm text-ink">{value}</td>
    </tr>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 overflow-hidden rounded-lg border border-border">
      <h3 className="bg-primary-light px-3 py-2 text-sm font-semibold text-primary-dark">{title}</h3>
      <table className="w-full border-collapse">
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function boolLabel(v: boolean | undefined) {
  return v === undefined ? undefined : v ? 'Yes' : 'No';
}

function titleCase(key: string) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^./, (c) => c.toUpperCase());
}

function jsonRows(obj: Record<string, unknown> | undefined) {
  return Object.entries(obj ?? {}).map(([key, value]) => (
    <Row key={key} label={titleCase(key)} value={String(value)} />
  ));
}

export function SpecTable({ specs }: { specs: PhoneSpecs | null }) {
  if (!specs) {
    return <p className="text-sm text-ink/50">Full specifications coming soon.</p>;
  }

  return (
    <div>
      <Group title="General">
        <Row label="Network" value={specs.network_type} />
        <Row label="Operating System" value={specs.os} />
        <Row label="Processor" value={specs.processor} />
        {jsonRows(specs.build)}
      </Group>

      <Group title="Display">
        <Row label="Display Size" value={specs.display_size ? `${specs.display_size}"` : undefined} />
        <Row label="Display Type" value={specs.display_type} />
      </Group>

      <Group title="Memory">
        <Row label="RAM" value={specs.ram_gb ? `${specs.ram_gb} GB` : undefined} />
        <Row label="Storage" value={specs.storage_gb ? `${specs.storage_gb} GB` : undefined} />
        <Row label="Memory Card" value={boolLabel(specs.memory_card)} />
      </Group>

      <Group title="Camera">
        <Row label="Has Camera" value={boolLabel(specs.has_camera)} />
        <Row label="Main Camera" value={specs.main_camera_mp ? `${specs.main_camera_mp} MP` : undefined} />
        <Row label="Video Recording" value={boolLabel(specs.video_recording)} />
      </Group>

      <Group title="Battery">
        <Row label="Battery" value={specs.battery_mah ? `${specs.battery_mah} mAh` : undefined} />
      </Group>

      <Group title="Connectivity">
        <Row label="Bluetooth" value={boolLabel(specs.bluetooth)} />
        <Row label="WiFi" value={boolLabel(specs.wifi)} />
        <Row label="Dual SIM" value={boolLabel(specs.dual_sim)} />
        <Row label="FM Radio" value={boolLabel(specs.fm_radio)} />
        {jsonRows(specs.connectivity)}
      </Group>

      <Group title="Other Features">
        <Row label="MP3 Player" value={boolLabel(specs.mp3)} />
        {jsonRows(specs.features)}
      </Group>
    </div>
  );
}