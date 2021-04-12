import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

//models
import Admin from '../models/admin'

export const getAllAdmins = async (req: Request, res: Response) => {
  try {
    const adminsList = await Admin.find()
    return res.status(200).send(adminsList)
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' })
  }
}

export const createAdmin = async (req: Request, res: Response) => {
  try {
    const admin = await Admin.create({
      ...req.body,
      password: bcrypt.hashSync(req.body.password, 10),
    })

    return res.status(201).json({
      id: admin._id,
      email: admin.email,
      firstName: admin.firstName,
      lastName: admin.lastName,
      role: admin.role,
    })
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' })
  }
}

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Enter email & password' })
    }

    const admin = await Admin.findOne({ email }).select('+password')

    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const isPasswordMatch = await admin.comparePassword(password)

    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const token = admin.getJwtToken()
    const options = {
      expires: new Date(
        Date.now() +
        parseInt(process.env.ADMIN_COOKIE_EXPIRES_TIME as string) *
        24 *
        60 *
        60 *
        1000,
      ),
      httpOnly: true,
    }
    return res.status(200).cookie('AuthToken', token, options).json({
      id: admin._id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      role: admin.role,
    })
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' })
  }
}

export const logoutAdmin = async (req: Request, res: Response) => {
  res.cookie('AuthToken', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  })
  return res.status(200).json({ message: 'Logged out' })
}

export const forgotPasswordAdmin = async (req: Request, res: Response) => {
  try {
    const admin = await Admin.findOne({ email: req.body.email })

    if (!admin) {
      return res.status(404).json({ message: 'User with this email not found' })
    }

    const resetToken = admin.getResetPasswordToken()
    //TODO: send email with link
    await admin.save({ validateBeforeSave: false })
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' })
  }
}

export const resetPasswordAdmin = async (req: Request, res: Response) => {
  try {
    const hashed = crypto.createHash('sha256').update(req.params.resetToken).digest('hex')
    const admin = await Admin.findOne({
      resetPasswordToken: hashed,
    }).select(['+password', '+resetPasswordExpire'])
    if (!admin) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (!admin.checkResetPasswordToken()) {
      return res.status(400).json({ message: 'Your reset link is expired' })
    }

    admin.password = bcrypt.hashSync(req.body.password, 10)

    await admin.save()
    return res.status(200).json({ message: 'New password created' })

  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' })
  }
}

export const changePasswordAdmin = async (req: Request, res: Response) => {
  try {
    const admin = await Admin.findById(req.params.id)

    if (!admin) {
      return res.status(404).json({ message: 'User not found' })
    }

    const isPasswordMatch = await admin.comparePassword(req.body.oldPassword)

    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid password' })
    }

    if (req.body.newPassword !== req.body.confirmNewPassword) {
      return res.status(401).json({
        message: 'Passwords didn\'t match',
      })
    }

    admin.password = bcrypt.hashSync(req.body.newPassword, 10)

    await admin.save({ validateBeforeSave: false })
    return res.status(200).json({ message: 'Password successfully changed' })

  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' })
  }
}

export const suspendAdmin = async (req: Request, res: Response) => {
  try {
    const admin = await Admin.findById(req.params.id)
    if (!admin) {
      return res.status(404).json({ message: 'User not found' })
    }
    admin.suspended = true
    await admin.save()
    return res.status(200).json({ message: 'User was suspended' })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const activateAdmin = async (req: Request, res: Response) => {
  try {
    const admin = await Admin.findById(req.params.id)
    if (!admin) {
      return res.status(404).json({ message: 'User not found' })
    }
    admin.suspended = false
    await admin.save()
    return res.status(200).json({ message: 'User was activated' })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const deleteAdmin = async (req: Request, res: Response) => {
  try {
    const admin = await Admin.findById(req.params.id)
    if (!admin) {
      return res.status(404).json({ message: 'User not found' })
    }
    if (!admin.suspended) {
      return res.status(405).json({ message: 'User should be suspended first' })
    }
    await admin.remove()
    return res.status(200).json({ message: 'User was deleted' })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}