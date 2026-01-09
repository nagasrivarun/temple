"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { getTopDonors } from "@/app/actions/donations"
import { Trophy, Medal, Award } from "lucide-react"

interface TopDonor {
  donor_name: string
  amount_cents: number
}

const medals = [
  {
    icon: Trophy,
    color: "text-yellow-500",
    bgGradient: "from-yellow-500/20 to-amber-500/20",
    borderColor: "border-yellow-500/50",
  },
  {
    icon: Medal,
    color: "text-gray-400",
    bgGradient: "from-gray-400/20 to-slate-400/20",
    borderColor: "border-gray-400/50",
  },
  {
    icon: Award,
    color: "text-orange-600",
    bgGradient: "from-orange-600/20 to-amber-700/20",
    borderColor: "border-orange-600/50",
  },
]

export function TopDonors() {
  const [topDonors, setTopDonors] = useState<TopDonor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadTopDonors() {
      const data = await getTopDonors(3)
      setTopDonors(data)
      setLoading(false)
    }
    loadTopDonors()
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

  if (topDonors.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>ప్రస్తుతం విరాళాలు లేవు</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {topDonors.map((donor, index) => {
        const medal = medals[index]
        const Icon = medal.icon

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{
              duration: 0.6,
              delay: index * 0.15,
              ease: [0.25, 0.4, 0.25, 1],
            }}
            whileHover={{
              y: -8,
              scale: 1.05,
              transition: { duration: 0.3 },
            }}
            className={`relative p-6 rounded-xl border-2 ${medal.borderColor} bg-gradient-to-br ${medal.bgGradient} backdrop-blur-sm shadow-lg hover:shadow-2xl transition-shadow`}
          >
            {/* Rank Badge */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: false }}
              transition={{
                duration: 0.8,
                delay: index * 0.15 + 0.3,
                ease: [0.34, 1.56, 0.64, 1],
              }}
             className="absolute top-2 right-2 w-9 h-9 md:w-12 md:h-12 bg-background rounded-full border-2 flex items-center justify-center shadow-lg z-10"

            >
              <span className="text-sm md:text-xl font-bold">#{index + 1}</span>
            </motion.div>

            <div className="text-center space-y-4">
              {/* Medal Icon */}
              <motion.div
                initial={{ scale: 0, rotate: 0 }}
                whileInView={{ scale: 1, rotate: 360 }}
                viewport={{ once: false }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.15 + 0.2,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
                whileHover={{
                  rotate: [0, -10, 10, -10, 0],
                  transition: { duration: 0.5 },
                }}
              >
                <Icon className={`w-16 h-16 mx-auto ${medal.color}`} />
              </motion.div>

              {/* Donor Name */}
              <motion.h3
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: false }}
                transition={{ delay: index * 0.15 + 0.4 }}
                className="text-xl font-bold text-balance"
              >
                {donor.donor_name}
              </motion.h3>

              {/* Amount with counting animation */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: false }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.15 + 0.5,
                }}
                className="text-3xl font-bold text-primary"
              >
                ₹{(donor.amount_cents / 100).toLocaleString("en-IN")}
              </motion.div>
            </div>

            {/* Decorative shine effect */}
            <motion.div
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6 }}
            />
          </motion.div>
        )
      })}
    </div>
  )
}
