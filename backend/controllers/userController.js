 //Exclusivo para operaciones sobre usuarios ya registrados
import asyncHandler from 'express-async-handler'
import User from '../models/User.js'

//Retorna data de usuario en sesion
const getUserProfile = asyncHandler(async (req, res) => {
  const user = req.user

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin
    })
  } else {
    res.status(404)
    throw new Error('Usuario no encontrado')
  }
})

// Listar todos los usuarios (admin)
const getUsers = asyncHandler(async(req,res) =>{
  const users = await User.find({});
  res.json(users)
})


// Eliminar usuario (admin)
const deleteUser = asyncHandler(async(req,res) =>{
  const user = await User.findById(req.params.id);
  if(user){
    await user.remove()
    res.json({message: 'Usuario eliminado'})
  }else{
    res.status(404)
    throw new Error('Usuario no encontrado')
  }

})

// Actualizar usuario (admin)
const updateUser = asyncHandler(async(req,res) =>{
  const user = await User.findById(req.params.id)
  if(user){
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email

   if (req.body.isAdmin !== undefined) {
      user.isAdmin = req.body.isAdmin
    }
    const updatedUser = await user.save()
    res.json(updatedUser)

  }else{
    res.status(404)
    throw new Error("No se encontro el usuario")
  }
})


export { getUserProfile, getUsers, deleteUser, updateUser }
