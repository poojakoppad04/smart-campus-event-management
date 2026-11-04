"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";

type Venue = {
  venue_id: number;
  venue_name: string;
  location: string;
  capacity: number;
};

export default function CreateEventPage() {
  const [created, setCreated] = useState(false);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loadingVenues, setLoadingVenues] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [createdEventId, setCreatedEventId] = useState<number | null>(null);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:5001/api/events/venues"
        );
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Unable to load venues");
        }

        setVenues(result.venues);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to load venues"
        );
      } finally {
        setLoadingVenues(false);
      }
    };

    fetchVenues();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in as an organizer before creating an event.");
      }

      const formData = new FormData(e.currentTarget);

      const title = String(formData.get("title") || "").trim();
      const description = String(formData.get("description") || "").trim();
      const category = String(formData.get("category") || "");
      const eventDate = String(formData.get("event_date") || "");
      const startTime = String(formData.get("start_time") || "");
      const endTime = String(formData.get("end_time") || "");
      const venueId = Number(formData.get("venue_id"));
      const maxParticipants = Number(formData.get("max_participants"));

      if (endTime <= startTime) {
        throw new Error("End time must be later than start time.");
      }

      const selectedVenue = venues.find(
        (venue) => venue.venue_id === venueId
      );

      if (!selectedVenue) {
        throw new Error("Please select a valid venue.");
      }

      if (maxParticipants > selectedVenue.capacity) {
        throw new Error(
          `Maximum capacity for ${selectedVenue.venue_name} is ${selectedVenue.capacity}.`
        );
      }

      const response = await fetch("http://127.0.0.1:5001/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          category,
          event_date: eventDate,
          start_time: startTime,
          end_time: endTime,
          venue_id: venueId,
          max_participants: maxParticipants,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to create event.");
      }

      setCreatedEventId(result.event_id);
      setCreated(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
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
              Your event has been saved successfully.
              {createdEventId !== null && (
                <> Event ID: {createdEventId}</>
              )}
            </p>

            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/organizer-dashboard"
                className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Go to Dashboard
              </Link>

              <button
                onClick={() => {
                  setCreated(false);
                  setError("");
                  setCreatedEventId(null);
                }}
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
            {error && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Event Name */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Event Name
              </label>

              <input
                name="title"
                type="text"
                required
                maxLength={200}
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
                name="description"
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
                name="category"
                required
                defaultValue=""
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select category</option>
                <option value="Technology">Technology</option>
                <option value="Workshop">Workshop</option>
                <option value="Cultural">Cultural</option>
                <option value="Sports">Sports</option>
                <option value="Competition">Competition</option>
                <option value="Business">Business</option>
              </select>
            </div>

            {/* Date and Time */}
            <div className="mb-6 grid gap-6 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Event Date
                </label>

                <input
                  name="event_date"
                  type="date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Start Time
                </label>

                <input
                  name="start_time"
                  type="time"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  End Time
                </label>

                <input
                  name="end_time"
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
                  name="venue_id"
                  required
                  defaultValue=""
                  disabled={loadingVenues || venues.length === 0}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">
                    {loadingVenues ? "Loading venues..." : "Select venue"}
                  </option>

                  {venues.map((venue) => (
                    <option key={venue.venue_id} value={venue.venue_id}>
                      {venue.venue_name} (Capacity: {venue.capacity})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Maximum Capacity
                </label>

                <input
                  name="max_participants"
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
                disabled={submitting || loadingVenues || venues.length === 0}
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Creating Event..." : "Create Event"}
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

