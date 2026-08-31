export interface Listing {
  id: string;
  title: string;
  price: number;
  type: "sell" | "resale" | "rent" | "free";
  category: string;
  condition: "New" | "Good" | "Fair" | "Damaged";
  image: string;
  description: string;
  listingCount: number;
  createdAt: string;
  seller: {
    alias: string;
    repScore: number;
    dealCount: number;
  };
}

export const categories = [
  "All",
  "Electronics",
  "Books",
  "Furniture",
  "Cycles",
  "Clothing",
  "Gaming",
    "Room Essentials",
  "Music",
  "Sports",
  "Stationery",
  "Other",
];

export const mockListings: Listing[] = [
  {
    id: "1",
    title: "Sony WH-1000XM4 Headphones",
    price: 12500,
    type: "sell",
    category: "Electronics",
    condition: "Good",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop",
    description: "Barely used Sony WH-1000XM4 with noise cancelling. All accessories included.",
    listingCount: 3,
    createdAt: "2026-03-15",
    seller: { alias: "TechGuru42", repScore: 4.8, dealCount: 12 },
  },
  {
    id: "2",
    title: "Engineering Mathematics Textbook",
    price: 350,
    type: "resale",
    category: "Books",
    condition: "Fair",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop",
    description: "B.S. Grewal Higher Engineering Mathematics. Some highlighting inside.",
    listingCount: 1,
    createdAt: "2026-03-14",
    seller: { alias: "BookWorm99", repScore: 4.5, dealCount: 8 },
  },
  {
    id: "3",
    title: "Study Desk + Chair Combo",
    price: 200,
    type: "rent",
    category: "Furniture",
    condition: "Good",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&h=400&fit=crop",
    description: "Sturdy wooden desk with adjustable chair. ₹200/day rent. Perfect for exam season.",
    listingCount: 2,
    createdAt: "2026-03-13",
    seller: { alias: "FurnitureKing", repScore: 4.9, dealCount: 25 },
  },
  {
    id: "4",
    title: "Firefox Cycle 26 inch",
    price: 4500,
    type: "sell",
    category: "Cycles",
    condition: "Good",
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=400&fit=crop",
    description: "Firefox Pro cycle, 21 gear, well maintained. Minor scratches on body.",
    listingCount: 1,
    createdAt: "2026-03-12",
    seller: { alias: "CycleRider", repScore: 4.6, dealCount: 5 },
  },
  {
    id: "5",
    title: "Old Room Mattress Topper",
    price: 0,
    type: "free",
    category: "Room Essentials",
    condition: "Fair",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=400&fit=crop",
    description: "Free mattress topper, slightly used. Pick up from Room 312.",
    listingCount: 1,
    createdAt: "2026-03-11",
    seller: { alias: "GiveawayGuru", repScore: 4.3, dealCount: 3 },
  },
  {
    id: "6",
    title: 'Samsung Monitor 24" FHD',
    price: 8900,
    type: "sell",
    category: "Electronics",
    condition: "New",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop",
    description: "Brand new Samsung 24 inch monitor. Still in box with warranty card.",
    listingCount: 1,
    createdAt: "2026-03-16",
    seller: { alias: "ScreenDeals", repScore: 5.0, dealCount: 2 },
  },
  {
    id: "7",
    title: "Arduino Starter Kit",
    price: 1200,
    type: "sell",
    category: "Electronics",
    condition: "New",
    image: "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=400&h=400&fit=crop",
    description: "Complete Arduino Uno starter kit with sensors, breadboard, and wires.",
    listingCount: 2,
    createdAt: "2026-03-10",
    seller: { alias: "MakerSpace", repScore: 4.7, dealCount: 9 },
  },
  {
    id: "8",
    title: "Room Fairy Lights",
    price: 0,
    type: "free",
    category: "Room Essentials",
    condition: "Good",
    image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=400&h=400&fit=crop",
    description: "LED fairy lights (10m). Work perfectly, just redecorated room. Free pickup.",
    listingCount: 1,
    createdAt: "2026-03-09",
    seller: { alias: "LightItUp", repScore: 4.4, dealCount: 7 },
  },
];

export const heroSlides: {
  title: string;
  category: string;
  price: number;
  condition: "New" | "Good" | "Fair" | "Damaged";
  image: string;
}[] = [
  {
    title: "Sony WH-1000XM4",
    category: "Electronics",
    price: 12500,
    condition: "New",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&h=600&fit=crop",
  },
  {
    title: "Engineering Maths Book",
    category: "Books",
    price: 350,
    condition: "Fair",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=600&fit=crop",
  },
  {
    title: "Firefox Pro Cycle",
    category: "Cycles",
    price: 4500,
    condition: "Good",
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=500&h=600&fit=crop",
  },
];
