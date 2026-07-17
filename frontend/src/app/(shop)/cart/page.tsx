'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import axios from 'axios'
import api from '@/lib/api'

type CartItem = {
  id: number
  quantity: number
  product_variant: {
    id: number
    size: string
    color: string
    price: number
    product: {
      name: string
      product_images: { image_url: string }[]
    }
  }
}

type Cart = {
  id: number
  cart_items: CartItem[]
}

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchCart = async() => {
    try {
      const res = await api.get('/cart')
      setCart(res.data)
    } catch(err) {
      if(axios.isAxiosError(err) && err.response?.status === 401) {
        router.push('/login')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
  const loadCart = async() => {
    try {
      const res = await api.get('/cart')
      setCart(res.data)
    } catch(err) {
      if(axios.isAxiosError(err) && err.response?.status === 401) {
        router.push('/login')
      }
    } finally {
      setLoading(false)
    }
  }
  loadCart()
}, [router])

  const updateQuantity = async(itemId: number, quantity: number) => {
    if(quantity < 1) return
    try {
      await api.put(`/cart/${itemId}`, { quantity })
      fetchCart()
    } catch(err) {
      console.error(err)
    }
  }

  const deleteItem = async(itemId: number) => {
    try {
      await api.delete(`/cart/${itemId}`)
      fetchCart()
    } catch(err) {
      console.error(err)
    }
  }

  const total = cart?.cart_items.reduce((sum, item) => {
    return sum + (Number(item.product_variant.price) * item.quantity)
  }, 0) || 0

  if(loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading cart...</p>
      </div>
    )
  }

  if(!cart || cart.cart_items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-xl font-medium">Your cart is empty</p>
        <Link href="/products" className="bg-black text-white px-8 py-3 text-sm tracking-widest uppercase hover:bg-gray-800 transition">
          Shop Now
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">
        Your Cart <span className="text-gray-400 font-normal text-xl">({cart.cart_items.length} items)</span>
      </h1>

      <div className="grid grid-cols-3 gap-12">

        <div className="col-span-2 flex flex-col gap-6">
          {cart.cart_items.map((item) => (
            <div key={item.id} className="flex gap-6 border-b border-gray-100 pb-6">
            
              <div className="relative w-24 h-24 bg-gray-100 shrink-0 overflow-hidden">
                {item.product_variant.product?.product_images?.[0] ? (
                  <Image
                    src={item.product_variant.product.product_images[0].image_url}
                    alt={item.product_variant.product.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                    No Image
                  </div>
                )}
              </div>

              {/* Detail */}
              <div className="flex-1">
                <p className="font-medium">{item.product_variant.product?.name}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Size: {item.product_variant.size} · Color: {item.product_variant.color}
                </p>
                <p className="text-sm font-medium mt-1">
                  Rp{Number(item.product_variant.price).toLocaleString('id-ID')}
                </p>

                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center border border-gray-300">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1 hover:bg-gray-100 transition text-lg"
                    >
                      −
                    </button>
                    <span className="px-4 py-1 text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1 hover:bg-gray-100 transition text-lg"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-gray-400 hover:text-red-500 transition"
                  >
                    <Trash2 size={18} />
                  </button>

                  <p className="ml-auto text-sm font-semibold">
                    Rp{(Number(item.product_variant.price) * item.quantity).toLocaleString('id-ID')}
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>

        <div className="col-span-1">
          <div className="border border-gray-200 p-6 sticky top-24">
            <h2 className="font-bold text-lg mb-6">Order Summary</h2>

            <div className="flex flex-col gap-3 text-sm">
              {cart.cart_items.map((item) => (
                <div key={item.id} className="flex justify-between text-gray-500">
                  <span>{item.product_variant.product?.name} × {item.quantity}</span>
                  <span>Rp{(Number(item.product_variant.price) * item.quantity).toLocaleString('id-ID')}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between font-bold">
              <span>Total</span>
              <span>Rp{total.toLocaleString('id-ID')}</span>
            </div>

            <Link
              href="/checkout"
              className="block text-center bg-black text-white py-3 text-sm tracking-widest uppercase hover:bg-gray-800 transition mt-6"
            >
              Checkout
            </Link>

            <Link
              href="/products"
              className="block text-center text-sm text-gray-500 underline mt-3 hover:text-black transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}