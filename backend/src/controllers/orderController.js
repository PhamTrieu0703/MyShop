import orderModel from "../models/orderModel.js"
import cartModel from "../models/cartModel.js"
/**
 * Tạo đơn hàng
 */

// orders.controller.js
export const createOrder = async (req, res) => {
  try {
    const { userId } = req.params
    const { items, totalAmount, paymentMethod } = req.body

    // 1. Tạo đơn hàng
    const order = await orderModel.create({
      userId,
      items,
      totalAmount,
      paymentMethod,
      status: 'pending'
    })

    // 2. ✅ CLEAR CART
    await cartModel.findOneAndUpdate(
      { userId },
      { items: [] }
    )

    res.status(201).json({
      message: 'Đặt hàng thành công',
      order
    })
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi server',
      error: error.message
    })
  }
}



/**
 * Lấy đơn hàng theo user
 */
export const getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params

    const orders = await orderModel.find({ userId }).sort({ createdAt: -1 })

    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' })
  }
}


export const getAllOrder = async (req, res) => {
  try {
    const orders = await orderModel
      .find()
      .populate("userId", "username email fullName")
      .populate("items.productId", "name price image")
      .sort({ createdAt: -1 });

    // ✅ Map lại items cho frontend dùng trực tiếp
    const formattedOrders = orders.map(order => ({
      _id: order._id,
      userId: order.userId,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      status: order.status,
      createdAt: order.createdAt,
      items: order.items.map(item => ({
        productId: item.productId?._id,
        name: item.productId?.name,
        price: item.productId?.price,
        image: item.productId?.image,
        quantity: item.quantity
      }))
    }));

    res.status(200).json(formattedOrders);
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};


/**
 * Admin cập nhật trạng thái đơn hàng
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const order = await orderModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )

    res.json({
      message: 'Cập nhật trạng thái thành công',
      order
    })
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' })
  }
}

export const deleteOrdersById = async (req, res) => {
  try {
    const { id } = req.params

    const order = await orderModel.findByIdAndDelete(id)

    if (!order) {
      return res.status(404).json({
        message: 'Không tìm thấy đơn hàng'
      })
    }

    res.status(200).json({
      message: 'Xóa đơn hàng thành công',
      order
    })
  } catch (error) {
    console.error('Delete order error:', error)
    res.status(500).json({
      message: 'Lỗi server'
    })
  }
}
