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

// === Dashboard entities ===

export interface Order {
  id: number;
  user_id: number;
  booster_id: number | null;
  service_type: string;
  config: Record<string, unknown>;
  price: string;
  status: "pending" | "active" | "available" | "in_progress" | "completed" | "cancelled";
  notes: string | null;
  created_at: string;
  updated_at: string;
  // joined fields
  user_name?: string;
  booster_name?: string;
}

export interface DashboardUser {
  id: number;
  name: string;
  email: string;
  role: "user" | "booster" | "admin";
  created_at: string;
}

export interface Message {
  id: number;
  order_id: number;
  user_id: number;
  content: string;
  is_system: boolean;
  created_at: string;
  sender_name?: string;
  sender_role?: string;
}

export interface Booster {
  id: number;
  user_id: number;
  game_name: string;
  rank: string;
  win_rate: string;
  games_played: number;
  avatar_emoji: string;
  active: boolean;
  created_at: string;
  // joined
  user_name?: string;
  user_email?: string;
}

export interface Withdrawal {
  id: number;
  booster_id: number;
  amount: string;
  pix_key: string;
  pix_type: "cpf" | "email" | "phone" | "random";
  status: "pending" | "approved" | "rejected";
  admin_notes: string | null;
  created_at: string;
  processed_at: string | null;
  // joined
  booster_name?: string;
  user_name?: string;
}

export interface WalletSummary {
  total_earned: number;
  available_balance: number;
  pending_withdrawals: number;
}
