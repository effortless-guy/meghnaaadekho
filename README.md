# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS

## Invitation content

Edit `src/data/wedding.json` to update names, dates, events, contacts, music, and RSVP settings.

### Change the music

Music never starts automatically; guests control it with the sound button.

- Leave `music.url` empty to use the bundled classical tune.
- To use another track, place an MP3 in `public/` and set `music.url` to its public path, such as `"/our-song.mp3"`.
- A full HTTPS audio URL also works when its host permits playback from other websites.

### Link RSVP to Google Forms

Copy the public link from Google Forms and paste it into `rsvp.googleFormUrl` in `src/data/wedding.json`:

```json
"rsvp": {
  "enabled": true,
  "questions": ["attendance", "partySize", "dietary", "message"],
  "googleFormUrl": "https://forms.gle/your-form-link"
}
```

When this URL is present, **Open RSVP** opens Google Forms in a new tab. Leave it empty to use the invitation's built-in RSVP form.

### Contact photos and WhatsApp

- Add `"photo": "/person-name.jpg"` after placing the image in `public/`. Without a photo, the person's initial is shown.
- Add `"whatsapp": "+91 91234 56789"` to show a WhatsApp action for that contact.
