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
import upload from '../middleware/upload.js'

const router = express.Router()

// Público
router.get('/', getProducts)
router.get('/:id', getProductById)

// Admin
router.post('/', proteger, esAdmin, upload.single("image"), createProduct) //subida de imagen a Cloudinary
router.put('/:id', proteger, esAdmin, upload.single("image"), updateProduct)
router.delete('/:id', proteger, esAdmin, deleteProduct)

export default router
