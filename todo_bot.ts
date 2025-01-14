import { Bot } from "https://deno.land/x/grammy@v1.34.0/mod.ts";
import { loadTasks, saveTask, removeTask, updateTaskStatus, clearAllTasks, Task } from "./Task.ts";
import "https://deno.land/x/dotenv/load.ts";

// Initialize bot
const BOT_TOKEN = Deno.env.get("BOT_TOKEN");

if (!BOT_TOKEN) {
  console.error("BOT_TOKEN is not defined in the environment.");
  Deno.exit(1);
}

const bot = new Bot(BOT_TOKEN);
console.log("🤖 Initializing bot...");

bot.command("start", (ctx) => {
  ctx.reply("Xin chào! Tôi có thể giúp được gì?");
});

bot.command("help", (ctx) => {
  ctx.reply("Commands:\n/addtask\n/tasks\n/removetask\n/clearall");
});

// Load tasks from database when the bot starts
let tasks = await loadTasks();

// Add new task
bot.command("addtask", async (ctx) => {
  const taskText = ctx.match;
  if (!taskText) {
    return ctx.reply("❌ Please provide a task description.");
  }

  const newTask: Task = {
    id: 0, // ID will be generated automatically by MySQL
    text: taskText,
    done: false,
  };

  await saveTask(newTask);
  tasks = await loadTasks(); // Refresh tasks list
  ctx.reply(`✅ Task added: *${taskText}*`, { parse_mode: "Markdown" });
});

// List tasks
bot.command("tasks", (ctx) => {
  if (tasks.length === 0) {
    return ctx.reply("📭 No tasks available.");
  }

  const taskList = tasks
    .map((task) => `${task.done ? "✅" : "🔲"} [${task.id}]. ${task.text}`)
    .join("\n");

  ctx.reply(`📝 *Your Tasks:*\n${taskList}`, { parse_mode: "Markdown" });
});

// Remove task
bot.command("removetask", async (ctx) => {
  const taskId = Number(ctx.match);
  if (isNaN(taskId)) {
    return ctx.reply("❌ Please provide a valid task ID.");
  }

  await removeTask(taskId);
  tasks = await loadTasks(); // Refresh tasks list
  ctx.reply(`🗑️ Task ${taskId} removed.`);
});

// Mark task as done
bot.command("donetask", async (ctx) => {
  const taskId = Number(ctx.match);
  if (isNaN(taskId)) {
    return ctx.reply("❌ Please provide a valid task ID.");
  }

  const task = tasks.find((task) => task.id === taskId);
  if (!task) {
    return ctx.reply(`❌ No task found with ID ${taskId}.`);
  }

  await updateTaskStatus(taskId, true);
  tasks = await loadTasks(); // Refresh tasks list
  ctx.reply(`✅ Task ${taskId} marked as done.`);
});

// Clear all tasks
bot.command("clearall", async (ctx) => {
  await clearAllTasks();
  tasks = await loadTasks(); // Refresh tasks list
  ctx.reply("✅ All tasks removed.");
});

bot.on("message", async (ctx) => {
  // Handle message
  const chatId = ctx.msg.chat.id;
  const text = "Hello, I can help you manage your tasks!\n/help\n/addtask\n/tasks\n/removetask\n/clearall";
  console.log("chatId: " + chatId);
  console.log("text: " + text);
  // Send the reply
  await bot.api.sendMessage(chatId, text);
});

bot.start({
  allowed_updates: ["message", "message_reaction"],
}).then(() => {
  console.log("🤖 Bot is running! Send any message to see the response.");
}).catch((err) => {
  console.error("Error starting the bot:", err);
});
