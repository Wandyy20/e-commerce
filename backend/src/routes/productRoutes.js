const {Router} = require('express')
const router = Router()
const productController = require('../controllers/productController')
const authMiddleware = require('../middlewares/auth')
const isAdmin = require('../middlewares/isAdmin')

router.get("/", productController.getAllProducts)
router.get("/:id", productController.getProductById)
router.post("/", authMiddleware, isAdmin, productController.createProduct)
router.put("/:id", authMiddleware, isAdmin, productController.updateProduct)
router.delete("/:id", authMiddleware, isAdmin, productController.deleteProduct)

module.exports = router