# Invitation Flow Refinement

## Build
- Make the closed envelope fill the entire phone viewport edge-to-edge, keep the seal central, and move “Tap to open” slightly lower.
- After the envelope opens, add a devotional welcome page using the supplied Ganesh artwork and a warm textured message treatment inspired by the reference.
- Add an interactive “Save the Date” page where guests scratch away three heart-shaped covers with a mouse or finger to reveal the wedding day, date, and month.
- Remove the Dress Code and Gift Preference pages completely.
- Upgrade the Location page with an original venue illustration while keeping the address and maps action clear.
- Replace the current upward slide reveals with softer fades, focus shifts, and gentle scaling so transitions feel continuous rather than like stacked slides.

## Data and behavior
- Continue loading all names, date, message, location, and visibility values from the existing wedding JSON.
- Keep music off until the guest explicitly taps the sound button.
- Preserve the slow four-sided envelope opening, RSVP overlay, moving swan cover, and narrow 390px invitation layout on larger screens.

## Verification
- Check touch scratching, mouse scratching, envelope opening, section transitions, location action, and RSVP at 360×800, 375×812, 390×844, and 414×896.
- Confirm phone screens have no outer envelope margin, horizontal overflow, clipped text, or console errors.
