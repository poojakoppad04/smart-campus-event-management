"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface OrganizerEvent {
  event_id: number;
  title: string;
  event_date: string;
  start_time: string;
  max_participants: number;
  status: string;
  venue_name: string;
  registrations: number;
}

interface DashboardStats {
  totalEvents: number;
  upcomingEvents: number;
  totalRegistrations: number;
  totalFeedback: number;
}

export default function OrganizerDashboardPage() {
  const [events, setEvents] = useState<OrganizerEvent[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalEvents: 0,
    upcomingEvents: 0,
    totalRegistrations: 0,
    totalFeedback: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please log in as an organizer to view your dashboard.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "http://127.0.0.1:5001/api/events/organizer/my-events",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to load dashboard.");
        }

        setEvents(result.events || []);
        setStats(result.stats);
      } catch (err) {
        console.error("Dashboard loading error:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load organizer dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const statCards = [
    {
      label: "Total Events",
      value: stats.totalEvents,
      description: "Events created",
      color: "text-gray-900",
    },
    {
      label: "Upcoming Events",
      value: stats.upcomingEvents,
      description: "Currently scheduled",
      color: "text-blue-600",
    },
    {
      label: "Total Registrations",
      value: stats.totalRegistrations,
      description: "Across all your events",
      color: "text-green-600",
    },
    {
      label: "Feedback",
      value: stats.totalFeedback,
      description: "Responses received",
      color: "text-purple-600",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            SmartCampus
          </Link>

          <div className="flex items-center gap-6 text-sm font-medium">
            <Link
              href="/events"
              className="text-gray-600 transition hover:text-blue-600"
            >
              Events
            </Link>

            <Link
              href="/organizer-dashboard"
              className="text-blue-600"
            >
              Organizer Dashboard
            </Link>

            <button
              onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("user"); window.location.href = "/login"; }}
              className="rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition hover:bg-gray-200"
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
            Welcome back, Organizer!
          </h1>

          <p className="mt-3 text-blue-100">
            Create events, manage registrations and keep track of your
            campus activities.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl bg-white p-6 shadow-sm"
            >
              <p className="text-sm font-medium text-gray-500">
                {stat.label}
              </p>
              <p className={`mt-2 text-3xl font-bold ${stat.color}`}>
                {loading ? "..." : stat.value}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              My Events
            </h2>

            <p className="mt-1 text-gray-500">
              Manage the events you have created.
            </p>
          </div>

          <button
            onClick={() => {
              window.location.href = "/create-event";
            }}
            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            + Create New Event
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12">
        {loading && (
          <p className="rounded-xl bg-white p-6 text-gray-600 shadow-sm">
            Loading your events...
          </p>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && events.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <h3 className="text-xl font-bold text-gray-900">
              No events created yet
            </h3>
            <p className="mt-2 text-gray-500">
              Create your first campus event to see it here.
            </p>
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-5">
            {events.map((event) => {
              const registrations = Number(event.registrations) || 0;
              const capacity = Number(event.max_participants) || 0;
              const percentage =
                capacity > 0
                  ? Math.min(
                      100,
                      Math.round((registrations / capacity) * 100)
                    )
                  : 0;

              const formattedDate = new Date(
                `${event.event_date}T00:00:00`
              ).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              });

              return (
                <div
                  key={event.event_id}
                  className="rounded-2xl bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="mb-3 flex flex-wrap items-center gap-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            event.status === "Upcoming"
                              ? "bg-blue-100 text-blue-700"
                              : event.status === "Completed"
                              ? "bg-gray-100 text-gray-600"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {event.status}
                        </span>

                        <span className="text-sm text-gray-500">
                          {registrations}/{capacity} seats
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900">
                        {event.title}
                      </h3>

                      <div className="mt-3 space-y-1 text-sm text-gray-600">
                        <p>Date: {formattedDate}</p>
                        <p>Time: {event.start_time}</p>
                        <p>Venue: {event.venue_name}</p>
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
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                      >
                        View Registrations
                      </Link>

                      <button
                        onClick={async () => {
                          const newTitle = window.prompt("Enter the updated event title:", event.title);
                          if (newTitle === null || !newTitle.trim()) return;

                          const newDate = window.prompt("Enter the updated event date (YYYY-MM-DD):", String(event.event_date).slice(0, 10));
                          if (!newDate) return;

                          try {
                            const token = localStorage.getItem("token");
                            const response = await fetch("http://127.0.0.1:5001/api/events/" + event.event_id, {
                              method: "PUT",
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: "Bearer " + token,
                              },
                              body: JSON.stringify({ title: newTitle.trim(), event_date: newDate }),
                            });
                            const result = await response.json();
                            if (!response.ok) throw new Error(result.message || "Update failed");
                            alert("Event updated successfully!");
                            window.location.reload();
                          } catch (error) {
                            alert(error instanceof Error ? error.message : "Could not update event");
                          }
                        }}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                      >
                        Edit
                      </button>

                      <button
                        onClick={async () => {
                          if (!window.confirm("Are you sure you want to delete this event?")) return;

                          try {
                            const token = localStorage.getItem("token");
                            const response = await fetch("http://127.0.0.1:5001/api/events/" + event.event_id, {
                              method: "DELETE",
                              headers: {
                                Authorization: "Bearer " + token,
                              },
                            });
                            const result = await response.json();
                            if (!response.ok) throw new Error(result.message || "Delete failed");
                            alert("Event deleted successfully!");
                            window.location.reload();
                          } catch (error) {
                            alert(error instanceof Error ? error.message : "Could not delete event");
                          }
                        }}
                        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        Delete
                      </button>
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





