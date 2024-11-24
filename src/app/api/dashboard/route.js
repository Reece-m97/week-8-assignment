import { db } from "@/utils/db";
import { validateToken } from "@/middleware";

export async function GET(request) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  const userData = validateToken(token);

  if (!userData) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await db.query(
    `SELECT 
    users.id,
    users.villain_name,
    users.backstory,
    users.notoriety_score,
    villain_levels.title
FROM users
JOIN villain_levels
ON users.notoriety_score BETWEEN villain_levels.min_score AND villain_levels.max_score
     WHERE users.id = $1`,
    [userData.userId]
  );

  const deeds = await db.query(
    `SELECT 
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
ORDER BY deeds.date DESC
LIMIT 5;`,
    [userData.userId]
  );

  return new Response(
    JSON.stringify({ user: user.rows[0], deeds: deeds.rows }),
    { status: 200 }
  );
}
