import { NextResponse } from "next/server";
import db from "@/utils/db";

export async function POST(request) {
  try {
    const { deed_id, user_id, comment } = await request.json();

    if (!deed_id || !user_id || !comment) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const query = `
      INSERT INTO comments (deed_id, user_id, comment)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const result = await db.query(query, [deed_id, user_id, comment]);

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
