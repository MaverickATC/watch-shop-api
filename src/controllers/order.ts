import { Request, Response } from 'express'

//models
import Order from '../models/order'

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const ordersList = await Order.find()
      .populate('productId')
      .populate('modifications')
    return res.status(200).send(ordersList)
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' })
  }
}
