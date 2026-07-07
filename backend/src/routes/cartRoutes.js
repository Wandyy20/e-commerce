const { Router } = require('express')
const router = Router()
const cartController = require('../controllers/cartController')
const authMiddleware = require('../middlewares/auth')

router.get('/', authMiddleware, cartController.getAllCart)
router.post('/', authMiddleware, cartController.addToCart)
router.put('/:id', authMiddleware, cartController.updateCart)
router.delete('/:id', authMiddleware, cartController.deleteCart)

module.exports = router