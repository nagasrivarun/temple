"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { X, IndianRupee } from "lucide-react"
import { DONATION_TIERS } from "@/lib/products"

declare global {
  interface Window {
    Razorpay: any
  }
}

interface DonationCheckoutProps {
  tierId?: string
  tierName?: string
  amount?: number
  onClose: () => void
}

export function DonationCheckout({ tierId, tierName, amount, onClose }: DonationCheckoutProps) {
  const [step, setStep] = useState<"tier-selection" | "form" | "success">(tierId ? "form" : "tier-selection")
  const [selectedTierId, setSelectedTierId] = useState<string | undefined>(tierId)
  const [customAmount, setCustomAmount] = useState<string>("")
  const [isCustomAmount, setIsCustomAmount] = useState(false)
  const [donorInfo, setDonorInfo] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    isAnonymous: false,
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    document.body.appendChild(script)

    // Lock background scroll completely
    document.body.style.overflow = "hidden"

    return () => {
      document.body.removeChild(script)
      document.body.style.overflow = ""
    }
  }, [])

  const selectedTierData = DONATION_TIERS.find((t) => t.id === selectedTierId)

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isCustomAmount) {
      const amt = Number.parseFloat(customAmount)
      if (!amt || amt < 100) {
        alert("దయచేసి కనీసం ₹100 నమోదు చేయండి")
        return
      }
    } else if (!selectedTierId) {
      alert("దయచేసి విరాళ స్థాయిని ఎంచుకోండి")
      return
    }

    setIsLoading(true)

    try {
      const amt = isCustomAmount
        ? Number.parseFloat(customAmount)
        : (selectedTierData?.priceInCents || 0) / 100

      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amt,
          donorInfo,
          isCustomAmount,
          tierId: selectedTierId,
        }),
      })

      if (!response.ok) throw new Error("Failed to create order")

      const orderData = await response.json()

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: "తాట్‌పల్లిహనుమాన్ మందిరం",
        description: "మందిర నిర్మాణానికి విరాళం",
        prefill: {
          name: donorInfo.name,
          email: donorInfo.email,
          contact: donorInfo.phone,
        },
        theme: { color: "#d97706" },
        handler: async (response: any) => {
          try {
            const verifyResponse = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })

            if (!verifyResponse.ok) throw new Error("Verification failed")

            setStep("success")
            setIsLoading(false)
          } catch {
            alert("చెల్లింపు ధృవీకరణ విఫలమైంది.")
            setIsLoading(false)
          }
        },
        modal: {
          ondismiss: () => setIsLoading(false),
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch {
      alert("ఆర్డర్ సృష్టించడంలో విఫలమైంది. దయచేసి మళ్ళీ ప్రయత్నించండి.")
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-start justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 20, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-4xl min-h-[100dvh] flex items-start justify-center p-4"
          onClick={(e) => e.stopPropagation()}
        >
          {step === "success" ? (
            <Card className="w-full max-w-2xl shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl">ధన్యవాదాలు!</CardTitle>
                <CardDescription className="text-lg">మీ విరాళం స్వీకరించబడింది</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button onClick={onClose}>హోమ్‌కు తిరిగి వెళ్ళండి</Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="w-full shadow-2xl">
              <CardHeader className="relative">
                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-4"
                >
                  <X className="h-5 w-5" />
                </Button>
                <CardTitle className="text-2xl">
                  {step === "tier-selection" ? "మీ విరాళం ఎంచుకోండి" : "మీ విరాళాన్ని పూర్తి చేయండి"}
                </CardTitle>
              </CardHeader>

              <CardContent>
                {step === "tier-selection" ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {DONATION_TIERS.map((tier) => (
                        <Card
                          key={tier.id}
                          className="cursor-pointer hover:border-primary"
                          onClick={() => {
                            setSelectedTierId(tier.id)
                            setIsCustomAmount(false)
                            setStep("form")
                          }}
                        >
                          <CardHeader className="text-center">
                            <div className="text-4xl">{tier.icon}</div>
                            <CardTitle>{tier.name}</CardTitle>
                            <CardDescription>{tier.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="text-center font-bold">
                            ₹{tier.priceInCents / 100}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    {/* CUSTOM AMOUNT OPTION */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.3 }}
  className="mt-6"
>
  <Card
    className={`border-2 transition-all ${
      isCustomAmount
        ? "border-primary shadow-lg bg-primary/5"
        : "border-dashed hover:border-primary/60"
    }`}
  >
    <CardHeader className="text-center">
      <div className="text-4xl mb-2">
        <IndianRupee className="w-12 h-12 mx-auto text-primary" />
      </div>
      <CardTitle className="text-lg">
        మీకు ఇష్టమైన మొత్తాన్ని నమోదు చేయండి
      </CardTitle>
      <CardDescription className="text-sm">
        మీరు విరాళంగా ఇవ్వాలనుకునే మొత్తాన్ని నమోదు చేయండి (కనిష్టం ₹100)
      </CardDescription>
    </CardHeader>

    <CardContent className="space-y-4">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          ₹
        </span>
        <Input
          type="number"
          min="100"
          step="1"
          placeholder="ఉదా: 2500"
          value={customAmount}
          onChange={(e) => {
            setCustomAmount(e.target.value)
            setIsCustomAmount(true)
            setSelectedTierId(undefined)
          }}
          onFocus={() => {
            setIsCustomAmount(true)
            setSelectedTierId(undefined)
          }}
          className="pl-8 text-lg"
        />
      </div>

      <Button
        className="w-full"
        disabled={!customAmount || Number(customAmount) < 100}
        onClick={() => {
          if (Number(customAmount) >= 100) {
            setStep("form")
          } else {
            alert("దయచేసి కనీసం ₹100 నమోదు చేయండి")
          }
        }}
      >
        ఈ మొత్తంతో కొనసాగండి
      </Button>
    </CardContent>
  </Card>
</motion.div>

                  </>
                ) : (
                  <form onSubmit={handleSubmitForm} className="space-y-4">
                    <Label>పూర్తి పేరు *</Label>
                    <Input required value={donorInfo.name} onChange={(e) => setDonorInfo({ ...donorInfo, name: e.target.value })} />

                    <Label>ఇమెయిల్ *</Label>
                    <Input type="email" required value={donorInfo.email} onChange={(e) => setDonorInfo({ ...donorInfo, email: e.target.value })} />

                    <Label>ఫోన్</Label>
                    <Input value={donorInfo.phone} onChange={(e) => setDonorInfo({ ...donorInfo, phone: e.target.value })} />

                    <Label>సందేశం</Label>
                    <Textarea value={donorInfo.message} onChange={(e) => setDonorInfo({ ...donorInfo, message: e.target.value })} />

                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={donorInfo.isAnonymous}
                        onCheckedChange={(c) => setDonorInfo({ ...donorInfo, isAnonymous: !!c })}
                      />
                      <Label>నా విరాళాన్ని అనామకంగా చేయండి</Label>
                    </div>

                    <Button type="submit" disabled={isLoading} className="w-full">
                      చెల్లింపుకు కొనసాగండి
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
