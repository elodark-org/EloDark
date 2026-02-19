export interface Game {
  id: string;
  name: string;
  slug: string;
  image: string;
  startingPrice: string;
  badge?: "popular" | "new";
  badgeColor?: string;
  accentColor?: string;
}

export interface Review {
  id: string;
  name: string;
  avatar: string;
  game: string;
  gameColor: string;
  rating: number;
  text: string;
  date: string;
  verified: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Step {
  number: string;
  title: string;
  description: string;
  icon: string;
  color: "purple" | "cyan" | "gold";
}
