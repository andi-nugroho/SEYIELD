"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { BackgroundPattern } from "@/components/ui/background-pattern"
import { useToast } from "@/components/ui/use-toast"
import {
  ArrowLeft,
  ShoppingBag,
  ArrowUpRight,
  Coins,
  Clock,
  CheckCircle,
  AlertCircle,
  Store,
  Receipt,
  ExternalLink,
  Download,
  RefreshCcw,
  Copy,
  Info as InfoIcon
} from "lucide-react"
import { useAccount } from "wagmi"
import { formatUnits } from "viem"

// Mock transaction data - in a real app, this would come from an API
const mockTransactions = [
  {
    id: "tx_a1b2c3d4e5",
    type: "purchase",
    title: "Coursera Subscription",
    amount: 49,
    date: "2023-06-15T10:30:00Z",
    status: "completed",
    merchant: "Coursera, Inc.",
    merchantAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    category: "education",
    description: "Annual subscription to Coursera with access to all courses and specializations.",
    blockchainTxHash: "0x8a7d953f45bd768b7c0e5f6f0e1a162d8b9efa8f3c5d5d5d5d5d5d5d5d5d5d5d",
    timeline: [
      { status: "created", timestamp: "2023-06-15T10:30:00Z", description: "Transaction initiated" },
      { status: "processing", timestamp: "2023-06-15T10:30:05Z", description: "Processing payment" },
      { status: "completed", timestamp: "2023-06-15T10:30:30Z", description: "Payment completed" },
      { status: "fulfilled", timestamp: "2023-06-15T10:31:00Z", description: "Order fulfilled by merchant" }
    ]
  },
  {
    id: "tx_f6g7h8i9j0",
    type: "purchase",
    title: "Amazon Gift Card",
    amount: 25,
    date: "2023-06-10T14:45:00Z",
    status: "completed",
    merchant: "Amazon",
    merchantAddress: "0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b",
    category: "gifts",
    description: "Digital gift card for Amazon with no expiration date.",
    blockchainTxHash: "0x9b8e7d6c5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7",
    timeline: [
      { status: "created", timestamp: "2023-06-10T14:45:00Z", description: "Transaction initiated" },
      { status: "processing", timestamp: "2023-06-10T14:45:10Z", description: "Processing payment" },
      { status: "completed", timestamp: "2023-06-10T14:45:45Z", description: "Payment completed" },
      { status: "fulfilled", timestamp: "2023-06-10T14:46:30Z", description: "Order fulfilled by merchant" }
    ],
    redemptionCode: "AMZN-1234-5678-9012"
  },
  {
    id: "tx_e5f6g7h8i9",
    type: "purchase",
    title: "DoorDash Credit",
    amount: 20,
    date: "2023-05-15T12:45:00Z",
    status: "pending",
    merchant: "DoorDash",
    merchantAddress: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    category: "food",
    description: "Credit for food delivery on DoorDash.",
    blockchainTxHash: "0x7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5",
    timeline: [
      { status: "created", timestamp: "2023-05-15T12:45:00Z", description: "Transaction initiated" },
      { status: "processing", timestamp: "2023-05-15T12:45:15Z", description: "Processing payment" },
      { status: "pending", timestamp: "2023-05-15T12:45:30Z", description: "Awaiting merchant confirmation" }
    ]
  }
]

