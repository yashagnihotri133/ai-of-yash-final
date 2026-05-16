const parseBody = (req) => new Promise((resolve, reject) => {
  let body = "";
  req.on("data", (chunk) => { body += chunk; });
  req.on("end", () => {
    try {
      resolve(body ? JSON.parse(body) : {});
    } catch (error) {
      reject(error);
    }
  });
  req.on("error", reject);
});

const sendJson = (res, status, payload) => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
};

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return sendJson(res, 405, { reply: "Method not allowed" });
  }

  try {
    const body = await parseBody(req);
    const userMessage = body?.message;

    if (!userMessage) {
      return sendJson(res, 400, { reply: "⚠️ Please type a message." });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
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
    });

    const data = await response.json();
    const aiReply = data?.choices?.[0]?.message?.content || "⚠️ No AI response received.";
    sendJson(res, 200, { reply: aiReply });
  } catch (error) {
    console.error("ERROR:", error);
    sendJson(res, 500, { reply: "⚠️ AI server error." });
  }
};

export default handler;
