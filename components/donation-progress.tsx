"use client"

import { useEffect, useState } from "react"
import { getTotalDonations } from "@/app/actions/donations"
import { motion } from "framer-motion"

export function DonationProgress() {
  const [data, setData] = useState({ total: 0, count: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  async function loadData() {
    const res = await fetch("/api/total-donations", { cache: "no-store" })
    const result = await res.json()
    setData(result)
    setLoading(false)
  }
  loadData()
}, [])


  const goal = 100000000 // ₹10,00,000 goal in paise
  const progress = Math.min((data.total / goal) * 100, 100)

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-16 bg-muted rounded" />
        <div className="h-3 bg-muted rounded-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-primary"
          >
            ₹{(data.total / 100).toLocaleString()}
          </motion.p>
          <p className="text-sm text-muted-foreground">లక్ష్యం ₹{(goal / 100).toLocaleString()} కు సేకరించబడింది</p>
        </div>
        <div className="text-right">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-2xl font-semibold"
          >
            {data.count}
          </motion.p>
          <p className="text-sm text-muted-foreground">దాతలు</p>
        </div>
      </div>

      <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
          className="h-full bg-gradient-to-r from-amber-500 to-orange-500 relative overflow-hidden"
        >
          <motion.div
            animate={{ x: ["0%", "100%"] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            style={{ width: "50%" }}
          />
        </motion.div>
      </div>

      <p className="text-sm text-center text-muted-foreground">{progress.toFixed(1)}% లక్ష్యం సాధించబడింది</p>
    </div>
  )
}
