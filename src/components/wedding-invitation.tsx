import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent, type PointerEvent as ReactPointerEvent } from "react";
import { ArrowUpRight, CalendarDays, Check, HeartHandshake, Mail, MapPin, MessageCircle, Phone, Volume2, VolumeX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import type { WeddingData } from "@/lib/wedding-data";
import sacredHero from "@/assets/sacred-garden-hero.jpg";
import royalHero from "@/assets/royal-celebration-hero.jpg";
import envelopePaper from "@/assets/envelope-paper.jpg.asset.json";
import waxSeal from "@/assets/wax-seal.png.asset.json";
import classicalTune from "@/assets/classical-canon.mp3.asset.json";
import archLoop from "@/assets/arch-swan-loop.mp4.asset.json";
import archLoopWebm from "@/assets/arch-swan-loop.webm.asset.json";
import archPoster from "@/assets/arch-swan-poster.jpg.asset.json";
import ganeshBlessing from "@/assets/ganesh-blessing.png.asset.json";
import venueGardenPalace from "@/assets/venue-garden-palace.jpg";
import transitionRose from "@/assets/transition-rose-left.png";
import transitionJasmine from "@/assets/transition-jasmine-right.png";
import transitionLotus from "@/assets/transition-lotus-left.png";
import transitionMarigold from "@/assets/transition-marigold-right.png";

const SPARKLES: [number, number, number][] = [[22, 18, 0], [74, 14, .35], [15, 42, .7], [84, 38, .2], [30, 62, .9], [70, 66, .5], [18, 84, 1.1], [80, 86, .8], [48, 30, 1.3], [52, 76, 1.5], [36, 50, 1.7], [64, 46, 1.9]];

function initials(data: WeddingData) {
  return `${data.couple.groom.charAt(0)}&${data.couple.bride.charAt(0)}`;
}

function Countdown({ date }: { date: string }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  const values = useMemo(() => {
    if (now === null) return [
      { label: "Days", value: "—" },
      { label: "Hours", value: "—" },
      { label: "Minutes", value: "—" },
      { label: "Seconds", value: "—" },
    ];
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

function traceHeart(context: CanvasRenderingContext2D, size: number) {
  context.beginPath();
  context.moveTo(size / 2, size * .86);
  context.bezierCurveTo(size * .42, size * .73, size * .12, size * .54, size * .12, size * .3);
  context.bezierCurveTo(size * .12, size * .08, size * .39, size * .02, size / 2, size * .22);
  context.bezierCurveTo(size * .61, size * .02, size * .88, size * .08, size * .88, size * .3);
  context.bezierCurveTo(size * .88, size * .54, size * .58, size * .73, size / 2, size * .86);
  context.closePath();
}

function ScratchHeart({ label, value, onReveal }: { label: string; value: string; onReveal: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const revealed = useRef(false);
  const initialVisibleSamples = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const size = 180;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * ratio;
    canvas.height = size * ratio;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.scale(ratio, ratio);
    const finish = context.createLinearGradient(20, 20, 160, 160);
    finish.addColorStop(0, "#b98a2d");
    finish.addColorStop(.42, "#f6dfa0");
    finish.addColorStop(.68, "#d4a94b");
    finish.addColorStop(1, "#9b6720");
    traceHeart(context, size);
    context.fillStyle = finish;
    context.fill();
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    for (let index = 3; index < pixels.length; index += 64) if ((pixels[index] ?? 0) > 16) initialVisibleSamples.current += 1;
  }, []);

  function point(event: ReactPointerEvent<HTMLCanvasElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    return { x: (event.clientX - bounds.left) * (180 / bounds.width), y: (event.clientY - bounds.top) * (180 / bounds.height) };
  }

  function scratch(event: ReactPointerEvent<HTMLCanvasElement>) {
    if (!drawing.current || revealed.current) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    const next = point(event);
    const previous = lastPoint.current ?? next;
    const ratio = canvas.width / 180;
    context.save();
    context.scale(ratio, ratio);
    context.globalCompositeOperation = "destination-out";
    context.lineWidth = 22;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.beginPath();
    context.moveTo(previous.x, previous.y);
    context.lineTo(next.x, next.y);
    context.stroke();
    context.restore();
    lastPoint.current = next;
  }

  function measure() {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { willReadFrequently: true });
    if (!canvas || !context || revealed.current) return;
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let visible = 0;
    for (let index = 3; index < pixels.length; index += 64) if ((pixels[index] ?? 0) > 16) visible += 1;
    if (initialVisibleSamples.current > 0 && visible / initialVisibleSamples.current < .46) {
      revealed.current = true;
      canvas.classList.add("is-cleared");
      onReveal();
    }
  }

  function revealForKeyboard() {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context || revealed.current) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    revealed.current = true;
    canvas.classList.add("is-cleared");
    onReveal();
  }

  return <div className="scratch-heart">
    <div><small>{label}</small><strong>{value}</strong></div>
    <canvas ref={canvasRef} role="button" tabIndex={0} aria-label={`Scratch to reveal ${label}`} onPointerDown={(event) => { drawing.current = true; lastPoint.current = point(event); event.currentTarget.setPointerCapture(event.pointerId); scratch(event); }} onPointerMove={scratch} onPointerUp={(event) => { drawing.current = false; lastPoint.current = null; event.currentTarget.releasePointerCapture(event.pointerId); measure(); }} onPointerCancel={() => { drawing.current = false; lastPoint.current = null; }} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); revealForKeyboard(); } }} />
  </div>;
}

