import mongoose from 'mongoose';

const orderItemSchema = mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
});

const orderSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    total: { type: Number, required: true },
    status: { type: String, default: 'Pendiente' }, // Pendiente, Completada, Cancelada
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
