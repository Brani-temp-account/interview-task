# 🧪 Interview Task – Frontend Application (Angular + MSW)

This project is a take-home frontend interview task built with:

- ⚡ **Angular 19** (standalone components + signals)
- 📦 **Nx Monorepo** (if you do not have Nx install on your machine, you will need to do so)
- 🧪 **MSW (Mock Service Worker)** to mock backend APIs
- 🧠 Typed APIs with realistic mock data and validation

The app is fully frontend-only — all backend logic is mocked and runs in-browser using MSW.
Feel free to check handlers.ts for the implementation.

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install

### 2. Service Worker Setup

The required `mockServiceWorker.js` is already included in the repository and configured.

👉 You do **not** need to run `npx msw init`. Just start the app and the mock API will be active automatically.

## 🔌 API Endpoints (Mocked via MSW)

All API calls are intercepted and mocked using [MSW](https://mswjs.io/) v2.
No real backend is used — everything runs in the browser.

```

### `GET /api/available-slots`

Returns a list of available time slots grouped by date.

#### ✅ Example Response

```json
{
  "slots": {
    "07/04/2025": [
      { "id": "fd74e2de-9466-474e-89a5-9b543d09148d", "time": "15:00" },
      { "id": "85eaf8cd-eb96-40fd-9914-1979ebbfe015", "time": "15:30" },
      { "id": "d0a5e8c4-95aa-44dd-b46e-6ee51fb58b58", "time": "16:00" },
      { "id": "edc2f9a0-7d3f-4958-9d6b-7486ae0d14ec", "time": "16:30" }
    ],
    "08/04/2025": [
      { "id": "f45c6e4e-2ff4-4b17-925e-1bbf9f6d4f0a", "time": "09:00" },
      { "id": "3a9b3dc0-e5a3-4f1c-9485-4edafe0b1b2f", "time": "09:30" },
      { "id": "912be823-7ec2-4745-b60f-6c83e841f8cd", "time": "10:00" },
      { "id": "62123987-8b0a-4d63-a68e-4f23b09342f3", "time": "10:30" }
    ]
  }
}
```

### `POST /api/save-personal-data`

Saves personal information before completing a reservation.

#### ✅ Example Request Body

```json
{
  "firstName": "Emma",
  "lastName": "Thompson",
  "birthNumber": "900615/1234",
  "countryId": "sk",
  "cityId": "bratislava",
  "email": "emma.thompson@example.com"
}
```

#### ✅ Success Response
```json
{
  "message": "Personal data saved successfully",
  "reservationId": "generated-id",
  "timestamp": "2025-04-03T12:34:56.789Z"
}
```

#### ❌ Error Simulation

Submit with email: "fail@example.com" to simulate a validation error:
```json
{
  "message": "Simulated server error: invalid email address."
}
```

### `POST /api/complete`

Confirms a reservation for a selected slot.

#### ✅ Example Request Body

```json
{
  "id": "fd74e2de-9466-474e-89a5-9b543d09148d"
}
```

#### ✅ Success Response
```json
{
  "message": "Reservation confirmed.",
  "slotId": "fd74e2de-9466-474e-89a5-9b543d09148d",
  "confirmedAt": "2025-04-03T13:45:00.000Z"
}
```

#### ❌ Error Simulation

If the slot ID is invalid or missing:
```json
{
  "message": "Invalid or missing slot ID"
}
```
