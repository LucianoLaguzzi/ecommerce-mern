import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import conectarDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import productRoutes from './routes/productRoutes.js'
import orderRoutes from './routes/orderRoutes.js';

dotenv.config()

const app = express()

// Conectar a MongoDB
conectarDB()

// Middleware para parsear JSON (muy importante)
app.use(express.json())


// Middleware CORS para permitir conexión desde frontend
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL
]

app.use(cors({
  origin: function (origin, callback) {
    // Permite requests sin origin (Postman, health checks, etc.)
    if (!origin) return callback(null, true)

    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))

// Rutas
app.use('/api/auth', authRoutes)  //registrar nuevo, loguear usuario (con el token para la sesion) 
app.use('/api/users', userRoutes) //mostrar usaurios
app.use('/api/products', productRoutes)

app.use('/api/orders', orderRoutes);



// Ruta básica de prueba
app.get('/', (req, res) => {
  res.send('API corriendo...')
})



// Escuchar en el puerto
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})