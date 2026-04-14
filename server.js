const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("."));

function normalizeLang(lang) {
    if (lang === "cpp") return "C++";
    if (lang === "javascript") return "JavaScript";
    if (lang === "c") return "C";
    if (lang === "php") return "PHP";
    if (lang === "python") return "Python";
    if (lang === "java") return "Java";
    return lang;
}

app.post("/convert", async (req, res) => {
    try {
        const { code, fromLang, toLang } = req.body;

        const from = normalizeLang(fromLang);
        const to = normalizeLang(toLang);

        const prompt = `
Convert ${from} code to ${to}.

Output ONLY valid ${to} code.

STRICT RULES:
- No explanation
- No comments
- No extra text
- No markdown
- Use correct ${to} syntax only

Example:
Java: System.out.println("hi");
Python: print("hi")

Now convert:
${code}
`;

        const response = await axios.post(
            "http://localhost:11434/api/generate",
            {
                model: "codellama",
                prompt: prompt,
                stream: false
            }
        );

        let result = response.data.response;

        result = result.replace(/```[\s\S]*?```/g, "");
        result = result.replace(/```/g, "");

        result = result.split("\n").filter(line =>
            !line.trim().startsWith("#") &&
            !line.toLowerCase().includes("importing") &&
            !line.toLowerCase().includes("scanner") &&
            !line.toLowerCase().includes("explanation") &&
            !line.toLowerCase().includes("note")
        ).join("\n");

        result = result.trim();

        res.json({ result });

    } catch (err) {
        console.log("ERROR:", err.message);
        res.json({ result: "Error generating response" });
    }
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
