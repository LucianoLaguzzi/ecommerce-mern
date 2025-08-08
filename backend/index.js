import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import conectarDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import productRoutes from './routes/productRoutes.js'

dotenv.config()

const app = express()

// Conectar a MongoDB
conectarDB()

// Middleware para parsear JSON (muy importante)
app.use(express.json())


// Middleware CORS para permitir conexión desde frontend
app.use(cors({
  origin: 'http://localhost:5173' // dirección del frontend
}))

// Rutas
app.use('/api/auth', authRoutes)  //registrar nuevo, loguear usuario (con el token para la sesion) 
app.use('/api/users', userRoutes) //mostrar usaurios
app.use('/api/products', productRoutes)




// Ruta básica de prueba
app.get('/', (req, res) => {
  res.send('API corriendo...')
})



// Escuchar en el puerto
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})