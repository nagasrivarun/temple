import Razorpay from "razorpay"
import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(req: Request) {
   console.log("SERVER KEY_ID:", process.env.RAZORPAY_KEY_ID)
   console.log("PUBLIC KEY_ID:", process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID)
  try {
    const { amount, donorInfo, isCustomAmount, tierId } = await req.json()

    // Validate minimum amount
    // Validate amount (must be greater than 0)
if (!amount || amount <= 0) {
  return NextResponse.json(
    { error: "Donation amount must be greater than ₹0" },
    { status: 400 }
  )
}


    const supabase = createAdminClient()

    // Create donation record in database
    const { data: donation, error: dbError } = await supabase
      .from("donations")
      .insert({
        donor_name: donorInfo.name,
        donor_email: donorInfo.email,
        donor_phone: donorInfo.phone || null,
        message: donorInfo.message || null,
        amount_cents: amount * 100, // convert to paise
        is_anonymous: donorInfo.isAnonymous,
        payment_status: "pending",
      })
      .select()
      .single()

    if (dbError || !donation) {
      console.error("Database error:", dbError)
      return NextResponse.json({ error: "Failed to create donation record" }, { status: 500 })
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount * 100, // amount in paise (₹1 = 100 paise)
      currency: "INR",
      receipt: `don_${donation.id.slice(0, 8)}`,
      notes: {
        donation_id: donation.id,
        donor_name: donorInfo.name,
        donor_email: donorInfo.email,
      },
    })

    // Update donation with Razorpay order ID
    await supabase.from("donations").update({ razorpay_order_id: order.id }).eq("id", donation.id)

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      donationId: donation.id,
    })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
