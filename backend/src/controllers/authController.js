const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const prisma = require('../utils/prisma')
const isAdmin = require('../middlewares/isAdmin')

const registerPost = async(req, res) => {
  try {
    const {name, email, password} = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    await prisma.user.create({
      data: {name, email, password: hashedPassword}
    })
    res.json({ message: "Register Success" })
  } catch (error) {
    if(error.code == 'P2002'){
        return res.status(400).json({message: "Email already registered"})
    }
    res.status(500).json({ message: error.message })
  }
}

const loginPost = async(req, res) => {
  try {
    const {email, password} = req.body
    const user = await prisma.user.findUnique({where: {email}})
    if(!user) return res.status(401).json({message: "Email not found"})

    const match = await bcrypt.compare(password, user.password)
    if(!match) return res.status(401).json({message: "Wrong password"})

    const token = jwt.sign({id: user.id, isAdmin: user.isAdmin, email: user.email}, process.env.JWT_SECRET, {expiresIn: "3h"})
    res.json({ token })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getProfile = async(req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true,
        created_at: true
      }
    })
    res.json(user)
  } catch(error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {registerPost, loginPost, getProfile}