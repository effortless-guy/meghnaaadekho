# Invitation actions and event dates

## What will change
- Add clear map and RSVP icons inside the existing invitation buttons, with refined press, focus, and subtle motion states that preserve the ivory, wine, and antique-gold stationery style.
- Add a torn-paper “Dates to remember” page immediately before “The celebration begins in.”
- Build that page from the existing JSON `events` entries, showing each event name and date; omit the entire page when no dated events are available.
- Keep the later detailed schedule unchanged.

## Verification
- Confirm map opens in a new tab and RSVP opens its full-screen form.
- Check the conditional page, button states, no side overflow, and clean rendering at the supported phone widths.

## Technical details
- Use existing icon and button components.
- Derive dated events from `WeddingData.events` rather than duplicating invitation content.
- Preserve current torn-paper transitions and alternating floral reveals.
