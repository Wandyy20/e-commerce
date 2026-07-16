'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import axios from 'axios'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async(e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)
      const res = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      router.push('/')
    } catch(err) {
      if(axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Login failed')
      } else {
        setError('Something went wrong')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md p-8 shadow-sm">
        
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold tracking-widest uppercase">
            FashionStore
          </Link>
          <p className="text-gray-500 text-sm mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black transition"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`py-3 text-sm tracking-widest uppercase font-medium transition mt-2 ${
              loading
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

        </form>

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 border-t border-gray-200" />
          <span className="text-xs text-gray-400">or continue with</span>
          <div className="flex-1 border-t border-gray-200" />
        </div>

        <div className="flex gap-3">
          <button
            disabled
            className="flex-1 flex items-center justify-center gap-2 border border-gray-300 py-3 text-sm text-gray-400 cursor-not-allowed"
          >
            <span className="font-bold text-blue-500 opacity-50">G</span>
            Google
          </button>
          <button
            disabled
            className="flex-1 flex items-center justify-center gap-2 border border-gray-300 py-3 text-sm text-gray-400 cursor-not-allowed"
          >
            <span className="font-bold text-blue-700 opacity-50">f</span>
            Facebook
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-black font-medium underline">
            Register
          </Link>
        </p>

      </div>
    </div>
  )
}