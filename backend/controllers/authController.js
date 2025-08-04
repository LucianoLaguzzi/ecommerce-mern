import User from '../models/User.js'
import jwt from 'jsonwebtoken'

const generarToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  })
}

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body

  const userExistente = await User.findOne({ email })
  if (userExistente) {
    return res.status(400).json({ message: 'El usuario ya existe' })
  }

  const nuevoUsuario = await User.create({ name, email, password })

  res.status(201).json({
    _id: nuevoUsuario._id,
    name: nuevoUsuario.name,
    email: nuevoUsuario.email,
    isAdmin: nuevoUsuario.isAdmin,
    token: generarToken(nuevoUsuario._id)
  })
}

export const loginUser = async (req, res) => {
  const { email, password } = req.body

  const usuario = await User.findOne({ email })

  if (usuario && await usuario.comparePassword(password)) {
    res.json({
      _id: usuario._id,
      name: usuario.name,
      email: usuario.email,
      isAdmin: usuario.isAdmin,
      token: generarToken(usuario._id)
    })
  } else {
    res.status(401).json({ message: 'Credenciales inválidas' })
  }
}
