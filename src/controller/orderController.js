import { Order } from "../model/orderModel.js";

// Place Order
export const placeOrder = async (req, res) => {
  const { shippingAddress, paymentStatus, razorpayIds } = req.body;

  const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");

  if (!cart || cart.items.length === 0)
    return res.status(400).json({ message: "Cart is empty" });

  const products = cart.items.map(item => ({
    product: item.product._id,
    quantity: item.quantity,
    priceAtPurchase: item.product.price,
  }));

  const totalAmount = cart.items.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  );

  const order = await Order.create({
    user: req.user.id,
    products,
    shippingAddress,
    totalAmount,
    paymentStatus,
    ...razorpayIds
  });

  await Cart.deleteOne({ user: req.user.id });

  res.json({ success: true, order });
};

// Get my orders
export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json({ success: true, orders });
};
