import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* Navbar */}
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-600">
            SmartCampus
          </Link>

          {/* Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="/events"
              className="text-sm font-medium text-slate-600 hover:text-blue-600"
            >
              Events
            </Link>

            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 hover:text-blue-600"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="mx-auto max-w-7xl px-6 py-24 text-center">

          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-200">
            Smart Campus Event Management
          </p>

          <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight text-white md:text-6xl">
            Discover. Register. Participate.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-blue-100">
            Find exciting events happening on campus, register with ease,
            and never miss an opportunity to participate.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">

            <Link
              href="/events"
              className="rounded-lg bg-white px-7 py-3.5 font-semibold text-blue-700 shadow-lg hover:bg-slate-100"
            >
              Explore Events
            </Link>

            <Link
              href="/register"
              className="rounded-lg border border-white px-7 py-3.5 font-semibold text-white hover:bg-white/10"
            >
              Create Account
            </Link>

          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-20">

        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold">
            Everything you need for campus events
          </h2>

          <p className="mt-3 text-slate-600">
            A simple platform for students and event organizers.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">

          {/* Feature 1 */}
          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
              🔎
            </div>

            <h3 className="text-xl font-semibold">
              Discover Events
            </h3>

            <p className="mt-3 leading-7 text-slate-600">
              Browse upcoming campus events and find activities that
              match your interests.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-2xl">
              📅
            </div>

            <h3 className="text-xl font-semibold">
              Easy Registration
            </h3>

            <p className="mt-3 leading-7 text-slate-600">
              Register for events quickly and keep track of all your
              registrations in one place.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-2xl">
              🎓
            </div>

            <h3 className="text-xl font-semibold">
              Campus Community
            </h3>

            <p className="mt-3 leading-7 text-slate-600">
              Connect with campus activities, participate in events,
              and share your feedback.
            </p>
          </div>

        </div>
      </section>

      {/* Upcoming Events Preview */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                What's happening
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                Upcoming Events
              </h2>
            </div>

            <Link
              href="/events"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              View all events →
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">

            {/* Event Card 1 */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              <div className="flex h-36 items-center justify-center bg-blue-100 text-5xl">
                💻
              </div>

              <div className="p-6">
                <p className="text-sm font-medium text-blue-600">
                  Technology
                </p>

                <h3 className="mt-2 text-xl font-semibold">
                  Web Development Workshop
                </h3>

                <p className="mt-3 text-sm text-slate-600">
                  Learn the fundamentals of modern web development.
                </p>

                <p className="mt-4 text-sm font-medium text-slate-700">
                  📅 Coming Soon
                </p>
              </div>
            </div>

            {/* Event Card 2 */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              <div className="flex h-36 items-center justify-center bg-green-100 text-5xl">
                🎤
              </div>

              <div className="p-6">
                <p className="text-sm font-medium text-green-600">
                  Cultural
                </p>

                <h3 className="mt-2 text-xl font-semibold">
                  Campus Cultural Fest
                </h3>

                <p className="mt-3 text-sm text-slate-600">
                  Celebrate talent, culture, music, and creativity.
                </p>

                <p className="mt-4 text-sm font-medium text-slate-700">
                  📅 Coming Soon
                </p>
              </div>
            </div>

            {/* Event Card 3 */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              <div className="flex h-36 items-center justify-center bg-purple-100 text-5xl">
                🏆
              </div>

              <div className="p-6">
                <p className="text-sm font-medium text-purple-600">
                  Competition
                </p>

                <h3 className="mt-2 text-xl font-semibold">
                  Inter-College Hackathon
                </h3>

                <p className="mt-3 text-sm text-slate-600">
                  Build innovative solutions and compete with fellow students.
                </p>

                <p className="mt-4 text-sm font-medium text-slate-700">
                  📅 Coming Soon
                </p>
              </div>
            </div>

          </div>
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