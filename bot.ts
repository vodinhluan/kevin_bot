import { Bot, InlineKeyboard } from "https://deno.land/x/grammy@v1.34.0/mod.ts";
import "https://deno.land/x/dotenv/load.ts";



const BOT_TOKEN = Deno.env.get("BOT_TOKEN");

if (!BOT_TOKEN) {
    throw new Error("🚨 BOT_TOKEN is not defined in the .env file.");
}

// Initialize Bot
const bot = new Bot(BOT_TOKEN);
console.log("🤖 Initializing bot...");

// Reply to any message with "Hi there!"
// bot.on("message", (ctx) => ctx.reply("Hi there!"));
bot.command("start", async (ctx) => {
    try {
        await ctx.reply(
            "*Hi\\!* _Welcome_ to [grammY](https://grammy.dev)\\.",
            { parse_mode: "MarkdownV2" },
        );
        console.log("✅ Sent a welcome message.");
    } catch (error) {
        console.error("❌ Failed to send message:", error);
    }
});

bot.command("msgid", (ctx) => {
    ctx.reply(`🆔 *Message ID:* ${ctx.msgId}`);
});

bot.command("chat", (ctx) => {
    ctx.reply(
        `💬 *Chat Info:*\n\`\`\`\n${JSON.stringify(ctx.chat, null, 2)}\n\`\`\``,
        {
            parse_mode: "Markdown",
        },
    );
});

bot.command("chatid", (ctx) => {
    ctx.reply(`Id: *Chat ID: * ${ctx.chatId}`);
});

bot.command("senderchat", (ctx) => {
    if (ctx.senderChat) {
        ctx.reply(
            `👤 *Sender Chat Info:*\n\`\`\`\n${
                JSON.stringify(ctx.senderChat, null, 2)
            }\n\`\`\``,
            {
                parse_mode: "Markdown",
            },
        );
    } else {
        ctx.reply("❌ No sender chat available in this context.");
    }
});

bot.command("from", (ctx) => {
    ctx.reply(
        `🧑 *User Info:*\n\`\`\`\n${JSON.stringify(ctx.from, null, 2)}\n\`\`\``,
        {
            parse_mode: "Markdown",
        },
    );
});

// Inline query handler
bot.inlineQuery(/^ping$/, async (ctx) => {
    await ctx.answerInlineQuery([
        {
            type: "article",
            id: "1",
            title: "Test Inline Message",
            input_message_content: {
                message_text: "🏓 *Ping!* This is an inline message.",
                parse_mode: "Markdown",
            },
            reply_markup: new InlineKeyboard().text(
                "Click Me",
                "inline_button_clicked",
            ),
        },
    ]);
});

bot.command("entities", (ctx) => {
    if (ctx.entities) {
        ctx.reply(
            `📚 *Entities:*\n\`\`\`\n${
                JSON.stringify(ctx.entities, null, 2)
            }\n\`\`\``,
            {
                parse_mode: "Markdown",
            },
        );
    } else {
        ctx.reply("❌ No entities found in this message.");
    }
});

bot.on("message_reaction", async (ctx) => {
  const reactions = ctx.reactions();
  
  // Check if the thumbs-up emoji was added
  if (reactions.emojiAdded && reactions.emojiAdded.includes("👍")) {
    console.log("User reacted with 👍");
    await ctx.reply("I like you bro123");
  }
});

  

// Handle button click
bot.on("callback_query:data", async (ctx) => {
    if (ctx.inlineMessageId) {
        await ctx.answerCallbackQuery({
            text: `✅ Inline Message ID: ${ctx.inlineMessageId}`,
        });
    } else {
        await ctx.answerCallbackQuery({
            text: "❌ No Inline Message ID found.",
        });
    }
});

bot.on("message", async (ctx) => {
    // Get the chat identifier.
    const chatId = ctx.msg.chat.id;
    // The text to reply with
    const text = "I got your message bro!";
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
