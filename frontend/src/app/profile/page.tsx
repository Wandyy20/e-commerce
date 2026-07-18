'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/api'
import axios from 'axios'

type User = {
  id: number
  name: string
  email: string
  isAdmin: boolean
  created_at: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadProfile = async() => {
      try {
        const res = await api.get('/auth/profile')
        setUser(res.data)
      } catch(err) {
        if(axios.isAxiosError(err) && err.response?.status === 401) {
          router.push('/login')
        }
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/')
  }

  if(loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    )
  }

  if(!user) return null

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-8">
      <div className="max-w-lg mx-auto">

        <div className="bg-white p-8 shadow-sm mb-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center text-white text-2xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold">{user.name}</h1>
              <p className="text-gray-500 text-sm">{user.email}</p>
              {user.isAdmin && (
                <span className="text-xs bg-black text-white px-2 py-0.5 mt-1 inline-block">
                  Admin
                </span>
              )}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 flex flex-col gap-2 text-sm text-gray-500">
            <p>Member since {new Date(user.created_at).toLocaleDateString('en-EN', { 
              year: 'numeric', month: 'long', day: 'numeric' 
            })}</p>
          </div>
        </div>

        <div className="bg-white shadow-sm">
          <Link 
            href="/orders"
            className="flex items-center justify-between px-8 py-4 border-b border-gray-100 hover:bg-gray-50 transition"
          >
            <span className="text-sm font-medium">My Orders</span>
            <span className="text-gray-400">→</span>
          </Link>
          <Link 
            href="/cart"
            className="flex items-center justify-between px-8 py-4 border-b border-gray-100 hover:bg-gray-50 transition"
          >
            <span className="text-sm font-medium">My Cart</span>
            <span className="text-gray-400">→</span>
          </Link>
          {user.isAdmin && (
            <Link 
              href="/admin/dashboard"
              className="flex items-center justify-between px-8 py-4 border-b border-gray-100 hover:bg-gray-50 transition"
            >
              <span className="text-sm font-medium">Admin Dashboard</span>
              <span className="text-gray-400">→</span>
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-8 py-4 hover:bg-gray-50 transition text-red-500"
          >
            <span className="text-sm font-medium">Logout</span>
            <span>→</span>
          </button>
        </div>

      </div>
    </div>
  )
}