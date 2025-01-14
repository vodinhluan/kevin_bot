import { Client } from "https://deno.land/x/mysql/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

// Define the Task interface
export interface Task {
  id: number;
  text: string;
  done: boolean;
}

const env = config();

// MySQL connection settings
const client = new Client();
await client.connect({
  hostname: env.DB_HOST, // Hostname from .env
  username: env.DB_USERNAME, // Username from .env
  password: env.DB_PASSWORD, // Password from .env
  db: env.DB_DATABASE, // Database name from .env
});

// Create the table for tasks if it doesn't exist
await client.execute(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    text TEXT,
    done BOOLEAN
  );
`);

// Function to load tasks from the database
export async function loadTasks(): Promise<Task[]> {
  const result = await client.query("SELECT id, text, done FROM tasks");
  const tasks: Task[] = result.map((
    row: { id: number; text: string; done: boolean },
  ) => ({
    id: row.id,
    text: row.text,
    done: row.done,
  }));
  console.log("✅ Tasks loaded from database");
  return tasks;
}

// Function to save tasks to the database
export async function saveTask(newTask: Task): Promise<void> {
  await client.execute("INSERT INTO tasks (text, done) VALUES (?, ?)", [
    newTask.text,
    newTask.done,
  ]);
  console.log("💾 Task saved to database");
}

// Function to update task status in the database
export async function updateTaskStatus(
  id: number,
  done: boolean,
): Promise<void> {
  await client.execute("UPDATE tasks SET done = ? WHERE id = ?", [done, id]);
  console.log(`💾 Task ${id} status updated to ${done ? "done" : "not done"}`);
}

// Function to remove a task from the database
export async function removeTask(id: number): Promise<void> {
  await client.execute("DELETE FROM tasks WHERE id = ?", [id]);
  console.log(`🗑️ Task ${id} removed from database`);
}

// Function to clear all tasks
export async function clearAllTasks(): Promise<void> {
  await client.execute("DELETE FROM tasks");
  console.log("✅ All tasks removed from database");
}
