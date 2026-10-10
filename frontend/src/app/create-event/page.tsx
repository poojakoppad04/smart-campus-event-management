"use client";

import Link from "next/link";
import { useState } from "react";

export default function CreateEventPage() {
  const [created, setCreated] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreated(true);
  };

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
              className="text-gray-600 transition hover:text-blue-600"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="bg-gradient-to-r from-indigo-600 to-blue-600">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <p className="mb-2 text-blue-100">Organizer</p>

          <h1 className="text-4xl font-bold text-white">
            Create New Event
          </h1>

          <p className="mt-3 text-blue-100">
            Add the details of your upcoming campus event.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="mx-auto max-w-4xl px-6 py-10">
        {created ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <div className="text-5xl">🎉</div>

            <h2 className="mt-5 text-2xl font-bold text-gray-900">
              Event Created Successfully!
            </h2>

            <p className="mt-3 text-gray-500">
              Your event has been created. Backend integration will be added
              later.
            </p>

            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/organizer-dashboard"
                className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Go to Dashboard
              </Link>

              <button
                onClick={() => setCreated(false)}
                className="rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-100"
              >
                Create Another
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl bg-white p-8 shadow-sm"
          >
            {/* Event Name */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Event Name
              </label>

              <input
                type="text"
                required
                placeholder="Enter event name"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Description
              </label>

              <textarea
                required
                rows={5}
                placeholder="Describe your event..."
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Category */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Category
              </label>

              <select
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select category</option>
                <option value="Technology">Technology</option>
                <option value="Workshop">Workshop</option>
                <option value="Cultural">Cultural</option>
                <option value="Sports">Sports</option>
                <option value="Academic">Academic</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Date and Time */}
            <div className="mb-6 grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Event Date
                </label>

                <input
                  type="date"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Event Time
                </label>

                <input
                  type="time"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Venue and Capacity */}
            <div className="mb-6 grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Venue
                </label>

                <select
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select venue</option>
                  <option value="Innovation Lab">Innovation Lab</option>
                  <option value="Media Room">Media Room</option>
                  <option value="Computer Lab 2">Computer Lab 2</option>
                  <option value="Main Auditorium">Main Auditorium</option>
                  <option value="Sports Ground">Sports Ground</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Maximum Capacity
                </label>

                <input
                  type="number"
                  min="1"
                  required
                  placeholder="e.g. 100"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Link
                href="/organizer-dashboard"
                className="rounded-lg border border-gray-300 px-6 py-3 text-center font-semibold text-gray-700 transition hover:bg-gray-100"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Create Event
              </button>
            </div>
          </form>
        )}
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