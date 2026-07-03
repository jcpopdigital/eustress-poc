interface Env {
  GEMINI_API_KEY: string;
  VALID_TOKENS: string; // JSON array: ["token-abc123", "token-def456"]
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
const MODELS = ["gemini-2.5-flash-lite", "gemini-2.5-flash", "gemini-2.5-pro"];

async function callGemini(env: Env, prompt: string): Promise<string> {
  for (const model of MODELS) {
    const url = `${GEMINI_BASE}/${model}:generateContent?key=${env.GEMINI_API_KEY}`;

    for (let attempt = 0; attempt < 3; attempt++) {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" },
        }),
      });

      if (res.ok) {
        const data: any = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error("Empty Gemini response");
        console.log(`Success with ${model} on attempt ${attempt + 1}`);
        return text;
      }

      if ((res.status === 503 || res.status === 429) && attempt < 2) {
        const delay = (attempt + 1) * 2000;
        console.log(`${model} returned ${res.status}, retry ${attempt + 1} in ${delay}ms...`);
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }

      console.log(`${model} failed (${res.status}), trying next model...`);
      break;
    }
  }

  throw new Error("All models unavailable");
}

function validateToken(env: Env, token: string): boolean {
  try {
    const valid: string[] = JSON.parse(env.VALID_TOKENS);
    return valid.includes(token);
  } catch {
    return false;
  }
}

// ── /evaluate — score a learner's GrowthBook SDK submission ──
async function handleEvaluate(body: any, env: Env): Promise<Response> {
  if (!body.code?.trim()) {
    return jsonResponse({ error: "No code provided" }, 400);
  }

  const language = body.language === "python" ? "Python" : body.language === "ios" ? "iOS Swift" : "JavaScript";

  const prompt = `
    Evaluate this code as a senior ${language} engineer reviewing a GrowthBook ${language} SDK integration.
    SDK Language: ${language}
    Level: ${body.level || body.scenario.level || 1}
    Exercise: ${body.scenario.title}
    Constraints: ${body.scenario.constraints.join(", ")}
    Starter Scaffold: ${body.scenario.starterCode || "none provided"}
    User Code: ${body.code}

    Return ONLY JSON:
    {
      "status": "Success" | "Partial" | "Risk",
      "score": number,
      "breakdown": { "security": number, "efficiency": number, "readability": number },
      "critique": "2-sentence review."
    }
  `;

  try {
    const text = await callGemini(env, prompt);
    return jsonResponse(JSON.parse(text));
  } catch (err) {
    console.error("Evaluate error:", err);
    return jsonResponse({ error: "AI evaluation failed" }, 502);
  }
}

