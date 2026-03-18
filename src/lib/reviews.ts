export interface Review {
  id: string;
  collegeCode: string;
  author: string;
  year: number;       // graduation year or year of review
  branch?: string;    // e.g. "CSE", "ECE"
  rating: number;     // 1-5 stars
  title: string;
  body: string;
  pros: string[];
  cons: string[];
  date: string;       // YYYY-MM-DD
}

// Empty for now — reviews will be added over time
export const REVIEWS: Review[] = [];

// Get reviews for a specific college
export function getReviewsByCollege(code: string): Review[] {
  return REVIEWS
    .filter(r => r.collegeCode === code)
    .sort((a, b) => b.date.localeCompare(a.date));
}

// Get average rating for a college
export function getAverageRating(code: string): { avg: number; count: number } {
  const reviews = getReviewsByCollege(code);
  if (reviews.length === 0) return { avg: 0, count: 0 };
  const sum = reviews.reduce((s, r) => s + r.rating, 0);
  return { avg: Math.round((sum / reviews.length) * 10) / 10, count: reviews.length };
}

// Star rating display helper
export function starDisplay(rating: number): string {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(empty);
}
