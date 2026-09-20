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
  console.log("New booking request:", booking);

  return {
    success: true,
    reference: booking.reference,
  };
}
