/**
 * THE GROWTHBOOK SDK LEARNING ENGINE (v3.1)
 * AI-generated exercises + Cloudflare Worker proxy with learner tokens.
 */

const WORKER_URL = "https://architect-pro-api.jobechoi.workers.dev";

// 1. TYPES
type SDKLanguage = 'javascript' | 'python' | 'ios';

interface Scenario {
  id: string;
  level: number;
  title: string;
  description: string;
  constraints: string[];
  starterCode?: string;
  language?: SDKLanguage;
}

interface SimulationResult {
  status: 'Success' | 'Partial' | 'Risk';
  score: number;
  breakdown: { security: number; efficiency: number; readability: number };
  critique: string;
}

const FALLBACK_SCENARIO: Scenario = {
  id: "fallback",
  level: 1,
  title: "Cart Open A/B Test Tracking",
  description: "Finish a beginner GrowthBook JavaScript SDK integration for a cart engagement experiment. Set user targeting attributes, initialize the SDK, and use the `cart-open-experiment` feature flag to decide which cart prompt to render while tracking whether the shopper actually opened the cart.",
  constraints: ["Set User Attributes", "Initialize Before Evaluating", "Use isOn(\"cart-open-experiment\")", "Track Whether The Cart Was Opened"],
  starterCode: `import { GrowthBook } from "@growthbook/growthbook";

const growthbook = new GrowthBook({
  apiHost: "https://cdn.growthbook.io",
  clientKey: "sdk-abc123",
  enableDevMode: true,
  trackingCallback: (experiment, result) => {
    console.log("Experiment Viewed", {
      experimentId: experiment.key,
      variationId: result.key,
    });
  },
});

let cartOpened = false;

async function bootCartExperience(userId: string) {
  const userAttributes = {
    id: userId,
    // TODO: set the shopper's country for targeting
    country: "___",
    // TODO: set whether this shopper is a returning customer
    returningCustomer: ___,
  };

  growthbook.setAttributes(userAttributes);

  const initOptions = {
    // TODO: choose a timeout for SDK initialization
    timeout: ___,
    // TODO: decide whether this exercise should use streaming updates
    streaming: ___,
  };

  await growthbook.init(initOptions);

  const showExperimentCartPrompt = growthbook._____("cart-open-experiment");

  if (showExperimentCartPrompt) {
    renderExperimentCartPrompt();
  } else {
    renderControlCartPrompt();
  }
}

function handleCartOpen() {
  cartOpened = ___;

  trackCartOpened({
    experiment: "cart-open-experiment",
    opened: cartOpened,
  });
}

function trackCartOpened(payload: { experiment: string; opened: boolean }) {
  console.log("Cart opened event", payload);
}

function renderExperimentCartPrompt() {
  console.log("Render experiment cart prompt");
}

function renderControlCartPrompt() {
  console.log("Render control cart prompt");
}

bootCartExperience("user-222");`
};

const LEVEL_ONE_EXERCISES: Scenario[] = [
  FALLBACK_SCENARIO,
];

