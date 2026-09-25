export type Profile = {
  id: number;
  username: string;
  email: string;
  is_admin: boolean;
  bio: string;
  avatar_url: string;
  xp: number;
  level: number;
  problems_solved: number;
  total_submissions: number;
  accepted_submissions: number;
  acceptance_rate: number;
  current_streak: number;
  longest_streak: number;
  preferred_language: string;
  github_username: string;
  xp_progress: number;
  xp_for_current_level: number;
  xp_for_next_level: number;
  rank: number;
  coins: number;
  referral_code: string | null;
  referral_count: number;
  equipped_frame: string;
  equipped_title: string;
  equipped_theme: string;
  streak_shields: number;
};

export type ShopCategory = "frame" | "title" | "theme" | "booster";
export type ShopRarity = "common" | "rare" | "epic" | "legendary";

export type ShopItem = {
  id: number;
  item_id: string;
  title: string;
  description: string;
  category: ShopCategory;
  price: number;
  icon: string;
  rarity: ShopRarity;
  preview_data: {
    borderColor?: string;
    boxShadow?: string;
    badge?: string;
    textColor?: string;
    themeId?: string;
    accent?: string;
  };
  is_owned: boolean;
  is_equipped: boolean;
};

export type CoinTransaction = {
  id: number;
  amount: number;
  transaction_type: string;
  description: string;
  created_at: string;
};

export type ReferralInfo = {
  referral_code: string;
  total_referrals: number;
  total_earned_coins: number;
  reward_per_referral: number;
  welcome_bonus: number;
  referrals: {
    id: number;
    username: string;
    level: number;
    xp: number;
    avatar_url: string;
    date_joined: string;
    reward_coins: number;
  }[];
};

export type User = {
  id: number;
  username: string;
  email: string;
  is_admin: boolean;
  profile: Profile;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  problem_count: number;
};

export type Problem = {
  id: number;
  title: string;
  slug: string;
  description?: string;
  difficulty: "easy" | "medium" | "hard";
  category: Category;
  xp_reward: number;
  constraints?: string;
  input_format?: string;
  output_format?: string;
  examples?: { input: string; output: string; explanation?: string }[];
  starter_code?: Record<string, string>;
  acceptance_rate: number;
  total_submissions: number;
  accepted_submissions: number;
  is_daily_challenge?: boolean;
  solved?: boolean;
  user_solved?: boolean;
  sample_tests?: { id: number; input_data: string; expected_output: string; explanation: string }[];
  time_limit_ms?: number;
  memory_limit_mb?: number;
};

export type Submission = {
  id: number;
  username: string;
  problem: number;
  problem_title: string;
  problem_slug: string;
  language: string;
  code: string;
  status: string;
  runtime: number | null;
  memory: number | null;
  stdout: string;
  stderr: string;
  test_results: {
    input: string;
    expected: string;
    actual: string;
    passed: boolean;
    error: string;
    runtime_ms: number;
  }[];
  passed_tests: number;
  total_tests: number;
  created_at: string;
};

export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type LeaderboardEntry = {
  rank: number;
  user_id: number;
  username: string;
  level: number;
  xp: number;
  problems_solved: number;
  current_streak: number;
  avatar_url: string;
  coins?: number;
  equipped_frame?: string;
  equipped_title?: string;
};

export type Achievement = {
  id: number;
  code: string;
  title: string;
  description: string;
  icon: string;
  threshold: number;
  unlocked: boolean;
  progress: number;
  unlocked_at: string | null;
};
