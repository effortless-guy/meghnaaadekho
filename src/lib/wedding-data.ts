import weddingJson from "@/data/wedding.json";

export type TemplateId = "sacred-garden" | "royal-celebration";

export interface WeddingEvent {
  name: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  description: string;
}

export interface WeddingData {
  couple: { bride: string; groom: string };
  wedding: { date: string; time: string; timezone: string };
  intro: { headline: string; message: string };
  story: string;
  events: WeddingEvent[];
  venue: { name: string; address: string; mapUrl: string };
  gallery: string[];
  dressCode: string;
  giftNote: string;
  contacts: { name: string; phone: string; email?: string }[];
  music: { enabled: boolean; url: string };
  rsvp: { enabled: boolean; questions: string[] };
  template: { templateId: TemplateId };
  visibility: Record<string, boolean>;
  publishing: { status: "draft" | "published" | "unpublished"; slug: string };
}

export const weddingData = weddingJson as WeddingData;

// Kept as a compatibility export for the existing studio module.
export const sampleWedding = weddingData;
