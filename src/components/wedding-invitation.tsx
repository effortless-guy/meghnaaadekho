import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { CalendarDays, Check, MapPin, Music2, Pause, Volume2, VolumeX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import type { WeddingData } from "@/lib/wedding-data";
import sacredHero from "@/assets/sacred-garden-hero.jpg";
import royalHero from "@/assets/royal-celebration-hero.jpg";
import detailPhoto from "@/assets/wedding-detail.jpg";
import royalProcessional from "@/assets/royal-wedding-processional.wav.asset.json";

function initials(data: WeddingData) {
  return `${data.couple.groom.charAt(0)}${data.couple.bride.charAt(0)}`;
}

function Countdown({ date }: { date: string }) {
  const [now, setNow] = useState(0);
  useEffect(() => {
    setNow(Date.now());
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

function Rsvp({ invitationId, couple }: { invitationId?: string; couple: WeddingData["couple"] }) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [attending, setAttending] = useState("yes");
  const [familySide, setFamilySide] = useState("bride");
  const [partySize, setPartySize] = useState("1");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const guestName = String(form.get("name") ?? "").trim();
    if (!guestName || guestName.length > 100) { setError("Please enter your name."); return; }
    const details = [
      `Family: ${familySide === "bride" ? `${couple.bride}'s side` : `${couple.groom}'s side`}`,
      `WhatsApp: ${String(form.get("whatsapp") ?? "").trim()}`,
      `Song: ${String(form.get("song") ?? "").trim() || "Not provided"}`,
      `Children: ${String(form.get("children") ?? "").trim() || "None listed"}`,
      `Message: ${String(form.get("message") ?? "").trim() || "—"}`,
    ].join("\n");
    const response = {
      guest_name: guestName,
      attending: attending === "yes",
      party_size: Math.min(20, Math.max(1, Number(partySize))),
      dietary_requirements: String(form.get("dietary") ?? "").trim().slice(0, 500),
      message: details.slice(0, 1000),
      website: String(form.get("website") ?? ""),
    };
    if (response.website) return;
    if (invitationId) {
      const { error: submitError } = await supabase.from("rsvp_responses").insert({ ...response, invitation_id: invitationId });
      if (submitError) { setError("We couldn't send your reply. Please try again."); return; }
    }
    setSent(true);
  }
  return <Dialog>
    <DialogTrigger asChild><Button size="lg" className="rsvp-open">Open RSVP</Button></DialogTrigger>
    <DialogContent className="rsvp-dialog !left-0 !top-0 !translate-x-0 !translate-y-0">
      {sent ? <div className="rsvp-success"><Check aria-hidden /><h3>Thank you</h3><p>Your reply has been received. We cannot wait to celebrate with you.</p></div> : <>
        <DialogHeader className="rsvp-dialog-header"><span className="rsvp-crest" aria-hidden>❦</span><DialogTitle>Confirm Your Attendance</DialogTitle><DialogDescription>Kindly reply before 09 August</DialogDescription></DialogHeader>
        <form className="rsvp-form" onSubmit={submit}>
          <input name="website" tabIndex={-1} autoComplete="off" className="honeypot" aria-hidden="true" />
          <label>Primary guest <span>*</span><input name="name" maxLength={100} required /></label>
          <fieldset><legend>Representing family <span>*</span></legend><RadioGroup value={familySide} onValueChange={setFamilySide}><label><RadioGroupItem value="groom" />{couple.groom} — groom&apos;s side</label><label><RadioGroupItem value="bride" />{couple.bride} — bride&apos;s side</label></RadioGroup></fieldset>
          <label>WhatsApp number <span>*</span><input name="whatsapp" type="tel" inputMode="tel" required /></label>
          <fieldset><legend>Will you be attending?</legend><RadioGroup value={attending} onValueChange={setAttending}><label><RadioGroupItem value="yes" />Accepts with pleasure</label><label><RadioGroupItem value="no" />Declines with regret</label></RadioGroup></fieldset>
          <label>Total guests attending <span>*</span><Select value={partySize} onValueChange={setPartySize}><SelectTrigger><SelectValue placeholder="Choose" /></SelectTrigger><SelectContent>{Array.from({ length: 10 }, (_, index) => <SelectItem key={index + 1} value={String(index + 1)}>{index + 1}</SelectItem>)}</SelectContent></Select></label>
          <label>A song that gets you dancing<input name="song" maxLength={120} /></label>
          <label>Children attending <small>Please include names and ages.</small><textarea name="children" maxLength={500} rows={2} /></label>
          <label>Dietary requirements<textarea name="dietary" maxLength={500} rows={2} /></label>
          <label>A note for the couple<textarea name="message" maxLength={500} rows={3} /></label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <Button type="submit" size="lg">Send our reply</Button>
        </form>
      </>}
    </DialogContent>
  </Dialog>;
}

export function WeddingInvitation({ data, invitationId, preview = false }: { data: WeddingData; invitationId?: string; preview?: boolean }) {
  const [opened, setOpened] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);
  const royal = data.template.templateId === "royal-celebration";
  const dateLabel = new Intl.DateTimeFormat("en", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${data.wedding.date}T12:00:00`));
  const audioSrc = data.music.url || royalProcessional.url;
  useEffect(() => { if (!playing) audio.current?.pause(); }, [playing]);
  useEffect(() => { if (audio.current) audio.current.muted = muted; }, [muted]);
  async function open() {
    setOpened(true);
    if (audio.current) {
      try { await audio.current.play(); setPlaying(true); } catch { setPlaying(false); }
    }
  }
  return <main className={`invitation ${royal ? "royal" : "garden"} ${preview ? "is-preview" : ""} ${opened ? "is-open" : "is-closed"}`}>
    <audio ref={audio} src={audioSrc} loop preload="auto" />
    {!opened && <div className="envelope-gate">
      <div className="envelope" aria-hidden>
        <div className="envelope-flap" />
        <div className="embossed-sprig sprig-top-left">❦</div>
        <div className="embossed-sprig sprig-top-right">❦</div>
        <div className="embossed-sprig sprig-bottom-left">❦</div>
        <div className="embossed-sprig sprig-bottom-right">❦</div>
        <div className="envelope-prompt"><span>⌃</span>Tap to open</div>
      </div>
      <Button className="wax-seal" onClick={open} aria-label="Open invitation"><span>{initials(data)}</span></Button>
    </div>}
    <div className="invitation-story" aria-hidden={!opened}>
      <section className="invitation-cover paper-panel">
        <div className="botanical-crown" aria-hidden>❦</div>
        <div className="cover-copy"><p>{data.intro.headline}</p><span className="cover-rule" /><h1><span>{data.couple.groom}</span><i>&</i><span>{data.couple.bride}</span></h1><small>The wedding of</small><time>{dateLabel}</time><p className="cover-time">At half past four in the afternoon</p></div>
        <span className="scroll-mark">Scroll to discover</span>
      </section>
      <section className="portrait-panel"><img src={royal ? royalHero : sacredHero} alt="Wedding couple in a ceremonial garden" width={1024} height={1536} /><div><p>Two souls</p><h2>One destiny</h2><span>A lifetime, written with love</span></div><span className="floral-edge floral-edge-left" aria-hidden>❦</span><span className="floral-edge floral-edge-right" aria-hidden>❦</span></section>
      {!royal && <section className="letter-section ornamented"><div className="botanical-mark" aria-hidden>❦</div><p className="kicker">Dear friends & family</p><h2>Our favourite chapter begins</h2><p>{data.intro.message}</p><p>{data.story}</p><div className="monogram">{initials(data)}</div><span className="fine-rule" /></section>}
      {royal && <section className="royal-proclamation"><div className="sun-mark">☼</div><p className="kicker">With the blessings of our families</p><h2>Two hearts. One celebration.</h2><p>{data.intro.message}</p></section>}
      <section className="countdown-section"><div className="botanical-mark" aria-hidden>❦</div><p className="kicker">The celebration begins in</p><Countdown date={data.wedding.date} /></section>
      {data.visibility['events'] && <section className="events-section ornamented"><p className="kicker">Schedule of events</p><h2>{royal ? "Wedding festivities" : "A day to remember"}</h2><div className="event-list">{data.events.map((item, index) => <article key={`${item.name}-${index}`}><time>{item.time}</time><span aria-hidden>{index % 2 === 0 ? "❧" : "✦"}</span><div><h3>{item.name}</h3><p>{item.description}</p><small>{item.venue}</small></div></article>)}</div></section>}
      <section className="photo-interlude"><img src={detailPhoto} alt="Wedding rings and olive bouquet" loading="lazy" width={1024} height={1024} /><blockquote>“And so the adventure begins.”</blockquote></section>
      {data.visibility['venue'] && <section className="venue-section"><MapPin aria-hidden /><p className="kicker">Location</p><h2>{data.venue.name}</h2><p>{data.venue.address}</p><div className="venue-sketch" aria-hidden><span>♙</span><span>⌂</span><span>♙</span></div><Button asChild variant="outline"><a href={data.venue.mapUrl} target="_blank" rel="noreferrer">Open in maps</a></Button></section>}
      <section className="details-section"><article><CalendarDays aria-hidden /><p className="script-title">Dress Code</p><p>{data.dressCode}</p></article><article><span className="gift-mark">✦</span><p className="script-title">Gift Preference</p><p>{data.giftNote}</p></article></section>
      {data.rsvp.enabled && data.visibility['rsvp'] && <section className="rsvp-section"><div className="botanical-mark" aria-hidden>❦</div><h2>Confirm Your Attendance</h2><p>To help us prepare for a joyful celebration, kindly confirm your attendance.</p><Rsvp couple={data.couple} {...(invitationId ? { invitationId } : {})} /></section>}
      <footer><p>Hope to see you there!</p><h2>{data.couple.groom} <i>&</i> {data.couple.bride}</h2><img src={sacredHero} alt={`${data.couple.groom} and ${data.couple.bride}`} loading="lazy" width={1024} height={1536} /><div className="monogram">{initials(data)}</div><small>With love, always</small></footer>
    </div>
    {opened && <div className="sound-controls" aria-label="Music controls"><Button size="icon" variant="outline" onClick={async () => { if (!audio.current) return; if (playing) audio.current.pause(); else await audio.current.play(); setPlaying(!playing); }} aria-label={playing ? "Pause music" : "Play music"}>{playing ? <Pause /> : <Music2 />}</Button><Button size="icon" variant="outline" onClick={() => setMuted((value) => !value)} aria-label={muted ? "Unmute music" : "Mute music"}>{muted ? <VolumeX /> : <Volume2 />}</Button></div>}
  </main>;
}
