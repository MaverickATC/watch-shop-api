import { Schema, model } from 'mongoose'

const OrderSchema = new Schema(
  {
    buyer: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: [true, 'Please enter an email'] },
      phoneNumber: { type: String, required: true },
    },
    products: [
      {
        productId: {
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
    discount: {
      type: Number,
      min: 0,
      deafult: 0,
    },
    status: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

export default model('Order', OrderSchema)
