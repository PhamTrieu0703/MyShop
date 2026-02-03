import express from 'express'
import {createOrder,getAllOrder,getOrdersByUser,updateOrderStatus,deleteOrdersById} from '../controllers/orderController.js'

const router = express.Router()

// tạo đơn hàng
router.post('/:userId', createOrder)

// lấy đơn hàng theo user
router.get('/:userId', getOrdersByUser)

// lấy chi tiết đơn hàng
router.get('/', getAllOrder)

// cập nhật trạng thái (admin)
router.put('/:id/status', updateOrderStatus)

router.delete('/:id', deleteOrdersById)

export default router