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
  registration_date: string | null;
  registration_status: string | null;
}

function formatTime(time: string) {
  const date = new Date(time);
  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });
}

export default function MyRegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRegistrations() {
      const token = sessionStorage.getItem("token");

      if (!token) {
        setError("Please log in as a student to view your registrations.");
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
          throw new Error(data.message || "Unable to load registrations.");
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

    fetchRegistrations();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            SmartCampus
          </Link>

          <div className="flex gap-6 text-sm font-medium">
            <Link href="/events" className="text-gray-600 hover:text-blue-600">
              Events
            </Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-blue-600">
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-r from-indigo-600 to-blue-600">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <h1 className="text-4xl font-bold text-white">
            My Registrations
          </h1>
          <p className="mt-3 text-blue-100">
            View the campus events you have registered for.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-blue-600">
            Total Registered Events
          </p>
          <p className="mt-1 text-3xl font-bold text-blue-600">
            {loading ? "..." : registrations.length}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12">
        {loading && (
          <div className="rounded-2xl bg-white p-12 text-center text-gray-500">
            Loading your registrations...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl bg-white p-8 text-center">
            <p className="font-semibold text-red-600">{error}</p>
            <Link
              href="/login"
              className="mt-4 inline-block text-blue-600 hover:underline"
            >
              Go to Login
            </Link>
          </div>
        )}

        {!loading && !error && registrations.length === 0 && (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
            <div className="text-4xl">🎟️</div>
            <h2 className="mt-4 text-xl font-bold text-gray-900">
              No registrations yet
            </h2>
            <p className="mt-2 text-gray-500">
              Explore campus events and register for your favourites.
            </p>
            <Link
              href="/events"
              className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Explore Events
            </Link>
          </div>
        )}

        {!loading && !error && registrations.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2">
            {registrations.map((registration) => (
              <article
                key={registration.registration_id}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-xl font-bold text-gray-900">
                    {registration.event_title}
                  </h2>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    {registration.registration_status || "Unknown"}
                  </span>
                </div>

                <div className="mt-5 space-y-3 text-sm text-gray-600">
                  <p>
                    <strong className="text-gray-800">Date:</strong>{" "}
                    {new Date(
                      `${registration.event_date.split("T")[0]}T00:00:00`
                    ).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p>
                    <strong className="text-gray-800">Time:</strong>{" "}
                    {formatTime(registration.start_time)} – {formatTime(registration.end_time)}
                  </p>
                  <p>
                    <strong className="text-gray-800">Venue:</strong>{" "}
                    {registration.venue_name}
                  </p>
                  <p>
                    <strong className="text-gray-800">Location:</strong>{" "}
                    {registration.venue_location}
                  </p>
                  <p>
                    <strong className="text-gray-800">Event Status:</strong>{" "}
                    {registration.event_status || "Not specified"}
                  </p>
                </div>

                <div className="mt-5 border-t pt-4 text-xs text-gray-500">
                  Registration ID: {registration.registration_id}
                </div>
              </article>
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
