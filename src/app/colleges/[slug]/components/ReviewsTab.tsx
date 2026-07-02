"use client";
import type { Review } from "@/lib/reviews";

/**
 * "Reviews" tab of CollegeDetail. Extracted verbatim from CollegeDetail.tsx;
 * reviews + rating are looked up server-side and passed down as props.
 */
export default function ReviewsTab({ collegeName, reviews, avg, count }: { collegeName: string; reviews: Review[]; avg: number; count: number }) {
  return (
    <div className="space-y-6">
      <section className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold mb-1">Student Reviews</h2>
        <p className="text-xs text-gray-500 mb-4">Verified reviews from students and alumni of {collegeName}</p>

        {count > 0 ? (
          <>
            {/* Rating Summary */}
            <div className="bg-gray-50 rounded-xl p-5 mb-6 flex items-center gap-6">
              <div className="text-center">
                <div className="text-4xl font-extrabold text-brand">{avg}</div>
                <div className="text-amber-500 text-lg mt-0.5">{"★".repeat(Math.round(avg))}{"☆".repeat(5 - Math.round(avg))}</div>
                <div className="text-xs text-gray-500 mt-1">{count} review{count !== 1 ? "s" : ""}</div>
              </div>
              <div className="flex-1">
                {[5, 4, 3, 2, 1].map(star => {
                  const starCount = reviews.filter(r => r.rating === star).length;
                  const pct = count > 0 ? (starCount / count) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-2 text-xs mb-1">
                      <span className="w-3 text-right text-gray-500">{star}</span>
                      <span className="text-amber-500 text-[11px] sm:text-xs">★</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div className="bg-amber-400 h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-6 text-gray-500 text-right">{starCount}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Individual Reviews */}
            <div className="space-y-4">
              {reviews.map(review => (
                <div key={review.id} className="border border-gray-100 rounded-xl p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold text-sm">{review.author}</div>
                      <div className="text-xs text-gray-500">{review.branch ? `${review.branch} · ` : ""}Class of {review.year}</div>
                    </div>
                    <div className="text-amber-500 text-sm">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</div>
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{review.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">{review.body}</p>
                  {review.pros.length > 0 && (
                    <div className="mb-2">
                      <span className="text-[11px] sm:text-xs font-bold text-green-600 uppercase tracking-wide">Pros</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {review.pros.map((p, i) => <span key={i} className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs">{p}</span>)}
                      </div>
                    </div>
                  )}
                  {review.cons.length > 0 && (
                    <div>
                      <span className="text-[11px] sm:text-xs font-bold text-red-500 uppercase tracking-wide">Cons</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {review.cons.map((p, i) => <span key={i} className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-xs">{p}</span>)}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">💬</div>
            <p className="font-bold text-gray-700 text-lg mb-2">No Reviews Yet</p>
            <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
              Be the first to share your experience at {collegeName}. Your review helps thousands of students make better decisions.
            </p>
            <div className="bg-blue-50 rounded-xl p-5 max-w-sm mx-auto text-left">
              <p className="text-sm font-semibold text-brand mb-2">How to submit a review:</p>
              <p className="text-xs text-gray-600 leading-relaxed">
                Email your review to <span className="font-semibold text-accent">reviews@telugucolleges.com</span> with your college name, branch, graduation year, and your honest experience. We verify and publish all genuine reviews.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
