"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  contactSchema,
  type ContactFormValues,
} from "@/lib/validation/contact";
import { submitContactForm } from "@/lib/actions/contact";
import { WordCounter } from "@/components/admin/WordCounter";

const inputClass =
  "w-full rounded-lg border border-border px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { inquiry_type: "general" },
  });

  const messageValue = useWatch({ control, name: "message" }) ?? "";

  async function onSubmit(values: ContactFormValues) {
    const result = await submitContactForm(values);
    if (result.success) {
      setStatus("success");
      reset();
    } else {
      setStatus("error");
      setErrorMsg(result.error);
    }
  }

  if (status === "success") {
    return (
      <p className="rounded-lg border border-primary bg-primary-light p-4 text-sm text-primary-dark">
        Thanks — your message has been sent. We&apos;ll get back to you soon.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label
          htmlFor="inquiry_type"
          className="mb-1.5 block text-sm font-medium text-ink"
        >
          What&apos;s this about?
        </label>
        <select
          id="inquiry_type"
          {...register("inquiry_type")}
          className={inputClass}
        >
          <option value="general">General Question</option>
          <option value="feedback">Feedback / Suggestion</option>
          <option value="price_correction">Report a Price Correction</option>
          <option value="partnership">Partnership Inquiry</option>
          <option value="press">Press / Media</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <label
          htmlFor="name"
          className="mb-1.5 block text-sm font-medium text-ink"
        >
          Name
        </label>
        <input id="name" {...register("name")} className={inputClass} />
        {errors.name && (
          <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-sm font-medium text-ink"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className={inputClass}
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label
            htmlFor="message"
            className="block text-sm font-medium text-ink"
          >
            Message
          </label>
          <WordCounter text={messageValue} target="under ~300 words" />
        </div>
        <textarea
          id="message"
          rows={5}
          {...register("message")}
          className={inputClass}
        />
        {errors.message && (
          <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>
        )}
      </div>

      {status === "error" && <p className="text-sm text-red-600">{errorMsg}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
      >
        {isSubmitting ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
