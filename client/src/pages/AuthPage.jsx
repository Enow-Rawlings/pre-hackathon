import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const inputClass =
  "w-full rounded-lg border border-slate-300 p-2 outline-none focus:border-indigo-500";

export default function AuthPage({ mode }) {
  const isRegister = mode === "register";
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // One handler for all inputs, using each input's name attribute
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (isRegister) await register(form.name, form.email, form.password);
      else await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-3 rounded-xl bg-white p-6 shadow"
      >
        <h1 className="text-2xl font-bold text-slate-800">
          {isRegister ? "Create account" : "Welcome back"}
        </h1>

        {error && (
          <p className="rounded-lg bg-red-100 p-3 text-sm text-red-700">{error}</p>
        )}

        {isRegister && (
          <input
            className={inputClass}
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />
        )}
        <input
          className={inputClass}
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          className={inputClass}
          type="password"
          name="password"
          placeholder="Password (min 6 characters)"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {submitting ? "Please wait..." : isRegister ? "Register" : "Login"}
        </button>

        <p className="text-center text-sm text-slate-500">
          {isRegister ? "Already have an account? " : "No account yet? "}
          <Link
            to={isRegister ? "/login" : "/register"}
            className="text-indigo-600 hover:underline"
          >
            {isRegister ? "Login" : "Register"}
          </Link>
        </p>
      </form>
    </div>
  );
}