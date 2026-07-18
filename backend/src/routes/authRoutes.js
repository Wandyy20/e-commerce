const {Router} = require('express')
const router = Router()
const authController = require('../controllers/authController')
const authMiddleware = require('../middlewares/auth')

router.post('/register', authController.registerPost)
router.post('/login', authController.loginPost)
router.get('/profile', authMiddleware, authController.getProfile)

module.exports = router