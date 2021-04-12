import { Schema, model, Document } from 'mongoose'

//interfaces
export interface IModification extends Document {
  name: string
  value: string
}

const ModificationSchema = new Schema(
  {
    name: { type: String, required: true },
    value: { type: String, required: true },
  },
  {
    timestamps: true,
  },
)

export default model('Modification', ModificationSchema)
