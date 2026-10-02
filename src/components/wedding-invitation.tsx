import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { CalendarDays, Check, MapPin, Music2, Pause, Volume2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { WeddingData } from "@/lib/wedding-data";
import sacredHero from "@/assets/sacred-garden-hero.jpg";
import royalHero from "@/assets/royal-celebration-hero.jpg";
import detailPhoto from "@/assets/wedding-detail.jpg";

function initials(data: WeddingData) {
  return `${data.couple.groom.charAt(0)}${data.couple.bride.charAt(0)}`;
}

function Countdown({ date }: { date: string }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  const values = useMemo(() => {
    const remaining = Math.max(0, new Date(`${date}T16:30:00`).getTime() - now);
    return [
      { label: "Days", value: Math.floor(remaining / 86400000) },
      { label: "Hours", value: String(Math.floor((remaining / 3600000) % 24)).padStart(2, "0") },
      { label: "Minutes", value: String(Math.floor((remaining / 60000) % 60)).padStart(2, "0") },
      { label: "Seconds", value: String(Math.floor((remaining / 1000) % 60)).padStart(2, "0") },
    ];
  }, [date, now]);
  return <div className="countdown">{values.map((item) => <div key={item.label}><strong>{item.value}</strong><span>{item.label}</span></div>)}</div>;
}

function Rsvp({ invitationId }: { invitationId?: string }) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const guestName = String(form.get("name") ?? "").trim();
    if (!guestName || guestName.length > 100) { setError("Please enter your name."); return; }
    const response = {
      guest_name: guestName,
      attending: form.get("attending") === "yes",
      party_size: Math.min(20, Math.max(1, Number(form.get("partySize") ?? 1))),
      dietary_requirements: String(form.get("dietary") ?? "").trim().slice(0, 500),
      message: String(form.get("message") ?? "").trim().slice(0, 1000),
      website: String(form.get("website") ?? ""),
    };
    if (response.website) return;
    if (invitationId) {
      const { error: submitError } = await supabase.from("rsvp_responses").insert({ ...response, invitation_id: invitationId });
      if (submitError) { setError("We couldn't send your reply. Please try again."); return; }
    }
    setSent(true);
  }
  if (sent) return <div className="rsvp-success"><Check aria-hidden /><p>Thank you. Your reply has been received.</p></div>;
  return <form className="rsvp-form" onSubmit={submit}>
    <input name="website" tabIndex={-1} autoComplete="off" className="honeypot" aria-hidden="true" />
    <label>Your name<input name="name" maxLength={100} required /></label>
    <fieldset><legend>Will you join us?</legend><label><input type="radio" name="attending" value="yes" defaultChecked /> Joyfully accepts</label><label><input type="radio" name="attending" value="no" /> Regretfully declines</label></fieldset>
    <label>Number of guests<input name="partySize" type="number" min={1} max={20} defaultValue={1} /></label>
    <label>Dietary requirements<textarea name="dietary" maxLength={500} rows={2} /></label>
    <label>A note for the couple<textarea name="message" maxLength={1000} rows={3} /></label>
    {error && <p className="form-error" role="alert">{error}</p>}
    <Button type="submit" size="lg">Send our reply</Button>
  </form>;
}

