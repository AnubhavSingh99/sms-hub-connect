import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
  name: string;
  number: string;
  email?: string;
  lastContact?: Date;
  tags?: string[];
}

const ContactSchema: Schema = new Schema({
  name: { type: String, required: true },
  number: { type: String, required: true },
  email: { type: String },
  lastContact: { type: Date },
  tags: [{ type: String }],
});

export default mongoose.model<IContact>('Contact', ContactSchema);
