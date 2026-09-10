export interface Person {

  fullName: string;

  shortName: string;

  title?: string;

  photo?: string;
}

export interface Parents {

  father: string;

  mother: string;

  address?: string;

  prefix?: string;
}

export interface WeddingDate {

  iso: string;

  weekday: string;

  day: string;

  month: string;

  year: string;

  time?: string;

  lunar?: string;
}

export interface WeddingEvent {

  label: string;

  venueName: string;

  address?: string;

  date: WeddingDate;

  mapUrl?: string;

  mapEmbedUrl?: string;

  coordinates?: { lat: number; lng: number };
}

export interface ScheduleItem {

  time: string;

  activity: string;

  main?: boolean;

  estimate?: boolean;
}

export interface GalleryImage {
  src: string;
  alt?: string;
}

export interface GiftAccount {

  owner: string;
  bankName?: string;
  accountNumber?: string;
  accountHolder?: string;

  qrImage?: string;
}

export interface Wish {
  id: string;
  name: string;
  message: string;

  invitedAs?: string;

  createdAt: string;
}

export type RsvpStatus = "attending_1" | "attending_2" | "declined";

export interface RsvpRecord {
  id: string;
  guestId?: string;
  guestName: string;
  status: RsvpStatus;
  headcount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ThemeColorCustomization {

  presetId?: string;

  primaryColor?: string;

  secondaryColor?: string;

  backgroundColor?: string;

  cardColor?: string;

  textColor?: string;
}

export interface ThemeConfig {

  template:
    | "olive-wax-seal"
    | "holymaiden-rose"
    | "luxury-gold-black"
    | "song-hy-do";

  music?: string;

  colors?: ThemeColorCustomization;
}

export interface WeddingData {
  groom: Person;
  bride: Person;
  groomParents: Parents;
  brideParents: Parents;

  welcomeText?: string;

  ceremony: WeddingEvent;

  reception: WeddingEvent;
  schedule: ScheduleItem[];
  gallery: GalleryImage[];

  triptychPhoto?: string;

  closingPhoto?: string;
  giftAccounts: GiftAccount[];

  thankYouText?: string;
  theme: ThemeConfig;
}

export interface SectionProps {
  data: WeddingData;
  className?: string;
}
