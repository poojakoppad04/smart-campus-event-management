"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

interface CampusEvent {
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
  category?: string;
}

const categories = [
  "All",
  "Technology",
  "Cultural",
  "Competition",
  "Business",
  "Sports",
  "Workshop",
];

function getCategory(event: CampusEvent) {
  if (event.category) return event.category;

  const text = `${event.title} ${event.description || ""}`.toLowerCase();

  if (/hackathon|contest|competition|challenge|quiz/.test(text)) return "Competition";
  if (/cultural|music|dance|fest|art|festival/.test(text)) return "Cultural";
  if (/sport|cricket|football|basketball|badminton|tournament/.test(text)) return "Sports";
  if (/business|entrepreneur|startup|finance|marketing/.test(text)) return "Business";
  if (/workshop|training|hands-on/.test(text)) return "Workshop";
  if (/technology|coding|programming|web development|software|ai |computer|tech/.test(text)) return "Technology";

  return "Campus Event";
}

function getIcon(category: string) {
  const icons: Record<string, string> = {
    Technology: "💻",
    Cultural: "🎤",
    Competition: "🏆",
    Business: "💼",
    Sports: "🏅",
    Workshop: "📷",
    "Campus Event": "🎓",
  };

  return icons[category] || "🎓";
}

function formatDate(value: string) {
  if (!value) return "Date unavailable";

  const date = new Date(`${value.slice(0, 10)}T00:00:00`);

  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
}

export default function EventsPage() {
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadEvents() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:5001/api/events");
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load events.");
      }

      setEvents(data.events || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load events.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const text = [
        event.title,
        event.description || "",
        event.venue_name,
        event.venue_location,
        event.organizer_name,
      ].join(" ").toLowerCase();

      const matchesSearch = text.includes(search.trim().toLowerCase());
      const matchesCategory =
        category === "All" || getCategory(event) === category;

      return matchesSearch && matchesCategory;
    });
  }, [events, search, category]);

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

            <Link href="/login" className="font-medium text-slate-600 hover:text-blue-600">
              Login
            </Link>

            <Link href="/register" className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700">
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
            Explore workshops, competitions, cultural activities,
            sports, and more.
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
          <div className="rounded-2xl bg-white p-10 text-center text-slate-600 shadow-sm">
            Loading events...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="font-semibold text-red-600">{error}</p>
            <button
              onClick={loadEvents}
              className="mt-4 rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && filteredEvents.length === 0 && (
          <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm ring-1 ring-slate-200">
            <div className="text-5xl">📅</div>

            <h3 className="mt-5 text-xl font-bold text-slate-900">
              {events.length === 0
                ? "No events available yet"
                : "No matching events found"}
            </h3>

            <p className="mt-2 text-slate-600">
              {events.length === 0
                ? "Please check back soon. New campus events will appear here when organizers publish them."
                : "Try changing your search or category."}
            </p>
          </div>
        )}

        {!loading && !error && filteredEvents.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => {
              const eventCategory = getCategory(event);

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
                      <p>📍 {event.venue_name}</p>
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
          <p className="font-semibold text-white">
            SmartCampus
          </p>

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

