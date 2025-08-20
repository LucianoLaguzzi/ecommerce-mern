import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';

// Crear nueva orden
const createOrder = asyncHandler(async (req, res) => {
  const { items, total } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('El carrito está vacío');
  }

  const order = await Order.create({
    user: req.user._id,
    items,
    total
  });

  res.status(201).json(order);
});

// Obtener órdenes del usuario logueado
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// Admin: obtener todas las órdenes
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
  res.json(orders);
});

export { createOrder, getMyOrders, getOrders };
