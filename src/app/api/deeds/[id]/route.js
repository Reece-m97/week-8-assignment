import { NextResponse } from "next/server";
import { db } from "@/utils/db";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const query = `
      SELECT 
        deeds.id AS deed_id,
        deeds.description,
        deeds.category,
        deeds.date,
        users.villain_name AS villain_name,
        COUNT(reactions.id) AS evil_laughs,
        (
          SELECT json_agg(
            json_build_object(
              'comment_id', comments.id,
              'user_id', comments.user_id,
              'username', users.villain_name,
              'content', comments.comment,
              'date', comments.date
            )
          )
          FROM comments
          LEFT JOIN users ON comments.user_id = users.id
          WHERE comments.deed_id = deeds.id
        ) AS comments
      FROM deeds
      LEFT JOIN users ON deeds.user_id = users.id
      LEFT JOIN reactions ON deeds.id = reactions.deed_id
      WHERE deeds.id = $1
      GROUP BY deeds.id, users.villain_name;
    `;

    const { rows } = await db.query(query, [id]);

    if (rows.length === 0) {
      return NextResponse.json({ error: "Deed not found" }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Error fetching deed:", error);
    return NextResponse.json({ error: "Error fetching deed" }, { status: 500 });
  }
}
