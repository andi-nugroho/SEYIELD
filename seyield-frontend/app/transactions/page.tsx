"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BackgroundPattern } from "@/components/ui/background-pattern"
import { TransactionList } from "@/components/transactions/transaction-list"
import { Search, Filter } from "lucide-react"
import { useAccount } from "wagmi"
import { formatUnits } from "viem"

// Mock transaction data
const mockTransactions = [
  {
    id: "tx_a1b2c3d4e5",
    type: "purchase",
    title: "Coursera Subscription",
    amount: 49,
    date: "2023-06-15T10:30:00Z",
    status: "completed",
    merchant: "Coursera, Inc.",
    category: "education"
  },
  {
    id: "tx_f6g7h8i9j0",
    type: "purchase",
    title: "Amazon Gift Card",
    amount: 25,
    date: "2023-06-10T14:45:00Z",
    status: "completed",
    merchant: "Amazon",
    category: "gifts"
  },
  {
    id: "tx_k1l2m3n4o5",
    type: "purchase",
    title: "Spotify Premium",
    amount: 9.99,
    date: "2023-06-05T09:15:00Z",
    status: "completed",
    merchant: "Spotify",
    category: "entertainment"
  },
  {
    id: "tx_p6q7r8s9t0",
    type: "deposit",
    title: "USDC Deposit",
    amount: 500,
    date: "2023-06-01T11:00:00Z",
    status: "completed"
  },
  {
    id: "tx_u1v2w3x4y5",
    type: "reward",
    title: "Monthly Yield",
    amount: 35,
    date: "2023-05-31T23:59:00Z",
    status: "completed"
  },
  {
    id: "tx_z1a2b3c4d5",
    type: "purchase",
    title: "Netflix Subscription",
    amount: 15.99,
    date: "2023-05-20T16:30:00Z",
    status: "completed",
    merchant: "Netflix",
    category: "entertainment"
  },
  {
    id: "tx_e5f6g7h8i9",
    type: "purchase",
    title: "DoorDash Credit",
    amount: 20,
    date: "2023-05-15T12:45:00Z",
    status: "pending",
    merchant: "DoorDash",
    category: "food"
  }
]

export default function TransactionsPage() {
  const { address, isConnected } = useAccount()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [transactions, setTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Load real transactions from the blockchain
  useEffect(() => {
    if (!isConnected) return

    const loadTransactions = async () => {
      setIsLoading(true)
      try {
        // Fetch real purchases from the API
        const response = await fetch(`/api/marketplace/purchases?address=${address}`)

        if (!response.ok) {
          throw new Error('Failed to fetch transactions')
        }

        const purchaseData = await response.json()

        // Convert purchases to our transaction format
        const realTransactions = purchaseData.map(purchase => ({
          id: purchase.id.toString(),
          type: 'purchase',
          title: purchase.itemName,
          amount: Number.parseFloat(formatUnits(BigInt(purchase.price), 6)),
          date: new Date(purchase.timestamp * 1000).toISOString(),
          status: purchase.isPaid ? 'completed' : 'pending',
          merchant: purchase.merchantName,
          category: 'marketplace'
        }))

        // Combine with mock transactions
        setTransactions([...realTransactions, ...mockTransactions])
      } catch (error) {
        console.error('Error loading transactions:', error)
        // Fall back to mock transactions
        setTransactions(mockTransactions)
      } finally {
        setIsLoading(false)
      }
    }

    loadTransactions()
  }, [address, isConnected])

  // Filter transactions based on search query and active tab
  const filteredTransactions = transactions.filter(tx => {
    // Filter by search query
    const matchesSearch =
      tx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.merchant?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)

    // Filter by tab
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "purchases" && tx.type === "purchase") ||
      (activeTab === "deposits" && tx.type === "deposit") ||
      (activeTab === "rewards" && tx.type === "reward")

    return matchesSearch && matchesTab
  })

  return (
    <div className="relative">
      <BackgroundPattern variant="transactions" />
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-2">Transactions</h1>
        <p className="text-muted-foreground mb-8">
          View and manage your transaction history
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>
              View all your transactions, purchases, deposits, and rewards
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isConnected ? (
              <>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search transactions..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                </div>

                <Tabs defaultValue="all" onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-4 mb-6">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="purchases">Purchases</TabsTrigger>
                    <TabsTrigger value="deposits">Deposits</TabsTrigger>
                    <TabsTrigger value="rewards">Rewards</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="space-y-4">
                    <TransactionList transactions={filteredTransactions} />
                  </TabsContent>

                  <TabsContent value="purchases" className="space-y-4">
                    <TransactionList transactions={filteredTransactions} />
                  </TabsContent>

                  <TabsContent value="deposits" className="space-y-4">
                    <TransactionList transactions={filteredTransactions} />
                  </TabsContent>

                  <TabsContent value="rewards" className="space-y-4">
                    <TransactionList transactions={filteredTransactions} />
                  </TabsContent>
                </Tabs>
              </>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">Connect your wallet to view transactions</h3>
                <p className="text-muted-foreground mb-4">
                  You need to connect your wallet to view your transaction history.
                </p>
                <Button className="bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700">
                  Connect Wallet
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
