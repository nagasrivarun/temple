"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { motion, useScroll, useTransform } from "framer-motion"
import { DonationCheckout } from "./donation-checkout"

export function StickyHeader() {
  const [showDonateModal, setShowDonateModal] = useState(false)
  const [hideInsta, setHideInsta] = useState(false)

  const { scrollY } = useScroll()
  const headerBackground = useTransform(
    scrollY,
    [0, 80],
    ["rgba(20, 20, 30, 0)", "rgba(20, 20, 30, 0.9)"]
  )

  // 🔽 Hide Instagram button while scrolling down
  useEffect(() => {
    let lastY = window.scrollY

    const onScroll = () => {
      if (window.scrollY > lastY) {
        setHideInsta(true)
      } else {
        setHideInsta(false)
      }
      lastY = window.scrollY
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      {/* 🔷 STICKY HEADER */}
      <motion.header
        style={{ backgroundColor: headerBackground }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-white/10"
      >
        <div className="relative h-14 px-4 flex items-center">
          {/* LEFT : DONATE BUTTON */}
          <Button
            size="sm"
            onClick={() => {
              document.body.classList.add("donation-active")
              setShowDonateModal(true)
            }}
            onTouchStart={() => {
              document.body.classList.add("donation-active")
              setShowDonateModal(true)
            }}
            className="
              bg-gradient-to-r from-amber-500 to-orange-500
              hover:from-amber-600 hover:to-orange-600
              text-xs px-3 py-1.5 shadow-md
              active:scale-95 transition-transform duration-150
            "
          >
            విరాళం ఇవ్వండి
          </Button>
        </div>
      </motion.header>

      {/* 🟣 INSTAGRAM BUTTON (SINGLE, FIXED, MOBILE SAFE) */}
      <a
        href="https://www.instagram.com/hanumantemplethatpally?igsh=bGFtb3VvdHlhdDB2"
        target="_blank"
        rel="noopener noreferrer"
        className={`
          fixed top-[14px] right-[14px]
          z-[9999]
          bg-gradient-to-r from-pink-500 to-orange-500
          text-white text-xs font-semibold
          px-4 py-2 rounded-full
          shadow-lg
          transition-all duration-300
          ${hideInsta ? "opacity-0 pointer-events-none -translate-y-2" : "opacity-100"}
        `}
      >
        Instagram
      </a>

      {/* 💰 DONATION MODAL */}
      {showDonateModal && (
        <DonationCheckout
          onClose={() => {
            document.body.classList.remove("donation-active")
            setShowDonateModal(false)
          }}
        />
      )}
    </>
  )
}
