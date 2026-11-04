"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Registration {
  registration_id: number;
  student_id: number;
  student_name: string;
  student_email: string;
  department: string | null;
  year_of_study: number | null;
  event_id: number;
  event_title: string;
  registration_date: string;
  status: string;
}

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRegistrations = async () => {
      const token = sessionStorage.getItem("token");

      if (!token) {
        setError("Please log in as an organizer to view registrations.");
        setLoading(false);
        return;
      }

      try {
        const eventId = new URLSearchParams(window.location.search).get("eventId");

        const registrationsUrl =
          `${process.env.NEXT_PUBLIC_API_URL}/registrations` +
          (eventId ? `?eventId=${encodeURIComponent(eventId)}` : "");

        const response = await fetch(registrationsUrl, {
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

  const totalRegistered = registrations.filter(
    (registration) => registration.status === "Registered"
  ).length;

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
        <div className="mx-auto max-w-7xl px-6 py-10">
          <Link
            href="/organizer-dashboard"
            className="text-sm font-medium text-blue-100 hover:text-white"
          >
            ← Back to Dashboard
          </Link>

          <h1 className="mt-5 text-4xl font-bold text-white">
            Event Registrations
          </h1>

          <p className="mt-3 text-blue-100">
            View students registered for your events.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-blue-600">
            Total Registrations
          </p>

          <p className="mt-1 text-3xl font-bold text-blue-600">
            {loading ? "..." : totalRegistered}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Active student registrations across your events
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-gray-900">
            Registered Students
          </h2>
          <p className="mt-1 text-gray-500">
            Registration records retrieved from the database.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          {loading && (
            <div className="p-12 text-center text-gray-500">
              Loading registrations...
            </div>
          )}

          {!loading && error && (
            <div className="p-8 text-center">
              <p className="font-semibold text-red-600">{error}</p>
            </div>
          )}

          {!loading && !error && registrations.length === 0 && (
            <div className="p-12 text-center">
              <div className="text-4xl">👥</div>
              <h3 className="mt-4 text-lg font-bold text-gray-900">
                No registrations yet
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Students who register for your events will appear here.
              </p>
            </div>
          )}

          {!loading && !error && registrations.length > 0 && (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full">
                  <thead className="border-b bg-gray-50">
                    <tr>
                      {[
                        "Student",
                        "Event",
                        "Department",
                        "Year",
                        "Date",
                        "Status",
                      ].map((heading) => (
                        <th
                          key={heading}
                          className="px-6 py-4 text-left text-sm font-semibold text-gray-700"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {registrations.map((registration) => (
                      <tr
                        key={registration.registration_id}
                        className="border-b last:border-b-0"
                      >
                        <td className="px-6 py-5">
                          <p className="font-semibold text-gray-900">
                            {registration.student_name}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            {registration.student_email}
                          </p>
                        </td>

                        <td className="px-6 py-5 text-sm text-gray-700">
                          {registration.event_title}
                        </td>

                        <td className="px-6 py-5 text-sm text-gray-600">
                          {registration.department || "—"}
                        </td>

                        <td className="px-6 py-5 text-sm text-gray-600">
                          {registration.year_of_study
                            ? `Year ${registration.year_of_study}`
                            : "—"}
                        </td>

                        <td className="px-6 py-5 text-sm text-gray-600">
                          {new Date(
                            registration.registration_date
                          ).toLocaleDateString()}
                        </td>

                        <td className="px-6 py-5">
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                            {registration.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-4 p-4 md:hidden">
                {registrations.map((registration) => (
                  <div
                    key={registration.registration_id}
                    className="rounded-xl border border-gray-200 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {registration.student_name}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {registration.student_email}
                        </p>
                      </div>

                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                        {registration.status}
                      </span>
                    </div>

                    <p className="mt-3 text-sm font-medium text-gray-800">
                      {registration.event_title}
                    </p>

                    <p className="mt-2 text-sm text-gray-600">
                      {registration.department || "—"} •{" "}
                      {registration.year_of_study
                        ? `Year ${registration.year_of_study}`
                        : "Year not specified"}
                    </p>

                    <p className="mt-2 text-xs text-gray-500">
                      Registered:{" "}
                      {new Date(
                        registration.registration_date
                      ).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </>
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
