import { DepositForm } from "@/components/deposit/deposit-form"
import { DepositInfo } from "@/components/deposit/deposit-info"
import { DepositTour } from "@/components/tour/deposit-tour"
import { BackgroundPattern } from "@/components/ui/background-pattern"
import { WalletBalanceDisplay } from "@/components/wallet/balance-display"
import { PSYLDBalanceDisplay } from "@/components/deposit/psyld-balance-display"

export default function DepositPage() {
  return (
    <div className="relative">
      <BackgroundPattern variant="deposit" />
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-2 text-center">Deposit Assets</h1>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          Start earning rewards that you can use for shopping without spending your original deposit
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <WalletBalanceDisplay />
            <PSYLDBalanceDisplay />
            <DepositInfo />
          </div>
          <DepositForm />
        </div>
      </div>
      <DepositTour />
    </div>
  )
}
