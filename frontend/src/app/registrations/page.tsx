"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface OrganizerEvent {
  event_id: number;
  title: string;
  event_date: string;
  start_time: string;
  max_participants: number;
  venue_name: string;
}

interface Registration {
  registration_id: number;
  student_id: number;
  student_name: string;
  student_email: string;
  department: string;
  year_of_study: number;
  event_id: number;
  event_title: string;
  registration_date: string;
  status: string;
}

function formatDate(value: string) {
  if (!value) return "Date unavailable";

  const datePart = value.substring(0, 10);
  const [year, month, day] = datePart.split("-").map(Number);

  if (!year || !month || !day) return datePart;

  return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(value: string) {
  if (!value) return "";

  const parts = value.split(":");
  const hour = Number(parts[0]);
  const minute = parts[1] || "00";

  if (Number.isNaN(hour)) return value;

  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;

  return `${String(displayHour).padStart(2, "0")}:${minute} ${suffix}`;
}

export default function RegistrationsPage() {
  const [event, setEvent] = useState<OrganizerEvent | null>(null);
  const [registrationList, setRegistrationList] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRegistrations = async () => {
      const params = new URLSearchParams(window.location.search);
      const selectedEventId = Number(params.get("eventId"));

      if (!selectedEventId || !Number.isInteger(selectedEventId)) {
        setError("Please select an event from the Organizer Dashboard.");
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please log in as an organizer to view registrations.");
        setLoading(false);
        return;
      }

      try {
        const [registrationResponse, eventResponse] = await Promise.all([
          fetch("http://127.0.0.1:5001/api/registrations", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch("http://127.0.0.1:5001/api/events"),
        ]);

        const registrationData = await registrationResponse.json();
        const eventData = await eventResponse.json();

        if (!registrationResponse.ok) {
          throw new Error(
            registrationData.message || "Failed to fetch registrations."
          );
        }

        if (!eventResponse.ok) {
          throw new Error("Failed to fetch event information.");
        }

        const selectedEvent = (eventData.events || []).find(
          (item: OrganizerEvent) =>
            Number(item.event_id) === selectedEventId
        );

        if (!selectedEvent) {
          throw new Error("Selected event could not be found.");
        }

        setEvent(selectedEvent);

        const actualRegistrations = (
          registrationData.registrations || []
        ).filter(
          (registration: Registration) =>
            Number(registration.event_id) === selectedEventId
        );

        setRegistrationList(actualRegistrations);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading registrations."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

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
              className="text-gray-600 transition hover:text-blue-600"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-r from-indigo-600 to-blue-600">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <Link
            href="/organizer-dashboard"
            className="text-sm font-medium text-blue-100 hover:text-white"
          >
            &larr; Back to Dashboard
          </Link>

          <h1 className="mt-5 text-4xl font-bold text-white">
            Event Registrations
          </h1>

          <p className="mt-3 text-blue-100">
            Manage students registered for your event.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          {loading ? (
            <p className="py-6 text-center text-gray-500">
              Loading event registrations...
            </p>
          ) : error ? (
            <p className="py-6 text-center text-red-600">{error}</p>
          ) : event ? (
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">
                  Selected Event
                </p>

                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                  {event.title}
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  📅 {formatDate(event.event_date)}
                  &nbsp; • &nbsp;
                  ⏰ {formatTime(event.start_time)}
                  &nbsp; • &nbsp;
                  📍 {event.venue_name}
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 px-6 py-4 text-center">
                <p className="text-sm text-gray-500">
                  Total Registered
                </p>

                <p className="mt-1 text-3xl font-bold text-blue-600">
                  {registrationList.length}
                </p>

                <p className="text-xs text-gray-500">
                  out of {event.max_participants} seats
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-gray-900">
            Registered Students
          </h2>

          <p className="mt-1 text-gray-500">
            Students who have registered for this event.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          {loading ? (
            <p className="p-12 text-center text-gray-500">
              Fetching registrations...
            </p>
          ) : error ? (
            <p className="p-12 text-center text-red-600">
              Unable to display registrations.
            </p>
          ) : registrationList.length > 0 ? (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full">
                  <thead className="border-b bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Student
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Department
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Year
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Registration Date
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {registrationList.map((student) => (
                      <tr
                        key={student.registration_id}
                        className="border-b last:border-b-0"
                      >
                        <td className="px-6 py-5">
                          <p className="font-semibold text-gray-900">
                            {student.student_name}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            {student.student_email}
                          </p>
                        </td>

                        <td className="px-6 py-5 text-sm text-gray-600">
                          {student.department}
                        </td>

                        <td className="px-6 py-5 text-sm text-gray-600">
                          Year {student.year_of_study}
                        </td>

                        <td className="px-6 py-5">
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                            ✓ {student.status}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-sm text-gray-600">
                          {formatDate(student.registration_date)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-4 p-4 md:hidden">
                {registrationList.map((student) => (
                  <div
                    key={student.registration_id}
                    className="rounded-xl border border-gray-200 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {student.student_name}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {student.student_email}
                        </p>
                      </div>

                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                        {student.status}
                      </span>
                    </div>

                    <div className="mt-4 text-sm text-gray-600">
                      {student.department} • Year {student.year_of_study}
                    </div>

                    <p className="mt-2 text-sm text-gray-500">
                      Registered: {formatDate(student.registration_date)}
                    </p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="p-12 text-center">
              <div className="text-4xl">👥</div>

              <h3 className="mt-4 text-lg font-bold text-gray-900">
                No registrations
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                There are currently no students registered for this event.
              </p>
            </div>
          )}
        </div>
      </section>

      <footer className="border-t bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6 text-center text-sm text-gray-500">
          © 2026 SmartCampus. Smart Campus Event Management System.
        </div>
      </footer>
    </main>
  );
}
