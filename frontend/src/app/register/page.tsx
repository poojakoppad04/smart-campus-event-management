"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(event.currentTarget);

    const studentData = {
      name: String(form.get("name") || "").trim(),
      email: String(form.get("email") || "").trim(),
      phone: String(form.get("phone") || "").trim(),
      department: String(form.get("department") || ""),
      year: String(form.get("year") || ""),
      password: String(form.get("password") || ""),
      confirmPassword: String(form.get("confirmPassword") || ""),
    };

    try {
      const response = await fetch("http://127.0.0.1:5001/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.message || "Registration failed. Please try again.");
        return;
      }

      alert("Account created successfully! Please log in.");
      router.push("/login");
    } catch (err) {
      console.error("Registration error:", err);
      setError("Unable to connect to the server. Please check that the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <button
            onClick={() => router.push("/")}
            className="text-2xl font-bold text-blue-600"
          >
            SmartCampus
          </button>

          <button
            onClick={() => router.push("/events")}
            className="text-gray-700 hover:text-blue-600"
          >
            Browse Events
          </button>
        </div>
      </nav>

      <section className="px-6 py-12">
        <div className="mx-auto w-full max-w-lg">
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-900">
                Create Account
              </h1>

              <p className="mt-2 text-gray-600">
                Join SmartCampus and discover campus events
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                  Student Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="student@example.com"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="department" className="mb-2 block text-sm font-medium text-gray-700">
                    Department
                  </label>
                  <select
                    id="department"
                    name="department"
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">Select</option>
                    <option value="CSE">CSE</option>
                    <option value="ISE">ISE</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
                    <option value="ME">ME</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="year" className="mb-2 block text-sm font-medium text-gray-700">
                    Year
                  </label>
                  <select
                    id="year"
                    name="year"
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">Select</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  minLength={8}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  minLength={8}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <div className="mt-7 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={() => router.push("/login")}
                  className="font-semibold text-blue-600 hover:text-blue-800"
                >
                  Login
                </button>
              </p>
            </div>
          </div>

          <button
            onClick={() => router.push("/")}
            className="mt-6 block w-full text-center text-sm text-gray-500 hover:text-blue-600"
          >
            ← Back to Home
          </button>
        </div>
      </section>
    </main>
  );
}
