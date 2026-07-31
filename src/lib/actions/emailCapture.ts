"use server";

import {
  emailCaptureSchema,
  type EmailCaptureValues,
} from "@/lib/validation/emailCapture";
import { createAdminClient } from "@/lib/supabase/admin";
import { isRateLimited } from "@/lib/rateLimit";

export async function subscribeEmail(
  values: EmailCaptureValues,
): Promise<{ success: true } | { success: false; error: string }> {
  const parsed = emailCaptureSchema.safeParse(values);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  if (isRateLimited(`subscribe:${parsed.data.email}`, 3)) {
    return {
      success: false,
      error: "Too many attempts. Please try again later.",
    };
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("email_subscribers")
    .insert({ email: parsed.data.email, source: parsed.data.source });

  if (error) {
    if (error.code === "23505") {
      // Unique constraint — already subscribed. Treat as success, not an
      // error, so a repeat visitor doesn't see a confusing failure message.
      return { success: true };
    }
    return { success: false, error: "Something went wrong. Please try again." };
  }

  return { success: true };
}
