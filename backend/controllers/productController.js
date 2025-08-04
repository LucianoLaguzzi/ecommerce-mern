import Product from '../models/Product.js'
import asyncHandler from 'express-async-handler'

// GET /api/products (público)
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find()
  res.json(products)
})

// GET /api/products/:id (público)
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (product) {
    res.json(product)
  } else {
    res.status(404)
    throw new Error('Producto no encontrado')
  }
})

// POST /api/products (admin)
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, stock, image } = req.body

  const product = new Product({ name, description, price, stock, image })

  const createdProduct = await product.save()
  res.status(201).json(createdProduct)
})

// PUT /api/products/:id (admin)
const updateProduct = asyncHandler(async (req, res) => {
  const { name, description, price, stock, image } = req.body

  const product = await Product.findById(req.params.id)

  if (product) {
    product.name = name || product.name
    product.description = description || product.description
    product.price = price || product.price
    product.stock = stock || product.stock
    product.image = image || product.image

    const updated = await product.save()
    res.json(updated)
  } else {
    res.status(404)
    throw new Error('Producto no encontrado')
  }
})

// DELETE /api/products/:id (admin)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (product) {
    await product.remove()
    res.json({ message: 'Producto eliminado' })
  } else {
    res.status(404)
    throw new Error('Producto no encontrado')
  }
})

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
}
