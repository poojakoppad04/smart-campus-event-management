"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface OrganizerEvent {
  event_id: number;
  title: string;
  description: string | null;
  event_date: string;
  start_time: string;
  end_time: string;
  max_participants: number;
  registrations: number;
  status: string;
  venue_name: string;
  venue_location: string;
  venue_capacity: number;
}

export default function OrganizerDashboardPage() {
  const [events, setEvents] = useState<OrganizerEvent[]>([]);
  const [totalRegistrations, setTotalRegistrations] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      const token = sessionStorage.getItem("token");

      if (!token) {
        setError("Please log in as an organizer.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/events/mine`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load events.");
        }

        setEvents(data.events || []);
        setTotalRegistrations(data.total_registrations || 0);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load events."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const upcomingEvents = events.filter(
    (event) =>
      event.status?.toLowerCase() === "upcoming" &&
      new Date(event.event_date + "T23:59:59") >= new Date()
  ).length;

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    window.location.href = "/login";
  };

  const formatDate = (date: string) =>
    new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(Number(hours), Number(minutes));
    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

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
            <Link
              href="/organizer-dashboard"
              className="text-blue-600"
            >
              Organizer Dashboard
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

      <section className="bg-gradient-to-r from-indigo-600 to-blue-600">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <p className="mb-2 text-blue-100">Organizer Dashboard</p>
          <h1 className="text-4xl font-bold text-white">
            Welcome back, Organizer! 👋
          </h1>
          <p className="mt-3 text-blue-100">
            Create events, manage registrations and keep track of your
            campus activities.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Total Events</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {loading ? "..." : events.length}
            </p>
            <p className="mt-1 text-sm text-gray-500">Events created</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Upcoming Events</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {loading ? "..." : upcomingEvents}
            </p>
            <p className="mt-1 text-sm text-gray-500">Currently scheduled</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Registrations
            </p>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {loading ? "..." : totalRegistrations}
            </p>
            <p className="mt-1 text-sm text-gray-500">Across your events</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Feedback</p>
            <p className="mt-2 text-3xl font-bold text-purple-600">—</p>
            <p className="mt-1 text-sm text-gray-500">
              Feedback statistics not connected yet
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Events</h2>
            <p className="mt-1 text-gray-500">
              Manage the events you have created.
            </p>
          </div>
          <Link
            href="/create-event"
            className="inline-flex rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            + Create Event
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12">
        {loading && (
          <div className="rounded-2xl bg-white p-10 text-center text-gray-500">
            Loading your events...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl bg-white p-8 text-center text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && events.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center text-gray-500">
            No events found for your organizer account.
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-5">
            {events.map((event) => {
              const percentage =
                event.max_participants > 0
                  ? Math.min(
                      100,
                      Math.round(
                        (event.registrations / event.max_participants) * 100
                      )
                    )
                  : 0;

              return (
                <div
                  key={event.event_id}
                  className="rounded-2xl bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="mb-3 flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                          {event.status || "Upcoming"}
                        </span>
                        <span className="text-sm text-gray-500">
                          {event.registrations}/{event.max_participants} seats
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900">
                        {event.title}
                      </h3>

                      <div className="mt-3 space-y-1 text-sm text-gray-600">
                        <p>📅 {formatDate(event.event_date)}</p>
                        <p>
                          ⏰ {formatTime(event.start_time)} –{" "}
                          {formatTime(event.end_time)}
                        </p>
                        <p>📍 {event.venue_name}</p>
                      </div>

                      <div className="mt-5 max-w-xl">
                        <div className="mb-2 flex justify-between text-xs">
                          <span className="text-gray-500">
                            Registration progress
                          </span>
                          <span className="font-semibold text-gray-700">
                            {percentage}%
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-full rounded-full bg-blue-600"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={`/registrations?eventId=${event.event_id}`}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                      >
                        View Registrations
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
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
