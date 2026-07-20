const prisma = require('../utils/prisma')

const getAllAddress = async(req, res) => {
  try {
    const userId = req.user.id
    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: { is_default: 'desc' }
    })
    res.json(addresses)
  } catch(error) {
    res.status(500).json({ message: error.message })
  }
}

const createAddress = async(req, res) => {
  try {
    const userId = req.user.id
    const { label, recipient_name, phone, street, city, province, postal_code, is_default } = req.body

    if(is_default) {
      await prisma.address.updateMany({
        where: { userId },
        data: { is_default: false }
      })
    }

    const address = await prisma.address.create({
      data: {
        label,
        recipient_name,
        phone,
        street,
        city,
        province,
        postal_code,
        is_default: is_default || false,
        user: { connect: { id: userId } }
      }
    })

    res.status(201).json(address)
  } catch(error) {
    res.status(500).json({ message: error.message })
  }
}

const updateAddress = async(req, res) => {
  try {
    const userId = req.user.id
    const addressId = parseInt(req.params.id)
    const { label, recipient_name, phone, street, city, province, postal_code, is_default } = req.body

    if(is_default) {
      await prisma.address.updateMany({
        where: { userId },
        data: { is_default: false }
      })
    }

    await prisma.address.update({
      where: { id: addressId },
      data: { label, recipient_name, phone, street, city, province, postal_code, is_default }
    })

    res.json({ message: "Address updated" })
  } catch(error) {
    res.status(500).json({ message: error.message })
  }
}

const deleteAddress = async(req, res) => {
  try {
    await prisma.address.delete({
      where: { id: parseInt(req.params.id) }
    })
    res.json({ message: "Address deleted" })
  } catch(error) {
    res.status(500).json({ message: error.message })
  }
}

const setDefaultAddress = async(req, res) => {
  try {
    const userId = req.user.id
    const addressId = parseInt(req.params.id)

    await prisma.address.updateMany({
      where: { userId },
      data: { is_default: false }
    })

    await prisma.address.update({
      where: { id: addressId },
      data: { is_default: true }
    })

    res.json({ message: "Default address updated" })
  } catch(error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getAllAddress, createAddress, updateAddress, deleteAddress, setDefaultAddress }