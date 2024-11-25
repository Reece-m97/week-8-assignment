"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CommentForm({ deedId }) {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  // Fetch logged-in user's ID from localStorage
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("villainUser"));
    if (!savedUser) {
      router.push("/");
    } else {
      setUserId(savedUser.id);
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting || !userId) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/deeds/${deedId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, comment }),
      });

      if (!res.ok) throw new Error("Failed to post comment");

      setComment("");
      setError(null);
      alert("Comment posted successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment"
        required
        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
      <button
        type="submit"
        disabled={isSubmitting || !userId}
        className={`px-4 py-2 rounded text-white ${
          isSubmitting || !userId
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isSubmitting ? "Submitting..." : "Submit Comment"}
      </button>
      {error && <p className="text-red-500">Error: {error}</p>}
    </form>
  );
}
