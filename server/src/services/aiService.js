const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

exports.generateTaskDescription = async (title) => {
  const prompt = `Write a clear, professional task description for the following task title: "${title}". Limit it to 2-3 sentences. Include what to deliver and the expected quality.`;
  const result = await model.generateContent(prompt);
  return result.response.text();
};

exports.suggestDeadline = async (description) => {
  const prompt = `Analyze the complexity of this task description and suggest a deadline in days. Return ONLY a valid JSON string like {"min": 2, "max": 4, "reason": "short explanation"}. Description: "${description}"`;
  const result = await model.generateContent(prompt);
  // Sanitize markdown fences if generated
  let text = result.response.text().replace(/```json\n?|\n?```/g, '').trim();
  try {
    return JSON.parse(text);
  } catch(e) {
    return { min: 1, max: 2, reason: "Default task estimate" };
  }
};

exports.checkSubmission = async (taskTitle, submissionNote) => {
  const prompt = `Review if the following submission note makes sense for the task title. Return ONLY valid JSON: {"score": "complete" OR "needs_more", "feedback": "brief reasoning"}. Task: "${taskTitle}". Note: "${submissionNote}"`;
  const result = await model.generateContent(prompt);
  let text = result.response.text().replace(/```json\n?|\n?```/g, '').trim();
  try {
    return JSON.parse(text);
  } catch(e) {
    return { score: 'complete', feedback: 'No further critique automatically detected.' };
  }
};

exports.generateBio = async (name, currentBio) => {
  let prompt;
  if (currentBio && currentBio.trim().replace(/^"|"$/g, '').length > 0) {
    prompt = `The user named ${name} currently has this short bio: "${currentBio}". Please rewrite and elaborate on this existing bio to sound highly professional, impressive, and engaging. Limit it to 2-3 sentences. Do NOT use generic filler words, maintain the original core meaning but enhance its professional tone. Do not include quotes in your response.`;
  } else {
    prompt = `Write a 2-sentence professional bio profile describing ${name} as a talented worker managing tasks on the DTMS system. Be positive and engaging. Do not include quotes in your response.`;
  }
  const result = await model.generateContent(prompt);
  return result.response.text();
};

exports.recommendSkills = async (department, bio) => {
  const prompt = `Analyze this user's department ("${department}") and bio ("${bio}"). Return a JSON array containing 5-8 exact, modern professional skills (e.g. ["React", "UI Design", "Agile Management"]). Provide ONLY the raw JSON array string. No markdown formatting, no tick marks, no extra text.`;
  const result = await model.generateContent(prompt);
  let text = result.response.text().replace(/```(json)?\n?|\n?```/g, '').trim();
  try {
    return JSON.parse(text);
  } catch(e) {
    return ["Problem Solving", "Communication", "Time Management"];
  }
};
