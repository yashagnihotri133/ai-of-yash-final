import express from "express";
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.static("./"));

app.get("/chat", async (req, res) => {

  const message = req.query.msg;

  try {

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {

        method: "POST",

        headers: {

          "Authorization":
          "Bearer YOUR_API_KEY",

          "Content-Type":
          "application/json"
        },

        body: JSON.stringify({

          model:
          "openai/gpt-3.5-turbo",

          messages: [

            {
              role: "system",

              content: `
You are AI OF YASH, a futuristic AI assistant.

Rules:

- Give detailed answers
- Use bold headings
- Write point by point
- Every point should come on a new line
- Leave spacing between points
- Use clean formatting
- Use only a few useful emojis
- Avoid messy formatting
- Talk naturally like ChatGPT
- Reply in the same language as the user
`
            },

            {
              role: "user",
              content: message
            }

          ]
        })
      }
    );

    const data =
    await response.json();

    const reply =

data.choices &&
data.choices[0] &&
data.choices[0].message

? data.choices[0].message.content

: "⚠️ No AI response received.";

    res.json({
      reply
    });

  } catch (error) {

    console.log(error);

    res.json({
      reply:
      "⚠️ Error generating response"
    });
  }
});

app.listen(3000, () => {

  console.log(
  "🚀 Server running on port 3000"
  );
});