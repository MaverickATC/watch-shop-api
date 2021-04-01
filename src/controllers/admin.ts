import { Request, Response } from 'express'

//models
import Admin from '../models/admin'

export const getAllAdmins = async (req: Request, res: Response) => {
  try {
    const adminsList = await Admin.find()
    res.status(200).send(adminsList)
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}
