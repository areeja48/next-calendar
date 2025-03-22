import mongoose, { Schema, Document, models } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  date: string;
  userEmail: string;
  startTime?: string;
  endTime?: string;
  isAllDay?: boolean;
}

const EventSchema = new Schema<IEvent>({
  title: { type: String, required: true },
  date: { type: String, required: true },
  userEmail: { type: String, required: true },
  startTime: { type: String }, // ✅ NEW
  endTime: { type: String },   // ✅ NEW,
  isAllDay: { type: Boolean, default: false },
});

export default models.Event || mongoose.model<IEvent>('Event', EventSchema);
