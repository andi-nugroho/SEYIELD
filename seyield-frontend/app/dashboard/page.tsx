import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { YieldOverview } from "@/components/dashboard/yield-overview"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { AvailableShops } from "@/components/dashboard/available-shops"
import { DashboardTour } from "@/components/tour/dashboard-tour"
import { BackgroundPattern } from "@/components/ui/background-pattern"

export default function DashboardPage() {
  return (
    <div className="relative">
      <BackgroundPattern variant="dashboard" />
      <div className="container mx-auto py-8 px-4">
        <DashboardHeader />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <DashboardStats />
          <YieldOverview />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <RecentTransactions />
          <AvailableShops />
        </div>
      </div>
      <DashboardTour />
    </div>
  )
}
