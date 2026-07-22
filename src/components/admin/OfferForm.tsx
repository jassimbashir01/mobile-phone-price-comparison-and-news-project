"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { offerSchema, type OfferFormValues } from "@/lib/validation/offer";
import { createOffer, updateOffer } from "@/lib/actions/offers";
import { SingleImageUploader } from "@/components/admin/SingleImageUploader";
import { AdminSuccessScreen } from "./AdminSuccessScreen";
import type { Offer } from "@/types/database";
import { WordCounter } from "./WordCounter";

export function OfferForm({ offer }: { offer?: Offer }) {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [image, setImage] = useState<string | null>(
    offer?.image_public_id ?? null,
  );
  const [createdOffer, setCreatedOffer] = useState<{ title: string } | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<OfferFormValues>({
    resolver: zodResolver(offerSchema),
    defaultValues: offer
      ? {
          offer_type: offer.offer_type,
          title: offer.title,
          description: offer.description ?? "",
          destination_url: offer.destination_url,
          price_pkr: offer.price_pkr ?? undefined,
          original_price_pkr: offer.original_price_pkr ?? undefined,
          shop_name: offer.shop_name ?? "",
          shop_location: offer.shop_location ?? "",
          is_active: offer.is_active,
          sort_order: offer.sort_order,
          expires_at: offer.expires_at ?? "",
        }
      : { offer_type: "affiliate", is_active: true, sort_order: 0 },
  });

  const offerType = useWatch({ control, name: "offer_type" });
  const descriptionValue = useWatch({ control, name: "description" }) ?? "";

  async function onSubmit(values: OfferFormValues) {
    setServerError("");
    try {
      if (offer) {
        await updateOffer(offer.id, values, image);
        router.push("/admin/offers");
        router.refresh();
      } else {
        const created = await createOffer(values, image);
        setCreatedOffer({ title: created.title });
      }
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Something went wrong");
    }
  }

  const inputClass = "w-full rounded-md border border-border px-3 py-2 text-sm";

  if (createdOffer) {
    return (
      <AdminSuccessScreen
        title="Offer created"
        message={`"${createdOffer.title}" has been created and is now live.`}
        primaryHref="/admin/offers"
        primaryLabel="Check Offers"
        createAnotherHref="/admin/offers/new"
        createAnotherLabel="Create Another Offer"
      />
    );
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-4">
      <div>
        <label htmlFor="offer_type" className="mb-1 block text-sm font-medium">
          Type
        </label>
        <select
          id="offer_type"
          {...register("offer_type")}
          className={inputClass}
        >
          <option value="affiliate">Affiliate Deal</option>
          <option value="local_deal">Local Shop Offer</option>
        </select>
      </div>
      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium">
          Title
        </label>
        <input id="title" {...register("title")} className={inputClass} />
        {errors.title && (
          <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>
        )}
      </div>
      <div>
        <div className="mb-1 flex items-center justify-between">
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <WordCounter text={descriptionValue} target="20–50 words" />
        </div>
        <textarea
          id="description"
          rows={3}
          {...register("description")}
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Image</label>
        <SingleImageUploader value={image} onChange={setImage} />
      </div>
      <div>
        <label
          htmlFor="destination_url"
          className="mb-1 block text-sm font-medium"
        >
          {offerType === "affiliate"
            ? "Affiliate Link"
            : "Shop Link / Contact URL"}
        </label>
        <input
          id="destination_url"
          {...register("destination_url")}
          className={inputClass}
        />
        {errors.destination_url && (
          <p className="mt-1 text-xs text-red-600">
            {errors.destination_url.message}
          </p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="price_pkr" className="mb-1 block text-sm font-medium">
            Price (PKR)
          </label>
          <input
            id="price_pkr"
            type="number"
            {...register("price_pkr")}
            className={inputClass}
          />
        </div>
        <div>
          <label
            htmlFor="original_price_pkr"
            className="mb-1 block text-sm font-medium"
          >
            Original Price (PKR, optional)
          </label>
          <input
            id="original_price_pkr"
            type="number"
            {...register("original_price_pkr")}
            className={inputClass}
          />
        </div>
      </div>
      {offerType === "local_deal" && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="shop_name"
              className="mb-1 block text-sm font-medium"
            >
              Shop Name
            </label>
            <input
              id="shop_name"
              {...register("shop_name")}
              className={inputClass}
            />
          </div>
          <div>
            <label
              htmlFor="shop_location"
              className="mb-1 block text-sm font-medium"
            >
              Location / City
            </label>
            <input
              id="shop_location"
              {...register("shop_location")}
              className={inputClass}
            />
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="sort_order"
            className="mb-1 block text-sm font-medium"
          >
            Sort Order
          </label>
          <input
            id="sort_order"
            type="number"
            {...register("sort_order")}
            className={inputClass}
          />
        </div>
        <div>
          <label
            htmlFor="expires_at"
            className="mb-1 block text-sm font-medium"
          >
            Expires (optional)
          </label>
          <input
            id="expires_at"
            type="date"
            {...register("expires_at")}
            className={inputClass}
          />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" {...register("is_active")} /> Active
      </label>
      {serverError && <p className="text-sm text-red-600">{serverError}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
      >
        {isSubmitting ? "Saving…" : offer ? "Save Changes" : "Create Offer"}
      </button>
    </form>
  );
}
