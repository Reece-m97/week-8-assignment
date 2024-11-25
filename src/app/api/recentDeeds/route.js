import { NextResponse } from "next/server";
import { db } from "@/utils/db";

// Handle GET requests
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const query = `
      SELECT 
        deeds.id,
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
    const { rows } = await db.query(query, [userId]);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching deeds:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch deeds" },
      { status: 500 }
    );
  }
}
