import { Schema, model } from 'mongoose'

const ProductSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    mainImgUrl: { type: String, required: true },
    imagesUrls: [String],
    specs: [{ type: Schema.Types.ObjectId, ref: 'Spec' }],
    modifications: [{ type: Schema.Types.ObjectId, ref: 'Modification' }],
    price: { type: Number, required: true, default: 0, min: 0 },
    discount: { type: Number, default: 0 },
    countInStock: { type: Number, required: true, min: 0 },
    isFeatured: { type: Boolean, default: false },
    forWhom: { type: String, required: true },
  },
  {
    timestamps: true,
  },
)

ProductSchema.virtual('id').get(function () {
  return (this.title as string).toLowerCase().split(' ').join('-')
})

ProductSchema.set('toJSON', {
  virtuals: true,
})

export default model('Product', ProductSchema)
