// background_ws_cdp_v2.js
// Listens to WebSocket frames via chrome.debugger (CDP) and forwards to content scripts.
// Adds robust logging + counters so we can see if frames are actually arriving.

const PROTOCOL_VERSION = "1.3";
const ATTACHED = new Map(); // tabId -> { attachedAt, frames, textFrames, binFrames, lastErr, lastSample }

function log(...args){ console.log("[IAA-CDP]", ...args); }

function setTabState(tabId, patch){
  const cur = ATTACHED.get(tabId) || { attachedAt: Date.now(), frames: 0, textFrames: 0, binFrames: 0, lastErr: null, lastSample: null };
  Object.assign(cur, patch);
  ATTACHED.set(tabId, cur);
  try { chrome.storage.session?.set?.({ ["iaa_cdp_"+tabId]: cur }); } catch {}
}

async function attachToTab(tabId){
  if (!tabId && tabId !== 0) return { ok:false, error:"no_tabId" };
  const key = Number(tabId);

  // Already attached?
  if (ATTACHED.has(key)) return { ok:true, already:true };

  try {
    await chrome.debugger.attach({ tabId: key }, PROTOCOL_VERSION);
    setTabState(key, { attachedAt: Date.now(), frames: 0, textFrames: 0, binFrames: 0, lastErr: null, lastSample: null });
    log("attached", key);

    // Enable Network domain
    await chrome.debugger.sendCommand({ tabId: key }, "Network.enable", {});
    // Some pages need Runtime enabled for completeness (harmless)
    try { await chrome.debugger.sendCommand({ tabId: key }, "Runtime.enable", {}); } catch {}

    // Tell content scripts we are attached
    try {
      chrome.tabs.sendMessage(key, { __iaaType: "IAA_CDP_STATUS", attached: true }, () => void chrome.runtime.lastError);
    } catch {}

    return { ok:true };
  } catch (e){
    const msg = String(e && (e.message || e) || e);
    log("attach failed", key, msg);
    setTabState(key, { lastErr: msg });
    return { ok:false, error: msg };
  }
}

function detachFromTab(tabId){
  const key = Number(tabId);
  try { chrome.debugger.detach({ tabId: key }); } catch {}
  ATTACHED.delete(key);
  try { chrome.tabs.sendMessage(key, { __iaaType:"IAA_CDP_STATUS", attached:false }, () => void chrome.runtime.lastError); } catch {}
  log("detached", key);
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.__iaaType === "IAA_CDP_ATTACH") {
    const tabId = sender?.tab?.id;
    attachToTab(tabId).then(sendResponse).catch(err => sendResponse({ ok:false, error:String(err) }));
    return true;
  }
  if (msg && msg.__iaaType === "IAA_CDP_DETACH") {
    const tabId = sender?.tab?.id;
    detachFromTab(tabId);
    sendResponse({ ok:true });
    return;
  }
  if (msg && msg.__iaaType === "IAA_CDP_PING") {
    sendResponse({ ok:true, tabs:[...ATTACHED.keys()] });
    return;
  }
});

// Forward WS frames
chrome.debugger.onEvent.addListener((source, method, params) => {
  const tabId = source?.tabId;
  if (typeof tabId !== "number") return;
  if (!ATTACHED.has(tabId)) return;

  if (method === "Network.webSocketFrameReceived") {
    const resp = params?.response;
    if (!resp) return;

    const opcode = resp.opcode; // 1 text, 2 binary
    const payloadData = resp.payloadData;

    const st = ATTACHED.get(tabId);
    const frames = (st.frames || 0) + 1;
    const textFrames = (st.textFrames || 0) + (opcode === 1 ? 1 : 0);
    const binFrames  = (st.binFrames  || 0) + (opcode === 2 ? 1 : 0);

    // Keep a tiny sample
    const sample = (typeof payloadData === "string" ? payloadData.slice(0, 220) : "");
    setTabState(tabId, { frames, textFrames, binFrames, lastSample: { opcode, sample, t: Date.now() } });

    // Push to content
    try {
      chrome.tabs.sendMessage(tabId, { __iaaType:"IAA_CDP_WS_FRAME", opcode, payloadData }, () => void chrome.runtime.lastError);
    } catch {}
    return;
  }

  if (method === "Inspector.detached") {
    setTabState(tabId, { lastErr: "detached" });
    ATTACHED.delete(tabId);
    try { chrome.tabs.sendMessage(tabId, { __iaaType:"IAA_CDP_STATUS", attached:false }, () => void chrome.runtime.lastError); } catch {}
    log("detached event", tabId);
    return;
  }
});

chrome.debugger.onDetach.addListener((source, reason) => {
  const tabId = source?.tabId;
  if (typeof tabId !== "number") return;
  setTabState(tabId, { lastErr: "onDetach:" + String(reason || "") });
  ATTACHED.delete(tabId);
  try { chrome.tabs.sendMessage(tabId, { __iaaType:"IAA_CDP_STATUS", attached:false, reason }, () => void chrome.runtime.lastError); } catch {}
  log("onDetach", tabId, reason);
});