export function WeddingInvitation({ data, invitationId, preview = false }: { data: WeddingData; invitationId?: string; preview?: boolean }) {
  const [opened, setOpened] = useState(preview);
  const [playing, setPlaying] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);
  const royal = data.template.templateId === "royal-celebration";
  const dateLabel = new Intl.DateTimeFormat("en", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${data.wedding.date}T12:00:00`));
  useEffect(() => { if (!playing) audio.current?.pause(); }, [playing]);
  async function open() {
    setOpened(true);
    if (data.music.enabled && data.music.url && audio.current) {
      try { await audio.current.play(); setPlaying(true); } catch { setPlaying(false); }
    }
  }
  return <main className={`invitation ${royal ? "royal" : "garden"} ${opened ? "is-open" : "is-closed"}`}>
    {data.music.url && <audio ref={audio} src={data.music.url} loop />}
    {!opened && <div className="envelope-gate">
      <div className="envelope" aria-hidden><div className="envelope-flap" /><div className="emboss emboss-left">❧</div><div className="emboss emboss-right">❧</div><div className="envelope-vine vine-left">⌇❧⌇</div><div className="envelope-vine vine-right">⌇❧⌇</div></div>
      <Button className="wax-seal" onClick={open} aria-label="Open invitation"><span>{initials(data)}</span></Button>
      <p><span>⌃</span>Tap to open</p>
    </div>}
    <div className="invitation-story" aria-hidden={!opened}>
      <section className="invitation-cover paper-panel">
        <div className="botanical-crown" aria-hidden>❦</div>
        <div className="cover-copy"><p>{data.intro.headline}</p><span className="cover-rule" /><h1><span>{data.couple.groom}</span><i>&</i><span>{data.couple.bride}</span></h1><small>The wedding of</small><time>{dateLabel}</time><p className="cover-time">At half past four in the afternoon</p></div>
        <span className="scroll-mark">Scroll to discover</span>
      </section>
      <section className="portrait-panel"><img src={royal ? royalHero : sacredHero} alt="Wedding couple in a ceremonial garden" width={1024} height={1536} /><div><p>Two souls</p><h2>One destiny</h2><span>A lifetime, written with love</span></div></section>
      {!royal && <section className="letter-section ornamented"><div className="botanical-mark" aria-hidden>❦</div><p className="kicker">Dear friends & family</p><h2>Our favourite chapter begins</h2><p>{data.intro.message}</p><p>{data.story}</p><div className="monogram">{initials(data)}</div><span className="fine-rule" /></section>}
      {royal && <section className="royal-proclamation"><div className="sun-mark">☼</div><p className="kicker">With the blessings of our families</p><h2>Two hearts. One celebration.</h2><p>{data.intro.message}</p></section>}
      <section className="countdown-section"><div className="botanical-mark" aria-hidden>❦</div><p className="kicker">The celebration begins in</p><Countdown date={data.wedding.date} /></section>
      {data.visibility['events'] && <section className="events-section ornamented"><p className="kicker">Schedule of events</p><h2>{royal ? "Wedding festivities" : "A day to remember"}</h2><div className="event-list">{data.events.map((item, index) => <article key={`${item.name}-${index}`}><time>{item.time}</time><span aria-hidden>{index % 2 === 0 ? "❧" : "✦"}</span><div><h3>{item.name}</h3><p>{item.description}</p><small>{item.venue}</small></div></article>)}</div></section>}
      <section className="photo-interlude"><img src={detailPhoto} alt="Wedding rings and olive bouquet" loading="lazy" width={1024} height={1024} /><blockquote>“And so the adventure begins.”</blockquote></section>
      {data.visibility['venue'] && <section className="venue-section"><MapPin aria-hidden /><p className="kicker">Venue</p><h2>{data.venue.name}</h2><p>{data.venue.address}</p><Button asChild variant="outline"><a href={data.venue.mapUrl} target="_blank" rel="noreferrer">View location</a></Button></section>}
      <section className="details-section"><article><span className="gift-mark">✦</span><p className="kicker">Gift preference</p><p>{data.giftNote}</p></article><article><CalendarDays aria-hidden /><p className="kicker">Dress code</p><p>{data.dressCode}</p></article></section>
      {data.rsvp.enabled && data.visibility['rsvp'] && <section className="rsvp-section"><div className="botanical-mark" aria-hidden>❦</div><p className="kicker">Confirm your attendance</p><h2>Will you celebrate with us?</h2><p>To help us prepare for a joyful celebration, kindly confirm your attendance.</p><Rsvp {...(invitationId ? { invitationId } : {})} /></section>}
      <footer><p>Hope to see you there!</p><div className="monogram">{initials(data)}</div><h2>{data.couple.groom} <i>&</i> {data.couple.bride}</h2><small>With love, always</small></footer>
    </div>
    {opened && data.music.url && <Button className="music-control" size="icon" variant="outline" onClick={async () => { if (!audio.current) return; if (playing) audio.current.pause(); else await audio.current.play(); setPlaying(!playing); }} aria-label={playing ? "Pause music" : "Play music"}>{playing ? <Pause /> : <Music2 />}</Button>}
    {opened && !data.music.url && <span className="sound-note" title="Music begins after opening"><Volume2 aria-hidden /></span>}
  </main>;
}
