"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BackgroundPattern } from "@/components/ui/background-pattern"
import { useToast } from "@/components/ui/use-toast"
import { useAccount } from "wagmi"
import { formatUnits } from "viem"
import {
  Store,
  ShoppingBag,
  DollarSign,
  Users,
  BarChart3,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Info as InfoIcon
} from "lucide-react"
import { MerchantOrderList } from "@/components/merchant/merchant-order-list"
import { MerchantStats } from "@/components/merchant/merchant-stats"
import { MerchantProductList } from "@/components/merchant/merchant-product-list"
import { useMerchantDashboard } from "@/hooks/useMerchantDashboard"

// Mock merchant data
const mockMerchant = {
  name: "Tech Gadgets Store",
  address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  balance: 1245.75,
  totalSales: 45,
  totalRevenue: 2890.50,
  pendingPayouts: 345.25,
  products: [
    {
      id: 101,
      name: "Wireless Earbuds",
      price: 79.99,
      category: "electronics",
      status: "active",
      sales: 12
    },
    {
      id: 102,
      name: "Smart Watch",
      price: 149.99,
      category: "electronics",
      status: "active",
      sales: 8
    },
    {
      id: 103,
      name: "Portable Charger",
      price: 29.99,
      category: "accessories",
      status: "active",
      sales: 25
    }
  ],
  orders: [
    {
      id: "order_123456",
      customer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      product: "Wireless Earbuds",
      amount: 79.99,
      date: "2023-06-15T10:30:00Z",
      status: "completed"
    },
    {
      id: "order_123457",
      customer: "0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b",
      product: "Smart Watch",
      amount: 149.99,
      date: "2023-06-14T14:45:00Z",
      status: "completed"
    },
    {
      id: "order_123458",
      customer: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      product: "Portable Charger",
      amount: 29.99,
      date: "2023-06-13T09:15:00Z",
      status: "processing"
    },
    {
      id: "order_123459",
      customer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      product: "Smart Watch",
      amount: 149.99,
      date: "2023-06-12T11:00:00Z",
      status: "completed"
    },
    {
      id: "order_123460",
      customer: "0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b",
      product: "Portable Charger",
      amount: 29.99,
      date: "2023-06-11T16:30:00Z",
      status: "completed"
    }
  ]
}

