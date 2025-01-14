import { DB } from "https://deno.land/x/sqlite/mod.ts";

// Define the Task interface
export interface Task {
  id: number;
  text: string;
  done: boolean;
}

// Connect to SQLite database (this will create a file named "tasks.db" in the current directory)
const db = new DB("tasks.db");

// Create a table for tasks if it doesn't exist
db.query(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT,
    done BOOLEAN
  )
`);

// Function to load tasks from the database
export function loadTasks(): Task[] {
  const tasks: Task[] = [];
  for (const [id, text, done] of db.query("SELECT id, text, done FROM tasks")) {
    tasks.push({ id: id as number, text: text as string, done: done as boolean });
  }
  console.log("✅ Tasks loaded from database");
  return tasks;
}

// Function to save tasks to the database
export function saveTask(newTask: Task): void {
  db.query("INSERT INTO tasks (text, done) VALUES (?, ?)", [newTask.text, newTask.done]);
  console.log("💾 Task saved to database");
}

// Function to update task status in the database
export function updateTaskStatus(id: number, done: boolean): void {
  db.query("UPDATE tasks SET done = ? WHERE id = ?", [done, id]);
  console.log(`💾 Task ${id} status updated to ${done ? 'done' : 'not done'}`);
}

// Function to remove a task from the database
export function removeTask(id: number): void {
  db.query("DELETE FROM tasks WHERE id = ?", [id]);
  console.log(`🗑️ Task ${id} removed from database`);
}

// Function to clear all tasks
export function clearAllTasks(): void {
  db.query("DELETE FROM tasks");
  console.log("✅ All tasks removed from database");
}

