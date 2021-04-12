import { Request, Response } from 'express'

//models
import Spec from '../models/spec'

export const getAllSpecs = async (req: Request, res: Response) => {
  try {
    const specsList = await Spec.find()
    return res.status(200).json(specsList)
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' })
  }
}

export const createSpecs = async (req: Request, res: Response) => {
  try {
  const spec = await Spec.create({
    name: req.body.name
  })
    return res.status(201).json(spec)
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' })

  }
}

export const deleteSpec = async (req: Request, res: Response) => {

}