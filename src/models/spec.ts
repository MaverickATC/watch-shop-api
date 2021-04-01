import { Schema, model } from 'mongoose'

const SpecSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
  },
)

export default model('Spec', SpecSchema)
