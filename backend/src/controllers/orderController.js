const prisma = require('../utils/prisma')
const midtransClient = require('midtrans-client')

const checkOut = async(req, res) => {
  try{
    const userId = req.user.id
    const { address_id } = req.body

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        cart_items: {
          include: { product_variant: true }
        }
      }
    })

    if(!cart || cart.cart_items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" })
    }

    let total = 0
    cart.cart_items.forEach((item) => {
      total += item.quantity * Number(item.product_variant.price)
    })

    const orderItems = cart.cart_items.map((item) => ({
      variantId: item.variantId,
      quantity: item.quantity,
      price: item.product_variant.price
    }))

    const order = await prisma.order.create({
      data: {
        userId,
        addressId: address_id,
        total_amount: total,
        status: "pending"
      }
    })

    await prisma.order_item.createMany({
      data: orderItems.map((item) => ({
        ...item,
        orderId: order.id
      }))
    })

    await prisma.order_status_history.create({
      data: {
        orderId: order.id,
        status: "pending",
        note: "Order created"
      }
    })

    await prisma.cart_item.deleteMany({
      where: { cartId: cart.id }
    })

    const snap = new midtransClient.Snap({
      isProduction: false, 
      serverKey: process.env.MIDTRANS_SERVER_KEY
    })

    const parameter = {
      transaction_details: {
        order_id: order.id,
        gross_amount: total
      },
      customer_details: {
        email: req.user.email 
      }
    }

    const transaction = await snap.createTransaction(parameter)

    await prisma.payment.create({
      data: {
        orderId: order.id,
        trans_id: transaction.token,
        method: "midtrans",
        status: "pending"
      }
    })

    res.status(201).json({
      message: "Order created",
      orderId: order.id,
      payment_url: transaction.redirect_url
    })
  } catch(error) {
    res.status(500).json({ message: error.message })
  }
}

const getMyOrders = async (req, res) => {
    try{
        const userId = req.user.id 
        const orders = await prisma.order.findMany({
            where: {userId},
            include: {
              order_items: {
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
            },
            orderBy: { created_at: 'desc' }
        })
        res.json({orders})
    }catch(error){
        res.status(500).json({message: error.message})
    }
}

const getOrderById = async(req, res) => {
    try{
        const orderId = parseInt(req.params.id)
        const orders = await prisma.order.findUnique({
            where: {id: orderId},
            include: {
                order_items: {
                    include: {product_variant: true}
                },
                order_status_historys: true,
                address: true,
                payments: true
            }
        })
        res.json({orders})
    }catch(error){
        res.status(500).json({message: error.message})
    }
}

const getAllOrders = async(req, res) => {
    try{
        const order = await prisma.order.findMany({
            include: {
                user: {
                    select: {name:true, email: true}
                }
            }
            
        })
        res.json(order)
    }catch(error){
        res.status(500).json({message: error.message})
    }
}

const updateOrderStatus = async(req, res) => {
    try{
        const orderId = req.params.id
        const {status} = req.body
        await prisma.order.update({
            where : {id: parseInt(orderId)},
            data: {status}
        })
        
        await prisma.order_status_history.create({
            data: {
                orderId: parseInt(orderId), 
                status,
                note: `Status updated to ${status}`
            }
        })
        res.json({message: "Status updated"})
    }catch(error){
        res.status(500).json({message: error.message})
    }
}

const handleWebhook = async(req,res) => {
  try{
    const notification = req.body

    const snap = new midtransClient.Snap({
      isProduction : false,
      serverKey: process.env.MIDTRANS_SERVER_KEY
    })

    const statusResponse = await snap.transaction.notification(notification)

    const orderId = parseInt(statusResponse.order_id)
    const transactionStatus = statusResponse.transaction_status
    const fraudStatus = statusResponse.fraud_status

    let paymentStatus = "pending"
    let orderStatus = "pending"

    if(transactionStatus === "capture" && fraudStatus === "accept") {
      paymentStatus = "paid"
      orderStatus = "processing"
    } else if(transactionStatus === "settlement") {
      paymentStatus = "paid"
      orderStatus = "processing"
    } else if(transactionStatus === "cancel" || transactionStatus === "expire") {
      paymentStatus = "failed"
      orderStatus = "cancelled"
    }

    await prisma.payment.updateMany({
      where: { orderId },
      data: { status: paymentStatus, trans_id: statusResponse.transaction_id }
    })

    await prisma.order.update({
      where: { id: orderId },
      data: { status: orderStatus }
    })

    await prisma.order_status_history.create({
      data: {
        orderId,
        status: orderStatus,
        note: `Payment ${paymentStatus}`
      }
    })

    res.json({ message: "Webhook received" })
  }catch(error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { checkOut, getMyOrders, getOrderById, getAllOrders, updateOrderStatus, handleWebhook}