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

bootSupportChat("user-654");`}],i={1:0,2:-1};function a(){let e=sessionStorage.getItem(`learner_token`);return e?.trim()?e.trim():(e=prompt(`Enter your Access Token:`),e?.trim()?(sessionStorage.setItem(`learner_token`,e.trim()),e.trim()):null)}var o=new class{async generateMission(t,n){let r=await fetch(`${e}/mission`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({token:t,level:s.level||1,language:n})}),i=await r.json();if(!r.ok)throw r.status===401?Error(`Invalid or expired access token.`):Error(i.error||`Exercise generation failed`);return i}async evaluateSubmission(t,n,r,i){let a=await fetch(`${e}/evaluate`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({token:t,language:i,level:r.level,code:n,scenario:{level:r.level,title:r.title,constraints:r.constraints,starterCode:r.starterCode,language:i}})}),o=await a.json();if(!a.ok)throw a.status===401?Error(`Invalid or expired access token.`):Error(o.error||`Evaluation failed`);return o}},s=n[0],c=document.getElementById(`submitBtn`),l=document.getElementById(`codeInput`),u=document.getElementById(`lineNumbers`),d=document.getElementById(`loadingStatus`),f=document.getElementById(`placeholderText`),p=document.getElementById(`resultCard`),m=document.getElementById(`nextScenario`),h=Array.from(document.querySelectorAll(`[data-sdk-language]`)),g=document.getElementById(`scenarioLevel`),_=document.getElementById(`scenarioTitle`),v=document.getElementById(`scenarioDesc`),y=document.getElementById(`constraintTags`),b=document.getElementById(`scoreDisplay`),x=document.getElementById(`statusBadge`),S=document.getElementById(`critiqueDisplay`),C=document.getElementById(`sdkLabel`),w=null,T=`javascript`;window.__sdkLabAppReady=!0;function E(){let e=Math.max(1,l.value.split(`
`).length);u.innerHTML=Array.from({length:e},(e,t)=>t+1).join(`<br>`),u.scrollTop=l.scrollTop}l.addEventListener(`input`,E),l.addEventListener(`scroll`,()=>{u.scrollTop=l.scrollTop});function D(e){return`Level ${e}`}function O(){return T}function k(e){return e===`ios`?`iOS`:e===`python`?`Python`:`JavaScript`}function A(e){return e===`python`?`growthbook Python SDK`:e===`ios`?`GrowthBook Swift SDK for iOS`:`GrowthBook JavaScript SDK`}function j(e){return e===`python`?`Python app`:e===`ios`?`iOS app`:`JavaScript app`}function M(e,t){let n=A(t),r=j(t),i=e.replace(/growthbook Python SDK|GrowthBook (?:JavaScript|Python|Swift|iOS Swift) SDK(?: for iOS)?/gi,n).replace(/\bfrontend or full-stack JavaScript app\b/gi,r).replace(/\bJavaScript app\b/gi,r).replace(/\bPython app\b/gi,r).replace(/\biOS app\b/gi,r);return i=t===`python`?i.replace(/\bisOn\(/g,`is_on(`).replace(/\bgetFeatureValue\(/g,`get_feature_value(`).replace(/\bsetAttributes\(/g,`set_attributes(`):t===`ios`?i.replace(/\bisOn\((["`'])/g,`isOn(feature: $1`).replace(/\bgetFeatureValue\((["`'])/g,`getFeatureValue(feature: $1`).replace(/\bsetAttributes\(\.\.\.\)/g,`GrowthBookBuilder attributes`):i.replace(/\bis_on\(/g,`isOn(`).replace(/\bget_feature_value\(/g,`getFeatureValue(`).replace(/\bGrowthBookBuilder attributes\b/g,`setAttributes(...)`),i}function N(e){return e===`python`||e===`ios`?e:`javascript`}function P(e){for(let t of h){let n=t.dataset.sdkLanguage===e;t.className=n?`sdk-language-tab border border-blue-500 bg-blue-500/10 text-blue-300 rounded-xl px-3 py-2 text-left text-[9px] font-black uppercase tracking-widest transition-all`:`sdk-language-tab border border-slate-800 bg-black/30 text-slate-500 hover:text-slate-300 hover:border-slate-700 rounded-xl px-3 py-2 text-left text-[9px] font-black uppercase tracking-widest transition-all`,t.setAttribute(`aria-selected`,String(n))}}function F(e){return e>=2?r:n}function I(e){let t=`${e.title} ${e.description} ${e.constraints.join(` `)} ${e.starterCode||``}`.toLowerCase(),n=[`growthbook`,`@growthbook/growthbook`,`ison(`,`getfeaturevalue(`,`settrackingcallback`,`trackingcallback`,`feature flag`,`sdk`],r=[`aws`,`gcp`,`azure`,`s3`,`cloudfront`,`iam`,`terraform`,`pulumi`,`bucket`,`kubernetes`,`web application`,`static website`],i=n.some(e=>t.includes(e)),a=r.some(e=>t.includes(e));return i&&!a}function L(e){return I(e)?e:Y(e.level||1)}function R(e){let t=`${e.title} ${e.description} ${e.constraints.join(` `)}`,n=t.match(/isOn\(["`']([^"`']+)["`']\)/i);if(n)return n[1];let r=t.match(/["`']([a-z0-9-]+)["`']/i);return r?r[1]:`new-feature`}function z(e){let t=`${e.title} ${e.description}`.toLowerCase();return t.includes(`checkout`)?`Checkout`:t.includes(`pricing`)?`Pricing`:t.includes(`onboarding`)?`Onboarding`:t.includes(`banner`)?`Banner`:t.includes(`paywall`)?`Paywall`:`Experience`}function B(e){let t=R(e),n=z(e);return`import { GrowthBook } from "@growthbook/growthbook";

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

bootExperience("user-123");`}function V(e){let t=R(e),n=z(e);return`import { GrowthBook } from "@growthbook/growthbook";

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

boot${n}({ id: "user-999", plan: "pro" });`}function H(e){let t=R(e),n=z(e);return`from growthbook import GrowthBook


def boot_experience(user_id):
    # Exercise goal: ${e.description}
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

    is_enabled = gb._____("${t}")

    if is_enabled:
        render_new_${n.toLowerCase()}()
    else:
        render_classic_${n.toLowerCase()}()


def render_new_${n.toLowerCase()}():
    print("Render new ${n.toLowerCase()}")


def render_classic_${n.toLowerCase()}():
    print("Render classic ${n.toLowerCase()}")


boot_experience("user-123")`}function U(e){let t=R(e),n=z(e).toLowerCase();return`from growthbook import GrowthBook


def on_experiment_viewed(experiment, result):
    print("Experiment Viewed", {
        "experimentId": experiment.key,
        "variationId": result.key,
    })


def boot_${n}(user):
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

    ${n}_config = gb._____("${t}", "control")
    render_${n}(${n}_config)


def render_${n}(value):
    print("Render ${n}", value)


boot_${n}({"id": "user-999", "plan": "pro"})`}function W(e){let t=R(e),n=z(e);return`import Foundation
import GrowthBook

final class ${n}Controller {
    func bootExperience(userId: String) {
        // Exercise goal: ${e.description}
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

        let isEnabled = gb._____(feature: "${t}")

        if isEnabled {
            renderNew${n}()
        } else {
            renderClassic${n}()
        }
    }

    private func renderNew${n}() {
        print("Render new ${n.toLowerCase()}")
    }

    private func renderClassic${n}() {
        print("Render classic ${n.toLowerCase()}")
    }
}

${n}Controller().bootExperience(userId: "user-123")`}function G(e){let t=R(e),n=z(e),r=n.charAt(0).toLowerCase()+n.slice(1);return`import Foundation
import GrowthBook

final class ${n}Controller {
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
        let ${r}Config = gb._____(feature: "${t}", defaultValue: JSON("control"))
        render${n}(value: ${r}Config)
    }

    private func render${n}(value: JSON) {
        print("Render ${n.toLowerCase()}", value)
    }
}

${n}Controller(userId: "user-999", plan: "pro").render()`}function K(e,t){let n=e.toLowerCase();return t===`python`?n.includes(`from growthbook import`)||n.includes(`gb.load_features`)||n.includes(`def `):t===`ios`?n.includes(`growthbookbuilder`)||n.includes(`growthbooksdk`)||n.includes(`ison(feature:`):n.includes(`@growthbook/growthbook`)||n.includes(`new growthbook`)||n.includes(`growthbook.`)}function q(e,t){if(e.starterCode?.trim()&&K(e.starterCode,t))return e.starterCode;if(t===`python`){if(e.level===1)return H(e);if(e.level===2)return U(e)}if(t===`ios`){if(e.level===1)return W(e);if(e.level===2)return G(e)}return e.level===1?B(e):e.level===2?V(e):``}function J(e){return e.replace(/growthbook\._{5}\(\s*\(/g,`growthbook.setTrackingCallback((`).replace(/growthbook\._{5}\(([^,\n]+),/g,`growthbook.getFeatureValue($1,`).replace(/growthbook\._{5}\(([^)\n]+)\)/g,`growthbook.isOn($1)`).replace(/growthBook\?\._{5}\(feature:/g,`growthBook?.isOn(feature:`).replace(/growthBook\._{5}\(feature:([^,\n]+),\s*defaultValue:/g,`growthBook.getFeatureValue(feature:$1, defaultValue:`).replace(/gb\._{5}\(feature:([^,\n]+),\s*defaultValue:/g,`gb.getFeatureValue(feature:$1, defaultValue:`).replace(/gb\._{5}\(feature:/g,`gb.isOn(feature:`).replace(/gb\._{5}\(([^,\n]+),/g,`gb.get_feature_value($1,`).replace(/gb\._{5}\(([^)\n]+)\)/g,`gb.is_on($1)`).replace(/country:\s*"___"/g,`country: "US"`).replace(/"country":\s*"___"/g,`"country": "US"`).replace(/(paid|returningCustomer):\s*___/g,`$1: true`).replace(/"(paid|returning_customer)":\s*___/g,`"$1": True`).replace(/timeout:\s*___/g,`timeout: 1500`).replace(/streaming:\s*___/g,`streaming: true`).replace(/backgroundSync:\s*___/g,`backgroundSync: false`).replace(/cache_ttl=___/g,`cache_ttl=60`).replace(/cartOpened\s*=\s*___;/g,`cartOpened = true;`)}function Y(e=1){let t=F(e),n=((i[e]??-1)+1)%t.length;return i[e]=n,t[n]}function X(e){let t=O(),n=k(t);s={...e,language:t},g.textContent=D(s.level),_.textContent=s.title,v.textContent=M(s.description,t),y.innerHTML=s.constraints.map(e=>`<span class="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-[8px] font-black tracking-widest">${e}</span>`).join(``),p.classList.add(`hidden`),f.classList.remove(`hidden`),l.placeholder=`// Fill in the missing GrowthBook ${n} SDK code...`,C&&(C.textContent=`GrowthBook ${n} SDK`),P(t),l.value=q(s,t),w=null,l.scrollTop=0,E(),window.__sdkLabSyncEditor?.()}async function Z(){let e=a();if(!e){s=Y(),X(s);return}m.disabled=!0,m.textContent=`Generating...`;try{s=L(await o.generateMission(e,O())),s.level??=1,X(s)}catch(e){alert(`Mission Error: ${e.message}`),sessionStorage.removeItem(`learner_token`),s=Y(1),X(s)}finally{m.disabled=!1,m.textContent=`Generate New Exercise`}}async function Q(){let e=l.value.trim();if(!e)return alert(`Please enter code.`);let t=a();if(t){p.classList.add(`hidden`),f.classList.add(`hidden`),d.classList.remove(`hidden`),c.disabled=!0;try{let n=await o.evaluateSubmission(t,e,s,O());b.textContent=n.score.toString(),x.textContent=n.status,x.className=`px-3 py-1 rounded-full text-[9px] font-black uppercase ${n.status===`Risk`?`bg-red-500/20 text-red-500`:n.status===`Partial`?`bg-yellow-500/20 text-yellow-500`:`bg-emerald-500/20 text-emerald-500`}`;let r=(e,t,n)=>{document.getElementById(e).style.width=`${n}%`,document.getElementById(t).textContent=`${n}%`};r(`secBar`,`secValue`,n.breakdown.security),r(`effBar`,`effValue`,n.breakdown.efficiency),r(`readBar`,`readValue`,n.breakdown.readability),S.textContent=n.critique,d.classList.add(`hidden`),p.classList.remove(`hidden`)}catch(e){d.classList.add(`hidden`),f.classList.remove(`hidden`),alert(`Coach Error: ${e.message}`),sessionStorage.removeItem(`learner_token`)}finally{c.disabled=!1}}}function $(e){if(!(e.ctrlKey&&e.altKey&&e.key.toLowerCase()===`x`))return;if(e.preventDefault(),w!==null){l.value=w,w=null,E(),window.__sdkLabSyncEditor?.();return}let t=J(l.value);t!==l.value&&(w=l.value,l.value=t,E(),window.__sdkLabSyncEditor?.())}c.addEventListener(`click`,Q),m.addEventListener(`click`,Z);for(let e of h)e.addEventListener(`click`,()=>{let t=N(e.dataset.sdkLanguage);t!==T&&(T=t,X(s))});l.addEventListener(`keydown`,$),X(t);