"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [deeds, setDeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // User session check
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("villainUser"));

    if (!savedUser) {
      router.push("/");
    } else {
      setUser(savedUser);
      fetchProfile(savedUser.id);
    }
  }, [router]);

  // Fetch the user's profile and deeds from the API
  const fetchProfile = async (userId) => {
    try {
      const res = await fetch(`/api/users/${userId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch profile data");
      }
      const data = await res.json();
      setProfile(data.user);
      setDeeds(data.deeds);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle deed deletion
  const handleDelete = async (deedId) => {
    if (!confirm("Are you sure you want to delete this deed?")) return;

    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deedId }),
      });

      if (!res.ok) {
        throw new Error("Failed to delete deed");
      }

      setDeeds((prev) => prev.filter((deed) => deed.deed_id !== deedId));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!profile) {
    return <p>Profile not found</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        {profile.villain_name}&apos;s Profile
      </h1>
      <p className="text-lg">
        <strong className="font-semibold">Title:</strong> {profile.title}
      </p>
      <p className="mt-2 text-gray-700">
        <strong className="font-semibold">Backstory:</strong>{" "}
        {profile.backstory}
      </p>
      <p className="mt-2 text-lg">
        <strong className="font-semibold">Notoriety Score:</strong>{" "}
        {profile.notoriety_score}
      </p>

      <h2 className="mt-6 text-xl font-bold">Your Deeds</h2>
      <ul className="mt-4 space-y-4">
        {deeds.map((deed) => (
          <li key={deed.deed_id} className="p-4 border rounded-lg shadow">
            <p className="font-semibold">
              <strong>Description:</strong> {deed.description}
            </p>
            <p className="text-gray-600">
              <strong>Category:</strong> {deed.category}
            </p>
            <p className="text-sm text-gray-500">
              <strong>Date:</strong> {new Date(deed.date).toLocaleString()}
            </p>
            <p className="mt-2">
              <strong>Evil Laughs:</strong> {deed.evil_laughs} |{" "}
              <strong>Comments:</strong> {deed.comments_count}
            </p>
            <button
              onClick={() => handleDelete(deed.deed_id)}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
