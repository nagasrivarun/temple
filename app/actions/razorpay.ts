"use server"

import { razorpay, verifyRazorpaySignature } from "@/lib/razorpay"
import { DONATION_TIERS } from "@/lib/products"
import { createAdminClient } from "@/lib/supabase/admin"

export async function createDonationOrder(
  donationTierId: string,
  donorInfo: {
    name: string
    email: string
    phone?: string
    message?: string
    isAnonymous: boolean
  },
) {
  const tier = DONATION_TIERS.find((t) => t.id === donationTierId)
  if (!tier) {
    throw new Error(`Donation tier with id "${donationTierId}" not found`)
  }

  const supabase = createAdminClient()

  const { data: donation, error: dbError } = await supabase
    .from("donations")
    .insert({
      donor_name: donorInfo.name,
      donor_email: donorInfo.email,
      donor_phone: donorInfo.phone || null,
      message: donorInfo.message || null,
      amount_cents: tier.priceInCents,
      is_anonymous: donorInfo.isAnonymous,
      payment_status: "pending",
    })
    .select()
    .single()

  if (dbError || !donation) {
    console.error("[v0] Database error:", dbError)
    throw new Error("Failed to create donation record")
  }

  const order = await razorpay.orders.create({
    amount: tier.priceInCents, // amount in paise (₹1 = 100 paise)
    currency: "INR",
    receipt: `donation_${donation.id}`,
    notes: {
      donation_id: donation.id,
      donor_name: donorInfo.name,
      donor_email: donorInfo.email,
    },
  })

  await supabase.from("donations").update({ razorpay_order_id: order.id }).eq("id", donation.id)

  return {
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    donationId: donation.id,
  }
}

export async function createCustomDonationOrder(
  amountInCents: number,
  donorInfo: {
    name: string
    email: string
    phone?: string
    message?: string
    isAnonymous: boolean
  },
) {
  if (amountInCents < 10000) {
    throw new Error("Minimum donation amount is ₹100")
  }

  const supabase = createAdminClient()

  const { data: donation, error: dbError } = await supabase
    .from("donations")
    .insert({
      donor_name: donorInfo.name,
      donor_email: donorInfo.email,
      donor_phone: donorInfo.phone || null,
      message: donorInfo.message || null,
      amount_cents: amountInCents,
      is_anonymous: donorInfo.isAnonymous,
      payment_status: "pending",
    })
    .select()
    .single()

  if (dbError || !donation) {
    console.error("[v0] Database error:", dbError)
    throw new Error("Failed to create donation record")
  }

  const order = await razorpay.orders.create({
    amount: amountInCents,
    currency: "INR",
    receipt: `custom_donation_${donation.id}`,
    notes: {
      donation_id: donation.id,
      donor_name: donorInfo.name,
      donor_email: donorInfo.email,
      is_custom_amount: "true",
    },
  })

  await supabase.from("donations").update({ razorpay_order_id: order.id }).eq("id", donation.id)

  return {
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    donationId: donation.id,
  }
}

export async function verifyAndCompleteDonation(orderId: string, paymentId: string, signature: string) {
  const isValid = verifyRazorpaySignature(orderId, paymentId, signature)

  if (!isValid) {
    throw new Error("Invalid payment signature")
  }

  const payment = await razorpay.payments.fetch(paymentId)

  if (payment.status !== "captured") {
    throw new Error("Payment not captured")
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("donations")
    .update({
      payment_status: "completed",
      razorpay_payment_id: paymentId,
    })
    .eq("razorpay_order_id", orderId)
    .select()
    .single()

  if (error) {
    console.error("[v0] Failed to update donation:", error)
    throw new Error("Failed to update donation status")
  }

  return { success: true, donation: data }
}
