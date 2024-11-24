import pg from "pg";

export const db = new pg.Pool({ connectionString: process.env.DATABASE_URL });

(async () => {
  try {
    const result = await db.query("SELECT 1");
    console.log("Database connection successful", result.rows);
  } catch (error) {
    console.error("Database connection failed", error);
  }
})();
