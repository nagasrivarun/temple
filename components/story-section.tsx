"use client"

import { AnimatedSection } from "./animated-section"
import { AnimatedImage } from "./animated-image"

interface StorySectionProps {
  title: string
  description: string[]
  imageSrc: string
  imageAlt: string
  imagePosition?: "left" | "right"
}

export function StorySection({
  title,
  description,
  imageSrc,
  imageAlt,
  imagePosition = "right",
}: StorySectionProps) {
  const isImageLeft = imagePosition === "left"

  return (
    <section className="py-10 md:py-20 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div
          className={`
            grid
            grid-cols-1
            md:grid-cols-2
            gap-8
            md:gap-12
            items-center
            ${isImageLeft ? "md:grid-flow-dense" : ""}
          `}
        >
          <AnimatedSection
            direction={isImageLeft ? "right" : "left"}
            className={`space-y-4 ${isImageLeft ? "md:col-start-2" : ""}`}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-snug">
              {title}
            </h2>

            <div className="text-[1.05rem] leading-[1.55] space-y-2 text-muted-foreground">
              {description.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedImage
            src={imageSrc}
            alt={imageAlt}
            delay={0.15}
            className={`
              rounded-xl
              overflow-hidden
              shadow-xl
              ${isImageLeft ? "md:col-start-1 md:row-start-1" : ""}
            `}
          />
        </div>
      </div>
    </section>
  )
}
