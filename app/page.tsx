"use client"

import { AnimatedSection } from "@/components/animated-section"
import { StickyHeader } from "@/components/sticky-header"
import { HeroSection } from "@/components/hero-section"
import { StorySection } from "@/components/story-section"
import { AnimatedDonors } from "@/components/animated-donors"
import { DonationInsights } from "@/components/donation-insights"
import { TopDonors } from "@/components/top-donors"
import { DonationTiers } from "@/components/donation-tiers"

export default function Page() {
  return (
    <div className="min-h-screen pt-14 overflow-x-hidden">
      <StickyHeader />

      <HeroSection />

      <StorySection
        title="తాట్‌పల్లిహనుమాన్ మందిరం నిర్మాణం"
        description={[
          "తాట్‌పల్లిగ్రామంలో తాట్‌పల్లిహనుమాన్ మందిరం నిర్మాణం ఒక పవిత్ర ఆరంభం.",
          "ఈ ఆలయం భక్తులకు శాంతి మరియు ఆధ్యాత్మిక బలాన్ని అందించే స్థలంగా నిలవనుంది.",
          "మీ విరాళం ద్వారా ఈ పవిత్ర కార్యంలో భాగస్వాములై, ఆలయ నిర్మాణానికి మీ సహకారాన్ని అందించగలరు.",
        ]}
        imageSrc="/images/whatsapp-20image-202026-01-06-20at-2010.jpeg"
        imageAlt="తాట్‌పల్లిహనుమాన్ మందిరం"
        imagePosition="right"
      />

      <StorySection
        title="గ్రామ ప్రజల విశ్వాసం"
        description={[
          "తాట్‌పల్లిహనుమాన్ మందిరం గ్రామ ప్రజల విశ్వాసానికి ప్రతీకగా నిలవబోతోంది.",
          "ప్రతి ఇటుకలో భక్తి మరియు నమ్మకం నింపబడుతుంది.",
          "ఈ ఆలయ నిర్మాణానికి మీ ఆర్థిక సహాయం ఎంతో అవసరం.",
          "మీ విరాళం ఈ ధర్మ కార్యానికి బలంగా నిలుస్తుంది.",
        ]}
        imageSrc="/images/a.jpeg"
        imageAlt="ఆలయ నిర్మాణం"
        imagePosition="left"
      />

      <StorySection
        title="భవిష్యత్ తరాలకు వారసత్వం"
        description={[
          "ఈ తాట్‌పల్లిహనుమాన్ మందిరం భవిష్యత్ తరాలకు మన సంప్రదాయాలు మరియు భక్తిని అందించే కేంద్రంగా మారనుంది.",
          "తాట్‌పల్లిగ్రామంలో నిర్మాణం జరుగుతున్న ఈ ఆలయానికి మీ సహకారం అత్యంత విలువైనది.",
          "చిన్న విరాళమైనా ఈ పవిత్ర కార్యానికి తోడ్పడుతుంది.",
        ]}
        imageSrc="/images/b.jpeg"
        imageAlt="ఆలయ పునర్నిర్మాణం"
        imagePosition="right"
      />

      <DonationInsights />

      <section className="py-20 px-6 bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <h2 className="text-4xl font-bold text-center mb-4">అత్యధిక విరాళాలు అందించిన వారు</h2>
            <p className="text-center text-muted-foreground mb-12">మా ఆలయ నిర్మాణానికి అత్యధిక సహకారం అందించిన గౌరవనీయులు</p>
          </AnimatedSection>
          <TopDonors />
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-center mb-12">ఇటీవల విరాళం అందించిన వారు</h2>
          </AnimatedSection>
          <AnimatedDonors />
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <h2 className="text-4xl font-bold text-center mb-4">విరాళం ఇవ్వండి</h2>
            <p className="text-center text-muted-foreground mb-12 text-pretty">
              తాట్‌పల్లిహనుమాన్ మందిరం నిర్మాణానికి మీ విరాళం అందించి, ఈ పవిత్ర కార్యంలో భాగస్వాములు అవ్వండి
            </p>
          </AnimatedSection>
          <DonationTiers />
        </div>
      </section>

      <AnimatedSection direction="up">
        <footer className="py-12 px-6 border-t">
          <div className="max-w-6xl mx-auto text-center space-y-4">
            <p className="text-lg font-semibold">తాట్‌పల్లిహనుమాన్ మందిరం నిర్మాణ నిధి</p>
            <p className="text-sm text-muted-foreground">తాట్‌పల్లిగ్రామం, భారతదేశం</p>
            <p className="text-xs text-muted-foreground">© 2025 తాట్‌పల్లిహనుమాన్ మందిరం. అన్ని హక్కులు రిజర్వ్.</p>
          </div>
        </footer>
      </AnimatedSection>
    </div>
  )
}