const LEVEL_TWO_EXERCISES: Scenario[] = [
  {
    id: "smart-upsell-variant",
    level: 2,
    title: "Smart Upsell Variant Selection",
    description: "Advance to a more capable GrowthBook SDK integration for an upsell experiment. Initialize the SDK with less scaffold, attach an exposure tracking callback, and use `getFeatureValue(\"smart-upsell-variant\", ...)` to choose which upsell variant to render.",
    constraints: ["Add Tracking Callback", "Use getFeatureValue(\"smart-upsell-variant\", ...)", "Render Variant From SDK Value"],
    starterCode: `import { GrowthBook } from "@growthbook/growthbook";

const growthbook = new GrowthBook({
  apiHost: "https://cdn.growthbook.io",
  clientKey: "sdk-abc123",
  enableDevMode: true,
});

async function bootUpsell(user: { id: string; plan: string }) {
  growthbook.setAttributes({
    id: user.id,
    plan: user.plan,
  });

  growthbook._____( (experiment, result) => {
    console.log("Experiment Viewed", {
      experimentId: experiment.key,
      variationId: result.key,
    });
  });

  await growthbook.init({
    timeout: 1500,
    streaming: true,
  });

  const upsellVariant = growthbook._____("smart-upsell-variant", "control");
  renderUpsellVariant(upsellVariant);
}

function renderUpsellVariant(variant: string) {
  console.log("Render upsell variant", variant);
}

bootUpsell({ id: "user-901", plan: "pro" });`,
  },
  {
    id: "support-chat-config",
    level: 2,
    title: "Support Chat Config Delivery",
    description: "Advance to a more capable GrowthBook SDK integration for a support experience rollout. Initialize the SDK with less scaffold and use `getFeatureValue(\"support-chat-config\", ...)` to retrieve a config object that controls which support chat mode to render.",
    constraints: ["Use getFeatureValue(\"support-chat-config\", ...)", "Pass An Object Fallback", "Render From Returned Config"],
    starterCode: `import { GrowthBook } from "@growthbook/growthbook";

const growthbook = new GrowthBook({
  apiHost: "https://cdn.growthbook.io",
  clientKey: "sdk-abc123",
  enableDevMode: true,
});

async function bootSupportChat(userId: string) {
  growthbook.setAttributes({
    id: userId,
    country: "US",
  });

  await growthbook.init({
    timeout: 1200,
  });

  const chatConfig = growthbook._____("support-chat-config", {
    mode: "standard",
    prompt: "How can we help?",
  });

  renderSupportChat(chatConfig);
}

function renderSupportChat(config: { mode: string; prompt: string }) {
  console.log("Render support chat", config.mode, config.prompt);
}

bootSupportChat("user-654");`,
  },
];

const builtInScenarioIndices: Record<number, number> = { 1: 0, 2: -1 };

// 2. TOKEN HELPER
function getToken(): string | null {
  let token = sessionStorage.getItem('learner_token');
  if (token?.trim()) return token.trim();

  token = prompt("Enter your Access Token:");
  if (token?.trim()) {
    sessionStorage.setItem('learner_token', token.trim());
    return token.trim();
  }
  return null;
}

