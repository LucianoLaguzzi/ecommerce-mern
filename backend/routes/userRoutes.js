import express from 'express'
import { getUserProfile } from '../controllers/userController.js'
import { proteger } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/profile', proteger, getUserProfile)

export default router
