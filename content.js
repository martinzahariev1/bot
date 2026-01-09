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
  const SIGNAL_OVERRIDE_ENABLED_KEY = 'IAA_SIGNAL_OVERRIDE_ENABLED';
  const MULTI_TF_ENABLED_KEY = 'IAA_MULTI_TF_ENABLED';
  const COOLDOWN_LOSSES_KEY = 'IAA_COOLDOWN_LOSSES';
  const COOLDOWN_MIN_KEY = 'IAA_COOLDOWN_MIN';
  const REVERSAL_WINDOW_SEC_KEY = 'IAA_REVERSAL_WINDOW_SEC';
  const REVERSAL_OPPOSITE_RATIO_KEY = 'IAA_REVERSAL_OPPOSITE_RATIO';
  const PANEL_OPACITY_KEY = 'IAA_PANEL_OPACITY';
  const COUNTDOWN_BEEP_KEY = 'IAA_COUNTDOWN_BEEP';
  const SETTINGS_LANGUAGE_KEY = 'IAA_SETTINGS_LANGUAGE';
  const TRADE_MODE_KEY = 'IAA_TRADE_MODE';
  const BURST_ENABLED_KEY = 'IAA_BURST_ENABLED';
  const BURST_COUNT_KEY = 'IAA_BURST_COUNT';
  const BURST_CONFIDENCE_KEY = 'IAA_BURST_CONFIDENCE';

  // persisted mouse mapping keys
  const COORDS_KEY = 'IAA_COORDS_V1';
  const MANUAL_SELECTORS_KEY = 'IAA_MANUAL_SELECTORS_V1';
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
      .iaa-login-buttons{display:flex;justify-content:center;gap:10px;margin-top:15px;flex-wrap:wrap;}
      .iaa-small-btn{padding:6px 12px;border-radius:4px;border:none;background:#1a365d;color:#fff;cursor:pointer;font-size:11px;text-decoration:none;display:inline-block;}
      .iaa-small-btn:hover{background:#2d3748;}
    `;
    const style = document.createElement('style'); style.textContent = css; document.documentElement.appendChild(style);

    const shell = document.createElement('div'); shell.id = LOGIN_SHELL_ID;
    const card = document.createElement('div'); card.className = 'iaa-login-card';
    card.innerHTML = `
      <div class="iaa-login-logo-wrap"><img id="iaa-login-logo" class="iaa-login-logo" alt="∞ Infinity AI"/></div>
      <div id="heading">Sign In</div>
      <div class="form">
        <div class="field"><input id="iaa-pass" class="input-field" type="password" placeholder="Password" autocomplete="current-password"></div>
        <div class="field"><input id="iaa-uid" class="input-field" type="text" placeholder="PocketOption ID" autocomplete="username"></div>
        <div class="btn"><button id="iaa-login-btn" class="button">Log in</button></div>
        <div id="iaa-err" class="iaa-err"></div>
      </div>
      <div class="iaa-login-buttons">
        <a href="https://t.me/INFINITY_AI_Pro" target="_blank" class="iaa-small-btn">Get Password</a>
        <a href="https://pocket-friends.com/r/53h6ausme3" target="_blank" class="iaa-small-btn">Get ID</a>
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
      busy = true; btnLogin.disabled = true; btnLogin.textContent = 'Checking…';
      try {
        const ok = await checkCredentialsText(pass, acct);
        if (ok) { await setSession(true); shell.classList.add('iaa-hidden'); window.InfinityBot?.boot(); window.InfinityBot?.logConsole?.(window.InfinityBot?.formatStatus?.('login_accepted') || 'Login accepted.'); }
        else { await clearSession(); elErr.textContent = 'Access denied. Check your credentials.'; window.InfinityBot?.logConsole?.(window.InfinityBot?.formatStatus?.('login_denied') || 'Login denied.'); }
      } finally { busy = false; btnLogin.disabled = false; btnLogin.textContent = 'Log in'; }
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
      EARLY_FIRE_MS: 50,
      LATE_TOL_MS: 50,
      MAX_QUEUE: 50,
      DEDUPE_WINDOW_MIN: 5,
      SETTLEMENT_DELAY_MS: 200,
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
      activeTrade:null, tradeLockUntil:0, tradeCount:0,
      autoTrade:true,

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
      settingsLanguage: 'bg',
      calibrating: false,
      calStepIndex: 0,
      lastMousePos: { x: 0, y: 0 },
      lastCaptureTs: 0,
      mouseLogs: [],

      coords: {
        DD_COORD: null,
        SEARCH_COORD: null,
        ROW_OTC_COORD: null,
        ROW_SPOT_COORD: null,
        CLOSE_COORD: null,
        BUY_COORD: null,
        SELL_COORD: null
      },

      // Manual selectors
      manualSelectors: {
        buy: '',
        sell: ''
      },

      // XPath selectors
      xpathSelectors: C.XPATH_SELECTORS,

      // Buy/Sell method
      buySellMethod: 'xpath',

      // Keep alive
      keepAliveEnabled: false,
      keepAliveInterval: null,
      keepAliveActive: false,

      // trade log
      trades: [],
      tradeStats: { total: 0, wins: 0, losses: 0, evens: 0 },
      botStartAt: null,
      tradeMode: 'test',

      // risk controls
      maxSessionLossCents: 0,
      maxConsecutiveLosses: 0,
      sessionLossCents: 0,
      lossStreak: 0,

      // analysis controls
      analysisEnabled: false,
      analysisConfidenceThreshold: 0.65,
      tradeIntervalMin: 9,
      singleAssetIntervalMin: 10,
      singleAssetIntervalMax: 15,
      singleAssetPayoutMin: 82,
      singleAssetVolatilityMin: 0.00005,
      singleAssetVolatilityMax: 0.003,
      singleAssetGlitchMultiplier: 6,
      singleAssetLtfConfidence: 0.35,
      singleAssetHtfConfidence: 0.45,
      payoutMin: 80,
      payoutMax: 92,
      payoutRequired: false,
      maxTradeAmountCents: 15000,
      maxTradeAmountMultiplier: 1.5,
      analysisWindowSec: 300,
      analysisWarmupMin: 5,
      selfTradeEnabled: false,
      signalOverrideEnabled: false,
      multiTimeframeEnabled: false,
      cooldownLosses: 6,
      cooldownMin: 35,
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
      lastSingleAssetCheckAt: 0,
      lastSingleAssetSkipAt: 0,
      lastDiagnosticsAt: 0,
      lastSignalLogAt: new Map(),
      signalSourceEnabled: { '1m': true, '5m': true },

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
      skipNextTrade: false,
      cooldownUntil: 0,
      lastSkipReason: '',
      lastSkipAt: 0,
      testQualityScore: null,
      testQualityLabel: null,

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

    const SETTINGS_I18N = {
      en: {
        settings_language: 'Language',
        base_amount: 'Base Amount ($)',
        expiry_setting: 'Expiry Setting:',
        expiry_1m: '1 Minute',
        expiry_5m: '5 Minutes',
        l1_martingale: 'L1 Martingale',
        l2_martingale: 'L2 Martingale',
        l1_multiplier: 'L1 Multiplier:',
        l2_multiplier: 'L2 Multiplier:',
        max_session_loss: 'Max Session Loss ($):',
        max_loss_streak: 'Max Loss Streak:',
        limits_hint: 'Set 0 to disable limits',
        require_analysis_match: 'Require Analysis Match',
        analysis_confidence: 'Analysis Confidence (0-1):',
        analysis_window: 'Analysis Window (sec):',
        warmup_min: 'Warmup (min):',
        trade_interval_min: 'Trade Interval (min):',
        max_trade_amount: 'Max Trade Amount ($):',
        max_trade_multiplier: 'Max Trade Multiplier:',
        allow_self_trades: 'Allow Self Trades (no signal)',
        allow_signal_override: 'Allow Signal Override',
        multi_timeframe_analysis: 'Multi-Timeframe Analysis',
        payout_filter: 'Payout Filter (%)',
        min_label: 'Min:',
        max_label: 'Max:',
        require_payout_check: 'Require payout check',
        burst_entries: 'Burst entries on strong trend',
        burst_count: 'Burst Count:',
        burst_confidence: 'Burst Confidence (0-1):',
        cooldown_losses: 'Cooldown Losses:',
        cooldown_min: 'Cooldown (min):',
        late_reversal_filter: 'Late-Reversal Filter',
        reversal_window: 'Window (sec):',
        opposite_ratio: 'Opposite Ratio (0-1):',
        panel_opacity: 'Panel Opacity:',
        countdown_beep: 'Countdown Beep',
        keep_tab_alive: 'Keep Tab Alive',
        keep_tab_alive_hint: 'Prevents browser from suspending the tab',
        force_asset_selection: 'Force Asset Selection',
        force_asset_selection_hint: 'Verifies asset selection and retries if failed',
        trade_mode_label: 'Trade Mode',
        trade_mode_signals: 'All assets + signals',
        trade_mode_single: 'Single asset (EUR/USD OTC)',
        trade_mode_signals_only: 'Signals only (1m/5m)',
        trade_mode_test: 'TEST (experimental)',
        signal_source_1m: 'Enable 1m signals',
        signal_source_5m: 'Enable 5m signals'
      },
      bg: {
        settings_language: 'Език',
        base_amount: 'Основна сума ($)',
        expiry_setting: 'Време на изтичане:',
        expiry_1m: '1 минута',
        expiry_5m: '5 минути',
        l1_martingale: 'L1 мартингейл',
        l2_martingale: 'L2 мартингейл',
        l1_multiplier: 'L1 множител:',
        l2_multiplier: 'L2 множител:',
        max_session_loss: 'Макс. загуба за сесия ($):',
        max_loss_streak: 'Макс. серия загуби:',
        limits_hint: 'Задай 0 за изключване на лимитите',
        require_analysis_match: 'Изисквай съвпадение с анализа',
        analysis_confidence: 'Увереност на анализа (0-1):',
        analysis_window: 'Прозорец за анализ (сек):',
        warmup_min: 'Загряване (мин):',
        trade_interval_min: 'Интервал между сделки (мин):',
        max_trade_amount: 'Макс. сума на сделка ($):',
        max_trade_multiplier: 'Макс. множител на сделка:',
        allow_self_trades: 'Позволи самостоятелни сделки (без сигнал)',
        allow_signal_override: 'Позволи override на сигнала',
        multi_timeframe_analysis: 'Много‑таймфрейм анализ',
        payout_filter: 'Филтър за изплащане (%)',
        min_label: 'Мин:',
        max_label: 'Макс:',
        require_payout_check: 'Изисквай проверка на изплащането',
        burst_entries: 'Burst входове при силен тренд',
        burst_count: 'Брой burst:',
        burst_confidence: 'Burst увереност (0-1):',
        cooldown_losses: 'Загуби за cooldown:',
        cooldown_min: 'Cooldown (мин):',
        late_reversal_filter: 'Филтър за късно обръщане',
        reversal_window: 'Прозорец (сек):',
        opposite_ratio: 'Дял на обратните (0-1):',
        panel_opacity: 'Прозрачност на панела:',
        countdown_beep: 'Бип при отброяване',
        keep_tab_alive: 'Дръж таба активен',
        keep_tab_alive_hint: 'Предотвратява приспиване на таба от браузъра',
        force_asset_selection: 'Принудителен избор на актив',
        force_asset_selection_hint: 'Проверява избора на актив и повтаря при неуспех',
        trade_mode_label: 'Режим на търговия',
        trade_mode_signals: 'Всички валути + сигнали',
        trade_mode_single: 'Една валута (EUR/USD OTC)',
        trade_mode_signals_only: 'Само сигнали (1м/5м)',
        trade_mode_test: 'TEST (експериментален)',
        signal_source_1m: 'Сигнали 1м',
        signal_source_5m: 'Сигнали 5м'
      }
    };

    const STATUS_I18N = {
      en: {
        console_ready: 'Console ready.',
        looking_for_opportunity: 'Looking for market opportunity',
        warming_up: 'Warming up analysis ({seconds}s)',
        cooldown: 'Cooldown {seconds}s',
        ready: 'Ready',
        login_accepted: 'Login accepted.',
        login_denied: 'Login denied.',
        bot_started: 'Bot started.',
        bot_stopped: 'Bot stopped.',
        auto_on: 'Auto-trade enabled.',
        auto_off: 'Auto-trade disabled.',
        next_trade_skipped: '⏭️ NEXT TRADE SKIPPED',
        skip_reason: 'SKIP: {reason}',
        signal_received: 'Signal received ({source}): {asset} {direction} {expiry}',
        signal_scheduled: 'Signal scheduled: {time} ({expiry})',
        diagnostics: 'Diag: mode={mode} auto={auto} analysis={analysis} dir={dir} conf={conf} thr={thr} skip={skip}',
        trade_attempt: 'Trade attempt: {asset} {direction} {expiry}',
        trade_buttons_missing: 'Trade skipped: buttons not found',
        trade_amount_missing: 'Trade skipped: amount input not found',
        trade_clicked: 'Trade clicked: {direction} {amount}',
        asset_selected: 'Asset selected: {asset}',
        asset_select_failed: 'Asset selection failed',
        signal_fetch_failed: 'Signal fetch failed ({source})',
        signal_empty: 'Signal empty ({source})',
        signal_parse_failed: 'Signal parse failed ({source})',
        signal_text_snippet: 'Signal text: {snippet}',
        signal_duplicate: 'Signal duplicate ignored ({source})',
        signal_stale: 'Signal stale ignored ({source})',
        analysis_ready_selftrade_off: 'Analysis ready, but self trades are disabled.',
        switching_asset: 'Switching Asset',
        identifying_pattern: 'Identifying Entry Pattern',
        pattern_identified: 'Pattern Identified',
        trade_executed: 'Trade Executed',
        l_activated: 'L{level} Activated',
        trade_won: '✅ TRADE WON',
        trade_lost: '❌ TRADE LOST',
        trade_even: '➖ TRADE EVEN',
        risk_limit_hit: '🛑 RISK LIMIT HIT - BOT STOPPED',
        cooldown_minutes: '⏸️ COOLDOWN {minutes}m',
        bot_loaded: 'Bot initialized and ready.',
        session_ok: 'Whitelist session verified.',
        start_label: 'Start',
        total_label: 'Total',
        win_label: 'Win',
        loss_label: 'Loss',
        win_rate_label: '%',
        lag_label: 'Lag',
        feed_label: 'Feed'
      },
      bg: {
        console_ready: 'Конзолата е готова.',
        looking_for_opportunity: 'Търсене на възможност на пазара',
        warming_up: 'Загряване на анализа ({seconds}s)',
        cooldown: 'Пауза {seconds}s',
        ready: 'Готов',
        login_accepted: 'Входът е приет.',
        login_denied: 'Входът е отказан.',
        bot_started: 'Ботът е стартиран.',
        bot_stopped: 'Ботът е спрян.',
        auto_on: 'Авто‑търговия: включена.',
        auto_off: 'Авто‑търговия: изключена.',
        next_trade_skipped: '⏭️ СЛЕДВАЩАТА СДЕЛКА Е ПРОПУСНАТА',
        skip_reason: 'ПРОПУСК: {reason}',
        signal_received: 'Получен сигнал ({source}): {asset} {direction} {expiry}',
        signal_scheduled: 'Планиран сигнал: {time} ({expiry})',
        diagnostics: 'Диагн.: режим={mode} авто={auto} анализ={analysis} посока={dir} увер={conf} праг={thr} пропуск={skip}',
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
        cooldown_minutes: '⏸️ ПАУЗА {minutes}м',
        bot_loaded: 'Ботът е зареден и готов.',
        session_ok: 'Whitelist сесията е потвърдена.',
        start_label: 'Старт',
        total_label: 'Общо',
        win_label: 'Печалби',
        loss_label: 'Загуби',
        win_rate_label: '%',
        lag_label: 'Лаг',
        feed_label: 'Цена'
      }
    };

    const SKIP_REASON_I18N = {
      en: {
        Cooldown: 'Cooldown',
        Warmup: 'Warmup',
        Interval: 'Interval',
        NoTrend: 'No trend',
        Confidence: 'Low confidence',
        Mismatch: 'Direction mismatch',
        Payout: 'Payout',
        Reversal: 'Reversal',
        MaxAmount: 'Max amount',
        LowVol: 'Low volatility',
        HighVol: 'High volatility',
        Glitch: 'Price jump',
        Chop: 'Choppy market',
        Spike: 'Spike move',
        Level: 'At key level',
        Timing: 'Bad timing',
        OTCOnly: 'OTC only',
        Momentum: 'Weak momentum',
        NoFeed: 'No feed',
        Quality: 'Low quality'
      },
      bg: {
        Cooldown: 'Пауза',
        Warmup: 'Загряване',
        Interval: 'Интервал',
        NoTrend: 'Няма тренд',
        Confidence: 'Ниска увереност',
        Mismatch: 'Несъответствие на посока',
        Payout: 'Изплащане',
        Reversal: 'Обръщане',
        MaxAmount: 'Макс. сума',
        LowVol: 'Ниска волатилност',
        HighVol: 'Висока волатилност',
        Glitch: 'Скок в цената',
        Chop: 'Накъсан пазар',
        Spike: 'Рязък шип',
        Level: 'На ключово ниво',
        Timing: 'Лош тайминг',
        OTCOnly: 'Само OTC',
        Momentum: 'Слаб импулс',
        NoFeed: 'Няма цена',
        Quality: 'Ниско качество'
      }
    };

    function applySettingsTranslations(){
      const lang = S.settingsLanguage || 'en';
      const dict = SETTINGS_I18N[lang] || SETTINGS_I18N.en;
      const panel = $id('iaa-settings-panel');
      if (!panel) return;
      panel.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (key && dict[key]) el.textContent = dict[key];
      });
    }

    function formatStatus(key, vars = {}) {
      const lang = S.settingsLanguage || 'en';
      const dict = STATUS_I18N[lang] || STATUS_I18N.en;
      const fallback = STATUS_I18N.en[key] || key;
      const template = dict[key] || fallback;
      return template.replace(/\{(\w+)\}/g, (_, name) => {
        return Object.prototype.hasOwnProperty.call(vars, name) ? vars[name] : '';
      });
    }

    function translateSkipReason(reason) {
      const lang = S.settingsLanguage || 'en';
      const dict = SKIP_REASON_I18N[lang] || SKIP_REASON_I18N.en;
      return dict[reason] || reason;
    }

    function applySingleAssetDefaults() {
      S.analysisEnabled = true;
      S.selfTradeEnabled = true;
      S.multiTimeframeEnabled = true;
      S.analysisConfidenceThreshold = 0.45;
      S.analysisWindowSec = 600;
      S.analysisWarmupMin = 5;
      S.singleAssetIntervalMin = 10;
      S.singleAssetIntervalMax = 15;
      S.singleAssetPayoutMin = 82;
      S.singleAssetVolatilityMin = 0.00005;
      S.singleAssetVolatilityMax = 0.003;
      S.singleAssetGlitchMultiplier = 6;
      S.singleAssetLtfConfidence = 0.35;
      S.singleAssetHtfConfidence = 0.45;
    }

    function applyTestDefaults() {
      S.analysisEnabled = true;
      S.selfTradeEnabled = true;
      S.multiTimeframeEnabled = true;
      S.signalOverrideEnabled = false;
      S.analysisConfidenceThreshold = 0.4;
      S.analysisWindowSec = 300;
      S.analysisWarmupMin = 3;
      S.tradeIntervalMin = 20;
      S.payoutMin = 80;
      S.payoutRequired = true;
      S.cooldownLosses = 3;
      S.cooldownMin = 10;
      S.reversalWindowSec = 5;
      S.reversalOppositeRatio = 0.6;
      S.burstEnabled = false;
      S.signalSourceEnabled['1m'] = true;
      S.signalSourceEnabled['5m'] = true;
      S.testQualityScore = null;
      S.testQualityLabel = null;
    }

    function applyStatusLabels() {
      document.querySelectorAll('[data-status-key]').forEach(el => {
        const key = el.getAttribute('data-status-key');
        if (key) el.textContent = formatStatus(key);
      });
    }

    const SINGLE_ASSET = {
      asset: 'EUR/USD (OTC)',
      assetSearch: 'EURUSD',
      isOTC: true
    };

    function isSingleAssetMode() {
      return S.tradeMode === 'single_asset';
    }

    function isSignalOnlyMode() {
      return S.tradeMode === 'signals_only';
    }

    function isTestMode() {
      return S.tradeMode === 'test';
    }

    function getSelfTradeAllowed() {
      return !isSignalOnlyMode() && (S.selfTradeEnabled || isSingleAssetMode());
    }

    async function ensureSingleAssetSelected() {
      if (!isSingleAssetMode() || S.assetSelecting || S.activeTrade || S.tradeSequenceActive) return;
      const now = Date.now();
      if (now - S.lastSingleAssetCheckAt < 30000) return;
      S.lastSingleAssetCheckAt = now;
      const current = getCurrentAssetLabel();
      if (current && current.includes('EUR/USD') && /OTC/i.test(current)) {
        return;
      }
      const sig = {
        asset: SINGLE_ASSET.asset,
        assetSearch: SINGLE_ASSET.assetSearch,
        isOTC: SINGLE_ASSET.isOTC
      };
      try {
        S.assetSelecting = true;
        await selectAssetWithVerification(sig);
      } finally {
        S.assetSelecting = false;
      }
    }

    async function ensureTestAssetSelected() {
      if (!isTestMode() || S.assetSelecting || S.activeTrade || S.tradeSequenceActive || S.currentSignal) return;
      const now = Date.now();
      if (now - S.lastSingleAssetCheckAt < 30000) return;
      S.lastSingleAssetCheckAt = now;
      const current = getCurrentAssetLabel();
      if (current && /OTC/i.test(current)) {
        return;
      }
      const sig = {
        asset: SINGLE_ASSET.asset,
        assetSearch: SINGLE_ASSET.assetSearch,
        isOTC: SINGLE_ASSET.isOTC
      };
      try {
        S.assetSelecting = true;
        await selectAssetWithVerification(sig);
      } finally {
        S.assetSelecting = false;
      }
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
      if (isSignalOnlyMode()) return;
      const now = Date.now();
      if (now - S.lastDiagnosticsAt < 60000) return;
      S.lastDiagnosticsAt = now;
      const mode = S.tradeMode === 'single_asset'
        ? 'single'
        : (S.tradeMode === 'signals_only' ? 'signals_only' : (S.tradeMode === 'test' ? 'test' : 'signals'));
      const auto = S.autoTrade ? 'on' : 'off';
      const analysis = S.analysisEnabled ? 'on' : 'off';
      const dir = S.analysisDirection || '-';
      const conf = typeof S.analysisConfidence === 'number' ? S.analysisConfidence.toFixed(2) : '-';
      const thr = typeof S.analysisConfidenceThreshold === 'number' ? S.analysisConfidenceThreshold.toFixed(2) : '-';
      const skip = S.lastSkipReason ? translateSkipReason(S.lastSkipReason) : '-';
      logConsoleLine(formatStatus('diagnostics', { mode, auto, analysis, dir, conf, thr, skip }));
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
      const minIntervalMs = force ? 5000 : 60000;
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
      if (S.analysisReadyAt && S.analysisReadyAt > now) etaMs = S.analysisReadyAt - now;
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
      const threshold = typeof S.analysisConfidenceThreshold === 'number' ? S.analysisConfidenceThreshold : null;
      const lowConfidence = threshold == null ? confidence <= 0 : confidence < threshold;
      const testQuality = S.testQualityLabel && Number.isFinite(S.testQualityScore)
        ? `${S.testQualityLabel} (${S.testQualityScore}/5)`
        : '—';

      const driftSeverity = driftValue == null ? '' : (Math.abs(driftValue) >= 2 ? 'bad' : (Math.abs(driftValue) >= 1 ? 'warn' : ''));
      const lagSeverity = lagValue == null ? '' : (lagValue >= 5 ? 'bad' : (lagValue >= 2 ? 'warn' : ''));
      const feedOk = S.currentAssetPrice != null;
      const feedSeverity = feedOk ? '' : 'bad';
      const analysisUpdatedSeverity = analysisUpdatedSec != null && analysisUpdatedSec > 15 ? 'warn' : '';
      const lastSkipSeverity = S.lastSkipReason ? 'warn' : '';
      const confidenceSeverity = lowConfidence ? 'warn' : '';
      const qualitySeverity = S.testQualityLabel === 'BAD' ? 'bad' : (S.testQualityLabel === 'MID' ? 'warn' : '');

      const lines = [
        { key: 'mode', value: S.tradeMode, severity: '' },
        { key: 'auto', value: String(S.autoTrade), severity: '' },
        { key: 'analysis', value: String(S.analysisEnabled), severity: '' },
        { key: 'direction', value: S.analysisDirection || '-', severity: '' },
        { key: 'confidence', value: confidence.toFixed(2), severity: confidenceSeverity },
        { key: 'threshold', value: threshold != null ? threshold.toFixed(2) : '-', severity: '' },
        ...(isTestMode() ? [{ key: 'testQuality', value: testQuality, severity: qualitySeverity }] : []),
        { key: 'lag', value: lagLabel, severity: lagSeverity },
        { key: 'priceFeed', value: feedOk ? 'OK' : '—', severity: feedSeverity },
        { key: 'priceHistory', value: String(S.priceHistory?.length || 0), severity: '' },
        { key: 'analysisUpdated', value: analysisUpdatedLabel, severity: analysisUpdatedSeverity },
        { key: 'cooldown', value: S.cooldownUntil && S.cooldownUntil > Date.now() ? `${Math.ceil((S.cooldownUntil - Date.now()) / 1000)}s` : '—', severity: '' },
        { key: 'nextTrade', value: getNextEtaLabel(), severity: '' },
        { key: 'lastSkip', value: S.lastSkipReason || '—', severity: lastSkipSeverity },
        { key: 'clockDrift', value: driftLabel, severity: driftSeverity },
        { key: 'local', value: now.toLocaleTimeString(), severity: '' },
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

    function updateClockDriftFromResponse(response) {
      const serverDate = response?.headers?.get?.('Date') || response?.headers?.get?.('date');
      if (!serverDate) return;
      const serverTs = Date.parse(serverDate);
      if (Number.isNaN(serverTs)) return;
      const driftSec = (Date.now() - serverTs) / 1000;
      S.clockDriftSec = Math.round(driftSec * 10) / 10;
    }

    function renderManualSignal() {
      const manualEl = $id('iaa-manual-signal');
      if (!manualEl) return;
      if (!isSingleAssetMode() || !S.analysisEnabled) {
        manualEl.textContent = '—';
        return;
      }
      if (S.currentAssetPrice == null) {
        manualEl.textContent = 'No feed';
        return;
      }
      if ((S.priceHistory?.length || 0) < 6) {
        manualEl.textContent = 'Waiting data';
        return;
      }
      const dir = S.analysisDirection;
      const confidence = Number.isFinite(S.analysisConfidence) ? S.analysisConfidence : 0;
      const pct = Math.round(confidence * 100);
      const threshold = Number.isFinite(S.analysisConfidenceThreshold) ? S.analysisConfidenceThreshold : null;
      const lowConfidence = threshold == null ? confidence <= 0 : confidence < threshold;
      if (!dir) {
        manualEl.textContent = '—';
        return;
      }
      const etaMs = getNextEtaMs();
      const eta = etaMs != null ? formatCountdown(Math.max(0, etaMs)) : '';
      const reason = lowConfidence ? 'Low conf' : (S.lastSkipReason === 'Confidence' ? 'Low conf' : '');
      if (lowConfidence && confidence <= 0) {
        manualEl.textContent = reason;
        return;
      }
      manualEl.textContent = `${pct}% ${dir}${eta ? ` in ${eta}` : ''}${reason ? ` • ${reason}` : ''}`;
    }

    function renderLiveInfo() {
      const feedEl = $id('iaa-live-feed');

      if (feedEl) {
        feedEl.textContent = S.currentAssetPrice != null ? 'OK' : '—';
      }
      renderLagStatus();
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

    function normalizeExpiry(exp){
      if(!exp) return null; const e=String(exp).toUpperCase();
      if(/^(M1|1M|60S)$/.test(e)) return '1M';
      if(/^(M5|5M)$/.test(e)) return '5M';
      return '1M';
    }

    function secsFromTF(tf){ return normalizeExpiry(tf)==='5M' ? 300 : 60; }

    function getActiveTradeIntervalMin() {
      if (!isSingleAssetMode()) {
        return Math.max(1, S.tradeIntervalMin || 1);
      }
      const min = Math.max(1, S.singleAssetIntervalMin || 10);
      const max = Math.max(min, S.singleAssetIntervalMax || min);
      return min + Math.floor(Math.random() * (max - min + 1));
    }

    function getCurrentUTCMinus3Time(){ return new Date(Date.now() - 3*60*60*1000); }
    function getCurrentMinute(){ const n=getCurrentUTCMinus3Time(); return n.getUTCHours()*60 + n.getUTCMinutes(); }

    function getSingleAssetWindow(label) {
      if (!S.analysisWindows || !S.analysisWindows.length) return null;
      return S.analysisWindows.find(w => w.label === label) || null;
    }

    function getRecentPriceSamples(windowMs = 30000) {
      const now = Date.now();
      return (S.priceHistory || []).filter(p => now - p.timestamp <= windowMs);
    }

    function getRecentDeltas(samples) {
      const deltas = [];
      for (let i = 1; i < samples.length; i++) {
        deltas.push(samples[i].price - samples[i - 1].price);
      }
      return deltas;
    }

    function isChoppyMarket(deltas) {
      if (deltas.length < 6) return false;
      let flips = 0;
      let lastSign = Math.sign(deltas[0]);
      for (let i = 1; i < deltas.length; i++) {
        const sign = Math.sign(deltas[i]);
        if (sign === 0) continue;
        if (lastSign !== 0 && sign !== lastSign) flips++;
        lastSign = sign;
      }
      const flipRatio = flips / Math.max(1, deltas.length - 1);
      return flipRatio >= 0.6;
    }

    function hasSpikeMove(deltas) {
      if (deltas.length < 4) return false;
      const magnitudes = deltas.map(d => Math.abs(d));
      const avg = magnitudes.reduce((a, b) => a + b, 0) / magnitudes.length;
      const last = magnitudes[magnitudes.length - 1] || 0;
      return avg > 0 && last > avg * 3.2;
    }

    function hasMomentumAlignment(deltas, direction) {
      if (deltas.length < 4) return false;
      const recent = deltas.slice(-3);
      const avgMagnitude = deltas.map(d => Math.abs(d)).reduce((a, b) => a + b, 0) / deltas.length;
      const sameDirection = recent.every(d => (direction === 'BUY' ? d > 0 : d < 0));
      const recentMagnitude = recent.reduce((a, b) => a + Math.abs(b), 0) / recent.length;
      return sameDirection && recentMagnitude > avgMagnitude * 1.1;
    }

    function isNearKeyLevel(samples, direction) {
      if (samples.length < 6) return false;
      const prices = samples.map(p => p.price);
      const max = Math.max(...prices);
      const min = Math.min(...prices);
      const range = max - min;
      if (!range) return false;
      const current = prices[prices.length - 1];
      const distToHigh = (max - current) / range;
      const distToLow = (current - min) / range;
      const threshold = 0.15;
      if (direction === 'BUY') return distToHigh <= threshold;
      if (direction === 'SELL') return distToLow <= threshold;
      return false;
    }

    function getSecondsToCandleClose(expiry) {
      const now = getCurrentUTCMinus3Time();
      const seconds = now.getUTCSeconds();
      const minutes = now.getUTCMinutes();
      const interval = normalizeExpiry(expiry) === '5M' ? 5 : 1;
      const secondsInto = (minutes % interval) * 60 + seconds;
      return interval * 60 - secondsInto;
    }

    function evaluateTestTrade(signal) {
      const direction = signal.direction?.toUpperCase?.() || '';
      if (!direction) return { ok: false, reason: 'NoTrend', score: 0, label: 'BAD' };
      if (!signal.isOTC) return { ok: false, reason: 'OTCOnly', score: 0, label: 'BAD' };

      const samples = getRecentPriceSamples(30000);
      if (samples.length < 6) return { ok: false, reason: 'NoFeed', score: 0, label: 'BAD' };

      const deltas = getRecentDeltas(samples);
      const choppy = isChoppyMarket(deltas);
      const spike = hasSpikeMove(deltas);
      const nearLevel = isNearKeyLevel(samples, direction);
      const momentum = hasMomentumAlignment(deltas, direction);

      const secondsToClose = getSecondsToCandleClose(signal.expiry || S.expirySetting);
      const badTiming = secondsToClose > 8 || secondsToClose < 2;

      let score = 0;
      if (!choppy) score++;
      if (!spike) score++;
      if (momentum) score++;
      if (!nearLevel) score++;
      if (S.analysisConfidence >= Math.min(1, (S.analysisConfidenceThreshold || 0) + 0.05)) score++;

      let reason = '';
      if (choppy) reason = 'Chop';
      else if (spike) reason = 'Spike';
      else if (nearLevel) reason = 'Level';
      else if (!momentum) reason = 'Momentum';
      else if (badTiming) reason = 'Timing';
      else if (score < 3) reason = 'Quality';

      const label = score >= 4 ? 'GOOD' : (score >= 3 ? 'MID' : 'BAD');
      return { ok: !reason, reason, score, label, secondsToClose };
    }

    function hasExecutionGlitch() {
      if (!S.priceHistory || S.priceHistory.length < 6) return false;
      const recent = S.priceHistory.slice(-6);
      const deltas = [];
      for (let i = 1; i < recent.length; i++) {
        deltas.push(Math.abs(recent[i].price - recent[i - 1].price));
      }
      const avg = deltas.reduce((a, b) => a + b, 0) / deltas.length;
      const last = deltas[deltas.length - 1] || 0;
      if (!avg) return false;
      return last > avg * S.singleAssetGlitchMultiplier;
    }

    function getVolatilityRatio(volatility) {
      if (!volatility || !S.priceHistory?.length) return 0;
      const last = S.priceHistory[S.priceHistory.length - 1]?.price || 1;
      return Math.abs(volatility) / Math.max(Math.abs(last), 1e-6);
    }

    function evaluateSingleAssetOpportunity() {
      const ltf = getSingleAssetWindow('15s') || getSingleAssetWindow('30s');
      const htf = getSingleAssetWindow('5m') || getSingleAssetWindow('1m');
      const payout = getCurrentPayoutPercent();
      if (payout !== null && payout < S.singleAssetPayoutMin) {
        return { ok: false, reason: 'Payout' };
      }
      if (hasExecutionGlitch()) {
        return { ok: false, reason: 'Glitch' };
      }
      const volatility = htf?.volatility ?? ltf?.volatility ?? 0;
      const volRatio = getVolatilityRatio(volatility);
      if (volRatio > 0 && volRatio < S.singleAssetVolatilityMin) {
        return { ok: false, reason: 'LowVol' };
      }
      if (volRatio > S.singleAssetVolatilityMax) {
        return { ok: false, reason: 'HighVol' };
      }

      const htfDir = htf?.direction || S.analysisDirection;
      const ltfDir = ltf?.direction || htfDir;
      if (!htfDir || !ltfDir || htfDir !== ltfDir) {
        return { ok: false, reason: 'Mismatch' };
      }

      const htfConf = htf?.confidence ?? S.analysisConfidence;
      const ltfConf = ltf?.confidence ?? 0;
      if (htfConf < S.singleAssetHtfConfidence || ltfConf < S.singleAssetLtfConfidence) {
        return { ok: false, reason: 'Confidence' };
      }

      const impulse = (ltf?.steady && ltfConf >= 0.7 && volRatio >= S.singleAssetVolatilityMin);
      const expiry = impulse ? '1M' : '5M';
      const burstCount = impulse && ltfConf >= 0.85 ? 3 : (ltfConf >= 0.7 ? 2 : 1);

      return { ok: true, direction: htfDir, expiry, burstCount };
    }

    /* ========================= FIXED TIME CALCULATION ========================= */
    function calculateDelay(signalOrMinute) {
      try {
        if (typeof signalOrMinute === 'object' && signalOrMinute?.targetTsMs) {
          return signalOrMinute.targetTsMs - Date.now();
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

        // Allow signals up to 30 seconds late
        if (ms < -30000) {
          return -1;
        }

        return ms;

      } catch (error) {
        return -1;
      }
    }

    function toUTCMinus3DateForSignal(minute) {
      const now = new Date(Date.now() - 3*60*60*1000);
      const dayStart = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0);
      let target = new Date(dayStart + (minute%1440)*60*1000);
      if ((now - target) > 30*60*1000) target = new Date(target.getTime() + 24*60*60*1000);
      return target;
    }

    function toLocalDateForSignal(minute) {
      const now = new Date();
      const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).getTime();
      let target = new Date(dayStart + (minute % 1440) * 60 * 1000);
      if ((now - target) > 30*60*1000) target = new Date(target.getTime() + 24*60*60*1000);
      return target;
    }

    function fmtHHMMSSUTCm3(d){ return `${String(d.getUTCHours()).padStart(2,'0')}:${String(d.getUTCMinutes()).padStart(2,'0')}:${String(d.getUTCSeconds()).padStart(2,'0')}`; }

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
      const hitCooldown = S.cooldownLosses > 0 && S.lossStreak >= S.cooldownLosses;

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

      if (hitCooldown) {
        const cooldownMs = Math.max(1, S.cooldownMin) * 60 * 1000;
        S.cooldownUntil = Date.now() + cooldownMs;
        const streak = S.lossStreak;
        S.lossStreak = 0;
        debugLog('Cooldown triggered after losses', {
          lossStreak: streak,
          cooldownMin: S.cooldownMin
        });
        setStatusOverlay(formatStatus('cooldown_minutes', { minutes: S.cooldownMin }));
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
      if (!S.multiTimeframeEnabled) {
        const analysis = analyzeMarketTrend(baseWindowMs);
        S.analysisDirection = analysis.direction;
        S.analysisConfidence = analysis.confidence;
        S.analysisSteadyTrend = analysis.steady;
        S.analysisUpdatedAt = Date.now();
        S.analysisWindows = [{ windowMs: baseWindowMs, ...analysis }];
        return;
      }

      const windows = [
        { label: '5s', windowMs: 5 * 1000 },
        { label: '15s', windowMs: 15 * 1000 },
        { label: '30s', windowMs: 30 * 1000 },
        { label: '1m', windowMs: 60 * 1000 },
        { label: '5m', windowMs: 5 * 60 * 1000 }
      ];
      const results = windows.map(w => ({ ...w, ...analyzeMarketTrend(w.windowMs) }));
      const directions = results.map(r => r.direction).filter(Boolean);
      const direction = directions.length ? (directions.filter(d => d === 'BUY').length >= directions.filter(d => d === 'SELL').length ? 'BUY' : 'SELL') : null;
      const confidence = results.length ? results.reduce((sum, r) => sum + r.confidence, 0) / results.length : 0;
      const steady = results.some(r => r.steady);

      S.analysisDirection = direction;
      S.analysisConfidence = confidence;
      S.analysisSteadyTrend = steady;
      S.analysisUpdatedAt = Date.now();
      S.analysisWindows = results;
    }

    /* ========================= ROBUST PRICE-BASED TRADE OUTCOME DETECTION ========================= */
    function detectTradeOutcomeByPrice() {
      if (!S.activeTrade) return null;

      const currentPrice = getCurrentAssetPrice();
      if (!currentPrice || !S.tradeEntryPrice) {
        return null;
      }

      const entryPrice = S.tradeEntryPrice;
      const direction = S.activeTrade.direction;

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

    function parsePercentValue(text) {
      if (!text) return null;
      const match = text.match(/(\d{1,3}(?:\.\d{1,2})?)\s*%/);
      if (!match) return null;
      const value = parseFloat(match[1]);
      return Number.isFinite(value) ? value : null;
    }

    function getCurrentPayoutPercent() {
      for (const selector of C.PAYOUT_SELECTORS) {
        const elements = $$(selector);
        for (const el of elements) {
          if (!visible(el)) continue;
          const payout = parsePercentValue(T(el));
          if (payout !== null) {
            return payout;
          }
        }
      }

      const fallbackElements = $$('span,div');
      for (const el of fallbackElements) {
        if (!visible(el)) continue;
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
      const multiTfWindowMs = S.multiTimeframeEnabled ? 5 * 60 * 1000 : 0;
      const reversalWindowMs = Math.max(2, S.reversalWindowSec || 2) * 1000;
      return Math.max(baseWindowMs, multiTfWindowMs, reversalWindowMs);
    }

    function startPriceMonitoring() {
      if (S.priceMonitorInterval) {
        clearInterval(S.priceMonitorInterval);
      }

      S.priceMonitorInterval = setInterval(() => {
        const currentPrice = getCurrentAssetPrice();
        if (currentPrice !== null) {
          S.currentAssetPrice = currentPrice;

          S.priceHistory.push({
            price: currentPrice,
            timestamp: Date.now()
          });

          const windowMs = getPriceHistoryWindowMs();
          const cutoff = Date.now() - windowMs;
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
      if (S.cycleActive || S.tradeSequenceActive || S.activeTrade || S.hasLiveSignal) return;

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
        if (S.keepAliveEnabled && S.running) {
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
      if (S.executing || S.activeTrade) return false;

      const execKey = signalExecKey(signal);
      if (S.lastExecutedKey === execKey && Date.now() < S.tradeLockUntil) return false;
      if (!S.baseAmount) return false;
      if (S.skipNextTrade) {
        S.skipNextTrade = false;
        endCycle();
        return false;
      }
      if (S.cooldownUntil && Date.now() < S.cooldownUntil) {
        setSkipReason('Cooldown');
        return false;
      }
      const enforceAnalysis = S.analysisEnabled && !isSignalOnlyMode() && !(isTestMode() && signal.isSignalSource);
      const enforceInterval = !isSignalOnlyMode();
      const enforcePayout = !isSignalOnlyMode();
      const enforceReversal = !isSignalOnlyMode();
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
        if (S.analysisDirection !== signal.direction.toUpperCase() && !S.signalOverrideEnabled) {
          setSkipReason('Mismatch');
          return false;
        }
        if (S.analysisDirection !== signal.direction.toUpperCase() && S.signalOverrideEnabled) {
          signal.direction = S.analysisDirection;
        }
      }
      if (enforcePayout && (S.payoutMin > 0 || S.payoutMax > 0 || S.payoutRequired)) {
        const payout = getCurrentPayoutPercent();
        if (payout === null) {
          setSkipReason('Payout');
          return false;
        }
        if (S.payoutMin > 0 && payout < S.payoutMin) {
          setSkipReason('Payout');
          return false;
        }
        if (S.payoutMax > 0 && payout > S.payoutMax) {
          setSkipReason('Payout');
          return false;
        }
      }
      if (enforceReversal && isLateReversal(signal.direction.toUpperCase())) {
        setSkipReason('Reversal');
        return false;
      }
      if (isTestMode()) {
        const testEval = evaluateTestTrade(signal);
        S.testQualityScore = testEval.score;
        S.testQualityLabel = testEval.label;
        if (!testEval.ok) {
          setSkipReason(testEval.reason || 'Quality');
          return false;
        }
      }

      S.executing = true;
      S.executionAttempts = 1;
      S.executionStartTime = Date.now();

      try {
        // CAPTURE BALANCE BEFORE TRADE EXECUTION
        const balanceBeforeTrade = await readBalanceWithRetry();
        S.balanceBeforeTrade = balanceBeforeTrade;

        // Capture entry price BEFORE execution
        const entryPrice = getCurrentAssetPrice();
        if (entryPrice) {
          S.tradeEntryPrice = entryPrice;
        }

        const expiryLabel = signal.expiry || S.expirySetting;
        logConsoleLine(formatStatus('trade_attempt', { asset: signal.asset, direction: signal.direction.toUpperCase(), expiry: expiryLabel }));
        let { up, dn } = getBuySellButtons();
        if (!up && !dn) {
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

        const expiryMs = secsFromTF(S.expirySetting) * 1000;
        const start = Date.now();
        S.activeTrade = {
          amountCents,
          batchCount: burstCount,
          totalAmountCents: amountCents * burstCount,
          direction: dir.toUpperCase(),
          asset: signal.asset,
          startTime: start,
          expiry: S.expirySetting,
          expectedEnd: start + expiryMs + C.SETTLEMENT_DELAY_MS,
          cycleStep: S.cycleStep,
          entryPrice: entryPrice,
          balanceBefore: balanceBeforeTrade // Store balance before trade
        };

        S.tradeLockUntil = Date.now() + 1000;
        const intervalMin = getActiveTradeIntervalMin();
        S.nextTradeAllowedAt = Date.now() + intervalMin * 60 * 1000;
        S.lastTradeTime = Date.now();
        S.tradeCount++;
        S.lastExecutedKey = execKey;
        S.finalizedTradeId = null;
        S.tradeOutcomeChecked = false;

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
    function finalizeTradeOutcomeOnce() {
      if (!S.activeTrade) return;
      if (S.finalizedTradeId && S.finalizedTradeId === S.activeTrade.startTime) return;

      S.finalizedTradeId = S.activeTrade.startTime;

      // Wait 1.5 seconds for balance animation to settle - NO RUSH
      setTimeout(async () => {
        const balanceAfterTrade = await readBalanceWithRetry();
        const balanceBeforeTrade = S.activeTrade.balanceBefore;

        // Use EXACT balance comparison - NO TOLERANCE
        const balanceOutcome = detectTradeOutcomeByBalance(balanceBeforeTrade, balanceAfterTrade);

        if (balanceOutcome) {
          S.lastTradeOutcome = balanceOutcome;

          // Calculate actual profit from exact balance change
          const actualProfit = calculateProfitFromBalanceChange(balanceBeforeTrade, balanceAfterTrade);
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

          S.activeTrade = null;
          S.tradeOutcomeChecked = false;

          // Update UI with results immediately
          setUIState('RESULTS', { outcome: balanceOutcome });
          if (applyRiskLimits()) {
            return;
          }

          // CRITICAL: Only re-enter on LOSS, close cycle on WIN/EVEN
          if (wasCycleActive && S.cycleActive) {
            if (balanceOutcome === 'LOSS') {
              // For LOSS: Record new balance for next trade and potentially re-enter
              S.balanceBeforeTrade = balanceAfterTrade; // Update baseline for next trade

              if (currentCycleStep === 0 && S.l1Active) {
                immediateMartingaleReentry();
              } else if (currentCycleStep === 1 && S.l2Active) {
                immediateMartingaleReentry();
              } else {
                endCycle();
              }
            } else {
              // For WIN or EVEN: Always close cycle
              endCycle();
            }
          } else {
            if (S.cycleActive) {
              endCycle();
            }
          }

          return;
        }

        // If balance detection fails completely, wait another second and try again
        setTimeout(async () => {
          const finalBalanceAfterTrade = await readBalanceWithRetry();
          const finalBalanceOutcome = detectTradeOutcomeByBalance(balanceBeforeTrade, finalBalanceAfterTrade);

          if (finalBalanceOutcome) {
            S.lastTradeOutcome = finalBalanceOutcome;

            const finalProfit = calculateProfitFromBalanceChange(balanceBeforeTrade, finalBalanceAfterTrade);
            S.cycleProfitLoss = finalProfit;
            S.tradeProfitLoss += finalProfit;
            recordTradeOutcomeForRisk(finalBalanceOutcome, finalProfit);
            recordTradeStats(finalBalanceOutcome);

            debugLog('Trade outcome determined by FINAL BALANCE CHECK', {
              outcome: finalBalanceOutcome,
              profit: finalProfit,
              balanceBefore: balanceBeforeTrade,
              balanceAfter: finalBalanceAfterTrade
            });

            const wasCycleActive = S.cycleActive;
            const currentCycleStep = S.cycleStep;

            S.activeTrade = null;
            S.tradeOutcomeChecked = false;

            setUIState('RESULTS', { outcome: finalBalanceOutcome });
            if (applyRiskLimits()) {
              return;
            }

            if (wasCycleActive && S.cycleActive) {
              if (finalBalanceOutcome === 'LOSS') {
                S.balanceBeforeTrade = finalBalanceAfterTrade;

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
            } else {
              if (S.cycleActive) {
                endCycle();
              }
            }
          } else {
            // Final fallback - mark as EVEN
            debugLog('Balance detection completely failed, marking as EVEN');
            S.lastTradeOutcome = 'EVEN';
            S.cycleProfitLoss = 0;
            recordTradeStats('EVEN');

            setUIState('RESULTS', { outcome: 'EVEN' });
            endCycle();
          }
        }, 1000); // Additional 1 second wait for stubborn balance updates

      }, 1500); // Initial 1.5 second wait for balance animation
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

      S.assetSelecting = false;
      S.assetSelectedForSignal = false;
      S.assetSelectionAttempted = false;
      S.assetSelectionAttempts = 0;
      S.lastAssetSelectionType = sig.isOTC ? 'OTC' : 'SPOT';
      S.assetSelectionFlipped = false;

      S.hasLiveSignal = true;
      S.forceImmediate = false;
      S.finalizedTradeId = null;
      S.tradeOutcomeChecked = false;

      resetExecutionState();

      // Show direction indicator immediately when signal is received
      showDirectionIndicator(sig.direction);

      // Start countdown from 60 seconds before execution
      const delayMs = calculateDelay(sig.minute);
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
          if (S.activeTrade) {
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
      if (S.activeTrade) {
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

      if (S.buySellMethod === 'selectors') {
        let up = null, dn = null;

        if (S.manualSelectors.buy && S.manualSelectors.buy.trim()) {
          up = $(S.manualSelectors.buy.trim());
          if (up && visible(up)) {
          } else {
            up = null;
          }
        }

        if (S.manualSelectors.sell && S.manualSelectors.sell.trim()) {
          dn = $(S.manualSelectors.sell.trim());
          if (dn && visible(dn)) {
          } else {
            dn = null;
          }
        }

        if (up && dn) return { up, dn };
      }

      if (S.buySellMethod === 'coordinates') {
        let up = null, dn = null;

        if (S.coords.BUY_COORD) {
          const buyEl = document.elementFromPoint(S.coords.BUY_COORD.x, S.coords.BUY_COORD.y);
          if (buyEl && visible(buyEl)) {
            up = closestClickable(buyEl);
          }
        }

        if (S.coords.SELL_COORD) {
          const sellEl = document.elementFromPoint(S.coords.SELL_COORD.x, S.coords.SELL_COORD.y);
          if (sellEl && visible(sellEl)) {
            dn = closestClickable(sellEl);
          }
        }

        if (up && dn) return { up, dn };
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
        targetTsMs: toUTCMinus3DateForSignal(minute).getTime(),
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

    function extractSignalTextFromResponse(text) {
      if (!text) return '';
      const hasFlagEmoji = (value) => /\p{Regional_Indicator}{2}/u.test(value || '');
      const isLikelySignal = (messageText) => {
        if (!messageText) return false;
        const upper = messageText.toUpperCase();
        const hasPair = /\b[A-Z]{3}\/?[A-Z]{3}\b/.test(upper);
        const hasPairMarker = upper.includes('OTC') || messageText.includes('💷') || messageText.includes('💎') || hasFlagEmoji(messageText);
        const hasTime = /\b\d{1,2}:\d{2}\b/.test(messageText);
        const hasDirection = upper.includes('BUY') || upper.includes('SELL') || upper.includes('CALL') || upper.includes('PUT') || messageText.includes('🔼') || messageText.includes('🔽');
        return hasPair && hasPairMarker && (hasTime || hasDirection);
      };
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
      const trimmed = text.trim();
      return isLikelySignal(trimmed) ? trimmed : '';
    }

    /* ========================= ENHANCED SIGNAL FETCHING ========================= */
    async function fetchAPISignals() {
      const now = Date.now();

      if (S.cycleActive || S.tradeSequenceActive || S.activeTrade || S.hasLiveSignal || S.executing || now < S.signalCooldownUntil) {
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
          const text = extractSignalTextFromResponse(rawText);

          if (!text || text === "No message" || text.includes("No message")) {
            logSignalStatus(source, 'signal_empty', { minIntervalMs: 300000 });
            continue;
          }

          const signalHash = createSignalHash(text);
          const lastHash = S.lastProcessedSignalHashes.get(source.url);
          if (lastHash === signalHash) {
            logSignalStatus(source, 'signal_duplicate', { minIntervalMs: 300000 });
            continue;
          }

          const delivery = { raw: text };

          try {
            const signal = parseRawSignalInExtension(delivery);

            if (signal) {
              if (source.expiryOverride) {
                signal.expiry = source.expiryOverride;
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
              logSignalSnippet(source, text, { force: true });
            }
          } catch (error) {
            debugLog('Error processing signal text', { error: error.message });
            logSignalSnippet(source, text, { force: true });
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
      let expiry = '1M';
      let time = null;
      let direction = null;
      let isOTC = false;

      for (const line of lines) {
        const upper = line.toUpperCase();
        const hasOtc = /OTC/i.test(upper);
        const hasCurrencyEmoji = line.includes('💷') || /\p{Regional_Indicator}{2}/u.test(line);
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

        if (!direction && (upper.includes('BUY') || upper.includes('SELL') || upper.includes('CALL') || upper.includes('PUT') || line.includes('🔼') || line.includes('🔽'))) {
          if (upper.includes('BUY') || upper.includes('CALL') || line.includes('🔼')) {
            direction = 'BUY';
          } else if (upper.includes('SELL') || upper.includes('PUT') || line.includes('🔽')) {
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

        const timeParts = time.split(':');
        const hour = parseInt(timeParts[0], 10) || 0;
        const minute = parseInt(timeParts[1], 10) || 0;
        const totalMinute = hour * 60 + minute;

        const now = Date.now();
        const targetUtc3 = toUTCMinus3DateForSignal(totalMinute);
        const targetLocal = toLocalDateForSignal(totalMinute);
        const diffUtc3 = Math.abs(now - targetUtc3.getTime());
        const diffLocal = Math.abs(now - targetLocal.getTime());
        const useLocal = diffUtc3 > 2 * 60 * 60 * 1000 && diffLocal <= 2 * 60 * 60 * 1000;
        const targetTs = useLocal ? targetLocal : targetUtc3;

        const signal = {
          asset: assetLabel,
          assetSearch: assetSearch,
          isOTC: isOTC,
          direction: direction,
          time: time,
          expiry: expiry || '1M',
          minute: totalMinute,
          targetTsMs: targetTs.getTime(),
          rawText: text,
          signalKey: `${assetSearch}|${totalMinute}|${direction}|${isOTC ? 'OTC' : 'REAL'}`
        };

        return signal;
      }

      return null;
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
        updateAnalysisState();
        logDiagnostics();
      }

      if (S.analysisEnabled && !isSignalOnlyMode() && S.analysisReadyAt && Date.now() < S.analysisReadyAt) {
        setStatusOverlay(formatStatus('warming_up', { seconds: Math.ceil((S.analysisReadyAt - Date.now()) / 1000) }), '', false);
      }

      if (S.activeTrade) {
        const now = Date.now();
        const eta = S.activeTrade.expectedEnd;

        if (now >= eta && !S.tradeOutcomeChecked) {
          S.tradeOutcomeChecked = true;

          await delay(C.SETTLEMENT_DELAY_MS);

          finalizeTradeOutcomeOnce();
        }
      }

      const warm = clamp01((nowMs() - S.botStartTime) / 5000);
      renderWarmup(warm);
      if (warm < 1) { renderPendingTrades(); updateProfitDisplay(); return; }

      if (S.cooldownUntil && Date.now() < S.cooldownUntil) {
        const secs = Math.ceil((S.cooldownUntil - Date.now()) / 1000);
        setStatusOverlay(formatStatus('cooldown', { seconds: secs }), '', false);
        renderPendingTrades();
        updateProfitDisplay();
        return;
      }

      if (isSingleAssetMode()) {
        await ensureSingleAssetSelected();
      }
      if (isTestMode()) {
        await ensureTestAssetSelected();
      }

      if (isSingleAssetMode() && S.analysisEnabled) {
        const now = Date.now();
        if (now - S.lastSingleAssetSkipAt > 60000) {
          if (!S.analysisDirection) {
            S.lastSingleAssetSkipAt = now;
            setSkipReason('NoTrend');
          } else if (S.analysisConfidence < S.analysisConfidenceThreshold) {
            S.lastSingleAssetSkipAt = now;
            setSkipReason('Confidence');
          }
        }
      }

      if (!isSingleAssetMode() && S.autoTrade && !S.cycleActive && !S.tradeSequenceActive && !S.activeTrade && !S.hasLiveSignal && Date.now() >= S.signalCooldownUntil) {
        const incoming = await fetchAPISignals();

        if (incoming.length) {
          for (const sig of incoming) {
            if (isTestMode() && !sig.isOTC) {
              setSkipReason('OTCOnly');
              continue;
            }
            const delayMs = calculateDelay(sig.minute);

            if (delayMs < 0) {
              logSignalStatus({ label: '1m/5m' }, 'signal_stale', { minIntervalMs: 300000 });
              continue;
            }

            if (!S.cycleActive && !S.tradeSequenceActive && !S.currentSignal && !S.activeTrade) {
              startCycle(sig);
              break;
            } else {
              S.signalBuffer.push(sig);
              if (S.signalBuffer.length > C.MAX_QUEUE) S.signalBuffer.shift();
            }
          }
        } else if (!S.selfTradeEnabled && !isSingleAssetMode() && S.analysisDirection && S.analysisConfidence >= S.analysisConfidenceThreshold) {
          const now = Date.now();
          if (now - S.lastSelfTradeHintAt > 60000) {
            S.lastSelfTradeHintAt = now;
            logConsoleLine(formatStatus('analysis_ready_selftrade_off'));
          }
        }
      }

      if (!isSingleAssetMode() && !S.cycleActive && !S.tradeSequenceActive && !S.currentSignal && !S.activeTrade && S.signalBuffer.length) {
        S.signalBuffer = S.signalBuffer.filter(s => calculateDelay(s.minute) >= 0 && (!isTestMode() || s.isOTC));
        if (S.signalBuffer.length) {
          S.signalBuffer.sort((a, b) => a.targetTsMs - b.targetTsMs);
          const next = S.signalBuffer.shift();
          startCycle(next);
        }
      }

      const selfTradeAllowed = getSelfTradeAllowed();
      if (selfTradeAllowed && !S.cycleActive && !S.tradeSequenceActive && !S.currentSignal && !S.activeTrade) {
        if ((!S.analysisReadyAt || Date.now() >= S.analysisReadyAt) && S.analysisDirection && S.analysisConfidence >= S.analysisConfidenceThreshold) {
          let assetLabel = getCurrentAssetLabel();
          if (isSingleAssetMode()) {
            assetLabel = SINGLE_ASSET.asset;
          }
          const assetSearch = assetLabel ? assetLabel.replace(/\(OTC\)/i, '').replace(/\//g, '').trim() : '';
          const isOTC = isSingleAssetMode() ? true : /OTC/i.test(assetLabel || '');
          if (isTestMode() && !isOTC) {
            setSkipReason('OTCOnly');
            return;
          }
          if (assetLabel) {
            if (isSingleAssetMode()) {
              const decision = evaluateSingleAssetOpportunity();
              if (!decision.ok) {
                setSkipReason(decision.reason);
              } else {
                const minute = getCurrentMinute();
                const sig = {
                  asset: assetLabel,
                  assetSearch,
                  isOTC,
                  direction: decision.direction,
                  expiry: decision.expiry,
                  burstCount: decision.burstCount,
                  minute,
                  time: fmtHHMMSSUTCm3(new Date()),
                  targetTsMs: Date.now(),
                  rawText: '[analysis-only]'
                };
                startCycle(sig);
                S.assetSelectedForSignal = true;
                S.assetSelectionAttempted = true;
              }
            } else {
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
      }

      if (S.currentSignal && S.tradeSequenceActive && S.hasLiveSignal && !S.activeTrade) {
        const sig = S.currentSignal;
        const delayMs = calculateDelay(sig.minute);

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
        .iaa-live{ display:flex; flex-wrap:wrap; gap:6px 10px; margin-top:6px; }
        .iaa-live-item{ display:flex; align-items:center; gap:4px; }
        .iaa-manual{ margin-top:6px; padding:6px 8px; border-radius:8px; border:1px dashed rgba(255,255,255,.08); background:rgba(0,0,0,.25); font-size:11px; display:flex; justify-content:space-between; gap:8px; align-items:center; }
        .iaa-manual-label{ color:#9ca3af; }
        .iaa-manual-value{ color:#e5e7eb; font-weight:600; }
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
        #iaa-settings-language{ background:rgba(0,0,0,.3); color:#fff; border-radius:6px; border:1px solid rgba(255,255,255,.1); padding:4px 6px; font-size:11px; }

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
              <div id="iaa-status-overlay"></div>
              <div id="iaa-countdown"></div>
            </div>
            <div id="iaa-direction-indicator"></div>
          </div>
        </div>
        <div class="iaa-grid">
          <div class="iaa-grid-row">
            <div class="k blue">Asset</div><div id="iaa-asset" class="v strong">—</div>
            <div class="k">Expiry</div><div id="iaa-exp" class="v">1M</div>
          </div>
          <div class="iaa-grid-row">
            <div class="k">Exec (UTC-3)</div><div id="iaa-exec" class="v">—</div>
            <div class="k">Profit</div><div id="iaa-profit" class="v wr">$0.00</div>
          </div>
          <div class="iaa-grid-row">
            <div class="k">Analysis</div><div id="iaa-analysis-score" class="v">0%</div>
            <div class="k">Next ETA</div><div id="iaa-next-trade" class="v">—</div>
          </div>
        </div>
        <div class="iaa-live">
          <div class="iaa-live-item"><span class="iaa-stat-label" data-status-key="lag_label">Lag</span><span id="iaa-live-lag" class="iaa-stat-value">—</span></div>
          <div class="iaa-live-item"><span class="iaa-stat-label" data-status-key="feed_label">Feed</span><span id="iaa-live-feed" class="iaa-stat-value">—</span></div>
        </div>
        <div class="iaa-manual">
          <span class="iaa-manual-label">Manual</span>
          <span id="iaa-manual-signal" class="iaa-manual-value">—</span>
        </div>
        <div class="iaa-stats">
          <div class="iaa-stat-row"><span class="iaa-stat-label" data-status-key="start_label">Start</span><span id="iaa-start-time" class="iaa-stat-value">—</span></div>
          <div class="iaa-stat-row"><span class="iaa-stat-label" data-status-key="total_label">Total</span><span id="iaa-total-trades" class="iaa-stat-value">0</span></div>
          <div class="iaa-stat-row"><span class="iaa-stat-label" data-status-key="win_label">Win</span><span id="iaa-win-trades" class="iaa-stat-value">0</span></div>
          <div class="iaa-stat-row"><span class="iaa-stat-label" data-status-key="loss_label">Loss</span><span id="iaa-loss-trades" class="iaa-stat-value">0</span></div>
          <div class="iaa-stat-row"><span class="iaa-stat-label" data-status-key="win_rate_label">%</span><span id="iaa-win-rate" class="iaa-stat-value">0%</span></div>
        </div>
        <div id="iaa-warm" class="warmup red">INFINITY AI ENGINE 0%</div>

        <div class="iaa-controls">
          <button id="iaa-mouse-toggle" class="iaa-control-btn" title="Mouse Mapping">🖱</button>
          <button id="iaa-settings-toggle" class="iaa-control-btn" title="Settings">⚙</button>
          <button id="iaa-skip-trade" class="iaa-control-btn" title="Skip Next Trade">⏭️</button>
          <button id="iaa-debug-toggle" class="iaa-control-btn" title="Debug Info">🧪</button>
        </div>

        <div id="iaa-debug-panel">
          <div class="iaa-debug-header">
            <span>Debug Info</span>
            <div class="iaa-debug-actions">
              <button id="iaa-debug-copy" title="Copy debug info">COPY</button>
              <button id="iaa-debug-close" title="Close debug info">×</button>
            </div>
          </div>
          <div id="iaa-debug-content"></div>
        </div>

        <div id="iaa-settings-panel">
          <button id="iaa-settings-close">×</button>
          <div style="margin-bottom:12px;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
              <span style="color:#9ca3af; font-size:11px;" data-i18n="trade_mode_label">Trade Mode</span>
              <select id="iaa-trade-mode" style="width:170px; padding:4px 6px; border-radius:6px; border:1px solid rgba(255,255,255,.1); background:rgba(0,0,0,.3); color:#fff; font-size:11px;">
                <option value="signals" data-i18n="trade_mode_signals">All assets + signals</option>
                <option value="single_asset" data-i18n="trade_mode_single">Single asset (EUR/USD OTC)</option>
                <option value="signals_only" data-i18n="trade_mode_signals_only">Signals only (1m/5m)</option>
                <option value="test" data-i18n="trade_mode_test">TEST (experimental)</option>
              </select>
            </div>
            <label style="display:flex;align-items:center;gap:6px;margin:6px 0;cursor:pointer;font-size:12px"><input type="checkbox" id="iaa-signal-source-1m"> <span data-i18n="signal_source_1m">Enable 1m signals</span></label>
            <label style="display:flex;align-items:center;gap:6px;margin:6px 0;cursor:pointer;font-size:12px"><input type="checkbox" id="iaa-signal-source-5m"> <span data-i18n="signal_source_5m">Enable 5m signals</span></label>
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
              <span style="color:#9ca3af; font-size:11px;" data-i18n="settings_language">Language</span>
              <select id="iaa-settings-language">
                <option value="en">EN</option>
                <option value="bg">BG</option>
              </select>
            </div>
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
              <span style="color:#9ca3af; font-size:11px;" data-i18n="base_amount">Base Amount ($)</span>
              <input type="number" id="iaa-base-amount" min="1" step="1" value="1" style="width:70px; padding:4px 6px; border-radius:6px; border:1px solid rgba(255,255,255,.1); background:rgba(0,0,0,.3); color:#fff; font-weight:700" />
            </div>
            <div style="color:#9ca3af; font-size:11px; margin-bottom:4px;" data-i18n="expiry_setting">Expiry Setting:</div>
            <select id="iaa-expiry-setting" style="width:100%; padding:6px; border-radius:6px; border:1px solid rgba(255,255,255,.1); background:rgba(0,0,0,.3); color:#fff"><option value="1M" data-i18n="expiry_1m">1 Minute</option><option value="5M" data-i18n="expiry_5m">5 Minutes</option></select>
          </div>
          <div style="margin:12px 0; padding-top:8px; border-top:1px solid rgba(255,255,255,.05);">
            <label style="display:flex;align-items:center;gap:6px;margin:8px 0;cursor:pointer;font-size:12px"><input type="checkbox" id="iaa-l1"> <span data-i18n="l1_martingale">L1 Martingale</span></label>
            <label style="display:flex;align-items:center;gap:6px;margin:8px 0;cursor:pointer;font-size:12px"><input type="checkbox" id="iaa-l2"> <span data-i18n="l2_martingale">L2 Martingale</span></label>
            <div style="display:flex;justify-content:space-between;align-items:center;margin:8px 0;">
              <span style="font-size:11px;color:#9ca3af" data-i18n="l1_multiplier">L1 Multiplier:</span>
              <input type="text" inputmode="decimal" id="iaa-l1-multiplier" value="2" style="width:70px; padding:4px 6px; border-radius:6px; border:1px solid rgba(255,255,255,.1); background:rgba(0,0,0,.3); color:#fff; font-weight:700">
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin:8px 0;">
              <span style="font-size:11px;color:#9ca3af" data-i18n="l2_multiplier">L2 Multiplier:</span>
              <input type="text" inputmode="decimal" id="iaa-l2-multiplier" value="4" style="width:70px; padding:4px 6px; border-radius:6px; border:1px solid rgba(255,255,255,.1); background:rgba(0,0,0,.3); color:#fff; font-weight:700">
            </div>
          </div>
          <div style="margin:12px 0; padding-top:8px; border-top:1px solid rgba(255,255,255,.05);">
            <div style="display:flex;justify-content:space-between;align-items:center;margin:8px 0;">
              <span style="font-size:11px;color:#9ca3af" data-i18n="max_session_loss">Max Session Loss ($):</span>
              <input type="number" id="iaa-max-session-loss" min="0" step="1" value="0" style="width:70px; padding:4px 6px; border-radius:6px; border:1px solid rgba(255,255,255,.1); background:rgba(0,0,0,.3); color:#fff; font-weight:700">
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin:8px 0;">
              <span style="font-size:11px;color:#9ca3af" data-i18n="max_loss_streak">Max Loss Streak:</span>
              <input type="number" id="iaa-max-loss-streak" min="0" step="1" value="0" style="width:70px; padding:4px 6px; border-radius:6px; border:1px solid rgba(255,255,255,.1); background:rgba(0,0,0,.3); color:#fff; font-weight:700">
            </div>
            <div style="font-size:10px; color:#6b7280; margin-top:4px;" data-i18n="limits_hint">Set 0 to disable limits</div>
          </div>
          <div style="margin:12px 0; padding-top:8px; border-top:1px solid rgba(255,255,255,.05);">
            <label style="display:flex;align-items:center;gap:6px;margin:8px 0;cursor:pointer;font-size:12px"><input type="checkbox" id="iaa-analysis-enabled"> <span data-i18n="require_analysis_match">Require Analysis Match</span></label>
            <div style="display:flex;justify-content:space-between;align-items:center;margin:8px 0;">
              <span style="font-size:11px;color:#9ca3af" data-i18n="analysis_confidence">Analysis Confidence (0-1):</span>
              <input type="text" inputmode="decimal" id="iaa-analysis-confidence" value="0.65" style="width:70px; padding:4px 6px; border-radius:6px; border:1px solid rgba(255,255,255,.1); background:rgba(0,0,0,.3); color:#fff; font-weight:700">
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin:8px 0;">
              <span style="font-size:11px;color:#9ca3af" data-i18n="analysis_window">Analysis Window (sec):</span>
              <input type="number" id="iaa-analysis-window" min="60" step="30" value="300" style="width:70px; padding:4px 6px; border-radius:6px; border:1px solid rgba(255,255,255,.1); background:rgba(0,0,0,.3); color:#fff; font-weight:700">
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin:8px 0;">
              <span style="font-size:11px;color:#9ca3af" data-i18n="warmup_min">Warmup (min):</span>
              <input type="number" id="iaa-analysis-warmup" min="1" step="1" value="5" style="width:70px; padding:4px 6px; border-radius:6px; border:1px solid rgba(255,255,255,.1); background:rgba(0,0,0,.3); color:#fff; font-weight:700">
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin:8px 0;">
              <span style="font-size:11px;color:#9ca3af" data-i18n="trade_interval_min">Trade Interval (min):</span>
              <input type="number" id="iaa-trade-interval-min" min="1" step="1" value="9" style="width:70px; padding:4px 6px; border-radius:6px; border:1px solid rgba(255,255,255,.1); background:rgba(0,0,0,.3); color:#fff; font-weight:700">
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin:8px 0;">
              <span style="font-size:11px;color:#9ca3af" data-i18n="max_trade_amount">Max Trade Amount ($):</span>
              <input type="number" id="iaa-max-trade-amount" min="0" step="1" value="0" style="width:70px; padding:4px 6px; border-radius:6px; border:1px solid rgba(255,255,255,.1); background:rgba(0,0,0,.3); color:#fff; font-weight:700">
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin:8px 0;">
              <span style="font-size:11px;color:#9ca3af" data-i18n="max_trade_multiplier">Max Trade Multiplier:</span>
              <input type="text" inputmode="decimal" id="iaa-max-trade-multiplier" value="1.5" style="width:70px; padding:4px 6px; border-radius:6px; border:1px solid rgba(255,255,255,.1); background:rgba(0,0,0,.3); color:#fff; font-weight:700">
            </div>
            <label style="display:flex;align-items:center;gap:6px;margin:6px 0;cursor:pointer;font-size:12px"><input type="checkbox" id="iaa-self-trade-enabled"> <span data-i18n="allow_self_trades">Allow Self Trades (no signal)</span></label>
            <label style="display:flex;align-items:center;gap:6px;margin:6px 0;cursor:pointer;font-size:12px"><input type="checkbox" id="iaa-signal-override"> <span data-i18n="allow_signal_override">Allow Signal Override</span></label>
            <label style="display:flex;align-items:center;gap:6px;margin:6px 0;cursor:pointer;font-size:12px"><input type="checkbox" id="iaa-multi-tf"> <span data-i18n="multi_timeframe_analysis">Multi-Timeframe Analysis</span></label>
          </div>
          <div style="margin:12px 0; padding-top:8px; border-top:1px solid rgba(255,255,255,.05);">
            <div style="font-size:11px;color:#9ca3af; margin-bottom:6px;" data-i18n="payout_filter">Payout Filter (%)</div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin:6px 0;">
              <span style="font-size:11px;color:#9ca3af" data-i18n="min_label">Min:</span>
              <input type="number" id="iaa-payout-min" min="0" max="100" step="1" value="80" style="width:70px; padding:4px 6px; border-radius:6px; border:1px solid rgba(255,255,255,.1); background:rgba(0,0,0,.3); color:#fff; font-weight:700">
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin:6px 0;">
              <span style="font-size:11px;color:#9ca3af" data-i18n="max_label">Max:</span>
              <input type="number" id="iaa-payout-max" min="0" max="100" step="1" value="92" style="width:70px; padding:4px 6px; border-radius:6px; border:1px solid rgba(255,255,255,.1); background:rgba(0,0,0,.3); color:#fff; font-weight:700">
            </div>
            <label style="display:flex;align-items:center;gap:6px;margin:6px 0;cursor:pointer;font-size:12px"><input type="checkbox" id="iaa-payout-required"> <span data-i18n="require_payout_check">Require payout check</span></label>
          </div>
          <div style="margin:12px 0; padding-top:8px; border-top:1px solid rgba(255,255,255,.05);">
            <label style="display:flex;align-items:center;gap:6px;margin:6px 0;cursor:pointer;font-size:12px"><input type="checkbox" id="iaa-burst-enabled"> <span data-i18n="burst_entries">Burst entries on strong trend</span></label>
            <div style="display:flex;justify-content:space-between;align-items:center;margin:6px 0;">
              <span style="font-size:11px;color:#9ca3af" data-i18n="burst_count">Burst Count:</span>
              <input type="number" id="iaa-burst-count" min="1" max="5" step="1" value="2" style="width:70px; padding:4px 6px; border-radius:6px; border:1px solid rgba(255,255,255,.1); background:rgba(0,0,0,.3); color:#fff; font-weight:700">
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin:6px 0;">
              <span style="font-size:11px;color:#9ca3af" data-i18n="burst_confidence">Burst Confidence (0-1):</span>
              <input type="text" inputmode="decimal" id="iaa-burst-confidence" value="0.85" style="width:70px; padding:4px 6px; border-radius:6px; border:1px solid rgba(255,255,255,.1); background:rgba(0,0,0,.3); color:#fff; font-weight:700">
            </div>
          </div>
          <div style="margin:12px 0; padding-top:8px; border-top:1px solid rgba(255,255,255,.05);">
            <div style="display:flex;justify-content:space-between;align-items:center;margin:6px 0;">
              <span style="font-size:11px;color:#9ca3af" data-i18n="cooldown_losses">Cooldown Losses:</span>
              <input type="number" id="iaa-cooldown-losses" min="1" step="1" value="6" style="width:70px; padding:4px 6px; border-radius:6px; border:1px solid rgba(255,255,255,.1); background:rgba(0,0,0,.3); color:#fff; font-weight:700">
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin:6px 0;">
              <span style="font-size:11px;color:#9ca3af" data-i18n="cooldown_min">Cooldown (min):</span>
              <input type="number" id="iaa-cooldown-min" min="5" step="5" value="35" style="width:70px; padding:4px 6px; border-radius:6px; border:1px solid rgba(255,255,255,.1); background:rgba(0,0,0,.3); color:#fff; font-weight:700">
            </div>
          </div>
          <div style="margin:12px 0; padding-top:8px; border-top:1px solid rgba(255,255,255,.05);">
            <div style="font-size:11px;color:#9ca3af; margin-bottom:6px;" data-i18n="late_reversal_filter">Late-Reversal Filter</div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin:6px 0;">
              <span style="font-size:11px;color:#9ca3af" data-i18n="reversal_window">Window (sec):</span>
              <input type="number" id="iaa-reversal-window" min="2" step="1" value="5" style="width:70px; padding:4px 6px; border-radius:6px; border:1px solid rgba(255,255,255,.1); background:rgba(0,0,0,.3); color:#fff; font-weight:700">
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin:6px 0;">
              <span style="font-size:11px;color:#9ca3af" data-i18n="opposite_ratio">Opposite Ratio (0-1):</span>
              <input type="text" inputmode="decimal" id="iaa-reversal-ratio" value="0.6" style="width:70px; padding:4px 6px; border-radius:6px; border:1px solid rgba(255,255,255,.1); background:rgba(0,0,0,.3); color:#fff; font-weight:700">
            </div>
          </div>
          <div style="margin:12px 0; padding-top:8px; border-top:1px solid rgba(255,255,255,.05);">
            <div style="display:flex;justify-content:space-between;align-items:center;margin:6px 0;">
              <span style="font-size:11px;color:#9ca3af" data-i18n="panel_opacity">Panel Opacity:</span>
              <input type="range" id="iaa-panel-opacity" min="0.3" max="1" step="0.05" value="1" style="width:140px;">
            </div>
            <label style="display:flex;align-items:center;gap:6px;margin:6px 0;cursor:pointer;font-size:12px"><input type="checkbox" id="iaa-countdown-beep"> <span data-i18n="countdown_beep">Countdown Beep</span></label>
          </div>
          <div style="margin:12px 0; padding-top:8px; border-top:1px solid rgba(255,255,255,.05);">
            <label style="display:flex;align-items:center;gap:6px;margin:8px 0;cursor:pointer;font-size:12px"><input type="checkbox" id="iaa-keep-alive"> <span data-i18n="keep_tab_alive">Keep Tab Alive</span></label>
            <div style="font-size:11px; color:#9ca3af; margin-top:4px;" data-i18n="keep_tab_alive_hint">Prevents browser from suspending the tab</div>
          </div>
          <div style="margin:12px 0; padding-top:8px; border-top:1px solid rgba(255,255,255,.05);">
            <label style="display:flex;align-items:center;gap:6px;margin:8px 0;cursor:pointer;font-size:12px"><input type="checkbox" id="iaa-force-asset"> <span data-i18n="force_asset_selection">Force Asset Selection</span></label>
            <div style="font-size:11px; color:#9ca3af; margin-top:4px;" data-i18n="force_asset_selection_hint">Verifies asset selection and retries if failed</div>
          </div>
        </div>

        <div id="iaa-mouse-panel">
          <button id="iaa-mouse-close">×</button>
          <div style="font-weight:700; color:#e5e7eb; margin-bottom:8px; font-size:14px;">Buy/Sell Button Selection Method</div>
          <div style="color:#cbd5e1; font-size:11px; margin-bottom:12px;">XPath is recommended for maximum reliability</div>

          <div style="display:flex; gap:8px; margin:12px 0;">
            <button id="iaa-method-xpath" style="flex:1; padding:8px 12px; border-radius:6px; border:1px solid rgba(255,255,255,.1); background:#374151; color:#60a5fa; cursor:pointer; font-size:11px; text-align:center;">XPath (Recommended)</button>
            <button id="iaa-method-auto" style="flex:1; padding:8px 12px; border-radius:6px; border:1px solid rgba(255,255,255,.1); background:#191919; color:#fff; cursor:pointer; font-size:11px; text-align:center;">Auto Detection</button>
            <button id="iaa-method-coords" style="flex:1; padding:8px 12px; border-radius:6px; border:1px solid rgba(255,255,255,.1); background:#191919; color:#fff; cursor:pointer; font-size:11px; text-align:center;">Coordinates</button>
            <button id="iaa-method-selectors" style="flex:1; padding:8px 12px; border-radius:6px; border:1px solid rgba(255,255,255,.1); background:#191919; color:#fff; cursor:pointer; font-size:11px; text-align:center;">CSS Selectors</button>
          </div>

          <div id="iaa-xpath-status" style="margin:12px 0; padding:8px; background:rgba(34,197,94,0.1); border-radius:6px; border:1px solid rgba(34,197,94,0.3);">
            <div style="font-size:11px; color:#22c55e; font-weight:bold;">⚡ INSTANT MODE ACTIVE</div>
            <div style="font-size:10px; color:#9ca3af; margin-top:4px;">No delays - Maximum execution speed</div>
          </div>

          <div id="iaa-coords-section">
            <div style="color:#cbd5e1; font-size:11px; margin-bottom:12px;">Hover target and press <b>Shift + W</b> to capture coordinates</div>
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
              <button id="iaa-mouse-start" style="height:28px; border-radius:6px; border:1px solid rgba(255,255,255,.12); background:#191919; color:#fff; padding:0 10px; cursor:pointer; font-size:11px;">Start Calibration</button>
              <button id="iaa-mouse-cancel" style="height:28px; border-radius:6px; border:1px solid rgba(255,255,255,.12); background:#191919; color:#fff; padding:0 10px; cursor:pointer; font-size:11px;">Cancel</button>
              <button id="iaa-mouse-reset" style="height:28px; border-radius:6px; border:1px solid rgba(255,255,255,.12); background:#191919; color:#fff; padding:0 10px; cursor:pointer; font-size:11px;">Reset All</button>
              <button id="iaa-mouse-save" style="height:28px; border-radius:6px; border:1px solid rgba(255,255,255,.12); background:#191919; color:#fff; padding:0 10px; cursor:pointer; font-size:11px;">Save & Apply</button>
            </div>
            <div style="display:flex; align-items:center; justify-content:space-between; gap:8px; margin:6px 0;"><span style="font-size:11px; color:#9ca3af">Next Step:</span><span id="iaa-mouse-step" style="font-size:12px; text-align:right; font-weight:bold; color:#fbbf24">—</span></div>
            <div id="iaa-mouse-list"></div>
          </div>

          <div id="iaa-selectors-section" style="display:none;">
            <div style="margin:12px 0; padding:8px; background:rgba(255,255,255,.03); border-radius:8px;">
              <div style="font-size:11px; color:#9ca3af; margin-bottom:4px;">Manual Buy Selector (CSS):</div>
              <input type="text" id="iaa-manual-buy-selector" placeholder="e.g., #call-button, .buy-btn, [data-test='call']" style="width:100%; padding:6px 8px; border-radius:6px; border:1px solid rgba(255,255,255,.1); background:rgba(0,0,0,.3); color:#fff; font-size:11px; margin:4px 0;">
              <div style="font-size:11px; color:#9ca3af; margin-bottom:4px;">Manual Sell Selector (CSS):</div>
              <input type="text" id="iaa-manual-sell-selector" placeholder="e.g., #put-button, .sell-btn, [data-test='put']" style="width:100%; padding:6px 8px; border-radius:6px; border:1px solid rgba(255,255,255,.1); background:rgba(0,0,0,.3); color:#fff; font-size:11px; margin:4px 0;">
              <div style="font-size:10px; color:#6b7280; margin-top:4px;">Enter CSS selectors for buy/sell buttons</div>
            </div>
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
      const skipTrade = $id('iaa-skip-trade');
      const debugToggle = $id('iaa-debug-toggle');
      const debugClose = $id('iaa-debug-close');
      const debugCopy = $id('iaa-debug-copy');

      if (settingsToggle) {
        settingsToggle.addEventListener('click', () => {
          if (S.settingsPanelOpen) hidePopups();
          else { hidePopups(); showPopup('iaa-settings-panel'); S.settingsPanelOpen = true; renderSettingsPanel(); }
        });
      }

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
          debugCopy.textContent = 'COPIED';
          setTimeout(() => { debugCopy.textContent = original; }, 1200);
        });
      }
      if (skipTrade) {
        skipTrade.addEventListener('click', () => {
          S.skipNextTrade = true;
          setStatusOverlay(formatStatus('next_trade_skipped'));
        });
      }
    }

    function setStatusOverlay(text, countdown = '', logToConsole = true) {
      const fallback = formatStatus('looking_for_opportunity');
      const nextText = text || fallback;
      const prevStatus = S.currentStatus;
      const changed = nextText !== prevStatus;
      S.currentStatus = nextText;
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
      if (S.currentSignal && execEl) execEl.textContent = fmtHHMMSSUTCm3(new Date(S.currentSignal.targetTsMs));
      else if (execEl) execEl.textContent = '—';

      renderChip(S.currentSignal);

      const confEl = $id('iaa-analysis-score');
      if (confEl) {
        const pct = Math.round((S.analysisConfidence || 0) * 100);
        const dir = S.analysisDirection ? ` ${S.analysisDirection}` : '';
        confEl.textContent = `${pct}%${dir}`;
      }

      if (!S.currentSignal && isSingleAssetMode()) {
        const assetEl = $id('iaa-asset');
        const expEl = $id('iaa-exp');
        if (assetEl) assetEl.textContent = SINGLE_ASSET.asset;
        if (expEl) expEl.textContent = S.expirySetting || '1M';
      }

      const etaEl = $id('iaa-next-trade');
      if (etaEl) etaEl.textContent = getNextEtaLabel();
      renderLiveInfo();
      renderManualSignal();
    }

    async function restoreSettings(){
      const base = await storage.get(BASE_AMOUNT_KEY);
      if (typeof base === 'number' && base > 0) S.baseAmount = base;
      const l1  = await storage.get(L1_ON_KEY); if (typeof l1 === 'boolean') S.l1Active = l1;
      const l2  = await storage.get(L2_ON_KEY); if (typeof l2 === 'boolean') S.l2Active = l2;
      const l1m = await storage.get(L1_MULT_KEY); if (typeof l1m === 'number') S.l1Multiplier = l1m;
      const l2m = await storage.get(L2_MULT_KEY); if (typeof l2m === 'number') S.l2Multiplier = l2m;
      const ex  = await storage.get(EXPIRY_KEY); if (typeof ex === 'string') S.expirySetting = normalizeExpiry(ex) || '1M';
      const keepAlive = await storage.get(KEEP_ALIVE_KEY); if (typeof keepAlive === 'boolean') S.keepAliveEnabled = keepAlive;
      const forceAsset = await storage.get(FORCE_ASSET_SELECT_KEY); if (typeof forceAsset === 'boolean') S.forceAssetSelect = forceAsset;
      const maxSessionLoss = await storage.get(MAX_SESSION_LOSS_KEY); if (typeof maxSessionLoss === 'number') S.maxSessionLossCents = maxSessionLoss;
      const maxLossStreak = await storage.get(MAX_CONSECUTIVE_LOSSES_KEY); if (typeof maxLossStreak === 'number') S.maxConsecutiveLosses = maxLossStreak;
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
      const signalOverrideEnabled = await storage.get(SIGNAL_OVERRIDE_ENABLED_KEY); if (typeof signalOverrideEnabled === 'boolean') S.signalOverrideEnabled = signalOverrideEnabled;
      const multiTfEnabled = await storage.get(MULTI_TF_ENABLED_KEY); if (typeof multiTfEnabled === 'boolean') S.multiTimeframeEnabled = multiTfEnabled;
      const cooldownLosses = await storage.get(COOLDOWN_LOSSES_KEY); if (typeof cooldownLosses === 'number') S.cooldownLosses = cooldownLosses;
      const cooldownMin = await storage.get(COOLDOWN_MIN_KEY); if (typeof cooldownMin === 'number') S.cooldownMin = cooldownMin;
      const reversalWindowSec = await storage.get(REVERSAL_WINDOW_SEC_KEY); if (typeof reversalWindowSec === 'number') S.reversalWindowSec = reversalWindowSec;
      const reversalOppositeRatio = await storage.get(REVERSAL_OPPOSITE_RATIO_KEY); if (typeof reversalOppositeRatio === 'number') S.reversalOppositeRatio = reversalOppositeRatio;
      const panelOpacity = await storage.get(PANEL_OPACITY_KEY); if (typeof panelOpacity === 'number') S.panelOpacity = panelOpacity;
      const countdownBeep = await storage.get(COUNTDOWN_BEEP_KEY); if (typeof countdownBeep === 'boolean') S.countdownBeepEnabled = countdownBeep;
      const burstEnabled = await storage.get(BURST_ENABLED_KEY); if (typeof burstEnabled === 'boolean') S.burstEnabled = burstEnabled;
      const burstCount = await storage.get(BURST_COUNT_KEY); if (typeof burstCount === 'number') S.burstTradeCount = burstCount;
      const burstConfidence = await storage.get(BURST_CONFIDENCE_KEY); if (typeof burstConfidence === 'number') S.burstConfidenceThreshold = burstConfidence;
      const settingsLanguage = await storage.get(SETTINGS_LANGUAGE_KEY);
      if (typeof settingsLanguage === 'string' && ['en', 'bg'].includes(settingsLanguage)) {
        S.settingsLanguage = settingsLanguage;
      }
      const signal1m = await storage.get(SIGNAL_SOURCE_1M_KEY);
      if (typeof signal1m === 'boolean') S.signalSourceEnabled['1m'] = signal1m;
      const signal5m = await storage.get(SIGNAL_SOURCE_5M_KEY);
      if (typeof signal5m === 'boolean') S.signalSourceEnabled['5m'] = signal5m;
      const tradeMode = await storage.get(TRADE_MODE_KEY);
      if (typeof tradeMode === 'string' && ['signals', 'single_asset', 'signals_only', 'test'].includes(tradeMode)) {
        S.tradeMode = tradeMode;
      }
      if (isSingleAssetMode()) {
        applySingleAssetDefaults();
      }
      if (isTestMode()) {
        applyTestDefaults();
      }

      const savedCoords = await storage.get(COORDS_KEY);
      if (savedCoords && typeof savedCoords === 'object') {
        S.coords = Object.assign({}, S.coords, savedCoords);
        if (S.coords.ROW_OTC_COORD) C.COORD_ROW_OTC = S.coords.ROW_OTC_COORD;
        if (S.coords.ROW_SPOT_COORD) C.COORD_ROW_SPOT = S.coords.ROW_SPOT_COORD;
        if (S.coords.CLOSE_COORD) C.COORD_CLOSE = S.coords.CLOSE_COORD;
        if (S.coords.DD_COORD) C.DD_COORD = S.coords.DD_COORD;
        if (S.coords.SEARCH_COORD) C.SEARCH_COORD = S.coords.SEARCH_COORD;
        if (S.coords.BUY_COORD) C.COORD_BUY = S.coords.BUY_COORD;
        if (S.coords.SELL_COORD) C.COORD_SELL = S.coords.SELL_COORD;
      }

      const savedSelectors = await storage.get(MANUAL_SELECTORS_KEY);
      if (savedSelectors && typeof savedSelectors === 'object') {
        S.manualSelectors = Object.assign({}, S.manualSelectors, savedSelectors);
      }

      const savedMethod = await storage.get(BUY_SELL_METHOD_KEY);
      if (savedMethod && ['auto', 'coordinates', 'selectors', 'xpath'].includes(savedMethod)) {
        S.buySellMethod = savedMethod;
      }

      const savedXPaths = await storage.get(XPATH_SELECTORS_KEY);
      if (savedXPaths && typeof savedXPaths === 'object') {
        S.xpathSelectors = Object.assign({}, S.xpathSelectors, savedXPaths);
      }
    }

    function persistSettings(){
      storage.set(BASE_AMOUNT_KEY, S.baseAmount ?? 100);
      storage.set(L1_ON_KEY, S.l1Active);
      storage.set(L2_ON_KEY, S.l2Active);
      storage.set(L1_MULT_KEY, S.l1Multiplier);
      storage.set(L2_MULT_KEY, S.l2Multiplier);
      storage.set(EXPIRY_KEY, S.expirySetting);
      storage.set(KEEP_ALIVE_KEY, S.keepAliveEnabled);
      storage.set(FORCE_ASSET_SELECT_KEY, S.forceAssetSelect);
      storage.set(MAX_SESSION_LOSS_KEY, S.maxSessionLossCents);
      storage.set(MAX_CONSECUTIVE_LOSSES_KEY, S.maxConsecutiveLosses);
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
      storage.set(SIGNAL_OVERRIDE_ENABLED_KEY, S.signalOverrideEnabled);
      storage.set(MULTI_TF_ENABLED_KEY, S.multiTimeframeEnabled);
      storage.set(COOLDOWN_LOSSES_KEY, S.cooldownLosses);
      storage.set(COOLDOWN_MIN_KEY, S.cooldownMin);
      storage.set(REVERSAL_WINDOW_SEC_KEY, S.reversalWindowSec);
      storage.set(REVERSAL_OPPOSITE_RATIO_KEY, S.reversalOppositeRatio);
      storage.set(PANEL_OPACITY_KEY, S.panelOpacity);
      storage.set(COUNTDOWN_BEEP_KEY, S.countdownBeepEnabled);
      storage.set(BURST_ENABLED_KEY, S.burstEnabled);
      storage.set(BURST_COUNT_KEY, S.burstTradeCount);
      storage.set(BURST_CONFIDENCE_KEY, S.burstConfidenceThreshold);
      storage.set(SETTINGS_LANGUAGE_KEY, S.settingsLanguage);
      storage.set(SIGNAL_SOURCE_1M_KEY, S.signalSourceEnabled['1m']);
      storage.set(SIGNAL_SOURCE_5M_KEY, S.signalSourceEnabled['5m']);
      storage.set(TRADE_MODE_KEY, S.tradeMode);
      storage.set(MANUAL_SELECTORS_KEY, S.manualSelectors);
      storage.set(BUY_SELL_METHOD_KEY, S.buySellMethod);
      storage.set(XPATH_SELECTORS_KEY, S.xpathSelectors);
    }

    function renderSettingsPanel(){
      const l1 = $id('iaa-l1'), l2 = $id('iaa-l2');
      if (!l1 || !l2) return;
      l1.checked = S.l1Active;
      l2.checked = S.l2Active;

      const l1m = $id('iaa-l1-multiplier');
      const l2m = $id('iaa-l2-multiplier');
      const exp = $id('iaa-expiry-setting');
      const base = $id('iaa-base-amount');
      const keepAlive = $id('iaa-keep-alive');
      const forceAsset = $id('iaa-force-asset');
      const maxSessionLoss = $id('iaa-max-session-loss');
      const maxLossStreak = $id('iaa-max-loss-streak');
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
      const signalOverride = $id('iaa-signal-override');
      const multiTf = $id('iaa-multi-tf');
      const burstEnabled = $id('iaa-burst-enabled');
      const burstCount = $id('iaa-burst-count');
      const burstConfidence = $id('iaa-burst-confidence');
      const cooldownLosses = $id('iaa-cooldown-losses');
      const cooldownMin = $id('iaa-cooldown-min');
      const reversalWindow = $id('iaa-reversal-window');
      const reversalRatio = $id('iaa-reversal-ratio');
      const panelOpacity = $id('iaa-panel-opacity');
      const countdownBeep = $id('iaa-countdown-beep');
      const settingsLanguage = $id('iaa-settings-language');
      const tradeMode = $id('iaa-trade-mode');
      const signalSource1m = $id('iaa-signal-source-1m');
      const signalSource5m = $id('iaa-signal-source-5m');

      if (l1m) l1m.value = S.l1Multiplier;
      if (l2m) l2m.value = S.l2Multiplier;
      if (exp) exp.value = S.expirySetting;
      if (base) base.value = (S.baseAmount ?? 100)/100;
      if (keepAlive) keepAlive.checked = S.keepAliveEnabled;
      if (forceAsset) forceAsset.checked = S.forceAssetSelect;
      if (maxSessionLoss) maxSessionLoss.value = (S.maxSessionLossCents || 0) / 100;
      if (maxLossStreak) maxLossStreak.value = S.maxConsecutiveLosses || 0;
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
      if (signalOverride) signalOverride.checked = S.signalOverrideEnabled;
      if (multiTf) multiTf.checked = S.multiTimeframeEnabled;
      if (burstEnabled) burstEnabled.checked = S.burstEnabled;
      if (burstCount) burstCount.value = S.burstTradeCount || 2;
      if (burstConfidence) burstConfidence.value = S.burstConfidenceThreshold || 0.85;
      if (cooldownLosses) cooldownLosses.value = S.cooldownLosses || 6;
      if (cooldownMin) cooldownMin.value = S.cooldownMin || 35;
      if (reversalWindow) reversalWindow.value = S.reversalWindowSec || 5;
      if (reversalRatio) reversalRatio.value = S.reversalOppositeRatio || 0.6;
      if (panelOpacity) panelOpacity.value = S.panelOpacity ?? 1;
      if (countdownBeep) countdownBeep.checked = S.countdownBeepEnabled;
      if (settingsLanguage) settingsLanguage.value = S.settingsLanguage || 'en';
      if (tradeMode) tradeMode.value = S.tradeMode || 'signals';
      if (signalSource1m) signalSource1m.checked = S.signalSourceEnabled['1m'];
      if (signalSource5m) signalSource5m.checked = S.signalSourceEnabled['5m'];
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
            S.analysisReadyAt = Date.now() + Math.max(1, S.analysisWarmupMin) * 60 * 1000;
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

            if (S.keepAliveEnabled) {
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
            resetExecutionState();
            stopCountdown();
            setUIState('IDLE');
            renderWarmup(0);
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

      const L1=$id('iaa-l1'), L2=$id('iaa-l2'), L1M=$id('iaa-l1-multiplier'), L2M=$id('iaa-l2-multiplier'), EXP=$id('iaa-expiry-setting'), BASE=$id('iaa-base-amount'), KEEP_ALIVE=$id('iaa-keep-alive'), FORCE_ASSET=$id('iaa-force-asset'), MAX_SESSION_LOSS=$id('iaa-max-session-loss'), MAX_LOSS_STREAK=$id('iaa-max-loss-streak'), ANALYSIS_ENABLED=$id('iaa-analysis-enabled'), ANALYSIS_CONFIDENCE=$id('iaa-analysis-confidence'), TRADE_INTERVAL_MIN=$id('iaa-trade-interval-min'), PAYOUT_MIN=$id('iaa-payout-min'), PAYOUT_MAX=$id('iaa-payout-max'), PAYOUT_REQUIRED=$id('iaa-payout-required'), MAX_TRADE_AMOUNT=$id('iaa-max-trade-amount'), MAX_TRADE_MULTIPLIER=$id('iaa-max-trade-multiplier'), ANALYSIS_WINDOW=$id('iaa-analysis-window'), ANALYSIS_WARMUP=$id('iaa-analysis-warmup'), SELF_TRADE_ENABLED=$id('iaa-self-trade-enabled'), SIGNAL_OVERRIDE=$id('iaa-signal-override'), MULTI_TF=$id('iaa-multi-tf'), BURST_ENABLED=$id('iaa-burst-enabled'), BURST_COUNT=$id('iaa-burst-count'), BURST_CONFIDENCE=$id('iaa-burst-confidence'), COOLDOWN_LOSSES=$id('iaa-cooldown-losses'), COOLDOWN_MIN=$id('iaa-cooldown-min'), REVERSAL_WINDOW=$id('iaa-reversal-window'), REVERSAL_RATIO=$id('iaa-reversal-ratio'), PANEL_OPACITY=$id('iaa-panel-opacity'), COUNTDOWN_BEEP=$id('iaa-countdown-beep'), SETTINGS_LANGUAGE=$id('iaa-settings-language'), TRADE_MODE=$id('iaa-trade-mode'), SIGNAL_SOURCE_1M=$id('iaa-signal-source-1m'), SIGNAL_SOURCE_5M=$id('iaa-signal-source-5m');

      if (L1) L1.addEventListener('change',()=>{ S.l1Active=L1.checked; persistSettings(); });
      if (L2) L2.addEventListener('change',()=>{ S.l2Active=L2.checked; if (S.l2Active && !S.l1Active){ L1.checked=true; S.l1Active=true; } persistSettings(); });
      if (L1M) L1M.addEventListener('input',()=>{ S.l1Multiplier=parseNumberFlexible(L1M.value)||2; persistSettings(); });
      if (L2M) L2M.addEventListener('input',()=>{ S.l2Multiplier=parseNumberFlexible(L2M.value)||4; persistSettings(); });
      if (EXP) EXP.addEventListener('change',()=>{ S.expirySetting=normalizeExpiry(EXP.value)||'1M'; persistSettings(); });
      if (BASE) BASE.addEventListener('input',()=>{ const d=parseNumberFlexible(BASE.value)||1; S.baseAmount = Math.max(1, Math.round(d))*100; persistSettings(); });
      if (KEEP_ALIVE) {
        KEEP_ALIVE.addEventListener('change',()=>{ 
          S.keepAliveEnabled = KEEP_ALIVE.checked; 
          persistSettings();
          if (S.keepAliveEnabled && S.running) {
            startKeepAlive();
          } else {
            stopKeepAlive();
          }
        });
      }
      if (FORCE_ASSET) {
        FORCE_ASSET.addEventListener('change',()=>{ 
          S.forceAssetSelect = FORCE_ASSET.checked; 
          persistSettings();
        });
      }
      if (MAX_SESSION_LOSS) {
        MAX_SESSION_LOSS.addEventListener('input',()=>{ 
          const d = parseNumberFlexible(MAX_SESSION_LOSS.value) || 0;
          S.maxSessionLossCents = Math.max(0, Math.round(d)) * 100;
          persistSettings();
        });
      }
      if (MAX_LOSS_STREAK) {
        MAX_LOSS_STREAK.addEventListener('input',()=>{ 
          const d = parseNumberFlexible(MAX_LOSS_STREAK.value) || 0;
          S.maxConsecutiveLosses = Math.max(0, Math.round(d));
          persistSettings();
        });
      }
      if (ANALYSIS_ENABLED) {
        ANALYSIS_ENABLED.addEventListener('change',()=>{ 
          S.analysisEnabled = ANALYSIS_ENABLED.checked; 
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
          persistSettings();
        });
      }
      if (SELF_TRADE_ENABLED) {
        SELF_TRADE_ENABLED.addEventListener('change',()=>{ 
          S.selfTradeEnabled = SELF_TRADE_ENABLED.checked;
          persistSettings();
        });
      }
      if (SIGNAL_OVERRIDE) {
        SIGNAL_OVERRIDE.addEventListener('change',()=>{ 
          S.signalOverrideEnabled = SIGNAL_OVERRIDE.checked;
          persistSettings();
        });
      }
      if (MULTI_TF) {
        MULTI_TF.addEventListener('change',()=>{ 
          S.multiTimeframeEnabled = MULTI_TF.checked;
          persistSettings();
        });
      }
      if (BURST_ENABLED) {
        BURST_ENABLED.addEventListener('change',()=>{ 
          S.burstEnabled = BURST_ENABLED.checked; 
          persistSettings();
        });
      }
      if (BURST_COUNT) {
        BURST_COUNT.addEventListener('input',()=>{ 
          const d = parseNumberFlexible(BURST_COUNT.value) || 1;
          S.burstTradeCount = Math.max(1, Math.min(5, Math.round(d)));
          persistSettings();
        });
      }
      if (BURST_CONFIDENCE) {
        BURST_CONFIDENCE.addEventListener('input',()=>{ 
          const d = parseNumberFlexible(BURST_CONFIDENCE.value) || 0.85;
          S.burstConfidenceThreshold = Math.max(0, Math.min(1, d));
          persistSettings();
        });
      }
      if (COOLDOWN_LOSSES) {
        COOLDOWN_LOSSES.addEventListener('input',()=>{ 
          const d = parseNumberFlexible(COOLDOWN_LOSSES.value) || 6;
          S.cooldownLosses = Math.max(1, Math.round(d));
          persistSettings();
        });
      }
      if (COOLDOWN_MIN) {
        COOLDOWN_MIN.addEventListener('input',()=>{ 
          const d = parseNumberFlexible(COOLDOWN_MIN.value) || 35;
          S.cooldownMin = Math.max(5, Math.round(d));
          persistSettings();
        });
      }
      if (REVERSAL_WINDOW) {
        REVERSAL_WINDOW.addEventListener('input',()=>{ 
          const d = parseNumberFlexible(REVERSAL_WINDOW.value) || 5;
          S.reversalWindowSec = Math.max(2, Math.round(d));
          persistSettings();
        });
      }
      if (REVERSAL_RATIO) {
        REVERSAL_RATIO.addEventListener('input',()=>{ 
          const d = parseNumberFlexible(REVERSAL_RATIO.value) || 0.6;
          S.reversalOppositeRatio = Math.max(0, Math.min(1, d));
          persistSettings();
        });
      }
      if (PANEL_OPACITY) {
        PANEL_OPACITY.addEventListener('input',()=>{ 
          const d = parseNumberFlexible(PANEL_OPACITY.value);
          const opacity = Math.max(0.3, Math.min(1, d ?? 1));
          S.panelOpacity = opacity;
          const panel = $id('iaa-panel');
          if (panel) panel.style.opacity = String(opacity);
          persistSettings();
        });
      }
      if (COUNTDOWN_BEEP) {
        COUNTDOWN_BEEP.addEventListener('change',()=>{ 
          S.countdownBeepEnabled = COUNTDOWN_BEEP.checked;
          persistSettings();
        });
      }
      if (SETTINGS_LANGUAGE) {
        SETTINGS_LANGUAGE.addEventListener('change',()=>{ 
          const next = SETTINGS_LANGUAGE.value;
          if (['en', 'bg'].includes(next)) {
            S.settingsLanguage = next;
            persistSettings();
            applySettingsTranslations();
            setStatusOverlay(formatStatus('looking_for_opportunity'), '', false);
            renderConsole();
            applyStatusLabels();
            renderTradeStats();
          }
        });
      }
      if (TRADE_MODE) {
        TRADE_MODE.addEventListener('change',()=>{ 
          const next = TRADE_MODE.value;
          if (['signals', 'single_asset', 'signals_only', 'test'].includes(next)) {
            S.tradeMode = next;
            if (isSingleAssetMode()) {
              applySingleAssetDefaults();
            }
            if (isTestMode()) {
              applyTestDefaults();
            }
            persistSettings();
            if (isSingleAssetMode()) {
              S.signalBuffer.length = 0;
              S.currentSignal = null;
              S.tradeSequenceActive = false;
              S.hasLiveSignal = false;
              ensureSingleAssetSelected();
            }
          }
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
    const CAL_STEPS = [
      { key: 'DD_COORD',       label: 'Asset dropdown' },
      { key: 'SEARCH_COORD',   label: 'Asset search field' },
      { key: 'ROW_OTC_COORD',  label: 'Result row (OTC)' },
      { key: 'ROW_SPOT_COORD', label: 'Result row (REAL)' },
      { key: 'CLOSE_COORD',    label: 'Close area' },
      { key: 'BUY_COORD',      label: 'BUY button' },
      { key: 'SELL_COORD',     label: 'SELL button' }
    ];

    function logMouse(msg){
      S.mouseLogs.unshift(`[${new Date().toLocaleTimeString()}] ${msg}`);
      if (S.mouseLogs.length > 20) S.mouseLogs.pop();
      const log = $id('iaa-mouse-log'); if (log) {
        log.innerHTML = S.mouseLogs.map(x=>`<div>${x}</div>`).join('');
        log.scrollTop = 0;
      }
    }

    function renderMouseList(){
      const list = $id('iaa-mouse-list'); if (!list) return;
      const rows = CAL_STEPS.map(st => {
        const v = S.coords[st.key];
        const val = v ? `<span style="font-family:monospace; color:#9ca3af; font-size:11px;">(${v.x}, ${v.y})</span>` : `<span style="font-family:monospace; color:#9ca3af; font-size:11px;">—</span>`;
        const status = v ? '✅' : '❌';
        return `
          <div style="display:flex; align-items:center; justify-content:space-between; gap:8px; margin:6px 0;">
            <div style="font-size:11px; display:flex; align-items:center; gap:6px;">
              ${status} ${st.label}
            </div>
            <div style="display:flex;gap:6px;align-items:center;">
              ${val}
              <button data-test="${st.key}" style="height:28px; border-radius:6px; border:1px solid rgba(255,255,255,.12); background:#191919; color:#fff; padding:0 10px; cursor:pointer; font-size:11px;">Test</button>
            </div>
          </div>`;
      }).join('');
      list.innerHTML = rows;

      list.querySelectorAll('button[data-test]').forEach(btn=>{
        btn.addEventListener('click',()=>{
          const k = btn.getAttribute('data-test');
          const v = S.coords[k];
          if (v) {
            const target = document.elementFromPoint(v.x, v.y);
            if (target) simulateClick(target);
            logMouse(`Test clicked ${CAL_STEPS.find(s => s.key === k)?.label} @ (${v.x}, ${v.y})`);
          } else {
            logMouse(`No coordinates saved for ${CAL_STEPS.find(s => s.key === k)?.label}`);
          }
        });
      });
    }

    function renderMouseStep(){
      const row = $id('iaa-mouse-step'); if (!row) return;
      const next = CAL_STEPS[S.calStepIndex];
      if (next) {
        row.textContent = `${next.label} - Hover and press Shift+W`;
        row.style.color = '#fbbf24';
      } else {
        row.textContent = 'Calibration Complete!';
        row.style.color = '#22c55e';
      }
    }

    function renderMousePanel(){
      const methodButtons = ['iaa-method-xpath', 'iaa-method-auto', 'iaa-method-coords', 'iaa-method-selectors'];
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
      const coordsBtn = $id('iaa-method-coords');
      const selectorsBtn = $id('iaa-method-selectors');

      if (S.buySellMethod === 'xpath' && xpathBtn) {
        xpathBtn.style.background = '#374151';
        xpathBtn.style.color = '#60a5fa';
        xpathBtn.style.borderColor = '#60a5fa';
      } else if (S.buySellMethod === 'auto' && autoBtn) {
        autoBtn.style.background = '#374151';
        autoBtn.style.color = '#60a5fa';
        autoBtn.style.borderColor = '#60a5fa';
      } else if (S.buySellMethod === 'coordinates' && coordsBtn) {
        coordsBtn.style.background = '#374151';
        coordsBtn.style.color = '#60a5fa';
        coordsBtn.style.borderColor = '#60a5fa';
      } else if (S.buySellMethod === 'selectors' && selectorsBtn) {
        selectorsBtn.style.background = '#374151';
        selectorsBtn.style.color = '#60a5fa';
        selectorsBtn.style.borderColor = '#60a5fa';
      }

      const selectorsSection = $id('iaa-selectors-section');
      const xpathStatus = $id('iaa-xpath-status');
      if (selectorsSection) selectorsSection.style.display = S.buySellMethod === 'selectors' ? 'block' : 'none';
      if (xpathStatus) xpathStatus.style.display = S.buySellMethod === 'xpath' ? 'block' : 'none';

      renderMouseList();
      renderMouseStep();

      const buyInput = $id('iaa-manual-buy-selector');
      const sellInput = $id('iaa-manual-sell-selector');
      if (buyInput) buyInput.value = S.manualSelectors.buy || '';
      if (sellInput) sellInput.value = S.manualSelectors.sell || '';

      logMouse(`Buy/Sell method: ${S.buySellMethod}`);
    }

    function setBuySellMethod(method) {
      S.buySellMethod = method;
      persistSettings();
      renderMousePanel();
      logMouse(`Buy/Sell method changed to: ${method}`);
    }

    function startCalibration(){
      S.calibrating = true;
      S.calStepIndex = 0;
      logMouse('Calibration started! Hover over each target and press Shift + W to capture coordinates.');
      renderMouseStep();
    }

    function cancelCalibration(){
      S.calibrating = false;
      S.calStepIndex = 0;
      logMouse('Calibration cancelled.');
      renderMouseStep();
    }

    async function saveCalibration(){
      await storage.set(COORDS_KEY, S.coords);
      if (S.coords.ROW_OTC_COORD) C.COORD_ROW_OTC = S.coords.ROW_OTC_COORD;
      if (S.coords.ROW_SPOT_COORD) C.COORD_ROW_SPOT = S.coords.ROW_SPOT_COORD;
      if (S.coords.CLOSE_COORD) C.COORD_CLOSE = S.coords.CLOSE_COORD;
      if (S.coords.DD_COORD) C.DD_COORD = S.coords.DD_COORD;
      if (S.coords.SEARCH_COORD) C.SEARCH_COORD = S.coords.SEARCH_COORD;
      if (S.coords.BUY_COORD) C.COORD_BUY = S.coords.BUY_COORD;
      if (S.coords.SELL_COORD) C.COORD_SELL = S.coords.SELL_COORD;

      const buyInput = $id('iaa-manual-buy-selector');
      const sellInput = $id('iaa-manual-sell-selector');
      if (buyInput) S.manualSelectors.buy = buyInput.value.trim();
      if (sellInput) S.manualSelectors.sell = sellInput.value.trim();
      await storage.set(MANUAL_SELECTORS_KEY, S.manualSelectors);

      logMouse('✅ All coordinates and selectors saved & applied successfully!');
      renderMouseList();
    }

    async function resetCalibration(){
      try { await storage.del(COORDS_KEY); } catch {}
      try { await storage.del(MANUAL_SELECTORS_KEY); } catch {}
      S.coords = {
        DD_COORD: null, SEARCH_COORD: null, ROW_OTC_COORD: null,
        ROW_SPOT_COORD: null, CLOSE_COORD: null, BUY_COORD: null, SELL_COORD: null
      };
      S.manualSelectors = { buy: '', sell: '' };
      C.COORD_ROW_OTC = { x: 445, y: 300 };
      C.COORD_ROW_SPOT = { x: 445, y: 300 };
      C.COORD_CLOSE    = { x: 760, y:  20 };
      C.COORD_BUY      = { x: 700, y: 500 };
      C.COORD_SELL     = { x: 800, y: 500 };
      C.DD_COORD       = null;
      C.SEARCH_COORD   = null;

      const buyInput = $id('iaa-manual-buy-selector');
      const sellInput = $id('iaa-manual-sell-selector');
      if (buyInput) buyInput.value = '';
      if (sellInput) sellInput.value = '';

      logMouse('🔄 All calibration reset to defaults.');
      renderMousePanel();
    }

    function ensureMouseHandlers() {
      const xpathBtn = $id('iaa-method-xpath');
      const autoBtn = $id('iaa-method-auto');
      const coordsBtn = $id('iaa-method-coords');
      const selectorsBtn = $id('iaa-method-selectors');

      if (xpathBtn) xpathBtn.addEventListener('click', () => setBuySellMethod('xpath'));
      if (autoBtn) autoBtn.addEventListener('click', () => setBuySellMethod('auto'));
      if (coordsBtn) coordsBtn.addEventListener('click', () => setBuySellMethod('coordinates'));
      if (selectorsBtn) selectorsBtn.addEventListener('click', () => setBuySellMethod('selectors'));

      document.addEventListener('mousemove', (e)=>{
        S.lastMousePos.x = e.clientX;
        S.lastMousePos.y = e.clientY;
      }, { capture:true });

      document.addEventListener('keydown', (e)=>{
        if (!S.calibrating) return;
        if (!(e.shiftKey && (e.key === 'w' || e.key === 'W'))) return;
        const now = Date.now();
        if (now - S.lastCaptureTs < 150) return;
        S.lastCaptureTs = now;
        e.preventDefault();
        e.stopPropagation();

        const step = CAL_STEPS[S.calStepIndex];
        if (!step) {
          logMouse('🎉 All steps complete! Click "Save & Apply" to save coordinates.');
          S.calibrating = false;
          return;
        }

        const pos = { x: S.lastMousePos.x, y: S.lastMousePos.y };
        S.coords[step.key] = pos;
        logMouse(`✅ Captured ${step.label}: (${pos.x}, ${pos.y})`);
        renderMouseList();

        S.calStepIndex++;
        if (S.calStepIndex >= CAL_STEPS.length) {
          S.calibrating = false;
          logMouse('🎉 Calibration finished! Click "Save & Apply" to save all coordinates.');
        }
        renderMouseStep();
      }, { capture:true });

      const startBtn = $id('iaa-mouse-start');
      const cancelBtn = $id('iaa-mouse-cancel');
      const resetBtn = $id('iaa-mouse-reset');
      const saveBtn = $id('iaa-mouse-save');

      if (startBtn) startBtn.addEventListener('click', startCalibration);
      if (cancelBtn) cancelBtn.addEventListener('click', cancelCalibration);
      if (resetBtn) resetBtn.addEventListener('click', resetCalibration);
      if (saveBtn) saveBtn.addEventListener('click', saveCalibration);
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

      if (S.keepAliveEnabled && S.running) {
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
