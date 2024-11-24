import { db } from "@/utils/db";

export async function POST(request) {
  const { username, password } = await request.json();

  if (!username || !password) {
    return new Response(JSON.stringify({ error: "All fields are required." }), {
      status: 400,
    });
  }

  try {
    const query = `
      SELECT id, password, villain_name, notoriety_score
      FROM users
      WHERE username = $1;
    `;
    const { rows } = await db.query(query, [username]);

    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: "User not found." }), {
        status: 404,
      });
    }

    const user = rows[0];
    if (password !== user.password) {
      return new Response(JSON.stringify({ error: "Invalid password." }), {
        status: 401,
      });
    }

    return new Response(
      JSON.stringify({
        id: user.id,
        villain_name: user.villain_name,
        notoriety_score: user.notoriety_score,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return new Response(JSON.stringify({ error: "Failed to log in." }), {
      status: 500,
    });
  }
}
