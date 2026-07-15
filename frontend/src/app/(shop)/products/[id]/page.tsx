import Image from 'next/image'
import AddToCart from './AddToCart'

type Variant = {
  id: number
  size: string
  color: string
  stock: number
  price: number
}

type Product = {
  id: number
  name: string
  description: string
  base_price: number
  category: { name: string }
  product_images: { image_url: string; is_primary: boolean }[]
  product_variants: Variant[]
}

async function getProduct(id: string) {
  try {
    const res = await fetch(`http://localhost:5000/api/products/${id}`, {
      cache: 'no-store'
    })
    return await res.json()
  } catch {
    return null
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product: Product = await getProduct(id)

  if(!product) {
    return <div className="text-center py-20">Product not found</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <div className="grid grid-cols-2 gap-12">

        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
          {product.product_images?.[0] && (
            <Image
              src={product.product_images[0].image_url}
              alt={product.name}
              fill
              sizes="50vw"
              className="object-cover"
              priority
            />
          )}
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-400 uppercase tracking-widest">
            {product.category?.name}
          </p>
          <h1 className="text-4xl font-bold">{product.name}</h1>
          <p className="text-2xl font-semibold">
            Rp{Number(product.base_price).toLocaleString('id-ID')}
          </p>
          <p className="text-gray-500 leading-relaxed">{product.description}</p>

          <AddToCart variants={product.product_variants} />
        </div>

      </div>
    </div>
  )
}