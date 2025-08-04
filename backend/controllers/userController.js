import asyncHandler from 'express-async-handler'

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

export { getUserProfile }
