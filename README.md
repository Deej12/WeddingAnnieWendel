# Annie & Wendel Wedding Website

This site includes a wedding RSVP page, guest validation against an uploaded Excel list, notification email sending, and an admin dashboard for managing RSVPs.

## Setup

1. Copy `.env.example` to `.env`.
2. Place the wedding guest Excel file in `data/` and make sure it is named `Wedding Guest.xlsx`, or update `GUEST_LIST_FILE` in `.env`.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm start
   ```
5. Open `http://localhost:3000/rsvp.html` to view the RSVP form.
6. Open `http://localhost:3000/admin.html` and enter the admin key from `.env` to manage responses.

## Notes

- RSVP submissions are stored in `data/rsvps.json`.
- Only invited guests whose names are in the uploaded guest list Excel file may submit a valid RSVP.
- RSVP email notifications are sent to `annieandwendel@gmail.com` when the SMTP settings are configured.
- Admin dashboard supports search, filter, export, update, and delete operations.
