import express from 'express'
import dotenv from 'dotenv'
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


// Rutas
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
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