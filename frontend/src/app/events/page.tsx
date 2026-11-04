"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

interface Event {
  event_id: number;
  title: string;
  description: string | null;
  event_date: string;
  start_time: string;
  end_time: string;
  max_participants: number;
  status: string;
  organizer_name: string;
  venue_name: string;
  venue_location: string;
  venue_capacity: number;
}

function getCategory(title: string) {
  const value = title.toLowerCase();

  if (value.includes("workshop")) return "Workshop";
  if (value.includes("tech") || value.includes("development")) return "Technology";
  if (value.includes("cultural")) return "Cultural";
  if (value.includes("hackathon") || value.includes("competition")) return "Competition";

  return "Campus Event";
}

function getIcon(category: string) {
  const icons: Record<string, string> = {
    Technology: "💻",
    Workshop: "🎤",
    Cultural: "🎭",
    Competition: "🏆",
    "Campus Event": "🎓",
  };

  return icons[category] || "🎓";
}

function formatDate(date: string) {
  return new Date(`${date.split("T")[0]}T00:00:00`).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchEvents() {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

        const response = await fetch(`${apiUrl}/events`);

        if (!response.ok) {
          throw new Error("Unable to retrieve events from the server.");
        }

        const data = await response.json();

        if (!data.success || !Array.isArray(data.events)) {
          throw new Error("The server returned an unexpected response.");
        }

        setEvents(data.events);
      } catch (err) {
        console.error("Events fetch error:", err);
        setError(
          err instanceof Error ? err.message : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(events.map((event) => getCategory(event.title))))],
    [events]
  );

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      (event.description || "").toLowerCase().includes(search.toLowerCase()) ||
      event.venue_name.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || getCategory(event.title) === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            SmartCampus
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/events" className="font-semibold text-blue-600">
              Events
            </Link>

            <Link
              href="/login"
              className="font-medium text-slate-600 hover:text-blue-600"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="mx-auto max-w-7xl px-6 py-16 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-200">
            SmartCampus Events
          </p>

          <h1 className="mt-3 text-4xl font-bold text-white md:text-5xl">
            Discover Campus Events
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
            Explore workshops, competitions, cultural activities, sports, and
            more.
          </p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 md:flex-row">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events..."
            className="flex-1 rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item === "All" ? "All Categories" : item}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Events */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Upcoming Events
          </h2>

          <p className="mt-1 text-slate-600">
            Browse available campus events.
          </p>
        </div>

        {loading && (
          <p className="py-10 text-center text-slate-600">
            Loading events...
          </p>
        )}

        {!loading && error && (
          <div className="rounded-xl bg-red-50 p-5 text-center text-red-700">
            {error}
            <p className="mt-2 text-sm">
              Please check that the backend server is running.
            </p>
          </div>
        )}

        {!loading && !error && filteredEvents.length === 0 && (
          <p className="rounded-xl bg-white p-8 text-center text-slate-600 shadow-sm">
            No events found.
          </p>
        )}

        {!loading && !error && filteredEvents.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => {
              const eventCategory = getCategory(event.title);

              return (
                <div
                  key={event.event_id}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-md"
                >
                  {/* Icon */}
                  <div className="flex h-40 items-center justify-center bg-blue-50 text-6xl">
                    {getIcon(eventCategory)}
                  </div>

                  {/* Details */}
                  <div className="p-6">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                      {eventCategory}
                    </span>

                    <h3 className="mt-4 text-xl font-bold text-slate-900">
                      {event.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {event.description || "No description available."}
                    </p>

                    <div className="mt-5 space-y-2 text-sm text-slate-600">
                      <p>📅 {formatDate(event.event_date)}</p>
                      <p>
                        🕒 {event.start_time} – {event.end_time}
                      </p>
                      <p>📍 {event.venue_name}</p>
                      <p>🏢 {event.venue_location}</p>
                      <p>👥 Maximum {event.max_participants} participants</p>
                      <p>👤 Organized by {event.organizer_name}</p>
                    </div>

                    <Link
                      href={`/events/${event.event_id}`}
                      className="mt-6 block w-full rounded-lg bg-blue-600 px-4 py-3 text-center font-semibold text-white hover:bg-blue-700"
                    >
                      View Event
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t bg-slate-900">
        <div className="mx-auto max-w-7xl px-6 py-8 text-center">
          <p className="font-semibold text-white">SmartCampus</p>

          <p className="mt-2 text-sm text-slate-400">
            Smart Campus Event Management System
          </p>

          <p className="mt-4 text-xs text-slate-500">
            © 2026 SmartCampus. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
