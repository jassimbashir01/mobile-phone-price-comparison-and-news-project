import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary';
import { requireRole } from '@/lib/auth';
import { SITE_NAME } from '@/lib/site-config';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  try {
    await requireRole(['admin', 'editor']);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: 'File must be under 10MB' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: SITE_NAME,
          // Only shrinks images larger than 1600px on either side — smaller
          // images are untouched. This is comfortably larger than any image
          // requested by any component on the site (the largest is the
          // phone detail gallery, currently requesting well under 600px),
          // so nothing visible changes; it just caps worst-case storage and
          // bandwidth cost from an oversized original upload.
          transformation: [{ width: 1600, height: 1600, crop: 'limit' }],
        },
        (error, result) => {
          if (error) reject(error);
          else if (result) resolve(result);
          else reject(new Error('Cloudinary upload returned no result'));
        }
      )
      .end(buffer);
  });

  return NextResponse.json({ publicId: result.public_id });
}