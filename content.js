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
  const SIGNAL_SOURCE_5M_KEY = 'IAA_SIGNAL_SOURCE_5M';
  const SIGNAL_SOURCE_1M_KEY = 'IAA_SIGNAL_SOURCE_1M';
  const SIGNAL_TIME_OFFSET_MIN_KEY = 'IAA_SIGNAL_TIME_OFFSET_MIN';
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
  const DYNAMIC_TIME_KEY = 'IAA_DYNAMIC_TIME_ENABLED';
  const SNIPER_BASE_AMOUNT_KEY = 'IAA_SNIPER_BASE_AMOUNT_CENTS';
  const SNIPER_THRESHOLD_KEY = 'IAA_SNIPER_THRESHOLD';
  const SNIPER_THRESHOLD_OTC_KEY = 'IAA_SNIPER_THRESHOLD_OTC';
  const SNIPER_THRESHOLD_REAL_KEY = 'IAA_SNIPER_THRESHOLD_REAL';
  const SNIPER_MIN_PAYOUT_KEY = 'IAA_SNIPER_MIN_PAYOUT';
  const SNIPER_ENTRY_WINDOW_SEC_KEY = 'IAA_SNIPER_ENTRY_WINDOW_SEC';
  const SNIPER_WARMUP_MIN_KEY = 'IAA_SNIPER_WARMUP_MIN';
  const SNIPER_VWAP_DEV_KEY = 'IAA_SNIPER_VWAP_DEV';
  const SNIPER_VWAP_LOOKBACK_KEY = 'IAA_SNIPER_VWAP_LOOKBACK';
  const SNIPER_MOMENTUM_KEY = 'IAA_SNIPER_MOMENTUM';
  const SNIPER_VOLUME_THRESHOLD_KEY = 'IAA_SNIPER_VOLUME_THRESHOLD';
  const SNIPER_CHOP_KEY = 'IAA_SNIPER_CHOP';
  const SNIPER_EMA_FAST_KEY = 'IAA_SNIPER_EMA_FAST';
  const SNIPER_EMA_SLOW_KEY = 'IAA_SNIPER_EMA_SLOW';
  const SNIPER_RSI_OVERSOLD_KEY = 'IAA_SNIPER_RSI_OVERSOLD';
  const SNIPER_RSI_OVERBOUGHT_KEY = 'IAA_SNIPER_RSI_OVERBOUGHT';
  const SNIPER_KEEP_ALIVE_KEY = 'IAA_SNIPER_KEEP_ALIVE';
  const SNIPER_VWAP_WEIGHT_KEY = 'IAA_SNIPER_VWAP_WEIGHT';
  const SNIPER_MOMENTUM_WEIGHT_KEY = 'IAA_SNIPER_MOMENTUM_WEIGHT';
  const SNIPER_VOLUME_WEIGHT_KEY = 'IAA_SNIPER_VOLUME_WEIGHT';
  const SNIPER_VWAP_ENABLED_KEY = 'IAA_SNIPER_VWAP_ENABLED';
  const SNIPER_MOMENTUM_ENABLED_KEY = 'IAA_SNIPER_MOMENTUM_ENABLED';
  const SNIPER_VOLUME_ENABLED_KEY = 'IAA_SNIPER_VOLUME_ENABLED';
  const SNIPER_CHOP_ENABLED_KEY = 'IAA_SNIPER_CHOP_ENABLED';
  const SNIPER_OVERRIDE_CONF_PCT_KEY = 'IAA_SNIPER_OVERRIDE_CONF_PCT';
  const SNIPER_MULTI_THRESHOLD_KEY = 'IAA_SNIPER_MULTI_THRESHOLD_PCT';
  const SNIPER_MULTI_COUNT_KEY = 'IAA_SNIPER_MULTI_COUNT';
  const SNIPER_MULTI_AMOUNT_PCT_KEY = 'IAA_SNIPER_MULTI_AMOUNT_PCT';
  const SNIPER_MULTI_ENABLED_KEY = 'IAA_SNIPER_MULTI_ENABLED';
  const SNIPER_TIMEFRAMES_KEY = 'IAA_SNIPER_TIMEFRAMES_V1';
  const FEATURE_VOLUME_REJECTION_KEY = 'IAA_FEATURE_VOLUME_REJECTION';
  const FEATURE_VWAP_ANALYSIS_KEY = 'IAA_FEATURE_VWAP_ANALYSIS';
  const FEATURE_SESSION_BOOST_KEY = 'IAA_FEATURE_SESSION_BOOST';
  const FEATURE_TIMEFRAMES_KEY = 'IAA_FEATURE_TIMEFRAMES_V1';
  const STRATEGY_AUTO_SWITCH_KEY = 'IAA_STRATEGY_AUTO_SWITCH';
  const STRATEGY_WR_WEIGHT_KEY = 'IAA_STRATEGY_WR_WEIGHT';
  const STRATEGY_PNL_WEIGHT_KEY = 'IAA_STRATEGY_PNL_WEIGHT';
  const STRATEGY_LEARNING_TRADES_KEY = 'IAA_STRATEGY_LEARNING_TRADES';
  const STRATEGY_LOSS_STREAK_LIMIT_KEY = 'IAA_STRATEGY_LOSS_STREAK_LIMIT';
  const STRATEGY_CONFIG_KEY = 'IAA_STRATEGY_CONFIG_V1';
  const MAX_TRADES_PER_MIN_KEY = 'IAA_MAX_TRADES_PER_MIN';
  const MAX_OPEN_TRADES_KEY = 'IAA_MAX_OPEN_TRADES';
  const IDLE_SWITCH_ENABLED_KEY = 'IAA_IDLE_SWITCH_ENABLED';
  const IDLE_SWITCH_MIN_KEY = 'IAA_IDLE_SWITCH_MIN';
  const REGIME_STRENGTH_KEY = 'IAA_REGIME_STRENGTH';
  const CONFIRMATION_STRENGTH_KEY = 'IAA_CONFIRMATION_STRENGTH';
  const BIAS_STRENGTH_KEY = 'IAA_BIAS_STRENGTH';
  const BIAS_TF_1M_KEY = 'IAA_BIAS_TF_1M';
  const BIAS_TF_3M_KEY = 'IAA_BIAS_TF_3M';
  const BIAS_TF_5M_KEY = 'IAA_BIAS_TF_5M';
  const BIAS_TF_30M_KEY = 'IAA_BIAS_TF_30M';
  const CONFLICT_STRENGTH_KEY = 'IAA_CONFLICT_STRENGTH';
  const SNIPER_5S_DEFAULTS = {
    baseAmountCents: 10000,
    threshold: 0.65,
    minPayout: 70,
    entryWindowSec: 5,
    warmupMin: 6,
    vwapDeviation: 0.0012,
    vwapLookbackMin: 2,
    momentumThreshold: 0.0014,
    chopThreshold: 0.7,
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
    vwapWeight: 0.55,
    momentumWeight: 0.35,
    volumeWeight: 0.10,
    overrideConfidencePct: 90,
    multiThresholdPct: 99,
    multiCount: 2,
    multiAmountPct: 50,
    timeframes: { '3s': false, '15s': false, '30s': false, '1m': true, '3m': true, '5m': false, '15m': false, '30m': false }
  };
  const FEATURE_DEFAULTS = {
    volumeRejection: true,
    vwapAnalysis: true,
    sessionBoost: true,
    timeframes: { '15s': true, '1m': true, '3m': true, '5m': true, '15m': false, '30m': false }
  };
  const STRATEGY_DEFAULTS = {
    autoSwitch: true,
    wrWeight: 0.6,
    pnlWeight: 0.4,
    learningTrades: 12,
    lossStreakLimit: 3,
    configs: {
      vwap_momentum: { enabled: true, priority: 1, label: 'VWAP+Momentum' },
      candlestick: { enabled: true, priority: 0.9, label: 'Candlestick' },
      stoch_extreme: { enabled: true, priority: 0.75, label: 'Stoch Extreme' }
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

      // Telegram signals (1m/5m)
      SIGNAL_SOURCES: [
        {
          key: '5m',
          url: 'https://t.me/+POqCj8MhmoBjMGIx',
          expiryOverride: '5M',
          label: '5m',
          joinSelector: 'body > div.tgme_page_wrap > div.tgme_body_wrap > div > div.tgme_page_action.tgme_page_web_action > a > span',
          openWebLabel: 'OPEN IN WEB'
        }
      ],
      SIGNAL_POLL_MS: 3000,
      SIGNAL_FRESH_SEC: 15,
      IDLE_ASSET_POOL: [
        { asset: 'EUR/USD (OTC)', assetSearch: 'EURUSD', isOTC: true },
        { asset: 'GBP/USD (OTC)', assetSearch: 'GBPUSD', isOTC: true },
        { asset: 'USD/JPY (OTC)', assetSearch: 'USDJPY', isOTC: true },
        { asset: 'AUD/USD (OTC)', assetSearch: 'AUDUSD', isOTC: true },
        { asset: 'EUR/JPY (OTC)', assetSearch: 'EURJPY', isOTC: true }
      ],

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
        '#put-call-buttons-chart-1 > div > div.buttons__wrap > div.block.block--payout > div.block__control.control > div > div > div.value__val-start',
        '.value__val-start',
        '.block--payout .value__val-start',
        '[data-test="payout"]',
        '[data-test="profit-percent"]',
        '.payout',
        '.profit-percent',
        '.payout-percent',
        '.payout__percent',
        '.rate-block__percent',
        '.payout-value'
      ],
      DYNAMIC_TIME_VALUE_SELECTOR: '#put-call-buttons-chart-1 > div > div.blocks-wrap > div.block.block--expiration-inputs > div.block__control.control > div.control__value.value.value--several-items > div',
      DYNAMIC_TIME_PLUS_SELECTORS: {
        hours: '#modal-root > div > div > div > div.trading-panel-modal__in > div:nth-child(1) > a.btn-plus',
        minutes: '#modal-root > div > div > div > div.trading-panel-modal__in > div:nth-child(2) > a.btn-plus',
        seconds: '#modal-root > div > div > div > div.trading-panel-modal__in > div:nth-child(3) > a.btn-plus'
      },
      DYNAMIC_TIME_MINUS_SELECTORS: {
        hours: '#modal-root > div > div > div > div.trading-panel-modal__in > div:nth-child(1) > a.btn-minus',
        minutes: '#modal-root > div > div > div > div.trading-panel-modal__in > div:nth-child(2) > a.btn-minus',
        seconds: '#modal-root > div > div > div > div.trading-panel-modal__in > div:nth-child(3) > a.btn-minus'
      },
      HISTORY_ROW_SELECTORS: [
        '[data-test*="history" i] tr',
        '[data-test*="deal" i]',
        '[data-testid*="history" i] tr',
        '[data-test*="trade" i] tr',
        '[data-testid*="trade" i] tr',
        '.deals-history tr',
        '.deals-history .deal',
        '.trades-history tr',
        '.trades-history .deal',
        '.trades__list .trades__item',
        '.trades__list .trades__row',
        '.trades-table tr',
        '.history-list .item',
        '.history-item',
        '.deals-list .item',
        '.deals-list__item',
        '.deals-list__item-first',
        '.trades-list .item',
        '.right-widget-container .trades-list .item',
        '.right-widget-container .trades__list .trades__item',
        '.right-widget-container [class*="closed" i] [class*="item" i]',
        '[class*="history" i] tr',
        '[class*="history" i] [class*="item" i]'
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
      telegramJoinAttempted: false,
      telegramJoinOpenedAt: 0,

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
      calibrationPanelOpen: false,
      strategiesPanelOpen: false,
      mouseLogs: [],
      gridCollapsed: false,

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
      tradeStatsByExpiry: {},
      tradeStatsMulti: { total: 0, wins: 0, losses: 0, evens: 0, profitCents: 0, winCents: 0, lossCents: 0 },
      tradeStatsSummary: { total: 0, wins: 0, losses: 0, evens: 0, profitCents: 0, winCents: 0, lossCents: 0 },
      tradeHistorySeen: new Set(),
      tradeHistorySeenElements: new WeakSet(),
      tradeTimestamps: [],
      botStartAt: null,
      botBalanceSnapshot: null,
      lastPayoutPercent: null,
      lastPayoutAt: 0,
      lastPayoutSource: null,
      lastClosedTabRequestAt: 0,

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
      dynamicExpiryEnabled: false,
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
      regimeStrength: 0.6,
      confirmationStrength: 0.7,
      biasStrength: 0.6,
      biasTimeframes: { '1m': true, '3m': true, '5m': true, '30m': false },
      conflictStrength: 0.6,
      lossReports: [],
      maxTradesPerMinute: 0,
      maxOpenTrades: 1,
      idleSwitchEnabled: false,
      idleSwitchMinutes: 60,
      lastIdleSwitchAt: 0,

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

      /* ---------- Sniper mode ---------- */
      sniperBaseAmount: SNIPER_5S_DEFAULTS.baseAmountCents,
      sniperThreshold: SNIPER_5S_DEFAULTS.threshold,
      sniperThresholdOtc: SNIPER_5S_DEFAULTS.threshold,
      sniperThresholdReal: SNIPER_5S_DEFAULTS.threshold,
      sniperMinPayout: SNIPER_5S_DEFAULTS.minPayout,
      sniperEntryWindowSec: SNIPER_5S_DEFAULTS.entryWindowSec,
      sniperWarmupMin: SNIPER_5S_DEFAULTS.warmupMin,
      sniperVwapDeviation: SNIPER_5S_DEFAULTS.vwapDeviation,
      sniperVwapLookbackMin: SNIPER_5S_DEFAULTS.vwapLookbackMin,
      sniperMomentumThreshold: SNIPER_5S_DEFAULTS.momentumThreshold,
      sniperChopThreshold: SNIPER_5S_DEFAULTS.chopThreshold,
      sniperVwapEnabled: true,
      sniperMomentumEnabled: true,
      sniperVolumeEnabled: true,
      sniperChopEnabled: true,
      sniperRsiOversold: SNIPER_5S_DEFAULTS.rsiOversold,
      sniperRsiOverbought: SNIPER_5S_DEFAULTS.rsiOverbought,
      sniperRsiWindow: SNIPER_5S_DEFAULTS.rsiWindow,
      sniperEmaFast: SNIPER_5S_DEFAULTS.emaFast,
      sniperEmaSlow: SNIPER_5S_DEFAULTS.emaSlow,
      sniperStochOversold: SNIPER_5S_DEFAULTS.stochOversold,
      sniperStochOverbought: SNIPER_5S_DEFAULTS.stochOverbought,
      sniperStochWindow: SNIPER_5S_DEFAULTS.stochWindow,
      sniperVolumeThreshold: SNIPER_5S_DEFAULTS.volumeThreshold,
      sniperSharpeWindowMin: SNIPER_5S_DEFAULTS.sharpeWindowMin,
      sniperVwapWeight: SNIPER_5S_DEFAULTS.vwapWeight,
      sniperMomentumWeight: SNIPER_5S_DEFAULTS.momentumWeight,
      sniperVolumeWeight: SNIPER_5S_DEFAULTS.volumeWeight,
      sniperOverrideConfidencePct: SNIPER_5S_DEFAULTS.overrideConfidencePct,
      sniperMultiThresholdPct: SNIPER_5S_DEFAULTS.multiThresholdPct,
      sniperMultiCount: SNIPER_5S_DEFAULTS.multiCount,
      sniperMultiAmountPct: SNIPER_5S_DEFAULTS.multiAmountPct,
      sniperMultiEnabled: true,
      sniperEnabledTimeframes: { ...SNIPER_5S_DEFAULTS.timeframes },
      featureVolumeRejection: FEATURE_DEFAULTS.volumeRejection,
      featureVwapAnalysis: FEATURE_DEFAULTS.vwapAnalysis,
      featureSessionBoost: FEATURE_DEFAULTS.sessionBoost,
      featureTimeframes: { ...FEATURE_DEFAULTS.timeframes },
      autoSwitchStrategy: STRATEGY_DEFAULTS.autoSwitch,
      strategyWeightWr: STRATEGY_DEFAULTS.wrWeight,
      strategyWeightPnl: STRATEGY_DEFAULTS.pnlWeight,
      strategyLearningTrades: STRATEGY_DEFAULTS.learningTrades,
      strategyLossStreakLimit: STRATEGY_DEFAULTS.lossStreakLimit,
      strategyConfigs: { ...STRATEGY_DEFAULTS.configs },
      strategyTradeCount: 0,
      sniperLastTradeByTf: {},
      sniperWarmupUntil: 0,
      sniperLastDecision: null,
      currentStrategyKey: null,
      lastStrategyKey: null,
      sniperNextTradeByTf: {},
      sniperTfStatus: {},
      strategyStats: {},
      sniperSettingsCollapsed: false,
      sniperWeightsCollapsed: false,
      sniperMultiCollapsed: false,
      sniperSmartCollapsed: false,
      sniperEngineCollapsed: false,
      sniperRiskCollapsed: false,
      sniperSettingsTab: 'basic',
      debugTab: 'status',

      /* ---------- Signal deduplication ---------- */
      signalCooldownUntil: 0,
      recentSignalKeys: new Map(),

      // trade pacing
      nextTradeAllowedAt: 0,

      // analysis state
      analysisDirection: null,
      analysisConfidence: 0,
      tradeQualityScore: null,
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

    function applySniperDefaults() {
      const defaults = SNIPER_5S_DEFAULTS;
      if (!Number.isFinite(S.sniperBaseAmount)) {
        S.sniperBaseAmount = defaults.baseAmountCents;
      }
      S.sniperThreshold = defaults.threshold;
      if (!Number.isFinite(S.sniperThresholdOtc)) {
        S.sniperThresholdOtc = defaults.threshold;
      }
      if (!Number.isFinite(S.sniperThresholdReal)) {
        S.sniperThresholdReal = defaults.threshold;
      }
      S.sniperMinPayout = defaults.minPayout;
      S.sniperEntryWindowSec = defaults.entryWindowSec;
      S.sniperWarmupMin = defaults.warmupMin;
      S.sniperVwapDeviation = defaults.vwapDeviation;
      S.sniperVwapLookbackMin = defaults.vwapLookbackMin;
      S.sniperMomentumThreshold = defaults.momentumThreshold;
      S.sniperChopThreshold = defaults.chopThreshold;
      if (typeof S.sniperVwapEnabled !== 'boolean') S.sniperVwapEnabled = true;
      if (typeof S.sniperMomentumEnabled !== 'boolean') S.sniperMomentumEnabled = true;
      if (typeof S.sniperVolumeEnabled !== 'boolean') S.sniperVolumeEnabled = true;
      if (typeof S.sniperChopEnabled !== 'boolean') S.sniperChopEnabled = true;
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
      S.sniperVwapWeight = defaults.vwapWeight;
      S.sniperMomentumWeight = defaults.momentumWeight;
      S.sniperVolumeWeight = defaults.volumeWeight;
      S.sniperOverrideConfidencePct = defaults.overrideConfidencePct;
      S.sniperMultiThresholdPct = defaults.multiThresholdPct;
      S.sniperMultiCount = defaults.multiCount;
      S.sniperMultiAmountPct = defaults.multiAmountPct;
      S.sniperEnabledTimeframes = { ...defaults.timeframes };
      if (typeof S.featureVolumeRejection !== 'boolean') S.featureVolumeRejection = FEATURE_DEFAULTS.volumeRejection;
      if (typeof S.featureVwapAnalysis !== 'boolean') S.featureVwapAnalysis = FEATURE_DEFAULTS.vwapAnalysis;
      if (typeof S.featureSessionBoost !== 'boolean') S.featureSessionBoost = FEATURE_DEFAULTS.sessionBoost;
      if (!S.featureTimeframes) S.featureTimeframes = { ...FEATURE_DEFAULTS.timeframes };
      if (typeof S.autoSwitchStrategy !== 'boolean') S.autoSwitchStrategy = STRATEGY_DEFAULTS.autoSwitch;
      if (!Number.isFinite(S.strategyWeightWr)) S.strategyWeightWr = STRATEGY_DEFAULTS.wrWeight;
      if (!Number.isFinite(S.strategyWeightPnl)) S.strategyWeightPnl = STRATEGY_DEFAULTS.pnlWeight;
      if (!Number.isFinite(S.strategyLearningTrades)) S.strategyLearningTrades = STRATEGY_DEFAULTS.learningTrades;
      if (!Number.isFinite(S.strategyLossStreakLimit)) S.strategyLossStreakLimit = STRATEGY_DEFAULTS.lossStreakLimit;
      if (!S.strategyConfigs) S.strategyConfigs = { ...STRATEGY_DEFAULTS.configs };
    }

    const SETTINGS_I18N = {
      base_amount: 'Базова сума ($)',
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
      sniper_panel_title: 'Снайпер настройки',
      sniper_max_session_loss: 'Стоп при загуба (€):',
      sniper_max_loss_streak: 'Стоп при поредни загуби:',
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
      diagnostics: 'Диагн.: авто={auto} анализ=посока={dir} уверен={conf}% праг={thr}% стратегия={strategy} пропуск={skip}',
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
      trade_outcome_detail: 'Резултат: {asset} {direction} {expiry} → {outcome}',
      sniper_no_feed: 'Снайпер: няма цена',
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
      Confirm: 'Потвърждение',
      Regime: 'Режим',
      Bias: 'Bias',
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
      Quality: 'Ниско качество',
      MaxOpen: 'Макс. отворени сделки',
      MaxRate: 'Макс. сделки/минута'
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

    function getPrimarySniperIssue() {
      const entries = Object.entries(S.sniperTfStatus || {})
        .filter(([tf, status]) => status && status.state && status.state !== 'ready' && status.state !== 'off');
      if (!entries.length) return null;
      const hasReady = Object.values(S.sniperTfStatus || {}).some((status) => status?.state === 'ready');
      if (hasReady) return null;

      const weight = {
        weak: 9,
        confirm: 8,
        chop: 7,
        regime: 6,
        bias: 5,
        trend: 4,
        volume: 3,
        late: 2,
        payout: 1,
        nodata: 0,
        warmup: 0
      };

      const sorted = entries.sort((a, b) => {
        const aStatus = a[1];
        const bStatus = b[1];
        const aWeight = weight[aStatus.state] || 0;
        const bWeight = weight[bStatus.state] || 0;
        if (aWeight !== bWeight) return bWeight - aWeight;
        const aConf = typeof aStatus.confidence === 'number' ? aStatus.confidence : -1;
        const bConf = typeof bStatus.confidence === 'number' ? bStatus.confidence : -1;
        return bConf - aConf;
      });

      const status = sorted[0]?.[1];
      if (!status) return null;
      const getNoDataLabel = () => {
        if (!S.lastPriceAt) return 'Няма данни (няма цена)';
        const ageSec = Math.round((Date.now() - S.lastPriceAt) / 1000);
        if (ageSec > 5) return 'Няма данни (няма цена)';
        if (!S.priceHistory?.length || S.priceHistory.length < 2) return 'Няма данни (малко тикове)';
        return 'Няма данни';
      };
      const labelMap = {
        weak: 'Увереност',
        confirm: 'Потвърждение',
        chop: 'Chop',
        regime: 'Режим',
        bias: 'Bias',
        trend: 'Trend',
        volume: 'Volume',
        late: 'Късен вход',
        payout: 'Payout',
        nodata: getNoDataLabel(),
        warmup: 'Загряване'
      };
      const marketBad = ['chop', 'trend', 'volume', 'regime', 'bias', 'confirm'].includes(status.state);
      return {
        label: labelMap[status.state] || status.state,
        marketBad
      };
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
      const conf = typeof S.analysisConfidence === 'number' ? Math.round(S.analysisConfidence * 100) : '-';
      const thr = isSniperMode()
        ? (typeof S.sniperThreshold === 'number' ? Math.round(S.sniperThreshold * 100) : '-')
        : (typeof S.analysisConfidenceThreshold === 'number' ? Math.round(S.analysisConfidenceThreshold * 100) : '-');
      const issue = isSniperMode() ? getPrimarySniperIssue() : null;
      const strategyKey = isSniperMode() ? (S.currentStrategyKey || S.sniperLastDecision?.strategyKey) : S.lastStrategyKey;
      const strategyLabelRaw = strategyKey ? getStrategyDisplayLabel(strategyKey) : '—';
      const strategyLabel = `<span class="iaa-console-strategy">${strategyLabelRaw}</span>`;
      const skipReason = issue
        ? `<span class="iaa-console-issue">${issue.label}</span>${issue.marketBad ? ' (лош пазар)' : ''}`
        : (S.lastSkipReason ? `<span class="iaa-console-issue">${translateSkipReason(S.lastSkipReason)}</span>` : '-');
      logConsoleLine(formatStatus('diagnostics', { auto, analysis, dir, conf, thr, strategy: strategyLabel, skip: skipReason }));
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

    function initTradeStatsBucket() {
      return { total: 0, wins: 0, losses: 0, evens: 0, profitCents: 0, winCents: 0, lossCents: 0 };
    }

    function applyTradeStats(bucket, outcome, profitCents = 0) {
      if (!bucket) return;
      bucket.total += 1;
      if (outcome === 'WIN') {
        bucket.wins += 1;
      } else if (outcome === 'LOSS') {
        bucket.losses += 1;
      } else {
        bucket.evens += 1;
      }
      if (Number.isFinite(profitCents)) {
        bucket.profitCents += profitCents;
        if (profitCents > 0) bucket.winCents += profitCents;
        if (profitCents < 0) bucket.lossCents += Math.abs(profitCents);
      }
    }

    function initStrategyStatsBucket() {
      return { total: 0, wins: 0, losses: 0, evens: 0, profitCents: 0, winCents: 0, lossCents: 0, lossStreak: 0, lastOutcome: null };
    }

    function recordStrategyOutcome(strategyKey, outcome, profitCents = 0) {
      if (!strategyKey) return;
      if (!S.strategyStats[strategyKey]) {
        S.strategyStats[strategyKey] = initStrategyStatsBucket();
      }
      const bucket = S.strategyStats[strategyKey];
      applyTradeStats(bucket, outcome, profitCents);
      if (outcome === 'LOSS') {
        bucket.lossStreak = (bucket.lossStreak || 0) + 1;
      } else if (outcome === 'WIN' || outcome === 'EVEN') {
        bucket.lossStreak = 0;
      }
      bucket.lastOutcome = outcome;
    }

    function normalizeTradeExpiry(expiry) {
      const normalized = normalizeExpiry(expiry);
      if (expiry && String(expiry).toUpperCase().startsWith('DYN')) {
        return String(expiry).toUpperCase();
      }
      return normalized || (expiry ? String(expiry).toUpperCase() : '—');
    }

    function recordTradeOutcomeStats(trade, outcome, profitCents = 0) {
      recordTradeStats(outcome);
      if (trade?.strategyKey) {
        recordStrategyOutcome(trade.strategyKey, outcome, profitCents);
      }
      const expiryKey = normalizeTradeExpiry(trade?.expiry);
      if (!S.tradeStatsByExpiry[expiryKey]) {
        S.tradeStatsByExpiry[expiryKey] = initTradeStatsBucket();
      }
      applyTradeStats(S.tradeStatsByExpiry[expiryKey], outcome, profitCents);
      applyTradeStats(S.tradeStatsSummary, outcome, profitCents);
      if (trade?.batchCount && trade.batchCount > 1) {
        applyTradeStats(S.tradeStatsMulti, outcome, profitCents);
      }
      if (trade?.strategyKey) {
        S.strategyTradeCount = (S.strategyTradeCount || 0) + 1;
      }
    }

    function recordTradeHistoryEntry(trade, outcome, profitCents) {
      if (!trade) return;
      const entry = {
        time: new Date(trade.startTime).toISOString(),
        asset: trade.asset || '—',
        direction: trade.direction || '—',
        expiry: trade.expiry || '—',
        outcome: outcome || '—',
        amount: Number.isFinite(trade.totalAmountCents) ? (trade.totalAmountCents / 100).toFixed(2) : '',
        profit: Number.isFinite(profitCents) ? (profitCents / 100).toFixed(2) : '',
        strategy: trade.strategyKey || '',
        source: trade.source || ''
      };
      S.trades = S.trades || [];
      S.trades.push(entry);
    }

    function ensureClosedTradesTabActive() {
      const now = Date.now();
      if (now - (S.lastClosedTabRequestAt || 0) < 2000) return false;
      const candidates = Array.from(document.querySelectorAll('a,button,li'));
      const closedTab = candidates.find((el) => /closed|затвор/i.test(el.textContent || ''));
      if (closedTab && !closedTab.classList.contains('active') && closedTab.getAttribute('aria-selected') !== 'true') {
        closedTab.click();
        S.lastClosedTabRequestAt = now;
        return true;
      }
      return false;
    }


    function getHistoryRowCandidates() {
      ensureClosedTradesTabActive();
      const rows = [];
      const seen = new Set();
      for (const selector of C.HISTORY_ROW_SELECTORS) {
        const els = $$(selector);
        for (const el of els) {
          if (!el || seen.has(el)) continue;
          const text = T(el);
          if (!text) continue;
          seen.add(el);
          rows.push({ el, text });
        }
      }
      return rows;
    }

    function normalizeExpiryFromText(text) {
      const upper = String(text || '').toUpperCase();
      if (/\b3S\b/.test(upper) || /\b0:03\b/.test(upper) || /\b00:03\b/.test(upper)) return '3S';
      if (/\b15S\b/.test(upper) || /\b0:15\b/.test(upper) || /\b00:15\b/.test(upper)) return '15S';
      if (/\b30S\b/.test(upper) || /\b0:30\b/.test(upper) || /\b00:30\b/.test(upper)) return '30S';
      if (/\b1M\b/.test(upper) || /\b1:00\b/.test(upper) || /\b01:00\b/.test(upper)) return '1M';
      if (/\b3M\b/.test(upper) || /\b3:00\b/.test(upper) || /\b03:00\b/.test(upper)) return '3M';
      if (/\b5M\b/.test(upper) || /\b5:00\b/.test(upper) || /\b05:00\b/.test(upper)) return '5M';
      if (/\b30M\b/.test(upper) || /\b30:00\b/.test(upper)) return '30M';
      if (/\b1H\b/.test(upper) || /\b1:00:00\b/.test(upper)) return '1H';
      if (/\b4H\b/.test(upper) || /\b4:00:00\b/.test(upper)) return '4H';
      return null;
    }

    function normalizeOutcomeFromText(text) {
      const upper = String(text || '').toUpperCase();
      if (upper.includes('WIN') || upper.includes('PROFIT') || upper.includes('ПЕЧАЛ')) return 'WIN';
      if (upper.includes('LOSS') || upper.includes('LOSE') || upper.includes('ЗАГУБ')) return 'LOSS';
      if (upper.includes('REFUND')) return 'EVEN';
      if (upper.includes('EVEN') || upper.includes('DRAW') || upper.includes('НЕУТР')) return 'EVEN';
      return null;
    }

    function normalizeDirectionFromText(text) {
      const upper = String(text || '').toUpperCase();
      if (upper.includes('BUY') || upper.includes('CALL') || upper.includes('LONG') || upper.includes('UP') || upper.includes('▲') || upper.includes('🔼')) return 'BUY';
      if (upper.includes('SELL') || upper.includes('PUT') || upper.includes('SHORT') || upper.includes('DOWN') || upper.includes('▼') || upper.includes('🔽')) return 'SELL';
      return null;
    }

    function extractSignedMoneyFromText(text) {
      const raw = String(text || '');
      const match = raw.match(/([+-])\s*[$€]\s*\d+(?:[.,]\d{1,2})?/)
        || raw.match(/([+-])\s*\d+(?:[.,]\d{1,2})?\s*[$€]/);
      if (!match) return null;
      const sign = match[1] === '-' ? -1 : 1;
      const cents = parseMoneyToCents(match[0]);
      if (!Number.isFinite(cents)) return null;
      return { cents: Math.abs(cents) * sign, sign };
    }

    function extractProfitFromText(text) {
      const raw = String(text || '');
      const matches = Array.from(raw.matchAll(/[-+]?\d+(?:[.,]\d{1,2})?/g));
      if (!matches.length) return null;
      const last = matches[matches.length - 1][0];
      const cents = parseMoneyToCents(last);
      if (!Number.isFinite(cents)) return null;
      const sign = String(last).trim().startsWith('-') ? -1 : 1;
      return { cents: Math.abs(cents) * sign, sign };
    }

    function extractCurrencyAmountsFromText(text) {
      const raw = String(text || '');
      const matches = [
        ...raw.matchAll(/[$€]\s*\d+(?:[.,]\d{1,2})?/g),
        ...raw.matchAll(/\d+(?:[.,]\d{1,2})?\s*[$€]/g)
      ];
      if (!matches.length) return [];
      const amounts = [];
      for (const match of matches) {
        const cents = parseMoneyToCents(match[0]);
        if (Number.isFinite(cents)) {
          amounts.push(Math.abs(cents));
        }
      }
      return amounts;
    }

    function inferOutcomeFromElement(el) {
      if (!el) return null;
      const classText = String(el.className || '').toLowerCase();
      if (/(loss|lose|negative|down|red)/.test(classText)) return 'LOSS';
      if (/(win|profit|positive|up|green)/.test(classText)) return 'WIN';
      const children = el.querySelectorAll('[class]');
      for (const child of children) {
        const childClass = String(child.className || '').toLowerCase();
        if (/(loss|lose|negative|down|red)/.test(childClass)) return 'LOSS';
        if (/(win|profit|positive|up|green)/.test(childClass)) return 'WIN';
      }
      return null;
    }

    function extractAssetFromText(text) {
      const upper = String(text || '').toUpperCase();
      const match = upper.match(/([A-Z]{3})\s*\/?\s*([A-Z]{3})/);
      if (!match) return null;
      return `${match[1]}/${match[2]}`;
    }

    function extractTimeFromText(text) {
      const match = String(text || '').match(/\b(\d{1,2}):(\d{2})\b/);
      if (!match) return null;
      const hours = Number(match[1]);
      const minutes = Number(match[2]);
      if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
      return { hours, minutes };
    }

    function timeDistanceMinutes(a, b) {
      if (!a || !b) return null;
      const minutesA = a.hours * 60 + a.minutes;
      const minutesB = b.hours * 60 + b.minutes;
      let diff = Math.abs(minutesA - minutesB);
      if (diff > 720) diff = 1440 - diff;
      return diff;
    }

    function buildHistoryKey({ asset, expiry, direction, time, profit }) {
      const timeKey = time ? `${String(time.hours).padStart(2, '0')}:${String(time.minutes).padStart(2, '0')}` : 'na';
      const profitKey = Number.isFinite(profit) ? String(profit) : 'na';
      return [asset || 'na', expiry || 'na', direction || 'na', timeKey, profitKey].join('|');
    }

    function detectHistoryOutcome(trade) {
      const rows = getHistoryRowCandidates();
      const tradeAsset = normalizeAssetLabel(trade?.asset || '');
      const tradeExpiry = normalizeExpiry(trade?.expiry);
      const tradeDirection = normalizeSignalDirection(trade?.direction);
      const tradeTime = trade?.expectedEnd ? new Date(trade.expectedEnd) : null;
      const tradeTimeParts = tradeTime
        ? { hours: tradeTime.getHours(), minutes: tradeTime.getMinutes() }
        : null;
      const expirySeconds = trade?.expiryMs ? Math.round(trade.expiryMs / 1000) : secsFromTF(trade?.expiry || '');
      const timeToleranceMin = Math.max(180, Math.ceil((expirySeconds || 0) / 60) + 2);
      for (const row of rows) {
        const rowText = row.text;
        if (!rowText) continue;
        if (row.el && S.tradeHistorySeenElements.has(row.el)) continue;
        const rowAsset = extractAssetFromText(rowText);
        if (!rowAsset) continue;
        const rowAssetLabel = normalizeAssetLabel(rowAsset);
        if (tradeAsset && rowAssetLabel !== tradeAsset) continue;
        const rowExpiry = normalizeExpiryFromText(rowText);
        if (tradeExpiry && rowExpiry && rowExpiry !== tradeExpiry) continue;
        const rowDirection = normalizeDirectionFromText(rowText);
        if (tradeDirection && rowDirection && rowDirection !== tradeDirection) continue;
        const rowTime = extractTimeFromText(rowText);
        const timeDiff = timeDistanceMinutes(tradeTimeParts, rowTime);
        if (timeDiff != null && timeDiff > timeToleranceMin) continue;
        const signedMoney = extractSignedMoneyFromText(rowText) || extractProfitFromText(rowText);
        let profitCents = signedMoney ? signedMoney.cents : null;
        if (profitCents == null) {
          const currencyAmounts = extractCurrencyAmountsFromText(rowText);
          if (currencyAmounts.length) {
            profitCents = currencyAmounts[currencyAmounts.length - 1];
          }
        }
        const historyKey = buildHistoryKey({
          asset: rowAssetLabel,
          expiry: rowExpiry || tradeExpiry,
          direction: rowDirection,
          time: rowTime,
          profit: profitCents
        });
        if (S.tradeHistorySeen.has(historyKey)) continue;
        let outcome = normalizeOutcomeFromText(rowText);
        if (!outcome) {
          outcome = inferOutcomeFromElement(row.el);
        }
        if (!outcome && signedMoney && Number.isFinite(signedMoney.cents)) {
          if (signedMoney.cents > 0) outcome = 'WIN';
          if (signedMoney.cents < 0) outcome = 'LOSS';
          if (signedMoney.cents === 0) outcome = 'EVEN';
        }
        if (!outcome && Number.isFinite(profitCents)) {
          if (profitCents > 0) outcome = 'WIN';
          if (profitCents === 0) outcome = 'LOSS';
        }
        if (!outcome) continue;
        S.tradeHistorySeen.add(historyKey);
        if (row.el) S.tradeHistorySeenElements.add(row.el);
        return { outcome, profitCents };
      }
      return null;
    }

    function getExecutionConfidenceLabel(signal) {
      const raw = signal?.confidence;
      if (!Number.isFinite(raw)) return '';
      const pct = Math.round(clamp01(raw) * 100);
      return `увереност=${pct}%`;
    }

    function buildEntryContext(signal, resolvedExpiry) {
      const meta = signal?.entryMeta || {};
      const confidence = Number.isFinite(signal?.confidence) ? signal.confidence : S.analysisConfidence;
      return {
        asset: signal?.asset || '—',
        expiry: resolvedExpiry || signal?.expiry || S.expirySetting,
        direction: signal?.direction || '-',
        strategyKey: signal?.strategyKey || meta.strategyKey || null,
        confidencePct: Math.round(clamp01(confidence || 0) * 100),
        regime: meta.regime || null,
        biasDir: meta.biasDir ?? null,
        confirmation: meta.confirmation || null,
        timeInCandle: meta.timeInCandle ?? null,
        entryWindowSec: meta.entryWindowSec ?? null,
        rangePct: meta.rangePct ?? meta.candleRangePct ?? null,
        trendDir: meta.trendDir ?? null,
        trendAligned: meta.trendAligned ?? null,
        volumeOk: meta.volumeOk ?? null
      };
    }

    function buildLossReasonSummary(trade, outcome, profitCents) {
      const ctx = trade?.entryContext || {};
      const labels = [];
      if (ctx.timeInCandle != null && ctx.entryWindowSec != null && ctx.entryWindowSec > 0 && ctx.timeInCandle > ctx.entryWindowSec) {
        labels.push('Late entry');
      }
      if (ctx.rangePct != null && typeof S.sniperChopThreshold === 'number' && ctx.rangePct < S.sniperChopThreshold) {
        labels.push('Chop');
      }
      if (ctx.regime?.state && ['chop', 'volatility'].includes(ctx.regime.state)) {
        labels.push(`Regime:${ctx.regime.state}`);
      }
      if (ctx.biasDir && ctx.direction) {
        const biasDirection = ctx.biasDir > 0 ? 'BUY' : 'SELL';
        if (biasDirection !== ctx.direction) {
          labels.push('Bias conflict');
        }
      }
      if (ctx.confirmation && ctx.confirmation.total > 0 && ctx.confirmation.matched < 2) {
        labels.push('Low confirm');
      }
      const postCandle = trade?.expiryMs ? getCandleAt(trade.startTime + trade.expiryMs, trade.expiryMs) : null;
      if (postCandle && postCandle.open != null && postCandle.close != null) {
        const postDir = postCandle.close > postCandle.open ? 'BUY' : (postCandle.close < postCandle.open ? 'SELL' : null);
        if (postDir && trade?.direction && postDir !== trade.direction) {
          labels.push('Свещта срещу входа');
        }
      }
      if (!labels.length) labels.push('Неясна причина');
      const profitLabel = Number.isFinite(profitCents) ? formatOutcomeAmount(profitCents) : '—';
      return {
        summary: labels.join(', '),
        profitLabel
      };
    }

    function recordLossAnalysis(trade, outcome, profitCents) {
      if (!trade || outcome !== 'LOSS') return;
      const context = buildLossReasonSummary(trade, outcome, profitCents);
      const entry = {
        id: `${trade.asset}-${trade.startTime}`,
        time: new Date(trade.startTime).toLocaleTimeString(),
        asset: trade.asset,
        direction: trade.direction,
        expiry: trade.expiry,
        confidencePct: trade.entryContext?.confidencePct ?? null,
        summary: context.summary,
        profitLabel: context.profitLabel,
        details: trade.entryContext || {}
      };
      S.lossReports.unshift(entry);
      if (S.lossReports.length > 50) S.lossReports.length = 50;
      if (S.debugTab === 'loss') {
        renderLossAnalysis();
      }
    }

    function logTradeOutcome(trade, outcome, profitCents = null) {
      if (!trade || !outcome) return;
      const isWin = outcome === 'WIN';
      const isLoss = outcome === 'LOSS';
      const label = isWin ? '✅ ПЕЧЕЛИВША СДЕЛКА' : (isLoss ? '❌ ГУБЕЩА СДЕЛКА' : '⚪ НЕУТРАЛНА СДЕЛКА');
      const amount = isLoss
        ? formatOutcomeAmount(profitCents, { forcePositive: true })
        : formatOutcomeAmount(profitCents);
      logConsoleLine(`${label} (${amount}) [${trade.expiry || '—'}]`);
      recordLossAnalysis(trade, outcome, profitCents);
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
      renderStrategiesPanel();
    }

    function formatStrategyWinRate(stats) {
      if (!stats || !stats.total) return '0%';
      return `${Math.round((stats.wins / stats.total) * 100)}%`;
    }

    function formatStrategyPnl(stats) {
      const profit = stats?.profitCents ?? 0;
      const label = Number.isFinite(profit) ? formatOutcomeAmount(profit) : '—';
      if (profit > 0) return { label, className: 'iaa-strategy-positive' };
      if (profit < 0) return { label, className: 'iaa-strategy-negative' };
      return { label, className: 'iaa-strategy-neutral' };
    }

    function setAutoSwitchStrategy(enabled) {
      S.autoSwitchStrategy = !!enabled;
      const panelToggle = $id('iaa-strategy-auto-switch-panel');
      const settingsToggle = $id('iaa-strategy-auto-switch');
      if (panelToggle) panelToggle.checked = S.autoSwitchStrategy;
      if (settingsToggle) settingsToggle.checked = S.autoSwitchStrategy;
      persistSettings();
      renderStrategiesPanel();
    }

    function renderStrategiesPanel() {
      const autoSwitchPanel = $id('iaa-strategy-auto-switch-panel');
      if (autoSwitchPanel) autoSwitchPanel.checked = !!S.autoSwitchStrategy;
      const body = $id('iaa-strategy-table-body');
      if (!body) return;
      const keys = Array.from(new Set([
        ...Object.keys(STRATEGY_DEFAULTS.configs),
        ...Object.keys(S.strategyStats || {})
      ]));
      const rowsHtml = keys.map((key) => {
        const stats = S.strategyStats[key] || initStrategyStatsBucket();
        const pnl = formatStrategyPnl(stats);
        return `
          <tr>
            <td>${getStrategyDisplayLabel(key)}</td>
            <td>${stats.total}</td>
            <td>${stats.total}</td>
            <td class="${pnl.className}">${pnl.label}</td>
          </tr>`;
      });
      const totalStats = keys.reduce((acc, key) => {
        const stats = S.strategyStats[key] || initStrategyStatsBucket();
        acc.total += stats.total || 0;
        acc.profitCents += stats.profitCents || 0;
        return acc;
      }, { total: 0, profitCents: 0 });
      const totalPnlLabel = formatOutcomeAmount(totalStats.profitCents || 0);
      const totalClass = totalStats.profitCents > 0 ? 'iaa-strategy-positive' : totalStats.profitCents < 0 ? 'iaa-strategy-negative' : 'iaa-strategy-neutral';
      rowsHtml.push(`
        <tr>
          <td><strong>ОБЩО</strong></td>
          <td><strong>${totalStats.total}</strong></td>
          <td><strong>${totalStats.total}</strong></td>
          <td class="${totalClass}"><strong>${totalPnlLabel}</strong></td>
        </tr>
      `);
      body.innerHTML = rowsHtml.join('');

      const summaryWrap = $id('iaa-strategy-summary');
      if (summaryWrap) {
        const summary = S.tradeStatsSummary || initTradeStatsBucket();
        const total = summary.total || 0;
        const wins = summary.wins || 0;
        const losses = summary.losses || 0;
        const wrPct = total ? Math.round((wins / total) * 100) : 0;
        const pnlLabel = Number.isFinite(summary.profitCents) ? formatOutcomeAmount(summary.profitCents) : '—';
        summaryWrap.innerHTML = `
          <div class="iaa-summary-card"><div>Общо</div><div>${total}</div></div>
          <div class="iaa-summary-card"><div>Печалби</div><div>${wins}</div></div>
          <div class="iaa-summary-card"><div>Загуби</div><div>${losses}</div></div>
          <div class="iaa-summary-card"><div>WR</div><div>${wrPct}%</div></div>
          <div class="iaa-summary-card"><div>P&L</div><div>${pnlLabel}</div></div>
        `;
      }

      const historyBody = $id('iaa-strategy-history-body');
      if (historyBody) {
        const rows = (S.trades || []).slice(-15).reverse();
        if (!rows.length) {
          historyBody.innerHTML = `<tr><td colspan="4" class="iaa-strategy-neutral">Няма история.</td></tr>`;
        } else {
          historyBody.innerHTML = rows.map((entry) => {
            const timeLabel = entry.time ? new Date(entry.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—';
            const strategyLabel = entry.strategy ? getStrategyDisplayLabel(entry.strategy) : '—';
            const profitValue = Number.isFinite(Number(entry.profit)) ? Math.round(Number(entry.profit) * 100) : null;
            const pnlLabel = profitValue !== null ? formatOutcomeAmount(profitValue) : '—';
            const pnlClass = profitValue === null ? 'iaa-strategy-neutral' : (profitValue > 0 ? 'iaa-strategy-positive' : profitValue < 0 ? 'iaa-strategy-negative' : 'iaa-strategy-neutral');
            return `
              <tr>
                <td>${timeLabel}</td>
                <td>${strategyLabel}</td>
                <td>${entry.outcome || '—'}</td>
                <td class="${pnlClass}">${pnlLabel}</td>
              </tr>`;
          }).join('');
        }
      }

      const configWrap = $id('iaa-strategy-configs');
      if (!configWrap) return;
      const tooltipMap = {
        vwap_momentum: 'VWAP + Momentum стратегия. По-висок приоритет = по-строга селекция.',
        candlestick: 'Свещни модели. По-висок приоритет = по-строг филтър.',
        stoch_extreme: 'Stoch екстреми. По-висок приоритет = по-строга селекция.'
      };
      configWrap.innerHTML = keys.map((key) => {
        const config = getStrategyConfig(key);
        const priority = Number.isFinite(config.priority) ? config.priority : 0.6;
        const tip = tooltipMap[key] || '';
        return `
          <div class="iaa-field-row" title="${tip}">
            <span class="iaa-field-label">${config.label}</span>
            <label><input type="checkbox" data-strategy-enable="${key}" ${config.enabled ? 'checked' : ''}> Вкл/Изкл</label>
            <input class="iaa-strategy-input" type="text" inputmode="decimal" data-strategy-priority="${key}" value="${priority.toFixed(2)}">
          </div>`;
      }).join('');

      configWrap.querySelectorAll('[data-strategy-priority]').forEach((input) => {
        const val = parseNumberFlexible(input.value);
        applyStrictnessColor(input, val, { min: 0, max: 1, highIsStrict: true });
      });

      configWrap.querySelectorAll('[data-strategy-enable]').forEach((toggle) => {
        toggle.addEventListener('change', () => {
          const key = toggle.getAttribute('data-strategy-enable');
          if (!key) return;
          const current = getStrategyConfig(key);
          S.strategyConfigs = { ...S.strategyConfigs, [key]: { ...current, enabled: toggle.checked } };
          persistSettings();
          renderStrategiesPanel();
        });
      });
      configWrap.querySelectorAll('[data-strategy-priority]').forEach((input) => {
        input.addEventListener('input', () => {
          const key = input.getAttribute('data-strategy-priority');
          if (!key) return;
          const current = getStrategyConfig(key);
          const d = parseNumberFlexible(input.value);
          const next = clamp01(Number.isFinite(d) ? d : 0.6);
          S.strategyConfigs = { ...S.strategyConfigs, [key]: { ...current, priority: next } };
          applyStrictnessColor(input, next, { min: 0, max: 1, highIsStrict: true });
          persistSettings();
        });
      });
    }

    function buildTradesCsv() {
      if (!S.trades || !S.trades.length) return '';
      const headers = ['time', 'asset', 'direction', 'expiry', 'outcome', 'amount', 'profit', 'strategy', 'source'];
      const rows = S.trades.map((trade) => headers.map((key) => `"${(trade[key] ?? '')}"`).join(','));
      return [headers.join(','), ...rows].join('\n');
    }

    function downloadTradesCsv() {
      const csv = buildTradesCsv();
      if (!csv) return;
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `trades_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
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
        ? (typeof S.sniperThreshold === 'number' ? S.sniperThreshold : null)
        : (typeof S.analysisConfidenceThreshold === 'number' ? S.analysisConfidenceThreshold : null);
      const lowConfidence = threshold == null ? confidence <= 0 : confidence < threshold;
      const driftSeverity = driftValue == null ? '' : (Math.abs(driftValue) >= 2 ? 'bad' : (Math.abs(driftValue) >= 1 ? 'warn' : ''));
      const lagSeverity = lagValue == null ? '' : (lagValue >= 5 ? 'bad' : (lagValue >= 2 ? 'warn' : ''));
      const feedOk = S.currentAssetPrice != null;
      const feedSeverity = feedOk ? '' : 'bad';
      const analysisUpdatedSeverity = analysisUpdatedSec != null && analysisUpdatedSec > 15 ? 'warn' : '';
      const lastSkipSeverity = S.lastSkipReason ? 'warn' : '';
      const confidenceSeverity = lowConfidence ? 'warn' : '';
      const payoutPercent = Number.isFinite(S.lastPayoutPercent) ? `${S.lastPayoutPercent.toFixed(2)}%` : '—';
      const payoutAgeSec = S.lastPayoutAt ? Math.round((Date.now() - S.lastPayoutAt) / 1000) : null;
      const payoutLabel = payoutAgeSec != null ? `${payoutPercent} (${payoutAgeSec}s)` : payoutPercent;
      const payoutSeverity = S.lastPayoutPercent == null ? 'warn' : '';
      const tickWindowMs = 60000;
      const ticksRecent = (S.priceHistory || []).filter(p => p.timestamp >= Date.now() - tickWindowMs).length;
      const tickRate = ticksRecent ? `${ticksRecent}/мин` : '0/мин';
      const lastTickAgeSec = S.lastPriceAt ? Math.round((Date.now() - S.lastPriceAt) / 1000) : null;
      const lastTickLabel = lastTickAgeSec != null ? `${lastTickAgeSec}s` : '—';
      const tickSeverity = lastTickAgeSec != null && lastTickAgeSec > 10 ? 'warn' : '';

      const lines = [
        { key: 'авто', value: S.autoTrade ? 'Да' : 'Не', severity: '' },
        { key: 'анализ', value: S.analysisEnabled ? 'Да' : 'Не', severity: '' },
        { key: 'посока', value: S.analysisDirection || '-', severity: '' },
        { key: 'увереност', value: confidence.toFixed(2), severity: confidenceSeverity },
        { key: 'праг', value: threshold != null ? threshold.toFixed(2) : '-', severity: '' },
        { key: 'payout', value: payoutLabel, severity: payoutSeverity },
        { key: 'лаг', value: lagLabel, severity: lagSeverity },
        { key: 'цена', value: feedOk ? 'OK' : '—', severity: feedSeverity },
        { key: 'история', value: String(S.priceHistory?.length || 0), severity: '' },
        { key: 'тик/мин', value: tickRate, severity: '' },
        { key: 'тик възраст', value: lastTickLabel, severity: tickSeverity },
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
      updateDebugStateSnapshot();
    }

    function applyPercentColor(input, value) {
      if (!input || !Number.isFinite(value)) return;
      const ratio = Math.max(0, Math.min(1, value / 100));
      let color = '#fbbf24';
      if (ratio <= 0.4) color = '#22c55e';
      else if (ratio >= 0.7) color = '#f87171';
      input.style.color = color;
    }

    function applyStrictnessColor(input, value, options = {}) {
      if (!input || !Number.isFinite(value)) return;
      const min = Number.isFinite(options.min) ? options.min : 0;
      const max = Number.isFinite(options.max) ? options.max : 1;
      const range = max - min || 1;
      let ratio = (value - min) / range;
      ratio = Math.max(0, Math.min(1, ratio));
      if (options.highIsStrict === false) {
        ratio = 1 - ratio;
      }
      let color = '#fbbf24';
      if (ratio <= 0.4) color = '#22c55e';
      else if (ratio >= 0.7) color = '#f87171';
      input.style.color = color;
    }

    function setDebugTab(tab) {
      S.debugTab = tab;
      const statusTab = $id('iaa-debug-tab-status');
      const lossTab = $id('iaa-debug-tab-loss');
      const statusContent = $id('iaa-debug-content');
      const lossContent = $id('iaa-loss-content');
      if (statusTab) statusTab.classList.toggle('active', tab === 'status');
      if (lossTab) lossTab.classList.toggle('active', tab === 'loss');
      if (statusContent) statusContent.style.display = tab === 'status' ? 'block' : 'none';
      if (lossContent) lossContent.style.display = tab === 'loss' ? 'block' : 'none';
      if (tab === 'status') {
        renderDebugInfo();
      } else if (tab === 'loss') {
        renderLossAnalysis();
      }
    }

    function formatLossAnalysisText() {
      return (S.lossReports || [])
        .map((loss, idx) => {
          const lines = [
            `# ${idx + 1}`,
            `Час: ${loss.time}`,
            `Актив: ${loss.asset}`,
            `Посока: ${loss.direction}`,
            `Expiry: ${loss.expiry}`,
            `Увереност: ${loss.confidencePct ?? '—'}%`,
            `Причина: ${loss.summary}`,
            `Резултат: ${loss.profitLabel}`
          ];
          if (loss.details?.confirmation?.details?.length) {
            lines.push(`Confirm: ${loss.details.confirmation.details.join(', ')}`);
          }
          if (loss.details?.regime?.state) {
            lines.push(`Regime: ${loss.details.regime.state}`);
          }
          return lines.join('\n');
        })
        .join('\n\n');
    }

    function renderLossAnalysis() {
      const content = $id('iaa-loss-content');
      if (!content) return;
      const losses = S.lossReports || [];
      if (!losses.length) {
        content.innerHTML = '<div style="color:#9ca3af;">Няма загуби за анализ.</div>';
        return;
      }
      content.innerHTML = losses.map((loss) => {
        const confidence = loss.confidencePct != null ? `${loss.confidencePct}%` : '—';
        const summary = loss.summary || '—';
        const badgeClass = summary.includes('Late') ? 'warn' : summary.includes('Bias') ? 'bad' : summary.includes('Regime') ? 'bad' : 'warn';
        return `
          <div class="iaa-loss-card">
            <div class="iaa-loss-header">
              <div>${loss.asset} ${loss.direction} <span class="iaa-loss-expiry">${loss.expiry}</span></div>
              <div class="iaa-loss-time">${loss.time}</div>
            </div>
            <div class="iaa-loss-row">
              <span class="iaa-loss-label">Увереност</span>
              <span class="iaa-loss-value">${confidence}</span>
            </div>
            <div class="iaa-loss-row">
              <span class="iaa-loss-label">Причина</span>
              <span class="iaa-loss-value iaa-loss-pill iaa-loss-pill--${badgeClass}">${summary}</span>
            </div>
            <div class="iaa-loss-row">
              <span class="iaa-loss-label">Резултат</span>
              <span class="iaa-loss-value">${loss.profitLabel}</span>
            </div>
          </div>
        `;
      }).join('');
    }

    function updateDebugStateSnapshot() {
      const el = $id('iaa-debug-state');
      if (!el) return;
      const state = {
        running: S.running,
        autoTrade: S.autoTrade,
        mode: S.mode,
        lastPriceAt: S.lastPriceAt,
        lastPriceAgeMs: S.lastPriceAt ? Date.now() - S.lastPriceAt : null,
        currentAssetPrice: S.currentAssetPrice,
        priceHistoryLen: S.priceHistory?.length || 0,
        lastPayoutPercent: S.lastPayoutPercent,
        lastPayoutAt: S.lastPayoutAt,
        lastPayoutSource: S.lastPayoutSource,
        analysisDirection: S.analysisDirection,
        analysisConfidence: S.analysisConfidence,
        sniperThreshold: S.sniperThreshold,
        sniperVwapWeight: S.sniperVwapWeight,
        sniperMomentumWeight: S.sniperMomentumWeight,
        sniperVolumeWeight: S.sniperVolumeWeight,
        sniperVwapDeviation: S.sniperVwapDeviation,
        sniperMomentumThreshold: S.sniperMomentumThreshold,
        sniperChopThreshold: S.sniperChopThreshold,
        sniperOverrideConfidencePct: S.sniperOverrideConfidencePct,
        sniperEntryWindowSec: S.sniperEntryWindowSec,
        sniperTfStatus: S.sniperTfStatus
      };
      el.dataset.state = JSON.stringify(state);
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
      const tfs = ['3s', '15s', '30s', '1m', '3m', '5m', '15m', '30m'];
      tfs.forEach(tf => {
        const textEl = $id(`iaa-tf-${tf}`);
        const dotEl = $id(`iaa-tf-dot-${tf}`);
        const cell = document.querySelector(`.iaa-tf-cell[data-tf="${tf}"]`);
        if (!textEl || !dotEl || !cell) return;
        dotEl.className = 'iaa-tf-dot';

        const isOtcAsset = /OTC/i.test(getCurrentAssetLabel() || '');
        const enabled = !isSniperMode() || (S.sniperEnabledTimeframes?.[tf] && (tf !== '3s' || isOtcAsset));
        cell.style.display = enabled ? '' : 'none';
        if (!enabled) {
          return;
        }

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
        } else if (['weak', 'late', 'chop', 'payout', 'warmup', 'nodata', 'trend', 'volume'].includes(status.state)) {
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
    const hasOppositeActiveTrade = (signal, windowMs = 1500) => {
      const targetDir = normalizeSignalDirection(signal?.direction);
      const targetExpiry = normalizeExpiry(signal?.expiry) || signal?.expiry;
      if (!targetDir || !targetExpiry) return false;
      const now = Date.now();
      return (S.activeTrades || []).some((trade) => {
        if (!trade?.startTime || now - trade.startTime > windowMs) return false;
        if (trade.asset !== signal.asset) return false;
        const tradeDir = normalizeSignalDirection(trade.direction);
        const tradeExpiry = normalizeExpiry(trade.expiry) || trade.expiry;
        return tradeDir && tradeDir !== targetDir && tradeExpiry === targetExpiry;
      });
    };

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
      if(/^(3S|S3)$/.test(e)) return '3S';
      if(/^(5S|S5)$/.test(e)) return '5S';
      if(/^(15S|S15)$/.test(e)) return '15S';
      if(/^(30S|S30)$/.test(e)) return '30S';
      if(/^(M1|1M|60S)$/.test(e)) return '1M';
      if(/^(M3|3M|180S)$/.test(e)) return '3M';
      if(/^(M5|5M|300S)$/.test(e)) return '5M';
      if(/^(M30|30M|1800S)$/.test(e)) return '30M';
      if(/^(H1|1H|60M|3600S)$/.test(e)) return '1H';
      if(/^(H4|4H|240M|14400S)$/.test(e)) return '4H';
      return '1M';
    }

    function getSignalLateToleranceMs(expiry) {
      const norm = normalizeExpiry(expiry);
      if (norm === '4H') return 60 * 60 * 1000;
      if (norm === '1H') return 20 * 60 * 1000;
      if (norm === '30M') return 10 * 60 * 1000;
      if (norm === '5M') return 120000;
      if (norm === '3M') return 90000;
      if (norm === '3S') return 2000;
      if (norm === '5S') return 3000;
      if (norm === '30S') return 15000;
      if (norm === '15S') return 8000;
      return 60000;
    }

    function getSignalMaxFutureMs(expiry) {
      const norm = normalizeExpiry(expiry);
      if (norm === '4H') return 24 * 60 * 60 * 1000;
      if (norm === '1H') return 12 * 60 * 60 * 1000;
      if (norm === '30M') return 6 * 60 * 60 * 1000;
      if (norm === '5M') return 60 * 60 * 1000;
      if (norm === '3M') return 45 * 60 * 1000;
      if (norm === '3S') return 2 * 60 * 1000;
      if (norm === '5S') return 2 * 60 * 1000;
      if (norm === '30S') return 5 * 60 * 1000;
      if (norm === '15S') return 3 * 60 * 1000;
      return 15 * 60 * 1000;
    }

    function secsFromTF(tf){
      const norm = normalizeExpiry(tf);
      if (norm === '4H') return 14400;
      if (norm === '1H') return 3600;
      if (norm === '30M') return 1800;
      if (norm === '5M') return 300;
      if (norm === '3M') return 180;
      if (norm === '3S') return 3;
      if (norm === '5S') return 5;
      if (norm === '30S') return 30;
      if (norm === '15S') return 15;
      return 60;
    }

    function getActiveTradeIntervalMin() {
      return Math.max(1, S.tradeIntervalMin || 1);
    }

    function canOpenAnotherTrade() {
      const limit = Number.isFinite(S.maxOpenTrades) ? Math.max(1, Math.round(S.maxOpenTrades)) : 1;
      return (S.activeTrades?.length || 0) < limit;
    }

    function canExecuteTradeByRate() {
      const limit = Number.isFinite(S.maxTradesPerMinute) ? Math.max(0, Math.round(S.maxTradesPerMinute)) : 0;
      if (!limit) return true;
      const now = Date.now();
      S.tradeTimestamps = (S.tradeTimestamps || []).filter(ts => now - ts < 60000);
      return S.tradeTimestamps.length < limit;
    }

    async function maybeSwitchIdleAsset() {
      if (!S.idleSwitchEnabled || S.assetSelecting || hasActiveTrade()) return;
      const idleMinutes = Number.isFinite(S.idleSwitchMinutes) ? Math.max(1, S.idleSwitchMinutes) : 60;
      const lastTradeAt = S.lastTradeTime || S.botStartAt || Date.now();
      const idleMs = idleMinutes * 60 * 1000;
      const now = Date.now();
      if (now - lastTradeAt < idleMs) return;
      if (S.lastIdleSwitchAt && now - S.lastIdleSwitchAt < idleMs) return;
      if (!C.IDLE_ASSET_POOL?.length) return;
      const asset = C.IDLE_ASSET_POOL[Math.floor(Math.random() * C.IDLE_ASSET_POOL.length)];
      if (!asset) return;
      S.lastIdleSwitchAt = now;
      const prevForce = S.forceAssetSelect;
      S.forceAssetSelect = true;
      const idleSignal = {
        asset: asset.asset,
        assetSearch: asset.assetSearch,
        isOTC: asset.isOTC
      };
      await selectAssetWithVerification(idleSignal);
      S.forceAssetSelect = prevForce;
      logConsoleLine(`Авто смяна на актив (застой ${idleMinutes} мин): ${asset.asset}`);
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
      if (norm === '1H') {
        return (60 - minutes) * 60 - seconds;
      }
      if (norm === '4H') {
        const hour = now.getUTCHours();
        const blockHour = hour - (hour % 4);
        const secondsInto = (hour - blockHour) * 3600 + minutes * 60 + seconds;
        return 4 * 3600 - secondsInto;
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

    function calculatePayoutProfitCents(trade, outcome, fallbackCents = null) {
      if (!trade || !outcome) return fallbackCents;
      if (outcome === 'EVEN') return 0;
      const totalAmount = Number.isFinite(trade.totalAmountCents) ? trade.totalAmountCents : trade.amountCents;
      if (!Number.isFinite(totalAmount)) return fallbackCents;
      if (outcome === 'LOSS') return -totalAmount;
      const payoutPercent = Number.isFinite(trade.payoutPercent) ? trade.payoutPercent : null;
      if (payoutPercent == null) return fallbackCents;
      return Math.round(totalAmount * (payoutPercent / 100));
    }

    function formatOutcomeAmount(cents, { forcePositive = false } = {}) {
      if (!Number.isFinite(cents)) return '—';
      const value = forcePositive ? Math.abs(cents) : cents;
      const text = fmtMoney(value);
      return forcePositive ? text.replace('-', '') : text;
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
          if (payout !== null && payout >= 10 && payout <= 100) {
            S.lastPayoutPercent = payout;
            S.lastPayoutAt = Date.now();
            S.lastPayoutSource = selector;
            return payout;
          }
        }
      }

      const fallbackElements = $$('span,div');
      for (const el of fallbackElements) {
        if (!visible(el) || isBotUiElement(el) || !isLikelyPayoutElement(el)) continue;
        const payout = parsePercentValue(T(el));
        if (payout !== null && payout >= 10 && payout <= 100) {
          S.lastPayoutPercent = payout;
          S.lastPayoutAt = Date.now();
          S.lastPayoutSource = 'fallback';
          return payout;
        }
      }

      return Number.isFinite(S.lastPayoutPercent) ? S.lastPayoutPercent : null;
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
          updateBalanceSummary();
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

    function updateBalanceSummary(){
      const startEl = $id('iaa-balance-start');
      const currentEl = $id('iaa-balance-current');
      const diffEl = $id('iaa-balance-diff');
      if (!startEl && !currentEl && !diffEl) return;

      const startBalance = Number.isFinite(S.botStartBalance) ? S.botStartBalance : null;
      const currentBalance = Number.isFinite(S.balance) ? S.balance : null;
      const startText = startBalance != null ? fmtMoney(startBalance) : '—';
      const currentText = currentBalance != null ? fmtMoney(currentBalance) : '—';
      const diffCents = (startBalance != null && currentBalance != null)
        ? currentBalance - startBalance
        : null;
      const diffText = diffCents != null ? fmtMoney(diffCents) : '—';

      if (startEl) startEl.textContent = startText;
      if (currentEl) currentEl.textContent = currentText;
      if (diffEl) {
        diffEl.textContent = diffText;
        diffEl.classList.toggle('iaa-balance-positive', diffCents != null && diffCents > 0);
        diffEl.classList.toggle('iaa-balance-negative', diffCents != null && diffCents < 0);
      }
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
            setStatusOverlay(formatStatus('trade_won'), '', false);
          } else if (data.outcome === 'LOSS') {
            setStatusOverlay(formatStatus('trade_lost'), '', false);
          } else {
            setStatusOverlay(formatStatus('trade_even'), '', false);
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
      if (!canOpenAnotherTrade()) {
        setSkipReason('MaxOpen');
        return false;
      }
      if (!canExecuteTradeByRate()) {
        setSkipReason('MaxRate');
        return false;
      }

      const execKey = signalExecKey(signal);
      if (!isSniperMode() && S.lastExecutedKey === execKey && Date.now() < S.tradeLockUntil) return false;
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
      if (!isSniperMode() && S.tradeLockUntil > Date.now()) return false;
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
      if (isSniperMode() && hasOppositeActiveTrade(signal)) {
        setSkipReason('Conflict');
        return false;
      }
      S.executing = true;
      S.executionAttempts = 1;
      S.executionStartTime = Date.now();

      let resolvedExpiry = normalizeExpiry(signal.expiry) || S.expirySetting;
      const assetScope = getExpiryScopeFromAsset(signal.asset);
      const useDynamicExpiry = S.dynamicExpiryEnabled;
      if (useDynamicExpiry && assetScope === 'REAL') {
        const plan = getDynamicExpiryPlan(resolvedExpiry, S.analysisConfidence, assetScope);
        if (plan.expiries.length) {
          resolvedExpiry = plan.expiries[0];
        }
      }
      const entryContext = buildEntryContext(signal, resolvedExpiry);
      const confidenceLabel = getExecutionConfidenceLabel(signal);
      if (signal?.strategyKey) {
        S.lastStrategyKey = signal.strategyKey;
      }

      try {
        if (!useDynamicExpiry || assetScope === 'REAL') {
          const expiryOk = await ensurePlatformExpiry(resolvedExpiry);
          if (!expiryOk) {
            setSkipReason('Expiry');
            return false;
          }
        }
        const balanceEligible = S.activeTrades.length === 0;
        // CAPTURE BALANCE BEFORE TRADE EXECUTION (only if no overlapping trades)
        const balanceBeforeTrade = balanceEligible ? await readBalanceWithRetry() : null;
        if (balanceEligible) {
          S.balanceBeforeTrade = balanceBeforeTrade;
        }

        // Capture entry price BEFORE execution
        const entryPrice = getCurrentAssetPrice();
        if (entryPrice) {
          S.tradeEntryPrice = entryPrice;
        }

        let { up, dn } = getBuySellButtons();
        if (!up && !dn) {
          setSkipReason('Buttons');
          logConsoleLine(formatStatus('trade_buttons_missing'));
          return false;
        }

        const input = findAmountInput();
        const useCurrentAmount = !!signal?.useCurrentAmount && !Number.isFinite(signal?.overrideAmountCents);
        const parsedInputAmount = input ? parseNumberFlexible(input.value) : null;
        let amountCents = Number.isFinite(signal?.overrideAmountCents)
          ? Math.max(1, Math.round(signal.overrideAmountCents))
          : calculateTradeAmount(S.baseAmount, S.martingaleSequence);
        if (useCurrentAmount && Number.isFinite(parsedInputAmount)) {
          amountCents = Math.max(1, Math.round(parsedInputAmount * 100));
        }
        if (S.maxTradeAmountCents > 0 && amountCents > S.maxTradeAmountCents) {
          setSkipReason('MaxAmount');
          return false;
        }
        if (S.maxTradeAmountMultiplier > 0 && amountCents > Math.round(S.baseAmount * S.maxTradeAmountMultiplier)) {
          setSkipReason('MaxAmount');
          return false;
        }

        if (input && !useCurrentAmount) {
          simulateTyping(input, (amountCents / 100).toFixed(2));
        } else {
          if (!input) {
            logConsoleLine(formatStatus('trade_amount_missing'));
          } else {
            logConsoleLine(`Сума: използва се текущата стойност ($${(amountCents / 100).toFixed(2)})`);
          }
        }

        const dir = signal.direction.toLowerCase();
        const shouldBurst = S.burstEnabled && S.analysisSteadyTrend && S.analysisConfidence >= S.burstConfidenceThreshold;
        const baseBurst = shouldBurst ? Math.max(1, Math.min(S.burstTradeCount, 5)) : 1;
        const burstCount = Math.max(1, Number.isFinite(signal?.burstCount) ? signal.burstCount : baseBurst);
        const payoutPercent = getCurrentPayoutPercent();

        if (useDynamicExpiry && assetScope === 'OTC') {
          const plan = getDynamicExpiryPlan(signal.expiry || resolvedExpiry, S.analysisConfidence, assetScope);
          if (assetScope === 'OTC') {
            const opened = await iaaOpenExpiryMenu(assetScope);
            if (!opened) {
              setSkipReason('Expiry');
              return false;
            }
            if (!plan.seconds.length) return false;

            for (const seconds of plan.seconds) {
              const startSet = Date.now();
              let applied = await setDynamicExpiryTime(seconds);
              if (!applied) {
                setSkipReason('Expiry');
                return false;
              }
              let actualSeconds = readDynamicExpirySeconds();
              if (actualSeconds != null && Math.abs(actualSeconds - seconds) > 1) {
                const elapsedSec = Math.max(0, Math.round((Date.now() - startSet) / 1000));
                const adjusted = Math.max(3, seconds - elapsedSec);
                if (adjusted !== seconds) {
                  applied = await setDynamicExpiryTime(adjusted);
                  if (applied) {
                    actualSeconds = readDynamicExpirySeconds() ?? actualSeconds;
                  }
                  if (actualSeconds != null && Math.abs(actualSeconds - adjusted) > 1) {
                    logConsoleLine(`DYN корекция: желано ${seconds}s → реално ${actualSeconds}s`);
                  }
                }
              }
              const finalSeconds = Number.isFinite(actualSeconds) ? actualSeconds : seconds;
              logConsoleLine(formatStatus('trade_attempt', {
                asset: signal.asset,
                direction: signal.direction.toUpperCase(),
                expiry: `DYN ${finalSeconds}s`
              }));
              const clickTarget = (dir === 'buy' || dir === 'call' || dir === 'up') ? up : dn;
              if (!clickTarget) return false;
              simulateClick(clickTarget);

              const expiryMs = finalSeconds * 1000;
              const start = Date.now();
              const trade = {
                amountCents,
                batchCount: 1,
                totalAmountCents: amountCents,
                direction: dir.toUpperCase(),
                asset: signal.asset,
                startTime: start,
                expiryMs,
                expiry: `DYN${finalSeconds}S`,
                entryContext,
                expectedEnd: start + expiryMs + C.SETTLEMENT_DELAY_MS,
                cycleStep: S.cycleStep,
                entryPrice: entryPrice,
                balanceBefore: balanceBeforeTrade,
                balanceEligible,
              source: isSniperMode() ? 'sniper' : 'signal',
              strategyKey: signal.strategyKey || null,
              outcomeChecked: false,
                balanceCheckAttempts: 0,
                nextBalanceCheckAt: 0,
                historyCheckAttempts: 0,
                nextHistoryCheckAt: 0,
                payoutPercent
              };
              S.activeTrades.push(trade);
              {
                const clickMessage = formatStatus('trade_clicked', { direction: dir.toUpperCase(), amount: `$${(amountCents / 100).toFixed(2)}` });
                logConsoleLine(confidenceLabel ? `${clickMessage} | ${confidenceLabel}` : clickMessage);
              }
              await delay(140);
            }
          } else {
            if (!plan.expiries.length) return false;
            for (const expiry of plan.expiries) {
              const expiryOk = await ensurePlatformExpiry(expiry);
              if (!expiryOk) {
                setSkipReason('Expiry');
                return false;
              }
              logConsoleLine(formatStatus('trade_attempt', {
                asset: signal.asset,
                direction: signal.direction.toUpperCase(),
                expiry
              }));
              const clickTarget = (dir === 'buy' || dir === 'call' || dir === 'up') ? up : dn;
              if (!clickTarget) return false;
              simulateClick(clickTarget);

              const expiryMs = secsFromTF(expiry) * 1000;
              const start = Date.now();
              const trade = {
                amountCents,
                batchCount: 1,
                totalAmountCents: amountCents,
                direction: dir.toUpperCase(),
                asset: signal.asset,
                startTime: start,
                expiryMs,
                expiry,
                entryContext,
                expectedEnd: start + expiryMs + C.SETTLEMENT_DELAY_MS,
                cycleStep: S.cycleStep,
                entryPrice: entryPrice,
                balanceBefore: balanceBeforeTrade,
                balanceEligible,
                source: isSniperMode() ? 'sniper' : 'signal',
                strategyKey: signal.strategyKey || null,
                outcomeChecked: false,
                balanceCheckAttempts: 0,
                nextBalanceCheckAt: 0,
                historyCheckAttempts: 0,
                nextHistoryCheckAt: 0,
                payoutPercent
              };
              S.activeTrades.push(trade);
              {
                const clickMessage = formatStatus('trade_clicked', { direction: dir.toUpperCase(), amount: `$${(amountCents / 100).toFixed(2)}` });
                logConsoleLine(confidenceLabel ? `${clickMessage} | ${confidenceLabel}` : clickMessage);
              }
              await delay(140);
            }
          }
        } else {
          logConsoleLine(formatStatus('trade_attempt', { asset: signal.asset, direction: signal.direction.toUpperCase(), expiry: resolvedExpiry }));
          let clicked = false;
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
            expiryMs,
            expiry: resolvedExpiry,
            entryContext,
            expectedEnd: start + expiryMs + C.SETTLEMENT_DELAY_MS,
            cycleStep: S.cycleStep,
            entryPrice: entryPrice,
            balanceBefore: balanceBeforeTrade, // Store balance before trade
            balanceEligible,
            source: isSniperMode() ? 'sniper' : 'signal',
            strategyKey: signal.strategyKey || null,
            outcomeChecked: false,
            balanceCheckAttempts: 0,
            nextBalanceCheckAt: 0,
            historyCheckAttempts: 0,
            nextHistoryCheckAt: 0,
            payoutPercent
          };
          S.activeTrades.push(trade);
          {
            const clickMessage = formatStatus('trade_clicked', { direction: dir.toUpperCase(), amount: `$${(amountCents / 100).toFixed(2)}` });
            logConsoleLine(confidenceLabel ? `${clickMessage} | ${confidenceLabel}` : clickMessage);
          }
        }

        if (!isSniperMode()) {
          S.tradeLockUntil = Date.now() + 1000;
        }
        if (!isSniperMode()) {
          const intervalMin = getActiveTradeIntervalMin();
          S.nextTradeAllowedAt = Date.now() + intervalMin * 60 * 1000;
        }
        S.lastTradeTime = Date.now();
        S.tradeCount++;
        S.tradeTimestamps = S.tradeTimestamps || [];
        S.tradeTimestamps.push(Date.now());
        S.lastExecutedKey = execKey;
        S.finalizedTradeId = null;

        // Update UI to show trade executed
        setUIState('EXECUTING', { cycleStep: S.cycleStep });

        return true;
      } catch (error) {
        return false;
      } finally {
        S.executing = false;
      }
    }

    /* ========================= FIXED: HISTORY-ONLY OUTCOME DETECTION ========================= */
    async function finalizeActiveTrades() {
      if (!S.activeTrades || !S.activeTrades.length) return;
      const now = Date.now();
      const remaining = [];
      const maxHistoryWaitMs = 60000;

      for (const trade of S.activeTrades) {
        const expiryMs = trade.expiryMs || secsFromTF(trade.expiry) * 1000;
        const expectedEnd = trade.expectedEnd || (trade.startTime + expiryMs + C.SETTLEMENT_DELAY_MS);
        trade.expectedEnd = expectedEnd;
        if (now < expectedEnd || trade.outcomeChecked) {
          remaining.push(trade);
          continue;
        }
        if (trade.nextHistoryCheckAt && now < trade.nextHistoryCheckAt) {
          remaining.push(trade);
          continue;
        }

        const historyResult = detectHistoryOutcome(trade);
        if (historyResult) {
          trade.outcomeChecked = true;
          const profitCents = Number.isFinite(historyResult.profitCents)
            ? historyResult.profitCents
            : (historyResult.outcome === 'LOSS' ? -trade.totalAmountCents : trade.totalAmountCents);
          const payoutProfitCents = calculatePayoutProfitCents(trade, historyResult.outcome, profitCents);
          S.lastTradeOutcome = historyResult.outcome;
          S.tradeProfitLoss += profitCents;
          recordTradeOutcomeForRisk(historyResult.outcome, profitCents);
          recordTradeOutcomeStats(trade, historyResult.outcome, payoutProfitCents);
          recordTradeHistoryEntry(trade, historyResult.outcome, payoutProfitCents);
          logTradeOutcome(trade, historyResult.outcome, payoutProfitCents);
          setUIState('RESULTS', { outcome: historyResult.outcome });
          applyRiskLimits();
          continue;
        }

        if (now < expectedEnd + maxHistoryWaitMs) {
          trade.historyCheckAttempts = (trade.historyCheckAttempts || 0) + 1;
          trade.nextHistoryCheckAt = now + 500;
          remaining.push(trade);
          continue;
        }

        trade.historyCheckAttempts = (trade.historyCheckAttempts || 0) + 1;
        trade.nextHistoryCheckAt = now + 2000;
        remaining.push(trade);
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

      const expiryWindowMs = secsFromTF(sig.expiry || S.expirySetting) * 1000;
      sig.confidence = Number.isFinite(sig.confidence) ? sig.confidence : S.analysisConfidence;
      sig.entryMeta = sig.entryMeta || {
        regime: detectMarketRegime(expiryWindowMs),
        biasDir: getBiasDirection(),
        confirmation: { total: 0, matched: 0, details: [] },
        timeInCandle: getTimeInCandleSec(expiryWindowMs),
        entryWindowSec: S.sniperEntryWindowSec,
        rangePct: null,
        trendDir: S.analysisDirection === 'BUY' ? 1 : (S.analysisDirection === 'SELL' ? -1 : 0),
        trendAligned: true,
        volumeOk: true
      };

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
const IAA_EXP_CAL_KEY_OTC = 'IAA_EXPIRY_COORDS_V3';
const IAA_EXP_CAL_KEY_REAL = 'IAA_EXPIRY_COORDS_REAL_V1';
const IAA_EXP_CAL_DEFAULTS = {
  OPEN: { x: 1048, y: 169 },
  S3: { x: 784, y: 269 },
  S15: { x: 840, y: 272 },
  S30: { x: 903, y: 271 },
  M1: { x: 783, y: 309 },
  M3: { x: 836, y: 304 },
  M5: { x: 904, y: 308 },
  M30: { x: 792, y: 346 }
};
const IAA_EXP_CAL_REAL_DEFAULTS = {
  OPEN: { x: 1055, y: 165 },
  M1: { x: 789, y: 269 },
  M3: { x: 844, y: 270 },
  M5: { x: 903, y: 270 },
  M30: { x: 787, y: 308 },
  H1: { x: 844, y: 310 },
  H4: { x: 907, y: 305 }
};

function iaaLoadExpCal(key) {
  try {
    const stored = JSON.parse(localStorage.getItem(key) || '{}');
    const defaults = key === IAA_EXP_CAL_KEY_REAL
      ? IAA_EXP_CAL_REAL_DEFAULTS
      : IAA_EXP_CAL_DEFAULTS;
    return { ...defaults, ...stored };
  } catch {
    return key === IAA_EXP_CAL_KEY_REAL
      ? { ...IAA_EXP_CAL_REAL_DEFAULTS }
      : { ...IAA_EXP_CAL_DEFAULTS };
  }
}
function iaaSaveExpCal(key, obj) {
  try { localStorage.setItem(key, JSON.stringify(obj || {})); } catch {}
}

// state
S.expiryCoordsOtc = S.expiryCoordsOtc || iaaLoadExpCal(IAA_EXP_CAL_KEY_OTC);   // {OPEN:{x,y}, S3:{x,y}, ...}
S.expiryCoordsReal = S.expiryCoordsReal || iaaLoadExpCal(IAA_EXP_CAL_KEY_REAL); // {OPEN:{x,y}, S3:{x,y}, ...}
S._calTarget = S._calTarget || null;                      // 'OPEN' | 'S3' | 'S15' | ...
S._calScope = S._calScope || 'OTC';
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
    logConsoleLine('Калибрация: избери таргет от панела (OPEN / S30 / S15...).');
    return;
  }

  e.preventDefault();

  const { x, y } = S._mouseXY || {};
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    logConsoleLine('Калибрация: липсва позиция на мишката.');
    return;
  }

  const scope = (S._calScope || 'OTC').toUpperCase();
  const coords = scope === 'REAL' ? (S.expiryCoordsReal || {}) : (S.expiryCoordsOtc || {});
  coords[S._calTarget] = { x, y };
  if (scope === 'REAL') {
    S.expiryCoordsReal = coords;
    iaaSaveExpCal(IAA_EXP_CAL_KEY_REAL, coords);
  } else {
    S.expiryCoordsOtc = coords;
    iaaSaveExpCal(IAA_EXP_CAL_KEY_OTC, coords);
  }

  logConsoleLine(`Калибрация OK [${scope}]: ${S._calTarget} = (${x},${y})`);
}, true);

function iaaSetCalTarget(key, scope = 'OTC') {
  S._calTarget = String(key || '').trim().toUpperCase();
  S._calScope = scope.toUpperCase();
  logConsoleLine(`Калибрация [${S._calScope}]: ${S._calTarget}. Отиди с мишката върху елемента и натисни Shift+W.`);
}

function iaaDumpCal() {
  const otc = S.expiryCoordsOtc || iaaLoadExpCal(IAA_EXP_CAL_KEY_OTC);
  const real = S.expiryCoordsReal || iaaLoadExpCal(IAA_EXP_CAL_KEY_REAL);
  console.log('IAA_EXPIRY_COORDS_V3 (OTC) =', otc);
  console.log('IAA_EXPIRY_COORDS_REAL_V1 =', real);
  return { otc, real };
}

function iaaCaptureElementCenter(el) {
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  const x = Math.round(rect.left + rect.width / 2);
  const y = Math.round(rect.top + rect.height / 2);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  return { x, y };
}

function iaaFindExpiryElementByLabels(labels) {
  const nodes = $$('button,div,span,a');
  for (const el of nodes) {
    if (!visible(el)) continue;
    const text = T(el).trim().toLowerCase();
    if (!text) continue;
    if (labels.some(label => text === label || text.includes(label))) {
      return el;
    }
  }
  return null;
}

function iaaAutoDetectExpiryCoords(scope = 'OTC') {
  const coords = scope === 'REAL' ? (S.expiryCoordsReal || {}) : (S.expiryCoordsOtc || {});
  const updated = [];
  if (!coords.OPEN) {
    const timeCandidates = $$('button,div,span').filter(el => {
      if (!visible(el)) return false;
      return /\b\d{1,2}:\d{2}(:\d{2})?\b/.test(T(el)) || /(\d+\s*s|\d+\s*сек|\d+\s*min|\d+\s*мин)/i.test(T(el));
    });
    if (timeCandidates.length) {
      const openCoords = iaaCaptureElementCenter(timeCandidates[0]);
      if (openCoords) {
        coords.OPEN = openCoords;
        updated.push('OPEN');
      }
    }
  }

  const labelMap = {
    S3: ['3s', '00:03', '0:03', '3 сек', '3sec', '3 secs', '3 seconds', '0:03s', '00:03s'],
    S15: ['15s', '00:15', '0:15', '15 сек', '15sec', '15 secs', '15 seconds', '0:15s', '00:15s'],
    S30: ['30s', '00:30', '0:30', '30 сек', '30sec', '30 secs', '30 seconds', '0:30s', '00:30s'],
    M1: ['1m', '01:00', '1:00', '1 min', '1мин', '1 minute', '01 мин'],
    M3: ['3m', '03:00', '3:00', '3 min', '3мин', '3 minutes', '03 мин'],
    M5: ['5m', '05:00', '5:00', '5 min', '5мин', '5 minutes', '05 мин'],
    M30: ['30m', '30 min', '30мин', '30 minutes', '30:00'],
    H1: ['1h', '1 hr', '1 hour', '01:00:00'],
    H4: ['4h', '4 hr', '4 hours', '04:00:00']
  };

  for (const [key, labels] of Object.entries(labelMap)) {
    if (coords[key]) continue;
    const el = iaaFindExpiryElementByLabels(labels);
    const center = iaaCaptureElementCenter(el);
    if (center) {
      coords[key] = center;
      updated.push(key);
    }
  }

  if (updated.length) {
    if (scope === 'REAL') {
      S.expiryCoordsReal = coords;
      iaaSaveExpCal(IAA_EXP_CAL_KEY_REAL, coords);
    } else {
      S.expiryCoordsOtc = coords;
      iaaSaveExpCal(IAA_EXP_CAL_KEY_OTC, coords);
    }
  }
  return coords;
}

function iaaEnsureExpiryCoords(scope = 'OTC') {
  const coords = iaaAutoDetectExpiryCoords(scope);
  return coords || {};
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

    function iaaExpKeyFromNorm(norm){
      const n = String(norm||'').toUpperCase().trim();
      if (n === '3S') return 'S3';
      if (n === '15S') return 'S15';
      if (n === '30S') return 'S30';
      if (n === '1M') return 'M1';
      if (n === '3M') return 'M3';
      if (n === '5M') return 'M5';
      if (n === '30M') return 'M30';
      if (n === '1H') return 'H1';
      if (n === '4H') return 'H4';
      return null;
    }

    function getExpiryScopeFromAsset(assetLabel) {
      return /OTC/i.test(assetLabel || '') ? 'OTC' : 'REAL';
    }

    async function iaaOpenExpiryMenu(scope = 'OTC') {
      const coords = iaaEnsureExpiryCoords(scope);
      const c = coords?.OPEN;
      if (!c || !Number.isFinite(c.x) || !Number.isFinite(c.y)) {
        logConsoleLine(`ПРОПУСК: Липсва калибрация за TIME panel (OPEN) [${scope}].`);
        S.lastSkipReason = 'Expiry';
        return false;
      }
      if (!clickAtCoordinates(c.x, c.y)) {
        logConsoleLine(`ПРОПУСК: TIME panel (OPEN) не е намерен [${scope}].`);
        S.lastSkipReason = 'Expiry';
        return false;
      }
      await delay(120);
      return true;
    }

    function parseExpiryTimeString(text) {
      const parts = String(text || '').trim().split(':').map((value) => Number(value));
      if (parts.length !== 3 || parts.some((value) => Number.isNaN(value))) return null;
      const [hours, minutes, seconds] = parts;
      if (hours < 0 || minutes < 0 || seconds < 0) return null;
      return { hours, minutes, seconds };
    }

    function readDynamicExpiryValue() {
      const el = $(C.DYNAMIC_TIME_VALUE_SELECTOR);
      if (!el) return null;
      return parseExpiryTimeString(T(el));
    }

    function readDynamicExpirySeconds() {
      const value = readDynamicExpiryValue();
      if (!value) return null;
      return (value.hours * 3600) + (value.minutes * 60) + value.seconds;
    }

    function expiryLabelFromSeconds(seconds) {
      const map = {
        60: '1M',
        180: '3M',
        300: '5M',
        1800: '30M',
        3600: '1H',
        14400: '4H'
      };
      return map[seconds] || null;
    }

    function getDynamicExpiryPlan(expiry, confidence, scope, options = {}) {
      const threshold = typeof S.analysisConfidenceThreshold === 'number'
        ? S.analysisConfidenceThreshold
        : 0.65;
      const isHighConfidence = clamp01(confidence ?? 0) >= threshold;
      const targetSeconds = Number.isFinite(options.targetSeconds) ? Math.round(options.targetSeconds) : null;
      const expirySeconds = Math.max(3, secsFromTF(expiry));
      const baseOptions = scope === 'REAL'
        ? [60, 180, 300, 1800]
        : [3, 15, 30, 60, 180, 300, 1800];
      const sortedOptions = baseOptions.slice().sort((a, b) => a - b);
      const closestIndex = sortedOptions.reduce((bestIdx, value, idx) => {
        const bestValue = sortedOptions[bestIdx];
        return Math.abs(value - expirySeconds) < Math.abs(bestValue - expirySeconds) ? idx : bestIdx;
      }, 0);
      const confidenceRatio = clamp01(confidence ?? 0);
      const pickIndex = isHighConfidence
        ? Math.max(0, closestIndex - 1)
        : (confidenceRatio >= threshold * 0.5 ? closestIndex : Math.min(sortedOptions.length - 1, closestIndex + 1));
      let ladder = [sortedOptions[pickIndex]];
      if (!isHighConfidence && sortedOptions[closestIndex] !== sortedOptions[pickIndex]) {
        ladder.push(sortedOptions[closestIndex]);
      }
      if (targetSeconds != null) {
        ladder.unshift(targetSeconds);
      }
      const normalized = ladder
        .map((value) => Math.max(sortedOptions[0], Math.min(sortedOptions[sortedOptions.length - 1], Math.round(value))));
      if (scope === 'REAL') {
        const expiries = normalized.map(value => expiryLabelFromSeconds(value)).filter(Boolean);
        return { expiries, seconds: [] };
      }
      return { expiries: [], seconds: Array.from(new Set(normalized)).sort((a, b) => a - b) };
    }

    async function adjustDynamicUnit(unit, diff) {
      if (!diff) return;
      const selector = diff > 0
        ? C.DYNAMIC_TIME_PLUS_SELECTORS[unit]
        : C.DYNAMIC_TIME_MINUS_SELECTORS[unit];
      const btn = $(selector);
      if (!btn) return;
      const steps = Math.min(Math.abs(diff), 120);
      for (let i = 0; i < steps; i += 1) {
        simulateClick(btn);
        await delay(60);
      }
    }

    async function setDynamicExpiryTime(totalSeconds) {
      const value = readDynamicExpiryValue();
      if (!value) return false;
      const clampedSeconds = Math.max(0, Math.min(24 * 3600 - 1, Math.round(totalSeconds)));
      const targetHours = Math.floor(clampedSeconds / 3600);
      const targetMinutes = Math.floor((clampedSeconds % 3600) / 60);
      const targetSeconds = clampedSeconds % 60;
      await adjustDynamicUnit('hours', targetHours - value.hours);
      await adjustDynamicUnit('minutes', targetMinutes - value.minutes);
      await adjustDynamicUnit('seconds', targetSeconds - value.seconds);
      await delay(120);
      return true;
    }

    async function ensurePlatformExpiry(expiry) {
      const norm = normalizeExpiry(expiry);
      if (!norm) return false;
      const assetLabel = getCurrentAssetLabel();
      const scope = getExpiryScopeFromAsset(assetLabel);

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

      if (S.dynamicExpiryEnabled && scope === 'OTC') {
        const opened = await iaaOpenExpiryMenu(scope);
        if (!opened) return false;
        const targetSeconds = secsFromTF(norm);
        const applied = await setDynamicExpiryTime(targetSeconds);
        if (!applied) {
          logConsoleLine(`ПРОПУСК: Динамично време не е намерено [${scope}].`);
          S.lastSkipReason = 'Expiry';
          return false;
        }
        S.lastPlatformExpiry = norm;
        S.lastPlatformExpiryTS = Date.now();
        S.lastSkipReason = null;
        return true;
      }

      const coords = iaaEnsureExpiryCoords(scope);
      const btn = coords?.[key];
      if (!btn || !Number.isFinite(btn.x) || !Number.isFinite(btn.y)) {
        logConsoleLine(`ПРОПУСК: Липсва калибрация за време: ${key} [${scope}]`);
        S.lastSkipReason = 'Expiry';
        return false;
      }

      // 1) open TIME menu
      const opened = await iaaOpenExpiryMenu(scope);
      if (!opened) return false;

      // 2) click wanted time
      if (!clickAtCoordinates(btn.x, btn.y)) {
        logConsoleLine(`ПРОПУСК: Времето ${key} не е намерено [${scope}].`);
        S.lastSkipReason = 'Expiry';
        return false;
      }
      await delay(140);

      // 3) mark set (не четем UI)
      S.lastPlatformExpiry = norm;
      S.lastPlatformExpiryTS = Date.now();
      S.lastSkipReason = null;
      return true;
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

    function signalExecKey(sig) {
      const expiry = normalizeExpiry(sig.expiry) || '';
      return `${sig.asset}|${sig.targetTsMs}|${sig.direction}|${expiry}`;
    }

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
    function ensureTelegramWebAccess(source) {
      if (!source?.url || !source.joinSelector) return;
      const now = Date.now();
      if (S.telegramJoinAttempted && now - S.telegramJoinOpenedAt < 60000) return;
      S.telegramJoinAttempted = true;
      S.telegramJoinOpenedAt = now;
      try {
        const joinWindow = window.open(source.url, '_blank', 'noopener');
        if (!joinWindow) {
          logConsoleLine('ПРОПУСК: Telegram табът не може да се отвори автоматично.');
          return;
        }
        setTimeout(() => {
          try {
            const btn = joinWindow.document?.querySelector(source.joinSelector);
            if (btn) {
              btn.click();
              logConsoleLine(`Telegram: натиснато ${source.openWebLabel || 'OPEN IN WEB'}.`);
            } else {
              logConsoleLine('Telegram: бутонът OPEN IN WEB не е намерен.');
            }
          } catch {
            logConsoleLine('Telegram: достъпът до таба е ограничен. Отвори канала ръчно.');
          }
        }, 2000);
      } catch {
        logConsoleLine('Telegram: неуспешно отваряне на канала.');
      }
    }

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
        ensureTelegramWebAccess(source);
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
              const normalizedExpiry = normalizeExpiry(signal.expiry);
              if (normalizedExpiry === '1M' && S.signalSourceEnabled['1m'] === false) {
                continue;
              }
              if (normalizedExpiry === '5M' && S.signalSourceEnabled['5m'] === false) {
                continue;
              }
              signal.isSignalSource = true;
              signal.useCurrentAmount = true;
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
          } else if (/Expiration\s+\d+\s*minutes?/i.test(line)) {
            const expMatch = line.match(/Expiration\s+(\d+)\s*minutes?/i);
            if (expMatch) {
              expiry = `${expMatch[1]}M`;
            }
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
        } else if (!time && /Entry\s+at\s+\d{1,2}:\d{2}/i.test(line)) {
          const timeMatch = line.match(/Entry\s+at\s+(\d{1,2}:\d{2})/i);
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
      '3s': 3000,
      '15s': 15000,
      '30s': 30000,
      '1m': 60000,
      '3m': 180000,
      '5m': 300000,
      '15m': 900000,
      '30m': 1800000
    };

    function getSniperTimeframes() {
      const assetLabel = getCurrentAssetLabel() || '';
      const isOtcAsset = /OTC/i.test(assetLabel);
      const enabled = Object.keys(SNIPER_TF_MS).filter(tf => S.sniperEnabledTimeframes[tf]);
      if (!enabled.length) {
        const fallback = Object.keys(SNIPER_5S_DEFAULTS.timeframes).filter(tf => SNIPER_5S_DEFAULTS.timeframes[tf]);
        return fallback.filter(tf => tf !== '3s' || isOtcAsset);
      }
      return enabled.filter(tf => tf !== '3s' || isOtcAsset);
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

    function calcTrendStrength(windowMs) {
      const candle = getCandleAt(Date.now(), windowMs);
      if (!candle || !candle.open) return 0;
      return Math.abs(candle.close - candle.open) / candle.open;
    }

    function detectMarketRegime(windowMs) {
      const strength = clamp01(S.regimeStrength ?? 0);
      const candle = getCandleAt(Date.now(), windowMs);
      if (!candle || !candle.open) {
        return { state: 'nodata', trendDir: 0, trendScore: 0, rangePct: 0, volatility: 0 };
      }
      const rangePct = candle.open ? (candle.high - candle.low) / candle.open : 0;
      const trendStrength = calcTrendStrength(windowMs);
      const trendScore = clamp01(trendStrength / Math.max(rangePct, 1e-6));
      const volatility = clamp01(rangePct / 0.01);
      const trendCutoff = 0.55 + strength * 0.25;
      const chopCutoff = 0.18 - strength * 0.06;
      const volCutoff = 0.65 + strength * 0.15;
      let state = 'range';
      if (volatility >= volCutoff) {
        state = 'volatility';
      } else if (trendScore >= trendCutoff) {
        state = 'trend';
      } else if (trendScore <= chopCutoff) {
        state = 'chop';
      }
      return {
        state,
        trendDir: calcTrendDirection(windowMs),
        trendScore,
        rangePct,
        volatility
      };
    }

    function getBiasDirection() {
      const weights = [];
      if (S.biasTimeframes?.['1m']) weights.push(calcTrendDirection(SNIPER_TF_MS['1m']));
      if (S.biasTimeframes?.['3m']) weights.push(calcTrendDirection(SNIPER_TF_MS['3m']));
      if (S.biasTimeframes?.['5m']) weights.push(calcTrendDirection(SNIPER_TF_MS['5m']));
      if (S.biasTimeframes?.['30m']) weights.push(calcTrendDirection(SNIPER_TF_MS['30m']));
      if (!weights.length) return 0;
      const score = weights.reduce((sum, val) => sum + val, 0);
      if (score > 0) return 1;
      if (score < 0) return -1;
      return 0;
    }

    function getConfirmationSummary(tfKey, direction) {
      const windowMs = SNIPER_TF_MS[tfKey];
      const confirmations = [];
      const trendDir = calcTrendDirection(windowMs);
      if (trendDir !== 0) {
        confirmations.push({ key: 'trend', direction: trendDir > 0 ? 'BUY' : 'SELL' });
      }
      const candle = calcCandlestickDecision(windowMs);
      if (candle?.direction) {
        confirmations.push({ key: 'candle', direction: candle.direction });
      }
      const stoch = calcStochDecision(windowMs);
      if (stoch?.direction) {
        confirmations.push({ key: 'osc', direction: stoch.direction });
      }
      const matched = confirmations.filter((c) => c.direction === direction).length;
      return {
        total: confirmations.length,
        matched,
        details: confirmations.map((c) => `${c.key}:${c.direction}`)
      };
    }

    function getStrategyConfig(strategyKey) {
      const defaults = STRATEGY_DEFAULTS.configs[strategyKey] || { enabled: true, priority: 0.6, label: strategyKey };
      const stored = S.strategyConfigs?.[strategyKey] || {};
      return { ...defaults, ...stored };
    }

    function getStrategyDisplayLabel(strategyKey) {
      const base = getStrategyConfig(strategyKey).label;
      if (strategyKey === 'vwap_momentum') {
        if (S.sniperVwapEnabled && !S.sniperMomentumEnabled) return 'VWAP';
        if (!S.sniperVwapEnabled && S.sniperMomentumEnabled) return 'Momentum';
      }
      return base;
    }

    function isStrategyEnabled(strategyKey) {
      return getStrategyConfig(strategyKey).enabled !== false;
    }

    function getStrategyPriority(strategyKey) {
      const priority = getStrategyConfig(strategyKey).priority;
      return clamp01(Number.isFinite(priority) ? priority : 0.6);
    }

    function getStrategyWeights() {
      const wr = clamp01(Number.isFinite(S.strategyWeightWr) ? S.strategyWeightWr : STRATEGY_DEFAULTS.wrWeight);
      const pnl = clamp01(Number.isFinite(S.strategyWeightPnl) ? S.strategyWeightPnl : STRATEGY_DEFAULTS.pnlWeight);
      const total = wr + pnl;
      if (total <= 0) {
        return { wr: STRATEGY_DEFAULTS.wrWeight, pnl: STRATEGY_DEFAULTS.pnlWeight };
      }
      return { wr: wr / total, pnl: pnl / total };
    }

    function isStrategyLearningPhase() {
      const limit = Number.isFinite(S.strategyLearningTrades) ? S.strategyLearningTrades : STRATEGY_DEFAULTS.learningTrades;
      return (S.strategyTradeCount || 0) < Math.max(0, limit);
    }

    function getStrategyScore(strategyKey) {
      if (!isStrategyEnabled(strategyKey)) return 0;
      const stats = S.strategyStats[strategyKey];
      if (!stats || !stats.total) return 0.5;
      const wr = stats.wins / stats.total;
      const base = Math.max(1, getSniperBaseAmountCents());
      const avgProfit = stats.profitCents / Math.max(1, stats.total);
      const pnlScore = (clampSym(avgProfit / base) + 1) / 2;
      const weights = getStrategyWeights();
      let score = (wr * weights.wr) + (pnlScore * weights.pnl);
      const streakLimit = Math.max(1, Number.isFinite(S.strategyLossStreakLimit) ? S.strategyLossStreakLimit : STRATEGY_DEFAULTS.lossStreakLimit);
      if ((stats.lossStreak || 0) >= streakLimit) {
        score *= 0.05;
      } else if (stats.lossStreak) {
        score = Math.max(0, score - (stats.lossStreak * 0.05));
      }
      return clamp01(score);
    }

    function shouldAutoSwitchStrategy() {
      return !!S.autoSwitchStrategy && !isStrategyLearningPhase();
    }

    function getStrategyPerformanceWeight(strategyKey) {
      if (!shouldAutoSwitchStrategy()) return 1;
      const score = getStrategyScore(strategyKey);
      return Math.max(0.05, score);
    }

    function getSessionBoostValue() {
      if (!S.featureSessionBoost) return 0;
      const now = getCurrentUTCMinus3Time();
      const hour = now.getUTCHours();
      const isActive = (hour >= 9 && hour <= 12) || (hour >= 15 && hour <= 18);
      return isActive ? 0.03 : 0;
    }

    function applyConfirmationBoost(decision, windowMs) {
      if (!decision) return decision;
      const prices = getPricesForWindow(windowMs, Math.max(14, S.sniperRsiWindow || 10));
      if (!prices.length) return decision;
      const rsi = calcRsi(prices, S.sniperRsiWindow || 10);
      const emaFast = calcEma(prices, S.sniperEmaFast || 4);
      const emaSlow = calcEma(prices, S.sniperEmaSlow || 16);
      let boost = 0;
      if (decision.direction === 'BUY') {
        if (Number.isFinite(rsi) && rsi <= (S.sniperRsiOversold || 30)) boost += 0.05;
        if (emaFast != null && emaSlow != null && emaFast > emaSlow) boost += 0.03;
      } else if (decision.direction === 'SELL') {
        if (Number.isFinite(rsi) && rsi >= (S.sniperRsiOverbought || 70)) boost += 0.05;
        if (emaFast != null && emaSlow != null && emaFast < emaSlow) boost += 0.03;
      }
      if (boost > 0) {
        decision.confidence = Math.min(1, decision.confidence + boost);
        decision.confirmationBoost = boost;
      }
      const sessionBoost = getSessionBoostValue();
      if (sessionBoost > 0) {
        decision.confidence = Math.min(1, decision.confidence + sessionBoost);
        decision.sessionBoost = sessionBoost;
      }
      return decision;
    }

    function getCandleAtOffset(windowMs, offset = 0) {
      const endTs = Date.now() - offset * windowMs;
      return getCandleAt(endTs, windowMs);
    }

    function calcCandlestickDecision(windowMs) {
      const curr = getCandleAtOffset(windowMs, 0);
      const prev = getCandleAtOffset(windowMs, 1);
      if (!curr || !prev) return null;
      const trendDir = calcTrendDirection(windowMs);
      const currBody = Math.abs(curr.close - curr.open);
      const currRange = Math.max(curr.high - curr.low, 0);
      const prevBody = Math.abs(prev.close - prev.open);
      const currUpperWick = curr.high - Math.max(curr.open, curr.close);
      const currLowerWick = Math.min(curr.open, curr.close) - curr.low;
      const currBull = curr.close > curr.open;
      const prevBull = prev.close > prev.open;
      const patterns = [];

      const isBullEngulf = !prevBull && currBull
        && curr.close >= prev.open
        && curr.open <= prev.close
        && currBody > prevBody * 0.9;
      if (isBullEngulf) patterns.push({ direction: 'BUY', confidence: 0.75 });

      const isBearEngulf = prevBull && !currBull
        && curr.open >= prev.close
        && curr.close <= prev.open
        && currBody > prevBody * 0.9;
      if (isBearEngulf) patterns.push({ direction: 'SELL', confidence: 0.75 });

      const isHammer = currLowerWick > currBody * 2 && currUpperWick <= currBody * 0.6;
      if (isHammer) {
        const conf = trendDir <= 0 ? 0.7 : 0.55;
        patterns.push({ direction: 'BUY', confidence: conf });
      }

      const isShootingStar = currUpperWick > currBody * 2 && currLowerWick <= currBody * 0.6;
      if (isShootingStar) {
        const conf = trendDir >= 0 ? 0.7 : 0.55;
        patterns.push({ direction: 'SELL', confidence: conf });
      }

      const isDoji = currRange > 0 && currBody / currRange <= 0.1;
      if (isDoji) {
        if (trendDir > 0) patterns.push({ direction: 'SELL', confidence: 0.5 });
        if (trendDir < 0) patterns.push({ direction: 'BUY', confidence: 0.5 });
      }

      if (!patterns.length) return null;
      const best = patterns.sort((a, b) => b.confidence - a.confidence)[0];
      return {
        strategyKey: 'candlestick',
        direction: best.direction,
        confidence: best.confidence,
        rangePct: curr.open ? currRange / curr.open : 0,
        trendDir,
        trendAligned: trendDir === 0 || (best.direction === 'BUY' ? trendDir >= 0 : trendDir <= 0),
        volumeOk: true
      };
    }

    function calcStochDecision(windowMs) {
      const prices = getPricesForWindow(windowMs, (S.sniperStochWindow || 10) + 2);
      if (!prices.length) return null;
      const stoch = calcStochastic(prices, S.sniperStochWindow || 10);
      if (!Number.isFinite(stoch)) return null;
      const oversold = S.sniperStochOversold ?? 25;
      const overbought = S.sniperStochOverbought ?? 75;
      const trendDir = calcTrendDirection(windowMs);
      if (stoch <= oversold) {
        const confidence = Math.min(0.9, 0.5 + (oversold - stoch) / Math.max(oversold, 1) * 0.4);
        return {
          strategyKey: 'stoch_extreme',
          direction: 'BUY',
          confidence,
          rangePct: 0,
          trendDir,
          trendAligned: trendDir === 0 || trendDir >= 0,
          volumeOk: true
        };
      }
      if (stoch >= overbought) {
        const confidence = Math.min(0.9, 0.5 + (stoch - overbought) / Math.max(100 - overbought, 1) * 0.4);
        return {
          strategyKey: 'stoch_extreme',
          direction: 'SELL',
          confidence,
          rangePct: 0,
          trendDir,
          trendAligned: trendDir === 0 || trendDir <= 0,
          volumeOk: true
        };
      }
      return null;
    }

    function calcVwapMomentumDecision(tfKey) {
      const windowMs = SNIPER_TF_MS[tfKey];
      const candle = getCandleAt(Date.now(), windowMs);
      if (!candle) return null;

      const open = candle.open;
      const close = candle.close;
      const rangePct = open ? (candle.high - candle.low) / open : 0;
      const momentum = open ? (close - open) / open : 0;
      const vwapLookbackMin = Number.isFinite(S.sniperVwapLookbackMin) ? S.sniperVwapLookbackMin : SNIPER_5S_DEFAULTS.vwapLookbackMin;
      const vwapWindowMs = Math.max(windowMs * 2, Math.max(1, vwapLookbackMin) * 60 * 1000);
      const vwap = calcSniperVwap(vwapWindowMs);
      const vwapDist = vwap ? (close - vwap) / vwap : 0;
      const trendDir = calcTrendDirection(windowMs);

      const vwapScale = S.sniperVwapDeviation > 0 ? S.sniperVwapDeviation : 1;
      const momentumScale = S.sniperMomentumThreshold > 0 ? S.sniperMomentumThreshold : 1;
      const vwapScore = clampSym(vwapDist / vwapScale);
      const momentumScore = clampSym(momentum / momentumScale);
      const volumeScore = calcVolumeScore(windowMs, S.sniperVolumeThreshold);

      const vwapWeightRaw = Math.max(0, Math.min(1, Number.isFinite(S.sniperVwapWeight) ? S.sniperVwapWeight : SNIPER_5S_DEFAULTS.vwapWeight));
      const vwapWeight = vwapWeightRaw <= 0.2 ? 0 : vwapWeightRaw;
      const momentumWeight = Math.max(0, Math.min(1, Number.isFinite(S.sniperMomentumWeight) ? S.sniperMomentumWeight : SNIPER_5S_DEFAULTS.momentumWeight));
      const volumeWeight = Math.max(0, Math.min(1, Number.isFinite(S.sniperVolumeWeight) ? S.sniperVolumeWeight : SNIPER_5S_DEFAULTS.volumeWeight));
      const vwapEnabled = !!S.sniperVwapEnabled && !!S.featureVwapAnalysis;
      const momentumEnabled = !!S.sniperMomentumEnabled;
      const volumeEnabled = !!S.sniperVolumeEnabled;
      const useVwap = vwapEnabled && vwapWeight > 0;
      const useMomentum = momentumEnabled && momentumWeight > 0;
      const useVolume = volumeEnabled && volumeWeight > 0;
      const totalWeights = (useVwap ? vwapWeight : 0) + (useMomentum ? momentumWeight : 0) + (useVolume ? volumeWeight : 0);
      const normalizedTotal = totalWeights || 1;
      const score = (useVwap ? vwapScore * vwapWeight : 0)
        + (useMomentum ? momentumScore * momentumWeight : 0)
        + (useVolume ? volumeScore * volumeWeight : 0);
      const confidence = Math.min(
        1,
        ((useVwap ? Math.abs(vwapScore) * vwapWeight : 0)
          + (useMomentum ? Math.abs(momentumScore) * momentumWeight : 0)
          + (useVolume ? Math.abs(volumeScore) * volumeWeight : 0)) / normalizedTotal
      );

      const vwapStrong = Math.abs(vwapDist) >= vwapScale * 0.35;
      const momentumStrong = Math.abs(momentum) >= momentumScale * 0.25;
      let direction = null;
      if (useVwap && useMomentum) {
        if (vwapScore !== 0 && momentumScore !== 0 && vwapScore * momentumScore > 0 && (vwapStrong || momentumStrong)) {
          direction = vwapScore > 0 ? 'BUY' : 'SELL';
        }
      } else if (useVwap && vwapStrong) {
        direction = vwapScore > 0 ? 'BUY' : 'SELL';
      } else if (useMomentum && momentumStrong) {
        direction = momentumScore > 0 ? 'BUY' : 'SELL';
      }

      if (!direction && totalWeights > 0 && score !== 0) {
        direction = score > 0 ? 'BUY' : 'SELL';
      }

      const trendAligned = trendDir === 0 || (direction && trendDir === (direction === 'BUY' ? 1 : -1));
      const volumeOk = !S.featureVolumeRejection || !useVolume || volumeScore >= 0;
      const requiredConfidence = getSniperThresholdForScope(getExpiryScopeFromAsset(getCurrentAssetLabel()));
      const allowEntry = direction != null && confidence >= requiredConfidence && trendAligned && volumeOk;

      return {
        tfKey,
        strategyKey: 'vwap_momentum',
        confidence,
        direction,
        rangePct,
        vwapDist,
        momentum,
        trendDir,
        trendAligned,
        volumeScore,
        vwapWeight,
        momentumWeight,
        volumeWeight,
        volumeOk,
        allowEntry,
        requiredConfidence,
        score
      };
    }

    function getStrategyDecisions(tfKey) {
      const windowMs = SNIPER_TF_MS[tfKey];
      const decisions = [];
      const candlestick = calcCandlestickDecision(windowMs);
      if (candlestick?.direction && isStrategyEnabled(candlestick.strategyKey)) {
        candlestick.tfKey = tfKey;
        decisions.push(applyConfirmationBoost(candlestick, windowMs));
      }
      const stoch = calcStochDecision(windowMs);
      if (stoch?.direction && isStrategyEnabled(stoch.strategyKey)) {
        stoch.tfKey = tfKey;
        decisions.push(applyConfirmationBoost(stoch, windowMs));
      }
      if (S.featureVwapAnalysis && isStrategyEnabled('vwap_momentum')) {
        const vwapDecision = calcVwapMomentumDecision(tfKey);
        if (vwapDecision?.direction) decisions.push(applyConfirmationBoost(vwapDecision, windowMs));
      }
      return decisions;
    }

    function selectBestStrategyDecision(decisions) {
      if (!decisions.length) return null;
      return decisions.reduce((best, decision) => {
        if (!isStrategyEnabled(decision.strategyKey)) return best;
        const weight = getStrategyPerformanceWeight(decision.strategyKey);
        const priority = getStrategyPriority(decision.strategyKey);
        const conflictBoost = 1 + (clamp01(S.conflictStrength ?? 0) * (priority - 0.6));
        const weightedScore = (decision.confidence || 0) * weight * conflictBoost;
        if (!best) return { ...decision, weightedScore };
        if (weightedScore > best.weightedScore) return { ...decision, weightedScore };
        if (decision.confidence > best.confidence) return { ...decision, weightedScore };
        return best;
      }, null);
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

    function getSniperThresholdForScope(scope) {
      if (scope === 'REAL') {
        return Number.isFinite(S.sniperThresholdReal) ? S.sniperThresholdReal : S.sniperThreshold;
      }
      if (scope === 'OTC') {
        return Number.isFinite(S.sniperThresholdOtc) ? S.sniperThresholdOtc : S.sniperThreshold;
      }
      return S.sniperThreshold;
    }

    function getSniperBaseAmountCents() {
      return Number.isFinite(S.sniperBaseAmount)
        ? S.sniperBaseAmount
        : SNIPER_5S_DEFAULTS.baseAmountCents;
    }

    function getSniperMultiSettings(confidence) {
      if (!S.sniperMultiEnabled) return null;
      const threshold = Math.max(0, Math.min(100, Number.isFinite(S.sniperMultiThresholdPct) ? S.sniperMultiThresholdPct : SNIPER_5S_DEFAULTS.multiThresholdPct));
      const countRaw = Number.isFinite(S.sniperMultiCount) ? S.sniperMultiCount : SNIPER_5S_DEFAULTS.multiCount;
      const count = Math.max(0, Math.min(20, Math.round(countRaw)));
      const amountPct = Math.max(0, Math.min(100, Number.isFinite(S.sniperMultiAmountPct) ? S.sniperMultiAmountPct : SNIPER_5S_DEFAULTS.multiAmountPct));
      if (count < 2 || threshold <= 0) return null;
      const confidencePct = Math.round((confidence || 0) * 100);
      if (confidencePct < threshold) return null;
      return { count, amountPct };
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
        S.tradeQualityScore = 0;
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

      const feedStaleMs = 5000;
      if (!S.lastPriceAt || now - S.lastPriceAt > feedStaleMs) {
        const feedStatuses = {};
        for (const tf of Object.keys(SNIPER_TF_MS)) {
          if (!S.sniperEnabledTimeframes[tf]) {
            feedStatuses[tf] = { state: 'off', confidence: null, direction: null };
            continue;
          }
          feedStatuses[tf] = { state: 'nodata', confidence: null, direction: null };
        }
        S.analysisUpdatedAt = now;
        S.analysisConfidence = 0;
        S.analysisDirection = null;
        S.tradeQualityScore = 0;
        S.sniperTfStatus = feedStatuses;
        setStatusOverlay(formatStatus('sniper_no_feed'), '', false);
        renderSniperMatrix();
        renderPendingTrades();
        return;
      }

      const canTrade = S.autoTrade && !S.executing;

      const timeframes = getSniperTimeframes();
      if (!timeframes.length) {
        const tfStatus = {};
        for (const tf of Object.keys(SNIPER_TF_MS)) {
          tfStatus[tf] = { state: 'off', confidence: null, direction: null };
        }
        S.sniperTfStatus = tfStatus;
        S.analysisUpdatedAt = now;
        S.analysisConfidence = 0;
        S.analysisDirection = null;
        S.tradeQualityScore = 0;
        setStatusOverlay('Снайпер: няма активни таймфрейми', '', false);
        renderSniperMatrix();
        renderPendingTrades();
        return;
      }

      const payoutOk = getSniperMinPayoutOk();
      const assetScope = getExpiryScopeFromAsset(getCurrentAssetLabel());
      const requiredThreshold = clamp01(getSniperThresholdForScope(assetScope));

      let best = null;
      let bestCandidate = null;
      const decisionsByTf = {};
      const allowLateEntries = requiredThreshold === 0;
      const tfStatus = {};
      for (const tf of timeframes) {
        const windowMs = SNIPER_TF_MS[tf];
        const timeInCandle = getTimeInCandleSec(windowMs);
        const entryWindowLimit = Math.min(Math.max(0, S.sniperEntryWindowSec), Math.floor(windowMs / 1000));
        const candleStart = getCandleStart(windowMs);
        if (S.sniperLastTradeByTf[tf] === candleStart) continue;

        const nextAllowed = S.sniperNextTradeByTf[tf] || 0;
        if (now < nextAllowed) continue;

        const strategyDecisions = getStrategyDecisions(tf);
        const decision = selectBestStrategyDecision(strategyDecisions);
        const regime = detectMarketRegime(windowMs);
        const biasDir = getBiasDirection();
        const biasDirection = biasDir > 0 ? 'BUY' : biasDir < 0 ? 'SELL' : null;
        const confirmation = decision?.direction ? getConfirmationSummary(tf, decision.direction) : { total: 0, matched: 0, details: [] };
        if (decision) {
          decision.regime = regime;
          decision.biasDir = biasDir;
          decision.confirmation = confirmation;
          decision.timeInCandle = timeInCandle;
          decision.entryWindowSec = entryWindowLimit;
          decision.candleStart = candleStart;
        }
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
        if (S.regimeStrength > 0 && regime?.state && ['volatility'].includes(regime.state) && S.regimeStrength >= 0.6) {
          tfStatus[tf] = { state: 'regime', confidence: decision.confidence, direction: decision.direction };
          continue;
        }
        if (S.regimeStrength > 0 && regime?.state === 'chop') {
          decision.confidence = Math.max(0, decision.confidence - 0.08 * clamp01(S.regimeStrength));
        }
        if (S.regimeStrength > 0 && regime?.state === 'trend' && regime.trendDir !== 0) {
          const regimeDir = regime.trendDir > 0 ? 'BUY' : 'SELL';
          if (decision.direction !== regimeDir && S.regimeStrength >= 0.7) {
            tfStatus[tf] = { state: 'regime', confidence: decision.confidence, direction: decision.direction };
            continue;
          }
          if (decision.direction !== regimeDir) {
            decision.confidence = Math.max(0, decision.confidence - 0.06 * clamp01(S.regimeStrength));
          }
        }
        if (S.regimeStrength > 0 && regime?.state === 'range' && regime.trendDir !== 0) {
          const regimePref = regime.trendDir > 0 ? 'SELL' : 'BUY';
          if (decision.direction !== regimePref) {
            decision.confidence = Math.max(0, decision.confidence - 0.05 * clamp01(S.regimeStrength));
          }
        }
        if (S.biasStrength > 0 && biasDirection && decision.direction !== biasDirection) {
          if (S.biasStrength >= 0.5) {
            tfStatus[tf] = { state: 'bias', confidence: decision.confidence, direction: decision.direction };
            continue;
          }
          decision.confidence = Math.max(0, decision.confidence - 0.05 * clamp01(S.biasStrength));
        }
        if (S.confirmationStrength > 0.1) {
          const required = S.confirmationStrength >= 0.7 ? 2 : 1;
          if (confirmation.matched < required && S.confirmationStrength >= 0.7) {
            tfStatus[tf] = { state: 'confirm', confidence: decision.confidence, direction: decision.direction };
            continue;
          }
          if (confirmation.matched < required) {
            decision.confidence = Math.max(0, decision.confidence - 0.06 * clamp01(S.confirmationStrength));
          }
        }
        if (!bestCandidate || decision.confidence > bestCandidate.confidence) {
          bestCandidate = decision;
        }
        const confidencePct = Math.round((decision.confidence || 0) * 100);
        const overrideThreshold = Math.max(0, Math.min(100, Number.isFinite(S.sniperOverrideConfidencePct) ? S.sniperOverrideConfidencePct : SNIPER_5S_DEFAULTS.overrideConfidencePct));
        const allowOverride = overrideThreshold > 0 && confidencePct >= overrideThreshold;
        if (!allowOverride && !allowLateEntries && entryWindowLimit > 0 && timeInCandle > entryWindowLimit) {
          tfStatus[tf] = { state: 'late', confidence: decision.confidence, direction: decision.direction };
          continue;
        }
        const chopThreshold = Math.max(0, Number.isFinite(S.sniperChopThreshold) ? S.sniperChopThreshold : 0);
        if (!allowOverride && !allowLateEntries && S.sniperChopEnabled && chopThreshold > 0 && decision.rangePct < chopThreshold) {
          tfStatus[tf] = { state: 'chop', confidence: decision.confidence, direction: decision.direction };
          continue;
        }
        if (!allowOverride && !decision.trendAligned) {
          tfStatus[tf] = { state: 'trend', confidence: decision.confidence, direction: decision.direction };
          continue;
        }
        if (!allowOverride && S.featureVolumeRejection && !decision.volumeOk) {
          tfStatus[tf] = { state: 'volume', confidence: decision.confidence, direction: decision.direction };
          continue;
        }
        if (!allowOverride && decision.confidence < requiredThreshold) {
          tfStatus[tf] = { state: 'weak', confidence: decision.confidence, direction: decision.direction };
          continue;
        }
        if (!allowOverride && !allowLateEntries && !payoutOk) {
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
        tfStatus[tf] = { state: 'ready', confidence: decision.confidence, direction: decision.direction };
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
        S.analysisConfidence = bestCandidate ? bestCandidate.confidence : 0;
        S.analysisDirection = bestCandidate ? bestCandidate.direction : null;
        S.tradeQualityScore = bestCandidate ? Math.round((bestCandidate.confidence || 0) * 100) : 0;
        S.currentStrategyKey = bestCandidate?.strategyKey || null;
        S.analysisUpdatedAt = now;
        setStatusOverlay('Снайпер: няма чист вход', '', false);
        renderPendingTrades();
        return;
      }

      S.analysisConfidence = best.confidence;
      S.analysisDirection = best.direction;
      S.analysisUpdatedAt = now;
      S.tradeQualityScore = Math.round((best.confidence || 0) * 100);
      S.sniperLastDecision = best;
      S.currentStrategyKey = best.strategyKey || null;

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

      const maxConcurrentSniperTrades = Math.max(1, Math.round(S.maxOpenTrades || timeframes.length));
      const availableSlots = Math.max(0, maxConcurrentSniperTrades - S.activeTrades.length);
      if (!availableSlots) {
        setStatusOverlay('Снайпер: изчакване', '', false);
        return;
      }

      const preferredDirection = best?.direction;
      const filteredSignals = preferredDirection
        ? readySignals.filter(sig => sig.direction === preferredDirection)
        : readySignals;
      const signalsToExecute = filteredSignals.slice(0, availableSlots);
      for (const decision of signalsToExecute) {
        const assetLabel = getCurrentAssetLabel() || '—';
        const assetSearch = assetLabel.replace(/\(OTC\)/i, '').replace(/\//g, '').trim();
        const signal = {
          asset: assetLabel,
          assetSearch,
          isOTC: /OTC/i.test(assetLabel || ''),
          direction: decision.direction,
          strategyKey: decision.strategyKey,
          confidence: decision.confidence,
          entryMeta: {
            strategyKey: decision.strategyKey,
            regime: decision.regime,
            biasDir: decision.biasDir,
            confirmation: decision.confirmation,
            timeInCandle: decision.timeInCandle,
            entryWindowSec: decision.entryWindowSec,
            rangePct: decision.rangePct,
            trendDir: decision.trendDir,
            trendAligned: decision.trendAligned,
            volumeOk: decision.volumeOk
          },
          expiry: decision.tfKey.toUpperCase(),
          minute: getCurrentMinute(),
          time: fmtHHMMSSUTCm3(new Date()),
          targetTsMs: now,
          rawText: `[sniper:${decision.tfKey}]`
        };
        const multiSettings = getSniperMultiSettings(decision.confidence);
        if (multiSettings) {
          signal.burstCount = Math.max(2, Math.min(multiSettings.count, 20));
          if (multiSettings.amountPct > 0) {
            signal.overrideAmountCents = Math.max(1, Math.round(getSniperBaseAmountCents() * (multiSettings.amountPct / 100)));
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

      await maybeSwitchIdleAsset();

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
        updateDebugStateSnapshot();
        return;
      }

      if (S.autoTrade && !S.cycleActive && !S.tradeSequenceActive && !hasActiveTrade() && !S.hasLiveSignal && Date.now() >= S.signalCooldownUntil) {
        const incoming = await fetchAPISignals();

        if (incoming.length) {
          for (const sig of incoming) {
            const delayMs = calculateDelay(sig);

            if (delayMs < 0) {
              logSignalStatus({ label: '5m' }, 'signal_stale', { minIntervalMs: 300000 });
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
      updateDebugStateSnapshot();
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
        .iaa-console-issue{ color:#f87171; font-weight:700; }
        .iaa-console-msg--signal{ color:#22c55e; }
        .iaa-console-msg--skip{ color:#f87171; }
        .iaa-console-msg--warn{ color:#fbbf24; }
        .iaa-console-strategy{ color:#a5b4fc; font-weight:700; }
        #iaa-console-copy, #iaa-console-clear{ align-self:flex-end; padding:4px 8px; border-radius:6px; border:1px solid rgba(255,255,255,.12); background:#111; color:#fff; font-size:10px; cursor:pointer; letter-spacing:.08em; }
        #iaa-console-copy:hover, #iaa-console-clear:hover{ background:#1f1f1f; }
        #iaa-console-clear{ background:#141414; }
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
        .iaa-balance-summary{ display:flex; align-items:center; justify-content:space-between; gap:6px; margin-top:4px; padding-top:4px; border-top:1px solid rgba(255,255,255,.05); flex-wrap:nowrap; font-size:10px; line-height:1.15; }
        .iaa-balance-row{ display:flex; align-items:center; gap:4px; white-space:nowrap; }
        .iaa-balance-row:not(:last-child)::after{ content:';'; margin-left:4px; color:#6b7280; }
        .iaa-balance-label{ color:#9ca3af; }
        .iaa-balance-value{ color:#e5e7eb; font-weight:600; }
        .iaa-balance-positive{ color:#22c55e; font-weight:700; }
        .iaa-balance-negative{ color:#f87171; font-weight:700; }
        .iaa-grid-toggle{ display:flex; align-items:center; justify-content:flex-end; margin-top:6px; }
        .iaa-grid-toggle button{ background:#111; border:1px solid rgba(255,255,255,.12); color:#e5e7eb; border-radius:6px; padding:2px 6px; font-size:10px; cursor:pointer; }
        .iaa-grid-toggle button:hover{ background:#1f1f1f; }
        .iaa-grid-collapsed .iaa-grid{ display:none; }
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
        .iaa-tab-row{ display:flex; flex-wrap:wrap; gap:6px; margin-bottom:10px; }
        .iaa-tab-btn{ flex:1; min-width:110px; padding:6px 8px; border-radius:8px; border:1px solid rgba(255,255,255,.12); background:#111827; color:#e5e7eb; font-size:10px; cursor:pointer; }
        .iaa-tab-btn.active{ background:#16a34a; color:#052e16; font-weight:700; }
        .iaa-tab-body{ display:block; }
        .iaa-field-row{ display:flex; align-items:center; justify-content:space-between; gap:8px; margin:8px 0; }
        .iaa-field-row input{ width:90px; padding:4px 6px; border-radius:6px; border:1px solid rgba(255,255,255,.1); background:rgba(0,0,0,.3); color:#fff; font-weight:700; }
        .iaa-field-label{ font-size:11px; color:#9ca3af; }
        .iaa-field-hint{ font-size:10px; color:#6b7280; margin-left:6px; }
        .iaa-subtitle{ margin-top:10px; font-size:11px; color:#9ca3af; font-weight:700; }
        .iaa-checkbox{ display:flex; align-items:center; gap:6px; margin:6px 0; font-size:12px; color:#e5e7eb; }
        .iaa-checkbox-grid{ display:grid; grid-template-columns:repeat(2, 1fr); gap:6px 10px; font-size:12px; color:#e5e7eb; }
        .iaa-action-row{ display:flex; gap:8px; margin-top:12px; }
        .iaa-action-row button{ flex:1; padding:6px 8px; border-radius:6px; border:1px solid rgba(255,255,255,.12); background:#111; color:#e5e7eb; font-size:11px; cursor:pointer; }
        .iaa-action-row button:hover{ background:#1f2937; }
        .iaa-field-toggle input[type="text"], .iaa-field-toggle input[type="number"]{ width:70px; }
        .iaa-field-toggle label{ font-size:11px; color:#9ca3af; display:flex; align-items:center; gap:6px; }
        .iaa-toggle-btn{ background:#111827; color:#e5e7eb; border:1px solid rgba(255,255,255,.18); border-radius:6px; padding:2px 6px; cursor:pointer; }
        .iaa-toggle-btn:hover{ background:#1f2937; }

        #iaa-strategies-panel{
          display:none; position:fixed; top:50%; left:50%; transform:translate(-50%, -50%);
          width:360px; background:#0b1220; border:1px solid rgba(255,255,255,.15);
          border-radius:14px; padding:16px; z-index:2147483648;
          box-shadow:0 12px 40px rgba(0,0,0,.8); max-height:80vh; overflow-y:auto;
          font-family:system-ui, Arial !important; color:#e5e7eb;
        }
        #iaa-strategies-close{ position:absolute; top:8px; right:8px; background:none; border:none; color:#fff; font-size:16px; cursor:pointer; }
        .iaa-strategy-table{ width:100%; border-collapse:collapse; font-size:11px; margin-top:8px; }
        .iaa-strategy-table th, .iaa-strategy-table td{ padding:6px 4px; border-bottom:1px solid rgba(255,255,255,.08); text-align:left; }
        .iaa-strategy-table th{ color:#93c5fd; font-weight:700; }
        .iaa-strategy-positive{ color:#22c55e; font-weight:700; }
        .iaa-strategy-negative{ color:#f87171; font-weight:700; }
        .iaa-strategy-neutral{ color:#e5e7eb; font-weight:600; }
        .iaa-strategy-input{ width:64px; padding:3px 5px; border-radius:6px; border:1px solid rgba(255,255,255,.12); background:#111; color:#fff; font-size:10px; font-weight:700; }
        .iaa-strategy-actions{ display:flex; gap:8px; margin-top:10px; }
        .iaa-strategy-actions button{ flex:1; padding:6px 8px; border-radius:6px; border:1px solid rgba(255,255,255,.12); background:#111; color:#e5e7eb; font-size:11px; cursor:pointer; }
        .iaa-strategy-summary{ display:grid; grid-template-columns:repeat(2, 1fr); gap:6px 10px; margin-top:10px; font-size:11px; }
        .iaa-strategy-summary .iaa-summary-card{ padding:6px; border-radius:8px; border:1px solid rgba(255,255,255,.08); background:#0f172a; }
        .iaa-history-table{ width:100%; border-collapse:collapse; font-size:10px; margin-top:8px; }
        .iaa-history-table th, .iaa-history-table td{ padding:5px 4px; border-bottom:1px solid rgba(255,255,255,.08); text-align:left; }
        .iaa-history-table th{ color:#93c5fd; font-weight:700; }

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
        #iaa-calibration-panel{
          display:none; position:absolute; top:50%; left:50%; transform:translate(-50%, -50%);
          width:380px; background:#0b1220; border:1px solid rgba(255,255,255,.15);
          border-radius:14px; padding:16px; z-index:2147483648;
          box-shadow:0 12px 40px rgba(0,0,0,.8); max-height:80vh; overflow-y:auto;
          font-family:system-ui, Arial !important; color:#eaf2ff;
        }
        #iaa-calibration-close{ position:absolute; top:8px; right:8px; background:none; border:none; color:#fff; font-size:16px; cursor:pointer; }
        #iaa-debug-close{ background:none; border:none; color:#fff; font-size:16px; cursor:pointer; }
        #iaa-debug-content{ white-space:pre-wrap; word-break:break-word; margin-top:10px; }
        .iaa-debug-header{ display:flex; align-items:center; justify-content:space-between; gap:8px; }
        .iaa-debug-actions{ display:flex; align-items:center; gap:6px; }
        #iaa-debug-copy{ padding:4px 8px; border-radius:6px; border:1px solid rgba(255,255,255,.12); background:#111; color:#fff; font-size:10px; cursor:pointer; letter-spacing:.08em; }
        #iaa-debug-copy:hover{ background:#1f1f1f; }
        #iaa-loss-copy{ padding:4px 8px; border-radius:6px; border:1px solid rgba(255,255,255,.12); background:#1f2937; color:#e5e7eb; font-size:10px; cursor:pointer; letter-spacing:.08em; }
        #iaa-loss-copy:hover{ background:#334155; }
        .iaa-debug-line{ display:flex; align-items:flex-start; justify-content:space-between; gap:10px; padding:2px 0; }
        .iaa-debug-key{ color:#9ca3af; }
        .iaa-debug-value{ color:#e5e7eb; font-weight:600; }
        .iaa-debug-value--warn{ color:#fbbf24; }
        .iaa-debug-value--bad{ color:#f87171; }
        .iaa-debug-tabs{ display:flex; gap:6px; margin-top:8px; }
        .iaa-debug-tab{ flex:1; padding:4px 6px; border-radius:6px; border:1px solid rgba(255,255,255,.12); background:#111; color:#e5e7eb; font-size:10px; cursor:pointer; }
        .iaa-debug-tab.active{ background:#1f2937; color:#fff; }
        #iaa-loss-content{ margin-top:10px; display:flex; flex-direction:column; gap:8px; }
        .iaa-loss-card{ border:1px solid rgba(255,255,255,.08); border-radius:8px; padding:8px; background:#0b0b0b; }
        .iaa-loss-header{ display:flex; justify-content:space-between; font-weight:700; color:#e5e7eb; font-size:11px; margin-bottom:6px; }
        .iaa-loss-time{ color:#9ca3af; font-weight:500; }
        .iaa-loss-expiry{ color:#60a5fa; font-weight:600; margin-left:6px; }
        .iaa-loss-row{ display:flex; justify-content:space-between; gap:8px; font-size:10px; margin:2px 0; }
        .iaa-loss-label{ color:#9ca3af; }
        .iaa-loss-value{ color:#e5e7eb; font-weight:600; }
        .iaa-loss-pill{ padding:2px 6px; border-radius:999px; font-size:9px; text-transform:uppercase; letter-spacing:.04em; }
        .iaa-loss-pill--warn{ background:rgba(251,191,36,.15); color:#fbbf24; }
        .iaa-loss-pill--bad{ background:rgba(248,113,113,.15); color:#f87171; }

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
      <button id="iaa-console-clear" type="button">ИЗЧИСТИ</button>
              <div id="iaa-status-overlay"></div>
              <div id="iaa-countdown"></div>
            </div>
            <div id="iaa-direction-indicator"></div>
          </div>
        </div>
        <div class="iaa-grid-toggle">
          <button id="iaa-grid-toggle" type="button">▾ Детайли</button>
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
          <div class="iaa-stat-row">
            <span class="iaa-stat-label" data-status-key="win_rate_label">%</span>
            <span id="iaa-win-rate" class="iaa-stat-value">0%</span>
          </div>
        </div>
        <div class="iaa-balance-summary">
          <div class="iaa-balance-row">
            <span class="iaa-balance-label">Старт</span>
            <span id="iaa-balance-start" class="iaa-balance-value">—</span>
          </div>
          <div class="iaa-balance-row">
            <span class="iaa-balance-label">Сега</span>
            <span id="iaa-balance-current" class="iaa-balance-value">—</span>
          </div>
          <div class="iaa-balance-row">
            <span class="iaa-balance-label">Резултат</span>
            <span id="iaa-balance-diff" class="iaa-balance-value">—</span>
          </div>
        </div>
        <div id="iaa-tf-matrix" class="iaa-tf-grid">
          <div class="iaa-tf-cell" data-tf="3s"><span id="iaa-tf-dot-3s" class="iaa-tf-dot"></span><span id="iaa-tf-3s">3s —</span></div>
          <div class="iaa-tf-cell" data-tf="15s"><span id="iaa-tf-dot-15s" class="iaa-tf-dot"></span><span id="iaa-tf-15s">15s —</span></div>
          <div class="iaa-tf-cell" data-tf="30s"><span id="iaa-tf-dot-30s" class="iaa-tf-dot"></span><span id="iaa-tf-30s">30s —</span></div>
          <div class="iaa-tf-cell" data-tf="1m"><span id="iaa-tf-dot-1m" class="iaa-tf-dot"></span><span id="iaa-tf-1m">1m —</span></div>
          <div class="iaa-tf-cell" data-tf="3m"><span id="iaa-tf-dot-3m" class="iaa-tf-dot"></span><span id="iaa-tf-3m">3m —</span></div>
          <div class="iaa-tf-cell" data-tf="5m"><span id="iaa-tf-dot-5m" class="iaa-tf-dot"></span><span id="iaa-tf-5m">5m —</span></div>
          <div class="iaa-tf-cell" data-tf="15m"><span id="iaa-tf-dot-15m" class="iaa-tf-dot"></span><span id="iaa-tf-15m">15m —</span></div>
          <div class="iaa-tf-cell" data-tf="30m"><span id="iaa-tf-dot-30m" class="iaa-tf-dot"></span><span id="iaa-tf-30m">30m —</span></div>
        </div>
        <div id="iaa-warm" class="warmup red">ENGINE 0% ЗАГРЯВА</div>

        <div class="iaa-controls">
          <button id="iaa-mouse-toggle" class="iaa-control-btn" title="Mouse Mapping">🖱</button>
          <button id="iaa-settings-toggle" class="iaa-control-btn" title="Settings">⚙</button>
          <button id="iaa-strategies-toggle" class="iaa-control-btn" title="Стратегии">📊</button>
          <button id="iaa-debug-toggle" class="iaa-control-btn" title="Диагностика">🧪</button>
        </div>

        <div id="iaa-debug-panel">
          <div class="iaa-debug-header">
            <span>Диагностика</span>
            <div class="iaa-debug-actions">
              <button id="iaa-debug-copy" title="Копирай диагностика">КОПИРАЙ</button>
              <button id="iaa-loss-copy" title="Копирай анализ загуби">КОПИРАЙ ЗАГУБИ</button>
              <button id="iaa-debug-close" title="Затвори">×</button>
            </div>
          </div>
        <div class="iaa-debug-tabs">
          <button id="iaa-debug-tab-status" class="iaa-debug-tab active">Състояние</button>
          <button id="iaa-debug-tab-loss" class="iaa-debug-tab">Анализ загуби</button>
        </div>
        <div id="iaa-debug-content"></div>
        <div id="iaa-loss-content" style="display:none"></div>
      </div>

        <div id="iaa-debug-state" style="display:none"></div>

        <div id="iaa-calibration-panel">
          <button id="iaa-calibration-close">×</button>
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
            <button id="iaa-cal-m30" type="button" style="padding:7px 10px;border-radius:8px;border:1px solid rgba(255,255,255,.18);background:#111827;color:#ffffff;font-weight:700;cursor:pointer;">
              30m
            </button>
            <button id="iaa-cal-dump" type="button" style="padding:7px 10px;border-radius:8px;border:1px solid rgba(56,189,248,.45);background:#0a2a3a;color:#e6fbff;font-weight:800;cursor:pointer;">
              Покажи
            </button>
          </div>

          <div style="opacity:0.9;margin-top:8px;font-size:12.5px;color:#cfe4ff;line-height:1.25;">
            Натисни бутон → посочи елемента в PocketOption → <b style="color:#ffffff;">Shift+W</b>.
          </div>
          <label style="display:flex;align-items:center;gap:8px;margin-top:10px;font-size:12.5px;color:#e5e7eb;">
            <input type="checkbox" id="iaa-dynamic-time-toggle">
            Динамично време (OTC)
          </label>

          <div style="margin-top:14px;font-weight:800;color:#fbbf24;">REAL Калибрация</div>
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:6px;">
            <button id="iaa-cal-real-open" type="button" style="padding:7px 10px;border-radius:8px;border:1px solid rgba(255,255,255,.18);background:#1f2937;color:#ffffff;font-weight:700;cursor:pointer;">
              TIME (OPEN)
            </button>
            <button id="iaa-cal-real-m1" type="button" style="padding:7px 10px;border-radius:8px;border:1px solid rgba(255,255,255,.18);background:#111827;color:#ffffff;font-weight:700;cursor:pointer;">
              1m
            </button>
            <button id="iaa-cal-real-m3" type="button" style="padding:7px 10px;border-radius:8px;border:1px solid rgba(255,255,255,.18);background:#111827;color:#ffffff;font-weight:700;cursor:pointer;">
              3m
            </button>
            <button id="iaa-cal-real-m5" type="button" style="padding:7px 10px;border-radius:8px;border:1px solid rgba(255,255,255,.18);background:#111827;color:#ffffff;font-weight:700;cursor:pointer;">
              5m
            </button>
            <button id="iaa-cal-real-m30" type="button" style="padding:7px 10px;border-radius:8px;border:1px solid rgba(255,255,255,.18);background:#111827;color:#ffffff;font-weight:700;cursor:pointer;">
              30m
            </button>
            <button id="iaa-cal-real-h1" type="button" style="padding:7px 10px;border-radius:8px;border:1px solid rgba(255,255,255,.18);background:#111827;color:#ffffff;font-weight:700;cursor:pointer;">
              1h
            </button>
            <button id="iaa-cal-real-h4" type="button" style="padding:7px 10px;border-radius:8px;border:1px solid rgba(255,255,255,.18);background:#111827;color:#ffffff;font-weight:700;cursor:pointer;">
              4h
            </button>
          </div>
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
                <span style="color:#9ca3af; font-size:11px;" data-i18n="base_amount">Базова сума ($)</span>
                <input type="number" id="iaa-base-amount" min="1" step="1" value="1" style="width:70px; padding:4px 6px; border-radius:6px; border:1px solid rgba(255,255,255,.1); background:rgba(0,0,0,.3); color:#fff; font-weight:700" />
              </div>
              <div style="color:#9ca3af; font-size:11px; margin-bottom:4px;" data-i18n="expiry_setting">Време на изтичане:</div>
              <select id="iaa-expiry-setting" style="width:100%; padding:6px; border-radius:6px; border:1px solid rgba(255,255,255,.1); background:rgba(0,0,0,.3); color:#fff"><option value="1M" data-i18n="expiry_1m">1 минута</option><option value="5M" data-i18n="expiry_5m">5 минути</option></select>
            </div>
          </div>

          <div id="iaa-settings-sniper" style="display:none;">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin:8px 0;">
              <div style="font-weight:700;color:#e5e7eb;">Настройки</div>
              <button id="iaa-sniper-collapse" type="button" class="iaa-toggle-btn">▾</button>
            </div>
            <div id="iaa-sniper-settings-body">
              <div class="iaa-tab-row">
                <button class="iaa-tab-btn active" data-tab="basic">ОСНОВНИ</button>
                <button class="iaa-tab-btn" data-tab="advanced">РАЗШИРЕНИ</button>
                <button class="iaa-tab-btn" data-tab="features">ФУНКЦИИ</button>
                <button class="iaa-tab-btn" data-tab="analyses">АНАЛИЗИ</button>
              </div>

              <div id="iaa-tab-basic" class="iaa-tab-body">
                <div class="iaa-field-row" title="Минимална увереност за вход.">
                  <span class="iaa-field-label">Праг увереност % (0–1)</span>
                  <input type="number" inputmode="decimal" id="iaa-sniper-threshold" min="0" max="1" step="0.01" value="0.65">
                </div>
                <div class="iaa-field-row" title="Процент за смел вход при много силен сигнал.">
                  <span class="iaa-field-label">Праг за смел вход %</span>
                  <input type="number" id="iaa-sniper-override-confidence" min="0" max="100" step="1" value="90">
                </div>
                <div class="iaa-field-row" title="Базова сума на сделката в долари.">
                  <span class="iaa-field-label">Базова сума ($)</span>
                  <input type="number" id="iaa-sniper-base" min="1" step="1" value="100">
                </div>
                <div class="iaa-field-row" title="Минимален payout за допускане на сделка.">
                  <span class="iaa-field-label">Мин. изплащане %</span>
                  <input type="number" id="iaa-sniper-min-payout" min="0" max="100" step="1" value="70">
                </div>
                <div class="iaa-field-row" title="Макс. време за вход в секунда след началото на свещ.">
                  <span class="iaa-field-label">Прозорец за вход (сек)</span>
                  <input type="number" id="iaa-sniper-entry-window" min="0" max="300" step="1" value="5">
                </div>
                <div class="iaa-field-row" title="Ниво RSI за препродаденост.">
                  <span class="iaa-field-label">RSI Препродаден</span>
                  <input type="number" id="iaa-sniper-rsi-oversold" min="5" max="50" step="1" value="22">
                </div>
                <div class="iaa-field-row" title="Ниво RSI за прекупеност.">
                  <span class="iaa-field-label">RSI Прекупен</span>
                  <input type="number" id="iaa-sniper-rsi-overbought" min="50" max="95" step="1" value="78">
                </div>
                <div class="iaa-field-row" title="Макс. сделки на минута.">
                  <span class="iaa-field-label">Макс. сделки/мин</span>
                  <input type="number" id="iaa-max-trades-per-minute" min="0" step="1" value="0">
                </div>
                <div class="iaa-field-row" title="Макс. отворени сделки едновременно.">
                  <span class="iaa-field-label">Макс. отворени сделки</span>
                  <input type="number" id="iaa-max-open-trades" min="1" step="1" value="1">
                </div>
                <div class="iaa-action-row">
                  <button id="iaa-settings-save" type="button">Запази</button>
                  <button id="iaa-settings-cancel" type="button">Откажи</button>
                </div>
              </div>

              <div id="iaa-tab-advanced" class="iaa-tab-body" style="display:none;">
                <div class="iaa-field-row" title="Минимален обемен импулс за валиден сигнал.">
                  <span class="iaa-field-label">Праг обем (0–1)</span>
                  <input type="number" inputmode="decimal" id="iaa-sniper-volume-threshold" min="0" max="1" step="0.01" value="0.25">
                </div>
                <div class="iaa-field-row" title="Минимално отклонение от VWAP за активиране на вход.">
                  <span class="iaa-field-label">VWAP отклонение (0–0.003)</span>
                  <input type="number" inputmode="decimal" id="iaa-sniper-vwap" min="0" max="0.003" step="0.0001" value="0.0012">
                </div>
                <div class="iaa-field-row" title="Брой минути за VWAP прозореца.">
                  <span class="iaa-field-label">VWAP прозорец (1–30)</span>
                  <input type="number" id="iaa-sniper-vwap-lookback" min="1" max="30" step="1" value="2">
                </div>
                <div class="iaa-field-row" title="Минимален импулс за потвърждение на вход.">
                  <span class="iaa-field-label">Праг импулс (0–0.003)</span>
                  <input type="number" inputmode="decimal" id="iaa-sniper-momentum" min="0" max="0.003" step="0.0001" value="0.0014">
                </div>
                <div class="iaa-subtitle">Тежести</div>
                <div class="iaa-field-row iaa-field-toggle">
                  <label title="Активира/деактивира VWAP компонента."><input type="checkbox" id="iaa-sniper-vwap-enabled"> VWAP Вкл/Изкл</label>
                  <input type="number" inputmode="decimal" id="iaa-sniper-vwap-weight" min="0" max="1" step="0.01" value="0.55">
                </div>
                <div class="iaa-field-row iaa-field-toggle">
                  <label title="Активира/деактивира Momentum компонента."><input type="checkbox" id="iaa-sniper-momentum-enabled"> Momentum Вкл/Изкл</label>
                  <input type="number" inputmode="decimal" id="iaa-sniper-momentum-weight" min="0" max="1" step="0.01" value="0.35">
                </div>
                <div class="iaa-field-row iaa-field-toggle">
                  <label title="Активира/деактивира Volume компонента."><input type="checkbox" id="iaa-sniper-volume-enabled"> Volume Вкл/Изкл</label>
                  <input type="number" inputmode="decimal" id="iaa-sniper-volume-weight" min="0" max="1" step="0.01" value="0.10">
                </div>
                <div class="iaa-field-row iaa-field-toggle">
                  <label title="Филтър за ниска волатилност (chop)."><input type="checkbox" id="iaa-sniper-chop-enabled"> Chop Вкл/Изкл</label>
                  <input type="number" id="iaa-sniper-chop" min="0" max="1" step="0.01" value="0.7">
                </div>
                <div class="iaa-field-row" title="Праг на увереност за OTC пазари.">
                  <span class="iaa-field-label">Праг OTC (0–1)</span>
                  <input type="number" id="iaa-sniper-threshold-otc" min="0" max="1" step="0.01" value="0.65">
                </div>
                <div class="iaa-field-row" title="Праг на увереност за REAL пазари.">
                  <span class="iaa-field-label">Праг REAL (0–1)</span>
                  <input type="number" id="iaa-sniper-threshold-real" min="0" max="1" step="0.01" value="0.65">
                </div>
                <div class="iaa-field-row" title="Лимит за максимална загуба за сесия.">
                  <span class="iaa-field-label">Стоп при загуба (€)</span>
                  <input type="number" id="iaa-sniper-max-session-loss" min="0" step="1" value="0">
                </div>
                <div class="iaa-field-row" title="Лимит за поредни загуби преди пауза.">
                  <span class="iaa-field-label">Поредни загуби</span>
                  <input type="number" id="iaa-sniper-max-loss-streak" min="0" step="1" value="0">
                </div>
                <div class="iaa-field-row">
                  <label title="Разрешава няколко последователни входа при силна увереност."><input type="checkbox" id="iaa-sniper-multi-enabled"> Мулти входове</label>
                  <button id="iaa-sniper-multi-toggle" type="button" class="iaa-toggle-btn">▾</button>
                </div>
                <div id="iaa-sniper-multi-body">
                  <div class="iaa-field-row" title="Минимален процент увереност за мулти входове.">
                    <span class="iaa-field-label">Праг мулти % (0–100)</span>
                    <input type="number" id="iaa-sniper-multi-threshold" min="0" max="100" step="1" value="99">
                  </div>
                  <div class="iaa-field-row" title="Брой допълнителни входове в серия.">
                    <span class="iaa-field-label">Брой мулти (0–20)</span>
                    <input type="number" id="iaa-sniper-multi-count" min="0" max="20" step="1" value="2">
                  </div>
                  <div class="iaa-field-row" title="Процент от базовата сума за мулти входовете.">
                    <span class="iaa-field-label">Сума мулти % (0–100)</span>
                    <input type="number" id="iaa-sniper-multi-amount" min="0" max="100" step="1" value="50">
                  </div>
                </div>
              </div>

              <div id="iaa-tab-features" class="iaa-tab-body" style="display:none;">
                <label class="iaa-checkbox" title="Филтър, който отхвърля слабите обеми."><input type="checkbox" id="iaa-feature-volume-rejection"> Обемен филтър</label>
                <label class="iaa-checkbox" title="Включва VWAP анализа в решенията."><input type="checkbox" id="iaa-feature-vwap-analysis"> VWAP анализ</label>
                <label class="iaa-checkbox" title="Добавя бонус спрямо сесията."><input type="checkbox" id="iaa-feature-session-boost"> Сесийно усилване</label>
                <div class="iaa-subtitle">Таймфрейми</div>
                <div class="iaa-checkbox-grid">
                  <label title="Включва 15s в анализите."><input type="checkbox" id="iaa-feature-tf-15s"> 15s</label>
                  <label title="Включва 1m в анализите."><input type="checkbox" id="iaa-feature-tf-1m"> 1m</label>
                  <label title="Включва 3m в анализите."><input type="checkbox" id="iaa-feature-tf-3m"> 3m</label>
                  <label title="Включва 5m в анализите."><input type="checkbox" id="iaa-feature-tf-5m"> 5m</label>
                  <label title="Включва 15m в анализите."><input type="checkbox" id="iaa-feature-tf-15m"> 15m</label>
                  <label title="Включва 30m в анализите."><input type="checkbox" id="iaa-feature-tf-30m"> 30m</label>
                </div>
                <label class="iaa-checkbox" title="Автоматично синхронизиране на времето на сделки."><input type="checkbox" id="iaa-dynamic-time-toggle-settings"> Динамично време (OTC/REAL)</label>
                <label class="iaa-checkbox" title="Предотвратява приспиване на таба."><input type="checkbox" id="iaa-sniper-keep-alive"> Дръж таба активен</label>
                <label class="iaa-checkbox" title="Сменя актив при липса на сделка за зададените минути (OTC списък)."><input type="checkbox" id="iaa-idle-switch-enabled"> Авто смяна на актив при застой</label>
                <div class="iaa-field-row" title="След колко минути без сделка да смени актив.">
                  <span class="iaa-field-label">Застой (мин) (5–240)</span>
                  <input type="number" id="iaa-idle-switch-min" min="5" max="240" step="1" value="60">
                </div>
              </div>

              <div id="iaa-tab-analyses" class="iaa-tab-body" style="display:none;">
                <label class="iaa-checkbox" title="Автоматично избира стратегия с най-добри резултати."><input type="checkbox" id="iaa-strategy-auto-switch"> Авто смяна на стратегия</label>
                <div class="iaa-field-row" title="Тежест на Win Rate при избор на стратегия.">
                  <span class="iaa-field-label">Тежест WR (0–1)</span>
                  <input type="text" inputmode="decimal" id="iaa-strategy-weight-wr" min="0" max="1" step="0.05" value="0.6">
                </div>
                <div class="iaa-field-row" title="Тежест на PnL при избор на стратегия.">
                  <span class="iaa-field-label">Тежест PnL (0–1)</span>
                  <input type="text" inputmode="decimal" id="iaa-strategy-weight-pnl" min="0" max="1" step="0.05" value="0.4">
                </div>
                <div class="iaa-field-row" title="Минимален брой сделки за оценка на стратегия.">
                  <span class="iaa-field-label">Обучение (брой) (0–50)</span>
                  <input type="number" id="iaa-strategy-learning-trades" min="0" max="50" step="1" value="12">
                </div>
                <div class="iaa-field-row" title="Максимална серия загуби преди авто-пауза.">
                  <span class="iaa-field-label">Лимит загуби (1–10)</span>
                  <input type="number" id="iaa-strategy-loss-streak" min="1" max="10" step="1" value="3">
                </div>
              </div>
          </div>
        </div>

        <div id="iaa-strategies-panel">
          <button id="iaa-strategies-close">×</button>
          <div style="font-weight:700;margin-bottom:6px;">Стратегии</div>
          <label class="iaa-checkbox"><input type="checkbox" id="iaa-strategy-auto-switch-panel"> Авто смяна на стратегия</label>
          <table class="iaa-strategy-table">
            <thead>
              <tr>
                <th>Стратегия</th>
                <th>N</th>
                <th>Затворени</th>
                <th>P&L</th>
              </tr>
            </thead>
            <tbody id="iaa-strategy-table-body"></tbody>
          </table>
          <div class="iaa-subtitle">Общо представяне</div>
          <div id="iaa-strategy-summary" class="iaa-strategy-summary"></div>
          <div class="iaa-subtitle">История (последни сделки)</div>
          <table class="iaa-history-table">
            <thead>
              <tr>
                <th>Час</th>
                <th>Стратегия</th>
                <th>Резултат</th>
                <th>P&L</th>
              </tr>
            </thead>
            <tbody id="iaa-strategy-history-body"></tbody>
          </table>
          <div class="iaa-subtitle">Редакция</div>
          <div id="iaa-strategy-configs"></div>
          <div class="iaa-strategy-actions">
            <button id="iaa-strategy-download" type="button">Свали CSV</button>
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
          <div style="margin-top:10px; padding-top:8px; border-top:1px solid rgba(255,255,255,.06);">
            <div style="font-size:11px; color:#cbd5e1; margin-bottom:6px;">Калибрация</div>
            <button id="iaa-calibration-open" type="button" style="width:100%; padding:6px 8px; border-radius:6px; border:1px solid rgba(255,255,255,.12); background:#111827; color:#e5e7eb; font-size:11px; cursor:pointer;">
              Отвори калибрация
            </button>
          </div>
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
        const calibration = $id('iaa-calibration-panel');
        const strategies = $id('iaa-strategies-panel');
        if (settings) settings.style.display = 'none';
        if (mouse) mouse.style.display = 'none';
        if (debug) debug.style.display = 'none';
        if (calibration) calibration.style.display = 'none';
        if (strategies) strategies.style.display = 'none';
        S.settingsPanelOpen = false;
        S.mousePanelOpen = false;
        S.calibrationPanelOpen = false;
        S.strategiesPanelOpen = false;
      }

      const settingsToggle = $id('iaa-settings-toggle');
      const strategiesToggle = $id('iaa-strategies-toggle');
      const mouseToggle = $id('iaa-mouse-toggle');
      const settingsClose = $id('iaa-settings-close');
      const strategiesClose = $id('iaa-strategies-close');
      const mouseClose = $id('iaa-mouse-close');
      const calibrationClose = $id('iaa-calibration-close');
      const debugToggle = $id('iaa-debug-toggle');
      const debugClose = $id('iaa-debug-close');
      const debugCopy = $id('iaa-debug-copy');
      const lossCopy = $id('iaa-loss-copy');
      const debugTabStatus = $id('iaa-debug-tab-status');
      const debugTabLoss = $id('iaa-debug-tab-loss');
      const consoleCopy = $id('iaa-console-copy');
      const consoleClear = $id('iaa-console-clear');
      const calibrationFromMouse = $id('iaa-calibration-open');

      if (settingsToggle) {
        settingsToggle.addEventListener('click', () => {
          if (S.settingsPanelOpen) hidePopups();
          else { hidePopups(); showPopup('iaa-settings-panel'); S.settingsPanelOpen = true; captureSettingsSnapshot(); renderSettingsPanel(); }
        });
      }
      if (strategiesToggle) {
        strategiesToggle.addEventListener('click', () => {
          if (S.strategiesPanelOpen) hidePopups();
          else { hidePopups(); showPopup('iaa-strategies-panel'); S.strategiesPanelOpen = true; renderStrategiesPanel(); }
        });
      }
setTimeout(() => {
  const bind = (id, key, scope) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.onclick = () => iaaSetCalTarget(key, scope);
  };

  bind('iaa-cal-open', 'OPEN', 'OTC');
  bind('iaa-cal-s3', 'S3', 'OTC');
  bind('iaa-cal-s15', 'S15', 'OTC');
  bind('iaa-cal-s30', 'S30', 'OTC');
  bind('iaa-cal-m1', 'M1', 'OTC');
  bind('iaa-cal-m3', 'M3', 'OTC');
  bind('iaa-cal-m5', 'M5', 'OTC');
  bind('iaa-cal-m30', 'M30', 'OTC');

  bind('iaa-cal-real-open', 'OPEN', 'REAL');
  bind('iaa-cal-real-m1', 'M1', 'REAL');
  bind('iaa-cal-real-m3', 'M3', 'REAL');
  bind('iaa-cal-real-m5', 'M5', 'REAL');
  bind('iaa-cal-real-m30', 'M30', 'REAL');
  bind('iaa-cal-real-h1', 'H1', 'REAL');
  bind('iaa-cal-real-h4', 'H4', 'REAL');

  const dumpBtn = document.getElementById('iaa-cal-dump');
  if (dumpBtn) dumpBtn.onclick = () => {
    iaaDumpCal();
    logConsoleLine('Калибрация: координатите са в F12 Console.');
  };

  iaaEnsureExpiryCoords('OTC');
  iaaEnsureExpiryCoords('REAL');
}, 0);


      if (mouseToggle) {
        mouseToggle.addEventListener('click', () => {
          if (S.mousePanelOpen) hidePopups();
          else { hidePopups(); showPopup('iaa-mouse-panel'); S.mousePanelOpen = true; renderMousePanel(); }
        });
      }
      if (calibrationFromMouse) {
        calibrationFromMouse.addEventListener('click', () => {
          if (S.calibrationPanelOpen) hidePopups();
          else { hidePopups(); showPopup('iaa-calibration-panel'); S.calibrationPanelOpen = true; }
        });
      }

      if (debugToggle) {
        debugToggle.addEventListener('click', () => {
          const debug = $id('iaa-debug-panel');
          if (!debug) return;
          if (debug.style.display === 'block') {
            hidePopups();
          } else {
            hidePopups();
            debug.style.display = 'block';
            setDebugTab(S.debugTab || 'status');
          }
        });
      }


      if (settingsClose) settingsClose.addEventListener('click', hidePopups);
      if (strategiesClose) strategiesClose.addEventListener('click', hidePopups);
      if (mouseClose) mouseClose.addEventListener('click', hidePopups);
      if (calibrationClose) calibrationClose.addEventListener('click', hidePopups);
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
      if (lossCopy) {
        lossCopy.addEventListener('click', async () => {
          const text = formatLossAnalysisText();
          if (!text) return;
          try {
            if (navigator.clipboard?.writeText) {
              await navigator.clipboard.writeText(text);
            } else {
              const temp = document.createElement('textarea');
              temp.value = text;
              temp.setAttribute('readonly', 'readonly');
              document.body.appendChild(temp);
              temp.select();
              document.execCommand('copy');
              document.body.removeChild(temp);
            }
          } catch {}
          const original = lossCopy.textContent;
          lossCopy.textContent = 'КОПИРАНО';
          setTimeout(() => { lossCopy.textContent = original; }, 1200);
        });
      }
      if (debugTabStatus) {
        debugTabStatus.addEventListener('click', () => setDebugTab('status'));
      }
      if (debugTabLoss) {
        debugTabLoss.addEventListener('click', () => setDebugTab('loss'));
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
      if (consoleClear) {
        consoleClear.addEventListener('click', () => {
          S.consoleLines = [];
          renderConsole();
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
        const score = (isSniperMode() && Number.isFinite(S.tradeQualityScore))
          ? S.tradeQualityScore
          : Math.round((S.analysisConfidence || 0) * 100);
        const dir = S.analysisDirection ? ` ${S.analysisDirection}` : '';
        confEl.textContent = `${score}%${dir}`;
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
      const maxTradesPerMinute = await storage.get(MAX_TRADES_PER_MIN_KEY); if (typeof maxTradesPerMinute === 'number') S.maxTradesPerMinute = maxTradesPerMinute;
      const maxOpenTrades = await storage.get(MAX_OPEN_TRADES_KEY); if (typeof maxOpenTrades === 'number') S.maxOpenTrades = maxOpenTrades;
      const payoutMin = await storage.get(PAYOUT_MIN_KEY); if (typeof payoutMin === 'number') S.payoutMin = payoutMin;
      const payoutMax = await storage.get(PAYOUT_MAX_KEY); if (typeof payoutMax === 'number') S.payoutMax = payoutMax;
      const payoutRequired = await storage.get(PAYOUT_REQUIRED_KEY); if (typeof payoutRequired === 'boolean') S.payoutRequired = payoutRequired;
      const dynamicTimeEnabled = await storage.get(DYNAMIC_TIME_KEY); if (typeof dynamicTimeEnabled === 'boolean') S.dynamicExpiryEnabled = dynamicTimeEnabled;
      const idleSwitchEnabled = await storage.get(IDLE_SWITCH_ENABLED_KEY); if (typeof idleSwitchEnabled === 'boolean') S.idleSwitchEnabled = idleSwitchEnabled;
      const idleSwitchMinutes = await storage.get(IDLE_SWITCH_MIN_KEY); if (typeof idleSwitchMinutes === 'number') S.idleSwitchMinutes = idleSwitchMinutes;
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
      applySniperDefaults();
      const sniperBaseAmount = await storage.get(SNIPER_BASE_AMOUNT_KEY);
      if (typeof sniperBaseAmount === 'number') S.sniperBaseAmount = sniperBaseAmount;
      const sniperThreshold = await storage.get(SNIPER_THRESHOLD_KEY);
      if (typeof sniperThreshold === 'number') S.sniperThreshold = clamp01(sniperThreshold);
      const sniperThresholdOtc = await storage.get(SNIPER_THRESHOLD_OTC_KEY);
      if (typeof sniperThresholdOtc === 'number') S.sniperThresholdOtc = clamp01(sniperThresholdOtc);
      const sniperThresholdReal = await storage.get(SNIPER_THRESHOLD_REAL_KEY);
      if (typeof sniperThresholdReal === 'number') S.sniperThresholdReal = clamp01(sniperThresholdReal);
      const sniperChopThreshold = await storage.get(SNIPER_CHOP_KEY);
      if (typeof sniperChopThreshold === 'number') S.sniperChopThreshold = sniperChopThreshold;
      const sniperVwapDeviation = await storage.get(SNIPER_VWAP_DEV_KEY);
      if (typeof sniperVwapDeviation === 'number') S.sniperVwapDeviation = sniperVwapDeviation;
      const sniperVwapLookback = await storage.get(SNIPER_VWAP_LOOKBACK_KEY);
      if (typeof sniperVwapLookback === 'number') S.sniperVwapLookbackMin = sniperVwapLookback;
      const sniperMomentumThreshold = await storage.get(SNIPER_MOMENTUM_KEY);
      if (typeof sniperMomentumThreshold === 'number') S.sniperMomentumThreshold = sniperMomentumThreshold;
      const sniperVolumeThreshold = await storage.get(SNIPER_VOLUME_THRESHOLD_KEY);
      if (typeof sniperVolumeThreshold === 'number') S.sniperVolumeThreshold = sniperVolumeThreshold;
      const sniperEmaFast = await storage.get(SNIPER_EMA_FAST_KEY);
      if (typeof sniperEmaFast === 'number') S.sniperEmaFast = Math.max(2, Math.round(sniperEmaFast));
      const sniperEmaSlow = await storage.get(SNIPER_EMA_SLOW_KEY);
      if (typeof sniperEmaSlow === 'number') S.sniperEmaSlow = Math.max(5, Math.round(sniperEmaSlow));
      const sniperRsiOversold = await storage.get(SNIPER_RSI_OVERSOLD_KEY);
      if (typeof sniperRsiOversold === 'number') S.sniperRsiOversold = Math.max(5, Math.min(50, Math.round(sniperRsiOversold)));
      const sniperRsiOverbought = await storage.get(SNIPER_RSI_OVERBOUGHT_KEY);
      if (typeof sniperRsiOverbought === 'number') S.sniperRsiOverbought = Math.max(50, Math.min(95, Math.round(sniperRsiOverbought)));
      const sniperVwapWeight = await storage.get(SNIPER_VWAP_WEIGHT_KEY);
      if (typeof sniperVwapWeight === 'number') S.sniperVwapWeight = sniperVwapWeight;
      const sniperMomentumWeight = await storage.get(SNIPER_MOMENTUM_WEIGHT_KEY);
      if (typeof sniperMomentumWeight === 'number') S.sniperMomentumWeight = sniperMomentumWeight;
      const sniperVolumeWeight = await storage.get(SNIPER_VOLUME_WEIGHT_KEY);
      if (typeof sniperVolumeWeight === 'number') S.sniperVolumeWeight = sniperVolumeWeight;
      const sniperVwapEnabled = await storage.get(SNIPER_VWAP_ENABLED_KEY);
      if (typeof sniperVwapEnabled === 'boolean') S.sniperVwapEnabled = sniperVwapEnabled;
      const sniperMomentumEnabled = await storage.get(SNIPER_MOMENTUM_ENABLED_KEY);
      if (typeof sniperMomentumEnabled === 'boolean') S.sniperMomentumEnabled = sniperMomentumEnabled;
      const sniperVolumeEnabled = await storage.get(SNIPER_VOLUME_ENABLED_KEY);
      if (typeof sniperVolumeEnabled === 'boolean') S.sniperVolumeEnabled = sniperVolumeEnabled;
      const sniperChopEnabled = await storage.get(SNIPER_CHOP_ENABLED_KEY);
      if (typeof sniperChopEnabled === 'boolean') S.sniperChopEnabled = sniperChopEnabled;
      const sniperOverrideConfidencePct = await storage.get(SNIPER_OVERRIDE_CONF_PCT_KEY);
      if (typeof sniperOverrideConfidencePct === 'number') S.sniperOverrideConfidencePct = sniperOverrideConfidencePct;
      const sniperMultiThresholdPct = await storage.get(SNIPER_MULTI_THRESHOLD_KEY);
      if (typeof sniperMultiThresholdPct === 'number') S.sniperMultiThresholdPct = sniperMultiThresholdPct;
      const sniperMultiCount = await storage.get(SNIPER_MULTI_COUNT_KEY);
      if (typeof sniperMultiCount === 'number') S.sniperMultiCount = sniperMultiCount;
      const sniperMultiAmountPct = await storage.get(SNIPER_MULTI_AMOUNT_PCT_KEY);
      if (typeof sniperMultiAmountPct === 'number') S.sniperMultiAmountPct = sniperMultiAmountPct;
      const sniperMultiEnabled = await storage.get(SNIPER_MULTI_ENABLED_KEY);
      if (typeof sniperMultiEnabled === 'boolean') S.sniperMultiEnabled = sniperMultiEnabled;
      const savedTimeframes = await storage.get(SNIPER_TIMEFRAMES_KEY);
      if (savedTimeframes && typeof savedTimeframes === 'object') {
        S.sniperEnabledTimeframes = Object.assign({}, S.sniperEnabledTimeframes, savedTimeframes);
      }
      const featureVolumeRejection = await storage.get(FEATURE_VOLUME_REJECTION_KEY);
      if (typeof featureVolumeRejection === 'boolean') S.featureVolumeRejection = featureVolumeRejection;
      const featureVwapAnalysis = await storage.get(FEATURE_VWAP_ANALYSIS_KEY);
      if (typeof featureVwapAnalysis === 'boolean') S.featureVwapAnalysis = featureVwapAnalysis;
      const featureSessionBoost = await storage.get(FEATURE_SESSION_BOOST_KEY);
      if (typeof featureSessionBoost === 'boolean') S.featureSessionBoost = featureSessionBoost;
      const featureTimeframes = await storage.get(FEATURE_TIMEFRAMES_KEY);
      if (featureTimeframes && typeof featureTimeframes === 'object') {
        S.featureTimeframes = Object.assign({}, S.featureTimeframes, featureTimeframes);
      }
      const autoSwitchStrategy = await storage.get(STRATEGY_AUTO_SWITCH_KEY);
      if (typeof autoSwitchStrategy === 'boolean') S.autoSwitchStrategy = autoSwitchStrategy;
      const strategyWrWeight = await storage.get(STRATEGY_WR_WEIGHT_KEY);
      if (typeof strategyWrWeight === 'number') S.strategyWeightWr = strategyWrWeight;
      const strategyPnlWeight = await storage.get(STRATEGY_PNL_WEIGHT_KEY);
      if (typeof strategyPnlWeight === 'number') S.strategyWeightPnl = strategyPnlWeight;
      const strategyLearningTrades = await storage.get(STRATEGY_LEARNING_TRADES_KEY);
      if (typeof strategyLearningTrades === 'number') S.strategyLearningTrades = strategyLearningTrades;
      const strategyLossStreakLimit = await storage.get(STRATEGY_LOSS_STREAK_LIMIT_KEY);
      if (typeof strategyLossStreakLimit === 'number') S.strategyLossStreakLimit = strategyLossStreakLimit;
      const strategyConfigs = await storage.get(STRATEGY_CONFIG_KEY);
      if (strategyConfigs && typeof strategyConfigs === 'object') {
        S.strategyConfigs = Object.assign({}, S.strategyConfigs, strategyConfigs);
      }
      const regimeStrength = await storage.get(REGIME_STRENGTH_KEY);
      if (typeof regimeStrength === 'number') S.regimeStrength = clamp01(regimeStrength);
      const confirmationStrength = await storage.get(CONFIRMATION_STRENGTH_KEY);
      if (typeof confirmationStrength === 'number') S.confirmationStrength = clamp01(confirmationStrength);
      const biasStrength = await storage.get(BIAS_STRENGTH_KEY);
      if (typeof biasStrength === 'number') S.biasStrength = clamp01(biasStrength);
      const biasTf1m = await storage.get(BIAS_TF_1M_KEY);
      if (typeof biasTf1m === 'boolean') S.biasTimeframes['1m'] = biasTf1m;
      const biasTf3m = await storage.get(BIAS_TF_3M_KEY);
      if (typeof biasTf3m === 'boolean') S.biasTimeframes['3m'] = biasTf3m;
      const biasTf5m = await storage.get(BIAS_TF_5M_KEY);
      if (typeof biasTf5m === 'boolean') S.biasTimeframes['5m'] = biasTf5m;
      const biasTf30m = await storage.get(BIAS_TF_30M_KEY);
      if (typeof biasTf30m === 'boolean') S.biasTimeframes['30m'] = biasTf30m;
      const conflictStrength = await storage.get(CONFLICT_STRENGTH_KEY);
      if (typeof conflictStrength === 'number') S.conflictStrength = clamp01(conflictStrength);
    }

    function persistSettings(){
      storage.set(BASE_AMOUNT_KEY, S.baseAmount ?? 100);
      storage.set(EXPIRY_KEY, S.expirySetting);
      storage.set(ANALYSIS_ENABLED_KEY, S.analysisEnabled);
      storage.set(ANALYSIS_CONFIDENCE_KEY, S.analysisConfidenceThreshold);
      storage.set(TRADE_INTERVAL_MIN_KEY, S.tradeIntervalMin);
      storage.set(MAX_TRADES_PER_MIN_KEY, S.maxTradesPerMinute);
      storage.set(MAX_OPEN_TRADES_KEY, S.maxOpenTrades);
      storage.set(PAYOUT_MIN_KEY, S.payoutMin);
      storage.set(PAYOUT_MAX_KEY, S.payoutMax);
      storage.set(PAYOUT_REQUIRED_KEY, S.payoutRequired);
      storage.set(DYNAMIC_TIME_KEY, S.dynamicExpiryEnabled);
      storage.set(IDLE_SWITCH_ENABLED_KEY, S.idleSwitchEnabled);
      storage.set(IDLE_SWITCH_MIN_KEY, S.idleSwitchMinutes);
      storage.set(MAX_TRADE_AMOUNT_KEY, S.maxTradeAmountCents);
      storage.set(MAX_TRADE_MULTIPLIER_KEY, S.maxTradeAmountMultiplier);
      storage.set(ANALYSIS_WINDOW_SEC_KEY, S.analysisWindowSec);
      storage.set(ANALYSIS_WARMUP_MIN_KEY, S.analysisWarmupMin);
      storage.set(SELF_TRADE_ENABLED_KEY, S.selfTradeEnabled);
      storage.set(SIGNAL_SOURCE_1M_KEY, S.signalSourceEnabled['1m']);
      storage.set(SIGNAL_SOURCE_5M_KEY, S.signalSourceEnabled['5m']);
      storage.set(SIGNAL_TIME_OFFSET_MIN_KEY, S.signalTimeOffsetMin);
      storage.set(BUY_SELL_METHOD_KEY, S.buySellMethod);
      storage.set(XPATH_SELECTORS_KEY, S.xpathSelectors);
      storage.set(MODE_KEY, getActiveMode());
      storage.set(SNIPER_KEEP_ALIVE_KEY, S.sniperKeepAliveEnabled);
      storage.set(SNIPER_BASE_AMOUNT_KEY, S.sniperBaseAmount);
      storage.set(SNIPER_THRESHOLD_KEY, S.sniperThreshold);
      storage.set(SNIPER_THRESHOLD_OTC_KEY, S.sniperThresholdOtc);
      storage.set(SNIPER_THRESHOLD_REAL_KEY, S.sniperThresholdReal);
      storage.set(SNIPER_CHOP_KEY, S.sniperChopThreshold);
      storage.set(SNIPER_VWAP_DEV_KEY, S.sniperVwapDeviation);
      storage.set(SNIPER_VWAP_LOOKBACK_KEY, S.sniperVwapLookbackMin);
      storage.set(SNIPER_MOMENTUM_KEY, S.sniperMomentumThreshold);
      storage.set(SNIPER_VOLUME_THRESHOLD_KEY, S.sniperVolumeThreshold);
      storage.set(SNIPER_EMA_FAST_KEY, S.sniperEmaFast);
      storage.set(SNIPER_EMA_SLOW_KEY, S.sniperEmaSlow);
      storage.set(SNIPER_RSI_OVERSOLD_KEY, S.sniperRsiOversold);
      storage.set(SNIPER_RSI_OVERBOUGHT_KEY, S.sniperRsiOverbought);
      storage.set(SNIPER_VWAP_WEIGHT_KEY, S.sniperVwapWeight);
      storage.set(SNIPER_MOMENTUM_WEIGHT_KEY, S.sniperMomentumWeight);
      storage.set(SNIPER_VOLUME_WEIGHT_KEY, S.sniperVolumeWeight);
      storage.set(SNIPER_VWAP_ENABLED_KEY, S.sniperVwapEnabled);
      storage.set(SNIPER_MOMENTUM_ENABLED_KEY, S.sniperMomentumEnabled);
      storage.set(SNIPER_VOLUME_ENABLED_KEY, S.sniperVolumeEnabled);
      storage.set(SNIPER_CHOP_ENABLED_KEY, S.sniperChopEnabled);
      storage.set(SNIPER_OVERRIDE_CONF_PCT_KEY, S.sniperOverrideConfidencePct);
      storage.set(SNIPER_MULTI_THRESHOLD_KEY, S.sniperMultiThresholdPct);
      storage.set(SNIPER_MULTI_COUNT_KEY, S.sniperMultiCount);
      storage.set(SNIPER_MULTI_AMOUNT_PCT_KEY, S.sniperMultiAmountPct);
      storage.set(SNIPER_MULTI_ENABLED_KEY, !!S.sniperMultiEnabled);
      storage.set(SNIPER_TIMEFRAMES_KEY, S.sniperEnabledTimeframes);
      storage.set(FEATURE_VOLUME_REJECTION_KEY, S.featureVolumeRejection);
      storage.set(FEATURE_VWAP_ANALYSIS_KEY, S.featureVwapAnalysis);
      storage.set(FEATURE_SESSION_BOOST_KEY, S.featureSessionBoost);
      storage.set(FEATURE_TIMEFRAMES_KEY, S.featureTimeframes);
      storage.set(STRATEGY_AUTO_SWITCH_KEY, S.autoSwitchStrategy);
      storage.set(STRATEGY_WR_WEIGHT_KEY, S.strategyWeightWr);
      storage.set(STRATEGY_PNL_WEIGHT_KEY, S.strategyWeightPnl);
      storage.set(STRATEGY_LEARNING_TRADES_KEY, S.strategyLearningTrades);
      storage.set(STRATEGY_LOSS_STREAK_LIMIT_KEY, S.strategyLossStreakLimit);
      storage.set(STRATEGY_CONFIG_KEY, S.strategyConfigs);
      storage.set(REGIME_STRENGTH_KEY, S.regimeStrength);
      storage.set(CONFIRMATION_STRENGTH_KEY, S.confirmationStrength);
      storage.set(BIAS_STRENGTH_KEY, S.biasStrength);
      storage.set(BIAS_TF_1M_KEY, !!S.biasTimeframes['1m']);
      storage.set(BIAS_TF_3M_KEY, !!S.biasTimeframes['3m']);
      storage.set(BIAS_TF_5M_KEY, !!S.biasTimeframes['5m']);
      storage.set(BIAS_TF_30M_KEY, !!S.biasTimeframes['30m']);
      storage.set(CONFLICT_STRENGTH_KEY, S.conflictStrength);
    }

    function captureSettingsSnapshot() {
      S.settingsSnapshot = {
        sniperThreshold: S.sniperThreshold,
        sniperThresholdOtc: S.sniperThresholdOtc,
        sniperThresholdReal: S.sniperThresholdReal,
        sniperOverrideConfidencePct: S.sniperOverrideConfidencePct,
        sniperBaseAmount: S.sniperBaseAmount,
        sniperMinPayout: S.sniperMinPayout,
        sniperEntryWindowSec: S.sniperEntryWindowSec,
        sniperRsiOversold: S.sniperRsiOversold,
        sniperRsiOverbought: S.sniperRsiOverbought,
        maxTradesPerMinute: S.maxTradesPerMinute,
        maxOpenTrades: S.maxOpenTrades,
        sniperVolumeThreshold: S.sniperVolumeThreshold,
        sniperVwapDeviation: S.sniperVwapDeviation,
        sniperVwapLookbackMin: S.sniperVwapLookbackMin,
        sniperMomentumThreshold: S.sniperMomentumThreshold,
        sniperVwapEnabled: S.sniperVwapEnabled,
        sniperMomentumEnabled: S.sniperMomentumEnabled,
        sniperVolumeEnabled: S.sniperVolumeEnabled,
        sniperChopEnabled: S.sniperChopEnabled,
        sniperVwapWeight: S.sniperVwapWeight,
        sniperMomentumWeight: S.sniperMomentumWeight,
        sniperVolumeWeight: S.sniperVolumeWeight,
        sniperChopThreshold: S.sniperChopThreshold,
        sniperMultiEnabled: S.sniperMultiEnabled,
        sniperMultiThresholdPct: S.sniperMultiThresholdPct,
        sniperMultiCount: S.sniperMultiCount,
        sniperMultiAmountPct: S.sniperMultiAmountPct,
        featureVolumeRejection: S.featureVolumeRejection,
        featureVwapAnalysis: S.featureVwapAnalysis,
        featureSessionBoost: S.featureSessionBoost,
        featureTimeframes: { ...(S.featureTimeframes || {}) },
        dynamicExpiryEnabled: S.dynamicExpiryEnabled,
        sniperKeepAliveEnabled: S.sniperKeepAliveEnabled,
        idleSwitchEnabled: S.idleSwitchEnabled,
        idleSwitchMinutes: S.idleSwitchMinutes,
        autoSwitchStrategy: S.autoSwitchStrategy,
        strategyWeightWr: S.strategyWeightWr,
        strategyWeightPnl: S.strategyWeightPnl,
        strategyLearningTrades: S.strategyLearningTrades,
        strategyLossStreakLimit: S.strategyLossStreakLimit
      };
    }

    function restoreSettingsSnapshot() {
      if (!S.settingsSnapshot) return;
      Object.assign(S, S.settingsSnapshot);
      persistSettings();
      renderSettingsPanel();
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
      const sniperSettingsBody = $id('iaa-sniper-settings-body');
      const sniperCollapse = $id('iaa-sniper-collapse');
      const sniperWeightsToggle = $id('iaa-sniper-weights-toggle');
      const sniperWeightsBody = $id('iaa-sniper-weights-body');
      const sniperMultiToggle = $id('iaa-sniper-multi-toggle');
      const sniperMultiBody = $id('iaa-sniper-multi-body');
      const sniperSmartToggle = $id('iaa-sniper-smart-toggle');
      const sniperSmartBody = $id('iaa-sniper-smart-body');
      const sniperEngineToggle = $id('iaa-sniper-engine-toggle');
      const sniperEngineBody = $id('iaa-sniper-engine-body');
      const sniperRiskToggle = $id('iaa-sniper-risk-toggle');
      const sniperRiskBody = $id('iaa-sniper-risk-body');
      const sniperMultiEnabled = $id('iaa-sniper-multi-enabled');
      const sniperThreshold = $id('iaa-sniper-threshold');
      const sniperThresholdOtc = $id('iaa-sniper-threshold-otc');
      const sniperThresholdReal = $id('iaa-sniper-threshold-real');
      const sniperBase = $id('iaa-sniper-base');
      const sniperMinPayout = $id('iaa-sniper-min-payout');
      const sniperEntryWindow = $id('iaa-sniper-entry-window');
      const sniperChop = $id('iaa-sniper-chop');
      const sniperWarmup = $id('iaa-sniper-warmup');
      const sniperMaxSessionLoss = $id('iaa-sniper-max-session-loss');
      const sniperMaxLossStreak = $id('iaa-sniper-max-loss-streak');
      const sniperEmaFast = $id('iaa-sniper-ema-fast');
      const sniperEmaSlow = $id('iaa-sniper-ema-slow');
      const sniperRsiOversold = $id('iaa-sniper-rsi-oversold');
      const sniperRsiOverbought = $id('iaa-sniper-rsi-overbought');
      const sniperVwap = $id('iaa-sniper-vwap');
      const sniperMomentum = $id('iaa-sniper-momentum');
      const sniperVwapLookback = $id('iaa-sniper-vwap-lookback');
      const sniperVolumeThreshold = $id('iaa-sniper-volume-threshold');
      const sniperVwapWeight = $id('iaa-sniper-vwap-weight');
      const sniperMomentumWeight = $id('iaa-sniper-momentum-weight');
      const sniperVolumeWeight = $id('iaa-sniper-volume-weight');
      const sniperVwapEnabled = $id('iaa-sniper-vwap-enabled');
      const sniperMomentumEnabled = $id('iaa-sniper-momentum-enabled');
      const sniperVolumeEnabled = $id('iaa-sniper-volume-enabled');
      const sniperChopEnabled = $id('iaa-sniper-chop-enabled');
      const sniperOverrideConfidence = $id('iaa-sniper-override-confidence');
      const sniperTf15 = $id('iaa-sniper-tf-15s');
      const sniperTf30 = $id('iaa-sniper-tf-30s');
      const sniperTf1m = $id('iaa-sniper-tf-1m');
      const sniperTf3m = $id('iaa-sniper-tf-3m');
      const sniperTf5m = $id('iaa-sniper-tf-5m');
      const sniperTf30m = $id('iaa-sniper-tf-30m');
      const sniperTf3s = $id('iaa-sniper-tf-3s');
      const sniperKeepAlive = $id('iaa-sniper-keep-alive');
      const sniperMultiThreshold = $id('iaa-sniper-multi-threshold');
      const sniperMultiCount = $id('iaa-sniper-multi-count');
      const sniperMultiAmount = $id('iaa-sniper-multi-amount');
      const dynamicTimeToggleSettings = $id('iaa-dynamic-time-toggle-settings');
      const featureVolumeRejection = $id('iaa-feature-volume-rejection');
      const featureVwapAnalysis = $id('iaa-feature-vwap-analysis');
      const featureSessionBoost = $id('iaa-feature-session-boost');
      const featureTf15s = $id('iaa-feature-tf-15s');
      const featureTf1m = $id('iaa-feature-tf-1m');
      const featureTf3m = $id('iaa-feature-tf-3m');
      const featureTf5m = $id('iaa-feature-tf-5m');
      const featureTf15m = $id('iaa-feature-tf-15m');
      const featureTf30m = $id('iaa-feature-tf-30m');
      const idleSwitchEnabled = $id('iaa-idle-switch-enabled');
      const idleSwitchMin = $id('iaa-idle-switch-min');
      const strategyAutoSwitch = $id('iaa-strategy-auto-switch');
      const strategyWeightWr = $id('iaa-strategy-weight-wr');
      const strategyWeightPnl = $id('iaa-strategy-weight-pnl');
      const strategyLearningTrades = $id('iaa-strategy-learning-trades');
      const strategyLossStreak = $id('iaa-strategy-loss-streak');
      const maxTradesPerMinute = $id('iaa-max-trades-per-minute');
      const maxOpenTrades = $id('iaa-max-open-trades');
      const regimeStrength = $id('iaa-regime-strength');
      const confirmationStrength = $id('iaa-confirmation-strength');
      const biasStrength = $id('iaa-bias-strength');
      const biasTf1m = $id('iaa-bias-tf-1m');
      const biasTf3m = $id('iaa-bias-tf-3m');
      const biasTf5m = $id('iaa-bias-tf-5m');
      const biasTf30m = $id('iaa-bias-tf-30m');
      const conflictStrength = $id('iaa-conflict-strength');

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
      if (sniper5sSettings) sniper5sSettings.style.display = 'block';
      if (sniperThreshold) sniperThreshold.value = S.sniperThreshold ?? 0.7;
      if (sniperThresholdOtc) sniperThresholdOtc.value = S.sniperThresholdOtc ?? S.sniperThreshold ?? 0.7;
      if (sniperThresholdReal) sniperThresholdReal.value = S.sniperThresholdReal ?? S.sniperThreshold ?? 0.7;
      if (sniperBase) sniperBase.value = (S.sniperBaseAmount ?? 10000) / 100;
      if (sniperMinPayout) sniperMinPayout.value = S.sniperMinPayout ?? 85;
      if (sniperEntryWindow) sniperEntryWindow.value = S.sniperEntryWindowSec ?? 5;
      if (sniperChop) sniperChop.value = S.sniperChopThreshold ?? 0.7;
      if (sniperWarmup) sniperWarmup.value = S.sniperWarmupMin ?? 10;
      if (sniperMaxSessionLoss) sniperMaxSessionLoss.value = (S.maxSessionLossCents || 0) / 100;
      if (sniperMaxLossStreak) sniperMaxLossStreak.value = S.maxConsecutiveLosses || 0;
      if (sniperVwap) sniperVwap.value = S.sniperVwapDeviation ?? SNIPER_5S_DEFAULTS.vwapDeviation;
      if (sniperMomentum) sniperMomentum.value = S.sniperMomentumThreshold ?? SNIPER_5S_DEFAULTS.momentumThreshold;
      if (sniperVwapLookback) sniperVwapLookback.value = S.sniperVwapLookbackMin ?? SNIPER_5S_DEFAULTS.vwapLookbackMin;
      if (sniperVolumeThreshold) sniperVolumeThreshold.value = S.sniperVolumeThreshold ?? SNIPER_5S_DEFAULTS.volumeThreshold;
      if (sniperVwapEnabled) sniperVwapEnabled.checked = !!S.sniperVwapEnabled;
      if (sniperMomentumEnabled) sniperMomentumEnabled.checked = !!S.sniperMomentumEnabled;
      if (sniperVolumeEnabled) sniperVolumeEnabled.checked = !!S.sniperVolumeEnabled;
      if (sniperChopEnabled) sniperChopEnabled.checked = !!S.sniperChopEnabled;
      if (sniperVwapWeight) sniperVwapWeight.value = S.sniperVwapWeight ?? 0.55;
      if (sniperMomentumWeight) sniperMomentumWeight.value = S.sniperMomentumWeight ?? 0.35;
      if (sniperVolumeWeight) sniperVolumeWeight.value = S.sniperVolumeWeight ?? 0.1;
      if (sniperEmaFast) sniperEmaFast.value = S.sniperEmaFast ?? SNIPER_5S_DEFAULTS.emaFast;
      if (sniperEmaSlow) sniperEmaSlow.value = S.sniperEmaSlow ?? SNIPER_5S_DEFAULTS.emaSlow;
      if (sniperRsiOversold) sniperRsiOversold.value = S.sniperRsiOversold ?? SNIPER_5S_DEFAULTS.rsiOversold;
      if (sniperRsiOverbought) sniperRsiOverbought.value = S.sniperRsiOverbought ?? SNIPER_5S_DEFAULTS.rsiOverbought;
      if (sniperOverrideConfidence) {
        const overrideValue = S.sniperOverrideConfidencePct ?? 90;
        sniperOverrideConfidence.value = overrideValue;
        applyPercentColor(sniperOverrideConfidence, overrideValue);
      }
      if (sniperTf3s) sniperTf3s.checked = S.sniperEnabledTimeframes['3s'];
      if (sniperTf15) sniperTf15.checked = S.sniperEnabledTimeframes['15s'];
      if (sniperTf30) sniperTf30.checked = S.sniperEnabledTimeframes['30s'];
      if (sniperTf1m) sniperTf1m.checked = S.sniperEnabledTimeframes['1m'];
      if (sniperTf3m) sniperTf3m.checked = S.sniperEnabledTimeframes['3m'];
      if (sniperTf5m) sniperTf5m.checked = S.sniperEnabledTimeframes['5m'];
      if (sniperTf30m) sniperTf30m.checked = S.sniperEnabledTimeframes['30m'];
      if (sniperKeepAlive) sniperKeepAlive.checked = S.sniperKeepAliveEnabled;
      if (sniperMultiThreshold) sniperMultiThreshold.value = S.sniperMultiThresholdPct ?? 99;
      if (sniperMultiCount) sniperMultiCount.value = S.sniperMultiCount ?? 2;
      if (sniperMultiAmount) sniperMultiAmount.value = S.sniperMultiAmountPct ?? 50;
      if (sniperMultiEnabled) sniperMultiEnabled.checked = !!S.sniperMultiEnabled;
      if (dynamicTimeToggleSettings) dynamicTimeToggleSettings.checked = !!S.dynamicExpiryEnabled;
      if (featureVolumeRejection) featureVolumeRejection.checked = !!S.featureVolumeRejection;
      if (featureVwapAnalysis) featureVwapAnalysis.checked = !!S.featureVwapAnalysis;
      if (featureSessionBoost) featureSessionBoost.checked = !!S.featureSessionBoost;
      if (featureTf15s) featureTf15s.checked = !!S.featureTimeframes?.['15s'];
      if (featureTf1m) featureTf1m.checked = !!S.featureTimeframes?.['1m'];
      if (featureTf3m) featureTf3m.checked = !!S.featureTimeframes?.['3m'];
      if (featureTf5m) featureTf5m.checked = !!S.featureTimeframes?.['5m'];
      if (featureTf15m) featureTf15m.checked = !!S.featureTimeframes?.['15m'];
      if (featureTf30m) featureTf30m.checked = !!S.featureTimeframes?.['30m'];
      if (idleSwitchEnabled) idleSwitchEnabled.checked = !!S.idleSwitchEnabled;
      if (idleSwitchMin) idleSwitchMin.value = S.idleSwitchMinutes ?? 60;
      if (strategyAutoSwitch) strategyAutoSwitch.checked = !!S.autoSwitchStrategy;
      if (strategyWeightWr) strategyWeightWr.value = (S.strategyWeightWr ?? STRATEGY_DEFAULTS.wrWeight).toFixed(2);
      if (strategyWeightPnl) strategyWeightPnl.value = (S.strategyWeightPnl ?? STRATEGY_DEFAULTS.pnlWeight).toFixed(2);
      if (strategyLearningTrades) strategyLearningTrades.value = S.strategyLearningTrades ?? STRATEGY_DEFAULTS.learningTrades;
      if (strategyLossStreak) strategyLossStreak.value = S.strategyLossStreakLimit ?? STRATEGY_DEFAULTS.lossStreakLimit;
      if (maxTradesPerMinute) maxTradesPerMinute.value = S.maxTradesPerMinute ?? 0;
      if (maxOpenTrades) maxOpenTrades.value = S.maxOpenTrades ?? 1;
      if (regimeStrength) regimeStrength.value = (S.regimeStrength ?? 0.6).toFixed(2);
      if (confirmationStrength) confirmationStrength.value = (S.confirmationStrength ?? 0.7).toFixed(2);
      if (biasStrength) biasStrength.value = (S.biasStrength ?? 0.6).toFixed(2);
      if (biasTf1m) biasTf1m.checked = !!S.biasTimeframes?.['1m'];
      if (biasTf3m) biasTf3m.checked = !!S.biasTimeframes?.['3m'];
      if (biasTf5m) biasTf5m.checked = !!S.biasTimeframes?.['5m'];
      if (biasTf30m) biasTf30m.checked = !!S.biasTimeframes?.['30m'];
      if (conflictStrength) conflictStrength.value = (S.conflictStrength ?? 0.6).toFixed(2);
      const vwapMax = (SNIPER_5S_DEFAULTS.vwapDeviation || 0.0012) * 2;
      const momentumMax = (SNIPER_5S_DEFAULTS.momentumThreshold || 0.0014) * 2;
      if (sniperThreshold) applyStrictnessColor(sniperThreshold, parseNumberFlexible(sniperThreshold.value), { min: 0, max: 1, highIsStrict: true });
      if (sniperThresholdOtc) applyStrictnessColor(sniperThresholdOtc, parseNumberFlexible(sniperThresholdOtc.value), { min: 0, max: 1, highIsStrict: true });
      if (sniperThresholdReal) applyStrictnessColor(sniperThresholdReal, parseNumberFlexible(sniperThresholdReal.value), { min: 0, max: 1, highIsStrict: true });
      if (sniperVwap) applyStrictnessColor(sniperVwap, parseNumberFlexible(sniperVwap.value), { min: 0, max: vwapMax, highIsStrict: true });
      if (sniperMomentum) applyStrictnessColor(sniperMomentum, parseNumberFlexible(sniperMomentum.value), { min: 0, max: momentumMax, highIsStrict: true });
      if (sniperVwapWeight) applyStrictnessColor(sniperVwapWeight, parseNumberFlexible(sniperVwapWeight.value), { min: 0, max: 1, highIsStrict: true });
      if (sniperMomentumWeight) applyStrictnessColor(sniperMomentumWeight, parseNumberFlexible(sniperMomentumWeight.value), { min: 0, max: 1, highIsStrict: false });
      if (sniperVolumeWeight) applyStrictnessColor(sniperVolumeWeight, parseNumberFlexible(sniperVolumeWeight.value), { min: 0, max: 1, highIsStrict: false });
      if (sniperChop) applyStrictnessColor(sniperChop, parseNumberFlexible(sniperChop.value), { min: 0, max: 1, highIsStrict: true });
      if (sniperVolumeThreshold) applyStrictnessColor(sniperVolumeThreshold, parseNumberFlexible(sniperVolumeThreshold.value), { min: 0, max: 1, highIsStrict: true });
      if (strategyWeightWr) applyStrictnessColor(strategyWeightWr, parseNumberFlexible(strategyWeightWr.value), { min: 0, max: 1, highIsStrict: false });
      if (strategyWeightPnl) applyStrictnessColor(strategyWeightPnl, parseNumberFlexible(strategyWeightPnl.value), { min: 0, max: 1, highIsStrict: false });
      if (regimeStrength) applyStrictnessColor(regimeStrength, parseNumberFlexible(regimeStrength.value), { min: 0, max: 1, highIsStrict: true });
      if (confirmationStrength) applyStrictnessColor(confirmationStrength, parseNumberFlexible(confirmationStrength.value), { min: 0, max: 1, highIsStrict: true });
      if (biasStrength) applyStrictnessColor(biasStrength, parseNumberFlexible(biasStrength.value), { min: 0, max: 1, highIsStrict: true });
      if (conflictStrength) applyStrictnessColor(conflictStrength, parseNumberFlexible(conflictStrength.value), { min: 0, max: 1, highIsStrict: true });

      if (sniperSettingsBody) sniperSettingsBody.style.display = S.sniperSettingsCollapsed ? 'none' : 'block';
      if (sniperCollapse) sniperCollapse.textContent = S.sniperSettingsCollapsed ? '▸' : '▾';
      if (sniperWeightsBody) sniperWeightsBody.style.display = S.sniperWeightsCollapsed ? 'none' : 'block';
      if (sniperWeightsToggle) sniperWeightsToggle.textContent = S.sniperWeightsCollapsed ? '▸' : '▾';
      if (sniperMultiBody) sniperMultiBody.style.display = S.sniperMultiCollapsed ? 'none' : 'block';
      if (sniperMultiToggle) sniperMultiToggle.textContent = S.sniperMultiCollapsed ? '▸' : '▾';
      if (sniperSmartBody) sniperSmartBody.style.display = S.sniperSmartCollapsed ? 'none' : 'block';
      if (sniperSmartToggle) sniperSmartToggle.textContent = S.sniperSmartCollapsed ? '▸' : '▾';
      if (sniperEngineBody) sniperEngineBody.style.display = S.sniperEngineCollapsed ? 'none' : 'block';
      if (sniperEngineToggle) sniperEngineToggle.textContent = S.sniperEngineCollapsed ? '▸' : '▾';
      if (sniperRiskBody) sniperRiskBody.style.display = S.sniperRiskCollapsed ? 'none' : 'block';
      if (sniperRiskToggle) sniperRiskToggle.textContent = S.sniperRiskCollapsed ? '▸' : '▾';

      if (modeSignals && modeSniper) {
        const sniperMode = isSniperMode();
        modeSignals.style.background = sniperMode ? '#111827' : '#16a34a';
        modeSignals.style.color = sniperMode ? '#fff' : '#052e16';
        modeSniper.style.background = sniperMode ? '#16a34a' : '#111827';
        modeSniper.style.color = sniperMode ? '#052e16' : '#fff';
      }
      if (signalsPanel) signalsPanel.style.display = isSniperMode() ? 'none' : 'block';
      if (sniperPanel) sniperPanel.style.display = isSniperMode() ? 'block' : 'none';
      const tabBodies = {
        basic: $id('iaa-tab-basic'),
        advanced: $id('iaa-tab-advanced'),
        features: $id('iaa-tab-features'),
        analyses: $id('iaa-tab-analyses')
      };
      $$('.iaa-tab-btn').forEach((btn) => {
        const tab = btn.getAttribute('data-tab');
        const isActive = tab === S.sniperSettingsTab;
        btn.classList.toggle('active', isActive);
        const body = tabBodies[tab];
        if (body) body.style.display = isActive ? 'block' : 'none';
      });
      applySettingsTranslations();
      setStatusOverlay(formatStatus('looking_for_opportunity'), '', false);
      renderConsole();
      applyStatusLabels();
      renderTradeStats();
    }

    function ensurePanelHandlers(){
      const toggleBtn = $id('iaa-toggle');
      const autoBtn = $id('iaa-auto');
      const gridToggle = $id('iaa-grid-toggle');
      const dynamicTimeToggle = $id('iaa-dynamic-time-toggle');
      const dynamicTimeToggleSettings = $id('iaa-dynamic-time-toggle-settings');
      const closeSettingsPanel = () => {
        const panel = $id('iaa-settings-panel');
        if (panel) panel.style.display = 'none';
        S.settingsPanelOpen = false;
      };

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
            S.tradeStatsByExpiry = {};
            S.tradeStatsMulti = initTradeStatsBucket();
            S.tradeStatsSummary = initTradeStatsBucket();
            S.tradeHistorySeen = new Set();
            S.tradeHistorySeenElements = new WeakSet();
            S.tradeTimestamps = [];
            S.strategyStats = {};
            S.strategyTradeCount = 0;
            S.lossReports = [];
            renderTradeStats();
            
            const startBal = readBalanceCents();
            if (startBal !== null) {
              S.botStartBalance = startBal;
              S.balance = startBal;
              S.botBalanceSnapshot = startBal;
              S.tradeProfitLoss = 0;
              updateProfitDisplay();
              updateBalanceSummary();
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
            S.tradeQualityScore = null;
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

      if (gridToggle) {
        const applyGridState = () => {
          const panel = $id('iaa-panel');
          if (!panel) return;
          panel.classList.toggle('iaa-grid-collapsed', S.gridCollapsed);
          gridToggle.textContent = S.gridCollapsed ? '▸ Детайли' : '▾ Детайли';
        };
        applyGridState();
        gridToggle.addEventListener('click', () => {
          S.gridCollapsed = !S.gridCollapsed;
          applyGridState();
        });
      }

      if (dynamicTimeToggle) {
        dynamicTimeToggle.checked = !!S.dynamicExpiryEnabled;
        dynamicTimeToggle.addEventListener('change', () => {
          S.dynamicExpiryEnabled = dynamicTimeToggle.checked;
          if (dynamicTimeToggleSettings) dynamicTimeToggleSettings.checked = S.dynamicExpiryEnabled;
          persistSettings();
        });
      }
      if (dynamicTimeToggleSettings) {
        dynamicTimeToggleSettings.checked = !!S.dynamicExpiryEnabled;
        dynamicTimeToggleSettings.addEventListener('change', () => {
          S.dynamicExpiryEnabled = dynamicTimeToggleSettings.checked;
          if (dynamicTimeToggle) dynamicTimeToggle.checked = S.dynamicExpiryEnabled;
          persistSettings();
        });
      }

      const L1 = $id('iaa-l1');
      const L2 = $id('iaa-l2');
      const L1M = $id('iaa-l1-multiplier');
      const L2M = $id('iaa-l2-multiplier');
      const EXP = $id('iaa-expiry-setting');
      const BASE = $id('iaa-base-amount');
      const ANALYSIS_ENABLED = $id('iaa-analysis-enabled');
      const ANALYSIS_CONFIDENCE = $id('iaa-analysis-confidence');
      const TRADE_INTERVAL_MIN = $id('iaa-trade-interval-min');
      const PAYOUT_MIN = $id('iaa-payout-min');
      const PAYOUT_MAX = $id('iaa-payout-max');
      const PAYOUT_REQUIRED = $id('iaa-payout-required');
      const MAX_TRADE_AMOUNT = $id('iaa-max-trade-amount');
      const MAX_TRADE_MULTIPLIER = $id('iaa-max-trade-multiplier');
      const ANALYSIS_WINDOW = $id('iaa-analysis-window');
      const ANALYSIS_WARMUP = $id('iaa-analysis-warmup');
      const SELF_TRADE_ENABLED = $id('iaa-self-trade-enabled');
      const SIGNAL_SOURCE_1M = $id('iaa-signal-source-1m');
      const SIGNAL_SOURCE_5M = $id('iaa-signal-source-5m');
      const SIGNAL_TIME_OFFSET = $id('iaa-signal-time-offset');
      const SETTINGS_SAVE = $id('iaa-settings-save');
      const SETTINGS_CANCEL = $id('iaa-settings-cancel');
      const SNIPER_MAX_SESSION_LOSS = $id('iaa-sniper-max-session-loss');
      const SNIPER_MAX_LOSS_STREAK = $id('iaa-sniper-max-loss-streak');
      const MODE_SIGNALS = $id('iaa-mode-signals');
      const MODE_SNIPER = $id('iaa-mode-sniper');
      const SNIPER_THRESHOLD = $id('iaa-sniper-threshold');
      const SNIPER_THRESHOLD_OTC = $id('iaa-sniper-threshold-otc');
      const SNIPER_THRESHOLD_REAL = $id('iaa-sniper-threshold-real');
      const SNIPER_BASE = $id('iaa-sniper-base');
      const SNIPER_MIN_PAYOUT = $id('iaa-sniper-min-payout');
      const SNIPER_ENTRY = $id('iaa-sniper-entry-window');
      const SNIPER_CHOP = $id('iaa-sniper-chop');
      const SNIPER_WARMUP = $id('iaa-sniper-warmup');
      const SNIPER_EMA_FAST = $id('iaa-sniper-ema-fast');
      const SNIPER_EMA_SLOW = $id('iaa-sniper-ema-slow');
      const SNIPER_RSI_OVERSOLD = $id('iaa-sniper-rsi-oversold');
      const SNIPER_RSI_OVERBOUGHT = $id('iaa-sniper-rsi-overbought');
      const SNIPER_VWAP = $id('iaa-sniper-vwap');
      const SNIPER_MOMENTUM = $id('iaa-sniper-momentum');
      const SNIPER_VWAP_LOOKBACK = $id('iaa-sniper-vwap-lookback');
      const SNIPER_VOLUME_THRESHOLD = $id('iaa-sniper-volume-threshold');
      const SNIPER_VWAP_WEIGHT = $id('iaa-sniper-vwap-weight');
      const SNIPER_MOMENTUM_WEIGHT = $id('iaa-sniper-momentum-weight');
      const SNIPER_VOLUME_WEIGHT = $id('iaa-sniper-volume-weight');
      const SNIPER_VWAP_ENABLED = $id('iaa-sniper-vwap-enabled');
      const SNIPER_MOMENTUM_ENABLED = $id('iaa-sniper-momentum-enabled');
      const SNIPER_VOLUME_ENABLED = $id('iaa-sniper-volume-enabled');
      const SNIPER_CHOP_ENABLED = $id('iaa-sniper-chop-enabled');
      const SNIPER_OVERRIDE_CONF = $id('iaa-sniper-override-confidence');
      const SNIPER_MULTI_ENABLED = $id('iaa-sniper-multi-enabled');
      const SNIPER_SETTINGS_COLLAPSE = $id('iaa-sniper-collapse');
      const SNIPER_WEIGHTS_TOGGLE = $id('iaa-sniper-weights-toggle');
      const SNIPER_MULTI_TOGGLE = $id('iaa-sniper-multi-toggle');
      const SNIPER_SMART_TOGGLE = $id('iaa-sniper-smart-toggle');
      const SNIPER_ENGINE_TOGGLE = $id('iaa-sniper-engine-toggle');
      const SNIPER_RISK_TOGGLE = $id('iaa-sniper-risk-toggle');
      const SNIPER_TF_15 = $id('iaa-sniper-tf-15s');
      const SNIPER_TF_30 = $id('iaa-sniper-tf-30s');
      const SNIPER_TF_1M = $id('iaa-sniper-tf-1m');
      const SNIPER_TF_3M = $id('iaa-sniper-tf-3m');
      const SNIPER_TF_5M = $id('iaa-sniper-tf-5m');
      const SNIPER_TF_30M = $id('iaa-sniper-tf-30m');
      const SNIPER_TF_3S = $id('iaa-sniper-tf-3s');
      const SNIPER_KEEP_ALIVE = $id('iaa-sniper-keep-alive');
      const SNIPER_MULTI_THRESHOLD = $id('iaa-sniper-multi-threshold');
      const SNIPER_MULTI_COUNT = $id('iaa-sniper-multi-count');
      const SNIPER_MULTI_AMOUNT = $id('iaa-sniper-multi-amount');
      const FEATURE_VOLUME_REJECTION = $id('iaa-feature-volume-rejection');
      const FEATURE_VWAP_ANALYSIS = $id('iaa-feature-vwap-analysis');
      const FEATURE_SESSION_BOOST = $id('iaa-feature-session-boost');
      const FEATURE_TF_15S = $id('iaa-feature-tf-15s');
      const FEATURE_TF_1M = $id('iaa-feature-tf-1m');
      const FEATURE_TF_3M = $id('iaa-feature-tf-3m');
      const FEATURE_TF_5M = $id('iaa-feature-tf-5m');
      const FEATURE_TF_15M = $id('iaa-feature-tf-15m');
      const FEATURE_TF_30M = $id('iaa-feature-tf-30m');
      const IDLE_SWITCH_ENABLED = $id('iaa-idle-switch-enabled');
      const IDLE_SWITCH_MIN = $id('iaa-idle-switch-min');
      const STRATEGY_AUTO_SWITCH = $id('iaa-strategy-auto-switch');
      const STRATEGY_WEIGHT_WR = $id('iaa-strategy-weight-wr');
      const STRATEGY_WEIGHT_PNL = $id('iaa-strategy-weight-pnl');
      const STRATEGY_LEARNING = $id('iaa-strategy-learning-trades');
      const STRATEGY_LOSS_STREAK = $id('iaa-strategy-loss-streak');
      const MAX_TRADES_PER_MIN = $id('iaa-max-trades-per-minute');
      const MAX_OPEN_TRADES = $id('iaa-max-open-trades');
      const STRATEGY_AUTO_SWITCH_PANEL = $id('iaa-strategy-auto-switch-panel');
      const STRATEGY_DOWNLOAD = $id('iaa-strategy-download');
      const REGIME_STRENGTH = $id('iaa-regime-strength');
      const CONFIRMATION_STRENGTH = $id('iaa-confirmation-strength');
      const BIAS_STRENGTH = $id('iaa-bias-strength');
      const BIAS_TF_1M = $id('iaa-bias-tf-1m');
      const BIAS_TF_3M = $id('iaa-bias-tf-3m');
      const BIAS_TF_5M = $id('iaa-bias-tf-5m');
      const BIAS_TF_30M = $id('iaa-bias-tf-30m');
      const CONFLICT_STRENGTH = $id('iaa-conflict-strength');

      $$('.iaa-tab-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const tab = btn.getAttribute('data-tab');
          if (!tab) return;
          S.sniperSettingsTab = tab;
          renderSettingsPanel();
        });
      });

      if (SETTINGS_SAVE) {
        SETTINGS_SAVE.addEventListener('click', () => {
          persistSettings();
          closeSettingsPanel();
        });
      }
      if (SETTINGS_CANCEL) {
        SETTINGS_CANCEL.addEventListener('click', () => {
          restoreSettingsSnapshot();
          closeSettingsPanel();
        });
      }

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
      if (SNIPER_THRESHOLD) {
        SNIPER_THRESHOLD.addEventListener('input', () => {
          const d = parseNumberFlexible(SNIPER_THRESHOLD.value) || 0;
          S.sniperThreshold = Math.max(0, Math.min(1, d));
          applyStrictnessColor(SNIPER_THRESHOLD, S.sniperThreshold, { min: 0, max: 1, highIsStrict: true });
          persistSettings();
        });
      }
      if (SNIPER_THRESHOLD_OTC) {
        SNIPER_THRESHOLD_OTC.addEventListener('input', () => {
          const d = parseNumberFlexible(SNIPER_THRESHOLD_OTC.value) || 0;
          S.sniperThresholdOtc = Math.max(0, Math.min(1, d));
          applyStrictnessColor(SNIPER_THRESHOLD_OTC, S.sniperThresholdOtc, { min: 0, max: 1, highIsStrict: true });
          persistSettings();
        });
      }
      if (SNIPER_THRESHOLD_REAL) {
        SNIPER_THRESHOLD_REAL.addEventListener('input', () => {
          const d = parseNumberFlexible(SNIPER_THRESHOLD_REAL.value) || 0;
          S.sniperThresholdReal = Math.max(0, Math.min(1, d));
          applyStrictnessColor(SNIPER_THRESHOLD_REAL, S.sniperThresholdReal, { min: 0, max: 1, highIsStrict: true });
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
      if (SNIPER_MIN_PAYOUT) {
        SNIPER_MIN_PAYOUT.addEventListener('input', () => {
          const d = parseNumberFlexible(SNIPER_MIN_PAYOUT.value) || 0;
          S.sniperMinPayout = Math.max(0, Math.min(100, Math.round(d)));
          persistSettings();
        });
      }
      if (SNIPER_ENTRY) {
        SNIPER_ENTRY.addEventListener('input', () => {
          const d = parseNumberFlexible(SNIPER_ENTRY.value);
          const normalized = Number.isFinite(d) ? Math.round(d) : 5;
          S.sniperEntryWindowSec = Math.max(0, Math.min(300, normalized));
          persistSettings();
        });
      }
      if (MAX_TRADES_PER_MIN) {
        MAX_TRADES_PER_MIN.addEventListener('input', () => {
          const d = parseNumberFlexible(MAX_TRADES_PER_MIN.value) || 0;
          S.maxTradesPerMinute = Math.max(0, Math.round(d));
          persistSettings();
        });
      }
      if (MAX_OPEN_TRADES) {
        MAX_OPEN_TRADES.addEventListener('input', () => {
          const d = parseNumberFlexible(MAX_OPEN_TRADES.value) || 1;
          S.maxOpenTrades = Math.max(1, Math.round(d));
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
      if (SNIPER_EMA_FAST) {
        SNIPER_EMA_FAST.addEventListener('input', () => {
          const d = parseNumberFlexible(SNIPER_EMA_FAST.value) || SNIPER_5S_DEFAULTS.emaFast;
          S.sniperEmaFast = Math.max(2, Math.min(30, Math.round(d)));
          persistSettings();
        });
      }
      if (SNIPER_EMA_SLOW) {
        SNIPER_EMA_SLOW.addEventListener('input', () => {
          const d = parseNumberFlexible(SNIPER_EMA_SLOW.value) || SNIPER_5S_DEFAULTS.emaSlow;
          S.sniperEmaSlow = Math.max(5, Math.min(60, Math.round(d)));
          persistSettings();
        });
      }
      if (SNIPER_RSI_OVERSOLD) {
        SNIPER_RSI_OVERSOLD.addEventListener('input', () => {
          const d = parseNumberFlexible(SNIPER_RSI_OVERSOLD.value) || SNIPER_5S_DEFAULTS.rsiOversold;
          S.sniperRsiOversold = Math.max(5, Math.min(50, Math.round(d)));
          persistSettings();
        });
      }
      if (SNIPER_RSI_OVERBOUGHT) {
        SNIPER_RSI_OVERBOUGHT.addEventListener('input', () => {
          const d = parseNumberFlexible(SNIPER_RSI_OVERBOUGHT.value) || SNIPER_5S_DEFAULTS.rsiOverbought;
          S.sniperRsiOverbought = Math.max(50, Math.min(95, Math.round(d)));
          persistSettings();
        });
      }
      if (SNIPER_VWAP) {
        const update = () => {
          const d = parseNumberFlexible(SNIPER_VWAP.value) || SNIPER_5S_DEFAULTS.vwapDeviation;
          S.sniperVwapDeviation = Math.max(0, d);
          applyStrictnessColor(SNIPER_VWAP, S.sniperVwapDeviation, {
            min: 0,
            max: (SNIPER_5S_DEFAULTS.vwapDeviation || 0.0012) * 2,
            highIsStrict: true
          });
          persistSettings();
        };
        SNIPER_VWAP.addEventListener('input', update);
        SNIPER_VWAP.addEventListener('change', update);
      }
      if (SNIPER_VWAP_LOOKBACK) {
        SNIPER_VWAP_LOOKBACK.addEventListener('input', () => {
          const d = parseNumberFlexible(SNIPER_VWAP_LOOKBACK.value) || SNIPER_5S_DEFAULTS.vwapLookbackMin;
          S.sniperVwapLookbackMin = Math.max(1, Math.round(d));
          persistSettings();
        });
      }
      if (SNIPER_MOMENTUM) {
        const update = () => {
          const d = parseNumberFlexible(SNIPER_MOMENTUM.value) || SNIPER_5S_DEFAULTS.momentumThreshold;
          S.sniperMomentumThreshold = Math.max(0, d);
          applyStrictnessColor(SNIPER_MOMENTUM, S.sniperMomentumThreshold, {
            min: 0,
            max: (SNIPER_5S_DEFAULTS.momentumThreshold || 0.0014) * 2,
            highIsStrict: true
          });
          persistSettings();
        };
        SNIPER_MOMENTUM.addEventListener('input', update);
        SNIPER_MOMENTUM.addEventListener('change', update);
      }
      if (SNIPER_VOLUME_THRESHOLD) {
        SNIPER_VOLUME_THRESHOLD.addEventListener('input', () => {
          const d = parseNumberFlexible(SNIPER_VOLUME_THRESHOLD.value) || 0;
          S.sniperVolumeThreshold = Math.max(0, d);
          persistSettings();
        });
      }
      if (SNIPER_CHOP) {
        const update = () => {
          const d = parseNumberFlexible(SNIPER_CHOP.value);
          const normalized = Number.isFinite(d) ? d : 0;
          S.sniperChopThreshold = Math.max(0, Math.min(1, normalized));
          applyStrictnessColor(SNIPER_CHOP, S.sniperChopThreshold, { min: 0, max: 1, highIsStrict: true });
          persistSettings();
        };
        SNIPER_CHOP.addEventListener('input', update);
        SNIPER_CHOP.addEventListener('change', update);
      }
      if (SNIPER_VWAP_ENABLED) {
        SNIPER_VWAP_ENABLED.addEventListener('change', () => {
          S.sniperVwapEnabled = SNIPER_VWAP_ENABLED.checked;
          persistSettings();
        });
      }
      if (SNIPER_MOMENTUM_ENABLED) {
        SNIPER_MOMENTUM_ENABLED.addEventListener('change', () => {
          S.sniperMomentumEnabled = SNIPER_MOMENTUM_ENABLED.checked;
          persistSettings();
        });
      }
      if (SNIPER_VOLUME_ENABLED) {
        SNIPER_VOLUME_ENABLED.addEventListener('change', () => {
          S.sniperVolumeEnabled = SNIPER_VOLUME_ENABLED.checked;
          persistSettings();
        });
      }
      if (SNIPER_CHOP_ENABLED) {
        SNIPER_CHOP_ENABLED.addEventListener('change', () => {
          S.sniperChopEnabled = SNIPER_CHOP_ENABLED.checked;
          persistSettings();
        });
      }
      if (SNIPER_VWAP_WEIGHT) {
        const update = () => {
          const d = parseNumberFlexible(SNIPER_VWAP_WEIGHT.value);
          S.sniperVwapWeight = Math.max(0, Math.min(1, Number.isFinite(d) ? d : 0));
          applyStrictnessColor(SNIPER_VWAP_WEIGHT, S.sniperVwapWeight, { min: 0, max: 1, highIsStrict: true });
          persistSettings();
        };
        SNIPER_VWAP_WEIGHT.addEventListener('input', update);
        SNIPER_VWAP_WEIGHT.addEventListener('change', update);
      }
      if (SNIPER_MOMENTUM_WEIGHT) {
        const update = () => {
          const d = parseNumberFlexible(SNIPER_MOMENTUM_WEIGHT.value);
          S.sniperMomentumWeight = Math.max(0, Math.min(1, Number.isFinite(d) ? d : 0));
          applyStrictnessColor(SNIPER_MOMENTUM_WEIGHT, S.sniperMomentumWeight, { min: 0, max: 1, highIsStrict: false });
          persistSettings();
        };
        SNIPER_MOMENTUM_WEIGHT.addEventListener('input', update);
        SNIPER_MOMENTUM_WEIGHT.addEventListener('change', update);
      }
      if (SNIPER_VOLUME_WEIGHT) {
        const update = () => {
          const d = parseNumberFlexible(SNIPER_VOLUME_WEIGHT.value);
          S.sniperVolumeWeight = Math.max(0, Math.min(1, Number.isFinite(d) ? d : 0));
          applyStrictnessColor(SNIPER_VOLUME_WEIGHT, S.sniperVolumeWeight, { min: 0, max: 1, highIsStrict: false });
          persistSettings();
        };
        SNIPER_VOLUME_WEIGHT.addEventListener('input', update);
        SNIPER_VOLUME_WEIGHT.addEventListener('change', update);
      }
      if (SNIPER_OVERRIDE_CONF) {
        SNIPER_OVERRIDE_CONF.addEventListener('input', () => {
          const d = parseNumberFlexible(SNIPER_OVERRIDE_CONF.value) || 0;
          const nextValue = Math.max(0, Math.min(100, Math.round(d)));
          S.sniperOverrideConfidencePct = nextValue;
          applyPercentColor(SNIPER_OVERRIDE_CONF, nextValue);
          persistSettings();
        });
      }
      if (SNIPER_MULTI_ENABLED) {
        SNIPER_MULTI_ENABLED.addEventListener('change', () => {
          S.sniperMultiEnabled = SNIPER_MULTI_ENABLED.checked;
          persistSettings();
        });
      }
      if (SNIPER_SETTINGS_COLLAPSE) {
        SNIPER_SETTINGS_COLLAPSE.addEventListener('click', () => {
          S.sniperSettingsCollapsed = !S.sniperSettingsCollapsed;
          renderSettingsPanel();
        });
      }
      if (SNIPER_WEIGHTS_TOGGLE) {
        SNIPER_WEIGHTS_TOGGLE.addEventListener('click', () => {
          S.sniperWeightsCollapsed = !S.sniperWeightsCollapsed;
          renderSettingsPanel();
        });
      }
      if (SNIPER_MULTI_TOGGLE) {
        SNIPER_MULTI_TOGGLE.addEventListener('click', () => {
          S.sniperMultiCollapsed = !S.sniperMultiCollapsed;
          renderSettingsPanel();
        });
      }
      if (SNIPER_SMART_TOGGLE) {
        SNIPER_SMART_TOGGLE.addEventListener('click', () => {
          S.sniperSmartCollapsed = !S.sniperSmartCollapsed;
          renderSettingsPanel();
        });
      }
      if (SNIPER_ENGINE_TOGGLE) {
        SNIPER_ENGINE_TOGGLE.addEventListener('click', () => {
          S.sniperEngineCollapsed = !S.sniperEngineCollapsed;
          renderSettingsPanel();
        });
      }
      if (SNIPER_RISK_TOGGLE) {
        SNIPER_RISK_TOGGLE.addEventListener('click', () => {
          S.sniperRiskCollapsed = !S.sniperRiskCollapsed;
          renderSettingsPanel();
        });
      }
      if (SNIPER_TF_15) {
        SNIPER_TF_15.addEventListener('change', () => {
          S.sniperEnabledTimeframes['15s'] = SNIPER_TF_15.checked;
          persistSettings();
        });
      }
      if (SNIPER_TF_3S) {
        SNIPER_TF_3S.addEventListener('change', () => {
          S.sniperEnabledTimeframes['3s'] = SNIPER_TF_3S.checked;
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
      if (SNIPER_TF_3M) {
        SNIPER_TF_3M.addEventListener('change', () => {
          S.sniperEnabledTimeframes['3m'] = SNIPER_TF_3M.checked;
          persistSettings();
        });
      }
      if (SNIPER_TF_5M) {
        SNIPER_TF_5M.addEventListener('change', () => {
          S.sniperEnabledTimeframes['5m'] = SNIPER_TF_5M.checked;
          persistSettings();
        });
      }
      if (SNIPER_TF_30M) {
        SNIPER_TF_30M.addEventListener('change', () => {
          S.sniperEnabledTimeframes['30m'] = SNIPER_TF_30M.checked;
          persistSettings();
        });
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
      if (SNIPER_MULTI_THRESHOLD) {
        SNIPER_MULTI_THRESHOLD.addEventListener('input', () => {
          const d = parseNumberFlexible(SNIPER_MULTI_THRESHOLD.value) || 0;
          S.sniperMultiThresholdPct = Math.max(0, Math.min(100, Math.round(d)));
          persistSettings();
        });
      }
      if (SNIPER_MULTI_COUNT) {
        SNIPER_MULTI_COUNT.addEventListener('input', () => {
          const d = parseNumberFlexible(SNIPER_MULTI_COUNT.value) || 0;
          const normalized = Math.max(0, Math.min(20, Math.round(d)));
          S.sniperMultiCount = normalized;
          persistSettings();
        });
      }
      if (SNIPER_MULTI_AMOUNT) {
        SNIPER_MULTI_AMOUNT.addEventListener('input', () => {
          const d = parseNumberFlexible(SNIPER_MULTI_AMOUNT.value) || 0;
          S.sniperMultiAmountPct = Math.max(0, Math.min(100, d));
          persistSettings();
        });
      }
      if (FEATURE_VOLUME_REJECTION) {
        FEATURE_VOLUME_REJECTION.addEventListener('change', () => {
          S.featureVolumeRejection = FEATURE_VOLUME_REJECTION.checked;
          persistSettings();
        });
      }
      if (FEATURE_VWAP_ANALYSIS) {
        FEATURE_VWAP_ANALYSIS.addEventListener('change', () => {
          S.featureVwapAnalysis = FEATURE_VWAP_ANALYSIS.checked;
          persistSettings();
        });
      }
      if (FEATURE_SESSION_BOOST) {
        FEATURE_SESSION_BOOST.addEventListener('change', () => {
          S.featureSessionBoost = FEATURE_SESSION_BOOST.checked;
          persistSettings();
        });
      }
      if (FEATURE_TF_15S) {
        FEATURE_TF_15S.addEventListener('change', () => {
          S.featureTimeframes['15s'] = FEATURE_TF_15S.checked;
          S.sniperEnabledTimeframes['15s'] = FEATURE_TF_15S.checked;
          persistSettings();
          renderSniperMatrix();
        });
      }
      if (FEATURE_TF_1M) {
        FEATURE_TF_1M.addEventListener('change', () => {
          S.featureTimeframes['1m'] = FEATURE_TF_1M.checked;
          S.sniperEnabledTimeframes['1m'] = FEATURE_TF_1M.checked;
          persistSettings();
          renderSniperMatrix();
        });
      }
      if (FEATURE_TF_3M) {
        FEATURE_TF_3M.addEventListener('change', () => {
          S.featureTimeframes['3m'] = FEATURE_TF_3M.checked;
          S.sniperEnabledTimeframes['3m'] = FEATURE_TF_3M.checked;
          persistSettings();
          renderSniperMatrix();
        });
      }
      if (FEATURE_TF_5M) {
        FEATURE_TF_5M.addEventListener('change', () => {
          S.featureTimeframes['5m'] = FEATURE_TF_5M.checked;
          S.sniperEnabledTimeframes['5m'] = FEATURE_TF_5M.checked;
          persistSettings();
          renderSniperMatrix();
        });
      }
      if (FEATURE_TF_15M) {
        FEATURE_TF_15M.addEventListener('change', () => {
          S.featureTimeframes['15m'] = FEATURE_TF_15M.checked;
          S.sniperEnabledTimeframes['15m'] = FEATURE_TF_15M.checked;
          persistSettings();
          renderSniperMatrix();
        });
      }
      if (FEATURE_TF_30M) {
        FEATURE_TF_30M.addEventListener('change', () => {
          S.featureTimeframes['30m'] = FEATURE_TF_30M.checked;
          S.sniperEnabledTimeframes['30m'] = FEATURE_TF_30M.checked;
          persistSettings();
          renderSniperMatrix();
        });
      }
      if (IDLE_SWITCH_ENABLED) {
        IDLE_SWITCH_ENABLED.addEventListener('change', () => {
          S.idleSwitchEnabled = IDLE_SWITCH_ENABLED.checked;
          persistSettings();
        });
      }
      if (IDLE_SWITCH_MIN) {
        IDLE_SWITCH_MIN.addEventListener('input', () => {
          const d = parseNumberFlexible(IDLE_SWITCH_MIN.value) || 0;
          S.idleSwitchMinutes = Math.max(5, Math.min(240, Math.round(d)));
          IDLE_SWITCH_MIN.value = String(S.idleSwitchMinutes);
          persistSettings();
        });
      }
      if (STRATEGY_AUTO_SWITCH) {
        STRATEGY_AUTO_SWITCH.addEventListener('change', () => {
          setAutoSwitchStrategy(STRATEGY_AUTO_SWITCH.checked);
        });
      }
      if (STRATEGY_WEIGHT_WR) {
        STRATEGY_WEIGHT_WR.addEventListener('input', () => {
          const d = parseNumberFlexible(STRATEGY_WEIGHT_WR.value) || 0;
          S.strategyWeightWr = clamp01(d);
          applyStrictnessColor(STRATEGY_WEIGHT_WR, S.strategyWeightWr, { min: 0, max: 1, highIsStrict: false });
          persistSettings();
        });
      }
      if (STRATEGY_WEIGHT_PNL) {
        STRATEGY_WEIGHT_PNL.addEventListener('input', () => {
          const d = parseNumberFlexible(STRATEGY_WEIGHT_PNL.value) || 0;
          S.strategyWeightPnl = clamp01(d);
          applyStrictnessColor(STRATEGY_WEIGHT_PNL, S.strategyWeightPnl, { min: 0, max: 1, highIsStrict: false });
          persistSettings();
        });
      }
      if (STRATEGY_LEARNING) {
        STRATEGY_LEARNING.addEventListener('input', () => {
          const d = parseNumberFlexible(STRATEGY_LEARNING.value) || 0;
          S.strategyLearningTrades = Math.max(0, Math.min(50, Math.round(d)));
          STRATEGY_LEARNING.value = String(S.strategyLearningTrades);
          persistSettings();
        });
      }
      if (STRATEGY_LOSS_STREAK) {
        STRATEGY_LOSS_STREAK.addEventListener('input', () => {
          const d = parseNumberFlexible(STRATEGY_LOSS_STREAK.value) || STRATEGY_DEFAULTS.lossStreakLimit;
          S.strategyLossStreakLimit = Math.max(1, Math.min(10, Math.round(d)));
          STRATEGY_LOSS_STREAK.value = String(S.strategyLossStreakLimit);
          persistSettings();
        });
      }
      if (STRATEGY_AUTO_SWITCH_PANEL) {
        STRATEGY_AUTO_SWITCH_PANEL.addEventListener('change', () => {
          setAutoSwitchStrategy(STRATEGY_AUTO_SWITCH_PANEL.checked);
        });
      }
      if (STRATEGY_DOWNLOAD) {
        STRATEGY_DOWNLOAD.addEventListener('click', () => {
          downloadTradesCsv();
        });
      }
      if (REGIME_STRENGTH) {
        REGIME_STRENGTH.addEventListener('input', () => {
          const d = parseNumberFlexible(REGIME_STRENGTH.value) || 0;
          S.regimeStrength = clamp01(d);
          applyStrictnessColor(REGIME_STRENGTH, S.regimeStrength, { min: 0, max: 1, highIsStrict: true });
          persistSettings();
        });
      }
      if (CONFIRMATION_STRENGTH) {
        CONFIRMATION_STRENGTH.addEventListener('input', () => {
          const d = parseNumberFlexible(CONFIRMATION_STRENGTH.value) || 0;
          S.confirmationStrength = clamp01(d);
          applyStrictnessColor(CONFIRMATION_STRENGTH, S.confirmationStrength, { min: 0, max: 1, highIsStrict: true });
          persistSettings();
        });
      }
      if (BIAS_STRENGTH) {
        BIAS_STRENGTH.addEventListener('input', () => {
          const d = parseNumberFlexible(BIAS_STRENGTH.value) || 0;
          S.biasStrength = clamp01(d);
          applyStrictnessColor(BIAS_STRENGTH, S.biasStrength, { min: 0, max: 1, highIsStrict: true });
          persistSettings();
        });
      }
      if (BIAS_TF_1M) {
        BIAS_TF_1M.addEventListener('change', () => {
          S.biasTimeframes['1m'] = BIAS_TF_1M.checked;
          persistSettings();
        });
      }
      if (BIAS_TF_3M) {
        BIAS_TF_3M.addEventListener('change', () => {
          S.biasTimeframes['3m'] = BIAS_TF_3M.checked;
          persistSettings();
        });
      }
      if (BIAS_TF_5M) {
        BIAS_TF_5M.addEventListener('change', () => {
          S.biasTimeframes['5m'] = BIAS_TF_5M.checked;
          persistSettings();
        });
      }
      if (BIAS_TF_30M) {
        BIAS_TF_30M.addEventListener('change', () => {
          S.biasTimeframes['30m'] = BIAS_TF_30M.checked;
          persistSettings();
        });
      }
      if (CONFLICT_STRENGTH) {
        CONFLICT_STRENGTH.addEventListener('input', () => {
          const d = parseNumberFlexible(CONFLICT_STRENGTH.value) || 0;
          S.conflictStrength = clamp01(d);
          applyStrictnessColor(CONFLICT_STRENGTH, S.conflictStrength, { min: 0, max: 1, highIsStrict: true });
          persistSettings();
        });
      }

    }

    ;
    function ensurePanelInit(){
      ensurePanel();
      ensurePanelHandlers();
    }

    ;
    function renderWarmup(percent){
      const el = $id('iaa-warm'); if (!el) return;
      if (S.running && percent < 1.0) {
        el.textContent = `ENGINE ${Math.round(percent*100)}% ЗАГРЯВА`;
        el.style.color = `hsl(${percent*120},100%,50%)`;
      } else if (S.running) { el.textContent = 'ДВИГАТЕЛ ГОТОВ. НАБЛЮДАВА ПАЗАРА.'; el.style.color = '#22c55e'; }
      else { el.textContent = 'БОТЪТ Е СПРЯН.'; el.style.color='#f87171'; }
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
