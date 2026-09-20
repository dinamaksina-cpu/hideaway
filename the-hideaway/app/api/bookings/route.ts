import { NextResponse } from "next/server";
import { createBookingRequest } from "@/db/bookings";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const checkIn = typeof body.checkIn === "string" ? body.checkIn : "";
    const checkOut = typeof body.checkOut === "string" ? body.checkOut : "";
    const guests = Number(body.guests);

    if (!name || name.length > 120 || !/^\S+@\S+\.\S+$/.test(email) || email.length > 180) {
      return NextResponse.json({ error: "Please enter a valid name and email." }, { status: 400 });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(checkIn) || !/^\d{4}-\d{2}-\d{2}$/.test(checkOut) || checkOut <= checkIn) {
      return NextResponse.json({ error: "Please choose a valid check-in and check-out date." }, { status: 400 });
    }
    if (!Number.isInteger(guests) || guests < 1 || guests > 5) {
      return NextResponse.json({ error: "The Hideaway accommodates 1 to 5 guests." }, { status: 400 });
    }
    const nights = Math.round((Date.parse(`${checkOut}T00:00:00Z`) - Date.parse(`${checkIn}T00:00:00Z`)) / 86_400_000);
    if (nights < 1) {
      return NextResponse.json({ error: "Please choose a stay of at least one night." }, { status: 400 });
    }

    const reference = `TH-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    await createBookingRequest({
      id: crypto.randomUUID(), reference, name, email,
      phone: phone.slice(0, 60), message: message.slice(0, 1000),
      checkIn, checkOut, guests, total: 0,
    });
    return NextResponse.json({ reference }, { status: 201 });
  } catch (error) {
    console.error("Booking request failed", error);
    return NextResponse.json({ error: "Booking requests are temporarily unavailable. Please try again." }, { status: 503 });
  }
}
