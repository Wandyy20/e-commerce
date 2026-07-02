const prisma = require('../utils/prisma')

const getAllProducts = async(req, res) => {
    const product = await prisma.product.findMany()
    res.json(product)
}

const getProductById = async(req, res) => {
    const product = await prisma.product.findUnique({
        where: {id:parseInt(req.params.id)}
    })
}

const createProduct = async(req, res) => {
  try {
    const {name, slug, description, base_price, category_id, product_images, product_variants} = req.body
    
    await prisma.product.create({
      data: {
        name,
        slug,
        description,
        base_price,
        category: {
          connect: { id: category_id }
        },
        product_images: {
          createMany: { data: product_images }
        },
        product_variants: {
          createMany: { data: product_variants }
        }
      }
    })

    res.status(201).json({ message: "Product created" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
