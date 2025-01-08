import { Bot } from "https://deno.land/x/grammy@v1.34.0/mod.ts";
import { tasks, Task, saveTasks, loadTasks } from "./Task.ts"
import "https://deno.land/x/dotenv/load.ts";



const BOT_TOKEN = Deno.env.get("BOT_TOKEN");

if (!BOT_TOKEN) {
    throw new Error("🚨 BOT_TOKEN is not defined in the .env file.");
}

// Initialize Bot
const bot = new Bot(BOT_TOKEN);
console.log("🤖 Initializing bot...");

bot.command("start", (ctx) => {
    ctx.reply("Xin chào! Tôi có thể giúp được gì?");
});

bot.command(
    "help",
    (ctx) => ctx.reply("Commands:\n/addtask\n/tasks\n/removetask"),
);

// Load tasks when the bot starts
await loadTasks();

// Update saveTasks after each modification
bot.command("addtask", async (ctx) => {
    const taskText = ctx.match; // ?
    if (!taskText) {
        return ctx.reply("❌ Please provide a task description.");
    }

    const newTask: Task = {
        id: tasks.length + 1,
        text: taskText,
        done: false,
    };

    tasks.push(newTask);
    await saveTasks();
    ctx.reply(`✅ Task added: *${taskText}*`, { parse_mode: "Markdown" });
});

bot.command("tasks", (ctx) => {
    if (tasks.length === 0) {
        return ctx.reply("📭 No tasks available.");
    }

    const taskList = tasks
        .map((task) => `${task.done ? "✅" : "🔲"} [${task.id}]. ${task.text}`)
        .join("\n");

    ctx.reply(`📝 *Your Tasks:*\n${taskList}`, { parse_mode: "Markdown" });
});


bot.command("removetask", async (ctx) => {
    const taskId = Number(ctx.match);
    if (isNaN(taskId)) {
        return ctx.reply("❌ Please provide a valid task ID.");
    }

    const index = tasks.findIndex((task) => task.id === taskId);
    if (index === -1) {
        return ctx.reply(`❌ No task found with ID ${taskId}.`);
    }

    tasks.splice(index, 1);
    await saveTasks();
    ctx.reply(`🗑️ Task ${taskId} removed.`);
});

bot.command("donetask", async (ctx) => {
    const taskId = Number(ctx.match);
    if (isNaN(taskId)) {
        return ctx.reply("❌ Please provide a valid task ID.");
    }

    const task = tasks.find((task) => task.id === taskId);
    if (!task) {
        return ctx.reply(`❌ No task found with ID ${taskId}.`);
    }

    task.done = true;
    await saveTasks();
    ctx.reply(`✅ Task ${taskId} marked as done.`);
});
bot.command("clearall", async (ctx) => {
    tasks.length = 0;
    await saveTasks();
    ctx.reply("✅ All tasks removed.");
})

bot.on("message", async (ctx) => {
    // Get the chat identifier.
    const chatId = ctx.msg.chat.id;
    const text = "Hello, i just can help you to do task!\n/help\n/addtask\n/tasks\n/removetask\n/clearall";
    console.log("chatId: " + chatId);
    console.log("text: " + text);
    // Send the reply.
    await bot.api.sendMessage(chatId, text);
});



  

bot.start({
    allowed_updates: ["message", "message_reaction"],
}).then(() => {
    console.log("🤖 Bot is running! Send any message to see the response.");
}).catch((err) => {
    console.error("Error starting the bot:", err);
});
