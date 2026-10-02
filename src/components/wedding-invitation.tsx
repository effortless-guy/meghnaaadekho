import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { Check, MapPin, Volume2, VolumeX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import type { WeddingData } from "@/lib/wedding-data";
import sacredHero from "@/assets/sacred-garden-hero.jpg";
import royalHero from "@/assets/royal-celebration-hero.jpg";
import detailPhoto from "@/assets/wedding-detail.jpg";
import envelopePaper from "@/assets/envelope-paper.jpg.asset.json";
import waxSeal from "@/assets/wax-seal.png.asset.json";
import classicalTune from "@/assets/classical-canon.mp3.asset.json";
import archLoop from "@/assets/arch-swan-loop.mp4.asset.json";
import archLoopWebm from "@/assets/arch-swan-loop.webm.asset.json";
import archPoster from "@/assets/arch-swan-poster.jpg.asset.json";
import ganeshBlessing from "@/assets/ganesh-blessing.png.asset.json";
import venueGardenPalace from "@/assets/venue-garden-palace.jpg";

const SPARKLES: [number, number, number][] = [[22, 18, 0], [74, 14, .35], [15, 42, .7], [84, 38, .2], [30, 62, .9], [70, 66, .5], [18, 84, 1.1], [80, 86, .8], [48, 30, 1.3], [52, 76, 1.5], [36, 50, 1.7], [64, 46, 1.9]];

function initials(data: WeddingData) {
  return `${data.couple.groom.charAt(0)}&${data.couple.bride.charAt(0)}`;
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

function ScratchHeart({ label, value }: { label: string; value: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ratio = window.devicePixelRatio || 1;
    const size = canvas.getBoundingClientRect().width;
    canvas.width = size * ratio;
    canvas.height = size * ratio;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.scale(ratio, ratio);
    context.fillStyle = "#d6b75f";
    context.beginPath();
    context.moveTo(size / 2, size * .86);
    context.bezierCurveTo(size * .42, size * .72, size * .08, size * .54, size * .1, size * .29);
    context.bezierCurveTo(size * .12, size * .05, size * .4, size * .02, size / 2, size * .22);
    context.bezierCurveTo(size * .6, size * .02, size * .88, size * .05, size * .9, size * .29);
    context.bezierCurveTo(size * .92, size * .54, size * .58, size * .72, size / 2, size * .86);
    context.fill();
    context.globalCompositeOperation = "source-atop";
    const sheen = context.createLinearGradient(0, 0, size, size);
    sheen.addColorStop(0, "rgba(255,255,255,.6)");
    sheen.addColorStop(.4, "rgba(255,255,255,0)");
    sheen.addColorStop(1, "rgba(117,70,20,.22)");
    context.fillStyle = sheen;
    context.fillRect(0, 0, size, size);
  }, []);

  return <div className={`scratch-heart ${revealed ? "is-revealed" : ""}`}>
    <div><small>{label}</small><strong>{value}</strong></div>
    <canvas
      ref={canvasRef}
      role="button"
      tabIndex={0}
      aria-label={`Reveal ${label}`}
      onClick={() => setRevealed(true)}
      onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setRevealed(true); }}
    />
  </div>;
}

