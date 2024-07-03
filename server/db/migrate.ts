import "dotenv/config";
import { migrate } from "drizzle-orm/libsql/migrator";
import { client, db } from "./db";

(async () => {
  await migrate(db, { migrationsFolder: "../../migrations" });
  client.close();
})();
