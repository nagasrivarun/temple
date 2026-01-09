"use client"

import { useState } from "react"
import { DONATION_TIERS } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DonationCheckout } from "./donation-checkout"
import { motion } from "framer-motion"

export function DonationTiers() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null)

  const selectedTierData = DONATION_TIERS.find((t) => t.id === selectedTier)

  if (selectedTier && selectedTierData) {
    return (
      <DonationCheckout
        tierId={selectedTier}
        tierName={selectedTierData.name}
        amount={selectedTierData.priceInCents}
        onClose={() => setSelectedTier(null)}
      />
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {DONATION_TIERS.map((tier, index) => (
        <motion.div
          key={tier.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-50px" }}
          transition={{
            duration: 0.5,
            delay: index * 0.1,
            ease: [0.25, 0.4, 0.25, 1],
          }}
          whileHover={{ y: -8, transition: { duration: 0.3 } }}
        >
          <Card className="hover:border-primary transition-colors hover:shadow-xl h-full">
            <CardHeader className="text-center">
              <motion.div
                className="text-5xl mb-4"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                {tier.icon}
              </motion.div>
              <CardTitle className="text-xl">{tier.name}</CardTitle>
              <CardDescription className="text-base">{tier.description}</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-3xl font-bold text-primary">₹{(tier.priceInCents / 100).toFixed(0)}</div>
              <Button
                onClick={() => setSelectedTier(tier.id)}
                className="w-full hover:scale-105 transition-transform duration-200"
              >
                విరాళం ఇవ్వండి
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
