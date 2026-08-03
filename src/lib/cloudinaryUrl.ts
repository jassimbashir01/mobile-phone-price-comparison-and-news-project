const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

/**
 * Builds a fixed-size Cloudinary URL for a known public_id.
 *
 * Why: CldImage generates a responsive srcset from 32w up to 3840w, and
 * when its `sizes` hint isn't applied correctly the browser falls back to
 * the `src` attribute — which CldImage sets to the LARGEST variant. An
 * 85px card was downloading a 3840px image. Requesting one exact size
 * removes that failure mode entirely.
 *
 * Pass 2x the rendered CSS size for retina sharpness; c_limit never
 * upscales beyond the original.
 */
export function cloudinaryUrl(
  publicId: string,
  { width, height }: { width: number; height?: number },
): string {
  const dims = height ? `w_${width},h_${height}` : `w_${width}`;
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/c_limit,${dims},f_auto,q_auto/${publicId}`;
}
