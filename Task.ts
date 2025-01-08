import { readJson, writeJson } from "https://deno.land/x/jsonfile/mod.ts";

export interface Task {
    id: number;
    text: string;
    done: boolean;
}

export let tasks: Task[] = [];

// Load tasks from tasks.json
export async function loadTasks() {
    try {
        tasks = await readJson("tasks.json") as Task[];
        console.log("✅ Tasks loaded from tasks.json");
    } catch {
        console.log("📝 No existing tasks.json found, starting fresh.");
        tasks = [];
    }
}

// Save tasks to tasks.json
export async function saveTasks() {
    await writeJson("tasks.json", tasks);
    console.log("💾 Tasks saved to tasks.json");
}
