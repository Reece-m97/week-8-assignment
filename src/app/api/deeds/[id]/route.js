import { NextResponse } from "next/server";
import { db } from "@/utils/db"; // Make sure this points to your actual database pool

export async function GET(request, { params }) {
  const { id } = params;

  try {
    const query = `
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
      GROUP BY deeds.id, users.villain_name
    `;
    const {
      rows: [deed],
    } = await db.query(query, [id]);

    if (!deed) {
      return NextResponse.json({ error: "Deed not found" }, { status: 404 });
    }

    // Query to fetch the comments for this deed
    const commentsQuery = `
      SELECT comments.id, comments.comment, comments.date, users.villain_name AS commenter_name
      FROM comments
      LEFT JOIN users ON comments.user_id = users.id
      WHERE comments.deed_id = $1
      ORDER BY comments.date DESC
    `;
    const { rows: comments } = await db.query(commentsQuery, [id]);

    return NextResponse.json({ deed, comments });
  } catch (error) {
    console.error("Error fetching deed:", error);
    return NextResponse.json(
      { error: "Failed to fetch deed and comments" },
      { status: 500 }
    );
  }
}

// POST: Add a new comment to the deed
export async function POST(request, { params }) {
  const { id } = params;
  const { userId, comment } = await request.json();

  try {
    // Insert the comment into the database
    const query = `
      INSERT INTO comments (deed_id, user_id, comment)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [id, userId, comment];
    const {
      rows: [newComment],
    } = await db.query(query, values);

    return NextResponse.json(newComment);
  } catch (error) {
    console.error("Error posting comment:", error);
    return NextResponse.json(
      { error: "Failed to post comment" },
      { status: 500 }
    );
  }
}
