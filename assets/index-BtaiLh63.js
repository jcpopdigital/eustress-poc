(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`https://architect-pro-api.jobechoi.workers.dev`,t={id:`fallback`,level:1,title:`Cart Open A/B Test Tracking`,description:"Finish a beginner GrowthBook JavaScript SDK integration for a cart engagement experiment. Set user targeting attributes, initialize the SDK, and use the `cart-open-experiment` feature flag to decide which cart prompt to render while tracking whether the shopper actually opened the cart.",constraints:[`Set User Attributes`,`Initialize Before Evaluating`,`Use isOn("cart-open-experiment")`,`Track Whether The Cart Was Opened`],starterCode:`import { GrowthBook } from "@growthbook/growthbook";

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

bootCartExperience("user-222");`},n=[t],r=[{id:`smart-upsell-variant`,level:2,title:`Smart Upsell Variant Selection`,description:'Advance to a more capable GrowthBook SDK integration for an upsell experiment. Initialize the SDK with less scaffold, attach an exposure tracking callback, and use `getFeatureValue("smart-upsell-variant", ...)` to choose which upsell variant to render.',constraints:[`Add Tracking Callback`,`Use getFeatureValue("smart-upsell-variant", ...)`,`Render Variant From SDK Value`],starterCode:`import { GrowthBook } from "@growthbook/growthbook";

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

bootUpsell({ id: "user-901", plan: "pro" });`},{id:`support-chat-config`,level:2,title:`Support Chat Config Delivery`,description:'Advance to a more capable GrowthBook SDK integration for a support experience rollout. Initialize the SDK with less scaffold and use `getFeatureValue("support-chat-config", ...)` to retrieve a config object that controls which support chat mode to render.',constraints:[`Use getFeatureValue("support-chat-config", ...)`,`Pass An Object Fallback`,`Render From Returned Config`],starterCode:`import { GrowthBook } from "@growthbook/growthbook";

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

bootSupportChat("user-654");`}],i={1:0,2:-1};function a(){let e=sessionStorage.getItem(`learner_token`);return e?.trim()?e.trim():(e=prompt(`Enter your Access Token:`),e?.trim()?(sessionStorage.setItem(`learner_token`,e.trim()),e.trim()):null)}var o=new class{async generateMission(t){let n=await fetch(`${e}/mission`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({token:t,level:s.level||1})}),r=await n.json();if(!n.ok)throw n.status===401?Error(`Invalid or expired access token.`):Error(r.error||`Exercise generation failed`);return r}async evaluateSubmission(t,n,r){let i=await fetch(`${e}/evaluate`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({token:t,level:r.level,code:n,scenario:{level:r.level,title:r.title,constraints:r.constraints,starterCode:r.starterCode}})}),a=await i.json();if(!i.ok)throw i.status===401?Error(`Invalid or expired access token.`):Error(a.error||`Evaluation failed`);return a}},s=n[0],c=document.getElementById(`submitBtn`),l=document.getElementById(`codeInput`),u=document.getElementById(`lineNumbers`),d=document.getElementById(`loadingStatus`),f=document.getElementById(`placeholderText`),p=document.getElementById(`resultCard`),m=document.getElementById(`nextScenario`),h=document.getElementById(`scenarioLevel`),g=document.getElementById(`scenarioTitle`),_=document.getElementById(`scenarioDesc`),v=document.getElementById(`constraintTags`),y=document.getElementById(`scoreDisplay`),b=document.getElementById(`statusBadge`),x=document.getElementById(`critiqueDisplay`),S=null;window.__sdkLabAppReady=!0;function C(){let e=Math.max(1,l.value.split(`
`).length);u.innerHTML=Array.from({length:e},(e,t)=>t+1).join(`<br>`),u.scrollTop=l.scrollTop}l.addEventListener(`input`,C),l.addEventListener(`scroll`,()=>{u.scrollTop=l.scrollTop});function w(e){return`Level ${e}`}function T(e){return e>=2?r:n}function E(e){let t=`${e.title} ${e.description} ${e.constraints.join(` `)} ${e.starterCode||``}`.toLowerCase(),n=[`growthbook`,`@growthbook/growthbook`,`ison(`,`getfeaturevalue(`,`settrackingcallback`,`trackingcallback`,`feature flag`,`sdk`],r=[`aws`,`gcp`,`azure`,`s3`,`cloudfront`,`iam`,`terraform`,`pulumi`,`bucket`,`kubernetes`,`web application`,`static website`],i=n.some(e=>t.includes(e)),a=r.some(e=>t.includes(e));return i&&!a}function D(e){return E(e)?e:P(e.level||1)}function O(e){let t=`${e.title} ${e.description} ${e.constraints.join(` `)}`,n=t.match(/isOn\(["`']([^"`']+)["`']\)/i);if(n)return n[1];let r=t.match(/["`']([a-z0-9-]+)["`']/i);return r?r[1]:`new-feature`}function k(e){let t=`${e.title} ${e.description}`.toLowerCase();return t.includes(`checkout`)?`Checkout`:t.includes(`pricing`)?`Pricing`:t.includes(`onboarding`)?`Onboarding`:t.includes(`banner`)?`Banner`:t.includes(`paywall`)?`Paywall`:`Experience`}function A(e){let t=O(e),n=k(e);return`import { GrowthBook } from "@growthbook/growthbook";

const growthbook = new GrowthBook({
  apiHost: "https://cdn.growthbook.io",
  clientKey: "sdk-abc123",
  enableDevMode: true,
});

async function bootExperience(userId: string) {
  // Exercise goal: ${e.description}
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

  const showNew${n} = growthbook._____("${t}");

  if (showNew${n}) {
    renderNew${n}();
  } else {
    renderClassic${n}();
  }
}

function renderNew${n}() {
  console.log("Render new ${n.toLowerCase()}");
}

function renderClassic${n}() {
  console.log("Render classic ${n.toLowerCase()}");
}

bootExperience("user-123");`}function j(e){let t=O(e),n=k(e);return`import { GrowthBook } from "@growthbook/growthbook";

const growthbook = new GrowthBook({
  apiHost: "https://cdn.growthbook.io",
  clientKey: "sdk-abc123",
  enableDevMode: true,
});

async function boot${n}(user: { id: string; plan: string }) {
  growthbook.setAttributes({
    id: user.id,
    plan: user.plan,
  });

  await growthbook.init({
    timeout: 1500,
    streaming: true,
  });

  const ${n.toLowerCase()}Config = growthbook._____("${t}", "control");
  render${n}(${n.toLowerCase()}Config);
}

function render${n}(value: string) {
  console.log("Render ${n.toLowerCase()}", value);
}

boot${n}({ id: "user-999", plan: "pro" });`}function M(e){return e.starterCode?.trim()?e.starterCode:e.level===1?A(e):e.level===2?j(e):``}function N(e){return e.replace(/growthbook\._{5}\(\s*\(/g,`growthbook.setTrackingCallback((`).replace(/growthbook\._{5}\(([^,\n]+),/g,`growthbook.getFeatureValue($1,`).replace(/growthbook\._{5}\(([^)\n]+)\)/g,`growthbook.isOn($1)`).replace(/country:\s*"___"/g,`country: "US"`).replace(/(paid|returningCustomer):\s*___/g,`$1: true`).replace(/timeout:\s*___/g,`timeout: 1500`).replace(/streaming:\s*___/g,`streaming: true`).replace(/cartOpened\s*=\s*___;/g,`cartOpened = true;`)}function P(e=1){let t=T(e),n=((i[e]??-1)+1)%t.length;return i[e]=n,t[n]}function F(e){h.textContent=w(e.level),g.textContent=e.title,_.textContent=e.description,v.innerHTML=e.constraints.map(e=>`<span class="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-[8px] font-black tracking-widest">${e}</span>`).join(``),p.classList.add(`hidden`),f.classList.remove(`hidden`),l.value=M(e),S=null,l.scrollTop=0,C(),window.__sdkLabSyncEditor?.()}async function I(){let e=a();if(!e){s=P(),F(s);return}m.disabled=!0,m.textContent=`Generating...`;try{s=D(await o.generateMission(e)),s.level??=1,F(s)}catch(e){alert(`Mission Error: ${e.message}`),sessionStorage.removeItem(`learner_token`),s=P(1),F(s)}finally{m.disabled=!1,m.textContent=`Generate New Exercise`}}async function L(){let e=l.value.trim();if(!e)return alert(`Please enter code.`);let t=a();if(t){p.classList.add(`hidden`),f.classList.add(`hidden`),d.classList.remove(`hidden`),c.disabled=!0;try{let n=await o.evaluateSubmission(t,e,s);y.textContent=n.score.toString(),b.textContent=n.status,b.className=`px-3 py-1 rounded-full text-[9px] font-black uppercase ${n.status===`Risk`?`bg-red-500/20 text-red-500`:n.status===`Partial`?`bg-yellow-500/20 text-yellow-500`:`bg-emerald-500/20 text-emerald-500`}`;let r=(e,t,n)=>{document.getElementById(e).style.width=`${n}%`,document.getElementById(t).textContent=`${n}%`};r(`secBar`,`secValue`,n.breakdown.security),r(`effBar`,`effValue`,n.breakdown.efficiency),r(`readBar`,`readValue`,n.breakdown.readability),x.textContent=n.critique,d.classList.add(`hidden`),p.classList.remove(`hidden`)}catch(e){d.classList.add(`hidden`),f.classList.remove(`hidden`),alert(`Coach Error: ${e.message}`),sessionStorage.removeItem(`learner_token`)}finally{c.disabled=!1}}}function R(e){if(!(e.ctrlKey&&e.altKey&&e.key.toLowerCase()===`x`))return;if(e.preventDefault(),S!==null){l.value=S,S=null,C(),window.__sdkLabSyncEditor?.();return}let t=N(l.value);t!==l.value&&(S=l.value,l.value=t,C(),window.__sdkLabSyncEditor?.())}c.addEventListener(`click`,L),m.addEventListener(`click`,I),l.addEventListener(`keydown`,R),F(t);