// Exclusivo para login y registro
import User from '../models/User.js'
import jwt from 'jsonwebtoken'

const generarToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  })
}

export const registerUser = async (req, res) => {
  const { name, email, password, phone, address } = req.body;

  // Verificar email duplicado
  const usuarioExistente = await User.findOne({ email });
  if (usuarioExistente) {
    return res.status(400).json({ message: 'Ya existe un usuario con ese email' });
  }

  // Verificar nombre duplicado (opcional)
  const nombreExistente = await User.findOne({ name });
  if (nombreExistente) {
    return res.status(400).json({ message: 'Ya existe un usuario con ese nombre' });
  }

  const nuevoUsuario = await User.create({ name, email, password, phone, address });

  res.status(201).json({
    _id: nuevoUsuario._id,
    name: nuevoUsuario.name,
    email: nuevoUsuario.email,
    phone: nuevoUsuario.phone,
    address: nuevoUsuario.address,
    isAdmin: nuevoUsuario.isAdmin,
    createdAt: nuevoUsuario.createdAt,
    token: generarToken(nuevoUsuario._id),
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body

  const usuario = await User.findOne({ email })

  if (usuario && await usuario.comparePassword(password)) {
    res.json({
      _id: usuario._id,
      name: usuario.name,
      email: usuario.email,
      phone: usuario.phone,
      address: usuario.address,
      isAdmin: usuario.isAdmin,
      createdAt: usuario.createdAt,
      token: generarToken(usuario._id)
    })
  } else {
    res.status(401).json({ message: 'Credenciales inválidas' })
  }
}
