'use client'
import Link from 'next/link'
import { ShoppingCart, User, Search } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [search, setSearch] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if(search.trim()) {
      router.push(`/products?search=${search}`)
    }
  }

  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 flex items-center h-16 gap-40">

        <Link href="/" className="text-xl font-bold tracking-widest uppercase shrink-0">
          FashionStore
        </Link>

        <form onSubmit={handleSearch} className="w-108">
          <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 gap-2">
            <Search size={14} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-sm outline-none bg-transparent"
            />
          </div>
        </form>

        <div className="flex items-center gap-6 ml-auto shrink-0">
          <Link href="/" className="text-sm font-medium hover:text-gray-500 transition">Home</Link>
          <Link href="/products" className="text-sm font-medium hover:text-gray-500 transition">Products</Link>
          <Link href="/orders" className="text-sm font-medium hover:text-gray-500 transition">Orders</Link>
          <Link href="/cart">
            <ShoppingCart size={20} className="hover:text-gray-500 transition cursor-pointer" />
          </Link>
          <Link href="/login">
            <User size={20} className="hover:text-gray-500 transition cursor-pointer" />
          </Link>
        </div>

      </div>
    </nav>
  )
}