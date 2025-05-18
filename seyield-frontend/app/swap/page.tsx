import { SwapForm } from "@/components/swap/swap-form"
import { SwapInfo } from "@/components/swap/swap-info"
import { SwapTour } from "@/components/tour/swap-tour"
import { BackgroundPattern } from "@/components/ui/background-pattern"

export default function SwapPage() {
  return (
    <div className="relative">
      <BackgroundPattern variant="swap" />
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-2 text-center">Convert Assets</h1>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          Convert between your deposit and rewards to manage your funds
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <SwapInfo />
          <SwapForm />
        </div>
      </div>
      <SwapTour />
    </div>
  )
}
