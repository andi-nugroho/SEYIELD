import { WithdrawForm } from "@/components/withdraw/withdraw-form"
import { WithdrawInfo } from "@/components/withdraw/withdraw-info"
import { WithdrawTour } from "@/components/tour/withdraw-tour"
import { BackgroundPattern } from "@/components/ui/background-pattern"

export default function WithdrawPage() {
  return (
    <div className="relative">
      <BackgroundPattern variant="withdraw" />
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-2 text-center">Withdraw Assets</h1>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          Access your deposited funds or convert between your deposit and rewards
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <WithdrawInfo />
          <WithdrawForm />
        </div>
      </div>
      <WithdrawTour />
    </div>
  )
}
