const prisma = require('../utils/prisma')

const getAllCart = async(req, res) => {
  try {
    const userId = req.user.id
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        cart_items: {
          include: {
            product_variant: {
              include: {
                product: {
                  include: {
                    product_images: true
                  }
                }
              }
            }
          }
        }
      }
    })
    res.json(cart)
  } catch(error) {
    res.status(500).json({ message: error.message })
  }
}

const addToCart = async(req, res) => {
    try{
        const userId = req.user.id
        const { variant_id, quantity } = req.body
        let cart = await prisma.cart.findUnique({
            where: { userId }
        })
        if(!cart){
            cart = await prisma.cart.create({
                data: {userId}
            })
        }
        const existItems = await prisma.cart_item.findFirst({
            where: {
                cartId: cart.id,
                variantId: parseInt(variant_id)
            }
        })
        if(existItems){
            await prisma.cart_item.update({
                where: {id: existItems.id},
                data : { quantity: existItems.quantity + quantity}
            })
        } else{
            await prisma.cart_item.create({
                data: { 
                    cartId: cart.id,
                    variantId: variant_id,
                    quantity
                }
            })
        }
        res.json({message: "Item added to cart"})
    }catch(error){
        res.status(500).json({message: error.message})
    }
}

const updateCart = async(req, res) => {
    try{
        const { quantity } = req.body
        await prisma.cart_item.update({
            where: { id: parseInt(req.params.id) },
            data: { quantity }
        })
        res.json({ message: "Cart updated" })
    }catch(error){
        res.status(500).json({ message: error.message })
    }
}

const deleteCart = async(req, res) => {
    try{
        await prisma.cart_item.delete({
            where: { id: parseInt(req.params.id) }
        })
        res.json({ message: "Item deleted from cart" })
    }catch(error){
        res.status(500).json({ message: error.message })
    }
}

module.exports = { getAllCart, addToCart, updateCart, deleteCart }