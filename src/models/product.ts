import { Schema, model, Document, Model, Types } from 'mongoose'

//interfaces
import { ISpec } from '../models/spec'
import { IModification } from '../models/modification'
import { IAdmin } from './admin'

export interface IProduct extends Document {
  name: string
  slug?: string
  description: string
  mainImgUrl: string
  imagesUrls?: Array<string>
  specs?: {
    spec: ISpec['_id']
    value: string
  }[]
  modifications?: IModification[]
  price: number
  discount?: number
  countInStock?: number
  isFeatured?: boolean
  forWhom: string
  bonuses?: number
  archived?: boolean
  changers?: {
    admin: IAdmin['_id']
    date: Date
    message: string
  }[]
  //here add all model virtuals and methods
}

// export interface IProductModel extends Model<IProduct> {
//   //here add all model statics
// }

const ProductSchema = new Schema<IProduct, Model<IProduct>>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    mainImgUrl: { type: String, required: true },
    imagesUrls: [String],
    specs: [
      {
        spec: { type: Types.ObjectId, ref: 'Spec' },
        value: { type: String },
      },
    ],
    modifications: [{ type: Types.ObjectId, ref: 'Modification' }],
    price: { type: Number, required: true, default: 0, min: 0 },
    discount: { type: Number, default: 0 },
    countInStock: { type: Number, min: 0, default: 0 },
    isFeatured: { type: Boolean, default: false },
    forWhom: { type: String, required: true },
    bonuses: {
      type: Number,
      min: [0, 'Amount of bonuses can not be less then 0'],
      default: 0,
    },
    archived: {type: Boolean, default: false},
    changers: [
      {
        admin: { type: Types.ObjectId, ref: 'Admin', required: true },
        date: { type: Date, required: true },
        message: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  },
)

//middleware
ProductSchema.pre<IProduct>('save', async function () {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().split(' ').join('-')
  }
})

//methods
ProductSchema.methods.getSlug = function (this: IProduct) {
  return this.slug
}

//virtuals
ProductSchema.virtual('id').get(function (this: IProduct) {
  return this._id as string
})

ProductSchema.set('toJSON', {
  virtuals: true,
})

export default model('Product', ProductSchema)
