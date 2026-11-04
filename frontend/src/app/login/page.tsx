"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputClass =
    "w-full rounded-lg border border-gray-400 bg-white px-4 py-3 text-black placeholder:text-gray-600 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200";

  const labelClass = "mb-2 block text-sm font-semibold text-black";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("http://127.0.0.1:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: String(form.get("email") || "").trim(),
          password: String(form.get("password") || ""),
          role: String(form.get("role") || ""),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.message || "Invalid email or password.");
        return;
      }

      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));

      if (result.user.role === "organizer") {
        router.push("/organizer-dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Unable to connect to the server. Please check that the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 text-black">
      <nav className="border-b border-gray-300 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <button
            onClick={() => router.push("/")}
            className="text-2xl font-bold text-blue-700"
          >
            SmartCampus
          </button>

          <button
            onClick={() => router.push("/events")}
            className="font-medium text-black hover:text-blue-700"
          >
            Browse Events
          </button>
        </div>
      </nav>

      <section className="px-6 py-12">
        <div className="mx-auto w-full max-w-lg">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-black">
                Welcome Back
              </h1>
              <p className="mt-2 text-gray-800">
                Login to your SmartCampus account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className={labelClass}>
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="role" className={labelClass}>
                  Login As
                </label>
                <select
                  id="role"
                  name="role"
                  required
                  defaultValue="student"
                  className={inputClass}
                >
                  <option value="student">Student</option>
                  <option value="organizer">Organizer</option>
                </select>
                <label htmlFor="password" className={labelClass}>
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  className={inputClass}
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
                className="w-full rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="mt-7 text-center">
              <p className="text-sm text-black">
                Don't have an account?{" "}
                <button
                  onClick={() => router.push("/register")}
                  className="font-bold text-blue-700 hover:text-blue-900"
                >
                  Register
                </button>
              </p>
            </div>
          </div>

          <button
            onClick={() => router.push("/")}
            className="mt-6 block w-full text-center text-sm font-medium text-black hover:text-blue-700"
          >
            ← Back to Home
          </button>
        </div>
      </section>
    </main>
  );
}


