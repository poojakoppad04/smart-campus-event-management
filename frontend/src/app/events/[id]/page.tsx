"use client";

import { useParams, useRouter } from "next/navigation";

const events = [
  {
    id: "1",
    title: "Tech Talk: Future of AI",
    date: "October 10, 2026",
    time: "10:00 AM - 12:00 PM",
    venue: "Main Auditorium",
    organizer: "Computer Science Department",
    category: "Technology",
    seats: 120,
    available: 45,
    description:
      "Join us for an exciting discussion about the future of Artificial Intelligence, emerging technologies, and how AI is transforming different industries.",
  },
  {
    id: "2",
    title: "Campus Hackathon 2026",
    date: "October 15, 2026",
    time: "9:00 AM - 6:00 PM",
    venue: "Innovation Lab",
    organizer: "Coding Club",
    category: "Competition",
    seats: 100,
    available: 32,
    description:
      "Put your coding and problem-solving skills to the test. Build innovative solutions, work with your team, and compete with students across campus.",
  },
  {
    id: "3",
    title: "Photography Workshop",
    date: "October 18, 2026",
    time: "2:00 PM - 4:00 PM",
    venue: "Seminar Hall 2",
    organizer: "Creative Arts Club",
    category: "Workshop",
    seats: 50,
    available: 18,
    description:
      "Learn the fundamentals of photography, composition, lighting, and creative techniques from experienced photographers.",
  },
  {
    id: "4",
    title: "Inter-College Basketball Tournament",
    date: "October 22, 2026",
    time: "9:00 AM - 5:00 PM",
    venue: "University Sports Ground",
    organizer: "Sports Department",
    category: "Sports",
    seats: 200,
    available: 75,
    description:
      "Cheer for your college team at the annual inter-college basketball tournament. Come support your friends and enjoy an exciting day of sports.",
  },
];

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const event = events.find((item) => item.id === params.id);

  if (!event) {
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
              Event Not Found
            </h1>

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

  const registered = event.seats - event.available;
  const percentage = (registered / event.seats) * 100;

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
              {event.category}
            </span>

            <h1 className="mt-6 text-4xl font-bold">{event.title}</h1>

            <p className="mt-4 text-lg text-blue-100">
              Organized by {event.organizer}
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
                  <p className="mt-1 text-lg text-gray-900">{event.date}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Time</p>
                  <p className="mt-1 text-lg text-gray-900">{event.time}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Venue</p>
                  <p className="mt-1 text-lg text-gray-900">{event.venue}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Organizer
                  </p>
                  <p className="mt-1 text-lg text-gray-900">
                    {event.organizer}
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
                  <span className="text-gray-600">Total Seats</span>
                  <span className="font-semibold">{event.seats}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Available Seats</span>
                  <span className="font-semibold text-green-600">
                    {event.available}
                  </span>
                </div>
              </div>

              <div className="mt-6 h-3 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-blue-600"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <p className="mt-2 text-sm text-gray-500">
                {registered} students already registered
              </p>

              <button
                onClick={() => router.push("/login")}
                className="mt-7 w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Register for Event
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
              {event.description}
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