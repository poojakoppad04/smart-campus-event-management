"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Registration {
  registration_id: number;
  event_id: number;
  event_title: string;
  event_date: string;
  start_time: string;
  end_time: string;
  venue_name: string;
  venue_location: string;
  event_status: string | null;
  registration_status: string | null;
}

interface Student {
  name?: string;
  email?: string;
  role?: string;
}

function getCategory(title: string) {
  const value = title.toLowerCase();

  if (value.includes("workshop")) return "Workshop";
  if (value.includes("tech") || value.includes("development")) return "Technology";
  if (value.includes("cultural")) return "Cultural";
  if (value.includes("hackathon") || value.includes("competition")) return "Competition";

  return "Campus Event";
}

function formatTime(time: string) {
  const match = time.match(/T?(\d{2}):(\d{2})/);

  if (!match) return time;

  const hours = Number(match[1]);
  const minutes = match[2];
  const suffix = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;

  return `${displayHour}:${minutes} ${suffix}`;
}

function formatDate(date: string) {
  return new Date(`${date.split("T")[0]}T00:00:00`).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
}

export default function DashboardPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDashboard() {
      const token = sessionStorage.getItem("token");
      const storedUser = sessionStorage.getItem("user");

      if (storedUser) {
        try {
          setStudent(JSON.parse(storedUser));
        } catch {
          setStudent(null);
        }
      }

      if (!token) {
        setError("Please log in as a student to view your dashboard.");
        setLoading(false);
        return;
      }

      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

        const response = await fetch(`${apiUrl}/registrations/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load your dashboard.");
        }

        setRegistrations(data.registrations || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  function logout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    window.location.href = "/login";
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            SmartCampus
          </Link>

          <div className="flex items-center gap-6 text-sm font-medium">
            <Link href="/events" className="text-gray-600 hover:text-blue-600">
              Events
            </Link>
            <Link href="/dashboard" className="text-blue-600">
              Dashboard
            </Link>
            <button
              onClick={logout}
              className="rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <p className="mb-2 text-blue-100">Student Dashboard</p>
          <h1 className="text-4xl font-bold text-white">
            Welcome back, {student?.name || "Student"}! 👋
          </h1>
          <p className="mt-3 max-w-2xl text-blue-100">
            Manage your event registrations and discover what is happening
            around campus.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-5 md:grid-cols-3">
          <Link
            href="/events"
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="mb-4 text-3xl">🔎</div>
            <h2 className="text-xl font-bold text-gray-900">Browse Events</h2>
            <p className="mt-2 text-sm text-gray-500">
              Discover workshops, competitions, talks and other campus events.
            </p>
          </Link>

          <Link
            href="/my-registrations"
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="mb-4 text-3xl">🎟️</div>
            <h2 className="text-xl font-bold text-gray-900">My Registrations</h2>
            <p className="mt-2 text-sm text-gray-500">
              View the events you have registered for.
            </p>
          </Link>

          <Link
            href="/feedback"
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="mb-4 text-3xl">📝</div>
            <h2 className="text-xl font-bold text-gray-900">Give Feedback</h2>
            <p className="mt-2 text-sm text-gray-500">
              Share your experience after attending an event.
            </p>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              My Registered Events
            </h2>
            <p className="mt-1 text-gray-500">
              Your registrations retrieved from PostgreSQL.
            </p>
          </div>

          <Link
            href="/events"
            className="hidden rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 sm:block"
          >
            View All Events
          </Link>
        </div>

        {loading && (
          <div className="rounded-2xl bg-white p-10 text-center text-gray-500">
            Loading your registrations...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl bg-white p-8 text-center">
            <p className="font-semibold text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && registrations.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="text-4xl">🎟️</p>
            <h3 className="mt-4 text-xl font-bold text-gray-900">
              No registrations yet
            </h3>
            <p className="mt-2 text-gray-500">
              Explore campus events and register for your favourites.
            </p>
            <Link
              href="/events"
              className="mt-5 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Explore Events
            </Link>
          </div>
        )}

        {!loading && !error && registrations.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2">
            {registrations.map((event) => (
              <div
                key={event.registration_id}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex items-start justify-between gap-4">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    {getCategory(event.event_title)}
                  </span>
                  <span className="text-sm font-medium text-green-600">
                    ✓ {event.registration_status}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900">
                  {event.event_title}
                </h3>

                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <p>📅 {formatDate(event.event_date)}</p>
                  <p>⏰ {formatTime(event.start_time)} – {formatTime(event.end_time)}</p>
                  <p>📍 {event.venue_name}</p>
                  <p>📌 {event.venue_location}</p>
                </div>

                <div className="mt-6">
                  <Link
                    href={`/events/${event.event_id}`}
                    className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    View Event
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className="border-t bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6 text-center text-sm text-gray-500">
          © 2026 SmartCampus. Smart Campus Event Management System.
        </div>
      </footer>
    </main>
  );
}
