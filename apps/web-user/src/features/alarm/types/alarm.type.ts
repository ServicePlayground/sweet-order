export interface Alarm {
  id: string;
  imageUrl?: string;
  title: string;
  content: string;
  date: string; // "오늘" | "어제" | "YYYY.MM.DD"
  time: string; // "HH:MM"
}
