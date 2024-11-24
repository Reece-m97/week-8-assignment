"use client";

import { useState, useEffect } from "react";

export default function SingleDeedPage({ params }) {
  const [deed, setDeed] = useState(null);
  const [comments, setComments] = useState([]);
  const [form, setForm] = useState({ comment: "" });

  useEffect(() => {
    async function fetchDeed() {
      const response = await fetch(`/api/deeds/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setDeed(data);
        setComments(data.comments || []);
      } else {
        console.error("Error fetching deed");
      }
    }
    fetchDeed();
  }, [params.id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/comments", {
      method: "POST",
      headers: { "Comment-Type": "application/json" },
      body: JSON.stringify({
        deed_id: params.id,
        user_id: 1,
        comment: form.comment,
      }),
    });
    if (response.ok) {
      const newComment = await response.json();
      setComments([...comments, newComment]);
      setForm({ comment: "" });
    } else {
      console.error("Error submitting comment");
    }
  };

  if (!deed) return <p>Loading...</p>;

  return (
    <div>
      <h1>Deed Details</h1>
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
        <strong>Evil Laughs:</strong> {deed.evil_laughs}
      </p>

      <h2>Comments</h2>
      <ul>
        {comments.map((comment) => (
          <li key={comment.comment_id}>
            <p>
              <strong>{comment.username}:</strong> {comment.comment}
            </p>
            <p>{new Date(comment.date).toLocaleString()}</p>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <textarea
          name="comment"
          placeholder="Add your comment"
          value={form.comment}
          onChange={handleChange}
          required
        />
        <button type="submit">Submit Comment</button>
      </form>
    </div>
  );
}
