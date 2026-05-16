import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.json({
        reply: "⚠️ Please type a message."
      });
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",

          messages: [
            {
              role: "system",
              content: `
You are AI OF YASH 🚀

Rules:
- Give stylish and futuristic replies
- Use clear bold headings
- Give point-by-point answers
- Keep answers detailed but clean
- Use a few smart emojis
- Separate every point with spacing
- Sound intelligent and premium
- Never give boring one-line replies
`
            },
            {
              role: "user",
              content: userMessage
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log(data);

    const aiReply =
      data?.choices?.[0]?.message?.content ||
      "⚠️ No AI response received.";

    res.json({
      reply: aiReply
    });

  } catch (error) {
    console.error("ERROR:", error);

    res.json({
      reply: "⚠️ AI server error."
    });
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});