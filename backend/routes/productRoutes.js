import express from 'express'
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js'
import { proteger } from '../middleware/authMiddleware.js'
import { esAdmin } from '../middleware/adminMiddleware.js'

const router = express.Router()

// Público
router.get('/', getProducts)
router.get('/:id', getProductById)

// Admin
router.post('/', proteger, esAdmin, createProduct)
router.put('/:id', proteger, esAdmin, updateProduct)
router.delete('/:id', proteger, esAdmin, deleteProduct)

export default router
