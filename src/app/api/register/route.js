import { db } from "@/utils/db";

export async function POST(request) {
  const { username, password, villainName } = await request.json();

  if (!username || !password || !villainName) {
    return new Response(JSON.stringify({ error: "All fields are required." }), {
      status: 400,
    });
  }

  try {
    const query = `
      INSERT INTO users (username, password, villain_name)
      VALUES ($1, $2, $3)
      RETURNING id, villain_name, notoriety_score;
    `;
    const { rows } = await db.query(query, [username, password, villainName]);

    return new Response(JSON.stringify(rows[0]), { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return new Response(JSON.stringify({ error: "Failed to register user." }), {
      status: 500,
    });
  }
}
