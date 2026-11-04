"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

interface Venue {
  venue_id: number;
  venue_name: string;
  location: string;
  capacity: number;
}

export default function CreateEventPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [venueId, setVenueId] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");

  const [venues, setVenues] = useState<Venue[]>([]);
  const [loadingVenues, setLoadingVenues] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [created, setCreated] = useState(false);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await fetch(`${API_URL}/venues`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not load venues.");
        }

        setVenues(data.venues || []);
      } catch (err) {
        setError(true);
        setMessage(
          err instanceof Error ? err.message : "Could not load venues."
        );
      } finally {
        setLoadingVenues(false);
      }
    };

    fetchVenues();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setError(false);

    const token = sessionStorage.getItem("token");
    const userData = sessionStorage.getItem("user");

    if (!token) {
      setError(true);
      setMessage("Please log in as an organizer before creating an event.");
      return;
    }

    if (userData) {
      try {
        const user = JSON.parse(userData);

        if (user.role !== "organizer") {
          setError(true);
          setMessage("Only organizers can create events.");
          return;
        }
      } catch {
        setError(true);
        setMessage("Please log in again.");
        return;
      }
    }

    if (startTime >= endTime) {
      setError(true);
      setMessage("End time must be later than start time.");
      return;
    }

    const selectedVenue = venues.find(
      (venue) => venue.venue_id === Number(venueId)
    );

    if (!selectedVenue) {
      setError(true);
      setMessage("Please select a valid venue.");
      return;
    }

    if (Number(maxParticipants) > selectedVenue.capacity) {
      setError(true);
      setMessage(
        `Maximum participants cannot exceed the venue capacity of ${selectedVenue.capacity}.`
      );
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          event_date: eventDate,
          start_time: startTime,
          end_time: endTime,
          venue_id: Number(venueId),
          max_participants: Number(maxParticipants),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not create event.");
      }

      setCreated(true);
      setMessage(
        `Event created successfully! Event ID: ${data.event_id}`
      );
    } catch (err) {
      setError(true);
      setMessage(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
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
              className="text-gray-600 hover:text-blue-600"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-r from-indigo-600 to-blue-600">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <p className="mb-2 text-blue-100">Organizer</p>
          <h1 className="text-4xl font-bold text-white">Create New Event</h1>
          <p className="mt-3 text-blue-100">
            Add the details of your upcoming campus event.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-10">
        {message && (
          <div
            className={`mb-6 rounded-xl p-4 ${
              error ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
            }`}
          >
            {message}
          </div>
        )}

        {created ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <div className="text-5xl">🎉</div>
            <h2 className="mt-5 text-2xl font-bold text-gray-900">
              Event Created Successfully!
            </h2>
            <p className="mt-3 text-gray-500">
              Your event has been saved to the database.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/organizer-dashboard"
                className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Go to Dashboard
              </Link>

              <button
                onClick={() => {
                  setCreated(false);
                  setTitle("");
                  setDescription("");
                  setEventDate("");
                  setStartTime("");
                  setEndTime("");
                  setVenueId("");
                  setMaxParticipants("");
                  setMessage("");
                }}
                className="rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-100"
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
            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Event Name
              </label>
              <input
                type="text"
                required
                maxLength={200}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter event name"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Description
              </label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your event..."
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Event Date
              </label>
              <input
                type="date"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div className="mb-6 grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Start Time
                </label>
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  End Time
                </label>
                <input
                  type="time"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Venue
              </label>
              <select
                required
                value={venueId}
                onChange={(e) => setVenueId(e.target.value)}
                disabled={loadingVenues}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
              >
                <option value="">
                  {loadingVenues ? "Loading venues..." : "Select venue"}
                </option>
                {venues.map((venue) => (
                  <option key={venue.venue_id} value={venue.venue_id}>
                    {venue.venue_name} — {venue.location} (Capacity: {venue.capacity})
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Maximum Capacity
              </label>
              <input
                type="number"
                min="1"
                required
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(e.target.value)}
                placeholder="e.g. 100"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />
              {venueId && (
                <p className="mt-2 text-sm text-gray-500">
                  Selected venue capacity:{" "}
                  {venues.find((venue) => venue.venue_id === Number(venueId))
                    ?.capacity}
                </p>
              )}
            </div>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Link
                href="/organizer-dashboard"
                className="rounded-lg border border-gray-300 px-6 py-3 text-center font-semibold text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={submitting || loadingVenues || venues.length === 0}
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Creating Event..." : "Create Event"}
              </button>
            </div>
          </form>
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
