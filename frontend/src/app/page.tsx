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

async function getProducts() {
  try {
    const res = await fetch('http://localhost:5000/api/products', { cache: 'no-store' })
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

export default async function Home() {
  const products = await getProducts()
  const categories = await getCategories()

  return (
    <div className="min-h-screen bg-white">

      <section className="bg-gray-50 py-16 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm tracking-widest uppercase text-gray-400 mb-3">#New Collection</p>
            <h1 className="text-6xl font-bold leading-tight mb-6">
              Elevate Your<br />Everyday<br />Style
            </h1>
            <p className="text-gray-500 mb-8 text-lg">Discover our latest fashion collection — curated for modern living.</p>
            <div className="flex gap-4 mb-10">
              <Link href="/products" className="bg-black text-white px-8 py-3 text-sm tracking-widest uppercase hover:bg-gray-800 transition">
                Shop Now
              </Link>
              <Link href="/products" className="border border-black px-8 py-3 text-sm tracking-widest uppercase hover:bg-black hover:text-white transition">
                View All
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "🚚", title: "Free Shipping", desc: "On orders over Rp500.000" },
                { icon: "↩️", title: "Easy Returns", desc: "30 day return policy" },
                { icon: "🔒", title: "Secure Payment", desc: "100% secure checkout" },
                { icon: "💬", title: "24/7 Support", desc: "Always here to help" },
              ].map((item) => (
                <div key={item.title} className="flex items-center gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="text-xs font-semibold">{item.title}</p>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative h-[500px] rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1559697242-a465f2578a95?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=800"
              alt="Fashion Hero"
              fill
              sizes="50vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-8 py-16">
        <p className="text-sm tracking-widest uppercase text-gray-400 text-center mb-2">Shop By Category</p>
        <h2 className="text-3xl font-bold text-center mb-10">Explore Our Collections</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((cat: Category) => (
            <Link href={`/products?category=${cat.slug}`} key={cat.id}>
              <div className="flex flex-col items-center gap-2 group cursor-pointer">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-black transition">
                  <span className="text-2xl">👕</span>
                </div>
                <p className="text-xs font-medium text-center">{cat.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-8">
          <p className="text-sm tracking-widest uppercase text-gray-400 text-center mb-2">Just Arrived</p>
          <h2 className="text-3xl font-bold text-center mb-10">New Arrivals</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.slice(0, 8).map((product: Product) => (
              <Link href={`/products/${product.id}`} key={product.id}>
                <div className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                  <div className="relative aspect-square overflow-hidden">
                    {product.product_images?.[0] ? (
                      <Image
                        src={product.product_images[0].image_url}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
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
          <div className="text-center mt-10">
            <Link href="/products" className="border border-black px-10 py-3 text-sm tracking-widest uppercase hover:bg-black hover:text-white transition">
              View All Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}