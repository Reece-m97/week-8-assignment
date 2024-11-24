"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function DeedLogPage() {
  const [deeds, setDeeds] = useState([]);
  const [form, setForm] = useState({ description: "", category: "" });
  const [sortOrder, setSortOrder] = useState("desc");
  const [error, setError] = useState(null);

  const userId = 1; // Replace with the logged-in user's ID

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
      setForm({ description: "", category: "" }); // Reset the form
    } catch (err) {
      console.error(err);
      setError("Failed to post deed.");
    }
  };

  return (
    <div>
      <h1>All Villainous Deeds</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          name="description"
          placeholder="Describe your villainous deed"
          value={form.description}
          onChange={handleChange}
          required
        />
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        >
          <option value="">Select a category</option>
          <option value="Petty deeds">Petty deeds</option>
          <option value="Moderate mischief">Moderate mischief</option>
          <option value="Diabolical schemes">Diabolical schemes</option>
        </select>
        <button type="submit">Submit Deed</button>
      </form>

      <button
        onClick={() =>
          setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
        }
      >
        Sort: {sortOrder === "asc" ? "Ascending" : "Descending"}
      </button>
      {error && <p>Error: {error}</p>}
      <ul>
        {deeds.map((deed) => (
          <li key={deed.deed_id}>
            <Link href={`/deeds/${deed.deed_id}`}>
              <p>
                <strong>Villain:</strong> {deed.villain_name}
              </p>
              <p>
                <strong>Description:</strong> {deed.description}
              </p>
              <p>
                <strong>Category:</strong> {deed.category}
              </p>
              <p>
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
