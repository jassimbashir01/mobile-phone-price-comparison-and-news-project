"use server";

import {
  advertiseInquirySchema,
  type AdvertiseInquiryValues,
} from "@/lib/validation/advertise";
import { createAdminClient } from "@/lib/supabase/admin";

const submissionLog = new Map<string, number[]>();

function isRateLimited(key: string, maxPerHour = 5): boolean {
  const now = Date.now();
  const hourAgo = now - 60 * 60 * 1000;
  const timestamps = (submissionLog.get(key) ?? []).filter((t) => t > hourAgo);
  timestamps.push(now);
  submissionLog.set(key, timestamps);
  return timestamps.length > maxPerHour;
}

export async function submitAdvertiseInquiry(
  values: AdvertiseInquiryValues,
): Promise<{ success: true } | { success: false; error: string }> {
  const parsed = advertiseInquirySchema.safeParse(values);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  if (isRateLimited(parsed.data.email)) {
    return {
      success: false,
      error: "Too many submissions. Please try again later.",
    };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("contact_messages").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    message: `[Advertising Inquiry — ${parsed.data.placement}]\nCompany: ${parsed.data.company}\n\n${parsed.data.message}`,
    inquiry_type: "advertising",
  });

  if (error) {
    return { success: false, error: "Something went wrong. Please try again." };
  }

  return { success: true };
}
