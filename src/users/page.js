import { db } from "@/utils/db";

export default async function BookPage() {
  const result = await db.query(`SELECT * FROM users`);
  const users = result.rows;

  return (
    <div>
      <h2>users</h2>
      {users.map((user) => {
        return (
          <div key={user.id}>
            <h3>{user.title}</h3>
          </div>
        );
      })}
    </div>
  );
}
