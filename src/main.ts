import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * THE GENERATIVE ARCHITECT ENGINE (v2.2)
 * Fixes: Header 'append' invalid value & Model Discovery 404
 */

// 1. SCENARIO DATA
interface Scenario {
  id: string;
  title: string;
  description: string;
  constraints: string[];
}

const SCENARIOS: Scenario[] = [
  {
    id: "s3-static",
    title: "Secure Static Site Deployment",
    description: "The client needs a public-facing S3 bucket for their frontend, but a recent audit flagged 'DeleteObject' permissions as a risk.",
    constraints: ["Public Read Access", "Restrict Delete Access", "CloudFront Friendly"]
  },
  {
    id: "lambda-api",
    title: "High-Performance API Logic",
    description: "Deploy a serverless function that handles customer PII. It must be fast and follow Least Privilege.",
    constraints: ["Low Latency", "No Admin Access", "IAM Policy optimization"]
  }
];

interface SimulationResult {
  status: 'Success' | 'Partial' | 'Risk';
  score: number;
  breakdown: { security: number; efficiency: number; readability: number };
  critique: string;
}

// 2. THE ENGINE CLASS
class LearningEngine {
  private genAI: GoogleGenerativeAI | null = null;

  setApiKey(key: string) {
    // FIX: Ensure key is a non-empty string to avoid Header 'append' errors
    const sanitizedKey = key.trim();
    if (!sanitizedKey || sanitizedKey === "null") {
      throw new Error("Invalid API Key provided.");
    }
    this.genAI = new GoogleGenerativeAI(sanitizedKey);
  }

  async evaluateSubmission(userInput: string, activeScenario: Scenario): Promise<SimulationResult> {
    if (!this.genAI) throw new Error("API_KEY_MISSING");

    // FIX: Using the versioned string to prevent 404s
    const model = this.genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
      Evaluate this code as a Senior Cloud Architect.
      Mission: ${activeScenario.title}
      Constraints: ${activeScenario.constraints.join(", ")}
      User Code: ${userInput}

      Return ONLY JSON:
      {
        "status": "Success" | "Partial" | "Risk",
        "score": number,
        "breakdown": { "security": number, "efficiency": number, "readability": number },
        "critique": "2-sentence review."
      }
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return JSON.parse(response.text());
    } catch (err: any) {
      console.error("SDK Error:", err);
      throw new Error(err.message || "Connection Failed");
    }
  }
}

// 3. UI CONTROLLERS
const engine = new LearningEngine();
let currentScenario = SCENARIOS[0];

const btn = document.getElementById('submitBtn') as HTMLButtonElement;
const input = document.getElementById('codeInput') as HTMLTextAreaElement;
const loadingStatus = document.getElementById('loadingStatus') as HTMLDivElement;
const placeholderText = document.getElementById('placeholderText') as HTMLDivElement;
const resultCard = document.getElementById('resultCard') as HTMLDivElement;
const nextBtn = document.getElementById('nextScenario') as HTMLButtonElement;

function loadScenario() {
  currentScenario = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
  document.getElementById('scenarioTitle')!.innerText = currentScenario.title;
  document.getElementById('scenarioDesc')!.innerText = currentScenario.description;
  
  const tags = document.getElementById('constraintTags')!;
  tags.innerHTML = currentScenario.constraints
    .map(c => `<span class="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-[8px] font-black tracking-widest">${c}</span>`)
    .join('');
    
  resultCard.classList.add('hidden');
  placeholderText.classList.remove('hidden');
  input.value = "";
}

async function handleSubmission() {
  const code = input.value.trim();
  if (!code) return alert("Please enter code.");

  // FIX: Clear bad session data and force a clean string key
  let apiKey = sessionStorage.getItem('gemini_key');
  if (!apiKey || apiKey === "null" || apiKey.length < 10) {
    apiKey = prompt("Enter your Gemini API Key:");
    if (apiKey && apiKey.trim().length > 10) {
      sessionStorage.setItem('gemini_key', apiKey.trim());
    } else {
      return; 
    }
  }

  // UI State
  resultCard.classList.add('hidden');
  placeholderText.classList.add('hidden');
  loadingStatus.classList.remove('hidden');
  btn.disabled = true;

  try {
    engine.setApiKey(apiKey);
    const result = await engine.evaluateSubmission(code, currentScenario);

    // Update Scores
    document.getElementById('scoreDisplay')!.innerText = result.score.toString();
    const badge = document.getElementById('statusBadge')!;
    badge.innerText = result.status;
    badge.className = `px-3 py-1 rounded-full text-[9px] font-black uppercase ${
      result.status === 'Risk' ? 'bg-red-500/20 text-red-500' : 
      result.status === 'Partial' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-emerald-500/20 text-emerald-500'
    }`;

    // Update Bars
    const updateBar = (id: string, valId: string, val: number) => {
      (document.getElementById(id) as HTMLElement).style.width = `${val}%`;
      (document.getElementById(valId) as HTMLElement).innerText = `${val}%`;
    };

    updateBar('secBar', 'secValue', result.breakdown.security);
    updateBar('effBar', 'effValue', result.breakdown.efficiency);
    updateBar('readBar', 'readValue', result.breakdown.readability);
    document.getElementById('critiqueDisplay')!.innerText = result.critique;

    loadingStatus.classList.add('hidden');
    resultCard.classList.remove('hidden');
  } catch (err: any) {
    loadingStatus.classList.add('hidden');
    placeholderText.classList.remove('hidden');
    alert(`Architect Error: ${err.message}`);
    sessionStorage.removeItem('gemini_key'); // Clear key so user can re-try
  } finally {
    btn.disabled = false;
  }
}

btn.addEventListener('click', handleSubmission);
nextBtn.addEventListener('click', loadScenario);
loadScenario();