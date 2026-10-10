import Link from "next/link";

const events = [
  {
    id: 1,
    title: "Web Development Workshop",
    category: "Technology",
    date: "Coming Soon",
    venue: "Computer Science Block",
    description:
      "Learn the fundamentals of modern web development and build your first web application.",
    icon: "💻",
  },
  {
    id: 2,
    title: "Campus Cultural Fest",
    category: "Cultural",
    date: "Coming Soon",
    venue: "Main Auditorium",
    description:
      "Celebrate music, dance, art, and culture with students from across the campus.",
    icon: "🎤",
  },
  {
    id: 3,
    title: "Inter-College Hackathon",
    category: "Competition",
    date: "Coming Soon",
    venue: "Innovation Lab",
    description:
      "Build innovative solutions, work with a team, and compete with fellow students.",
    icon: "🏆",
  },
  {
    id: 4,
    title: "Entrepreneurship Talk",
    category: "Business",
    date: "Coming Soon",
    venue: "Seminar Hall",
    description:
      "Listen to experienced entrepreneurs and learn about starting your own venture.",
    icon: "💡",
  },
  {
    id: 5,
    title: "Sports Meet",
    category: "Sports",
    date: "Coming Soon",
    venue: "College Ground",
    description:
      "Take part in exciting sports activities and represent your department.",
    icon: "🏃",
  },
  {
    id: 6,
    title: "Photography Workshop",
    category: "Workshop",
    date: "Coming Soon",
    venue: "Media Center",
    description:
      "Improve your photography skills and learn useful techniques from experienced photographers.",
    icon: "📷",
  },
];

export default function EventsPage() {
  return (
    <main className="min-h-screen bg-slate-50">

      {/* Navbar */}
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <Link
            href="/"
            className="text-2xl font-bold text-blue-600"
          >
            SmartCampus
          </Link>

          <div className="flex items-center gap-6">

            <Link
              href="/events"
              className="font-semibold text-blue-600"
            >
              Events
            </Link>

            <Link
              href="/login"
              className="font-medium text-slate-600 hover:text-blue-600"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
            >
              Register
            </Link>

          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="mx-auto max-w-7xl px-6 py-16 text-center">

          <p className="text-sm font-semibold uppercase tracking-widest text-blue-200">
            SmartCampus Events
          </p>

          <h1 className="mt-3 text-4xl font-bold text-white md:text-5xl">
            Discover Campus Events
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
            Explore workshops, competitions, cultural activities,
            sports, and more.
          </p>

        </div>
      </section>

      {/* Search and Filter */}
      <section className="mx-auto max-w-7xl px-6 py-10">

        <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 md:flex-row">

          <input
            type="text"
            placeholder="Search events..."
            className="flex-1 rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          />

          <select
            defaultValue="All"
            className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="All">All Categories</option>
            <option value="Technology">Technology</option>
            <option value="Cultural">Cultural</option>
            <option value="Competition">Competition</option>
            <option value="Business">Business</option>
            <option value="Sports">Sports</option>
            <option value="Workshop">Workshop</option>
          </select>

        </div>

      </section>

      {/* Events */}
      <section className="mx-auto max-w-7xl px-6 pb-20">

        <div className="mb-6">

          <h2 className="text-2xl font-bold text-slate-900">
            Upcoming Events
          </h2>

          <p className="mt-1 text-slate-600">
            Browse available campus events.
          </p>

        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {events.map((event) => (
            <div
              key={event.id}
              className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-md"
            >

              {/* Icon */}
              <div className="flex h-40 items-center justify-center bg-blue-50 text-6xl">
                {event.icon}
              </div>

              {/* Details */}
              <div className="p-6">

                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  {event.category}
                </span>

                <h3 className="mt-4 text-xl font-bold text-slate-900">
                  {event.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {event.description}
                </p>

                <div className="mt-5 space-y-2 text-sm text-slate-600">
                  <p>📅 {event.date}</p>
                  <p>📍 {event.venue}</p>
                </div>

                <button
                  className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  View Event
                </button>

              </div>

            </div>
          ))}

        </div>

      </section>

      {/* Footer */}
      <footer className="border-t bg-slate-900">

        <div className="mx-auto max-w-7xl px-6 py-8 text-center">

          <p className="font-semibold text-white">
            SmartCampus
          </p>

          <p className="mt-2 text-sm text-slate-400">
            Smart Campus Event Management System
          </p>

          <p className="mt-4 text-xs text-slate-500">
            © 2026 SmartCampus. All rights reserved.
          </p>

        </div>

      </footer>

    </main>
  );
}