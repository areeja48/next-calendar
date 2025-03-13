// /app/api/events/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/models/eventmodel";

// Handle GET and POST in one file
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const events = await Event.find().sort({ date: 1 });
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ message: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { title, date, time } = await req.json();

    const newEvent = new Event({ title, date, time });
    await newEvent.save();

    return NextResponse.json({ message: "Event created successfully", event: newEvent }, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json({ message: "Failed to create event" }, { status: 500 });
  }
}
