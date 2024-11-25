"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Login failed");
      }

      const data = await res.json();
      localStorage.setItem("villainUser", JSON.stringify(data));
      router.push("/dashboard");
    } catch (err) {
      console.error(err.message);
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleLogin} className="p-4">
      <h1 className="text-2xl font-bold">Login</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="mt-2">
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="block w-full p-2 border rounded"
        />
      </div>
      <div className="mt-2">
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block w-full p-2 border rounded"
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2 mt-4 text-white bg-blue-500 rounded"
      >
        Login
      </button>
      <p>
        Don&apos;t have an account?{" "}
        <a href="/register" className="text-blue-500 underline">
          Register here
        </a>
      </p>
    </form>
  );
}
