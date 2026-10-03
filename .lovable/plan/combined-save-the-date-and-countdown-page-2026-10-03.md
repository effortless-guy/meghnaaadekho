# Combined Save the Date and countdown page

## What will change
- Hide the existing “Dates to remember” page for now without deleting its JSON-driven design.
- Leave a clear code comment beside its visibility switch explaining how to enable it again later.
- Replace the current “The celebration begins in” section with one torn-paper “Save the Date” page that stays within the existing ivory, wine, and antique-gold invitation theme.
- Add three gold heart covers labeled Day, Month, and Year, deriving all revealed values from the wedding date in the shared JSON.
- Give each heart a subtle hover/focus enlargement while keeping touch behavior comfortable on phones.
- Let guests scratch only where their mouse or finger moves; do not reveal an entire heart from a single tap.
- Preserve partially scratched areas and mark each heart complete only after enough of its cover has been cleared.
- Reveal the live four-part countdown at the bottom of the same page only after all three hearts are sufficiently uncovered.
- Keep the existing torn-paper crossing and floral reveal so this section flows naturally into the schedule.

## Verification
- Test mouse dragging and finger-style pointer movement across all three hearts.
- Confirm Day, Month, and Year remain readable after scratching and come only from the JSON wedding date.
- Confirm the countdown stays hidden until all three hearts are revealed, then updates live in place.
- Check hover, keyboard focus, touch scrolling, no accidental full-heart reveal, and no horizontal overflow at 360, 375, 390, and 414px widths.
- Confirm the hidden “Dates to remember” page can be restored through the documented visibility switch.

## Technical details
- Implement each scratch cover with a canvas using destination-out compositing and pointer capture, measuring cleared pixel coverage before declaring it revealed.
- Size canvases for device pixel ratio so the gold finish and scratch edges remain crisp.
- Reuse the existing countdown calculation and shared `WeddingData` date rather than duplicating date values.
- Respect reduced-motion preferences by disabling decorative zoom while keeping the scratch interaction usable.
