"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

type CampusEvent = {
  event_id: number;
  title: string;
  event_date: string;
};

export default function FeedbackPage() {
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [eventId, setEventId] = useState("");
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_URL}/events`);

        if (!response.ok) {
          throw new Error("Could not load events.");
        }

        const data = await response.json();
        setEvents(data.events || []);
      } catch (err) {
        setError(true);
        setMessage(
          err instanceof Error ? err.message : "Could not load events."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError(false);

    const token = sessionStorage.getItem("token");

    if (!token) {
      setError(true);
      setMessage("Please log in as a student before submitting feedback.");
      return;
    }

    if (!eventId) {
      setError(true);
      setMessage("Please select an event.");
      return;
    }

    if (rating === 0) {
      setError(true);
      setMessage("Please select a rating from 1 to 5.");
      return;
    }

    if (comments.length > 500) {
      setError(true);
      setMessage("Comments cannot exceed 500 characters.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          event_id: Number(eventId),
          rating,
          comments: comments.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not submit feedback.");
      }

      setMessage("Your feedback has been saved successfully!");
      setRating(0);
      setComments("");
    } catch (err) {
      setError(true);
      setMessage(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            SmartCampus
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/events" className="text-gray-600 hover:text-blue-600">
              Events
            </Link>
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-blue-600"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-3xl px-6 py-12">
        <Link
          href="/dashboard"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </Link>

        <div className="mt-8 rounded-2xl bg-white p-8 shadow-sm">
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

          {message && (
            <div
              className={`mt-6 rounded-xl p-4 text-sm ${
                error
                  ? "bg-red-50 text-red-700"
                  : "bg-green-50 text-green-700"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-8">
            <div>
              <label
                htmlFor="event"
                className="block text-sm font-semibold text-gray-900"
              >
                Select Event
              </label>

              <select
                id="event"
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                disabled={loading}
                className="mt-3 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
              >
                <option value="">
                  {loading ? "Loading events..." : "Choose an event"}
                </option>

                {events.map((event) => (
                  <option key={event.event_id} value={event.event_id}>
                    {event.title}
                  </option>
                ))}
              </select>

              {!loading && events.length === 0 && (
                <p className="mt-2 text-sm text-gray-500">
                  No events are currently available.
                </p>
              )}
            </div>

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
                      star <= rating ? "text-yellow-400" : "text-gray-300"
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
                maxLength={500}
                rows={6}
                placeholder="What did you like about the event? What could be improved?"
                className="mt-3 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <p className="mt-2 text-right text-sm text-gray-400">
                {comments.length}/500
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting || loading || events.length === 0}
              className="w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit Feedback"}
            </button>

            <div className="text-center">
              <Link
                href="/feedback-list"
                className="font-semibold text-blue-600 hover:underline"
              >
                View Student Feedback →
              </Link>
            </div>
          </form>
        </div>
      </section>

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
