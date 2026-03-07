import axios from "axios";

const AI_PROMPT = `You are a precise nutrition database assistant. When given a food query, return ONLY a valid JSON array. No explanation or markdown.
Each element must match this shape:
{
  "name": "string",
  "serving_size_g": number,
  "calories": number,
  "protein_g": number,
  "carbohydrates_total_g": number,
  "fat_total_g": number,
  "fiber_g": number,
  "sugar_g": number,
  "sodium_mg": number
}
Rules:
- Return 1 to 5 items.
- If the query mentions a quantity (example: "2 eggs"), calculate values for that amount.
- Values must be realistic.
- Use 0 if a value is unknown.
- Return only pure JSON array.`;

const parseNum = (val) => {
    const n = parseFloat(val);
    return Number.isNaN(n) ? 0 : Number(n.toFixed(2));
};

const safeJsonExtract = (text) => {
    if (!text) return null;

    // remove markdown fences if model still returns them
    const cleaned = text
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

    try {
        return JSON.parse(cleaned);
    } catch {
        // try extracting first JSON array block
        const match = cleaned.match(/\[[\s\S]*\]/);
        if (!match) return null;

        try {
            return JSON.parse(match[0]);
        } catch {
            return null;
        }
    }
};

export const aiNutritionSearch = async (req, res) => {
    const { query } = req.body;

    if (!query || !query.trim()) {
        return res.status(400).json({ error: "query is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured" });
    }

    const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`;

    try {
        const { data } = await axios.post(
            url,
            {
                contents: [
                    {
                        parts: [
                            { text: AI_PROMPT },
                            { text: `Query: ${query.trim()}` },
                        ],
                    },
                ],
                generationConfig: {
                    temperature: 0.1,
                    maxOutputTokens: 1000,
                    responseMimeType: "application/json",
                },
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const parts = data?.candidates?.[0]?.content?.parts || [];
        const rawText = parts.map((p) => p.text || "").join("").trim();

        if (!rawText) {
            return res.status(502).json({ error: "Empty response from AI" });
        }

        const items = safeJsonExtract(rawText);

        if (!Array.isArray(items)) {
            console.error("Invalid Gemini response:", rawText);
            return res.status(502).json({
                error: "AI returned invalid data format. Please try again.",
            });
        }

        const normalized = items.slice(0, 5).map((item) => ({
            name: String(item?.name ?? "Unknown food"),
            serving_size_g: parseNum(item?.serving_size_g) || 100,
            calories: parseNum(item?.calories),
            protein_g: parseNum(item?.protein_g),
            carbohydrates_total_g: parseNum(item?.carbohydrates_total_g),
            fat_total_g: parseNum(item?.fat_total_g),
            fiber_g: parseNum(item?.fiber_g),
            sugar_g: parseNum(item?.sugar_g),
            sodium_mg: parseNum(item?.sodium_mg),
        }));

        return res.status(200).json({
            success: true,
            items: normalized,
        });
    } catch (err) {
        const status = err.response?.status || 500;
        const detail = err.response?.data || err.message;

        console.error("aiNutritionSearch error details:", JSON.stringify(detail, null, 2));

        if (status === 429) {
            return res.status(429).json({
                error: "AI limit reached. Please wait a bit before searching again.",
            });
        }

        if (status === 404) {
            return res.status(404).json({
                error: "Model not found. Use gemini-2.5-flash or check GEMINI_MODEL in .env",
            });
        }

        return res.status(status).json({
            error: "Failed to connect to AI",
        });
    }
};