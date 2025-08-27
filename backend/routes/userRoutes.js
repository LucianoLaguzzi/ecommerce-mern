 //Exclusivo para operaciones sobre usuarios ya registrados
import express from 'express'
import { getUserProfile, getUsers, deleteUser, updateUser,updateUserProfile } from '../controllers/userController.js'
import { proteger } from '../middleware/authMiddleware.js'
import { esAdmin } from '../middleware/adminMiddleware.js'

const router = express.Router()

// Perfil propio
router.get('/profile', proteger, getUserProfile) //Obtener los datos del perfil logueado
router.put('/profile', proteger, updateUserProfile)


// Admin: gestión de usuarios
router.get('/', proteger, esAdmin, getUsers)
router.delete('/:id', proteger, esAdmin, deleteUser)
router.put('/:id', proteger, esAdmin, updateUser)





export default router
