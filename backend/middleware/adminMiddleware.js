const esAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(403)
    throw new Error('Acceso denegado, solo administradores')
  }
}

export { esAdmin }