// 3. THE ENGINE CLASS
class LearningEngine {
  async generateMission(token: string, language: SDKLanguage): Promise<Scenario> {
    const res = await fetch(`${WORKER_URL}/mission`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, level: currentScenario.level || 1, language }),
    });

    const data = await res.json();
    if (!res.ok) {
      if (res.status === 401) throw new Error("Invalid or expired access token.");
      throw new Error((data as any).error || "Exercise generation failed");
    }
    return data as Scenario;
  }

  async evaluateSubmission(token: string, userInput: string, activeScenario: Scenario, language: SDKLanguage): Promise<SimulationResult> {
    const res = await fetch(`${WORKER_URL}/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        language,
        level: activeScenario.level,
        code: userInput,
        scenario: {
          level: activeScenario.level,
          title: activeScenario.title,
          constraints: activeScenario.constraints,
          starterCode: activeScenario.starterCode,
          language,
        },
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      if (res.status === 401) throw new Error("Invalid or expired access token.");
      throw new Error((data as any).error || "Evaluation failed");
    }
    return data as SimulationResult;
  }
}

// 4. UI CONTROLLERS
const engine = new LearningEngine();
let currentScenario: Scenario = LEVEL_ONE_EXERCISES[0];

const btn = document.getElementById('submitBtn') as HTMLButtonElement;
const input = document.getElementById('codeInput') as HTMLTextAreaElement;
const lineNumbers = document.getElementById('lineNumbers') as HTMLDivElement;
const loadingStatus = document.getElementById('loadingStatus') as HTMLDivElement;
const placeholderText = document.getElementById('placeholderText') as HTMLDivElement;
const resultCard = document.getElementById('resultCard') as HTMLDivElement;
const nextBtn = document.getElementById('nextScenario') as HTMLButtonElement;
const languageTabs = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-sdk-language]'));
const scenarioLevel = document.getElementById('scenarioLevel') as HTMLSpanElement;
const scenarioTitle = document.getElementById('scenarioTitle') as HTMLHeadingElement;
const scenarioDesc = document.getElementById('scenarioDesc') as HTMLParagraphElement;
const constraintTags = document.getElementById('constraintTags') as HTMLDivElement;
const scoreDisplay = document.getElementById('scoreDisplay') as HTMLSpanElement;
const statusBadge = document.getElementById('statusBadge') as HTMLDivElement;
const critiqueDisplay = document.getElementById('critiqueDisplay') as HTMLParagraphElement;
const sdkLabel = document.getElementById('sdkLabel') as HTMLSpanElement | null;
let hiddenScaffoldSnapshot: string | null = null;
let selectedLanguage: SDKLanguage = 'javascript';

(window as any).__sdkLabAppReady = true;

function updateLineNumbers() {
  const lines = Math.max(1, input.value.split('\n').length);
  lineNumbers.innerHTML = Array.from({ length: lines }, (_, i) => i + 1).join('<br>');
  lineNumbers.scrollTop = input.scrollTop;
}

input.addEventListener('input', updateLineNumbers);
input.addEventListener('scroll', () => { lineNumbers.scrollTop = input.scrollTop; });

function getLevelLabel(level: number): string {
  return `Level ${level}`;
}

function getSelectedLanguage(): SDKLanguage {
  return selectedLanguage;
}

function getLanguageLabel(language: SDKLanguage): string {
  if (language === 'ios') return 'iOS';
  return language === 'python' ? 'Python' : 'JavaScript';
}

function getSDKDisplayName(language: SDKLanguage): string {
  if (language === 'python') return 'growthbook Python SDK';
  if (language === 'ios') return 'GrowthBook Swift SDK for iOS';
  return 'GrowthBook JavaScript SDK';
}

function getAppDisplayName(language: SDKLanguage): string {
  if (language === 'python') return 'Python app';
  if (language === 'ios') return 'iOS app';
  return 'JavaScript app';
}

function getLanguageDescription(description: string, language: SDKLanguage): string {
  const sdkName = getSDKDisplayName(language);
  const appName = getAppDisplayName(language);

  let next = description
    .replace(/growthbook Python SDK|GrowthBook (?:JavaScript|Python|Swift|iOS Swift) SDK(?: for iOS)?/gi, sdkName)
    .replace(/\bfrontend or full-stack JavaScript app\b/gi, appName)
    .replace(/\bJavaScript app\b/gi, appName)
    .replace(/\bPython app\b/gi, appName)
    .replace(/\biOS app\b/gi, appName);

  if (language === 'python') {
    next = next
      .replace(/\bisOn\(/g, 'is_on(')
      .replace(/\bgetFeatureValue\(/g, 'get_feature_value(')
      .replace(/\bsetAttributes\(/g, 'set_attributes(');
  } else if (language === 'ios') {
    next = next
      .replace(/\bisOn\((["`'])/g, 'isOn(feature: $1')
      .replace(/\bgetFeatureValue\((["`'])/g, 'getFeatureValue(feature: $1')
      .replace(/\bsetAttributes\(\.\.\.\)/g, 'GrowthBookBuilder attributes');
  } else {
    next = next
      .replace(/\bis_on\(/g, 'isOn(')
      .replace(/\bget_feature_value\(/g, 'getFeatureValue(')
      .replace(/\bGrowthBookBuilder attributes\b/g, 'setAttributes(...)');
  }

  return next;
}

function parseSDKLanguage(value: string | undefined): SDKLanguage {
  if (value === 'python' || value === 'ios') return value;
  return 'javascript';
}

function renderLanguageTabs(language: SDKLanguage) {
  for (const tab of languageTabs) {
    const isActive = tab.dataset.sdkLanguage === language;
    tab.setAttribute('aria-selected', String(isActive));
  }
}

function getBuiltInExercisesForLevel(level: number): Scenario[] {
  return level >= 2 ? LEVEL_TWO_EXERCISES : LEVEL_ONE_EXERCISES;
}

function isGrowthBookScenario(scenario: Scenario): boolean {
  const text = `${scenario.title} ${scenario.description} ${scenario.constraints.join(' ')} ${scenario.starterCode || ''}`.toLowerCase();
  const growthbookSignals = [
    'growthbook',
    '@growthbook/growthbook',
    'ison(',
    'getfeaturevalue(',
    'settrackingcallback',
    'trackingcallback',
    'feature flag',
    'sdk',
  ];
  const offTopicSignals = [
    'aws',
    'gcp',
    'azure',
    's3',
    'cloudfront',
    'iam',
    'terraform',
    'pulumi',
    'bucket',
    'kubernetes',
    'web application',
    'static website',
  ];

  const hasGrowthBookSignal = growthbookSignals.some(signal => text.includes(signal));
  const hasOffTopicSignal = offTopicSignals.some(signal => text.includes(signal));

  return hasGrowthBookSignal && !hasOffTopicSignal;
}

function normalizeScenario(scenario: Scenario): Scenario {
  if (isGrowthBookScenario(scenario)) return scenario;
  return getNextBuiltInScenario(scenario.level || 1);
}

function extractFeatureKey(scenario: Scenario): string {
  const text = `${scenario.title} ${scenario.description} ${scenario.constraints.join(' ')}`;
  const explicitMatch = text.match(/isOn\(["`']([^"`']+)["`']\)/i);
  if (explicitMatch) return explicitMatch[1];

  const quotedMatch = text.match(/["`']([a-z0-9-]+)["`']/i);
  if (quotedMatch) return quotedMatch[1];

  return 'new-feature';
}

function inferExperienceName(scenario: Scenario): string {
  const text = `${scenario.title} ${scenario.description}`.toLowerCase();

  if (text.includes('checkout')) return 'Checkout';
  if (text.includes('pricing')) return 'Pricing';
  if (text.includes('onboarding')) return 'Onboarding';
  if (text.includes('banner')) return 'Banner';
  if (text.includes('paywall')) return 'Paywall';

  return 'Experience';
}

function buildLevelOneScaffold(scenario: Scenario): string {
  const featureKey = extractFeatureKey(scenario);
  const experienceName = inferExperienceName(scenario);

  return `import { GrowthBook } from "@growthbook/growthbook";

const growthbook = new GrowthBook({
  apiHost: "https://cdn.growthbook.io",
  clientKey: "sdk-abc123",
  enableDevMode: true,
});

async function bootExperience(userId: string) {
  // Exercise goal: ${scenario.description}
  const userAttributes = {
    id: userId,
    // TODO: set a targeting attribute for this exercise
    country: "___",
    // TODO: set another targeting attribute used in GrowthBook rules
    paid: ___,
  };

  growthbook.setAttributes(userAttributes);

  const initOptions = {
    // TODO: choose a timeout for SDK initialization
    timeout: ___,
    // TODO: decide whether this exercise should use streaming updates
    streaming: ___,
  };

  await growthbook.init(initOptions);

  const showNew${experienceName} = growthbook._____("${featureKey}");

  if (showNew${experienceName}) {
    renderNew${experienceName}();
  } else {
    renderClassic${experienceName}();
  }
}

function renderNew${experienceName}() {
  console.log("Render new ${experienceName.toLowerCase()}");
}

function renderClassic${experienceName}() {
  console.log("Render classic ${experienceName.toLowerCase()}");
}

bootExperience("user-123");`;
}

function buildLevelTwoScaffold(scenario: Scenario): string {
  const featureKey = extractFeatureKey(scenario);
  const experienceName = inferExperienceName(scenario);

  return `import { GrowthBook } from "@growthbook/growthbook";

const growthbook = new GrowthBook({
  apiHost: "https://cdn.growthbook.io",
  clientKey: "sdk-abc123",
  enableDevMode: true,
});

async function boot${experienceName}(user: { id: string; plan: string }) {
  growthbook.setAttributes({
    id: user.id,
    plan: user.plan,
  });

  await growthbook.init({
    timeout: 1500,
    streaming: true,
  });

  const ${experienceName.toLowerCase()}Config = growthbook._____("${featureKey}", "control");
  render${experienceName}(${experienceName.toLowerCase()}Config);
}

function render${experienceName}(value: string) {
  console.log("Render ${experienceName.toLowerCase()}", value);
}

boot${experienceName}({ id: "user-999", plan: "pro" });`;
}

function buildLevelOnePythonScaffold(scenario: Scenario): string {
  const featureKey = extractFeatureKey(scenario);
  const experienceName = inferExperienceName(scenario);

  return `from growthbook import GrowthBook


def boot_experience(user_id):
    # Exercise goal: ${scenario.description}
    attributes = {
        "id": user_id,
        # TODO: set a targeting attribute for this exercise
        "country": "___",
        # TODO: set another targeting attribute used in GrowthBook rules
        "paid": ___,
    }

    gb = GrowthBook(
        attributes=attributes,
        api_host="https://cdn.growthbook.io",
        client_key="sdk-abc123",
        # TODO: choose a cache TTL for feature refreshes
        cache_ttl=___,
    )

    gb.load_features()

    is_enabled = gb._____("${featureKey}")

    if is_enabled:
        render_new_${experienceName.toLowerCase()}()
    else:
        render_classic_${experienceName.toLowerCase()}()


def render_new_${experienceName.toLowerCase()}():
    print("Render new ${experienceName.toLowerCase()}")


def render_classic_${experienceName.toLowerCase()}():
    print("Render classic ${experienceName.toLowerCase()}")


boot_experience("user-123")`;
}

function buildLevelTwoPythonScaffold(scenario: Scenario): string {
  const featureKey = extractFeatureKey(scenario);
  const experienceName = inferExperienceName(scenario);
  const functionName = experienceName.toLowerCase();

  return `from growthbook import GrowthBook


def on_experiment_viewed(experiment, result):
    print("Experiment Viewed", {
        "experimentId": experiment.key,
        "variationId": result.key,
    })


def boot_${functionName}(user):
    attributes = {
        "id": user["id"],
        "plan": user["plan"],
    }

    gb = GrowthBook(
        attributes=attributes,
        on_experiment_viewed=on_experiment_viewed,
        api_host="https://cdn.growthbook.io",
        client_key="sdk-abc123",
        cache_ttl=60,
    )
    gb.load_features()

    ${functionName}_config = gb._____("${featureKey}", "control")
    render_${functionName}(${functionName}_config)


def render_${functionName}(value):
    print("Render ${functionName}", value)


boot_${functionName}({"id": "user-999", "plan": "pro"})`;
}

function buildLevelOneIOSScaffold(scenario: Scenario): string {
  const featureKey = extractFeatureKey(scenario);
  const experienceName = inferExperienceName(scenario);

  return `import Foundation
import GrowthBook

final class ${experienceName}Controller {
    func bootExperience(userId: String) {
        // Exercise goal: ${scenario.description}
        let attributes: [String: Any] = [
            "id": userId,
            // TODO: set a targeting attribute for this exercise
            "country": "___",
            // TODO: set another targeting attribute used in GrowthBook rules
            "paid": ___
        ]

        var gb: GrowthBookSDK = GrowthBookBuilder(
            // Your GrowthBook API host
            apiHost: "https://cdn.growthbook.io",
            // Your client key
            clientKey: "sdk-abc123",
            // Optional: encryption key if your features are encrypted
            encryptionKey: "abcdef98765",
            // Required user attributes for targeting
            attributes: attributes,
            // Required: called whenever someone is put into an experiment
            trackingCallback: { experiment, result in
                print("Experiment Viewed", [
                    "experimentId": experiment.key,
                    "variationId": result.key
                ])
            },
            // Optional: real-time updates via SSE
            backgroundSync: ___,
            // Optional: called when features are refreshed
            refreshHandler: { success in
                print("Features refreshed", success)
            }
        ).initializer()

        let isEnabled = gb._____(feature: "${featureKey}")

        if isEnabled {
            renderNew${experienceName}()
        } else {
            renderClassic${experienceName}()
        }
    }

    private func renderNew${experienceName}() {
        print("Render new ${experienceName.toLowerCase()}")
    }

    private func renderClassic${experienceName}() {
        print("Render classic ${experienceName.toLowerCase()}")
    }
}

${experienceName}Controller().bootExperience(userId: "user-123")`;
}

function buildLevelTwoIOSScaffold(scenario: Scenario): string {
  const featureKey = extractFeatureKey(scenario);
  const experienceName = inferExperienceName(scenario);
  const variableName = experienceName.charAt(0).toLowerCase() + experienceName.slice(1);

  return `import Foundation
import GrowthBook

final class ${experienceName}Controller {
    private let gb: GrowthBookSDK

    init(userId: String, plan: String) {
        var gb: GrowthBookSDK = GrowthBookBuilder(
            // Your GrowthBook API host
            apiHost: "https://cdn.growthbook.io",
            // Your client key
            clientKey: "sdk-abc123",
            // Optional: encryption key if your features are encrypted
            encryptionKey: "abcdef98765",
            // Required user attributes for targeting
            attributes: [
                "id": userId,
                "plan": plan
            ],
            // Required: called whenever someone is put into an experiment
            trackingCallback: { experiment, result in
                print("Experiment Viewed", [
                    "experimentId": experiment.key,
                    "variationId": result.key
                ])
            },
            // Optional: real-time updates via SSE
            backgroundSync: true,
            // Optional: called when features are refreshed
            refreshHandler: { success in
                print("Features refreshed", success)
            }
        ).initializer()
        self.gb = gb
    }

    func render() {
        let ${variableName}Config = gb._____(feature: "${featureKey}", defaultValue: JSON("control"))
        render${experienceName}(value: ${variableName}Config)
    }

    private func render${experienceName}(value: JSON) {
        print("Render ${experienceName.toLowerCase()}", value)
    }
}

${experienceName}Controller(userId: "user-999", plan: "pro").render()`;
}

function isStarterCodeForLanguage(starterCode: string, language: SDKLanguage): boolean {
  const normalized = starterCode.toLowerCase();
  if (language === 'python') {
    return normalized.includes('from growthbook import') || normalized.includes('gb.load_features') || normalized.includes('def ');
  }

  if (language === 'ios') {
    return normalized.includes('growthbookbuilder') || normalized.includes('growthbooksdk') || normalized.includes('ison(feature:');
  }

  return normalized.includes('@growthbook/growthbook') || normalized.includes('new growthbook') || normalized.includes('growthbook.');
}

function getStarterCode(scenario: Scenario, language: SDKLanguage): string {
  if (scenario.starterCode?.trim() && isStarterCodeForLanguage(scenario.starterCode, language)) {
    return scenario.starterCode;
  }

  if (language === 'python') {
    if (scenario.level === 1) return buildLevelOnePythonScaffold(scenario);
    if (scenario.level === 2) return buildLevelTwoPythonScaffold(scenario);
  }

  if (language === 'ios') {
    if (scenario.level === 1) return buildLevelOneIOSScaffold(scenario);
    if (scenario.level === 2) return buildLevelTwoIOSScaffold(scenario);
  }

  if (scenario.level === 1) return buildLevelOneScaffold(scenario);
  if (scenario.level === 2) return buildLevelTwoScaffold(scenario);
  return "";
}

function revealScaffoldAnswers(code: string): string {
  return code
    .replace(/growthbook\._{5}\(\s*\(/g, 'growthbook.setTrackingCallback((')
    .replace(/growthbook\._{5}\(([^,\n]+),/g, 'growthbook.getFeatureValue($1,')
    .replace(/growthbook\._{5}\(([^)\n]+)\)/g, 'growthbook.isOn($1)')
    .replace(/growthBook\?\._{5}\(feature:/g, 'growthBook?.isOn(feature:')
    .replace(/growthBook\._{5}\(feature:([^,\n]+),\s*defaultValue:/g, 'growthBook.getFeatureValue(feature:$1, defaultValue:')
    .replace(/gb\._{5}\(feature:([^,\n]+),\s*defaultValue:/g, 'gb.getFeatureValue(feature:$1, defaultValue:')
    .replace(/gb\._{5}\(feature:/g, 'gb.isOn(feature:')
    .replace(/gb\._{5}\(([^,\n]+),/g, 'gb.get_feature_value($1,')
    .replace(/gb\._{5}\(([^)\n]+)\)/g, 'gb.is_on($1)')
    .replace(/country:\s*"___"/g, 'country: "US"')
    .replace(/"country":\s*"___"/g, '"country": "US"')
    .replace(/(paid|returningCustomer):\s*___/g, '$1: true')
    .replace(/"(paid|returning_customer)":\s*___/g, '"$1": True')
    .replace(/timeout:\s*___/g, 'timeout: 1500')
    .replace(/streaming:\s*___/g, 'streaming: true')
    .replace(/backgroundSync:\s*___/g, 'backgroundSync: false')
    .replace(/cache_ttl=___/g, 'cache_ttl=60')
    .replace(/cartOpened\s*=\s*___;/g, 'cartOpened = true;');
}

function getNextBuiltInScenario(level = 1): Scenario {
  const exercises = getBuiltInExercisesForLevel(level);
  const nextIndex = ((builtInScenarioIndices[level] ?? -1) + 1) % exercises.length;
  builtInScenarioIndices[level] = nextIndex;
  return exercises[nextIndex];
}

function renderScenario(scenario: Scenario) {
  const language = getSelectedLanguage();
  const languageLabel = getLanguageLabel(language);
  currentScenario = { ...scenario, language };

  scenarioLevel.textContent = getLevelLabel(currentScenario.level);
  scenarioTitle.textContent = currentScenario.title;
  scenarioDesc.textContent = getLanguageDescription(currentScenario.description, language);
  constraintTags.innerHTML = currentScenario.constraints
    .map(c => `<span class="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-[8px] font-black tracking-widest">${c}</span>`)
    .join('');

  resultCard.classList.add('hidden');
  placeholderText.classList.remove('hidden');
  input.placeholder = `// Fill in the missing GrowthBook ${languageLabel} SDK code...`;
  if (sdkLabel) sdkLabel.textContent = `GrowthBook ${languageLabel} SDK`;
  renderLanguageTabs(language);
  input.value = getStarterCode(currentScenario, language);
  hiddenScaffoldSnapshot = null;
  input.scrollTop = 0;
  updateLineNumbers();
  (window as any).__sdkLabSyncEditor?.();
}

async function loadScenario() {
  const token = getToken();
  if (!token) {
    currentScenario = getNextBuiltInScenario();
    renderScenario(currentScenario);
    return;
  }

  nextBtn.disabled = true;
  nextBtn.textContent = "Generating...";

  try {
    currentScenario = normalizeScenario(await engine.generateMission(token, getSelectedLanguage()));
    currentScenario.level ??= 1;
    renderScenario(currentScenario);
  } catch (err: any) {
    alert(`Mission Error: ${err.message}`);
    sessionStorage.removeItem('learner_token');
    currentScenario = getNextBuiltInScenario(1);
    renderScenario(currentScenario);
  } finally {
    nextBtn.disabled = false;
    nextBtn.textContent = "Generate New Exercise";
  }
}

async function handleSubmission() {
  const code = input.value.trim();
  if (!code) return alert("Please enter code.");

  const token = getToken();
  if (!token) return;

  resultCard.classList.add('hidden');
  placeholderText.classList.add('hidden');
  loadingStatus.classList.remove('hidden');
  btn.disabled = true;

  try {
    const result = await engine.evaluateSubmission(token, code, currentScenario, getSelectedLanguage());

    scoreDisplay.textContent = result.score.toString();
    statusBadge.textContent = result.status;
    statusBadge.className = `px-3 py-1 rounded-full text-[9px] font-black uppercase ${
      result.status === 'Risk' ? 'bg-red-500/20 text-red-500' : 
      result.status === 'Partial' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-emerald-500/20 text-emerald-500'
    }`;

    const updateBar = (id: string, valId: string, val: number) => {
      (document.getElementById(id) as HTMLElement).style.width = `${val}%`;
      (document.getElementById(valId) as HTMLElement).textContent = `${val}%`;
    };

    updateBar('secBar', 'secValue', result.breakdown.security);
    updateBar('effBar', 'effValue', result.breakdown.efficiency);
    updateBar('readBar', 'readValue', result.breakdown.readability);
    critiqueDisplay.textContent = result.critique;

    loadingStatus.classList.add('hidden');
    resultCard.classList.remove('hidden');
  } catch (err: any) {
    loadingStatus.classList.add('hidden');
    placeholderText.classList.remove('hidden');
    alert(`Coach Error: ${err.message}`);
    sessionStorage.removeItem('learner_token');
  } finally {
    btn.disabled = false;
  }
}

function handleShortcutReveal(event: KeyboardEvent) {
  if (!(event.ctrlKey && event.altKey && event.key.toLowerCase() === 'x')) return;

  event.preventDefault();

  if (hiddenScaffoldSnapshot !== null) {
    input.value = hiddenScaffoldSnapshot;
    hiddenScaffoldSnapshot = null;
    updateLineNumbers();
    (window as any).__sdkLabSyncEditor?.();
    return;
  }

  const revealedCode = revealScaffoldAnswers(input.value);
  if (revealedCode === input.value) return;

  hiddenScaffoldSnapshot = input.value;
  input.value = revealedCode;
  updateLineNumbers();
  (window as any).__sdkLabSyncEditor?.();
}

btn.addEventListener('click', handleSubmission);
nextBtn.addEventListener('click', loadScenario);
for (const tab of languageTabs) {
  tab.addEventListener('click', () => {
    const nextLanguage = parseSDKLanguage(tab.dataset.sdkLanguage);
    if (nextLanguage === selectedLanguage) return;

    selectedLanguage = nextLanguage;
    renderScenario(currentScenario);
  });
}
input.addEventListener('keydown', handleShortcutReveal);
renderScenario(FALLBACK_SCENARIO);
