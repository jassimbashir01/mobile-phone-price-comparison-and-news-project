import { z } from 'zod';

// Every field is optional rich-HTML text — blank stays blank, which is
// exactly what makes the public table hide that row.
const richText = z.string().optional();

export const phoneExtendedSpecsSchema = z.object({
  build_os: richText,
  build_ui: richText,
  build_dimensions: richText,
  build_weight: richText,
  build_sim: richText,
  build_colors: richText,
  build_extra: richText,

  freq_2g: richText,
  freq_3g: richText,
  freq_4g: richText,
  freq_5g: richText,
  freq_extra: richText,

  proc_cpu: richText,
  proc_chipset: richText,
  proc_gpu: richText,
  proc_extra: richText,

  display_technology: richText,
  display_size: richText,
  display_resolution: richText,
  display_protection: richText,
  display_extra_features: richText,
  display_extra: richText,

  memory_built_in: richText,
  memory_card: richText,
  memory_extra: richText,

  camera_main: richText,
  camera_features: richText,
  camera_front: richText,
  camera_extra: richText,

  conn_wlan: richText,
  conn_bluetooth: richText,
  conn_gps: richText,
  conn_radio: richText,
  conn_usb: richText,
  conn_nfc: richText,
  conn_infrared: richText,
  conn_data: richText,
  conn_extra: richText,

  feat_sensors: richText,
  feat_audio: richText,
  feat_browser: richText,
  feat_messaging: richText,
  feat_games: richText,
  feat_torch: richText,
  feat_extra: richText,

  battery_charging: richText,
  battery_extra: richText,
});

export type PhoneExtendedSpecsFormValues = z.input<typeof phoneExtendedSpecsSchema>;

// Field metadata drives both the admin form layout and — by generating
// this list once — guarantees the form and the public table can never
// drift out of sync about which fields exist in which group/order.
export const EXTENDED_SPEC_GROUPS = [
  {
    label: 'Build',
    fields: [
      { key: 'build_os', label: 'OS' },
      { key: 'build_ui', label: 'UI' },
      { key: 'build_dimensions', label: 'Dimensions' },
      { key: 'build_weight', label: 'Weight' },
      { key: 'build_sim', label: 'SIM' },
      { key: 'build_colors', label: 'Colors' },
      { key: 'build_extra', label: 'Extra' },
    ],
  },
  {
    label: 'Frequency',
    fields: [
      { key: 'freq_2g', label: '2G Band' },
      { key: 'freq_3g', label: '3G Band' },
      { key: 'freq_4g', label: '4G Band' },
      { key: 'freq_5g', label: '5G Band' },
      { key: 'freq_extra', label: 'Extra' },
    ],
  },
  {
    label: 'Processor',
    fields: [
      { key: 'proc_cpu', label: 'CPU' },
      { key: 'proc_chipset', label: 'Chipset' },
      { key: 'proc_gpu', label: 'GPU' },
      { key: 'proc_extra', label: 'Extra' },
    ],
  },
  {
    label: 'Display',
    fields: [
      { key: 'display_technology', label: 'Technology' },
      { key: 'display_size', label: 'Size' },
      { key: 'display_resolution', label: 'Resolution' },
      { key: 'display_protection', label: 'Protection' },
      { key: 'display_extra_features', label: 'Extra Features' },
      { key: 'display_extra', label: 'Extra' },
    ],
  },
  {
    label: 'Memory',
    fields: [
      { key: 'memory_built_in', label: 'Built-in' },
      { key: 'memory_card', label: 'Card' },
      { key: 'memory_extra', label: 'Extra' },
    ],
  },
  {
    label: 'Camera',
    fields: [
      { key: 'camera_main', label: 'Main' },
      { key: 'camera_features', label: 'Features' },
      { key: 'camera_front', label: 'Front' },
      { key: 'camera_extra', label: 'Extra' },
    ],
  },
  {
    label: 'Connectivity',
    fields: [
      { key: 'conn_wlan', label: 'WLAN' },
      { key: 'conn_bluetooth', label: 'Bluetooth' },
      { key: 'conn_gps', label: 'GPS' },
      { key: 'conn_radio', label: 'Radio' },
      { key: 'conn_usb', label: 'USB' },
      { key: 'conn_nfc', label: 'NFC' },
      { key: 'conn_infrared', label: 'Infrared' },
      { key: 'conn_data', label: 'Data' },
      { key: 'conn_extra', label: 'Extra' },
    ],
  },
  {
    label: 'Features',
    fields: [
      { key: 'feat_sensors', label: 'Sensors' },
      { key: 'feat_audio', label: 'Audio' },
      { key: 'feat_browser', label: 'Browser' },
      { key: 'feat_messaging', label: 'Messaging' },
      { key: 'feat_games', label: 'Games' },
      { key: 'feat_torch', label: 'Torch' },
      { key: 'feat_extra', label: 'Extra' },
    ],
  },
  {
    label: 'Battery',
    fields: [
      { key: 'battery_charging', label: 'Charging' },
      { key: 'battery_extra', label: 'Extra' },
    ],
  },
] as const satisfies readonly { label: string; fields: readonly { key: keyof PhoneExtendedSpecsFormValues; label: string }[] }[];