import { Schema, model, Types, Document } from 'mongoose'

//interfaces
export interface ISpec extends Document {
  name: string
}

const SpecSchema = new Schema(
  {
    name: { type: String, required: true },
  },
)

export default model('Spec', SpecSchema)
