import Order from "../../models/Order.js";
import Cart from "../../models/Cart.js";
import Product from "../../models/Product.js";

const createOrder = async (req, res) => {
  try {
    const { userId, cartItems, addressInfo, orderStatus, paymentMethod, paymentStatus, totalAmount, orderDate, orderUpdateDate, cartId } = req.body;

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid total amount" });
    }

    for (let item of cartItems) {
      const product = await Product.findById(item.productId);
      if (!product || product.totalStock < item.quantity) {
        return res.status(400).json({ success: false, message: `Not enough stock for product: ${item.title}` });
      }
    }

    const newOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus: "confirmed",
      paymentMethod,
      paymentStatus: "paid",
      totalAmount,
      orderDate,
      orderUpdateDate,
    });

    for (let item of cartItems) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { totalStock: -item.quantity } });
    }

    if (cartId) {
      await Cart.findByIdAndDelete(cartId);
    }

    await newOrder.save();

    res.status(201).json({ success: true, message: "Order created successfully", orderId: newOrder._id });
  } catch (e) {
    console.error("Server Error:", e);
    res.status(500).json({ success: false, message: "Server error occurred", error: e.message });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({ success: false, message: "No orders found!" });
    }

    res.status(200).json({ success: true, data: orders });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Some error occurred!" });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found!" });
    }

    res.status(200).json({ success: true, data: order });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Some error occurred!" });
  }
};


export { createOrder, getAllOrdersByUser, getOrderDetails }