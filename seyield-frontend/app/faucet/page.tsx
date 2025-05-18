import { FaucetUI } from "@/components/faucet/faucet-ui"
import { FaucetNotification } from "@/components/faucet/faucet-notification"
import { FaucetSuccessListener } from "@/components/faucet/faucet-success-listener"
import { BackgroundPattern } from "@/components/ui/background-pattern"

export default function FaucetPage() {
  return (
    <div className="relative">
      <BackgroundPattern variant="faucet" />
      <FaucetNotification />
      <FaucetSuccessListener />
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-2 text-center">Testnet Faucet</h1>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          Get test tokens to try out the SEYIELD platform on SEI Testnet
        </p>
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <FaucetUI />
          </div>
        </div>
      </div>
    </div>
  )
}
