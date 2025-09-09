// backend/routes/orderRoutes.js
import express from "express";
import { proteger } from "../middleware/authMiddleware.js";
import { esAdmin } from "../middleware/adminMiddleware.js";
import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";
import Product from "../models/Product.js";


const router = express.Router();

// Crear una orden
router.post("/", proteger, asyncHandler(async (req, res) => {
    const { items, total } = req.body;

    if (!items || items.length === 0) {
      res.status(400);
      throw new Error("No hay productos en la orden");
    }

    // Validar stock y preparar items
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item._id);
      if (!product) {
        res.status(404);
        throw new Error(`Producto ${item.name} no encontrado`);
      }
      if (product.stock < item.quantity) {
        res.status(400);
        throw new Error(`No hay suficiente stock de ${item.name}`);
      }

      // Restar stock
      product.stock -= item.quantity;
      await product.save();

      orderItems.push({
        productId: product._id,
        name: product.name,
        quantity: item.quantity,
        price: item.price,
      });
    }

    const order = new Order({
      user: req.user._id,
      items: orderItems,
      total,
      status: "Pendiente",
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  })
);


// Ver ordenes propias
router.get("/myorders", proteger, asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  })
);


// Ver detalle de una orden propia
router.get("/:id", proteger, asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) {
      res.status(404);
      throw new Error("Orden no encontrada");
    }

    // Solo el dueño puede verla (y admin opcional)
    if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      res.status(403);
      throw new Error("No autorizado a ver esta orden");
    }

    res.json(order);
  })
);



// Admin: obtener todas las órdenes
router.get("/", proteger, esAdmin, asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });
  res.json(orders);
}));



// Actualizar estado de una orden (solo admin)
router.patch("/:id", proteger, esAdmin, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Orden no encontrada");
  }

  order.status = req.body.status || order.status;
  const updatedOrder = await order.save();

  res.json(updatedOrder);
}));

export default router;
