import mongoose, { Schema, Document, models } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  date: string;
  userEmail: string;
  startTime?: string;
  endTime?: string;
}

const EventSchema = new Schema<IEvent>({
  title: { type: String, required: true },
  date: { type: String, required: true },
  userEmail: { type: String, required: true },
  startTime: { type: String }, // ✅ NEW
  endTime: { type: String },   // ✅ NEW
});

export default models.Event || mongoose.model<IEvent>('Event', EventSchema);
