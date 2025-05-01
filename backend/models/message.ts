import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  contactId: mongoose.Types.ObjectId;
  content: string;
  time: Date;
  incoming: boolean;
}

const MessageSchema: Schema = new Schema({
  contactId: { type: Schema.Types.ObjectId, ref: 'Contact', required: true },
  content: { type: String, required: true },
  time: { type: Date, default: Date.now },
  incoming: { type: Boolean, required: true },
});

export default mongoose.model<IMessage>('Message', MessageSchema);
