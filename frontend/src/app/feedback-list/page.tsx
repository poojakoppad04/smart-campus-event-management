"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

interface Feedback {
  feedback_id: number;
  student_name: string;
  event_title: string;
  rating: number;
  comments: string | null;
  feedback_date: string;
}

export default function FeedbackListPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch(`${API_URL}/feedback`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not load feedback.");
        }

        setFeedback(data.feedback || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            SmartCampus
          </Link>

          <div className="flex gap-6">
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

      <section className="mx-auto max-w-4xl px-6 py-12">
        <Link
          href="/feedback"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          ← Submit Feedback
        </Link>

        <div className="mt-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Student Event Feedback
          </h1>
          <p className="mt-2 text-gray-600">
            Read experiences and ratings shared by students.
          </p>
        </div>

        {loading && (
          <p className="mt-8 text-gray-600">Loading feedback...</p>
        )}

        {error && (
          <div className="mt-8 rounded-xl bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && feedback.length === 0 && (
          <div className="mt-8 rounded-xl bg-white p-8 text-center shadow-sm">
            No feedback has been submitted yet.
          </div>
        )}

        {!loading && !error && feedback.length > 0 && (
          <div className="mt-8 space-y-5">
            <p className="text-sm font-medium text-gray-600">
              {feedback.length} feedback record(s)
            </p>

            {feedback.map((item) => (
              <article
                key={item.feedback_id}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {item.event_title}
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                      Submitted by {item.student_name}
                    </p>
                  </div>

                  <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                    {item.rating}/5
                  </span>
                </div>

                <div
                  className="mt-4 text-2xl text-yellow-400"
                  aria-label={`${item.rating} out of 5 stars`}
                >
                  {"★".repeat(item.rating)}
                  <span className="text-gray-300">
                    {"★".repeat(5 - item.rating)}
                  </span>
                </div>

                <p className="mt-4 whitespace-pre-wrap text-gray-700">
                  {item.comments || "No written comments."}
                </p>

                <p className="mt-4 text-xs text-gray-400">
                  {new Date(item.feedback_date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
