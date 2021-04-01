import { Request, Response } from 'express'

//models
import User from '../models/user'

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const usersList = await User.find()
    res.status(200).send(usersList)
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}
