"use client";

import { CldImage as CldImageDefault, CldImageProps } from 'next-cloudinary';

export default function CloudinaryImage(props: CldImageProps) {
  return <CldImageDefault {...props} />;
}
