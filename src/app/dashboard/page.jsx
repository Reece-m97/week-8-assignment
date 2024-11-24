"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [recentDeeds, setRecentDeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Simulating a user session check
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("villainUser"));
    if (!savedUser) {
      router.push("/");
    } else {
      setUser(savedUser);
      fetchRecentDeeds(savedUser.id);
    }
  }, [router]);

  const fetchRecentDeeds = async (userId) => {
    try {
      const res = await fetch(`/api/recentDeeds?userId=${userId}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setRecentDeeds(data);
    } catch (error) {
      console.error("Error fetching recent deeds:", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Welcome, {user.villain_name}!</h1>
      <p className="mt-2 text-gray-700">{user.backstory}</p>
      <p className="mt-2 text-lg">
        Your notoriety score: {user.notoriety_score}
      </p>

      <h2 className="mt-6 text-xl font-bold">Your Recent Deeds</h2>
      <div className="mt-4">
        {recentDeeds.length === 0 ? (
          <p>You haven’t logged any deeds yet. Start scheming!</p>
        ) : (
          <ul className="space-y-2">
            {recentDeeds.slice(0, 5).map((deed) => (
              <li key={deed.id} className="p-4 border rounded-lg shadow">
                <h3 className="font-bold">{deed.description}</h3>
                <p className="text-sm text-gray-500">
                  {deed.category} - {new Date(deed.date).toLocaleDateString()}
                </p>
                <p>
                  Evil Laughs: {deed.evil_laughs} | Comments:{" "}
                  {deed.comments_count}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
