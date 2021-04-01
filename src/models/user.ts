import { Schema, model } from 'mongoose'

const UserSchema = new Schema(
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
    password: { type: String, required: true },
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
        productID: { type: Schema.Types.ObjectId, ref: 'Products' },
        modifications: [{ type: Schema.Types.ObjectId, ref: 'Modification' }],
        quantity: {
          type: Number,
          min: [1, 'Quantity can not be less then 1.'],
          deafult: 1,
        },
      },
    ],
    orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
  },
  {
    timestamps: true,
  },
)

export default model('User', UserSchema)
