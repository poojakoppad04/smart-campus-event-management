"use client";

import Link from "next/link";
import { useState } from "react";

const students = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul.sharma@college.edu",
    department: "CSE",
    year: "3",
    status: "Registered",
  },
  {
    id: 2,
    name: "Ananya Rao",
    email: "ananya.rao@college.edu",
    department: "ISE",
    year: "2",
    status: "Registered",
  },
  {
    id: 3,
    name: "Arjun Kumar",
    email: "arjun.kumar@college.edu",
    department: "ECE",
    year: "4",
    status: "Registered",
  },
  {
    id: 4,
    name: "Sneha Patel",
    email: "sneha.patel@college.edu",
    department: "CSE",
    year: "2",
    status: "Registered",
  },
  {
    id: 5,
    name: "Vikram Singh",
    email: "vikram.singh@college.edu",
    department: "ME",
    year: "3",
    status: "Registered",
  },
];

export default function RegistrationsPage() {
  const [registrationList, setRegistrationList] = useState(students);

  const removeStudent = (id: number) => {
    setRegistrationList(
      registrationList.filter((student) => student.id !== id)
    );
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
            Manage students registered for your event.
          </p>
        </div>
      </section>

      {/* Event Information */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">
                Selected Event
              </p>

              <h2 className="mt-1 text-2xl font-bold text-gray-900">
                Campus Hackathon 2026
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                📅 October 18, 2026 &nbsp; • &nbsp; ⏰ 10:00 AM &nbsp; • &nbsp;
                📍 Innovation Lab
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
                out of 100 seats
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Registrations */}
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
          {/* Desktop Table */}
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

                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {registrationList.map((student) => (
                  <tr
                    key={student.id}
                    className="border-b last:border-b-0"
                  >
                    <td className="px-6 py-5">
                      <p className="font-semibold text-gray-900">
                        {student.name}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {student.email}
                      </p>
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-600">
                      {student.department}
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-600">
                      Year {student.year}
                    </td>

                    <td className="px-6 py-5">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        ✓ {student.status}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-right">
                      <button
                        onClick={() => removeStudent(student.id)}
                        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-4 p-4 md:hidden">
            {registrationList.map((student) => (
              <div
                key={student.id}
                className="rounded-xl border border-gray-200 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {student.name}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {student.email}
                    </p>
                  </div>

                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                    Registered
                  </span>
                </div>

                <div className="mt-4 text-sm text-gray-600">
                  {student.department} • Year {student.year}
                </div>

                <button
                  onClick={() => removeStudent(student.id)}
                  className="mt-4 w-full rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  Remove Registration
                </button>
              </div>
            ))}
          </div>

          {registrationList.length === 0 && (
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

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6 text-center text-sm text-gray-500">
          © 2026 SmartCampus. Smart Campus Event Management System.
        </div>
      </footer>
    </main>
  );
}