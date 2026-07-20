    const express = require('express')
    const router = express.Router()
    const { getAllAddress, createAddress, updateAddress, deleteAddress, setDefaultAddress } = require('../controllers/addressController')
    const authMiddleware = require('../middlewares/auth') 

    router.get('/', authMiddleware, getAllAddress)
    router.post('/', authMiddleware, createAddress)
    router.put('/:id', authMiddleware, updateAddress)
    router.delete('/:id', authMiddleware, deleteAddress)
    router.patch('/:id/default', authMiddleware, setDefaultAddress)

    module.exports = router