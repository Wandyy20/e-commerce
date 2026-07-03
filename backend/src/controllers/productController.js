const prisma = require('../utils/prisma')

const getAllProducts = async(req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        product_images: true,
        product_variants: true
      }
    })
    res.json(products)
  } catch(error) {
    res.status(500).json({ message: error.message })
  }
}

const getProductById = async(req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        category: true,
        product_images: true,
        product_variants: true
      }
    })
    if(!product) return res.status(404).json({ message: "Product not found" })
    res.json(product)
  } catch(error) {
    res.status(500).json({ message: error.message })
  }
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

const updateProduct = async(req, res) => {
  try{
    const {name, slug, description, base_price, category_id, product_images, product_variants} = req.body
  await prisma.product.update({
    where: {id: parseInt(req.params.id)},
    data: {
        name,
        slug,
        description,
        base_price,
        category: {
          connect: {id: category_id}
        },
        product_images: {
          createMany: {data: product_images}
        },
        product_variants: {
          createMany: {data: product_variants}
        }
    }
  })
  res.status(200).json({message: "Product updated"})
  }catch(error){
    res.status(500).json({message: error.message})
  }
}

const deleteProduct = async(req,res) => {
  try{
    await prisma.product.delete({
      where: {id: parseInt(req.params.id)}
    })
    res.json({message: "Product deleted"})
  }catch(error){
    res.status(500).json({message: error.message})
  }
}

module.exports = {getAllProducts, getProductById, updateProduct, deleteProduct, createProduct}
