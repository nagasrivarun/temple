"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { getRecentDonors } from "@/app/actions/donations"

interface Donor {
  donor_name: string
  amount_cents: number
  message: string | null
  created_at: string
}

export function AnimatedDonors() {
  const [donors, setDonors] = useState<Donor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDonors() {
      const data = await getRecentDonors(10)
      setDonors(data)
      setLoading(false)
    }
    loadDonors()
  }, [])

  if (loading) {
    return (
      <div className="text-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {donors.map((donor, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{
            duration: 0.5,
            delay: index * 0.1,
            ease: [0.25, 0.4, 0.25, 1],
          }}
          className="bg-card p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <div className="flex items-start justify-between mb-2">
            <p className="font-semibold text-lg">{donor.donor_name}</p>
            <p className="text-primary font-bold">₹{(donor.amount_cents / 100).toFixed(0)}</p>
          </div>
          {donor.message && <p className="text-sm text-muted-foreground italic">"{donor.message}"</p>}
          <p className="text-xs text-muted-foreground mt-2">{new Date(donor.created_at).toLocaleDateString("te-IN")}</p>
        </motion.div>
      ))}
    </div>
  )
}
