# Premium Customizable Wedding Invitation App

## Goal
Build a polished invitation creator that lets someone enter wedding details, instantly preview the result, share a unique invitation link, and collect RSVPs. The guest experience will be mobile-first and inspired by the uploaded embossed envelope and Sacred Garden reference.

## Creator experience
- Replace the blank home page with a refined invitation dashboard and guided customization form.
- Let creators enter couple names, date, introductory message, story, event schedule, venue/map link, dress code, gift note, contact details, and RSVP questions.
- Support editable colors, typography style, cover monogram, photos, background music, and section visibility.
- Include a live phone preview with draft saving and a shareable invitation link once published.
- Use clear validation and sensible sample content where fields have not yet been filled.

## Guest invitation
- Open on a full-screen cream embossed envelope on mobile and desktop, with a centered wax seal interaction.
- On tap, animate the envelope opening, reveal the invitation, and start optional music only after that gesture; retain a discreet play/pause control.
- Present the couple names and date, editorial welcome, countdown, story/photos, event timeline, venue directions, dress and gift information, and RSVP.
- Use restrained cinematic reveals, layered botanical details, ivory paper textures, burgundy wax, antique gold accents, and elegant serif typography.
- Make the entire experience fluid on phones, with large touch targets and no clipped text or overlapping elements.

## RSVP and saved data
- Enable Lovable Cloud for saved invitation configurations, uploaded media references, public invitation links, and RSVP responses.
- Add an on-page RSVP form for guest name, attendance, party size, dietary notes, and message to the couple.
- Validate submissions in the page and on the server, add basic anti-spam protection, and show a polished success state.
- Give the creator a simple response view with attendance totals and guest details.

## Routes
- `/` — creator dashboard and invitation setup.
- `/invite/:slug` — public guest invitation with the envelope reveal.
- `/invite/:slug/responses` — creator-only RSVP summary.
- Each public page receives unique invitation-specific sharing metadata where possible.

## Visual assets
- Use the uploaded image and video as visual references rather than embedding social-media footage.
- Generate a cohesive original set of premium assets: embossed envelope, wax seal/monogram treatment, botanical paper details, and subtle section ornaments.
- Keep the final invitation original rather than copying the reference site pixel-for-pixel.

## Technical details
- Build with the existing TanStack Start and Tailwind v4 setup.
- Keep visual values in semantic design tokens and use small focused React components for the creator, preview, reveal, timeline, countdown, and RSVP.
- Store roles separately if creator ownership needs authorization; enforce ownership and public-read boundaries server-side.
- Add route metadata, loading/empty/error states, and targeted tests for reveal behavior, countdown output, validation, public sharing, and RSVP submission.
- Verify the completed flow at desktop and mobile sizes, including opening the envelope, music controls, creator edits, publishing, and RSVP receipt.