function SaveTheDate({ date }: { date: string }) {
  const weddingDate = new Date(`${date}T12:00:00`);
  const day = new Intl.DateTimeFormat("en", { weekday: "short" }).format(weddingDate);
  const number = new Intl.DateTimeFormat("en", { day: "numeric" }).format(weddingDate);
  const month = new Intl.DateTimeFormat("en", { month: "short" }).format(weddingDate);
  return <section className="save-date-section reveal">
    <p className="kicker">Save the date</p>
    <h2>Gently tap to reveal<br />our wedding date</h2>
    <div className="scratch-hearts">
      <ScratchHeart label="Day" value={day} />
      <ScratchHeart label="Date" value={number} />
      <ScratchHeart label="Month" value={month} />
    </div>
    <p className="scratch-note">Tap each heart</p>
  </section>;
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
  const [opening, setOpening] = useState(false);
  const [gateGone, setGateGone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);
  const royal = data.template.templateId === "royal-celebration";
  const dateLabel = new Intl.DateTimeFormat("en", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${data.wedding.date}T12:00:00`));
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
    window.setTimeout(() => setOpened(true), 6400);
    window.setTimeout(() => setGateGone(true), 8800);
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
      <SaveTheDate date={data.wedding.date} />
      <section className="portrait-panel reveal"><img src={royal ? royalHero : sacredHero} alt="Wedding couple in a ceremonial garden" width={1024} height={1536} /><div><p>Two souls</p><h2>One destiny</h2><span>A lifetime, written with love</span></div><span className="floral-edge floral-edge-left" aria-hidden>❦</span><span className="floral-edge floral-edge-right" aria-hidden>❦</span></section>
      {!royal && <section className="letter-section ornamented torn-sheet reveal"><div className="botanical-mark" aria-hidden>❦</div><p className="kicker">Dear friends & family</p><h2>Our favourite chapter begins</h2><p>{data.intro.message}</p><p>{data.story}</p><div className="monogram">{initials(data)}</div><span className="fine-rule" /></section>}
      {royal && <section className="royal-proclamation"><div className="sun-mark">☼</div><p className="kicker">With the blessings of our families</p><h2>Two hearts. One celebration.</h2><p>{data.intro.message}</p></section>}
      <section className="countdown-section reveal"><div className="botanical-mark" aria-hidden>❦</div><p className="kicker">The celebration begins in</p><Countdown date={data.wedding.date} /></section>
      {data.visibility['events'] && <section className="events-section ornamented torn-sheet reveal"><p className="kicker">Schedule of events</p><h2>{royal ? "Wedding festivities" : "A day to remember"}</h2><div className="event-list">{data.events.map((item, index) => <article key={`${item.name}-${index}`}><time>{item.time}</time><span aria-hidden>{index % 2 === 0 ? "❧" : "✦"}</span><div><h3>{item.name}</h3><p>{item.description}</p><small>{item.venue}</small></div></article>)}</div></section>}
      <section className="photo-interlude reveal"><img src={detailPhoto} alt="Wedding rings and olive bouquet" loading="lazy" width={1024} height={1024} /><blockquote>“And so the adventure begins.”</blockquote></section>
      {data.visibility['venue'] && <section className="venue-section reveal"><MapPin aria-hidden /><p className="kicker">Location</p><h2>{data.venue.name}</h2><p>{data.venue.address}</p><img className="venue-art" src={venueGardenPalace} alt="Watercolor garden palace at the wedding location" loading="lazy" width={1024} height={1280} /><Button asChild variant="outline"><a href={data.venue.mapUrl} target="_blank" rel="noreferrer">Open in maps</a></Button></section>}
      {data.rsvp.enabled && data.visibility['rsvp'] && <section className="rsvp-section torn-sheet reveal"><div className="botanical-mark" aria-hidden>❦</div><h2>Confirm Your Attendance</h2><p>To help us prepare for a joyful celebration, kindly confirm your attendance.</p><Rsvp couple={data.couple} {...(invitationId ? { invitationId } : {})} /></section>}
      <footer className="reveal"><p>Hope to see you there!</p><h2>{data.couple.groom} <i>&</i> {data.couple.bride}</h2><img src={sacredHero} alt={`${data.couple.groom} and ${data.couple.bride}`} loading="lazy" width={1024} height={1536} /><div className="monogram">{initials(data)}</div><small>With love, always</small></footer>
    </div>
    <div className="sound-controls" aria-label="Music"><Button size="icon" variant="outline" onClick={toggleMusic} aria-pressed={playing} aria-label={playing ? "Turn music off" : "Turn music on"}>{playing ? <Volume2 /> : <VolumeX />}</Button></div>
  </main>;
}
