import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

//models
import User from '../models/user'

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const usersList = await User.find().select(['-orders', '-featuredProducts', '-cart', '-shippingAddresses'])
    return res.status(200).send(usersList)
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' })
  }
}

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).populate('orders').populate('featuredProducts')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.status(200).send(user)

  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' })
  }
}

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await User.create({
      ...req.body,
      password: bcrypt.hashSync(req.body.password, 10),
    })

    return res.status(201).json({ message: 'User created' })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Enter email & password' })
    }

    const user = await User.findOne({ email }).select('+password')

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const isPasswordMatch = await user.comparePassword(password)

    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const token = user.getJwtToken()
    const options = {
      expires: new Date(
        Date.now() +
        parseInt(process.env.COOKIE_EXPIRES_TIME as string) *
        24 *
        60 *
        60 *
        1000,
      ),
      httpOnly: true,
    }
    return res.status(200).cookie('AuthenticationToken', token, options).json(user)
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' })
  }
}

export const logoutUser = async (req: Request, res: Response) => {
  res.cookie('AuthenticationToken', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  })
  return res.status(200).json({ message: 'Logged out' })
}

export const forgotPasswordUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
      return res.status(404).json({ message: 'User with this email not found' })
    }

    const resetToken = user.getResetPasswordToken()
    //TODO: send email with link
    await user.save({ validateBeforeSave: false })
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' })
  }
}

export const resetPasswordUser = async (req: Request, res: Response) => {
  try {
    const hashed = crypto.createHash('sha256').update(req.params.resetToken).digest('hex')
    const user = await User.findOne({
      resetPasswordToken: hashed,
    }).select(['+password', '+resetPasswordExpire'])
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (!user.checkResetPasswordToken()) {
      return res.status(400).json({ message: 'Your reset link is expired' })
    }

    user.password = bcrypt.hashSync(req.body.password, 10)

    await user.save()
    return res.status(200).json({ message: 'New password created, go ahead and sign in' })

  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' })
  }
}

export const changePasswordUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('+password')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const isPasswordMatch = await user.comparePassword(req.body.oldPassword)

    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid password' })
    }

    if (req.body.newPassword !== req.body.confirmNewPassword) {
      return res.status(401).json({
        message: 'Passwords didn\'t match',
      })
    }

    user.password = bcrypt.hashSync(req.body.newPassword, 10)

    await user.save({ validateBeforeSave: false })
    return res.status(200).json({ message: 'Password successfully changed' })

  } catch
    (error) {
    return res.status(500).json({ message: 'Something went wrong' })
  }
}

export const suspendUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    user.suspended = true
    await user.save()
    return res.status(200).json({ message: 'User was suspended' })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const activateUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    user.suspended = false
    await user.save()
    return res.status(200).json({ message: 'User was activated' })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    if (!user.suspended) {
      return res.status(405).json({ message: 'User should be suspended first' })
    }
    await user.remove()
    return res.status(200).json({ message: 'User was deleted' })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
