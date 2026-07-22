'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import api from '@/lib/api'
import Image from 'next/image'

type Order = {
  id: number
  total_amount: number
  status: string
  created_at: string
  order_items: {
    id: number
    quantity: number
    price: number
    product_variant: {
      size: string
      color: string
      product: {
        name: string
        product_images: { image_url: string }[]
      }
    }
  }[]
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const loadOrders = async() => {
      try {
        const res = await api.get('/orders')
        setOrders(res.data.orders)
      } catch(err) {
        if(axios.isAxiosError(err) && err.response?.status === 401) {
          setIsRedirecting(true)
          router.push('/login')
        }
      } finally {
        setLoading(false)
      }
    }
    loadOrders()
  }, [router])

  if(loading || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    )
  }

  if(orders.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-xl font-medium">No orders yet</p>
        <Link 
          href="/products" 
          className="bg-black text-white px-8 py-3 text-sm tracking-widest uppercase hover:bg-gray-800 transition"
        >
          Shop Now
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      <div className="flex flex-col gap-6">
        {orders.map((order) => (
          <div key={order.id} className="border border-gray-200 rounded-lg overflow-hidden">
            
            {/* Order Header */}
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-xs text-gray-500">Order ID</p>
                  <p className="text-sm font-medium">#{order.id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="text-sm font-medium">
                    {new Date(order.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total</p>
                  <p className="text-sm font-medium">
                    Rp{Number(order.total_amount).toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-xs px-3 py-1 rounded-full font-medium uppercase tracking-wider ${
                  order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                  order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                  order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                  order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {order.status}
                </span>
                <Link
                  href={`/orders/${order.id}`}
                  className="text-sm underline hover:text-gray-500 transition"
                >
                  Detail
                </Link>
              </div>
            </div>

            <div className="px-6 py-4 flex flex-col gap-3">
              {order.order_items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="relative w-12 h-12 bg-gray-100 rounded overflow-hidden shrink-0">
                    {item.product_variant?.product?.product_images?.[0] && (
                      <Image
                        src={item.product_variant.product.product_images[0].image_url}
                        alt={item.product_variant.product.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.product_variant?.product?.name}</p>
                    <p className="text-xs text-gray-500">
                      Size: {item.product_variant?.size} · Color: {item.product_variant?.color} · Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-medium">
                    Rp{(Number(item.price) * item.quantity).toLocaleString('id-ID')}
                  </p>
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}