"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingCart, ArrowLeft, Check, AlertCircle, Store } from "lucide-react"
import Link from "next/link"
import { BackgroundPattern } from "@/components/ui/background-pattern"
import { useToast } from "@/components/ui/use-toast"
import { useAccount } from "wagmi"
import { shopItems } from "@/data/shop-items"
import { CheckoutDialog } from "@/components/shop/checkout-dialog"

export default function ProductDetailPage() {
  const params = useParams()
  const { toast } = useToast()
  const { address, isConnected } = useAccount()
  const [product, setProduct] = useState(null)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  
  // Mock user data
  const userRewards = 100
  const userDeposit = 1000
  
  useEffect(() => {
    // Find the product by ID
    const productId = Number(params.productId)
    const foundProduct = shopItems.find(item => item.id === productId)
    
    if (foundProduct) {
      setProduct(foundProduct)
    } else {
      // Handle product not found
      toast({
        title: "Product not found",
        description: "The product you're looking for doesn't exist.",
        variant: "destructive"
      })
    }
  }, [params.productId, toast])
  
  if (!product) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Loading product...</h1>
      </div>
    )
  }
  
  return (
    <div className="relative">
      <BackgroundPattern variant="shop" />
      <div className="container mx-auto py-12 px-4">
        <div className="mb-6">
          <Link href="/shop" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shop
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Image */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden border border-pink-100 dark:border-pink-900/20">
              <CardContent className="p-0">
                <div className="aspect-square relative overflow-hidden bg-muted">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                  {product.popular && (
                    <Badge className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-violet-600">
                      Popular
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Product Details */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="outline" className="capitalize">
                  {product.category.replace("-", " ")}
                </Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Store className="h-4 w-4 mr-1" />
                  {product.merchant || "SEYIELD Marketplace"}
                </div>
              </div>
              <p className="text-lg font-bold mb-2">{product.price} USDC</p>
              <p className="text-muted-foreground">{product.description}</p>
            </div>
            
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="requirements">Requirements</TabsTrigger>
                <TabsTrigger value="merchant">Merchant</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4 pt-4">
                <p>{product.details}</p>
                {product.features && (
                  <div>
                    <h3 className="font-medium mb-2">Features:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {product.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="requirements" className="space-y-4 pt-4">
                <div className="rounded-lg border p-4 space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Minimum Deposit Required:</span>
                      <span className="font-medium">{product.depositRequired} USDC</span>
                    </div>
                    <Progress value={(userDeposit / product.depositRequired) * 100} className="h-2" />
                    <div className="flex justify-end mt-1">
                      <span className="text-sm">
                        {userDeposit >= product.depositRequired ? (
                          <span className="text-green-500 flex items-center gap-1">
                            <Check className="h-4 w-4" /> Your deposit: {userDeposit} USDC
                          </span>
                        ) : (
                          <span className="text-amber-500 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" /> Need {product.depositRequired - userDeposit} more USDC
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Rewards Required:</span>
                      <span className="font-medium">{product.price} USDC</span>
                    </div>
                    <Progress value={(userRewards / product.price) * 100} className="h-2" />
                    <div className="flex justify-end mt-1">
                      <span className="text-sm">
                        {userRewards >= product.price ? (
                          <span className="text-green-500 flex items-center gap-1">
                            <Check className="h-4 w-4" /> Your rewards: {userRewards} USDC
                          </span>
                        ) : (
                          <span className="text-amber-500 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" /> Need {product.price - userRewards} more USDC
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p>To purchase items in the SEYIELD marketplace:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>You must have sufficient rewards to cover the item price</li>
                    <li>Your deposit must meet the minimum required amount</li>
                    <li>Your deposit stays in your account and continues earning rewards</li>
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="merchant" className="space-y-4 pt-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                    <Store className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium">{product.merchant || "SEYIELD Marketplace"}</h3>
                    <p className="text-sm text-muted-foreground">Verified Merchant</p>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {product.merchantDescription || 
                   "This product is sold directly through the SEYIELD marketplace. All purchases are backed by our satisfaction guarantee."}
                </p>
              </TabsContent>
            </Tabs>
            
            <div className="pt-4">
              <Button 
                onClick={() => setIsCheckoutOpen(true)}
                disabled={!isConnected || userRewards < product.price || userDeposit < product.depositRequired}
                className="w-full gap-2 bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700"
                size="lg"
              >
                <ShoppingCart className="h-5 w-5" />
                {!isConnected 
                  ? "Connect Wallet to Purchase" 
                  : userRewards < product.price 
                    ? `Insufficient Rewards (Need ${product.price - userRewards} more)`
                    : userDeposit < product.depositRequired
                      ? `Insufficient Deposit (Need ${product.depositRequired - userDeposit} more)`
                      : `Buy with ${product.price} USDC Rewards`}
              </Button>
              
              {!isConnected && (
                <p className="text-center text-sm text-muted-foreground mt-2">
                  Connect your wallet to purchase this item
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Checkout Dialog */}
      <CheckoutDialog 
        open={isCheckoutOpen} 
        onOpenChange={setIsCheckoutOpen}
        product={product}
      />
    </div>
  )
}
