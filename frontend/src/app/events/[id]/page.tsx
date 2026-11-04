"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type EventDetails = {
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
};

function formatDate(value: string) {
  const [year, month, day] = value.split("T")[0].split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  return new Date(2000, 0, 1, hours, minutes).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [event, setEvent] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [role, setRole] = useState("");
  const [registering, setRegistering] = useState(false);
  const [message, setMessage] = useState("");
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("token") || "";
    const savedUser = localStorage.getItem("user");

    setToken(savedToken);

    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setRole(user.role || "");
      } catch {
        setRole("");
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchEvent() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("http://127.0.0.1:5001/api/events", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to load event details.");
        }

        const data = await response.json();

        if (!data.success || !Array.isArray(data.events)) {
          throw new Error("Invalid response received from the server.");
        }

        const selectedEvent = data.events.find(
          (item: EventDetails) => String(item.event_id) === String(eventId)
        );

        setEvent(selectedEvent || null);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message || "Something went wrong.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchEvent();
    return () => controller.abort();
  }, [eventId]);

  async function handleRegistration() {
    const savedToken = localStorage.getItem("token") || "";
    const savedUser = localStorage.getItem("user");

    if (!savedToken) {
      router.push("/login");
      return;
    }

    let currentRole = "";

    try {
      currentRole = savedUser ? JSON.parse(savedUser).role : "";
    } catch {
      currentRole = "";
    }

    if (currentRole !== "student") {
      setMessage("Please log in using a student account to register.");
      return;
    }

    setRegistering(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://127.0.0.1:5001/api/registrations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${savedToken}`,
          },
          body: JSON.stringify({
            event_id: Number(eventId),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        setMessage(result.message || "Registration failed. Please try again.");
        return;
      }

      setRegistered(true);
      setMessage("Registration successful! You are registered for this event.");
    } catch (err) {
      console.error("Registration error:", err);
      setMessage("Unable to connect to the server. Please try again.");
    } finally {
      setRegistering(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <nav className="border-b bg-white px-6 py-5">
          <button onClick={() => router.push("/")} className="text-2xl font-bold text-blue-600">
            SmartCampus
          </button>
        </nav>
        <div className="flex min-h-[70vh] items-center justify-center">
          <p className="text-lg font-medium text-black">Loading event details...</p>
        </div>
      </main>
    );
  }

  if (error || !event) {
    return (
      <main className="min-h-screen bg-gray-50">
        <nav className="border-b bg-white px-6 py-5">
          <button onClick={() => router.push("/")} className="text-2xl font-bold text-blue-600">
            SmartCampus
          </button>
        </nav>
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-black">
              {error ? "Unable to Load Event" : "Event Not Found"}
            </h1>
            <p className="mt-4 text-black">
              {error || "This event may have been removed or does not exist."}
            </p>
            <button onClick={() => router.push("/events")} className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white">
              View Events
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <button onClick={() => router.push("/")} className="text-2xl font-bold text-blue-600">
            SmartCampus
          </button>
          <div className="flex items-center gap-6">
            <button onClick={() => router.push("/")} className="text-black hover:text-blue-600">Home</button>
            <button onClick={() => router.push("/events")} className="font-medium text-blue-600">Events</button>
            {token ? (
              <button
                onClick={() => router.push(role === "organizer" ? "/organizer-dashboard" : "/dashboard")}
                className="text-black hover:text-blue-600"
              >
                Dashboard
              </button>
            ) : (
              <button onClick={() => router.push("/login")} className="text-black hover:text-blue-600">
                Login
              </button>
            )}
            {!token && (
              <button onClick={() => router.push("/register")} className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">
                Register
              </button>
            )}
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <button onClick={() => router.push("/events")} className="mb-8 font-medium text-blue-600 hover:text-blue-800">
          ← Back to Events
        </button>

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-12 text-white">
            <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-medium">
              Campus Event
            </span>
            <h1 className="mt-6 text-4xl font-bold">{event.title}</h1>
            <p className="mt-4 text-lg text-blue-100">
              Organized by {event.organizer_name}
            </p>
          </div>

          <div className="grid gap-10 px-8 py-10 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-black">Event Information</h2>
              <div className="mt-7 space-y-6">
                <div>
                  <p className="text-sm font-medium text-black">Date</p>
                  <p className="mt-1 text-lg text-black">{formatDate(event.event_date)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-black">Time</p>
                  <p className="mt-1 text-lg text-black">
                    {formatTime(event.start_time)} - {formatTime(event.end_time)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-black">Venue</p>
                  <p className="mt-1 text-lg text-black">{event.venue_name}</p>
                  <p className="mt-1 text-sm text-black">{event.venue_location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-black">Organizer</p>
                  <p className="mt-1 text-lg text-black">{event.organizer_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-black">Event Status</p>
                  <p className="mt-1 text-lg font-semibold text-black">{event.status}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-gray-50 p-7">
              <h2 className="text-2xl font-bold text-black">Registration</h2>
              <div className="mt-7 space-y-4">
                <div className="flex justify-between">
                  <span className="text-black">Total Seats</span>
                  <span className="font-semibold text-black">{event.max_participants}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black">Venue Capacity</span>
                  <span className="font-semibold text-black">{event.venue_capacity}</span>
                </div>
              </div>

              <div className="mt-6 rounded-lg bg-white p-4">
                <p className="text-sm text-black">
                  Seat availability will be confirmed during registration.
                </p>
              </div>

              {role === "organizer" ? (
                <p className="mt-7 text-center text-sm text-gray-600">
                  Organizer accounts cannot register for events.
                </p>
              ) : (
                <button
                  onClick={handleRegistration}
                  disabled={registering || registered}
                  className="mt-7 w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {registered ? "✓ Registered" : registering ? "Registering..." : "Register for Event"}
                </button>
              )}

              {message && (
                <p className="mt-3 rounded-lg bg-white p-3 text-center text-sm font-medium text-blue-700">
                  {message}
                </p>
              )}

              {!token && (
                <p className="mt-3 text-center text-sm text-black">
                  Please log in as a student to register.
                </p>
              )}
            </div>
          </div>

          <div className="border-t px-8 py-10">
            <h2 className="text-2xl font-bold text-black">About This Event</h2>
            <p className="mt-4 max-w-3xl leading-7 text-black">
              {event.description || "No description has been provided for this event."}
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8 text-center text-sm text-black">
          © 2026 SmartCampus. Smart Campus Event Management System.
        </div>
      </footer>
    </main>
  );
}
