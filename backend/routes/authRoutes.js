//Exclusivo para login y registro
import express from 'express'
import { registerUser, loginUser, forgotPassword } from '../controllers/authController.js'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.put("/forgot-password", forgotPassword);


export default router
