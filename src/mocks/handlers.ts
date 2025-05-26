import { http, HttpResponse } from 'msw';

// ----------------------
// Types
// ----------------------

type Slot = {
  id: string;
  time: string;
};

type ReservationPayload = {
  id: string;
};

type SavePersonalDataPayload = {
  firstName: string;
  lastName: string;
  birthNumber: string;
  countryId: string;
  cityId: string;
  email: string;
};

// ----------------------
// Mock Data
// ----------------------

const availableSlots: Record<string, Slot[]> = {
  '07/04/2025': [
    { id: 'fd74e2de-9466-474e-89a5-9b543d09148d', time: '15:00' },
    { id: '85eaf8cd-eb96-40fd-9914-1979ebbfe015', time: '15:30' },
    { id: 'd0a5e8c4-95aa-44dd-b46e-6ee51fb58b58', time: '16:00' },
    { id: 'edc2f9a0-7d3f-4958-9d6b-7486ae0d14ec', time: '16:30' },
  ],
  '08/04/2025': [
    { id: 'f45c6e4e-2ff4-4b17-925e-1bbf9f6d4f0a', time: '09:00' },
    { id: '3a9b3dc0-e5a3-4f1c-9485-4edafe0b1b2f', time: '09:30' },
    { id: '912be823-7ec2-4745-b60f-6c83e841f8cd', time: '10:00' },
    { id: '62123987-8b0a-4d63-a68e-4f23b09342f3', time: '10:30' },
  ],
};

const validSlotIds = new Set(
  Object.values(availableSlots).flat().map(slot => slot.id)
);

// ----------------------
// Handlers
// ----------------------

export const handlers = [

  http.get('/api/available-slots', () => {
    return HttpResponse.json({
      slots: availableSlots,
    });
  }),

  http.post('/api/save-personal-data', async ({ request }) => {
    const data = await request.json() as SavePersonalDataPayload;

    if (data.email === 'fail@example.com') {
      return HttpResponse.json(
        { message: 'Simulated server error: invalid email address.' },
        { status: 400 }
      );
    }

    return HttpResponse.json({
      message: 'Reservation completed successfully',
      reservationId: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    });
  }),

  http.post('/api/complete', async ({ request }) => {
    const { id } = await request.json() as ReservationPayload;

    if (!id || !validSlotIds.has(id)) {
      return HttpResponse.json(
        { message: 'Invalid or missing slot ID.' },
        { status: 400 }
      );
    }

    return HttpResponse.json({
      message: 'Reservation confirmed.',
      slotId: id,
      confirmedAt: new Date().toISOString(),
    });
  }),

];