// ── /mission — generate a fresh GrowthBook SDK exercise, adapted to learner weaknesses ──
async function handleMission(body: any, env: Env): Promise<Response> {
  const requestedLanguage = body.language === "python" ? "python" : body.language === "ios" ? "ios" : "javascript";
  const language = requestedLanguage === "python" ? "Python" : requestedLanguage === "ios" ? "iOS Swift" : "JavaScript";
  const sdkPackage = requestedLanguage === "python"
    ? "growthbook Python SDK"
    : requestedLanguage === "ios"
      ? "GrowthBook Swift SDK for iOS"
      : "GrowthBook JavaScript SDK";
  const codeStyle = requestedLanguage === "python"
    ? "Use Python syntax with `from growthbook import GrowthBook`, `GrowthBook(...)`, `gb.load_features()`, `gb.is_on(...)`, and `gb.get_feature_value(...)`."
    : requestedLanguage === "ios"
      ? "Use Swift syntax with `import GrowthBook`, `var gb: GrowthBookSDK = GrowthBookBuilder(...)`, `encryptionKey`, `trackingCallback`, `backgroundSync`, `refreshHandler`, `gb.isOn(feature: ...)`, and `gb.getFeatureValue(feature: ..., defaultValue: JSON(...))`."
      : "Use plain JavaScript or TypeScript syntax with `import { GrowthBook } from \"@growthbook/growthbook\"`, `await growthbook.init(...)`, `growthbook.isOn(...)`, and `growthbook.getFeatureValue(...)`.";
  const perf = body.performance as {
    score: number;
    breakdown: { security: number; efficiency: number; readability: number };
    critique: string;
  } | undefined;

  let adaptiveContext = "";

  if (perf) {
    const { score, breakdown, critique } = perf;

    if (score >= 50 && score <= 65) {
      // ── STRUGGLING: reinforce weak areas at the same difficulty ──
      const weak: string[] = [];
      if (breakdown.security < 70) weak.push("security");
      if (breakdown.efficiency < 70) weak.push("efficiency");
      if (breakdown.readability < 70) weak.push("readability/code quality");

      adaptiveContext = `
      ADAPTIVE LEARNING — REINFORCEMENT MODE:
      The learner is struggling (scored ${score}%). Their weakest areas: ${weak.join(", ") || "general understanding"}.
      Previous feedback: "${critique}"
      
      Design the next mission to specifically REINFORCE these weak areas.
      Give the learner a focused opportunity to practice ${weak.join(" and ") || "the fundamentals"} without overwhelming them.
      Keep the difficulty similar — don't make it harder, make it more targeted.
      `;
    } else if (score >= 85) {
      // ── SUPERSTAR: escalate complexity and ambiguity ──
      const strong: string[] = [];
      if (breakdown.security >= 85) strong.push("security");
      if (breakdown.efficiency >= 85) strong.push("efficiency");
      if (breakdown.readability >= 85) strong.push("readability");

      adaptiveContext = `
      ADAPTIVE LEARNING — ADVANCED CHALLENGE MODE:
      This learner is excelling (scored ${score}%). Strong areas: ${strong.join(", ") || "all categories"}.
      Previous feedback: "${critique}"
      
      PUSH THIS LEARNER. Generate a significantly harder scenario:
      - Use MULTI-STEP SDK INTEGRATIONS (e.g. async GrowthBook initialization + user attributes + tracking callbacks, or SSR bootstrap + client hydration + feature rendering).
      - Introduce COMPETING CONSTRAINTS that force trade-offs (e.g. "minimize flicker" vs "wait for experiment data", or "strict typing" vs "fast prototype delivery").
      - Add REAL-WORLD COMPLEXITY: analytics integrations, identity changes after login, QA mode, sticky assignments, or safe rollout requirements for sensitive features.
      - Include an AMBIGUOUS element that has no single correct answer — the learner must justify their design choices.
      - Increase the number of constraints to 4-5 instead of 3.
      
      Do NOT give them a trivial copy-paste flag check. They've earned a senior-level SDK integration challenge.
      `;
    }
  }

  const prompt = `
    You are a training platform for the ${sdkPackage}. Generate ONE unique, realistic SDK exercise for a learner to solve.
    SDK Language: ${language}
    The requested exercise level is Level ${body.level || 1}.
    
    Center the challenge on learning the ${sdkPackage} in a realistic ${language} app.
    Vary the difficulty and topic — examples: SDK initialization, user attributes, feature gating, experiment exposure tracking, sticky bucketing, QA mode, SSR/CSR rendering, caching, or safe feature rollouts.
    For Level 1 exercises:
    - Return a beginner-friendly scaffold in "starterCode" that already imports GrowthBook and sets up the basic app structure.
    - The scaffold should specifically teach this sequence: set targeting attributes, initialize or load GrowthBook features, then evaluate a boolean flag.
    - Include an explicit user attributes scaffold object so the learner fills in realistic targeting fields instead of only editing a comment.
    - Include an explicit initialization or cache/load option scaffold so the learner fills in SDK setup details instead of only editing a single line.
    - Include 2-4 obvious blanks or TODOs for the learner to complete.
    - ${codeStyle}
    - Make the missing pieces specifically about the GrowthBook ${language} SDK.
    - Make the exercise title, description, and constraints clearly describe the same solution steps as the scaffold.
    - The scaffold must be based directly on the exercise call to action. If the description tells the learner to choose between two experiences, the starterCode should include those render functions and that exact feature decision.
    For Level 2 exercises:
    - Return a slimmer scaffold with less boilerplate and fewer hints than Level 1.
    - Focus on more advanced SDK capabilities such as feature value retrieval, experiment tracking callbacks, feature refresh/caching, or config/value-driven rendering.
    - Do NOT hand the learner a nearly complete solution; remove additional setup code and make them connect more of the SDK flow themselves.
    - The scaffold must still be based directly on the exercise call to action and the specific feature key or config key named in the exercise.
    ${adaptiveContext}
    Return ONLY JSON:
    {
      "id": "short-kebab-id",
      "level": ${body.level || 1},
      "title": "Short Scenario Title (5-8 words)",
      "description": "2-3 sentence real-world scenario the learner must solve. Be specific about the product context and the GrowthBook ${language} SDK problem.",
      "constraints": ["Constraint 1", "Constraint 2", "Constraint 3"],
      "language": "${requestedLanguage}",
      "starterCode": "A scaffolded code sample with blanks or TODOs for the learner to complete."
    }
  `;

  try {
    const text = await callGemini(env, prompt);
    return jsonResponse(JSON.parse(text));
  } catch (err) {
    console.error("Mission generation error:", err);
    return jsonResponse({ error: "Failed to generate mission" }, 502);
  }
}

// ── Router ──
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405);
    }

    const url = new URL(request.url);
    const path = url.pathname;

    let body: any;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ error: "Invalid JSON body" }, 400);
    }

    if (!body.token || !validateToken(env, body.token)) {
      return jsonResponse({ error: "Invalid or expired access token" }, 401);
    }

    switch (path) {
      case "/evaluate":
        return handleEvaluate(body, env);
      case "/mission":
        return handleMission(body, env);
      default:
        return jsonResponse({ error: "Not found" }, 404);
    }
  },
} satisfies ExportedHandler<Env>;
