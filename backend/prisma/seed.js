const { PrismaClient } = require('../src/generated/prisma')
const prisma = new PrismaClient()

async function main() {
  console.log("Cleaning old data...")
  await prisma.payment.deleteMany()
  await prisma.order_status_history.deleteMany()
  await prisma.order_item.deleteMany()
  await prisma.order.deleteMany()
  await prisma.cart_item.deleteMany()
  await prisma.cart.deleteMany()
  await prisma.product_image.deleteMany()
  await prisma.product_variant.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.address.deleteMany()
  await prisma.user.deleteMany()
  console.log("Cleaned")
  console.log("Seeding...")

  const tshirt = await prisma.category.create({ data: { name: "T-Shirt", slug: "t-shirt" } })
  const jacket = await prisma.category.create({ data: { name: "Jacket", slug: "jacket" } })
  const pants = await prisma.category.create({ data: { name: "Pants", slug: "pants" } })
  const dress = await prisma.category.create({ data: { name: "Dress", slug: "dress" } })
  const hoodie = await prisma.category.create({ data: { name: "Hoodie", slug: "hoodie" } })
  const shoes = await prisma.category.create({ data: { name: "Shoes", slug: "shoes" } })

  const products = [
    {
      name: "Kaos Polos Premium",
      slug: "kaos-polos-premium",
      description: "Kaos polos berbahan cotton combed 30s, nyaman dipakai sehari-hari",
      base_price: 99000,
      category_id: tshirt.id,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
      variants: [
        { size: "S", color: "Putih", stock: 10, price: 99000 },
        { size: "M", color: "Putih", stock: 15, price: 99000 },
        { size: "L", color: "Putih", stock: 8, price: 99000 },
        { size: "S", color: "Hitam", stock: 10, price: 99000 },
        { size: "M", color: "Hitam", stock: 12, price: 99000 },
        { size: "L", color: "Hitam", stock: 6, price: 99000 },
      ]
    },
    {
      name: "Kaos Oversize Vintage",
      slug: "kaos-oversize-vintage",
      description: "Kaos oversize dengan desain vintage yang stylish",
      base_price: 129000,
      category_id: tshirt.id,
      image: "https://images.unsplash.com/photo-1661110546801-cfe548af5705?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=500",
      variants: [
        { size: "M", color: "Abu-abu", stock: 10, price: 129000 },
        { size: "L", color: "Abu-abu", stock: 8, price: 129000 },
        { size: "XL", color: "Abu-abu", stock: 5, price: 129000 },
        { size: "M", color: "Cream", stock: 10, price: 129000 },
        { size: "L", color: "Cream", stock: 8, price: 129000 },
      ]
    },
    {
      name: "Kaos Graphic Street",
      slug: "kaos-graphic-street",
      description: "Kaos dengan print grafis streetwear yang edgy",
      base_price: 149000,
      category_id: tshirt.id,
      image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500",
      variants: [
        { size: "S", color: "Putih", stock: 10, price: 149000 },
        { size: "M", color: "Putih", stock: 12, price: 149000 },
        { size: "L", color: "Putih", stock: 8, price: 149000 },
        { size: "M", color: "Hitam", stock: 10, price: 149000 },
        { size: "L", color: "Hitam", stock: 8, price: 149000 },
      ]
    },
    {
      name: "Kaos Polo Premium",
      slug: "kaos-polo-premium",
      description: "Kaos polo berbahan pique cotton, cocok untuk casual dan semi-formal",
      base_price: 159000,
      category_id: tshirt.id,
      image: "https://images.unsplash.com/photo-1625910513399-c9fcba54338c?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=500",
      variants: [
        { size: "S", color: "Putih", stock: 8, price: 159000 },
        { size: "M", color: "Putih", stock: 10, price: 159000 },
        { size: "L", color: "Putih", stock: 6, price: 159000 },
        { size: "S", color: "Navy", stock: 8, price: 159000 },
        { size: "M", color: "Navy", stock: 10, price: 159000 },
      ]
    },
    {
      name: "Jaket Bomber Classic",
      slug: "jaket-bomber-classic",
      description: "Jaket bomber klasik berbahan polyester premium",
      base_price: 299000,
      category_id: jacket.id,
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500",
      variants: [
        { size: "M", color: "Hitam", stock: 8, price: 299000 },
        { size: "L", color: "Hitam", stock: 6, price: 299000 },
        { size: "XL", color: "Hitam", stock: 4, price: 299000 },
        { size: "M", color: "Army", stock: 6, price: 299000 },
        { size: "L", color: "Army", stock: 5, price: 299000 },
      ]
    },
    {
      name: "Jaket Denim Premium",
      slug: "jaket-denim-premium",
      description: "Jaket denim premium dengan bahan berkualitas tinggi",
      base_price: 349000,
      category_id: jacket.id,
      image: "https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=500",
      variants: [
        { size: "S", color: "Biru", stock: 5, price: 349000 },
        { size: "M", color: "Biru", stock: 8, price: 349000 },
        { size: "L", color: "Biru", stock: 6, price: 349000 },
      ]
    },
    {
      name: "Jaket Windbreaker Sport",
      slug: "jaket-windbreaker-sport",
      description: "Jaket windbreaker ringan anti angin, cocok untuk olahraga outdoor",
      base_price: 279000,
      category_id: jacket.id,
      image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500",
      variants: [
        { size: "S", color: "Biru", stock: 6, price: 279000 },
        { size: "M", color: "Biru", stock: 8, price: 279000 },
        { size: "L", color: "Biru", stock: 6, price: 279000 },
        { size: "M", color: "Hitam", stock: 8, price: 279000 },
        { size: "L", color: "Hitam", stock: 6, price: 279000 },
      ]
    },
    {
      name: "Celana Chino Slim",
      slug: "celana-chino-slim",
      description: "Celana chino slim fit cocok untuk casual dan semi-formal",
      base_price: 199000,
      category_id: pants.id,
      image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500",
      variants: [
        { size: "30", color: "Khaki", stock: 8, price: 199000 },
        { size: "32", color: "Khaki", stock: 10, price: 199000 },
        { size: "34", color: "Khaki", stock: 6, price: 199000 },
        { size: "30", color: "Navy", stock: 8, price: 199000 },
        { size: "32", color: "Navy", stock: 10, price: 199000 },
      ]
    },
    {
      name: "Celana Jeans Straight",
      slug: "celana-jeans-straight",
      description: "Celana jeans straight cut dengan bahan denim berkualitas",
      base_price: 249000,
      category_id: pants.id,
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500",
      variants: [
        { size: "30", color: "Biru Tua", stock: 8, price: 249000 },
        { size: "32", color: "Biru Tua", stock: 10, price: 249000 },
        { size: "34", color: "Biru Tua", stock: 6, price: 249000 },
        { size: "30", color: "Hitam", stock: 8, price: 249000 },
        { size: "32", color: "Hitam", stock: 6, price: 249000 },
      ]
    },
    {
      name: "Celana Jogger Casual",
      slug: "celana-jogger-casual",
      description: "Celana jogger nyaman untuk santai dan olahraga ringan",
      base_price: 169000,
      category_id: pants.id,
      image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=500",
      variants: [
        { size: "S", color: "Abu-abu", stock: 10, price: 169000 },
        { size: "M", color: "Abu-abu", stock: 12, price: 169000 },
        { size: "L", color: "Abu-abu", stock: 8, price: 169000 },
        { size: "M", color: "Hitam", stock: 10, price: 169000 },
        { size: "L", color: "Hitam", stock: 8, price: 169000 },
      ]
    },
    {
      name: "Celana Cargo Tactical",
      slug: "celana-cargo-tactical",
      description: "Celana cargo dengan banyak kantong, cocok untuk outdoor",
      base_price: 229000,
      category_id: pants.id,
      image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500",
      variants: [
        { size: "30", color: "Khaki", stock: 8, price: 229000 },
        { size: "32", color: "Khaki", stock: 10, price: 229000 },
        { size: "34", color: "Khaki", stock: 6, price: 229000 },
        { size: "30", color: "Hitam", stock: 8, price: 229000 },
        { size: "32", color: "Hitam", stock: 6, price: 229000 },
      ]
    },
    {
      name: "Dress Floral Summer",
      slug: "dress-floral-summer",
      description: "Dress motif bunga yang cocok untuk musim panas",
      base_price: 179000,
      category_id: dress.id,
      image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500",
      variants: [
        { size: "S", color: "Pink", stock: 8, price: 179000 },
        { size: "M", color: "Pink", stock: 10, price: 179000 },
        { size: "L", color: "Pink", stock: 6, price: 179000 },
        { size: "S", color: "Kuning", stock: 6, price: 179000 },
        { size: "M", color: "Kuning", stock: 8, price: 179000 },
      ]
    },
    {
      name: "Dress Casual Midi",
      slug: "dress-casual-midi",
      description: "Dress midi casual yang elegan dan nyaman",
      base_price: 219000,
      category_id: dress.id,
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500",
      variants: [
        { size: "S", color: "Hitam", stock: 8, price: 219000 },
        { size: "M", color: "Hitam", stock: 10, price: 219000 },
        { size: "L", color: "Hitam", stock: 6, price: 219000 },
        { size: "S", color: "Putih", stock: 6, price: 219000 },
        { size: "M", color: "Putih", stock: 8, price: 219000 },
      ]
    },
    {
      name: "Dress Wrap Elegant",
      slug: "dress-wrap-elegant",
      description: "Dress wrap dengan tali pinggang, tampil elegan dan feminin",
      base_price: 249000,
      category_id: dress.id,
      image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500",
      variants: [
        { size: "S", color: "Merah", stock: 6, price: 249000 },
        { size: "M", color: "Merah", stock: 8, price: 249000 },
        { size: "L", color: "Merah", stock: 5, price: 249000 },
        { size: "S", color: "Navy", stock: 6, price: 249000 },
        { size: "M", color: "Navy", stock: 8, price: 249000 },
      ]
    },
    {
      name: "Hoodie Fleece Premium",
      slug: "hoodie-fleece-premium",
      description: "Hoodie berbahan fleece tebal, hangat dan nyaman",
      base_price: 259000,
      category_id: hoodie.id,
      image: "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=500",
      variants: [
        { size: "M", color: "Hitam", stock: 10, price: 259000 },
        { size: "L", color: "Hitam", stock: 8, price: 259000 },
        { size: "XL", color: "Hitam", stock: 5, price: 259000 },
        { size: "M", color: "Abu-abu", stock: 8, price: 259000 },
        { size: "L", color: "Abu-abu", stock: 6, price: 259000 },
      ]
    },
    {
      name: "Hoodie Zip Up Classic",
      slug: "hoodie-zip-up-classic",
      description: "Hoodie dengan resleting depan, desain klasik dan stylish",
      base_price: 289000,
      category_id: hoodie.id,
      image: "https://images.unsplash.com/photo-1564858775545-e2d21c3ceee0?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=500",
      variants: [
        { size: "M", color: "Navy", stock: 8, price: 289000 },
        { size: "L", color: "Navy", stock: 6, price: 289000 },
        { size: "XL", color: "Navy", stock: 4, price: 289000 },
        { size: "M", color: "Merah", stock: 6, price: 289000 },
        { size: "L", color: "Merah", stock: 5, price: 289000 },
      ]
    },
    {
      name: "Sneakers Casual Putih",
      slug: "sneakers-casual-putih",
      description: "Sneakers casual berbahan canvas, ringan dan nyaman dipakai seharian",
      base_price: 299000,
      category_id: shoes.id,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
      variants: [
        { size: "39", color: "Putih", stock: 8, price: 299000 },
        { size: "40", color: "Putih", stock: 10, price: 299000 },
        { size: "41", color: "Putih", stock: 8, price: 299000 },
        { size: "42", color: "Putih", stock: 6, price: 299000 },
        { size: "43", color: "Putih", stock: 4, price: 299000 },
      ]
    },
    {
      name: "Sneakers Running Sport",
      slug: "sneakers-running-sport",
      description: "Sepatu lari dengan teknologi cushioning untuk kenyamanan maksimal",
      base_price: 459000,
      category_id: shoes.id,
      image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500",
      variants: [
        { size: "39", color: "Hitam", stock: 6, price: 459000 },
        { size: "40", color: "Hitam", stock: 8, price: 459000 },
        { size: "41", color: "Hitam", stock: 8, price: 459000 },
        { size: "42", color: "Hitam", stock: 6, price: 459000 },
        { size: "43", color: "Hitam", stock: 4, price: 459000 },
      ]
    },
    {
      name: "Sepatu Loafer Formal",
      slug: "sepatu-loafer-formal",
      description: "Sepatu loafer berbahan kulit sintetis, cocok untuk formal dan semi-formal",
      base_price: 389000,
      category_id: shoes.id,
      image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=500",
      variants: [
        { size: "39", color: "Hitam", stock: 6, price: 389000 },
        { size: "40", color: "Hitam", stock: 8, price: 389000 },
        { size: "41", color: "Hitam", stock: 8, price: 389000 },
        { size: "42", color: "Hitam", stock: 6, price: 389000 },
        { size: "39", color: "Coklat", stock: 6, price: 389000 },
        { size: "40", color: "Coklat", stock: 8, price: 389000 },
      ]
    },
  ]

  for (const product of products) {
    await prisma.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        base_price: product.base_price,
        is_active: true,
        category_id: product.category_id,
        product_images: {
          create: { image_url: product.image, is_primary: true }
        },
        product_variants: {
          createMany: { data: product.variants }
        }
      }
    })
    console.log(`✓ ${product.name}`)
  }

  console.log("Seeding finished")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())