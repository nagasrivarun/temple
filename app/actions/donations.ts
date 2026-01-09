"use server"

import { createClient } from "@/lib/supabase/server"

export async function getRecentDonations(limit = 10) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("donations")
    .select("donor_name, amount_cents, message, created_at")
    .eq("payment_status", "completed")
    .eq("is_anonymous", false)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching donations:", error)
    return []
  }

  return data || []
}

export async function getTotalDonations() {
  const supabase = await createClient()

  const { data, error } = await supabase.from("donations").select("amount_cents").eq("payment_status", "completed")

  if (error) {
    console.error("Error fetching total:", error)
    return { total: 0, count: 0 }
  }

  const total = data.reduce((sum, d) => sum + d.amount_cents, 0)
  return { total, count: data.length }
}

export async function getTopDonors(limit = 3) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("donations")
    .select("donor_name, amount_cents")
    .eq("payment_status", "completed")
    .eq("is_anonymous", false)
    .order("amount_cents", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching top donors:", error)
    return []
  }

  return data || []
}

export { getRecentDonations as getRecentDonors }
