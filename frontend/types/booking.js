export function createBooking(data) {
  /** @type {import('./types').Booking} */
  const booking = {
    id: data.id,
    bookerName: data.bookerName,
    bookerPhone: data.bookerPhone,
    patientName: data.patientName,
    patientAge: data.patientAge,
    medicalCondition: data.medicalCondition,
    caretakerName: data.caretakerName,
    caretakerPhone: data.caretakerPhone,
    caretakerRelation: data.caretakerRelation,
    pickupAddress: data.pickupAddress,
    ambulanceType: data.ambulanceType,
    status: data.status || "pending",
    createdAt: data.createdAt || new Date(),
  }

  return booking
}