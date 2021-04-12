import { Schema, model, Document, Model } from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

//interfaces
import { IProduct } from './product'
import { IModification } from './modification'
import { IOrder } from './order'

interface IShippingAddress {
  address: string
  city: string
  postalCode: string
  apartment?: string
  state?: string
}

interface ICartItem {
  productID: IProduct['_id']
  modifications?: IModification['_id'][]
  quantity: number
}

export interface IUser extends Document {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  password: string
  shippingAddresses?: IShippingAddress[]
  featuredProducts?: IProduct['_id'][]
  cart: ICartItem[]
  orders?: IOrder['_id'][]
  suspended?: boolean
  resetPasswordToken?: string | null
  resetPasswordExpire?: number | null
  //here add all model virtuals and methods
  getJwtToken: () => string
  comparePassword: (inputPassword: string) => Promise<boolean>
  getResetPasswordToken: () => string
  checkResetPasswordToken: () => boolean
}

// interface IUserModel extends Model<IUser> {
//   //here add all model statics
// }

const UserSchema = new Schema<IUser, Model<IUser>>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
      type: String,
      required: [true, 'Please enter an email'],
      unique: true,
      lowercase: true,
    },
    phoneNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    shippingAddress: [
      {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        apartment: { type: String },
        state: { type: String },
      },
    ],
    featuredProducts: [{ type: Schema.Types.ObjectId, ref: 'Products' }],
    cart: [
      {
        productID: {
          type: Schema.Types.ObjectId,
          ref: 'Products',
          required: true,
        },
        modifications: [{ type: Schema.Types.ObjectId, ref: 'Modification' }],
        quantity: {
          type: Number,
          min: [1, 'Quantity can not be less then 1.'],
          deafult: 1,
        },
      },
    ],
    orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
    suspended: { type: Boolean, default: false },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpire: { type: Date, select: false },
  },
  {
    timestamps: true,
  },
)

//middleware
UserSchema.pre<IUser>('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10)
  }
  next()
})

//methods
UserSchema.methods.getJwtToken = function (this: IUser) {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRETIME,
  })
}

UserSchema.methods.comparePassword = async function (inputPassword: string) {
  return await bcrypt.compare(inputPassword, this.password)
}

UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex')

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

  this.resetPasswordExpire =
    Date.now() +
    parseInt(process.env.RESET_TOKEN_EXPIRES as string) * 24 * 60 * 60 * 1000

  return resetToken
}

UserSchema.methods.checkResetPasswordToken = function (this: IUser) {
  if ((this.resetPasswordExpire as number) < Date.now()) {
    this.resetPasswordToken = null
    this.resetPasswordExpire = null
    return false
  }
  return true
}

UserSchema.methods.comparePassword = async function (inputPassword: string) {
  return await bcrypt.compare(inputPassword, this.password)
}

export default model('User', UserSchema)
