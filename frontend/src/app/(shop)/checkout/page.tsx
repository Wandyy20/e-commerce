'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import api from '@/lib/api'

type Address = {
  id: number
  label: string
  recipient_name: string
  phone: string
  street: string
  city: string
  province: string
  postal_code: string
  is_default: boolean
}

type CartItem = {
  id: number
  quantity: number
  product_variant: {
    price: number
    size: string
    color: string
    product: { name: string }
  }
}

type Cart = {
  cart_items: CartItem[]
}

export default function CheckoutPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [cart, setCart] = useState<Cart | null>(null)
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [placing, setPlacing] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const loadData = async() => {
      try {
        const [addressRes, cartRes] = await Promise.all([
          api.get('/addresses'),
          api.get('/cart')
        ])
        setAddresses(addressRes.data)
        setCart(cartRes.data)

        const defaultAddr = addressRes.data.find((a: Address) => a.is_default)
        if(defaultAddr) setSelectedAddress(defaultAddr.id)

      } catch(err) {
        if(axios.isAxiosError(err) && err.response?.status === 401) {
          setIsRedirecting(true)
          router.push('/login')
        }
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [router])

  const handlePlaceOrder = async() => {
    if(!selectedAddress) {
      alert("Please select an address")
      return
    }
    try {
      setPlacing(true)
      const res = await api.post('/orders/checkout', {
        address_id: selectedAddress
      })
    
      window.location.href = res.data.payment_url
    } catch(err) {
      if(axios.isAxiosError(err)) {
        alert(err.response?.data?.message || 'Checkout failed')
      }
    } finally {
      setPlacing(false)
    }
  }

  const total = cart?.cart_items.reduce((sum, item) => {
    return sum + (Number(item.product_variant.price) * item.quantity)
  }, 0) || 0

  if(loading || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-2 gap-12">

        <div>
          <h2 className="font-semibold text-lg mb-4">Shipping Address</h2>

          {addresses.length === 0 ? (
            <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
              <p className="text-gray-500 text-sm mb-3">No address yet</p>
              <button
                onClick={() => router.push('/profile/address')}
                className="text-sm underline hover:text-gray-500"
              >
                + Add Address
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  onClick={() => setSelectedAddress(address.id)}
                  className={`border rounded-lg p-4 cursor-pointer transition ${
                    selectedAddress === address.id
                      ? 'border-black bg-gray-50'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold">{address.label}</p>
                        {address.is_default && (
                          <span className="text-xs bg-black text-white px-2 py-0.5">Default</span>
                        )}
                      </div>
                      <p className="text-sm font-medium">{address.recipient_name}</p>
                      <p className="text-sm text-gray-500">{address.phone}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {address.street}, {address.city}, {address.province} {address.postal_code}
                      </p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 shrink-0 mt-1 ${
                      selectedAddress === address.id
                        ? 'border-black bg-black'
                        : 'border-gray-300'
                    }`} />
                  </div>
                </div>
              ))}

              <button
                onClick={() => router.push('/profile/address')}
                className="text-sm underline hover:text-gray-500 text-left mt-1"
              >
                + Add New Address
              </button>
            </div>
          )}
        </div>

        <div>
          <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
          <div className="border border-gray-200 rounded-lg p-6">

            <div className="flex flex-col gap-3 mb-4">
              {cart?.cart_items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <div>
                    <p className="font-medium">{item.product_variant.product.name}</p>
                    <p className="text-gray-500 text-xs">
                      {item.product_variant.size} · {item.product_variant.color} · Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium shrink-0 ml-4">
                    Rp{(Number(item.product_variant.price) * item.quantity).toLocaleString('id-ID')}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 flex justify-between font-bold">
              <span>Total</span>
              <span>Rp{total.toLocaleString('id-ID')}</span>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={placing || !selectedAddress}
              className={`w-full py-3 text-sm tracking-widest uppercase font-medium transition mt-6 ${
                placing || !selectedAddress
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              {placing ? 'Processing...' : 'Place Order'}
            </button>

          </div>
        </div>

      </div>
    </div>
  )
}