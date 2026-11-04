"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

function formatDate(date: string) {
  return new Date(`${date.split("T")[0]}T00:00:00`).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
}

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [registering, setRegistering] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState("");
  const [registrationError, setRegistrationError] = useState("");

  useEffect(() => {
    async function fetchEvent() {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

        const response = await fetch(`${apiUrl}/events`);

        if (!response.ok) {
          throw new Error("Unable to retrieve event details.");
        }

        const data = await response.json();

        if (!data.success || !Array.isArray(data.events)) {
          throw new Error("Unexpected response from the server.");
        }

        const selectedEvent = data.events.find(
          (item: Event) => item.event_id === Number(params.id)
        );

        if (!selectedEvent) {
          setEvent(null);
        } else {
          setEvent(selectedEvent);
        }
      } catch (err) {
        console.error("Event details error:", err);
        setError(
          err instanceof Error ? err.message : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, [params.id]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-600">Loading event details...</p>
      </main>
    );
  }

  if (error || !event) {
    return (
      <main className="min-h-screen bg-gray-50">
        <nav className="border-b bg-white px-6 py-5">
          <button
            onClick={() => router.push("/")}
            className="text-2xl font-bold text-blue-600"
          >
            SmartCampus
          </button>
        </nav>

        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900">
              {error ? "Unable to Load Event" : "Event Not Found"}
            </h1>

            {error && <p className="mt-3 text-gray-600">{error}</p>}

            <button
              onClick={() => router.push("/events")}
              className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white"
            >
              View Events
            </button>
          </div>
        </div>
      </main>
    );
  }

  const category = getCategory(event.title);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <button
            onClick={() => router.push("/")}
            className="text-2xl font-bold text-blue-600"
          >
            SmartCampus
          </button>

          <div className="flex items-center gap-6">
            <button
              onClick={() => router.push("/")}
              className="text-gray-700 hover:text-blue-600"
            >
              Home
            </button>

            <button
              onClick={() => router.push("/events")}
              className="font-medium text-blue-600"
            >
              Events
            </button>

            <button
              onClick={() => router.push("/login")}
              className="text-gray-700 hover:text-blue-600"
            >
              Login
            </button>

            <button
              onClick={() => router.push("/register")}
              className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
            >
              Register
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <section className="mx-auto max-w-5xl px-6 py-12">
        <button
          onClick={() => router.push("/events")}
          className="mb-8 font-medium text-blue-600 hover:text-blue-800"
        >
          ← Back to Events
        </button>

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-12 text-white">
            <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-medium">
              {category}
            </span>

            <h1 className="mt-6 text-4xl font-bold">{event.title}</h1>

            <p className="mt-4 text-lg text-blue-100">
              Organized by {event.organizer_name}
            </p>
          </div>

          {/* Details */}
          <div className="grid gap-10 px-8 py-10 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Event Information
              </h2>

              <div className="mt-7 space-y-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p className="mt-1 text-lg text-gray-900">
                    {formatDate(event.event_date)}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Time</p>
                  <p className="mt-1 text-lg text-gray-900">
                    {event.start_time} – {event.end_time}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Venue</p>
                  <p className="mt-1 text-lg text-gray-900">
                    {event.venue_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {event.venue_location}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Organizer
                  </p>
                  <p className="mt-1 text-lg text-gray-900">
                    {event.organizer_name}
                  </p>
                </div>
              </div>
            </div>

            {/* Registration */}
            <div className="rounded-2xl bg-gray-50 p-7">
              <h2 className="text-2xl font-bold text-gray-900">
                Registration
              </h2>

              <div className="mt-7 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Maximum Participants</span>
                  <span className="font-semibold">
                    {event.max_participants}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Venue Capacity</span>
                  <span className="font-semibold">
                    {event.venue_capacity}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Event Status</span>
                  <span className="font-semibold text-green-600">
                    {event.status}
                  </span>
                </div>
              </div>

              <div className="mt-7 rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
                Registration availability will be confirmed when you register.
              </div>

              {registrationMessage && (
                <p className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                  {registrationMessage}
                </p>
              )}

              {registrationError && (
                <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  {registrationError}
                </p>
              )}

              <button
                onClick={async () => {
                  setRegistrationMessage("");
                  setRegistrationError("");

                  const token = sessionStorage.getItem("token");

                  if (!token) {
                    router.push("/login");
                    return;
                  }

                  setRegistering(true);

                  try {
                    const apiUrl =
                      process.env.NEXT_PUBLIC_API_URL ||
                      "http://localhost:5001/api";

                    const response = await fetch(`${apiUrl}/registrations`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({
                        event_id: event.event_id,
                      }),
                    });

                    const data = await response.json();

                    if (!response.ok || !data.success) {
                      throw new Error(
                        data.message || "Registration failed."
                      );
                    }

                    setRegistrationMessage(
                      "Registration successful! You are registered for this event."
                    );
                  } catch (err) {
                    setRegistrationError(
                      err instanceof Error
                        ? err.message
                        : "Unable to complete registration."
                    );
                  } finally {
                    setRegistering(false);
                  }
                }}
                disabled={registering || event.status === "Cancelled"}
                className="mt-7 w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {registering ? "Registering..." : "Register for Event"}
              </button>

              <p className="mt-3 text-center text-sm text-gray-500">
                Login required to register
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="border-t px-8 py-10">
            <h2 className="text-2xl font-bold text-gray-900">
              About This Event
            </h2>

            <p className="mt-4 max-w-3xl leading-7 text-gray-600">
              {event.description || "No description available."}
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8 text-center text-sm text-gray-500">
          © 2026 SmartCampus. Smart Campus Event Management System.
        </div>
      </footer>
    </main>
  );
}
