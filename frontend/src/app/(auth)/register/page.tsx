'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import api from '@/lib/api'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleRegister = async(e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    if(password !== confirmPassword) {
      setError("Passwords don't match")
      return
    }

    try {
      setLoading(true)
      setError(null)
      await api.post('/auth/register', { name, email, password })
      router.push('/login')
    } catch(err) {
      if(axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Register failed')
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
          <p className="text-gray-500 text-sm mt-2">Create your account</p>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
              className="border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black transition"
            />
          </div>

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

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? 'Creating account...' : 'Create Account'}
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
          Already have an account?{' '}
          <Link href="/login" className="text-black font-medium underline">
            Sign In
          </Link>
        </p>

      </div>
    </div>
  )
}