import { Request, Response } from 'express'

//models
import Spec from '../models/spec'

export const getAllSpecs = async (req: Request, res: Response) => {
  try {
    const specsList = await Spec.find()
    res.status(200).send(specsList)
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}
