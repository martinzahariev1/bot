(() => {
  'use strict';

  /* ========================= AUTH / LOGIN ========================= */
  const LOGIN_SHELL_ID = 'iaa-login-shell';
  const SESSION_KEY = 'IAA_AUTH_SESSION';
  const SESSION_TTL_MS = 12 * 60 * 60 * 1000;
  const WL_URL = "https://raw.githubusercontent.com/Karimmw/Codes/refs/heads/main/iaa_whitelist.txt";

  // persisted settings keys
  const BASE_AMOUNT_KEY = 'IAA_BASE_AMOUNT_CENTS';
  const L1_ON_KEY = 'IAA_L1_ON';
  const L2_ON_KEY = 'IAA_L2_ON';
  const L1_MULT_KEY = 'IAA_L1_MULT';
  const L2_MULT_KEY = 'IAA_L2_MULT';
  const EXPIRY_KEY   = 'IAA_EXPIRY';
  const KEEP_ALIVE_KEY = 'IAA_KEEP_ALIVE';
  const FORCE_ASSET_SELECT_KEY = 'IAA_FORCE_ASSET_SELECT';
  const SIGNAL_SOURCE_1M_KEY = 'IAA_SIGNAL_SOURCE_1M';
  const SIGNAL_SOURCE_5M_KEY = 'IAA_SIGNAL_SOURCE_5M';
  const SIGNAL_TIME_OFFSET_MIN_KEY = 'IAA_SIGNAL_TIME_OFFSET_MIN';
  const EXPIRY_COORDS_KEY = 'IAA_EXPIRY_COORDS';
  const MAX_SESSION_LOSS_KEY = 'IAA_MAX_SESSION_LOSS_CENTS';
  const MAX_CONSECUTIVE_LOSSES_KEY = 'IAA_MAX_CONSECUTIVE_LOSSES';
  const ANALYSIS_ENABLED_KEY = 'IAA_ANALYSIS_ENABLED';
  const ANALYSIS_CONFIDENCE_KEY = 'IAA_ANALYSIS_CONFIDENCE';
  const TRADE_INTERVAL_MIN_KEY = 'IAA_TRADE_INTERVAL_MIN';
  const PAYOUT_MIN_KEY = 'IAA_PAYOUT_MIN';
  const PAYOUT_MAX_KEY = 'IAA_PAYOUT_MAX';
  const PAYOUT_REQUIRED_KEY = 'IAA_PAYOUT_REQUIRED';
  const MAX_TRADE_AMOUNT_KEY = 'IAA_MAX_TRADE_AMOUNT_CENTS';
  const MAX_TRADE_MULTIPLIER_KEY = 'IAA_MAX_TRADE_MULTIPLIER';
  const ANALYSIS_WINDOW_SEC_KEY = 'IAA_ANALYSIS_WINDOW_SEC';
  const ANALYSIS_WARMUP_MIN_KEY = 'IAA_ANALYSIS_WARMUP_MIN';
  const SELF_TRADE_ENABLED_KEY = 'IAA_SELF_TRADE_ENABLED';
  const REVERSAL_WINDOW_SEC_KEY = 'IAA_REVERSAL_WINDOW_SEC';
  const REVERSAL_OPPOSITE_RATIO_KEY = 'IAA_REVERSAL_OPPOSITE_RATIO';
  const PANEL_OPACITY_KEY = 'IAA_PANEL_OPACITY';
  const COUNTDOWN_BEEP_KEY = 'IAA_COUNTDOWN_BEEP';
  const BURST_ENABLED_KEY = 'IAA_BURST_ENABLED';
  const BURST_COUNT_KEY = 'IAA_BURST_COUNT';
  const BURST_CONFIDENCE_KEY = 'IAA_BURST_CONFIDENCE';
  const MODE_KEY = 'IAA_MODE';
  const SNIPER_BASE_AMOUNT_KEY = 'IAA_SNIPER_BASE_AMOUNT_CENTS';
  const SNIPER_THRESHOLD_KEY = 'IAA_SNIPER_THRESHOLD';
  const SNIPER_MIN_PAYOUT_KEY = 'IAA_SNIPER_MIN_PAYOUT';
  const SNIPER_ENTRY_WINDOW_SEC_KEY = 'IAA_SNIPER_ENTRY_WINDOW_SEC';
  const SNIPER_WARMUP_MIN_KEY = 'IAA_SNIPER_WARMUP_MIN';
  const SNIPER_VWAP_DEV_KEY = 'IAA_SNIPER_VWAP_DEV';
  const SNIPER_MOMENTUM_KEY = 'IAA_SNIPER_MOMENTUM';
  const SNIPER_CHOP_KEY = 'IAA_SNIPER_CHOP';
  const SNIPER_TFS_KEY = 'IAA_SNIPER_TFS';
  const SNIPER_KEEP_ALIVE_KEY = 'IAA_SNIPER_KEEP_ALIVE';
  const SNIPER_PROFILE_KEY = 'IAA_SNIPER_PROFILE';
  const SNIPER_PRO_BASE_AMOUNT_KEY = 'IAA_SNIPER_PRO_BASE_AMOUNT_CENTS';
  const SNIPER_PRO_SCORE_THRESHOLD_KEY = 'IAA_SNIPER_PRO_SCORE_THRESHOLD';
  const SNIPER_PRO_RISK_RATIO_KEY = 'IAA_SNIPER_PRO_RISK_RATIO';
  const SNIPER_PRO_RISK_PREMIUM_KEY = 'IAA_SNIPER_PRO_RISK_PREMIUM';
  const SNIPER_PRO_TREND_BIAS_KEY = 'IAA_SNIPER_PRO_TREND_BIAS';
  const SNIPER_PRO_MOMENTUM_GATE_KEY = 'IAA_SNIPER_PRO_MOMENTUM_GATE';
  const SNIPER_PRO_COOLDOWN_MIN_KEY = 'IAA_SNIPER_PRO_COOLDOWN_MIN';
  const SNIPER_PRO_W_VWAP_KEY = 'IAA_SNIPER_PRO_W_VWAP';
  const SNIPER_PRO_W_MOMENTUM_KEY = 'IAA_SNIPER_PRO_W_MOMENTUM';
  const SNIPER_PRO_W_TREND_KEY = 'IAA_SNIPER_PRO_W_TREND';
  const SNIPER_PRO_W_RSI_KEY = 'IAA_SNIPER_PRO_W_RSI';
  const SNIPER_PRO_W_STOCH_KEY = 'IAA_SNIPER_PRO_W_STOCH';
  const SNIPER_PRO_W_EMA_KEY = 'IAA_SNIPER_PRO_W_EMA';
  const SNIPER_PRO_W_VOLUME_KEY = 'IAA_SNIPER_PRO_W_VOLUME';
  const SNIPER_PRO_W_SHARPE_KEY = 'IAA_SNIPER_PRO_W_SHARPE';
  const SNIPER_PRO_BURST_ENABLED_KEY = 'IAA_SNIPER_PRO_BURST_ENABLED';
  const SNIPER_PRO_BURST_CONFIDENCE_KEY = 'IAA_SNIPER_PRO_BURST_CONFIDENCE';
  const SNIPER_PRO_BURST_COUNT_KEY = 'IAA_SNIPER_PRO_BURST_COUNT';
  const SNIPER_PRO_DEFAULTS = {
    baseAmountCents: 10000,
    threshold: 0.6,
    minPayout: 80,
    entryWindowSec: 3,
    warmupMin: 15,
    vwapDeviation: 0.001,
    momentumThreshold: 0.0016,
    chopThreshold: 0.0012,
    rsiOversold: 25,
    rsiOverbought: 75,
    rsiWindow: 14,
    emaFast: 6,
    emaSlow: 24,
    stochOversold: 25,
    stochOverbought: 75,
    stochWindow: 14,
    volumeThreshold: 0.3,
    sharpeWindowMin: 8,
    timeframes: { '5s': true, '15s': true, '30s': true, '1m': true }
  };
  const SNIPER_5S_DEFAULTS = {
    baseAmountCents: 10000,
    threshold: 0.45,
    minPayout: 70,
    entryWindowSec: 5,
    warmupMin: 6,
    vwapDeviation: 0.0012,
    momentumThreshold: 0.0014,
    chopThreshold: 0.001,
    rsiOversold: 22,
    rsiOverbought: 78,
    rsiWindow: 10,
    emaFast: 4,
    emaSlow: 16,
    stochOversold: 22,
    stochOverbought: 78,
    stochWindow: 10,
    volumeThreshold: 0.25,
    sharpeWindowMin: 4,
    timeframes: { '5s': true, '15s': true, '30s': true, '1m': false }
  };
  const SNIPER_PRO_SETTINGS_DEFAULTS = {
    scoreThreshold: 0.55,
    riskRatio: 0.25,
    riskPremium: 0.08,
    trendBias: 0.15,
    momentumGate: 0.2,
    cooldownMin: 2,
    burstEnabled: false,
    burstConfidence: 0.85,
    burstCount: 3,
    weights: {
      vwap: 0.3,
      momentum: 0.25,
      trend: 0.15,
      rsi: 0,
      stoch: 0,
      ema: 0,
      volume: 0,
      sharpe: 0
    }
  };

  // persisted mouse mapping keys
  const BUY_SELL_METHOD_KEY = 'IAA_BUY_SELL_METHOD_V1';
  const XPATH_SELECTORS_KEY = 'IAA_XPATH_SELECTORS_V1';

  async function checkCredentialsText(pass, acct) {
    try {
      const resp = await fetch(WL_URL, { cache: "no-cache" });
      if (!resp.ok) throw new Error("fetch_failed");
      const text = await resp.text();
      const lines = text.split(/\r?\n/).map(s => s.trim()).filter(s => s && !s.startsWith("#"));
      if (lines.length < 1) throw new Error("bad_format");
      const globalPass = lines[0];
      const idSet = new Set(lines.slice(1));
      return pass === globalPass && idSet.has((acct || "").trim());
    } catch { return false; }
  }

  const storage = {
    async get(k) { try { return (await chrome.storage?.local?.get(k))[k]; } catch { return undefined; } },
    async set(k, v) { try { return await chrome.storage?.local?.set({ [k]: v }); } catch {} },
    async del(k) { try { return await chrome.storage?.local?.remove(k); } catch {} }
  };

  async function getSession() {
    const s = await storage.get(SESSION_KEY);
    if (!s || !s.ok || !s.ts) return null;
    if (Date.now() - s.ts > (s.ttl ?? SESSION_TTL_MS)) return null;
    return s;
  }
  async function setSession(ok) { await storage.set(SESSION_KEY, ok ? { ok: true, ts: Date.now(), ttl: SESSION_TTL_MS } : { ok: false, ts: Date.now(), ttl: 0 }); }
  async function clearSession() { await storage.del(SESSION_KEY); }

  function injectLoginPanel() {
    if (document.getElementById(LOGIN_SHELL_ID)) return;
    const css = `
      #${LOGIN_SHELL_ID}{position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.6)}
      .iaa-login-card{width:360px;max-width:92vw;border-radius:16px;padding:16px;background:#0f1115;border:1px solid rgba(255,255,255,.08);color:#fff;font-family:system-ui,Arial}
      .iaa-login-logo-wrap{display:flex;align-items:center;justify-content:center;margin-top:6px}
      .iaa-login-logo{width:140px;height:140px;border-radius:12px;object-fit:cover}
      #heading{text-align:center;margin:.8em 0 .6em;color:#fff;font-size:1.05em}
      .form{display:flex;flex-direction:column;gap:10px;padding:0 2em .4em;background:#171717;border-radius:25px}
      .field{display:flex;align-items:center;gap:.5em;border-radius:25px;padding:.6em;color:#fff;background:#171717;box-shadow:inset 2px 5px 10px rgb(5 5 5)}
      .input-field{background:none;border:none;outline:none;width:100%;color:#d3d3d3}
      .btn{display:flex;justify-content:center;gap:8px;margin-top:1.4em}
      .button{padding:.5em 1.2em;border-radius:6px;border:none;background:#252525;color:#fff;cursor:pointer}
      .button:hover{background:#000}
      .iaa-err{color:#f87171;font-size:12px;text-align:center;margin-top:8px;min-height:16px}
      .iaa-hidden{display:none!important}
    `;
    const style = document.createElement('style'); style.textContent = css; document.documentElement.appendChild(style);

    const shell = document.createElement('div'); shell.id = LOGIN_SHELL_ID;
    const card = document.createElement('div'); card.className = 'iaa-login-card';
    card.innerHTML = `
      <div class="iaa-login-logo-wrap"><img id="iaa-login-logo" class="iaa-login-logo" alt="∞ Infinity AI"/></div>
      <div id="heading">ВХОД</div>
      <div class="form">
        <div class="field"><input id="iaa-pass" class="input-field" type="password" placeholder="Password" autocomplete="current-password"></div>
        <div class="field"><input id="iaa-uid" class="input-field" type="text" placeholder="PocketOption ID" autocomplete="username"></div>
        <div class="btn"><button id="iaa-login-btn" class="button">ВХОД</button></div>
        <div id="iaa-err" class="iaa-err"></div>
      </div>`;
    shell.appendChild(card); document.documentElement.appendChild(shell);

    const logo = card.querySelector('#iaa-login-logo');
    try { logo.src = chrome.runtime.getURL('logo.png'); } catch { logo.src = 'logo.png'; }
    logo.onerror = () => { logo.src = 'https://i.ibb.co/M5Skh64X/logo.png'; };

    const btnLogin = card.querySelector('#iaa-login-btn');
    const inputPass = card.querySelector('#iaa-pass');
    const inputUid = card.querySelector('#iaa-uid');
    const elErr = card.querySelector('#iaa-err');

    let busy = false;
    btnLogin.addEventListener('click', async () => {
      if (busy) return; elErr.textContent = '';
      const pass = (inputPass.value || '').trim();
      const acct = (inputUid.value || '').trim();
      if (!pass || !acct) { elErr.textContent = 'Please enter Password AND PocketOption ID.'; return; }
      busy = true; btnLogin.disabled = true; btnLogin.textContent = 'Проверка…';
      try {
        const ok = await checkCredentialsText(pass, acct);
        if (ok) { await setSession(true); shell.classList.add('iaa-hidden'); window.InfinityBot?.boot(); window.InfinityBot?.logConsole?.(window.InfinityBot?.formatStatus?.('login_accepted') || 'Login accepted.'); }
        else { await clearSession(); elErr.textContent = 'Access denied. Check your credentials.'; window.InfinityBot?.logConsole?.(window.InfinityBot?.formatStatus?.('login_denied') || 'Login denied.'); }
      } finally { busy = false; btnLogin.disabled = false; btnLogin.textContent = 'ВХОД'; }
    });
  }

  /* ============================== BOT CORE ============================== */
  window.InfinityBot = (() => {
    if (window.__IAA_SINGLETON__) return window.__IAA_SINGLETON__;
    const api = {}; window.__IAA_SINGLETON__ = api;

    /* ------------------------------ CONFIG ------------------------------ */
    const C = {
      PANEL_ID: 'infinity-ai-agent-shell',
      LOGO_LOCAL: 'logo.png',
      LOGO_FALLBACK: 'https://i.ibb.co/M5Skh64X/logo.png',
      FPS: 10,

      // Telegram API URL
      SIGNAL_SOURCES: [
        { key: '1m', url: 'https://telegram-api-channel-karimmw6699.replit.app/api/raw', expiryOverride: '1M', label: '1m' },
        { key: '5m', url: 'https://t.me/s/INFINITY_AI_Pro', expiryOverride: '5M', label: '5m' }
      ],
      SIGNAL_POLL_MS: 3000,
      SIGNAL_FRESH_SEC: 15,

      // XPath selectors with multiple fallbacks
      XPATH_SELECTORS: {
        assetDropdown: [
          '//*[@id="bar-chart"]/div/div/div/div/div[1]/div[1]/div[1]/div/a/div/span',
          '//*[contains(@class, "currencies-block")]//a//span',
          '//*[contains(text(), "Select Asset") or contains(text(), "Currency")]',
          '//a[contains(@class, "dropdown")]//span'
        ],
        searchInput: [
          '//*[@id="modal-root"]/div/div/div/div[2]/div[1]/div[1]/input',
          '//input[contains(@placeholder, "Search") or contains(@placeholder, "search")]',
          '//*[contains(@class, "search")]//input',
          '//input[@type="search"]'
        ],
        otcAssetResult: [
          '//*[@id="modal-root"]/div/div/div/div[2]/div[2]/div/div/div[1]/ul/li[1]/a',
          '//li[1]//a[contains(text(), "OTC") or contains(@class, "otc")]',
          '(//ul//li//a)[1]',
          '//*[contains(text(), "OTC")][1]'
        ],
        realAssetResult: [
          '//*[@id="modal-root"]/div/div/div/div[2]/div[2]/div/div/div[1]/ul/li[2]',
          '//li[2]//a[not(contains(text(), "OTC"))]',
          '(//ul//li//a)[2]',
          '//*[contains(text(), "Real")][1]'
        ],
        closePanel: [
          '//*[@id="modal-root"]/div/div/div/div[1]/button',
          '//button[contains(@class, "close")]',
          '//*[contains(text(), "×") or contains(text(), "Close")]',
          '//button[contains(@aria-label, "close")]'
        ],
        buyButton: [
          '//*[@id="put-call-buttons-chart-1"]/div/div[2]/div[2]/div[1]/a/span/span/span',
          '//a[contains(@class, "call") or contains(@class, "buy")]//span',
          '//*[contains(text(), "BUY") or contains(text(), "CALL")]',
          '//button[contains(@data-test, "call")]',
          '//*[contains(@class, "button-call-wrap")]//a'
        ],
        sellButton: [
          '//*[@id="put-call-buttons-chart-1"]/div/div[2]/div[2]/div[2]/a/span/span/span',
          '//a[contains(@class, "put") or contains(@class, "sell")]//span',
          '//*[contains(text(), "SELL") or contains(text(), "PUT")]',
          '//button[contains(@data-test, "put")]',
          '//*[contains(@class, "button-put-wrap")]//a'
        ]
      },

      // CSS selectors as fallbacks
      BUY_SELECTORS: [
        '#put-call-buttons-chart-1 .action-high-low.button-call-wrap a',
        '[data-test="button-call"]',
        '.button-call-wrap a, .call-button, button[title*="Call" i], button[aria-label*="Call" i]'
      ],
      SELL_SELECTORS: [
        '#put-call-buttons-chart-1 .action-high-low.button-put-wrap a',
        '[data-test="button-put"]',
        '.button-put-wrap a, .put-button, button[title*="Put" i], button[aria-label*="Put" i]'
      ],

      AMOUNT_SELECTOR: '#put-call-buttons-chart-1 input[type=text]',
      ALT_AMOUNT_SELECTORS: [
        'input[type="text"][inputmode="decimal"]',
        'input[type="text"][name*="amount" i]',
        'input[aria-label*="amount" i]',
      ],
      ASSET_DROPDOWN_SELECTOR: '#bar-chart .top-left-block__block1 .currencies-block a i',
      ASSET_SEARCH_INPUT_SELECTOR: '#modal-root .filters__search-block.search input',

      ASSET_VERIFICATION_SELECTORS: [
        '#bar-chart > div > div > div > div > div.top-left-block > div.top-left-block__block1 > div.currencies-block > div > a > div > span',
        '#bar-chart > div > div > div > div > div.top-left-block > div.top-left-block__block1 > div.currencies-block > div > a > div',
        '.currencies-block a div span',
        '.top-left-block__block1 .currencies-block div a div',
        '[class*="currency"] span',
        '[class*="pair"] span',
        '.currencies-block a',
        '.top-left-block__block1 .currencies-block'
      ],

      // Balance selectors
      BALANCE_DEMO_SELECTOR: 'span.js-balance-demo',
      BALANCE_REAL_SELECTOR: 'span[class*="js-balance-real-"]',
      ACCOUNT_TYPE_SELECTOR: '.balance-info-block__label',
      PAYOUT_SELECTORS: [
        '[data-test="payout"]',
        '[data-test="profit-percent"]',
        '.payout',
        '.profit-percent',
        '.payout-percent',
        '.payout__percent',
        '.rate-block__percent',
        '.payout-value'
      ],

      // default coordinates
      COORD_ROW_OTC:  { x: 445, y: 300 },
      COORD_ROW_SPOT: { x: 445, y: 300 },
      COORD_CLOSE:    { x: 760, y:  20 },
      COORD_BUY:      { x: 700, y: 500 },
      COORD_SELL:     { x: 800, y: 500 },

      // timings
      EARLY_FIRE_MS: 1000,
      LATE_TOL_MS: 1000,
      MAX_QUEUE: 50,
      DEDUPE_WINDOW_MIN: 5,
      SETTLEMENT_DELAY_MS: 2000,
      BAL_DELTA_THRESH_CENTS: 5,
      SETTLEMENT_POLL_MS: 100,
      SETTLEMENT_POLL_MAX: 10,

      // Price monitoring interval
      PRICE_MONITOR_INTERVAL_MS: 100,

      ASSET_CLICK_DELAYS: {
        OPEN_DROPDOWN: 800,
        FOCUS_SEARCH: 800,
        TYPE_QUERY: 800,
        CLICK_ROW: 3000,
        CLOSE_PANEL: 800,
        VERIFICATION: 1000
      },

      KEEP_ALIVE_INTERVAL_MS: 45000,
      KEEP_ALIVE_ACTION_MS: 5000,
      CYCLE_TIMEOUT_MULTIPLIER: 4.0,
      MAX_ASSET_SELECTION_ATTEMPTS: 3,
      MAX_EXECUTION_ATTEMPTS: 2
    };

    /* ------------------------------ STATE ------------------------------ */
    const S = {
      running:false, loop:null,
      lastPrice:null, priceHistory:[],
      lastPriceAt: 0,
      lastAssetLabel: null,
      lastAssetLabelNormalized: null,
      sniperFastWarmupUntil: 0,
      activeTrades: [], tradeLockUntil:0, tradeCount:0,
      autoTrade:true,
      mode: 'signals',

      // money
      currentAmount:null, baseAmount:null, martingaleSequence:0, tradeProfitLoss:0, balance:0,
      l1Active:false, l2Active:false, l1Multiplier:2, l2Multiplier:4,
      lastTradeOutcome:null, botStartTime:0, expirySetting:'1M',
      botStartBalance: null,
      forceAssetSelect: false,

      // signal intake
      currentSignal:null, tradeSequenceActive:false,
      assetSelecting:false, assetSelectedForSignal:false,

      // snapshot mode
      signalBuffer: [],
      dedupeSeen: new Map(),
      processedSignals: new Set(),
      lastSignalPollAt: 0,
      lastProcessedSignalHashes: new Map(),

      // execution guards
      executing:false,
      executionAttempts: 0,
      lastExecutedKey:null,
      hasLiveSignal:false,
      forceImmediate:false,

      // Cycle manager
      cycleActive: false,
      cycleStep: 0,
      cycleBaseSignal: null,
      cycleStartTime: 0,
      cycleTimeoutId: null,
      cycleStartBalance: null,
      cycleEndBalance: null,

      // balance observer
      balObs: null,
      balanceBeforeTrade: null,
      balanceSignalBaseline: null,

      // selection guards
      assetSelectionAttempted: false,

      // finalize guard
      finalizedTradeId: null,

      // outcome gating
      tradeOutcomeChecked: false,

      // Price tracking
      lastTradeEntryPrice: null,
      currentAssetPrice: null,
      tradeEntryPrice: null,
      tradeExitPrice: null,
      priceMonitorInterval: null,

      /* ---------- Mouse mapping / calibration ---------- */
      mousePanelOpen: false,
      settingsPanelOpen: false,
      mouseLogs: [],

      // XPath selectors
      xpathSelectors: C.XPATH_SELECTORS,

      // Buy/Sell method
      buySellMethod: 'xpath',

      // Keep alive
      keepAliveEnabled: false,
      keepAliveInterval: null,
      keepAliveActive: false,
      sniperKeepAliveEnabled: false,
      lastPlatformExpiry: null,

      // trade log
      trades: [],
      tradeStats: { total: 0, wins: 0, losses: 0, evens: 0 },
      botStartAt: null,

      // risk controls
      maxSessionLossCents: 0,
      maxConsecutiveLosses: 0,
      sessionLossCents: 0,
      lossStreak: 0,

      // analysis controls
      analysisEnabled: false,
      analysisConfidenceThreshold: 0.65,
      tradeIntervalMin: 9,
      payoutMin: 80,
      payoutMax: 92,
      payoutRequired: false,
      maxTradeAmountCents: 15000,
      maxTradeAmountMultiplier: 1.5,
      analysisWindowSec: 300,
      analysisWarmupMin: 5,
      selfTradeEnabled: false,
      reversalWindowSec: 5,
      reversalOppositeRatio: 0.6,
      panelOpacity: 1,
      countdownBeepEnabled: true,

      // burst controls
      burstEnabled: false,
      burstTradeCount: 2,
      burstConfidenceThreshold: 0.85,
      analysisSteadyTrend: false,

      // Execution state tracking
      executionStartTime: 0,
      executionTimeoutId: null,

      /* ---------- Asset selection state ---------- */
      assetSelectionAttempts: 0,
      lastAssetSelectionType: null,
      assetSelectionFlipped: false,

      /* ---------- UI Status ---------- */
      currentStatus: 'Looking for market opportunity',
      countdownValue: '',
      consoleLines: [],
      lastConsoleMessage: '',
      lastConsoleAt: 0,
      lastSelfTradeHintAt: 0,
      lastDiagnosticsAt: 0,
      lastSignalLogAt: new Map(),
      signalSourceEnabled: { '1m': true, '5m': true },
      signalTimeOffsetMin: 0,
      expiryCoords: { '5S': null, '15S': null, '30S': null, '1M': null },

      /* ---------- Sniper mode ---------- */
      sniperProfile: 'pro',
      sniperBaseAmount: SNIPER_5S_DEFAULTS.baseAmountCents,
      sniperProBaseAmount: SNIPER_PRO_DEFAULTS.baseAmountCents,
      sniperThreshold: SNIPER_5S_DEFAULTS.threshold,
      sniperMinPayout: SNIPER_PRO_DEFAULTS.minPayout,
      sniperEntryWindowSec: SNIPER_PRO_DEFAULTS.entryWindowSec,
      sniperWarmupMin: SNIPER_PRO_DEFAULTS.warmupMin,
      sniperVwapDeviation: SNIPER_PRO_DEFAULTS.vwapDeviation,
      sniperMomentumThreshold: SNIPER_PRO_DEFAULTS.momentumThreshold,
      sniperChopThreshold: SNIPER_PRO_DEFAULTS.chopThreshold,
      sniperRsiOversold: SNIPER_PRO_DEFAULTS.rsiOversold,
      sniperRsiOverbought: SNIPER_PRO_DEFAULTS.rsiOverbought,
      sniperRsiWindow: SNIPER_PRO_DEFAULTS.rsiWindow,
      sniperEmaFast: SNIPER_PRO_DEFAULTS.emaFast,
      sniperEmaSlow: SNIPER_PRO_DEFAULTS.emaSlow,
      sniperStochOversold: SNIPER_PRO_DEFAULTS.stochOversold,
      sniperStochOverbought: SNIPER_PRO_DEFAULTS.stochOverbought,
      sniperStochWindow: SNIPER_PRO_DEFAULTS.stochWindow,
      sniperVolumeThreshold: SNIPER_PRO_DEFAULTS.volumeThreshold,
      sniperSharpeWindowMin: SNIPER_PRO_DEFAULTS.sharpeWindowMin,
      sniperEnabledTimeframes: { ...SNIPER_PRO_DEFAULTS.timeframes },
      sniperLastTradeByTf: {},
      sniperWarmupUntil: 0,
      sniperLastDecision: null,
      sniperNextTradeByTf: {},
      sniperTfStatus: {},
      sniperProScoreThreshold: SNIPER_PRO_SETTINGS_DEFAULTS.scoreThreshold,
      sniperProRiskRatio: SNIPER_PRO_SETTINGS_DEFAULTS.riskRatio,
      sniperProRiskPremium: SNIPER_PRO_SETTINGS_DEFAULTS.riskPremium,
      sniperProTrendBias: SNIPER_PRO_SETTINGS_DEFAULTS.trendBias,
      sniperProMomentumGate: SNIPER_PRO_SETTINGS_DEFAULTS.momentumGate,
      sniperProCooldownMin: SNIPER_PRO_SETTINGS_DEFAULTS.cooldownMin,
      sniperProWeights: { ...SNIPER_PRO_SETTINGS_DEFAULTS.weights },
      sniperProRiskSamples: [],
      sniperProNextAllowedAt: 0,
      sniperProBurstEnabled: SNIPER_PRO_SETTINGS_DEFAULTS.burstEnabled,
      sniperProBurstConfidence: SNIPER_PRO_SETTINGS_DEFAULTS.burstConfidence,
      sniperProBurstCount: SNIPER_PRO_SETTINGS_DEFAULTS.burstCount,

      /* ---------- Signal deduplication ---------- */
      signalCooldownUntil: 0,
      recentSignalKeys: new Map(),

      // trade pacing
      nextTradeAllowedAt: 0,

      // analysis state
      analysisDirection: null,
      analysisConfidence: 0,
      analysisUpdatedAt: 0,
      analysisWindows: [],
      analysisReadyAt: 0,
      analysisReason: '',
      lastSignalLagSec: null,
      clockDriftSec: null,
      lastSkipReason: '',
      lastSkipAt: 0,
      lastStatusAt: 0,

      /* ---------- ENHANCED: Countdown and UI states ---------- */
      countdownActive: false,
      countdownStartTime: 0,
      countdownTargetTime: 0,
      uiState: 'IDLE', // IDLE, SWITCHING_ASSET, IDENTIFYING_PATTERN, PATTERN_IDENTIFIED, EXECUTING, RESULTS
      lastBalanceCheck: null,
      cycleProfitLoss: 0,
      tradeExecutionTime: 0,
      patternIdentifiedTime: 0
    };

    function getSniperDefaults(profile) {
      if (profile === '5s') return SNIPER_5S_DEFAULTS;
      return SNIPER_PRO_DEFAULTS;
    }

    function applySniperDefaults(profile) {
      const normalizedProfile = profile === '5s' || profile === 'standard' ? '5s' : 'pro';
      const defaults = getSniperDefaults(normalizedProfile);
      S.sniperProfile = normalizedProfile;
      if (normalizedProfile === 'pro') {
        if (!Number.isFinite(S.sniperProBaseAmount)) {
          S.sniperProBaseAmount = defaults.baseAmountCents;
        }
      } else if (!Number.isFinite(S.sniperBaseAmount)) {
        S.sniperBaseAmount = defaults.baseAmountCents;
      }
      S.sniperThreshold = defaults.threshold;
      S.sniperMinPayout = defaults.minPayout;
      S.sniperEntryWindowSec = defaults.entryWindowSec;
      S.sniperWarmupMin = defaults.warmupMin;
      S.sniperVwapDeviation = defaults.vwapDeviation;
      S.sniperMomentumThreshold = defaults.momentumThreshold;
      S.sniperChopThreshold = defaults.chopThreshold;
      S.sniperRsiOversold = defaults.rsiOversold;
      S.sniperRsiOverbought = defaults.rsiOverbought;
      S.sniperRsiWindow = defaults.rsiWindow;
      S.sniperEmaFast = defaults.emaFast;
      S.sniperEmaSlow = defaults.emaSlow;
      S.sniperStochOversold = defaults.stochOversold;
      S.sniperStochOverbought = defaults.stochOverbought;
      S.sniperStochWindow = defaults.stochWindow;
      S.sniperVolumeThreshold = defaults.volumeThreshold;
      S.sniperSharpeWindowMin = defaults.sharpeWindowMin;
      S.sniperEnabledTimeframes = { ...defaults.timeframes };
    }

    function applySniperProfile(profile) {
      applySniperDefaults(profile);
      if (isSniperMode()) {
        S.sniperWarmupUntil = Date.now() + Math.max(1, S.sniperWarmupMin || 10) * 60 * 1000;
        S.sniperLastDecision = null;
        S.sniperLastTradeByTf = {};
        S.sniperNextTradeByTf = {};
        S.sniperTfStatus = {};
        S.sniperProRiskSamples = [];
        S.sniperProNextAllowedAt = 0;
      }
      const profileLabel = S.sniperProfile === 'pro'
        ? 'СНАЙПЕР PRO'
        : 'СНАЙПЕР 5s';
      logConsoleLine(`Профил: ${profileLabel}`);
      renderSettingsPanel();
      persistSettings();
    }

    const SETTINGS_I18N = {
      base_amount: 'Основна сума ($)',
      expiry_setting: 'Време на изтичане:',
      expiry_1m: '1 минута',
      expiry_5m: '5 минути',
      l1_martingale: 'L1 мартингейл',
      l2_martingale: 'L2 мартингейл',
      l1_multiplier: 'L1 множител',
      l2_multiplier: 'L2 множител',
      max_session_loss: 'Макс. загуба за сесия ($):',
      max_loss_streak: 'Макс. серия загуби:',
      limits_hint: 'Задай 0 за изключване на лимитите',
      warmup_min: 'Загряване (мин):',
      burst_entries: 'Burst входове при силен тренд',
      burst_count: 'Брой burst:',
      burst_confidence: 'Burst увереност (0-1):',
      late_reversal_filter: 'Филтър за късно обръщане',
      reversal_window: 'Прозорец (сек):',
      opposite_ratio: 'Дял на обратните (0-1):',
      panel_opacity: 'Прозрачност на панела:',
      countdown_beep: 'Бип при отброяване',
      keep_tab_alive: 'Дръж таба активен',
      keep_tab_alive_hint: 'Предотвратява приспиване на таба от браузъра',
      force_asset_selection: 'Принудителен избор на актив',
      force_asset_selection_hint: 'Проверява избора на актив и повтаря при неуспех',
      signal_source_1m: 'Сигнали 1м',
      signal_source_5m: 'Сигнали 5м',
      signal_time_offset: 'Часова корекция (мин):',
      mode_label: 'Режим на работа',
      mode_signals: 'Сигнали 1м/5м',
      mode_sniper: 'СНАЙПЕР',
      sniper_profile_label: 'Профил на Снайпер',
      sniper_profile_pro: 'Sniper Pro',
      sniper_profile_5s: 'Sniper 5s',
      sniper_panel_title: 'Снайпер настройки',
      sniper_max_session_loss: 'Стоп при загуба (€):',
      sniper_max_loss_streak: 'Стоп при поредни загуби:',
      sniper_pro_title: 'Снайпер Pro настройки',
      sniper_pro_score_threshold: 'Праг на скоринг (мин 0 – макс 1):',
      sniper_pro_risk_ratio: 'Дял рискови входове (мин 0 – макс 1):',
      sniper_pro_risk_premium: 'Премия за риск (мин 0 – макс 0.5):',
      sniper_pro_trend_bias: 'Трендов превес (мин 0 – макс 1):',
      sniper_pro_momentum_gate: 'Филтър импулс (мин 0 – макс 1):',
      sniper_pro_cooldown: 'Пауза между входове (мин 0 – макс 60):',
      sniper_pro_burst_enabled: 'Мулти входове при силна увереност',
      sniper_pro_burst_confidence: 'Праг мулти входове (мин 0 – макс 1):',
      sniper_pro_burst_count: 'Брой мулти входове (мин 2 – макс 5):',
      sniper_pro_weight_vwap: 'Тегло VWAP (мин 0 – макс 1):',
      sniper_pro_weight_momentum: 'Тегло Momentum (мин 0 – макс 1):',
      sniper_pro_weight_trend: 'Тегло Trend (мин 0 – макс 1):',
      sniper_pro_base_amount: 'Базова сума Pro ($) (мин 1 – макс 10000):',
      sniper_timeframes: 'Таймфрейми за изпълнение:',
      sniper_keep_alive: 'Дръж таба активен'
    };

    const STATUS_I18N = {
      console_ready: 'Конзолата е готова.',
      looking_for_opportunity: 'Търсене на възможност на пазара',
      warming_up: 'Загряване на анализа ({seconds}s)',
      ready: 'Готов',
      login_accepted: 'Входът е приет.',
      login_denied: 'Входът е отказан.',
      bot_started: 'Ботът е стартиран.',
      bot_stopped: 'Ботът е спрян.',
      auto_on: 'Авто‑търговия: включена.',
      auto_off: 'Авто‑търговия: изключена.',
      skip_reason: 'ПРОПУСК: {reason}',
      signal_received: 'Получен сигнал ({source}): {asset} {direction} {expiry}',
      signal_scheduled: 'Планиран сигнал: {time} ({expiry})',
      diagnostics: 'Диагн.: авто={auto} анализ={analysis} посока={dir} увер={conf} праг={thr} пропуск={skip}',
      trade_attempt: 'Опит за сделка: {asset} {direction} {expiry}',
      trade_buttons_missing: 'Пропуск: липсват бутони',
      trade_amount_missing: 'Пропуск: липсва поле за сума',
      trade_clicked: 'Клик: {direction} {amount}',
      asset_selected: 'Избран актив: {asset}',
      asset_select_failed: 'Провал при избор на актив',
      signal_fetch_failed: 'Проблем при сигнал ({source})',
      signal_empty: 'Празен сигнал ({source})',
      signal_parse_failed: 'Невалиден сигнал ({source})',
      signal_text_snippet: 'Текст: {snippet}',
      signal_duplicate: 'Дублиран сигнал ({source})',
      signal_stale: 'Просрочен сигнал ({source})',
      payout_missing: 'Липсва изплащане',
      analysis_ready_selftrade_off: 'Анализът е готов, но самостоятелните сделки са изключени.',
      switching_asset: 'Смяна на актив',
      identifying_pattern: 'Търсене на входен модел',
      pattern_identified: 'Моделът е открит',
      trade_executed: 'Сделката е изпълнена',
      l_activated: 'L{level} активирано',
      trade_won: '✅ ПЕЧЕЛИВША СДЕЛКА',
      trade_lost: '❌ ГУБЕЩА СДЕЛКА',
      trade_even: '➖ НЕУТРАЛНА СДЕЛКА',
      risk_limit_hit: '🛑 ДОСТИГНАТ ЛИМИТ НА РИСКА - БОТЪТ Е СПРЯН',
      bot_loaded: 'Ботът е зареден и готов.',
      session_ok: 'Whitelist сесията е потвърдена.',
      sniper_warming_up: 'Снайпер: зареждане на история ({seconds} мин)',
      sniper_ready: 'Снайпер: готов за входове',
      start_label: 'Старт',
      total_label: 'Общо',
      win_label: 'Печалби',
      loss_label: 'Загуби',
      win_rate_label: '%',
      lag_label: 'Лаг',
      feed_label: 'Цена'
    };

    const SKIP_REASON_I18N = {
      Warmup: 'Загряване',
      Interval: 'Интервал',
      NoTrend: 'Няма тренд',
      Confidence: 'Ниска увереност',
      Mismatch: 'Несъответствие на посока',
      Payout: 'Изплащане',
      Reversal: 'Обръщане',
      Amount: 'Липсва сума',
      Buttons: 'Липсват бутони',
      MaxAmount: 'Макс. сума',
      LowVol: 'Ниска волатилност',
      HighVol: 'Висока волатилност',
      Glitch: 'Скок в цената',
      Chop: 'Накъсан пазар',
      Spike: 'Рязък шип',
      Level: 'На ключово ниво',
      Timing: 'Лош тайминг',
      Momentum: 'Слаб импулс',
      NoFeed: 'Няма цена',
      Expiry: 'Липсва време',
      Quality: 'Ниско качество'
    };

    function applySettingsTranslations(){
      const dict = SETTINGS_I18N;
      const panel = $id('iaa-settings-panel');
      if (!panel) return;
      panel.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (key && dict[key]) el.textContent = dict[key];
      });
    }

    function formatStatus(key, vars = {}) {
      const template = STATUS_I18N[key] || key;
      return template.replace(/\{(\w+)\}/g, (_, name) => {
        return Object.prototype.hasOwnProperty.call(vars, name) ? vars[name] : '';
      });
    }

    function translateSkipReason(reason) {
      return SKIP_REASON_I18N[reason] || reason;
    }

    function applyStatusLabels() {
      document.querySelectorAll('[data-status-key]').forEach(el => {
        const key = el.getAttribute('data-status-key');
        if (key) el.textContent = formatStatus(key);
      });
    }

    function getActiveMode() {
      return S.mode === 'sniper' ? 'sniper' : 'signals';
    }

    function isSniperMode() {
      return getActiveMode() === 'sniper';
    }

    function getEffectiveKeepAliveEnabled() {
      return isSniperMode() ? S.sniperKeepAliveEnabled : S.keepAliveEnabled;
    }

    function setMode(nextMode) {
      const normalized = nextMode === 'sniper' ? 'sniper' : 'signals';
      if (S.mode === normalized) return;
      S.mode = normalized;
      stopCountdown();

      if (normalized === 'sniper') {
        S.sniperKeepAliveEnabled = false;
        S.currentSignal = null;
        S.tradeSequenceActive = false;
        S.hasLiveSignal = false;
        S.signalBuffer.length = 0;
        S.forceImmediate = false;
            S.sniperWarmupUntil = Date.now() + Math.max(1, S.sniperWarmupMin || 10) * 60 * 1000;
        S.sniperLastTradeByTf = {};
        S.sniperNextTradeByTf = {};
        S.sniperTfStatus = {};
        renderSniperMatrix();
      } else {
        S.sniperLastDecision = null;
        S.sniperLastTradeByTf = {};
        S.sniperNextTradeByTf = {};
        S.sniperTfStatus = {};
        renderSniperMatrix();
      }

      persistSettings();
      renderSettingsPanel();
      if (S.running) {
        if (getEffectiveKeepAliveEnabled()) {
          startKeepAlive();
        } else {
          stopKeepAlive();
        }
      }
    }

    function getSelfTradeAllowed() {
      return S.selfTradeEnabled;
    }

    function renderConsole(){
      const linesEl = $id('iaa-console-lines');
      if (!linesEl) return;
      if (!S.consoleLines.length) {
        linesEl.innerHTML = `<div class="iaa-console-line"><span class="iaa-console-time">--:--:--</span><span class="iaa-console-msg">${formatStatus('console_ready')}</span></div>`;
        return;
      }
      const formatLine = (line) => {
        const match = line.match(/^\[(.+?)\]\s(.+)$/);
        const timeText = match ? match[1] : '--:--:--';
        const messageText = match ? match[2] : line;
        const lower = messageText.toLowerCase();
        let msgClass = 'iaa-console-msg';
        if (lower.startsWith('diag') || lower.startsWith('диагн')) {
          msgClass += ' iaa-console-msg--diag';
        } else if (lower.includes('signal') || lower.includes('сигнал')) {
          msgClass += ' iaa-console-msg--signal';
        } else if (lower.startsWith('skip') || lower.startsWith('пропуск')) {
          msgClass += ' iaa-console-msg--skip';
        } else if (lower.includes('missing') || lower.includes('липсва')) {
          msgClass += ' iaa-console-msg--warn';
        }
        return `<div class="iaa-console-line"><span class="iaa-console-time">[${timeText}]</span><span class="${msgClass}">${messageText}</span></div>`;
      };
      linesEl.innerHTML = S.consoleLines.map(formatLine).join('');
      linesEl.scrollTop = linesEl.scrollHeight;
    }

    function logConsoleLine(message){
      if (!message) return;
      const now = Date.now();
      if (S.lastConsoleMessage === message && now - S.lastConsoleAt < 1500) return;
      S.lastConsoleMessage = message;
      S.lastConsoleAt = now;
      const stamp = new Date().toLocaleTimeString();
      S.consoleLines.push(`[${stamp}] ${message}`);
      if (S.consoleLines.length > 200) S.consoleLines.shift();
      renderConsole();
    }

    function logDiagnostics() {
      const now = Date.now();
      if (now - S.lastDiagnosticsAt < 60000) return;
      if (!isSniperMode() && !S.analysisEnabled) return;
      if (isSniperMode() && !isSniperWarmupReady()) return;
      S.lastDiagnosticsAt = now;
      const auto = S.autoTrade ? 'on' : 'off';
      const analysis = isSniperMode() ? 'sniper' : (S.analysisEnabled ? 'on' : 'off');
      const dir = S.analysisDirection || '-';
      const conf = typeof S.analysisConfidence === 'number' ? S.analysisConfidence.toFixed(2) : '-';
      const thr = isSniperMode()
        ? (S.sniperProfile === 'pro'
          ? (typeof S.sniperProScoreThreshold === 'number' ? S.sniperProScoreThreshold.toFixed(2) : '-')
          : (typeof S.sniperThreshold === 'number' ? S.sniperThreshold.toFixed(2) : '-'))
        : (typeof S.analysisConfidenceThreshold === 'number' ? S.analysisConfidenceThreshold.toFixed(2) : '-');
      const skip = S.lastSkipReason ? translateSkipReason(S.lastSkipReason) : '-';
      logConsoleLine(formatStatus('diagnostics', { auto, analysis, dir, conf, thr, skip }));
    }

    function logSignalStatus(source, key, options = {}) {
      if (!source || !key) return;
      const { minIntervalMs = 60000, ...extras } = options;
      const label = source.label || source.url || 'signal';
      const logKey = `${label}:${key}`;
      const now = Date.now();
      const last = S.lastSignalLogAt.get(logKey) || 0;
      if (now - last < minIntervalMs) return;
      S.lastSignalLogAt.set(logKey, now);
      logConsoleLine(formatStatus(key, { source: label, ...extras }));
    }

    function logSignalSnippet(source, text, { force = false } = {}) {
      if (!text) return;
      const snippet = text.replace(/\s+/g, ' ').trim().slice(0, 140);
      if (!snippet) return;
      const label = source.label || source.url || 'signal';
      const hash = snippet.replace(/\s+/g, '').slice(0, 30);
      const logKey = `${label}:snippet:${hash}`;
      const minIntervalMs = force ? 300000 : 60000;
      const now = Date.now();
      const last = S.lastSignalLogAt.get(logKey) || 0;
      if (now - last < minIntervalMs) return;
      S.lastSignalLogAt.set(logKey, now);
      logConsoleLine(formatStatus('signal_text_snippet', { snippet }));
    }

    function recordTradeStats(outcome) {
      S.tradeStats.total += 1;
      if (outcome === 'WIN') {
        S.tradeStats.wins += 1;
      } else if (outcome === 'LOSS') {
        S.tradeStats.losses += 1;
      } else {
        S.tradeStats.evens += 1;
      }
      renderTradeStats();
    }

    function renderLagStatus() {
      const lagEl = $id('iaa-live-lag');
      if (!lagEl) return;
      if (S.lastSignalLagSec === null || typeof S.lastSignalLagSec !== 'number') {
        lagEl.textContent = '—';
        return;
      }
      lagEl.textContent = `${S.lastSignalLagSec}s`;
    }

    function renderTradeStats() {
      const totalEl = $id('iaa-total-trades');
      const winEl = $id('iaa-win-trades');
      const lossEl = $id('iaa-loss-trades');
      const rateEl = $id('iaa-win-rate');
      const startEl = $id('iaa-start-time');

      if (totalEl) totalEl.textContent = String(S.tradeStats.total);
      if (winEl) winEl.textContent = String(S.tradeStats.wins);
      if (lossEl) lossEl.textContent = String(S.tradeStats.losses);
      if (rateEl) {
        const total = S.tradeStats.total;
        const rate = total > 0 ? Math.round((S.tradeStats.wins / total) * 100) : 0;
        rateEl.textContent = `${rate}%`;
      }
      if (startEl) {
        startEl.textContent = S.botStartAt
          ? new Date(S.botStartAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : '—';
      }
      renderLagStatus();
    }

    function getNextEtaMs() {
      const now = Date.now();
      let etaMs = null;
      if (isSniperMode() && S.sniperWarmupUntil && S.sniperWarmupUntil > now) {
        etaMs = S.sniperWarmupUntil - now;
      } else if (S.analysisReadyAt && S.analysisReadyAt > now) {
        etaMs = S.analysisReadyAt - now;
      }
      if (S.nextTradeAllowedAt && S.nextTradeAllowedAt > now) {
        etaMs = etaMs ? Math.max(etaMs, S.nextTradeAllowedAt - now) : (S.nextTradeAllowedAt - now);
      }
      if (etaMs == null && S.countdownActive && S.countdownTargetTime) {
        etaMs = Math.max(0, S.countdownTargetTime - now);
      }
      return etaMs;
    }

    function getNextEtaLabel() {
      const etaMs = getNextEtaMs();
      if (etaMs != null) {
        const totalSeconds = Math.ceil(etaMs / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${String(seconds).padStart(2, '0')}`;
      }
      return formatStatus('ready');
    }

    function getDebugInfoLines() {
      const now = new Date();
      const utc3 = new Date(Date.now() - 3 * 60 * 60 * 1000);
      const driftValue = typeof S.clockDriftSec === 'number' ? S.clockDriftSec : null;
      const driftLabel = driftValue != null ? `${driftValue}s` : '—';
      const lagValue = typeof S.lastSignalLagSec === 'number' ? S.lastSignalLagSec : null;
      const lagLabel = lagValue != null ? `${lagValue}s` : '—';
      const analysisUpdatedSec = S.analysisUpdatedAt ? Math.round((Date.now() - S.analysisUpdatedAt) / 1000) : null;
      const analysisUpdatedLabel = analysisUpdatedSec != null ? `${analysisUpdatedSec}s` : '—';
      const confidence = Number.isFinite(S.analysisConfidence) ? S.analysisConfidence : 0;
      const threshold = isSniperMode()
        ? (S.sniperProfile === 'pro'
          ? (typeof S.sniperProScoreThreshold === 'number' ? S.sniperProScoreThreshold : null)
          : (typeof S.sniperThreshold === 'number' ? S.sniperThreshold : null))
        : (typeof S.analysisConfidenceThreshold === 'number' ? S.analysisConfidenceThreshold : null);
      const lowConfidence = threshold == null ? confidence <= 0 : confidence < threshold;
      const driftSeverity = driftValue == null ? '' : (Math.abs(driftValue) >= 2 ? 'bad' : (Math.abs(driftValue) >= 1 ? 'warn' : ''));
      const lagSeverity = lagValue == null ? '' : (lagValue >= 5 ? 'bad' : (lagValue >= 2 ? 'warn' : ''));
      const feedOk = S.currentAssetPrice != null;
      const feedSeverity = feedOk ? '' : 'bad';
      const analysisUpdatedSeverity = analysisUpdatedSec != null && analysisUpdatedSec > 15 ? 'warn' : '';
      const lastSkipSeverity = S.lastSkipReason ? 'warn' : '';
      const confidenceSeverity = lowConfidence ? 'warn' : '';

      const lines = [
        { key: 'авто', value: S.autoTrade ? 'Да' : 'Не', severity: '' },
        { key: 'анализ', value: S.analysisEnabled ? 'Да' : 'Не', severity: '' },
        { key: 'посока', value: S.analysisDirection || '-', severity: '' },
        { key: 'увереност', value: confidence.toFixed(2), severity: confidenceSeverity },
        { key: 'праг', value: threshold != null ? threshold.toFixed(2) : '-', severity: '' },
        { key: 'лаг', value: lagLabel, severity: lagSeverity },
        { key: 'цена', value: feedOk ? 'OK' : '—', severity: feedSeverity },
        { key: 'история', value: String(S.priceHistory?.length || 0), severity: '' },
        { key: 'обновен', value: analysisUpdatedLabel, severity: analysisUpdatedSeverity },
        { key: 'следваща', value: getNextEtaLabel(), severity: '' },
        { key: 'последен пропуск', value: S.lastSkipReason || '—', severity: lastSkipSeverity },
        { key: 'часовник', value: driftLabel, severity: driftSeverity },
        { key: 'локално', value: now.toLocaleTimeString(), severity: '' },
        { key: 'utc-3', value: utc3.toUTCString().split(' ')[4], severity: '' }
      ];
      return lines;
    }

    function formatDebugInfo() {
      return getDebugInfoLines()
        .map((line) => `${line.key}: ${line.value}`)
        .join('\n');
    }

    function renderDebugInfo() {
      const content = $id('iaa-debug-content');
      if (!content) return;
      const lines = getDebugInfoLines();
      content.innerHTML = lines.map((line) => {
        const severityClass = line.severity ? ` iaa-debug-value--${line.severity}` : '';
        return `<div class="iaa-debug-line"><span class="iaa-debug-key">${line.key}:</span><span class="iaa-debug-value${severityClass}">${line.value}</span></div>`;
      }).join('');
    }

    async function copyDebugInfo() {
      const text = formatDebugInfo();
      if (!text) return false;
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
          return true;
        }
      } catch {}
      try {
        const temp = document.createElement('textarea');
        temp.value = text;
        temp.setAttribute('readonly', 'readonly');
        temp.style.position = 'fixed';
        temp.style.top = '-1000px';
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        temp.remove();
        return true;
      } catch {
        return false;
      }
    }

    async function copyConsoleToClipboard() {
      const text = S.consoleLines.join('\n');
      if (!text) return false;
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
          return true;
        }
      } catch {}
      try {
        const temp = document.createElement('textarea');
        temp.value = text;
        temp.setAttribute('readonly', 'readonly');
        temp.style.position = 'fixed';
        temp.style.top = '-1000px';
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        temp.remove();
        return true;
      } catch {
        return false;
      }
    }

    function updateClockDriftFromResponse(response) {
      const serverDate = response?.headers?.get?.('Date') || response?.headers?.get?.('date');
      if (!serverDate) return;
      const serverTs = Date.parse(serverDate);
      if (Number.isNaN(serverTs)) return;
      const driftSec = (Date.now() - serverTs) / 1000;
      S.clockDriftSec = Math.round(driftSec * 10) / 10;
    }

    function renderLiveInfo() {
      renderLagStatus();
    }

    function renderSniperMatrix() {
      const tfs = ['5s', '15s', '30s', '1m'];
      tfs.forEach(tf => {
        const textEl = $id(`iaa-tf-${tf}`);
        const dotEl = $id(`iaa-tf-dot-${tf}`);
        if (!textEl || !dotEl) return;
        dotEl.className = 'iaa-tf-dot';

        if (!isSniperMode()) {
          textEl.textContent = `${tf} -`;
          textEl.style.color = '#e5e7eb';
          return;
        }

        const status = S.sniperTfStatus[tf];
        if (!status) {
          textEl.textContent = `${tf} -`;
          textEl.style.color = '#e5e7eb';
          return;
        }

        const confPct = typeof status.confidence === 'number'
          ? `${Math.round(status.confidence * 100)}%`
          : '-';
        const dir = status.direction ? String(status.direction).toUpperCase() : '-';
        if (dir === '-' && confPct === '-') {
          textEl.textContent = `${tf} -`;
        } else if (dir === '-') {
          textEl.textContent = `${tf} ${confPct}`;
        } else {
          textEl.textContent = `${tf} ${dir} ${confPct}`;
        }
        if (dir === 'BUY') {
          textEl.style.color = '#22c55e';
        } else if (dir === 'SELL') {
          textEl.style.color = '#ef4444';
        } else {
          textEl.style.color = '#e5e7eb';
        }

        if (status.state === 'ready') {
          dotEl.classList.add('iaa-tf-dot--ok');
        } else if (['weak', 'late', 'chop', 'payout', 'warmup', 'risk', 'cooldown', 'nodata'].includes(status.state)) {
          dotEl.classList.add('iaa-tf-dot--warn');
        } else if (status.state === 'off') {
          dotEl.classList.add('iaa-tf-dot--bad');
        }
      });
    }

    /* ------------------------------ HELPERS ----------------------------- */
    const $id = (id) => document.getElementById(id);
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => Array.from(document.querySelectorAll(sel));
    const T = (el) => (el ? (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim() : '');
    const clamp01 = (x) => Math.max(0, Math.min(1, x));
    const nowMs = () => performance.now();
    const delay = (ms) => new Promise(r => setTimeout(r, ms));
    const fmtMoney = (c) => `${c<0?'-':''}$${Math.floor(Math.abs(c)/100)}.${String(Math.abs(c)%100).padStart(2,'0')}`;
    const hasActiveTrade = () => (S.activeTrades || []).length > 0;
    const getPrimaryActiveTrade = () => (S.activeTrades && S.activeTrades.length ? S.activeTrades[0] : null);

    /* ========================= MINIMAL LOGGING ========================= */
    function debugLog(message, data = null) {
      // Only log critical errors and important state changes
      const criticalMessages = [
        'error', 'failed', 'exception', 'critical', 'outcome', 'WIN', 'LOSS', 'EVEN'
      ];

      const isCritical = criticalMessages.some(keyword =>
        message.toLowerCase().includes(keyword.toLowerCase())
      );

      if (isCritical) {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = `[${timestamp}] ${message}` + (data ? ` | ${JSON.stringify(data)}` : '');
        console.log(logEntry);
      }
    }

    /* ========================= FIXED BALANCE READING ========================= */
    function detectAccountType() {
      const labelEl = $(C.ACCOUNT_TYPE_SELECTOR);
      if (!labelEl) return 'UNKNOWN';
      const labelText = T(labelEl).toUpperCase();
      return labelText.includes('DEMO') ? 'DEMO' : 'REAL';
    }

    function readBalanceCents() {
      const accountType = detectAccountType();
      let balanceEl = null;

      if (accountType === 'DEMO') {
        balanceEl = $(C.BALANCE_DEMO_SELECTOR);
      } else if (accountType === 'REAL') {
        balanceEl = $(C.BALANCE_REAL_SELECTOR);
      }

      if (balanceEl) {
        const text = T(balanceEl);
        const cleanText = text.replace(/,/g, '');
        const cents = parseMoneyToCents(cleanText);
        if (cents !== null && cents > 0) {
          return cents;
        }
      }

      // Fallback
      const balanceSelectors = [
        'body > div.wrapper > div.wrapper__top > header > div.right-block.js-right-block > div.right-block__item.js-drop-down-modal-open > div > div.balance-info-block__data > div.balance-info-block__balance > span',
        '.balance-info-block__balance span',
        '.right-block__item span',
        '[class*="balance"] span',
        '.balance-info-block span',
        '.balance span'
      ];

      for (const selector of balanceSelectors) {
        const balanceEl = $(selector);
        if (balanceEl) {
          const text = T(balanceEl).replace(/,/g, '');
          const cents = parseMoneyToCents(text);
          if (cents !== null && cents > 0) {
            return cents;
          }
        }
      }

      return null;
    }

    /* ========================= SMART XPATH LOCATOR ========================= */
    class SmartXPathLocator {
      constructor() {
        this.selectors = S.xpathSelectors;
      }

      findElement(elementName, customSelectors = null) {
        const selectorList = customSelectors || this.selectors[elementName];

        if (!selectorList || !selectorList.length) {
          return null;
        }

        for (let i = 0; i < selectorList.length; i++) {
          try {
            const result = document.evaluate(
              selectorList[i],
              document,
              null,
              XPathResult.FIRST_ORDERED_NODE_TYPE,
              null
            );

            const element = result.singleNodeValue;
            if (element && element.nodeType === Node.ELEMENT_NODE) {
              return element;
            }
          } catch (error) {
            // Silent fail
          }
        }

        return null;
      }

      findAllElements() {
        const results = {};
        for (const elementName in this.selectors) {
          results[elementName] = this.findElement(elementName);
        }
        return results;
      }

      async waitForElement(elementName, timeout = 5000) {
        return new Promise((resolve) => {
          const startTime = Date.now();

          const checkElement = () => {
            const element = this.findElement(elementName);

            if (element) {
              resolve(element);
            } else if (Date.now() - startTime >= timeout) {
              resolve(null);
            } else {
              setTimeout(checkElement, 100);
            }
          };

          checkElement();
        });
      }
    }

    // Initialize XPath locator
    const xpathLocator = new SmartXPathLocator();

    function parseMoneyToCents(str) {
      if (!str) return null;
      let s = String(str).replace(/\s|\u00A0/g,'').replace(/[^\d.,-]/g,'');
      if (!s) return null;
      const hasComma = s.includes(',');
      const hasDot = s.includes('.');
      if (hasComma && hasDot) {
        if (s.lastIndexOf(',') < s.lastIndexOf('.')) s = s.replace(/,/g, '');
        else s = s.replace(/\./g, '').replace(',', '.');
      } else if (hasComma && !hasDot) {
        s = s.replace(',', '.');
      }
      const v = parseFloat(s);
      return Number.isFinite(v) ? Math.round(v*100) : null;
    }

    function parseNumberFlexible(s){
      if(!s) return null; s=String(s).trim();
      if(s.includes(',')&&s.includes('.')) s=s.replace(/,/g,''); else if(s.includes(',')&&!s.includes('.')) s=s.replace(',', '.');
      const v=Number(s.replace(/[^\d.+\-]/g,'')); return Number.isFinite(v)?v:null;
    }

    function parseCoordinatePair(value) {
      if (!value) return null;
      const parts = String(value).split(',').map(p => parseNumberFlexible(p));
      if (parts.length < 2) return null;
      const [x, y] = parts;
      if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
      return { x, y };
    }

    function normalizeExpiry(exp){
      if(!exp) return null; const e=String(exp).toUpperCase();
      if(/^(5S|S5)$/.test(e)) return '5S';
      if(/^(15S|S15)$/.test(e)) return '15S';
      if(/^(30S|S30)$/.test(e)) return '30S';
      if(/^(M1|1M|60S)$/.test(e)) return '1M';
      if(/^(M5|5M)$/.test(e)) return '5M';
      return '1M';
    }

    function getSignalLateToleranceMs(expiry) {
      const norm = normalizeExpiry(expiry);
      if (norm === '5M') return 120000;
      if (norm === '5S') return 3000;
      if (norm === '30S') return 15000;
      if (norm === '15S') return 8000;
      return 60000;
    }

    function getSignalMaxFutureMs(expiry) {
      const norm = normalizeExpiry(expiry);
      if (norm === '5M') return 60 * 60 * 1000;
      if (norm === '5S') return 2 * 60 * 1000;
      if (norm === '30S') return 5 * 60 * 1000;
      if (norm === '15S') return 3 * 60 * 1000;
      return 15 * 60 * 1000;
    }

    function secsFromTF(tf){
      const norm = normalizeExpiry(tf);
      if (norm === '5M') return 300;
      if (norm === '5S') return 5;
      if (norm === '30S') return 30;
      if (norm === '15S') return 15;
      return 60;
    }

    function getActiveTradeIntervalMin() {
      return Math.max(1, S.tradeIntervalMin || 1);
    }

    function getCurrentUTCMinus3Time(){ return new Date(Date.now() - 3*60*60*1000); }
    function getCurrentMinute(){ const n=getCurrentUTCMinus3Time(); return n.getUTCHours()*60 + n.getUTCMinutes(); }

    function getSecondsToCandleClose(expiry) {
      const now = getCurrentUTCMinus3Time();
      const seconds = now.getUTCSeconds();
      const minutes = now.getUTCMinutes();
      const norm = normalizeExpiry(expiry);
      if (norm === '15S') {
        return 15 - (seconds % 15);
      }
      if (norm === '30S') {
        return 30 - (seconds % 30);
      }
      const interval = norm === '5M' ? 5 : 1;
      const secondsInto = (minutes % interval) * 60 + seconds;
      return interval * 60 - secondsInto;
    }

    /* ========================= FIXED TIME CALCULATION ========================= */
    function calculateDelay(signalOrMinute) {
      try {
        if (typeof signalOrMinute === 'object' && signalOrMinute?.targetTsMs) {
          const delayMs = signalOrMinute.targetTsMs - Date.now();
          const lateToleranceMs = getSignalLateToleranceMs(signalOrMinute.expiry);
          if (delayMs < -lateToleranceMs) return -1;
          return delayMs;
        }
        const now = getCurrentUTCMinus3Time();
        const curMin = now.getUTCHours() * 60 + now.getUTCMinutes();
        const curSec = now.getUTCSeconds();
        const curMs = now.getUTCMilliseconds();

        const signalMinute = typeof signalOrMinute === 'number' ? signalOrMinute : 0;
        let d = signalMinute - curMin;

        // Handle day wrap
        if (d < -120) {
          d += 1440;
        }

        if (d > 120) {
          return -1;
        }

        let ms = d * 60 * 1000 - curSec * 1000 - curMs;

        // Allow signals up to 60 seconds late
        if (ms < -60000) {
          return -1;
        }

        return ms;

      } catch (error) {
        return -1;
      }
    }

    function toUTCMinus3DateForSignal(minute) {
      const now = Date.now();
      const utc3 = new Date(now - 3 * 60 * 60 * 1000);
      const dayStartUtcMs = Date.UTC(
        utc3.getUTCFullYear(),
        utc3.getUTCMonth(),
        utc3.getUTCDate(),
        0,
        0,
        0
      ) + 3 * 60 * 60 * 1000;
      let target = new Date(dayStartUtcMs + (minute % 1440) * 60 * 1000);
      if ((now - target.getTime()) > 30 * 60 * 1000) {
        target = new Date(target.getTime() + 24 * 60 * 60 * 1000);
      }
      return target;
    }

    function toLocalDateForSignal(minute) {
      const now = new Date();
      const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).getTime();
      let target = new Date(dayStart + (minute % 1440) * 60 * 1000);
      if ((now - target) > 30*60*1000) target = new Date(target.getTime() + 24*60*60*1000);
      return target;
    }

    function resolveSignalTargetTs(totalMinute, expiry) {
      const now = Date.now();
      const lateTolMs = getSignalLateToleranceMs(expiry);
      const maxFutureMs = getSignalMaxFutureMs(expiry);
      const candidates = [
        { mode: 'utc3', ts: toUTCMinus3DateForSignal(totalMinute).getTime() },
        { mode: 'local', ts: toLocalDateForSignal(totalMinute).getTime() }
      ];

      let best = null;
      for (const candidate of candidates) {
        const delay = candidate.ts - now;
        if (delay < -lateTolMs) continue;
        if (delay > maxFutureMs) continue;
        if (!best || delay < best.delay) {
          best = { ...candidate, delay };
        }
      }

      if (best) return best.ts;
      return null;
    }

    function fmtHHMMSSUTCm3(d){ return `${String(d.getUTCHours()).padStart(2,'0')}:${String(d.getUTCMinutes()).padStart(2,'0')}:${String(d.getUTCSeconds()).padStart(2,'0')}`; }
    function fmtHHMMSSLocal(d){ return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`; }

    /* ========================= ROBUST BALANCE READING WITH RETRY ========================= */
    async function readBalanceWithRetry(maxAttempts = 8) {
      let lastValidBalance = S.balance || null;

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const balance = readBalanceCents();

        if (balance !== null && balance > 0) {
          if (lastValidBalance !== null) {
            const balanceDiff = Math.abs(balance - lastValidBalance);
            if (balanceDiff <= 100000) {
              lastValidBalance = balance;
              return balance;
            } else {
              await delay(50);
              continue;
            }
          } else {
            lastValidBalance = balance;
            return balance;
          }
        }

        if (attempt < maxAttempts) {
          await delay(50);
        }
      }

      return lastValidBalance;
    }

    /* ========================= FIXED PRICE DETECTION - NO CANVAS OVERLOAD ========================= */
    function getCurrentAssetPrice() {
      try {
        // Method 1: Look for specific price elements first (NO CANVAS)
        const priceSelectors = [
          // Primary price display areas
          '[data-test="current-price"]',
          '.current-price',
          '.price-value',
          '.rate-value',
          '.ticker-price',
          '.last-price',

          // PocketOption specific selectors
          '.rate-block__rate',
          '.rate-block__value',
          '.price-block__value',
          '.currency-rate',
          '.pair-rate',

          // Chart price indicators
          '.chart-price',
          '.chart-rate',
          '.tradingview-price',

          // General price areas
          '.price',
          '.rate',
          '.value',
          '.ticker',
          '.quote'
        ];

        for (const selector of priceSelectors) {
          const elements = $$(selector);
          for (const el of elements) {
            if (visible(el)) {
              const text = T(el);
              const price = extractValidPrice(text);
              if (price !== null) {
                return price;
              }
            }
          }
        }

        // Method 2: Look for elements containing price-like patterns
        const priceLikeSelectors = [
          'div', 'span', 'td', 'li', 'p'
        ];

        for (const selector of priceLikeSelectors) {
          const elements = $$(selector);
          for (const el of elements) {
            if (!visible(el)) continue;

            const text = T(el);
            if (text.length > 5 && text.length < 20) { // Reasonable price text length
              const price = extractValidPrice(text);
              if (price !== null) {
                return price;
              }
            }
          }
        }

        return null;

      } catch (error) {
        return null;
      }
    }

    function extractValidPrice(text) {
      if (!text) return null;

      // Clean the text - remove CSS animations and other noise
      const cleanText = text.replace(/@keyframes[^}]+}/g, '')
                          .replace(/transform:[^;]+;/g, '')
                          .replace(/translate\([^)]+\)/g, '')
                          .replace(/scale\([^)]+\)/g, '')
                          .replace(/opacity:[^;]+;/g, '')
                          .trim();

      if (!cleanText) return null;

      // Look for price patterns (numbers with 2-5 decimals)
      const pricePatterns = [
        /\b\d+\.\d{4,5}\b/,  // 4-5 decimals (common in forex)
        /\b\d+\.\d{2,3}\b/,  // 2-3 decimals
        /\b\d+,\d{4,5}\b/,   // European format with 4-5 decimals
        /\b\d+,\d{2,3}\b/    // European format with 2-3 decimals
      ];

      for (const pattern of pricePatterns) {
        const match = cleanText.match(pattern);
        if (match) {
          const priceStr = match[0].replace(',', '.');
          const price = parseFloat(priceStr);
          if (!isNaN(price) && price > 0.1 && price < 1000) { // Reasonable price range
            return price;
          }
        }
      }

      return null;
    }

    /* ========================= PROPER BALANCE-BASED OUTCOME DETECTION ========================= */
    function detectTradeOutcomeByBalance(balanceBefore, balanceAfter) {
      if (!balanceBefore || !balanceAfter) return null;

      const balanceDiff = balanceAfter - balanceBefore;

      // NO TOLERANCE - Exact comparison only
      if (balanceDiff > 0) {
        return 'WIN';
      } else if (balanceDiff < 0) {
        return 'LOSS';
      } else {
        return 'EVEN';
      }
    }

    /* ========================= PROPER PROFIT CALCULATION ========================= */
    function calculateProfitFromBalanceChange(balanceBefore, balanceAfter) {
      if (!balanceBefore || !balanceAfter) return 0;

      // Simple difference - no assumptions about payout percentages
      return balanceAfter - balanceBefore;
    }

    function resetRiskSession() {
      S.sessionLossCents = 0;
      S.lossStreak = 0;
    }

    function recordTradeOutcomeForRisk(outcome, profitCents) {
      if (outcome === 'LOSS') {
        S.lossStreak += 1;
        if (profitCents < 0) {
          S.sessionLossCents += Math.abs(profitCents);
        }
      } else {
        S.lossStreak = 0;
      }
    }

    function applyRiskLimits() {
      const hitLossLimit = S.maxSessionLossCents > 0 && S.sessionLossCents >= S.maxSessionLossCents;
      const hitStreakLimit = S.maxConsecutiveLosses > 0 && S.lossStreak >= S.maxConsecutiveLosses;

      if (hitLossLimit || hitStreakLimit) {
        debugLog('Risk limits hit, stopping bot', {
          sessionLossCents: S.sessionLossCents,
          maxSessionLossCents: S.maxSessionLossCents,
          lossStreak: S.lossStreak,
          maxConsecutiveLosses: S.maxConsecutiveLosses
        });
        setStatusOverlay(formatStatus('risk_limit_hit'));
        api.stop();
        return true;
      }

      return false;
    }

    function analyzeMarketTrend(windowMs) {
      const effectiveWindowMs = Math.max(10 * 1000, windowMs || 30 * 1000);
      const now = Date.now();
      const windowPrices = S.priceHistory.filter(p => now - p.timestamp <= effectiveWindowMs);

      if (windowPrices.length < 6) {
        return { direction: null, confidence: 0, steady: false, volatility: 0, trend: 0, consistency: 0 };
      }

      const prices = windowPrices.map(p => p.price);
      const deltas = [];
      let up = 0;
      let down = 0;

      for (let i = 1; i < prices.length; i++) {
        const delta = prices[i] - prices[i - 1];
        deltas.push(delta);
        if (delta > 0) up++;
        if (delta < 0) down++;
      }

      const trend = prices[prices.length - 1] - prices[0];
      const direction = trend >= 0 ? 'BUY' : 'SELL';
      const consistency = deltas.length ? Math.abs(up - down) / deltas.length : 0;
      const meanDelta = deltas.reduce((a, b) => a + b, 0) / (deltas.length || 1);
      const variance = deltas.reduce((a, b) => a + (b - meanDelta) ** 2, 0) / (deltas.length || 1);
      const volatility = Math.sqrt(variance);
      const strength = Math.min(1, Math.abs(trend) / (volatility * 6 + 1e-6));
      const confidence = clamp01(consistency * strength);
      const steady = consistency >= 0.85 && volatility <= Math.abs(meanDelta) * 3 + 1e-6;

      return { direction, confidence, steady, volatility, trend, consistency };
    }

    function updateAnalysisState() {
      const baseWindowMs = S.analysisWindowSec * 1000;
      const analysis = analyzeMarketTrend(baseWindowMs);
      S.analysisDirection = analysis.direction;
      S.analysisConfidence = analysis.confidence;
      S.analysisSteadyTrend = analysis.steady;
      S.analysisUpdatedAt = Date.now();
      S.analysisWindows = [{ windowMs: baseWindowMs, ...analysis }];
    }

    /* ========================= ROBUST PRICE-BASED TRADE OUTCOME DETECTION ========================= */
    function detectTradeOutcomeByPrice(trade) {
      if (!trade) return null;

      const currentPrice = getCurrentAssetPrice();
      if (!currentPrice || !trade.entryPrice) {
        return null;
      }

      const entryPrice = trade.entryPrice;
      const direction = trade.direction;

      // Enhanced price comparison with tolerance for floating point precision
      const priceDiff = Math.abs(currentPrice - entryPrice);
      const priceTolerance = 0.0001; // Very small tolerance for floating point comparison

      if (priceDiff <= priceTolerance) {
        return 'WIN'; // Exact price match
      }

      if (direction === 'BUY') {
        const outcome = currentPrice > entryPrice ? 'WIN' : 'LOSS';
        return outcome;
      } else if (direction === 'SELL') {
        const outcome = currentPrice < entryPrice ? 'WIN' : 'LOSS';
        return outcome;
      }

      return null;
    }

    function parsePercentValue(text, { allowFraction = false } = {}) {
      if (!text) return null;
      const match = text.match(/(\d{1,3}(?:[.,]\d{1,3})?)\s*%?/);
      if (!match) return null;
      const raw = match[1].replace(',', '.');
      const value = parseFloat(raw);
      if (!Number.isFinite(value)) return null;
      if (allowFraction && value > 0 && value <= 1) {
        return value * 100;
      }
      if (String(text).includes('%') || allowFraction) {
        return value;
      }
      return null;
    }

    function getCurrentPayoutPercent() {
      const isBotUiElement = (el) => !!(el?.closest?.('#iaa-panel')
        || el?.closest?.('#iaa-settings-panel')
        || el?.closest?.(`#${LOGIN_SHELL_ID}`));
      const isLikelyPayoutElement = (el) => {
        if (!el) return false;
        const attrs = [
          el.getAttribute?.('class'),
          el.getAttribute?.('id'),
          el.getAttribute?.('data-test'),
          el.getAttribute?.('data-testid'),
          el.getAttribute?.('data-qa')
        ].filter(Boolean).join(' ').toLowerCase();
        if (attrs.includes('payout') || attrs.includes('profit')) return true;
        return Boolean(el.closest?.('[class*="payout"], [id*="payout"], [data-test*="payout"], [data-testid*="payout"], [data-qa*="payout"], [class*="profit"], [id*="profit"]'));
      };

      for (const selector of C.PAYOUT_SELECTORS) {
        const elements = $$(selector);
        for (const el of elements) {
          if (!visible(el) || isBotUiElement(el)) continue;
          const payout = parsePercentValue(T(el), { allowFraction: true });
          if (payout !== null) {
            return payout;
          }
        }
      }

      const fallbackElements = $$('span,div');
      for (const el of fallbackElements) {
        if (!visible(el) || isBotUiElement(el) || !isLikelyPayoutElement(el)) continue;
        const payout = parsePercentValue(T(el));
        if (payout !== null && payout >= 10 && payout <= 100) {
          return payout;
        }
      }

      return null;
    }

    function getCurrentAssetLabel() {
      for (const selector of C.ASSET_VERIFICATION_SELECTORS) {
        const el = $(selector);
        if (el && visible(el)) {
          return T(el);
        }
      }
      return null;
    }

    function normalizeAssetLabel(label) {
      if (!label) return null;
      return String(label)
        .replace(/\(OTC\)/i, '')
        .replace(/\s+/g, ' ')
        .trim()
        .toUpperCase();
    }

    function setSkipReason(reason) {
      const now = Date.now();
      if (S.lastSkipReason === reason && now - S.lastSkipAt < 3000) return;
      S.lastSkipReason = reason;
      S.lastSkipAt = now;
      S.analysisReason = reason;
      const localizedReason = translateSkipReason(reason);
      const message = formatStatus('skip_reason', { reason: localizedReason });
      setStatusOverlay(message);
      logConsoleLine(message);
    }

    function playCountdownBeep() {
      if (!S.countdownBeepEnabled) return;
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.value = 880;
        gain.gain.value = 0.1;
        oscillator.connect(gain);
        gain.connect(ctx.destination);
        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.15);
        oscillator.onended = () => ctx.close();
      } catch {
        // ignore audio errors
      }
    }

    function isLateReversal(direction) {
      const windowMs = Math.max(2, S.reversalWindowSec) * 1000;
      const now = Date.now();
      const recent = S.priceHistory.filter(p => now - p.timestamp <= windowMs);
      if (recent.length < 4) return false;

      let opposite = 0;
      let total = 0;
      for (let i = 1; i < recent.length; i++) {
        const delta = recent[i].price - recent[i - 1].price;
        if (delta === 0) continue;
        total++;
        if (direction === 'BUY' && delta < 0) opposite++;
        if (direction === 'SELL' && delta > 0) opposite++;
      }

      if (!total) return false;
      const ratio = opposite / total;
      return ratio >= S.reversalOppositeRatio;
    }

    /* ========================= START REAL-TIME PRICE MONITORING ========================= */
    function getPriceHistoryWindowMs() {
      const baseWindowMs = Math.max(60, S.analysisWindowSec || 60) * 1000;
      const reversalWindowMs = Math.max(2, S.reversalWindowSec || 2) * 1000;
      const sniperWindowMs = Math.max(1, S.sniperWarmupMin || 0) * 60 * 1000;
      return Math.max(baseWindowMs, reversalWindowMs, sniperWindowMs);
    }

    function startPriceMonitoring() {
      if (S.priceMonitorInterval) {
        clearInterval(S.priceMonitorInterval);
      }

      S.priceMonitorInterval = setInterval(() => {
        const now = Date.now();
        const currentPrice = getCurrentAssetPrice();
        if (currentPrice !== null) {
          S.currentAssetPrice = currentPrice;
          S.lastPriceAt = now;

          S.priceHistory.push({
            price: currentPrice,
            timestamp: now
          });

          const windowMs = getPriceHistoryWindowMs();
          const cutoff = now - windowMs;
          S.priceHistory = S.priceHistory.filter(p => p.timestamp > cutoff);
        }
      }, C.PRICE_MONITOR_INTERVAL_MS);
    }

    function stopPriceMonitoring() {
      if (S.priceMonitorInterval) {
        clearInterval(S.priceMonitorInterval);
        S.priceMonitorInterval = null;
      }
    }

    /* ========================= FIXED ASSET SELECTION VERIFICATION ========================= */
    function verifyAssetSelection(expectedAsset) {
      const expectedClean = expectedAsset
        .replace(/\(OTC\)/i, '')
        .replace(/\s+/g, ' ')
        .trim()
        .toUpperCase();

      const expectedIsOTC = /OTC/i.test(expectedAsset);

      for (const selector of C.ASSET_VERIFICATION_SELECTORS) {
        const elements = $$(selector);
        for (const el of elements) {
          if (!visible(el)) continue;

          const text = T(el);
          if (!text) continue;

          const textClean = text
            .replace(/\s+/g, ' ')
            .trim()
            .toUpperCase();

          const actualIsOTC = /OTC/i.test(text);

          if (expectedIsOTC !== actualIsOTC) {
            return { verified: false, flipped: true };
          }

          const expectedBase = expectedClean.replace(/\(OTC\)/i, '').trim();
          const actualBase = textClean.replace(/\(OTC\)/i, '').trim();

          if (actualBase === expectedBase ||
              actualBase.includes(expectedBase) ||
              actualBase.replace(/\//g, '') === expectedBase.replace(/\//g, '') ||
              actualBase.replace(/\//g, '').substring(0, 6) === expectedBase.replace(/\//g, '').substring(0, 6)) {
            return { verified: true, flipped: false };
          }
        }
      }

      return { verified: false, flipped: false };
    }

    /* ------------------------- BALANCE OBSERVER --------------------------- */
    function ensureBalanceObserver() {
      if (S.balObs) return;

      const balanceEl = $(C.BALANCE_DEMO_SELECTOR) || $(C.BALANCE_REAL_SELECTOR);
      if (!balanceEl) {
        setTimeout(ensureBalanceObserver, 1000);
        return;
      }

      S.balObs = new MutationObserver(() => {
        const cur = readBalanceCents();
        if (cur != null && cur > 0) {
          S.balance = cur;
        }
      });

      S.balObs.observe(balanceEl, {
        childList: true,
        characterData: true,
        subtree: true,
        characterDataOldValue: true
      });
    }

    /* ========================= ENHANCED PROFIT CALCULATION ========================= */
    function updateProfitDisplay(){
      const el=$id('iaa-profit');
      if (!el) return;

      // Use cycle profit if available, otherwise use total profit
      const profitCents = S.cycleProfitLoss !== 0 ? S.cycleProfitLoss : S.tradeProfitLoss;
      const p = profitCents / 100;

      el.textContent = `$${p.toFixed(2)}`;
      el.style.color = p > 0 ? '#4ade80' : (p < 0 ? '#f87171' : '#e88565');
    }

    /* ========================= KEEP ALIVE SYSTEM ========================= */
    async function performKeepAlive() {
      if (S.keepAliveActive) return;
      if (S.cycleActive || S.tradeSequenceActive || hasActiveTrade() || S.hasLiveSignal) return;

      S.keepAliveActive = true;
      try {
        window.scrollBy(0, 10);
        await delay(500);
        window.scrollBy(0, -10);

        const dropdown = xpathLocator.findElement('assetDropdown');
        if (dropdown && visible(dropdown)) {
          simulateClick(dropdown);
          await delay(500);

          clickAtCoordinates(C.COORD_CLOSE.x, C.COORD_CLOSE.y);
          await delay(500);
        }
      } catch (error) {
        // Silent keep-alive error
      } finally {
        S.keepAliveActive = false;
      }
    }

    function startKeepAlive() {
      if (S.keepAliveInterval) {
        clearInterval(S.keepAliveInterval);
      }

      S.keepAliveInterval = setInterval(() => {
        if (getEffectiveKeepAliveEnabled() && S.running) {
          performKeepAlive();
        }
      }, C.KEEP_ALIVE_INTERVAL_MS);
    }

    function stopKeepAlive() {
      if (S.keepAliveInterval) {
        clearInterval(S.keepAliveInterval);
        S.keepAliveInterval = null;
      }
    }

    /* ========================= INSTANT EXECUTION STATE MANAGEMENT ========================= */
    function resetExecutionState() {
      S.executing = false;
      S.executionAttempts = 0;
      S.executionStartTime = 0;

      if (S.executionTimeoutId) {
        clearTimeout(S.executionTimeoutId);
        S.executionTimeoutId = null;
      }

      setStatusOverlay(formatStatus('looking_for_opportunity'), '', false);
    }

    /* ========================= FIXED UI STATE MANAGEMENT ========================= */
    function setUIState(state, data = {}) {
      S.uiState = state;

      switch (state) {
        case 'IDLE':
          setStatusOverlay(formatStatus('looking_for_opportunity'), '', false);
          stopCountdown();
          hideDirectionIndicator();
          break;

        case 'SWITCHING_ASSET':
          setStatusOverlay(formatStatus('switching_asset'));
          break;

        case 'IDENTIFYING_PATTERN':
          setStatusOverlay(formatStatus('identifying_pattern'));
          if (data.countdownValue) {
            updateCountdownDisplay(data.countdownValue);
          }
          break;

        case 'PATTERN_IDENTIFIED':
          setStatusOverlay(formatStatus('pattern_identified'));
          if (data.countdownValue) {
            updateCountdownDisplay(data.countdownValue, true);
          }
          if (data.direction) {
            showDirectionIndicator(data.direction);
          }
          break;

        case 'EXECUTING':
          setStatusOverlay(formatStatus('trade_executed'));
          if (data.cycleStep > 0) {
            setStatusOverlay(formatStatus('l_activated', { level: data.cycleStep }));
          }
          stopCountdown();
          hideDirectionIndicator();
          break;

        case 'RESULTS':
          if (data.outcome === 'WIN') {
            setStatusOverlay(formatStatus('trade_won'));
          } else if (data.outcome === 'LOSS') {
            setStatusOverlay(formatStatus('trade_lost'));
          } else {
            setStatusOverlay(formatStatus('trade_even'));
          }
          updateProfitDisplay();
          break;
      }
    }

    function updateCountdownDisplay(countdownText, bigCountdown = false) {
      const countdownEl = $id('iaa-countdown');
      if (countdownEl) {
        countdownEl.textContent = countdownText;
        S.countdownValue = countdownText;

        if (bigCountdown) {
          countdownEl.style.fontSize = '14px';
          countdownEl.style.fontWeight = 'bold';
          countdownEl.style.color = '#fbbf24';
        } else {
          countdownEl.style.fontSize = '14px';
          countdownEl.style.fontWeight = '600';
          countdownEl.style.color = '#fbbf24';
        }
      }
    }

    function showDirectionIndicator(direction) {
      const directionEl = $id('iaa-direction-indicator');
      if (directionEl) {
        if (direction === 'BUY') {
          directionEl.innerHTML = '🔼';
          directionEl.style.color = '#22c55e';
          directionEl.style.animation = 'pulse 1s infinite';
          directionEl.style.fontSize = '14px';
        } else if (direction === 'SELL') {
          directionEl.innerHTML = '🔽';
          directionEl.style.color = '#ef4444';
          directionEl.style.animation = 'pulse 1s infinite';
          directionEl.style.fontSize = '14px';
        }
        directionEl.style.display = 'block';
      }
    }

    function hideDirectionIndicator() {
      const directionEl = $id('iaa-direction-indicator');
      if (directionEl) {
        directionEl.style.display = 'none';
        directionEl.style.animation = 'none';
      }
    }

    function stopCountdown() {
      S.countdownActive = false;
      S.countdownTargetTime = 0;
      const countdownEl = $id('iaa-countdown');
      if (countdownEl) {
        countdownEl.textContent = '';
      }
    }

    function startCountdown(targetTime) {
      S.countdownActive = true;
      S.countdownStartTime = Date.now();
      S.countdownTargetTime = targetTime;
      playCountdownBeep();
    }

    /* ========================= ENHANCED TRADE EXECUTION WITH EXACT TIMING ========================= */
    async function executeTradeOrder(signal) {
      if (!S.hasLiveSignal || !S.currentSignal || !S.tradeSequenceActive) return false;
      if (S.executing) return false;
      if (!isSniperMode() && hasActiveTrade()) return false;

      const execKey = signalExecKey(signal);
      if (S.lastExecutedKey === execKey && Date.now() < S.tradeLockUntil) return false;
      if (!S.baseAmount) {
        setSkipReason('Amount');
        return false;
      }
      const enforceAnalysis = S.analysisEnabled;
      const enforceInterval = !isSniperMode();
      const enforcePayout = false;
      const enforceReversal = true;
      if (enforceAnalysis && S.analysisReadyAt && Date.now() < S.analysisReadyAt) {
        setSkipReason('Warmup');
        return false;
      }
      if (S.tradeLockUntil > Date.now()) return false;
      if (enforceInterval && S.nextTradeAllowedAt && Date.now() < S.nextTradeAllowedAt) {
        setSkipReason('Interval');
        return false;
      }
      if (enforceAnalysis) {
        if (!S.analysisDirection) {
          setSkipReason('NoTrend');
          return false;
        }
        if (S.analysisConfidence < S.analysisConfidenceThreshold) {
          setSkipReason('Confidence');
          return false;
        }
        if (S.analysisDirection !== signal.direction.toUpperCase()) {
          setSkipReason('Mismatch');
          return false;
        }
      }
      if (enforcePayout && (S.payoutMin > 0 || S.payoutMax > 0 || S.payoutRequired)) {
        const payout = getCurrentPayoutPercent();
        if (payout === null) {
          if (S.payoutRequired) {
            setSkipReason('Payout');
            return false;
          }
          logConsoleLine(formatStatus('payout_missing'));
        } else {
          if (S.payoutMin > 0 && payout < S.payoutMin) {
            setSkipReason('Payout');
            return false;
          }
          if (S.payoutMax > 0 && payout > S.payoutMax) {
            setSkipReason('Payout');
            return false;
          }
        }
      }
      if (enforceReversal && isLateReversal(signal.direction.toUpperCase())) {
        setSkipReason('Reversal');
        return false;
      }
      S.executing = true;
      S.executionAttempts = 1;
      S.executionStartTime = Date.now();

      const resolvedExpiry = normalizeExpiry(signal.expiry) || S.expirySetting;

      try {
        const expiryOk = await ensurePlatformExpiry(resolvedExpiry);
        if (!expiryOk) {
          setSkipReason('Expiry');
          return false;
        }
        // CAPTURE BALANCE BEFORE TRADE EXECUTION
        const balanceBeforeTrade = await readBalanceWithRetry();
        S.balanceBeforeTrade = balanceBeforeTrade;

        // Capture entry price BEFORE execution
        const entryPrice = getCurrentAssetPrice();
        if (entryPrice) {
          S.tradeEntryPrice = entryPrice;
        }

        logConsoleLine(formatStatus('trade_attempt', { asset: signal.asset, direction: signal.direction.toUpperCase(), expiry: resolvedExpiry }));
        let { up, dn } = getBuySellButtons();
        if (!up && !dn) {
          setSkipReason('Buttons');
          logConsoleLine(formatStatus('trade_buttons_missing'));
          return false;
        }

        const amountCents = calculateTradeAmount(S.baseAmount, S.martingaleSequence);
        if (S.maxTradeAmountCents > 0 && amountCents > S.maxTradeAmountCents) {
          setSkipReason('MaxAmount');
          return false;
        }
        if (S.maxTradeAmountMultiplier > 0 && amountCents > Math.round(S.baseAmount * S.maxTradeAmountMultiplier)) {
          setSkipReason('MaxAmount');
          return false;
        }

        const input = findAmountInput();
        if (input) {
          simulateTyping(input, (amountCents / 100).toFixed(2));
        } else {
          logConsoleLine(formatStatus('trade_amount_missing'));
        }

        const dir = signal.direction.toLowerCase();
        let clicked = false;
        const shouldBurst = S.burstEnabled && S.analysisSteadyTrend && S.analysisConfidence >= S.burstConfidenceThreshold;
        const baseBurst = shouldBurst ? Math.max(1, Math.min(S.burstTradeCount, 5)) : 1;
        const burstCount = Math.max(1, Number.isFinite(signal?.burstCount) ? signal.burstCount : baseBurst);

        if ((dir === 'buy' || dir === 'call' || dir === 'up') && up) {
          for (let i = 0; i < burstCount; i++) {
            simulateClick(up);
            if (i < burstCount - 1) {
              await delay(120);
            }
          }
          clicked = true;
        } else if ((dir === 'sell' || dir === 'put' || dir === 'down') && dn) {
          for (let i = 0; i < burstCount; i++) {
            simulateClick(dn);
            if (i < burstCount - 1) {
              await delay(120);
            }
          }
          clicked = true;
        }
        
        if (!clicked) {
          return false;
        }

        const expiryMs = secsFromTF(resolvedExpiry) * 1000;
        const start = Date.now();
        const trade = {
          amountCents,
          batchCount: burstCount,
          totalAmountCents: amountCents * burstCount,
          direction: dir.toUpperCase(),
          asset: signal.asset,
          startTime: start,
          expiry: resolvedExpiry,
          expectedEnd: start + expiryMs + C.SETTLEMENT_DELAY_MS,
          cycleStep: S.cycleStep,
          entryPrice: entryPrice,
          balanceBefore: balanceBeforeTrade, // Store balance before trade
          source: isSniperMode() ? 'sniper' : 'signal',
          outcomeChecked: false
        };
        S.activeTrades.push(trade);

        S.tradeLockUntil = Date.now() + 1000;
        if (!isSniperMode()) {
          const intervalMin = getActiveTradeIntervalMin();
          S.nextTradeAllowedAt = Date.now() + intervalMin * 60 * 1000;
        }
        S.lastTradeTime = Date.now();
        S.tradeCount++;
        S.lastExecutedKey = execKey;
        S.finalizedTradeId = null;

        logConsoleLine(formatStatus('trade_clicked', { direction: dir.toUpperCase(), amount: `$${(amountCents / 100).toFixed(2)}` }));
        // Update UI to show trade executed
        setUIState('EXECUTING', { cycleStep: S.cycleStep });

        return true;
      } catch (error) {
        return false;
      } finally {
        S.executing = false;
      }
    }

    /* ========================= FIXED: CORRECT OUTCOME DETECTION ========================= */
    async function finalizeActiveTrades() {
      if (!S.activeTrades || !S.activeTrades.length) return;
      const now = Date.now();
      const remaining = [];

      for (const trade of S.activeTrades) {
        if (now < trade.expectedEnd || trade.outcomeChecked) {
          remaining.push(trade);
          continue;
        }

        trade.outcomeChecked = true;

        const balanceBeforeTrade = trade.balanceBefore;
        let balanceAfterTrade = null;
        let balanceOutcome = null;
        let actualProfit = null;
        if (balanceBeforeTrade != null) {
          balanceAfterTrade = await readBalanceWithRetry();
          balanceOutcome = detectTradeOutcomeByBalance(balanceBeforeTrade, balanceAfterTrade);
          if (balanceOutcome) {
            actualProfit = calculateProfitFromBalanceChange(balanceBeforeTrade, balanceAfterTrade);
          }
        }

        if (trade.source === 'signal') {
          if (!balanceOutcome) {
            remaining.push(trade);
            continue;
          }

          S.lastTradeOutcome = balanceOutcome;
          S.cycleProfitLoss = actualProfit;
          S.tradeProfitLoss += actualProfit;
          recordTradeOutcomeForRisk(balanceOutcome, actualProfit);
          recordTradeStats(balanceOutcome);

          debugLog('Trade outcome determined by EXACT BALANCE', {
            outcome: balanceOutcome,
            profit: actualProfit,
            balanceBefore: balanceBeforeTrade,
            balanceAfter: balanceAfterTrade,
            balanceDiff: actualProfit
          });

          const wasCycleActive = S.cycleActive;
          const currentCycleStep = S.cycleStep;

          setUIState('RESULTS', { outcome: balanceOutcome });
          if (applyRiskLimits()) {
            continue;
          }

          if (wasCycleActive && S.cycleActive) {
            if (balanceOutcome === 'LOSS') {
              S.balanceBeforeTrade = balanceAfterTrade;

              if (currentCycleStep === 0 && S.l1Active) {
                immediateMartingaleReentry();
              } else if (currentCycleStep === 1 && S.l2Active) {
                immediateMartingaleReentry();
              } else {
                endCycle();
              }
            } else {
              endCycle();
            }
          } else if (S.cycleActive) {
            endCycle();
          }
        } else if (balanceOutcome) {
          S.lastTradeOutcome = balanceOutcome;
          S.tradeProfitLoss += actualProfit;
          recordTradeOutcomeForRisk(balanceOutcome, actualProfit);
          recordTradeStats(balanceOutcome);
          setUIState('RESULTS', { outcome: balanceOutcome });
          applyRiskLimits();
        } else {
          const priceOutcome = detectTradeOutcomeByPrice(trade);
          if (!priceOutcome) {
            remaining.push(trade);
            continue;
          }

          S.lastTradeOutcome = priceOutcome;
          const profitCents = priceOutcome === 'LOSS' ? -trade.totalAmountCents : trade.totalAmountCents;
          S.tradeProfitLoss += profitCents;
          recordTradeOutcomeForRisk(priceOutcome, profitCents);
          recordTradeStats(priceOutcome);
          setUIState('RESULTS', { outcome: priceOutcome });
          applyRiskLimits();
        }
      }

      S.activeTrades = remaining;
    }

    /* ========================= FIXED: MARTINGALE WITH PROPER BALANCE TRACKING ========================= */
    function immediateMartingaleReentry() {
      // CRITICAL: Only re-enter if the last trade was a LOSS
      if (S.lastTradeOutcome !== 'LOSS') {
        debugLog('Skipping martingale re-entry - last trade was not a loss', { lastOutcome: S.lastTradeOutcome });
        endCycle();
        return;
      }

      if (!S.cycleActive || !S.cycleBaseSignal) {
        endCycle();
        return;
      }

      if (S.cycleStep === 0 && !S.l1Active) {
        endCycle();
        return;
      }

      if (S.cycleStep === 1 && !S.l2Active) {
        endCycle();
        return;
      }

      if (S.cycleStep >= 2) {
        endCycle();
        return;
      }

      S.cycleStep++;
      S.martingaleSequence = S.cycleStep;

      const base = S.cycleBaseSignal;
      const curMin = getCurrentMinute();
      const nextSig = cloneSignalForMinute(base, curMin);

      S.currentSignal = nextSig;
      S.tradeSequenceActive = true;
      S.assetSelecting = false;
      S.assetSelectedForSignal = true;
      S.assetSelectionAttempted = true;
      S.hasLiveSignal = true;
      S.forceImmediate = true;
      S.finalizedTradeId = null;
      S.tradeOutcomeChecked = false;

      debugLog('Martingale reentry activated', {
        cycleStep: S.cycleStep,
        lastOutcome: S.lastTradeOutcome,
        currentBalance: S.balanceBeforeTrade
      });
    }

    function startCycle(sig) {
      S.cycleActive = true;
      S.cycleStep = 0;
      S.cycleBaseSignal = JSON.parse(JSON.stringify(sig));
      S.cycleStartTime = Date.now();
      S.cycleProfitLoss = 0;

      // Capture balance at cycle start for overall profit calculation
      const currentBalance = readBalanceCents();
      if (currentBalance !== null) {
        S.cycleStartBalance = currentBalance;
        S.balanceBeforeTrade = currentBalance; // Set initial baseline
      }

      S.martingaleSequence = 0;
      S.currentSignal = sig;
      S.tradeSequenceActive = true;

      const normalizedExpiry = normalizeExpiry(sig.expiry) || S.expirySetting;
      S.expirySetting = normalizedExpiry;
      const expirySelect = $id('iaa-expiry-setting');
      if (expirySelect) expirySelect.value = normalizedExpiry;
      const expiryLabel = $id('iaa-exp');
      if (expiryLabel) expiryLabel.textContent = normalizedExpiry;
      ensurePlatformExpiry(normalizedExpiry);

      S.assetSelecting = false;
      S.assetSelectedForSignal = false;
      S.assetSelectionAttempted = false;
      S.assetSelectionAttempts = 0;
      S.lastAssetSelectionType = sig.isOTC ? 'OTC' : 'SPOT';
      S.assetSelectionFlipped = false;

      const initialVerification = verifyAssetSelection(sig.asset);
      if (initialVerification.verified) {
        S.assetSelectedForSignal = true;
        S.assetSelectionAttempted = true;
      }

      S.hasLiveSignal = true;
      S.forceImmediate = false;
      S.finalizedTradeId = null;
      S.tradeOutcomeChecked = false;

      resetExecutionState();

      // Show direction indicator immediately when signal is received
      showDirectionIndicator(sig.direction);

      // Start countdown from 60 seconds before execution
      const delayMs = calculateDelay(sig);
      if (typeof delayMs === 'number') {
        S.lastSignalLagSec = delayMs < 0 ? Math.round(Math.abs(delayMs) / 1000) : 0;
        renderLagStatus();
      }
      const countdownStartMs = Math.min(delayMs, 60000);

      if (countdownStartMs > 0) {
        startCountdown(Date.now() + countdownStartMs);
        setUIState('IDENTIFYING_PATTERN', {
          countdownValue: formatCountdown(countdownStartMs)
        });
      }
      if (sig.time) {
        logConsoleLine(formatStatus('signal_scheduled', { time: sig.time, expiry: sig.expiry || S.expirySetting }));
      }

      const expirySecs = secsFromTF(sig.expiry || S.expirySetting);
      const cycleTimeoutMs = expirySecs * 1000 * C.CYCLE_TIMEOUT_MULTIPLIER;

      if (S.cycleTimeoutId) {
        clearTimeout(S.cycleTimeoutId);
      }

      S.cycleTimeoutId = setTimeout(() => {
        if (S.cycleActive) {
          if (hasActiveTrade()) {
            return;
          }
          endCycle();
        }
      }, cycleTimeoutMs);
    }

    function formatCountdown(delayMs) {
      const secondsLeft = Math.max(0, Math.floor(delayMs / 1000));
      const millisecondsLeft = Math.max(0, delayMs % 1000);
      return `${secondsLeft}.${String(Math.floor(millisecondsLeft / 10)).padStart(2, '0')}s`;
    }

    function endCycle() {
      if (hasActiveTrade()) {
        return;
      }

      if (S.cycleTimeoutId) {
        clearTimeout(S.cycleTimeoutId);
        S.cycleTimeoutId = null;
      }

      // Calculate final cycle profit from start to end balance
      const finalBalance = readBalanceCents();
      if (finalBalance !== null && S.cycleStartBalance !== null) {
        const cycleProfit = finalBalance - S.cycleStartBalance;
        debugLog('Cycle completed with final profit calculation', {
          startBalance: S.cycleStartBalance,
          endBalance: finalBalance,
          cycleProfit: cycleProfit
        });
      }

      resetExecutionState();
      stopCountdown();
      hideDirectionIndicator();

      debugLog('Cycle ended', {
        outcome: S.lastTradeOutcome,
        profit: S.cycleProfitLoss,
        step: S.cycleStep
      });

      // Reset cycle state
      S.cycleActive = false;
      S.cycleStep = 0;
      S.cycleBaseSignal = null;
      S.cycleStartTime = 0;
      S.cycleStartBalance = null;
      S.cycleEndBalance = null;

      S.martingaleSequence = 0;
      S.currentSignal = null;
      S.tradeSequenceActive = false;

      S.assetSelecting = false;
      S.assetSelectedForSignal = false;
      S.assetSelectionAttempted = false;
      S.assetSelectionAttempts = 0;
      S.lastAssetSelectionType = null;
      S.assetSelectionFlipped = false;

      S.hasLiveSignal = false;
      S.forceImmediate = false;
      S.tradeOutcomeChecked = false;

      S.lastSignalPollAt = 0;
      S.signalCooldownUntil = Date.now() + 5000;
    }
/* ========================= EXPIRY CALIBRATION (Shift+W) ========================= */
const IAA_EXP_CAL_KEY = 'IAA_EXPIRY_COORDS_V3';

function iaaLoadExpCal() {
  try { return JSON.parse(localStorage.getItem(IAA_EXP_CAL_KEY) || '{}'); }
  catch { return {}; }
}
function iaaSaveExpCal(obj) {
  try { localStorage.setItem(IAA_EXP_CAL_KEY, JSON.stringify(obj || {})); } catch {}
}

// state
S.expiryCoordsV3 = S.expiryCoordsV3 || iaaLoadExpCal();   // {OPEN:{x,y}, S3:{x,y}, ...}
S._calTarget = S._calTarget || null;                      // 'OPEN' | 'S3' | 'S15' | ...
S._mouseXY = S._mouseXY || { x: 0, y: 0 };

// track mouse
document.addEventListener('mousemove', (e) => {
  S._mouseXY = { x: Math.round(e.clientX), y: Math.round(e.clientY) };
}, true);

// Shift+W = save coords for current target
document.addEventListener('keydown', (e) => {
  if (!e.shiftKey) return;
  if (e.code !== 'KeyW') return; // работи независимо от кирилица/латиница

  if (!S._calTarget) {
    logConsoleLine('Калибрация: избери таргет от Settings (OPEN / S30 / S15...).');
    return;
  }

  e.preventDefault();

  const { x, y } = S._mouseXY || {};
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    logConsoleLine('Калибрация: липсва позиция на мишката.');
    return;
  }

  S.expiryCoordsV3 = S.expiryCoordsV3 || {};
  S.expiryCoordsV3[S._calTarget] = { x, y };
  iaaSaveExpCal(S.expiryCoordsV3);

  logConsoleLine(`Калибрация OK: ${S._calTarget} = (${x},${y})`);
}, true);

function iaaSetCalTarget(key) {
  S._calTarget = String(key || '').trim().toUpperCase();
  logConsoleLine(`Калибрация: ${S._calTarget}. Отиди с мишката върху елемента и натисни Shift+W.`);
}

function iaaDumpCal() {
  const obj = (S.expiryCoordsV3 || iaaLoadExpCal());
  console.log('IAA_EXPIRY_COORDS_V3 =', obj);
  return obj;
}

    /* ------------------------- BUTTONS / AMOUNT --------------------------- */
    function visible(el){ return el && el.offsetParent !== null && getComputedStyle(el).visibility !== 'hidden'; }
    function closestClickable(el){ return el?.closest?.('a,button,[role="button"]') || el; }
    function findButtonsBySelectors(selectors){
      for (const sel of selectors){
        const els = $$(sel);
        const cand = els.find(e => visible(e));
        if (cand) return closestClickable(cand);
      }
      return null;
    }

    function findButtonsByText(){
      const region = document.querySelector('#put-call-buttons-chart-1') || document.body;
      const nodes = region.querySelectorAll('a,button,div,span');
      let up=null, dn=null;
      for (const n of nodes){
        if (!visible(n)) continue;
        const txt = T(n).toUpperCase();
        if (!up && (/(^|\b)CALL(\b|$)/.test(txt) || /(\b)BUY(\b)/.test(txt) || txt === '↑' || txt === 'UP')) up = closestClickable(n);
        if (!dn && (/(^|\b)PUT(\b|$)/.test(txt)  || /(\b)SELL(\b)/.test(txt) || txt === '↓' || txt === 'DOWN')) dn = closestClickable(n);
        if (up && dn) break;
      }
      return { up, dn };
    }

    /* ========================= SMART ELEMENT LOCATION ========================= */
    function getBuySellButtons() {
      if (S.buySellMethod === 'xpath') {
        let up = xpathLocator.findElement('buyButton');
        let dn = xpathLocator.findElement('sellButton');

        if (up && dn) {
          return { up: closestClickable(up), dn: closestClickable(dn) };
        }
      }

      let up = findButtonsBySelectors(C.BUY_SELECTORS);
      let dn = findButtonsBySelectors(C.SELL_SELECTORS);

      if (!up || !dn){
        const t = findButtonsByText();
        if (!up) up = t.up;
        if (!dn) dn = t.dn;
      }
      if (!up) up = document.querySelector('[data-test="button-call"], [data-dir="call"], [data-direction="call"]');
      if (!dn) dn = document.querySelector('[data-test="button-put"], [data-dir="put"], [data-direction="put"]');

      return { up: up || null, dn: dn || null };
    }

    function findAmountInput(){
      const ai = $(C.AMOUNT_SELECTOR);
      if (ai) return ai;
      for (const sel of C.ALT_AMOUNT_SELECTORS) {
        const el = $(sel);
        if (el) return el;
      }
      const inputs = $$('input[type="text"]');
      return inputs.find(i => i.offsetParent !== null) || null;
    }

    function findExpiryButton(expiry) {
      const norm = normalizeExpiry(expiry);
      const labels = norm === '5M'
        ? ['5m', '05:00', '5:00', '5 min', '5мин', '5 min', '05 мин', '5 minutes']
        : norm === '5S'
          ? ['5s', '00:05', '0:05', '5 сек', '5sec', '5 secs', '5 seconds', '0:05s', '00:05s']
          : norm === '15S'
            ? ['15s', '00:15', '0:15', '15 сек', '15sec', '15 secs', '15 seconds', '0:15s', '00:15s']
            : norm === '30S'
              ? ['30s', '00:30', '0:30', '30 сек', '30sec', '30 secs', '30 seconds', '0:30s', '00:30s']
              : ['1m', '01:00', '1:00', '1 min', '1мин', '1 minute', '01 мин'];
      const candidates = [];
      const nodes = $$('button,div,span,a');
      for (const el of nodes) {
        if (!visible(el)) continue;
        const text = T(el).trim().toLowerCase();
        if (!text) continue;
        if (labels.some(label => text === label || text.includes(label))) {
          candidates.push(el);
        }
      }
      return candidates[0] || null;
    }

    function normalizeExpiryText(text) {
      if (!text) return null;
      const cleaned = String(text).trim().toLowerCase();
      if (/\b0:05\b/.test(cleaned) || /\b00:05\b/.test(cleaned) || /\b5\s*s(ec|ecs)?\b/.test(cleaned)) {
        return '5S';
      }
      if (cleaned.includes('15')) {
        if (cleaned.includes('00:15') || cleaned.includes('0:15') || cleaned.includes('15s')) return '15S';
      }
      if (cleaned.includes('30')) {
        if (cleaned.includes('00:30') || cleaned.includes('0:30') || cleaned.includes('30s')) return '30S';
      }
      if (cleaned.includes('05:00') || cleaned.includes('5:00') || cleaned.includes('5m') || cleaned.includes('5 мин')) return '5M';
      if (cleaned.includes('01:00') || cleaned.includes('1:00') || cleaned.includes('1m') || cleaned.includes('1 мин')) return '1M';
      const timeMatch = cleaned.match(/\b(\d{1,2}):(\d{2})(?::(\d{2}))?\b/);
      if (!timeMatch) return null;
      const parts = timeMatch.slice(1).map(v => parseInt(v, 10));
      const [a, b, c] = parts;
      const secs = parts.length === 3 ? (a * 3600 + b * 60 + c) : (a * 60 + b);
      if (secs === 15) return '15S';
      if (secs === 30) return '30S';
      if (secs === 60) return '1M';
      if (secs === 300) return '5M';
      return null;
    }

    function getPlatformExpiryLabel() {
      const labelCandidates = $$('div,span,label').filter(el => {
        const txt = T(el).toLowerCase();
        return txt.includes('expiration') || txt.includes('expiry') || txt.includes('време') || txt.includes('истич');
      });
      const timeCandidates = $$('div,span,button').filter(el => {
        if (!visible(el)) return false;
        const txt = T(el);
        return /\b\d{1,2}:\d{2}(:\d{2})?\b/.test(txt) || /(\d+\s*s|\d+\s*сек|\d+\s*min|\d+\s*мин)/i.test(txt);
      });
      for (const labelEl of labelCandidates) {
        const container = labelEl.closest('div') || labelEl.parentElement;
        if (!container) continue;
        const containerTimes = Array.from(container.querySelectorAll('div,span,button')).filter(el => {
          if (!visible(el)) return false;
          return /\b\d{1,2}:\d{2}(:\d{2})?\b/.test(T(el));
        });
        for (const timeEl of containerTimes) {
          const normalized = normalizeExpiryText(T(timeEl));
          if (normalized) return normalized;
        }
      }
      for (const timeEl of timeCandidates) {
        const normalized = normalizeExpiryText(T(timeEl));
        if (normalized) return normalized;
      }
      return null;
    }

    function getExpiryCoords(expiry) {
      const norm = normalizeExpiry(expiry);
      if (!norm) return null;
      const coords = S.expiryCoords?.[norm];
      if (!coords || typeof coords !== 'object') return null;
      if (!Number.isFinite(coords.x) || !Number.isFinite(coords.y)) return null;
      return coords;
    }

    function openExpiryMenu() {
      const timeCandidates = $$('button,div,span').filter(el => {
        if (!visible(el)) return false;
        return /\b\d{1,2}:\d{2}(:\d{2})?\b/.test(T(el));
      });
      if (!timeCandidates.length) return false;
      simulateClick(timeCandidates[0]);
      return true;
    }

    function iaaExpKeyFromNorm(norm){
  const n = String(norm||'').toUpperCase().trim();
  if (n === '3S') return 'S3';
  if (n === '5S') return 'S3';   // ако PO няма 5s в grid -> мап към 3s
  if (n === '15S') return 'S15';
  if (n === '30S') return 'S30';
  if (n === '1M') return 'M1';
  if (n === '3M') return 'M3';
  if (n === '5M') return 'M5';
  return null;
}

async function iaaOpenExpiryMenu() {
  const c = (S.expiryCoordsV3 || {})?.OPEN;
  if (!c || !Number.isFinite(c.x) || !Number.isFinite(c.y)) {
    logConsoleLine('ПРОПУСК: Липсва калибрация за TIME panel (OPEN).');
    S.lastSkipReason = 'Expiry';
    return false;
  }
  clickAtCoordinates(c.x, c.y);
  await delay(120);
  return true;
}

async function ensurePlatformExpiry(expiry) {
  const norm = normalizeExpiry(expiry);
  if (!norm) return false;

  // anti-spam guard (много важно)
  S._expTryTs = S._expTryTs || 0;
  if (Date.now() - S._expTryTs < 900) return false;
  S._expTryTs = Date.now();

  // recent-set guard
  if (S.lastPlatformExpiry === norm && S.lastPlatformExpiryTS && (Date.now() - S.lastPlatformExpiryTS) < 3500) {
    return true;
  }

  const key = iaaExpKeyFromNorm(norm);
  if (!key) {
    logConsoleLine(`ПРОПУСК: Неподдържано време: ${norm}`);
    S.lastSkipReason = 'Expiry';
    return false;
  }

  const btn = (S.expiryCoordsV3 || {})?.[key];
  if (!btn || !Number.isFinite(btn.x) || !Number.isFinite(btn.y)) {
    logConsoleLine(`ПРОПУСК: Липсва калибрация за време: ${key}`);
    S.lastSkipReason = 'Expiry';
    return false;
  }

  // 1) open TIME menu
  const opened = await iaaOpenExpiryMenu();
  if (!opened) return false;

  // 2) click wanted time
  clickAtCoordinates(btn.x, btn.y);
  await delay(140);

  // 3) mark set (не четем UI)
  S.lastPlatformExpiry = norm;
  S.lastPlatformExpiryTS = Date.now();
  S.lastSkipReason = null;
  return true;

      if (coords) {
        openExpiryMenu();
        clickAtCoordinates(coords.x, coords.y);
        await delay(300);
        const updatedExpiry = getPlatformExpiryLabel();
        if (updatedExpiry === norm) {
          S.lastPlatformExpiry = norm;
          return true;
        }
      }
      logConsoleLine(`Не е намерен бутон за време: ${norm}`);
      return false;
    }

    function simulateClick(el){
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = r.left + r.width/2, y = r.top + r.height/2;

      ['mousedown', 'mouseup', 'click'].forEach(t => {
        el.dispatchEvent(new MouseEvent(t, {
          view: window,
          bubbles: true,
          cancelable: true,
          clientX: x,
          clientY: y,
          button: 0
        }));
      });
    }

    function simulateTyping(input, text){
      if (!input) return;
      input.value = text;
      ['input', 'change', 'blur'].forEach(t => {
        input.dispatchEvent(new Event(t, { bubbles: true }));
      });
    }

    /* ========================= HARDCODED COORDINATE CLICK ========================= */
    function clickAtCoordinates(x, y) {
      const element = document.elementFromPoint(x, y);
      if (element) {
        simulateClick(element);
        return true;
      } else {
        return false;
      }
    }

    /* ----------------------------- CYCLE / MARTINGALE ----------------------------- */
    function cloneSignalForMinute(baseSig, minute) {
      return {
        asset: baseSig.asset,
        assetSearch: baseSig.assetSearch,
        isOTC: baseSig.isOTC,
        direction: baseSig.direction,
        expiry: baseSig.expiry,
        minute,
        time: `${String(Math.floor(minute/60)).padStart(2,'0')}:${String(minute%60).padStart(2,'0')}`,
        targetTsMs: toLocalDateForSignal(minute).getTime(),
        rawText: baseSig.rawText || '[internal-martingale]'
      };
    }

    function calculateTradeAmount(base, seq){
      if (!base) return null;
      if (seq===0) return base;
      if (seq===1 && S.l1Active) return Math.round(base*S.l1Multiplier);
      if (seq===2 && S.l2Active) return Math.round(base*S.l2Multiplier);
      return base;
    }

    function signalExecKey(sig) { return `${sig.asset}|${sig.targetTsMs}|${sig.direction}`; }

    function normalizeSignalDirection(value) {
      if (value == null) return null;
      const normalized = String(value).trim().toUpperCase();
      if (!normalized) return null;
      if (['BUY', 'CALL', 'LONG', 'UP', 'BULL', 'HIGH'].includes(normalized)) return 'BUY';
      if (['SELL', 'PUT', 'SHORT', 'DOWN', 'BEAR', 'LOW'].includes(normalized)) return 'SELL';
      if (normalized === '1') return 'BUY';
      if (normalized === '0' || normalized === '-1') return 'SELL';
      if (normalized.includes('BUY') || normalized.includes('CALL') || normalized.includes('LONG') || normalized.includes('UP')) return 'BUY';
      if (normalized.includes('SELL') || normalized.includes('PUT') || normalized.includes('SHORT') || normalized.includes('DOWN')) return 'SELL';
      return null;
    }

    function normalizeSignalAsset(value, otcFlag) {
      if (!value) return null;
      const raw = String(value).trim();
      if (!raw) return null;
      const upper = raw.toUpperCase();
      const pairMatch = upper.match(/([A-Z]{3})[\/\-_ ]?([A-Z]{3})/);
      if (!pairMatch) return null;
      const formattedPair = `${pairMatch[1]}/${pairMatch[2]}`;
      const isOTC = Boolean(otcFlag) || /OTC/i.test(raw);
      const assetLabel = isOTC ? `${formattedPair} (OTC)` : formattedPair;
      return {
        asset: assetLabel,
        assetSearch: formattedPair.replace('/', ''),
        isOTC
      };
    }

    function normalizeSignalExpiry(value) {
      if (value == null || value === '') return null;
      if (typeof value === 'number' && Number.isFinite(value)) {
        if (value === 15 || value === 30) {
          return normalizeExpiry(`${value}S`);
        }
        if (value <= 5) {
          return normalizeExpiry(`${value}M`);
        }
        if (value % 60 === 0) {
          return normalizeExpiry(`${value / 60}M`);
        }
        return normalizeExpiry(String(value));
      }
      const cleaned = String(value).trim();
      if (!cleaned) return null;
      return normalizeExpiry(cleaned);
    }

    function formatTimeFromMinute(minute) {
      const safeMinute = ((minute % 1440) + 1440) % 1440;
      const hour = Math.floor(safeMinute / 60);
      const min = safeMinute % 60;
      return `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
    }

    function extractSignalTimeValue(value) {
      if (value == null) return null;
      if (typeof value === 'number' && Number.isFinite(value)) {
        if (value > 1000000000) {
          const ts = value < 10000000000 ? value * 1000 : value;
          const d = new Date(ts);
          if (!Number.isNaN(d.getTime())) {
            const utc3 = new Date(d.getTime() - 3 * 60 * 60 * 1000);
            return `${String(utc3.getUTCHours()).padStart(2, '0')}:${String(utc3.getUTCMinutes()).padStart(2, '0')}`;
          }
        }
        if (value >= 0 && value < 1440) {
          return formatTimeFromMinute(value);
        }
      }
      const raw = String(value).trim();
      const timeMatch = raw.match(/\b(\d{1,2}:\d{2})/);
      if (timeMatch) return timeMatch[1];
      const parsed = Date.parse(raw);
      if (!Number.isNaN(parsed)) {
        const d = new Date(parsed);
        const utc3 = new Date(d.getTime() - 3 * 60 * 60 * 1000);
        return `${String(utc3.getUTCHours()).padStart(2, '0')}:${String(utc3.getUTCMinutes()).padStart(2, '0')}`;
      }
      return null;
    }

    function parseSignalFromJsonPayload(payload) {
      if (!payload) return null;

      const parseCandidate = (obj) => {
        if (!obj || typeof obj !== 'object') return null;
        const assetRaw = obj.asset || obj.pair || obj.symbol || obj.market || obj.instrument || obj.ticker;
        const directionRaw = obj.direction || obj.side || obj.action || obj.type;
        const timeRaw = obj.time || obj.entry_time || obj.signal_time || obj.timestamp || obj.ts || obj.datetime || obj.date || obj.minute;
        const expiryRaw = obj.expiry || obj.expiration || obj.exp || obj.tf || obj.timeframe || obj.period;
        const otcFlag = obj.otc ?? obj.isOTC ?? obj.is_otc ?? obj.market_type;
        const otcValue = typeof otcFlag === 'string' ? /OTC/i.test(otcFlag) : Boolean(otcFlag);

        const direction = normalizeSignalDirection(directionRaw);
        const assetInfo = normalizeSignalAsset(assetRaw, otcValue);
        const time = extractSignalTimeValue(timeRaw);
        if (!direction || !assetInfo || !time) return null;

        const expiry = normalizeSignalExpiry(expiryRaw) || normalizeExpiry(S.expirySetting) || '1M';
        const computedMinute = computeSignalMinute(time, expiry, S.signalTimeOffsetMin);
        if (!computedMinute) return null;

        const targetTsMs = resolveSignalTargetTs(computedMinute.totalMinute, computedMinute.normalizedExpiry);
        if (!targetTsMs) return null;
        return {
          asset: assetInfo.asset,
          assetSearch: assetInfo.assetSearch,
          isOTC: assetInfo.isOTC,
          direction,
          time,
          expiry: computedMinute.normalizedExpiry,
          minute: computedMinute.totalMinute,
          targetTsMs,
          rawText: JSON.stringify(obj),
          signalKey: `${assetInfo.assetSearch}|${computedMinute.totalMinute}|${direction}|${assetInfo.isOTC ? 'OTC' : 'REAL'}`
        };
      };

      const walk = (node, depth = 0) => {
        if (node == null || depth > 4) return null;
        if (Array.isArray(node)) {
          for (let i = node.length - 1; i >= 0; i -= 1) {
            const found = walk(node[i], depth + 1);
            if (found) return found;
          }
          return null;
        }
        if (typeof node === 'object') {
          const candidate = parseCandidate(node);
          if (candidate) return candidate;
          const preferredKeys = ['signal', 'data', 'result', 'payload', 'message'];
          for (const key of preferredKeys) {
            if (Object.prototype.hasOwnProperty.call(node, key)) {
              const found = walk(node[key], depth + 1);
              if (found) return found;
            }
          }
          for (const value of Object.values(node)) {
            const found = walk(value, depth + 1);
            if (found) return found;
          }
        }
        return null;
      };

      return walk(payload, 0);
    }

    function extractSignalTextFromResponse(text) {
      if (!text) return '';
      const hasFlagEmoji = (value) => /\p{Regional_Indicator}{2}/u.test(value || '');
      const currencyPairRegex = /\b[A-Z]{3}\/?[A-Z]{3}\b/;
      const isLikelySignal = (messageText) => {
        if (!messageText) return false;
        const upper = messageText.toUpperCase();
        if (upper.includes('WINS') || upper.includes('LOSSES') || upper.includes('BOT IS ON FIRE')) return false;
        const hasPair = currencyPairRegex.test(upper);
        const hasPairMarker = upper.includes('OTC') || messageText.includes('💷') || messageText.includes('💎') || messageText.includes('💳') || hasFlagEmoji(messageText);
        const hasSignalLabel = upper.includes('SIGNAL') || upper.includes('INFINITY AI');
        const hasPairLabel = upper.includes('PAIR:') || upper.includes('PAIR ');
        const hasExpiry = upper.includes('EXP:') || /\bM\s*\d+\b/i.test(messageText) || /(\d+)\s*(M|MIN|S|SEC)\b/i.test(messageText);
        const hasTime = /\b\d{1,2}:\d{2}(?::\d{2})?\b/.test(messageText);
        const hasDirection = upper.includes('BUY') || upper.includes('SELL') || upper.includes('CALL') || upper.includes('PUT') || upper.includes('LONG') || upper.includes('SHORT') || upper.includes('UP') || upper.includes('DOWN') || messageText.includes('🔼') || messageText.includes('🔽');
        const hasTimeOrExpiry = hasTime || hasExpiry;
        if (!hasTimeOrExpiry) {
          return hasPair && hasDirection && (hasSignalLabel || hasPairLabel || hasPairMarker);
        }
        return hasPair && hasDirection && hasTimeOrExpiry;
      };
      const findSignalTextInObject = (obj, depth = 0) => {
        if (depth > 4 || obj == null) return '';
        if (typeof obj === 'string') return obj;
        if (Array.isArray(obj)) {
          for (let i = obj.length - 1; i >= 0; i -= 1) {
            const found = findSignalTextInObject(obj[i], depth + 1);
            if (found && isLikelySignal(found)) return found;
          }
          return '';
        }
        if (typeof obj === 'object') {
          const preferredKeys = ['text', 'message', 'raw', 'content', 'data', 'result', 'body'];
          for (const key of preferredKeys) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
              const found = findSignalTextInObject(obj[key], depth + 1);
              if (found && isLikelySignal(found)) return found;
            }
          }
          for (const value of Object.values(obj)) {
            const found = findSignalTextInObject(value, depth + 1);
            if (found && isLikelySignal(found)) return found;
          }
        }
        return '';
      };
      const trimmed = text.trim();
      if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        try {
          const parsed = JSON.parse(trimmed);
          const candidate = findSignalTextInObject(parsed);
          if (candidate && isLikelySignal(candidate)) {
            return candidate.trim();
          }
        } catch {}
      }
      if (text.includes('tgme_widget_message_text') || text.includes('<html')) {
        const doc = new DOMParser().parseFromString(text, 'text/html');
        const messages = Array.from(doc.querySelectorAll('.tgme_widget_message_text'));
        for (let i = messages.length - 1; i >= 0; i -= 1) {
          const candidate = messages[i]?.textContent?.trim();
          if (isLikelySignal(candidate)) {
            return candidate;
          }
        }
        return '';
      }
      return isLikelySignal(trimmed) ? trimmed : '';
    }

    /* ========================= ENHANCED SIGNAL FETCHING ========================= */
    async function fetchAPISignals() {
      const now = Date.now();

      if (S.cycleActive || S.tradeSequenceActive || hasActiveTrade() || S.hasLiveSignal || S.executing || now < S.signalCooldownUntil) {
        return [];
      }

      if (now - S.lastSignalPollAt < C.SIGNAL_POLL_MS) return [];
      S.lastSignalPollAt = now;

      const validSignals = [];

      for (const source of C.SIGNAL_SOURCES) {
        if (source.key && S.signalSourceEnabled[source.key] === false) {
          continue;
        }
        try {
          const separator = source.url.includes('?') ? '&' : '?';
          const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(source.url + `${separator}t=` + Date.now())}`;
          const response = await fetch(proxyUrl, {
            method: 'GET',
            headers: {
              'Accept': 'text/plain',
              'Cache-Control': 'no-cache'
            }
          });

          if (!response.ok) {
            logSignalStatus(source, 'signal_fetch_failed');
            continue;
          }

          updateClockDriftFromResponse(response);

          const rawText = await response.text();
          const trimmed = rawText.trim();
          let parsedJson = null;
          if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
            try {
              parsedJson = JSON.parse(trimmed);
            } catch {}
          }
          const text = extractSignalTextFromResponse(rawText);

          if ((!text || text === "No message" || text.includes("No message")) && !parsedJson) {
            logSignalStatus(source, 'signal_empty', { minIntervalMs: 300000 });
            continue;
          }

          const hashSource = text || (parsedJson ? JSON.stringify(parsedJson) : '');
          const signalHash = createSignalHash(hashSource);
          const lastHash = S.lastProcessedSignalHashes.get(source.url);
          if (lastHash === signalHash) {
            logSignalStatus(source, 'signal_duplicate', { minIntervalMs: 300000 });
            continue;
          }

          const delivery = { raw: text, json: parsedJson };

          try {
            const signal = parseRawSignalInExtension(delivery);

            if (signal) {
              if (source.expiryOverride) {
                signal.expiry = source.expiryOverride;
                const computedMinute = computeSignalMinute(signal.time, signal.expiry, S.signalTimeOffsetMin);
                if (computedMinute) {
                  signal.expiry = computedMinute.normalizedExpiry;
                  signal.minute = computedMinute.totalMinute;
                  signal.targetTsMs = resolveSignalTargetTs(computedMinute.totalMinute, computedMinute.normalizedExpiry);
                  signal.signalKey = buildSignalKey(signal);
                } else {
                  signal.expiry = normalizeExpiry(signal.expiry) || signal.expiry;
                }
              }
              if (!signal.targetTsMs) {
                logSignalStatus(source, 'signal_stale', { minIntervalMs: 120000 });
                continue;
              }
              signal.isSignalSource = true;
              S.lastProcessedSignalHashes.set(source.url, signalHash);
              S.signalCooldownUntil = Date.now() + 30000;
              logConsoleLine(formatStatus('signal_received', {
                source: source.label,
                asset: signal.asset,
                direction: signal.direction,
                expiry: signal.expiry
              }));

              if (!isDuplicateSignal(signal)) {
                validSignals.push(signal);
              }
            } else {
              logSignalStatus(source, 'signal_parse_failed', { minIntervalMs: 120000 });
              const snippet = text || (parsedJson ? JSON.stringify(parsedJson) : '');
              logSignalSnippet(source, snippet, { force: true });
            }
          } catch (error) {
            debugLog('Error processing signal text', { error: error.message });
            const snippet = text || (parsedJson ? JSON.stringify(parsedJson) : '');
            logSignalSnippet(source, snippet, { force: true });
          }
        } catch (error) {
          continue;
        }
      }

      return validSignals;
    }

    /* ========================= NEW: SIGNAL DEDUPLICATION ========================= */
    function createSignalHash(text) {
      return text.replace(/\s+/g, ' ').trim().substring(0, 100);
    }

    function buildSignalKey(signal) {
      if (!signal) return null;
      return `${signal.assetSearch}|${signal.minute}|${signal.direction}|${signal.isOTC ? 'OTC' : 'REAL'}`;
    }

    function computeSignalMinute(time, expiry, offsetMin) {
      if (!time) return null;
      const normalizedExpiry = normalizeExpiry(expiry || '1M');
      const timeParts = String(time).split(':');
      const hour = parseInt(timeParts[0], 10) || 0;
      const minute = parseInt(timeParts[1], 10) || 0;
      const rawMinute = hour * 60 + minute;
      const offset = Number.isFinite(offsetMin)
        ? offsetMin
        : 0;
      const totalMinute = (rawMinute + offset + 1440) % 1440;

      return { normalizedExpiry, totalMinute };
    }

    function isDuplicateSignal(signal) {
      const key = buildSignalKey(signal);
      if (!key) return true;
      const now = Date.now();
      const ttlMs = 3 * 60 * 1000;

      for (const [k, ts] of S.recentSignalKeys.entries()) {
        if (now - ts > ttlMs) {
          S.recentSignalKeys.delete(k);
        }
      }

      if (S.recentSignalKeys.has(key)) {
        return true;
      }

      S.recentSignalKeys.set(key, now);
      return false;
    }

    /* ========================= ENHANCED INFINITY AI PARSER FOR PLAIN TEXT ========================= */
    function parseRawSignalInExtension(delivery) {
      if (!delivery?.raw && !delivery?.json) {
        return null;
      }

      if (delivery?.json) {
        const jsonSignal = parseSignalFromJsonPayload(delivery.json);
        if (jsonSignal) {
          jsonSignal.delivery_id = delivery.id || Date.now();
          jsonSignal.received_at = delivery.received_at || new Date().toISOString();
          jsonSignal.raw_delivery = delivery;
          return jsonSignal;
        }
      }

      if (!delivery.raw) {
        return null;
      }

      const rawText = delivery.raw;
      const signal = parseInfinityAISignalFormat(rawText);

      if (signal) {
        signal.delivery_id = delivery.id || Date.now();
        signal.received_at = delivery.received_at || new Date().toISOString();
        signal.raw_delivery = delivery;
        return signal;
      }

      return null;
    }

    function parseInfinityAISignalFormat(text) {
      const cleanText = text.replace(/\r\n/g, '\n').replace(/\n+/g, '\n').trim();
      const lines = cleanText.split('\n').map(line => line.trim()).filter(line => line.length > 0);

      let pair = null;
      let expiry = null;
      let time = null;
      let direction = null;
      let isOTC = false;

      for (const line of lines) {
        const upper = line.toUpperCase();
        const hasOtc = /OTC/i.test(upper);
        const hasCurrencyEmoji = line.includes('💷') || line.includes('💎') || line.includes('💳') || /\p{Regional_Indicator}{2}/u.test(line);
        const isPairLine = line.startsWith('Pair:') || hasOtc || hasCurrencyEmoji;

        if (!pair && isPairLine) {
          if (line.startsWith('Pair:')) {
            pair = line.replace('Pair:', '').trim();
            isOTC = /OTC/i.test(pair);
          } else {
            const pairMatch = upper.match(/\b([A-Z]{3}\/?[A-Z]{3})(?:-?OTC)?\b/);
            if (pairMatch) {
              pair = pairMatch[1];
              isOTC = hasOtc;
            }
          }
        }

        if (!expiry) {
          if (line.startsWith('EXP:')) {
            expiry = line.replace('EXP:', '').trim();
          } else if (/\bM\s*\d+\b/i.test(line)) {
            const expMatch = line.match(/\bM\s*(\d+)\b/i);
            if (expMatch) {
              expiry = `${expMatch[1]}M`;
            }
          } else if (/(\d+)\s*S(EC|ECS)?\b/i.test(line)) {
            const expMatch = line.match(/(\d+)\s*S(EC|ECS)?\b/i);
            if (expMatch) {
              expiry = `${expMatch[1]}S`;
            }
          } else if (/(\d+)\s*(M|MIN)/i.test(line)) {
            const expMatch = line.match(/(\d+)\s*(M|MIN)/i);
            if (expMatch) {
              expiry = `${expMatch[1]}M`;
            }
          }
        }

        if (!time && (line.includes('⌚️') || line.startsWith('Time:'))) {
          const timeMatch = line.match(/(\d{1,2}:\d{2})/);
          if (timeMatch) {
            time = timeMatch[1];
          }
        } else if (!time && /\b\d{1,2}:\d{2}\b/.test(line)) {
          const timeMatch = line.match(/(\d{1,2}:\d{2})/);
          if (timeMatch) {
            time = timeMatch[1];
          }
        }

        if (!direction && (upper.includes('BUY') || upper.includes('SELL') || upper.includes('CALL') || upper.includes('PUT') || upper.includes('LONG') || upper.includes('SHORT') || upper.includes('UP') || upper.includes('DOWN') || line.includes('🔼') || line.includes('🔽'))) {
          if (upper.includes('BUY') || upper.includes('CALL') || upper.includes('LONG') || upper.includes('UP') || line.includes('🔼')) {
            direction = 'BUY';
          } else if (upper.includes('SELL') || upper.includes('PUT') || upper.includes('SHORT') || upper.includes('DOWN') || line.includes('🔽')) {
            direction = 'SELL';
          }
        }
      }

      if (pair && direction && time) {
        let cleanPair = pair.replace('-OTC', '').replace(/OTC/i, '').trim();

        let formattedPair = cleanPair;
        if (cleanPair.length === 6 && !cleanPair.includes('/')) {
          formattedPair = cleanPair.slice(0, 3) + '/' + cleanPair.slice(3);
        }

        const assetLabel = isOTC ? formattedPair + ' (OTC)' : formattedPair;
        const assetSearch = formattedPair.replace('/', '');

        const computedMinute = computeSignalMinute(time, expiry, S.signalTimeOffsetMin);
        if (!computedMinute) {
          return null;
        }

        const totalMinute = computedMinute.totalMinute;
        const normalizedExpiry = computedMinute.normalizedExpiry;
        const targetTsMs = resolveSignalTargetTs(totalMinute, normalizedExpiry);
        if (!targetTsMs) {
          return null;
        }

        const signal = {
          asset: assetLabel,
          assetSearch: assetSearch,
          isOTC: isOTC,
          direction: direction,
          time: time,
          expiry: normalizedExpiry,
          minute: totalMinute,
          targetTsMs,
          rawText: text,
          signalKey: `${assetSearch}|${totalMinute}|${direction}|${isOTC ? 'OTC' : 'REAL'}`
        };

        return signal;
      }

      return null;
    }

    /* ========================= SNIPER ANALYSIS HELPERS ========================= */
    const SNIPER_TF_MS = {
      '5s': 5000,
      '15s': 15000,
      '30s': 30000,
      '1m': 60000
    };

    function getSniperTimeframes() {
      return Object.keys(SNIPER_TF_MS).filter(tf => S.sniperEnabledTimeframes[tf]);
    }

    function getCandleAt(endTs, windowMs) {
      const startTs = endTs - windowMs;
      const ticks = S.priceHistory.filter(p => p.timestamp >= startTs && p.timestamp <= endTs);
      if (ticks.length < 2) return null;
      let high = -Infinity;
      let low = Infinity;
      for (const tick of ticks) {
        high = Math.max(high, tick.price);
        low = Math.min(low, tick.price);
      }
      return {
        startTs,
        endTs,
        open: ticks[0].price,
        close: ticks[ticks.length - 1].price,
        high,
        low
      };
    }

    function getTimeInCandleSec(windowMs) {
      return (Date.now() % windowMs) / 1000;
    }

    function getCandleStart(windowMs) {
      return Math.floor(Date.now() / windowMs) * windowMs;
    }

    function calcSniperVwap(windowMs) {
      const endTs = Date.now();
      const startTs = endTs - windowMs;
      const ticks = S.priceHistory.filter(p => p.timestamp >= startTs && p.timestamp <= endTs);
      if (!ticks.length) return null;
      const sum = ticks.reduce((acc, tick) => acc + tick.price, 0);
      return sum / ticks.length;
    }

    function clampSym(value) {
      return Math.max(-1, Math.min(1, value));
    }

    function getRecentPrices(count) {
      if (!S.priceHistory.length) return [];
      return S.priceHistory.slice(-count).map(p => p.price);
    }

    function getPricesForWindow(windowMs, minCount = 2) {
      const endTs = Date.now();
      const startTs = endTs - windowMs;
      const prices = S.priceHistory
        .filter(p => p.timestamp >= startTs && p.timestamp <= endTs)
        .map(p => p.price);
      if (prices.length < minCount) return [];
      return prices;
    }

    function samplePricesForWindow(windowMs, points) {
      if (points < 2) return [];
      const endTs = Date.now();
      const startTs = endTs - windowMs;
      const ticks = S.priceHistory
        .filter(p => p.timestamp >= startTs && p.timestamp <= endTs);
      if (ticks.length < 2) return [];
      const step = windowMs / (points - 1);
      const samples = [];
      let idx = 0;
      for (let i = 0; i < points; i += 1) {
        const targetTs = startTs + step * i;
        while (idx < ticks.length - 1 && ticks[idx + 1].timestamp <= targetTs) {
          idx += 1;
        }
        samples.push(ticks[idx].price);
      }
      return samples;
    }

    function calcEma(prices, period) {
      if (!prices.length || period <= 1) return prices[prices.length - 1] ?? null;
      const k = 2 / (period + 1);
      let ema = prices[0];
      for (let i = 1; i < prices.length; i += 1) {
        ema = prices[i] * k + ema * (1 - k);
      }
      return ema;
    }

    function calcRsi(prices, period) {
      if (prices.length < period + 1) return null;
      let gains = 0;
      let losses = 0;
      for (let i = prices.length - period; i < prices.length; i += 1) {
        const delta = prices[i] - prices[i - 1];
        if (delta > 0) gains += delta;
        if (delta < 0) losses += Math.abs(delta);
      }
      const avgGain = gains / period;
      const avgLoss = losses / period;
      if (avgLoss === 0) return 100;
      const rs = avgGain / avgLoss;
      return 100 - (100 / (1 + rs));
    }

    function calcStochastic(prices, period) {
      if (prices.length < period) return null;
      const slice = prices.slice(-period);
      const low = Math.min(...slice);
      const high = Math.max(...slice);
      if (high === low) return 50;
      const close = slice[slice.length - 1];
      return ((close - low) / (high - low)) * 100;
    }

    function calcSharpeScore(windowMs) {
      const endTs = Date.now();
      const startTs = endTs - windowMs;
      const ticks = S.priceHistory.filter(p => p.timestamp >= startTs && p.timestamp <= endTs);
      if (ticks.length < 3) return 0;
      const returns = [];
      for (let i = 1; i < ticks.length; i += 1) {
        const prev = ticks[i - 1].price;
        if (!prev) continue;
        returns.push((ticks[i].price - prev) / prev);
      }
      if (!returns.length) return 0;
      const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
      const variance = returns.reduce((a, b) => a + (b - mean) ** 2, 0) / returns.length;
      const std = Math.sqrt(variance);
      if (!std) return 0;
      const sharpe = mean / std;
      return Math.tanh(sharpe / 2);
    }

    function calcVolumeScore(windowMs, threshold) {
      const endTs = Date.now();
      const startTs = endTs - windowMs;
      const ticks = S.priceHistory.filter(p => p.timestamp >= startTs && p.timestamp <= endTs);
      const rate = ticks.length / Math.max(windowMs / 1000, 1);
      const historyWindowMs = Math.max(60000, (S.sniperWarmupMin || 10) * 60 * 1000);
      const historyTicks = S.priceHistory.filter(p => p.timestamp >= endTs - historyWindowMs && p.timestamp <= endTs);
      const avgRate = historyTicks.length / Math.max(historyWindowMs / 1000, 1);
      if (!avgRate) return 0;
      const delta = (rate / avgRate) - 1;
      const scale = threshold > 0 ? threshold : 1;
      return clampSym(delta / scale);
    }

    function calcTrendDirection(windowMs, lookback = 3) {
      const now = Date.now();
      let firstClose = null;
      let lastClose = null;
      for (let i = lookback - 1; i >= 0; i--) {
        const endTs = now - i * windowMs;
        const candle = getCandleAt(endTs, windowMs);
        if (!candle) continue;
        if (firstClose == null) firstClose = candle.close;
        lastClose = candle.close;
      }
      if (firstClose == null || lastClose == null) return 0;
      if (lastClose > firstClose) return 1;
      if (lastClose < firstClose) return -1;
      return 0;
    }

    function calcSniperDecision(tfKey) {
      const windowMs = SNIPER_TF_MS[tfKey];
      const candle = getCandleAt(Date.now(), windowMs);
      if (!candle) return null;
      const isProProfile = S.sniperProfile === 'pro';
      const isFiveSecond = S.sniperProfile === '5s';
      const open = candle.open;
      const close = candle.close;
      const rangePct = open ? (candle.high - candle.low) / open : 0;
      const momentum = open ? (close - open) / open : 0;
      const vwapWindowMs = Math.max(windowMs * 2, 30000);
      const vwap = calcSniperVwap(vwapWindowMs);
      const vwapDist = vwap ? (close - vwap) / vwap : 0;
      let trendDir = calcTrendDirection(windowMs);

      const baseWeights = isFiveSecond
        ? {
          vwap: 0.6,
          momentum: 0.4
        }
        : {
          vwap: 0.3,
          momentum: 0.25,
          trend: 0.15,
          rsi: 0.1,
          stoch: 0.1,
          ema: 0.05,
          volume: 0.03,
          sharpe: 0.02
        };
      const weights = isProProfile ? S.sniperProWeights : baseWeights;
      const totalWeights = Object.values(weights).reduce((a, b) => a + b, 0) || 1;
      const vwapScale = S.sniperVwapDeviation > 0 ? S.sniperVwapDeviation : 1;
      const momentumScale = S.sniperMomentumThreshold > 0 ? S.sniperMomentumThreshold : 1;
      const vwapScore = clampSym(vwapDist / vwapScale);
      const momentumScore = clampSym(momentum / momentumScale);
      let rsi = null;
      let stoch = null;
      let emaFast = null;
      let emaSlow = null;
      let emaDirection = 0;
      let emaScore = 0;
      let rsiScore = 0;
      let stochScore = 0;
      let volumeScore = 0;
      let sharpeScore = 0;
      if (!isFiveSecond) {
        const indicatorCount = Math.max(S.sniperRsiWindow, S.sniperStochWindow, S.sniperEmaSlow, 2) + 1;
        const indicatorPrices = samplePricesForWindow(windowMs, indicatorCount);
        rsi = calcRsi(indicatorPrices, S.sniperRsiWindow);
        stoch = calcStochastic(indicatorPrices, S.sniperStochWindow);
        emaFast = calcEma(indicatorPrices, S.sniperEmaFast);
        emaSlow = calcEma(indicatorPrices, S.sniperEmaSlow);
        const emaDiffPct = emaFast && emaSlow && close ? (emaFast - emaSlow) / close : 0;
        const emaScale = vwapScale > 0 ? vwapScale : 0.001;
        emaScore = clampSym(emaDiffPct / emaScale);
        emaDirection = emaFast != null && emaSlow != null
          ? (emaFast > emaSlow ? 1 : emaFast < emaSlow ? -1 : 0)
          : 0;
        if (trendDir === 0 && emaDirection !== 0) {
          trendDir = emaDirection;
        }
        rsiScore = rsi == null
          ? 0
          : (rsi <= S.sniperRsiOversold ? 1 : rsi >= S.sniperRsiOverbought ? -1 : clampSym((50 - rsi) / 50));
        stochScore = stoch == null
          ? 0
          : (stoch <= S.sniperStochOversold ? 1 : stoch >= S.sniperStochOverbought ? -1 : clampSym((50 - stoch) / 50));
        volumeScore = calcVolumeScore(windowMs, S.sniperVolumeThreshold);
        const sharpeWindowMs = Math.max(windowMs * 2, (S.sniperSharpeWindowMin || 5) * 60 * 1000);
        sharpeScore = calcSharpeScore(sharpeWindowMs);
      }
      const trendScore = isFiveSecond ? 0 : trendDir;

      let score = vwapScore * (weights.vwap ?? 0)
        + momentumScore * (weights.momentum ?? 0)
        + trendScore * (weights.trend ?? 0)
        + rsiScore * (weights.rsi ?? 0)
        + stochScore * (weights.stoch ?? 0)
        + emaScore * (weights.ema ?? 0)
        + volumeScore * (weights.volume ?? 0)
        + sharpeScore * (weights.sharpe ?? 0);
      if (isProProfile) {
        score += trendScore * (S.sniperProTrendBias || 0);
      }
      const confidence = Math.min(
        1,
        (Math.abs(vwapScore) * (weights.vwap ?? 0)
          + Math.abs(momentumScore) * (weights.momentum ?? 0)
          + Math.abs(trendScore) * (weights.trend ?? 0)
          + Math.abs(rsiScore) * (weights.rsi ?? 0)
          + Math.abs(stochScore) * (weights.stoch ?? 0)
          + Math.abs(emaScore) * (weights.ema ?? 0)
          + Math.abs(volumeScore) * (weights.volume ?? 0)
          + Math.abs(sharpeScore) * (weights.sharpe ?? 0))
          / totalWeights
      );
      let direction = score > 0 ? 'BUY' : score < 0 ? 'SELL' : null;
      if (!direction) {
        const weightedSignals = [
          { value: vwapScore, weight: weights.vwap ?? 0 },
          { value: momentumScore, weight: weights.momentum ?? 0 },
          { value: trendScore, weight: weights.trend ?? 0 },
          { value: rsiScore, weight: weights.rsi ?? 0 },
          { value: stochScore, weight: weights.stoch ?? 0 },
          { value: emaScore, weight: weights.ema ?? 0 },
          { value: volumeScore, weight: weights.volume ?? 0 },
          { value: sharpeScore, weight: weights.sharpe ?? 0 }
        ];
        weightedSignals.sort((a, b) => Math.abs(b.value * b.weight) - Math.abs(a.value * a.weight));
        const lead = weightedSignals[0];
        if (lead && lead.value !== 0) {
          direction = lead.value > 0 ? 'BUY' : 'SELL';
        }
      }
      if (!isFiveSecond && trendDir === 0 && emaDirection === 0 && direction) {
        trendDir = direction === 'BUY' ? 1 : -1;
      }
      const trendAligned = isFiveSecond
        ? true
        : trendDir !== 0 && (emaDirection === 0 || trendDir === emaDirection);
      const rsiConfirm = isFiveSecond
        ? true
        : rsi != null && (trendDir > 0 ? rsi <= S.sniperRsiOverbought : rsi >= S.sniperRsiOversold);
      const stochConfirm = isFiveSecond
        ? true
        : stoch != null && (trendDir > 0 ? stoch <= S.sniperStochOverbought : stoch >= S.sniperStochOversold);

      let allowEntry = false;
      let riskLevel = 'stable';
      let requiredConfidence = S.sniperThreshold;
      if (isProProfile) {
        const baseThreshold = typeof S.sniperProScoreThreshold === 'number' ? S.sniperProScoreThreshold : 0.55;
        const isRisky = !trendAligned || !rsiConfirm || !stochConfirm;
        riskLevel = isRisky ? 'risk' : 'stable';
        const stableThreshold = Math.max(0.3, baseThreshold - 0.05);
        const riskyThreshold = Math.min(0.95, baseThreshold + (S.sniperProRiskPremium || 0));
        requiredConfidence = isRisky ? riskyThreshold : stableThreshold;
        if (Math.abs(momentumScore) < (S.sniperProMomentumGate || 0)) {
          allowEntry = false;
        }
        if (trendDir !== 0 && Math.abs(score) < 0.15) {
          direction = trendDir > 0 ? 'BUY' : 'SELL';
        }
        allowEntry = direction != null && confidence >= requiredConfidence;
        if (allowEntry && isRisky) {
          const windowMs = 30 * 60 * 1000;
          const now = Date.now();
          S.sniperProRiskSamples = (S.sniperProRiskSamples || []).filter(s => now - s.ts <= windowMs);
          const total = S.sniperProRiskSamples.length;
          const risky = S.sniperProRiskSamples.filter(s => s.risk).length;
          const ratio = total ? risky / total : 0;
          if (ratio >= (S.sniperProRiskRatio || 0)) {
            allowEntry = false;
          }
        }
      } else {
        if (trendAligned && trendDir !== 0) {
          direction = trendDir > 0 ? 'BUY' : 'SELL';
        } else if (!isFiveSecond) {
          direction = null;
        }
        allowEntry = direction != null && confidence >= S.sniperThreshold;
      }

      return {
        tfKey,
        confidence,
        direction,
        rangePct,
        vwapDist,
        momentum,
        trendDir,
        trendAligned,
        rsiConfirm,
        stochConfirm,
        allowEntry,
        riskLevel,
        requiredConfidence
      };
    }

    function sniperWarmupRemainingMs() {
      if (!S.sniperWarmupUntil) return 0;
      return Math.max(0, S.sniperWarmupUntil - Date.now());
    }

    function getSniperWarmupWindowMs() {
      const assetLabel = getCurrentAssetLabel() || '';
      const isOtcAsset = /OTC/i.test(assetLabel);
      const baseMin = Math.max(2, S.sniperWarmupMin || 10);
      const capMin = isOtcAsset ? 2 : 3;
      const effectiveMin = Math.min(capMin, baseMin);
      return effectiveMin * 60 * 1000;
    }

    function isSniperWarmupReady() {
      const timeReady = sniperWarmupRemainingMs() === 0;
      const windowMs = getSniperWarmupWindowMs();
      const oldest = S.priceHistory.length ? S.priceHistory[0].timestamp : 0;
      const ageMs = oldest ? Date.now() - oldest : 0;
      if (!timeReady) {
        return false;
      }
      if (S.priceHistory.length < 120) {
        return false;
      }
      return ageMs >= windowMs;
    }

    function getSniperMinPayoutOk() {
      if (!S.sniperMinPayout) return true;
      const payout = getCurrentPayoutPercent();
      if (payout == null) return !S.payoutRequired;
      return payout >= S.sniperMinPayout;
    }

    function getSniperBaseAmountCents() {
      if (S.sniperProfile === 'pro') {
        return Number.isFinite(S.sniperProBaseAmount)
          ? S.sniperProBaseAmount
          : SNIPER_PRO_DEFAULTS.baseAmountCents;
      }
      return Number.isFinite(S.sniperBaseAmount)
        ? S.sniperBaseAmount
        : SNIPER_5S_DEFAULTS.baseAmountCents;
    }


    async function runSniperTick() {
      const now = Date.now();
      const prevStatus = S.sniperTfStatus || {};
      const getPrevStatus = (tf) => prevStatus[tf] || {};
      if (!isSniperWarmupReady()) {
        const minutesLeft = Math.ceil(sniperWarmupRemainingMs() / 60000);
        S.analysisUpdatedAt = now;
        S.analysisConfidence = 0;
        S.analysisDirection = null;
        setStatusOverlay(formatStatus('sniper_warming_up', { seconds: minutesLeft }), '', false);
        const warmStatuses = {};
        for (const tf of Object.keys(SNIPER_TF_MS)) {
          if (!S.sniperEnabledTimeframes[tf]) {
            warmStatuses[tf] = { state: 'off', confidence: null, direction: null };
            continue;
          }
          warmStatuses[tf] = { state: 'warmup', confidence: null, direction: null };
        }
        S.sniperTfStatus = warmStatuses;
        renderSniperMatrix();
        renderPendingTrades();
        return;
      }

      const canTrade = S.autoTrade && !S.executing;

      const timeframes = getSniperTimeframes();
      if (!timeframes.length) return;

      const payoutOk = true;

      if (S.sniperProfile === 'pro' && S.sniperProNextAllowedAt && now < S.sniperProNextAllowedAt) {
        const cooldownStatuses = {};
        for (const tf of Object.keys(SNIPER_TF_MS)) {
          const prev = getPrevStatus(tf);
          cooldownStatuses[tf] = {
            state: S.sniperEnabledTimeframes[tf] ? 'cooldown' : 'off',
            confidence: prev.confidence ?? null,
            direction: prev.direction ?? null
          };
        }
        S.sniperTfStatus = cooldownStatuses;
        renderSniperMatrix();
        renderPendingTrades();
        return;
      }

      let best = null;
      let bestCandidate = null;
      const decisionsByTf = {};
      const allowLateEntries = S.sniperThreshold === 0
        && (S.sniperProfile === '5s' || S.sniperChopThreshold === 0);
      const tfStatus = {};
      for (const tf of timeframes) {
        const windowMs = SNIPER_TF_MS[tf];
        const timeInCandle = getTimeInCandleSec(windowMs);
        const entryWindowLimit = Math.min(S.sniperEntryWindowSec, Math.floor(windowMs / 1000));
        const candleStart = getCandleStart(windowMs);
        if (S.sniperLastTradeByTf[tf] === candleStart) continue;

        const nextAllowed = S.sniperNextTradeByTf[tf] || 0;
        if (now < nextAllowed) continue;

        const decision = calcSniperDecision(tf);
        decisionsByTf[tf] = decision;
        if (!decision) {
          tfStatus[tf] = { state: 'warmup', confidence: null, direction: null };
          continue;
        }
        if (!decision.direction) {
          tfStatus[tf] = {
            state: 'nodata',
            confidence: decision?.confidence ?? null,
            direction: null
          };
          continue;
        }
        const isProProfile = S.sniperProfile === 'pro';
        const isFiveSecond = S.sniperProfile === '5s';
        if (!bestCandidate || decision.confidence > bestCandidate.confidence) {
          bestCandidate = decision;
        }
        const riskEntry = isProProfile
          && !decision.allowEntry
          && decision.direction
          && decision.confidence >= Math.max(0.2, decision.requiredConfidence - 0.15);
        if (!isProProfile && !isFiveSecond && !allowLateEntries && !decision.trendAligned) {
          tfStatus[tf] = { state: 'trend', confidence: decision.confidence, direction: decision.direction };
          continue;
        }
        if (!isProProfile && !isFiveSecond && !allowLateEntries && (!decision.rsiConfirm || !decision.stochConfirm)) {
          tfStatus[tf] = { state: 'confirm', confidence: decision.confidence, direction: decision.direction };
          continue;
        }
        if (!allowLateEntries && timeInCandle > entryWindowLimit) {
          tfStatus[tf] = { state: 'late', confidence: decision.confidence, direction: decision.direction };
          continue;
        }
        if (!isProProfile && !isFiveSecond && !allowLateEntries && decision.rangePct < S.sniperChopThreshold) {
          tfStatus[tf] = { state: 'chop', confidence: decision.confidence, direction: decision.direction };
          continue;
        }
        if (isProProfile) {
          if (!decision.allowEntry && !riskEntry) {
            const state = decision.riskLevel === 'risk' ? 'risk' : 'weak';
            tfStatus[tf] = { state, confidence: decision.confidence, direction: decision.direction };
            continue;
          }
        } else if (decision.confidence < S.sniperThreshold) {
          tfStatus[tf] = { state: 'weak', confidence: decision.confidence, direction: decision.direction };
          continue;
        }
        if (!allowLateEntries && !payoutOk) {
          tfStatus[tf] = { state: 'payout', confidence: decision.confidence, direction: decision.direction };
          continue;
        }

        if (!best || decision.confidence > best.confidence) {
          best = {
            ...decision,
            timeInCandle,
            windowMs,
            candleStart
          };
        }
        tfStatus[tf] = { state: riskEntry ? 'risk' : 'ready', confidence: decision.confidence, direction: decision.direction };
      }

      for (const tf of Object.keys(SNIPER_TF_MS)) {
        const prev = getPrevStatus(tf);
        if (!S.sniperEnabledTimeframes[tf]) {
          tfStatus[tf] = { state: 'off', confidence: null, direction: null };
        } else if (!tfStatus[tf]) {
          tfStatus[tf] = { state: 'late', confidence: prev.confidence ?? null, direction: prev.direction ?? null };
        }
      }
      S.sniperTfStatus = tfStatus;
      renderSniperMatrix();
      renderPendingTrades();

      if (!best) {
        const allowProFallback = S.sniperProfile === 'pro'
          && bestCandidate
          && bestCandidate.direction
          && bestCandidate.confidence >= (typeof S.sniperProScoreThreshold === 'number' ? S.sniperProScoreThreshold : 0.55);
        if (allowProFallback) {
          const windowMs = SNIPER_TF_MS[bestCandidate.tfKey];
          best = {
            ...bestCandidate,
            timeInCandle: getTimeInCandleSec(windowMs),
            windowMs,
            candleStart: getCandleStart(windowMs),
            riskLevel: 'risk'
          };
          if (tfStatus[bestCandidate.tfKey]) {
            tfStatus[bestCandidate.tfKey].state = 'risk';
          }
          S.sniperTfStatus = tfStatus;
          renderSniperMatrix();
          renderPendingTrades();
        } else {
          S.analysisConfidence = bestCandidate ? bestCandidate.confidence : 0;
          S.analysisDirection = bestCandidate ? bestCandidate.direction : null;
          S.analysisUpdatedAt = now;
          setStatusOverlay('Снайпер: няма чист вход', '', false);
          renderPendingTrades();
          return;
        }
      }

      if (!best) {
        S.analysisConfidence = bestCandidate ? bestCandidate.confidence : 0;
        S.analysisDirection = bestCandidate ? bestCandidate.direction : null;
        S.analysisUpdatedAt = now;
        setStatusOverlay('Снайпер: няма чист вход', '', false);
        renderPendingTrades();
        return;
      }

      S.analysisConfidence = best.confidence;
      S.analysisDirection = best.direction;
      S.analysisUpdatedAt = now;
      S.sniperLastDecision = best;

      if (!canTrade) {
        setStatusOverlay('Снайпер: изчакване', '', false);
        renderPendingTrades();
        return;
      }

      const readySignals = Object.keys(tfStatus)
        .filter(tf => ['ready', 'risk'].includes(tfStatus[tf]?.state))
        .map(tf => {
          const decision = decisionsByTf[tf];
          const windowMs = SNIPER_TF_MS[tf];
          return {
            ...decision,
            windowMs,
            candleStart: getCandleStart(windowMs)
          };
        })
        .filter(sig => sig && sig.direction);

      readySignals.sort((a, b) => (b.confidence || 0) - (a.confidence || 0));

      const maxConcurrentSniperTrades = 3;
      const availableSlots = Math.max(0, maxConcurrentSniperTrades - S.activeTrades.length);
      if (!availableSlots) {
        setStatusOverlay('Снайпер: изчакване', '', false);
        return;
      }

      const signalsToExecute = readySignals.slice(0, availableSlots);
      for (const decision of signalsToExecute) {
        const assetLabel = getCurrentAssetLabel() || '—';
        const assetSearch = assetLabel.replace(/\(OTC\)/i, '').replace(/\//g, '').trim();
        const signal = {
          asset: assetLabel,
          assetSearch,
          isOTC: /OTC/i.test(assetLabel || ''),
          direction: decision.direction,
          expiry: decision.tfKey.toUpperCase(),
          minute: getCurrentMinute(),
          time: fmtHHMMSSUTCm3(new Date()),
          targetTsMs: now,
          rawText: `[sniper:${decision.tfKey}]`
        };
        if (S.sniperProfile === 'pro' && S.sniperProBurstEnabled) {
          const minConfidence = Number.isFinite(S.sniperProBurstConfidence)
            ? S.sniperProBurstConfidence
            : 0.85;
          if (decision.confidence >= minConfidence && decision.trendAligned && decision.riskLevel !== 'risk') {
            signal.burstCount = Math.max(2, Math.min(S.sniperProBurstCount || 3, 5));
          }
        } else if (S.burstEnabled && decision.confidence >= S.burstConfidenceThreshold) {
          signal.burstCount = Math.max(1, Math.min(S.burstTradeCount, 5));
        }

        const prevBase = S.baseAmount;
        S.baseAmount = getSniperBaseAmountCents();
        S.currentSignal = signal;
        S.tradeSequenceActive = true;
        S.hasLiveSignal = true;
        S.assetSelectedForSignal = true;
        S.assetSelectionAttempted = true;

        const ok = await executeTradeOrder(signal);
        S.baseAmount = prevBase;
        S.tradeSequenceActive = false;
        S.hasLiveSignal = false;
        S.currentSignal = null;
        S.assetSelectedForSignal = false;
        S.assetSelectionAttempted = false;

        if (ok) {
          if (S.sniperProfile === 'pro') {
            S.sniperProRiskSamples = S.sniperProRiskSamples || [];
            S.sniperProRiskSamples.push({
              ts: Date.now(),
              risk: decision.riskLevel === 'risk'
            });
            S.sniperProNextAllowedAt = Date.now() + Math.max(0, S.sniperProCooldownMin || 0) * 60 * 1000;
          }
          S.sniperLastTradeByTf[decision.tfKey] = decision.candleStart;
          S.sniperNextTradeByTf[decision.tfKey] = decision.candleStart + decision.windowMs;
          setStatusOverlay(formatStatus('sniper_ready'), '', false);
        }
      }
    }

    /* ========================= FIXED TICK LOOP WITH CONTINUOUS COUNTDOWN ========================= */
    async function tick() {
      if (!S.running) {
        clearInterval(S.loop);
        S.loop = null;
        stopKeepAlive();
        stopPriceMonitoring();
        return;
      }

      ensureBalanceObserver();

      // Update countdown display if active - FIXED: Continue countdown even in last 10 seconds
      if (S.countdownActive && S.countdownTargetTime) {
        const now = Date.now();
        const timeLeft = S.countdownTargetTime - now;

        if (timeLeft <= 0) {
          S.countdownActive = false;
          updateCountdownDisplay('');
        } else {
          const countdownText = formatCountdown(timeLeft);
          updateCountdownDisplay(countdownText, S.uiState === 'PATTERN_IDENTIFIED');
        }
      }

      const curBal = await readBalanceWithRetry();
      if (curBal != null) S.balance = curBal;

      if (S.running) {
        const currentAssetLabel = getCurrentAssetLabel();
        const normalizedLabel = normalizeAssetLabel(currentAssetLabel);
        if (normalizedLabel && normalizedLabel !== S.lastAssetLabelNormalized) {
          S.lastAssetLabel = currentAssetLabel;
          S.lastAssetLabelNormalized = normalizedLabel;
          S.priceHistory = [];
          S.currentAssetPrice = null;
          S.sniperLastDecision = null;
          S.sniperTfStatus = {};
          if (isSniperMode()) {
            const warmupMs = getSniperWarmupWindowMs();
            S.sniperWarmupUntil = Date.now() + warmupMs;
          }
        }
        if (!isSniperMode()) {
          updateAnalysisState();
        }
        logDiagnostics();
      }

      if (!isSniperMode() && S.analysisEnabled && S.analysisReadyAt && Date.now() < S.analysisReadyAt) {
        setStatusOverlay(formatStatus('warming_up', { seconds: Math.ceil((S.analysisReadyAt - Date.now()) / 1000) }), '', false);
      }

      if (hasActiveTrade()) {
        await finalizeActiveTrades();
      }

      const priceStaleMs = 15000;
      if (S.lastPriceAt && Date.now() - S.lastPriceAt > priceStaleMs) {
        S.currentAssetPrice = null;
        if (!isSniperMode()) {
          S.priceHistory = [];
        }
      }

      const warm = clamp01((nowMs() - S.botStartTime) / 5000);
      renderWarmup(warm);
      if (warm < 1) { renderPendingTrades(); updateProfitDisplay(); return; }

      if (isSniperMode()) {
        await runSniperTick();
        return;
      }

      if (S.autoTrade && !S.cycleActive && !S.tradeSequenceActive && !hasActiveTrade() && !S.hasLiveSignal && Date.now() >= S.signalCooldownUntil) {
        const incoming = await fetchAPISignals();

        if (incoming.length) {
          for (const sig of incoming) {
            const delayMs = calculateDelay(sig);

            if (delayMs < 0) {
              logSignalStatus({ label: '1m/5m' }, 'signal_stale', { minIntervalMs: 300000 });
              continue;
            }

            if (!S.cycleActive && !S.tradeSequenceActive && !S.currentSignal && !hasActiveTrade()) {
              startCycle(sig);
              break;
            } else {
              S.signalBuffer.push(sig);
              if (S.signalBuffer.length > C.MAX_QUEUE) S.signalBuffer.shift();
            }
          }
        } else if (!S.selfTradeEnabled && S.analysisDirection && S.analysisConfidence >= S.analysisConfidenceThreshold) {
          const now = Date.now();
          if (now - S.lastSelfTradeHintAt > 60000) {
            S.lastSelfTradeHintAt = now;
            logConsoleLine(formatStatus('analysis_ready_selftrade_off'));
          }
        }
      }

      if (!S.cycleActive && !S.tradeSequenceActive && !S.currentSignal && !hasActiveTrade() && S.signalBuffer.length) {
        S.signalBuffer = S.signalBuffer.filter(s => calculateDelay(s) >= 0);
        if (S.signalBuffer.length) {
          S.signalBuffer.sort((a, b) => a.targetTsMs - b.targetTsMs);
          const next = S.signalBuffer.shift();
          startCycle(next);
        }
      }

      const selfTradeAllowed = getSelfTradeAllowed();
      if (selfTradeAllowed && !S.cycleActive && !S.tradeSequenceActive && !S.currentSignal && !hasActiveTrade()) {
        if ((!S.analysisReadyAt || Date.now() >= S.analysisReadyAt) && S.analysisDirection && S.analysisConfidence >= S.analysisConfidenceThreshold) {
          let assetLabel = getCurrentAssetLabel();
          const assetSearch = assetLabel ? assetLabel.replace(/\(OTC\)/i, '').replace(/\//g, '').trim() : '';
          const isOTC = /OTC/i.test(assetLabel || '');
          if (assetLabel) {
            const minute = getCurrentMinute();
            const sig = {
              asset: assetLabel,
              assetSearch,
              isOTC,
              direction: S.analysisDirection,
              expiry: S.expirySetting,
              minute,
              time: fmtHHMMSSUTCm3(new Date()),
              targetTsMs: Date.now(),
              rawText: '[analysis-only]'
            };
            startCycle(sig);
            S.assetSelectedForSignal = true;
            S.assetSelectionAttempted = true;
          }
        }
      }

      if (S.currentSignal && S.tradeSequenceActive && S.hasLiveSignal && !hasActiveTrade()) {
        const sig = S.currentSignal;
        const delayMs = calculateDelay(sig);
        if (!S.assetSelectedForSignal && S.assetSelectionAttempted) {
          const verification = verifyAssetSelection(sig.asset);
          if (verification.verified) {
            S.assetSelectedForSignal = true;
            S.assetSelectionFlipped = false;
          }
        }

        // Update UI states based on countdown timing - FIXED: Continue countdown in all states
        if (delayMs > -C.LATE_TOL_MS) {
          const secondsLeft = Math.max(0, Math.floor(delayMs / 1000));

          if (secondsLeft <= 10 && S.uiState !== 'PATTERN_IDENTIFIED') {
            setUIState('PATTERN_IDENTIFIED', {
              countdownValue: formatCountdown(delayMs),
              direction: sig.direction
            });
            S.patternIdentifiedTime = Date.now();
          } else if (secondsLeft > 10 && S.uiState === 'IDENTIFYING_PATTERN') {
            // Update countdown in identifying state - CONTINUOUS COUNTDOWN
            updateCountdownDisplay(formatCountdown(delayMs));
          } else if (S.uiState === 'PATTERN_IDENTIFIED') {
            // Continue countdown in pattern identified state - FIXED
            updateCountdownDisplay(formatCountdown(delayMs), true);
          }
        }

        if (S.forceImmediate) {
          let executed = false;

          for (let attempt = 1; attempt <= C.MAX_EXECUTION_ATTEMPTS; attempt++) {
            const ok = await executeTradeOrder(sig);
            if (ok) {
              executed = true;
              break;
            } else if (attempt < C.MAX_EXECUTION_ATTEMPTS) {
              await delay(50);
            }
          }

          if (executed) {
            S.currentSignal = null;
            S.tradeSequenceActive = false;
            S.hasLiveSignal = false;
            S.forceImmediate = false;
          } else {
            resetExecutionState();
            endCycle();
          }
          renderPendingTrades();
          updateProfitDisplay();
          return;
        }

        if (delayMs <= C.EARLY_FIRE_MS && !S.assetSelectedForSignal && !S.assetSelecting) {
          await selectAssetWithVerification(sig);
        }

        if (S.assetSelectedForSignal && delayMs <= C.EARLY_FIRE_MS && delayMs >= -C.LATE_TOL_MS) {
          let executed = false;

          for (let attempt = 1; attempt <= C.MAX_EXECUTION_ATTEMPTS; attempt++) {
            const ok = await executeTradeOrder(sig);
            if (ok) {
              executed = true;
              break;
            } else if (attempt < C.MAX_EXECUTION_ATTEMPTS) {
              await delay(10);
            }
          }

          if (executed) {
            S.currentSignal = null;
            S.tradeSequenceActive = false;
            S.assetSelectedForSignal = false;
            S.hasLiveSignal = false;
            S.assetSelectionAttempted = false;
          } else {
            resetExecutionState();
            endCycle();
          }
          renderPendingTrades();
          updateProfitDisplay();
          return;
        }

        if (!S.assetSelectionAttempted && !S.assetSelectedForSignal && !S.assetSelecting && delayMs > C.EARLY_FIRE_MS) {
          setUIState('SWITCHING_ASSET');
          await selectAssetWithVerification(sig);
          if (S.assetSelectedForSignal) {
            setUIState('IDENTIFYING_PATTERN', {
              countdownValue: formatCountdown(delayMs)
            });
          }
        }

        if (delayMs < -C.LATE_TOL_MS) {
          resetExecutionState();
          endCycle();
        }
      }

      renderPendingTrades();
      updateProfitDisplay();
    }

    /* ========================= ENHANCED ASSET SELECTION WITH OTC/REAL FALLBACK ========================= */
    async function selectAssetWithVerification(signal) {
      if (S.assetSelectionAttempted && !S.forceAssetSelect) return true;
      if (S.assetSelecting) return false;

      const precheck = verifyAssetSelection(signal.asset);
      if (precheck.verified) {
        S.assetSelecting = false;
        S.assetSelectionAttempted = true;
        S.assetSelectedForSignal = true;
        S.assetSelectionAttempts = 0;
        S.assetSelectionFlipped = false;
        return true;
      }

      S.assetSelecting = true;
      S.assetSelectionAttempts++;
      setUIState('SWITCHING_ASSET');

      const maxAttempts = C.MAX_ASSET_SELECTION_ATTEMPTS;
      let attempt = 1;

      while (attempt <= maxAttempts) {
        const strategies = [
          { useOTC: signal.isOTC, description: signal.isOTC ? 'OTC (primary)' : 'Real (primary)' },
          { useOTC: !signal.isOTC, description: signal.isOTC ? 'Real (fallback)' : 'OTC (fallback)' }
        ];

        for (const strategy of strategies) {
          const success = await performAssetSelectionXPath(signal, strategy.useOTC);

        if (success) {
          await delay(C.ASSET_CLICK_DELAYS.VERIFICATION);
          const verification = verifyAssetSelection(signal.asset);

          if (verification.verified) {
            clickAtCoordinates(C.COORD_CLOSE.x, C.COORD_CLOSE.y);
            await delay(500);

              S.assetSelecting = false;
              S.assetSelectionAttempted = true;
              S.assetSelectedForSignal = true;
              S.assetSelectionAttempts = 0;
              S.assetSelectionFlipped = false;

              logConsoleLine(formatStatus('asset_selected', { asset: signal.asset }));
              return true;
            } else if (verification.flipped) {
              continue;
            } else {
              const secondResultSuccess = await trySecondSearchResult(signal, strategy.useOTC);
              if (secondResultSuccess) {
                await delay(C.ASSET_CLICK_DELAYS.VERIFICATION);
                const secondVerification = verifyAssetSelection(signal.asset);

                if (secondVerification.verified) {
                  clickAtCoordinates(C.COORD_CLOSE.x, C.COORD_CLOSE.y);
                  await delay(500);

                  S.assetSelecting = false;
                  S.assetSelectionAttempted = true;
                  S.assetSelectedForSignal = true;
                  S.assetSelectionAttempts = 0;
                  S.assetSelectionFlipped = false;

                  logConsoleLine(formatStatus('asset_selected', { asset: signal.asset }));
                  return true;
                }
              }
            }
          }
        }

        attempt++;

        if (attempt <= maxAttempts) {
          await delay(1000);
        }
      }

      S.assetSelecting = false;
      S.assetSelectionAttempted = true;
      S.assetSelectionAttempts = 0;
      S.assetSelectionFlipped = false;

      if (S.cycleActive) {
        endCycle();
      }

      logConsoleLine(formatStatus('asset_select_failed'));

      return false;
    }

    /* ========================= IMPROVED ASSET SELECTION WITH SECOND RESULT FALLBACK ========================= */
    async function performAssetSelectionXPath(signal, useOTC) {
      try {
        let dropdown = xpathLocator.findElement('assetDropdown');
        if (!dropdown) {
          return false;
        }

        simulateClick(dropdown);
        await delay(C.ASSET_CLICK_DELAYS.OPEN_DROPDOWN);

        let searchInput = xpathLocator.findElement('searchInput') || document.activeElement;
        if (!searchInput) {
          return false;
        }

        simulateClick(searchInput);
        await delay(300);

        simulateTyping(searchInput, '');
        await delay(300);
        simulateTyping(searchInput, signal.assetSearch);
        await delay(C.ASSET_CLICK_DELAYS.TYPE_QUERY);

        let targetRow = null;

        if (useOTC) {
          targetRow = xpathLocator.findElement('otcAssetResult');
        } else {
          targetRow = xpathLocator.findElement('realAssetResult');
        }

        if (!targetRow) {
          return false;
        }

        simulateClick(targetRow);
        await delay(C.ASSET_CLICK_DELAYS.CLICK_ROW);

        return true;

      } catch (error) {
        return false;
      }
    }

    /* ========================= SECOND RESULT FALLBACK ========================= */
    async function trySecondSearchResult(signal, useOTC) {
      try {
        let dropdown = xpathLocator.findElement('assetDropdown');
        if (!dropdown) {
          return false;
        }

        simulateClick(dropdown);
        await delay(C.ASSET_CLICK_DELAYS.OPEN_DROPDOWN);

        let searchInput = xpathLocator.findElement('searchInput') || document.activeElement;
        if (!searchInput) {
          return false;
        }

        simulateClick(searchInput);
        await delay(300);

        simulateTyping(searchInput, '');
        await delay(300);
        simulateTyping(searchInput, signal.assetSearch);
        await delay(C.ASSET_CLICK_DELAYS.TYPE_QUERY);

        let targetRow = null;

        const allRows = document.evaluate(
          '//ul//li//a',
          document,
          null,
          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
          null
        );

        if (allRows.snapshotLength > 1) {
          targetRow = allRows.snapshotItem(1);
        }

        if (!targetRow) {
          for (let i = 0; i < allRows.snapshotLength; i++) {
            const row = allRows.snapshotItem(i);
            const rowText = T(row);
            if (rowText && rowText.includes(signal.assetSearch.replace('/', ''))) {
              targetRow = row;
              break;
            }
          }
        }

        if (!targetRow) {
          return false;
        }

        simulateClick(targetRow);
        await delay(C.ASSET_CLICK_DELAYS.CLICK_ROW);

        return true;

      } catch (error) {
        return false;
      }
    }

    /* ----------------------------- UI ----------------------------- */
    function ensurePanel(){
      if ($id(C.PANEL_ID)) return;

      const css = `
        #${C.PANEL_ID}{
          position:fixed; top:12px; left:12px; z-index:2147483647; width:360px;
          font-family:system-ui, Arial !important;
        }
        #iaa-panel{
          position:relative; width:100%; background:#000; color:#fff;
          font-family:system-ui, Arial !important;
          padding:10px 12px 12px; border-radius:14px;
          box-shadow:0 8px 24px rgba(0,0,0,.7); display:grid; gap:8px;
          border:1px solid rgba(255,255,255,.08);
        }
        #iaa-ver{ position:absolute; left:8px; top:6px; font-size:10px; font-weight:800; color:#f97316; opacity:.9; }
        .iaa-top{ position:relative; display:flex; align-items:center; justify-content:center; }
        #iaa-logo{ width:120px; height:120px; border-radius:12px; object-fit:cover; }
        #iaa-dot{ position:absolute; right:6px; top:6px; width:10px; height:10px; border-radius:50%; background:#ef4444; box-shadow:0 0 8px rgba(239,68,68,.85); }
        .iaa-center{ display:flex; gap:8px; }
        .Btn,.Btn2{ flex:1; height:36px; border:1px solid transparent; border-radius:10px; cursor:pointer; position:relative; display:flex; align-items:center; justify-content:center; transition:0.2s; overflow:hidden; font-size:12px }
        .Btn{ background:linear-gradient(to right,#77530a,#ffd277,#77530a,#77530a,#ffd277,#77530a); background-size:250%; background-position:left; color:#ffd277; }
        .Btn::before{ content:"START"; position:absolute; color:#ffd277; display:flex; align-items:center; justify-content:center; width:97%; height:90%; border-radius:8px; background:rgba(0,0,0,.84); }
        .Btn.stop::before{ content:"STOP"; }
        .Btn.is-stopped{ border-color:#ef4444; box-shadow:0 0 0 1px rgba(239,68,68,.6) inset; }
        .Btn.is-running{ border-color:#22c55e; box-shadow:0 0 0 1px rgba(34,197,94,.6) inset; }
        .Btn2{ background:linear-gradient(to right,#0a2f1a,#22c55e,#0a2f1a,#0a2f1a,#22c55e,#0a2f1a); background-size:250%; background-position:left; color:#bbf7d0; box-shadow:0 0 0 1px rgba(107,114,128,.35) inset; }
        .Btn2.on::before{ content:"AUTO ON"; position:absolute; color:#bbf7d0; display:flex; align-items:center; justify-content:center; width:97%; height:90%; border-radius:8px; background:rgba(0,0,0,.82); }
        .Btn2:not(.on)::before{ content:"AUTO OFF"; position:absolute; color:#bbf7d0; display:flex; align-items:center; justify-content:center; width:97%; height:90%; border-radius:8px; background:rgba(0,0,0,.82); }
        .Btn2.off{ border-color:#ef4444; box-shadow:0 0 0 1px rgba(239,68,68,.6) inset; }
        .Btn2.on{ border-color:#22c55e; box-shadow:0 0 0 1px rgba(34,197,94,.6) inset; }

        .iaa-signal{ position:relative; display:block; width:100%; }
        .loader-wrapper{ position:relative; width:100%; background:#000; border-radius:12px; overflow:hidden; height:260px; display:flex; align-items:center; justify-content:center; }
        .iaa-console{ width:100%; height:100%; padding:8px; display:flex; flex-direction:column; gap:6px; font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; font-size:11px; color:#e5e7eb; background:rgba(0,0,0,.35); border:1px solid rgba(255,255,255,.08); border-radius:10px; }
        #iaa-console-lines{ flex:1; overflow-y:auto; }
        .iaa-console-line{ margin-bottom:4px; display:flex; gap:6px; align-items:baseline; }
        .iaa-console-time{ color:#94a3b8; font-size:10px; white-space:nowrap; }
        .iaa-console-msg{ color:#e5e7eb; }
        .iaa-console-msg--diag{ color:#60a5fa; }
        .iaa-console-msg--signal{ color:#22c55e; }
        .iaa-console-msg--skip{ color:#f87171; }
        .iaa-console-msg--warn{ color:#fbbf24; }
        #iaa-console-copy{ align-self:flex-end; padding:4px 8px; border-radius:6px; border:1px solid rgba(255,255,255,.12); background:#111; color:#fff; font-size:10px; cursor:pointer; letter-spacing:.08em; }
        #iaa-console-copy:hover{ background:#1f1f1f; }
        #iaa-status-overlay{ font-weight:700; color:#fbbf24; text-shadow:none; pointer-events:none; }
        #iaa-countdown{ font-weight:700; color:#60a5fa; text-align:right; text-shadow:none; pointer-events:none; }
        #iaa-chip-wrap{ display:none; position:absolute; inset:0; display:flex; align-items:center; justify-content:center; pointer-events:none; }
        .chip{ display:inline-flex; align-items:center; gap:8px; padding:10px 16px; border-radius:22px; font:700 16px/1.1 system-ui; color:#fff; text-transform:uppercase; letter-spacing:.8px; transition:.3s; box-shadow:0 6px 16px rgba(0,0,0,.35); border:1px solid rgba(255,255,255,.12); background:rgba(0,0,0,.35) }
        .chip--buy{ color:#22c55e; border-color:rgba(34,197,94,.35) }
        .chip--sell{ color:#ef4444; border-color:rgba(239,68,68,.35) }
        .arrow{ width:0; height:0; border-left:5px solid transparent; border-right:5px solid transparent }
        .arrow--up{ border-bottom:8px solid #22c55e } .arrow--down{ border-top:8px solid #ef4444 }

        #iaa-direction-indicator{ position:absolute; left:0; right:0; bottom:8px; text-align:center; font-size:14px; font-weight:bold; pointer-events:none; display:none; }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        .iaa-grid{ display:flex; flex-direction:column; gap:6px; margin-top:8px; position:relative; }
        .iaa-grid-row{ display:grid; grid-template-columns:1fr 1fr 1fr 1fr; gap:6px; position:relative; }
        .iaa-grid-row::after{ content:""; position:absolute; top:2px; bottom:2px; left:50%; width:1px; background:rgba(255,255,255,.06); pointer-events:none; }
        .iaa-stats{ display:flex; flex-wrap:nowrap; gap:8px; margin-top:6px; padding-top:6px; border-top:1px solid rgba(255,255,255,.05); }
        .iaa-stat-row{ display:flex; align-items:center; gap:4px; }
        .iaa-stat-label{ color:#9ca3af; font-size:11px; }
        .iaa-stat-value{ color:#e5e7eb; font-size:12px; font-weight:600; }
        .iaa-lag{ display:flex; align-items:center; gap:6px; margin-top:4px; }
        .iaa-tf-grid{ display:grid; grid-template-columns:repeat(4, 1fr); gap:6px 10px; margin-top:6px; }
        .iaa-tf-cell{ display:flex; align-items:center; gap:6px; padding:4px 6px; border-radius:6px; border:1px solid rgba(255,255,255,.06); background:rgba(255,255,255,.02); font-size:11px; white-space:nowrap; min-width:0; }
        .iaa-tf-cell span{ white-space:nowrap; }
        .iaa-tf-dot{ width:8px; height:8px; border-radius:50%; background:#6b7280; box-shadow:0 0 6px rgba(107,114,128,.4); }
        .iaa-tf-dot--ok{ background:#22c55e; box-shadow:0 0 6px rgba(34,197,94,.6); }
        .iaa-tf-dot--warn{ background:#fbbf24; box-shadow:0 0 6px rgba(251,191,36,.6); }
        .iaa-tf-dot--bad{ background:#ef4444; box-shadow:0 0 6px rgba(239,68,68,.6); }
        .k{ font-size:11px; color:#9ca3af } .v{ font-size:12px; text-align:right } .blue{ color:#60a5fa } .strong{ font-weight:bold; color:#fff } .wr{ color:#e88565 }
        #iaa-warm{ font-size:10px; text-align:center; margin-top:6px } .red{ color:#f87171 }

        /* Settings Panel */
        #iaa-settings-panel{
          display:none; position:absolute; top:50%; left:50%; transform:translate(-50%, -50%);
          width:340px; background:#000; border:1px solid rgba(255,255,255,.15);
          border-radius:14px; padding:16px; z-index:2147483648;
          box-shadow:0 12px 40px rgba(0,0,0,.8); max-height:80vh; overflow-y:auto;
          font-family:system-ui, Arial !important;
        }
        #iaa-settings-close{ position:absolute; top:8px; right:8px; background:none; border:none; color:#fff; font-size:16px; cursor:pointer; }

        /* Mouse Panel */
        #iaa-mouse-panel{
          display:none; position:absolute; top:50%; left:50%; transform:translate(-50%, -50%);
          width:420px; background:#000; border:1px solid rgba(255,255,255,.15);
          border-radius:14px; padding:16px; z-index:2147483647;
          box-shadow:0 12px 40px rgba(0,0,0,.8); max-height:80vh; overflow-y:auto;
          font-family:system-ui, Arial !important;
        }
        #iaa-mouse-close{ position:absolute; top:8px; right:8px; background:none; border:none; color:#fff; font-size:16px; cursor:pointer; }

        .iaa-controls{ display:flex; justify-content:space-between; align-items:center; margin-top:8px; padding-top:8px; border-top:1px solid rgba(255,255,255,.05);}
        .iaa-control-btn{ width:36px; height:36px; border-radius:50%; background:#252525; color:#fff; font-size:14px; border:1px solid rgba(255,255,255,.1); cursor:pointer; display:flex; align-items:center; justify-content:center; }
        .iaa-control-btn:hover{ background:#333; }

        #iaa-debug-panel{
          display:none; position:absolute; top:50%; left:50%; transform:translate(-50%, -50%);
          width:360px; background:#000; border:1px solid rgba(255,255,255,.15);
          border-radius:14px; padding:16px; z-index:2147483648;
          box-shadow:0 12px 40px rgba(0,0,0,.8); max-height:80vh; overflow-y:auto;
          font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size:11px; color:#e5e7eb;
        }
        #iaa-debug-close{ background:none; border:none; color:#fff; font-size:16px; cursor:pointer; }
        #iaa-debug-content{ white-space:pre-wrap; word-break:break-word; margin-top:10px; }
        .iaa-debug-header{ display:flex; align-items:center; justify-content:space-between; gap:8px; }
        .iaa-debug-actions{ display:flex; align-items:center; gap:6px; }
        #iaa-debug-copy{ padding:4px 8px; border-radius:6px; border:1px solid rgba(255,255,255,.12); background:#111; color:#fff; font-size:10px; cursor:pointer; letter-spacing:.08em; }
        #iaa-debug-copy:hover{ background:#1f1f1f; }
        .iaa-debug-line{ display:flex; align-items:flex-start; justify-content:space-between; gap:10px; padding:2px 0; }
        .iaa-debug-key{ color:#9ca3af; }
        .iaa-debug-value{ color:#e5e7eb; font-weight:600; }
        .iaa-debug-value--warn{ color:#fbbf24; }
        .iaa-debug-value--bad{ color:#f87171; }
      `;
      const style = document.createElement('style');
      style.textContent = css;
      document.head.appendChild(style);

      const shell = document.createElement('div'); shell.id = C.PANEL_ID;
      const panel = document.createElement('div'); panel.id = 'iaa-panel';
      panel.style.opacity = String(S.panelOpacity ?? 1);
      panel.innerHTML = `
        <div id="iaa-ver">MZ TRADING</div>
        <div class="iaa-top">
          <img id="iaa-logo" alt="∞"/>
          <span id="iaa-dot"></span>
        </div>
        <div class="iaa-center">
          <button id="iaa-toggle" class="Btn"></button>
          <button id="iaa-auto" class="Btn2 on" title="AutoTrade"></button>
        </div>
        <div class="iaa-signal">
          <div id="iaa-chip-wrap" style="display:none">
            <div id="iaa-chip" class="chip">
              <span id="iaa-arrow" class="arrow"></span>
              <span id="iaa-text" class="sigtext">—</span>
            </div>
          </div>
          <div id="iaa-loader-wrapper" class="loader-wrapper">
            <div id="iaa-console" class="iaa-console">
              <div id="iaa-console-lines"></div>
              <button id="iaa-console-copy" type="button">КОПИРАЙ</button>
              <div id="iaa-status-overlay"></div>
              <div id="iaa-countdown"></div>
            </div>
            <div id="iaa-direction-indicator"></div>
          </div>
        </div>
        <div class="iaa-grid">
          <div class="iaa-grid-row">
            <div class="k blue">Актив</div><div id="iaa-asset" class="v strong">—</div>
            <div class="k">Изтичане</div><div id="iaa-exp" class="v">1M</div>
          </div>
          <div class="iaa-grid-row">
            <div class="k">Изпълнение</div><div id="iaa-exec" class="v">—</div>
            <div class="k">Печалба</div><div id="iaa-profit" class="v wr">$0.00</div>
          </div>
          <div class="iaa-grid-row">
            <div class="k">Анализ</div><div id="iaa-analysis-score" class="v">0%</div>
            <div class="k">Следваща</div><div id="iaa-next-trade" class="v">—</div>
          </div>
        </div>
        <div class="iaa-stats">
          <div class="iaa-stat-row"><span class="iaa-stat-label" data-status-key="start_label">Start</span><span id="iaa-start-time" class="iaa-stat-value">—</span></div>
          <div class="iaa-stat-row"><span class="iaa-stat-label" data-status-key="total_label">Total</span><span id="iaa-total-trades" class="iaa-stat-value">0</span></div>
          <div class="iaa-stat-row"><span class="iaa-stat-label" data-status-key="win_label">Win</span><span id="iaa-win-trades" class="iaa-stat-value">0</span></div>
          <div class="iaa-stat-row"><span class="iaa-stat-label" data-status-key="loss_label">Loss</span><span id="iaa-loss-trades" class="iaa-stat-value">0</span></div>
          <div class="iaa-stat-row"><span class="iaa-stat-label" data-status-key="win_rate_label">%</span><span id="iaa-win-rate" class="iaa-stat-value">0%</span></div>
        </div>
        <div id="iaa-tf-matrix" class="iaa-tf-grid">
          <div class="iaa-tf-cell"><span id="iaa-tf-dot-5s" class="iaa-tf-dot"></span><span id="iaa-tf-5s">5s —</span></div>
          <div class="iaa-tf-cell"><span id="iaa-tf-dot-15s" class="iaa-tf-dot"></span><span id="iaa-tf-15s">15s —</span></div>
          <div class="iaa-tf-cell"><span id="iaa-tf-dot-30s" class="iaa-tf-dot"></span><span id="iaa-tf-30s">30s —</span></div>
          <div class="iaa-tf-cell"><span id="iaa-tf-dot-1m" class="iaa-tf-dot"></span><span id="iaa-tf-1m">1m —</span></div>
        </div>
        <div id="iaa-warm" class="warmup red">INFINITY AI ENGINE 0%</div>

        <div class="iaa-controls">
          <button id="iaa-mouse-toggle" class="iaa-control-btn" title="Mouse Mapping">🖱</button>
          <button id="iaa-settings-toggle" class="iaa-control-btn" title="Settings">⚙</button>
          <button id="iaa-debug-toggle" class="iaa-control-btn" title="Диагностика">🧪</button>
        </div>

        <div id="iaa-debug-panel">
          <div class="iaa-debug-header">
            <span>Диагностика</span>
            <div class="iaa-debug-actions">
              <button id="iaa-debug-copy" title="Копирай диагностика">КОПИРАЙ</button>
              <button id="iaa-debug-close" title="Затвори">×</button>
            </div>
          </div>
          <div id="iaa-debug-content"></div>
        </div>

        <div id="iaa-settings-panel">
          <button id="iaa-settings-close">×</button>
          <div style="margin-bottom:12px;">
            <div style="font-size:11px;color:#9ca3af;margin-bottom:6px;" data-i18n="mode_label">Режим на работа</div>
            <div style="display:flex; gap:8px;">
              <button id="iaa-mode-signals" style="flex:1; padding:8px 10px; border-radius:8px; border:1px solid rgba(255,255,255,.1); background:#1f2937; color:#fff; cursor:pointer; font-size:11px;" data-i18n="mode_signals">Сигнали 1м/5м</button>
              <button id="iaa-mode-sniper" style="flex:1; padding:8px 10px; border-radius:8px; border:1px solid rgba(255,255,255,.1); background:#111827; color:#fff; cursor:pointer; font-size:11px;" data-i18n="mode_sniper">СНАЙПЕР</button>
            </div>
          </div>

          <div id="iaa-settings-signals">
            <div style="margin-bottom:12px;">
              <label style="display:flex;align-items:center;gap:6px;margin:6px 0;cursor:pointer;font-size:12px"><input type="checkbox" id="iaa-signal-source-1m"> <span data-i18n="signal_source_1m">Сигнали 1м</span></label>
              <label style="display:flex;align-items:center;gap:6px;margin:6px 0;cursor:pointer;font-size:12px"><input type="checkbox" id="iaa-signal-source-5m"> <span data-i18n="signal_source_5m">Сигнали 5м</span></label>
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
                <span style="color:#9ca3af; font-size:11px;" data-i18n="base_amount">Base Amount ($)</span>
                <input type="number" id="iaa-base-amount" min="1" step="1" value="1" style="width:70px; padding:4px 6px; border-radius:6px; border:1px solid rgba(255,255,255,.1); background:rgba(0,0,0,.3); color:#fff; font-weight:700" />
              </div>
              <div style="color:#9ca3af; font-size:11px; margin-bottom:4px;" data-i18n="expiry_setting">Expiry Setting:</div>
              <select id="iaa-expiry-setting" style="width:100%; padding:6px; border-radius:6px; border:1px solid rgba(255,255,255,.1); background:rgba(0,0,0,.3); color:#fff"><option value="1M" data-i18n="expiry_1m">1 Minute</option><option value="5M" data-i18n="expiry_5m">5 Minutes</option></select>
            </div>
          </div>

          <div id="iaa-settings-sniper" style="display:none;">
            <div style="font-weight:700;color:#e5e7eb;margin:8px 0;" data-i18n="sniper_panel_title">Снайпер настройки</div>
            <div style="margin-bottom:10px;">
              <div style="font-size:11px;color:#9ca3af;margin-bottom:6px;" data-i18n="sniper_profile_label">Профил на Снайпер</div>
              <div style="display:flex; gap:8px; flex-wrap:wrap;">
                <label style="display:flex;align-items:center;gap:6px;font-size:12px;cursor:pointer;">
                  <input type="radio" name="iaa-sniper-profile" id="iaa-sniper-profile-5s" value="5s">
                  <span data-i18n="sniper_profile_5s">Sniper 5s</span>
                </label>
                <label style="display:flex;align-items:center;gap:6px;font-size:12px;cursor:pointer;">
                  <input type="radio" name="iaa-sniper-profile" id="iaa-sniper-profile-pro" value="pro">
                  <span data-i18n="sniper_profile_pro">Sniper Pro</span>
                </label>
              </div>
            </div>
            <div id="iaa-sniper-5s-settings">
              <div style="display:flex;justify-content:space-between;align-items:center;margin:8px 0;">
                <span style="font-size:11px;color:#9ca3af" data-i18n="sniper_threshold" title="Минималната увереност (0–1), нужна за вход.">Праг (0–1):</span>
                <input type="text" inputmode="decimal" id="iaa-sniper-threshold" value="0.35" style="width:70px; padding:4px 6px; border-radius:6px; border:1px solid rgba(255,255,255,.1); background:rgba(0,0,0,.3); color:#fff; font-weight:700">
              </div>
              <div style="display:flex;justify-content:space-between;align-items:center;margin:8px 0;">
                <span style="font-size:11px;color:#9ca3af" data-i18n="sniper_base_amount" title="Базова сума за вход в Sniper режим.">Базова сума ($):</span>
                <input type="number" id="iaa-sniper-base" min="1" step="1" value="100" style="width:70px; padding:4px 6px; border-radius:6px; border:1px solid rgba(255,255,255,.1); background:rgba(0,0,0,.3); color:#fff; font-weight:700">
              </div>
              <div style="display:flex;justify-content:space-between;align-items:center;margin:8px 0;">
                <span style="font-size:11px;color:#9ca3af" data-i18n="sniper_min_payout" title="Минимален процент изплащане за да се допусне сделка.">Мин. изплащане (%):</span>
                <input type="number" id="iaa-sniper-min-payout" min="0" max="100" step="1" value="70" style="width:70px; padding:4px 6px; border-radius:6px; border:1px solid rgba(255,255,255,.1); background:rgba(0,0,0,.3); color:#fff; font-weight:700">
              </div>
              <div style="display:flex;justify-content:space-between;align-items:center;margin:8px 0;">
                <span style="font-size:11px;color:#9ca3af" data-i18n="sniper_entry_window" title="Макс. секунди след началото на свещта за вход.">Прозорец за вход (сек):</span>
                <input type="number" id="iaa-sniper-entry-window" min="1" max="300" step="1" value="5" style="width:70px; padding:4px 6px; border-radius:6px; border:1px solid rgba(255,255,255,.1); background:rgba(0,0,0,.3); color:#fff; font-weight:700">
              </div>
              <div style="display:flex;justify-content:space-between;align-items:center;margin:8px 0;">
                <span style="font-size:11px;color:#9ca3af" data-i18n="sniper_warmup" title="Време за събиране на история преди входове.">История преди старт (мин):</span>
                <input type="number" id="iaa-sniper-warmup" min="1" max="30" step="1" value="10" style="width:70px; padding:4px 6px; border-radius:6px; border:1px solid rgba(255,255,255,.1); background:rgba(0,0,0,.3); color:#fff; font-weight:700">
              </div>
              <div style="margin:12px 0; padding-top:8px; border-top:1px solid rgba(255,255,255,.05);">
                <div style="display:flex;justify-content:space-between;align-items:center;margin:8px 0;">
                  <span style="font-size:11px;color:#9ca3af" data-i18n="sniper_vwap_dev" title="Отклонение от VWAP, използвано в скоринга.">VWAP отклонение:</span>
                  <input type="text" inputmode="decimal" id="iaa-sniper-vwap" value="0.0015" style="width:70px; padding:4px 6px; border-radius:6px; border:1px solid rgba(255,255,255,.1); background:rgba(0,0,0,.3); color:#fff; font-weight:700">
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin:8px 0;">
                  <span style="font-size:11px;color:#9ca3af" data-i18n="sniper_momentum" title="Минимален импулс за оценка на тренда.">Импулс праг:</span>
                  <input type="text" inputmode="decimal" id="iaa-sniper-momentum" value="0.0012" style="width:70px; padding:4px 6px; border-radius:6px; border:1px solid rgba(255,255,255,.1); background:rgba(0,0,0,.3); color:#fff; font-weight:700">
                </div>
              </div>
            </div>
            <div id="iaa-sniper-pro-settings" style="display:none;">
              <div style="font-weight:700;color:#e5e7eb;margin:8px 0;" data-i18n="sniper_pro_title">Снайпер Pro настройки</div>
              <div style="display:flex;justify-content:space-between;align-items:center;margin:8px 0;">
                <span style="font-size:11px;color:#9ca3af" data-i18n="sniper_pro_base_amount" title="Базова сума за вход в Sniper Pro.">Базова сума Pro ($):</span>
                <input type="number" id="iaa-sniper-pro-base" min="1" step="1" value="100" style="width:70px; padding:4px 6px; border-radius:6px; border:1px solid rgba(255,255,255,.1); background:rgba(0,0,0,.3); color:#fff; font-weight:700">
              </div>
              <div style="display:flex;justify-content:space-between;align-items:center;margin:8px 0;">
                <span style="font-size:11px;color:#9ca3af" data-i18n="sniper_pro_score_threshold" title="Минимален общ скоринг за вход.">Праг на скоринг (мин 0 – макс 1):</span>
                <input type="text" inputmode="decimal" id="iaa-sniper-pro-score-threshold" value="0.55" style="width:70px; padding:4px 6px; border-radius:6px; border:1px solid rgba(255,255,255,.1); background:rgba(0,0,0,.3); color:#fff; font-weight:700">
              </div>
              <div style="display:flex;justify-content:space-between;align-items:center;margin:8px 0;">
                <span style="font-size:11px;color:#9ca3af" data-i18n="sniper_pro_risk_ratio" title="Дял от входовете, които могат да бъдат рискови.">Дял рискови входове (мин 0 – макс 1):</span>
                <input type="text" inputmode="decimal" id="iaa-sniper-pro-risk-ratio" value="0.25" style="width:70px; padding:4px 6px; border-radius:6px; border:1px solid rgba(255,255,255,.1); background:rgba(0,0,0,.3); color:#fff; font-weight:700">
              </div>
              <div style="display:flex;justify-content:space-between;align-items:center;margin:8px 0;">
                <span style="font-size:11px;color:#9ca3af" data-i18n="sniper_pro_risk_premium" title="Колко по-висок скоринг е нужен за рисков вход.">Премия за риск (мин 0 – макс 0.5):</span>
                <input type="text" inputmode="decimal" id="iaa-sniper-pro-risk-premium" value="0.08" style="width:70px; padding:4px 6px; border-radius:6px; border:1px solid rgba(255,255,255,.1); background:rgba(0,0,0,.3); color:#fff; font-weight:700">
              </div>
              <div style="display:flex;justify-content:space-between;align-items:center;margin:8px 0;">
                <span style="font-size:11px;color:#9ca3af" data-i18n="sniper_pro_trend_bias" title="Колко силно се предпочита вход по тренд.">Трендов превес (мин 0 – макс 1):</span>
                <input type="text" inputmode="decimal" id="iaa-sniper-pro-trend-bias" value="0.15" style="width:70px; padding:4px 6px; border-radius:6px; border:1px solid rgba(255,255,255,.1); background:rgba(0,0,0,.3); color:#fff; font-weight:700">
              </div>
              <div style="display:flex;justify-content:space-between;align-items:center;margin:8px 0;">
                <span style="font-size:11px;color:#9ca3af" data-i18n="sniper_pro_momentum_gate" title="Минимален импулс за допускане на вход.">Филтър импулс (мин 0 – макс 1):</span>
                <input type="text" inputmode="decimal" id="iaa-sniper-pro-momentum-gate" value="0.2" style="width:70px; padding:4px 6px; border-radius:6px; border:1px solid rgba(255,255,255,.1); background:rgba(0,0,0,.3); color:#fff; font-weight:700">
              </div>
              <div style="display:flex;justify-content:space-between;align-items:center;margin:8px 0;">
                <span style="font-size:11px;color:#9ca3af" data-i18n="sniper_pro_cooldown" title="Минимална пауза между входове.">Пауза между входове (мин 0 – макс 60):</span>
                <input type="number" id="iaa-sniper-pro-cooldown" min="0" max="60" step="1" value="2" style="width:70px; padding:4px 6px; border-radius:6px; border:1px solid rgba(255,255,255,.1); background:rgba(0,0,0,.3); color:#fff; font-weight:700">
              </div>
            </div>
            <div style="margin:12px 0; padding-top:8px; border-top:1px solid rgba(255,255,255,.05);">
              <div style="display:flex;justify-content:space-between;align-items:center;margin:8px 0;">
                <span style="font-size:11px;color:#9ca3af" data-i18n="sniper_max_session_loss">Стоп при загуба (€):</span>
                <input type="number" id="iaa-sniper-max-session-loss" min="0" step="1" value="0" style="width:70px; padding:4px 6px; border-radius:6px; border:1px solid rgba(255,255,255,.1); background:rgba(0,0,0,.3); color:#fff; font-weight:700">
              </div>
              <div style="display:flex;justify-content:space-between;align-items:center;margin:8px 0;">
                <span style="font-size:11px;color:#9ca3af" data-i18n="sniper_max_loss_streak">Стоп при поредни загуби:</span>
                <input type="number" id="iaa-sniper-max-loss-streak" min="0" step="1" value="0" style="width:70px; padding:4px 6px; border-radius:6px; border:1px solid rgba(255,255,255,.1); background:rgba(0,0,0,.3); color:#fff; font-weight:700">
              </div>
            </div>
            <div style="margin:12px 0; padding-top:8px; border-top:1px solid rgba(255,255,255,.05);">
              <div style="font-size:11px;color:#9ca3af;margin-bottom:6px;" data-i18n="sniper_timeframes">Таймфрейми за изпълнение:</div>
              <div style="display:flex;flex-wrap:wrap;gap:8px;">
<div style="
  margin-top:10px;
  padding:10px;
  border-radius:10px;
  background:#0b1220;
  border:1px solid rgba(255,255,255,.12);
  color:#eaf2ff;
">
  <div style="font-weight:800;margin-bottom:8px;color:#ffffff;letter-spacing:.2px;">
    Калибрация TIME/Expiry (Shift+W)
  </div>

  <div style="display:flex;flex-wrap:wrap;gap:8px;">
    <button id="iaa-cal-open" type="button" style="padding:7px 10px;border-radius:8px;border:1px solid rgba(255,255,255,.18);background:#16233a;color:#ffffff;font-weight:700;cursor:pointer;">
      TIME (OPEN)
    </button>
    <button id="iaa-cal-s3" type="button" style="padding:7px 10px;border-radius:8px;border:1px solid rgba(255,255,255,.18);background:#111827;color:#ffffff;font-weight:700;cursor:pointer;">
      3s
    </button>
    <button id="iaa-cal-s15" type="button" style="padding:7px 10px;border-radius:8px;border:1px solid rgba(255,255,255,.18);background:#111827;color:#ffffff;font-weight:700;cursor:pointer;">
      15s
    </button>
    <button id="iaa-cal-s30" type="button" style="padding:7px 10px;border-radius:8px;border:1px solid rgba(255,255,255,.18);background:#111827;color:#ffffff;font-weight:700;cursor:pointer;">
      30s
    </button>
    <button id="iaa-cal-m1" type="button" style="padding:7px 10px;border-radius:8px;border:1px solid rgba(255,255,255,.18);background:#111827;color:#ffffff;font-weight:700;cursor:pointer;">
      1m
    </button>
    <button id="iaa-cal-m3" type="button" style="padding:7px 10px;border-radius:8px;border:1px solid rgba(255,255,255,.18);background:#111827;color:#ffffff;font-weight:700;cursor:pointer;">
      3m
    </button>
    <button id="iaa-cal-m5" type="button" style="padding:7px 10px;border-radius:8px;border:1px solid rgba(255,255,255,.18);background:#111827;color:#ffffff;font-weight:700;cursor:pointer;">
      5m
    </button>
    <button id="iaa-cal-dump" type="button" style="padding:7px 10px;border-radius:8px;border:1px solid rgba(56,189,248,.45);background:#0a2a3a;color:#e6fbff;font-weight:800;cursor:pointer;">
      Покажи
    </button>
  </div>

  <div style="opacity:0.9;margin-top:8px;font-size:12.5px;color:#cfe4ff;line-height:1.25;">
    Натисни бутон → посочи елемента в PocketOption → <b style="color:#ffffff;">Shift+W</b>.
  </div>
</div>


                <label style="display:flex;align-items:center;gap:6px;font-size:12px"><input type="checkbox" id="iaa-sniper-tf-5s"> 5s</label>
                <label style="display:flex;align-items:center;gap:6px;font-size:12px"><input type="checkbox" id="iaa-sniper-tf-15s"> 15s</label>
                <label style="display:flex;align-items:center;gap:6px;font-size:12px"><input type="checkbox" id="iaa-sniper-tf-30s"> 30s</label>
                <label style="display:flex;align-items:center;gap:6px;font-size:12px"><input type="checkbox" id="iaa-sniper-tf-1m"> 1m</label>
              </div>
            </div>
            <div style="margin:12px 0; padding-top:8px; border-top:1px solid rgba(255,255,255,.05);">
              <div style="font-size:11px;color:#9ca3af;margin-bottom:6px;">Координати за време (x,y)</div>
              <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:8px;">
                <label style="display:flex;flex-direction:column;gap:4px;font-size:11px;color:#9ca3af;">5s
                  <input type="text" id="iaa-expiry-coord-5s" placeholder="x,y" style="width:100%; padding:4px 6px; border-radius:6px; border:1px solid rgba(255,255,255,.1); background:rgba(0,0,0,.3); color:#fff; font-weight:600">
                </label>
                <label style="display:flex;flex-direction:column;gap:4px;font-size:11px;color:#9ca3af;">15s
                  <input type="text" id="iaa-expiry-coord-15s" placeholder="x,y" style="width:100%; padding:4px 6px; border-radius:6px; border:1px solid rgba(255,255,255,.1); background:rgba(0,0,0,.3); color:#fff; font-weight:600">
                </label>
                <label style="display:flex;flex-direction:column;gap:4px;font-size:11px;color:#9ca3af;">30s
                  <input type="text" id="iaa-expiry-coord-30s" placeholder="x,y" style="width:100%; padding:4px 6px; border-radius:6px; border:1px solid rgba(255,255,255,.1); background:rgba(0,0,0,.3); color:#fff; font-weight:600">
                </label>
                <label style="display:flex;flex-direction:column;gap:4px;font-size:11px;color:#9ca3af;">1m
                  <input type="text" id="iaa-expiry-coord-1m" placeholder="x,y" style="width:100%; padding:4px 6px; border-radius:6px; border:1px solid rgba(255,255,255,.1); background:rgba(0,0,0,.3); color:#fff; font-weight:600">
                </label>
              </div>
            </div>
            <div style="margin:12px 0; padding-top:8px; border-top:1px solid rgba(255,255,255,.05);">
              <label style="display:flex;align-items:center;gap:6px;margin:8px 0;cursor:pointer;font-size:12px"><input type="checkbox" id="iaa-sniper-keep-alive"> <span data-i18n="sniper_keep_alive">Дръж таба активен</span></label>
            </div>
          </div>
        </div>

        <div id="iaa-mouse-panel">
          <button id="iaa-mouse-close">×</button>
          <div style="font-weight:700; color:#e5e7eb; margin-bottom:8px; font-size:14px;">Метод за избор на бутоните BUY/SELL</div>
          <div style="color:#cbd5e1; font-size:11px; margin-bottom:12px;">XPath е препоръчителен за максимална надеждност</div>

          <div style="display:flex; gap:8px; margin:12px 0;">
            <button id="iaa-method-xpath" style="flex:1; padding:8px 12px; border-radius:6px; border:1px solid rgba(255,255,255,.1); background:#374151; color:#60a5fa; cursor:pointer; font-size:11px; text-align:center;">XPath (препоръчително)</button>
            <button id="iaa-method-auto" style="flex:1; padding:8px 12px; border-radius:6px; border:1px solid rgba(255,255,255,.1); background:#191919; color:#fff; cursor:pointer; font-size:11px; text-align:center;">Авто откриване</button>
          </div>

          <div id="iaa-xpath-status" style="margin:12px 0; padding:8px; background:rgba(34,197,94,0.1); border-radius:6px; border:1px solid rgba(34,197,94,0.3);">
            <div style="font-size:11px; color:#22c55e; font-weight:bold;">⚡ ИНСТАНТЕН РЕЖИМ АКТИВЕН</div>
            <div style="font-size:10px; color:#9ca3af; margin-top:4px;">Без забавяне – максимална скорост</div>
          </div>

          <div style="max-height:120px; overflow:auto; border:1px dashed rgba(255,255,255,.08); border-radius:6px; padding:8px; color:#9ca3af; font-size:11px; margin:8px 0;" id="iaa-mouse-log"></div>
        </div>
      `;
      shell.appendChild(panel);
      document.body.appendChild(shell);

      const toggleBtn = $id('iaa-toggle');
      const dotEl = $id('iaa-dot');
      const autoBtn = $id('iaa-auto');

      if (toggleBtn) toggleBtn.classList.toggle('stop', S.running);
      if (dotEl) {
        dotEl.style.background = S.running ? '#22c55e' : '#ef4444';
        dotEl.style.boxShadow = S.running ? '0 0 8px rgba(34,197,94,.85)' : '0 0 8px rgba(239,68,68,.85)';
      }
      if (toggleBtn) {
        toggleBtn.classList.toggle('is-running', S.running);
        toggleBtn.classList.toggle('is-stopped', !S.running);
      }
      if (autoBtn) {
        autoBtn.classList.toggle('on', S.autoTrade);
        autoBtn.classList.toggle('off', !S.autoTrade);
      }
      renderConsole();
      setStatusOverlay(formatStatus('looking_for_opportunity'), '', false);
      applyStatusLabels();
      renderTradeStats();

      let dragging = false, off = {x:0, y:0};
      const dragHandle = $id('iaa-panel');
      if (dragHandle) {
        dragHandle.addEventListener('mousedown', e => {
          if(['INPUT','SELECT','BUTTON','TEXTAREA'].includes(e.target.tagName)) return;
          dragging = true;
          off.x = e.clientX - shell.offsetLeft;
          off.y = e.clientY - shell.offsetTop;
          dragHandle.style.cursor = 'grabbing';
        });
      }

      document.addEventListener('mousemove', e => {
        if(!dragging) return;
        shell.style.left = (e.clientX - off.x) + 'px';
        shell.style.top = (e.clientY - off.y) + 'px';
      });

      document.addEventListener('mouseup', () => {
        if(dragging) {
          dragging = false;
          const dragHandle = $id('iaa-panel');
          if (dragHandle) dragHandle.style.cursor = 'grab';
        }
      });

      const logo = $id('iaa-logo'); 
      if (logo) {
        const candidates = [C.LOGO_LOCAL, C.LOGO_FALLBACK];
        let candidateIndex = 0;
        const applyNext = () => {
          const next = candidates[candidateIndex];
          candidateIndex += 1;
          if (!next) return;
          try {
            logo.src = chrome.runtime.getURL(next);
          } catch {
            logo.src = next;
          }
        };
        logo.onerror = () => {
          if (candidateIndex < candidates.length) {
            applyNext();
          }
        };
        applyNext();
      }

      function showPopup(popupId) {
        const popup = $id(popupId);
        if (popup) popup.style.display = 'block';
      }

      function hidePopups() {
        const settings = $id('iaa-settings-panel');
        const mouse = $id('iaa-mouse-panel');
        const debug = $id('iaa-debug-panel');
        if (settings) settings.style.display = 'none';
        if (mouse) mouse.style.display = 'none';
        if (debug) debug.style.display = 'none';
        S.settingsPanelOpen = false;
        S.mousePanelOpen = false;
      }

      const settingsToggle = $id('iaa-settings-toggle');
      const mouseToggle = $id('iaa-mouse-toggle');
      const settingsClose = $id('iaa-settings-close');
      const mouseClose = $id('iaa-mouse-close');
      const debugToggle = $id('iaa-debug-toggle');
      const debugClose = $id('iaa-debug-close');
      const debugCopy = $id('iaa-debug-copy');
      const consoleCopy = $id('iaa-console-copy');

      if (settingsToggle) {
        settingsToggle.addEventListener('click', () => {
          if (S.settingsPanelOpen) hidePopups();
          else { hidePopups(); showPopup('iaa-settings-panel'); S.settingsPanelOpen = true; renderSettingsPanel(); }
        });
      }
setTimeout(() => {
  const bind = (id, key) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.onclick = () => iaaSetCalTarget(key);
  };

  bind('iaa-cal-open', 'OPEN');
  bind('iaa-cal-s3', 'S3');
  bind('iaa-cal-s15', 'S15');
  bind('iaa-cal-s30', 'S30');
  bind('iaa-cal-m1', 'M1');
  bind('iaa-cal-m3', 'M3');
  bind('iaa-cal-m5', 'M5');

  const dumpBtn = document.getElementById('iaa-cal-dump');
  if (dumpBtn) dumpBtn.onclick = () => {
    iaaDumpCal();
    logConsoleLine('Калибрация: координатите са в F12 Console.');
  };
}, 0);


      if (mouseToggle) {
        mouseToggle.addEventListener('click', () => {
          if (S.mousePanelOpen) hidePopups();
          else { hidePopups(); showPopup('iaa-mouse-panel'); S.mousePanelOpen = true; renderMousePanel(); }
        });
      }

      if (debugToggle) {
        debugToggle.addEventListener('click', () => {
          const debug = $id('iaa-debug-panel');
          if (!debug) return;
          renderDebugInfo();
          if (debug.style.display === 'block') {
            hidePopups();
          } else {
            hidePopups();
            debug.style.display = 'block';
          }
        });
      }

      if (settingsClose) settingsClose.addEventListener('click', hidePopups);
      if (mouseClose) mouseClose.addEventListener('click', hidePopups);
      if (debugClose) debugClose.addEventListener('click', hidePopups);
      if (debugCopy) {
        debugCopy.addEventListener('click', async () => {
          const ok = await copyDebugInfo();
          if (!ok) return;
          const original = debugCopy.textContent;
          debugCopy.textContent = 'КОПИРАНО';
          setTimeout(() => { debugCopy.textContent = original; }, 1200);
        });
      }
      if (consoleCopy) {
        consoleCopy.addEventListener('click', async () => {
          const ok = await copyConsoleToClipboard();
          if (!ok) return;
          const original = consoleCopy.textContent;
          consoleCopy.textContent = 'КОПИРАНО';
          setTimeout(() => { consoleCopy.textContent = original; }, 1200);
        });
      }
    }

    function setStatusOverlay(text, countdown = '', logToConsole = true) {
      const fallback = formatStatus('looking_for_opportunity');
      const nextText = text || fallback;
      const prevStatus = S.currentStatus;
      const changed = nextText !== prevStatus;
      const now = Date.now();
      if (changed && S.lastStatusAt && now - S.lastStatusAt < 800) {
        return;
      }
      S.currentStatus = nextText;
      if (changed) {
        S.lastStatusAt = now;
      }
      const el = $id('iaa-status-overlay');
      if (el) {
        if (el.textContent !== nextText) {
          el.textContent = nextText;
          // Add smooth transition only when the text changes
          el.style.opacity = '0';
          setTimeout(() => {
            el.style.opacity = '1';
          }, 50);
        }
      }
      if (logToConsole && changed && nextText !== fallback) {
        logConsoleLine(nextText);
      }
    }

    function renderChip(signal){
      const wrap=$id('iaa-chip-wrap'), chip=$id('iaa-chip'), arrow=$id('iaa-arrow'), text=$id('iaa-text');
      if (!wrap || !chip || !arrow || !text) return;
      if (signal) {
        wrap.style.display='flex';
        chip.classList.remove('chip--buy','chip--sell'); arrow.classList.remove('arrow--up','arrow--down');
        const dir = signal.direction.toLowerCase();
        if (dir==='buy'||dir==='call'||dir==='up'){ chip.classList.add('chip--buy'); arrow.classList.add('arrow--up'); text.textContent=`BUY @ ${signal.time}`; }
        else if (dir==='sell'||dir==='put'||dir==='down'){ chip.classList.add('chip--sell'); arrow.classList.add('arrow--down'); text.textContent=`SELL @ ${signal.time}`; }
        const assetEl = $id('iaa-asset');
        const expEl = $id('iaa-exp');
        if (assetEl) assetEl.textContent = signal.asset || '—';
        if (expEl) expEl.textContent = signal.expiry || '—';
      } else {
        wrap.style.display='none';
      }
    }

    function renderPendingTrades(){
      const execEl = $id('iaa-exec');
      if (S.currentSignal && execEl) execEl.textContent = fmtHHMMSSLocal(new Date(S.currentSignal.targetTsMs));
      else if (execEl) execEl.textContent = '—';

      renderChip(S.currentSignal);

      const confEl = $id('iaa-analysis-score');
      if (confEl) {
        const pct = Math.round((S.analysisConfidence || 0) * 100);
        const dir = S.analysisDirection ? ` ${S.analysisDirection}` : '';
        confEl.textContent = `${pct}%${dir}`;
      }

      const etaEl = $id('iaa-next-trade');
      if (etaEl) etaEl.textContent = getNextEtaLabel();
      renderLiveInfo();
      renderSniperMatrix();
    }

    async function restoreSettings(){
      const base = await storage.get(BASE_AMOUNT_KEY);
      if (typeof base === 'number' && base > 0) S.baseAmount = base;
      if (!Number.isFinite(S.baseAmount) || S.baseAmount <= 0) {
        S.baseAmount = 100;
      }
      const ex  = await storage.get(EXPIRY_KEY); if (typeof ex === 'string') S.expirySetting = normalizeExpiry(ex) || '1M';
      const analysisEnabled = await storage.get(ANALYSIS_ENABLED_KEY); if (typeof analysisEnabled === 'boolean') S.analysisEnabled = analysisEnabled;
      const analysisConfidence = await storage.get(ANALYSIS_CONFIDENCE_KEY); if (typeof analysisConfidence === 'number') S.analysisConfidenceThreshold = analysisConfidence;
      const tradeIntervalMin = await storage.get(TRADE_INTERVAL_MIN_KEY); if (typeof tradeIntervalMin === 'number') S.tradeIntervalMin = tradeIntervalMin;
      const payoutMin = await storage.get(PAYOUT_MIN_KEY); if (typeof payoutMin === 'number') S.payoutMin = payoutMin;
      const payoutMax = await storage.get(PAYOUT_MAX_KEY); if (typeof payoutMax === 'number') S.payoutMax = payoutMax;
      const payoutRequired = await storage.get(PAYOUT_REQUIRED_KEY); if (typeof payoutRequired === 'boolean') S.payoutRequired = payoutRequired;
      const maxTradeAmount = await storage.get(MAX_TRADE_AMOUNT_KEY); if (typeof maxTradeAmount === 'number') S.maxTradeAmountCents = maxTradeAmount;
      const maxTradeMultiplier = await storage.get(MAX_TRADE_MULTIPLIER_KEY); if (typeof maxTradeMultiplier === 'number') S.maxTradeAmountMultiplier = maxTradeMultiplier;
      const analysisWindowSec = await storage.get(ANALYSIS_WINDOW_SEC_KEY); if (typeof analysisWindowSec === 'number') S.analysisWindowSec = analysisWindowSec;
      const analysisWarmupMin = await storage.get(ANALYSIS_WARMUP_MIN_KEY); if (typeof analysisWarmupMin === 'number') S.analysisWarmupMin = analysisWarmupMin;
      const selfTradeEnabled = await storage.get(SELF_TRADE_ENABLED_KEY); if (typeof selfTradeEnabled === 'boolean') S.selfTradeEnabled = selfTradeEnabled;
      const signal1m = await storage.get(SIGNAL_SOURCE_1M_KEY);
      if (typeof signal1m === 'boolean') S.signalSourceEnabled['1m'] = signal1m;
      const signal5m = await storage.get(SIGNAL_SOURCE_5M_KEY);
      if (typeof signal5m === 'boolean') S.signalSourceEnabled['5m'] = signal5m;
      const signalOffset = await storage.get(SIGNAL_TIME_OFFSET_MIN_KEY);
      if (typeof signalOffset === 'number') S.signalTimeOffsetMin = signalOffset;
      const expiryCoords = await storage.get(EXPIRY_COORDS_KEY);
      if (expiryCoords && typeof expiryCoords === 'object') {
        S.expiryCoords = {
          ...S.expiryCoords,
          ...expiryCoords
        };
      }
      const savedMethod = await storage.get(BUY_SELL_METHOD_KEY);
      if (savedMethod && ['auto', 'xpath'].includes(savedMethod)) {
        S.buySellMethod = savedMethod;
      }

      const savedXPaths = await storage.get(XPATH_SELECTORS_KEY);
      if (savedXPaths && typeof savedXPaths === 'object') {
        S.xpathSelectors = Object.assign({}, S.xpathSelectors, savedXPaths);
      }

      const savedMode = await storage.get(MODE_KEY);
      if (savedMode === 'sniper' || savedMode === 'signals') {
        S.mode = savedMode;
      }
      const savedProfile = await storage.get(SNIPER_PROFILE_KEY);
      if (savedProfile === 'pro' || savedProfile === '5s') {
        applySniperDefaults(savedProfile);
      } else if (savedProfile === 'standard') {
        applySniperDefaults('5s');
      } else {
        applySniperDefaults('pro');
      }
      const sniperBaseAmount = await storage.get(SNIPER_BASE_AMOUNT_KEY);
      if (typeof sniperBaseAmount === 'number') S.sniperBaseAmount = sniperBaseAmount;
      const sniperProBaseAmount = await storage.get(SNIPER_PRO_BASE_AMOUNT_KEY);
      if (typeof sniperProBaseAmount === 'number') S.sniperProBaseAmount = sniperProBaseAmount;
      const proScoreThreshold = await storage.get(SNIPER_PRO_SCORE_THRESHOLD_KEY);
      if (typeof proScoreThreshold === 'number') S.sniperProScoreThreshold = proScoreThreshold;
      const proRiskRatio = await storage.get(SNIPER_PRO_RISK_RATIO_KEY);
      if (typeof proRiskRatio === 'number') S.sniperProRiskRatio = proRiskRatio;
      const proRiskPremium = await storage.get(SNIPER_PRO_RISK_PREMIUM_KEY);
      if (typeof proRiskPremium === 'number') S.sniperProRiskPremium = proRiskPremium;
      const proTrendBias = await storage.get(SNIPER_PRO_TREND_BIAS_KEY);
      if (typeof proTrendBias === 'number') S.sniperProTrendBias = proTrendBias;
      const proMomentumGate = await storage.get(SNIPER_PRO_MOMENTUM_GATE_KEY);
      if (typeof proMomentumGate === 'number') S.sniperProMomentumGate = proMomentumGate;
      const proCooldownMin = await storage.get(SNIPER_PRO_COOLDOWN_MIN_KEY);
      if (typeof proCooldownMin === 'number') S.sniperProCooldownMin = proCooldownMin;
    }

    function persistSettings(){
      storage.set(BASE_AMOUNT_KEY, S.baseAmount ?? 100);
      storage.set(EXPIRY_KEY, S.expirySetting);
      storage.set(ANALYSIS_ENABLED_KEY, S.analysisEnabled);
      storage.set(ANALYSIS_CONFIDENCE_KEY, S.analysisConfidenceThreshold);
      storage.set(TRADE_INTERVAL_MIN_KEY, S.tradeIntervalMin);
      storage.set(PAYOUT_MIN_KEY, S.payoutMin);
      storage.set(PAYOUT_MAX_KEY, S.payoutMax);
      storage.set(PAYOUT_REQUIRED_KEY, S.payoutRequired);
      storage.set(MAX_TRADE_AMOUNT_KEY, S.maxTradeAmountCents);
      storage.set(MAX_TRADE_MULTIPLIER_KEY, S.maxTradeAmountMultiplier);
      storage.set(ANALYSIS_WINDOW_SEC_KEY, S.analysisWindowSec);
      storage.set(ANALYSIS_WARMUP_MIN_KEY, S.analysisWarmupMin);
      storage.set(SELF_TRADE_ENABLED_KEY, S.selfTradeEnabled);
      storage.set(SIGNAL_SOURCE_1M_KEY, S.signalSourceEnabled['1m']);
      storage.set(SIGNAL_SOURCE_5M_KEY, S.signalSourceEnabled['5m']);
      storage.set(SIGNAL_TIME_OFFSET_MIN_KEY, S.signalTimeOffsetMin);
      storage.set(EXPIRY_COORDS_KEY, S.expiryCoords);
      storage.set(BUY_SELL_METHOD_KEY, S.buySellMethod);
      storage.set(XPATH_SELECTORS_KEY, S.xpathSelectors);
      storage.set(MODE_KEY, getActiveMode());
      storage.set(SNIPER_KEEP_ALIVE_KEY, S.sniperKeepAliveEnabled);
      storage.set(SNIPER_PROFILE_KEY, S.sniperProfile);
      storage.set(SNIPER_BASE_AMOUNT_KEY, S.sniperBaseAmount);
      storage.set(SNIPER_PRO_BASE_AMOUNT_KEY, S.sniperProBaseAmount);
      storage.set(SNIPER_PRO_SCORE_THRESHOLD_KEY, S.sniperProScoreThreshold);
      storage.set(SNIPER_PRO_RISK_RATIO_KEY, S.sniperProRiskRatio);
      storage.set(SNIPER_PRO_RISK_PREMIUM_KEY, S.sniperProRiskPremium);
      storage.set(SNIPER_PRO_TREND_BIAS_KEY, S.sniperProTrendBias);
      storage.set(SNIPER_PRO_MOMENTUM_GATE_KEY, S.sniperProMomentumGate);
      storage.set(SNIPER_PRO_COOLDOWN_MIN_KEY, S.sniperProCooldownMin);
    }

    function renderSettingsPanel(){
      const l1 = $id('iaa-l1'), l2 = $id('iaa-l2');
      if (l1) l1.checked = S.l1Active;
      if (l2) l2.checked = S.l2Active;

      const modeSignals = $id('iaa-mode-signals');
      const modeSniper = $id('iaa-mode-sniper');
      const signalsPanel = $id('iaa-settings-signals');
      const sniperPanel = $id('iaa-settings-sniper');
      const sniper5sSettings = $id('iaa-sniper-5s-settings');
      const sniperProSettings = $id('iaa-sniper-pro-settings');
      const sniperThreshold = $id('iaa-sniper-threshold');
      const sniperBase = $id('iaa-sniper-base');
      const sniperMinPayout = $id('iaa-sniper-min-payout');
      const sniperEntryWindow = $id('iaa-sniper-entry-window');
      const sniperWarmup = $id('iaa-sniper-warmup');
      const sniperMaxSessionLoss = $id('iaa-sniper-max-session-loss');
      const sniperMaxLossStreak = $id('iaa-sniper-max-loss-streak');
      const sniperProfile5s = $id('iaa-sniper-profile-5s');
      const sniperProfilePro = $id('iaa-sniper-profile-pro');
      const sniperProBase = $id('iaa-sniper-pro-base');
      const sniperProScoreThreshold = $id('iaa-sniper-pro-score-threshold');
      const sniperProRiskRatio = $id('iaa-sniper-pro-risk-ratio');
      const sniperProRiskPremium = $id('iaa-sniper-pro-risk-premium');
      const sniperProTrendBias = $id('iaa-sniper-pro-trend-bias');
      const sniperProMomentumGate = $id('iaa-sniper-pro-momentum-gate');
      const sniperProCooldown = $id('iaa-sniper-pro-cooldown');
      const sniperVwap = $id('iaa-sniper-vwap');
      const sniperMomentum = $id('iaa-sniper-momentum');
      const sniperTf5s = $id('iaa-sniper-tf-5s');
      const sniperTf15 = $id('iaa-sniper-tf-15s');
      const sniperTf30 = $id('iaa-sniper-tf-30s');
      const sniperTf1m = $id('iaa-sniper-tf-1m');
      const sniperKeepAlive = $id('iaa-sniper-keep-alive');
      const expiryCoord5s = $id('iaa-expiry-coord-5s');
      const expiryCoord15s = $id('iaa-expiry-coord-15s');
      const expiryCoord30s = $id('iaa-expiry-coord-30s');
      const expiryCoord1m = $id('iaa-expiry-coord-1m');

      const exp = $id('iaa-expiry-setting');
      const base = $id('iaa-base-amount');
      const analysisEnabled = $id('iaa-analysis-enabled');
      const analysisConfidence = $id('iaa-analysis-confidence');
      const tradeIntervalMin = $id('iaa-trade-interval-min');
      const payoutMin = $id('iaa-payout-min');
      const payoutMax = $id('iaa-payout-max');
      const payoutRequired = $id('iaa-payout-required');
      const maxTradeAmount = $id('iaa-max-trade-amount');
      const maxTradeMultiplier = $id('iaa-max-trade-multiplier');
      const analysisWindow = $id('iaa-analysis-window');
      const analysisWarmup = $id('iaa-analysis-warmup');
      const selfTradeEnabled = $id('iaa-self-trade-enabled');
      const signalSource1m = $id('iaa-signal-source-1m');
      const signalSource5m = $id('iaa-signal-source-5m');
      const signalTimeOffset = $id('iaa-signal-time-offset');

      if (exp) exp.value = S.expirySetting;
      if (base) base.value = (S.baseAmount ?? 100)/100;
      if (analysisEnabled) analysisEnabled.checked = S.analysisEnabled;
      if (analysisConfidence) analysisConfidence.value = S.analysisConfidenceThreshold || 0;
      if (tradeIntervalMin) tradeIntervalMin.value = S.tradeIntervalMin || 9;
      if (payoutMin) payoutMin.value = S.payoutMin || 0;
      if (payoutMax) payoutMax.value = S.payoutMax || 0;
      if (payoutRequired) payoutRequired.checked = S.payoutRequired;
      if (maxTradeAmount) maxTradeAmount.value = (S.maxTradeAmountCents || 0) / 100;
      if (maxTradeMultiplier) maxTradeMultiplier.value = S.maxTradeAmountMultiplier || 1.5;
      if (analysisWindow) analysisWindow.value = S.analysisWindowSec || 300;
      if (analysisWarmup) analysisWarmup.value = S.analysisWarmupMin || 5;
      if (selfTradeEnabled) selfTradeEnabled.checked = S.selfTradeEnabled;
      if (signalSource1m) signalSource1m.checked = S.signalSourceEnabled['1m'];
      if (signalSource5m) signalSource5m.checked = S.signalSourceEnabled['5m'];
      if (signalTimeOffset) signalTimeOffset.value = S.signalTimeOffsetMin ?? 0;
      if (sniperProfile5s) sniperProfile5s.checked = S.sniperProfile === '5s';
      if (sniperProfilePro) sniperProfilePro.checked = S.sniperProfile === 'pro';
      if (sniper5sSettings) sniper5sSettings.style.display = S.sniperProfile === '5s' ? 'block' : 'none';
      if (sniperProSettings) sniperProSettings.style.display = S.sniperProfile === 'pro' ? 'block' : 'none';
      if (sniperThreshold) sniperThreshold.value = S.sniperThreshold ?? 0.7;
      if (sniperBase) sniperBase.value = (S.sniperBaseAmount ?? 10000) / 100;
      if (sniperProBase) sniperProBase.value = (S.sniperProBaseAmount ?? 10000) / 100;
      if (sniperProScoreThreshold) sniperProScoreThreshold.value = S.sniperProScoreThreshold ?? 0.55;
      if (sniperProRiskRatio) sniperProRiskRatio.value = S.sniperProRiskRatio ?? 0.25;
      if (sniperProRiskPremium) sniperProRiskPremium.value = S.sniperProRiskPremium ?? 0.08;
      if (sniperProTrendBias) sniperProTrendBias.value = S.sniperProTrendBias ?? 0.15;
      if (sniperProMomentumGate) sniperProMomentumGate.value = S.sniperProMomentumGate ?? 0.2;
      if (sniperProCooldown) sniperProCooldown.value = S.sniperProCooldownMin ?? 2;
      if (sniperMinPayout) sniperMinPayout.value = S.sniperMinPayout ?? 85;
      if (sniperEntryWindow) sniperEntryWindow.value = S.sniperEntryWindowSec ?? 5;
      if (sniperWarmup) sniperWarmup.value = S.sniperWarmupMin ?? 10;
      if (sniperMaxSessionLoss) sniperMaxSessionLoss.value = (S.maxSessionLossCents || 0) / 100;
      if (sniperMaxLossStreak) sniperMaxLossStreak.value = S.maxConsecutiveLosses || 0;
      if (sniperVwap) sniperVwap.value = S.sniperVwapDeviation ?? 0.0015;
      if (sniperMomentum) sniperMomentum.value = S.sniperMomentumThreshold ?? 0.0012;
      if (sniperTf5s) sniperTf5s.checked = S.sniperEnabledTimeframes['5s'];
      if (sniperTf15) sniperTf15.checked = S.sniperEnabledTimeframes['15s'];
      if (sniperTf30) sniperTf30.checked = S.sniperEnabledTimeframes['30s'];
      if (sniperTf1m) sniperTf1m.checked = S.sniperEnabledTimeframes['1m'];
      if (sniperKeepAlive) sniperKeepAlive.checked = S.sniperKeepAliveEnabled;
      if (expiryCoord5s) expiryCoord5s.value = S.expiryCoords?.['5S'] ? `${S.expiryCoords['5S'].x},${S.expiryCoords['5S'].y}` : '';
      if (expiryCoord15s) expiryCoord15s.value = S.expiryCoords?.['15S'] ? `${S.expiryCoords['15S'].x},${S.expiryCoords['15S'].y}` : '';
      if (expiryCoord30s) expiryCoord30s.value = S.expiryCoords?.['30S'] ? `${S.expiryCoords['30S'].x},${S.expiryCoords['30S'].y}` : '';
      if (expiryCoord1m) expiryCoord1m.value = S.expiryCoords?.['1M'] ? `${S.expiryCoords['1M'].x},${S.expiryCoords['1M'].y}` : '';

      if (modeSignals && modeSniper) {
        const sniperMode = isSniperMode();
        modeSignals.style.background = sniperMode ? '#111827' : '#16a34a';
        modeSignals.style.color = sniperMode ? '#fff' : '#052e16';
        modeSniper.style.background = sniperMode ? '#16a34a' : '#111827';
        modeSniper.style.color = sniperMode ? '#052e16' : '#fff';
      }
      if (signalsPanel) signalsPanel.style.display = isSniperMode() ? 'none' : 'block';
      if (sniperPanel) sniperPanel.style.display = isSniperMode() ? 'block' : 'none';
      applySettingsTranslations();
      setStatusOverlay(formatStatus('looking_for_opportunity'), '', false);
      renderConsole();
      applyStatusLabels();
      renderTradeStats();
    }

    function ensurePanelHandlers(){
      const toggleBtn = $id('iaa-toggle');
      const autoBtn = $id('iaa-auto');

      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
          S.running = !S.running;
          toggleBtn.classList.toggle('stop', S.running);
          toggleBtn.classList.toggle('is-running', S.running);
          toggleBtn.classList.toggle('is-stopped', !S.running);
          const dotEl = $id('iaa-dot');
          if (dotEl) {
            dotEl.style.background = S.running ? '#22c55e' : '#ef4444';
            dotEl.style.boxShadow = S.running ? '0 0 8px rgba(34,197,94,.85)' : '0 0 8px rgba(239,68,68,.85)';
          }
          if (S.running) { 
            S.loop = setInterval(tick, 1000/C.FPS); 
            S.botStartTime = nowMs();
            S.botStartAt = Date.now();
            S.lastSignalLagSec = null;
            renderLagStatus();
            startPriceMonitoring();
            resetRiskSession();
            S.recentSignalKeys.clear();
            S.analysisReadyAt = S.analysisEnabled
              ? Date.now() + Math.max(1, S.analysisWarmupMin) * 60 * 1000
              : 0;
            S.sniperWarmupUntil = Date.now() + getSniperWarmupWindowMs();
            S.sniperLastTradeByTf = {};
            S.sniperNextTradeByTf = {};
            logConsoleLine(formatStatus('bot_started'));

            S.tradeStats = { total: 0, wins: 0, losses: 0, evens: 0 };
            renderTradeStats();
            
            const startBal = readBalanceCents();
            if (startBal !== null) {
              S.botStartBalance = startBal;
              S.tradeProfitLoss = 0;
              S.trades = [];
              updateProfitDisplay();
            }

            if (getEffectiveKeepAliveEnabled()) {
              startKeepAlive();
            }
          } else {
            clearInterval(S.loop);
            S.loop = null;
            stopKeepAlive();
            stopPriceMonitoring();
            S.tradeSequenceActive = false;
            S.currentSignal = null;
            S.assetSelecting = false;
            S.assetSelectedForSignal = false;
            S.assetSelectionAttempted = false;
            S.signalBuffer.length = 0;
            S.hasLiveSignal = false;
            S.forceImmediate = false;
            S.activeTrades = [];
            S.sniperLastDecision = null;
            S.sniperWarmupUntil = 0;
            S.sniperTfStatus = {};
            resetExecutionState();
            stopCountdown();
            setUIState('IDLE');
            renderWarmup(0);
            renderSniperMatrix();
            renderPendingTrades();
            logConsoleLine(formatStatus('bot_stopped'));
            renderTradeStats();
          }
        });
      }

      if (autoBtn) {
        autoBtn.addEventListener('click',()=>{
          S.autoTrade=!S.autoTrade;
          autoBtn.classList.toggle('on', S.autoTrade);
          autoBtn.classList.toggle('off', !S.autoTrade);
          logConsoleLine(S.autoTrade ? formatStatus('auto_on') : formatStatus('auto_off'));
        });
      }

      const L1=$id('iaa-l1'), L2=$id('iaa-l2'), L1M=$id('iaa-l1-multiplier'), L2M=$id('iaa-l2-multiplier'), EXP=$id('iaa-expiry-setting'), BASE=$id('iaa-base-amount'), ANALYSIS_ENABLED=$id('iaa-analysis-enabled'), ANALYSIS_CONFIDENCE=$id('iaa-analysis-confidence'), TRADE_INTERVAL_MIN=$id('iaa-trade-interval-min'), PAYOUT_MIN=$id('iaa-payout-min'), PAYOUT_MAX=$id('iaa-payout-max'), PAYOUT_REQUIRED=$id('iaa-payout-required'), MAX_TRADE_AMOUNT=$id('iaa-max-trade-amount'), MAX_TRADE_MULTIPLIER=$id('iaa-max-trade-multiplier'), ANALYSIS_WINDOW=$id('iaa-analysis-window'), ANALYSIS_WARMUP=$id('iaa-analysis-warmup'), SELF_TRADE_ENABLED=$id('iaa-self-trade-enabled'), SIGNAL_SOURCE_1M=$id('iaa-signal-source-1m'), SIGNAL_SOURCE_5M=$id('iaa-signal-source-5m'), SIGNAL_TIME_OFFSET=$id('iaa-signal-time-offset'), SNIPER_MAX_SESSION_LOSS=$id('iaa-sniper-max-session-loss'), SNIPER_MAX_LOSS_STREAK=$id('iaa-sniper-max-loss-streak');
      const MODE_SIGNALS = $id('iaa-mode-signals');
      const MODE_SNIPER = $id('iaa-mode-sniper');
      const SNIPER_PROFILE_5S = $id('iaa-sniper-profile-5s');
      const SNIPER_PROFILE_PRO = $id('iaa-sniper-profile-pro');
      const SNIPER_THRESHOLD = $id('iaa-sniper-threshold');
      const SNIPER_BASE = $id('iaa-sniper-base');
      const SNIPER_MIN_PAYOUT = $id('iaa-sniper-min-payout');
      const SNIPER_ENTRY = $id('iaa-sniper-entry-window');
      const SNIPER_WARMUP = $id('iaa-sniper-warmup');
      const SNIPER_VWAP = $id('iaa-sniper-vwap');
      const SNIPER_MOMENTUM = $id('iaa-sniper-momentum');
      const SNIPER_TF_5S = $id('iaa-sniper-tf-5s');
      const SNIPER_TF_15 = $id('iaa-sniper-tf-15s');
      const SNIPER_TF_30 = $id('iaa-sniper-tf-30s');
      const SNIPER_TF_1M = $id('iaa-sniper-tf-1m');
      const SNIPER_KEEP_ALIVE = $id('iaa-sniper-keep-alive');
      const SNIPER_PRO_BASE = $id('iaa-sniper-pro-base');
      const SNIPER_PRO_SCORE = $id('iaa-sniper-pro-score-threshold');
      const SNIPER_PRO_RISK_RATIO = $id('iaa-sniper-pro-risk-ratio');
      const SNIPER_PRO_RISK_PREMIUM = $id('iaa-sniper-pro-risk-premium');
      const SNIPER_PRO_TREND_BIAS = $id('iaa-sniper-pro-trend-bias');
      const SNIPER_PRO_MOMENTUM_GATE = $id('iaa-sniper-pro-momentum-gate');
      const SNIPER_PRO_COOLDOWN = $id('iaa-sniper-pro-cooldown');
      const EXPIRY_COORD_5S = $id('iaa-expiry-coord-5s');
      const EXPIRY_COORD_15S = $id('iaa-expiry-coord-15s');
      const EXPIRY_COORD_30S = $id('iaa-expiry-coord-30s');
      const EXPIRY_COORD_1M = $id('iaa-expiry-coord-1m');

      if (L1) L1.addEventListener('change',()=>{ S.l1Active=L1.checked; persistSettings(); });
      if (L2) L2.addEventListener('change',()=>{ S.l2Active=L2.checked; if (S.l2Active && !S.l1Active){ L1.checked=true; S.l1Active=true; } persistSettings(); });
      if (L1M) L1M.addEventListener('input',()=>{ S.l1Multiplier=parseNumberFlexible(L1M.value)||2; persistSettings(); });
      if (L2M) L2M.addEventListener('input',()=>{ S.l2Multiplier=parseNumberFlexible(L2M.value)||4; persistSettings(); });
      if (EXP) EXP.addEventListener('change',()=>{ S.expirySetting=normalizeExpiry(EXP.value)||'1M'; persistSettings(); });
      if (BASE) BASE.addEventListener('input',()=>{ const d=parseNumberFlexible(BASE.value)||1; S.baseAmount = Math.max(1, Math.round(d))*100; persistSettings(); });
      if (SNIPER_MAX_SESSION_LOSS) {
        SNIPER_MAX_SESSION_LOSS.addEventListener('input', () => {
          const d = parseNumberFlexible(SNIPER_MAX_SESSION_LOSS.value) || 0;
          S.maxSessionLossCents = Math.max(0, Math.round(d)) * 100;
          persistSettings();
        });
      }
      if (SNIPER_MAX_LOSS_STREAK) {
        SNIPER_MAX_LOSS_STREAK.addEventListener('input', () => {
          const d = parseNumberFlexible(SNIPER_MAX_LOSS_STREAK.value) || 0;
          S.maxConsecutiveLosses = Math.max(0, Math.round(d));
          persistSettings();
        });
      }
      if (ANALYSIS_ENABLED) {
        ANALYSIS_ENABLED.addEventListener('change',()=>{ 
          S.analysisEnabled = ANALYSIS_ENABLED.checked;
          if (S.analysisEnabled && S.running) {
            S.analysisReadyAt = Date.now() + Math.max(1, S.analysisWarmupMin) * 60 * 1000;
          } else if (!S.analysisEnabled) {
            S.analysisReadyAt = 0;
          }
          persistSettings();
        });
      }
      if (ANALYSIS_CONFIDENCE) {
        ANALYSIS_CONFIDENCE.addEventListener('input',()=>{ 
          const d = parseNumberFlexible(ANALYSIS_CONFIDENCE.value) || 0;
          S.analysisConfidenceThreshold = Math.max(0, Math.min(1, d));
          persistSettings();
        });
      }
      if (TRADE_INTERVAL_MIN) {
        TRADE_INTERVAL_MIN.addEventListener('input',()=>{ 
          const d = parseNumberFlexible(TRADE_INTERVAL_MIN.value) || 0;
          S.tradeIntervalMin = Math.max(1, Math.round(d));
          persistSettings();
        });
      }
      if (PAYOUT_MIN) {
        PAYOUT_MIN.addEventListener('input',()=>{ 
          const d = parseNumberFlexible(PAYOUT_MIN.value) || 0;
          S.payoutMin = Math.max(0, Math.round(d));
          persistSettings();
        });
      }
      if (PAYOUT_MAX) {
        PAYOUT_MAX.addEventListener('input',()=>{ 
          const d = parseNumberFlexible(PAYOUT_MAX.value) || 0;
          S.payoutMax = Math.max(0, Math.round(d));
          persistSettings();
        });
      }
      if (PAYOUT_REQUIRED) {
        PAYOUT_REQUIRED.addEventListener('change',()=>{ 
          S.payoutRequired = PAYOUT_REQUIRED.checked; 
          persistSettings();
        });
      }
      if (MAX_TRADE_AMOUNT) {
        MAX_TRADE_AMOUNT.addEventListener('input',()=>{ 
          const d = parseNumberFlexible(MAX_TRADE_AMOUNT.value) || 0;
          S.maxTradeAmountCents = Math.max(0, Math.round(d)) * 100;
          persistSettings();
        });
      }
      if (MAX_TRADE_MULTIPLIER) {
        MAX_TRADE_MULTIPLIER.addEventListener('input',()=>{ 
          const d = parseNumberFlexible(MAX_TRADE_MULTIPLIER.value) || 1.5;
          S.maxTradeAmountMultiplier = Math.max(1, d);
          persistSettings();
        });
      }
      if (ANALYSIS_WINDOW) {
        ANALYSIS_WINDOW.addEventListener('input',()=>{ 
          const d = parseNumberFlexible(ANALYSIS_WINDOW.value) || 300;
          S.analysisWindowSec = Math.max(60, Math.round(d));
          persistSettings();
        });
      }
      if (ANALYSIS_WARMUP) {
        ANALYSIS_WARMUP.addEventListener('input',()=>{ 
          const d = parseNumberFlexible(ANALYSIS_WARMUP.value) || 5;
          S.analysisWarmupMin = Math.max(1, Math.round(d));
          if (S.analysisEnabled && S.running) {
            S.analysisReadyAt = Date.now() + Math.max(1, S.analysisWarmupMin) * 60 * 1000;
          } else if (!S.analysisEnabled) {
            S.analysisReadyAt = 0;
          }
          persistSettings();
        });
      }
      if (SELF_TRADE_ENABLED) {
        SELF_TRADE_ENABLED.addEventListener('change',()=>{ 
          S.selfTradeEnabled = SELF_TRADE_ENABLED.checked;
          persistSettings();
        });
      }
      if (SIGNAL_SOURCE_1M) {
        SIGNAL_SOURCE_1M.addEventListener('change', () => {
          S.signalSourceEnabled['1m'] = SIGNAL_SOURCE_1M.checked;
          persistSettings();
        });
      }
      if (SIGNAL_SOURCE_5M) {
        SIGNAL_SOURCE_5M.addEventListener('change', () => {
          S.signalSourceEnabled['5m'] = SIGNAL_SOURCE_5M.checked;
          persistSettings();
        });
      }
      if (SIGNAL_TIME_OFFSET) {
        SIGNAL_TIME_OFFSET.addEventListener('input', () => {
          const d = parseNumberFlexible(SIGNAL_TIME_OFFSET.value) || 0;
          S.signalTimeOffsetMin = Math.max(-180, Math.min(180, Math.round(d)));
          persistSettings();
        });
      }
      if (MODE_SIGNALS) {
        MODE_SIGNALS.addEventListener('click', () => {
          setMode('signals');
          logConsoleLine('Режим: Сигнали 1м/5м');
        });
      }
      if (MODE_SNIPER) {
        MODE_SNIPER.addEventListener('click', () => {
          setMode('sniper');
          logConsoleLine('Режим: СНАЙПЕР');
        });
      }
      if (SNIPER_PROFILE_5S) {
        SNIPER_PROFILE_5S.addEventListener('change', () => {
          if (SNIPER_PROFILE_5S.checked) applySniperProfile('5s');
        });
      }
      if (SNIPER_PROFILE_PRO) {
        SNIPER_PROFILE_PRO.addEventListener('change', () => {
          if (SNIPER_PROFILE_PRO.checked) applySniperProfile('pro');
        });
      }
      if (SNIPER_THRESHOLD) {
        SNIPER_THRESHOLD.addEventListener('input', () => {
          const d = parseNumberFlexible(SNIPER_THRESHOLD.value) || 0;
          S.sniperThreshold = Math.max(0, Math.min(1, d));
          persistSettings();
        });
      }
      if (SNIPER_BASE) {
        SNIPER_BASE.addEventListener('input', () => {
          const d = parseNumberFlexible(SNIPER_BASE.value) || 1;
          S.sniperBaseAmount = Math.max(1, Math.round(d)) * 100;
          persistSettings();
        });
      }
      if (SNIPER_PRO_BASE) {
        SNIPER_PRO_BASE.addEventListener('input', () => {
          const d = parseNumberFlexible(SNIPER_PRO_BASE.value) || 1;
          S.sniperProBaseAmount = Math.max(1, Math.round(d)) * 100;
          persistSettings();
        });
      }
      if (SNIPER_PRO_SCORE) {
        SNIPER_PRO_SCORE.addEventListener('input', () => {
          const d = parseNumberFlexible(SNIPER_PRO_SCORE.value) || 0;
          S.sniperProScoreThreshold = Math.max(0, Math.min(1, d));
          persistSettings();
        });
      }
      if (SNIPER_PRO_RISK_RATIO) {
        SNIPER_PRO_RISK_RATIO.addEventListener('input', () => {
          const d = parseNumberFlexible(SNIPER_PRO_RISK_RATIO.value) || 0;
          S.sniperProRiskRatio = Math.max(0, Math.min(1, d));
          persistSettings();
        });
      }
      if (SNIPER_PRO_RISK_PREMIUM) {
        SNIPER_PRO_RISK_PREMIUM.addEventListener('input', () => {
          const d = parseNumberFlexible(SNIPER_PRO_RISK_PREMIUM.value) || 0;
          S.sniperProRiskPremium = Math.max(0, Math.min(0.5, d));
          persistSettings();
        });
      }
      if (SNIPER_PRO_TREND_BIAS) {
        SNIPER_PRO_TREND_BIAS.addEventListener('input', () => {
          const d = parseNumberFlexible(SNIPER_PRO_TREND_BIAS.value) || 0;
          S.sniperProTrendBias = Math.max(0, Math.min(1, d));
          persistSettings();
        });
      }
      if (SNIPER_PRO_MOMENTUM_GATE) {
        SNIPER_PRO_MOMENTUM_GATE.addEventListener('input', () => {
          const d = parseNumberFlexible(SNIPER_PRO_MOMENTUM_GATE.value) || 0;
          S.sniperProMomentumGate = Math.max(0, Math.min(1, d));
          persistSettings();
        });
      }
      if (SNIPER_PRO_COOLDOWN) {
        SNIPER_PRO_COOLDOWN.addEventListener('input', () => {
          const d = parseNumberFlexible(SNIPER_PRO_COOLDOWN.value) || 0;
          S.sniperProCooldownMin = Math.max(0, Math.min(60, Math.round(d)));
          persistSettings();
        });
      }
      if (SNIPER_MIN_PAYOUT) {
        SNIPER_MIN_PAYOUT.addEventListener('input', () => {
          const d = parseNumberFlexible(SNIPER_MIN_PAYOUT.value) || 0;
          S.sniperMinPayout = Math.max(0, Math.min(100, Math.round(d)));
          persistSettings();
        });
      }
      if (SNIPER_ENTRY) {
        SNIPER_ENTRY.addEventListener('input', () => {
          const d = parseNumberFlexible(SNIPER_ENTRY.value) || 5;
          S.sniperEntryWindowSec = Math.max(1, Math.min(300, Math.round(d)));
          persistSettings();
        });
      }
      if (SNIPER_WARMUP) {
        SNIPER_WARMUP.addEventListener('input', () => {
          const d = parseNumberFlexible(SNIPER_WARMUP.value) || 10;
          S.sniperWarmupMin = Math.max(1, Math.min(30, Math.round(d)));
          persistSettings();
        });
      }
      if (SNIPER_VWAP) {
        const update = () => {
          const d = parseNumberFlexible(SNIPER_VWAP.value) || 0.0015;
          S.sniperVwapDeviation = Math.max(0, d);
          persistSettings();
        };
        SNIPER_VWAP.addEventListener('input', update);
        SNIPER_VWAP.addEventListener('change', update);
      }
      if (SNIPER_MOMENTUM) {
        const update = () => {
          const d = parseNumberFlexible(SNIPER_MOMENTUM.value) || 0.0012;
          S.sniperMomentumThreshold = Math.max(0, d);
          persistSettings();
        };
        SNIPER_MOMENTUM.addEventListener('input', update);
        SNIPER_MOMENTUM.addEventListener('change', update);
      }
      if (SNIPER_TF_5S) {
        SNIPER_TF_5S.addEventListener('change', () => {
          S.sniperEnabledTimeframes['5s'] = SNIPER_TF_5S.checked;
          persistSettings();
        });
      }
      if (SNIPER_TF_15) {
        SNIPER_TF_15.addEventListener('change', () => {
          S.sniperEnabledTimeframes['15s'] = SNIPER_TF_15.checked;
          persistSettings();
        });
      }
      if (SNIPER_TF_30) {
        SNIPER_TF_30.addEventListener('change', () => {
          S.sniperEnabledTimeframes['30s'] = SNIPER_TF_30.checked;
          persistSettings();
        });
      }
      if (SNIPER_TF_1M) {
        SNIPER_TF_1M.addEventListener('change', () => {
          S.sniperEnabledTimeframes['1m'] = SNIPER_TF_1M.checked;
          persistSettings();
        });
      }
      const updateExpiryCoord = (key, input) => {
        if (!input) return;
        const coords = parseCoordinatePair(input.value);
        if (coords) {
          S.expiryCoords = { ...S.expiryCoords, [key]: coords };
        } else {
          S.expiryCoords = { ...S.expiryCoords, [key]: null };
        }
        persistSettings();
      };
      if (EXPIRY_COORD_5S) {
        EXPIRY_COORD_5S.addEventListener('input', () => updateExpiryCoord('5S', EXPIRY_COORD_5S));
      }
      if (EXPIRY_COORD_15S) {
        EXPIRY_COORD_15S.addEventListener('input', () => updateExpiryCoord('15S', EXPIRY_COORD_15S));
      }
      if (EXPIRY_COORD_30S) {
        EXPIRY_COORD_30S.addEventListener('input', () => updateExpiryCoord('30S', EXPIRY_COORD_30S));
      }
      if (EXPIRY_COORD_1M) {
        EXPIRY_COORD_1M.addEventListener('input', () => updateExpiryCoord('1M', EXPIRY_COORD_1M));
      }
      if (SNIPER_KEEP_ALIVE) {
        SNIPER_KEEP_ALIVE.addEventListener('change', () => {
          S.sniperKeepAliveEnabled = SNIPER_KEEP_ALIVE.checked;
          persistSettings();
          if (S.sniperKeepAliveEnabled && S.running) {
            startKeepAlive();
          } else if (!getEffectiveKeepAliveEnabled()) {
            stopKeepAlive();
          }
        });
      }
    }

    function ensurePanelInit(){
      ensurePanel();
      ensurePanelHandlers();
    }

    function renderWarmup(percent){
      const el = $id('iaa-warm'); if (!el) return;
      if (S.running && percent < 1.0) {
        el.textContent = `INFINITY AI ENGINE ${Math.round(percent*100)}% WARMING UP`;
        el.style.color = `hsl(${percent*120},100%,50%)`;
      } else if (S.running) { el.textContent = 'ENGINE READY. MONITORING MARKET.'; el.style.color = '#22c55e'; }
      else { el.textContent = 'BOT STOPPED.'; el.style.color='#f87171'; }
    }

    /* ===================== ENHANCED MOUSE MAPPING PANEL ===================== */

    function logMouse(msg){
      S.mouseLogs.unshift(`[${new Date().toLocaleTimeString()}] ${msg}`);
      if (S.mouseLogs.length > 20) S.mouseLogs.pop();
      const log = $id('iaa-mouse-log'); if (log) {
        log.innerHTML = S.mouseLogs.map(x=>`<div>${x}</div>`).join('');
        log.scrollTop = 0;
      }
    }

    function renderMousePanel(){
      const methodButtons = ['iaa-method-xpath', 'iaa-method-auto'];
      methodButtons.forEach(id => {
        const btn = $id(id);
        if (btn) {
          btn.style.background = '#191919';
          btn.style.color = '#fff';
          btn.style.borderColor = 'rgba(255,255,255,.1)';
        }
      });

      const xpathBtn = $id('iaa-method-xpath');
      const autoBtn = $id('iaa-method-auto');

      if (S.buySellMethod === 'xpath' && xpathBtn) {
        xpathBtn.style.background = '#374151';
        xpathBtn.style.color = '#60a5fa';
        xpathBtn.style.borderColor = '#60a5fa';
      } else if (S.buySellMethod === 'auto' && autoBtn) {
        autoBtn.style.background = '#374151';
        autoBtn.style.color = '#60a5fa';
        autoBtn.style.borderColor = '#60a5fa';
      }

      const xpathStatus = $id('iaa-xpath-status');
      if (xpathStatus) xpathStatus.style.display = S.buySellMethod === 'xpath' ? 'block' : 'none';

      logMouse(`Buy/Sell method: ${S.buySellMethod}`);
    }

    function setBuySellMethod(method) {
      if (!['xpath', 'auto'].includes(method)) return;
      S.buySellMethod = method;
      persistSettings();
      renderMousePanel();
      logMouse(`Buy/Sell method changed to: ${method}`);
    }

    function ensureMouseHandlers() {
      const xpathBtn = $id('iaa-method-xpath');
      const autoBtn = $id('iaa-method-auto');

      if (xpathBtn) xpathBtn.addEventListener('click', () => setBuySellMethod('xpath'));
      if (autoBtn) autoBtn.addEventListener('click', () => setBuySellMethod('auto'));
    }

    /* ========================= BOOT ========================= */
    api.boot = async function(){
      await restoreSettings();
      ensurePanelInit();
      ensureMouseHandlers();
      logConsoleLine(formatStatus('bot_loaded'));
      const sess = await getSession();
      if (sess && sess.ok) {
        logConsoleLine(formatStatus('session_ok'));
      }

      if (getEffectiveKeepAliveEnabled() && S.running) {
        startKeepAlive();
      }
    };

    api.stop = function(){
      if (S.running){
        const t=document.getElementById('iaa-toggle');
        t && t.click();
      }
    };

    api.S = S;
    api.xpathLocator = xpathLocator;
    api.parseRawSignalInExtension = parseRawSignalInExtension;
    api.parseInfinityAISignalFormat = parseInfinityAISignalFormat;
    api.fetchAPISignals = fetchAPISignals;
    api.debugLog = debugLog;
    api.logConsole = logConsoleLine;
    api.formatStatus = formatStatus;

    return api;
  })();

  /* ========================= AUTO-START ========================= */
  (async function(){
    const start = async () => {
      const sess = await getSession();
      if (sess && sess.ok) {
        setTimeout(() => {
          if (window.InfinityBot) {
            window.InfinityBot.boot().then(() => {
              window.InfinityBot?.logConsole?.(window.InfinityBot?.formatStatus?.('login_accepted') || 'Login accepted.');
            });
          } else {
            console.error('InfinityBot not found!');
          }
        }, 300);
      } else {
        injectLoginPanel();
      }
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', start);
    } else {
      await start();
    }
  })();
})();
