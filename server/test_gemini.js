require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

async function test() {
  try {
    const prompt = "Explain how AI works in a few words";
    const result = await model.generateContent(prompt);
    console.log("Success:", result.response.text());
  } catch (err) {
    console.error("Error:", err);
  }
}
test();