export default function MerchantDashboardPage() {
  const { isConnected } = useAccount()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [merchantName, setMerchantName] = useState("")
  const [merchantDescription, setMerchantDescription] = useState("")

  // Use our merchant dashboard hook
  const {
    isLoading,
    isMerchant,
    merchantInfo,
    merchantItems,
    merchantOrders,
    handleRegisterMerchant,
    handleUpdateMerchant,
    handleListItem,
    handleUpdateItem
  } = useMerchantDashboard()

  const handleWithdraw = () => {
    if (!withdrawAmount || Number(withdrawAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to withdraw.",
        variant: "destructive"
      })
      return
    }

    if (Number(withdrawAmount) > mockMerchant.balance) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough balance to withdraw this amount.",
        variant: "destructive"
      })
      return
    }

    toast({
      title: "Withdrawal initiated",
      description: `Your withdrawal of ${withdrawAmount} USDC has been initiated and will be processed shortly.`,
    })

    setWithdrawAmount("")
  }

  const handleAddProduct = () => {
    toast({
      title: "Coming soon",
      description: "The ability to add new products will be available soon.",
    })
  }

  // Set initial form values when merchant info is loaded
  useEffect(() => {
    if (merchantInfo) {
      setMerchantName(merchantInfo.name)
      setMerchantDescription(merchantInfo.description)
    }
  }, [merchantInfo])

  // Handle merchant registration
  const handleRegister = () => {
    if (!merchantName) {
      toast({
        title: "Name required",
        description: "Please enter a name for your merchant account.",
        variant: "destructive"
      })
      return
    }

    handleRegisterMerchant(merchantName, merchantDescription)
  }

  // Handle merchant update
  const handleUpdate = () => {
    if (!merchantName) {
      toast({
        title: "Name required",
        description: "Please enter a name for your merchant account.",
        variant: "destructive"
      })
      return
    }

    handleUpdateMerchant(merchantName, merchantDescription)
  }

  if (!isConnected) {
    return (
      <div className="relative">
        <BackgroundPattern variant="merchant" />
        <div className="container mx-auto py-12 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Merchant Dashboard</h1>
          <p className="text-muted-foreground mb-6">
            Connect your wallet to access your merchant dashboard.
          </p>
          <Button className="bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700">
            Connect Wallet
          </Button>
        </div>
      </div>
    )
  }

  // Show registration form if not a merchant
  if (isConnected && !isMerchant && !isLoading) {
    return (
      <div className="relative">
        <BackgroundPattern variant="merchant" />
        <div className="container mx-auto py-12 px-4">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5 text-primary" />
                  Become a Merchant
                </CardTitle>
                <CardDescription>
                  Register as a merchant to sell products on the SEYIELD marketplace
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="merchantName">Merchant Name</Label>
                  <Input
                    id="merchantName"
                    placeholder="Your store name"
                    value={merchantName}
                    onChange={(e) => setMerchantName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="merchantDescription">Description</Label>
                  <Input
                    id="merchantDescription"
                    placeholder="Describe your store"
                    value={merchantDescription}
                    onChange={(e) => setMerchantDescription(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full gap-2 bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700"
                  onClick={handleRegister}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    <>
                      <Store className="h-4 w-4" />
                      Register as Merchant
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="relative">
        <BackgroundPattern variant="merchant" />
        <div className="container mx-auto py-12 px-4 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <h1 className="text-2xl font-bold mb-4">Loading Merchant Dashboard</h1>
          <p className="text-muted-foreground">
            Please wait while we load your merchant information...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <BackgroundPattern variant="merchant" />
      <div className="container mx-auto py-12 px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <Store className="h-8 w-8 text-primary" />
              Merchant Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your store, products, and orders
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <DollarSign className="h-4 w-4" />
              Withdraw Funds
            </Button>
            <Button className="gap-2 bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700">
              <Package className="h-4 w-4" />
              Add Product
            </Button>
          </div>
        </div>

        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="dashboard" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Products</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Orders</span>
            </TabsTrigger>
            <TabsTrigger value="payouts" className="gap-2">
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Payouts</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <MerchantStats
              merchant={mockMerchant}
              merchantInfo={merchantInfo}
              merchantOrders={merchantOrders}
              merchantItems={merchantItems}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                    Recent Orders
                  </CardTitle>
                  <CardDescription>
                    Your most recent customer orders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MerchantOrderList orders={merchantOrders?.length > 0 ? merchantOrders.slice(0, 3) : mockMerchant.orders.slice(0, 3)} />
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => setActiveTab("orders")}>
                    View All Orders
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    Top Products
                  </CardTitle>
                  <CardDescription>
                    Your best-selling products
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MerchantProductList products={merchantItems?.length > 0 ? merchantItems : mockMerchant.products} />
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => setActiveTab("products")}>
                    Manage Products
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Your Products
                </CardTitle>
                <CardDescription>
                  Manage your product listings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Button className="gap-2" onClick={handleAddProduct}>
                    <Package className="h-4 w-4" />
                    Add New Product
                  </Button>
                </div>
                <MerchantProductList products={merchantItems?.length > 0 ? merchantItems : mockMerchant.products} showActions />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                  Order History
                </CardTitle>
                <CardDescription>
                  View and manage your customer orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MerchantOrderList orders={merchantOrders?.length > 0 ? merchantOrders : mockMerchant.orders} showActions />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payouts" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Available Balance</CardTitle>
                  <CardDescription>
                    Funds available for withdrawal
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {merchantInfo ?
                      Number(formatUnits(BigInt(merchantInfo.pendingPayment || 0), 6)).toFixed(2) :
                      mockMerchant.balance.toFixed(2)} USDC
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pending Payouts</CardTitle>
                  <CardDescription>
                    Legacy funds being processed by SEYIELD
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {merchantInfo ?
                      Number(formatUnits(BigInt(merchantInfo.pendingPayment || 0), 6)).toFixed(2) :
                      mockMerchant.pendingPayouts.toFixed(2)} USDC
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    <InfoIcon className="h-3 w-3 inline mr-1" />
                    SEYIELD platform now pays merchants automatically when users make purchases. This shows only legacy pending payments.
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Total Revenue</CardTitle>
                  <CardDescription>
                    Lifetime earnings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {merchantInfo ?
                      Number(formatUnits(BigInt(merchantInfo.totalSales || 0), 6)).toFixed(2) :
                      mockMerchant.totalRevenue.toFixed(2)} USDC
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Withdraw Funds</CardTitle>
                <CardDescription>
                  Withdraw your available balance to your wallet
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="withdrawAmount">Amount (USDC)</Label>
                    <div className="flex gap-2">
                      <Input
                        id="withdrawAmount"
                        type="number"
                        placeholder="0.00"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                      />
                      <Button
                        variant="outline"
                        onClick={() => setWithdrawAmount(mockMerchant.balance.toString())}
                      >
                        Max
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Withdrawal Amount:</span>
                      <span>{withdrawAmount || "0.00"} USDC</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Network Fee:</span>
                      <span>0.00 USDC</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium pt-2 border-t">
                      <span>You will receive:</span>
                      <span>{withdrawAmount ? Number(withdrawAmount).toFixed(2) : "0.00"} USDC</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full gap-2 bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700"
                  onClick={handleWithdraw}
                  disabled={!withdrawAmount || Number(withdrawAmount) <= 0 || Number(withdrawAmount) > mockMerchant.balance}
                >
                  <DollarSign className="h-4 w-4" />
                  Withdraw Funds
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
