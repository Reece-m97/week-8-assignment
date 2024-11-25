import { NextResponse } from "next/server";
import { db } from "@/utils/db";

export async function GET(request, { params }) {
  const { id } = await params;

  try {
    const userQuery = `
      SELECT  
          users.id,
          users.villain_name,
          users.backstory,
          users.notoriety_score,
          villain_levels.title
        FROM users
        JOIN villain_levels
        ON users.notoriety_score BETWEEN villain_levels.min_score AND villain_levels.max_score
        WHERE users.id = $1;
    `;
    const deedsQuery = `
      SELECT 
        deeds.id AS deed_id,
        deeds.description,
        deeds.category,
        deeds.date,
        COUNT(reactions.id) AS evil_laughs,
        COUNT(comments.id) AS comments_count
      FROM deeds
      LEFT JOIN reactions ON deeds.id = reactions.deed_id
      LEFT JOIN comments ON deeds.id = comments.deed_id
      WHERE deeds.user_id = $1
      GROUP BY deeds.id
      ORDER BY deeds.date DESC;
    `;

    const [userRes, deedsRes] = await Promise.all([
      db.query(userQuery, [id]),
      db.query(deedsQuery, [id]),
    ]);

    const user = userRes.rows[0];
    const deeds = deedsRes.rows;

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user, deeds });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { deedId } = await request.json();
    const query = `
      DELETE FROM deeds
      WHERE id = $1
      RETURNING *;
    `;
    const { rows } = await db.query(query, [deedId]);

    if (!rows.length) {
      return NextResponse.json({ error: "Deed not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deed deleted successfully" });
  } catch (error) {
    console.error("Error deleting deed:", error);
    return NextResponse.json(
      { error: "Failed to delete deed" },
      { status: 500 }
    );
  }
}