export default function TransactionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { isConnected } = useAccount()
  const [transaction, setTransaction] = useState(null)

  useEffect(() => {
    if (!isConnected) return

    const fetchTransaction = async () => {
      try {
        // Check if it's a purchase transaction (starts with 'tx_')
        const transactionId = params.transactionId

        if (transactionId.startsWith('tx_')) {
          // This is a mock transaction
          const foundTransaction = mockTransactions.find(tx => tx.id === transactionId)

          if (foundTransaction) {
            setTransaction(foundTransaction)
          } else {
            throw new Error('Transaction not found')
          }
        } else {
          // This is a real blockchain transaction
          const purchaseId = Number.parseInt(transactionId, 10)

          if (Number.isNaN(purchaseId)) {
            throw new Error('Invalid transaction ID')
          }

          // Fetch the purchase details from the API
          const response = await fetch(`/api/marketplace/purchase/${purchaseId}`)

          if (!response.ok) {
            throw new Error('Failed to fetch transaction')
          }

          const purchaseData = await response.json()

          // Convert the purchase data to our transaction format
          const txData = {
            id: `${purchaseId}`,
            type: 'purchase',
            title: purchaseData.item.name,
            amount: Number.parseFloat(formatUnits(BigInt(purchaseData.price), 6)),
            date: new Date(purchaseData.timestamp * 1000).toISOString(),
            status: purchaseData.isPaid ? 'completed' : 'pending',
            merchant: purchaseData.merchantInfo.name,
            merchantAddress: purchaseData.merchant,
            category: 'marketplace',
            description: purchaseData.item.description,
            blockchainTxHash: purchaseData.blockchainTxHash || null,
            timeline: purchaseData.timeline.map(event => ({
              status: event.status,
              timestamp: new Date(event.timestamp * 1000).toISOString(),
              description: event.description
            }))
          }

          setTransaction(txData)
        }
      } catch (error) {
        console.error('Error fetching transaction:', error)
        toast({
          title: "Transaction not found",
          description: "The transaction you're looking for doesn't exist or couldn't be loaded.",
          variant: "destructive"
        })
        router.push("/transactions")
      }
    }

    fetchTransaction()
  }, [params.transactionId, toast, router, isConnected])

  const getTransactionIcon = (type) => {
    switch (type) {
      case "purchase":
        return <ShoppingBag className="h-5 w-5" />
      case "deposit":
        return <ArrowUpRight className="h-5 w-5" />
      case "reward":
        return <Coins className="h-5 w-5" />
      default:
        return <Clock className="h-5 w-5" />
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            <CheckCircle className="h-3 w-3 mr-1" /> Completed
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
            <Clock className="h-3 w-3 mr-1" /> Pending
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
            <AlertCircle className="h-3 w-3 mr-1" /> Failed
          </Badge>
        )
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        )
    }
  }

  if (!isConnected) {
    return (
      <div className="relative">
        <BackgroundPattern variant="transactions" />
        <div className="container mx-auto py-12 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Connect your wallet</h1>
          <p className="text-muted-foreground mb-6">
            You need to connect your wallet to view transaction details.
          </p>
          <Button className="bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700">
            Connect Wallet
          </Button>
        </div>
      </div>
    )
  }

  if (!transaction) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Loading transaction...</h1>
      </div>
    )
  }

  return (
    <div className="relative">
      <BackgroundPattern variant="transactions" />
      <div className="container mx-auto py-12 px-4">
        <div className="mb-6">
          <Link href="/transactions" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Transactions
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Transaction Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Transaction Details</CardTitle>
                  <CardDescription>
                    View details for transaction {transaction.id}
                  </CardDescription>
                </div>
                {getStatusBadge(transaction.status)}
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{transaction.title}</h2>
                    <p className="text-muted-foreground">{transaction.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Transaction ID</h3>
                    <p className="font-mono text-sm">{transaction.id}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Date</h3>
                    <p>{new Date(transaction.date).toLocaleString()}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Amount</h3>
                    <p className="text-lg font-semibold">{transaction.amount} USDC</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Type</h3>
                    <p className="capitalize">{transaction.type}</p>
                  </div>
                </div>

                {transaction.type === "purchase" && (
                  <>
                    <Separator />

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-3">Merchant Information</h3>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <Store className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{transaction.merchant}</p>
                          <p className="text-xs text-muted-foreground font-mono">{transaction.merchantAddress}</p>
                        </div>
                      </div>
                    </div>

                    {transaction.redemptionCode && (
                      <div className="rounded-lg border p-4">
                        <h3 className="text-sm font-medium mb-2">Redemption Information</h3>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Redemption Code:</p>
                            <p className="font-mono font-medium">{transaction.redemptionCode}</p>
                          </div>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Copy className="h-3 w-3" />
                            Copy
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                <Separator />

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Transaction Timeline</h3>
                  <div className="space-y-4">
                    {transaction.timeline.map((event, eventIndex) => (
                      <div key={`timeline-${event.status}-${eventIndex}`} className="flex gap-3">
                        <div className="relative flex flex-col items-center">
                          <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
                            eventIndex === transaction.timeline.length - 1
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}>
                            {eventIndex === 0 ? (
                              <Clock className="h-3 w-3" />
                            ) : eventIndex === transaction.timeline.length - 1 ? (
                              transaction.status === "completed" ? (
                                <CheckCircle className="h-3 w-3" />
                              ) : (
                                <Clock className="h-3 w-3" />
                              )
                            ) : (
                              <div className="h-1.5 w-1.5 rounded-full bg-current" />
                            )}
                          </div>
                          {eventIndex < transaction.timeline.length - 1 && (
                            <div className="h-full w-px bg-muted absolute top-6" />
                          )}
                        </div>
                        <div className="pb-4">
                          <p className="font-medium capitalize">{event.status}</p>
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(event.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full gap-2" variant="outline">
                  <Receipt className="h-4 w-4" />
                  View Receipt
                </Button>

                <Button className="w-full gap-2" variant="outline">
                  <Download className="h-4 w-4" />
                  Download Invoice
                </Button>

                {transaction.blockchainTxHash && (
                  <Button className="w-full gap-2" variant="outline" asChild>
                    <a
                      href={`https://sei.explorers.guru/tx/${transaction.blockchainTxHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View on Explorer
                    </a>
                  </Button>
                )}

                {transaction.status === "pending" && (
                  <Button className="w-full gap-2 bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700">
                    <RefreshCcw className="h-4 w-4" />
                    Check Status
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Transaction Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Item Price:</span>
                    <span>{transaction.amount} USDC</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">ySYLD Used:</span>
                    <span>{transaction.amount} ySYLD</span>
                  </div>
                  {transaction.type === "purchase" && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Platform Fee:</span>
                      <span>2%</span>
                    </div>
                  )}
                  <Separator className="my-2" />
                  <div className="flex justify-between font-medium">
                    <span>Merchant Payment:</span>
                    <span>{(transaction.amount * 0.98).toFixed(2)} USDC</span>
                  </div>
                </div>

                <div className="mt-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 p-3 text-xs text-blue-700 dark:text-blue-300">
                  <p className="flex items-center gap-2">
                    <InfoIcon className="h-3 w-3 flex-shrink-0" />
                    <span>SEYIELD platform automatically pays merchants directly in USDC when you make a purchase. Your ySYLD tokens were burned in this transaction.</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  If you have any questions or issues with this transaction, our support team is here to help.
                </p>
                <Button className="w-full">Contact Support</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
