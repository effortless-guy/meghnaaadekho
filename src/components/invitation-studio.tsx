import { useMemo, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Eye, Monitor, Save, Smartphone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { WeddingInvitation } from "@/components/wedding-invitation";
import { sampleWedding, type TemplateId, type WeddingData } from "@/lib/wedding-data";
import sacredHero from "@/assets/sacred-garden-hero.jpg";
import royalHero from "@/assets/royal-celebration-hero.jpg";

const stages = ["Template", "The couple", "Celebration", "Details", "Preview"];

export function InvitationStudio() {
  const [stage, setStage] = useState(0);
  const [device, setDevice] = useState<"mobile" | "desktop">("mobile");
  const [data, setData] = useState<WeddingData>(sampleWedding);
  const [saved, setSaved] = useState(false);
  const update = (changes: Partial<WeddingData>) => { setSaved(false); setData((current) => ({ ...current, ...changes })); };
  const names = useMemo(() => `${data.couple.groom} & ${data.couple.bride}`, [data.couple]);

  return <main className="studio-shell">
    <header className="studio-header"><div><span className="studio-mark">V</span><div><p>Vow & Vine</p><small>Invitation atelier</small></div></div><Button variant="ghost" asChild><a href={`/invite/${data.publishing.slug}`}><Eye />Guest view</a></Button></header>
    <div className="studio-progress" aria-label="Invitation steps">{stages.map((name, index) => <button type="button" key={name} className={index === stage ? "active" : index < stage ? "done" : ""} onClick={() => setStage(index)}><span>{index < stage ? <Check /> : index + 1}</span>{name}</button>)}</div>
    {stage === 0 ? <section className="template-gallery"><div className="studio-intro"><p className="kicker">The collection</p><h1>Choose your invitation</h1><p>Two distinct worlds, crafted to hold the same beautiful story.</p></div><div className="template-grid">
      <TemplateChoice id="sacred-garden" title="Sacred Garden" subtitle="Botanical · Editorial · Serene" image={sacredHero} selected={data.template.templateId === "sacred-garden"} onSelect={(templateId) => update({ template: { templateId } })} />
      <TemplateChoice id="royal-celebration" title="Royal Celebration" subtitle="Indian miniature · Festive · Opulent" image={royalHero} selected={data.template.templateId === "royal-celebration"} onSelect={(templateId) => update({ template: { templateId } })} />
    </div></section> : <div className="studio-workspace"><section className="editor-panel"><p className="kicker">Step {stage + 1} of {stages.length}</p><h1>{stages[stage]}</h1>
      {stage === 1 && <div className="field-stack"><Field label="Partner one" value={data.couple.groom} onChange={(groom) => update({ couple: { ...data.couple, groom } })} /><Field label="Partner two" value={data.couple.bride} onChange={(bride) => update({ couple: { ...data.couple, bride } })} /><Field label="Invitation headline" value={data.intro.headline} onChange={(headline) => update({ intro: { ...data.intro, headline } })} /><LongField label="Welcome message" value={data.intro.message} onChange={(message) => update({ intro: { ...data.intro, message } })} /></div>}
      {stage === 2 && <div className="field-stack"><Field label="Wedding date" type="date" value={data.wedding.date} onChange={(date) => update({ wedding: { ...data.wedding, date } })} /><Field label="Ceremony time" type="time" value={data.wedding.time} onChange={(time) => update({ wedding: { ...data.wedding, time } })} /><LongField label="Your story" value={data.story} onChange={(story) => update({ story })} /><p className="field-note">Your three events are shown in the live preview. Full event editing comes next.</p></div>}
      {stage === 3 && <div className="field-stack"><Field label="Venue" value={data.venue.name} onChange={(name) => update({ venue: { ...data.venue, name } })} /><LongField label="Address" value={data.venue.address} onChange={(address) => update({ venue: { ...data.venue, address } })} /><Field label="Dress code" value={data.dressCode} onChange={(dressCode) => update({ dressCode })} /><LongField label="Gift note" value={data.giftNote} onChange={(giftNote) => update({ giftNote })} /></div>}
      {stage === 4 && <div className="publish-panel"><div className="publish-monogram">{data.couple.groom.charAt(0)}{data.couple.bride.charAt(0)}</div><h2>{names}</h2><p>Your invitation is ready to be shared.</p><Label htmlFor="slug">Invitation link</Label><div className="slug-input"><span>/invite/</span><Input id="slug" value={data.publishing.slug} onChange={(event) => update({ publishing: { ...data.publishing, slug: event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") } })} /></div><Button onClick={() => setSaved(true)}><Save />{saved ? "Draft saved" : "Save draft"}</Button><Button variant="outline" asChild><a href={`/invite/${data.publishing.slug}`}>Preview guest link</a></Button></div>}
      <div className="editor-nav"><Button variant="ghost" disabled={stage === 0} onClick={() => setStage((value) => value - 1)}><ChevronLeft />Back</Button><Button disabled={stage === stages.length - 1} onClick={() => setStage((value) => value + 1)}>Continue<ChevronRight /></Button></div>
    </section><section className="preview-panel"><div className="device-switch"><Button size="icon" variant={device === "mobile" ? "default" : "ghost"} onClick={() => setDevice("mobile")} aria-label="Mobile preview"><Smartphone /></Button><Button size="icon" variant={device === "desktop" ? "default" : "ghost"} onClick={() => setDevice("desktop")} aria-label="Desktop preview"><Monitor /></Button></div><div className={`preview-frame ${device}`}><WeddingInvitation data={data} preview /></div></section></div>}
    {stage === 0 && <div className="gallery-action"><Button size="lg" onClick={() => setStage(1)}>Use this design<ChevronRight /></Button></div>}
  </main>;
}

function TemplateChoice({ id, title, subtitle, image, selected, onSelect }: { id: TemplateId; title: string; subtitle: string; image: string; selected: boolean; onSelect: (id: TemplateId) => void }) {
  return <button type="button" className={`template-choice ${selected ? "selected" : ""}`} onClick={() => onSelect(id)}><div className="template-phone"><img src={image} alt="" width={1024} height={1536} /><div><small>Together with our families</small><strong>{id === "sacred-garden" ? "Rahul & Priya" : "Aarav ✦ Meera"}</strong><span>14 · 02 · 2027</span></div></div><h2>{title}</h2><p>{subtitle}</p>{selected && <span className="selected-mark"><Check /> Selected</span>}</button>;
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) { return <Label>{label}<Input type={type} value={value} onChange={(event) => onChange(event.target.value)} /></Label>; }
function LongField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <Label>{label}<Textarea value={value} rows={4} onChange={(event) => onChange(event.target.value)} /></Label>; }
