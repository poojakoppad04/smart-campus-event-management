"use client";

import Link from "next/link";

const registeredEvents = [
  {
    id: 1,
    title: "Campus Hackathon 2026",
    date: "October 18, 2026",
    time: "10:00 AM",
    venue: "Innovation Lab",
    category: "Technology",
  },
  {
    id: 2,
    title: "Photography Workshop",
    date: "October 22, 2026",
    time: "2:00 PM",
    venue: "Media Room",
    category: "Workshop",
  },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navbar */}
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
              href="/dashboard"
              className="text-blue-600"
            >
              Dashboard
            </Link>

            <button
              onClick={() => alert("Logout will be connected to the backend soon!")}
              className="rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition hover:bg-gray-200"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Dashboard Header */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <p className="mb-2 text-blue-100">Student Dashboard</p>

          <h1 className="text-4xl font-bold text-white">
            Welcome back, Student! 👋
          </h1>

          <p className="mt-3 max-w-2xl text-blue-100">
            Manage your event registrations and discover what is happening
            around campus.
          </p>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-5 md:grid-cols-3">
          <Link
            href="/events"
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="mb-4 text-3xl">🔎</div>
            <h2 className="text-xl font-bold text-gray-900">
              Browse Events
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Discover workshops, competitions, talks and other campus events.
            </p>
          </Link>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 text-3xl">🎟️</div>
            <h2 className="text-xl font-bold text-gray-900">
              My Registrations
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              View and manage the events you have registered for.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 text-3xl">📝</div>
            <h2 className="text-xl font-bold text-gray-900">
              Give Feedback
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Share your experience after attending an event.
            </p>
          </div>
        </div>
      </section>

      {/* Registered Events */}
      <section className="mx-auto max-w-7xl px-6 pb-12">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              My Upcoming Events
            </h2>

            <p className="mt-1 text-gray-500">
              Events you are currently registered for.
            </p>
          </div>

          <Link
            href="/events"
            className="hidden rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 sm:block"
          >
            View All Events
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {registeredEvents.map((event) => (
            <div
              key={event.id}
              className="rounded-2xl bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  {event.category}
                </span>

                <span className="text-sm font-medium text-green-600">
                  ✓ Registered
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-900">
                {event.title}
              </h3>

              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <p>📅 {event.date}</p>
                <p>⏰ {event.time}</p>
                <p>📍 {event.venue}</p>
              </div>

              <div className="mt-6 flex gap-3">
                <Link
                  href={`/events/${event.id}`}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  View Event
                </Link>

                <button
                  onClick={() =>
                    alert("Cancellation will be connected to the backend soon!")
                  }
                  className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6 text-center text-sm text-gray-500">
          © 2026 SmartCampus. Smart Campus Event Management System.
        </div>
      </footer>
    </main>
  );
}