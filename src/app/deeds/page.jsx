"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DeedLogPage() {
  const [deeds, setDeeds] = useState([]);
  const [form, setForm] = useState({ description: "", category: "" });
  const [sortOrder, setSortOrder] = useState("desc");
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  // User session check
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("villainUser"));
    if (!savedUser) {
      router.push("/");
    } else {
      setUserId(savedUser.id);
    }
  }, [router]);

  // Fetch deeds from the API
  useEffect(() => {
    async function fetchDeeds() {
      try {
        const res = await fetch(`/api/deeds?sort=${sortOrder}`);
        if (!res.ok) throw new Error("Failed to fetch deeds");
        const data = await res.json();
        setDeeds(data);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchDeeds();
  }, [sortOrder]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setError("User is not logged in.");
      return;
    }

    try {
      const res = await fetch("/api/deeds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...form }),
      });

      if (!res.ok) throw new Error("Failed to post deed");
      const newDeed = await res.json();

      // Update the deeds list to include the new deed
      setDeeds((prev) => [newDeed, ...prev]);
      setForm({ description: "", category: "" });
    } catch (err) {
      console.error(err);
      setError("Failed to post deed.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">All Villainous Deeds</h1>
      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          name="description"
          placeholder="Describe your villainous deed"
          value={form.description}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded mb-4"
        />
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded mb-4"
        >
          <option value="">Select a category</option>
          <option value="Petty deeds">Petty deeds</option>
          <option value="Moderate mischief">Moderate mischief</option>
          <option value="Diabolical schemes">Diabolical schemes</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit Deed
        </button>
      </form>

      <button
        onClick={() =>
          setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
        }
        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 mb-6"
      >
        Sort Date: {sortOrder === "asc" ? "Ascending" : "Descending"}
      </button>

      {error && <p className="text-red-500 mb-4">Error: {error}</p>}

      <ul className="space-y-4">
        {deeds.map((deed) => (
          <li key={deed.deed_id} className="p-4 border rounded-lg shadow">
            <Link href={`/deeds/${deed.deed_id}`}>
              <h3 className="font-semibold">{deed.villain_name}</h3>
              <p>
                <strong>Description:</strong> {deed.description}
              </p>
              <p className="text-gray-600">
                <strong>Category:</strong> {deed.category}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Date:</strong> {new Date(deed.date).toLocaleString()}
              </p>
              <p>
                <strong>Evil Laughs:</strong> {deed.evil_laughs} |{" "}
                <strong>Comments:</strong> {deed.comments_count}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
