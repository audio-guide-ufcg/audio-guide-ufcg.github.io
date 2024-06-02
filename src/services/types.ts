export type TuristPoint = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  entryPrice: number;
  type: string;
  tags: string[];
  transcript: TuristTranscript;
  images: TuristImage[];
  audio: TuristAudio;
  email?: string;
  telephone?: string;
  language: "pt" | "en";
  shouldContact: boolean;
  day1: string;
  day2: string;
  day3: string;
  day4: string;
  day5: string;
  day6: string;
  day7: string;
};

export type TuristImage = {
  id: string;
  credits: string;
  description?: string;
};

export type TuristAudio = {
  path: string;
  language: "pt" | "en";
  duration: number;
};

export type TuristTranscript = {
  path: string;
  language: "pt" | "en";
  duration: number;
  text: string;
};

export type Coords = {
  longitude: number;
  latitude: number;
};
