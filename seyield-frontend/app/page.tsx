import { HeroSection } from "@/components/hero-section"
import { Features } from "@/components/features"
import { HowItWorks } from "@/components/how-it-works"
import { CTASection } from "@/components/cta-section"
import { Partners } from "@/components/partners"
import { BackgroundPattern } from "@/components/ui/background-pattern"

export default function Home() {
  return (
    <div className="overflow-hidden">
      <BackgroundPattern />
      <HeroSection />
      <Features />
      <HowItWorks />
      <Partners />
      <CTASection />
    </div>
  )
}
