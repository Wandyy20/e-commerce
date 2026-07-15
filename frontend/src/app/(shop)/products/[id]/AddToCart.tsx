'use client'
import { useState } from 'react'
import api from '@/lib/api'
import axios from 'axios'

type Variant = {
  id: number
  size: string
  color: string
  stock: number
  price: number
}

export default function AddToCart({ variants }: { variants: Variant[] }) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const sizes = [...new Set(variants.map(v => v.size))]

  const colors = [...new Set(
    variants
      .filter(v => selectedSize ? v.size === selectedSize : true)
      .map(v => v.color)
  )]

  // Cari variant yang sesuai size & color
  const selectedVariant = variants.find(
    v => v.size === selectedSize && v.color === selectedColor
  )

  const handleAddToCart = async() => {
    if(!selectedVariant) {
      setMessage("Please select size and color")
      return
    }
    if(quantity > selectedVariant.stock) {
      setMessage("Not enough stock")
      return
    }

    try {
      setLoading(true)
      await api.post('/cart', {
        variant_id: selectedVariant.id,
        quantity
      })
      setMessage("Added to cart!")
    } catch(error) {
      if(error instanceof Error) {
        console.log(error.message)
      }
       if(axios.isAxiosError(error)) {
          if(error.response?.status === 401) {
            setMessage("Please login first")
          } else {
            setMessage("Failed to add to cart")
          }
        } else {
          setMessage("Failed to add to cart")
        }
      
    } finally {
      setLoading(false)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  return (
    <div className="flex flex-col gap-6 mt-4">

      {/* Pilih Size */}
      <div>
        <p className="text-sm font-semibold mb-3 uppercase tracking-wider">
          Size {selectedSize && <span className="font-normal text-gray-500">— {selectedSize}</span>}
        </p>
        <div className="flex gap-2 flex-wrap">
          {sizes.map(size => (
            <button
              key={size}
              onClick={() => {
                setSelectedSize(size)
                setSelectedColor(null) // reset color kalau ganti size
              }}
              className={`px-4 py-2 text-sm border transition ${
                selectedSize === size
                  ? 'bg-black text-white border-black'
                  : 'border-gray-300 hover:border-black'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Pilih Color */}
      <div>
        <p className="text-sm font-semibold mb-3 uppercase tracking-wider">
          Color {selectedColor && <span className="font-normal text-gray-500">— {selectedColor}</span>}
        </p>
        <div className="flex gap-2 flex-wrap">
          {colors.map(color => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`px-4 py-2 text-sm border transition ${
                selectedColor === color
                  ? 'bg-black text-white border-black'
                  : 'border-gray-300 hover:border-black'
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* Stock info */}
      {selectedVariant && (
        <p className="text-sm text-gray-500">
          Stock: {selectedVariant.stock} items
        </p>
      )}

      {/* Quantity */}
      <div>
        <p className="text-sm font-semibold mb-3 uppercase tracking-wider">Quantity</p>
        <div className="flex items-center border border-gray-300 w-fit">
          <button
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            className="px-4 py-2 hover:bg-gray-100 transition text-lg"
          >
            −
          </button>
          <span className="px-6 py-2 text-sm font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity(q => q + 1)}
            className="px-4 py-2 hover:bg-gray-100 transition text-lg"
          >
            +
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={loading || !selectedVariant}
        className={`py-4 text-sm tracking-widest uppercase font-medium transition ${
          loading || !selectedVariant
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-black text-white hover:bg-gray-800'
        }`}
      >
        {loading ? 'Adding...' : 'Add to Cart'}
      </button>

      {/* Message */}
      {message && (
        <p className={`text-sm text-center ${
          message === 'Added to cart!' ? 'text-green-600' : 'text-red-500'
        }`}>
          {message}
        </p>
      )}

    </div>
  )
}