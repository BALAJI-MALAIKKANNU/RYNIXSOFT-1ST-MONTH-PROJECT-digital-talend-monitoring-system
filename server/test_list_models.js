require('dotenv').config();
fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`)
.then(r=>r.json()).then(data => console.log(data.models.map(m => m.name)));
