import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import Admin, { IAdmin } from '../models/admin'

//interfaces
interface IDecodedToken {
  id: string
}

export interface IRequestWithAdmin extends Request {
  admin?: IAdmin
}

export const validateAdmin = async (
  req: IRequestWithAdmin,
  res: Response,
  next: NextFunction,
) => {
  const { AuthToken } = req.cookies
  if (!AuthToken) {
    return res.status(401).json({ message: 'No auth token provided' })
  }

  const decoded = jwt.verify(AuthToken, process.env.JWT_SECRET as string)

  const admin = await Admin.findById((decoded as IDecodedToken).id)

  if (!admin) {
    return res.status(404).json({ message: 'Admin with this id not found' })
  }

  req.admin = admin

  next()
}

export const validateAdminRole = (...roles: string[]) => {
  return async (req: IRequestWithAdmin, res: Response, next: NextFunction) => {
    if (!roles.includes((req.admin as IAdmin).role)) {
      return res
        .status(403)
        .json({ message: 'You don\'t have access to this page' })
    }
    next()
  }
}
