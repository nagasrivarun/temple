"use server"

import { stripe } from "@/lib/stripe"
import { DONATION_TIERS } from "@/lib/products"
import { createAdminClient } from "@/lib/supabase/admin"

export async function startDonationCheckout(
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

  // Create Stripe checkout session
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    redirect_on_completion: "never",
    customer_email: donorInfo.email,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: tier.name,
            description: tier.description,
          },
          unit_amount: tier.priceInCents,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    metadata: {
      donation_id: donation.id,
      donor_name: donorInfo.name,
    },
  })

  // Update donation with stripe session ID
  await supabase.from("donations").update({ stripe_session_id: session.id }).eq("id", donation.id)

  return { clientSecret: session.client_secret, donationId: donation.id }
}

export async function startCustomDonationCheckout(
  amountInCents: number,
  donorInfo: {
    name: string
    email: string
    phone?: string
    message?: string
    isAnonymous: boolean
  },
) {
  // Validate minimum amount
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

  // Create Stripe checkout session with custom amount
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    redirect_on_completion: "never",
    customer_email: donorInfo.email,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "కస్టమ్ విరాళం",
            description: "తాట్‌పల్లిహనుమాన్ మందిరం నిర్మాణానికి విరాళం",
          },
          unit_amount: amountInCents,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    metadata: {
      donation_id: donation.id,
      donor_name: donorInfo.name,
      is_custom_amount: "true",
    },
  })

  // Update donation with stripe session ID
  await supabase.from("donations").update({ stripe_session_id: session.id }).eq("id", donation.id)

  return { clientSecret: session.client_secret, donationId: donation.id }
}

export async function checkPaymentStatus(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId)

  if (session.payment_status === "paid") {
    const supabase = createAdminClient()
    await supabase
      .from("donations")
      .update({
        payment_status: "completed",
        stripe_payment_intent: session.payment_intent as string,
      })
      .eq("stripe_session_id", sessionId)

    return { status: "completed" }
  }

  return { status: session.payment_status }
}
