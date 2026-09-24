const PDFDocument = require("pdfkit")
const { GoogleGenerativeAI } = require("@google/generative-ai")

function getModel() {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not configured")
    }

    const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    return client.getGenerativeModel({
        model: process.env.GEMINI_MODEL || "gemini-3.5-flash-lite"
    })
}

function parseJsonResponse(text) {
    const withoutCodeFence = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim()
    const start = withoutCodeFence.indexOf("{")
    const end = withoutCodeFence.lastIndexOf("}")

    if (start === -1 || end === -1) {
        throw new Error("Gemini returned an invalid interview report")
    }

    return JSON.parse(withoutCodeFence.slice(start, end + 1))
}

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `
Create an interview preparation report using the candidate information and job description below.
Return only valid JSON with this exact shape:
{
  "title": "string",
  "matchScore": 0,
  "technicalQuestions": [{ "question": "string", "intention": "string", "answer": "string" }],
  "behavioralQuestions": [{ "question": "string", "intention": "string", "answer": "string" }],
  "skillGaps": [{ "skill": "string", "severity": "low|medium|high" }],
  "preparationPlan": [{ "day": 1, "focus": "string", "tasks": ["string"] }]
}
Use a matchScore from 0 to 100. Generate 5 technical questions, 5 behavioral questions,
and a practical 7-day preparationPlan. Do not add markdown or extra fields.

JOB DESCRIPTION:
${jobDescription}

CANDIDATE SELF-DESCRIPTION:
${selfDescription || "Not provided"}

RESUME:
${resume || "Not provided"}
`

    const result = await getModel().generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
            responseMimeType: "application/json"
        }
    })

    return parseJsonResponse(result.response.text())
}

function createPdf(content) {
    return new Promise((resolve, reject) => {
        const document = new PDFDocument({ margin: 50 })
        const chunks = []

        document.on("data", chunk => chunks.push(chunk))
        document.on("end", () => resolve(Buffer.concat(chunks)))
        document.on("error", reject)

        document.fontSize(20).text("Tailored Resume", { align: "center" })
        document.moveDown()
        document.fontSize(11).text(content, { lineGap: 4 })
        document.end()
    })
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    const prompt = `
Rewrite the candidate information into a concise, professional, ATS-friendly resume.
Return plain text only with clear section headings. Do not use markdown code fences.

JOB DESCRIPTION:
${jobDescription}

CANDIDATE SELF-DESCRIPTION:
${selfDescription || "Not provided"}

CURRENT RESUME:
${resume || "Not provided"}
`

    const result = await getModel().generateContent(prompt)
    return createPdf(result.response.text())
}

module.exports = {
    generateInterviewReport,
    generateResumePdf
}
