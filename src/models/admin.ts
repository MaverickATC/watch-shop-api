import { Schema, model, Document, Model } from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

//interfaces
export interface IAdmin extends Document {
  firstName: string
  lastName: string
  email: string
  password: string
  role: string
  suspended?: boolean
  resetPasswordToken?: string | null
  resetPasswordExpire?: number | null
  //here add all model virtuals and methods
  getJwtToken: () => string
  comparePassword: (inputPassword: string) => Promise<boolean>
  getResetPasswordToken: () => string
  checkResetPasswordToken: () => boolean
}

// export interface IAdminModel extends Model<IAdmin> {
//   //here add all model statics
// }

const AdminSchema = new Schema<IAdmin, Model<IAdmin>>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { type: String, required: true },
    suspended: { type: Boolean, default: false },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpire: { type: Date, select: false },
  },
  {
    timestamps: true,
  },
)

//middleware

//methods
AdminSchema.methods.getJwtToken = function(this: IAdmin) {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRETIME,
  })
}

AdminSchema.methods.comparePassword = async function(inputPassword: string) {
  return await bcrypt.compare(inputPassword, this.password)
}

AdminSchema.methods.getResetPasswordToken = function() {
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

AdminSchema.methods.checkResetPasswordToken = function(this: IAdmin) {
  if ((this.resetPasswordExpire as number) < Date.now()) {
    this.resetPasswordToken = null
    this.resetPasswordExpire = null
    return false
  }
  return true
}

//statics

export default model<IAdmin, Model<IAdmin>>('Admin', AdminSchema)
