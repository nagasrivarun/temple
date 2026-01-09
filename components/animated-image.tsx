"use client"

import { motion } from "framer-motion"

interface AnimatedImageProps {
  src: string
  alt: string
  delay?: number
  className?: string
}

export function AnimatedImage({ src, alt, delay = 0, className = "" }: AnimatedImageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.1 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: false, margin: "-100px" }}
      transition={{
        duration: 1.2,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      className={className}
    >
      <img src={src || "/placeholder.svg"} alt={alt} className="w-full h-auto" />
    </motion.div>
  )
}
