const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("YOUR_GEMINI_API_KEY");

async function listModels() {
    const models = await genAI.listModels();
    console.log(models);
}

listModels();
