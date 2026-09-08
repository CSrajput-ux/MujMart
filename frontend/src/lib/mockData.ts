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

// No dummy listings — all listings are loaded dynamically from the backend database
export const mockListings: Listing[] = [];

export const heroSlides = [
  {
    title: "Campus Marketplace for Students",
    category: "Marketplace",
    description: "The premium marketplace built exclusively for MUJ students. Buy, sell, and trade within your campus.",
  },
  {
    title: "Semester Rentals & Deals",
    category: "Rentals",
    description: "Save on books, study desks, cycles, and room essentials for your semester.",
  },
  {
    title: "Free Giveaways & Thrifting",
    category: "Thrift",
    description: "Explore free giveaways and verified second-hand student deals right at MUJ.",
  },
];