const transitionFlowers = {
  rose: transitionRose,
  jasmine: transitionJasmine,
  lotus: transitionLotus,
  marigold: transitionMarigold,
};

function FloralBreak({ flower, side }: { flower: keyof typeof transitionFlowers; side: "left" | "right" }) {
  return <img className={`page-flower page-flower-${side}`} src={transitionFlowers[flower]} alt="" loading="lazy" width={816} height={816} aria-hidden />;
}

function Rsvp({ invitationId, couple, googleFormUrl }: { invitationId?: string; couple: WeddingData["couple"]; googleFormUrl?: string }) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [familySide, setFamilySide] = useState("bride");
  const [partySize, setPartySize] = useState("1");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const guestName = String(form.get("name") ?? "").trim();
    if (!guestName || guestName.length > 100) { setError("Please enter your name."); return; }
    const details = [
      `Family: ${familySide === "bride" ? `${couple.bride}'s side` : `${couple.groom}'s side`}`,
      `Song: ${String(form.get("song") ?? "").trim() || "Not provided"}`,
      `Children: ${String(form.get("children") ?? "").trim() || "None listed"}`,
    ].join("\n");
    const response = {
      guest_name: guestName,
      attending: true,
      party_size: Math.min(20, Math.max(1, Number(partySize))),
      dietary_requirements: "",
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
  if (googleFormUrl) return <Button asChild size="lg" className="invitation-action rsvp-open"><a href={googleFormUrl} target="_blank" rel="noreferrer"><HeartHandshake aria-hidden /><span>Open RSVP</span><ArrowUpRight className="action-arrow" aria-hidden /></a></Button>;

  return <Dialog>
    <DialogTrigger asChild><Button size="lg" className="invitation-action rsvp-open"><HeartHandshake aria-hidden /><span>Open RSVP</span><ArrowUpRight className="action-arrow" aria-hidden /></Button></DialogTrigger>
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
  const [opening, setOpening] = useState(false);
  const [gateGone, setGateGone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);
  const royal = data.template.templateId === "royal-celebration";
  const [revealedDateParts, setRevealedDateParts] = useState<string[]>([]);
  const datedEvents = data.events.filter((event) => event.date.trim().length > 0);
  const weddingDate = new Date(`${data.wedding.date}T12:00:00`);
  const dateParts = [
    { label: "Day", value: new Intl.DateTimeFormat("en", { day: "2-digit" }).format(weddingDate) },
    { label: "Month", value: new Intl.DateTimeFormat("en", { month: "short" }).format(weddingDate) },
    { label: "Year", value: new Intl.DateTimeFormat("en", { year: "numeric" }).format(weddingDate) },
  ];
  const shortDate = data.wedding.date.split("-").reverse().map((part, index) => index === 2 ? part.slice(2) : part).join(".");
  const audioSrc = data.music.url || classicalTune.url;
  useEffect(() => { if (!playing) audio.current?.pause(); }, [playing]);
  useEffect(() => { if (audio.current) audio.current.muted = muted; }, [muted]);
  const story = useRef<HTMLDivElement>(null);
  const coverVideo = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = coverVideo.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => undefined);
  }, [opening]);
  useEffect(() => {
    if (!opened || !story.current) return;
    const targets = story.current.querySelectorAll<HTMLElement>(".reveal");
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } }), { threshold: 0.18 });
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [opened]);
  function open() {
    if (opening) return;
    setOpening(true);
    window.setTimeout(() => setOpened(true), 5800);
    window.setTimeout(() => setGateGone(true), 8000);
  }
  async function toggleMusic() {
    if (!audio.current) return;
    if (playing) { audio.current.pause(); setPlaying(false); return; }
    try { audio.current.volume = 0.55; await audio.current.play(); setPlaying(true); } catch { setPlaying(false); }
  }
  return <main className={`invitation ${royal ? "royal" : "garden"} ${preview ? "is-preview" : ""} ${opened ? "is-open" : "is-closed"}`}>
    <audio ref={audio} src={audioSrc} loop preload="auto" />
    {!gateGone && <div className={`envelope-gate ${opening ? "is-opening" : ""} ${opened ? "is-leaving" : ""}`} onClick={open}>
      <div className="envelope" onClick={open} style={{ "--env-paper": `url(${envelopePaper.url})` } as CSSProperties}>
        <div className="envelope-glow" aria-hidden />
        {(["left", "right", "bottom", "top"] as const).map((side) => <div key={side} className={`env-flap env-flap-${side}`} aria-hidden><div className="env-face env-front" /><div className="env-face env-back" /></div>)}
        <div className="envelope-shine" aria-hidden />
        <div className="envelope-sparkles" aria-hidden>{SPARKLES.map(([x, y, d], i) => <i key={i} style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${d}s` }} />)}</div>
        <button type="button" className="wax-seal" onClick={(event) => { event.stopPropagation(); open(); }} aria-label="Tap to open invitation"><img src={waxSeal.url} alt="" draggable={false} /><span>{initials(data)}</span></button>
      </div>
      <p className="envelope-prompt"><span aria-hidden>↑</span> Tap to open</p>
      <div className="envelope-flash" aria-hidden />
    </div>}
    <div className="invitation-story" ref={story} aria-hidden={!opened}>
      <section className="invitation-cover arch-cover">
        <video ref={coverVideo} className="arch-cover-art" poster={archPoster.url} autoPlay muted loop playsInline preload="auto" aria-hidden><source src={archLoop.url} type="video/mp4" /><source src={archLoopWebm.url} type="video/webm" /></video>
        <div className="arch-cover-copy"><img className="cover-ganesh" src={ganeshBlessing.url} alt="Lord Ganesh blessing symbol" width={768} height={768} /><p className="arch-label">Wedding Day</p><time>{shortDate}</time><h1><span>{data.couple.groom}</span><i>&</i><span>{data.couple.bride}</span></h1><p className="arch-label arch-scroll">Scroll down</p><span className="arch-chevron" aria-hidden /></div>
      </section>
      <section className="portrait-panel story-break reveal"><img src={royal ? royalHero : sacredHero} alt="Wedding couple in a ceremonial garden" width={1024} height={1536} /><div><p>Two souls</p><h2>One destiny</h2><span>A lifetime, written with love</span></div></section>
      {!royal && <section className="letter-section ornamented torn-sheet reveal"><FloralBreak flower="rose" side="left" /><div className="botanical-mark" aria-hidden>❦</div><p className="kicker">Dear friends & family</p><h2>Our favourite chapter begins</h2><p>{data.intro.message}</p><p>{data.story}</p><div className="monogram">{initials(data)}</div><span className="fine-rule" /></section>}
      {royal && <section className="royal-proclamation"><div className="sun-mark">☼</div><p className="kicker">With the blessings of our families</p><h2>Two hearts. One celebration.</h2><p>{data.intro.message}</p></section>}
      {/* Set this to true to restore the JSON-driven “Dates to remember” page. */}
      {false && datedEvents.length > 0 && <section className="event-dates-section torn-sheet reveal"><FloralBreak flower="marigold" side="right" /><CalendarDays className="event-dates-icon" aria-hidden /><p className="kicker">Mark your calendar</p><h2>Dates to remember</h2><div className="event-date-list">{datedEvents.map((item, index) => <article key={`${item.name}-${item.date}-${index}`}><span aria-hidden>{index % 2 === 0 ? "❦" : "✦"}</span><div><h3>{item.name}</h3><time>{item.date}</time></div></article>)}</div></section>}
      <section className="countdown-section save-date-section torn-sheet reveal"><FloralBreak flower="jasmine" side="left" /><p className="kicker">Save the date</p><h2>Scratch below to reveal<br />our wedding date</h2><div className="scratch-hearts">{dateParts.map((part) => <ScratchHeart key={part.label} {...part} onReveal={() => setRevealedDateParts((current) => current.includes(part.label) ? current : [...current, part.label])} />)}</div><p className={`scratch-note ${revealedDateParts.length === dateParts.length ? "is-hidden" : ""}`}>Gently scratch each heart</p><div className={`revealed-countdown ${revealedDateParts.length === dateParts.length ? "is-visible" : ""}`} aria-hidden={revealedDateParts.length !== dateParts.length}><p>The celebration begins in</p><Countdown date={data.wedding.date} /></div></section>
      {data.visibility['events'] && <section className="events-section ornamented torn-sheet reveal"><FloralBreak flower="lotus" side="left" /><p className="kicker">Schedule of events</p><h2>{royal ? "Wedding festivities" : "A day to remember"}</h2><div className="event-list">{data.events.map((item, index) => <article key={`${item.name}-${index}`}><time>{item.time}</time><span aria-hidden>{index % 2 === 0 ? "❧" : "✦"}</span><div><h3>{item.name}</h3><p>{item.description}</p><small>{item.venue}</small></div></article>)}</div></section>}
      {data.visibility['venue'] && <section className="venue-section torn-sheet reveal"><FloralBreak flower="marigold" side="right" /><MapPin aria-hidden /><p className="kicker">Location</p><h2>{data.venue.name}</h2><p>{data.venue.address}</p><img className="venue-art" src={venueGardenPalace} alt="Watercolor garden palace at the wedding location" loading="lazy" width={1024} height={1280} /><Button asChild variant="outline" className="invitation-action map-action"><a href={data.venue.mapUrl} target="_blank" rel="noreferrer"><MapPin aria-hidden /><span>Open in maps</span><ArrowUpRight className="action-arrow" aria-hidden /></a></Button></section>}
      {data.rsvp.enabled && data.visibility['rsvp'] && <section className="rsvp-section torn-sheet reveal"><FloralBreak flower="rose" side="left" /><div className="botanical-mark" aria-hidden>❦</div><h2>Confirm Your Attendance</h2><p>To help us prepare for a joyful celebration, kindly confirm your attendance.</p><Rsvp couple={data.couple} googleFormUrl={data.rsvp.googleFormUrl} {...(invitationId ? { invitationId } : {})} /></section>}
      <footer className="story-break reveal"><FloralBreak flower="jasmine" side="right" /><div className="footer-ornament" aria-hidden>❦</div><p>Hope to see you there!</p><h2>{data.couple.groom} <i>&</i> {data.couple.bride}</h2><span className="footer-rule" /><p className="contact-intro">For any questions, please contact</p><div className="contact-list" aria-label="Contact the wedding party">{data.contacts.map((contact) => <div className="contact-person" key={`${contact.name}-${contact.phone}`}>{contact.photo ? <img className="contact-photo" src={contact.photo} alt={`${contact.name} contact`} loading="lazy" /> : <span className="contact-initial" aria-hidden>{contact.name.charAt(0)}</span>}<div className="contact-details"><strong>{contact.name}</strong><a href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}><Phone aria-hidden /><span>{contact.phone}</span></a>{contact.email && <a href={`mailto:${contact.email}`}><Mail aria-hidden /><span>{contact.email}</span></a>}{contact.whatsapp && <a className="whatsapp-link" href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer"><MessageCircle aria-hidden /><span>WhatsApp</span><ArrowUpRight className="contact-arrow" aria-hidden /></a>}</div></div>)}</div><div className="monogram">{initials(data)}</div><small>With love, always</small></footer>
    </div>
    <div className="sound-controls" aria-label="Music"><Button size="icon" variant="outline" onClick={toggleMusic} aria-pressed={playing} aria-label={playing ? "Turn music off" : "Turn music on"}>{playing ? <Volume2 /> : <VolumeX />}</Button></div>
  </main>;
}
