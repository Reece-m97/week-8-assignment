import { NextResponse } from "next/server";
import { db } from "@/utils/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const sort = searchParams.get("sort") === "asc" ? "ASC" : "DESC";

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
      GROUP BY deeds.id, users.villain_name
      ORDER BY deeds.date ${sort};
    `;

    const { rows: deeds } = await db.query(query);
    return NextResponse.json(deeds);
  } catch (error) {
    console.error("Error fetching deeds:", error);
    return NextResponse.json(
      { error: "Failed to fetch deeds" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { userId, description, category } = await request.json();
    const query = `
        INSERT INTO deeds (user_id, description, category)
        VALUES ($1, $2, $3)
        RETURNING *;
      `;
    const values = [userId, description, category];

    const { rows } = await db.query(query, values);
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Error posting deed:", error);
    return NextResponse.json({ error: "Failed to post deed" }, { status: 500 });
  }
}
