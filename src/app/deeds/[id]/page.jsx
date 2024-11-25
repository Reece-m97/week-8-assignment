import CommentForm from "@/components/CommentForm";

import { db } from "@/utils/db";
import React from "react";

// Fetch deed data from the database
async function fetchDeedAndComments(deedId) {
  const deedQuery = `
    SELECT 
      deeds.id AS deed_id,
      deeds.description,
      deeds.category,
      deeds.date,
      users.villain_name AS villain_name,
      COUNT(reactions.id) AS evil_laughs,
      COUNT(comments.id) AS comments_count
    FROM deeds
    LEFT JOIN users ON deeds.user_id = users.id
    LEFT JOIN reactions ON deeds.id = reactions.deed_id
    LEFT JOIN comments ON deeds.id = comments.deed_id
    WHERE deeds.id = $1
    GROUP BY deeds.id, users.villain_name;
  `;
  const commentQuery = `
    SELECT comments.id, comments.comment, comments.date, users.villain_name AS commenter_name
    FROM comments
    LEFT JOIN users ON comments.user_id = users.id
    WHERE comments.deed_id = $1
    ORDER BY comments.date DESC;
  `;

  const [deedResult, commentsResult] = await Promise.all([
    db.query(deedQuery, [deedId]),
    db.query(commentQuery, [deedId]),
  ]);

  const deed = deedResult.rows[0];
  const comments = commentsResult.rows;

  return { deed, comments };
}

export default async function SingleDeedPage({ params }) {
  const { id } = await params;

  const { deed, comments } = await fetchDeedAndComments(id);

  if (!deed) {
    return <p>Deed not found.</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{deed.villain_name}&apos;s Deed</h1>
      <p className="mt-4">
        <strong className="font-semibold">Description:</strong>{" "}
        {deed.description}
      </p>
      <p className="text-gray-600">
        <strong className="font-semibold">Category:</strong> {deed.category}
      </p>
      <p className="text-sm text-gray-500">
        <strong className="font-semibold">Date:</strong>{" "}
        {new Date(deed.date).toLocaleString()}
      </p>
      <p className="mt-4">
        <strong className="font-semibold">Evil Laughs:</strong>{" "}
        {deed.evil_laughs} | <strong>Comments:</strong> {deed.comments_count}
      </p>

      <h2 className="mt-6 text-xl font-bold">Comments</h2>
      <CommentForm deedId={id} />
      <ul className="mt-4 space-y-2">
        {comments.map((comment) => (
          <li key={comment.id} className="p-4 border rounded-lg shadow">
            <p>
              <strong>{comment.commenter_name}:</strong> {comment.comment}
            </p>
            <p className="text-sm text-gray-500">
              <em>{new Date(comment.date).toLocaleString()}</em>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
