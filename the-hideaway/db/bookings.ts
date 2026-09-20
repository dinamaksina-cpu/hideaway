import { env } from "cloudflare:workers";

type BookingRequest = {
  id: string;
  reference: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  total: number;
};

export async function createBookingRequest(booking: BookingRequest) {
  if (!env.DB) throw new Error("Booking database is unavailable");
  await env.DB.prepare(`
    INSERT INTO booking_requests
      (id, reference, guest_name, guest_email, guest_phone, message, check_in, check_out, guests, total_eur, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
  `).bind(
    booking.id,
    booking.reference,
    booking.name,
    booking.email,
    booking.phone || null,
    booking.message || null,
    booking.checkIn,
    booking.checkOut,
    booking.guests,
    booking.total,
  ).run();
}
