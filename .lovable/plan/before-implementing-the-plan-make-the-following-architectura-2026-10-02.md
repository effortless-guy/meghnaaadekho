Before implementing the plan, make the following architectural and product changes.

==================================================

1. PRODUCT PRIORITY

==================================================

The primary differentiator of this product is NOT the creator dashboard.

The primary differentiator is the quality of the guest invitation experience.

Prioritize in this order:

1. Premium invitation visual experience

2. Template architecture

3. Mobile experience

4. Creator customization

5. Publishing and shareable URL

6. RSVP collection

7. Analytics / advanced features later

A beautiful invitation with fewer features is preferable to a feature-rich invitation that looks generic.

==================================================

2. TEMPLATE ARCHITECTURE

==================================================

Create a proper template system.

Wedding data must be completely separated from template presentation.

The architecture should conceptually be:

WeddingData

    ↓

InvitationTemplate

    ↓

Template-specific presentation

Initial templates:

Template 01:

Sacred Garden

Template 02:

Royal Celebration

Both templates must consume the same wedding data structure.

However, they must NOT share the same visual layout.

Each template should independently define:

- typography

- spacing

- section composition

- decorative elements

- imagery treatment

- animation

- colors

- backgrounds

- transitions

Do not implement templates as a generic invitation with different colors and fonts.

They should feel like two completely different professionally designed wedding invitations.

==================================================

3. SACRED GARDEN

==================================================

Visual direction:

Luxury botanical wedding stationery.

Use:

- warm ivory

- parchment

- sage

- muted olive

- subtle antique gold

- botanical illustrations

- editorial serif typography

- refined sans-serif supporting typography

- paper texture

- generous whitespace

The design should feel like a premium printed wedding invitation brought to life digitally.

Avoid generic SaaS UI patterns.

==================================================

4. ROYAL CELEBRATION

==================================================

Create a completely different visual identity.

Inspired by luxurious Indian wedding invitation artwork.

Use:

- warm ivory

- terracotta

- vermilion

- muted orange

- antique gold

- palace/haveli-inspired decorative elements

- Indian wedding illustrations

- hand-painted / miniature-art-inspired visual treatment

This must NOT be Sacred Garden with a different color palette.

Use different section compositions and visual rhythm.

==================================================

5. CURATED CUSTOMIZATION

==================================================

Do NOT initially allow arbitrary colors and arbitrary font selections.

The template controls:

- core palette

- typography

- spacing

- animation

- decorative system

The creator controls:

- couple names

- date

- time

- wedding description

- story

- events

- venue

- photos

- gallery

- RSVP

- dress code

- gift information

- contact information

- music

- section visibility

Later we can introduce curated style variants.

==================================================

6. TEMPLATE GALLERY

==================================================

Add a template selection screen.

The creator should see beautiful mobile invitation previews.

Example:

Choose your invitation

[ Sacred Garden ]

[ Royal Celebration ]

Each preview should look like an actual invitation rather than a generic website screenshot.

Make the gallery itself elegant and minimal.

==================================================

7. INVITATION DATA MODEL

==================================================

Create a clean reusable WeddingData model.

It should include:

couple

  bride

  groom

wedding

  date

  time

  timezone

intro

  headline

  message

story

events[]

  name

  date

  time

  venue

  address

  description

venue

  name

  address

  mapUrl

gallery[]

dressCode

giftNote

contacts[]

music

rsvp

  enabled

  questions

template

  templateId

visibility

  enabled sections

publishing

  status

  slug

Do not hardcode wedding information into template components.

==================================================

8. PUBLIC INVITATION URL

==================================================

Create public invitation URLs such as:

/invite/{slug}

Example:

/invite/rahul-and-priya

The guest must not need an account.

The invitation should load directly from the published wedding data.

A published invitation keeps the same URL when the creator edits it.

Invitation states:

DRAFT

PUBLISHED

UNPUBLISHED

Slugs must be unique.

==================================================

9. CREATOR FLOW

==================================================

The creator experience should be:

Template Gallery

        ↓

Select Template

        ↓

Enter Wedding Details

        ↓

Upload Photos

        ↓

Configure Events

        ↓

Configure RSVP

        ↓

Live Preview

        ↓

Save Draft

        ↓

Publish

        ↓

Share Invitation

Keep this workflow extremely simple.

Do not create a complicated enterprise dashboard.

==================================================

10. LIVE PREVIEW

==================================================

The creator must have a real invitation preview.

The preview should render the actual selected template.

Do not create a fake simplified preview.

Support:

Mobile preview

Desktop preview

Mobile preview should use approximately:

390 × 844

The creator should be able to see changes immediately.

==================================================

11. GUEST EXPERIENCE

==================================================

The guest invitation is the most important part of the application.

It should feel like a premium digital wedding card.

Opening:

Full-screen invitation/envelope experience.

Cream embossed paper.

Centered wax seal.

On interaction:

Envelope opens elegantly.

Then reveal the invitation.

Use:

- subtle cinematic animation

- paper texture

- botanical decoration

- editorial typography

- layered imagery

- restrained motion

Do not use flashy animations.

Do not make it feel like a web app.

==================================================

12. MOBILE DESIGN

==================================================

Design the guest experience for:

360px

375px

390px

414px

The 390px viewport is the primary reference.

Do NOT simply make desktop responsive.

Design the mobile composition intentionally.

Every section must be checked for:

- text wrapping

- image cropping

- spacing

- touch targets

- animation

- viewport height

- overflow

- horizontal scrolling

- accessibility

There must be no clipped text or accidental horizontal scrolling.

==================================================

13. MUSIC

==================================================

Music must never autoplay before user interaction.

Start music only after the invitation is opened.

Provide a discreet floating play/pause control.

Respect browser autoplay policies.

==================================================

14. RSVP

==================================================

Keep V1 RSVP intentionally simple.

Collect:

- guest name

- attending / not attending

- party size

- dietary requirements

- message

Validate both client-side and server-side.

Add basic anti-spam protection.

Show an elegant confirmation state after submission.

Creator should have a simple RSVP response view.

==================================================

15. LOVABLE CLOUD

==================================================

Use Lovable Cloud for:

- invitation configuration

- published invitation data

- media references

- RSVP responses

Do not store sensitive information unnecessarily.

Public invitation data should expose only the information required for the guest experience.

Creator-only data must remain protected.

==================================================

16. DESIGN PRINCIPLE

==================================================

The most important requirement:

This must NOT look like a website builder.

It must look like a wedding invitation designer created a beautiful digital invitation.

Avoid:

- generic SaaS cards

- excessive rounded containers

- glassmorphism

- excessive shadows

- generic gradients

- dashboard-like guest pages

- repetitive card layouts

- excessive buttons

- generic hero sections

Use:

- typography

- whitespace

- photography

- illustration

- texture

- composition

- subtle motion

- visual storytelling

The invitation should feel handcrafted.

==================================================

17. IMPLEMENTATION ORDER

==================================================

Do not build everything simultaneously.

Implement in this order:

Phase 1

Sacred Garden guest invitation

Phase 2

Mobile visual refinement

Phase 3

Wedding data model

Phase 4

Creator editor

Phase 5

Publishing + public URL

Phase 6

RSVP

Phase 7

Royal Celebration template

Do not sacrifice the visual quality of Phase 1 just to reach later features quickly.