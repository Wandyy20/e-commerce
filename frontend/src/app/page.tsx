import Link from 'next/link'
import api from '@/lib/api'
import Image from 'next/image'

type Product = {
  id: number
  name: string
  base_price: number
  product_images: { image_url: string; is_primary: boolean }[]
}

async function getProducts() {
  try {
    const res = await api.get('/products')
    return res.data
  } catch {
    return []
  }
}

export default async function Home() {
  const products = await getProducts()

  return (
    <div className="min-h-screen bg-white">
      
      <section className="bg-gray-100 py-20 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-sm tracking-widest uppercase text-gray-500 mb-2">#New Collection</p>
            <h1 className="text-5xl font-bold leading-tight mb-4">
              Elevate Your<br />Everyday Style
            </h1>
            <p className="text-gray-500 mb-8">Discover our latest fashion collection</p>
            <Link 
              href="/products"
              className="bg-black text-white px-8 py-3 text-sm tracking-widest uppercase hover:bg-gray-800 transition"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-8 py-16">
        <h2 className="text-2xl font-bold mb-8 tracking-tight">New Arrivals</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product: Product) => (
            <Link href={`/products/${product.id}`} key={product.id}>
              <div className="group cursor-pointer">
                <div className="relative bg-gray-100 aspect-square mb-3 overflow-hidden">
                  {product.product_images?.[0] ? (
                    <Image
                      src={product.product_images[0].image_url}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                      No Image
                    </div>
                  )}
                </div>
                <p className="text-sm font-medium">{product.name}</p>
                <p className="text-sm text-gray-500">
                  Rp{Number(product.base_price).toLocaleString('id-ID')}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  )
}