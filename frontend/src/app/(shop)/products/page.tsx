import Link from 'next/link'
import Image from 'next/image'

type Product = {
  id: number
  name: string
  base_price: number
  product_images: { image_url: string; is_primary: boolean }[]
}

type Category = {
  id: number
  name: string
  slug: string
}

async function getProducts(search?: string, category?: string) {
  try {
    const params = new URLSearchParams()
    if(search) params.append('search', search)
    if(category) params.append('category', category)

    const res = await fetch(
      `http://localhost:5000/api/products?${params.toString()}`,
      { cache: 'no-store' }
    )
    return await res.json()
  } catch {
    return []
  }
}

async function getCategories() {
  try {
    const res = await fetch('http://localhost:5000/api/categories', { cache: 'no-store' })
    return await res.json()
  } catch {
    return []
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>
}) {
  const { search, category } = await searchParams
  const products = await getProducts(search, category)
  const categories = await getCategories()

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-8 py-12">

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {search ? `Search results for "${search}"` : 'All Products'}
          </h1>
          <p className="text-gray-500 text-sm">{products.length} products found</p>
        </div>

        <div className="flex gap-3 flex-wrap mb-10">
          <Link
            href="/products"
            className={`px-4 py-2 text-sm border transition ${
              !category
                ? 'bg-black text-white border-black'
                : 'border-gray-300 hover:border-black'
            }`}
          >
            All
          </Link>
          {categories.map((cat: Category) => (
            <Link
              key={cat.id}
              href={`/products?${search ? `search=${search}&` : ''}category=${cat.slug}`}
              className={`px-4 py-2 text-sm border transition ${
                category === cat.slug
                  ? 'bg-black text-white border-black'
                  : 'border-gray-300 hover:border-black'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">No products found</p>
            <Link href="/products" className="text-sm underline mt-2 block">
              View all products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product: Product, index: number) => (
              <Link href={`/products/${product.id}`} key={product.id}>
                <div className="group cursor-pointer bg-white rounded-lg overflow-hidden hover:shadow-md transition">
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    {product.product_images?.[0] ? (
                      <Image
                        src={product.product_images[0].image_url}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        loading={index === 0 ? 'eager' : 'lazy'}
                        className="object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Rp{Number(product.base_price).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}