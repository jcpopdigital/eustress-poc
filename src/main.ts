interface SimulationResult {
  status: 'Success' | 'Partial' | 'Risk';
  score: number;
  critique: string;
}

class LearningEngine {
  async evaluateSubmission(userInput: string, context: string): Promise<SimulationResult> {
    console.log(`Evaluating ${context}...`);

    // Logic Gate
    const hasSecurityFlaw = userInput.includes("'*'") || userInput.includes("AllowAll");
    const isEfficient = userInput.toLowerCase().includes("cache") || userInput.length < 500;

    // Simulate Processing Delay for Eustress
    await new Promise(resolve => setTimeout(resolve, 1800));

    if (hasSecurityFlaw) {
      return {
        status: 'Risk',
        score: 40,
        critique: "Your code works (Capability), but you've exposed data to the public internet (Failed Outcome). How would you restrict this to only authorized CIDR blocks?"
      };
    }

    if (!isEfficient) {
      return {
        status: 'Partial',
        score: 75,
        critique: "Technically correct, but this architecture will scale poorly and cost 3x more than necessary. Look into CloudFront TTL settings."
      };
    }

    return {
      status: 'Success',
      score: 95,
      critique: "Excellent. You've balanced performance with security. The business outcome is achieved."
    };
  }
}

// UI HANDLERS
const engine = new LearningEngine();
const btn = document.getElementById('submitBtn') as HTMLButtonElement;
const input = document.getElementById('codeInput') as HTMLTextAreaElement;
const loading = document.getElementById('loading') as HTMLDivElement;
const resultCard = document.getElementById('resultCard') as HTMLDivElement;

btn.addEventListener('click', async () => {
  // Reset UI
  resultCard.classList.add('hidden');
  loading.classList.remove('hidden');
  btn.disabled = true;

  const result = await engine.evaluateSubmission(input.value, "Secure S3 Deployment");

  // Update UI with Result
  loading.classList.add('hidden');
  resultCard.classList.remove('hidden');
  btn.disabled = false;

  const badge = document.getElementById('statusBadge')!;
  badge.innerText = result.status.toUpperCase();
  badge.className = `inline-block px-3 py-1 rounded text-xs font-bold mb-4 ${
    result.status === 'Risk' ? 'bg-red-900 text-red-200' : 
    result.status === 'Partial' ? 'bg-yellow-900 text-yellow-200' : 'bg-green-900 text-green-200'
  }`;

  document.getElementById('scoreDisplay')!.innerText = result.score.toString();
  document.getElementById('critiqueDisplay')!.innerText = result.critique;
});