"use client";

import Link from "next/link";

const organizerEvents = [
  {
    id: 1,
    title: "Campus Hackathon 2026",
    date: "October 18, 2026",
    time: "10:00 AM",
    venue: "Innovation Lab",
    registrations: 82,
    capacity: 100,
    status: "Upcoming",
  },
  {
    id: 2,
    title: "Photography Workshop",
    date: "October 22, 2026",
    time: "2:00 PM",
    venue: "Media Room",
    registrations: 34,
    capacity: 50,
    status: "Upcoming",
  },
  {
    id: 3,
    title: "Web Development Bootcamp",
    date: "September 15, 2026",
    time: "11:00 AM",
    venue: "Computer Lab 2",
    registrations: 60,
    capacity: 60,
    status: "Completed",
  },
];

export default function OrganizerDashboardPage() {
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
              href="/organizer-dashboard"
              className="text-blue-600"
            >
              Organizer Dashboard
            </Link>

            <button
              onClick={() =>
                alert("Logout will be connected to the backend soon!")
              }
              className="rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition hover:bg-gray-200"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Header */}
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

      {/* Statistics */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Events
            </p>
            <p className="mt-2 text-3xl font-bold text-gray-900">3</p>
            <p className="mt-1 text-sm text-gray-500">
              Events created
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Upcoming Events
            </p>
            <p className="mt-2 text-3xl font-bold text-blue-600">2</p>
            <p className="mt-1 text-sm text-gray-500">
              Currently scheduled
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Registrations
            </p>
            <p className="mt-2 text-3xl font-bold text-green-600">176</p>
            <p className="mt-1 text-sm text-gray-500">
              Across all events
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Feedback
            </p>
            <p className="mt-2 text-3xl font-bold text-purple-600">42</p>
            <p className="mt-1 text-sm text-gray-500">
              Responses received
            </p>
          </div>
        </div>
      </section>

      {/* Actions */}
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
            onClick={() =>
              alert("Create Event form will be connected soon!")
            }
            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            + Create New Event
          </button>
        </div>
      </section>

      {/* Event List */}
      <section className="mx-auto max-w-7xl px-6 pb-12">
        <div className="space-y-5">
          {organizerEvents.map((event) => {
            const percentage = Math.round(
              (event.registrations / event.capacity) * 100
            );

            return (
              <div
                key={event.id}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  {/* Event Info */}
                  <div className="flex-1">
                    <div className="mb-3 flex flex-wrap items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          event.status === "Upcoming"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {event.status}
                      </span>

                      <span className="text-sm text-gray-500">
                        {event.registrations}/{event.capacity} seats
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900">
                      {event.title}
                    </h3>

                    <div className="mt-3 space-y-1 text-sm text-gray-600">
                      <p>📅 {event.date}</p>
                      <p>⏰ {event.time}</p>
                      <p>📍 {event.venue}</p>
                    </div>

                    {/* Registration Progress */}
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

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() =>
                        alert(
                          "Registration management will be connected to the backend soon!"
                        )
                      }
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      View Registrations
                    </button>

                    <button
                      onClick={() =>
                        alert("Edit Event will be connected soon!")
                      }
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        alert("Delete Event will be connected soon!")
                      }
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