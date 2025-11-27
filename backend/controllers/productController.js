import Product from '../models/Product.js'
import asyncHandler from 'express-async-handler'
import cloudinary from '../config/cloudinary.js'
import mongoose from "mongoose";

// helper para subir a Cloudinary con buffer (stream)
const streamUpload = (buffer, folder = "ecommerce") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (result) resolve(result)
        else reject(error)
      }
    )
    stream.end(buffer)
  })
}

// helper para borrar de Cloudinary usando la URL
const deleteFromCloudinary = async (imageUrl) => {
  if (!imageUrl) return
  try {
    const publicId = imageUrl.split('/').slice(-2).join('/').split('.')[0] 
    await cloudinary.uploader.destroy(publicId)
    console.log(`Imagen eliminada en Cloudinary`)
  } catch (error) {
    console.error("Error eliminando imagen de Cloudinary:", error)
  }
}

// GET /api/products (público) con paginación
const getProducts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 6
  const skip = (page - 1) * limit

  const total = await Product.countDocuments()
  const products = await Product.find().skip(skip).limit(limit).sort({ createdAt: -1 })

  res.json({
    products,
    page,
    totalPages: Math.ceil(total / limit),
    total
  })
})

// GET /api/products/:id (público)
const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.warn(`ID inválido recibido: ${id}`); // logeo más limpio
    return res.status(404).json({ message: "Producto no encontrado" });
  }

  const product = await Product.findById(id);

  if (!product) {
    console.warn(`Producto no encontrado: ${id}`);
    return res.status(404).json({ message: "Producto no encontrado" });
  }

  res.json(product);
});

// POST /api/products (admin)
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, stock } = req.body

  if (!name || !description || !price || !stock) {
    res.status(400)
    throw new Error('Todos los campos son obligatorios')
  }

  let imageUrl = ""
  if (req.file) {
    const uploadResult = await streamUpload(req.file.buffer, "ecommerce")
    imageUrl = uploadResult.secure_url
  }

  const product = new Product({ name, description, price, stock, image: imageUrl })
  const createdProduct = await product.save()
  res.status(201).json(createdProduct)
})

// PUT /api/products/:id (admin)
const updateProduct = asyncHandler(async (req, res) => {
  const { name, description, price, stock } = req.body
  const product = await Product.findById(req.params.id)
  if (!product) { res.status(404); throw new Error('Producto no encontrado') }

  product.name = name || product.name
  product.description = description || product.description
  product.price = price || product.price
  product.stock = stock || product.stock

  if (req.file) {
    if (product.image) await deleteFromCloudinary(product.image)
    const uploadResult = await streamUpload(req.file.buffer, "ecommerce")
    product.image = uploadResult.secure_url
  }

  const updated = await product.save()
  res.json(updated)
})

// DELETE /api/products/:id (admin)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product) { res.status(404); throw new Error('Producto no encontrado') }

  if (product.image) await deleteFromCloudinary(product.image)
  await product.deleteOne()
  res.json({ message: 'Producto eliminado' })
})

export { getProducts, getProductById, createProduct, updateProduct, deleteProduct }
