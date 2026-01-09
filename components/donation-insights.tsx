"use client"

import { useEffect, useState } from "react"
import { motion, useInView, useMotionValue, useSpring } from "framer-motion"
import { useRef } from "react"
import { getTotalDonations } from "@/app/actions/donations"

function AnimatedNumber({ value, prefix = "" }: { value: number; prefix?: string }) {
  const ref = useRef(null)
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  })
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [displayValue, setDisplayValue] = useState(0)

 useEffect(() => {
  if (isInView) {
    motionValue.set(value)
  }
}, [motionValue, isInView, value])


  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayValue(Math.round(latest))
    })
    return () => unsubscribe()
  }, [springValue])

  const formatNumber = (num: number) => {
    return num.toLocaleString("en-IN")
  }

  return (
    <span ref={ref}>
      {prefix}
      {formatNumber(displayValue)}
    </span>
  )
}

export function DonationInsights() {
  const [stats, setStats] = useState({ total: 0, count: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      const data = await getTotalDonations()
      setStats(data)
      setLoading(false)
    }
    loadStats()
  }, [])

  const totalInRupees = Math.floor(stats.total / 100)

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">విరాళం గణాంకాలు</h2>
          <p className="text-muted-foreground">మీ సహకారంతో మేము సాధించిన పురోగతి</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Total Amount */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="relative p-8 md:p-12 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 shadow-lg overflow-hidden group"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.8 }}
            />

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-primary/10">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              <p className="text-sm font-medium text-muted-foreground mb-2">మొత్తం విరాళం</p>

              {loading ? (
                <div className="h-16 flex items-center">
                  <div className="h-8 w-48 bg-muted animate-pulse rounded" />
                </div>
              ) : (
                <motion.p
                  className="text-4xl md:text-5xl font-bold text-foreground"
                  initial={{ scale: 0.5 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: false }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                  <AnimatedNumber value={totalInRupees} prefix="₹" />
                </motion.p>
              )}
            </div>
          </motion.div>

          {/* Total Donors */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            className="relative p-8 md:p-12 rounded-2xl bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20 shadow-lg overflow-hidden group"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.8 }}
            />

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-secondary/10">
                <svg
                  className="w-8 h-8 text-secondary-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>

              <p className="text-sm font-medium text-muted-foreground mb-2">విరాళం ఇచ్చినవారు</p>

              {loading ? (
                <div className="h-16 flex items-center">
                  <div className="h-8 w-32 bg-muted animate-pulse rounded" />
                </div>
              ) : (
                <motion.p
                  className="text-4xl md:text-5xl font-bold text-foreground"
                  initial={{ scale: 0.5 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: false }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                  <AnimatedNumber value={stats.count} />
                </motion.p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm text-muted-foreground italic">ప్రతి విరాళం ఈ పవిత్ర కార్యానికి శక్తిని అందిస్తుంది</p>
        </motion.div>
      </div>
    </section>
  )
}
