"use client";

import { useState } from "react";
import Link from "next/link";

export default function FeedbackPage() {
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      alert("Please select a rating before submitting.");
      return;
    }

    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            SmartCampus
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/events"
              className="text-gray-600 transition hover:text-blue-600"
            >
              Events
            </Link>

            <Link
              href="/dashboard"
              className="text-gray-600 transition hover:text-blue-600"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Main */}
      <section className="mx-auto max-w-3xl px-6 py-12">
        <Link
          href="/dashboard"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </Link>

        <div className="mt-8 rounded-2xl bg-white p-8 shadow-sm">
          {!submitted ? (
            <>
              <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                  Event Feedback
                </p>

                <h1 className="mt-2 text-3xl font-bold text-gray-900">
                  Share Your Experience
                </h1>

                <p className="mt-2 text-gray-600">
                  Tell us what you thought about the event. Your feedback helps
                  improve future campus events.
                </p>
              </div>

              {/* Event information */}
              <div className="mb-8 rounded-xl bg-blue-50 p-5">
                <p className="text-sm text-gray-500">Event</p>

                <h2 className="mt-1 text-xl font-bold text-gray-900">
                  Campus Hackathon 2026
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                  Innovation Lab • October 15, 2026
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Rating */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900">
                    How would you rate this event?
                  </label>

                  <div className="mt-4 flex gap-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`text-4xl transition hover:scale-110 ${
                          star <= rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        aria-label={`Rate ${star} out of 5`}
                      >
                        ★
                      </button>
                    ))}
                  </div>

                  <p className="mt-2 text-sm text-gray-500">
                    {rating === 0
                      ? "Select a rating from 1 to 5"
                      : `You selected ${rating} out of 5`}
                  </p>
                </div>

                {/* Comments */}
                <div>
                  <label
                    htmlFor="comments"
                    className="block text-sm font-semibold text-gray-900"
                  >
                    Comments
                  </label>

                  <textarea
                    id="comments"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    rows={6}
                    placeholder="What did you like about the event? What could be improved?"
                    className="mt-3 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <p className="mt-2 text-right text-sm text-gray-400">
                    {comments.length}/500
                  </p>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                  Submit Feedback
                </button>
              </form>
            </>
          ) : (
            /* Success */
            <div className="py-12 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <span className="text-4xl text-green-600">✓</span>
              </div>

              <h1 className="mt-6 text-3xl font-bold text-gray-900">
                Feedback Submitted!
              </h1>

              <p className="mx-auto mt-3 max-w-md text-gray-600">
                Thank you for sharing your experience at Campus Hackathon
                2026.
              </p>

              <div className="mt-8 flex justify-center gap-4">
                <Link
                  href="/dashboard"
                  className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                  Back to Dashboard
                </Link>

                <Link
                  href="/events"
                  className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Browse Events
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-12 border-t bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8 text-center">
          <p className="text-sm text-gray-500">
            © 2026 SmartCampus. Smart events for a smarter campus.
          </p>
        </div>
      </footer>
    </main>
  );
}