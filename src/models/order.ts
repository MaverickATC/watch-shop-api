import { Schema, model, Document } from 'mongoose'

//interfaces
import { IModification } from './modification'
import { IProduct } from './product'

interface IBuyer {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
}

interface IOrderProduct {
  productId: IProduct['_id']
  modifications?: IModification[],
  quantity: number
  price: number
}

export interface IOrder extends Document {
  buyer: IBuyer
  products: IOrderProduct[]
  discount: number
  status: string
}

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
        price: {
          type: Number,
          required: true,
          min: [0, 'Price can not be less then 0.'],
        }
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
