const { Router } = require('express')
const router = Router()
const orderController = require('../controllers/orderController')
const authMiddleware = require('../middlewares/auth')
const isAdmin = require('../middlewares/isAdmin')

router.post('/checkout', authMiddleware, orderController.checkOut)
router.get('/', authMiddleware, orderController.getMyOrders)
router.get('/all', authMiddleware, isAdmin, orderController.getAllOrders)
router.post('/webhook', orderController.handleWebhook)
router.get('/:id', authMiddleware, orderController.getOrderById)
router.put('/:id', authMiddleware, isAdmin, orderController.updateOrderStatus)

module.exports = router