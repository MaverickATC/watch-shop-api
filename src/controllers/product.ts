import { Request, Response } from 'express'

//models
import Product from '../models/product'

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const productsList = await Product.find().populate('specs')
    res.status(200).send(productsList)
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}
