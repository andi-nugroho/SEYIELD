import { StepByStep } from "@/components/how-it-works/step-by-step"
import { FAQ } from "@/components/how-it-works/faq"
import { BackgroundPattern } from "@/components/ui/background-pattern"
import { InteractiveDemo } from "@/components/how-it-works/interactive-demo"
import { TokenomicsSection } from "@/components/how-it-works/tokenomics-section"

export default function HowItWorksPage() {
  return (
    <div className="relative">
      <BackgroundPattern variant="how-it-works" />
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-2 text-center">How Seyro Works</h1>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Learn how you can buy now and never pay with the power of DeFi rewards
        </p>
        <InteractiveDemo />
        <StepByStep />
        <TokenomicsSection />
        <FAQ />
      </div>
    </div>
  )
}
