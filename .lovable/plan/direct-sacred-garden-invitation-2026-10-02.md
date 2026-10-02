# Direct Sacred Garden Invitation

## Build
- Replace the home screen with the invitation itself; guests will not see an editor, template selector, or device choices.
- Keep the mobile portrait experience centered at 390px on larger screens and full-width on phones.
- Refine the single invitation around the supplied Sacred Garden references: ivory paper, antique gold script, botanical edges, portrait imagery, countdown, elegant timeline, location, dress/gift note, RSVP seal, and closing portrait.
- Preserve the opening envelope, ambient light effect, royal processional, and bottom-right music controls.

## Data
- Add one JSON file containing the couple, date, wording, events, location, dress code, gift note, contacts, music, RSVP, visibility, and publishing values.
- Both `/` and `/invite/:slug` will render the same invitation from that JSON file.
- Keep the shared WeddingData model as the validation contract for the template.

## Verification
- Check the opening, scrolling card, music controls, and RSVP overlay at 360×800, 375×812, 390×844, and 414×896.
- Confirm there is no horizontal overflow and no editor or template selector on the home screen.
