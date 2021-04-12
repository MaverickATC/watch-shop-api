import {Request, Response} from 'express'

//models
import Modification from '../models/modification'

export const getAllModifications = async (req: Request, res: Response) => {
  try {
    const modificationsList = await Modification.find()
    return res.status(200).send(modificationsList)
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' })
    
  }
}
