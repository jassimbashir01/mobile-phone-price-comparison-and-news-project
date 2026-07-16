export interface RangeCategory {
  slug: string;
  label: string;
  min: number | null;
  max: number | null;
}

export const PRICE_RANGES: RangeCategory[] = [
  { slug: 'below-5000',    label: 'Below Rs. 5,000',          min: null,  max: 4999 },
  { slug: '5000-10000',    label: 'Rs. 5,000 - 10,000',        min: 5000,  max: 10000 },
  { slug: '10000-15000',   label: 'Rs. 10,000 - 15,000',       min: 10001, max: 15000 },
  { slug: '15000-25000',   label: 'Rs. 15,000 - 25,000',       min: 15001, max: 25000 },
  { slug: '25000-35000',   label: 'Rs. 25,000 - 35,000',       min: 25001, max: 35000 },
  { slug: '35000-45000',   label: 'Rs. 35,000 - 45,000',       min: 35001, max: 45000 },
  { slug: 'above-45000',   label: 'Above Rs. 45,000',          min: 45001, max: null },
  { slug: 'all-mobiles',   label: 'All Mobiles',                min: null,  max: null },
];

// Separate, coarser brackets used ONLY for the homepage's editable price
// sections and their own dedicated pages — deliberately distinct from
// PRICE_RANGES above (sidebar/footer), which stays untouched.
export const HOMEPAGE_PRICE_RANGES: RangeCategory[] = [
  { slug: 'below-10k', label: 'Below Rs. 10,000',      min: null,  max: 9999 },
  { slug: '10k-20k',   label: 'Rs. 10,000 - 20,000',    min: 10000, max: 20000 },
  { slug: '20k-30k',   label: 'Rs. 20,000 - 30,000',    min: 20001, max: 30000 },
  { slug: '30k-40k',   label: 'Rs. 30,000 - 40,000',    min: 30001, max: 40000 },
  { slug: '40k-50k',   label: 'Rs. 40,000 - 50,000',    min: 40001, max: 50000 },
  { slug: 'above-50k', label: 'Above Rs. 50,000',       min: 50001, max: null },
];

export const RAM_OPTIONS: RangeCategory[] = [
  { slug: '2gb',        label: '2GB RAM',        min: 2,  max: 2 },
  { slug: '3gb',        label: '3GB RAM',        min: 3,  max: 3 },
  { slug: '4gb',        label: '4GB RAM',        min: 4,  max: 4 },
  { slug: '6gb',        label: '6GB RAM',        min: 6,  max: 6 },
  { slug: '8gb',        label: '8GB RAM',        min: 8,  max: 8 },
  { slug: '12gb-plus',  label: '12GB+ RAM',      min: 12, max: null },
];

export const SCREEN_SIZES: RangeCategory[] = [
  { slug: 'below-3-inch',    label: 'Below 3 Inch',      min: null, max: 2.99 },
  { slug: '3-4-inch',        label: '3 - 4 Inch',        min: 3,    max: 4 },
  { slug: '4-1-4-9-inch',    label: '4.1 - 4.9 Inch',    min: 4.1,  max: 4.9 },
  { slug: '5-6-9-inch',      label: '5 - 6.9 Inch',      min: 5,    max: 6.9 },
  { slug: '7-8-9-inch',      label: '7 - 8.9 Inch',      min: 7,    max: 8.9 },
];

export const CAMERA_OPTIONS: RangeCategory[] = [
  { slug: '13mp',           label: '13MP & Above',   min: 13,   max: null },
  { slug: '8mp',            label: '8MP',            min: 8,    max: 12.9 },
  { slug: '5mp',            label: '5MP',            min: 5,    max: 7.9 },
  { slug: '3mp',            label: '3MP',            min: 3,    max: 4.9 },
  { slug: '2mp',            label: '2MP',            min: 2,    max: 2.9 },
  { slug: '1mp',            label: '1MP',            min: 1,    max: 1.9 },
  { slug: 'vga-or-less',    label: 'VGA or Less',    min: 0.1,  max: 0.99 },
  { slug: 'without-camera', label: 'Without Camera', min: null, max: null },
];

export interface FeatureCategory {
  slug: string;
  label: string;
  column:
    | 'has_camera'
    | 'video_recording'
    | 'bluetooth'
    | 'dual_sim'
    | 'wifi'
    | 'mp3'
    | 'fm_radio'
    | 'memory_card';
}

export const FEATURE_TYPES: FeatureCategory[] = [
  { slug: 'camera-phones',    label: 'Camera Phones',    column: 'has_camera' },
  { slug: 'video-recording',  label: 'Video Recording',  column: 'video_recording' },
  { slug: 'bluetooth',        label: 'Bluetooth',        column: 'bluetooth' },
  { slug: 'dual-sim',         label: 'Dual Sim',         column: 'dual_sim' },
  { slug: 'wifi',             label: 'WiFi',             column: 'wifi' },
  { slug: 'mp3',              label: 'MP3',              column: 'mp3' },
  { slug: 'fm-radio',         label: 'FM Radio',         column: 'fm_radio' },
  { slug: 'memory-card',      label: 'Memory Card',      column: 'memory_card' },
];

export const OS_TYPES = [
  { slug: 'android',          label: 'Android Phones' },
  { slug: 'feature-phones',   label: 'Feature Phones' },
  { slug: 'windows',          label: 'Windows Phones' },
  { slug: 'all-smartphones',  label: 'All Smartphones' },
] as const;

export const NETWORK_TYPES = [
  { slug: '4g-phones', label: '4G Phones', value: '4G' },
  { slug: '5g-phones', label: '5G Phones', value: '5G' },
] as const;

export function findPriceRangeForPrice(price: number | null): RangeCategory | undefined {
  if (price == null) return undefined;
  return PRICE_RANGES.find(
    (r) => r.slug !== 'all-mobiles' && (r.min == null || price >= r.min) && (r.max == null || price <= r.max)
  );
}

export function homepagePriceSectionKey(range: RangeCategory): string {
  return `home_price_${range.slug.replace(/-/g, '_')}`;
}