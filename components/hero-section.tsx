"use client";

import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState } from "react";
import { DonationCheckout } from "./donation-checkout";

export function HeroSection() {
  const [showDonateModal, setShowDonateModal] = useState(false);

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const titleY = useTransform(scrollY, [0, 600], [0, -25]);
  const subtitleY = useTransform(scrollY, [0, 600], [0, -20]);

  return (
    <>
      <section className="relative h-[70vh] md:h-[75vh] flex items-center justify-center overflow-hidden pt-36 md:pt-40">
        {/* BACKGROUND */}
        <motion.div
          style={{ y }}
          className="absolute inset-0 z-0 pointer-events-none"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.06),transparent_70%)]" />
        </motion.div>

        {/* CONTENT */}
        <motion.div
          style={{ opacity }}
          className="relative z-20 text-center px-6 max-w-4xl mx-auto"
        >
          {/* IMAGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="mx-auto mb-6 w-[180px] sm:w-[220px] md:w-[260px]"
          >
            <img
              src="/temple-hero.png"
              className="
                w-full h-auto
                rounded-xl
                shadow-2xl
                [mask-image:radial-gradient(circle,rgba(0,0,0,1)_55%,rgba(0,0,0,0)_100%)]
                [-webkit-mask-image:radial-gradient(circle,rgba(0,0,0,1)_55%,rgba(0,0,0,0)_100%)]
              "
            />
          </motion.div>

          {/* TITLE */}
          <motion.h1
            style={{ y: titleY }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl md:text-6xl font-extrabold tracking-wide mb-4 text-amber-100 leading-[1.25] pt-2"
          >
            తాట్‌పల్లిహనుమాన్ మందిరం
          </motion.h1>

          {/* SUBTITLE */}
          <motion.p
            style={{ y: subtitleY }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-lg md:text-2xl font-medium leading-[1.6] text-amber-200 mt-2"
          >
            తరతరాలకు ఆధ్యాత్మిక కేంద్రంగా నిలిచే పవిత్ర ఆలయ నిర్మాణంలో భాగస్వాములు అవ్వండి
          </motion.p>

          {/* BUTTON */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mt-8"
          >
            <Button
              size="lg"
              onClick={() => setShowDonateModal(true)}
              className="text-lg px-8 py-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-2xl transition-all duration-300 hover:scale-105"
            >
              విరాళం ఇవ్వండి
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {showDonateModal && (
        <DonationCheckout onClose={() => setShowDonateModal(false)} />
      )}
    </>
  );
}
