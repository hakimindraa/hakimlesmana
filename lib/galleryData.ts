export type GalleryCategory =
  | "All"
  | "Landscape"
  | "Urban"
  | "Portrait"
  | "Nature"
  | "Event";

export interface GalleryPhoto {
  id: number;
  title: string;
  src: string;
  category: GalleryCategory;
}

export const categories: GalleryCategory[] = [
  "All",
  "Landscape",
  "Urban",
  "Portrait",
  "Nature",
  "Event",
];

export const allPhotos: GalleryPhoto[] = [
  // ── Landscape ──
  {
    id: 1,
    title: "Nature's Whispers",
    src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=800",
    category: "Landscape",
  },
  {
    id: 2,
    title: "Mountain Majesty",
    src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800",
    category: "Landscape",
  },
  {
    id: 3,
    title: "Golden Hour",
    src: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
    category: "Landscape",
  },
  {
    id: 4,
    title: "Misty Peaks",
    src: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&q=80&w=800",
    category: "Landscape",
  },
  {
    id: 5,
    title: "Desert Sands",
    src: "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&q=80&w=800",
    category: "Landscape",
  },

  // ── Urban ──
  {
    id: 6,
    title: "Urban Solitude",
    src: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=800",
    category: "Urban",
  },
  {
    id: 7,
    title: "City Lights",
    src: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=800",
    category: "Urban",
  },
  {
    id: 8,
    title: "Night Streets",
    src: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&q=80&w=800",
    category: "Urban",
  },
  {
    id: 9,
    title: "Skyline View",
    src: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&q=80&w=800",
    category: "Urban",
  },

  // ── Nature ──
  {
    id: 10,
    title: "Forest Path",
    src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800",
    category: "Nature",
  },
  {
    id: 11,
    title: "Quiet Lake",
    src: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&q=80&w=800",
    category: "Nature",
  },
  {
    id: 12,
    title: "Winter Silence",
    src: "https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?auto=format&fit=crop&q=80&w=800",
    category: "Nature",
  },
  {
    id: 13,
    title: "Starlit Sky",
    src: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&q=80&w=800",
    category: "Nature",
  },
  {
    id: 14,
    title: "Ocean's Edge",
    src: "https://images.unsplash.com/photo-1505118380757-91f5f45d8de4?auto=format&fit=crop&q=80&w=800",
    category: "Nature",
  },

  // ── Portrait ──
  {
    id: 15,
    title: "Candid Moment",
    src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800",
    category: "Portrait",
  },
  {
    id: 16,
    title: "Studio Portrait",
    src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800",
    category: "Portrait",
  },
  {
    id: 17,
    title: "Natural Light",
    src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800",
    category: "Portrait",
  },
  {
    id: 18,
    title: "Golden Portrait",
    src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800",
    category: "Portrait",
  },

  // ── Event ──
  {
    id: 19,
    title: "Wedding Bliss",
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
    category: "Event",
  },
  {
    id: 20,
    title: "Concert Night",
    src: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&q=80&w=800",
    category: "Event",
  },
  {
    id: 21,
    title: "Celebration",
    src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800",
    category: "Event",
  },
  {
    id: 22,
    title: "Party Vibes",
    src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800",
    category: "Event",
  },
];
