import { config } from "https://deno.land/x/dotenv/mod.ts";
import { Client } from "https://deno.land/x/mysql/mod.ts";

// Load environment variables from the .env file
const env = config();

// Create a client instance
const client = new Client();

try {
  // Connect to the local MySQL database using environment variables
  await client.connect({
    hostname: env.DB_HOST, // Hostname from .env
    username: env.DB_USERNAME, // Username from .env
    password: env.DB_PASSWORD, // Password from .env
    db: env.DB_DATABASE, // Database name from .env
  });

  console.log("✅ Successfully connected to the MySQL database locally!");

  // Perform any database operations here
  // Example: Create the tasks table if it doesn't exist
  await client.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      text TEXT,
      done BOOLEAN
    );
  `);
  console.log("✅ Table created or already exists!");

  // Example: Insert a task
  await client.query("INSERT INTO tasks (text, done) VALUES (?, ?)", [
    "Test Task",
    false,
  ]);
  console.log("💾 Task inserted!");
} catch (error) {
  console.error("❌ Error connecting to the MySQL database:", error);
} finally {
  // Close the connection once done
  await client.close();
  console.log("🔒 Connection closed.");
}
