import mongoose, { Schema, Document, models } from 'mongoose';

export interface IContact extends Document {
  displayName: string;
  emailAddress: string;
  googleId: string; 
  createdAt?: Date;
  updatedAt?: Date;
}

const ContactSchema = new Schema<IContact>({
  displayName: { type: String, required: true },
  emailAddress: { type: String, required: true },
  googleId: { type: String, required: true, unique: true }, 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default models.Contact || mongoose.model<IContact>('Contact', ContactSchema);
