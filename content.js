
/* IAA GLOBAL dealKey SAFETY */
(function(){
  try{
    if (typeof window.dealKey === "function") return;
    window.dealKey = function(d, pnl){
      try{
        const id = d && (d.id ?? d.deal_id ?? d.dealId ?? d.ticket ?? d.order_id ?? d.orderId ?? d.uid ?? "");
        if (id) return "id:" + String(id);
        const asset = d && (d.asset ?? d.symbol ?? d.pair ?? "");
        const closeTs = Number(d && (d.closeTimestamp ?? d.closeTime ?? d.close_time ?? d.closedAt ?? d.finishedAt ?? d.ts ?? d.timestamp) || 0) || 0;
        const stake = Number(d && (d.stake ?? d.amount ?? d.bet ?? d.invest ?? d.sum ?? d.open_amount ?? d.openAmount) || 0) || 0;
        const pnlCents = Number.isFinite(Number(pnl)) ? Math.round(Number(pnl)*100) : 0;
        return `g:${asset}|${closeTs}|${pnlCents}|${Math.round(stake*100)}`;
      }catch(e){ return "g:0"; }
    };
  }catch(e){}
})();


/* IAA LEGACY PNL HIDE CSS */
(function(){
  try{
    const id = "iaa-hide-legacy-pnl-css";
    if (document.getElementById(id)) return;
    const st = document.createElement("style");
    st.id = id;
    st.textContent = `
      #iaa-session-mini { display:none !important; }
      #iaa-pnl-line { display:none !important; }
    `;
    (document.documentElement || document.head).appendChild(st);
  }catch(e){}
})();


/* IAA EARLY INJECT BOOT (no inline, CSP-safe) */
(function(){
  try{
    if (window.__iaaEarlyInjectBoot) return;
    window.__iaaEarlyInjectBoot = true;

    // Inject inject.js into MAIN world ASAP
    const injectUrl = (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.getURL) ? chrome.runtime.getURL("inject.js") : null;
    if (injectUrl) {
      const s = document.createElement("script");
      s.src = injectUrl;
      s.async = false;
      s.type = "text/javascript";
      (document.documentElement || document.head).prepend(s);
    }
  }catch(e){}
})();

(() => {
  'use strict';

  const IAA_PAGE_BRIDGE_MODE = false;

  const PO_PRICE_EVENT = 'IAA_PO_PRICE';
  const PRICE_HISTORY_MAX_POINTS = 12000;
  const PRICE_HISTORY_DEDUPE_MS = 250;

  

  /* ========================= AUTH / LOGIN ========================= */
  const LOGIN_SHELL_ID = 'iaa-login-shell';
  const SESSION_KEY = 'IAA_AUTH_SESSION';
  const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

  const WS_FEED_BUFFER = window.__iaaWsFeedBuffer || (window.__iaaWsFeedBuffer = {
    lastPrice: null,
    lastDecimals: null,
    lastAt: 0,
    lastAsset: null,
    lastSource: null,
    lastRejectReason: null,
    packetsSeen: 0,
    bridgeFramesSeen: 0,
    bridgeReady: false
  });
  const WL_URL = "https://raw.githubusercontent.com/Karimmw/Codes/refs/heads/main/iaa_whitelist.txt";
  const BUILD_ID = '20260227-1115-backup-upgrade-killer11';

  // persisted settings keys
  const BASE_AMOUNT_KEY = 'IAA_BASE_AMOUNT_CENTS';
  const L1_ON_KEY = 'IAA_L1_ON';
  const L2_ON_KEY = 'IAA_L2_ON';
  const L1_MULT_KEY = 'IAA_L1_MULT';
  const L2_MULT_KEY = 'IAA_L2_MULT';
  const EXPIRY_KEY   = 'IAA_EXPIRY';
  const KEEP_ALIVE_KEY = 'IAA_KEEP_ALIVE';
  const FORCE_ASSET_SELECT_KEY = 'IAA_FORCE_ASSET_SELECT';
  const MAX_SESSION_ЗАГУБИ_KEY = 'IAA_MAX_SESSION_ЗАГУБИ_CENTS';
  const MAX_CONSECUTIVE_ЗАГУБИES_KEY = 'IAA_MAX_CONSECUTIVE_ЗАГУБИES';
  const ANALYSIS_ENABLED_KEY = 'IAA_ANALYSIS_ENABLED';
  const ANALYSIS_CONFIDENCE_KEY = 'IAA_ANALYSIS_CONFIDENCE';
  const TRADE_INTERVAL_MIN_KEY = 'IAA_TRADE_INTERVAL_MIN';
  const PAYOUT_MIN_KEY = 'IAA_PAYOUT_MIN';
  const PAYOUT_MAX_KEY = 'IAA_PAYOUT_MAX';
  const PAYOUT_REQUIRED_KEY = 'IAA_PAYOUT_REQUIRED';
  const MAX_TRADE_AMOUNT_KEY = 'IAA_MAX_TRADE_AMOUNT_CENTS';
  const MAX_TRADE_MULTIPLIER_KEY = 'IAA_MAX_TRADE_MULTIPLIER';
  const ANALYSIS_ПЕЧАЛБИDOW_SEC_KEY = 'IAA_ANALYSIS_ПЕЧАЛБИDOW_SEC';
  const ANALYSIS_WARMUP_MIN_KEY = 'IAA_ANALYSIS_WARMUP_MIN';
  const SELF_TRADE_ENABLED_KEY = 'IAA_SELF_TRADE_ENABLED';
  const REVERSAL_ПЕЧАЛБИDOW_SEC_KEY = 'IAA_REVERSAL_ПЕЧАЛБИDOW_SEC';
  const REVERSAL_OPPOSITE_RATIO_KEY = 'IAA_REVERSAL_OPPOSITE_RATIO';
  const PANEL_OPACITY_KEY = 'IAA_PANEL_OPACITY';
  const COUNTDOWN_BEEP_KEY = 'IAA_COUNTDOWN_BEEP';
  const BURST_ENABLED_KEY = 'IAA_BURST_ENABLED';
  const BURST_COUNT_KEY = 'IAA_BURST_COUNT';
  const BURST_CONFIDENCE_KEY = 'IAA_BURST_CONFIDENCE';
  const MODE_KEY = 'IAA_MODE';
  const DYNAMIC_TIME_KEY = 'IAA_DYNAMIC_TIME_ENABLED';
  const DYNAMIC_MODE_KEY = 'IAA_DYNAMIC_MODE';
  const DYNAMIC_MIN_SEC_KEY = 'IAA_DYNAMIC_MIN_SEC';
  const DYNAMIC_MAX_SEC_KEY = 'IAA_DYNAMIC_MAX_SEC';
  const DYNAMIC_ALLOW_NO_TRADE_KEY = 'IAA_DYNAMIC_ALLOW_NO_TRADE';
  const DYNAMIC_EXPIRY_STEP_SEC_KEY = 'IAA_DYNAMIC_EXPIRY_STEP_SEC';
  const DYNAMIC_ENTRY_STEP_SEC_KEY = 'IAA_DYNAMIC_ENTRY_STEP_SEC';
  const DYNAMIC_LOOKBACK_SEC_KEY = 'IAA_DYNAMIC_LOOKBACK_SEC';
  const DYNAMIC_MIN_SAMPLES_KEY = 'IAA_DYNAMIC_MIN_SAMPLES';
  const DYNAMIC_MIN_WINRATE_KEY = 'IAA_DYNAMIC_MIN_WINRATE';
  const DYNAMIC_CHOP_PENALTY_KEY = 'IAA_DYNAMIC_CHOP_PENALTY';
  const DYNAMIC_LATE_PENALTY_KEY = 'IAA_DYNAMIC_LATE_PENALTY';
  const DYNAMIC_STAKE_SCALE_ENABLED_KEY = 'IAA_DYNAMIC_STAKE_SCALE_ENABLED';
  const DYNAMIC_STAKE_MULT8_KEY = 'IAA_DYNAMIC_STAKE_MULT8';
  const DYNAMIC_STAKE_MULT9_KEY = 'IAA_DYNAMIC_STAKE_MULT9';
  const DYNAMIC_STAKE_BOOST_KEY = 'IAA_DYNAMIC_STAKE_BOOST';
  const DYNAMIC_STAKE_BOOST_MIN_SAMPLES_KEY = 'IAA_DYNAMIC_STAKE_BOOST_MIN_SAMPLES';
  const DYNAMIC_STAKE_LOSS_REDUCE_KEY = 'IAA_DYNAMIC_STAKE_LOSS_REDUCE';
  const DYNAMIC_TWO_STAGE_SEARCH_KEY = 'IAA_DYNAMIC_TWO_STAGE_ENABLED';
  const DYNAMIC_FINE_STEP_KEY = 'IAA_DYNAMIC_FINE_STEP_SEC';
  const DYNAMIC_CANDLE_SYNC_KEY = 'IAA_DYNAMIC_CANDLE_SYNC';
  const DYNAMIC_LATENCY_COMP_KEY = 'IAA_DYNAMIC_LATENCY_COMP_MS';
  const DYNAMIC_PRE_CALC_KEY = 'IAA_DYNAMIC_PRE_CALC';
  const DYNAMIC_VOLATILITY_ADAPTIVE_KEY = 'IAA_DYNAMIC_VOLATILITY_ADAPTIVE';
  const KILLER_ENABLED_KEY = 'IAA_KILLER_ENABLED';
  const KILLER_HUD_ENABLED_KEY = 'IAA_KILLER_HUD_ENABLED';
  const KILLER_MIN_CONFLUENCE_KEY = 'IAA_KILLER_MIN_CONFLUENCE';
  const KILLER_DOM_THRESHOLD_KEY = 'IAA_KILLER_DOM_THRESHOLD';
  const KILLER_PERFECT_TIME_KEY = 'IAA_KILLER_PERFECT_TIME';
  const KILLER_PT_MODE_KEY = 'IAA_KILLER_PT_MODE';
  const KILLER_ADX_DYNAMIC_KEY = 'IAA_KILLER_ADX_DYNAMIC';
  const KILLER_CANDLE_HARDSTOP_KEY = 'IAA_KILLER_CANDLE_HARDSTOP';
  const KILLER_SIGNAL_COOLDOWN_SEC_KEY = 'IAA_KILLER_SIGNAL_COOLDOWN_SEC';
  const KILLER_USE_STRATEGY_VOTES_KEY = 'IAA_KILLER_USE_STRATEGY_VOTES';
  const KILLER_STRATEGY_AGREEMENT_KEY = 'IAA_KILLER_STRATEGY_AGREEMENT';
  const BIAS_ENABLED_KEY = 'IAA_BIAS_ENABLED';
  const BIAS_MODE_KEY = 'IAA_BIAS_MODE';
  const BIAS_STRONG_THRESHOLD_KEY = 'IAA_BIAS_STRONG_THRESHOLD';
  const STABILITY_ENABLED_KEY = 'IAA_STABILITY_ENABLED';
  const STABILITY_MAX_GAP_MS_KEY = 'IAA_STABILITY_MAX_GAP_MS';
  const TOLERANCE_MODE_KEY = 'IAA_TOLERANCE_MODE';
  const TOLERANCE_CONFIDENCE_KEY = 'IAA_TOLERANCE_CONFIDENCE';
  const KILLER_THRESHOLD_MODE_KEY = 'IAA_KILLER_THRESHOLD_MODE';
  const SUPPORTING_FILTERS_ENABLED_KEY = 'IAA_SUPPORTING_FILTERS_ENABLED';
  const CHOP_V2_ENABLED_KEY = 'IAA_CHOP_V2_ENABLED';
  const CHOP_V2_STRENGTH_KEY = 'IAA_CHOP_V2_STRENGTH';
  const CHOP_V5_HARDSTOP_KEY = 'IAA_CHOP_V5_HARDSTOP';
  const CHOP_V5_PANEL_OPEN_KEY = 'IAA_CHOP_V5_PANEL_OPEN';
  const KILLER_DYNAMIC_COLLAPSED_KEY = 'IAA_KILLER_DYNAMIC_COLLAPSED';
  const DYNAMIC_CORE_COLLAPSED_KEY = 'IAA_DYNAMIC_CORE_COLLAPSED';
  const DYNAMIC_STAKE_COLLAPSED_KEY = 'IAA_DYNAMIC_STAKE_COLLAPSED';
  const KILLER_HUD_POS_KEY = 'IAA_KILLER_HUD_POS';
  const KILLER_BASE_AMOUNT_KEY = 'IAA_KILLER_BASE_AMOUNT_CENTS';
  const KILLER_THRESHOLD_KEY = 'IAA_KILLER_THRESHOLD';
  const KILLER_THRESHOLD_OTC_KEY = 'IAA_KILLER_THRESHOLD_OTC';
  const KILLER_THRESHOLD_REAL_KEY = 'IAA_KILLER_THRESHOLD_REAL';
  const KILLER_MIN_PAYOUT_KEY = 'IAA_KILLER_MIN_PAYOUT';
  const KILLER_ENTRY_ПЕЧАЛБИDOW_SEC_KEY = 'IAA_KILLER_ENTRY_ПЕЧАЛБИDOW_SEC';
  const ENTRYПЕЧАЛБИ_TF_ENABLED_KEY = 'IAA_ENTRYПЕЧАЛБИ_TF_ENABLED';
  const ENTRYПЕЧАЛБИ_1M_SEC_KEY = 'IAA_ENTRYПЕЧАЛБИ_1M_SEC';
  const ENTRYПЕЧАЛБИ_3M_SEC_KEY = 'IAA_ENTRYПЕЧАЛБИ_3M_SEC';
  const ENTRYПЕЧАЛБИ_5M_SEC_KEY = 'IAA_ENTRYПЕЧАЛБИ_5M_SEC';
  const KILLER_WARMUP_MIN_KEY = 'IAA_KILLER_WARMUP_MIN';
  const KILLER_VWAP_DEV_KEY = 'IAA_KILLER_VWAP_DEV';
  const KILLER_VWAP_LOOKBACK_KEY = 'IAA_KILLER_VWAP_LOOKBACK';
  const KILLER_MOMENTUM_KEY = 'IAA_KILLER_MOMENTUM';
  const KILLER_VOLUME_THRESHOLD_KEY = 'IAA_KILLER_VOLUME_THRESHOLD';
  const KILLER_EMA_FAST_KEY = 'IAA_KILLER_EMA_FAST';
  const KILLER_EMA_SLOW_KEY = 'IAA_KILLER_EMA_SLOW';
  const KILLER_RSI_OVERSOLD_KEY = 'IAA_KILLER_RSI_OVERSOLD';
  const KILLER_RSI_OVERBOUGHT_KEY = 'IAA_KILLER_RSI_OVERBOUGHT';
  const KILLER_KEEP_ALIVE_KEY = 'IAA_KILLER_KEEP_ALIVE';
  const FILTERMODE_ENABLED_KEY = 'IAA_FILTERMODE_ENABLED';
  const FILTERMODE_AUTO_KEY = 'IAA_FILTERMODE_AUTO';
  const FILTERMODE_MANUAL_KEY = 'IAA_FILTERMODE_MANUAL';
  const FILTERMODE_AUTO_WINDOW_KEY = 'IAA_FILTERMODE_AUTO_WINDOW_MIN';
  const FILTERMODE_AUTO_FLIPS_KEY = 'IAA_FILTERMODE_AUTO_FLIPS';
  const FILTERMODE_AUTO_DROPS_KEY = 'IAA_FILTERMODE_AUTO_DROPS';

  // Backwards/forwards-compat keys (some parts of the UI/logic refer to older names)
  // Keep ONE source of truth to avoid "... is not defined" crashes.
  const FILTERMODE_MODE_KEY = FILTERMODE_MANUAL_KEY; // stores current manual mode: 'soft' | 'auto' | 'strict'
  const FILTERMODE_AUTO_WINDOW_MIN_KEY = FILTERMODE_AUTO_WINDOW_KEY;
  const FILTERMODE_AUTO_FLIP_THRESH_KEY = FILTERMODE_AUTO_FLIPS_KEY;
  const FILTERMODE_AUTO_DROP_THRESH_KEY = FILTERMODE_AUTO_DROPS_KEY;
  const KILLER_VWAP_WEIGHT_KEY = 'IAA_KILLER_VWAP_WEIGHT';
  const KILLER_MOMENTUM_WEIGHT_KEY = 'IAA_KILLER_MOMENTUM_WEIGHT';
  const KILLER_VOLUME_WEIGHT_KEY = 'IAA_KILLER_VOLUME_WEIGHT';
  const KILLER_VWAP_ENABLED_KEY = 'IAA_KILLER_VWAP_ENABLED';
  const KILLER_MOMENTUM_ENABLED_KEY = 'IAA_KILLER_MOMENTUM_ENABLED';
  const KILLER_VOLUME_ENABLED_KEY = 'IAA_KILLER_VOLUME_ENABLED';
  const KILLER_TIMEFRAMES_KEY = 'IAA_KILLER_TIMEFRAMES_V1';

  const FILTER_SPREAD_ENABLED_KEY = 'IAA_FILTER_SPREAD_ENABLED';
  const FILTER_SPREAD_THRESHOLD_KEY = 'IAA_FILTER_SPREAD_THRESHOLD';
  const FILTER_DRIFT_ENABLED_KEY = 'IAA_FILTER_DRIFT_ENABLED';
  const FILTER_DRIFT_THRESHOLD_KEY = 'IAA_FILTER_DRIFT_THRESHOLD';
  const FILTER_FLIPDELAY_ENABLED_KEY = 'IAA_FILTER_FLIPDELAY_ENABLED';
  const FILTER_FLIPDELAY_SEC_KEY = 'IAA_FILTER_FLIPDELAY_SEC';
  const FILTER_IMPULSECAP_ENABLED_KEY = 'IAA_FILTER_IMPULSECAP_ENABLED';
  const FILTER_IMPULSECAP_MAX_KEY = 'IAA_FILTER_IMPULSECAP_MAX';
  const FILTER_DEAD_MARKET_ENABLED_KEY = 'IAA_FILTER_DEAD_MARKET_ENABLED';
  const FILTER_DEAD_MARKET_MIN_MOVE_KEY = 'IAA_FILTER_DEAD_MARKET_MIN_MOVE';
  const FILTER_DEAD_MARKET_MIN_LATENCY_MS_KEY = 'IAA_FILTER_DEAD_MARKET_MIN_LATENCY_MS';
  const FILTER_DEAD_MARKET_PANEL_OPEN_KEY = 'IAA_FILTER_DEAD_MARKET_PANEL_OPEN';
  const FILTER_CSEA_SE_ENABLED_KEY = 'IAA_FILTER_CSEA_SE_ENABLED';
  const ENGINE_GUARD_ENABLED_KEY = 'IAA_ENGINE_GUARD_ENABLED';
  const ENGINE_GUARD_IMPULSE_KEY = 'IAA_ENGINE_GUARD_IMPULSE';
  const ENGINE_GUARD_NOISE_KEY = 'IAA_ENGINE_GUARD_NOISE';
  const ENGINE_GUARD_PANEL_OPEN_KEY = 'IAA_ENGINE_GUARD_PANEL_OPEN';
  const ENGINE_GUARD_IMPULSE_ENABLED_KEY = 'IAA_ENGINE_GUARD_IMPULSE_ENABLED';
  const ENGINE_GUARD_NOISE_ENABLED_KEY = 'IAA_ENGINE_GUARD_NOISE_ENABLED';
  const ENGINE_GUARD_STABILIZER_SEC_KEY = 'IAA_ENGINE_GUARD_STABILIZER_SEC';
  const PRO_DRIFT_ENABLED_KEY = 'PRO_DRIFT_ENABLED';
  const PRO_SPIKE_ENABLED_KEY = 'PRO_SPIKE_ENABLED';
  const PRO_DOJI_ENABLED_KEY = 'PRO_DOJI_ENABLED';
  const PRO_DOJI_SENSITIVITY_KEY = 'PRO_DOJI_SENSITIVITY';
  const PRO_SR_ENABLED_KEY = 'PRO_SR_ENABLED';
  const PRO_SR_LOOKBACK_KEY = 'PRO_SR_LOOKBACK';
  const PRO_PRECALC_ENABLED_KEY = 'PRO_PRECALC_ENABLED';


  const RANGE_OSC_PENALTY_ENABLED_KEY = 'IAA_RANGE_OSC_PENALTY_ENABLED';
  const RANGE_OSC_PENALTY_PCT_KEY = 'IAA_RANGE_OSC_PENALTY_PCT';
  const FEATURE_VOLUME_REJECTION_KEY = 'IAA_FEATURE_VOLUME_REJECTION';
  const FEATURE_VWAP_ANALYSIS_KEY = 'IAA_FEATURE_VWAP_ANALYSIS';
  const FEATURE_SESSION_BOOST_KEY = 'IAA_FEATURE_SESSION_BOOST';
  const FEATURE_TIMEFRAMES_KEY = 'IAA_FEATURE_TIMEFRAMES_V1';
  const PHASE_CATCH_MOVE_KEY = 'IAA_PHASE_CATCH_MOVE';
  const PHASE_RELOAD_KILLER_KEY = 'IAA_PHASE_RELOAD_KILLER';
  const STRATEGY_WR_WEIGHT_KEY = 'IAA_STRATEGY_WR_WEIGHT';
  const STRATEGY_PNL_WEIGHT_KEY = 'IAA_STRATEGY_PNL_WEIGHT';
  const STRATEGY_LEARNING_СДЕЛКИ_KEY = 'IAA_STRATEGY_LEARNING_СДЕЛКИ';
  const STRATEGY_ЗАГУБИ_STREAK_LIMIT_KEY = 'IAA_STRATEGY_ЗАГУБИ_STREAK_LIMIT';
  const STRATEGY_CONFIG_KEY = 'IAA_STRATEGY_CONFIG_V1';
  const RSI_DIVERGENCE_LOOKBACK_KEY = 'IAA_RSI_DIVERGENCE_LOOKBACK';
  const RSI_DIVERGENCE_MIN_DELTA_KEY = 'IAA_RSI_DIVERGENCE_MIN_DELTA';
  const RSI_DIVERGENCE_RSI_ПЕЧАЛБИDOW_KEY = 'IAA_RSI_DIVERGENCE_RSI_ПЕЧАЛБИDOW';
  const CANDLE_PATTERN_MIN_CONF_KEY = 'IAA_CANDLE_PATTERN_MIN_CONF';
  const CANDLE_PATTERN_ENABLED_KEY = 'IAA_CANDLE_PATTERN_ENABLED';
  const CANDLE_PATTERN_WEIGHT_KEY = 'IAA_CANDLE_PATTERN_WEIGHT';
  const EMA_RSI_FAST_KEY = 'IAA_EMA_RSI_FAST';
  const EMA_RSI_SLOW_KEY = 'IAA_EMA_RSI_SLOW';
  const EMA_RSI_RSI_ПЕЧАЛБИDOW_KEY = 'IAA_EMA_RSI_RSI_ПЕЧАЛБИDOW';
  const EMA_RSI_OVERSOLD_KEY = 'IAA_EMA_RSI_OVERSOLD';
  const EMA_RSI_OVERBOUGHT_KEY = 'IAA_EMA_RSI_OVERBOUGHT';
  const PARTNER_READY_1M_BARS_KEY = 'IAA_PARTNER_READY_1M_BARS';
  const PARTNER_READY_3M_BARS_KEY = 'IAA_PARTNER_READY_3M_BARS';
  const PARTNER_READY_5M_BARS_KEY = 'IAA_PARTNER_READY_5M_BARS';
  const PARTNER_READY_15M_BARS_KEY = 'IAA_PARTNER_READY_15M_BARS';
  const WS_PRICE_SAMPLE_TTL_MS = 2000;
  const MAX_СДЕЛКИ_PER_MIN_KEY = 'IAA_MAX_СДЕЛКИ_PER_MIN';
  const MAX_OPEN_СДЕЛКИ_KEY = 'IAA_MAX_OPEN_СДЕЛКИ';
  const IDLE_SWITCH_ENABLED_KEY = 'IAA_IDLE_SWITCH_ENABLED';
  const IDLE_SWITCH_MIN_KEY = 'IAA_IDLE_SWITCH_MIN';
  const REGIME_STRENGTH_KEY = 'IAA_REGIME_STRENGTH';
  const CONFIRMATION_STRENGTH_KEY = 'IAA_CONFIRMATION_STRENGTH';
  const BIAS_STRENGTH_KEY = 'IAA_BIAS_STRENGTH';
  const BIAS_TF_1M_KEY = 'IAA_BIAS_TF_1M';
  const BIAS_TF_3M_KEY = 'IAA_BIAS_TF_3M';
  const BIAS_TF_5M_KEY = 'IAA_BIAS_TF_5M';
  const BIAS_POINT_MIN_STRENGTH_KEY = 'IAA_BIAS_POINT_MIN_STRENGTH';
  const CONFLICT_STRENGTH_KEY = 'IAA_CONFLICT_STRENGTH';
  const KILLER_5S_DEFAULTS = {
    baseAmountCents: 100,
    threshold: 0.65,
    minPayout: 70,
    entryWindowSec: 5,
    warmupMin: 6,
    vwapDeviation: 0.0012,
    vwapLookbackMin: 2,
    momentumThreshold: 0.0014,
    // Mapped from UI 1..100 to an actual range threshold ratio (1%=lenient, 100%=strict)
    chopThreshold: 0.021,
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
    multiThresholdPct: 99,
    multiCount: 2,
    multiAmountPct: 50,
    timeframes: { '1m': true, '3m': true, '5m': true, '15m': true }
  };
  const FEATURE_DEFAULTS = {
    volumeRejection: false,
    vwapAnalysis: false,
    sessionBoost: false,
    timeframes: { '1m': true, '3m': true, '5m': true, '15m': false }
  };
  const STRATEGY_DEFAULTS = {
    configs: {
      scalp_microtrend: { enabled: true, priority: 1, label: 'SCALP Microtrend' },
      ema_rsi_pullback: { enabled: true, priority: 0.95, label: 'EMA+RSI Pullback' },
      continuation: { enabled: true, priority: 0.92, label: 'Continuation / Продължение', maxTrendMaturity: 65 },
      candlestick_pattern: { enabled: true, priority: 0.88, label: 'Candlestick Pattern' }
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

  function normalizeFeedAssetLabel(label) {
    if (!label) return '';
    return String(label)
      .replace(/\(OTC\)/ig, '_OTC')
      .replace(/[^A-Za-z0-9]+/g, '')
      .toUpperCase();
  }

  function stripFeedOtcSuffix(label) {
    return String(label || '').replace(/OTC$/i, '');
  }

  function currentAssetMatchesFeedAsset(feedAsset) {
    const candidate = normalizeFeedAssetLabel(feedAsset);
    if (!candidate) return true;
    const current = normalizeFeedAssetLabel(getCurrentAssetLabel() || S.lastAssetLabel || '');
    if (!current) return true;
    return candidate === current || stripFeedOtcSuffix(candidate) === stripFeedOtcSuffix(current);
  }

  function inferPriceFromNumericSample(rawValue, prevPrice = null) {
    const n = Number(rawValue);
    if (!Number.isFinite(n) || n <= 0) return null;
    const directDecimals = String(n).includes('.') ? String(n).split('.')[1].length : 0;
    const candidates = [];

    const pushCandidate = (value, decimals, scale) => {
      if (!Number.isFinite(value) || value <= 0 || value > 1000000) return;
      candidates.push({ value, decimals: Math.max(0, Math.min(8, decimals)), scale });
    };

    if (n < 10000) {
      pushCandidate(n, directDecimals, 1);
    } else {
      for (const scale of [1, 10, 100, 1000, 10000, 100000, 1000000]) {
        const value = n / scale;
        const dec = scale === 1 ? directDecimals : Math.round(Math.log10(scale));
        pushCandidate(value, dec, scale);
      }
    }
    if (!candidates.length) return null;

    const preferred = candidates.filter((c) => c.value >= 0.00001 && c.value <= 10000);
    const scoped = preferred.length ? preferred : candidates;

    if (Number.isFinite(prevPrice) && prevPrice > 0) {
      scoped.sort((a, b) => Math.abs(a.value - prevPrice) - Math.abs(b.value - prevPrice));
      return scoped[0];
    }

    scoped.sort((a, b) => {
      const aScore = Math.abs((a.decimals >= 2 && a.decimals <= 6) ? 0 : 3) + Math.abs(a.value - 1);
      const bScore = Math.abs((b.decimals >= 2 && b.decimals <= 6) ? 0 : 3) + Math.abs(b.value - 1);
      return aScore - bScore;
    });
    return scoped[0];
  }

  function extractPriceFromWsPayload(payload) {
    if (!payload) return null;
    const text = typeof payload === 'string' ? payload : JSON.stringify(payload);
    if (!text) return null;

    const normalized = String(text).trim();
    const jsonPart = normalized.replace(/^\d+-?/, '');
    let parsed = null;
    if (jsonPart.startsWith('{') || jsonPart.startsWith('[')) {
      try { parsed = JSON.parse(jsonPart); } catch {}
    }

    let best = null;
    const prevPrice = Number.isFinite(S.currentAssetPrice) ? S.currentAssetPrice : null;

    const consider = (num, asset = '', ts = 0) => {
      const priceInfo = inferPriceFromNumericSample(num, prevPrice);
      if (!priceInfo) return;
      if (!best || Math.abs(priceInfo.value - (prevPrice || priceInfo.value)) < Math.abs(best.value - (prevPrice || best.value))) {
        best = {
          value: priceInfo.value,
          decimals: priceInfo.decimals,
          asset: asset || null,
          timestamp: Number.isFinite(Number(ts)) ? Number(ts) : Date.now(),
          scale: priceInfo.scale
        };
      }
    };

    const parseTuple = (node) => {
      if (!Array.isArray(node) || node.length < 2 || typeof node[0] !== 'string') return false;
      const symbol = String(node[0] || '').trim();
      if (!symbol) return false;
      const maybeTs = Number(node[1]);
      let raw = null;
      let ts = Date.now();

      if (node.length >= 3 && Number.isFinite(Number(node[2]))) {
        raw = Number(node[2]);
        if (Number.isFinite(maybeTs)) {
          ts = maybeTs > 1e12 ? maybeTs : maybeTs > 1e10 ? Math.floor(maybeTs / 1000) : maybeTs * 1000;
        }
      } else if (Number.isFinite(maybeTs)) {
        raw = maybeTs;
      }

      if (!Number.isFinite(Number(raw))) return false;
      consider(Number(raw), symbol, ts);
      return true;
    };

    const walk = (node, path = []) => {
      if (node == null) return;
      if (typeof node === 'number') {
        const keyHint = path.join('.').toLowerCase();
        if (/(price|bid|ask|rate|quote|last|close|open|high|low|value|tick)/.test(keyHint)) consider(node);
        return;
      }
      if (Array.isArray(node)) {
        if (parseTuple(node)) return;
        for (let i = 0; i < node.length; i += 1) walk(node[i], path.concat(String(i)));
        return;
      }
      if (typeof node === 'object') {
        const asset = node.asset || node.symbol || node.pair || node.instrument || '';
        const ts = node.timestamp || node.ts || node.time || node.t || Date.now();
        const values = [node.priceInt, node.price, node.value, node.last, node.close, node.bid, node.ask, node.rate, node.quote];
        for (const maybe of values) {
          if (Number.isFinite(Number(maybe))) consider(Number(maybe), asset, ts);
        }
        for (const [k, v] of Object.entries(node)) walk(v, path.concat(k));
      }
    };

    if (parsed != null) {
      if (Array.isArray(parsed) && parsed.length >= 2 && typeof parsed[0] === 'string' && Array.isArray(parsed[1])) {
        parseTuple(parsed[1]);
      }
      walk(parsed, ['root']);
      if (best) return best;
    }

    const regex = /"(price|bid|ask|rate|quote|last|close|open|high|low|value)"\s*:\s*([0-9]+(?:[.,][0-9]+)?)/gi;
    let match;
    while ((match = regex.exec(text)) !== null) {
      const raw = match[2].replace(',', '.');
      consider(parseFloat(raw));
    }

    return best;
  }

  function decodeWsMessageData(data) {
    if (data == null) return null;
    if (typeof data === 'string') return data;
    if (data instanceof ArrayBuffer) {
      try { return new TextDecoder('utf-8').decode(new Uint8Array(data)); } catch { return null; }
    }
    if (ArrayBuffer.isView(data)) {
      try {
        const view = data;
        return new TextDecoder('utf-8').decode(new Uint8Array(view.buffer, view.byteOffset, view.byteLength));
      } catch {
        return null;
      }
    }
    return null;
  }

  function handleWsMessageData(data) {
    const decoded = decodeWsMessageData(data);
    if (decoded != null) {
      handleWsPriceSample(decoded);
      return;
    }
    if (typeof Blob !== 'undefined' && data instanceof Blob) {
      data.text().then((text) => {
        if (typeof text === 'string' && text.length) handleWsPriceSample(text);
      }).catch(() => {});
      return;
    }
    handleWsPriceSample(data);
  }

  function handleWsPriceSample(payload) {
    ingestHistoryFromPayload(payload);
    WS_FEED_BUFFER.packetsSeen = (WS_FEED_BUFFER.packetsSeen || 0) + 1;
    const priceInfo = extractPriceFromWsPayload(payload);
    if (!priceInfo) return;
    applyPriceFromNumericSample(
      priceInfo.value,
      priceInfo.decimals,
      'ws',
      priceInfo.asset || '',
      priceInfo.timestamp || Date.now()
    );
  }

  function decodeSocketAttachmentJson(payload) {
    if (typeof payload !== 'string' || !payload) return null;
    let text = payload.trim();
    if (!text) return null;
    if (text[0] === '{' || text[0] === '[') {
      try { return JSON.parse(text); } catch {}
    }
    try {
      text = atob(text);
      return JSON.parse(text);
    } catch {
      return null;
    }
  }

  function wsTsToMs(ts) {
    const n = Number(ts);
    if (!Number.isFinite(n)) return Date.now();
    if (n > 1e12) return Math.round(n);
    if (n > 1e10) return Math.round(n / 1000);
    return Math.round(n * 1000);
  }

  function countPriceDecimals(value) {
    if (!Number.isFinite(Number(value))) return 5;
    const txt = String(value);
    const dot = txt.indexOf('.');
    if (dot < 0) return 0;
    return Math.max(0, Math.min(8, txt.length - dot - 1));
  }

  function wsCommandToDirection(command) {
    const c = Number(command);
    if (c === 0) return 'BUY';
    if (c === 1) return 'SELL';
    return null;
  }

  function findActiveTradeByWsDeal(deal) {
    const active = Array.isArray(S.activeTrades) ? S.activeTrades : [];
    if (!active.length || !deal) return null;
    const wsId = deal.id ? String(deal.id) : '';
    if (wsId) {
      const byId = active.find((t) => String(t.wsDealId || '') === wsId);
      if (byId) return byId;
    }

    const dir = wsCommandToDirection(deal.command);
    const asset = String(deal.asset || '').trim();
    const openTsMs = wsTsToMs(deal.openTimestamp || 0);
    const closeTsMs = wsTsToMs(deal.closeTimestamp || 0);
    const expirySec = Math.max(1, Math.round((closeTsMs - openTsMs) / 1000));

    let best = null;
    for (const t of active) {
      if (!t || t.outcomeChecked) continue;
      if (asset && t.asset && String(t.asset).toUpperCase() !== asset.toUpperCase()) continue;
      if (dir && t.direction && String(t.direction).toUpperCase() !== dir) continue;
      const tradeOpen = Number(t.startTime || 0);
      const timeDist = Math.abs(tradeOpen - openTsMs);
      if (timeDist > 180000) continue;
      const tradeExp = Number(t.expiryMs || 0) / 1000;
      const expDist = tradeExp > 0 ? Math.abs(tradeExp - expirySec) : 0;
      const score = timeDist + expDist * 1000;
      if (!best || score < best.score) best = { trade: t, score };
    }
    return best ? best.trade : null;
  }

  function handleWsOpenOrderPayload(payload) {
    const deal = payload && typeof payload === 'object' ? payload : null;
    if (!deal || !deal.id) return;
    const trade = findActiveTradeByWsDeal(deal);
    if (!trade) return;
    trade.wsDealId = String(deal.id);
    trade.openConfirmed = true;
    trade.openConfirmedBy = 'WS_SUCCESS_OPEN';
    const openTsMs = wsTsToMs(deal.openTimestamp || 0);
    const closeTsMs = wsTsToMs(deal.closeTimestamp || 0);
    if (openTsMs > 0) trade.startTime = openTsMs;
    if (closeTsMs > openTsMs) {
      trade.expectedEnd = closeTsMs + C.SETTLEMENT_DELAY_MS;
      trade.expiryMs = Math.max(1000, closeTsMs - openTsMs);
      const sec = Math.max(1, Math.round((closeTsMs - openTsMs) / 1000));
      if (sec === 60) trade.expiry = '1m';
      else if (sec === 180) trade.expiry = '3m';
      else if (sec === 300) trade.expiry = '5m';
    }
  }

  function handleWsCloseOrderPayload(payload) {
    if (!payload || typeof payload !== 'object') return;
    const deals = Array.isArray(payload.deals) ? payload.deals : [];
    for (const deal of deals) {
      if (!deal || !deal.id) continue;
      const trade = findActiveTradeByWsDeal(deal);
      if (!trade) continue;
      const profit = Number(deal.profit);
      let profitCents = 0;
      if (Number.isFinite(profit)) {
        profitCents = Math.round(profit * 100);
      } else {
        const amount = Number(deal.amount || trade.totalAmountCents / 100 || trade.amountCents / 100 || 0);
        profitCents = Math.round(amount * 100);
      }
      const outcome = profitCents > 0 ? 'ПЕЧАЛБИ' : (profitCents < 0 ? 'ЗАГУБИ' : 'EVEN');
      finalizeTradeOutcome(trade, outcome, profitCents, wsTsToMs(deal.closeTimestamp || Date.now()), 'WS_SUCCESS_CLOSE');
    }
  }

  function handleWsBalancePayload(payload) {
    if (!payload || typeof payload !== 'object') return;
    const bal = Number(payload.balance);
    if (!Number.isFinite(bal)) return;
    const cents = Math.round(bal * 100);
    if (!Number.isFinite(cents) || cents <= 0) return;
    S.balance = cents;
    S.lastBalanceCents = cents;
    updateBalanceSummary();
  }

  function handleWsSocketFramePayload(payload) {
    if (typeof payload !== 'string' || !payload) return;
    const frame = payload.trim();
    if (!frame) return;

    if (frame.startsWith('42[') || frame.startsWith('43[')) {
      try {
        const parsed = JSON.parse(frame.slice(2));
        if (Array.isArray(parsed) && parsed.length >= 1) {
          const eventName = String(parsed[0] || '');
          const body = parsed.length > 1 ? parsed[1] : null;
          if (eventName === 'updateStream') {
            const rows = Array.isArray(body) ? body : [];
            for (const row of rows) {
              if (!Array.isArray(row) || row.length < 3) continue;
              const asset = String(row[0] || '').trim();
              const tsMs = wsTsToMs(row[1]);
              const price = Number(row[2]);
              if (!Number.isFinite(price)) continue;
              applyPriceFromNumericSample(price, countPriceDecimals(price), 'ws', asset, tsMs);
            }
            return;
          }
          if (eventName === 'successopenOrder') {
            handleWsOpenOrderPayload(body);
            return;
          }
          if (eventName === 'successcloseOrder') {
            handleWsCloseOrderPayload(body);
            return;
          }
          if (eventName === 'successupdateBalance') {
            handleWsBalancePayload(body);
            return;
          }
        }
      } catch {}
    }

    if (frame.startsWith('451-[')) {
      try {
        const parsed = JSON.parse(frame.slice(4));
        const eventName = Array.isArray(parsed) ? String(parsed[0] || '') : '';
        if (eventName) S.wsPendingSocketEvent = eventName;
      } catch {}
      return;
    }

    const pending = String(S.wsPendingSocketEvent || '');
    if (!pending) {
      handleWsMessageData(frame);
      return;
    }
    const decoded = decodeSocketAttachmentJson(frame);
    if (decoded == null) {
      handleWsMessageData(frame);
      return;
    }

    if (pending === 'updateStream') {
      const rows = Array.isArray(decoded) ? decoded : [];
      for (const row of rows) {
        if (!Array.isArray(row) || row.length < 3) continue;
        const asset = String(row[0] || '').trim();
        const tsMs = wsTsToMs(row[1]);
        const price = Number(row[2]);
        if (!Number.isFinite(price)) continue;
        applyPriceFromNumericSample(price, countPriceDecimals(price), 'ws', asset, tsMs);
      }
    } else if (pending === 'successopenOrder') {
      handleWsOpenOrderPayload(decoded);
    } else if (pending === 'successcloseOrder') {
      handleWsCloseOrderPayload(decoded);
    } else if (pending === 'successupdateBalance') {
      handleWsBalancePayload(decoded);
    }

    S.wsPendingSocketEvent = null;
  }

  function validateFeedPrice(value, decimals = 5, prevPrice = null) {
    if (!Number.isFinite(value)) return { ok: false, reason: 'nan_value' };
    if (value <= 0) return { ok: false, reason: 'non_positive' };
    if (value > 1000000) return { ok: false, reason: 'too_large' };
    if (value < 0.000001) return { ok: false, reason: 'too_small' };
    const d = Number.isFinite(decimals) ? decimals : 0;
    if (d < 0 || d > 10) return { ok: false, reason: 'bad_decimals' };
    if (Number.isFinite(prevPrice) && prevPrice > 0) {
      const jump = Math.abs(value - prevPrice) / prevPrice;
      if (jump > 0.95 && Math.abs(value - prevPrice) > Math.max(1, prevPrice * 40)) {
        return { ok: false, reason: 'extreme_jump' };
      }
    }
    return { ok: true, reason: '' };
  }

  function isLikelyFeedPrice(value, decimals = 5, prevPrice = null) {
    return validateFeedPrice(value, decimals, prevPrice).ok;
  }

  function ingestHistoryFromPayload(payload) {
    try {
      const text = typeof payload === 'string' ? payload : JSON.stringify(payload);
      if (!text) return;
      const normalized = String(text).trim();
      const jsonPart = normalized.replace(/^\d+-?/, '');
      if (!jsonPart.startsWith('{') && !jsonPart.startsWith('[')) return;
      const parsed = JSON.parse(jsonPart);
      const botState = window.InfinityBot?.S || S;
      if (!botState || !Array.isArray(botState.priceHistory)) return;

      const ingestPoint = (ts, value) => {
        const p = Number(value);
        if (!Number.isFinite(p)) return;
        if (p <= 0 || p >= 10000) return;
        const t = Number(ts);
        const ms = Number.isFinite(t)
          ? (t > 1e12 ? t : t > 1e10 ? Math.floor(t / 1000) : t * 1000)
          : Date.now();
        appendPriceHistoryTick(botState, p, ms, 'history_payload');
      };

      const ingestHistoryArray = (arr) => {
        if (!Array.isArray(arr) || !arr.length) return;
        const tail = arr.slice(-900);
        for (const row of tail) {
          if (!Array.isArray(row) || row.length < 2) continue;
          if (Array.isArray(row[1])) {
            for (const item of row[1]) {
              if (Array.isArray(item) && item.length >= 2 && typeof item[0] === 'string') {
                ingestPoint(row[0], item[1]);
              }
            }
            continue;
          }
          ingestPoint(row[0], row[1]);
        }
      };

      const walk = (node) => {
        if (!node) return;
        if (Array.isArray(node)) {
          if (node.length >= 5 && Number.isFinite(Number(node[0])) && Number.isFinite(Number(node[2]))) {
            ingestPoint(node[0], node[2]);
          }
          for (const v of node) walk(v);
          return;
        }
        if (typeof node === 'object') {
          if (Array.isArray(node.history)) ingestHistoryArray(node.history);
          if (Array.isArray(node.candles)) ingestHistoryArray(node.candles);
          if (typeof node.asset === 'string' && Number.isFinite(Number(node.value)) && Number.isFinite(Number(node.timestamp))) {
            ingestPoint(node.timestamp, node.value);
          }
          for (const v of Object.values(node)) walk(v);
        }
      };

      walk(parsed);
      trimPriceHistory(botState);
    } catch {}
  }

  function trimPriceHistory(botState = S) {
    if (!botState || !Array.isArray(botState.priceHistory)) return;
    if (botState.priceHistory.length > PRICE_HISTORY_MAX_POINTS) {
      botState.priceHistory = botState.priceHistory.slice(-PRICE_HISTORY_MAX_POINTS);
    }
  }

  function appendPriceHistoryTick(botState = S, price, timestamp = Date.now(), source = 'unknown') {
    if (!botState || !Array.isArray(botState.priceHistory)) return false;
    const p = Number(price);
    const ts = Number.isFinite(Number(timestamp)) ? Number(timestamp) : Date.now();
    if (!Number.isFinite(p) || p <= 0 || p >= 10000) return false;
    const tail = botState.priceHistory[botState.priceHistory.length - 1];
    if (tail && Number.isFinite(tail.price) && Number.isFinite(tail.timestamp)) {
      const samePrice = Math.abs(tail.price - p) < 1e-8;
      const tooClose = Math.abs(tail.timestamp - ts) <= PRICE_HISTORY_DEDUPE_MS;
      if (samePrice && tooClose) {
        botState.historyDuplicateTicks = (botState.historyDuplicateTicks || 0) + 1;
        botState.lastHistoryRejectReason = `duplicate_${source}`;
        return false;
      }
    }
    botState.priceHistory.push({ price: p, timestamp: ts });
    botState.historyAcceptedTicks = (botState.historyAcceptedTicks || 0) + 1;
    botState.lastHistoryRejectReason = null;
    trimPriceHistory(botState);
    return true;
  }

  function applyPriceFromNumericSample(price, decimals = 5, source = 'bridge', asset = '', sampleTs = Date.now()) {
    const value = Number(price);
    if (!Number.isFinite(value)) return false;
    const d = Number.isFinite(decimals) ? decimals : 5;
    const prevPrice = Number.isFinite(S.currentAssetPrice) ? S.currentAssetPrice : null;

    if (!currentAssetMatchesFeedAsset(asset)) {
      WS_FEED_BUFFER.lastRejectReason = 'asset_mismatch';
      S.lastPriceRejectReason = 'asset_mismatch';
      return false;
    }

    const validation = validateFeedPrice(value, d, prevPrice);
    if (!validation.ok) {
      WS_FEED_BUFFER.lastRejectReason = validation.reason;
      S.lastPriceRejectReason = validation.reason;
      return false;
    }

    const at = Number.isFinite(Number(sampleTs)) ? Number(sampleTs) : Date.now();
    WS_FEED_BUFFER.packetsSeen = (WS_FEED_BUFFER.packetsSeen || 0) + 1;
    WS_FEED_BUFFER.lastPrice = value;
    WS_FEED_BUFFER.lastDecimals = d;
    WS_FEED_BUFFER.lastAt = at;
    WS_FEED_BUFFER.lastAsset = asset || null;
    WS_FEED_BUFFER.lastSource = source;
    WS_FEED_BUFFER.lastRejectReason = null;

    if (source === 'bridge') {
      WS_FEED_BUFFER.bridgeFramesSeen = (WS_FEED_BUFFER.bridgeFramesSeen || 0) + 1;
    }

    const botState = window.InfinityBot?.S || S;
    if (botState) {
      botState.wsPacketsSeen = WS_FEED_BUFFER.packetsSeen;
      botState.wsBridgeFramesSeen = WS_FEED_BUFFER.bridgeFramesSeen || 0;
      botState.wsLastPrice = value;
      botState.wsLastPriceDecimals = d;
      botState.wsLastPriceAt = at;
      botState.currentAssetPrice = value;
      botState.currentAssetPriceDecimals = d;
      botState.lastPriceAt = at;
      botState.lastPriceRejectReason = null;
      botState.lastFeedSource = source;
      botState.feedState = 'READY';
      appendPriceHistoryTick(botState, value, at, `feed_${source}`);
    }
    return true;
  }

  function ensurePageWsBridgeListener() {
    if (window.__iaaBridgeListenerReady) return;
    window.__iaaBridgeListenerReady = true;
    window.addEventListener('message', (event) => {
      if (event.source !== window) return;
      const data = event.data;
      if (!data || typeof data.__iaaType !== 'string') return;

      if (data.__iaaType === 'IAA_WS_BRIDGE_READY') {
        WS_FEED_BUFFER.bridgeReady = true;
        const st = window.InfinityBot?.S;
        if (st) st.wsBridgeReady = true;
        return;
      }

      if (data.__iaaType === PO_PRICE_EVENT) {
        const price = Number(data.price);
        const decimals = Number.isFinite(Number(data.decimals)) ? Number(data.decimals) : countPriceDecimals(price);
        const ts = Number.isFinite(Number(data.ts)) ? Number(data.ts) : Date.now();
        const asset = String(data.asset || '').trim();
        if (Number.isFinite(price)) {
          WS_FEED_BUFFER.bridgeFramesSeen = (WS_FEED_BUFFER.bridgeFramesSeen || 0) + 1;
          WS_FEED_BUFFER.bridgeReady = true;
          const readyState = window.InfinityBot?.S || S;
          if (readyState) readyState.wsBridgeReady = true;
          try { applyPriceFromNumericSample(price, decimals, 'ws', asset, ts); } catch {}
        }
        return;
      }

      if (data.__iaaType !== 'IAA_WS_BRIDGE_FRAME' || typeof data.payload !== 'string') return;
      const source = 'ws';
      WS_FEED_BUFFER.bridgeFramesSeen = (WS_FEED_BUFFER.bridgeFramesSeen || 0) + 1;

      WS_FEED_BUFFER.bridgeReady = true;
      const readyState = window.InfinityBot?.S || S;
      if (readyState) readyState.wsBridgeReady = true;

      try {
        handleWsSocketFramePayload(data.payload);
      } catch {}
    }, false);
  }

  function ensurePageWsBridgeInjected() {
    if (window.__iaaBridgeInjectAttempted) return;
    window.__iaaBridgeInjectAttempted = true;
    window.__iaaBridgeInjectOk = false;
    window.__iaaBridgeInjectError = null;

    const injectInlineBridge = () => {
      try {
        const script = document.createElement('script');
        script.dataset.iaaBridge = '1';
        script.dataset.iaaBridgeMode = 'inline-fallback';
        script.textContent = `(() => {
          if (window.__iaaInlineWsBridgeInstalled) return;
          window.__iaaInlineWsBridgeInstalled = true;

          const toText = (payload) => {
            try {
              if (typeof payload === 'string') return payload;
              if (payload instanceof ArrayBuffer) {
                return new TextDecoder().decode(new Uint8Array(payload));
              }
              if (typeof Blob !== 'undefined' && payload instanceof Blob) {
                return payload.text();
              }
              return String(payload ?? '');
            } catch {
              return '';
            }
          };

          const post = (payload, source = 'ws') => {
            try {
              const maybe = toText(payload);
              if (maybe && typeof maybe.then === 'function') {
                maybe.then((txt) => {
                  if (!txt) return;
                  try { window.postMessage({ __iaaType: 'IAA_WS_BRIDGE_FRAME', source, payload: String(txt) }, '*'); } catch {}
                }).catch(() => {});
                return;
              }
              const txt = String(maybe || '');
              if (!txt) return;
              window.postMessage({ __iaaType: 'IAA_WS_BRIDGE_FRAME', source, payload: txt }, '*');
            } catch {}
          };

          const postReady = () => {
            try { window.postMessage({ __iaaType: 'IAA_WS_BRIDGE_READY', source: 'ws' }, '*'); } catch {}
          };

          try {
            const NativeWS = window.WebSocket;
            if (typeof NativeWS === 'function') {
              const nativeDispatch = NativeWS.prototype && NativeWS.prototype.dispatchEvent;
              if (typeof nativeDispatch === 'function' && !NativeWS.prototype.__iaaDispatchPatched) {
                NativeWS.prototype.__iaaDispatchPatched = true;
                NativeWS.prototype.dispatchEvent = function(ev) {
                  try {
                    if (ev && ev.type === 'message') post(ev.data, 'ws');
                  } catch {}
                  return nativeDispatch.call(this, ev);
                };
              }

              const Wrapped = function(...args) {
                const ws = new NativeWS(...args);
                try {
                  ws.addEventListener('message', (ev) => {
                    const d = ev && ev.data;
                    post(d, 'ws');
                  });
                } catch {}
                return ws;
              };
              Wrapped.prototype = NativeWS.prototype;
              try {
                Object.defineProperty(Wrapped, 'CONNECTING', { value: NativeWS.CONNECTING });
                Object.defineProperty(Wrapped, 'OPEN', { value: NativeWS.OPEN });
                Object.defineProperty(Wrapped, 'CLOSING', { value: NativeWS.CLOSING });
                Object.defineProperty(Wrapped, 'CLOSED', { value: NativeWS.CLOSED });
              } catch {}
              window.WebSocket = Wrapped;
            }
          } catch {}

          postReady();
        })();`;
        (document.documentElement || document.head || document.body)?.appendChild(script);
        script.remove();
        window.__iaaBridgeInjectOk = true;
        window.__iaaBridgeInjectError = null;
        return true;
      } catch (err) {
        window.__iaaBridgeInjectOk = false;
        window.__iaaBridgeInjectError = `inline_inject_exception:${String(err?.message || err || 'unknown')}`;
        return false;
      }
    };

    try {
      const src = chrome?.runtime?.getURL?.('inject.js');
      if (!src) {
        window.__iaaBridgeInjectError = 'inject_url_unavailable';
        injectInlineBridge();
        return;
      }
      if (document.querySelector('script[data-iaa-bridge-mode="inject-js"]')) {
        window.__iaaBridgeInjectOk = true;
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.async = false;
      script.dataset.iaaBridge = '1';
      script.dataset.iaaBridgeMode = 'inject-js';
      script.addEventListener('load', () => {
        window.__iaaBridgeInjectOk = true;
        window.__iaaBridgeInjectError = null;
        script.remove();
      }, { once: true });
      script.addEventListener('error', () => {
        window.__iaaBridgeInjectOk = false;
        window.__iaaBridgeInjectError = 'inject_script_load_error';
        injectInlineBridge();
        script.remove();
      }, { once: true });
      (document.documentElement || document.head || document.body)?.appendChild(script);
    } catch (err) {
      window.__iaaBridgeInjectOk = false;
      window.__iaaBridgeInjectError = `inject_exception:${String(err?.message || err || 'unknown')}`;
      injectInlineBridge();
    }
  }

  function installWebSocketPriceTap() {
    // WS bridge is now the primary feed source.
    ensurePageWsBridgeListener();
    ensurePageWsBridgeInjected();
    const botState = window.InfinityBot?.S;
    if (botState) {
      botState.wsTapInstalled = true;
      botState.wsBridgeListener = !!window.__iaaBridgeListenerReady;
      botState.wsBridgeInjected = !!window.__iaaBridgeInjectOk;
      botState.wsBridgeReady = !!WS_FEED_BUFFER.bridgeReady;
    }
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
    
        /* Hide deprecated UI */
        #iaa-killer-toggle, #iaa-killer-panel { display:none !important; }
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
      // Селектор за баланса (DOM)
      // Използва се за ledger/confirm без СДЕЛКИ панел.
      BALANCE_SEL: 'body > div.wrapper > div.wrapper__top > header > div.right-block.js-right-block > div.right-block__item.js-drop-down-modal-open > div > div.balance-info-block__data > div.balance-info-block__balance > span',
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
      DEDUPE_ПЕЧАЛБИDOW_MIN: 5,
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
    // Баланс селектор (alias за удобство)
    const BALANCE_SEL = C.BALANCE_SEL;


    /* ------------------------------ STATE ------------------------------ */
    const S = {
      running:false, loop:null,
      lastPrice:null, priceHistory:[],
      lastPriceAt: 0,
      lastAssetLabel: null,
      lastAssetLabelNormalized: null,
      killerFastWarmupUntil: 0,
      activeTrades: [], tradeLockUntil:0, tradeCount:0,
      autoTrade:true,
      mode: 'killer',

      // money
      currentAmount:null, baseAmount:null, tradeProfitLoss:0, balance:0,
      lastTradeOutcome:null, botStartTime:0, expirySetting:'1m',
      botStartBalance: null,
      forceAssetSelect: false,

      // balance observer
      balObs: null,
      balanceBeforeTrade: null,
      // balance event ledger
      lastBalanceCents: null,
      balanceEvents: [],
      balanceEventsMax: 500,
      // selection guards
      assetSelectionAttempted: false,

      // finalize guard
      finalizedTradeId: null,

      // outcome gating
      tradeOutcomeChecked: false,

      // Price tracking
      lastTradeEntryPrice: null,
      currentAssetPrice: null,
      currentAssetPriceDecimals: null,
      wsLastPrice: null,
      wsLastPriceDecimals: null,
      wsLastPriceAt: 0,
      wsPacketsSeen: 0,
      wsBridgeFramesSeen: 0,
      wsTapInstalled: false,
      wsBridgeListener: false,
      wsBridgeInjected: false,
      wsBridgeReady: false,
      wsPendingSocketEvent: null,
        feedState: 'NO_FEED',
      lastPriceRejectReason: null,
      lastFeedSource: null,
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
      killerKeepAliveEnabled: false,
      keepAliveInterval: null,
      keepAliveActive: false,
      killerKeepAliveEnabled: false,
      // filter mode (Soft/Strict/AUTO)
      filterModeEnabled: false,
      filterModeAutoEnabled: true,
      filterModeManual: 'soft',
      filterModeCurrent: 'soft',
      filterModeLastChangedAt: 0,
      filterModePanelOpen: false,
      filterAutoWindowMin: 12,
      filterAutoFlipThreshold: 3,
      filterAutoDropThreshold: 2,
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
      readinessStartedAt: 0,
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
      dynamicMode: 'off', // off | dynamic | hybrid
      dynamicMinSec: 15,
      dynamicMaxSec: 300,
      dynamicExpiryStepSec: 5,
      dynamicEntryStepSec: 5,
      dynamicLookbackSec: 600,
      dynamicMinSamples: 40,
      dynamicMinWinrate: 0.55,
      dynamicChopPenalty: 0.03,
      dynamicLatePenalty: 0.02,
      dynamicAllowNoTrade: true,
      dynamicStakeScaleEnabled: false,
      dynamicStakeMult8: 0.15,
      dynamicStakeMult9: 0.30,
      dynamicStakeBoostWr: 0.05,
      dynamicStakeBoostMinSamples: 60,
      dynamicStakeLossReduce: 0.10,
      dynamicTwoStageEnabled: true,
      dynamicFineStepSec: 1,
      dynamicCandleSyncEnabled: true,
      dynamicLatencyCompMs: 800,
      dynamicPreCalcEnabled: true,
      dynamicVolatilityAdaptive: true,
      cachedDynamicPlan: null,
      cachedDynamicPlanAt: 0,
      dynamicCoreCollapsed: false,
      dynamicStakeCollapsed: true,
      killerDynamicCollapsed: true,
      killerEnabled: true,
      killerHudEnabled: false,
      killerMinConfluence: 8,
      killerDominanceThreshold: 68,
      killerPerfectTimeEnabled: false,
      killerPerfectTimeMode: 'hard',
      killerAdxDynamicEnabled: true,
      killerCandleAgainstHardStop: true,
      killerSignalCooldownSec: 5,
      killerUseStrategyVotes: true,
      killerStrategyAgreementMin: 1,
      killerEdgeState: {},
      killerHudPos: { x: null, y: null },
      killerSnapshot: null,
      biasEnabled: true,
      biasMode: 'points',
      biasStrongThreshold: 0.45,
      stabilityEnabled: true,
      stabilityMaxGapMs: 3500,
      toleranceMode: 'either',
      toleranceConfidence: 0.75,
      killerThresholdMode: '8of11',
      supportingFiltersEnabled: true,
      chopV2Enabled: true,
      chopV2StrengthPct: 50,
      chopV5HardStopEnabled: false,
      chopV5PanelOpen: false,
      biasPanelOpen: false,
      stabilityPanelOpen: false,
      deadMarketEnabled: false,
      deadMarketMinMove: 0.00010,
      deadMarketMinLatencyMs: 1500,
      deadMarketPanelOpen: false,
      cseaSeFilterEnabled: false,
      engineGuardEnabled: true,
      engineGuardPanelOpen: false,
      engineGuardImpulseEnabled: true,
      engineGuardNoiseEnabled: true,
      engineGuardImpulse: 0.70,
      engineGuardNoise: 0.55,
      engineGuardStabilizerSec: 3,
      driftProtectionEnabled: true,
      spikeProtectionEnabled: true,
      filterDojiEnabled: true,
      dojiSensitivity: 0.15,
      filterSrEnabled: false,
      srLookback: 20,
      proPrecalcEnabled: true,
      proFiltersPanelOpen: false,
      preCalculatedSignal: null,
      precalcCandleLockByKey: {},
      blockBuy: false,
      blockSell: false,
      singleAssetMode: true,
      _dirLock: { dir: null, until: 0 },
      _engineStabilizerByTf: {},
      maxTradeAmountCents: 15000,
      maxTradeAmountMultiplier: 1.5,
      analysisWindowSec: 300,
      analysisWarmupMin: 5,
      selfTradeEnabled: false,

      // strategy parameters
      rsiDivergenceLookback: 14,
      rsiDivergenceMinDelta: 6,
      rsiDivergenceRsiWindow: 14,
      candlestickPatternMinConfidence: 0.6,
      candlestickPatternEnabled: true,
      candlestickPatternWeight: 0.25,
      emaRsiFast: 8,
      emaRsiSlow: 21,
      emaRsiWindow: 14,
      emaRsiOversold: 35,
      emaRsiOverbought: 65,
      partnerReadyBars1m: 10,
      partnerReadyBars3m: 6,
      partnerReadyBars5m: 3,
      partnerReadyBars15m: 2,
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
      biasTimeframes: { '1m': true, '3m': true, '5m': true },
      biasPointMinStrength: 'medium',
      conflictStrength: 0.6,
      lossReports: [],
      maxTradesPerMinute: 5,
      maxOpenTrades: 5,
      idleSwitchEnabled: false,
      idleSwitchMinutes: 60,
      lastIdleSwitchAt: 0,

      // Execution state tracking
      executionStartTime: 0,
      executionTimeoutId: null,
      engineState: 'IDLE',
      lastScoreSnapshot: null,
      lastTickBusyWarnAt: 0,

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
      lastDiagnosticsMinuteKey: null,
      lastObsBaselineMinuteKey: null,
      logSpamCache: Object.create(null),
      obsMetrics: {
        detected: 0,
        precheckPass: 0,
        precheckStop: 0,
        precalcReady: 0,
        commitPass: 0,
        commitBlock: 0,
        executePass: 0,
        executeFail: 0,
        deterministicFlip: 0
      },
      signalTraceStageById: {},
      signalTraceShortIdById: {},
      signalTraceLastEventById: {},
      signalTraceSeenByCandle: {},
      deterministicDecisionByTfCandle: {},
      deterministicSummaryState: {},
      /* ---------- Killer mode ---------- */
      killerBaseAmount: KILLER_5S_DEFAULTS.baseAmountCents,
      killerThreshold: KILLER_5S_DEFAULTS.threshold,
      killerThresholdOtc: KILLER_5S_DEFAULTS.threshold,
      killerThresholdReal: KILLER_5S_DEFAULTS.threshold,
      killerMinPayout: KILLER_5S_DEFAULTS.minPayout,
      killerEntryWindowSec: KILLER_5S_DEFAULTS.entryWindowSec,
      entryWindowTfEnabled: true,
      entryWindowSec1m: 15,
      entryWindowSec3m: 35,
      entryWindowSec5m: 150,
      killerWarmupMin: KILLER_5S_DEFAULTS.warmupMin,
      killerVwapDeviation: KILLER_5S_DEFAULTS.vwapDeviation,
      killerVwapLookbackMin: KILLER_5S_DEFAULTS.vwapLookbackMin,
      killerMomentumThreshold: KILLER_5S_DEFAULTS.momentumThreshold,
      killerVwapEnabled: false,
      killerMomentumEnabled: false,
      killerVolumeEnabled: false,
      killerNoTradeInChop: false,
      killerRsiOversold: KILLER_5S_DEFAULTS.rsiOversold,
      killerRsiOverbought: KILLER_5S_DEFAULTS.rsiOverbought,
      killerRsiWindow: KILLER_5S_DEFAULTS.rsiWindow,
      killerEmaFast: KILLER_5S_DEFAULTS.emaFast,
      killerEmaSlow: KILLER_5S_DEFAULTS.emaSlow,
      killerStochOversold: KILLER_5S_DEFAULTS.stochOversold,
      killerStochOverbought: KILLER_5S_DEFAULTS.stochOverbought,
      killerStochWindow: KILLER_5S_DEFAULTS.stochWindow,
      killerVolumeThreshold: KILLER_5S_DEFAULTS.volumeThreshold,
      killerSharpeWindowMin: KILLER_5S_DEFAULTS.sharpeWindowMin,
      killerVwapWeight: KILLER_5S_DEFAULTS.vwapWeight,
      killerMomentumWeight: KILLER_5S_DEFAULTS.momentumWeight,
      killerVolumeWeight: KILLER_5S_DEFAULTS.volumeWeight,
      killerEnabledTimeframes: { ...KILLER_5S_DEFAULTS.timeframes },
      featureVolumeRejection: FEATURE_DEFAULTS.volumeRejection,
      featureVwapAnalysis: FEATURE_DEFAULTS.vwapAnalysis,
      featureSessionBoost: FEATURE_DEFAULTS.sessionBoost,
      strategyConfigs: { ...STRATEGY_DEFAULTS.configs },
      strategyTradeCount: 0,
      killerLastTradeByTf: {},
      killerWarmupUntil: 0,
      killerLastDecision: null,
      currentStrategyKey: null,
      lastStrategyKey: null,
      killerNextTradeByTf: {},
      killerInFlightKey: null,
      killerInFlightUntil: 0,
      killerTfStatus: {},
      strategyStats: {},
      killerSettingsCollapsed: false,
      killerWeightsCollapsed: false,
      killerSmartCollapsed: false,
      killerEngineCollapsed: false,
      killerRiskCollapsed: false,
      killerNewFiltersCollapsed: true,
      killerSettingsTab: 'basic',
      debugTab: 'status',
      debugEnabled: false,
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
      clockDriftSec: null,
      lastSkipReason: '',
      lastSkipAt: 0,
      skipReasonCounts: {},
      skipStats: { pass: 0, wait: 0, confluence: 0, dominance: 0, perfectTime: 0, chop: 0, payout: 0, tolerance: 0, strategy: 0, other: 0 },
      lastStatusAt: 0,

      /* ---------- ENHANCED: Countdown and UI states ---------- */
      countdownActive: false,
      countdownStartTime: 0,
      countdownTargetTime: 0,
      uiState: 'IDLE', // IDLE, SWITCHING_ASSET, IDENTIFYING_PATTERN, PATTERN_IDENTIFIED, EXECUTING, RESULTS
      lastBalanceCheck: null,
      cycleProfitLoss: 0,
      tradeExecutionTime: 0,
      patternIdentifiedTime: 0,
      historyAcceptedTicks: 0,
      historyDuplicateTicks: 0,
      lastHistoryRejectReason: null,
      tfReadyMinCount: 1,
      strategyFlipCooldownMs: 2500,
      lastStrategyDirection: null,
      lastStrategyDirectionAt: 0,
      pendingTradeConfirmations: [],
      lastDecisionSnapshot: null
    };

    function applyKillerDefaults() {
      const defaults = KILLER_5S_DEFAULTS;
      if (!Number.isFinite(S.killerBaseAmount)) {
        S.killerBaseAmount = defaults.baseAmountCents;
      }
      S.killerThreshold = defaults.threshold;
      if (!Number.isFinite(S.killerThresholdOtc)) {
        S.killerThresholdOtc = defaults.threshold;
      }
      if (!Number.isFinite(S.killerThresholdReal)) {
        S.killerThresholdReal = defaults.threshold;
      }
      S.killerMinPayout = defaults.minPayout;
      S.killerEntryWindowSec = defaults.entryWindowSec;
      S.killerWarmupMin = defaults.warmupMin;
      S.killerVwapDeviation = defaults.vwapDeviation;
      S.killerVwapLookbackMin = defaults.vwapLookbackMin;
      S.killerMomentumThreshold = defaults.momentumThreshold;
      if (typeof S.killerVwapEnabled !== 'boolean') S.killerVwapEnabled = false;
      if (typeof S.killerMomentumEnabled !== 'boolean') S.killerMomentumEnabled = false;
      if (typeof S.killerVolumeEnabled !== 'boolean') S.killerVolumeEnabled = false;
      if (typeof S.killerNoTradeInChop !== 'boolean') S.killerNoTradeInChop = false;
      S.killerRsiOversold = defaults.rsiOversold;
      S.killerRsiOverbought = defaults.rsiOverbought;
      S.killerRsiWindow = defaults.rsiWindow;
      S.killerEmaFast = defaults.emaFast;
      S.killerEmaSlow = defaults.emaSlow;
      S.killerStochOversold = defaults.stochOversold;
      S.killerStochOverbought = defaults.stochOverbought;
      S.killerStochWindow = defaults.stochWindow;
      S.killerVolumeThreshold = defaults.volumeThreshold;
      S.killerSharpeWindowMin = defaults.sharpeWindowMin;
      S.killerVwapWeight = defaults.vwapWeight;
      S.killerMomentumWeight = defaults.momentumWeight;
      S.killerVolumeWeight = defaults.volumeWeight;
      S.killerEnabledTimeframes = { ...defaults.timeframes };
      if (typeof S.featureVolumeRejection !== 'boolean') S.featureVolumeRejection = FEATURE_DEFAULTS.volumeRejection;
      if (typeof S.featureVwapAnalysis !== 'boolean') S.featureVwapAnalysis = false;
      if (typeof S.featureSessionBoost !== 'boolean') S.featureSessionBoost = FEATURE_DEFAULTS.sessionBoost;
      if (!S.killerEnabledTimeframes) S.killerEnabledTimeframes = { ...FEATURE_DEFAULTS.timeframes };
      if (!S.strategyConfigs) S.strategyConfigs = { ...STRATEGY_DEFAULTS.configs };
      if (typeof S.candlestickPatternEnabled !== 'boolean') S.candlestickPatternEnabled = true;
      if (!Number.isFinite(S.candlestickPatternWeight)) S.candlestickPatternWeight = 0.25;
      if (typeof S.phaseCatchMoveEnabled !== 'boolean') S.phaseCatchMoveEnabled = false;
      if (typeof S.phaseReloadKillerEnabled !== 'boolean') S.phaseReloadKillerEnabled = false;
    }

    const SETTINGS_I18N = {
      base_amount: 'Базова сума ($)',
      expiry_setting: 'Време на изтичане:',
      expiry_1m: '1 минута',
      expiry_5m: '5 минути',
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
      mode_killer: 'KILLER',
      killer_panel_title: 'KILLER настройки',
      killer_max_session_loss: 'Стоп при загуба (€):',
      killer_max_loss_streak: 'Стоп при поредни загуби:',
      killer_timeframes: 'Таймфрейми за изпълнение:',
      killer_keep_alive: 'Дръж таба активен'
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
      skip_reason: '🔴 СТОП | {reason}',
      diagnostics: 'ℹA|{dir} {conf}%|праг {thr}%|{strategy}|{skip}',
      diagnostics_score: '{result}|{points}|{strategy}|{reason}',
      trade_buttons_missing: 'Пропуск: липсват бутони',
      trade_amount_missing: 'Пропуск: липсва поле за сума',
      asset_selected: 'Избран актив: {asset}',
      asset_select_failed: 'Провал при избор на актив',
      payout_missing: 'Липсва изплащане',
      analysis_ready_selftrade_off: 'Анализът е готов, но самостоятелните сделки са изключени.',
      switching_asset: 'Смяна на актив',
      identifying_pattern: 'Търсене на входен модел',
      pattern_identified: 'Моделът е открит',
      trade_executed: '💥 СДЕЛКА',
      trade_won: '✅ ПЕЧАЛБА',
      trade_lost: '❌ ЗАГУБА',
      trade_even: '⚪ НЕУТРАЛНО',
      trade_outcome_detail: 'Резултат: {asset} {direction} {expiry} → {outcome}',
      killer_no_feed: 'KILLER: няма цена',
      risk_limit_hit: '🛑 ДОСТИГНАТ ЛИМИТ НА РИСКА - БОТЪТ Е СПРЯН',
      bot_loaded: 'Ботът е зареден и готов.',
      session_ok: 'Whitelist сесията е потвърдена.',
      killer_warming_up: 'KILLER: зареждане на история ({seconds} мин)',
      killer_ready: 'KILLER: готов за входове',
      start_label: 'Старт',
      total_label: 'Общо',
      win_label: 'Печалби',
      loss_label: 'Загуби',
      win_rate_label: '%',
      lag_label: 'Лаг',
      feed_label: 'Цена'
    };

    const SKIP_REASON_I18N = {
      spread_low: 'Spread: слаб bias',
      drift: 'Drift: signal умира',
      flip_delay: 'Flip delay',
      impulse_cap: 'Impulse cap',
      dead_market: 'Мъртъв пазар',
      dead_market_stale: 'Мъртъв пазар: feed stale',
      dead_market_low_movement: 'Мъртъв пазар: слаб ход',
      csea_se: 'CS+EA+SE филтър',
      chop_hard_stop: 'CHOP hard stop',
      IMPULSE_EXTENSION: 'Engine Guard: импулс',
      MICRO_NOISE: 'Engine Guard: шум',
      DIR_STABILIZER: 'Engine Guard: стабилизатор',
      engine_guard: 'Engine Guard: блокиран',

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
      ExpiryParse: 'Време: нечетим формат',
      ExpiryOpen: 'Време: не отваря меню',
      ExpiryCoords: 'Време: липсват координати',
      ExpiryPreset: 'Време: preset неуспешен',
      ExpiryFallback: 'Време: fallback неуспешен',
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
      return 'killer';
    }

    function isKillerMode() {
      return getActiveMode() === 'killer';
    }

    function getEffectiveKeepAliveEnabled() {
      return S.killerKeepAliveEnabled;
    }

    function setMode() {
      S.mode = 'killer';
      stopCountdown();
      S.forceImmediate = false;
      S.killerWarmupUntil = Date.now();
      S.killerLastTradeByTf = {};
      S.killerNextTradeByTf = {};
      S.killerTfStatus = {};
      renderKillerMatrix();
      persistSettings();
      renderSettingsPanel();
      if (S.running) {
        if (getEffectiveKeepAliveEnabled()) startKeepAlive();
        else stopKeepAlive();
      }
    }

    function getSelfTradeAllowed() {
      return S.selfTradeEnabled;
    }

    function evaluatePrecheckGateCore(tf, decision, regime, requiredThreshold) {
      if (!decision || !decision.direction) return { pass: false, reason: 'слаб сигнал' };
      const conf = Number(decision.confidence || 0);
      const minBase = Number.isFinite(Number(S.analysisConfidenceThreshold)) ? Number(S.analysisConfidenceThreshold) : 0.42;
      const confNeed = Math.max(minBase, Number(requiredThreshold || 0) - 0.18);
      if (conf < confNeed) return { pass: false, reason: 'слаба увереност', details: `${(conf * 100).toFixed(0)}% < ${(confNeed * 100).toFixed(0)}%` };
      const t = Number(decision.timeInCandle || 0);
      const lim = Number(decision.entryWindowSec || 0);
      if (lim > 0 && t > lim) return { pass: false, reason: 'късен вход', details: `${t.toFixed(1)}s > ${lim.toFixed(0)}s` };
      const regimeState = String(regime?.state || '').toLowerCase();
      if (regimeState === 'chop') {
        const chopStrength = Number(regime?.rangeScore || regime?.chopScore || 0);
        return { pass: false, reason: 'ЧОП', details: chopStrength > 0 ? `chop=${(chopStrength * 100).toFixed(0)}%` : '' };
      }
      if (regimeState === 'trend') {
        const trendScore = Number(regime?.trendScore || 0);
        const trendLateLimit = Math.max(8, lim * 0.75);
        if (trendScore >= 0.75 && t > trendLateLimit) return { pass: false, reason: 'късен тренд', details: `${t.toFixed(1)}s > ${trendLateLimit.toFixed(1)}s | trend=${(trendScore * 100).toFixed(0)}%` };
      }
      const biasDir = Number(decision?.biasDir || 0);
      if (biasDir !== 0) {
        const biasDirection = biasDir > 0 ? 'BUY' : 'SELL';
        if (decision.direction && decision.direction !== biasDirection && Math.abs(biasDir) > 0.45) {
          return { pass: false, reason: 'конфликт', details: `${String(decision.direction || '').toUpperCase()} vs ${biasDirection} (${(Math.abs(biasDir) * 100).toFixed(0)}%)` };
        }
      }

      const windowMs = KILLER_TF_MS[tf] || 60000;
      const dir = String(decision.direction || '').toUpperCase();
      const stabilizerSec = Math.max(0, Math.min(20, Number(S.engineGuardStabilizerSec || 0)));
      if (stabilizerSec > 0 && dir) {
        S._engineStabilizerByTf = S._engineStabilizerByTf || {};
        const rec = S._engineStabilizerByTf[tf] || { dir: null, since: 0 };
        const nowMs = Date.now();
        if (rec.dir !== dir) {
          S._engineStabilizerByTf[tf] = { dir, since: nowMs, strategyKey: String(decision.strategyKey || '') };
          return { pass: false, reason: 'DIR_STABILIZER', details: `нова посока ${dir}: изчакване ${stabilizerSec}s` };
        }
        const heldMs = Math.max(0, nowMs - Number(rec.since || nowMs));
        if (heldMs < stabilizerSec * 1000) {
          const left = ((stabilizerSec * 1000 - heldMs) / 1000).toFixed(1);
          return { pass: false, reason: 'DIR_STABILIZER', details: `задръжка ${left}s (${dir})` };
        }
      }

      const guardCtx = {
        candle: getCandleAt(Date.now(), windowMs),
        price: Number(S.currentAssetPrice),
        candleAgeSec: getTimeInCandleSec(windowMs),
        lastTicks: (S.priceHistory || []).slice(-8).map((p) => Number(p?.price)).filter(Number.isFinite),
        tf,
        direction: dir
      };
      if (!iaaEngineGuard(guardCtx)) {
        return {
          pass: false,
          reason: guardCtx.rejectReason || 'engine_guard',
          details: guardCtx.rejectDetails || ''
        };
      }

      return { pass: true, reason: '' };
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

        // Special compact lines (no timestamp in UI)
        if (messageText.startsWith('🔁')) {
          return `<div class="iaa-console-line iaa-console-line--compact"><span class="iaa-console-msg iaa-console-msg--recheck">${messageText}</span></div>`;
        }
        // Divider line
        if (messageText.startsWith('────')) {
          return `<div class="iaa-console-line iaa-console-line--divider"><span class="iaa-console-msg iaa-console-msg--divider">${messageText}</span></div>`;
        }

        const lower = messageText.toLowerCase();
        let msgClass = 'iaa-console-msg';
        if (messageText.startsWith('🟢🧭 ПРЕЧЕК УСПЕШЕН')) {
          msgClass += ' iaa-console-msg--signal';
        } else if (messageText.startsWith('🔴🧭 ПРЕЧЕК СТОП')) {
          msgClass += ' iaa-console-msg--skip';
        } else if (messageText.startsWith('🔫 ⏳')) {
          msgClass += ' iaa-console-msg--warn';
        } else if (messageText.startsWith('🔫🎯 ГОТОВ')) {
          msgClass += ' iaa-console-msg--signal';
        } else if (messageText.startsWith('⏱️⏭️ PRECALC ГОТОВ')) {
          msgClass += ' iaa-console-msg--signal';
        } else if (messageText.startsWith('⏩ PRECALC ПРЕХВЪРЛЯНЕ')) {
          msgClass += ' iaa-console-msg--signal';
        } else if (messageText.startsWith('🟡 PRECALC ПРОПУСК') || messageText.startsWith('🟠 PRECALC ПРОПУСК')) {
          msgClass += ' iaa-console-msg--warn';
        } else if (messageText.startsWith('🟢 PRECALC ИЗХОД')) {
          msgClass += ' iaa-console-msg--signal';
        } else if (messageText.startsWith('🟠 PRECALC ИЗХОД')) {
          msgClass += ' iaa-console-msg--warn';
        } else if (messageText.startsWith('🔴 PRECALC БЛОК')) {
          msgClass += ' iaa-console-msg--skip';
        } else if (messageText.startsWith('🔵 PRECALC ПРОПУСК') || messageText.startsWith('⚪ Предварителен анализ: ИЗКЛ')) {
          msgClass += ' iaa-console-msg--diag';
        } else if (messageText.startsWith('💥 СДЕЛКА')) {
          msgClass += ' iaa-console-msg--trade';
        } else if (messageText.startsWith('✅')) {
          msgClass += ' iaa-console-msg--signal';
        } else if (messageText.startsWith('❌')) {
          msgClass += ' iaa-console-msg--skip';
        } else if (messageText.startsWith('⚪')) {
          msgClass += ' iaa-console-msg--diag';
        } else if (messageText.startsWith('ℹ') || lower.startsWith('diag') || lower.startsWith('диагн')) {
          msgClass += ' iaa-console-msg--diag';
        } else if (lower.includes('missing') || lower.includes('липсва')) {
          msgClass += ' iaa-console-msg--warn';
        }
        return `<div class="iaa-console-line"><span class="iaa-console-time">[${timeText}]</span><span class="${msgClass}">${messageText}</span></div>`;
      };
      linesEl.innerHTML = S.consoleLines.map(formatLine).join('');
      linesEl.scrollTop = linesEl.scrollHeight;
    }

    function compactRecheckMessage(message){
      if (!message) return null;
      // Example:
      if (!/повторна проверка/i.test(message)) return null;

      // TF
      const tfMatch = message.match(/🔴\s*СТОП\s*\|\s*([0-9]+m)\s+повторна проверка/i);
      const tf = tfMatch ? tfMatch[1].toLowerCase() : 'tf';

      // Direction flip
      const flipMatch = message.match(/посока\s+([A-Z]+)→([A-Z]+)/i);
      const flip = flipMatch ? `${flipMatch[1].toUpperCase()}→${flipMatch[2].toUpperCase()}` : null;

      // Confidence numbers
      const prevCurMatch = message.match(/увереност\s+(\d+)%→(\d+)%/i);
      const curMatch = message.match(/увереност\s+(\d+)%/i);
      const cur = curMatch ? curMatch[1] : null;

      if (prevCurMatch){
        const prev = prevCurMatch[1];
        const cur2 = prevCurMatch[2];
        return `🔁 ${tf} ${flip ? flip + ' | ' : ''}${prev}→${cur2}`;
      }
      if (flip && cur){
        return `🔁 ${tf} ${flip} | ${cur}%`;
      }
      if (cur){
        return `🔁 ${tf} ${cur}%`;
      }
      return `🔁 ${tf}`;
    }

    function stylizeConsoleMessage(message){
      if (!message) return message;
      // Color BUY/SELL word inside click line
      return message;
    }

    function logConsoleLine(message){
      if (!message) return;
      // Compact spammy re-check logs
      const compact = compactRecheckMessage(message);
      if (compact) message = compact;

      message = stylizeConsoleMessage(message);
      const m = String(message || '').trim();
      const allowed = (
        m.startsWith('🟢🧭 ПРЕЧЕК УСПЕШЕН') ||
        m.startsWith('🔴🧭 ПРЕЧЕК СТОП') ||
        m.startsWith('🔫 ⏳') ||
        m.startsWith('🔫🎯 ГОТОВ') ||
        m.startsWith('🧾 COMMIT |') ||
        m.startsWith('🔴🧾 COMMIT БЛОК |') ||
        m.startsWith('🔵🧾 COMMIT ПРОПУСК |') ||
        m.startsWith('🧾 ОК |') ||
        m.startsWith('🔴🧾 БЛОК |') ||
        m.startsWith('🔵🧾 ПРОПУСК |') ||
        m.startsWith('🧭 СЛЕДА |') ||
        m.startsWith('🟣 СТАБИЛНОСТ |') ||
        m.startsWith('📊 СТАТУС |') ||
        m.startsWith('🧭 TRACE |') ||
        m.startsWith('🟣 DETERMINISM |') ||
        m.startsWith('📊 BASELINE |') ||
        m.startsWith('⏱️⏭️ PRECALC ГОТОВ |') ||
        m.startsWith('⏩ PRECALC ПРЕХВЪРЛЯНЕ |') ||
        m.startsWith('🟡 PRECALC ПРОПУСК |') ||
        m.startsWith('🟠 PRECALC ПРОПУСК |') ||
        m.startsWith('🟢 PRECALC ИЗХОД |') ||
        m.startsWith('🟠 PRECALC ИЗХОД |') ||
        m.startsWith('🔴 PRECALC БЛОК |') ||
        m.startsWith('🔵 PRECALC ПРОПУСК |') ||
        m.startsWith('⚪ Предварителен анализ: ИЗКЛ') ||
        m.startsWith('💥 СДЕЛКА |') ||
        m.startsWith('✅ ПЕЧАЛБА |') ||
        m.startsWith('❌ ЗАГУБА |') ||
        m.startsWith('⚪ НЕУТРАЛНО |') ||
        m.startsWith('────') ||
        m.startsWith('Калибрация') ||
        m.startsWith('IAA_EXPIRY_COORDS_')
      );
      if (!allowed) return;

      const now = Date.now();
      const isOutcomeMessage = /^✅|^❌|^⚪/.test(message);
      if (m.startsWith('💥 СДЕЛКА |')) {
        const parts = m.split('|').map((s) => s.trim());
        const tf = parts[1] || '-';
        const dir = parts[2] || '-';
        const amt = parts[3] || '-';
        const tradeKey = `trade-log:${tf}:${dir}:${amt}`;
        if (!logSpamControlled(tradeKey, tradeKey, 5000)) return;
      }
      if (!isOutcomeMessage && S.lastConsoleMessage === message && now - S.lastConsoleAt < 1500) return;
      S.lastConsoleMessage = message;
      S.lastConsoleAt = now;

      const stamp = new Date().toLocaleTimeString();
      S.consoleLines.push(`[${stamp}] ${message}`);
      if (S.consoleLines.length > 200) S.consoleLines.shift();
      try { sessionRecordLog(message, `[${stamp}] ${message}`); } catch (e) {}
      renderConsole();
    }

    function ensureObsStructures() {
      if (!S.obsMetrics || typeof S.obsMetrics !== 'object') {
        S.obsMetrics = {
          detected: 0,
          precheckPass: 0,
          precheckStop: 0,
          precalcReady: 0,
          commitPass: 0,
          commitBlock: 0,
          executePass: 0,
          executeFail: 0,
          deterministicFlip: 0
        };
      }
      if (!S.signalTraceStageById || typeof S.signalTraceStageById !== 'object') S.signalTraceStageById = {};
      if (!S.signalTraceShortIdById || typeof S.signalTraceShortIdById !== 'object') S.signalTraceShortIdById = {};
      if (!S.signalTraceLastEventById || typeof S.signalTraceLastEventById !== 'object') S.signalTraceLastEventById = {};
      if (!S.signalTraceSeenByCandle || typeof S.signalTraceSeenByCandle !== 'object') S.signalTraceSeenByCandle = {};
      if (!S.deterministicDecisionByTfCandle || typeof S.deterministicDecisionByTfCandle !== 'object') S.deterministicDecisionByTfCandle = {};
      if (!S.deterministicSummaryState || typeof S.deterministicSummaryState !== 'object') S.deterministicSummaryState = {};
    }

    function incrementObsMetric(key, amount = 1) {
      ensureObsStructures();
      const k = String(key || '').trim();
      if (!k) return;
      const prev = Number(S.obsMetrics[k] || 0);
      S.obsMetrics[k] = prev + Number(amount || 1);
    }

    function buildSignalTraceId(input = {}) {
      const tf = String(input?.tfKey || input?.entryMeta?.tfKey || input?.expiry || '1m').toLowerCase();
      const dir = String(input?.direction || '').toUpperCase() || '-';
      const candleStart = Number(input?.candleStart || input?.entryMeta?.candleStart || 0) || 0;
      const strategy = String(input?.strategyKey || input?.entryMeta?.strategyKey || 'na').toLowerCase();
      return `${tf}|${dir}|${candleStart}|${strategy}`;
    }

    function buildPrecalcCandidateKey(input = {}) {
      const tf = String(input?.tfKey || input?.expiry || '1m').toLowerCase();
      const dir = String(input?.direction || '').toUpperCase() || '-';
      const candleStart = Number(input?.candleStart || 0) || 0;
      return `${tf}|${candleStart}|${dir}`;
    }

    function buildPrecalcCandleLockKey(tfKey, candleStart) {
      return `${String(tfKey || '1m').toLowerCase()}|${Number(candleStart || 0)}`;
    }

    function setPrecalcCandleLock(tfKey, candleStart, patch = {}) {
      S.precalcCandleLockByKey = S.precalcCandleLockByKey || {};
      const key = buildPrecalcCandleLockKey(tfKey, candleStart);
      const prev = S.precalcCandleLockByKey[key] || {};
      S.precalcCandleLockByKey[key] = { ...prev, tfKey: String(tfKey || '1m').toLowerCase(), candleStart: Number(candleStart || 0), ...patch };
      return S.precalcCandleLockByKey[key];
    }

    function getPrecalcCandleLock(tfKey, candleStart) {
      const key = buildPrecalcCandleLockKey(tfKey, candleStart);
      return (S.precalcCandleLockByKey && S.precalcCandleLockByKey[key]) || null;
    }

    function isCandleLockedByPrecalc(tfKey, candleStart) {
      const lock = getPrecalcCandleLock(tfKey, candleStart);
      if (!lock || String(lock.source || '') !== 'PRECALC') return false;
      const status = String(lock.status || '').toUpperCase();
      return status === 'HANDOFF' || status === 'DROPPED' || status === 'EXECUTED';
    }

    function cleanupPrecalcCandleLocks(timeframes = []) {
      S.precalcCandleLockByKey = S.precalcCandleLockByKey || {};
      const allowed = new Set((timeframes || []).map((tf) => buildPrecalcCandleLockKey(tf, getCandleStart(KILLER_TF_MS[tf] || 0))));
      for (const key of Object.keys(S.precalcCandleLockByKey)) {
        if (!allowed.has(key)) delete S.precalcCandleLockByKey[key];
      }
    }

    function finalizePrecalcOutcome(decision, outcome = 'dropped', reason = '') {
      if (!decision || !decision._fromPreCalc || !decision._fromPreCalcHandoff) return false;
      const candidateKey = String(decision.precalcCandidateKey || buildPrecalcCandidateKey(decision));
      if (!candidateKey) return false;

      S.precalcFinalizedByKey = S.precalcFinalizedByKey || {};
      if (S.precalcFinalizedByKey[candidateKey]) return false;

      const tfOut = String(decision.tfKey || decision.expiry || '1m').toLowerCase();
      const dirOut = String(decision.direction || '').toUpperCase() || '-';
      const confOut = Math.round(Number(decision.confidence || 0) * 100);
      const normOutcome = String(outcome || '').toLowerCase() === 'executed' ? 'executed' : 'dropped';
      const normReason = String(reason || '').trim() || 'blocked';
      const outcomeTag = normOutcome === 'executed' ? 'executed' : `dropped:${normReason}`;
      const outcomeKey = `precalc:outcome:${candidateKey}:${outcomeTag}`;
      if (logSpamControlled(outcomeKey, outcomeTag, 60000)) {
        if (normOutcome === 'executed') logConsoleLine(`🟢 PRECALC ИЗХОД | ${tfOut} | ${dirOut} | conf=${confOut}% | key=${candidateKey} | executed`);
        else logConsoleLine(`🟠 PRECALC ИЗХОД | ${tfOut} | ${dirOut} | conf=${confOut}% | key=${candidateKey} | dropped:${normReason}`);
      }

      S.precalcFinalizedByKey[candidateKey] = { outcome: normOutcome, reason: normReason, t: Date.now() };

      setPrecalcCandleLock(decision.tfKey, decision.candleStart, {
        source: 'PRECALC',
        candidateKey,
        status: normOutcome === 'executed' ? 'EXECUTED' : 'DROPPED',
        reason: normOutcome === 'executed' ? 'executed' : normReason,
        finalizedAt: Date.now()
      });

      const active = S.preCalculatedSignal;
      if (active && String(active?.precalcCandidateKey || '') === candidateKey) {
        S.preCalculatedSignal = {
          ...active,
          handoffOutcome: normOutcome,
          handoffOutcomeReason: normOutcome === 'executed' ? 'executed' : normReason,
          finalizedAt: Date.now(),
          consumed: true
        };
        S.preCalculatedSignal = null;
      }
      return true;
    }

    function getSignalShortId(traceId) {
      ensureObsStructures();
      const key = String(traceId || '').trim();
      if (!key) return '0000';
      const cached = S.signalTraceShortIdById[key];
      if (cached) return cached;
      let h = 2166136261;
      for (let i = 0; i < key.length; i += 1) {
        h ^= key.charCodeAt(i);
        h = Math.imul(h, 16777619);
      }
      const shortId = String(Math.abs(h >>> 0) % 10000).padStart(4, '0');
      S.signalTraceShortIdById[key] = shortId;
      return shortId;
    }

    function normalizeTraceStage(stage = '') {
      const s = String(stage || '').trim().toUpperCase();
      if (!s) return 'ЕТАП';
      if (s === 'DETECTED') return 'СИГНАЛ';
      if (s === 'PRECHECK_PASS') return 'ПРЕЧЕК ОК';
      if (s === 'PRECHECK_STOP') return 'ПРЕЧЕК СТОП';
      if (s === 'PRECALC_READY') return 'PRECALC ГОТОВ';
      if (s === 'PRECALC_HANDOFF') return 'PRECALC ПРЕХВЪРЛЯНЕ';
      if (s === 'COMMIT_CANDIDATE') return 'COMMIT КАНДИДАТ';
      if (s === 'COMMIT_ATTEMPT') return 'COMMIT ОПИТ';
      if (s === 'COMMIT_PASS') return 'COMMIT ОК';
      if (s === 'COMMIT_BLOCK') return 'COMMIT БЛОК';
      if (s === 'COMMIT_DUPLICATE') return 'COMMIT ПРОПУСК';
      if (s === 'EXECUTE_PASS') return 'ВХОД';
      if (s === 'EXECUTE_FAIL') return 'БЛОК';
      return s;
    }

    function normalizeTraceReason(reason = '') {
      let r = String(reason || '').trim();
      if (!r) return '';
      // Keep semantic reason; drop payload noise after separators.
      r = r.replace(/\s+/g, ' ');
      r = r.split('|')[0].trim();
      r = r.replace(/\s*:\s*.*/g, '').trim();
      const low = r.toLowerCase();
      if (low.includes('dir_stabilizer') || low.includes('стабилизатор')) return 'DIR_STABILIZER';
      if (low.includes('impulse_extension') || low.includes('импулс')) return 'IMPULSE_EXTENSION';
      if (low.includes('micro_noise') || low.includes('шум')) return 'MICRO_NOISE';
      if (low.includes('конфликт') || low.includes('conflict')) return 'КОНФЛИКТ';
      if (low.includes('чоп') || low.includes('chop')) return 'ЧОП';
      if (low.includes('късен') || low.includes('late')) return 'КЪСЕН ВХОД';
      return r.toUpperCase();
    }

    function getTraceCandleStart(signal = {}) {
      const explicit = Number(signal?.candleStart || signal?.entryMeta?.candleStart || 0);
      if (Number.isFinite(explicit) && explicit > 0) return explicit;
      const tf = String(signal?.tfKey || signal?.entryMeta?.tfKey || signal?.expiry || '1m').toLowerCase();
      const tfMs = Number(KILLER_TF_MS?.[tf] || 60000);
      return Math.floor(Date.now() / tfMs) * tfMs;
    }

    function annotateSignalTrace(signal, stage = '', detail = '') {
      if (!signal || typeof signal !== 'object') return;
      ensureObsStructures();
      const traceId = String(signal.traceId || buildSignalTraceId(signal));
      signal.traceId = traceId;
      const tf = String(signal?.tfKey || signal?.entryMeta?.tfKey || signal?.expiry || '1m').toLowerCase();
      const shortId = getSignalShortId(traceId);
      const candleStart = getTraceCandleStart(signal);
      const nextStage = String(stage || '').trim();
      if (!nextStage) return;

      const reason = String(detail || '').trim();
      const normStage = normalizeTraceStage(nextStage);
      const normReason = normalizeTraceReason(reason);
      const signature = `${shortId}|${candleStart}|${normStage}|${normReason}`;
      const now = Date.now();
      const prev = S.signalTraceLastEventById[traceId] || { sig: '', at: 0 };
      const sameEvent = prev.sig === signature;
      const cooldownMs = 2500;
      if (sameEvent && (now - Number(prev.at || 0)) < cooldownMs) {
        return;
      }

      // TRACE remains helper-only: log only high-value lifecycle states.
      const majorStages = new Set(['СИГНАЛ','ПРЕЧЕК СТОП','PRECALC ПРЕХВЪРЛЯНЕ','COMMIT БЛОК','COMMIT ПРОПУСК','ВХОД','БЛОК']);
      if (!majorStages.has(normStage)) {
        return;
      }

      // During PRECALC window, keep TRACE helper-only by suppressing noisy signal/precheck trace lines.
      if (!S.debugEnabled && S.proPrecalcEnabled && (normStage === 'СИГНАЛ' || normStage === 'ПРЕЧЕК СТОП')) {
        const tfMs = Number(KILLER_TF_MS?.[tf] || 0);
        const t = Number(getTimeInCandleSec(tfMs));
        const tfSec = tfMs > 0 ? Math.round(tfMs / 1000) : 0;
        const inPrecalcWindow = tfSec > 10 && Number.isFinite(t) && t >= (tfSec - 5) && t <= (tfSec - 1);
        if (inPrecalcWindow) return;
      }

      // Per-candle semantic dedupe (shortId + candle + stage + normalizedReason).
      const candleKey = `${shortId}|${candleStart}|${normStage}|${normReason}`;
      const strictPerCandle = normStage === 'СИГНАЛ' || normStage === 'ПРЕЧЕК СТОП';
      const seen = S.signalTraceSeenByCandle[candleKey] || null;
      if (strictPerCandle && seen) return;
      if (!strictPerCandle && seen && (now - Number(seen.at || 0)) < cooldownMs) return;
      S.signalTraceSeenByCandle[candleKey] = { at: now };

      // Fallback semantic dedupe per TF+candle+stage+reason to prevent flood when shortId rotates.
      const tfCandleKey = `${tf}|${candleStart}|${normStage}|${normReason}`;
      const tfSeen = S.signalTraceSeenByCandle[`TF:${tfCandleKey}`] || null;
      if (strictPerCandle && tfSeen) return;
      if (!strictPerCandle && tfSeen && (now - Number(tfSeen.at || 0)) < cooldownMs) return;
      S.signalTraceSeenByCandle[`TF:${tfCandleKey}`] = { at: now };

      // SIGNAL is allowed once per shortId per candle.
      if (normStage === 'СИГНАЛ') {
        const onceKey = `${shortId}|${candleStart}|СИГНАЛ|ONCE`;
        if (S.signalTraceSeenByCandle[onceKey]) return;
        S.signalTraceSeenByCandle[onceKey] = { at: now };
      }
      if (normStage === 'ПРЕЧЕК СТОП') {
        const stopOnceKey = `${shortId}|${candleStart}|ПРЕЧЕК СТОП|${normReason}`;
        if (S.signalTraceSeenByCandle[stopOnceKey]) return;
        S.signalTraceSeenByCandle[stopOnceKey] = { at: now };
      }

      S.signalTraceStageById[traceId] = normStage;
      S.signalTraceLastEventById[traceId] = { sig: signature, at: now };
      const msg = `🧭 СЛЕДА | ${tf} | #${shortId} | ${normStage}${normReason ? ` | ${normReason}` : ''}`;
      logConsoleLine(msg);
    }

    function trackDeterministicDecision(tf, candleStart, decision) {
      ensureObsStructures();
      const tfKey = String(tf || '1m').toLowerCase();
      const candle = Number(candleStart || 0) || 0;
      if (!tfKey || !candle || !decision) return;
      const key = `${tfKey}|${candle}`;
      const fingerprint = JSON.stringify({
        dir: String(decision?.direction || ''),
        strategy: String(decision?.strategyKey || ''),
        conf: Number.isFinite(Number(decision?.confidence)) ? Number(decision.confidence).toFixed(4) : 'na',
        regime: String(decision?.regime?.state || ''),
        bias: Number.isFinite(Number(decision?.biasDir)) ? Number(decision.biasDir).toFixed(3) : 'na'
      });
      const prev = S.deterministicDecisionByTfCandle[key];
      const summary = S.deterministicSummaryState[key] || { count: 0, lastLogAt: 0, lastLogCount: 0 };
      if (prev && prev.fingerprint !== fingerprint) {
        incrementObsMetric('deterministicFlip', 1);
        summary.count += 1;
        const now = Date.now();
        const shouldLog = summary.count === 1
          || (summary.count - Number(summary.lastLogCount || 0) >= 3 && (now - Number(summary.lastLogAt || 0)) >= 8000);
        if (shouldLog) {
          logConsoleLine(`🟣 СТАБИЛНОСТ | ${tfKey} | ${summary.count} промени в свещта`);
          summary.lastLogAt = now;
          summary.lastLogCount = summary.count;
        }
      }
      S.deterministicDecisionByTfCandle[key] = { fingerprint, at: Date.now() };
      S.deterministicSummaryState[key] = summary;
    }

    function maybeLogBaselineSnapshot() {
      ensureObsStructures();
      const now = Date.now();
      const minuteKey = Math.floor(now / 60000);
      if (S.lastObsBaselineMinuteKey === minuteKey) return;
      S.lastObsBaselineMinuteKey = minuteKey;
      const m = S.obsMetrics || {};
      const signals = Number(m.detected || 0);
      const stop = Number(m.precheckStop || 0) + Number(m.commitBlock || 0) + Number(m.executeFail || 0);
      const input = Number(m.executePass || 0);
      const unstable = Number(m.deterministicFlip || 0);
      logConsoleLine(`📊 СТАТУС | сигнали=${signals} | стоп=${stop} | вход=${input} | нестабилни=${unstable}`);
    }


    // ---------------------- СЕСИОНЕН АНАЛИЗ (START→STOP) ----------------------
    function _sessionEnsure() {
      if (!S.sessionReport) {
        S.sessionReport = {
          active: false,
          startedAtMs: 0,
          stoppedAtMs: 0,
          startBalanceCents: null,
          stopBalanceCents: null,
          logs: [],
          issues: Object.create(null),
          trades: [],
          tradeIds: Object.create(null),
          lossReports: [],
          strategies: Object.create(null),
          killer: {
            enabledAtStart: false,
            pass: 0,
            wait: 0,
            reasons: Object.create(null),
            lastByTf: Object.create(null)
          },
          lateStats: { total: 0, byTf: Object.create(null), worstSec: 0, sumSec: 0, samples: [] }
        };
      }
      return S.sessionReport;
    }

    function sessionResetAndStart() {
      const sess = _sessionEnsure();
      sess.active = true;
      sess.startedAtMs = Date.now();
      sess.stoppedAtMs = 0;
      sess.logs = [];
      sess.issues = Object.create(null);
      sess.trades = [];
      sess.tradeIds = Object.create(null);
      sess.strategies = Object.create(null);
      sess.killer = { enabledAtStart: !!S.killerEnabled, pass: 0, wait: 0, reasons: Object.create(null), lastByTf: Object.create(null) };
      sess.lateStats = { total: 0, byTf: Object.create(null), worstSec: 0, sumSec: 0, samples: [] };
      sess.startBalanceCents = readBalanceCents();
      sess.stopBalanceCents = null;
    }

    function sessionStop() {
      const sess = _sessionEnsure();
      sess.active = false;
      sess.stoppedAtMs = Date.now();
      sess.stopBalanceCents = readBalanceCents();
    }

    function _stripHtml(s) {
      return String(s || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    }

    function sessionRecordLog(htmlMessage, stampedLine) {
      const sess = _sessionEnsure();
      if (!sess.active) return;
      // Cap to avoid runaway memory if you leave it overnight
      if (sess.logs.length > 20000) sess.logs.shift();
      sess.logs.push({
        t: Date.now(),
        line: stampedLine || '',
        text: _stripHtml(htmlMessage),
        html: String(htmlMessage || '')
      });

      // Issue counters (best-effort; doesn't touch the live console)
      const txt = _stripHtml(htmlMessage);
      const bump = (k) => { sess.issues[k] = (sess.issues[k] || 0) + 1; };

      if (/\bBias\b|Биас/i.test(txt)) bump('Bias');
      if (/Потвърждение/i.test(txt)) bump('Потвърждение');
      if (/Късен вход/i.test(txt)) {
        const lateDetail = txt.match(/Късен вход:\s*[^|]+\|[^)]*\)/i);
        if (lateDetail && lateDetail[0]) bump(lateDetail[0].trim());
        else bump('Късен вход');
      }
      if (/Накъсан пазар|лош пазар/i.test(txt)) bump('Накъсан пазар');
      if (/ПРОПУСК/i.test(txt)) bump('Пропуск');
      if (/💥 СДЕЛКА/i.test(txt)) bump('Вход');
    }

    function sessionRecordTrade(trade, outcome, profitCents) {
      const sess = _sessionEnsure();
      const now = Date.now();
      if (!sess.active) {
        sess.active = true;
        if (!sess.startedAt) sess.startedAt = now;
        if (!Number.isFinite(sess.startBalanceCents)) sess.startBalanceCents = readBalanceCents();
      }

      const tradeId = trade?.id || trade?.tradeId || null;
      if (tradeId && sess.tradeIds?.[tradeId]) return;
      const rawConfidence = Number.isFinite(trade?.confidence)
        ? trade.confidence
        : (Number.isFinite(trade?.expectedConfidence)
          ? trade.expectedConfidence
          : (Number.isFinite(trade?.entryContext?.confidencePct) ? (trade.entryContext.confidencePct / 100) : null));
      const normalizedConfidence = Number.isFinite(rawConfidence)
        ? (rawConfidence > 1 ? (rawConfidence <= 100 ? (rawConfidence / 100) : 1) : Math.max(0, Math.min(1, rawConfidence)))
        : null;

      const entry = {
        tradeId,
        t: now,
        time: new Date(now).toLocaleTimeString(),
        asset: trade?.asset || trade?.assetLabel || S.lastAssetLabel || '',
        tf: trade?.tf || trade?.timeframe || trade?.expiryTf || trade?.expiry || '',
        direction: trade?.direction || trade?.execDirection || trade?.side || '',
        confidence: normalizedConfidence,
        mode: trade?.mode || (S.autoTrade ? 'AUTO' : 'MANUAL'),
        expiry: trade?.expiry || trade?.resolvedExpiry || '',
        strategyKey: trade?.strategyKey || trade?.strategy || S.lastStrategyKey || null,
        regime: (trade?.entryContext?.regime?.state || trade?.entryContext?.regime || trade?.entryContext?.entryMeta?.regime?.state || null),
        points: Number.isFinite(trade?.entryContext?.scoreCard?.points) ? trade.entryContext.scoreCard.points : null,
        maxPoints: Number.isFinite(trade?.entryContext?.scoreCard?.maxPoints) ? trade.entryContext.scoreCard.maxPoints : null,
        threshold: Number.isFinite(trade?.entryContext?.scoreCard?.threshold) ? trade.entryContext.scoreCard.threshold : null,
        breakdown: Array.isArray(trade?.entryContext?.scoreCard?.breakdown) ? trade.entryContext.scoreCard.breakdown.slice(0, 10) : [],
        payoutPercent: Number.isFinite(trade?.payoutPercent) ? trade.payoutPercent : null,
        expirySeconds: Number.isFinite(trade?.expiryMs) ? Math.round(trade.expiryMs / 1000) : null,
        dynamicMode: trade?.dynamicMode || null,
        dynamicSimWinrate: Number.isFinite(trade?.dynamicSimWinrate) ? trade.dynamicSimWinrate : null,
        dynamicSimSamples: Number.isFinite(trade?.dynamicSimSamples) ? trade.dynamicSimSamples : null,
        stakeCents: Number.isFinite(trade?.stakeCents) ? trade.stakeCents : null,
        stakeMultiplier: Number.isFinite(trade?.stakeMultiplier) ? trade.stakeMultiplier : null,
        scoreBreakdown: Array.isArray(trade?.entryContext?.scoreCard?.breakdown) ? trade.entryContext.scoreCard.breakdown.slice(0, 10) : [],
        hardStopsHit: Array.isArray(trade?.hardStopsHit) ? trade.hardStopsHit.slice(0, 10) : [],
        outcome,
        outcomeMethod: trade?.outcomeMethod || null,
        profitCents: Number.isFinite(profitCents) ? profitCents : null
      };

      sess.trades.push(entry);
      if (tradeId) sess.tradeIds[tradeId] = true;

      const key = entry.strategyKey || '—';
      if (!sess.strategies[key]) {
        sess.strategies[key] = { trades: 0, wins: 0, losses: 0, neutral: 0, pnlCents: 0, confSum: 0, confN: 0 };
      }
      const st = sess.strategies[key];
      st.trades += 1;
      if (outcome === 'ПЕЧАЛБИ') st.wins += 1;
      else if (outcome === 'ЗАГУБИ') st.losses += 1;
      else st.neutral += 1;
      if (Number.isFinite(entry.profitCents)) st.pnlCents += entry.profitCents;
      if (Number.isFinite(entry.confidence)) { st.confSum += entry.confidence; st.confN += 1; }
    }

    function sessionRecordKiller(tf, snapshot, verdict, reason) {
      const sess = _sessionEnsure();
      const t = Date.now();
      const dir = snapshot?.direction || '';
      const conf = snapshot?.confluence;
      const min = snapshot?.minConfluence;
      const dom = snapshot?.dominance;
      const thr = snapshot?.dominanceThreshold;
      const adx = snapshot?.adx;

      const compact = {
        t, tf, dir,
        conf, min,
        dom, thr,
        adx,
        verdict,
        reason: reason || ''
      };

      // Dedup per TF: keep KILLER console readable (avoid noisy rapid fluctuations).
      const prev = sess.killer.lastByTf[tf];
      const confPass = Number.isFinite(conf) && Number.isFinite(min) ? conf >= min : null;
      const domPass = Number.isFinite(dom) && Number.isFinite(thr) ? dom >= thr : null;
      const key = JSON.stringify([verdict, reason || '', dir || '', confPass, domPass]);
      const dedupeMs = verdict === 'PASS' ? 15000 : 30000;
      if (prev && prev.key === key && (t - prev.t) < dedupeMs) return;
      sess.killer.lastByTf[tf] = { t, key };

      if (sess.active) {
        if (verdict === 'PASS') sess.killer.pass += 1;
        else if (verdict === 'WAIT') sess.killer.wait += 1;
        if (reason) sess.killer.reasons[reason] = (sess.killer.reasons[reason] || 0) + 1;
      }
      incrementKillerSkipStat(reason, verdict);

      // Console line (new compact model)
      if (!shouldLogKillerConsole()) return;
      const maxPts = Number.isFinite(snapshot?.maxPoints) ? snapshot.maxPoints : 11;
      const basePts = Number.isFinite(snapshot?.confluence) ? Number(snapshot.confluence) : 0;
      const bonusPts = Number.isFinite(snapshot?.supportingBonus) ? Number(snapshot.supportingBonus) : 0;
      const effPts = Number.isFinite(snapshot?.effectivePoints) ? Number(snapshot.effectivePoints) : Math.max(0, Math.min(11, basePts + bonusPts));
      const tfLabel = String(tf || '1m').toLowerCase();
      const dirLabel = String(dir || '').toUpperCase() || '-';
      const normReason = String(reason || '').toLowerCase();
      const waitReason = normReason.includes('domin') ? 'DOM'
        : normReason.includes('conflu') || normReason.includes('conf') ? 'CONF'
        : normReason.includes('perfect') || normReason.includes('pt') ? 'PT'
        : normReason.includes('entry') || normReason.includes('late') ? 'LATE'
        : normReason.includes('chop') ? 'ЧОП'
        : (reason || 'условия');
      const hasChop = normReason.includes('chop') || (Array.isArray(snapshot?.checks) && snapshot.checks.some((c) => String(c?.key || '').toUpperCase() === 'CHOP' && Number(c?.points || 0) < 0));
      const stateValue = `${verdict}|${dirLabel}|${waitReason}`;
      if (!logSpamControlled(`killer:${tfLabel}`, stateValue, verdict === 'PASS' ? 3000 : 10000)) return;
      if (verdict === 'PASS') {
        logConsoleLine(`🔫🎯 ГОТОВ | ${tfLabel} | ${dirLabel} | ${effPts.toFixed(1)}/${maxPts}`);
      } else {
        logConsoleLine(`🔫 ⏳ | ${tfLabel} | ${effPts.toFixed(1)}/${maxPts} | чака: ${waitReason}${hasChop ? ' | ЧОП' : ''}`);
      }
    }

    function exportSessionHtml() {
      const sess = _sessionEnsure();
      
      // Fallback: if session trade list is empty but legacy list exists, copy it.
      try { if ((!sess.trades || !sess.trades.length) && Array.isArray(S.trades) && S.trades.length) sess.trades = S.trades.slice(); } catch(e){}
const nowBal = readBalanceCents();
      const startBal = Number.isFinite(sess.startBalanceCents) ? sess.startBalanceCents : null;
      const stopBal = Number.isFinite(sess.stopBalanceCents) ? sess.stopBalanceCents : nowBal;
      const net = (Number.isFinite(startBal) && Number.isFinite(stopBal)) ? (stopBal - startBal) : null;

      const reportHtml = buildSessionHtmlReport(sess, { nowBalanceCents: nowBal, startBalanceCents: startBal, stopBalanceCents: stopBal, netCents: net });

      const ts = new Date();
      const pad = (n) => String(n).padStart(2,'0');
      const fname = `TRADE_REPORT_${ts.getFullYear()}${pad(ts.getMonth()+1)}${pad(ts.getDate())}_${pad(ts.getHours())}${pad(ts.getMinutes())}${pad(ts.getSeconds())}.html`;

      // Open in new tab; allow manual save via button inside the tab (download to /Downloads).
      const wrapped = `<!doctype html><html lang="bg"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  body{margin:0;background:#0b0f14;color:#e5e7eb;font-family:system-ui,Segoe UI,Arial}
  .mz-topbar{position:sticky;top:0;z-index:999;display:flex;gap:10px;align-items:center;justify-content:space-between;
    padding:10px 12px;background:rgba(10,14,20,.92);backdrop-filter:blur(8px);border-bottom:1px solid rgba(255,255,255,.08)}
  .mz-topbar .left{display:flex;gap:10px;align-items:center}
  .mz-pill{font-size:12px;padding:4px 10px;border:1px solid rgba(255,255,255,.12);border-radius:999px;color:#d1d5db}
  .mz-btn{cursor:pointer;font-size:12px;font-weight:700;letter-spacing:.06em;padding:8px 10px;border-radius:10px;border:1px solid rgba(255,255,255,.12);
    background:#111827;color:#fff}
  .mz-btn:hover{filter:brightness(1.1)}
  .mz-wrap{padding:0}
</style></head><body>
  <div class="mz-topbar">
    <div class="left">
      <span class="mz-pill">SESSION</span>
      <span class="mz-pill">${fname.replace('.html','')}</span>
    </div>
    <div class="right">
      <button class="mz-btn" id="mz-save-html">ЗАПИШИ HTML</button>
    </div>
  </div>
  <div class="mz-wrap">${reportHtml}</div>

<script>
window.__REPORT_FNAME__ = "${fname}";
(function(){
  const btn = document.getElementById('mz-save-html');
  if(!btn) return;
  btn.addEventListener('click', () => {
    try{
      const html = '<!doctype html>' + document.documentElement.outerHTML;
      const blob = new Blob([html], {type:'text/html;charset=utf-8'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = (window.__REPORT_FNAME__ || "TRADE_REPORT.html");
      document.body.appendChild(a);
      a.click();
      setTimeout(()=>{ try{ URL.revokeObjectURL(url);}catch(e){} try{a.remove();}catch(e){} }, 250);
    }catch(e){
      alert('Грешка при запис: ' + (e && e.message ? e.message : e));
    }
  });
})();
</script>
</body></html>`;

      const blob = new Blob([wrapped], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const w = window.open(url, '_blank', 'noopener');
      if (!w) {
        // Fallback: direct download if popup blocked
        const a = document.createElement('a');
        a.href = url;
        a.download = (window.__REPORT_FNAME__ || "TRADE_REPORT.html");
        document.body.appendChild(a);
        a.click();
        setTimeout(() => { try { URL.revokeObjectURL(url); } catch {} try { a.remove(); } catch {} }, 350);
      }
    }

    function _fmtMoney(cents) {
      if (!Number.isFinite(cents)) return '—';
      const v = (cents / 100);
      const sign = v < 0 ? '-' : '';
      const abs = Math.abs(v);
      return `${sign}$${abs.toFixed(2)}`;
    }
    function _pct(a,b) {
      if (!b) return '0.0%';
      return `${((a/b)*100).toFixed(1)}%`;
    }
    function _spark(values, w=210, h=46) {
      const nums = (values||[]).filter((x)=>Number.isFinite(x));
      if (nums.length < 2) return `<svg width="${w}" height="${h}"></svg>`;
      const min = Math.min(...nums), max = Math.max(...nums);
      const span = (max - min) || 1;
      const step = w / (nums.length - 1);
      const pts = nums.map((v,i)=>{
        const x = i*step;
        const y = h - ((v - min)/span)*h;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      }).join(' ');
      return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
        <polyline points="${pts}" fill="none" stroke="currentColor" stroke-width="2" />
      </svg>`;
    }

    function buildSessionHtmlReport(sess, ctx) {
      const started = sess.startedAtMs ? new Date(sess.startedAtMs) : null;
      const stopped = sess.stoppedAtMs ? new Date(sess.stoppedAtMs) : null;
      const now = new Date();
      const asset = S.lastAssetLabel || '';
      const tf = (S.activeTimeframe || '').toString().toUpperCase();

      const trades = sess.trades || [];
      const wins = trades.filter(t=>t.outcome==='ПЕЧАЛБИ').length;
      const losses = trades.filter(t=>t.outcome==='ЗАГУБИ').length;
      const neu = trades.length - wins - losses;
      const winrate = trades.length ? (wins/trades.length*100) : 0;

      const avgConf = (() => {
        const xs = trades.map(t=>t.confidence).filter(x=>Number.isFinite(x));
        if (!xs.length) return null;
        return xs.reduce((a,b)=>a+b,0)/xs.length;
      })();

      // Issues: top 6
      const issuesRaw = Object.entries(sess.issues || {}).sort((a,b)=>b[1]-a[1]);
      const issuesArr = issuesRaw.slice(0,6);

      // Strategy breakdown rows
      const stratRows = Object.entries(sess.strategies || {}).map(([k,v])=>{
        const wr = v.trades ? (v.wins/v.trades*100) : 0;
        const avg = v.confN ? (v.confSum/v.confN) : null;
        return { k, ...v, wr, avg };
      }).sort((a,b)=> (b.pnlCents||0)-(a.pnlCents||0));

      // timelines (lightweight)
      const confSeries = trades.map(t=>Number.isFinite(t.confidence)?t.confidence:null).filter(x=>x!=null);

      const isWinOutcome = (o) => o === 'ПЕЧАЛБИ';
      const byScore = (thr) => {
        const subset = trades.filter(t => Number.isFinite(t.points) && Number.isFinite(t.maxPoints) && Number.isFinite(t.threshold)
          && Number(t.maxPoints) === 9 && Number(t.threshold) === thr && (t.outcome === 'ПЕЧАЛБИ' || t.outcome === 'ЗАГУБИ'));
        const winsN = subset.filter(t => isWinOutcome(t.outcome)).length;
        const totalN = subset.length;
        const wr = totalN ? (winsN / totalN * 100) : null;
        return { totalN, winsN, wr };
      };
      const wr7 = byScore(7);
      const wr8 = byScore(8);

      const regimeStrategyRows = Object.values(trades.reduce((acc, t) => {
        const reg = String(t.regime || '—').toUpperCase();
        if (!['TREND', 'RANGE'].includes(reg)) return acc;
        const key = `${t.strategyKey || '—'}|${reg}`;
        if (!acc[key]) acc[key] = { strategy: t.strategyKey || '—', regime: reg, total: 0, wins: 0, losses: 0 };
        acc[key].total += 1;
        if (t.outcome === 'ПЕЧАЛБИ') acc[key].wins += 1;
        if (t.outcome === 'ЗАГУБИ') acc[key].losses += 1;
        return acc;
      }, {})).map((r) => ({ ...r, wr: r.total ? (r.wins / r.total * 100) : 0 }))
        .sort((a, b) => b.wr - a.wr);
      const thresholdRows = [7, 8].map((thr) => {
        const arr = trades.filter(t => Number(t.threshold) === thr);
        const w = arr.filter(t => t.outcome === 'ПЕЧАЛБИ').length;
        const wr = arr.length ? (w / arr.length * 100) : 0;
        const pnl = arr.reduce((s, t) => s + (Number.isFinite(t.profitCents) ? t.profitCents : 0), 0);
        const avgPts = arr.length ? (arr.reduce((s, t) => s + (Number(t.points) || 0), 0) / arr.length) : 0;
        const avgExp = arr.length ? (arr.reduce((s, t) => s + (Number(t.expirySeconds) || 0), 0) / arr.length) : 0;
        return { thr, trades: arr.length, wr, pnl, avgPts, avgExp };
      });

      const regimeRows = ['TREND', 'RANGE', 'CHOP'].map((regimeName) => {
        const arr = trades.filter(t => String(t.regime || '').toUpperCase() === regimeName);
        const winsN = arr.filter(t => t.outcome === 'ПЕЧАЛБИ').length;
        const wr = arr.length ? (winsN / arr.length * 100) : 0;
        const pnl = arr.reduce((s, t) => s + (Number.isFinite(t.profitCents) ? t.profitCents : 0), 0);
        const avgExp = arr.length ? (arr.reduce((s, t) => s + (Number(t.expirySeconds) || 0), 0) / arr.length) : 0;
        const topStrategy = Object.entries(arr.reduce((acc, t) => {
          const k = t.strategyKey || '—';
          acc[k] = (acc[k] || 0) + 1;
          return acc;
        }, {})).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
        return { regime: regimeName, trades: arr.length, wr, pnl, avgExp, topStrategy };
      });
      const dynamicVsFixed = Object.values(trades.reduce((acc, t) => {
        const mode = (t.dynamicMode || 'fixed').toLowerCase();
        if (!acc[mode]) acc[mode] = { mode, trades: 0, wins: 0, pnl: 0, expSum: 0 };
        acc[mode].trades += 1;
        if (t.outcome === 'ПЕЧАЛБИ') acc[mode].wins += 1;
        acc[mode].pnl += Number.isFinite(t.profitCents) ? t.profitCents : 0;
        acc[mode].expSum += Number(t.expirySeconds || 0);
        return acc;
      }, {})).map(x => ({ ...x, wr: x.trades ? (x.wins / x.trades * 100) : 0, avgExp: x.trades ? (x.expSum / x.trades) : 0 }));
      const expiryRows = Object.values(trades.reduce((acc, t) => {
        const s = Number(t.expirySeconds || 0); if (!s) return acc;
        if (!acc[s]) acc[s] = { sec: s, trades: 0, wins: 0, pnl: 0 };
        acc[s].trades += 1;
        if (t.outcome === 'ПЕЧАЛБИ') acc[s].wins += 1;
        acc[s].pnl += Number.isFinite(t.profitCents) ? t.profitCents : 0;
        return acc;
      }, {})).map(x => ({ ...x, wr: x.trades ? (x.wins / x.trades * 100) : 0 })).sort((a,b)=>a.sec-b.sec);
      const simTrades = trades.filter(t => Number.isFinite(t.dynamicSimWinrate) && Number.isFinite(t.dynamicSimSamples));
      const avgChosenSec = simTrades.length ? (simTrades.reduce((s,t)=>s+(Number(t.expirySeconds)||0),0)/simTrades.length) : 0;
      const avgSimWr = simTrades.length ? (simTrades.reduce((s,t)=>s+(Number(t.dynamicSimWinrate)||0),0)/simTrades.length*100) : 0;
      const avgSimSamples = simTrades.length ? (simTrades.reduce((s,t)=>s+(Number(t.dynamicSimSamples)||0),0)/simTrades.length) : 0;
      const hardStopRows = Object.entries((sess.skipReasons || {})).sort((a,b)=>b[1]-a[1]);
      const pointKeys = ['Стратегия','Режим','Killer','Структура','Волатилност','Тайминг','Spread/Liquidity','Pattern'];
      const missingPointRows = pointKeys.map((k)=>{
        const missing = trades.filter(t => Array.isArray(t.breakdown) && t.breakdown.some(b => String(b).includes(k) && String(b).includes(': 0'))).length;
        return { k, missing, pct: trades.length ? (missing/trades.length*100) : 0 };
      });
      const domSeries = []; // optional (we don't have per-trade dom reliably yet)
      const pnlSeries = trades.reduce((acc,t)=>{
        const last = acc.length ? acc[acc.length-1] : 0;
        const add = Number.isFinite(t.profitCents) ? t.profitCents/100 : 0;
        acc.push(last + add);
        return acc;
      }, []);

      const fullLog = (sess.logs || []).map(x => stripConsoleMarkup(x.line || `[${new Date(x.t).toLocaleTimeString()}] ${x.text}`)).join('\n');
      const shortLog = (sess.logs || []).slice(-300).map(x => stripConsoleMarkup(x.line || `[${new Date(x.t).toLocaleTimeString()}] ${x.text}`)).join('\n');

      const startMoney = _fmtMoney(ctx.startBalanceCents);
      const stopMoney = _fmtMoney(ctx.stopBalanceCents);
      const netMoney = _fmtMoney(ctx.netCents);

      return `<!doctype html>
<html lang="bg">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>СЕСИОНЕН АНАЛИЗ</title>
<style>
  :root{
    --bg:#070a10; --panel:#0b0f1a; --panel2:#0f1526;
    --txt:#e5e7eb; --muted:#94a3b8; --line:rgba(148,163,184,.18);
    --green:#22c55e; --red:#ef4444; --cyan:#22d3ee; --amber:#f59e0b;
  }
  *{ box-sizing:border-box; }
  body{ margin:0; background:radial-gradient(1200px 600px at 55% 0%, rgba(34,211,238,.10), transparent 60%), var(--bg); color:var(--txt); font:14px/1.4 system-ui,Segoe UI,Arial; }
  .wrap{ max-width:980px; margin:22px auto; padding:0 14px 36px; }
  .top{ display:flex; align-items:flex-start; justify-content:space-between; gap:14px; }
  .h1{ font-size:22px; letter-spacing:.08em; }
  .date{ color:var(--muted); }
  .card{ background:linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.02)); border:1px solid var(--line); border-radius:14px; padding:14px; box-shadow:0 18px 50px rgba(0,0,0,.55); }
  .summary{ display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:12px; }
  .pill{ display:inline-flex; align-items:center; gap:8px; padding:6px 10px; border-radius:999px; border:1px solid var(--line); background:rgba(15,21,38,.6); }
  .pill b{ letter-spacing:.02em; }
  .kpi{ display:flex; flex-wrap:wrap; gap:10px; }
  .kpi .pill{ min-width:140px; justify-content:space-between; }
  .win{ color:var(--green); }
  .loss{ color:var(--red); }
  .neu{ color:#9ca3af; }
  h2{ margin:18px 0 10px; font-size:14px; letter-spacing:.1em; color:var(--cyan); }
  .grid2{ display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .issues li{ display:flex; justify-content:space-between; padding:8px 10px; border-top:1px solid var(--line); }
  .issues li:first-child{ border-top:0; }
  table{ width:100%; border-collapse:collapse; }
  th,td{ padding:9px 10px; border-bottom:1px solid var(--line); text-align:left; }
  th{ color:var(--muted); font-size:12px; letter-spacing:.08em; }
  .tag{ padding:2px 8px; border-radius:999px; border:1px solid var(--line); }
  .tag.buy{ color:var(--green); }
  .tag.sell{ color:var(--red); }
  .charts{ display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; }
  .chart{ color:var(--green); }
  .chart.dom{ color:var(--red); }
  .chart.pnl{ color:var(--amber); }
  pre{ background:rgba(0,0,0,.35); border:1px solid var(--line); border-radius:12px; padding:12px; overflow:auto; max-height:320px; white-space:pre-wrap; }
  details{ border:1px solid var(--line); border-radius:12px; padding:10px 12px; background:rgba(0,0,0,.22); }
  details summary{ cursor:pointer; color:var(--cyan); letter-spacing:.08em; }
  .muted{ color:var(--muted); }
</style>
</head>
<body>
<div class="wrap">
  <div class="top">
    <div>
      <div class="h1">СЕСИОНЕН АНАЛИЗ</div>
      <div class="date">${now.toLocaleDateString()} ${now.toLocaleTimeString()}</div>
    </div>
    <div class="date">${asset ? `Asset: <b>${asset}</b>` : ''} ${tf ? `| TF: <b>${tf}</b>` : ''}</div>
  </div>

  <div class="card summary">
    <div>
      <div class="muted">ОБЩО</div>
      <div class="kpi" style="margin-top:10px;">
        <div class="pill"><span>START</span><b>${startMoney}</b></div>
        <div class="pill"><span>STOP/NOW</span><b>${stopMoney}</b></div>
        <div class="pill"><span>RESULT</span><b>${netMoney}</b></div>
        <div class="pill"><span>СДЕЛКИ</span><b>${trades.length}</b></div>
        <div class="pill"><span class="win">ПЕЧАЛБИ</span><b class="win">${wins}</b></div>
        <div class="pill"><span class="loss">ЗАГУБИ</span><b class="loss">${losses}</b></div>
        <div class="pill"><span class="neu">НЕУТРАЛНИ</span><b class="neu">${neu}</b></div>
        <div class="pill"><span>WR</span><b>${winrate.toFixed(1)}%</b></div>
        <div class="pill"><span>AVG CONF</span><b>${Number.isFinite(avgConf)?avgConf.toFixed(0)+'%':'—'}</b></div>
        <div class="pill"><span>WR 7/11</span><b>${wr7.wr!=null?wr7.wr.toFixed(1)+'%':'—'} (${wr7.totalN})</b></div>
        <div class="pill"><span>WR 8/11</span><b>${wr8.wr!=null?wr8.wr.toFixed(1)+'%':'—'} (${wr8.totalN})</b></div>
      </div>
      <div class="muted" style="margin-top:10px;">
        Начало: ${started ? started.toLocaleTimeString() : '—'} | Край: ${stopped ? stopped.toLocaleTimeString() : '—'} | Продължителност: ${started ? Math.max(0, Math.round(((stopped||now)-started)/60000)) : 0} мин
      </div>
    </div>
    <div>
      <div class="muted">TOP ПРОБЛЕМИ</div>
      <ul class="issues" style="list-style:none; margin:10px 0 0; padding:0;">
        ${issuesArr.length ? issuesArr.map(([k,v])=>`<li><span>${k}</span><b>${v}</b></li>`).join('') : `<li><span class="muted">—</span><b class="muted">0</b></li>`}
      </ul>
    </div>
  </div>

  <h2>СДЕЛКИ</h2>
  <div class="card">
    <table>
      <thead><tr>
        <th>ВРЕМЕ</th><th>АКТИВ</th><th>TF</th><th>ПОСОКА</th><th>УВЕР.</th><th>ТОЧКИ</th><th>РЕЖИМ</th><th>PAYOUT</th><th>MODE</th><th>EXPIRY</th><th>РЕЗУЛТАТ</th><th>PNL</th><th>STRATEGY</th>
      </tr></thead>
      <tbody>
        ${trades.slice(-80).reverse().map(t=>{
          const dirTag = t.direction==='BUY' ? 'buy' : (t.direction==='SELL' ? 'sell' : '');
          const resCls = t.outcome==='ПЕЧАЛБИ' ? 'win' : (t.outcome==='ЗАГУБИ' ? 'loss' : 'neu');
          return `<tr>
            <td>${t.time}</td>
            <td>${t.asset||''}</td>
            <td>${t.tf||''}</td>
            <td><span class="tag ${dirTag}">${t.direction||'—'}</span></td>
            <td>${Number.isFinite(t.confidence)?`${Math.round(t.confidence)}%`:'—'}</td>
            <td>${Number.isFinite(t.points)&&Number.isFinite(t.maxPoints)?`${t.points}/${t.maxPoints} (праг ${Number.isFinite(t.threshold)?t.threshold:'—'})`:'—'}</td>
            <td>${t.regime||'—'}</td>
            <td>${Number.isFinite(t.payoutPercent)?`${Math.round(t.payoutPercent)}%`:'—'}</td>
            <td>${t.mode||''}</td>
            <td>${t.expiry||''}</td>
            <td class="${resCls}"><b>${t.outcome||''}</b></td>
            <td class="${resCls}">${_fmtMoney(t.profitCents)}</td>
            <td>${t.strategyKey||'—'}</td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
    <div class="muted" style="margin-top:8px;">Сделки: ${trades.length} | Winrate: ${winrate.toFixed(1)}% | Result(balance): ${netMoney}</div>
  </div>

  <h2>WR ПО СТРАТЕГИЯ И РЕЖИМ</h2>
  <div class="card">
    <table>
      <thead><tr>
        <th>STRATEGY</th><th>РЕЖИМ</th><th>СДЕЛКИ</th><th>W</th><th>L</th><th>WR</th>
      </tr></thead>
      <tbody>
        ${regimeStrategyRows.length ? regimeStrategyRows.map(r=>`<tr>
          <td>${r.strategy}</td><td>${r.regime}</td><td>${r.total}</td><td class="win">${r.wins}</td><td class="loss">${r.losses}</td><td>${r.wr.toFixed(1)}%</td>
        </tr>`).join('') : `<tr><td colspan="6" class="muted">Няма достатъчно данни (TREND/RANGE).</td></tr>`}
      </tbody>
    </table>
  </div>

  <h2>АНАЛИЗ ПО ПРАГ (7/11 vs 8/11 vs 9/11)</h2>
  <div class="card"><table><thead><tr><th>Праг</th><th>Trades</th><th>WR</th><th>PnL</th><th>AvgPoints</th><th>AvgExpirySec</th></tr></thead><tbody>
  ${thresholdRows.map(r=>`<tr><td>${r.thr}/11</td><td>${r.trades}</td><td>${r.wr.toFixed(1)}%</td><td>${_fmtMoney(r.pnl)}</td><td>${r.avgPts.toFixed(2)}</td><td>${r.avgExp.toFixed(1)}</td></tr>`).join('')}
  </tbody></table></div>


  <h2>АНАЛИЗ ПО РЕЖИМ</h2>
  <div class="card"><table><thead><tr><th>Режим</th><th>Trades</th><th>WR</th><th>PnL</th><th>AvgExpirySec</th><th>Най-честа стратегия</th></tr></thead><tbody>
  ${regimeRows.map(r=>`<tr><td>${r.regime}</td><td>${r.trades}</td><td>${r.wr.toFixed(1)}%</td><td>${_fmtMoney(r.pnl)}</td><td>${r.avgExp.toFixed(1)}</td><td>${r.topStrategy}</td></tr>`).join('')}
  </tbody></table></div>

  <h2>DYNAMIC EXPIRY АНАЛИЗ</h2>
  <div class="card"><table><thead><tr><th>Mode</th><th>Trades</th><th>WR</th><th>PnL</th><th>AvgExpirySec</th></tr></thead><tbody>
  ${dynamicVsFixed.length?dynamicVsFixed.map(r=>`<tr><td>${r.mode}</td><td>${r.trades}</td><td>${r.wr.toFixed(1)}%</td><td>${_fmtMoney(r.pnl)}</td><td>${r.avgExp.toFixed(1)}</td></tr>`).join(''):`<tr><td colspan="5" class="muted">Няма данни.</td></tr>`}
  </tbody></table>
  <div class="muted" style="margin-top:8px;">SIM: AvgChosenSec=${avgChosenSec.toFixed(1)} | AvgSimWinrate=${avgSimWr.toFixed(1)}% | AvgSimSamples=${avgSimSamples.toFixed(1)}</div>
  <table style="margin-top:10px;"><thead><tr><th>ExpirySec</th><th>Trades</th><th>WR</th><th>PnL</th></tr></thead><tbody>
  ${expiryRows.length?expiryRows.map(r=>`<tr><td>${r.sec}</td><td>${r.trades}</td><td>${r.wr.toFixed(1)}%</td><td>${_fmtMoney(r.pnl)}</td></tr>`).join(''):`<tr><td colspan="4" class="muted">Няма данни.</td></tr>`}
  </tbody></table></div>

  <h2>HARD STOPS</h2>
  <div class="card"><table><thead><tr><th>Reason</th><th>Count</th><th>%</th></tr></thead><tbody>
  ${hardStopRows.length?hardStopRows.map(([k,v])=>`<tr><td>${k}</td><td>${v}</td><td>${((v/Math.max(1,hardStopRows.reduce((s,[_k,c])=>s+c,0)))*100).toFixed(1)}%</td></tr>`).join(''):`<tr><td colspan="3" class="muted">Няма данни.</td></tr>`}
  </tbody></table></div>

  <h2>ЛИПСВАЩИ ТОЧКИ</h2>
  <div class="card"><table><thead><tr><th>PointKey</th><th>MissingCount</th><th>%</th></tr></thead><tbody>
  ${missingPointRows.map(r=>`<tr><td>${r.k}</td><td>${r.missing}</td><td>${r.pct.toFixed(1)}%</td></tr>`).join('')}
  </tbody></table></div>

  <h2>ПОСЛЕДНИ 30 СДЕЛКИ</h2>
  <div class="card"><table><thead><tr><th>Time</th><th>Strategy</th><th>Regime</th><th>Points/Thr</th><th>Dir</th><th>ExpSec</th><th>DynMode</th><th>Stake</th><th>Outcome</th><th>PnL</th></tr></thead><tbody>
  ${trades.slice(-30).reverse().map(t=>`<tr><td>${t.time||'—'}</td><td>${t.strategyKey||'—'}</td><td>${t.regime||'—'}</td><td>${t.points||'—'}/${t.threshold||'—'}${Number(t.threshold)===8?` <span style="color:#f59e0b;font-weight:700;">STRICT</span>`:''}</td><td>${t.direction||'—'}</td><td>${t.expirySeconds||'—'}</td><td>${t.dynamicMode||'fixed'}</td><td>${Number.isFinite(t.stakeCents)?_fmtMoney(t.stakeCents):'—'}</td><td>${t.outcome||'—'}</td><td>${_fmtMoney(t.profitCents)}</td></tr>`).join('')}
  </tbody></table></div>

  <h2>СТРАТЕГИИ (Partner mode)</h2>
  <div class="card">
    <table>
      <thead><tr>
        <th>STRATEGY</th><th>СДЕЛКИ</th><th>W</th><th>L</th><th>N</th><th>WR</th><th>NET</th><th>AVG CONF</th>
      </tr></thead>
      <tbody>
        ${stratRows.length ? stratRows.map(r=>`<tr>
          <td>${r.k}</td><td>${r.trades}</td><td class="win">${r.wins}</td><td class="loss">${r.losses}</td><td class="neu">${r.neutral}</td>
          <td>${r.wr.toFixed(1)}%</td><td>${_fmtMoney(r.pnlCents)}</td><td>${Number.isFinite(r.avg)?r.avg.toFixed(0)+'%':'—'}</td>
        </tr>`).join('') : `<tr><td colspan="8" class="muted">Няма сделки за стратегия breakdown.</td></tr>`}
      </tbody>
    </table>
  </div>

  <h2>🔫 АНАЛИЗ</h2>
  <div class="card">
    <div class="charts">
      <div class="card chart">
        <div class="muted">CONFIDENCE OVER TIME</div>
        ${_spark(confSeries)}
      </div>
      <div class="card chart dom">
        <div class="muted">DOMINANCE (placeholder)</div>
        ${_spark(domSeries)}
      </div>
      <div class="card chart pnl">
        <div class="muted">PNL TIMELINE</div>
        ${_spark(pnlSeries)}
      </div>
    </div>
    <div class="muted" style="margin-top:10px;">
      Killer: ${sess.killer?.enabledAtStart ? 'ON' : 'OFF'} | PASS: ${sess.killer?.pass||0} | WAIT: ${sess.killer?.wait||0}
    </div>
    <div class="muted">Reasons: ${Object.entries(sess.killer?.reasons||{}).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([k,v])=>`${k}×${v}`).join(' | ') || '—'}</div>
  </div>

  <h2>LATE ENTRY АНАЛИЗ</h2>
  <div class="card">
    ${(() => {
      const ls = sess.lateStats || {};
      const total = Number(ls.total || 0);
      if (!total) return '<div class="muted">Няма засечени късни входове.</div>';
      const byTf = Object.entries(ls.byTf || {}).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`${k.toUpperCase()}:${v}`).join(' | ') || '—';
      const avg = total > 0 ? ((Number(ls.sumSec||0))/Math.max(1,total)).toFixed(2) : '0.00';
      const worst = Number(ls.worstSec||0).toFixed(2);
      const samples = (ls.samples || []).slice(-5).map((x)=>`<div class="muted">• ${escapeHtml(String(x))}</div>`).join('');
      return `<div class="muted">Общо: ${total} | По TF: ${byTf} | Avg закъснение: +${avg}s | Max: +${worst}s</div>${samples}`;
    })()}
  </div>

  <h2>АНАЛИЗ НА ЗАГУБИ</h2>
  ${(() => {
    const arr = Array.isArray(sess.lossReports) ? sess.lossReports : [];
    const losses = arr.filter(x => x && (x.outcome || '').toUpperCase().includes('LOSS') || (x.pnlCents||0) < 0);
    if (!losses.length) return `<div class="muted">Няма записани загуби.</div>`;
    const rows = losses.slice(0, 30).map((x, i) => {
      const t = x.timeStr || x.time || '';
      const asset = x.asset || '—';
      const dir = x.direction || '—';
      const exp = x.expiry || '—';
      const conf = (x.confidencePct!=null) ? `${x.confidencePct}%` : '—';
      const reason = x.reason || '—';
      const pnl = (Number.isFinite(x.pnlCents) ? (x.pnlCents/100).toFixed(2) : '—');
      const reg = x.regime || '—';
      const confirm = x.confirm || '—';
      return `<tr>
        <td>${i+1}</td><td>${escapeHtml(t)}</td><td>${escapeHtml(asset)}</td><td>${escapeHtml(dir)}</td><td>${escapeHtml(exp)}</td>
        <td>${escapeHtml(conf)}</td><td>${escapeHtml(reason)}</td><td>${escapeHtml(confirm)}</td><td>${escapeHtml(reg)}</td>
        <td style="text-align:right;font-weight:800;color:#fb7185;">${pnl}</td>
      </tr>`;
    }).join('');
    return `<div class="card">
      <div class="sub">Топ 30 последни загуби (за бързо дебъгване)</div>
      <div style="overflow:auto;">
      <table>
        <thead><tr><th>#</th><th>Час</th><th>Актив</th><th>Посока</th><th>Expiry</th><th>Увереност</th><th>Причина</th><th>Confirm</th><th>Regime</th><th>Резултат</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      </div>
    </div>`;
  })()}

  <h2>ЛОГ (последни 300)</h2>
  <div style="display:flex;gap:8px;justify-content:flex-end;margin:-6px 0 6px;">
    <button onclick="navigator.clipboard.writeText(document.getElementById('mz-short-log').innerText)" style="cursor:pointer;font-size:12px;font-weight:700;padding:6px 10px;border-radius:10px;border:1px solid rgba(255,255,255,.12);background:#111827;color:#fff;">КОПИРАЙ</button>
  </div>
  <pre id="mz-short-log">${escapeHtml(shortLog)}</pre>

  <details style="margin-top:12px;">
    <summary style="cursor:pointer;">ПЪЛЕН ЛОГ (сесия)</summary>
    <div style="display:flex;gap:8px;justify-content:flex-end;margin:8px 0 6px;">
      <button onclick="navigator.clipboard.writeText(document.getElementById('mz-full-log').innerText)" style="cursor:pointer;font-size:12px;font-weight:700;padding:6px 10px;border-radius:10px;border:1px solid rgba(255,255,255,.12);background:#111827;color:#fff;">КОПИРАЙ</button>
    </div>
    <pre id="mz-full-log" style="max-height:520px;">${escapeHtml(fullLog)}</pre>
  </details>

</div>
</body>
</html>`;
    }
    function shouldLogScoreEvent(tf, kind, reason) {
      if (S.killerEnabled) return false;
      return true;
    }

    function shouldLogKillerConsole() {
      return true;
    }

    function logSpamControlled(key, stateValue, cooldownMs = 2000) {
      const cache = S.logSpamCache || (S.logSpamCache = Object.create(null));
      const now = Date.now();
      const prev = cache[key] || { stateValue: null, at: 0 };
      const changed = prev.stateValue !== stateValue;
      const allow = changed || (now - Number(prev.at || 0) >= Math.max(500, Number(cooldownMs) || 2000));
      if (allow) cache[key] = { stateValue, at: now };
      return allow;
    }

    function bindOnce(el, eventName, handler, options) {
      if (!el || !eventName || typeof handler !== 'function') return false;
      const k = `__iaaBound_${eventName}`;
      if (el[k]) return false;
      el[k] = true;
      el.addEventListener(eventName, handler, options);
      return true;
    }

    function safeBindOnce(el, eventName, handler, options) {
      try { return bindOnce(el, eventName, handler, options); }
      catch (err) {
        console.warn('[IAA] bind failed:', eventName, err);
        return false;
      }
    }

    function bindSettingsListenersOnce() {
      if (S.__settingsListenersBound) return;
      S.__settingsListenersBound = true;
    }

    function logDiagnostics() {
      const now = Date.now();
      // Диагностиката да е синхронизирана с минутната свещ (а не 60s от старта), за да не дава фалшиви "късен вход" по средата на свещта.
      const minuteKey = Math.floor(now / 60000);
      if (S.lastDiagnosticsMinuteKey === minuteKey) return;
      const msIntoMinute = now - minuteKey * 60000;
      // Печатаме ~1-3.5s след началото на минутата (след като платформата/DOM обнови стойностите)
      if (msIntoMinute < 900 || msIntoMinute > 3500) return;
      if (!isKillerMode() && !S.analysisEnabled) return;
      S.lastDiagnosticsMinuteKey = minuteKey;
      S.lastDiagnosticsAt = now;
      const auto = S.autoTrade ? 'on' : 'off';
      const analysis = 'killer';
      const dir = S.analysisDirection || '-';
      const conf = typeof S.analysisConfidence === 'number' ? Math.round(S.analysisConfidence * 100) : '-';
      const thr = isKillerMode()
        ? (typeof S.killerThreshold === 'number' ? Math.round(S.killerThreshold * 100) : '-')
        : (typeof S.analysisConfidenceThreshold === 'number' ? Math.round(S.analysisConfidenceThreshold * 100) : '-');
      if (isKillerMode() && S.killerEnabled) {
        // killer-only runtime: suppress score diagnostics lines
        return;
      }
      if (isKillerMode() && S.lastScoreSnapshot) {
        const snap = S.lastScoreSnapshot;
        const strategyLabel = snap.strategyKey ? getStrategyDisplayLabel(snap.strategyKey) : '—';
        const pointsLabel = Number.isFinite(snap.points) && Number.isFinite(snap.maxPoints)
          ? `${snap.points}/${snap.maxPoints} (праг ${snap.threshold}/${snap.maxPoints})`
          : '—';
        const reason = snap.reason || (S.lastSkipReason ? translateSkipReason(S.lastSkipReason) : '-');
        logConsoleLine(formatStatus('diagnostics_score', {
          result: snap.result || 'ANALYZE',
          points: pointsLabel,
          strategy: strategyLabel,
          reason
        }));
        return;
      }
      if (isKillerMode()) {
        // killer-only/no-score-runtime: no periodic score diagnostics
        return;
      }
      const strategyKey = S.lastStrategyKey;
      const strategyLabelRaw = strategyKey ? getStrategyDisplayLabel(strategyKey) : '—';
      const strategyLabel = strategyLabelRaw;
      const skipReason = S.lastSkipReason ? translateSkipReason(S.lastSkipReason) : '-';
      logConsoleLine(formatStatus('diagnostics', { auto, analysis, dir, conf, thr, strategy: strategyLabel, skip: skipReason }));
    }


    function recordTradeStats(outcome) {
      S.tradeStats.total += 1;
      if (outcome === 'ПЕЧАЛБИ') {
        S.tradeStats.wins += 1;
      } else if (outcome === 'ЗАГУБИ') {
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
      if (outcome === 'ПЕЧАЛБИ') {
        bucket.wins += 1;
      } else if (outcome === 'ЗАГУБИ') {
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
      if (outcome === 'ЗАГУБИ') {
        bucket.lossStreak = (bucket.lossStreak || 0) + 1;
      } else if (outcome === 'ПЕЧАЛБИ' || outcome === 'EVEN') {
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
      const lower = String(text || '').toLowerCase();
      if (/\b3s\b/.test(lower) || /\b0:03\b/.test(lower) || /\b00:03\b/.test(lower)) return '3S';
      if (/\b15s\b/.test(lower) || /\b0:15\b/.test(lower) || /\b00:15\b/.test(lower)) return '15S';
      if (/\b30s\b/.test(lower) || /\b0:30\b/.test(lower) || /\b00:30\b/.test(lower)) return '30S';
      if (/\b1m\b/.test(lower) || /\b1:00\b/.test(lower) || /\b01:00\b/.test(lower)) return '1m';
      if (/\b3m\b/.test(lower) || /\b3:00\b/.test(lower) || /\b03:00\b/.test(lower)) return '3m';
      if (/\b5m\b/.test(lower) || /\b5:00\b/.test(lower) || /\b05:00\b/.test(lower)) return '5m';
      return null;
    }

    function normalizeOutcomeFromText(text) {
      const upper = String(text || '').toUpperCase();
      if (upper.includes('ПЕЧАЛБИ') || upper.includes('PROFIT') || upper.includes('ПЕЧАЛ')) return 'ПЕЧАЛБИ';
      if (upper.includes('ЗАГУБИ') || upper.includes('LOSE') || upper.includes('ЗАГУБ')) return 'ЗАГУБИ';
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
      if (/(loss|lose|negative|down|red)/.test(classText)) return 'ЗАГУБИ';
      if (/(win|profit|positive|up|green)/.test(classText)) return 'ПЕЧАЛБИ';
      const children = el.querySelectorAll('[class]');
      for (const child of children) {
        const childClass = String(child.className || '').toLowerCase();
        if (/(loss|lose|negative|down|red)/.test(childClass)) return 'ЗАГУБИ';
        if (/(win|profit|positive|up|green)/.test(childClass)) return 'ПЕЧАЛБИ';
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
          if (signedMoney.cents > 0) outcome = 'ПЕЧАЛБИ';
          if (signedMoney.cents < 0) outcome = 'ЗАГУБИ';
          if (signedMoney.cents === 0) outcome = 'EVEN';
        }
        if (!outcome && Number.isFinite(profitCents)) {
          if (profitCents > 0) outcome = 'ПЕЧАЛБИ';
          else if (profitCents < 0) outcome = 'ЗАГУБИ';
          else outcome = 'EVEN';
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
        scoreCard: meta.scoreCard || null,
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
      if (!trade || outcome !== 'ЗАГУБИ') return;
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

    
async function logTradeOutcome(trade, outcome, profitCents = null) {
  if (!trade) return;

  // Normalize outcome language: we use BG tags everywhere for consistency.
  const norm = (o) => {
    if (!o) return null;
    const x = String(o).toUpperCase();
    if (x === 'WIN' || x === 'ПЕЧАЛБИ' || x === 'PECHALBI') return 'ПЕЧАЛБИ';
    if (x === 'LOSS' || x === 'ЗАГУБИ' || x === 'ZAGUBI') return 'ЗАГУБИ';
    if (x === 'EVEN' || x === 'NEU' || x === 'NEUTRAL') return 'EVEN';
    return o;
  };

  const out = norm(outcome);

  // profitCents is always cents here. If missing, derive from trade.profitCents if present.
  const pc = Number.isFinite(profitCents) ? profitCents : (Number.isFinite(trade.profitCents) ? trade.profitCents : null);

  const money = (cents) => {
    if (!Number.isFinite(cents)) return '$0.00';
    const sign = cents < 0 ? '-' : '+';
    return sign + '$' + (Math.abs(cents) / 100).toFixed(2);
  };

  const tfLabel = (trade.tfLabel || trade.tf || trade.expiryLabel || trade.expiry || '1m').toString().toLowerCase();
  const dedupeKey = (() => {
    const wsId = String(trade.wsDealId || trade.dealId || trade.id || '').trim();
    if (wsId) return `ws:${wsId}`;
    const started = Number(trade.startTime || 0);
    const direction = String(trade.direction || '').toUpperCase();
    const asset = String(trade.asset || '').toUpperCase();
    const expiry = String(trade.expiry || trade.tf || trade.tfLabel || '').toLowerCase();
    return `fallback:${asset}|${direction}|${expiry}|${started}`;
  })();
  S.outcomeLogSeen = S.outcomeLogSeen || Object.create(null);
  if (dedupeKey && S.outcomeLogSeen[dedupeKey]) return;
  if (dedupeKey) S.outcomeLogSeen[dedupeKey] = Date.now();

  if (out === 'ПЕЧАЛБИ') {
    logConsoleLine(`✅ ПЕЧАЛБА | ${String(tfLabel||'1m').toLowerCase()} | +$${(Math.abs(Number(pc||0))/100).toFixed(2)}`);
  } else if (out === 'ЗАГУБИ') {
    logConsoleLine(`❌ ЗАГУБА | ${String(tfLabel||'1m').toLowerCase()} | -$${(Math.abs(Number(pc||0))/100).toFixed(2)}`);
  } else if (out === 'EVEN') {
    logConsoleLine(`⚪ НЕУТРАЛНО | ${String(tfLabel||'1m').toLowerCase()} | $0.00`);
  } else {
    logConsoleLine(`⚪ РЕЗУЛТАТ | ${String(tfLabel||'1m').toLowerCase()} | ${money(pc)}`);
  }
}

    function detectOutcomeByResultDelta(trade, epsilonCents = 3) {
      if (!trade) return null;
      const startBalance = Number.isFinite(S.botStartBalance) ? S.botStartBalance : null;
      const resultBefore = Number.isFinite(trade.resultBeforeCents) ? trade.resultBeforeCents : null;
      const currentBalance = readBalanceCents();
      if (startBalance == null || resultBefore == null || !Number.isFinite(currentBalance)) return null;
      const resultNow = currentBalance - startBalance;
      const delta = resultNow - resultBefore;
      if (delta > epsilonCents) return { outcome: 'ПЕЧАЛБИ', profitCents: Math.round(delta), method: 'RESULT_DELTA' };
      if (delta < -epsilonCents) return { outcome: 'ЗАГУБИ', profitCents: Math.round(delta), method: 'RESULT_DELTA' };
      return { outcome: 'EVEN', profitCents: 0, method: 'RESULT_DELTA' };
    }

    function finalizeTradeOutcome(trade, outcome, profitCents, settledAt = Date.now(), method = '') {
      if (!trade || !outcome) return;
      if (trade.outcomeChecked) return;
      trade.outcomeChecked = true;
      trade.outcome = outcome;
      trade.settledAt = settledAt;
      trade.profitCents = profitCents;
      trade.outcomeMethod = method || trade.outcomeMethod || 'UNKNOWN';

      recordTradeOutcomeStats(trade, outcome, profitCents);
      recordTradeHistoryEntry(trade, outcome, profitCents);

      // --- Session HTML report trade record (normalized) ---
      try {
        sessionRecordTrade(trade, outcome, profitCents);
      } catch (e) { /* never block outcome finalize */ }

      recordTradeOutcomeForRisk(outcome, profitCents);
      applyRiskLimits();
      try { logTradeOutcome(trade, outcome, profitCents); } catch (e) { console.warn('[IAA] logTradeOutcome failed', e); }
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
      renderSessionMiniStats();
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

    function renderStrategiesPanel() {
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
        scalp_microtrend: 'RangeRevert логика (Upper/Lower BB + Stoch + тренд филтър).',
        ema_rsi_pullback: 'TrendPullback логика (EMA + RSI pullback) с потвърждение.'
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
      if (isKillerMode() && S.killerWarmupUntil && S.killerWarmupUntil > now) {
        etaMs = S.killerWarmupUntil - now;
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
      const driftValue = typeof S.clockDriftSec === 'number' ? S.clockDriftSec : null;
      const driftLabel = driftValue != null ? `${driftValue}s` : '—';
      const lagValue = typeof S.lastSignalLagSec === 'number' ? S.lastSignalLagSec : null;
      const lagLabel = lagValue != null ? `${lagValue}s` : '—';
      const analysisUpdatedSec = S.analysisUpdatedAt ? Math.round((Date.now() - S.analysisUpdatedAt) / 1000) : null;
      const analysisUpdatedLabel = analysisUpdatedSec != null ? `${analysisUpdatedSec}s` : '—';
      const confidence = Number.isFinite(S.analysisConfidence) ? S.analysisConfidence : 0;
      const threshold = isKillerMode()
        ? (typeof S.killerThreshold === 'number' ? S.killerThreshold : null)
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
        { key: 'анализ', value: isKillerMode() ? 'KILLER' : (S.analysisEnabled ? 'Да' : 'Не'), severity: '' },
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
        { key: 'пропуски (топ)', value: getTopSkipReasonsLabel(), severity: '' }
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
      const scannerLine = '<div class="iaa-debug-line"><span class="iaa-debug-key" style="color:#ef4444;font-weight:700;">[ENGINE]</span><span class="iaa-debug-value" style="color:#ef4444;font-weight:700;">RUNNING</span></div>';
      const whyNotLine = buildSkipStatsDebugHtml();
      content.innerHTML = scannerLine + whyNotLine + lines.map((line) => {
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


    function applySettingsInputColors() {
      const applyById = (id, opts) => {
        const el = $id(id);
        if (!el) return;
        const v = parseNumberFlexible(el.value);
        if (!Number.isFinite(v)) return;
        applyStrictnessColor(el, v, opts || {});
      };
      applyById('iaa-killer-threshold', { min: 1, max: 100, highIsStrict: true });
      applyById('iaa-killer-vwap', { min: 0, max: 0.30, highIsStrict: true });
      applyById('iaa-killer-momentum', { min: 0, max: 0.30, highIsStrict: true });
      applyById('iaa-killer-vwap-weight', { min: 1, max: 100, highIsStrict: true });
      applyById('iaa-killer-momentum-weight', { min: 1, max: 100, highIsStrict: false });
      applyById('iaa-killer-volume-weight', { min: 1, max: 100, highIsStrict: false });
      applyById('iaa-candle-pattern-min-conf', { min: 1, max: 100, highIsStrict: true });
      applyById('iaa-candle-pattern-weight', { min: 1, max: 100, highIsStrict: false });
      applyById('iaa-entrywin-1m', { min: 0, max: 999, highIsStrict: false });
      applyById('iaa-entrywin-3m', { min: 0, max: 999, highIsStrict: false });
      applyById('iaa-entrywin-5m', { min: 0, max: 999, highIsStrict: false });
      applyById('iaa-killer-dominance-threshold', { min: 50, max: 90, highIsStrict: true });
    }

    function buildMiniBar(value, min, max, blocks = 10) {
      if (!Number.isFinite(value)) return '';
      const clamped = Math.max(min, Math.min(max, value));
      const ratio = (clamped - min) / ((max - min) || 1);
      const filled = Math.max(0, Math.min(blocks, Math.round(ratio * blocks)));
      const full = '█'.repeat(filled);
      const empty = '░'.repeat(Math.max(0, blocks - filled));
      return full + empty;
    }
    function setMiniBar(id, value, min, max, blocks = 10, options = {}) {
      const el = $id(id);
      if (!el) return;
      const clamped = Number.isFinite(value) ? Math.max(min, Math.min(max, value)) : min;
      const ratioRaw = (clamped - min) / ((max - min) || 1);
      const ratio = Math.max(0, Math.min(1, options.highIsStrict === false ? (1 - ratioRaw) : ratioRaw));
      el.textContent = buildMiniBar(value, min, max, blocks);
      let color = '#fbbf24';
      if (ratio <= 0.4) color = '#22c55e';
      else if (ratio >= 0.7) color = '#f87171';
      el.style.color = color;
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
        wsLastPrice: S.wsLastPrice,
        wsLastPriceAgeMs: S.wsLastPriceAt ? Date.now() - S.wsLastPriceAt : null,
        wsPacketsSeen: S.wsPacketsSeen || 0,
        wsBridgeFramesSeen: S.wsBridgeFramesSeen || 0,
        wsTapInstalled: !!S.wsTapInstalled,
        wsBridgeListener: !!S.wsBridgeListener,
        wsBridgeInjected: !!S.wsBridgeInjected,
        wsBridgeReady: !!S.wsBridgeReady,
        feedState: S.feedState || 'NO_FEED',
        lastPriceRejectReason: S.lastPriceRejectReason || null,
        lastFeedSource: S.lastFeedSource || null,
        bridgeInjectError: window.__iaaBridgeInjectError || null,
        priceSource: (S.wsLastPrice && (Date.now() - S.wsLastPriceAt <= WS_PRICE_SAMPLE_TTL_MS)) ? 'ws' : (S.currentAssetPrice != null ? 'dom' : 'none'),
        priceHistoryLen: S.priceHistory?.length || 0,
        lastPayoutPercent: S.lastPayoutPercent,
        lastPayoutAt: S.lastPayoutAt,
        lastPayoutSource: S.lastPayoutSource,
        analysisDirection: S.analysisDirection,
        analysisConfidence: S.analysisConfidence,
        strategyKey: S.currentStrategyKey || null,
        decisionSnapshot: S.lastDecisionSnapshot || null,
        killerThreshold: S.killerThreshold,
        killerVwapWeight: S.killerVwapWeight,
        killerMomentumWeight: S.killerMomentumWeight,
        killerVolumeWeight: S.killerVolumeWeight,
        killerVwapDeviation: S.killerVwapDeviation,
        killerMomentumThreshold: S.killerMomentumThreshold,
        killerEntryWindowSec: S.killerEntryWindowSec,
        killerTfStatus: S.killerTfStatus
      };
      const rawState = JSON.stringify(state);
      el.dataset.state = rawState;
      el.textContent = rawState;
      el.dataset.updatedAt = String(Date.now());
      document.documentElement?.setAttribute('data-iaa-debug-updated', el.dataset.updatedAt);
    }

    function installPageDebugBridge() {
      try {
        if (window.__IAA_DEBUG__) return;
        const readState = () => {
          const host = document.getElementById('iaa-debug-state');
          const raw = host?.dataset?.state || host?.textContent;
          if (!raw) return null;
          try { return JSON.parse(raw); } catch { return null; }
        };
        const readTimeframes = () => {
          const tfs = ['1m', '3m', '5m', '15m'];
          return tfs.reduce((acc, tf) => {
            const text = document.getElementById('iaa-tf-' + tf);
            const dot = document.getElementById('iaa-tf-dot-' + tf);
            acc[tf] = {
              text: text?.textContent || null,
              dotClass: dot?.className || null
            };
            return acc;
          }, {});
        };
        window.__IAA_DEBUG__ = {
          version: 2,
          readState,
          readTimeframes,
          ping: () => ({
            hasPanel: !!document.getElementById('infinity-ai-agent-shell'),
            hasDebugState: !!document.getElementById('iaa-debug-state'),
            updatedAt: Number(document.getElementById('iaa-debug-state')?.dataset?.updatedAt || 0) || null
          })
        };
      } catch {
        // ignore debug bridge failures
      }
    }

    function stripConsoleMarkup(text) {
      if (!text) return '';
      return String(text)
        .replace(/<br\s*\/?>(\r?\n)?/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/\s+\|/g, ' |')
        .trim();
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
      const text = (S.consoleLines || []).map((line) => stripConsoleMarkup(line)).join('\n');
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

    function renderKillerMatrix() {
      const tfs = ['1m', '3m', '5m', '15m'];
      tfs.forEach(tf => {
        const textEl = $id(`iaa-tf-${tf}`);
        const dotEl = $id(`iaa-tf-dot-${tf}`);
        const cell = document.querySelector(`.iaa-tf-cell[data-tf="${tf}"]`);
        if (!textEl || !dotEl || !cell) return;
        dotEl.className = 'iaa-tf-dot';

        const enabled = !isKillerMode() || !!S.killerEnabledTimeframes?.[tf];
        cell.style.display = enabled ? '' : 'none';
        if (!enabled) {
          return;
        }

        if (!isKillerMode()) {
          textEl.textContent = `${tf} -`;
          textEl.style.color = '#e5e7eb';
          return;
        }

        const status = S.killerTfStatus[tf];
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
        } else if (['weak', 'late', 'chop', 'vwap', 'momentum', 'payout', 'tf_wait', 'warmup', 'nodata', 'trend', 'volume'].includes(status.state)) {
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
    const UI_WARM_RED = '#f87171';
    const T = (el) => (el ? (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim() : '');
    const clamp01 = (x) => Math.max(0, Math.min(1, x));
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    const nowMs = () => performance.now();
    const delay = (ms) => new Promise(r => setTimeout(r, ms));
    async function withTimeout(promiseFactory, timeoutMs, labelBg = 'операция') {
      const limit = Math.max(300, Number(timeoutMs) || 2000);
      let timer = null;
      try {
        const timeoutPromise = new Promise((_, reject) => {
          timer = setTimeout(() => reject(new Error(`timeout:${labelBg}`)), limit);
        });
        return await Promise.race([Promise.resolve().then(promiseFactory), timeoutPromise]);
      } finally {
        if (timer) clearTimeout(timer);
      }
    }
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
        'error', 'failed', 'exception', 'critical', 'outcome', 'ПЕЧАЛБИ', 'ЗАГУБИ', 'EVEN'
      ];

      const isCritical = criticalMessages.some(keyword =>
        message.toLowerCase().includes(keyword.toLowerCase())
      );

      if (isCritical) {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = `[${timestamp}] ${message}` + (data ? ` | ${JSON.stringify(data)}` : '');
        logConsoleLine(logEntry);
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
      const accountText = document.querySelector(BALANCE_SEL)?.textContent;
      if (!accountText) return null;

      // IMPORTANT: Pocket Option може да показва десетичен разделител '.' (DEMO) или ',' (REAL).
      // parseMoneyToCents() вече го нормализира — не махаме запетаи тук.
      const raw = String(accountText).trim();
      const cents = parseMoneyToCents(raw);
      return Number.isFinite(cents) ? cents : null;
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
      if(!exp) return null; const e=String(exp).trim().toLowerCase();
      if(/^(m1|1m|60s)$/.test(e)) return '1m';
      if(/^(m3|3m|180s)$/.test(e)) return '3m';
      if(/^(m5|5m|300s)$/.test(e)) return '5m';
      return null;
    }

    function getSignalLateToleranceMs(expiry) {
      const norm = normalizeExpiry(expiry);
      if (norm === '5m') return 120000;
      if (norm === '3m') return 90000;
      return 60000;
    }

    function getSignalMaxFutureMs(expiry) {
      const norm = normalizeExpiry(expiry);
      if (norm === '5m') return 6 * 60 * 60 * 1000;
      if (norm === '3m') return 4 * 60 * 60 * 1000;
      return 2 * 60 * 60 * 1000;
    }

    function secsFromTF(tf){
      const norm = normalizeExpiry(tf);
      if (norm === '5m') return 300;
      if (norm === '3m') return 180;
      return 60;
    }

    function getActiveTradeIntervalMin() {
      return Math.max(1, S.tradeIntervalMin || 1);
    }

    function getDynamicMode() {
      const mode = String(S.dynamicMode || 'off').toLowerCase();
      if (mode === 'dynamic' || mode === 'hybrid') return mode;
      return 'off';
    }

    function shouldUseDynamicExpiry(signal, assetScope) {
      if (!S.dynamicExpiryEnabled) return false;
      if (assetScope !== 'OTC') return false;
      const mode = getDynamicMode();
      if (mode === 'off') return false;
      return mode === 'dynamic' || mode === 'hybrid';
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
      if (true) return;
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
      const interval = norm === '5m' ? 5 : (norm === '3m' ? 3 : 1);
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

      const evaluatePrecheckGate = evaluatePrecheckGateCore;

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
    function collectPriceCandidates() {
      return [];
    }

    function isLikelyTradePrice(value, decimals, prevPrice = null) {
      if (!Number.isFinite(value) || value <= 0 || value >= 10000) return false;
      if (value < 0.01) return false;
      const d = Number.isFinite(decimals) ? decimals : 0;
      if (d < 2) return false;
      const asset = getCurrentAssetLabel() || '';
      const isForex = /[A-Z]{3}\/[A-Z]{3}/i.test(asset);
      if (isForex && d < 3) return false;
      if (Number.isFinite(prevPrice) && prevPrice > 0) {
        const jump = Math.abs(value - prevPrice) / prevPrice;
        if (jump > 0.5 && d <= 2) return false;
      }
      return true;
    }

    function hasFeedPrice() {
      return Number.isFinite(S.wsLastPrice) || (Array.isArray(S.priceHistory) && S.priceHistory.length > 0);
    }

    function extractLivePriceFromText(text, context = {}) {
      if (!text) return null;
      const clean = String(text)
        .replace(/@keyframes[^}]+}/g, '')
        .replace(/transform:[^;]+;/g, '')
        .replace(/translate\([^)]+\)/g, '')
        .replace(/scale\([^)]+\)/g, '')
        .replace(/opacity:[^;]+;/g, '')
        .trim();
      if (!clean) return null;
      if (/(payout|profit|balance|amount|stake|bonus|deposit|withdraw|roi|demo|real|wallet|account)/i.test(clean)) return null;
      const m = clean.match(/\b\d+[.,]\d{2,6}\b/);
      if (!m) return null;
      const raw = String(m[0]);
      const decimals = raw.includes('.') ? raw.split('.')[1].length : (raw.includes(',') ? raw.split(',')[1].length : 0);
      const v = Number(raw.replace(',', '.'));
      if (!Number.isFinite(v) || v <= 0 || v >= 10000) return null;

      const assetLabel = String(context.assetLabel || getCurrentAssetLabel() || '');
      const forexLike = /[A-Z]{3}\/?[A-Z]{3}|OTC/i.test(assetLabel);
      if (forexLike && decimals < 4) return null;
      if (!forexLike && decimals < 2) return null;

      const balanceFloat = Number.isFinite(S.balance) ? (S.balance / 100) : null;
      if (Number.isFinite(balanceFloat) && Math.abs(v - balanceFloat) < 0.05) return null;

      return v;
    }

    function getGeoZoneDomPrice() {
      try {
        const canvas = document.querySelector('#chart-1 > canvas.layer.plot') || document.querySelector('#chart-1 > canvas');
        if (!canvas) return null;
        const r = canvas.getBoundingClientRect();
        if (!r || !Number.isFinite(r.width) || !Number.isFinite(r.height)) return null;
        const centerY = r.top + r.height / 2;

        // Keep scan narrow around the chart right-side price lane to avoid balance/header numbers.
        const minX = r.right - Math.max(140, r.width * 0.33);
        const maxX = r.right + Math.max(36, r.width * 0.08);
        const minY = r.top - 10;
        const maxY = r.bottom + 10;

        const nodes = $$('div,span,p,li,strong,b');
        const evaluatePrecheckGate = evaluatePrecheckGateCore;

      let best = null;
        for (const el of nodes) {
          if (!visible(el)) continue;
          if (el.closest?.('[class*="balance"], [id*="balance"], [class*="payout"], [id*="payout"], [class*="profit"], [id*="profit"], [class*="amount"], [id*="amount"]')) continue;
          const rr = el.getBoundingClientRect();
          if (!rr || rr.width < 8 || rr.height < 8) continue;
          if (rr.left > maxX || rr.right < minX || rr.top > maxY || rr.bottom < minY) continue;
          const price = extractLivePriceFromText(T(el), { assetLabel: getCurrentAssetLabel() || '' });
          if (!Number.isFinite(price)) continue;

          const xCenter = rr.left + rr.width / 2;
          const yCenter = rr.top + rr.height / 2;
          const xPenalty = Math.abs(xCenter - r.right) * 1.8;
          const yPenalty = Math.abs(yCenter - centerY);
          const score = xPenalty + yPenalty;
          if (!best || score < best.score) {
            best = { value: price, score };
          }
        }
        return best?.value ?? null;
      } catch {
        return null;
      }
    }

    function getRealtimeOpenPriceMenuValue() {
      try {
        const selectors = [
          '#pending-trades_open-price > div.current-time > span > span.open-time-number',
          '#pending-trades_open-price > div.current-time > span.open-time-number',
          '#pending-trades_open-price > div.current-time > span',
          '#pending-trades_open-price .open-time-number',
          '#pending-trades_open-price span.open-time-number',
          'span.open-time-number'
        ];
        for (const selector of selectors) {
          const nodes = $$(selector);
          for (const el of nodes) {
            if (!el || !el.isConnected) continue;
            const text = (el.textContent || '').trim();
            if (!text) continue;
            const price = extractLivePriceFromText(text, {
              assetLabel: getCurrentAssetLabel() || '',
              source: 'menu_open_price'
            });
            if (Number.isFinite(price)) return price;
          }
        }
        return null;
      } catch {
        return null;
      }
    }

    
    function getOrderPanelLivePrice() {
      try {
        const selectors = [
          '[class*="asset-price" i]',
          '[data-test*="asset-price" i]',
          '[data-testid*="asset-price" i]',
          '[class*="current-price" i]',
          '[class*="price-value" i]',
          '#put-call-buttons [class*="price" i]',
          '.purchase-form [class*="price" i]'
        ];
        const assetLabel = getCurrentAssetLabel() || '';
        for (const sel of selectors) {
          for (const el of $$(sel)) {
            if (!visible(el)) continue;
            const text = (el.textContent || '').trim();
            if (!text) continue;
            const price = extractLivePriceFromText(text, { assetLabel, source: 'order_panel' });
            if (Number.isFinite(price)) return price;
          }
        }
      } catch {}
      return null;
    }

function getMinHistoryWindowForReadinessMs() {
      const enabled = Object.keys(S.killerEnabledTimeframes || {}).filter((tf) => !!S.killerEnabledTimeframes[tf]);
      if (!enabled.length) return 0;
      let requiredMs = 0;
      for (const tf of enabled) {
        const tfMs = KILLER_TF_MS[tf];
        if (!Number.isFinite(tfMs) || tfMs <= 0) continue;
        let bars = 2;
        if (tf === '1m') bars = Math.max(1, Math.round(S.partnerReadyBars1m || 10));
        else if (tf === '3m') bars = Math.max(1, Math.round(S.partnerReadyBars3m || 6));
        else if (tf === '5m') bars = Math.max(1, Math.round(S.partnerReadyBars5m || 3));
        else if (tf === '15m') bars = Math.max(1, Math.round(S.partnerReadyBars15m || 2));
        const need = bars * tfMs + tfMs;
        if (need > requiredMs) requiredMs = need;
      }
      return requiredMs;
    }

    function getCurrentAssetPrice() {
      // DOM fallback chain (when WS bridge is delayed/unavailable).
      const candidates = [
        { value: getRealtimeOpenPriceMenuValue(), source: 'dom_open_price' },
        { value: getOrderPanelLivePrice(), source: 'dom_order_panel' },
        { value: getGeoZoneDomPrice(), source: 'dom_chart_lane' }
      ];

      for (const c of candidates) {
        const p = c?.value;
        if (!Number.isFinite(p)) continue;
        S.currentAssetPrice = p;
        S.lastPriceAt = Date.now();
        S.feedState = 'READY';
        S.lastFeedSource = c.source;
        appendPriceHistoryTick(S, p, S.lastPriceAt, c.source || 'dom');
        return p;
      }

      S.feedState = 'NO_FEED';
      S.lastFeedSource = null;
      return null;
    }

    function extractValidPriceInfo(text) {
      if (!text) return null;

      const cleanText = text.replace(/@keyframes[^}]+}/g, '')
                          .replace(/transform:[^;]+;/g, '')
                          .replace(/translate\([^)]+\)/g, '')
                          .replace(/scale\([^)]+\)/g, '')
                          .replace(/opacity:[^;]+;/g, '')
                          .trim();

      if (!cleanText) return null;
      if (/%/.test(cleanText)) return null;
      if (/[€£¥₽₺₴₹₩₫$]/.test(cleanText)) return null;
      if (/(payout|profit|balance|amount|stake|win|loss|bonus|deposit|withdraw)/i.test(cleanText.toLowerCase())) return null;

      const matches = [];
      const regex = /\b\d+[.,]\d{2,6}\b/g;
      let match;
      while ((match = regex.exec(cleanText)) !== null) {
        const raw = match[0].replace(',', '.');
        const price = parseFloat(raw);
        const decimals = raw.includes('.') ? raw.split('.')[1].length : 0;
        if (!Number.isFinite(price)) continue;
        if (price <= 0 || price >= 10000) continue;
        matches.push({ value: price, decimals });
      }
      if (!matches.length) return null;
      matches.sort((a, b) => (b.decimals || 0) - (a.decimals || 0));
      return matches[0];
    }

    /* ========================= PROPER BALANCE-BASED OUTCOME DETECTION ========================= */
    function detectTradeOutcomeByBalance(balanceBefore, balanceAfter) {
      if (!Number.isFinite(balanceBefore) || !Number.isFinite(balanceAfter)) return null;

      const balanceDiff = balanceAfter - balanceBefore;

      // NO TOLERANCE - Exact comparison only
      if (balanceDiff > 0) {
        return 'ПЕЧАЛБИ';
      } else if (balanceDiff < 0) {
        return 'ЗАГУБИ';
      } else {
        return 'EVEN';
      }
    }

    /* ========================= PROPER PROFIT CALCULATION ========================= */
    function calculateProfitFromBalanceChange(balanceBefore, balanceAfter) {
      if (!Number.isFinite(balanceBefore) || !Number.isFinite(balanceAfter)) return 0;

      // Simple difference - no assumptions about payout percentages
      return balanceAfter - balanceBefore;
    }

    function calculatePayoutProfitCents(trade, outcome, fallbackCents = null) {
      if (!trade || !outcome) return fallbackCents;
      if (outcome === 'EVEN') return 0;
      const totalAmount = Number.isFinite(trade.totalAmountCents) ? trade.totalAmountCents : trade.amountCents;
      if (!Number.isFinite(totalAmount)) return fallbackCents;
      if (outcome === 'ЗАГУБИ') return -totalAmount;
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
      if (outcome === 'ЗАГУБИ') {
        S.lossStreak += 1;
        if (profitCents < 0) {
          S.sessionLossCents += Math.abs(profitCents);
        }
      } else {
        S.lossStreak = 0;
      }
    }

    function applyRiskLimits() {
      const start = Number.isFinite(S.botStartBalance) ? S.botStartBalance : null;
      const cur = Number.isFinite(S.balance) ? S.balance : readBalanceCents();
      const diff = (start != null && cur != null) ? (cur - start) : null;

      // "Стоп при загуба" трябва да следи директно Резултат (Start → Now), не СДЕЛКИ/WS.
      const hitLossLimit = (S.maxSessionLossCents > 0) && (diff != null) && (diff <= -S.maxSessionLossCents);
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
        return 'ПЕЧАЛБИ'; // Exact price match
      }

      if (direction === 'BUY') {
        const outcome = currentPrice > entryPrice ? 'ПЕЧАЛБИ' : 'ЗАГУБИ';
        return outcome;
      } else if (direction === 'SELL') {
        const outcome = currentPrice < entryPrice ? 'ПЕЧАЛБИ' : 'ЗАГУБИ';
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

    function bumpSkipReasonCounter(reason) {
      if (!reason) return;
      if (!S.skipReasonCounts || typeof S.skipReasonCounts !== 'object') S.skipReasonCounts = {};
      S.skipReasonCounts[reason] = (S.skipReasonCounts[reason] || 0) + 1;
    }

    function getTopSkipReasonsLabel(limit = 3) {
      const entries = Object.entries(S.skipReasonCounts || {})
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit);
      if (!entries.length) return '—';
      return entries.map(([k, v]) => `${translateSkipReason(k)}:${v}`).join(' | ');
    }


    function incrementKillerSkipStat(reason, verdict = 'WAIT') {
      S.skipStats = S.skipStats || { pass: 0, wait: 0, confluence: 0, dominance: 0, perfectTime: 0, chop: 0, payout: 0, tolerance: 0, strategy: 0, other: 0 };
      if (verdict === 'PASS') { S.skipStats.pass = (S.skipStats.pass || 0) + 1; return; }
      S.skipStats.wait = (S.skipStats.wait || 0) + 1;
      const r = String(reason || '').toLowerCase();
      if (r.includes('confluence')) S.skipStats.confluence = (S.skipStats.confluence || 0) + 1;
      else if (r.includes('dominance')) S.skipStats.dominance = (S.skipStats.dominance || 0) + 1;
      else if (r.includes('perfect')) S.skipStats.perfectTime = (S.skipStats.perfectTime || 0) + 1;
      else if (r.includes('chop')) S.skipStats.chop = (S.skipStats.chop || 0) + 1;
      else if (r.includes('payout')) S.skipStats.payout = (S.skipStats.payout || 0) + 1;
      else if (r.includes('tolerance')) S.skipStats.tolerance = (S.skipStats.tolerance || 0) + 1;
      else if (r.includes('strategy')) S.skipStats.strategy = (S.skipStats.strategy || 0) + 1;
      else S.skipStats.other = (S.skipStats.other || 0) + 1;
    }

    function buildSkipStatsDebugHtml() {
      const st = S.skipStats || {};
      const wait = Number(st.wait || 0);
      const pass = Number(st.pass || 0);
      const rows = [
        ['Confluence', Number(st.confluence || 0)],
        ['Dominance', Number(st.dominance || 0)],
        ['PerfectTime', Number(st.perfectTime || 0)],
        ['Chop', Number(st.chop || 0)],
        ['Payout', Number(st.payout || 0)],
        ['Tolerance', Number(st.tolerance || 0)],
        ['Strategy', Number(st.strategy || 0)],
        ['Other', Number(st.other || 0)]
      ].filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]).slice(0, 6);
      const details = rows.length
        ? rows.map(([k, n]) => `${k} × ${n} (${wait > 0 ? Math.round((n / wait) * 100) : 0}%)`).join('<br>')
        : '—';
      return `<div class="iaa-debug-line"><span class="iaa-debug-key" style="color:#ef4444;font-weight:700;">ЗАЩО НЕ ВЛИЗА</span><span class="iaa-debug-value" style="color:#ef4444;font-weight:700;">ASS: ${pass} | WAIT: ${wait}</span></div><div class="iaa-debug-line"><span class="iaa-debug-key" style="color:#ef4444;font-weight:700;">Причини</span><span class="iaa-debug-value" style="color:#ef4444;font-weight:700;">${details}</span></div>`;
    }

    function setSkipReason(reason) {
      const now = Date.now();
      if (S.lastSkipReason === reason && now - S.lastSkipAt < 3000) return;
      S.lastSkipReason = reason;
      S.lastSkipAt = now;
      S.analysisReason = reason;
      bumpSkipReasonCounter(reason);
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
      const killerWindowMs = Math.max(1, S.killerWarmupMin || 0) * 60 * 1000;
      const readinessWindowMs = getMinHistoryWindowForReadinessMs();
      return Math.max(baseWindowMs, reversalWindowMs, killerWindowMs, readinessWindowMs);
    }

    function startPriceMonitoring() {
      if (S.priceMonitorInterval) {
        clearInterval(S.priceMonitorInterval);
      }

      S.priceMonitorInterval = setInterval(() => {
        const now = Date.now();
        const wsFresh = S.wsLastPrice && (now - S.wsLastPriceAt <= WS_PRICE_SAMPLE_TTL_MS);
        const wsPrice = wsFresh ? S.wsLastPrice : null;
        const currentPrice = wsPrice ?? getCurrentAssetPrice();
        if (currentPrice !== null) {
          S.currentAssetPrice = currentPrice;
          if (wsPrice != null && Number.isFinite(S.wsLastPriceDecimals)) {
            S.currentAssetPriceDecimals = S.wsLastPriceDecimals;
            S.lastFeedSource = 'ws';
          }
          S.lastPriceAt = now;

          appendPriceHistoryTick(S, currentPrice, now, 'monitor');

                    // Keep history as count-capped sliding window only (no time-based trimming).
          // Pocket Option binary needs stable indicator history; time-based trimming caused history to shrink (~1k).
          trimPriceHistory(S);
        } else {
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
    function ensureBalancePoller() {
      if (S.balancePoller) return;
      // Polling is the most robust way to capture balance debits/credits without depending on a specific DOM node.
      S.balancePoller = setInterval(() => {
        const cur = readBalanceCents();
        if (cur == null || cur <= 0) return;

        const prev = Number.isFinite(S.lastBalanceCents) ? S.lastBalanceCents : cur;
        const delta = cur - prev;

        S.lastBalanceCents = cur;
        S.balance = cur;

        if (delta !== 0) {
          S.balanceEvents = Array.isArray(S.balanceEvents) ? S.balanceEvents : [];
          S.balanceEvents.push({ t: Date.now(), balanceCents: cur, deltaCents: delta, used: false });
          const maxEv = Math.max(2000, Number(S.maxBalanceEvents || 0) || 0);
          if (S.balanceEvents.length > maxEv) S.balanceEvents.splice(0, S.balanceEvents.length - maxEv);
        }
      }, 250);
    }

    function ensureBalanceObserver() {
      // Always keep a balance poller running — it powers trade open/settle verification.
      ensureBalancePoller();
      if (S.balObs) return;

      const balanceEl = $(C.BALANCE_DEMO_SELECTOR) || $(C.BALANCE_REAL_SELECTOR);
      if (!balanceEl) {
        // We'll still retry attaching the MutationObserver, but polling already covers correctness.
        setTimeout(ensureBalanceObserver, 1000);
        return;
      }

      S.balObs = new MutationObserver(() => {
        const cur = readBalanceCents();
        if (cur != null && cur > 0) {
          const prev = Number.isFinite(S.lastBalanceCents) ? S.lastBalanceCents : cur;
          const delta = cur - prev;
          S.lastBalanceCents = cur;
          S.balance = cur;

          if (delta !== 0) {
            S.balanceEvents = Array.isArray(S.balanceEvents) ? S.balanceEvents : [];
            S.balanceEvents.push({ t: Date.now(), balanceCents: cur, deltaCents: delta, used: false });
            const maxEv = Math.max(50, Number.isFinite(S.balanceEventsMax) ? S.balanceEventsMax : 500);
            if (S.balanceEvents.length > maxEv) S.balanceEvents.splice(0, S.balanceEvents.length - maxEv);
          }

          updateBalanceSummary();
        }
      });

      S.lastBalanceCents = readBalanceCents() || S.lastBalanceCents;

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
      const startTimeEl = $id('iaa-balance-start-time');
      const startEl = $id('iaa-balance-start');
      const currentEl = $id('iaa-balance-current');
      const diffEl = $id('iaa-balance-diff');
      if (!startTimeEl && !startEl && !currentEl && !diffEl) return;

      const startBalance = Number.isFinite(S.botStartBalance) ? S.botStartBalance : null;
      const currentBalance = Number.isFinite(S.balance) ? S.balance : null;
      const startText = startBalance != null ? fmtMoney(startBalance) : '—';
      const currentText = currentBalance != null ? fmtMoney(currentBalance) : '—';
      const diffCents = (startBalance != null && currentBalance != null)
        ? currentBalance - startBalance
        : null;
      const diffText = diffCents != null ? fmtMoney(diffCents) : '—';

      if (startTimeEl) startTimeEl.textContent = S.botStartAt ? new Date(S.botStartAt).toLocaleTimeString('bg-BG', { hour: '2-digit', minute: '2-digit' }) : '—';
      if (startEl) startEl.textContent = startText;
      if (currentEl) currentEl.textContent = currentText;
      if (diffEl) {
        diffEl.textContent = diffText;
        diffEl.classList.toggle('iaa-balance-positive', diffCents != null && diffCents > 0);
        diffEl.classList.toggle('iaa-balance-negative', diffCents != null && diffCents < 0);
      }
      renderSessionMiniStats();
    }

    function renderSessionMiniStats() {
      const el = $id('iaa-session-mini');
      if (!el) return;
      const stats = S.tradeStatsSummary || { total: 0, wins: 0, losses: 0, profitCents: 0 };
      const total = Number(stats.total || 0);
      const wins = Number(stats.wins || 0);
      const losses = Number(stats.losses || 0);
      const wr = total > 0 ? Math.round((wins / total) * 100) : 0;
      const pnl = Number(stats.profitCents || 0);
      const pnlTxt = (pnl >= 0 ? '+' : '-') + '$' + (Math.abs(pnl) / 100).toFixed(2);
      const pnlCls = pnl > 0 ? 'pos' : (pnl < 0 ? 'neg' : '');
      el.innerHTML = `<span class="mini-pnl ${pnlCls}">PnL ${pnlTxt}</span> • <span class="mini-w">W ${wins}</span> • <span class="mini-l">L ${losses}</span> • WR ${wr}% • T ${total}`;
    }

    /* ========================= KEEP ALIVE SYSTEM ========================= */
    function isSettingsPanelVisible() {
      const panel = document.getElementById('iaa-settings-panel');
      if (S.settingsPanelOpen) return true;
      if (!panel) return false;
      const cs = getComputedStyle(panel);
      return cs.display !== 'none' && cs.visibility !== 'hidden' && panel.offsetWidth > 0 && panel.offsetHeight > 0;
    }

    async function performKeepAlive() {
      if (S.keepAliveActive) return;
      if (false || false || hasActiveTrade() || false) return;
      if (isSettingsPanelVisible()) {
        if (S.debugEnabled) debugLog('KeepAlive skipped: settings panel visible');
        return;
      }

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
          setStatusOverlay('💥 СДЕЛКА');
          stopCountdown();
          hideDirectionIndicator();
          break;

        case 'RESULTS':
          if (data.outcome === 'ПЕЧАЛБИ') {
            setStatusOverlay(formatStatus('trade_won'), '', false);
          } else if (data.outcome === 'ЗАГУБИ') {
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


    const tradeCommitGuard = new Map();

    function __normalizeCommitTf(signal) {
      const raw = String(signal?.expiry || signal?.tfKey || signal?.entryMeta?.tfKey || '').toLowerCase();
      if (raw === 'm1' || raw == '1m') return '1m';
      if (raw === 'm3' || raw == '3m') return '3m';
      if (raw === 'm5' || raw == '5m') return '5m';
      if (raw === 'm15' || raw == '15m') return '15m';
      return raw || '1m';
    }

    function __commitGuardKey(signal) {
      const tf = __normalizeCommitTf(signal);
      const dir = String(signal?.direction || '').toUpperCase() || '-';
      const candleStart = Number(signal?.entryMeta?.candleStart || signal?.candleStart || 0) || 0;
      const asset = String(signal?.asset || getCurrentAssetLabel() || '').trim();
      return `${tf}|${dir}|${candleStart}|${asset}`;
    }

    function __commitWaitReasonFromTfStatus(tfStatus) {
      const state = String(tfStatus?.state || '').toLowerCase();
      const detail = String(tfStatus?.detail || '');
      if (!state || state === 'ready') return '';
      if (state.includes('window')) return 'LATE';
      if (state.includes('tf_wait')) return 'TF';
      if (state.includes('precheck') || state.includes('risk')) {
        if (/чоп/i.test(detail)) return 'ЧОП';
        if (/конфликт/i.test(detail)) return 'конфликт';
        if (/слаба увереност/i.test(detail)) return 'CONF';
      }
      if (/dom/i.test(detail) || /domin/i.test(detail)) return 'DOM';
      return detail || state;
    }

    function __canCommitTrade(signal) {
      const tf = __normalizeCommitTf(signal);
      const tfMs = Number(KILLER_TF_MS[tf] || 0) || 60000;
      const entryMeta = signal?.entryMeta || {};
      const direction = String(signal?.direction || '').toUpperCase();
      const timeInCandle = Number.isFinite(entryMeta?.timeInCandle) ? Number(entryMeta.timeInCandle) : Number(getTimeInCandleSec(tfMs));
      const entryWindowSec = Number.isFinite(entryMeta?.entryWindowSec) ? Number(entryMeta.entryWindowSec) : 0;
      const regime = entryMeta?.regime || {};
      const requiredThreshold = clamp01(getKillerThresholdForScope(getExpiryScopeFromAsset(signal?.asset || getCurrentAssetLabel())));
      const decision = {
        direction,
        confidence: Number(signal?.confidence || 0),
        strategyKey: entryMeta?.strategyKey || signal?.strategyKey || '',
        biasDir: Number(entryMeta?.biasDir || 0),
        timeInCandle,
        entryWindowSec,
        candleStart: Number(entryMeta?.candleStart || getCandleStart(tfMs) || 0)
      };

      const reasons = [];
      const gate = evaluatePrecheckGateCore(tf, decision, regime, requiredThreshold);
      if (!gate?.pass) reasons.push(String(gate.reason || 'gate'));
      const tfStatus = S?.killerTfStatus?.[tf];
      const waitReason = __commitWaitReasonFromTfStatus(tfStatus);
      if (waitReason) reasons.push(waitReason);

      const currentState = String(tfStatus?.state || '').toLowerCase();
      if (currentState && currentState !== 'ready') {
        return { pass: false, reason: reasons[0] || currentState, reasons, gate, tfStatus };
      }
      if (reasons.length) {
        return { pass: false, reason: reasons[0], reasons, gate, tfStatus };
      }
      return { pass: true, reason: '', reasons: [], gate, tfStatus };
    }

    function __isDuplicateTrade(signal) {
      const key = __commitGuardKey(signal);
      const now = Date.now();
      const lockMs = 4000;
      const prev = Number(tradeCommitGuard.get(key) || 0);
      if (prev && (now - prev) < lockMs) return true;
      tradeCommitGuard.set(key, now);
      return false;
    }

    function __releaseDuplicateTrade(signal) {
      try { tradeCommitGuard.delete(__commitGuardKey(signal)); } catch (_) {}
    }

    function __logCommit(signal, confidenceOverride = null) {
      const tf = __normalizeCommitTf(signal);
      const dir = String(signal?.direction || '').toUpperCase() || '-';
      const confRaw = Number.isFinite(Number(confidenceOverride)) ? Number(confidenceOverride) : Number(signal?.confidence || 0);
      const confPct = Math.round(confRaw > 1 ? confRaw : confRaw * 100);
      const strategy = String(signal?.strategyKey || signal?.entryMeta?.strategyKey || 'strategy').toLowerCase();
      logConsoleLine(`🧾 ОК | ${tf} ${dir} | ${confPct}% | ${strategy}`);
    }


    /* ========================= ENHANCED TRADE EXECUTION WITH EXACT TIMING ========================= */
    async function executeTradeOrder(signal) {
      if (S.executing) return false;
      const __commitCheck = __canCommitTrade(signal);
      if (!__commitCheck.pass) {
        incrementObsMetric('commitBlock', 1);
        annotateSignalTrace(signal, 'COMMIT_BLOCK', String(__commitCheck.reason || 'commit_block'));
        setSkipReason(__commitCheck.reason || 'commit_block');
        const tfLbl = __normalizeCommitTf(signal);
        const dirLbl = String(signal?.direction || '').toUpperCase() || '-';
        const reasonTxt = String(__commitCheck.reason || 'commit_block');
        const detailTxt = String(__commitCheck?.gate?.details || __commitCheck?.tfStatus?.detail || '').trim();
        const detailSuffix = detailTxt ? ` | ${detailTxt}` : '';
        logConsoleLine(`🔴🧾 БЛОК | ${tfLbl} ${dirLbl} | ${reasonTxt}${detailSuffix}`);
        return false;
      }
      if (__isDuplicateTrade(signal)) {
        incrementObsMetric('commitBlock', 1);
        annotateSignalTrace(signal, 'COMMIT_DUPLICATE', 'duplicate_trade');
        setSkipReason('duplicate_trade');
        const strategy = String(signal?.strategyKey || signal?.entryMeta?.strategyKey || 'strategy').toLowerCase();
        logConsoleLine(`🔵🧾 ПРОПУСК | ${__normalizeCommitTf(signal)} ${String(signal?.direction || '').toUpperCase()} | дубликат | ${strategy}`);
        return false;
      }
      incrementObsMetric('commitPass', 1);
      annotateSignalTrace(signal, 'COMMIT_PASS', __normalizeCommitTf(signal));
      __logCommit(signal, signal?.confidence || signal?.analysisConfidence);
      if (S.tradeMutex?.active) return false;
      if (iaaDirectionBlocked(signal.direction)) {
        const leftMs = Math.max(0, Number(S?._dirLock?.until || 0) - Date.now());
        const lockDir = String(S?._dirLock?.dir || '-').toUpperCase();
        logConsoleLine(`🧭 [ENGINE_GUARD] [${String(signal.expiry || '1m').toLowerCase()}] [${String(signal.direction || '').toUpperCase()}] [ЗАКЛЮЧЕНА ПОСОКА] lock=${lockDir} (${(leftMs/1000).toFixed(1)}s)`);
        return false;
      }
      if (!canOpenAnotherTrade()) {
        setSkipReason('MaxOpen');
        return false;
      }
      if (!canExecuteTradeByRate()) {
        setSkipReason('MaxRate');
        return false;
      }

      const execKey = signalExecKey(signal);
      if (!isKillerMode() && S.lastExecutedKey === execKey && Date.now() < S.tradeLockUntil) return false;
      if (!S.baseAmount) {
        setSkipReason('Amount');
        return false;
      }
      const enforceAnalysis = !isKillerMode() && S.analysisEnabled;
      const enforceInterval = !isKillerMode();
      const enforcePayout = false;
      const enforceReversal = true;
      if (enforceAnalysis && S.analysisReadyAt && Date.now() < S.analysisReadyAt) {
        setSkipReason('Warmup');
        return false;
      }
      if (!isKillerMode() && S.tradeLockUntil > Date.now()) return false;
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
      if (isKillerMode() && hasOppositeActiveTrade(signal)) {
        setSkipReason('Conflict');
        return false;
      }
      S.executing = true;
      S.executionAttempts = 1;
      S.executionStartTime = Date.now();
      const mutexId = `m-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      S.tradeMutex = { active: true, id: mutexId, startedAt: Date.now() };

      let resolvedExpiry = normalizeExpiry(signal.expiry) || S.expirySetting;
      const assetScope = getExpiryScopeFromAsset(signal.asset);
      const useDynamicExpiry = shouldUseDynamicExpiry(signal, assetScope);
      const entryContext = buildEntryContext(signal, resolvedExpiry);
      const confidenceLabel = getExecutionConfidenceLabel(signal);
      if (signal?.strategyKey) {
        S.lastStrategyKey = signal.strategyKey;
      }

      try {
        S.engineState = 'PREP_UI';
        if (!useDynamicExpiry || assetScope !== 'OTC') {
          const expiryOk = await withTimeout(() => ensurePlatformExpiry(resolvedExpiry), Number(S.uiExpiryTimeoutMs || 2200), 'настройка на expiry');
          if (!expiryOk) {
            setSkipReason(S.lastSkipReason || 'Expiry');
            return false;
          }
        }
        const balanceEligible = S.activeTrades.length === 0;
        // CAPTURE BALANCE BEFORE TRADE EXECUTION (only if no overlapping trades)
        const balanceBeforeTrade = balanceEligible ? await readBalanceWithRetry() : null;
        if (balanceEligible) {
          S.balanceBeforeTrade = balanceBeforeTrade;
        }
        const startBalanceCents = Number.isFinite(S.botStartBalance) ? S.botStartBalance : null;
        const resultBeforeCents = (Number.isFinite(balanceBeforeTrade) && Number.isFinite(startBalanceCents))
          ? (balanceBeforeTrade - startBalanceCents)
          : null;

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
          : Math.max(1, Math.round(S.baseAmount ?? 100));
        if (useCurrentAmount && Number.isFinite(parsedInputAmount)) {
          amountCents = Math.max(1, Math.round(parsedInputAmount * 100));
        }
        let stakeMultiplier = 1;
        let stakeReasonBg = 'Базов stake';
        const dynamicPlanPreview = (useDynamicExpiry && assetScope === 'OTC')
          ? getCachedDynamicPlan(signal.expiry || resolvedExpiry, S.analysisConfidence, assetScope, { signal })
          : null;
        if (S.dynamicStakeScaleEnabled && !Number.isFinite(signal?.overrideAmountCents)) {
          const pts = Number(signal?.entryMeta?.scoreCard?.points || 0);
          const simWr = Number(dynamicPlanPreview?.best?.stats?.winrate || 0);
          const simSamples = Number(dynamicPlanPreview?.best?.stats?.samples || 0);
          if (pts >= 9) { stakeMultiplier += Number(S.dynamicStakeMult9 || 0.30); stakeReasonBg = '9/11'; }
          else if (pts >= 8) { stakeMultiplier += Number(S.dynamicStakeMult8 || 0.15); stakeReasonBg = '8/11'; }
          if (simWr >= 0.60 && simSamples >= Math.max(1, Number(S.dynamicStakeBoostMinSamples || 60))) {
            stakeMultiplier += Number(S.dynamicStakeBoostWr || 0.05);
            stakeReasonBg += ' + SIM boost';
          }
          if ((S.lossStreak || 0) >= 3) {
            stakeMultiplier -= Number(S.dynamicStakeLossReduce || 0.10);
            stakeReasonBg += ' - loss reduce';
          }
          stakeMultiplier = Math.max(1, stakeMultiplier);
          amountCents = Math.round(amountCents * stakeMultiplier);
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
        let dynamicPlanUsed = dynamicPlanPreview;
        const shouldBurst = S.burstEnabled && S.analysisSteadyTrend && S.analysisConfidence >= S.burstConfidenceThreshold;
        const baseBurst = shouldBurst ? Math.max(1, Math.min(S.burstTradeCount, 5)) : 1;
        const burstCount = Math.max(1, Number.isFinite(signal?.burstCount) ? signal.burstCount : baseBurst);
        const payoutPercent = getCurrentPayoutPercent();

        let dynamicApplied = false;
        if (useDynamicExpiry && assetScope === 'OTC') {
          const plan = getCachedDynamicPlan(signal.expiry || resolvedExpiry, S.analysisConfidence, assetScope, { signal });
          dynamicPlanUsed = plan;
          if (!plan.seconds.length) {
            if (plan.noTrade) {
              setSkipReason('Dynamic no edge');
              logConsoleLine('[DYN] Няма edge → пропуск.');
              return false;
            }
            if (plan.fallbackFixed) {
              const expiryOk = await withTimeout(() => ensurePlatformExpiry(resolvedExpiry), Number(S.uiExpiryTimeoutMs || 2200), 'настройка на expiry');
              if (!expiryOk) {
                setSkipReason(S.lastSkipReason || 'Expiry');
                return false;
              }
              logConsoleLine('[DYN] Резервен режим към фиксирано време.');
            } else {
              setSkipReason('Dynamic no edge');
              logConsoleLine('[DYN] Няма edge → без сделка.');
              return false;
            }
          }
          if (assetScope === 'OTC') {
            const opened = await iaaOpenExpiryMenu(assetScope);
            if (!opened) {
              setSkipReason(S.lastSkipReason || 'Expiry');
              return false;
            }
            if (!plan.seconds.length) return false;

            for (const secondsBase of plan.seconds) {
              const seconds = Math.max(3, Math.round(Number(secondsBase || 0) + Math.round(Number(S.dynamicLatencyCompMs || 0) / 1000)));
              const startSet = Date.now();
              let applied = await setDynamicExpiryTime(seconds);
              if (!applied) {
                setSkipReason(S.lastSkipReason || 'Expiry');
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
                    logConsoleLine(`[DYN] Корекция: желано ${seconds}s → реално ${actualSeconds}s`);
                  }
                }
              }
              const finalSeconds = Number.isFinite(actualSeconds) ? actualSeconds : seconds;
              logConsoleLine(`💥 СДЕЛКА | ${String(signal.expiry || '1m').toLowerCase()} | ${signal.direction.toUpperCase()} | $${(amountCents / 100).toFixed(2)}`);
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
                resultBeforeCents,
                balanceEligible,
                stakeCents: amountCents,
              source: isKillerMode() ? 'killer' : 'signal',
              strategyKey: signal.strategyKey || null,
              outcomeChecked: false,
                balanceCheckAttempts: 0,
                nextBalanceCheckAt: 0,
                historyCheckAttempts: 0,
                nextHistoryCheckAt: 0,
                payoutPercent,
                dynamicMode: getDynamicMode(),
                dynamicSimWinrate: Number(dynamicPlanUsed?.best?.stats?.winrate || 0),
                dynamicSimSamples: Number(dynamicPlanUsed?.best?.stats?.samples || 0),
                stakeMultiplier,
                stakeReasonBg
              };

      // --- normalize trade context for reporting/debug ---
      try {
        trade.id = trade.id || ('T' + Date.now().toString(36) + '_' + Math.random().toString(16).slice(2));
        trade.mode = trade.mode || 'AUTO';
        trade.tfLabel = trade.tfLabel || (resolvedExpiry && resolvedExpiry.label) || trade.expiryLabel || '';
        if (trade.confidence == null) {
          const c = entryContext && (entryContext.confidence ?? entryContext.finalConfidence ?? entryContext.conf);
          trade.confidence = (c == null ? null : c);
        }
        trade.strategyKey = trade.strategyKey || (entryContext && entryContext.strategyKey) || trade.strategy || '';
      } catch (e) {}


              S.activeTrades.push(trade);
              S.pendingTradeConfirmations.push({ trade, at: Date.now() });
              dynamicApplied = true;
              await delay(140);
            }
            if (dynamicApplied && plan.best?.breakdown) {
              const b = plan.best.breakdown;
              const vol = String(plan?.volatility || 'normal');
              logConsoleLine(`[DYN] Избор: ${plan.best.seconds}s | Резултат: ${(b.total * 100).toFixed(1)}% | WR: ${((b.winrate || 0) * 100).toFixed(1)}% | Волатилност: ${vol} | Причина: ${b.reason || 'Base'}`);
            }
          } else {
            if (!plan.expiries.length) return false;
            for (const expiry of plan.expiries) {
              const expiryOk = await withTimeout(() => ensurePlatformExpiry(expiry), Number(S.uiExpiryTimeoutMs || 2200), 'настройка на expiry');
              if (!expiryOk) {
                setSkipReason(S.lastSkipReason || 'Expiry');
                return false;
              }
              logConsoleLine(`💥 СДЕЛКА | ${String(expiry || signal.expiry || '1m').toLowerCase()} | ${signal.direction.toUpperCase()} | $${(amountCents / 100).toFixed(2)}`);
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
                resultBeforeCents,
                balanceEligible,
                stakeCents: amountCents,
                source: isKillerMode() ? 'killer' : 'signal',
                strategyKey: signal.strategyKey || null,
                outcomeChecked: false,
                balanceCheckAttempts: 0,
                nextBalanceCheckAt: 0,
                historyCheckAttempts: 0,
                nextHistoryCheckAt: 0,
                payoutPercent,
                dynamicMode: getDynamicMode(),
                dynamicSimWinrate: Number(dynamicPlanUsed?.best?.stats?.winrate || 0),
                dynamicSimSamples: Number(dynamicPlanUsed?.best?.stats?.samples || 0),
                stakeMultiplier,
                stakeReasonBg
              };
              S.activeTrades.push(trade);
              S.pendingTradeConfirmations.push({ trade, at: Date.now() });
              await delay(140);
            }
          }
        } else {
          logConsoleLine(`💥 СДЕЛКА | ${String(resolvedExpiry || signal.expiry || '1m').toLowerCase()} | ${String(signal.direction || '').toUpperCase()} | $${(amountCents / 100).toFixed(2)}`);
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
            resultBeforeCents,
            balanceEligible,
            stakeCents: amountCents * burstCount,
            source: isKillerMode() ? 'killer' : 'signal',
            strategyKey: signal.strategyKey || null,
            outcomeChecked: false,
            balanceCheckAttempts: 0,
            nextBalanceCheckAt: 0,
            historyCheckAttempts: 0,
            nextHistoryCheckAt: 0,
            payoutPercent,
            dynamicMode: getDynamicMode(),
            dynamicSimWinrate: Number(dynamicPlanUsed?.best?.stats?.winrate || 0),
            dynamicSimSamples: Number(dynamicPlanUsed?.best?.stats?.samples || 0),
            stakeMultiplier,
            stakeReasonBg
          };
          S.activeTrades.push(trade);
          S.pendingTradeConfirmations.push({ trade, at: Date.now() });
        }

        if (!isKillerMode()) {
          S.tradeLockUntil = Date.now() + 1000;
        }
        if (!isKillerMode()) {
          const intervalMin = getActiveTradeIntervalMin();
          S.nextTradeAllowedAt = Date.now() + intervalMin * 60 * 1000;
        }
        S.lastTradeTime = Date.now();
        S.tradeCount++;
        S.tradeTimestamps = S.tradeTimestamps || [];
        S.tradeTimestamps.push(Date.now());
        S.lastExecutedKey = execKey;
        S.finalizedTradeId = null;
        iaaLockDirection(signal.direction, 5);
        logConsoleLine(`🧠 DIR LOCK | ${String(signal.expiry || '1m').toLowerCase()} | ${String(signal.direction || '').toUpperCase()} | 5s`);

        // Update UI to show trade executed
        setUIState('EXECUTING', { cycleStep: S.cycleStep });

        S.engineState = 'CONFIRM';
        return true;
      } catch (error) {
        if (String(error?.message || '').startsWith('timeout:')) {
          logConsoleLine(`[EXEC] Твърд стоп: UI timeout (${String(error.message).replace('timeout:', '')})`);
          setSkipReason('UI timeout');
        }
        return false;
      } finally {
        S.engineState = 'IDLE';
        S.executing = false;
        if (S.tradeMutex?.id === mutexId) {
          S.tradeMutex = { active: false, id: null, startedAt: 0 };
        }
      }
    }


    
    /* -------------------- BALANCE-LEDGER CONFIRMATION (NO СДЕЛКИ TAB) -------------------- */

    function findBalanceEvent(afterTs, beforeTs, predicate) {
      const evs = Array.isArray(S.balanceEvents) ? S.balanceEvents : [];
      const a = Number.isFinite(afterTs) ? afterTs : 0;
      const b = Number.isFinite(beforeTs) ? beforeTs : 0;
      // Search oldest-to-newest so we get the earliest matching event.
      for (let i = 0; i < evs.length; i += 1) {
        const e = evs[i];
        if (!e || e.used) continue;
        if (e.t < a) continue;
        if (b && e.t > b) continue;
        if (predicate(e)) return e;
      }
      return null;
    }

    function markBalanceEventUsed(ev) {
      if (ev) ev.used = true;
    }

    function findBestBalanceEventForTrade(trade, afterTs, beforeTs, expectedEndTs) {
      const evs = Array.isArray(S.balanceEvents) ? S.balanceEvents : [];
      const amountCents = Number(trade?.totalAmountCents || trade?.amountCents || 0);
      const payoutPct = Number.isFinite(trade?.payoutPercent) ? trade.payoutPercent : Number(S.lastPayoutPercent || 0);
      const expectedProfit = payoutPct > 0 ? Math.round(amountCents * (payoutPct / 100)) : null;
      const expectedGross = expectedProfit != null ? amountCents + expectedProfit : null;
      const a = Number.isFinite(afterTs) ? afterTs : 0;
      const b = Number.isFinite(beforeTs) ? beforeTs : 0;
      const tRef = Number.isFinite(expectedEndTs) ? expectedEndTs : a;
      const evaluatePrecheckGate = evaluatePrecheckGateCore;

      let best = null;
      for (const e of evs) {
        if (!e || e.used) continue;
        if (e.t < a) continue;
        if (b && e.t > b) continue;
        const d = Number(e.deltaCents || 0);
        if (!(d > 0)) continue;
        if (amountCents > 0 && d > Math.round(amountCents * 3.5)) continue;
        let score = 0;
        if (Number.isFinite(expectedProfit)) score += Math.min(Math.abs(d - expectedProfit), 10000);
        if (Number.isFinite(expectedGross)) score = Math.min(score || 1e9, Math.abs(d - expectedGross));
        score += Math.min(Math.abs((e.t || 0) - tRef) / 50, 1000);
        if (!best || score < best.score) best = { e, score };
      }
      return best ? best.e : null;
    }

    function resolveLedgerProfitCents(trade, creditCents) {
      const amountCents = Number(trade?.totalAmountCents || trade?.amountCents || 0);
      const credit = Number(creditCents || 0);
      if (!Number.isFinite(amountCents) || amountCents <= 0 || !Number.isFinite(credit) || credit <= 0) {
        return { profitCents: credit - amountCents, mode: 'gross_fallback' };
      }

      const payoutPct = Number.isFinite(trade?.payoutPercent) ? trade.payoutPercent : Number(S.lastPayoutPercent || 0);
      const expectedProfit = payoutPct > 0 ? Math.round(amountCents * (payoutPct / 100)) : null;
      const expectedGross = expectedProfit != null ? amountCents + expectedProfit : null;

      const grossProfit = credit - amountCents; // credit contains stake + profit
      const profitOnly = credit;              // credit contains only net profit

      if (expectedProfit != null && expectedGross != null) {
        const distProfitOnly = Math.abs(credit - expectedProfit);
        const distGross = Math.abs(credit - expectedGross);
        if (distProfitOnly + 2 < distGross) return { profitCents: profitOnly, mode: 'profit_credit' };
        if (distGross + 2 < distProfitOnly) return { profitCents: grossProfit, mode: 'gross_credit' };
      }

      if (credit <= Math.round(amountCents * 1.2)) {
        return { profitCents: profitOnly, mode: 'profit_heuristic' };
      }
      const fallback = { profitCents: grossProfit, mode: 'gross_heuristic' };
      if (credit > 0 && fallback.profitCents < 0) {
        return { profitCents: profitOnly, mode: 'profit_safety_positive_credit' };
      }
      return fallback;
    }

    function confirmTradeByBalance(trade, clickedAt) {
      // Верификация на отворена сделка по баланс делта с толеранс за UI/latency jitter.
      return (async () => {
        const stakeCents = Math.max(0, trade.stakeCents || 0);

        if (!Number.isFinite(trade.balanceBefore)) trade.balanceBefore = readBalanceCents();
        const before = trade.balanceBefore;

        if (!Number.isFinite(before) || !Number.isFinite(stakeCents) || stakeCents <= 0) {
          trade.openConfirmed = false;
          trade.openConfirmedBy = 'NO_BASELINE_OR_STAKE';
          return false;
        }

        const tfLabel = String(trade?.expiry || trade?.tfLabel || '').toLowerCase();
        const baseWindowMs = Number(S.openConfirmWindowMs || 4200);
        const tfWindowMs = tfLabel.includes('5m') ? baseWindowMs + 1200 : tfLabel.includes('3m') ? baseWindowMs + 600 : baseWindowMs;
        const openConfirmWindowMs = Math.max(2200, Math.min(9000, tfWindowMs));
        const toleranceCents = Math.max(2, Math.round(stakeCents * 0.07));
        const minDebit = Math.max(0, stakeCents - toleranceCents);
        const deadline = Date.now() + openConfirmWindowMs;

        while (Date.now() <= deadline) {
          const now = readBalanceCents();
          const debit = Number.isFinite(now) ? (before - now) : NaN;
          if (Number.isFinite(debit) && debit >= minDebit) {
            trade.openConfirmed = true;
            trade.openConfirmedBy = 'BALANCE_DELTA_TOLERANT';
            trade.balanceAfterOpen = now;
            trade.openAt = clickedAt || Date.now();
            return true;
          }
          await sleep(130);
        }

        trade.openConfirmed = false;
        trade.openConfirmedBy = 'BALANCE_DELTA_TIMEOUT';
        return false;
      })();
    }
    async function processPendingTradeConfirmations() {
      const pending = Array.isArray(S.pendingTradeConfirmations) ? S.pendingTradeConfirmations : [];
      if (!pending.length) return;

      const remaining = [];
      for (const item of pending) {
        if (!item || !item.trade) continue;

        // Hard timeout so we never block the engine (строг баланс check)
        if ((Date.now() - Number(item.at || 0)) > 3200) {
          const tfLbl = String(item.trade?.tfLabel || item.trade?.expiry || '1m').toLowerCase();
          const dirLbl = String(item.trade?.direction || '-').toUpperCase();
          const ageSec = ((Date.now() - Number(item.at || Date.now())) / 1000).toFixed(1);
          logConsoleLine(`🔴🧭 ПРЕЧЕК СТОП | ${tfLbl} | ${dirLbl} | няма потвърждение | баланс не потвърди вход до ${ageSec}s`);
          // cleanup: remove any shadow trade state
          try { S.activeTrades = (S.activeTrades||[]).filter(t => t && t.id !== item.trade.id); } catch {}
          continue;
        }

        const ok = await confirmTradeByBalance(item.trade, item.at);
        if (ok) {
          logConsoleLine(`💥 СДЕЛКА | ${String(item.trade?.tfLabel || item.trade?.expiry || '1m').toLowerCase()} | ${String(item.trade?.direction || '').toUpperCase()} | $${((Number(item.trade?.amountCents||0))/100).toFixed(2)}`);
          continue;
        }
        remaining.push(item);
      }
      S.pendingTradeConfirmations = remaining;
    }

    /* ========================= FIXED: HISTORY-ONLY OUTCOME DETECTION ========================= */
    
    /* ========================= BALANCE-LEDGER OUTCOME DETECTION (NO СДЕЛКИ TAB) ========================= */
    async function finalizeActiveTrades() {
      if (!S.activeTrades || !S.activeTrades.length) return;

      const now = Date.now();
      const remaining = [];

      // Process in expectedEnd order (FIFO for settlement matching)
      const tradesSorted = [...S.activeTrades].sort((a, b) => (a.expectedEnd || 0) - (b.expectedEnd || 0));

      const settlementWindowMs = 120000; // safety window after expected end
      const earlySettleLeewayMs = 5000;

      for (const trade of tradesSorted) {
        if (!trade) continue;

        const expiryMs = trade.expiryMs || secsFromTF(trade.expiry) * 1000;
        const expectedEnd = trade.expectedEnd || (trade.startTime + expiryMs + C.SETTLEMENT_DELAY_MS);
        trade.expectedEnd = expectedEnd;

        // 1) Ensure open confirmation via balance debit (best effort)
        if (!trade.openConfirmed && !trade.confirmedAt) {
          confirmTradeByBalance(trade, trade.startTime);
        }

        // 2) Too early to settle
        if (now < expectedEnd - earlySettleLeewayMs) {
          remaining.push(trade);
          continue;
        }

        // 3) Try match a payout credit event within window
        const amountCents = Number(trade.totalAmountCents || trade.amountCents || 0);
        const settleStart = expectedEnd - earlySettleLeewayMs;
        const settleEnd = expectedEnd + settlementWindowMs;

        const ev = findBestBalanceEventForTrade(trade, settleStart, settleEnd, expectedEnd);

        if (ev) {
          markBalanceEventUsed(ev);

          let profitCents = null;
          let settleReason = null;

          // Ако сделката е "самостоятелна" (без други активни по време на клик) – най-точно е чистата разлика bal1-bal0.
          const canUseBalanceDelta = trade.balanceEligible && Number.isFinite(trade.balanceBefore) && tradesSorted.length <= 1;
          if (canUseBalanceDelta) {
            const nowBal = readBalanceCents();
            if (Number.isFinite(nowBal)) {
              profitCents = (nowBal - trade.balanceBefore);
              settleReason = 'BALANCE_DELTA';
            }
          }

          if (!Number.isFinite(profitCents)) {
            const credit = Number(ev.deltaCents || 0);
            const resolved = resolveLedgerProfitCents(trade, credit);
            profitCents = Number(resolved?.profitCents || 0);
            if (Number(credit) > 0 && profitCents < 0) {
              profitCents = Number(credit);
              settleReason = 'BALANCE_LEDGER:profit_safety_positive_credit';
            } else {
              settleReason = `BALANCE_LEDGER:${resolved?.mode || 'unknown'}`;
            }
          }

          const outcome = profitCents > 0 ? 'ПЕЧАЛБИ' : (profitCents < 0 ? 'ЗАГУБИ' : 'EVEN');
          finalizeTradeOutcome(trade, outcome, profitCents, ev.t, settleReason);

          continue;
        }

        const deltaOutcome = detectOutcomeByResultDelta(trade);
        if (deltaOutcome && now >= expectedEnd) {
          finalizeTradeOutcome(trade, deltaOutcome.outcome, deltaOutcome.profitCents, now, deltaOutcome.method);
          continue;
        }

        // 4) If window exceeded and no credit → ЗАГУБИ
        if (now > settleEnd) {
          const timeoutDelta = detectOutcomeByResultDelta(trade, 1);
          if (timeoutDelta && Number.isFinite(timeoutDelta.profitCents) && Math.abs(timeoutDelta.profitCents) >= 1) {
            finalizeTradeOutcome(trade, timeoutDelta.outcome, timeoutDelta.profitCents, now, 'TIMEOUT_DELTA_FALLBACK');
            continue;
          }
          logConsoleLine('⚠️ Неуспешно потвърждение на резултат (timeout) → маркирам като EVEN, за да избегна фалшива загуба.');
          finalizeTradeOutcome(trade, 'EVEN', 0, now, 'TIMEOUT_UNRESOLVED');

          continue;
        }

        // still waiting
        remaining.push(trade);
      }

      // Keep only unsettled trades
      S.activeTrades = remaining;
      renderPendingTrades();
    }

    /* ========================= FIXED: MARTINGALE WITH PROPER BALANCE TRACKING ========================= */

/* ========================= EXPIRY CALIBRATION (Shift+W) ========================= */
const IAA_EXP_CAL_KEY_OTC = 'IAA_EXPIRY_COORDS_V3';
const IAA_EXP_CAL_KEY_REAL = 'IAA_EXPIRY_COORDS_REAL_V1';
const IAA_EXP_CAL_DEFAULTS = {
  OPEN: { x: 1048, y: 169 },
  M1: { x: 783, y: 309 },
  M3: { x: 836, y: 304 },
  M5: { x: 904, y: 308 },
};
const IAA_EXP_CAL_REAL_DEFAULTS = {
  OPEN: { x: 1055, y: 165 },
  M1: { x: 789, y: 269 },
  M3: { x: 844, y: 270 },
  M5: { x: 903, y: 270 },
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
S.expiryCoordsOtc = S.expiryCoordsOtc || iaaLoadExpCal(IAA_EXP_CAL_KEY_OTC);
S.expiryCoordsReal = S.expiryCoordsReal || iaaLoadExpCal(IAA_EXP_CAL_KEY_REAL);
S._calTarget = S._calTarget || null;
S._calScope = S._calScope || 'OTC';
S._mouseXY = S._mouseXY || { x: 0, y: 0 };

// track mouse
document.addEventListener('mousemove', (e) => {
  S._mouseXY = { x: Math.round(e.clientX), y: Math.round(e.clientY) };
}, true);

// Shift+W = save coords for current target
function iaaOnCalibrationHotkey(e) {
  const key = String(e?.key || '').toLowerCase();
  const code = String(e?.code || '');
  const isShiftW = !!e?.shiftKey && (code === 'KeyW' || key === 'w' || key === 'ц');
  if (!isShiftW) return;

  if (!S._calTarget) {
    const inferred = iaaInferCalTargetFromUi();
    if (!inferred) {
      logConsoleLine('Калибрация: избери таргет от панела (OPEN / 1m / 3m / 5m / 15m).');
      return;
    }
  }

  if (typeof e.preventDefault === 'function') e.preventDefault();
  if (typeof e.stopPropagation === 'function') e.stopPropagation();

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
}
document.addEventListener('keydown', iaaOnCalibrationHotkey, true);
window.addEventListener('keydown', iaaOnCalibrationHotkey, true);

function iaaSetCalTarget(key, scope = 'OTC') {
  S._calTarget = String(key || '').trim().toUpperCase();
  S._calScope = scope.toUpperCase();
  logConsoleLine(`Калибрация [${S._calScope}]: ${S._calTarget}. Отиди с мишката върху елемента и натисни Shift+W.`);
}


function iaaInferCalTargetFromUi() {
  const targetMap = {
    'iaa-cal-open': ['OPEN', 'OTC'],
    'iaa-cal-m1': ['M1', 'OTC'],
    'iaa-cal-m3': ['M3', 'OTC'],
    'iaa-cal-m5': ['M5', 'OTC'],
    'iaa-cal-m15': ['M15', 'OTC'],
    'iaa-cal-real-open': ['OPEN', 'REAL'],
    'iaa-cal-real-m1': ['M1', 'REAL'],
    'iaa-cal-real-m3': ['M3', 'REAL'],
    'iaa-cal-real-m5': ['M5', 'REAL']
  };
  const activeId = String(document?.activeElement?.id || '');
  const hintedId = String(S._calHintBtnId || '');
  const fromActive = targetMap[activeId];
  const fromHint = targetMap[hintedId];
  const picked = fromActive || fromHint || null;
  if (!picked) return false;
  iaaSetCalTarget(picked[0], picked[1]);
  return true;
}


function iaaInitCalibrationDelegates() {
  if (S._calibrationDelegatesBound) return;
  S._calibrationDelegatesBound = true;
  const targetMap = {
    'iaa-cal-open': ['OPEN', 'OTC'],
    'iaa-cal-m1': ['M1', 'OTC'],
    'iaa-cal-m3': ['M3', 'OTC'],
    'iaa-cal-m5': ['M5', 'OTC'],
    'iaa-cal-m15': ['M15', 'OTC'],
    'iaa-cal-real-open': ['OPEN', 'REAL'],
    'iaa-cal-real-m1': ['M1', 'REAL'],
    'iaa-cal-real-m3': ['M3', 'REAL'],
    'iaa-cal-real-m5': ['M5', 'REAL']
  };
  document.addEventListener('mousedown', (event) => {
    const target = event?.target;
    const btn = target && target.closest ? target.closest('#iaa-cal-open,#iaa-cal-m1,#iaa-cal-m3,#iaa-cal-m5,#iaa-cal-m15,#iaa-cal-real-open,#iaa-cal-real-m1,#iaa-cal-real-m3,#iaa-cal-real-m5') : null;
    if (!btn) return;
    S._calHintBtnId = String(btn.id || '');
  }, true);
  document.addEventListener('click', (event) => {
    const target = event?.target;
    const btn = target && target.closest ? target.closest('#iaa-cal-open,#iaa-cal-m1,#iaa-cal-m3,#iaa-cal-m5,#iaa-cal-m15,#iaa-cal-real-open,#iaa-cal-real-m1,#iaa-cal-real-m3,#iaa-cal-real-m5') : null;
    if (!btn) return;
    const btnId = String(btn.id || '');
    const mapped = targetMap[btnId];
    if (!mapped) return;
    S._calHintBtnId = btnId;
    event.preventDefault();
    event.stopPropagation();
    iaaSetCalTarget(mapped[0], mapped[1]);
  }, true);
}

function iaaDumpCal() {
  const otc = S.expiryCoordsOtc || iaaLoadExpCal(IAA_EXP_CAL_KEY_OTC);
  const real = S.expiryCoordsReal || iaaLoadExpCal(IAA_EXP_CAL_KEY_REAL);
  logConsoleLine(`IAA_EXPIRY_COORDS_V3 (OTC) = ${JSON.stringify(otc || {})}`);
  logConsoleLine(`IAA_EXPIRY_COORDS_REAL_V1 = ${JSON.stringify(real || {})}`);
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
    M1: ['1m', '01:00', '1:00', '1 min', '1мин', '1 minute', '01 мин'],
    M3: ['3m', '03:00', '3:00', '3 min', '3мин', '3 minutes', '03 мин'],
    M5: ['5m', '05:00', '5:00', '5 min', '5мин', '5 minutes', '05 мин']
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
      if (n === '1m') return 'M1';
      if (n === '3m') return 'M3';
      if (n === '5m') return 'M5';
      return null;
    }

    function getExpiryScopeFromAsset(assetLabel) {
      return /OTC/i.test(assetLabel || '') ? 'OTC' : 'REAL';
    }

    async function iaaOpenExpiryMenu(scope = 'OTC') {
      const coords = iaaEnsureExpiryCoords(scope);
      const c = coords?.OPEN;
      if (!c || !Number.isFinite(c.x) || !Number.isFinite(c.y)) {
                S.lastSkipReason = 'ExpiryCoords';
        return false;
      }
      if (!clickAtCoordinates(c.x, c.y)) {
                S.lastSkipReason = 'ExpiryOpen';
        return false;
      }
      await delay(120);
      return true;
    }

    function parseExpiryTimeString(text) {
      const raw = String(text || '').trim();
      if (!raw) return null;
      const parts = raw.split(':').map((value) => Number(value));
      if (parts.some((value) => Number.isNaN(value))) return null;
      if (parts.length === 3) {
        const [hours, minutes, seconds] = parts;
        if (hours < 0 || minutes < 0 || seconds < 0) return null;
        return { hours, minutes, seconds };
      }
      if (parts.length === 2) {
        const [minutes, seconds] = parts;
        if (minutes < 0 || seconds < 0) return null;
        return { hours: 0, minutes, seconds };
      }
      if (parts.length === 1) {
        const [seconds] = parts;
        if (seconds < 0) return null;
        return { hours: 0, minutes: 0, seconds };
      }
      return null;
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
        60: '1m',
        180: '3m',
        300: '5m'
      };
      return map[seconds] || null;
    }


    function formatSecondsAsHms(seconds) {
      const n = Math.max(0, Math.round(Number(seconds) || 0));
      const h = Math.floor(n / 3600);
      const m = Math.floor((n % 3600) / 60);
      const sec = n % 60;
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    }

    function priceAtOrBefore(ts) {
      const arr = Array.isArray(S.priceHistory) ? S.priceHistory : [];
      if (!arr.length) return null;
      for (let i = arr.length - 1; i >= 0; i -= 1) {
        const p = arr[i];
        if (!p || !Number.isFinite(p.timestamp) || !Number.isFinite(p.price)) continue;
        if (p.timestamp <= ts) return p.price;
      }
      return null;
    }

    function simulateBinaryWinrate(direction, expirySec, lookbackSec) {
      const dir = normalizeSignalDirection(direction);
      if (!dir || !Number.isFinite(expirySec) || expirySec < 5) return { samples: 0, wins: 0, winrate: 0 };
      const now = Date.now();
      const stepSec = Math.max(1, Math.round(S.dynamicEntryStepSec || 5));
      const stepMs = stepSec * 1000;
      const start = now - Math.max(60, Math.round(lookbackSec || 600)) * 1000;
      const end = now - Math.round(expirySec) * 1000;
      let samples = 0;
      let wins = 0;

      for (let t = start; t <= end; t += stepMs) {
        const entryPrice = priceAtOrBefore(t);
        const exitPrice = priceAtOrBefore(t + expirySec * 1000);
        if (!Number.isFinite(entryPrice) || !Number.isFinite(exitPrice)) continue;
        samples += 1;
        if (dir === 'BUY' && exitPrice > entryPrice) wins += 1;
        if (dir === 'SELL' && exitPrice < entryPrice) wins += 1;
      }

      return { samples, wins, winrate: samples ? (wins / samples) : 0 };
    }

    function estimateDynamicVolatility(regimeState = '') {
      const rs = String(regimeState || '').toLowerCase();
      if (rs === 'volatility') return { level: 'high', score: 1 };
      if (rs === 'chop') return { level: 'low', score: 0 };
      const arr = Array.isArray(S.priceHistory) ? S.priceHistory : [];
      if (arr.length < 25) return { level: 'normal', score: 0.5 };
      const recent = arr.slice(-80).map(x => Number(x?.price || 0)).filter(Number.isFinite);
      if (recent.length < 25) return { level: 'normal', score: 0.5 };
      const rets = [];
      for (let i = 1; i < recent.length; i += 1) {
        const prev = recent[i - 1];
        const cur = recent[i];
        if (!prev || !cur) continue;
        rets.push((cur - prev) / prev);
      }
      if (!rets.length) return { level: 'normal', score: 0.5 };
      const mean = rets.reduce((a, b) => a + b, 0) / rets.length;
      const variance = rets.reduce((a, b) => a + ((b - mean) ** 2), 0) / rets.length;
      const std = Math.sqrt(Math.max(0, variance));
      if (std >= 0.0012) return { level: 'high', score: 1, std };
      if (std <= 0.00035) return { level: 'low', score: 0, std };
      return { level: 'normal', score: 0.5, std };
    }

    function getRemainingTimeInCandleSec(entryMeta = {}) {
      const t = Number.isFinite(entryMeta?.timeInCandle) ? Number(entryMeta.timeInCandle) : null;
      const w = Number.isFinite(entryMeta?.windowMs) ? (Number(entryMeta.windowMs) / 1000)
        : Number.isFinite(entryMeta?.entryWindowSec) ? Number(entryMeta.entryWindowSec)
          : null;
      if (t == null || w == null || w <= 0) return null;
      return Math.max(0, w - t);
    }

    function getDynamicPlanCacheKey(expiry, scope, signal = {}, regimeState = '', minSec = 0, maxSec = 0, expiryStep = 1, lookbackSec = 0) {
      return [
        signal.asset || S.lastAssetLabel || '—',
        signal.direction || '—',
        normalizeExpiry(expiry) || '—',
        scope || '—',
        regimeState || '—',
        minSec,
        maxSec,
        expiryStep,
        lookbackSec,
        Number(!!S.dynamicTwoStageEnabled),
        Math.max(1, Math.round(S.dynamicFineStepSec || 1)),
        Number(!!S.dynamicCandleSyncEnabled),
        Number(!!S.dynamicVolatilityAdaptive)
      ].join('|');
    }

    function getDynamicExpiryPlan(expiry, confidence, scope, options = {}) {
      const signal = options.signal || {};
      const entryMeta = signal.entryMeta || {};
      const regimeState = String(entryMeta?.regime?.state || entryMeta?.regime || '').toLowerCase();
      const originalMinSec = Math.max(5, Math.round(S.dynamicMinSec || 15));
      const originalMaxSec = Math.max(originalMinSec, Math.round(S.dynamicMaxSec || 300));
      const expiryStep = Math.max(1, Math.round(S.dynamicExpiryStepSec || 5));
      const fineStep = Math.max(1, Math.round(S.dynamicFineStepSec || 1));
      const minSamples = Math.max(5, Math.round(S.dynamicMinSamples || 40));
      const minWinrate = clamp01(S.dynamicMinWinrate ?? 0.55);
      const lookbackSec = Math.max(120, Math.round(S.dynamicLookbackSec || 600));
      const chopPenalty = Math.max(0, Number(S.dynamicChopPenalty || 0.03));
      const latePenalty = Math.max(0, Number(S.dynamicLatePenalty || 0.02));
      const candleSyncEnabled = !!S.dynamicCandleSyncEnabled;
      const twoStageEnabled = !!S.dynamicTwoStageEnabled;
      const timeInCandle = Number.isFinite(entryMeta?.timeInCandle) ? entryMeta.timeInCandle : null;
      const entryWindowSec = Number.isFinite(entryMeta?.entryWindowSec) ? entryMeta.entryWindowSec : null;
      const isLate = timeInCandle != null && entryWindowSec != null && timeInCandle > entryWindowSec;
      const remainingCandleSec = getRemainingTimeInCandleSec(entryMeta);

      const vol = estimateDynamicVolatility(regimeState);
      let minSec = originalMinSec;
      let maxSec = originalMaxSec;
      if (S.dynamicVolatilityAdaptive) {
        if (vol.level === 'high') {
          maxSec = Math.min(120, maxSec);
        } else if (vol.level === 'low') {
          minSec = Math.max(60, minSec);
        }
      }
      maxSec = Math.max(minSec, maxSec);

      S.dynamicSimCache = S.dynamicSimCache || {};
      const cacheKey = getDynamicPlanCacheKey(expiry, scope, signal, regimeState, minSec, maxSec, expiryStep, lookbackSec);
      const now = Date.now();
      if (S.dynamicSimCache[cacheKey] && now - (S.dynamicSimCache[cacheKey].at || 0) < 1000) {
        return S.dynamicSimCache[cacheKey].plan;
      }

      const evaluateCandidate = (sec) => {
        const stats = simulateBinaryWinrate(signal.direction, sec, lookbackSec);
        if (stats.samples < minSamples) return null;
        let penalties = 0;
        let bonus = 0;
        let reason = 'База';
        if (regimeState === 'chop' || regimeState === 'volatility') penalties += chopPenalty;
        if (sec < 30 && regimeState !== 'trend') penalties += 0.02;
        if (isLate) penalties += latePenalty;
        if (candleSyncEnabled && Number.isFinite(remainingCandleSec)) {
          const diff = Math.abs((sec % 60) - (remainingCandleSec % 60));
          if (diff < 3) {
            bonus += 0.05;
            reason = 'Candle Sync';
          } else if (diff > 10) {
            penalties += 0.02;
            reason = 'Mid Candle';
          }
        }
        const totalScore = stats.winrate - penalties + bonus;
        return {
          seconds: sec,
          stats,
          breakdown: {
            total: totalScore,
            winrate: stats.winrate,
            penaltyChop: (regimeState === 'chop' || regimeState === 'volatility') ? chopPenalty : 0,
            penaltyLate: isLate ? latePenalty : 0,
            bonusCandleSync: bonus,
            reason
          }
        };
      };

      const scored = [];
      const pushUnique = (row) => {
        if (!row) return;
        if (scored.some(x => x.seconds === row.seconds)) return;
        scored.push(row);
      };

      if (twoStageEnabled) {
        const rough = [];
        for (let sec = minSec; sec <= maxSec; sec += expiryStep) {
          const row = evaluateCandidate(sec);
          if (row) rough.push(row);
        }
        rough.sort((a, b) => b.breakdown.total - a.breakdown.total);
        for (const r of rough) pushUnique(r);
        const bestRough = rough[0] || null;
        if (bestRough) {
          const from = Math.max(minSec, Math.round(bestRough.seconds - 30));
          const to = Math.min(maxSec, Math.round(bestRough.seconds + 30));
          for (let sec = from; sec <= to; sec += fineStep) {
            pushUnique(evaluateCandidate(sec));
          }
        }
      } else {
        for (let sec = minSec; sec <= maxSec; sec += expiryStep) {
          pushUnique(evaluateCandidate(sec));
        }
      }

      scored.sort((a, b) => b.breakdown.total - a.breakdown.total);
      const passMinWinrate = scored.filter(x => (x?.stats?.winrate || 0) >= minWinrate);
      let best = passMinWinrate[0] || null;
      const mode = getDynamicMode();

      if (!best) {
        if (S.dynamicAllowNoTrade) {
          const plan = { expiries: [], seconds: [], best: null, scored, noTrade: true };
          S.dynamicSimCache[cacheKey] = { at: now, plan };
          return plan;
        }
        if (mode === 'hybrid') {
          const fixedSec = secsFromTF(expiry);
          const label = scope === 'REAL' ? expiryLabelFromSeconds(fixedSec) : null;
          const plan = { expiries: label ? [label] : [], seconds: scope === 'OTC' ? [fixedSec] : [], best: null, scored, fallbackFixed: true };
          S.dynamicSimCache[cacheKey] = { at: now, plan };
          return plan;
        }
        best = scored[0] || null;
      }

      if (!best) {
        const plan = { expiries: [], seconds: [], best: null, scored, noTrade: true };
        S.dynamicSimCache[cacheKey] = { at: now, plan };
        return plan;
      }

      const chosenSec = Math.round(best.seconds);
      const plan = scope === 'REAL'
        ? { expiries: expiryLabelFromSeconds(chosenSec) ? [expiryLabelFromSeconds(chosenSec)] : [], seconds: [], best, scored, volatility: vol.level }
        : { expiries: [], seconds: [chosenSec], best, scored, volatility: vol.level };
      S.dynamicSimCache[cacheKey] = { at: now, plan };
      return plan;
    }

    function getCachedDynamicPlan(expiry, confidence, scope, options = {}) {
      const signal = options.signal || {};
      if (S.dynamicPreCalcEnabled && S.cachedDynamicPlan && (Date.now() - (S.cachedDynamicPlanAt || 0) <= 5000)) {
        return S.cachedDynamicPlan;
      }
      const plan = getDynamicExpiryPlan(expiry, confidence, scope, options);
      if (S.dynamicPreCalcEnabled) {
        S.cachedDynamicPlan = plan;
        S.cachedDynamicPlanAt = Date.now();
      }
      return plan;
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
      const requestedExpiry = expiry;
      let norm = normalizeExpiry(expiry);
      if (!norm) {
        norm = normalizeExpiry(S.expirySetting) || '1m';
      }
      const assetLabel = getCurrentAssetLabel();
      const scope = getExpiryScopeFromAsset(assetLabel);
      const targetSeconds = secsFromTF(norm);
      const failStatus = (seenSeconds) => {
        const seenLabel = expiryLabelFromSeconds(Number(seenSeconds)) || formatSecondsAsHms(seenSeconds);
        const wantedLabel = expiryLabelFromSeconds(targetSeconds) || norm;
        setStatusOverlay(`❌ Неуспешно задаване на време (${wantedLabel}, налично ${seenLabel || '—'})`, '', false);
        logConsoleLine(`🔴🧭 ПРЕЧЕК СТОП | ${String(norm || '1m').toLowerCase()} | ${String(S.analysisDirection || '-').toUpperCase()} | expiry_fail | wanted=${wantedLabel} seen=${seenLabel || '—'}`);
      };

      S._expTryTs = S._expTryTs || 0;
      if (Date.now() - S._expTryTs < 400) { S.lastSkipReason = 'ExpiryOpen'; return false; }
      S._expTryTs = Date.now();

      if (S.lastPlatformExpiry === norm && S.lastPlatformExpiryTS && (Date.now() - S.lastPlatformExpiryTS) < 2500) {
        return true;
      }

      const currentSeconds = readDynamicExpirySeconds();
      if (Number.isFinite(currentSeconds) && Number.isFinite(targetSeconds) && Math.round(currentSeconds) === Math.round(targetSeconds)) {
        S.lastPlatformExpiry = norm;
        S.lastPlatformExpiryTS = Date.now();
        S.lastSkipReason = null;
        return true;
      }

      const coords = iaaEnsureExpiryCoords(scope);
      const key = iaaExpKeyFromNorm(norm);
      const btn = key ? coords?.[key] : null;

      const opened = await iaaOpenExpiryMenu(scope);
      if (!opened) return false;

      if (key && (!btn || !Number.isFinite(btn.x) || !Number.isFinite(btn.y))) {
        S.lastSkipReason = 'ExpiryCoords';
        return false;
      }

      if (key) {
        if (!clickAtCoordinates(btn.x, btn.y)) {
          S.lastSkipReason = 'ExpiryPreset';
          return false;
        }
        await delay(85);

        const afterPresetSeconds = readDynamicExpirySeconds();
        if (Number.isFinite(afterPresetSeconds) && Number.isFinite(targetSeconds) && Math.round(afterPresetSeconds) === Math.round(targetSeconds)) {
          S.lastPlatformExpiry = norm;
          S.lastPlatformExpiryTS = Date.now();
          S.lastSkipReason = null;
          return true;
        }
      }

      const appliedFallback = await setDynamicExpiryTime(targetSeconds);
      if (!appliedFallback) {
        failStatus(readDynamicExpirySeconds());
        S.lastSkipReason = 'ExpiryFallback';
        return false;
      }
      await delay(85);
      const afterFallbackSeconds = readDynamicExpirySeconds();
      if (!Number.isFinite(afterFallbackSeconds) || Math.round(afterFallbackSeconds) !== Math.round(targetSeconds)) {
        failStatus(afterFallbackSeconds);
        S.lastSkipReason = 'ExpiryFallback';
        return false;
      }

      S.lastPlatformExpiry = norm;
      S.lastPlatformExpiryTS = Date.now();
      S.lastSkipReason = null;
      if (!normalizeExpiry(requestedExpiry)) {
        logConsoleLine(`🔴🧭 ПРЕЧЕК СТОП | ${String(norm).toLowerCase()} | ${String(S.analysisDirection || '-').toUpperCase()} | expiry_norm_fallback | raw=${String(requestedExpiry || '∅')}`);
      }
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
        rawText: baseSig.rawText || '[internal-reentry]'
      };
    }

    function calculateTradeAmount(baseAmountCents){ return baseAmountCents; }


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

    /* ========================= KILLER ANALYSIS HELPERS ========================= */
    const KILLER_TF_MS = {
      '1m': 60000,
      '3m': 180000,
      '5m': 300000,
      '15m': 900000
    };

    function getKillerTimeframes() {
      const enabled = Object.keys(KILLER_TF_MS).filter(tf => S.killerEnabledTimeframes[tf]);
      if (!enabled.length) {
        return Object.keys(KILLER_TF_MS);
      }
      return enabled;
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

    /* ========================= ENGINE GUARD SYSTEM ========================= */
    function iaaLockDirection(dir, sec = 5) {
      const d = String(dir || '').toUpperCase();
      if (!d) return;
      S._dirLock = S._dirLock || { dir: null, until: 0 };
      S._dirLock.dir = d;
      S._dirLock.until = Date.now() + Math.max(1, Number(sec || 5)) * 1000;
    }

    function iaaDirectionBlocked(dir) {
      const d = String(dir || '').toUpperCase();
      if (!d) return false;
      const lock = S._dirLock || { dir: null, until: 0 };
      if (!lock.dir) return false;
      if (Date.now() > Number(lock.until || 0)) {
        S._dirLock = { dir: null, until: 0 };
        return false;
      }
      return lock.dir !== d;
    }

    function impulseExtensionFilter(ctx) {
      if (!S.engineGuardImpulseEnabled) return true;
      const candle = ctx?.candle;
      const price = Number(ctx?.price);
      if (!candle || !Number.isFinite(candle.open) || !Number.isFinite(price)) return true;
      const range = Math.abs(Number(candle.high || 0) - Number(candle.low || 0));
      if (range < 0.00010) return true;
      const move = Math.abs(price - Number(candle.open));
      const ratio = move / range;
      const impulseLimit = clamp(Number(S.engineGuardImpulse ?? 0.70), 0.10, 1.00);
      if (ratio > impulseLimit) {
        ctx.rejectReason = 'IMPULSE_EXTENSION';
        ctx.rejectDetails = `ratio=${ratio.toFixed(2)} > ${impulseLimit.toFixed(2)}`;
        return false;
      }
      return true;
    }

    function microTrendStability(ctx) {
      if (!S.engineGuardNoiseEnabled) return true;
      const ticks = Array.isArray(ctx?.lastTicks) ? ctx.lastTicks.filter(Number.isFinite) : [];
      if (ticks.length < 6) return true;
      let up = 0, down = 0;
      for (let i = 1; i < ticks.length; i++) {
        if (ticks[i] > ticks[i - 1]) up += 1;
        if (ticks[i] < ticks[i - 1]) down += 1;
      }
      const dominant = Math.max(up, down);
      const ratio = dominant / Math.max(1, (ticks.length - 1));
      const noiseLimit = clamp(Number(S.engineGuardNoise ?? 0.55), 0.10, 1.00);
      if (ratio < noiseLimit) {
        ctx.rejectReason = 'MICRO_NOISE';
        ctx.rejectDetails = `stability=${ratio.toFixed(2)} < ${noiseLimit.toFixed(2)}`;
        return false;
      }
      return true;
    }

    function iaaEngineGuard(ctx) {
      if (!ctx || !S.engineGuardEnabled) return true;
      if (!impulseExtensionFilter(ctx)) return false;
      if (!microTrendStability(ctx)) return false;
      return true;
    }

    function getCandleStart(windowMs) {
      return Math.floor(Date.now() / windowMs) * windowMs;
    }

    function calcKillerVwap(windowMs) {
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

    

    function clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
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
      const historyWindowMs = Math.max(60000, (S.killerWarmupMin || 10) * 60 * 1000);
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

    function calcAtr(windowMs, period = 14) {
      const p = Math.max(3, Math.min(50, Math.round(period)));
      let prevClose = null;
      const tr = [];
      for (let i = p; i >= 0; i -= 1) {
        const c = getCandleAt(Date.now() - i * windowMs, windowMs);
        if (!c) continue;
        if (prevClose == null) {
          prevClose = c.close;
          continue;
        }
        const highLow = Math.abs(c.high - c.low);
        const highPrev = Math.abs(c.high - prevClose);
        const lowPrev = Math.abs(c.low - prevClose);
        tr.push(Math.max(highLow, highPrev, lowPrev));
        prevClose = c.close;
      }
      if (!tr.length) return null;
      return tr.reduce((a, b) => a + b, 0) / tr.length;
    }

    function updateSpikeProtectionState() {
      if (!S.spikeProtectionEnabled) {
        S.blockBuy = false;
        S.blockSell = false;
        return;
      }
      const arr = Array.isArray(S.priceHistory) ? S.priceHistory : [];
      if (arr.length < 2) return;
      const now = Date.now();
      const latest = arr[arr.length - 1];
      let old = null;
      for (let i = arr.length - 2; i >= 0; i -= 1) {
        if (now - Number(arr[i]?.timestamp || 0) >= 5000) { old = arr[i]; break; }
      }
      if (!old || !Number.isFinite(latest?.price) || !Number.isFinite(old?.price)) return;
      const priceDelta = latest.price - old.price;
      const absDelta = Math.abs(priceDelta);
      const threshold = Math.max(0.00001, Number(S.spikeThresholdAbs || 0.00035));
      if (absDelta <= threshold) {
        S.blockBuy = false;
        S.blockSell = false;
        return;
      }
      S.blockBuy = priceDelta < 0;
      S.blockSell = priceDelta > 0;
      const key = `spike:${Math.round(priceDelta * 1e6)}`;
      if (logSpamControlled(key, `${priceDelta.toFixed(6)}`, 3000)) {
        logConsoleLine('⚠️ Висока волатилност! Режим: Trend-Follow Only.');
      }
    }

    function getSupportResistance(windowMs, lookback = 20) {
      const bars = Math.max(5, Math.min(120, Math.round(lookback)));
      let support = Number.POSITIVE_INFINITY;
      let resistance = Number.NEGATIVE_INFINITY;
      for (let i = 1; i <= bars; i += 1) {
        const c = getCandleAt(Date.now() - i * windowMs, windowMs);
        if (!c) continue;
        support = Math.min(support, Number(c.low));
        resistance = Math.max(resistance, Number(c.high));
      }
      if (!Number.isFinite(support) || !Number.isFinite(resistance) || resistance <= support) return null;
      return { support, resistance };
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
      if (S.biasTimeframes?.['1m']) weights.push(calcTrendDirection(KILLER_TF_MS['1m']));
      if (S.biasTimeframes?.['3m']) weights.push(calcTrendDirection(KILLER_TF_MS['3m']));
      if (S.biasTimeframes?.['5m']) weights.push(calcTrendDirection(KILLER_TF_MS['5m']));
if (!weights.length) return 0;
      const score = weights.reduce((sum, val) => sum + val, 0);
      if (score > 0) return 1;
      if (score < 0) return -1;
      return 0;
    }

    function getConfirmationSummary(tfKey, direction) {
      const windowMs = KILLER_TF_MS[tfKey];
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


    function calcAdxProxy(regime, decision) {
      const trendScore = clamp01(regime?.trendScore ?? 0);
      const vol = clamp01(regime?.volatility ?? 0);
      const conf = clamp01(decision?.confidence ?? 0);
      return Math.round(Math.max(8, Math.min(45, 8 + trendScore * 24 + conf * 10 - vol * 4)));
    }

    function getKillerDominanceThreshold(adxValue) {
      const base = Math.max(50, Math.min(90, Math.round(S.killerDominanceThreshold ?? 68)));
      if (!S.killerAdxDynamicEnabled) return base;
      if (adxValue < 18) return Math.min(90, base + 8);
      if (adxValue > 25) return Math.max(50, base - 6);
      return base;
    }

    function getBiasSnapshot(ctx = {}) {
      const direction = ctx.biasDirection || null;
      const strength = Number(ctx.biasStrength || 0);
      const strongNeed = Math.max(0.20, Math.min(0.80, Number(S.biasStrongThreshold || 0.45)));
      const quality = clamp01(Math.abs(strength) / Math.max(strongNeed, 1e-6));
      return {
        direction,
        strength,
        quality,
        isStrong: Math.abs(strength) >= strongNeed
      };
    }

    function computeSignalStability(history = [], maxGapMs = 3500) {
      const arr = Array.isArray(history) ? history.slice(-2) : [];
      if (arr.length < 2) return '1/2';
      const a = arr[0] || {};
      const b = arr[1] || {};
      const dt = Number(b.t || 0) - Number(a.t || 0);
      if (Number.isFinite(dt) && dt > Math.max(1000, Math.min(8000, Number(maxGapMs || 3500)))) return '1/2';
      if (a.dir && b.dir && a.dir === b.dir) return '2/2';
      if (a.dir && b.dir && a.dir !== b.dir) return '0/2';
      return '1/2';
    }

    function getKillerSupportingBonus(ctx = {}) {
      if (!S.supportingFiltersEnabled) return { bonus: 0, details: [] };
      const details = [];
      let bonus = 0;
      const decision = ctx.decision || {};
      const regime = ctx.regime || {};
      const dir = decision.direction || null;
      const strategyKey = String(decision.strategyKey || '');
      const mode = String(regime.state || '').toLowerCase();
      const trendFit = strategyKey.includes('trend') || strategyKey.includes('ema');
      const rangeFit = strategyKey.includes('candlestick') || strategyKey.includes('pullback');
      const marketModeMatch = (mode === 'trend' && trendFit) || (mode === 'range' && rangeFit) || (mode === 'chop' && strategyKey.includes('microtrend'));
      if (marketModeMatch) { bonus += 0.5; details.push('MODE +0.5'); }

      const vol = Number.isFinite(decision.rangePct) ? decision.rangePct : Number(regime.rangePct || 0);
      const volOk = vol >= 0.0015 && vol <= 0.02;
      if (volOk) { bonus += 0.5; details.push('VOL +0.5'); }

      const tfs = ['1m','3m','5m'];
      let aligned = 0;
      for (const tfKey of tfs) {
        const tr = calcTrendDirection(KILLER_TF_MS[tfKey]);
        const tfDir = tr > 0 ? 'BUY' : tr < 0 ? 'SELL' : null;
        if (tfDir && dir && tfDir === dir) aligned += 1;
      }
      if (aligned >= 2) { bonus += 0.5; details.push('MTF +0.5'); }
      return { bonus, details };
    }

    function evaluateStrictDecision(tf, decision, regime) {
      if (!decision || !decision.direction) return { pass: false, reason: 'Veto: No decision' };
      const dirSign = decision.direction === 'BUY' ? 1 : -1;
      const windowMs = KILLER_TF_MS[tf] || KILLER_TF_MS['1m'];

      const h3 = calcTrendDirection(KILLER_TF_MS['3m'], 3);
      const h5 = calcTrendDirection(KILLER_TF_MS['5m'], 3);
      if (h3 !== 0 && h5 !== 0 && h3 !== h5) {
        return { pass: false, reason: 'Veto: Trend Conflict (3m/5m)' };
      }
      const htfTrend = h5 !== 0 ? h5 : h3;
      const trendAligned = htfTrend === 0 || htfTrend === dirSign;
      if (!trendAligned) {
        return { pass: false, reason: 'Veto: Trend Mismatch' };
      }

      const prices = getPricesForWindow(windowMs, 14);
      const rsiPeriod = Math.max(6, Math.min(20, Math.round(Number(S.killerRsiWindow || 10))));
      const rsi = calcRsi(prices, rsiPeriod);
      if (!Number.isFinite(rsi)) {
        return { pass: false, reason: 'Veto: RSI N/A', rsi: null };
      }
      const buyMin = Math.max(5, Math.min(50, Number(S.killerRsiOversold || 25)));
      const sellMax = Math.max(50, Math.min(95, Number(S.killerRsiOverbought || 75)));
      const momentumPass = decision.direction === 'BUY' ? rsi >= buyMin : rsi <= sellMax;
      if (!momentumPass) {
        return { pass: false, reason: 'Veto: Weak Momentum', rsi, buyMin, sellMax };
      }

      if (S.filterDojiEnabled) {
        const candle = getCandleAt(Date.now(), windowMs);
        if (candle && Number.isFinite(candle.open) && Number.isFinite(candle.close) && Number.isFinite(candle.high) && Number.isFinite(candle.low)) {
          const body = Math.abs(candle.close - candle.open);
          const range = Math.max(1e-9, Math.abs(candle.high - candle.low));
          const threshold = Math.max(0.01, Math.min(0.5, Number(S.dojiSensitivity || 0.15)));
          const ratio = body / range;
          const sensitivityPct = Math.round(threshold * 100);
          const isDoji = Math.abs(candle.close - candle.open) < range * Math.max(0.01, Math.min(0.5, Number(S.dojiSensitivity || 0.15)));
          if (isDoji) {
            const details = `body=${body.toFixed(6)} | range=${range.toFixed(6)} | ratio=${ratio.toFixed(2)} | threshold=${threshold.toFixed(2)} | sensitivity=${sensitivityPct}%`;
            logConsoleLine(`⚠️ DOJI BLOCKED → ratio ${ratio.toFixed(2)} / ${threshold.toFixed(2)} | sens ${sensitivityPct}% | body ${body.toFixed(6)} | range ${range.toFixed(6)}`);
            return {
              pass: false,
              reason: 'Doji detected',
              details,
              doji: {
                body: Number(body),
                range: Number(range),
                ratio: Number(ratio),
                threshold: Number(threshold),
                sensitivityPct: Number(sensitivityPct)
              }
            };
          }
        }
      }

      if (S.filterSrEnabled) {
        const sr = getSupportResistance(windowMs, Number(S.srLookback || 20));
        const price = Number(S.currentAssetPrice);
        if (sr && Number.isFinite(price) && Number.isFinite(sr.support) && Number.isFinite(sr.resistance)) {
          const range = sr.resistance - sr.support;
          if (range > 0) {
            if (decision.direction === 'BUY' && price > sr.support + 0.2 * range) {
              return { pass: false, reason: 'S/R bounce blocked' };
            }
            if (decision.direction === 'SELL' && price < sr.resistance - 0.2 * range) {
              return { pass: false, reason: 'S/R bounce blocked' };
            }
          }
        }
      }

      const atr = calcAtr(KILLER_TF_MS['1m'], 14);
      const nowPx = Number(S.currentAssetPrice);
      const refPx = Number(decision.priceAtSignal);
      if (S.driftProtectionEnabled && Number.isFinite(atr) && atr > 0 && Number.isFinite(nowPx) && Number.isFinite(refPx)) {
        const drift = Math.abs(nowPx - refPx);
        if (drift > atr * 0.35) {
          return { pass: false, reason: 'Drift protection triggered', drift, atr };
        }
      }

      return {
        pass: true,
        rsi,
        buyMin,
        sellMax,
        htfTrend,
        trendAligned
      };
    }

    function computeKillerSnapshot(tf, decision, regime, confirmation, strategyDecisions = []) {
      if (!decision || !decision.direction) return null;
      const dir = decision.direction;
      const tfMs = KILLER_TF_MS[tf] || KILLER_TF_MS['1m'];
      const adx = calcAdxProxy(regime, decision);
      const trendDir = decision.trendDir || calcTrendDirection(tfMs);
      const strict = evaluateStrictDecision(tf, decision, regime);
      const threshold = getScoreThresholdPoints();
      const maxPoints = 11;

      const strategyVotes = { buy: 0, sell: 0 };
      for (const st of strategyDecisions || []) {
        if (!st?.direction || !isStrategyEnabled(st.strategyKey)) continue;
        if (st.direction === 'BUY') strategyVotes.buy += 1;
        if (st.direction === 'SELL') strategyVotes.sell += 1;
      }
      const strategyAgreement = dir === 'BUY' ? strategyVotes.buy : strategyVotes.sell;

      const buyVotes = (trendDir > 0 ? 1 : 0) + (strategyVotes.buy || 0);
      const sellVotes = (trendDir < 0 ? 1 : 0) + (strategyVotes.sell || 0);
      const totalVotes = Math.max(1, buyVotes + sellVotes);
      const longPct = Math.round((buyVotes / totalVotes) * 100);
      const shortPct = Math.round((sellVotes / totalVotes) * 100);
      const dominance = dir === 'BUY' ? longPct : shortPct;
      const dominanceThreshold = getKillerDominanceThreshold(adx);
      const passDominance = dominance >= dominanceThreshold;

      const dirSign = dir === 'BUY' ? 1 : -1;
      const biasDir = Number(decision?.biasDir || 0);
      const confirmationMatched = Number(confirmation?.matched ?? decision?.confirmation?.matched ?? 0);
      const confidence = Number(decision?.confidence || 0);

      const strategyPoints = Math.max(0, Math.min(2, Number(strategyAgreement || 0)));
      const filterChecks = [
        { key: 'STRICT', ok: !!strict.pass, points: strict.pass ? 1 : 0 },
        { key: 'DOM', ok: passDominance, points: passDominance ? 1 : 0 },
        { key: 'CONF', ok: confirmationMatched >= 1, points: confirmationMatched >= 1 ? 1 : 0 },
        { key: 'TREND', ok: trendDir === 0 || Math.sign(trendDir) === dirSign, points: (trendDir === 0 || Math.sign(trendDir) === dirSign) ? 1 : 0 },
        { key: 'BIAS', ok: biasDir === 0 || Math.sign(biasDir) === dirSign, points: (biasDir === 0 || Math.sign(biasDir) === dirSign) ? 1 : 0 },
        { key: 'REGIME', ok: String(regime?.state || '').toLowerCase() !== 'chop', points: String(regime?.state || '').toLowerCase() !== 'chop' ? 1 : 0 },
        { key: 'CONF_LVL', ok: confidence >= 0.55, points: confidence >= 0.55 ? 1 : 0 },
        { key: 'VOTES', ok: (strategyVotes.buy + strategyVotes.sell) >= 2, points: (strategyVotes.buy + strategyVotes.sell) >= 2 ? 1 : 0 },
        { key: 'DIR', ok: !!dir, points: dir ? 1 : 0 }
      ];

      const filterPoints = filterChecks.reduce((sum, c) => sum + Number(c.points || 0), 0);
      const totalPoints = strategyPoints + filterPoints;
      const confluence = Number(totalPoints.toFixed(1));
      const supportingBonus = 0;
      const effectivePoints = Number((confluence + supportingBonus).toFixed(1));
      const passConfluence = !!strict.pass && effectivePoints >= threshold;

      const snapshotCandle = getCandleAt(Date.now(), tfMs);
      const candleOpen = Number(snapshotCandle?.open);
      const candleClose = Number(snapshotCandle?.close);
      let candleAgainst = false;
      if (Number.isFinite(candleOpen) && Number.isFinite(candleClose) && candleOpen !== candleClose) {
        if (dir === 'BUY') candleAgainst = candleClose < candleOpen;
        if (dir === 'SELL') candleAgainst = candleClose > candleOpen;
      }

      const breakdown = [
        `STRATEGIES: ${strategyPoints.toFixed(1)}/2`,
        ...filterChecks.map((c) => `${c.key}: ${c.points ? '1' : '0'}/1`),
        `TOTAL: ${effectivePoints.toFixed(1)}/${maxPoints} | праг ${threshold}`
      ];

      return {
        tf,
        direction: dir,
        confluence,
        effectivePoints,
        supportingBonus,
        supportingDetails: [],
        minConfluence: threshold,
        threshold,
        maxPoints,
        longPct,
        shortPct,
        dominance,
        dominanceThreshold,
        adx,
        checks: [
          { key: 'STRATEGY', ok: strategyPoints >= 1, points: strategyPoints },
          ...filterChecks
        ],
        strategyVotes,
        strategyAgreement,
        stabilityState: strict.pass ? 'STRICT_PASS' : 'STRICT_FAIL',
        candleAgainst,
        passConfluence,
        passDominance,
        nearMiss: !!strict.pass && !passConfluence && effectivePoints >= Math.max(0, threshold - 1),
        confOkNear: confidence >= Math.max(0, (threshold - 1) / maxPoints),
        strictReason: strict.reason || '',
        strictPass: !!strict.pass,
        rsi: Number.isFinite(strict.rsi) ? Number(strict.rsi.toFixed(1)) : null,
        momentumWindow: Number.isFinite(strict.rsi) ? `${strict.buyMin}/${strict.sellMax}` : '—',
        breakdown
      };
    }

    function killerEdgeTriggered(tf, dir, isSignalValid) {
      if (!S.killerPerfectTimeEnabled) return true;
      S.killerEdgeState = S.killerEdgeState || {};
      const now = Date.now();
      const cooldownMs = Math.max(0, Math.min(30, Math.round(S.killerSignalCooldownSec ?? 5))) * 1000;
      const prev = S.killerEdgeState[tf] || { dir: null, valid: false, at: 0 };
      const changedToValid = isSignalValid && (!prev.valid || prev.dir !== dir);
      const allowedByCooldown = now - (prev.at || 0) >= cooldownMs;
      S.killerEdgeState[tf] = { dir, valid: !!isSignalValid, at: changedToValid ? now : (prev.at || 0) };
      return changedToValid && allowedByCooldown;
    }

    function getPtModeForRuntime(regimeState = '') {
      if (!S.killerPerfectTimeEnabled) return 'off';
      const mode = ['soft','hard','adaptive'].includes(String(S.killerPerfectTimeMode || 'hard')) ? String(S.killerPerfectTimeMode) : 'hard';
      if (mode !== 'adaptive') return mode;
      const rs = String(regimeState || '').toLowerCase();
      if (rs === 'chop' || rs === 'volatility') return 'hard';
      return 'soft';
    }

    function renderKillerHud() {
      const panel = $id('iaa-killer-panel');
      const body = $id('iaa-killer-content');
      if (!panel || !body) return;
      const show = !!S.killerHudEnabled;
      panel.style.display = show ? 'block' : 'none';
      if (!show) return;
      const snap = S.killerSnapshot || {};
      const sig = snap.signal || 'WAIT';
      const sigClass = sig === 'BUY' ? 'iaa-killer-buy' : sig === 'SELL' ? 'iaa-killer-sell' : 'iaa-killer-wait';
      body.innerHTML = `
        <div class="iaa-killer-row"><span class="iaa-killer-key">LONG</span><span class="iaa-killer-val">${Number.isFinite(snap.longPct) ? snap.longPct : 50}%</span></div>
        <div class="iaa-killer-row"><span class="iaa-killer-key">SHORT</span><span class="iaa-killer-val">${Number.isFinite(snap.shortPct) ? snap.shortPct : 50}%</span></div>
        <div class="iaa-killer-row"><span class="iaa-killer-key">CONF</span><span class="iaa-killer-val">${Number.isFinite(snap.effectivePoints) ? snap.effectivePoints : (snap.confluence || 0)}/${snap.maxPoints || 11} (мин ${snap.minConfluence || 8})</span></div>
        <div class="iaa-killer-row"><span class="iaa-killer-key">TRD</span><span class="iaa-killer-val">${snap.trd || '—'}</span></div>
        <div class="iaa-killer-row"><span class="iaa-killer-key">MACD</span><span class="iaa-killer-val">${snap.macd || '—'}</span></div>
        <div class="iaa-killer-row"><span class="iaa-killer-key">RSI</span><span class="iaa-killer-val">${snap.rsi || '—'}</span></div>
        <div class="iaa-killer-row"><span class="iaa-killer-key">STO</span><span class="iaa-killer-val">${snap.sto || '—'}</span></div>
        <div class="iaa-killer-row"><span class="iaa-killer-key">VOL</span><span class="iaa-killer-val">${snap.vol || '—'}</span></div>
        <div class="iaa-killer-row"><span class="iaa-killer-key">ADX</span><span class="iaa-killer-val">${Number.isFinite(snap.adx) ? snap.adx : '—'}</span></div>
        <div class="iaa-killer-row"><span class="iaa-killer-key">SIG</span><span class="iaa-killer-pill ${sigClass}">${sig === 'BUY' ? 'КУПУВАЙ' : sig === 'SELL' ? 'ПРОДАВАЙ' : 'ЧАКАЙ'}</span></div>
      `;
    }

    function getStrategyConfig(strategyKey) {
      const defaults = STRATEGY_DEFAULTS.configs[strategyKey] || { enabled: true, priority: 0.6, label: strategyKey };
      const stored = S.strategyConfigs?.[strategyKey] || {};
      return { ...defaults, ...stored };
    }

    function getStrategyDisplayLabel(strategyKey) {
      const base = getStrategyConfig(strategyKey).label;
      return base;
    }

    function isStrategyEnabled(strategyKey) {
      return getStrategyConfig(strategyKey).enabled !== false;
    }

    function getStrategyPriority(strategyKey) {
      const priority = getStrategyConfig(strategyKey).priority;
      return clamp01(Number.isFinite(priority) ? priority : 0.6);
    }

    function getStrategyPerformanceWeight(strategyKey) {
      return 1;
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
      const prices = getPricesForWindow(windowMs, Math.max(14, S.killerRsiWindow || 10));
      if (!prices.length) return decision;
      const rsi = calcRsi(prices, S.killerRsiWindow || 10);
      const emaFast = calcEma(prices, S.killerEmaFast || 4);
      const emaSlow = calcEma(prices, S.killerEmaSlow || 16);
      let boost = 0;
      if (decision.direction === 'BUY') {
        if (Number.isFinite(rsi) && rsi <= 35) boost += 0.03;
        if (emaFast != null && emaSlow != null && emaFast > emaSlow) boost += 0.03;
      } else if (decision.direction === 'SELL') {
        if (Number.isFinite(rsi) && rsi >= 65) boost += 0.03;
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

    function getCandleAtOffset(windowMs, offset = 0, options = {}) {
      const useClosed = !!options.closed;
      const anchor = useClosed ? getCandleStart(windowMs) : Date.now();
      const shift = useClosed ? Math.max(0, offset - 1) : offset;
      const endTs = anchor - shift * windowMs;
      return getCandleAt(endTs, windowMs);
    }

    function calcCandlestickDecision(windowMs) {
      const curr = getCandleAtOffset(windowMs, 0);
      const prev = getCandleAtOffset(windowMs, 1);
      if (!curr || !prev) return null;
      const prev2 = getCandleAtOffset(windowMs, 2);
      const trendDir = calcTrendDirection(windowMs);
      const currBody = Math.abs(curr.close - curr.open);
      const currRange = Math.max(curr.high - curr.low, 0);
      const prevBody = Math.abs(prev.close - prev.open);
      const currUpperWick = curr.high - Math.max(curr.open, curr.close);
      const currLowerWick = Math.min(curr.open, curr.close) - curr.low;
      const currBull = curr.close > curr.open;
      const prevBull = prev.close > prev.open;
      const patterns = [];
      const rangePct = curr.open ? currRange / curr.open : 0;
      const bodyRatio = currRange > 0 ? currBody / currRange : 1;

      // Noise reject: micro/noisy candles should not trigger pattern signals.
      if (currRange <= 0 || rangePct < 0.00016) return null;
      if (bodyRatio < 0.025 && (currUpperWick + currLowerWick) / Math.max(currRange, 1e-9) > 0.9) return null;

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

      const localLowRef = Math.min(prev.low, Number.isFinite(prev2?.low) ? prev2.low : prev.low);
      const localHighRef = Math.max(prev.high, Number.isFinite(prev2?.high) ? prev2.high : prev.high);
      const nearLocalLow = curr.low <= localLowRef + currRange * 0.2;
      const nearLocalHigh = curr.high >= localHighRef - currRange * 0.2;
      const sweepLowRejection = curr.low < prev.low && curr.close > prev.low;
      const sweepHighRejection = curr.high > prev.high && curr.close < prev.high;
      const lowerWickRatio = currRange > 0 ? currLowerWick / currRange : 0;
      const upperWickRatio = currRange > 0 ? currUpperWick / currRange : 0;
      const hammerBodyNearTop = Math.min(curr.open, curr.close) >= curr.low + currRange * 0.42;
      const starBodyNearBottom = Math.max(curr.open, curr.close) <= curr.low + currRange * 0.58;

      const isHammer = currLowerWick > currBody * 2.2
        && currUpperWick <= currBody * 0.45
        && lowerWickRatio >= 0.5
        && hammerBodyNearTop
        && (nearLocalLow || sweepLowRejection);
      if (isHammer) {
        const contextBoost = (nearLocalLow ? 0.04 : 0) + (sweepLowRejection ? 0.04 : 0);
        const conf = Math.min(0.85, (trendDir <= 0 ? 0.68 : 0.54) + contextBoost);
        patterns.push({ direction: 'BUY', confidence: conf });
      }

      const isShootingStar = currUpperWick > currBody * 2.2
        && currLowerWick <= currBody * 0.45
        && upperWickRatio >= 0.5
        && starBodyNearBottom
        && (nearLocalHigh || sweepHighRejection);
      if (isShootingStar) {
        const contextBoost = (nearLocalHigh ? 0.04 : 0) + (sweepHighRejection ? 0.04 : 0);
        const conf = Math.min(0.85, (trendDir >= 0 ? 0.68 : 0.54) + contextBoost);
        patterns.push({ direction: 'SELL', confidence: conf });
      }

      const isDoji = currRange > 0 && currBody / currRange <= 0.1;
      if (isDoji) {
        if (trendDir > 0) patterns.push({ direction: 'SELL', confidence: 0.5 });
        if (trendDir < 0) patterns.push({ direction: 'BUY', confidence: 0.5 });
      }

      if (!patterns.length) return null;
      const buyPatterns = patterns.filter((p) => p.direction === 'BUY');
      const sellPatterns = patterns.filter((p) => p.direction === 'SELL');
      if (buyPatterns.length && sellPatterns.length) {
        const buyBest = buyPatterns.reduce((best, p) => ((p.confidence || 0) > (best.confidence || 0) ? p : best), buyPatterns[0]);
        const sellBest = sellPatterns.reduce((best, p) => ((p.confidence || 0) > (best.confidence || 0) ? p : best), sellPatterns[0]);
        const buyConf = Number.isFinite(buyBest?.confidence) ? buyBest.confidence : 0;
        const sellConf = Number.isFinite(sellBest?.confidence) ? sellBest.confidence : 0;
        const confidenceGap = Math.abs(buyConf - sellConf);
        const maxConf = Math.max(buyConf, sellConf);
        const dominant = buyConf >= sellConf ? { ...buyBest } : { ...sellBest };
        const highlyAmbiguous = confidenceGap < 0.03 && maxConf < 0.62;
        if (highlyAmbiguous) return null;
        if (confidenceGap < 0.1) {
          dominant.confidence = Math.max(0, (Number(dominant.confidence) || 0) - 0.07);
        }
        patterns.length = 0;
        patterns.push(dominant);
      }
      const best = patterns.sort((a, b) => b.confidence - a.confidence)[0];
      return {
        strategyKey: 'candlestick',
        direction: best.direction,
        confidence: best.confidence,
        rangePct,
        trendDir,
        trendAligned: trendDir === 0 || (best.direction === 'BUY' ? trendDir >= 0 : trendDir <= 0),
        volumeOk: true
      };
    }

    function calcCandlestickPatternDecision(windowMs) {
      const base = calcCandlestickDecision(windowMs);
      if (!base || !base.direction) return null;
      const minConf = clamp01(Number.isFinite(S.candlestickPatternMinConfidence) ? S.candlestickPatternMinConfidence : 0.6);
      if (base.confidence < minConf) return null;
      return { ...base, strategyKey: 'candlestick_pattern' };
    }


    // AI Vision removed

    function calcRsiDivergenceDecision(windowMs) {
      const lookback = Math.max(6, Math.round(S.rsiDivergenceLookback || 14));
      const rsiWindow = Math.max(5, Math.round(S.rsiDivergenceRsiWindow || 14));
      const minDelta = Math.max(1, Math.round(S.rsiDivergenceMinDelta || 6));
      const prices = getPricesForWindow(windowMs * 2, Math.max(lookback * 2, rsiWindow + 2));
      if (prices.length < Math.max(lookback * 2, rsiWindow + 2)) return null;
      const mid = Math.floor(prices.length / 2);
      const first = prices.slice(0, mid);
      const second = prices.slice(mid);
      if (first.length < rsiWindow + 1 || second.length < rsiWindow + 1) return null;
      const rsiFirst = calcRsi(first, rsiWindow);
      const rsiSecond = calcRsi(second, rsiWindow);
      if (!Number.isFinite(rsiFirst) || !Number.isFinite(rsiSecond)) return null;
      const lowFirst = Math.min(...first);
      const lowSecond = Math.min(...second);
      const highFirst = Math.max(...first);
      const highSecond = Math.max(...second);
      const rsiDelta = rsiSecond - rsiFirst;
      const trendDir = calcTrendDirection(windowMs);
      const candle = getCandleAt(Date.now(), windowMs);
      const rangePct = candle?.open ? (candle.high - candle.low) / candle.open : 0;
      const minPriceDelta = 0.0003;

      if (lowSecond < lowFirst * (1 - minPriceDelta) && rsiDelta >= minDelta) {
        const confidence = clamp01(0.55 + Math.min(0.35, (rsiDelta / (minDelta * 2)) * 0.35));
        return {
          strategyKey: 'rsi_divergence',
          direction: 'BUY',
          confidence,
          rangePct,
          trendDir,
          trendAligned: trendDir === 0 || trendDir >= 0,
          volumeOk: true
        };
      }
      if (highSecond > highFirst * (1 + minPriceDelta) && rsiDelta <= -minDelta) {
        const confidence = clamp01(0.55 + Math.min(0.35, (Math.abs(rsiDelta) / (minDelta * 2)) * 0.35));
        return {
          strategyKey: 'rsi_divergence',
          direction: 'SELL',
          confidence,
          rangePct,
          trendDir,
          trendAligned: trendDir === 0 || trendDir <= 0,
          volumeOk: true
        };
      }
      return null;
    }

    function calcEmaRsiPullbackDecision(windowMs) {
      const rsiWindow = Math.max(5, Math.round(S.emaRsiWindow || 14));
      const emaFast = Math.max(2, Math.round(S.emaRsiFast || 8));
      const emaSlow = Math.max(emaFast + 1, Math.round(S.emaRsiSlow || 21));
      const prices = getPricesForWindow(windowMs, rsiWindow + 3);
      if (!prices.length) return null;
      const rsi = calcRsi(prices, rsiWindow);
      const emaFastVal = calcEma(prices, emaFast);
      const emaSlowVal = calcEma(prices, emaSlow);
      if (!Number.isFinite(rsi) || emaFastVal == null || emaSlowVal == null) return null;
      const oversold = Math.max(10, Math.min(50, Math.round(S.emaRsiOversold || 35)));
      const overbought = Math.max(50, Math.min(90, Math.round(S.emaRsiOverbought || 65)));
      const trendDir = calcTrendDirection(windowMs);
      const candle = getCandleAt(Date.now(), windowMs);
      const rangePct = candle?.open ? (candle.high - candle.low) / candle.open : 0;
      const last = prices[prices.length - 1];
      let signal = null;

      if (emaFastVal > emaSlowVal && rsi <= oversold) {
        const distPct = Math.abs(last - emaFastVal) / Math.max(last, 1e-8);
        const pullbackOk = distPct <= Math.max(0.001, rangePct * 0.9);
        if (pullbackOk) {
          const confidence = clamp01(0.55 + (oversold - rsi) / Math.max(oversold, 1) * 0.35);
          signal = {
            strategyKey: 'ema_rsi_pullback',
            setupType: 'true_pullback',
            direction: 'BUY',
            confidence,
            rangePct,
            trendDir,
            trendAligned: trendDir === 0 || trendDir >= 0,
            volumeOk: true
          };
        }
      }
      if (!signal && emaFastVal < emaSlowVal && rsi >= overbought) {
        const distPct = Math.abs(last - emaFastVal) / Math.max(last, 1e-8);
        const pullbackOk = distPct <= Math.max(0.001, rangePct * 0.9);
        if (pullbackOk) {
          const confidence = clamp01(0.55 + (rsi - overbought) / Math.max(100 - overbought, 1) * 0.35);
          signal = {
            strategyKey: 'ema_rsi_pullback',
            setupType: 'true_pullback',
            direction: 'SELL',
            confidence,
            rangePct,
            trendDir,
            trendAligned: trendDir === 0 || trendDir <= 0,
            volumeOk: true
          };
        }
      }
      const momentum = prices[prices.length - 1] - prices[Math.max(0, prices.length - 4)];
      if (!signal && emaFastVal > emaSlowVal && rsi >= 52 && momentum > 0) {
        const distPct = Math.abs(last - emaFastVal) / Math.max(last, 1e-8);
        const pullbackOk = distPct <= Math.max(0.0008, rangePct * 0.5);
        if (pullbackOk) {
          signal = {
            strategyKey: 'ema_rsi_pullback',
            setupType: 'continuation_variant',
            direction: 'BUY',
            confidence: clamp01(0.5 + (rsi - 50) / 100 + Math.min(0.15, Math.abs(momentum) / Math.max(prices[prices.length - 1], 1e-8) * 90)),
            rangePct,
            trendDir,
            trendAligned: trendDir === 0 || trendDir >= 0,
            volumeOk: true
          };
        }
      }
      if (!signal && emaFastVal < emaSlowVal && rsi <= 48 && momentum < 0) {
        const distPct = Math.abs(last - emaFastVal) / Math.max(last, 1e-8);
        const pullbackOk = distPct <= Math.max(0.0008, rangePct * 0.5);
        if (pullbackOk) {
          signal = {
            strategyKey: 'ema_rsi_pullback',
            setupType: 'continuation_variant',
            direction: 'SELL',
            confidence: clamp01(0.5 + (50 - rsi) / 100 + Math.min(0.15, Math.abs(momentum) / Math.max(prices[prices.length - 1], 1e-8) * 90)),
            rangePct,
            trendDir,
            trendAligned: trendDir === 0 || trendDir <= 0,
            volumeOk: true
          };
        }
      }
      if (!signal) return null;

      if (trendDir !== 0) {
        const signalSign = signal.direction === 'BUY' ? 1 : -1;
        if (signalSign !== trendDir) {
          signal.confidence = clamp01(signal.confidence - 0.04);
        }
      }

      return signal;
    }

    function calcStochDecision(windowMs) {
      const prices = getPricesForWindow(windowMs, (S.killerStochWindow || 10) + 2);
      if (!prices.length) return null;
      const stoch = calcStochastic(prices, S.killerStochWindow || 10);
      if (!Number.isFinite(stoch)) return null;
      const oversold = S.killerStochOversold ?? 25;
      const overbought = S.killerStochOverbought ?? 75;
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


    function countReadyBars(windowMs, maxBars = 80) {
      let ready = 0;
      // Count only CLOSED candles so readiness does not pass on a fresh partial candle.
      for (let i = 1; i <= maxBars; i += 1) {
        const candle = getCandleAtOffset(windowMs, i, { closed: true });
        if (!candle || !Number.isFinite(candle.open) || !Number.isFinite(candle.close)) break;
        ready += 1;
      }
      return ready;
    }

    function countReadyBarsSince(windowMs, sinceTs, maxBars = 120) {
      const since = Number.isFinite(sinceTs) ? sinceTs : 0;
      if (!since || !Number.isFinite(windowMs) || windowMs <= 0) return countReadyBars(windowMs, maxBars);
      let ready = 0;
      const now = Date.now();
      const lastClosedStart = Math.floor(now / windowMs) * windowMs - windowMs;
      for (let i = 0; i < maxBars; i += 1) {
        const candleStart = lastClosedStart - i * windowMs;
        if (candleStart < since) break;
        const candleEnd = candleStart + windowMs;
        const candle = getCandleAt(candleEnd, windowMs);
        if (!candle || !Number.isFinite(candle.open) || !Number.isFinite(candle.close)) break;
        ready += 1;
      }
      return ready;
    }

    function getPartnerTfReadiness() {
      const checks = [];
      const readinessSince = Number.isFinite(S.readinessStartedAt) && S.readinessStartedAt > 0
        ? S.readinessStartedAt
        : (Number.isFinite(S.botStartAt) ? S.botStartAt : 0);
      if (S.killerEnabledTimeframes?.['1m']) {
        const req1 = Math.max(1, Math.round(S.partnerReadyBars1m || 10));
        const bars1 = countReadyBarsSince(KILLER_TF_MS['1m'], readinessSince);
        checks.push(['1m', bars1, req1]);
      }
      if (S.killerEnabledTimeframes?.['3m']) {
        const req3 = Math.max(1, Math.round(S.partnerReadyBars3m || 6));
        const bars3 = countReadyBarsSince(KILLER_TF_MS['3m'], readinessSince);
        checks.push(['3m', bars3, req3]);
      }
      if (S.killerEnabledTimeframes?.['5m']) {
        const req5 = Math.max(1, Math.round(S.partnerReadyBars5m || 3));
        const bars5 = countReadyBarsSince(KILLER_TF_MS['5m'], readinessSince);
        checks.push(['5m', bars5, req5]);
      }
      if (S.killerEnabledTimeframes?.['15m']) {
        const req15 = Math.max(1, Math.round(S.partnerReadyBars15m || 2));
        const bars15 = countReadyBarsSince(KILLER_TF_MS['15m'], readinessSince);
        checks.push(['15m', bars15, req15]);
      }
      const details = {};
      checks.forEach(([tf, bars, required]) => { details[tf] = { bars, required, ready: bars >= required }; });
      const ok = checks.every(([, bars, required]) => bars >= required);
      return { ok, details };
    }

    function calcScalpMicrotrendDecision(windowMs) {
      const prices = getPricesForWindow(windowMs, 24);
      if (prices.length < 24) return null;
      const nowCandle = getCandleAt(Date.now(), windowMs);
      if (!nowCandle || !Number.isFinite(nowCandle.open) || nowCandle.open <= 0) return null;
      const emaFastVal = calcEma(prices, 8);
      const emaSlowVal = calcEma(prices, 21);
      const stoch = calcStochastic(prices, 10);
      const vwap = calcKillerVwap(windowMs * 2);
      if (emaFastVal == null || emaSlowVal == null || !Number.isFinite(stoch)) return null;
      const channelPeriod = Math.min(20, prices.length);
      const recent = prices.slice(-channelPeriod);
      const mean = recent.reduce((a, b) => a + b, 0) / recent.length;
      const variance = recent.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / recent.length;
      const std = Math.sqrt(Math.max(0, variance));
      const bb = { upper: mean + std * 2, lower: mean - std * 2 };
      const last = prices[prices.length - 1];
      const trendDir = calcTrendDirection(windowMs);
      const rangePct = (nowCandle.high - nowCandle.low) / nowCandle.open;
      const emaSpreadRatio = Math.abs(emaFastVal - emaSlowVal) / Math.max(last, 1e-8);
      const trendStrength = emaSpreadRatio;
      const momentum = prices[prices.length - 1] - prices[Math.max(0, prices.length - 4)];
      const momentumAbsPct = Math.abs(momentum) / Math.max(last, 1e-8);
      const rangeRevertTrendCap = 0.00075;
      const trendFollowMinMomentumPct = 0.00012;
      const trendFollowStochBuy = 54;
      const trendFollowStochSell = 46;
      let direction = null;
      let reason = 'RangeRevert';
      let confidence = 0;
      const prev = prices[prices.length - 2];
      const rangeRevertBuySetup = prev <= bb.lower && last >= bb.lower && last > prev && stoch <= 30;
      const rangeRevertSellSetup = prev >= bb.upper && last <= bb.upper && last < prev && stoch >= 70;
      const rangeRevertAllowed = trendStrength <= rangeRevertTrendCap;

      if (rangeRevertBuySetup && rangeRevertAllowed) {
        direction = 'BUY';
        confidence = Math.min(0.98, 0.72 + ((bb.lower - last) / Math.max(last, 1e-8)) * 45 + (30 - stoch) / 100);
        reason = 'RangeRevert(LowerBB)';
      } else if (rangeRevertSellSetup && rangeRevertAllowed) {
        direction = 'SELL';
        confidence = Math.min(0.98, 0.72 + ((last - bb.upper) / Math.max(last, 1e-8)) * 45 + (stoch - 70) / 100);
        reason = 'RangeRevert(UpperBB)';
      } else {
        const trendFollowBuySetup = emaFastVal > emaSlowVal
          && stoch >= trendFollowStochBuy
          && momentum > 0
          && momentumAbsPct >= trendFollowMinMomentumPct
          && rangePct >= 0.0002;
        const trendFollowSellSetup = emaFastVal < emaSlowVal
          && stoch <= trendFollowStochSell
          && momentum < 0
          && momentumAbsPct >= trendFollowMinMomentumPct
          && rangePct >= 0.0002;
        if (trendFollowBuySetup) {
          direction = 'BUY';
          confidence = 0.54 + Math.min(0.18, Math.abs(momentum) / Math.max(last, 1e-8) * 80);
          reason = 'MicroTrendFollow(BUY)';
        } else if (trendFollowSellSetup) {
          direction = 'SELL';
          confidence = 0.54 + Math.min(0.18, Math.abs(momentum) / Math.max(last, 1e-8) * 80);
          reason = 'MicroTrendFollow(SELL)';
        } else {
          return null;
        }
      }
      const trendBias = emaFastVal >= emaSlowVal ? 1 : -1;
      const trendAligned = direction === 'BUY' ? trendBias > 0 : trendBias < 0;
      const regime = detectMarketRegime(windowMs);
      if (regime?.state === 'trend' && regime.trendDir !== 0) {
        const regimeDir = regime.trendDir > 0 ? 'BUY' : 'SELL';
        if (direction !== regimeDir) confidence = Math.max(0, confidence - 0.08);
      }
      if (vwap != null) {
        const vwapAligned = direction === 'BUY' ? last <= vwap : last >= vwap;
        if (!vwapAligned) confidence = Math.max(0, confidence - 0.05);
      }
      // Trend gate: ако има ясен тренд срещу RangeRevert посоката, пропускаме.
      const strongTrend = trendStrength > 0.00055;
      if (reason.startsWith('RangeRevert') && strongTrend) {
        if (direction === 'BUY' && emaFastVal < emaSlowVal) return null;
        if (direction === 'SELL' && emaFastVal > emaSlowVal) return null;
      }
      return {
        strategyKey: 'scalp_microtrend',
        direction,
        confidence: clamp01(confidence),
        rangePct,
        trendDir,
        trendAligned,
        volumeOk: true,
        reason,
        stoch,
        ema20: emaFastVal,
        ema50: emaSlowVal,
        vwap
      };
    }


    function calcContinuationDecision(windowMs) {
      const prices = getPricesForWindow(windowMs, 90);
      if (!prices || prices.length < 30) return null;
      const fast = calcEma(prices, Math.max(3, Math.round(S.killerEmaFast || 4)));
      const slow = calcEma(prices, Math.max(5, Math.round(S.killerEmaSlow || 16)));
      if (!Number.isFinite(fast) || !Number.isFinite(slow) || fast === slow) return null;
      const direction = fast > slow ? 'BUY' : 'SELL';

      const momentum = prices[prices.length - 1] - prices[Math.max(0, prices.length - 4)];
      const last = prices[prices.length - 1];
      const momentumAbsPct = Math.abs(momentum) / Math.max(last, 1e-8);
      if (direction === 'BUY' && (momentum <= 0 || momentumAbsPct < 0.0001)) return null;
      if (direction === 'SELL' && (momentum >= 0 || momentumAbsPct < 0.0001)) return null;

      const rsiVal = calcRsi(prices, Math.max(5, Math.round(S.killerRsiWindow || 10)));
      if (!Number.isFinite(rsiVal)) return null;
      const maturity = Math.max(0, Math.min(100, Math.abs(rsiVal - 50) * 2));
      const cfg = getStrategyConfig('continuation');
      const maxMaturity = Math.max(10, Math.min(100, Math.round(Number(cfg?.maxTrendMaturity ?? 65))));
      if (maturity > maxMaturity) return null;
      const confidence = clamp01(0.56 + ((maxMaturity - maturity) / Math.max(maxMaturity, 1)) * 0.28);
      return {
        strategyKey: 'continuation',
        direction,
        confidence,
        trendMaturity: maturity,
        trendAligned: true,
        volumeOk: true,
        reason: 'Continuation'
      };
    }

    function getStrategyDecisions(tfKey) {
      const windowMs = KILLER_TF_MS[tfKey];
      const decisions = [];
      const scalpMicrotrend = calcScalpMicrotrendDecision(windowMs);
      if (scalpMicrotrend?.direction && isStrategyEnabled(scalpMicrotrend.strategyKey)) {
        scalpMicrotrend.tfKey = tfKey;
        decisions.push(applyConfirmationBoost(scalpMicrotrend, windowMs));
      }
      const emaRsiPullback = calcEmaRsiPullbackDecision(windowMs);
      if (emaRsiPullback?.direction && isStrategyEnabled(emaRsiPullback.strategyKey)) {
        emaRsiPullback.tfKey = tfKey;
        decisions.push(applyConfirmationBoost(emaRsiPullback, windowMs));
      }
      const continuation = calcContinuationDecision(windowMs);
      if (continuation?.direction && isStrategyEnabled(continuation.strategyKey)) {
        continuation.tfKey = tfKey;
        decisions.push(applyConfirmationBoost(continuation, windowMs));
      }
      const candlePattern = S.candlestickPatternEnabled ? calcCandlestickPatternDecision(windowMs) : null;
      if (candlePattern?.direction && isStrategyEnabled(candlePattern.strategyKey)) {
        candlePattern.tfKey = tfKey;
        decisions.push(applyConfirmationBoost(candlePattern, windowMs));
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

    function selectConfluencePrimaryDecision(tfKey, decisions, context = {}) {
      const enabled = (Array.isArray(decisions) ? decisions : []).filter((d) => d && d.direction && isStrategyEnabled(d.strategyKey));
      if (!enabled.length) return null;
      let buy = 0;
      let sell = 0;
      for (const d of enabled) {
        if (d.direction === 'BUY') buy += 1;
        else if (d.direction === 'SELL') sell += 1;
      }
      const confluenceDirection = buy > sell ? 'BUY' : sell > buy ? 'SELL' : null;
      const pool = confluenceDirection ? enabled.filter((d) => d.direction === confluenceDirection) : enabled;
      if (!pool.length) return null;
      const pick = pool.reduce((best, d) => {
        if (!best) return d;
        const confA = Number(best.confidence || 0);
        const confB = Number(d.confidence || 0);
        if (confB > confA) return d;
        if (confB < confA) return best;
        const bestMatched = Number(best?.confirmation?.matched ?? 0);
        const curMatched = Number(d?.confirmation?.matched ?? 0);
        if (curMatched > bestMatched) return d;
        if (curMatched < bestMatched) return best;
        const bestStreak = Number(best?._dirStreak || 0);
        const curStreak = Number(d?._dirStreak || 0);
        if (curStreak > bestStreak) return d;
        return best;
      }, null);
      if (!pick) return null;
      return {
        ...pick,
        _confluencePrimary: true,
        _strategyVotes: { buy, sell },
        _confluenceDirection: confluenceDirection,
        tfKey,
        direction: pick.direction,
        confidence: Number(pick.confidence || 0),
        strategyKey: pick.strategyKey,
        confirmation: context.confirmation || pick.confirmation || { total: 0, matched: 0, details: [] },
        regime: context.regime ?? pick.regime,
        biasDir: Number.isFinite(context.biasDir) ? context.biasDir : pick.biasDir,
        timeInCandle: Number.isFinite(context.timeInCandle) ? context.timeInCandle : pick.timeInCandle,
        entryWindowSec: Number.isFinite(context.entryWindowSec) ? context.entryWindowSec : pick.entryWindowSec,
        candleStart: Number.isFinite(context.candleStart) ? context.candleStart : pick.candleStart
      };
    }

    function getAdaptiveConfirmDelayMs(tfKey) {
      if (tfKey === '1m') return 120;
      if (tfKey === '3m') return 180;
      if (tfKey === '5m') return 260;
      const fallback = Number.isFinite(S.confirmDelayMs) ? S.confirmDelayMs : 200;
      return Math.max(0, Math.min(1200, fallback));
    }

    function killerWarmupRemainingMs() {
      if (!S.killerWarmupUntil) return 0;
      return Math.max(0, S.killerWarmupUntil - Date.now());
    }

    function getKillerWarmupWindowMs() {
      const assetLabel = getCurrentAssetLabel() || '';
      const isOtcAsset = /OTC/i.test(assetLabel);
      const baseMin = Math.max(2, S.killerWarmupMin || 10);
      const capMin = isOtcAsset ? 2 : 3;
      const effectiveMin = Math.min(capMin, baseMin);
      return effectiveMin * 60 * 1000;
    }

    function isKillerWarmupReady() {
      const timeReady = killerWarmupRemainingMs() === 0;
      const windowMs = getKillerWarmupWindowMs();
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

    function getKillerMinPayoutOk() {
      if (!S.killerMinPayout) return true;
      const payout = getCurrentPayoutPercent();
      if (payout == null) return !S.payoutRequired;
      return payout >= S.killerMinPayout;
    }

    function getKillerThresholdForScope() {
      return Number.isFinite(S.killerThreshold) ? S.killerThreshold : KILLER_5S_DEFAULTS.threshold;
    }

    function getScoreThresholdPoints() {
      const mode = String(S.killerThresholdMode || '8of11');
      if (mode === '7of11') return 7;
      if (mode === '9of11') return 9;
      return 8;
    }

    function legacyEvaluateScoreDecision(ctx = {}) {
      const {
        decision,
        regime,
        payoutOk,
        entryWindowOk,
        spreadOk,
        killerSnapshot,
        killerAlignmentOk,
        patternSupport,
        noTradeInChop,
        counterCandleHardStop
      } = ctx;
      const breakdown = [];
      const hardFails = [];

      const maxPoints = 11;
      const threshold = getScoreThresholdPoints();
      const basePoints = Number(killerSnapshot?.confluence || 0);
      const supportingBonus = 0;
      const effectivePoints = Number(basePoints || 0);

      breakdown.push(`STRICT VETO | ${basePoints.toFixed(1)}/${maxPoints} | праг ${threshold}`);

      const regimeState = String(regime?.state || '').toLowerCase();
      if (noTradeInChop && regimeState === 'chop') hardFails.push('CHOP – без сделки');
      if (!payoutOk) hardFails.push('PAYOUT под минималния праг');
      if (counterCandleHardStop) hardFails.push('Силна контра-свещ срещу входа');
      if (!entryWindowOk) breakdown.push('Тайминг: 0');
      if (!spreadOk) breakdown.push('Spread/Liquidity: 0');
      if (!patternSupport) breakdown.push('Pattern: 0');
      if (!decision || !decision.direction) hardFails.push('Няма сигнал от стратегия');
      if (!killerAlignmentOk) breakdown.push('KILLER WAIT');

      return {
        hardFailReason: hardFails.length ? hardFails.join(' | ') : null,
        points: Number(effectivePoints.toFixed(2)),
        basePoints: Number(basePoints.toFixed(2)),
        supportingBonus: Number(supportingBonus.toFixed(2)),
        maxPoints,
        threshold,
        breakdown
      };
    }

    function getKillerBaseAmountCents() {
      return Number.isFinite(S.killerBaseAmount)
        ? S.killerBaseAmount
        : KILLER_5S_DEFAULTS.baseAmountCents;
    }

    function pushTfConfidenceSample(tf, confidence, direction) {
      if (!Number.isFinite(confidence)) return;
      if (!S.tfConfSeries) S.tfConfSeries = {};
      const arr = S.tfConfSeries[tf] || (S.tfConfSeries[tf] = []);
      const now = Date.now();
      arr.push({ t: now, c: clamp01(confidence), d: direction || null });
      const cutoff = now - 60_000;
      while (arr.length && arr[0].t < cutoff) arr.shift();
      if (arr.length > 80) arr.splice(0, arr.length - 80);
    }
    function getTfConfidenceStats(tf) {
      const arr = (S.tfConfSeries && S.tfConfSeries[tf]) || [];
      if (arr.length < 4) return null;
      const last = arr[arr.length - 1];
      const start = arr[Math.max(0, arr.length - 6)];
      const slope = last.c - start.c;
      let peak = { c: -1, d: null, t: 0, idx: 0 };
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].c > peak.c) peak = { c: arr[i].c, d: arr[i].d, t: arr[i].t, idx: i };
      }
      let troughAfterPeak = 1;
      for (let i = peak.idx; i < arr.length; i++) {
        troughAfterPeak = Math.min(troughAfterPeak, arr[i].c);
      }
      return { slope, last: last.c, peak: peak.c, peakDir: peak.d, peakT: peak.t, troughAfterPeak };
    }
    function logPrecalcConsole(message, spamKey, spamState, cooldownMs = 5000) {
      if (!message) return;
      if (spamKey && !logSpamControlled(spamKey, spamState, cooldownMs)) return;
      logConsoleLine(message);
    }

    function shouldLogPrecalcVerbose() {
      return !!S.debugEnabled;
    }

    function formatPrecalcWindowCtx(tSec, tfSec, inWindow) {
      const left = Math.max(0, tfSec - 5);
      const right = Math.max(0, tfSec - 1);
      const tLabel = Number.isFinite(tSec) ? tSec.toFixed(1) : '—';
      return `t=${tLabel}s | w=${left}-${right} | ${inWindow ? 'inside_window' : 'outside_window'}`;
    }

    function derivePrecalcNoSignalReason(snapshot, tfMs, candleStart, nowTs) {
      const candReason = String(snapshot?.candidateReason || '').toLowerCase();
      if (candReason === 'no_strategy_data') return 'no_raw_data:no_decision';
      if (candReason === 'no_direction') return 'no_raw_data:no_candidate';
      const rawCount = Number(snapshot?.rawCount || 0);
      if (rawCount > 0) return 'no_raw_data:no_decision';
      const sameCandle = Number(snapshot?.candleStart || 0) === Number(candleStart || 0);
      if (!sameCandle) return 'no_raw_data:candle_mismatch';
      if (!snapshot?.candidate) return 'no_raw_data:no_candidate';
      const lastRawAt = Number(snapshot?.lastRawAt || 0);
      if (!Number.isFinite(lastRawAt) || lastRawAt <= 0) return 'no_raw_data:no_raw_at';
      const ageMs = Math.max(0, Number(nowTs || Date.now()) - lastRawAt);
      if (ageMs > Math.max(5000, Number(tfMs || 0))) return 'no_raw_data:stale_raw';
      return 'no_raw_data';
    }

    function upsertPrecalcSourceSnapshot(tf, patch = {}) {
      S.precalcSourceSnapshots = S.precalcSourceSnapshots || {};
      const key = String(tf || '1m').toLowerCase();
      const prev = S.precalcSourceSnapshots[key] || {};
      const next = { ...prev, ...patch, tfKey: key, updatedAt: Date.now() };
      S.precalcSourceSnapshots[key] = next;
      return next;
    }

    function getPrecalcSourceSnapshot(tf) {
      const key = String(tf || '1m').toLowerCase();
      return (S.precalcSourceSnapshots && S.precalcSourceSnapshots[key]) || null;
    }

    function runPrecalcStage(timeframes, decisionsByTf, evaluatePrecheckGate, requiredThreshold) {
      if (!Array.isArray(timeframes) || !timeframes.length) return;
      if (!S.proPrecalcEnabled) {
        if (S.preCalculatedSignal) {
          S.preCalculatedSignal = null;
        }
        return;
      }

      for (const tf of timeframes) {
        const tfMs = Number(KILLER_TF_MS[tf] || 0);
        if (!(tfMs > 0)) continue;

        const tfSec = Math.round(tfMs / 1000);
        const t = Number(getTimeInCandleSec(tfMs));
        const inPreCalcWindow = tfSec > 10 && Number.isFinite(t) && t >= (tfSec - 5) && t <= (tfSec - 1);
        const tfLabel = String(tf || '1m').toLowerCase();
        const baseSpamKey = `precalc:${tfLabel}`;
        const outsideCtx = formatPrecalcWindowCtx(t, tfSec, false);
        if (!inPreCalcWindow) {
          if (shouldLogPrecalcVerbose()) {
            const outsideState = `${getCandleStart(tfMs)}:outside-window`;
            logPrecalcConsole(`🕒 PRECALC ИЗЧАКВАНЕ | ${tfLabel} | ${outsideCtx}`, `${baseSpamKey}:outside`, outsideState, 15000);
          }
          continue;
        }

        const candleStart = getCandleStart(tfMs);
        const snapshot = getPrecalcSourceSnapshot(tfLabel);
        const startedAt = Number(snapshot?.windowStartedAt || snapshot?.updatedAt || Date.now());
        const elapsedMs = Math.max(0, Date.now() - startedAt);
        const windowCtx = formatPrecalcWindowCtx(t, tfSec, true);
        if (shouldLogPrecalcVerbose()) {
          logPrecalcConsole(`🕒 PRECALC СТАРТ | ${tfLabel} | ${windowCtx} | budget=4.0s`, `${baseSpamKey}:start:${candleStart}`, `${candleStart}:start`, 60000);
        }

        const snapshotCandidate = (snapshot?.candidate && Number(snapshot.candleStart || 0) === candleStart)
          ? snapshot.candidate
          : null;
        let d = decisionsByTf?.[tf] || snapshotCandidate || null;

        if (!d) {
          const missingReason = derivePrecalcNoSignalReason(snapshot, tfMs, candleStart, Date.now());
          logPrecalcConsole(`🟡 PRECALC ПРОПУСК | ${tfLabel} | ${missingReason} | ${windowCtx} | age=${elapsedMs}ms`, `${baseSpamKey}:no-signal:${candleStart}:${missingReason}`, `${candleStart}:${missingReason}`, 60000);
          continue;
        }

        if (!d.direction) {
          logPrecalcConsole(`🟠 PRECALC ПРОПУСК | ${tfLabel} | няма посока | ${windowCtx} | age=${elapsedMs}ms`, `${baseSpamKey}:no-direction:${candleStart}`, `${candleStart}:no-direction`, 60000);
          continue;
        }

        // PRECALC is candidate-capture only.
        // Do not run strict precheck gating here; strict checks are execution-only.
        const snapshotConf = Number(snapshotCandidate?.confidence || 0);
        const currentConf = Number(d?.confidence || 0);
        if (snapshotCandidate && snapshotConf >= currentConf) {
          d = snapshotCandidate;
        }

        const signalTfKey = String(d.tfKey || tf).toLowerCase();
        const existingPrecalc = S.preCalculatedSignal;
        const existingSameCandle = existingPrecalc && Number(existingPrecalc.candleStart || 0) === candleStart;
        const existingConf = Number(existingPrecalc?.confidence || 0);
        if (existingSameCandle && existingConf >= Number(d?.confidence || 0)) {
          const reason = existingConf > Number(d?.confidence || 0) ? 'по-слаб кандидат' : 'вече записан';
          logPrecalcConsole(`🔵 PRECALC ПРОПУСК | ${tfLabel} | ${reason} | ${windowCtx} | age=${elapsedMs}ms`, `${baseSpamKey}:skip-weaker:${candleStart}:${reason}`, `${candleStart}:${reason}`, 60000);
          continue;
        }

        S.preCalculatedSignal = {
          ...d,
          tfKey: signalTfKey,
          preCalculatedAt: Date.now(),
          candleStart,
          priceAtDecision: Number(S.currentAssetPrice),
          traceId: String(d?.traceId || buildSignalTraceId({ ...d, tfKey: signalTfKey, candleStart })),
          precalcCandidateKey: buildPrecalcCandidateKey({ tfKey: signalTfKey, candleStart, direction: d?.direction })
        };
        incrementObsMetric('precalcReady', 1);
        annotateSignalTrace(S.preCalculatedSignal, 'PRECALC_READY', `${signalTfKey}|${String(d.direction || '').toUpperCase()}`);
        const confPct = Math.round(Number(d.confidence || 0) * 100);
        if (shouldLogPrecalcVerbose()) {
          logPrecalcConsole(`🕒 PRECALC FINAL CHECK | ${signalTfKey} | ${windowCtx} | conf=${confPct}%`, `${baseSpamKey}:final:${candleStart}`, `${candleStart}:${confPct}:final`, 60000);
        }
        logPrecalcConsole(`⏱️⏭️ PRECALC ГОТОВ | ${signalTfKey} | ${String(d.direction || '').toUpperCase()} | conf=${confPct}% | ${windowCtx} | age=${elapsedMs}ms`, `${baseSpamKey}:ready:${candleStart}:${signalTfKey}`, `${candleStart}:${signalTfKey}:${String(d.direction || '')}`, 60000);
      }
    }

    async function runKillerTick() {
      S.engineState = 'ANALYZE';
      const now = Date.now();
      const prevStatus = S.killerTfStatus || {};
      const getPrevStatus = (tf) => prevStatus[tf] || {};

      // Per-TF direction smoothing for the matrix (“светофарите”).
      // Goal: show the bot's current intention per TF, but avoid fast flip-flops (BUY↔SELL) caused by momentary noise.
      // IMPORTANT: This only stabilizes what is shown in the TF matrix + the direction field stored into tfStatus.
      // The actual trade decision still runs through the normal filters + the pre-trade recheck.
      const TF_DIR_FLIP_COOLDOWN_MS = Math.max(800, Number.isFinite(S.tfDirectionFlipCooldownMs) ? S.tfDirectionFlipCooldownMs : 2000);
      S.tfDirectionMemory = S.tfDirectionMemory || {};
      const applyTfDirectionSmoothing = (tf, decision) => {
        if (!decision || !decision.direction) return decision;
        const mem = S.tfDirectionMemory[tf] || {};
        const prevDir = mem.dir || null;
        const prevAt = mem.at || 0;

        // First observation.
        if (!prevDir) {
          S.tfDirectionMemory[tf] = { dir: decision.direction, at: now };
          return decision;
        }

        // Same direction => refresh timestamp.
        if (prevDir === decision.direction) {
          S.tfDirectionMemory[tf] = { dir: prevDir, at: now };
          return decision;
        }

        // Different direction => if too soon, keep previous direction for display + slightly punish confidence.
        if (now - prevAt < TF_DIR_FLIP_COOLDOWN_MS) {
          decision._smoothedDirection = prevDir;
          decision.confidence = Math.max(0, Number(decision.confidence || 0) - 0.07);
          return decision;
        }

        // Cooldown passed => accept new direction.
        S.tfDirectionMemory[tf] = { dir: decision.direction, at: now };
        return decision;
      };
      const feedStaleMs = 5000;
      let effectiveLastPriceAt = Number.isFinite(S.lastPriceAt) ? S.lastPriceAt : 0;
      if (!effectiveLastPriceAt && Number.isFinite(S.wsLastPriceAt)) {
        effectiveLastPriceAt = S.wsLastPriceAt;
      }
      if (!effectiveLastPriceAt && Array.isArray(S.priceHistory) && S.priceHistory.length) {
        const tail = S.priceHistory[S.priceHistory.length - 1];
        if (tail?.timestamp) effectiveLastPriceAt = tail.timestamp;
      }
      if (effectiveLastPriceAt && (!S.lastPriceAt || S.lastPriceAt < effectiveLastPriceAt)) {
        S.lastPriceAt = effectiveLastPriceAt;
      }
      if (!effectiveLastPriceAt || now - effectiveLastPriceAt > feedStaleMs) {
        S.feedState = 'NO_FEED';
        const feedStatuses = {};
        for (const tf of Object.keys(KILLER_TF_MS)) {
          if (!S.killerEnabledTimeframes[tf]) {
            feedStatuses[tf] = { state: 'off', confidence: null, direction: null };
            continue;
          }
          feedStatuses[tf] = { state: 'nodata', detail: 'feed stale >5s', confidence: null, direction: null };
        }
        S.analysisUpdatedAt = now;
        S.analysisConfidence = 0;
        S.analysisDirection = null;
        S.tradeQualityScore = 0;
        S.killerTfStatus = feedStatuses;
        setStatusOverlay(formatStatus('killer_no_feed'), '', false);
        renderKillerMatrix();
        renderPendingTrades();
        return;
      }

      S.feedState = 'READY';
      updateSpikeProtectionState();
      const canTrade = S.autoTrade && !S.executing;

      const timeframes = getKillerTimeframes();
      if (!timeframes.length) {
        const tfStatus = {};
        for (const tf of Object.keys(KILLER_TF_MS)) {
          tfStatus[tf] = { state: 'off', confidence: null, direction: null };
        }
        S.killerTfStatus = tfStatus;
        S.analysisUpdatedAt = now;
        S.analysisConfidence = 0;
        S.analysisDirection = null;
        S.tradeQualityScore = 0;
        setStatusOverlay('Снайпер: няма активни таймфрейми', '', false);
        renderKillerMatrix();
        renderPendingTrades();
        return;
      }

      const payoutOk = getKillerMinPayoutOk();
      const assetScope = getExpiryScopeFromAsset(getCurrentAssetLabel());
      const requiredThreshold = clamp01(getKillerThresholdForScope(assetScope));
      const partnerReady = getPartnerTfReadiness();
      const minReadyCount = Math.max(1, Math.round(S.tfReadyMinCount || 1));

      const evaluatePrecheckGate = evaluatePrecheckGateCore;

      let best = null;
      let bestCandidate = null;
      let killerBest = null;
      const killerByTf = {};
      const decisionsByTf = {};
      const strategiesByTf = {};
      S.precalcSourceSnapshots = S.precalcSourceSnapshots || {};
      S.precheckSuccessLatch = S.precheckSuccessLatch || {};
      const allowLateEntries = requiredThreshold === 0;
      const tfStatus = {};
      let hasPrecalcOwnedFlow = false;
      S.lastScoreSnapshot = null;
      S._entryWindowClosedByTf = S._entryWindowClosedByTf || {};
      for (const tf of timeframes) {
        const windowMs = KILLER_TF_MS[tf];
        const timeInCandle = getTimeInCandleSec(windowMs);
        let entryWindowLimit = 0;
        if (S.entryWindowTfEnabled) {
          const baseLimit = (tf === '1m') ? (S.entryWindowSec1m ?? 15)
            : (tf === '3m') ? (S.entryWindowSec3m ?? 35)
            : (tf === '5m') ? (S.entryWindowSec5m ?? 0)
            : 0;
          entryWindowLimit = Math.min(999, Math.max(0, Math.round(baseLimit)));
        }
        const candleStart = getCandleStart(windowMs);  
        const precalcLock = getPrecalcCandleLock(tf, candleStart);
        const precalcLockActive = isCandleLockedByPrecalc(tf, candleStart);
        const precalcSignal = S.preCalculatedSignal;
        const precalcOwnedFlow = precalcLockActive
          && !!S.proPrecalcEnabled
          && !!precalcSignal
          && String(precalcSignal.tfKey || '1m').toLowerCase() === String(tf || '1m').toLowerCase()
          && (
            Number(precalcSignal.handoffPendingCandle || 0) === Number(candleStart || 0)
            || Number(precalcSignal.handoffAttemptedCandle || 0) === Number(candleStart || 0)
          )
          && String(precalcLock?.status || '').toUpperCase() === 'HANDOFF';
        if (precalcLockActive && !precalcOwnedFlow) {
          upsertPrecalcSourceSnapshot(tf, {
            candleStart,
            candidate: null,
            candidateAt: Date.now(),
            candidateReason: 'precalc_candle_lock'
          });
          tfStatus[tf] = { state: 'precalc_lock', detail: 'precalc lock', confidence: null, direction: null };
          continue;
        }
        if (precalcOwnedFlow) {
          hasPrecalcOwnedFlow = true;
          tfStatus[tf] = { state: 'precalc_handoff', detail: 'precalc handoff', confidence: null, direction: null };
          continue;
        }
        const prevWin = S._entryWindowClosedByTf[tf] || { candleStart: null, closed: false, logged: false };
        if (prevWin.candleStart !== candleStart) {
          S._entryWindowClosedByTf[tf] = { candleStart, closed: false, logged: false };
        }
        const winState = S._entryWindowClosedByTf[tf];
        const tfSec = Math.round(windowMs / 1000);
        const inPreCalcWindow = tfSec > 10 && Number.isFinite(timeInCandle) && timeInCandle >= (tfSec - 5) && timeInCandle <= (tfSec - 1);
        if (S.entryWindowTfEnabled && entryWindowLimit > 0 && Number.isFinite(timeInCandle) && timeInCandle > entryWindowLimit) {
          if (!winState.logged) {
            const detailTxt = `${timeInCandle.toFixed(1)}s > ${entryWindowLimit.toFixed(0)}s`;
            const preStopKey = `precheck-stop:${String(tf||'1m').toLowerCase()}:late-window-lock`;
            if (logSpamControlled(preStopKey, detailTxt, 15000)) {
              logConsoleLine(`🔴🧭 ПРЕЧЕК СТОП | ${String(tf||'1m').toLowerCase()} | WINDOW | късен вход | ${detailTxt}`);
            }
            winState.logged = true;
          }
          winState.closed = true;
          const confPrev = getPrevStatus(tf)?.confidence ?? null;
          const dirPrev = getPrevStatus(tf)?.direction ?? null;
          tfStatus[tf] = { state: 'window_closed', detail: `${timeInCandle.toFixed(1)}>${entryWindowLimit}`, confidence: confPrev, direction: dirPrev };
          if (!inPreCalcWindow) {
            continue;
          }
        }
        const readiness = partnerReady.details?.[tf];
        if (readiness && !readiness.ready) {
          const confPrev = getPrevStatus(tf)?.confidence ?? null;
          const dirPrev = getPrevStatus(tf)?.direction ?? null;
          tfStatus[tf] = { state: 'tf_wait', detail: `${readiness.bars}/${readiness.required}`, confidence: confPrev, direction: dirPrev };
          continue;
        }

        const strategyDecisions = getStrategyDecisions(tf);
        strategiesByTf[tf] = Array.isArray(strategyDecisions) ? strategyDecisions.slice() : [];
        upsertPrecalcSourceSnapshot(tf, {
          candleStart,
          windowStartedAt: (getPrecalcSourceSnapshot(tf)?.candleStart === candleStart)
            ? Number(getPrecalcSourceSnapshot(tf)?.windowStartedAt || Date.now())
            : Date.now(),
          rawCount: Array.isArray(strategyDecisions) ? strategyDecisions.length : 0,
          lastRawAt: Date.now(),
          candidate: null,
          candidateAt: null
        });
        const regime = detectMarketRegime(windowMs);
        const biasDir = getBiasDirection();
        const biasDirection = biasDir > 0 ? 'BUY' : biasDir < 0 ? 'SELL' : null;
        for (const d of strategyDecisions) {
          if (!d?.direction) continue;
          d.confirmation = getConfirmationSummary(tf, d.direction);
          d.regime = regime;
          d.biasDir = biasDir;
          d.timeInCandle = timeInCandle;
          d.entryWindowSec = entryWindowLimit;
          d.candleStart = candleStart;
        }
        const decision = selectConfluencePrimaryDecision(tf, strategyDecisions, {
          regime,
          biasDir,
          timeInCandle,
          entryWindowSec: entryWindowLimit,
          candleStart
        });
        if (decision) decision.priceAtSignal = Number(S.currentAssetPrice);
        if (decision) {
          decision.traceId = String(decision.traceId || buildSignalTraceId({ ...decision, tfKey: tf, candleStart }));
          incrementObsMetric('detected', 1);
          annotateSignalTrace(decision, 'DETECTED', `${String(tf||'1m').toLowerCase()}|${String(decision.direction||'').toUpperCase()}`);
          trackDeterministicDecision(tf, candleStart, decision);
        }
        decisionsByTf[tf] = decision;
        if (!decision) {
          upsertPrecalcSourceSnapshot(tf, {
            candleStart,
            candidate: null,
            candidateAt: Date.now(),
            candidateReason: 'no_strategy_data'
          });
          tfStatus[tf] = { state: 'nodata', detail: 'липсва решение от стратегия', confidence: null, direction: null };
          continue;
        }
        if (!decision.direction) {
          upsertPrecalcSourceSnapshot(tf, {
            candleStart,
            candidate: null,
            candidateAt: Date.now(),
            candidateReason: 'no_direction'
          });
          tfStatus[tf] = {
            state: 'nodata',
            detail: 'няма посока от стратегия',
            confidence: decision?.confidence ?? null,
            direction: null
          };
          continue;
        }

        const confirmation = decision.confirmation || { total: 0, matched: 0, details: [] };
        const pre = evaluatePrecheckGate(tf, decision, regime, requiredThreshold);
        if (!pre.pass) {
          incrementObsMetric('precheckStop', 1);
          annotateSignalTrace(decision, 'PRECHECK_STOP', String(pre.reason || 'stop'));
          const reasonTxt = String(pre.reason || '');
          const isPenaltyOnly = ['IMPULSE_EXTENSION', 'MICRO_NOISE', 'DIR_STABILIZER'].includes(reasonTxt);
          if (!isPenaltyOnly) {
            tfStatus[tf] = { state: 'precheck_stop', detail: pre.reason, confidence: decision.confidence, direction: decision.direction };
            const preStopKey = `precheck-stop:${String(tf||'1m').toLowerCase()}:${String(pre.reason||'').toLowerCase()}`;
            const preStopCandleKey = `precheck-stop-candle:${String(tf||'1m').toLowerCase()}:${Number(candleStart || 0)}:${String(pre.reason||'').toLowerCase()}`;
            const stopBurstKey = `precheck-burst-stop:${String(tf||'1m').toLowerCase()}`;
            if (logSpamControlled(stopBurstKey, String(pre.reason||'').toLowerCase(), 1200)
              && logSpamControlled(preStopKey, `STOP|${String(pre.reason||'').toLowerCase()}`, 30000)
              && logSpamControlled(preStopCandleKey, `STOP|${String(pre.reason||'').toLowerCase()}`, 59000)) {
              const detailsTxt = String(pre.details || '').trim();
              const detailSuffix = detailsTxt ? ` | ${detailsTxt}` : '';
              logConsoleLine(`🔴🧭 ПРЕЧЕК СТОП | ${String(tf||'1m').toLowerCase()} | ${decision.direction} | ${pre.reason}${detailSuffix}`);
            }
            continue;
          }
          decision.confidence = Math.max(0, Number(decision.confidence || 0) - 0.08);
          if (decision.scoreCard) decision.scoreCard.points = Number(decision.scoreCard.points || 0) - 0.5;
          tfStatus[tf] = { state: 'precheck_penalty', detail: pre.reason, confidence: decision.confidence, direction: decision.direction };
          const stopBurstKey = `precheck-burst-stop:${String(tf||'1m').toLowerCase()}`;
          const preStopKey = `precheck-stop:${String(tf||'1m').toLowerCase()}:${String(pre.reason||'').toLowerCase()}`;
          const preStopCandleKey = `precheck-stop-candle:${String(tf||'1m').toLowerCase()}:${Number(candleStart || 0)}:${String(pre.reason||'').toLowerCase()}`;
          if (logSpamControlled(stopBurstKey, String(pre.reason||'').toLowerCase(), 1200)
            && logSpamControlled(preStopKey, `STOP|${String(pre.reason||'').toLowerCase()}`, 30000)
            && logSpamControlled(preStopCandleKey, `STOP|${String(pre.reason||'').toLowerCase()}`, 59000)) {
            const detailsTxt = String(pre.details || '').trim();
            const bgReason = reasonTxt === 'IMPULSE_EXTENSION' ? 'ИМПУЛС' : reasonTxt === 'MICRO_NOISE' ? 'ШУМ' : 'СТАБИЛИЗАТОР';
            const detailSuffix = detailsTxt ? ` | ${detailsTxt}` : '';
            logConsoleLine(`🧭 [ENGINE_GUARD] [${String(tf||'1m').toLowerCase()}] [${String(decision.direction||'').toUpperCase()}] [${bgReason}]${detailSuffix}`);
          }
        }
        incrementObsMetric('precheckPass', 1);
        annotateSignalTrace(decision, 'PRECHECK_PASS', String(tf || '1m').toLowerCase());
        upsertPrecalcSourceSnapshot(tf, {
          candleStart,
          candidate: {
            ...decision,
            tfKey: String(decision.tfKey || tf).toLowerCase(),
            candleStart,
            priceAtDecision: Number(S.currentAssetPrice)
          },
          candidateAt: Date.now(),
          candidateReason: 'ready'
        });

        // Smooth TF direction for UI (avoid rapid BUY↔SELL flicker in the matrix).
        // We keep the real trade direction in decision.direction; the UI uses decision._smoothedDirection when present.
        applyTfDirectionSmoothing(tf, decision);
        // Anti-flip: keep a short per-TF direction streak (real direction, not smoothed UI).
        S.__tfDirStreak = S.__tfDirStreak || {};
        if (decision && decision.direction) {
          const st = S.__tfDirStreak[tf] || { dir: null, streak: 0, lastT: 0 };
          if (st.dir === decision.direction) st.streak += 1;
          else { st.dir = decision.direction; st.streak = 1; }
          st.lastT = now;
          S.__tfDirStreak[tf] = st;
          decision._dirStreak = st.streak;
        }

        // Track recent directions for anti-flip voting (no cooldown)
        S.__tfDirHist = S.__tfDirHist || {};
        const __h = S.__tfDirHist[tf] || (S.__tfDirHist[tf] = []);
        __h.push({ dir: decision.direction, conf: (decision.confidence || 0), t: now });
        while (__h.length > 5) __h.shift();


        const displayDir = decision._smoothedDirection || decision.direction;
        const killerSnapshotTf = computeKillerSnapshot(tf, decision, regime, confirmation, strategyDecisions);
        if (killerSnapshotTf) {
          killerByTf[tf] = killerSnapshotTf;
          if (!killerBest || killerSnapshotTf.dominance > killerBest.dominance) killerBest = killerSnapshotTf;
        }
        if (S.killerEnabled) {
          killerEdgeTriggered(tf, decision.direction, false);
        }
        const entryWindowExceeded = entryWindowLimit > 0 && Number.isFinite(timeInCandle) && timeInCandle > entryWindowLimit;
        if (entryWindowExceeded) {
          const over = Math.max(0, timeInCandle - entryWindowLimit);
          const confPct = Math.round((decision?.confidence || 0) * 100);
          const thrPct = Math.round(requiredThreshold * 100);
          decision.timingNote = `Късен вход: ${timeInCandle.toFixed(1)}s > ${entryWindowLimit}s (${tf}) | conf ${confPct}% | праг ${thrPct}% | +${over.toFixed(1)}s`;
        }
        if (S.regimeStrength > 0 && regime?.state === 'chop') {
          decision.confidence = Math.max(0, decision.confidence - 0.10 * clamp01(S.regimeStrength));
        }
        if (S.regimeStrength > 0 && regime?.state === 'trend' && regime.trendDir !== 0) {
          const regimeDir = regime.trendDir > 0 ? 'BUY' : 'SELL';
          if (decision.direction !== regimeDir) {
            decision.confidence = Math.max(0, decision.confidence - 0.06 * clamp01(S.regimeStrength));
          }
        }
        if (S.regimeStrength > 0 && regime?.state === 'range') {
          const osc = (confirmation?.details || []).find((d) => typeof d === 'string' && d.startsWith('osc:'));
          const oscDir = osc ? osc.split(':')[1] : null;
          if (oscDir && decision.direction && oscDir !== decision.direction) {
            const rangeOscPenalty = (S.rangeOscPenaltyEnabled ? (clamp(parseNumberFlexible(S.rangeOscPenaltyPct) || 0, 0, 50) / 100) : 0);
            decision.confidence = Math.max(0, decision.confidence - rangeOscPenalty);
            decision.rangeOscPenaltyDebug = `range_osc_penalty:${Math.round(rangeOscPenalty * 100)}pp (osc:${oscDir} vs dir:${decision.direction})`;
          }
          if (regime.trendDir !== 0) {
            const regimePref = regime.trendDir > 0 ? 'SELL' : 'BUY';
            if (decision.direction !== regimePref) {
              decision.confidence = Math.max(0, decision.confidence - 0.05 * clamp01(S.regimeStrength));
            }
          }
        }
        if (S.biasStrength > 0 && biasDirection && decision.direction !== biasDirection) {
          decision.confidence = Math.max(0, decision.confidence - 0.05 * clamp01(S.biasStrength));
        }
        if (biasDirection && decision.direction === biasDirection) {
          const need = S.biasPointMinStrength === 'high' ? 0.66 : S.biasPointMinStrength === 'low' ? 0.33 : 0.50;
          if (Math.abs(Number(S.biasStrength || 0)) < need) {
            decision.confidence = Math.max(0, decision.confidence - 0.04);
          }
        }
        if (S.confirmationStrength > 0.1) {
          const required = S.confirmationStrength >= 0.7 ? 2 : 1;
          if (confirmation.matched < required) {
            decision.confidence = Math.max(0, decision.confidence - 0.06 * clamp01(S.confirmationStrength));
          }
        }
        if (!bestCandidate || decision.confidence > bestCandidate.confidence) {
          bestCandidate = decision;
        }
        // TIMING (ново): Catch the move / Snipe after reload (само тайминг, без промяна на стратегията)
        pushTfConfidenceSample(tf, decision.confidence, decision.direction);
        if (S.phaseCatchMoveEnabled || S.phaseReloadKillerEnabled) {
          const stats = getTfConfidenceStats(tf);
          const hasMomentum = decision.momentum != null ? Math.abs(decision.momentum) > 0 : true;
          if (stats) {
            if (S.phaseCatchMoveEnabled && regime?.state === 'trend' && decision.trendAligned && hasMomentum) {
              const near = decision.confidence >= Math.max(0, requiredThreshold - 0.12);
              const rising = stats.slope >= 0.18;
              if (near && rising) { decision.confidence = Math.min(1, decision.confidence + 0.08); }
            }
            if (S.phaseReloadKillerEnabled && stats.peakDir && stats.peakDir === decision.direction) {
              const dip = stats.peak - stats.troughAfterPeak;
              const recovered = decision.confidence >= Math.max(0, requiredThreshold - 0.08);
              if (dip >= 0.15 && recovered && stats.slope >= 0.10) { decision.confidence = Math.min(1, decision.confidence + 0.06); }
            }
          }
        }

        let killerAlignmentOk = false;
        let perfectTimeOk = true;
        if (S.killerEnabled && killerSnapshotTf) {
          const minAgreement = Math.max(1, Math.min(3, Math.round(S.killerStrategyAgreementMin || 1)));
          const strategyGateOk = !S.killerUseStrategyVotes || killerSnapshotTf.strategyAgreement >= minAgreement;
          const counterCandleHardStop = !!(S.killerCandleAgainstHardStop && killerSnapshotTf.candleAgainst);
          decision.counterCandleHardStop = counterCandleHardStop;
          const ptRuntimeMode = getPtModeForRuntime(regime?.state);
          const ptEdgeHit = killerEdgeTriggered(tf, decision.direction, true);
          perfectTimeOk = ptRuntimeMode === 'hard' ? !!ptEdgeHit : true;
          killerAlignmentOk = !!(killerSnapshotTf.passConfluence && killerSnapshotTf.passDominance && strategyGateOk && !counterCandleHardStop);
          if (!killerAlignmentOk) {
            try {
              const reason = !killerSnapshotTf.passConfluence
                ? (killerSnapshotTf.strictReason || 'Confluence')
                : (!killerSnapshotTf.passDominance ? 'Dominance' : (!strategyGateOk ? 'Strategy' : (counterCandleHardStop ? 'CounterCandle' : '')));
              sessionRecordKiller(tf, killerSnapshotTf, 'WAIT', reason);
            } catch (e) {}
          } else if (!perfectTimeOk) {
            try { sessionRecordKiller(tf, killerSnapshotTf, 'WAIT', 'PerfectTime'); } catch (e) {}
          }
        }

        const entryWindowOk = !S.entryWindowTfEnabled || entryWindowLimit <= 0 || timeInCandle <= entryWindowLimit;
        const spreadMetric = Number.isFinite(S.lastGlobalSpread) ? S.lastGlobalSpread : 0;
        const spreadOk = !S.filterSpreadEnabled || !Number.isFinite(S.filterSpreadThreshold) || spreadMetric >= S.filterSpreadThreshold;
        const patternSupport = !S.candlestickPatternEnabled || decision.strategyKey === 'candlestick_pattern';
        const confidenceGatePass = Number(decision.confidence || 0) + 1e-9 >= Number(requiredThreshold || 0);
          S.engineState = 'KILLER';
        const killerGatePass = !!(killerAlignmentOk && perfectTimeOk && entryWindowOk && confidenceGatePass);
        const killerThreshold = Number(killerSnapshotTf?.threshold || getScoreThresholdPoints());
        const killerPts = Number(killerSnapshotTf?.effectivePoints || killerSnapshotTf?.confluence || 0);
        const scoreCard = {
          points: killerPts,
          maxPoints: Number(killerSnapshotTf?.maxPoints || 11),
          threshold: killerThreshold,
          hardFailReason: '',
          breakdown: Array.isArray(killerSnapshotTf?.breakdown) && killerSnapshotTf.breakdown.length
            ? killerSnapshotTf.breakdown.slice(0, 12)
            : ['KILLER_ONLY_RUNTIME']
        };
        decision.scoreCard = scoreCard;
        if (!killerGatePass) {
          const reason = !confidenceGatePass
            ? `PRECHECK STOP | слаба увереност (${Math.round(Number(decision.confidence || 0) * 100)}% < ${Math.round(Number(requiredThreshold || 0) * 100)}%)`
            : `KILLER WAIT | ${killerPts.toFixed(1)}/${scoreCard.maxPoints}, мин ${killerThreshold}`;
          S.lastScoreSnapshot = {
            result: 'SKIP(KILLER)',
            points: scoreCard.points,
            maxPoints: scoreCard.maxPoints,
            threshold: scoreCard.threshold,
            strategyKey: decision.strategyKey,
            reason
          };
          tfStatus[tf] = { state: 'risk', confidence: decision.confidence, direction: displayDir };
          continue;
        }

        try { sessionRecordKiller(tf, killerSnapshotTf, 'PASS', 'READY'); } catch (_) {}

        S.lastScoreSnapshot = {
          result: 'READY(KILLER)',
          points: scoreCard.points,
          maxPoints: scoreCard.maxPoints,
          threshold: scoreCard.threshold,
          strategyKey: decision.strategyKey,
          reason: 'Готов за вход (KILLER ONLY)'
        };
        if (S.debugEnabled) {
          logConsoleLine(`[DEBUG] PRE-EXEC gates: killer=PASS score=BYPASS pt=${perfectTimeOk ? 'OK' : 'WAIT'} entry=${entryWindowOk ? 'OK' : 'WAIT'}`);
        }

        const decisionPts = Number(decision?.scoreCard?.points ?? killerPts ?? 0);
        const bestPts = Number(best?.scoreCard?.points ?? 0);
        const decisionVotes = decision._strategyVotes || { buy: 0, sell: 0 };
        const bestVotes = best?._strategyVotes || { buy: 0, sell: 0 };
        const decisionVoteDom = Math.abs(Number(decisionVotes.buy || 0) - Number(decisionVotes.sell || 0));
        const bestVoteDom = Math.abs(Number(bestVotes.buy || 0) - Number(bestVotes.sell || 0));
        const shouldPromoteBest = !best
          || decisionPts > bestPts
          || (decisionPts === bestPts && (decision.confidence || 0) > (best.confidence || 0))
          || (decisionPts === bestPts && (decision.confidence || 0) === (best.confidence || 0) && decisionVoteDom > bestVoteDom)
          || (decisionPts === bestPts && (decision.confidence || 0) === (best.confidence || 0) && decisionVoteDom === bestVoteDom && Number(decision.timeInCandle || 0) < Number(best.timeInCandle || Number.POSITIVE_INFINITY));
        if (shouldPromoteBest) {
          best = {
            ...decision,
            timeInCandle,
            windowMs,
            candleStart
          };
        }
        tfStatus[tf] = { state: 'ready', confidence: decision.confidence, direction: displayDir };
      }

      const readySignalsForVote = Object.keys(tfStatus)
        .filter((tf) => ['ready'].includes(tfStatus[tf]?.state) && decisionsByTf[tf]?.direction)
        .map((tf) => decisionsByTf[tf]);
      if (readySignalsForVote.length >= minReadyCount) {
        let buyScore = 0;
        let sellScore = 0;
        for (const sig of readySignalsForVote) {
          if (sig.direction === 'BUY') buyScore += Number(sig.confidence || 0);
          if (sig.direction === 'SELL') sellScore += Number(sig.confidence || 0);
        }
        if (buyScore > sellScore && best) {
          best.direction = 'BUY';
          best.confidence = Math.max(best.confidence, buyScore / readySignalsForVote.length);
        } else if (sellScore > buyScore && best) {
          best.direction = 'SELL';
          best.confidence = Math.max(best.confidence, sellScore / readySignalsForVote.length);
        }
      }

      for (const tf of Object.keys(KILLER_TF_MS)) {
        const prev = getPrevStatus(tf);
        if (!S.killerEnabledTimeframes[tf]) {
          tfStatus[tf] = { state: 'off', confidence: null, direction: null };
        } else if (!tfStatus[tf]) {
          tfStatus[tf] = { state: 'late', confidence: prev.confidence ?? null, direction: prev.direction ?? null };
        }
      }
      S.killerTfStatus = tfStatus;
      if (killerBest) {
        S.killerSnapshot = {
          longPct: killerBest.longPct,
          shortPct: killerBest.shortPct,
          confluence: killerBest.confluence,
          effectivePoints: killerBest.effectivePoints,
          supportingBonus: killerBest.supportingBonus,
          maxPoints: killerBest.maxPoints,
          minConfluence: killerBest.minConfluence,
          adx: killerBest.adx,
          trd: killerBest.checks?.find((c) => c.key === 'TRD')?.ok ? 'OK' : 'Слаб',
          macd: killerBest.checks?.find((c) => c.key === 'MACD')?.buy ? 'Бичи' : 'Мечи',
          rsi: killerBest.direction === 'BUY' ? 'Над 50' : 'Под 50',
          sto: killerBest.checks?.find((c) => c.key === 'STO')?.ok ? 'Потвърждение' : 'Слаб',
          vol: killerBest.checks?.find((c) => c.key === 'VOL')?.ok ? 'Нормален' : 'Слаб',
          signal: best ? best.direction : 'WAIT'
        };
      } else {
        S.killerSnapshot = { signal: 'WAIT', longPct: 50, shortPct: 50, confluence: 0, effectivePoints: 0, supportingBonus: 0, minConfluence: getScoreThresholdPoints(), maxPoints: 11, adx: null };
      }
      renderKillerMatrix();
      renderPendingTrades();
      renderKillerHud();
      runPrecalcStage(timeframes, decisionsByTf, evaluatePrecheckGate, requiredThreshold);
      if (!best && !hasPrecalcOwnedFlow) {
        S.analysisConfidence = bestCandidate ? bestCandidate.confidence : 0;
        S.analysisDirection = bestCandidate ? bestCandidate.direction : null;
        S.tradeQualityScore = bestCandidate ? Math.round((bestCandidate.confidence || 0) * 100) : 0;
        S.currentStrategyKey = bestCandidate?.strategyKey || null;
        S.killerLastDecision = null;
        S.analysisUpdatedAt = now;
        const notReady = Object.entries(partnerReady.details || {}).filter(([,d]) => !d.ready);
        const readyCount = Object.entries(partnerReady.details || {}).filter(([,d]) => !!d.ready).length;
        if (readyCount < minReadyCount && notReady.length) {
          const tfNotReadySummary = notReady.map(([tf, d]) => `${tf}=${d.bars}/${d.required}`).join(' ');
          setStatusOverlay(`Снайпер: TF not ready ${tfNotReadySummary}`, '', false);
        } else {
          setStatusOverlay('Снайпер: няма чист вход', '', false);
        }
        renderPendingTrades();
        return;
      }

      if (S.lastStrategyDirection && best?.direction && S.lastStrategyDirection !== best.direction) {
        const sinceFlip = now - (S.lastStrategyDirectionAt || 0);
        if (sinceFlip < Math.max(500, S.strategyFlipCooldownMs || 2500)) {
          best.direction = S.lastStrategyDirection;
          best.confidence = Math.max(0, (best.confidence || 0) - 0.08);
        }
      }
      if (best?.direction) {
        S.lastStrategyDirection = best.direction;
        S.lastStrategyDirectionAt = now;
      }
      S.analysisConfidence = Number(best?.confidence || 0);
      S.analysisDirection = best?.direction || null;
      S.analysisUpdatedAt = now;
      S.tradeQualityScore = Math.round((Number(best?.confidence || 0)) * 100);
      S.killerLastDecision = best || null;
      S.currentStrategyKey = best?.strategyKey || null;
      S.lastDecisionSnapshot = {
        at: now,
        direction: best?.direction || null,
        confidence: Number(best?.confidence || 0),
        strategyKey: best?.strategyKey || null,
        tfStatus: { ...tfStatus }
      };

      if (!canTrade) {
        setStatusOverlay('Снайпер: изчакване', '', false);
        renderPendingTrades();
        return;
      }

      
    // --- NEW FILTER METRICS ---
    // Compute global BUY/SELL averages across TFs (used by Spread filter + logs)
    let _buySum = 0, _buyN = 0, _sellSum = 0, _sellN = 0;
    S._tfConfSeries = S._tfConfSeries || {};
    for (const tf of timeframes) {
      const d = decisionsByTf[tf];
      if (!d || typeof d.confidence !== 'number') continue;
      if (d.direction === 'BUY') { _buySum += d.confidence; _buyN++; }
      if (d.direction === 'SELL') { _sellSum += d.confidence; _sellN++; }
      // track confidence series per TF (for Drift detector)
      const arr = (S._tfConfSeries[tf] = S._tfConfSeries[tf] || []);
      arr.push(d.confidence);
      if (arr.length > 12) arr.splice(0, arr.length - 12);
    }
    const buyAvg = _buyN ? (_buySum / _buyN) : 0;
    const sellAvg = _sellN ? (_sellSum / _sellN) : 0;
    const spreadPct = Math.abs(buyAvg - sellAvg);
    S.lastGlobalBuyAvg = buyAvg;
    S.lastGlobalSellAvg = sellAvg;
    S.lastGlobalSpread = spreadPct;
      cleanupPrecalcCandleLocks(timeframes);

const readySignals = Object.keys(tfStatus)
        .filter(tf => ['ready'].includes(tfStatus[tf]?.state))
        .map(tf => {
          const decision = decisionsByTf[tf];
          const windowMs = KILLER_TF_MS[tf];
          return {
            ...decision,
            windowMs,
            candleStart: getCandleStart(windowMs)
          };
        })
        .filter(sig => sig && sig.direction);

            readySignals.sort((a, b) => {
        const ptsA = Number(a?.scoreCard?.points ?? 0);
        const ptsB = Number(b?.scoreCard?.points ?? 0);
        if (ptsB !== ptsA) return ptsB - ptsA;
        const confA = Number(a?.confidence || 0);
        const confB = Number(b?.confidence || 0);
        if (confB !== confA) return confB - confA;
        const vA = a?._strategyVotes || { buy: 0, sell: 0 };
        const vB = b?._strategyVotes || { buy: 0, sell: 0 };
        const domA = Math.abs(Number(vA.buy || 0) - Number(vA.sell || 0));
        const domB = Math.abs(Number(vB.buy || 0) - Number(vB.sell || 0));
        if (domB !== domA) return domB - domA;
        return Number(a?.timeInCandle || Number.POSITIVE_INFINITY) - Number(b?.timeInCandle || Number.POSITIVE_INFINITY);
      });

      const maxConcurrentKillerTrades = Math.max(1, Math.round(S.maxOpenTrades || timeframes.length));
      const availableSlots = Math.max(0, maxConcurrentKillerTrades - S.activeTrades.length);

      let precalcHandoffSignal = null;
      if (!S.proPrecalcEnabled && S.preCalculatedSignal) {
        S.preCalculatedSignal = null;
      }
      if (S.proPrecalcEnabled && S.preCalculatedSignal && S.preCalculatedSignal.tfKey) {
        const tfKey = String(S.preCalculatedSignal.tfKey || '1m').toLowerCase();
        const tfMs = KILLER_TF_MS[tfKey] || 60_000;
        const t = Number(getTimeInCandleSec(tfMs));
        const precalcEarlyEntrySec = 5;
        const currentCandleStart = getCandleStart(tfMs);
        const preparedPrevCandle = Number(S.preCalculatedSignal.candleStart || 0) < currentCandleStart;
        const inEarlyWindow = t >= 0 && t <= precalcEarlyEntrySec;

        if (preparedPrevCandle && Number(S.preCalculatedSignal.handoffPendingCandle || 0) !== Number(currentCandleStart || 0)) {
          S.preCalculatedSignal = {
            ...S.preCalculatedSignal,
            handoffPendingAt: Date.now(),
            handoffPendingCandle: currentCandleStart
          };
          setPrecalcCandleLock(tfKey, currentCandleStart, {
            source: 'PRECALC',
            candidateKey: String(S.preCalculatedSignal.precalcCandidateKey || buildPrecalcCandidateKey(S.preCalculatedSignal)),
            status: 'HANDOFF',
            reason: 'pending_handoff'
          });
        }

        const pendingForCurrent = Number(S.preCalculatedSignal.handoffPendingCandle || 0) === Number(currentCandleStart || 0);
        if (pendingForCurrent) {
          const alreadyAttempted = Number(S.preCalculatedSignal.handoffAttemptedCandle || 0) === Number(currentCandleStart || 0);
          if (inEarlyWindow && !alreadyAttempted) {
            const preSignal = {
              ...S.preCalculatedSignal,
              _fromPreCalc: true,
              _fromPreCalcHandoff: true,
              windowMs: tfMs,
              tfKey,
              candleStart: currentCandleStart
            };
            preSignal.traceId = String(S.preCalculatedSignal.traceId || buildSignalTraceId(preSignal));
            preSignal.precalcCandidateKey = String(S.preCalculatedSignal.precalcCandidateKey || buildPrecalcCandidateKey(preSignal));
            S.preCalculatedSignal = {
              ...S.preCalculatedSignal,
              handoffAttemptedAt: Date.now(),
              handoffAttemptedCandle: currentCandleStart,
              handoffCandidateKey: preSignal.precalcCandidateKey
            };
            annotateSignalTrace(preSignal, 'PRECALC_HANDOFF', `${tfKey}|t=${Number.isFinite(t) ? t.toFixed(1) : 'na'}`);
            const handoffConf = Math.round(Number(preSignal?.confidence || 0) * 100);
            logConsoleLine(`⏩ PRECALC ПРЕХВЪРЛЯНЕ | ${tfKey} | ${String(preSignal.direction || '').toUpperCase()} | conf=${handoffConf}% | key=${preSignal.precalcCandidateKey} | t=${Number.isFinite(t) ? t.toFixed(1) : '—'}s`);
            precalcHandoffSignal = preSignal;
          } else if (!inEarlyWindow && !alreadyAttempted) {
            const droppedSignal = {
              ...S.preCalculatedSignal,
              _fromPreCalc: true,
              _fromPreCalcHandoff: true,
              windowMs: tfMs,
              tfKey,
              candleStart: currentCandleStart,
              precalcCandidateKey: String(S.preCalculatedSignal.precalcCandidateKey || buildPrecalcCandidateKey({ ...S.preCalculatedSignal, tfKey, candleStart: currentCandleStart }))
            };
            finalizePrecalcOutcome(droppedSignal, 'dropped', 'handoff_window_missed');
          }
        } else if (currentCandleStart > Number(S.preCalculatedSignal.candleStart || 0) + tfMs) {
          S.preCalculatedSignal = null;
        }
      }

      if (!availableSlots) {
        if (precalcHandoffSignal) {
          finalizePrecalcOutcome(precalcHandoffSignal, 'dropped', 'no_slot');
        }
        setStatusOverlay('Снайпер: изчакване', '', false);
        return;
      }

      let signalsToExecute = precalcHandoffSignal ? [precalcHandoffSignal] : readySignals.slice(0, availableSlots);

      for (let i = 0; i < signalsToExecute.length; i += 1) {
        const decision = signalsToExecute[i];
        const readyAtMs = Date.now();
        const baseConfPct = Math.round(Number(decision?.confidence || 0) * 100);

        // Frozen signal flow: no strategy re-selection before execution.
        const preDelayMs = decision._fromPreCalc ? 0 : Math.max(250, Number.isFinite(S.preTradeRecheckDelayMs) ? S.preTradeRecheckDelayMs : 400);
        await new Promise(r => setTimeout(r, preDelayMs));

        if (i > 0) {
          const delayMs = Math.max(350, Number.isFinite(S.multiSignalDelayMs) ? S.multiSignalDelayMs : 600);
          await new Promise(r => setTimeout(r, delayMs));
        }


        const assetLabel = getCurrentAssetLabel() || '—';
        const assetSearch = assetLabel.replace(/\(OTC\)/i, '').replace(/\//g, '').trim();
        
      // --- NEW FILTERS (Advanced) ---
      const evalCtx = {
        nowTs: Date.now(),
        tf: decision.tfKey || decision.timeframe,
        direction: decision.direction,
        spreadValue: (typeof S.lastGlobalSpread === 'number') ? S.lastGlobalSpread : 0,
        tfConfSeries: (S._tfConfSeries && (decision.tfKey || decision.timeframe) && S._tfConfSeries[decision.tfKey || decision.timeframe]) ? S._tfConfSeries[decision.tfKey || decision.timeframe] : [],
        ticks: Array.isArray(S.priceHistory) ? S.priceHistory : [],
        wsTs: Number(S.wsLastPriceAt || 0),
        domTs: Number(S.lastPriceAt || 0),
        biasDir: Number(decision?.biasDir || 0),
        trendDirRaw: Number(decision?.trendDir || decision?.biasDir || 0)
      };
      const filterResults = {
        precheck_gate: { pass: true, reason: '', details: '' }
      };
      const filterOrder = ['spread', 'flip_delay', 'drift', 'impulse_cap', 'dead_market', 'csea_se', 'chop_hard_stop', 'spike_protection'];

      // Phase 1: evaluation (single-pass, no execution continue)
      const spreadThresholdRatio = Math.max(0, Number(S.filterSpreadThreshold || 0)) / 100;
      const spreadFail = S.filterSpreadEnabled && typeof S.filterSpreadThreshold === 'number' && evalCtx.spreadValue < spreadThresholdRatio;
      filterResults.spread = {
        pass: !spreadFail,
        reason: spreadFail ? 'spread_low' : '',
        details: spreadFail ? `${(evalCtx.spreadValue * 100).toFixed(2)}% < ${(spreadThresholdRatio * 100).toFixed(2)}%` : ''
      };

      const flipDelayFail = S.filterFlipDelayEnabled && S.lastTradeDirection && decision.direction && decision.direction !== S.lastTradeDirection
        && ((evalCtx.nowTs - (S.lastTradeAt || 0)) >= 0)
        && ((evalCtx.nowTs - (S.lastTradeAt || 0)) < (S.filterFlipDelaySec * 1000));
      filterResults.flip_delay = {
        pass: !flipDelayFail,
        reason: flipDelayFail ? 'flip_delay' : '',
        details: flipDelayFail ? `${evalCtx.nowTs - (S.lastTradeAt || 0)}ms < ${S.filterFlipDelaySec * 1000}ms` : ''
      };

      let driftFail = false;
      let driftMeta = null;
      if (S.filterDriftEnabled) {
        const arr = evalCtx.tfConfSeries;
        if (arr.length >= 4) {
          const a = arr.slice(-4).map((v) => Number(v || 0));
          const thresholdPp = Math.max(0, Number(S.filterDriftThreshold || 0));
          const thresholdRatio = thresholdPp / 100;
          const tolerancePp = Math.max(1, Math.min(3, Math.round(thresholdPp * 0.20)));
          const toleranceRatio = tolerancePp / 100;

          const d01 = a[0] - a[1];
          const d12 = a[1] - a[2];
          const d23 = a[2] - a[3];

          const downs = (d01 > 0 ? 1 : 0) + (d12 > 0 ? 1 : 0) + (d23 > 0 ? 1 : 0);
          const totalDrop = a[0] - a[3];
          const bounce01 = Math.max(0, -d01);
          const bounce12 = Math.max(0, -d12);
          const bounce23 = Math.max(0, -d23);
          const maxBounce = Math.max(bounce01, bounce12, bounce23);

          driftFail = thresholdRatio > 0
            && totalDrop >= thresholdRatio
            && downs >= 2
            && maxBounce <= toleranceRatio;

          driftMeta = {
            values: a,
            thresholdPp,
            tolerancePp,
            totalDropPp: Math.round(totalDrop * 10000) / 100,
            maxBouncePp: Math.round(maxBounce * 10000) / 100,
            downs
          };
        }
      }
      const fmtPp = (n) => {
        const v = Math.round(Number(n || 0) * 100) / 100;
        if (!Number.isFinite(v)) return '0';
        return Number.isInteger(v) ? String(v) : String(v).replace(/\.0+$/, '').replace(/(\.\d*[1-9])0+$/, '$1');
      };
      filterResults.drift = {
        pass: !driftFail,
        reason: driftFail ? 'drift' : '',
        details: driftFail && driftMeta
          ? `drop ${fmtPp(driftMeta.totalDropPp)}pp / ${fmtPp(driftMeta.thresholdPp)}pp | tol ${fmtPp(driftMeta.tolerancePp)}pp | bounce ${fmtPp(driftMeta.maxBouncePp)}pp | downs ${driftMeta.downs}/3`
          : ''
      };
      if (driftFail && driftMeta) {
        const vals = driftMeta.values.map((v) => Number(v).toFixed(2)).join(', ');
        const driftLine = `📉 DRIFT → [${vals}] | drop ${fmtPp(driftMeta.totalDropPp)}pp / ${fmtPp(driftMeta.thresholdPp)}pp | tol ${fmtPp(driftMeta.tolerancePp)}pp`;
        const driftLogKey = `${evalCtx.tf}|${vals}|${fmtPp(driftMeta.thresholdPp)}|${fmtPp(driftMeta.tolerancePp)}`;
        if (S._lastDriftLogKey !== driftLogKey) {
          S._lastDriftLogKey = driftLogKey;
          logConsoleLine(driftLine);
        }
      }

      let impulseCapFail = false;
      if (S.impulseCapEnabled) {
        const tf = evalCtx.tf;
        const tfMs = (tf === '1m') ? 60_000 : (tf === '3m') ? 180_000 : (tf === '5m') ? 300_000 : 0;
        if (tfMs) {
          const candleId = Math.floor(evalCtx.nowTs / tfMs);
          S._impulseCap = S._impulseCap || {};
          const key = tf + '|' + decision.direction;
          const obj = (S._impulseCap[key] = S._impulseCap[key] || { candleId, count: 0 });
          if (obj.candleId !== candleId) { obj.candleId = candleId; obj.count = 0; }
          impulseCapFail = obj.count >= S.impulseCapMaxPerCandle;
          // slot increment is applied only at real execution start.
        }
      }
      filterResults.impulse_cap = {
        pass: !impulseCapFail,
        reason: impulseCapFail ? 'impulse_cap' : '',
        details: impulseCapFail ? `max=${S.impulseCapMaxPerCandle}` : ''
      };

      let deadMarketFailReason = '';
      if (S.deadMarketEnabled) {
        const ticks = evalCtx.ticks;
        const histTs = ticks.length ? Number(ticks[ticks.length - 1]?.timestamp || 0) : 0;
        const lastTickTs = Math.max(evalCtx.wsTs, evalCtx.domTs, histTs);
        const lastTickAgeMs = lastTickTs > 0 ? Math.max(0, evalCtx.nowTs - lastTickTs) : Number.POSITIVE_INFINITY;
        const minMove = Math.max(0, Number(S.deadMarketMinMove || 0.00010));
        const minLatency = Math.max(200, Math.round(Number(S.deadMarketMinLatencyMs || 1500)));
        const windowMs = Math.max(1000, minLatency);
        const cutoff = evalCtx.nowTs - windowMs;
        const recent = ticks.filter(x => Number(x?.timestamp || 0) >= cutoff);
        const ticksLastWindow = recent.length;
        const first = recent.length ? Number(recent[0]?.price || 0) : 0;
        const last = recent.length ? Number(recent[recent.length - 1]?.price || 0) : 0;
        const moveLastWindow = Math.abs(last - first);
        const staleFeed = !Number.isFinite(lastTickAgeMs) || lastTickAgeMs >= minLatency;
        const lowMovement = moveLastWindow < minMove;
        decision.deadMarketDebug = {
          staleFeed,
          lowMovement,
          lastTickAgeMs,
          ticksLastWindow,
          moveLastWindow,
          minLatency,
          minMove,
          windowMs,
          lastTickTs,
          wsTs: evalCtx.wsTs,
          domTs: evalCtx.domTs,
          histTs
        };
        if (staleFeed) deadMarketFailReason = 'dead_market_stale';
        else if (lowMovement) deadMarketFailReason = 'dead_market_low_movement';
      }
      filterResults.dead_market = {
        pass: !deadMarketFailReason,
        reason: deadMarketFailReason,
        details: deadMarketFailReason ? 'feed/movement guard' : ''
      };

      let cseaSeFail = false;
      let cseaSeDetails = '';
      if (S.cseaSeFilterEnabled) {
        const dirSign = decision.direction === 'BUY' ? 1 : -1;
        const trendDir = evalCtx.trendDirRaw;
        const csOk = Math.abs(trendDir) >= 0.25 && Math.sign(trendDir) === dirSign;
        const emaAligned = (decision?.trendAligned === true)
          || ((Number(decision?.biasDir || 0) !== 0) && Math.sign(Number(decision?.biasDir || 0)) === dirSign);
        const stochRaw = Number(decision?.stochastic ?? decision?.scoreCard?.stochastic ?? decision?.confirmation?.stochastic ?? NaN);
        const seOk = Number.isFinite(stochRaw)
          ? ((decision.direction === 'BUY' && stochRaw <= 85) || (decision.direction === 'SELL' && stochRaw >= 15))
          : true;
        cseaSeFail = !(csOk && emaAligned && seOk);
        if (cseaSeFail) {
          const failed = [];
          if (!csOk) failed.push('CS');
          if (!emaAligned) failed.push('EA');
          if (!seOk) failed.push('SE');
          cseaSeDetails = `mismatch:${failed.join('+') || 'UNKNOWN'} (cs:${csOk ? 1 : 0},ea:${emaAligned ? 1 : 0},se:${seOk ? 1 : 0})`;
        }
      }
      filterResults.csea_se = {
        pass: !cseaSeFail,
        reason: cseaSeFail ? 'csea_se' : '',
        details: cseaSeFail ? cseaSeDetails : ''
      };

      let chopHardFail = false;
      if (S.chopV5HardStopEnabled) {
        const rg = String(decision?.regime?.state || '').toLowerCase();
        const isChop = rg === 'chop' || ((Number(decision?.regime?.rangePct || 0) < 0.0035) && Number(decision?.regime?.trendScore || 0) < 0.4);
        chopHardFail = !!isChop;
      }
      filterResults.chop_hard_stop = {
        pass: !chopHardFail,
        reason: chopHardFail ? 'chop_hard_stop' : '',
        details: chopHardFail ? 'chop regime' : ''
      };

      const spikeFail = S.spikeProtectionEnabled
        && ((decision.direction === 'BUY' && S.blockBuy) || (decision.direction === 'SELL' && S.blockSell));
      filterResults.spike_protection = {
        pass: !spikeFail,
        reason: spikeFail ? 'Spike trend-follow only' : '',
        details: spikeFail ? 'spike block active' : ''
      };

      // persist shared runtime filter snapshot for scoring/execution phases
      decision.filterResults = filterResults;

      // Phase 2: scoring (uses evaluated filterResults only)
      const sharedFilterResults = decision.filterResults || filterResults;
      const strategyPoints = (decision?.strategyKey && isStrategyEnabled(decision.strategyKey)) ? 2 : 0;
      const filterPoints = filterOrder.reduce((sum, key) => sum + (sharedFilterResults[key]?.pass ? 1 : 0), 0);
      const runtimePoints = strategyPoints + filterPoints;
      const runtimeThreshold = getScoreThresholdPoints();
      decision.scoreCard = {
        points: Number(runtimePoints.toFixed(1)),
        maxPoints: 11,
        threshold: runtimeThreshold,
        hardFailReason: '',
        breakdown: [
          `STRATEGY_SOURCE: ${strategyPoints}/2`,
          ...filterOrder.map((key) => {
            const base = `${key}: ${sharedFilterResults[key]?.pass ? 'PASS' : 'SKIP'}${sharedFilterResults[key]?.reason ? ` (${sharedFilterResults[key].reason})` : ''}`;
            const details = String(sharedFilterResults[key]?.details || '');
            if (key === 'drift' && details) return `${base} | ${details}`;
            return base;
          }),
          ...(decision.rangeOscPenaltyDebug ? [decision.rangeOscPenaltyDebug] : []),
          `TOTAL: ${Number(runtimePoints.toFixed(1))}/11 | праг ${runtimeThreshold}`
        ]
      };

      // Phase 3: execution decision (no recalculation; consume shared filterResults only)
      const firstFailedFilter = filterOrder.find((key) => !sharedFilterResults[key]?.pass);
      if (firstFailedFilter) {
        setSkipReason(sharedFilterResults[firstFailedFilter].reason || firstFailedFilter);
        continue;
      }
const frozenSignal = {
          asset: assetLabel,
          assetSearch,
          isOTC: /OTC/i.test(assetLabel || ''),
          tfKey: decision.tfKey,
          direction: decision.direction,
          confidence: decision.confidence,
          strategyKey: decision.strategyKey,
          strategyVotes: decision._strategyVotes || { buy: 0, sell: 0 },
          regime: decision.regime,
          biasDir: decision.biasDir,
          confirmation: decision.confirmation,
          timeInCandle: decision.timeInCandle,
          entryWindowSec: decision.entryWindowSec,
          candleStart: decision.candleStart,
          scoreCard: decision.scoreCard || null,
          frozenAt: Date.now(),
          priceAtDecision: Number(S.currentAssetPrice),
          rawText: `[killer:${decision.tfKey}]`,
          traceId: String(decision.traceId || buildSignalTraceId(decision))
        };
        const signal = {
          asset: frozenSignal.asset,
          assetSearch: frozenSignal.assetSearch,
          isOTC: frozenSignal.isOTC,
          direction: frozenSignal.direction,
          strategyKey: frozenSignal.strategyKey,
          confidence: frozenSignal.confidence,
          entryMeta: {
            strategyKey: frozenSignal.strategyKey,
            tfKey: frozenSignal.tfKey,
            scoreCard: frozenSignal.scoreCard,
            regime: frozenSignal.regime,
            biasDir: frozenSignal.biasDir,
            confirmation: frozenSignal.confirmation,
            timeInCandle: frozenSignal.timeInCandle,
            entryWindowSec: frozenSignal.entryWindowSec,
            rangePct: decision.rangePct,
            trendDir: decision.trendDir,
            trendAligned: decision.trendAligned,
            volumeOk: decision.volumeOk,
            strategyVotes: frozenSignal.strategyVotes,
            frozenAt: frozenSignal.frozenAt,
            candleStart: frozenSignal.candleStart,
            priceAtDecision: frozenSignal.priceAtDecision
          },
          expiry: frozenSignal.tfKey.toUpperCase(),
          minute: getCurrentMinute(),
          time: fmtHHMMSSUTCm3(new Date()),
          targetTsMs: now,
          rawText: frozenSignal.rawText
        };
        signal.traceId = String(frozenSignal.traceId || buildSignalTraceId(signal));
        annotateSignalTrace(signal, 'COMMIT_CANDIDATE', `${String(decision.tfKey || '1m').toLowerCase()}|${String(signal.direction || '').toUpperCase()}`);
        if (S.dynamicPreCalcEnabled && shouldUseDynamicExpiry(signal, getExpiryScopeFromAsset(signal.asset)) && signal.isOTC) {
          try {
            const prePlan = getCachedDynamicPlan(signal.expiry || decision.tfKey, signal.confidence, 'OTC', { signal });
            S.cachedDynamicPlan = prePlan || null;
            S.cachedDynamicPlanAt = Date.now();
          } catch (_) {}
        }
        if (S.burstEnabled && decision.confidence >= S.burstConfidenceThreshold) {
          signal.burstCount = Math.max(1, Math.min(S.burstTradeCount, 5));
        }

        const prevBase = S.baseAmount;
        S.baseAmount = getKillerBaseAmountCents();
        S.assetSelectedForSignal = true;
        S.assetSelectionAttempted = true;

        const inFlightKey = `${signal.asset}|${decision.tfKey}|${signal.direction}|${decision.candleStart}|${signal.expiry}`;
        if (!decision._fromPreCalc && isCandleLockedByPrecalc(decision.tfKey, decision.candleStart)) {
          continue;
        }
        if (S.killerInFlightKey === inFlightKey && Date.now() < (S.killerInFlightUntil || 0)) {
          finalizePrecalcOutcome(decision, 'dropped', 'in_flight_duplicate');
          continue;
        }
        S.killerInFlightKey = inFlightKey;
        S.killerInFlightUntil = Date.now() + 1500;
        
        // -------- Confirm Delay (delay_ms) + stability check (NO cooldown) --------

        // 1) Quick stability: streak (default 1 tick to reduce over-filtering latency)
        const minStreak = Math.max(1, Number.isFinite(S.confirmStreakMin) ? S.confirmStreakMin : 1);
        if ((decision._dirStreak || 0) < minStreak) {
          finalizePrecalcOutcome(decision, 'dropped', 'dir_streak');
          S.killerInFlightUntil = 0;
          S.baseAmount = prevBase;
          S.assetSelectedForSignal = false;
          S.assetSelectionAttempted = false;
          continue;
        }

        // 2) Removed extra anti-flip vote gate here to reduce duplicate post-ready blocking.

        const confirmDelayMs = decision._fromPreCalc ? 0 : getAdaptiveConfirmDelayMs(decision.tfKey);
        const frozenSignalBaseConfidence = Number(frozenSignal.confidence || 0);
        let finalConfidence = frozenSignalBaseConfidence;
        if (confirmDelayMs > 0) {
          await new Promise(r => setTimeout(r, confirmDelayMs));

          if (S.entryWindowTfEnabled) {
            const t2 = getTimeInCandleSec(decision.windowMs);
            const baseLimit2 = (decision.tfKey === '1m') ? (S.entryWindowSec1m ?? 15)
              : (decision.tfKey === '3m') ? (S.entryWindowSec3m ?? 35)
              : (decision.tfKey === '5m') ? (S.entryWindowSec5m ?? 0)
              : 0;
            const limit2 = Math.min(999, Math.max(0, Math.round(baseLimit2)));
            if (limit2 > 0 && t2 > limit2) {
              S.killerInFlightUntil = 0;
              S.baseAmount = prevBase;
              S.assetSelectedForSignal = false;
              S.assetSelectionAttempted = false;
              continue;
            }
          }

          const latestFrozenPool = getStrategyDecisions(decision.tfKey).filter((d) => d?.direction === frozenSignal.direction);
          const latestFrozenConf = latestFrozenPool.length ? Math.max(...latestFrozenPool.map((d) => Number(d.confidence || 0))) : 0;
          finalConfidence = latestFrozenPool.length ? latestFrozenConf : 0;
          if (finalConfidence <= 0) {
            S.killerInFlightUntil = 0;
            S.baseAmount = prevBase;
            S.assetSelectedForSignal = false;
            S.assetSelectionAttempted = false;
            continue;
          }

          const __drop = frozenSignalBaseConfidence - finalConfidence;
          if (__drop > 0.20) {
            S.killerInFlightUntil = 0;
            S.baseAmount = prevBase;
            S.assetSelectedForSignal = false;
            S.assetSelectionAttempted = false;
            continue;
          }

          const thr = getKillerThresholdForScope();
          if (finalConfidence < thr) {
            S.killerInFlightUntil = 0;
            S.baseAmount = prevBase;
            S.assetSelectedForSignal = false;
            S.assetSelectionAttempted = false;
            continue;
          }
        }
        signal.confidence = finalConfidence;
        // ------------------------------------------------------------------------
        const execDeltaMs = Math.max(0, Date.now() - readyAtMs);
        const finalConfPct = Math.round(Number(signal?.confidence ?? frozenSignal?.confidence ?? 0) * 100);
        const tfLatch = String(decision.tfKey || '1m').toLowerCase();
        const dirLatch = String(decision.direction || '').toUpperCase();
        const latchKey = `${tfLatch}|${dirLatch}|${Number(decision.candleStart || frozenSignal.candleStart || 0)}`;
        if (S.precheckSuccessLatch.last !== latchKey) {
          S.precheckSuccessLatch.last = latchKey;
          logConsoleLine(`🟢🧭 ПРЕЧЕК УСПЕШЕН | ${tfLatch} | ${dirLatch} | ${finalConfPct}%`);
          const strategyLabel = getStrategyDisplayLabel(decision.strategyKey || '').toLowerCase();
          logConsoleLine(`🧠 DIR PICK | ${tfLatch} | ${dirLatch} | ${strategyLabel}`);
        }
        const logKey = `ready-exec:${tfLatch}:${dirLatch}`;
        if (logSpamControlled(logKey, `${baseConfPct}->${finalConfPct}:${Math.floor(execDeltaMs / 100)}`, 1200)) {
          logConsoleLine(`🧪 READY→EXEC | ${tfLatch} | ${dirLatch} | Δt=${execDeltaMs}ms | conf ${baseConfPct}%→${finalConfPct}%`);
        }
        if (S.impulseCapEnabled) {
          const tf = decision.tfKey || decision.timeframe;
          const tfMs = (tf === '1m') ? 60_000 : (tf === '3m') ? 180_000 : (tf === '5m') ? 300_000 : 0;
          if (tfMs) {
            const candleId = Math.floor(Date.now() / tfMs);
            S._impulseCap = S._impulseCap || {};
            const key = tf + '|' + decision.direction;
            const obj = (S._impulseCap[key] = S._impulseCap[key] || { candleId, count: 0 });
            if (obj.candleId !== candleId) { obj.candleId = candleId; obj.count = 0; }
            obj.count++;
          }
        }
        annotateSignalTrace(signal, 'COMMIT_ATTEMPT', `${String(signal.expiry || '1m').toLowerCase()}|${String(signal.direction || '').toUpperCase()}`);
const ok = await executeTradeOrder(signal);
        if (ok) {
          incrementObsMetric('executePass', 1);
          annotateSignalTrace(signal, 'EXECUTE_PASS', String(signal.expiry || '1m').toLowerCase());
        } else {
          incrementObsMetric('executeFail', 1);
          annotateSignalTrace(signal, 'EXECUTE_FAIL', String(S.lastSkipReason || 'blocked'));
        }
        if (decision._fromPreCalc) {
          const dropReason = String(S.lastSkipReason || 'blocked');
          finalizePrecalcOutcome(decision, ok ? 'executed' : 'dropped', dropReason);
        }
        S.killerInFlightUntil = 0;
        S.baseAmount = prevBase;
        S.assetSelectedForSignal = false;
        S.assetSelectionAttempted = false; 
        if (ok) {
          setStatusOverlay(formatStatus('killer_ready'), '', false);
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

      // Re-entry guard: never allow overlapping ticks.
      if (S.__tickBusy) {
        const nowBusy = Date.now();
        const stuckFor = nowBusy - (S.__tickBusyAt || 0);
        if (stuckFor > 4000 && nowBusy - (S.lastTickBusyWarnAt || 0) > 4000) {
          S.lastTickBusyWarnAt = nowBusy;
          logConsoleLine(`[ENGINE] Изчакване: предишният tick още работи (${Math.round(stuckFor)}ms)`);
        }
        return;
      }
      S.__tickBusy = true;
      S.__tickBusyAt = Date.now();
      try {


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
          S.killerLastDecision = null;
          S.killerTfStatus = {};
          if (isKillerMode()) {
            S.killerWarmupUntil = Date.now();
            S.readinessStartedAt = Date.now();
            S.priceHistory = [];
          }
        }
        if (!isKillerMode()) {
          updateAnalysisState();
        }
        logDiagnostics();
      }

      if (!isKillerMode() && S.analysisEnabled && S.analysisReadyAt && Date.now() < S.analysisReadyAt) {
        setStatusOverlay(formatStatus('warming_up', { seconds: Math.ceil((S.analysisReadyAt - Date.now()) / 1000) }), '', false);
      }

      await processPendingTradeConfirmations();
      if (hasActiveTrade()) {
        await finalizeActiveTrades();
      }

      await maybeSwitchIdleAsset();

      const priceStaleMs = 15000;
      if (S.lastPriceAt && Date.now() - S.lastPriceAt > priceStaleMs) {
        S.currentAssetPrice = null;
        if (!isKillerMode()) {
          S.priceHistory = [];
        }
      }

      const warm = clamp01((nowMs() - S.botStartTime) / 5000);
      renderWarmup(warm);
      if (warm < 1) { renderPendingTrades(); updateProfitDisplay(); return; }

      if (isKillerMode()) {
        await runKillerTick();
        updateDebugStateSnapshot();
        return;
      }

      if (S.autoTrade && !false && !false && !hasActiveTrade() && !false && Date.now() >= 0) {
        if (!S.selfTradeEnabled && S.analysisDirection && S.analysisConfidence >= S.analysisConfidenceThreshold) {
          const now = Date.now();
          if (now - S.lastSelfTradeHintAt > 60000) {
            S.lastSelfTradeHintAt = now;
            logConsoleLine(formatStatus('analysis_ready_selftrade_off'));
          }
        }
      }

      const selfTradeAllowed = getSelfTradeAllowed();
      if (selfTradeAllowed && !false && !false && !null && !hasActiveTrade()) {
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

      if (null && false && false && !hasActiveTrade()) {
        const sig = null;
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
            S.assetSelectedForSignal = false;
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
    
      } finally {
        try { maybeLogBaselineSnapshot(); } catch (_) {}
        S.__tickBusy = false;
        S.__tickBusyAt = 0;
      }
}

    /* ========================= ENHANCED ASSET SELECTION WITH OTC/REAL FALLBACK ========================= */
    async function selectAssetWithVerification(signal) {
      if (S.assetSelectionAttempted && !S.forceAssetSelect) return true;
      if (S.assetSelecting) return false;

      if (S.singleAssetMode) {
        const current = normalizeAssetLabel(getCurrentAssetLabel());
        const wanted = normalizeAssetLabel(signal?.asset);
        if (current && wanted && current === wanted) {
          S.assetSelecting = false;
          S.assetSelectionAttempted = true;
          S.assetSelectedForSignal = true;
          return true;
        }
      }

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

      if (false) {
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
      if ($id(C.PANEL_ID)) {
        rebindPanelPopupButtons();
        return;
      }

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
        .iaa-console-msg--attempt{ color:#fbbf24; font-weight:700; }
        .iaa-console-msg--trade{ color:#00ff6a; font-weight:800; }
        .iaa-console-msg--recheck{ color:#9ca3af; }
        .iaa-console-msg--divider{ color:#6b7280; letter-spacing:1px; }
        .iaa-console-line--compact .iaa-console-msg{ padding-left:2px; }
        .iaa-console-line--divider{ justify-content:center; }
        .iaa-log-buy{ color:#00c853; font-weight:800; }
        .iaa-log-sell{ color:#ff1744; font-weight:800; }
        .iaa-console-strategy{ color:#a5b4fc; font-weight:700; }
        .iaa-console-actions{ display:flex; gap:6px; justify-content:flex-end; align-items:center; }
        #iaa-console-analyze{ color:#f59e0b; }
        #iaa-console-copy{ color:#34d399; }
        #iaa-console-clear{ color:#f87171; }
#iaa-console-copy, #iaa-console-clear, #iaa-console-analyze{ align-self:flex-end; padding:4px 8px; border-radius:6px; border:1px solid rgba(255,255,255,.12); background:#111; font-size:10px; cursor:pointer; letter-spacing:.08em; }
        #iaa-console-copy:hover, #iaa-console-clear:hover, #iaa-console-analyze:hover{ background:#1f1f1f; }
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
        #iaa-feed-cloud{ align-self:flex-end; font-size:10px; color:#d1d5db; background:rgba(17,24,39,.9); border:1px solid rgba(96,165,250,.35); border-radius:999px; padding:4px 8px; max-width:100%; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        #iaa-session-mini{ align-self:flex-end; font-size:10px; color:#cbd5e1; margin-top:2px; white-space:nowrap; opacity:.95; }
        #iaa-session-mini .mini-pnl.pos{ color:#22c55e; font-weight:700; }
        #iaa-session-mini .mini-pnl.neg{ color:#ef4444; font-weight:700; }
        #iaa-session-mini .mini-w{ color:#22c55e; font-weight:700; }
        #iaa-session-mini .mini-l{ color:#ef4444; font-weight:700; }

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

        .iaa-field-row.iaa-inline-newfilter{ justify-content:flex-start; flex-wrap:nowrap; }
        .iaa-field-row.iaa-inline-newfilter .iaa-checkbox{ flex:1 1 auto; }
        .iaa-field-row.iaa-inline-newfilter .iaa-field-label{ width:auto; white-space:nowrap; opacity:.9; }
        .iaa-field-row.iaa-inline-newfilter input{ width:46px; }
        .iaa-field-row.iaa-max-row{ flex-wrap:nowrap; }
        .iaa-field-row.iaa-max-row input{ width:46px; }
        .iaa-field-row.iaa-compact-row{ margin:0; }
        .iaa-grid-2{ display:grid; grid-template-columns:1fr 1fr; gap:8px; margin:6px 0 10px; }
        .iaa-checkbox-row{ display:flex; flex-wrap:wrap; gap:10px; margin:6px 0 10px; }
        .iaa-max-row{ justify-content:flex-start; flex-wrap:wrap; }
        .iaa-max-row .iaa-field-label{ flex:0 0 auto; white-space:nowrap; }
        .iaa-max-row .iaa-mini-label{ opacity:.85; font-size:11px; white-space:nowrap; }
        .iaa-max-row input{ width:64px; }

        .iaa-field-row input{ width:90px; padding:4px 6px; border-radius:6px; border:1px solid rgba(255,255,255,.1); background:rgba(0,0,0,.3); color:#fff; font-weight:700; }
        .iaa-field-row select{ width:110px; padding:4px 6px; border-radius:6px; border:1px solid rgba(255,255,255,.16); background:#0b1220; color:#e5e7eb; font-weight:700; }
        .iaa-field-row select option{ background:#0b1220; color:#e5e7eb; }
        .iaa-field-label{ font-size:11px; color:#9ca3af; }
        .iaa-mini-bar{ font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; font-size:10px; color:#6b7280; margin-left:6px; margin-right:6px; white-space:nowrap; flex:0 0 auto; }
        .iaa-subtitle-new{ color:#ffcc66; }
        .iaa-new-setting{ color:#ffcc66; }
        .iaa-inline-bar{ align-items:center; }

        .iaa-subtitle-new{ color:#ffb020; }
        .iaa-new-setting{ color:#ffd36a; }
        .iaa-field-hint{ font-size:10px; color:#6b7280; margin-left:6px; }
        .iaa-subtitle{ margin-top:10px; font-size:11px; color:#9ca3af; font-weight:700; }
        .iaa-checkbox{ display:flex; align-items:center; gap:6px; margin:6px 0; font-size:12px; color:#e5e7eb; }
        #iaa-pt-modes-row{ justify-content:flex-start !important; align-items:center !important; gap:2px !important; flex-wrap:nowrap !important; overflow:hidden !important; }
        #iaa-pt-modes-row .iaa-field-label{ width:auto !important; margin-right:2px !important; flex:0 0 auto !important; }
        #iaa-pt-modes-group{ display:flex !important; flex-wrap:nowrap !important; gap:2px !important; margin:0 !important; }
        #iaa-pt-modes-group label{ display:inline-flex !important; align-items:center !important; gap:1px !important; margin:0 !important; padding:0 !important; flex:0 0 auto !important; white-space:nowrap !important; }
        #iaa-pt-modes-group input[type="checkbox"]{ width:auto !important; min-width:0 !important; padding:0 !important; margin:0 !important; }
        .iaa-checkbox-grid{ display:grid; grid-template-columns:repeat(2, 1fr); gap:6px 10px; font-size:12px; color:#e5e7eb; }
        .iaa-action-row{ display:flex; gap:8px; margin-top:12px; }
        .iaa-action-row button{ flex:1; padding:6px 8px; border-radius:6px; border:1px solid rgba(255,255,255,.12); background:#111; color:#e5e7eb; font-size:11px; cursor:pointer; }
        .iaa-action-row button:hover{ background:#1f2937; }
        .iaa-field-toggle input[type="text"], .iaa-field-toggle input[type="number"]{ width:70px; }
        .iaa-field-toggle label{ font-size:11px; color:#9ca3af; display:flex; align-items:center; gap:6px; }
        .iaa-toggle-btn{ background:#111827; color:#e5e7eb; border:1px solid rgba(255,255,255,.18); border-radius:6px; padding:2px 6px; cursor:pointer; }
        .iaa-toggle-btn:hover{ background:#1f2937; }

        /* Mouse Panel */
        #iaa-mouse-panel{
          display:none; position:absolute; top:50%; left:50%; transform:translate(-50%, -50%);
          width:420px; background:#000; border:1px solid rgba(255,255,255,.15);
          border-radius:14px; padding:16px; z-index:2147483647;
          box-shadow:0 12px 40px rgba(0,0,0,.8); max-height:80vh; overflow-y:auto;
          font-family:system-ui, Arial !important;
        }
        #iaa-mouse-close{ position:absolute; top:8px; right:8px; background:none; border:none; color:#fff; font-size:16px; cursor:pointer; }

        .iaa-controls{ display:flex; justify-content:space-between; align-items:center; margin-top:8px; padding-top:8px; border-top:1px solid rgba(255,255,255,.05); position:relative; z-index:5; pointer-events:auto;}
        .iaa-control-btn{ width:36px; height:36px; border-radius:50%; background:#252525; color:#fff; font-size:14px; border:1px solid rgba(255,255,255,.1); cursor:pointer; display:flex; align-items:center; justify-content:center; pointer-events:auto; }
        .iaa-control-btn:hover{ background:#333; }

        #iaa-debug-panel{
          display:none; position:absolute; top:50%; left:50%; transform:translate(-50%, -50%);
          width:360px; background:#000; border:1px solid rgba(255,255,255,.15);
          border-radius:14px; padding:16px; z-index:2147483648;
          box-shadow:0 12px 40px rgba(0,0,0,.8); max-height:80vh; overflow-y:auto;
          font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size:11px; color:#e5e7eb;
        }
        #iaa-killer-panel{
          display:none; position:fixed; top:120px; right:20px;
          width:300px; background:#071019; border:1px solid rgba(34,211,238,.45);
          border-radius:12px; padding:10px; z-index:2147483648;
          box-shadow:0 12px 40px rgba(0,0,0,.8); color:#d1fae5;
          font-family:system-ui, Arial !important; cursor:default;
        }
        #iaa-killer-close{ position:absolute; top:6px; right:8px; background:none; border:none; color:#fff; font-size:15px; cursor:pointer; }
        #iaa-killer-header{ font-weight:800; color:#22d3ee; margin-bottom:8px; letter-spacing:.02em; cursor:move; user-select:none; }
        #iaa-killer-content{ font-size:11px; display:grid; gap:6px; }
        .iaa-killer-row{ display:flex; justify-content:space-between; gap:10px; }
        .iaa-killer-key{ color:#93c5fd; }
        .iaa-killer-val{ color:#e5e7eb; font-weight:700; }
        .iaa-killer-pill{ display:inline-block; padding:1px 6px; border-radius:999px; font-size:10px; font-weight:800; }
        .iaa-killer-buy{ background:rgba(34,197,94,.18); color:#22c55e; }
        .iaa-killer-sell{ background:rgba(239,68,68,.18); color:#ef4444; }
        .iaa-killer-wait{ background:rgba(148,163,184,.2); color:#cbd5e1; }
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
          </div>
          <div id="iaa-loader-wrapper" class="loader-wrapper">
            <div id="iaa-console" class="iaa-console">
              <div id="iaa-console-lines"></div>
      <div id="iaa-console-actions" class="iaa-console-actions">
      <button id="iaa-console-analyze" type="button">АНАЛИЗ</button>
      <button id="iaa-console-copy" type="button">КОПИРАЙ</button>
      <button id="iaa-console-clear" type="button">ИЗЧИСТИ</button>
      </div>
              <div id="iaa-status-overlay"></div>
              <div id="iaa-countdown"></div>
            </div>
            <div id="iaa-direction-indicator"></div>
            
          </div>
        </div>
        <div class="iaa-grid">
  <div class="iaa-grid-row">
    <div class="k blue">Актив</div><div id="iaa-asset" class="v strong">—</div>
    <div class="k">Изтичане</div><div id="iaa-exp" class="v">1m</div>
  </div>
</div>
</div>
        <div class="iaa-balance-summary">
          <div class="iaa-balance-row">
            <span class="iaa-balance-label" style="font-weight:700;">Начало</span>
            <span id="iaa-balance-start-time" class="iaa-balance-value">—</span>
          </div>
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
<div class="iaa-tf-cell" data-tf="1m"><span id="iaa-tf-dot-1m" class="iaa-tf-dot"></span><span id="iaa-tf-1m">1m —</span></div>
          <div class="iaa-tf-cell" data-tf="3m"><span id="iaa-tf-dot-3m" class="iaa-tf-dot"></span><span id="iaa-tf-3m">3m —</span></div>
          <div class="iaa-tf-cell" data-tf="5m"><span id="iaa-tf-dot-5m" class="iaa-tf-dot"></span><span id="iaa-tf-5m">5m —</span></div>
          <div class="iaa-tf-cell" data-tf="15m"><span id="iaa-tf-dot-15m" class="iaa-tf-dot"></span><span id="iaa-tf-15m">15m —</span></div>
        </div>
        <div id="iaa-warm" class="warmup red">ENGINE 0% ЗАГРЯВА</div>
        <div id="iaa-feed-cloud">Цена: — • История: 0</div>
        <div id="iaa-session-mini">PnL — • W 0 • L 0 • WR 0% • T 0</div>

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

        <div id="iaa-killer-panel">
          <button id="iaa-killer-close">×</button>
          <div id="iaa-killer-header">KILLER V1</div>
          <div id="iaa-killer-content"></div>
        </div>

        <div id="iaa-calibration-panel">
          <button id="iaa-calibration-close">×</button>
          <div style="font-weight:800;margin-bottom:8px;color:#ffffff;letter-spacing:.2px;">
            Калибрация TIME/Expiry (Shift+W)
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:8px;">
            <button id="iaa-cal-open" type="button" style="padding:7px 10px;border-radius:8px;border:1px solid rgba(255,255,255,.18);background:#16233a;color:#ffffff;font-weight:700;cursor:pointer;">
              TIME (OPEN)
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
            <button id="iaa-cal-m15" type="button" style="padding:7px 10px;border-radius:8px;border:1px solid rgba(255,255,255,.18);background:#111827;color:#ffffff;font-weight:700;cursor:pointer;">
              15m
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
          </div>
        </div>

        <div id="iaa-settings-panel">
          <button id="iaa-settings-close">×</button>
<div id="iaa-settings-killer" style="display:block;">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin:8px 0;">
              <div style="font-weight:700;color:#e5e7eb;">Настройки</div>
              <button id="iaa-killer-collapse" type="button" class="iaa-toggle-btn">▾</button>
            </div>
            <div id="iaa-killer-settings-body">
              <div class="iaa-tab-row">
                <button class="iaa-tab-btn active" data-tab="basic">ОСНОВНИ</button>
                <button class="iaa-tab-btn" data-tab="advanced">РАЗШИРЕНИ</button>
                                <button class="iaa-tab-btn" data-tab="analyses">СТРАТЕГИИ</button>
                <button class="iaa-tab-btn" data-tab="dynamic">DYNAMIC</button>
              </div>

              <div id="iaa-tab-basic" class="iaa-tab-body">
                <div class="iaa-field-row" title="Минимална увереност за вход.">
                  <span class="iaa-field-label">Праг увереност % (1–100)</span>
                  <span class="iaa-mini-bar" id="iaa-bar-threshold"></span>
                  <input type="number" inputmode="decimal" id="iaa-killer-threshold" min="1" max="100" step="1" value="65">
                </div>
                <div class="iaa-subtitle" style="color:${UI_WARM_RED};">Време за готовност/История</div>
                <div class="iaa-grid-2">
                  <div class="iaa-field-row iaa-compact-row" title="Минимални готови барове за 1m потвърждение.">
                    <span class="iaa-field-label">1m свещи</span>
                    <input type="number" id="iaa-partner-ready-1m" min="1" max="40" step="1" value="10">
                  </div>
                  <div class="iaa-field-row iaa-compact-row" title="Минимални готови барове за 3m потвърждение.">
                    <span class="iaa-field-label">3m свещи</span>
                    <input type="number" id="iaa-partner-ready-3m" min="1" max="40" step="1" value="6">
                  </div>
                  <div class="iaa-field-row iaa-compact-row" title="Минимални готови барове за 5m потвърждение.">
                    <span class="iaa-field-label">5m свещи</span>
                    <input type="number" id="iaa-partner-ready-5m" min="1" max="40" step="1" value="3">
                  </div>
                  <div class="iaa-field-row iaa-compact-row" title="Минимални готови барове за 15m потвърждение.">
                    <span class="iaa-field-label">15M свещи</span>
                    <input type="number" id="iaa-partner-ready-15m" min="1" max="40" step="1" value="2">
                  </div>
                </div>
                <div class="iaa-field-row" title="Базова сума на сделката в долари.">
                  <span class="iaa-field-label">Базова сума ($)</span>
                  <input type="number" id="iaa-killer-base" min="1" step="1" value="100">
                </div>
                <div class="iaa-field-row iaa-field-toggle" title="Когато е OFF ботът не променя сумата в платформата и използва текущата зададена сума.">
                  <span class="iaa-field-label">Синхронизирай сума с платформата</span>
                  <label class="iaa-checkbox"><input type="checkbox" id="iaa-amount-sync-enabled" checked> </label>
                </div>
                <div class="iaa-field-row iaa-field-toggle" title="Минимален payout за допускане на сделка. (60–92%)">
  <span class="iaa-field-label">Мин. Payout %</span>
  <label class="iaa-checkbox"><input type="checkbox" id="iaa-killer-min-payout-enabled" checked> </label>
  <input type="number" id="iaa-killer-min-payout" min="60" max="92" step="1" value="70">
</div>
                <div class="iaa-field-row iaa-field-toggle iaa-max-row" title="Филтър за късен вход по TF (0=без лимит).">
                  <span class="iaa-field-label">Ранен вход </span>
                  <label class="iaa-checkbox"><input type="checkbox" id="iaa-entrywin-enabled" checked> </label>
                  <span class="iaa-mini-label">1m</span>
                  <input type="number" id="iaa-entrywin-1m" min="0" max="999" step="1" value="15" title="0=без лимит">
                  <span class="iaa-mini-label">3m</span>
                  <input type="number" id="iaa-entrywin-3m" min="0" max="999" step="1" value="35" title="0=без лимит">
                </div>
                <div class="iaa-field-row iaa-field-toggle iaa-max-row" title="Филтър за късен вход по TF (0=без лимит).">
                  <span class="iaa-field-label">Ранен вход 5m</span>
                  <span class="iaa-mini-label">5m</span>
                  <input type="number" id="iaa-entrywin-5m" min="0" max="999" step="1" value="150" title="0=без лимит">
                </div>

                <div class="iaa-field-row iaa-max-row" title="Лимити: макс. сделки на минута и макс. отворени сделки.">
                  <span class="iaa-field-label">Макс:</span>
                  <span class="iaa-mini-label">/мин</span>
                  <input type="number" id="iaa-max-trades-per-minute" min="0" step="1" value="0">
                  <span class="iaa-mini-label">отворени</span>
                  <input type="number" id="iaa-max-open-trades" min="1" step="1" value="1">
                </div>

                <div class="iaa-subtitle" style="color:${UI_WARM_RED};">Таймфрейми</div>
                <div class="iaa-checkbox-row">                  <label title="Включва 1m в анализите."><input type="checkbox" id="iaa-feature-tf-1m"> 1m</label>
                  <label title="Включва 3m в анализите."><input type="checkbox" id="iaa-feature-tf-3m"> 3m</label>
                  <label title="Включва 5m в анализите."><input type="checkbox" id="iaa-feature-tf-5m"> 5m</label>
                  <label title="Включва 15m в анализите."><input type="checkbox" id="iaa-feature-tf-15m"> 15m</label>                </div>
                <label class="iaa-checkbox" title="Предотвратява приспиване на таба."><input type="checkbox" id="iaa-killer-keep-alive"> <span id="iaa-killer-keepalive-label">Дръж таба активен</span></label>
</div>

              <div id="iaa-tab-advanced" class="iaa-tab-body" style="display:none;">
              <div class="iaa-subtitle iaa-subtitle-new" style="color:${UI_WARM_RED};" title="Нови опции за тайминг (влизане по-рано и след pullback).">TIMING</div>
                 <label class="iaa-checkbox iaa-new-setting" title="Catch the move: позволява по-ранен вход когато увереността расте бързо и има тренд. Не променя стратегията, само тайминга."><input type="checkbox" id="iaa-phase-catch-move"> Catch the move</label>
                 <label class="iaa-checkbox iaa-new-setting" title="Snipe after reload: позволява вход след кратък pullback/колебание, когато сигналът се върне в посоката на тренда. Не променя стратегията, само тайминга."><input type="checkbox" id="iaa-phase-reload-snipe"> Snipe after reload</label>
                                <div class="iaa-field-row"><span class="iaa-field-label" style="color:${UI_WARM_RED};">НОВИ • ФИЛТРИ</span><button id="iaa-newfilters-toggle" type="button" class="iaa-toggle-btn">${S.killerNewFiltersCollapsed ? '▸' : '▾'}</button></div>
                                <div id="iaa-bias-body" style="display:none;">
                                  <div class="iaa-field-row" title="Настройки за посоков филтър (BIAS)."><span class="iaa-field-label" style="color:${UI_WARM_RED};">BIAS</span><button id="iaa-bias-toggle" type="button" class="iaa-toggle-btn">▸</button></div>
                                  <div id="iaa-bias-panel" style="display:none;">
                                    <div class="iaa-field-row iaa-field-toggle" title="Включва/изключва BIAS филтъра при оценка на посоката."><span class="iaa-field-label">BIAS активен</span><label class="iaa-checkbox"><input type="checkbox" id="iaa-bias-enabled"></label></div>
                                    <div class="iaa-field-row" title="Точки: само по точки. Хибрид: комбинира точки и посочен филтър за по-строг контрол."><span class="iaa-field-label">Режим BIAS</span><select id="iaa-bias-mode"><option value="points">Точки</option><option value="hybrid">Хибрид</option></select>
                    <span class="iaa-mini-label">Мин. сила за Bias точка</span>
                    <select id="iaa-bias-point-min-strength"><option value="low">Ниска</option><option value="medium" selected>Средна</option><option value="high">Висока</option></select></div>
                                    <div class="iaa-field-row" title="Праг за „силен“ BIAS. По-висока стойност = по-строг филтър."><span class="iaa-field-label">Праг силен BIAS</span><input type="number" id="iaa-bias-strong-threshold" min="0.20" max="0.80" step="0.01"></div>
                                  </div>
                                </div>
                                <div id="iaa-stability-body" style="display:none;">
                                  <div class="iaa-field-row" title="Настройки за стабилност на сигнала (STABILITY)."><span class="iaa-field-label" style="color:${UI_WARM_RED};">STABILITY</span><button id="iaa-stability-toggle" type="button" class="iaa-toggle-btn">▸</button></div>
                                  <div id="iaa-stability-panel" style="display:none;">
                                    <div class="iaa-field-row iaa-field-toggle" title="Включва/изключва STABILITY филтъра за стабилност на сигнала."><span class="iaa-field-label">STABILITY активен</span><label class="iaa-checkbox"><input type="checkbox" id="iaa-stability-enabled"></label></div>
                                    <div class="iaa-field-row" title="Максимален допустим интервал между валидни обновявания (в ms) преди сигналът да се счита нестабилен."><span class="iaa-field-label">Макс. gap (ms)</span><input type="number" id="iaa-stability-max-gap-ms" min="1000" max="8000" step="100"></div>
                                    <div class="iaa-field-row" title="Определя как да се допусне near-miss: по увереност, по Perfect Time, или по който и да е от двата сигнала."><span class="iaa-field-label" style="color:${UI_WARM_RED};">Режим толеранс</span><select id="iaa-tolerance-mode"><option value="either">Увереност ИЛИ PT</option><option value="confidence">Само увереност</option><option value="pt">Само PT</option><option value="off">Изключен</option></select></div>
                                    <div class="iaa-field-row" title="Минимална увереност за near-miss при режим толеранс."><span class="iaa-field-label">Праг толеранс</span><input type="number" id="iaa-tolerance-confidence" min="0.60" max="0.95" step="0.01"></div>
                                  </div>
                                </div>
                                <div id="iaa-deadmarket-body" style="">
                                  <div class="iaa-field-row" title="Филтър за мъртъв пазар: блокира входове при минимално движение и/или остарели обновявания."><span class="iaa-field-label" style="color:${UI_WARM_RED};">Филтри Мъртъв пазар</span><button id="iaa-deadmarket-toggle" type="button" class="iaa-toggle-btn">▸</button></div>
                                  <div id="iaa-deadmarket-panel" style="display:none;">
                                    <div class="iaa-field-row iaa-field-toggle" title="Включва/изключва Velocity филтъра за мъртъв пазар."><span class="iaa-field-label">Velocity филтър</span><label class="iaa-checkbox"><input type="checkbox" id="iaa-deadmarket-enabled"></label></div>
                                    <div class="iaa-field-row" title="Минимално движение за валиден пазар. Ако движението е по-малко, сигналът се пропуска."><span class="iaa-field-label">Мин. движение</span><input type="number" id="iaa-deadmarket-min-move" min="0.00001" max="0.01000" step="0.00001" value="0.00010"></div>
                                    <div class="iaa-field-row" title="Минимален latency budget (ms). Ако последният tick е по-стар, сигналът се пропуска."><span class="iaa-field-label">Мин. latency budget (ms)</span><input type="number" id="iaa-deadmarket-min-latency" min="200" max="10000" step="50" value="1500"></div>
                                  </div>
                                  <div class="iaa-field-row" title="Настройки за Engine Guard филтри."><span class="iaa-field-label" style="color:${UI_WARM_RED};">Engine Guard</span><button id="iaa-engine-guard-toggle" type="button" class="iaa-toggle-btn">▸</button></div>
                                  <div id="iaa-engine-guard-panel" style="display:none;">
                                    <div class="iaa-field-row iaa-field-toggle" title="Филтър за прекален импулс. По-ниска стойност = по-строг филтър.">
                                      <label class="iaa-checkbox"><input type="checkbox" id="iaa-engine-impulse-enabled"> Impulse Extension</label>
                                      <input type="number" id="iaa-engine-impulse" min="0.20" max="1.00" step="0.05" value="0.70">
                                    </div>
                                    <div class="iaa-field-row iaa-field-toggle" title="Филтър за стабилност на микро тренда. По-висока стойност = по-строг филтър.">
                                      <label class="iaa-checkbox"><input type="checkbox" id="iaa-engine-noise-enabled"> Micro Tr. Stability</label>
                                      <input type="number" id="iaa-engine-noise" min="0.30" max="1.00" step="0.05" value="0.55">
                                    </div>
                                    <div class="iaa-field-row" title="Изисква посоката да се задържи X секунди преди вход.">
                                      <span class="iaa-field-label">Engine Stabilizer (сек.)</span>
                                      <input type="number" id="iaa-engine-stabilizer-sec" min="0" max="20" step="1" value="3">
                                    </div>
                                  </div>
                                  <div class="iaa-field-row" title="Професионални филтри за вход."><span class="iaa-field-label" style="color:#fbbf24;">PRO Filters</span><button id="iaa-pro-filters-toggle" type="button" class="iaa-toggle-btn">▸</button></div>
                                  <div id="iaa-pro-filters-panel" style="display:none; margin-left:8px;">
                                    <div class="iaa-field-row iaa-field-toggle"><label class="iaa-checkbox"><input type="checkbox" id="iaa-pro-precalc-enabled"> Предварителен анализ 55–59s</label></div>
                                    <div class="iaa-field-row iaa-field-toggle"><label class="iaa-checkbox"><input type="checkbox" id="iaa-pro-drift-enabled"> Drift защита</label></div>
                                    <div class="iaa-field-row iaa-field-toggle"><label class="iaa-checkbox"><input type="checkbox" id="iaa-pro-spike-enabled"> Волатилен Spike</label></div>
                                    <div class="iaa-field-row iaa-field-toggle">
                                      <label class="iaa-checkbox"><input type="checkbox" id="iaa-pro-doji-enabled"> Doji филтър</label>
                                      <span class="iaa-mini-label">Чувствителност</span>
                                      <input type="number" id="iaa-pro-doji-sensitivity" min="1" max="50" step="1" value="15"><span class="iaa-mini-label">%</span>
                                    </div>
                                    <div class="iaa-field-row iaa-field-toggle">
                                      <label class="iaa-checkbox"><input type="checkbox" id="iaa-pro-sr-enabled"> Отскок S/R</label>
                                      <span class="iaa-mini-label">Свещи</span>
                                      <input type="number" id="iaa-pro-sr-lookback" min="5" max="120" step="1" value="20">
                                    </div>
                                  </div>
                                </div>
                <div id="iaa-newfilters-body" style="${S.killerNewFiltersCollapsed ? 'display:none;' : ''}">


        <div class="iaa-field-row iaa-inline-newfilter" title="Минимална разлика между BUY и SELL увереност (в процентни пункта), за да се филтрира шум.">
          <label class="iaa-checkbox iaa-new-setting"><input type="checkbox" id="iaa-spread-enabled"> Spread BUY↔SELL (п.п.)</label>
          <span class="iaa-field-label iaa-new-setting">п.п.</span>
          <input id="iaa-spread-threshold" type="number" min="0" max="100" step="1" value="20"/>
          <span class="iaa-mini-bar" id="iaa-spread-bar"></span>
        </div>

        <div class="iaa-field-row iaa-inline-newfilter" title="Блокира вход, ако увереността пада 4 поредни тика с минимум X процентни пункта.">
          <label class="iaa-checkbox iaa-new-setting"><input type="checkbox" id="iaa-drift-enabled"> Drift спад увереност (п.п.)</label>
          <span class="iaa-field-label iaa-new-setting">п.п.</span>
          <input id="iaa-drift-threshold" type="number" min="0" max="100" step="1" value="10"/>
          <span class="iaa-mini-bar" id="iaa-drift-bar"></span>
        </div>


        <div class="iaa-field-row iaa-inline-newfilter" title="Наказва увереността в range/chop режим (в проценти).">
          <label class="iaa-checkbox iaa-new-setting"><input type="checkbox" id="iaa-range-osc-penalty-enabled"> Range osc наказание</label>
          <span class="iaa-field-label iaa-new-setting">%</span>
          <input id="iaa-range-osc-penalty" type="number" min="0" max="50" step="1" value="20"/>
        </div>
        <div class="iaa-field-row iaa-inline-newfilter" title="Изчакване в секунди преди обръщане на посока след последна сделка.">
          <label class="iaa-checkbox iaa-new-setting"><input type="checkbox" id="iaa-flipdelay-enabled"> Flip delay/импулс обръщане</label>
          <span class="iaa-field-label iaa-new-setting">сек</span>
          <input id="iaa-flipdelay-sec" type="number" min="0" max="300" step="1" value="20"/>
        </div>

        <div class="iaa-field-row iaa-inline-newfilter">
          <label class="iaa-checkbox iaa-new-setting"><input type="checkbox" id="iaa-impulsecap-enabled"> Impulse/лимит входове/свещ</label>
          <span class="iaa-field-label iaa-new-setting">макс</span>
          <input id="iaa-impulsecap-max" type="number" min="1" max="5" step="1" value="2"/>
          <span class="iaa-mini-bar" id="iaa-impulsecap-bar"></span>
        </div>

        <div class="iaa-field-row iaa-inline-newfilter" title="Допуска вход само при едновременно потвърждение от Custom Supertrend + EMA alignment + Stochastic Extreme.">
          <label class="iaa-checkbox iaa-new-setting"><input type="checkbox" id="iaa-csea-se-enabled"> <span style="color:#fde68a;">НОВИ ФИЛТРИ (CS + EA + SE)</span></label>
        </div>


        </div>

                
                <div class="iaa-field-row" title="Лимит за максимална загуба за сесия.">
                  <span class="iaa-field-label">Стоп при загуба (€)</span>
                  <input type="number" id="iaa-killer-max-session-loss" min="0" step="1" value="0">
                </div>
                <div class="iaa-field-row" title="Лимит за поредни загуби преди пауза.">
                  <span class="iaa-field-label">Поредни загуби</span>
                  <input type="number" id="iaa-killer-max-loss-streak" min="0" step="1" value="0">
                </div>
              </div>
              </div>

              <div id="iaa-tab-features" class="iaa-tab-body" style="display:none;">
                
                
              </div>

              <div id="iaa-tab-analyses" class="iaa-tab-body" style="display:none;">
                <div class="iaa-subtitle" style="color:${UI_WARM_RED};">Стратегии</div>
                <label class="iaa-checkbox"><input type="checkbox" id="iaa-strategy-ema-rsi-pullback-enabled"> EMA+RSI Pullback</label>
                <label class="iaa-checkbox"><input type="checkbox" id="iaa-strategy-scalp-microtrend-enabled"> SCALP Microtrend</label>
                <div class="iaa-field-row" title="Търси продължение на вече започнал тренд. Входът е позволен само ако трендът още не е прекалено изчерпан.">
                  <label class="iaa-checkbox"><input type="checkbox" id="iaa-strategy-continuation-enabled"> Continuation / Продължение</label>
                  <span class="iaa-mini-label">Макс. зрялост на тренда</span>
                  <input type="number" id="iaa-strategy-continuation-maturity" min="10" max="100" step="1" value="65">
                </div>
                <label class="iaa-checkbox"><input type="checkbox" id="iaa-candle-pattern-enabled"> Candlestick Pattern On/Off</label>
                <div class="iaa-field-row" title="Компактни настройки за chop филтъра."><span class="iaa-field-label" style="color:${UI_WARM_RED};">CHOP V5.</span><button id="iaa-chop-v5-toggle" type="button" class="iaa-toggle-btn">▸</button></div>
                <div id="iaa-chop-v5-panel" style="display:none;">
                  <div class="iaa-field-row iaa-field-toggle" title="Penalty only: при chop се прилага наказание. Сила 1=ниска, 50=средна, 100=максимална.">
                    <span class="iaa-field-label">Chop on/off</span>
                    <label class="iaa-checkbox"><input type="checkbox" id="iaa-chop-v5-enabled"></label>
                    <span class="iaa-mini-label">сила</span>
                    <input type="number" id="iaa-chop-v5-strength" min="1" max="100" step="1" value="50">
                  </div>
                  <div class="iaa-field-row iaa-field-toggle" title="При включване: в chop режим се прилага твърд стоп и не се допуска вход.">
                    <span class="iaa-field-label">Hard Stop в Chop режим</span>
                    <label class="iaa-checkbox"><input type="checkbox" id="iaa-chop-v5-hardstop"></label>
                  </div>
                  <div class="iaa-field-row iaa-field-toggle" title="Ако последната свещ е срещу посоката на входа, сигналът се блокира.">
                    <span class="iaa-field-label" style="color:#fde68a;">Свещ срещу входа = твърд стоп</span>
                    <label class="iaa-checkbox"><input type="checkbox" id="iaa-killer-candle-hardstop"></label>
                  </div>
                </div>
                <div id="iaa-killer-dynamic-body">
                  <div class="iaa-field-row iaa-field-toggle" title="Включва/изключва KILLER режима.">
                    <span class="iaa-field-label" style="color:${UI_WARM_RED};">KILLER активен</span>
                    <label class="iaa-checkbox"><input type="checkbox" id="iaa-killer-enabled" checked></label>
                  </div>
<div class="iaa-field-row" title="Минимален брой съвпадения (CONFLUENCE), за да се счита сигналът за валиден.">
                    <span class="iaa-field-label">Праг Killer</span>
                    <select id="iaa-killer-threshold-mode" style="font-size:11px;">
                      <option value="7of11">7/11</option>
                      <option value="8of11">8/11</option>
                      <option value="9of11">9/11</option>
                    </select>
                  </div>
                  <div class="iaa-field-row" title="Минимално доминиране LONG/SHORT за разрешен вход.">
                    <span class="iaa-field-label">Праг доминиране (%)</span>
                    <input type="number" id="iaa-killer-dominance-threshold" min="50" max="90" step="1" value="68">
                  </div>
                  <div class="iaa-field-row iaa-field-toggle" title="Вход само при първо задействане на сигнал (edge trigger).">
                    <span class="iaa-field-label">Perfect Time (първо задействане)</span>
                    <label class="iaa-checkbox"><input type="checkbox" id="iaa-killer-perfect-time"></label>
                  </div>
                  <div class="iaa-field-row" id="iaa-pt-modes-row" title="Режими за Perfect Time. Активен е само един режим." style="justify-content:flex-start;align-items:center;gap:2px;flex-wrap:nowrap;overflow:hidden;">
                    <span class="iaa-field-label" style="margin-right:2px;">PT Режими:</span>
                    <div id="iaa-pt-modes-group" style="display:flex;flex-wrap:nowrap;gap:2px;margin:0;">
                      <label style="display:inline-flex;align-items:center;gap:1px;margin:0;padding:0;white-space:nowrap;"><input type="checkbox" id="iaa-pt-mode-soft">Soft•</label>
                      <label style="display:inline-flex;align-items:center;gap:1px;margin:0;padding:0;white-space:nowrap;"><input type="checkbox" id="iaa-pt-mode-hard">Hard•</label>
                      <label style="display:inline-flex;align-items:center;gap:1px;margin:0;padding:0;white-space:nowrap;"><input type="checkbox" id="iaa-pt-mode-adaptive">Adaptive</label>
                    </div>
                  </div>
                  <div class="iaa-field-row" title="Минимална пауза между две Perfect Time задействания за същия TF.">
                    <span class="iaa-field-label">Пауза след сигнал (сек)</span>
                    <input type="number" id="iaa-killer-cooldown-sec" min="0" max="30" step="1" value="5">
                  </div>
                  <div class="iaa-field-row iaa-field-toggle" title="Адаптивен праг: при слаб тренд (нисък ADX proxy) става по-строго, при силен тренд — по-леко.">
                    <span class="iaa-field-label">ADX динамичен праг</span>
                    <label class="iaa-checkbox"><input type="checkbox" id="iaa-killer-adx-dynamic"></label>
                  </div>
                  
                  <div class="iaa-field-row iaa-field-toggle" title="Позволява участието на Partner стратегиите в KILLER оценката.">
                    <span class="iaa-field-label">Стратегиите влияят в оценката</span>
                    <label class="iaa-checkbox"><input type="checkbox" id="iaa-killer-use-strategy-votes"></label>
                  </div>
                  <div class="iaa-field-row" title="Минимален брой стратегии в една посока, за да се зачете стратегия-вот.">
                    <span class="iaa-field-label">Мин. съгласие стратегии</span>
                    <select id="iaa-killer-strategy-agreement">
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                    </select>
                  </div>
                  <div class="iaa-field-row iaa-field-toggle" title="Подкрепящи филтри: бонус до +1.5 към effective points.">
                    <span class="iaa-field-label" style="color:${UI_WARM_RED};">Подкрепящи филтри (0.5)</span>
                    <label class="iaa-checkbox"><input type="checkbox" id="iaa-supporting-filters-enabled"></label>
                  </div>
                </div>
                <div class="iaa-field-row" title="EMA fast период.">
                  <span class="iaa-field-label">EMA Fast (2–30)</span>
                  <input type="number" id="iaa-ema-rsi-fast" min="2" max="30" step="1" value="8">
                </div>
                <div class="iaa-field-row" title="EMA slow период.">
                  <span class="iaa-field-label">EMA Slow (3–60)</span>
                  <input type="number" id="iaa-ema-rsi-slow" min="3" max="60" step="1" value="21">
                </div>
                <div class="iaa-field-row" title="RSI прозорец.">
                  <span class="iaa-field-label">RSI Window (5–30)</span>
                  <input type="number" id="iaa-ema-rsi-window" min="5" max="30" step="1" value="14">
                </div>
                <div class="iaa-field-row" title="RSI ниво за препродаденост.">
                  <span class="iaa-field-label">RSI Oversold (10–50)</span>
                  <input type="number" id="iaa-ema-rsi-oversold" min="10" max="50" step="1" value="35">
                </div>
                <div class="iaa-field-row" title="RSI ниво за прекупеност.">
                  <span class="iaa-field-label">RSI Overbought (50–90)</span>
                  <input type="number" id="iaa-ema-rsi-overbought" min="50" max="90" step="1" value="65">
                </div>
              </div>

              <div id="iaa-tab-dynamic" class="iaa-tab-body" style="display:none;">
                <div id="iaa-dynamic-core-body">
                  <div class="iaa-field-row iaa-field-toggle" title="Включва/изключва Dynamic expiry логиката. При OFF ботът използва само фиксирани времена.">
                    <span class="iaa-field-label" style="color:${UI_WARM_RED};">Динамичен режим активен</span>
                    <label class="iaa-checkbox"><input type="checkbox" id="iaa-dynamic-enabled-settings"></label>
                  </div>
                  <div class="iaa-field-row" title="Режим (Mode): Изкл / Dynamic / Smart.">
                    <span class="iaa-field-label">Режим (Mode)</span>
                    <select id="iaa-dynamic-mode">
                      <option value="off">Изкл</option>
                      <option value="dynamic">Dynamic</option>
                      <option value="hybrid">Smart</option>
                    </select>
                  </div>
                  <div class="iaa-field-row" title="Груба стъпка за първи пас на търсенето.">
                    <span class="iaa-field-label">Груба стъпка (Rough)</span>
                    <input type="number" id="iaa-dynamic-expiry-step-sec" min="1" max="30" step="1" value="5">
                  </div>
                  <div class="iaa-field-row iaa-field-toggle" title="Активира дву-етапно търсене: груб пас + прецизен пас.">
                    <span class="iaa-field-label" style="color: #fbbf24;">Дву-етапно търсене</span>
                    <label class="iaa-checkbox"><input type="checkbox" id="iaa-dynamic-two-stage-enabled"></label>
                  </div>
                  <div class="iaa-field-row" title="Прецизна стъпка за втори пас на търсенето.">
                    <span class="iaa-field-label" style="color: #fbbf24;">Прецизна стъпка (сек)</span>
                    <input type="number" id="iaa-dynamic-fine-step" min="1" max="10" step="1" value="1">
                  </div>
                  <div class="iaa-field-row" title="Минимално и максимално позволено време за Dynamic (секунди).">
                    <span class="iaa-field-label">Диапазон (Min-Max)</span>
                    <span class="iaa-mini-label">мин</span>
                    <input type="number" id="iaa-dynamic-min-sec" min="3" max="3600" step="1" value="15">
                    <span class="iaa-mini-label">макс</span>
                    <input type="number" id="iaa-dynamic-max-sec" min="3" max="3600" step="1" value="300">
                  </div>
                  <div class="iaa-field-row" title="Стъпка за вход в симулацията назад.">
                    <span class="iaa-field-label">Стъпка вход (Entry)</span>
                    <input type="number" id="iaa-dynamic-entry-step-sec" min="1" max="30" step="1" value="5">
                  </div>
                  <div class="iaa-field-row" title="Прозорец за симулация назад във времето.">
                    <span class="iaa-field-label">Lookback (сек)</span>
                    <input type="number" id="iaa-dynamic-lookback-sec" min="60" max="3600" step="5" value="600">
                  </div>
                  <div class="iaa-field-row" title="Минимален брой проби за валиден SIM резултат.">
                    <span class="iaa-field-label">Мин. проби</span>
                    <input type="number" id="iaa-dynamic-min-samples" min="5" max="1000" step="1" value="40">
                  </div>
                  <div class="iaa-field-row" title="Минимален winrate за избор на expiry от SIM.">
                    <span class="iaa-field-label">Мин. WR %</span>
                    <input type="number" id="iaa-dynamic-min-winrate" min="1" max="100" step="1" value="55">
                  </div>
                  <div class="iaa-field-row" title="Penalty при CHOP режим.">
                    <span class="iaa-field-label">Penalty Chop %</span>
                    <input type="number" id="iaa-dynamic-chop-penalty" min="0" max="100" step="1" value="3">
                  </div>
                  <div class="iaa-field-row" title="Penalty при късен вход спрямо entry window.">
                    <span class="iaa-field-label">Penalty Late %</span>
                    <input type="number" id="iaa-dynamic-late-penalty" min="0" max="100" step="1" value="2">
                  </div>
                  <div class="iaa-field-row iaa-field-toggle" title="Добавя бонус/наказание според синхрона с края на свещта.">
                    <span class="iaa-field-label" style="color: #fbbf24;">Синхрон. Свещ (Candle Sync)</span>
                    <label class="iaa-checkbox"><input type="checkbox" id="iaa-dynamic-candle-sync-enabled"></label>
                  </div>
                  <div class="iaa-field-row" title="Компенсация за UI latency при задаване на време.">
                    <span class="iaa-field-label" style="color: #fbbf24;">Комп. Латенция (ms)</span>
                    <input type="number" id="iaa-dynamic-latency-comp" min="0" max="5000" step="50" value="800">
                  </div>
                  <label class="iaa-checkbox" title="Разрешава пропуск на сделката при липса на edge."><input type="checkbox" id="iaa-dynamic-no-trade" checked> Skip при No Edge</label>
                  <div class="iaa-field-row iaa-field-toggle" title="Прави фоново предварително изчисление на dynamic плана.">
                    <span class="iaa-field-label" style="color: #fbbf24;">Фоново Изчисление</span>
                    <label class="iaa-checkbox"><input type="checkbox" id="iaa-dynamic-pre-calc-enabled"></label>
                  </div>
                  <div class="iaa-field-row iaa-field-toggle" title="Адаптира диапазона според волатилността на пазара.">
                    <span class="iaa-field-label" style="color: #fbbf24;">Адаптивна Волатилност</span>
                    <label class="iaa-checkbox"><input type="checkbox" id="iaa-dynamic-volatility-adaptive"></label>
                  </div>
                  <div class="iaa-field-row" style="margin-top:10px;"><span class="iaa-field-label" style="color:${UI_WARM_RED};">Скалиране на залога</span><button id="iaa-dynamic-stake-toggle" type="button" class="iaa-toggle-btn">▾</button></div>
                  <div id="iaa-dynamic-stake-body">
                  <label class="iaa-checkbox"><input type="checkbox" id="iaa-dynamic-stake-scale-enabled"> Скалиране по точки</label>
                  <div class="iaa-field-row"><span class="iaa-field-label">Множител при 8/11</span><input type="number" id="iaa-dynamic-stake-mult8" min="0" max="2" step="0.01" value="0.15"></div>
                  <div class="iaa-field-row"><span class="iaa-field-label">Множител при 9/11</span><input type="number" id="iaa-dynamic-stake-mult9" min="0" max="2" step="0.01" value="0.30"></div>
                  <div class="iaa-field-row"><span class="iaa-field-label">Бууст при WR >= 60%</span><input type="number" id="iaa-dynamic-stake-boost" min="0" max="1" step="0.01" value="0.05"></div>
                  <div class="iaa-field-row"><span class="iaa-field-label">Мин. проби за boost</span><input type="number" id="iaa-dynamic-stake-boost-min-samples" min="1" max="2000" step="1" value="60"></div>
                  <div class="iaa-field-row"><span class="iaa-field-label">Намаляване при серия загуби (%)</span><input type="number" id="iaa-dynamic-stake-loss-reduce" min="0" max="100" step="1" value="10"></div>
                  </div>
                </div>

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
      renderKillerHud();

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

      let killerDragging = false;
      let killerOff = { x: 0, y: 0 };
      const killerPanel = $id('iaa-killer-panel');
      const killerHeader = $id('iaa-killer-header');
      if (killerPanel && killerHeader) {
        if (Number.isFinite(S.killerHudPos?.x) && Number.isFinite(S.killerHudPos?.y)) {
          killerPanel.style.left = `${S.killerHudPos.x}px`;
          killerPanel.style.top = `${S.killerHudPos.y}px`;
          killerPanel.style.right = 'auto';
        }
        killerHeader.addEventListener('mousedown', (e) => {
          killerDragging = true;
          killerOff.x = e.clientX - killerPanel.offsetLeft;
          killerOff.y = e.clientY - killerPanel.offsetTop;
          e.preventDefault();
        });
        document.addEventListener('mousemove', (e) => {
          if (!killerDragging) return;
          killerPanel.style.left = `${Math.max(0, e.clientX - killerOff.x)}px`;
          killerPanel.style.top = `${Math.max(0, e.clientY - killerOff.y)}px`;
          killerPanel.style.right = 'auto';
        });
        document.addEventListener('mouseup', () => {
          if (!killerDragging) return;
          killerDragging = false;
          S.killerHudPos = { x: killerPanel.offsetLeft, y: killerPanel.offsetTop };
          persistSettings();
        });
      }

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

      function placePopupNear(popupId, anchorEl) {
        try {
          const popup = $id(popupId);
          if (!popup || !anchorEl) return;
          const prevDisp = popup.style.display;
          const prevVis = popup.style.visibility;
          if (getComputedStyle(popup).display === 'none') popup.style.display = 'block';
          popup.style.visibility = 'hidden';

          const r = anchorEl.getBoundingClientRect();
          const pad = 8;
          const w = popup.offsetWidth || 340;
          const h = popup.offsetHeight || 260;

          let left = r.left;
          let top = r.bottom + 6;
          if (top + h > window.innerHeight - pad) top = r.top - h - 6;

          left = Math.max(pad, Math.min(left, window.innerWidth - w - pad));
          top = Math.max(pad, Math.min(top, window.innerHeight - h - pad));

          popup.style.position = 'fixed';
          popup.style.left = left + 'px';
          popup.style.top = top + 'px';
          popup.style.right = 'auto';
          popup.style.bottom = 'auto';
          popup.style.transform = 'none';

          popup.style.visibility = prevVis || '';
          popup.style.display = prevDisp || 'block';
        } catch(e) {}
      }

      function hidePopups() {
        const settings = $id('iaa-settings-panel');
        const mouse = $id('iaa-mouse-panel');
        const debug = $id('iaa-debug-panel');
        const calibration = $id('iaa-calib-panel');

        if (settings) settings.style.display = 'none';
        if (mouse) mouse.style.display = 'none';
        if (debug) debug.style.display = 'none';
        if (calibration) calibration.style.display = 'none';

        S.settingsOpen = false;
        S.mousePanelOpen = false;
        S.debugOpen = false;
        S.calibOpen = false;
        S.filterModePanelOpen = false;
        persistSettings();
      }

      const settingsToggle = $id('iaa-settings-toggle');
      const mouseToggle = $id('iaa-mouse-toggle');
      const settingsClose = $id('iaa-settings-close');
      const mouseClose = $id('iaa-mouse-close');
      const calibrationClose = $id('iaa-calibration-close');
      const debugToggle = $id('iaa-debug-toggle');
      const killerToggle = $id('iaa-killer-toggle');
      const debugClose = $id('iaa-debug-close');
      const killerClose = $id('iaa-killer-close');
      const debugCopy = $id('iaa-debug-copy');
      const lossCopy = $id('iaa-loss-copy');
      const debugTabStatus = $id('iaa-debug-tab-status');
      const debugTabLoss = $id('iaa-debug-tab-loss');
      const consoleCopy = $id('iaa-console-copy');
      const consoleClear = $id('iaa-console-clear');
      const consoleAnalyze = $id('iaa-console-analyze');
      const calibrationFromMouse = $id('iaa-calibration-open');

      const openSettingsPanel = () => {
        hidePopups();
        showPopup('iaa-settings-panel');
        S.settingsPanelOpen = true;
        captureSettingsSnapshot();
        renderSettingsPanel();
      };
      const openMousePanel = () => {
        hidePopups();
        showPopup('iaa-mouse-panel');
        S.mousePanelOpen = true;
        renderMousePanel();
      };


      // Robust binding: ensure Mouse Mapping toggle always works even after UI re-renders
      if (!S._mouseToggleDelegated) {
        S._mouseToggleDelegated = true;
        document.addEventListener('click', (event) => {
          const t = event && event.target;
          const btn = t && t.closest ? t.closest('#iaa-mouse-toggle') : null;
          if (!btn) return;
          event.preventDefault();
          event.stopPropagation();
          if (S.mousePanelOpen) hidePopups();
          else openMousePanel();
        }, true);
      }
      if (settingsToggle) {
        settingsToggle.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          if (S.settingsPanelOpen) hidePopups();
          else openSettingsPanel();
        });
      }
setTimeout(() => {
  iaaInitCalibrationDelegates();
  const bind = (id, key, scope) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.onclick = () => iaaSetCalTarget(key, scope);
  };

  bind('iaa-cal-open', 'OPEN', 'OTC');
  bind('iaa-cal-m1', 'M1', 'OTC');
  bind('iaa-cal-m3', 'M3', 'OTC');
  bind('iaa-cal-m5', 'M5', 'OTC');
  bind('iaa-cal-m15', 'M15', 'OTC');

  bind('iaa-cal-real-open', 'OPEN', 'REAL');
  bind('iaa-cal-real-m1', 'M1', 'REAL');
  bind('iaa-cal-real-m3', 'M3', 'REAL');
  bind('iaa-cal-real-m5', 'M5', 'REAL');

  const dumpBtn = document.getElementById('iaa-cal-dump');
  if (dumpBtn) dumpBtn.onclick = () => {
    iaaDumpCal();
    logConsoleLine('Калибрация: координатите са в F12 Console.');
  };

  iaaEnsureExpiryCoords('OTC');
  iaaEnsureExpiryCoords('REAL');
}, 0);


      if (mouseToggle) {
        // handled by central popup delegation in ensurePanelHandlers
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
      if (mouseClose) mouseClose.addEventListener('click', hidePopups);
      if (calibrationClose) calibrationClose.addEventListener('click', hidePopups);
      if (debugClose) debugClose.addEventListener('click', hidePopups);

      if (!S._globalPopupCloser) {
        S._globalPopupCloser = true;
        document.addEventListener('mousedown', (ev) => {
          const t = ev.target;
          const within = (el) => el && (el === t || el.contains(t));
          const panels = [$id('iaa-settings-panel'), $id('iaa-mouse-panel'), $id('iaa-debug-panel'), $id('iaa-calibration-panel')];
          const toggles = [settingsToggle, mouseToggle, calibrationFromMouse, debugToggle];
          if (panels.some(p => within(p))) return;
          if (toggles.some(b => within(b))) return;
          hidePopups();
        }, true);
      }
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

      if (consoleAnalyze) {
        consoleAnalyze.addEventListener('click', () => {
          try { exportSessionHtml(); } catch (e) { console.warn('[IAA] analyze export failed', e); }
        });
      }
      rebindPanelPopupButtons();
    }

    function setStatusOverlay(text, countdown = '', logToConsole = true) {
      const fallback = formatStatus('looking_for_opportunity');
      const nextText = text || fallback;
      const prevStatus = S.currentStatus;
      const changed = nextText !== prevStatus;
      const now = Date.now();
      S.currentStatus = nextText;
      if (changed) {
        S.lastStatusAt = now;
      }
      const el = $id('iaa-status-overlay');
      if (el && el.textContent !== nextText) {
        el.textContent = nextText;
      }
      if (el) {
        const isError = /^❌/.test(String(nextText || '')) || /Неуспешно задаване на време/i.test(String(nextText || ''));
        el.style.color = isError ? '#ef4444' : '#fbbf24';
      }
      if (logToConsole && changed && nextText !== fallback) {
        logConsoleLine(nextText);
      }
    }

    function getLiveExpiryLabel(signal) {
      const active = Array.isArray(S.activeTrades) ? S.activeTrades : [];
      if (active.length) {
        const latestActive = [...active].sort((a, b) => (b.startTime || 0) - (a.startTime || 0))[0];
        const liveExpiry = normalizeTradeExpiry(latestActive?.expiry);
        if (liveExpiry && liveExpiry !== '—') return liveExpiry;
      }
      const pending = Array.isArray(S.pendingTradeConfirmations) ? S.pendingTradeConfirmations : [];
      if (pending.length) {
        const latestPending = [...pending].sort((a, b) => (b.at || 0) - (a.at || 0))[0];
        const pendingExpiry = normalizeTradeExpiry(latestPending?.trade?.expiry);
        if (pendingExpiry && pendingExpiry !== '—') return pendingExpiry;
      }
      const lastHistory = Array.isArray(S.tradeHistory) ? S.tradeHistory[0] : null;
      const historyExpiry = normalizeTradeExpiry(lastHistory?.expiry);
      if (historyExpiry && historyExpiry !== '—') return historyExpiry;
      return normalizeTradeExpiry(signal?.expiry || S.expirySetting);
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
        if (expEl) expEl.textContent = getLiveExpiryLabel(signal) || '—';
      } else {
        wrap.style.display='none';
      }
    }


    function buildConfidenceSparkline() {
      // Визуално само: не влияе на входа.
      const pct = Number.isFinite(S.analysisConfidence) ? Math.round(S.analysisConfidence * 100) : null;
      if (pct != null) {
        if (!S.confSpark) S.confSpark = [];
        S.confSpark.push(Math.max(0, Math.min(100, pct)));
        const maxLen = 24;
        if (S.confSpark.length > maxLen) S.confSpark.splice(0, S.confSpark.length - maxLen);
      }
      const arr = S.confSpark || [];
      if (!arr.length) return '—';
      const blocks = '▁▂▃▄▅▆▇█';
      return arr.map(v => blocks[Math.max(0, Math.min(7, Math.round((v / 100) * 7))) ]).join('');
    }
    function renderPendingTrades(){
      const execEl = $id('iaa-exec');
      if (null && execEl) execEl.textContent = fmtHHMMSSLocal(new Date(null.targetTsMs));
      else if (execEl) execEl.textContent = '—';

      renderChip(null);
      const expEl = $id('iaa-exp');
      if (expEl) expEl.textContent = getLiveExpiryLabel(null || null) || '—';

      const confEl = $id('iaa-analysis-score');
      if (confEl) {
        const score = (isKillerMode() && Number.isFinite(S.tradeQualityScore))
          ? S.tradeQualityScore
          : Math.round((S.analysisConfidence || 0) * 100);
        const dir = S.analysisDirection ? ` ${S.analysisDirection}` : '';
        confEl.textContent = `${score}%${dir}`;
      }

      const etaEl = $id('iaa-next-trade');
      if (etaEl) etaEl.textContent = getNextEtaLabel();
      renderKillerMatrix();

      const feedEl = $id('iaa-feed-cloud');
      if (feedEl) {
        const price = Number.isFinite(S.currentAssetPrice) ? String(S.currentAssetPrice) : '—';
        const historyLen = S.priceHistory?.length || 0;
        const acceptedTicks = Number.isFinite(S.historyAcceptedTicks) ? S.historyAcceptedTicks : 0;
        const duplicateTicks = Number.isFinite(S.historyDuplicateTicks) ? S.historyDuplicateTicks : 0;
        const wsSeen = Number.isFinite(S.wsPacketsSeen) ? S.wsPacketsSeen : 0;
        const bridgeSeen = Number.isFinite(S.wsBridgeFramesSeen) ? S.wsBridgeFramesSeen : 0;
        const bridgeState = S.wsBridgeReady ? 'ON' : 'OFF';
        const source = S.lastFeedSource || 'none';
        feedEl.innerHTML = `Цена: ${price} • История: ${historyLen} (✓${acceptedTicks}/dup:${duplicateTicks})`;
        feedEl.title = `Историята се пази до ${PRICE_HISTORY_MAX_POINTS} точки (лимит по брой, не по време).`;
      }
    }

    async function restoreSettings(){
      const base = await storage.get(BASE_AMOUNT_KEY);
      if (typeof base === 'number' && base > 0) S.baseAmount = base;
      const ex  = await storage.get(EXPIRY_KEY); if (typeof ex === 'string') S.expirySetting = normalizeExpiry(ex) || '1m';
      const maxSessionLoss = await storage.get(MAX_SESSION_ЗАГУБИ_KEY);
      if (typeof maxSessionLoss === 'number' && Number.isFinite(maxSessionLoss)) S.maxSessionLossCents = Math.max(0, Math.round(maxSessionLoss));
      const maxConsecLosses = await storage.get(MAX_CONSECUTIVE_ЗАГУБИES_KEY);
      if (typeof maxConsecLosses === 'number' && Number.isFinite(maxConsecLosses)) S.maxConsecutiveLosses = Math.max(0, Math.round(maxConsecLosses));
      const analysisEnabled = await storage.get(ANALYSIS_ENABLED_KEY); if (typeof analysisEnabled === 'boolean') S.analysisEnabled = analysisEnabled;
      const fmEnabled = await storage.get(FILTERMODE_ENABLED_KEY);
      if (typeof fmEnabled === 'boolean') S.filterModeEnabled = fmEnabled;
      const fmMode = await storage.get(FILTERMODE_MODE_KEY);
      if (typeof fmMode === 'string' && ['soft','auto','strict'].includes(fmMode)) S.filterMode = fmMode;
      const fmWin = await storage.get(FILTERMODE_AUTO_WINDOW_MIN_KEY);
      if (typeof fmWin === 'number' && fmWin>0) S.filterAutoWindowMin = Math.max(1, Math.min(60, Math.round(fmWin)));
      const fmFlip = await storage.get(FILTERMODE_AUTO_FLIP_THRESH_KEY);
      if (typeof fmFlip === 'number' && fmFlip>0) S.filterAutoFlipThreshold = Math.max(1, Math.min(10, Math.round(fmFlip)));
      const fmDrop = await storage.get(FILTERMODE_AUTO_DROP_THRESH_KEY);
      if (typeof fmDrop === 'number' && fmDrop>0) S.filterAutoDropThreshold = Math.max(5, Math.min(50, Math.round(fmDrop)));
            const keepAlive = await storage.get(KEEP_ALIVE_KEY);
      if (typeof keepAlive === 'boolean') { S.keepAliveEnabled = keepAlive; S.killerKeepAliveEnabled = keepAlive; }
      const analysisConfidence = await storage.get(ANALYSIS_CONFIDENCE_KEY); if (typeof analysisConfidence === 'number') S.analysisConfidenceThreshold = analysisConfidence;
      const tradeIntervalMin = await storage.get(TRADE_INTERVAL_MIN_KEY); if (typeof tradeIntervalMin === 'number') S.tradeIntervalMin = tradeIntervalMin;
      const maxTradesPerMinute = await storage.get(MAX_СДЕЛКИ_PER_MIN_KEY); if (typeof maxTradesPerMinute === 'number') S.maxTradesPerMinute = maxTradesPerMinute; else if (!Number.isFinite(S.maxTradesPerMinute)) S.maxTradesPerMinute = 5;
      const maxOpenTrades = await storage.get(MAX_OPEN_СДЕЛКИ_KEY); if (typeof maxOpenTrades === 'number') S.maxOpenTrades = maxOpenTrades; else if (!Number.isFinite(S.maxOpenTrades)) S.maxOpenTrades = 5;
      const ewEnabled = await storage.get(ENTRYПЕЧАЛБИ_TF_ENABLED_KEY);
      if (typeof ewEnabled === 'boolean') S.entryWindowTfEnabled = ewEnabled;
      const ew1m = await storage.get(ENTRYПЕЧАЛБИ_1M_SEC_KEY);
      if (typeof ew1m === 'number') S.entryWindowSec1m = Math.max(0, Math.min(999, Math.round(ew1m)));
      const ew3m = await storage.get(ENTRYПЕЧАЛБИ_3M_SEC_KEY);
      if (typeof ew3m === 'number') S.entryWindowSec3m = Math.max(0, Math.min(999, Math.round(ew3m)));
      const ew5m = await storage.get(ENTRYПЕЧАЛБИ_5M_SEC_KEY);
      if (typeof ew5m === 'number') S.entryWindowSec5m = Math.max(0, Math.min(999, Math.round(ew5m)));
      const payoutMin = await storage.get(PAYOUT_MIN_KEY); if (typeof payoutMin === 'number') S.payoutMin = payoutMin;
      const payoutMax = await storage.get(PAYOUT_MAX_KEY); if (typeof payoutMax === 'number') S.payoutMax = payoutMax;
      const payoutRequired = await storage.get(PAYOUT_REQUIRED_KEY); if (typeof payoutRequired === 'boolean') S.payoutRequired = payoutRequired;
      const dynamicTimeEnabled = await storage.get(DYNAMIC_TIME_KEY); if (typeof dynamicTimeEnabled === 'boolean') S.dynamicExpiryEnabled = dynamicTimeEnabled;
      const dynamicMode = await storage.get(DYNAMIC_MODE_KEY); if (typeof dynamicMode === 'string') S.dynamicMode = ['off', 'dynamic', 'hybrid'].includes(dynamicMode) ? dynamicMode : 'off';
      const dynamicMinSec = await storage.get(DYNAMIC_MIN_SEC_KEY); if (typeof dynamicMinSec === 'number') S.dynamicMinSec = Math.max(3, Math.min(3600, Math.round(dynamicMinSec)));
      const dynamicMaxSec = await storage.get(DYNAMIC_MAX_SEC_KEY); if (typeof dynamicMaxSec === 'number') S.dynamicMaxSec = Math.max(3, Math.min(3600, Math.round(dynamicMaxSec)));
      const dynamicAllowNoTrade = await storage.get(DYNAMIC_ALLOW_NO_TRADE_KEY); if (typeof dynamicAllowNoTrade === 'boolean') S.dynamicAllowNoTrade = dynamicAllowNoTrade;
      const dynamicExpiryStepSec = await storage.get(DYNAMIC_EXPIRY_STEP_SEC_KEY); if (typeof dynamicExpiryStepSec === 'number') S.dynamicExpiryStepSec = Math.max(1, Math.min(30, Math.round(dynamicExpiryStepSec)));
      const dynamicEntryStepSec = await storage.get(DYNAMIC_ENTRY_STEP_SEC_KEY); if (typeof dynamicEntryStepSec === 'number') S.dynamicEntryStepSec = Math.max(1, Math.min(30, Math.round(dynamicEntryStepSec)));
      const dynamicLookbackSec = await storage.get(DYNAMIC_LOOKBACK_SEC_KEY); if (typeof dynamicLookbackSec === 'number') S.dynamicLookbackSec = Math.max(60, Math.min(3600, Math.round(dynamicLookbackSec)));
      const dynamicMinSamples = await storage.get(DYNAMIC_MIN_SAMPLES_KEY); if (typeof dynamicMinSamples === 'number') S.dynamicMinSamples = Math.max(5, Math.min(1000, Math.round(dynamicMinSamples)));
      const dynamicMinWinrate = await storage.get(DYNAMIC_MIN_WINRATE_KEY); if (typeof dynamicMinWinrate === 'number') S.dynamicMinWinrate = clamp01(dynamicMinWinrate);
      const dynamicChopPenalty = await storage.get(DYNAMIC_CHOP_PENALTY_KEY); if (typeof dynamicChopPenalty === 'number') S.dynamicChopPenalty = Math.max(0, Math.min(1, dynamicChopPenalty));
      const dynamicLatePenalty = await storage.get(DYNAMIC_LATE_PENALTY_KEY); if (typeof dynamicLatePenalty === 'number') S.dynamicLatePenalty = Math.max(0, Math.min(1, dynamicLatePenalty));
      const dynamicStakeScaleEnabled = await storage.get(DYNAMIC_STAKE_SCALE_ENABLED_KEY); if (typeof dynamicStakeScaleEnabled === 'boolean') S.dynamicStakeScaleEnabled = dynamicStakeScaleEnabled;
      const dynamicStakeMult8 = await storage.get(DYNAMIC_STAKE_MULT8_KEY); if (typeof dynamicStakeMult8 === 'number') S.dynamicStakeMult8 = Math.max(0, Math.min(2, dynamicStakeMult8));
      const dynamicStakeMult9 = await storage.get(DYNAMIC_STAKE_MULT9_KEY); if (typeof dynamicStakeMult9 === 'number') S.dynamicStakeMult9 = Math.max(0, Math.min(2, dynamicStakeMult9));
      const dynamicStakeBoostWr = await storage.get(DYNAMIC_STAKE_BOOST_KEY); if (typeof dynamicStakeBoostWr === 'number') S.dynamicStakeBoostWr = Math.max(0, Math.min(1, dynamicStakeBoostWr));
      const dynamicStakeBoostMinSamples = await storage.get(DYNAMIC_STAKE_BOOST_MIN_SAMPLES_KEY); if (typeof dynamicStakeBoostMinSamples === 'number') S.dynamicStakeBoostMinSamples = Math.max(1, Math.min(2000, Math.round(dynamicStakeBoostMinSamples)));
      const dynamicStakeLossReduce = await storage.get(DYNAMIC_STAKE_LOSS_REDUCE_KEY); if (typeof dynamicStakeLossReduce === 'number') S.dynamicStakeLossReduce = Math.max(0, Math.min(1, dynamicStakeLossReduce));
      const dynamicTwoStageEnabled = await storage.get(DYNAMIC_TWO_STAGE_SEARCH_KEY); if (typeof dynamicTwoStageEnabled === 'boolean') S.dynamicTwoStageEnabled = dynamicTwoStageEnabled;
      const dynamicFineStepSec = await storage.get(DYNAMIC_FINE_STEP_KEY); if (typeof dynamicFineStepSec === 'number') S.dynamicFineStepSec = Math.max(1, Math.min(10, Math.round(dynamicFineStepSec)));
      const dynamicCandleSync = await storage.get(DYNAMIC_CANDLE_SYNC_KEY); if (typeof dynamicCandleSync === 'boolean') S.dynamicCandleSyncEnabled = dynamicCandleSync;
      const dynamicLatencyComp = await storage.get(DYNAMIC_LATENCY_COMP_KEY); if (typeof dynamicLatencyComp === 'number') S.dynamicLatencyCompMs = Math.max(0, Math.min(5000, Math.round(dynamicLatencyComp)));
      const dynamicPreCalc = await storage.get(DYNAMIC_PRE_CALC_KEY); if (typeof dynamicPreCalc === 'boolean') S.dynamicPreCalcEnabled = dynamicPreCalc;
      const dynamicVolatilityAdaptive = await storage.get(DYNAMIC_VOLATILITY_ADAPTIVE_KEY); if (typeof dynamicVolatilityAdaptive === 'boolean') S.dynamicVolatilityAdaptive = dynamicVolatilityAdaptive;
      // Legacy VWAP/Momentum/Volume weighting path is disabled in the score-first core.
      S.killerVwapEnabled = false;
      S.killerMomentumEnabled = false;
      S.killerVolumeEnabled = false;
      S.featureVwapAnalysis = false;
      S.killerVwapWeight = 0;
      S.killerMomentumWeight = 0;
      S.killerVolumeWeight = 0;
      const dynamicCoreCollapsed = await storage.get(DYNAMIC_CORE_COLLAPSED_KEY); if (typeof dynamicCoreCollapsed === 'boolean') S.dynamicCoreCollapsed = dynamicCoreCollapsed;
      const dynamicStakeCollapsed = await storage.get(DYNAMIC_STAKE_COLLAPSED_KEY); if (typeof dynamicStakeCollapsed === 'boolean') S.dynamicStakeCollapsed = dynamicStakeCollapsed;
      const killerDynamicCollapsed = await storage.get(KILLER_DYNAMIC_COLLAPSED_KEY); if (typeof killerDynamicCollapsed === 'boolean') S.killerDynamicCollapsed = killerDynamicCollapsed;
      const killerEnabled = await storage.get(KILLER_ENABLED_KEY); if (typeof killerEnabled === 'boolean') S.killerEnabled = killerEnabled;
      const killerHudEnabled = await storage.get(KILLER_HUD_ENABLED_KEY); if (typeof killerHudEnabled === 'boolean') S.killerHudEnabled = killerHudEnabled;
      const killerMinConfluence = await storage.get(KILLER_MIN_CONFLUENCE_KEY); if (typeof killerMinConfluence === 'number') S.killerMinConfluence = Math.max(7, Math.min(9, Math.round(killerMinConfluence)));
      const killerDomThreshold = await storage.get(KILLER_DOM_THRESHOLD_KEY); if (typeof killerDomThreshold === 'number') S.killerDominanceThreshold = Math.max(50, Math.min(90, Math.round(killerDomThreshold)));
      const killerPerfectTime = await storage.get(KILLER_PERFECT_TIME_KEY); if (typeof killerPerfectTime === 'boolean') S.killerPerfectTimeEnabled = killerPerfectTime;
      const killerPtMode = await storage.get(KILLER_PT_MODE_KEY); if (typeof killerPtMode === 'string') S.killerPerfectTimeMode = ['soft','hard','adaptive'].includes(killerPtMode) ? killerPtMode : 'hard';
      const killerAdxDynamic = await storage.get(KILLER_ADX_DYNAMIC_KEY); if (typeof killerAdxDynamic === 'boolean') S.killerAdxDynamicEnabled = killerAdxDynamic;
      const killerCandleHardStop = await storage.get(KILLER_CANDLE_HARDSTOP_KEY); if (typeof killerCandleHardStop === 'boolean') S.killerCandleAgainstHardStop = killerCandleHardStop;
      const killerSignalCooldownSec = await storage.get(KILLER_SIGNAL_COOLDOWN_SEC_KEY); if (typeof killerSignalCooldownSec === 'number') S.killerSignalCooldownSec = Math.max(0, Math.min(30, Math.round(killerSignalCooldownSec)));
      const killerUseStrategyVotes = await storage.get(KILLER_USE_STRATEGY_VOTES_KEY); if (typeof killerUseStrategyVotes === 'boolean') S.killerUseStrategyVotes = killerUseStrategyVotes;
      const killerStrategyAgreement = await storage.get(KILLER_STRATEGY_AGREEMENT_KEY); if (typeof killerStrategyAgreement === 'number') S.killerStrategyAgreementMin = Math.max(1, Math.min(3, Math.round(killerStrategyAgreement)));
      const biasEnabled = await storage.get(BIAS_ENABLED_KEY); if (typeof biasEnabled === 'boolean') S.biasEnabled = biasEnabled;
      const biasMode = await storage.get(BIAS_MODE_KEY); if (typeof biasMode === 'string') S.biasMode = ['points','hybrid'].includes(biasMode) ? biasMode : 'points';
      const biasStrongThreshold = await storage.get(BIAS_STRONG_THRESHOLD_KEY); if (typeof biasStrongThreshold === 'number') S.biasStrongThreshold = Math.max(0.20, Math.min(0.80, biasStrongThreshold));
      const stabilityEnabled = await storage.get(STABILITY_ENABLED_KEY); if (typeof stabilityEnabled === 'boolean') S.stabilityEnabled = stabilityEnabled;
      const stabilityMaxGapMs = await storage.get(STABILITY_MAX_GAP_MS_KEY); if (typeof stabilityMaxGapMs === 'number') S.stabilityMaxGapMs = Math.max(1000, Math.min(8000, Math.round(stabilityMaxGapMs)));
      const toleranceMode = await storage.get(TOLERANCE_MODE_KEY); if (typeof toleranceMode === 'string') S.toleranceMode = ['confidence','pt','either','off'].includes(toleranceMode) ? toleranceMode : 'either';
      const toleranceConfidence = await storage.get(TOLERANCE_CONFIDENCE_KEY); if (typeof toleranceConfidence === 'number') S.toleranceConfidence = Math.max(0.60, Math.min(0.95, toleranceConfidence));
      const killerThresholdMode = await storage.get(KILLER_THRESHOLD_MODE_KEY); if (typeof killerThresholdMode === 'string') S.killerThresholdMode = ['7of11','8of11','9of11'].includes(killerThresholdMode) ? killerThresholdMode : '8of11';
      S.killerMinConfluence = getScoreThresholdPoints();
      const supportingFiltersEnabled = await storage.get(SUPPORTING_FILTERS_ENABLED_KEY); if (typeof supportingFiltersEnabled === 'boolean') S.supportingFiltersEnabled = supportingFiltersEnabled;
      const chopV2Enabled = await storage.get(CHOP_V2_ENABLED_KEY); if (typeof chopV2Enabled === 'boolean') S.chopV2Enabled = chopV2Enabled;
      const chopV2Strength = await storage.get(CHOP_V2_STRENGTH_KEY); if (typeof chopV2Strength === 'number') S.chopV2StrengthPct = Math.max(1, Math.min(100, Math.round(chopV2Strength)));
      const chopV5HardStop = await storage.get(CHOP_V5_HARDSTOP_KEY); if (typeof chopV5HardStop === 'boolean') S.chopV5HardStopEnabled = chopV5HardStop;
      const chopV5PanelOpen = await storage.get(CHOP_V5_PANEL_OPEN_KEY); if (typeof chopV5PanelOpen === 'boolean') S.chopV5PanelOpen = chopV5PanelOpen;
      const killerHudPos = await storage.get(KILLER_HUD_POS_KEY);
      if (killerHudPos && Number.isFinite(killerHudPos.x) && Number.isFinite(killerHudPos.y)) {
        S.killerHudPos = { x: killerHudPos.x, y: killerHudPos.y };
      }
      if (S.dynamicMinSec > S.dynamicMaxSec) {
        const tmp = S.dynamicMinSec;
        S.dynamicMinSec = S.dynamicMaxSec;
        S.dynamicMaxSec = tmp;
      }
      const idleSwitchEnabled = await storage.get(IDLE_SWITCH_ENABLED_KEY); if (typeof idleSwitchEnabled === 'boolean') S.idleSwitchEnabled = idleSwitchEnabled;
      const idleSwitchMinutes = await storage.get(IDLE_SWITCH_MIN_KEY); if (typeof idleSwitchMinutes === 'number') S.idleSwitchMinutes = idleSwitchMinutes;
      const maxTradeAmount = await storage.get(MAX_TRADE_AMOUNT_KEY); if (typeof maxTradeAmount === 'number') S.maxTradeAmountCents = maxTradeAmount;
      const maxTradeMultiplier = await storage.get(MAX_TRADE_MULTIPLIER_KEY); if (typeof maxTradeMultiplier === 'number') S.maxTradeAmountMultiplier = maxTradeMultiplier;
      const analysisWindowSec = await storage.get(ANALYSIS_ПЕЧАЛБИDOW_SEC_KEY); if (typeof analysisWindowSec === 'number') S.analysisWindowSec = analysisWindowSec;
      const analysisWarmupMin = await storage.get(ANALYSIS_WARMUP_MIN_KEY); if (typeof analysisWarmupMin === 'number') S.analysisWarmupMin = analysisWarmupMin;
      const selfTradeEnabled = await storage.get(SELF_TRADE_ENABLED_KEY); if (typeof selfTradeEnabled === 'boolean') S.selfTradeEnabled = selfTradeEnabled;
      const savedMethod = await storage.get(BUY_SELL_METHOD_KEY);
      if (savedMethod && ['auto', 'xpath'].includes(savedMethod)) {
        S.buySellMethod = savedMethod;
      }

      const savedXPaths = await storage.get(XPATH_SELECTORS_KEY);
      if (savedXPaths && typeof savedXPaths === 'object') {
        S.xpathSelectors = Object.assign({}, S.xpathSelectors, savedXPaths);
      }

      S.mode = 'killer';
      applyKillerDefaults();
      const killerBaseAmount = await storage.get(KILLER_BASE_AMOUNT_KEY);
      if (typeof killerBaseAmount === 'number') S.killerBaseAmount = killerBaseAmount;
      const killerThreshold = await storage.get(KILLER_THRESHOLD_KEY);
      if (typeof killerThreshold === 'number') {
        const v = killerThreshold > 1 ? (killerThreshold / 100) : killerThreshold;
        S.killerThreshold = clamp01(v);
      }
      const killerThresholdOtc = await storage.get(KILLER_THRESHOLD_OTC_KEY);
      if (typeof killerThresholdOtc === 'number') {
        const v = killerThresholdOtc > 1 ? (killerThresholdOtc / 100) : killerThresholdOtc;
        S.killerThresholdOtc = clamp01(v);
      }
      const killerThresholdReal = await storage.get(KILLER_THRESHOLD_REAL_KEY);
      if (typeof killerThresholdReal === 'number') {
        const v = killerThresholdReal > 1 ? (killerThresholdReal / 100) : killerThresholdReal;
        S.killerThresholdReal = clamp01(v);
      }
      const killerVwapDeviation = await storage.get(KILLER_VWAP_DEV_KEY);
      if (typeof killerVwapDeviation === 'number') S.killerVwapDeviation = killerVwapDeviation;
      const killerVwapLookback = await storage.get(KILLER_VWAP_LOOKBACK_KEY);
      if (typeof killerVwapLookback === 'number') S.killerVwapLookbackMin = killerVwapLookback;
      const killerMomentumThreshold = await storage.get(KILLER_MOMENTUM_KEY);
      if (typeof killerMomentumThreshold === 'number') S.killerMomentumThreshold = killerMomentumThreshold;
      const killerVolumeThreshold = await storage.get(KILLER_VOLUME_THRESHOLD_KEY);
      if (typeof killerVolumeThreshold === 'number') S.killerVolumeThreshold = killerVolumeThreshold;
      const killerEmaFast = await storage.get(KILLER_EMA_FAST_KEY);
      if (typeof killerEmaFast === 'number') S.killerEmaFast = Math.max(2, Math.round(killerEmaFast));
      const killerEmaSlow = await storage.get(KILLER_EMA_SLOW_KEY);
      if (typeof killerEmaSlow === 'number') S.killerEmaSlow = Math.max(5, Math.round(killerEmaSlow));
      const killerRsiOversold = await storage.get(KILLER_RSI_OVERSOLD_KEY);
      if (typeof killerRsiOversold === 'number') S.killerRsiOversold = Math.max(5, Math.min(50, Math.round(killerRsiOversold)));
      const killerRsiOverbought = await storage.get(KILLER_RSI_OVERBOUGHT_KEY);
      if (typeof killerRsiOverbought === 'number') S.killerRsiOverbought = Math.max(50, Math.min(95, Math.round(killerRsiOverbought)));
      const killerVwapWeight = await storage.get(KILLER_VWAP_WEIGHT_KEY);
      if (typeof killerVwapWeight === 'number') S.killerVwapWeight = killerVwapWeight > 1 ? clamp01(killerVwapWeight / 100) : clamp01(killerVwapWeight);
      const killerMomentumWeight = await storage.get(KILLER_MOMENTUM_WEIGHT_KEY);
      if (typeof killerMomentumWeight === 'number') S.killerMomentumWeight = killerMomentumWeight > 1 ? clamp01(killerMomentumWeight / 100) : clamp01(killerMomentumWeight);
      const killerVolumeWeight = await storage.get(KILLER_VOLUME_WEIGHT_KEY);
      if (typeof killerVolumeWeight === 'number') S.killerVolumeWeight = killerVolumeWeight > 1 ? clamp01(killerVolumeWeight / 100) : clamp01(killerVolumeWeight);
      const killerVwapEnabled = await storage.get(KILLER_VWAP_ENABLED_KEY);
      if (typeof killerVwapEnabled === 'boolean') S.killerVwapEnabled = killerVwapEnabled;
      const killerMomentumEnabled = await storage.get(KILLER_MOMENTUM_ENABLED_KEY);
      if (typeof killerMomentumEnabled === 'boolean') S.killerMomentumEnabled = killerMomentumEnabled;
      const killerVolumeEnabled = await storage.get(KILLER_VOLUME_ENABLED_KEY);
      if (typeof killerVolumeEnabled === 'boolean') S.killerVolumeEnabled = killerVolumeEnabled;
      const savedTimeframes = await storage.get(KILLER_TIMEFRAMES_KEY);
      if (savedTimeframes && typeof savedTimeframes === 'object') {
        S.killerEnabledTimeframes = Object.assign({}, S.killerEnabledTimeframes, savedTimeframes);
        delete S.killerEnabledTimeframes['15s'];
        delete S.killerEnabledTimeframes['30m'];
        delete S.killerEnabledTimeframes['3s'];
        delete S.killerEnabledTimeframes['30s'];
      }
      const featureVolumeRejection = await storage.get(FEATURE_VOLUME_REJECTION_KEY);
      if (typeof featureVolumeRejection === 'boolean') S.featureVolumeRejection = featureVolumeRejection;
      const featureVwapAnalysis = await storage.get(FEATURE_VWAP_ANALYSIS_KEY);
      if (typeof featureVwapAnalysis === 'boolean') S.featureVwapAnalysis = featureVwapAnalysis;
      const featureSessionBoost = await storage.get(FEATURE_SESSION_BOOST_KEY);
      if (typeof featureSessionBoost === 'boolean') S.featureSessionBoost = featureSessionBoost;      const phaseCatch = await storage.get(PHASE_CATCH_MOVE_KEY); if (typeof phaseCatch === 'boolean') S.phaseCatchMoveEnabled = phaseCatch;
      const phaseReload = await storage.get(PHASE_RELOAD_KILLER_KEY); if (typeof phaseReload === 'boolean') S.phaseReloadKillerEnabled = phaseReload;
      const featureTimeframes = await storage.get(FEATURE_TIMEFRAMES_KEY);
      if (featureTimeframes && typeof featureTimeframes === 'object') {
        S.killerEnabledTimeframes = Object.assign({}, S.killerEnabledTimeframes, featureTimeframes);
        // Remove deprecated TFs
        delete S.killerEnabledTimeframes['15s'];
        delete S.killerEnabledTimeframes['30m'];
        delete S.killerEnabledTimeframes['3s'];
        delete S.killerEnabledTimeframes['30s'];
      }
      const strategyConfigs = await storage.get(STRATEGY_CONFIG_KEY);
      if (strategyConfigs && typeof strategyConfigs === 'object') {
        const merged = Object.assign({}, S.strategyConfigs, strategyConfigs);
        const allowed = new Set(Object.keys(STRATEGY_DEFAULTS.configs));
        S.strategyConfigs = Object.fromEntries(Object.entries(merged).filter(([key]) => allowed.has(key)));
      }
      const rsiDivergenceLookback = await storage.get(RSI_DIVERGENCE_LOOKBACK_KEY);
      if (typeof rsiDivergenceLookback === 'number') S.rsiDivergenceLookback = Math.max(6, Math.round(rsiDivergenceLookback));
      const rsiDivergenceMinDelta = await storage.get(RSI_DIVERGENCE_MIN_DELTA_KEY);
      if (typeof rsiDivergenceMinDelta === 'number') S.rsiDivergenceMinDelta = Math.max(1, Math.round(rsiDivergenceMinDelta));
      const rsiDivergenceRsiWindow = await storage.get(RSI_DIVERGENCE_RSI_ПЕЧАЛБИDOW_KEY);
      if (typeof rsiDivergenceRsiWindow === 'number') S.rsiDivergenceRsiWindow = Math.max(5, Math.round(rsiDivergenceRsiWindow));
      const candlestickPatternMinConf = await storage.get(CANDLE_PATTERN_MIN_CONF_KEY);
      if (typeof candlestickPatternMinConf === 'number') S.candlestickPatternMinConfidence = candlestickPatternMinConf > 1 ? clamp01(candlestickPatternMinConf / 100) : clamp01(candlestickPatternMinConf);
      const candlestickPatternEnabled = await storage.get(CANDLE_PATTERN_ENABLED_KEY);
      if (typeof candlestickPatternEnabled === 'boolean') S.candlestickPatternEnabled = candlestickPatternEnabled;
      const candlestickPatternWeight = await storage.get(CANDLE_PATTERN_WEIGHT_KEY);
      if (typeof candlestickPatternWeight === 'number') S.candlestickPatternWeight = candlestickPatternWeight > 1 ? clamp01(candlestickPatternWeight / 100) : clamp01(candlestickPatternWeight);
      const emaRsiFast = await storage.get(EMA_RSI_FAST_KEY);
      if (typeof emaRsiFast === 'number') S.emaRsiFast = Math.max(2, Math.round(emaRsiFast));
      const emaRsiSlow = await storage.get(EMA_RSI_SLOW_KEY);
      if (typeof emaRsiSlow === 'number') S.emaRsiSlow = Math.max(3, Math.round(emaRsiSlow));
      const emaRsiWindow = await storage.get(EMA_RSI_RSI_ПЕЧАЛБИDOW_KEY);
      if (typeof emaRsiWindow === 'number') S.emaRsiWindow = Math.max(5, Math.round(emaRsiWindow));
      const emaRsiOversold = await storage.get(EMA_RSI_OVERSOLD_KEY);
      if (typeof emaRsiOversold === 'number') S.emaRsiOversold = Math.max(10, Math.min(50, Math.round(emaRsiOversold)));
      const emaRsiOverbought = await storage.get(EMA_RSI_OVERBOUGHT_KEY);
      if (typeof emaRsiOverbought === 'number') S.emaRsiOverbought = Math.max(50, Math.min(90, Math.round(emaRsiOverbought)));
      const partnerReadyBars1m = await storage.get(PARTNER_READY_1M_BARS_KEY);
      if (typeof partnerReadyBars1m === 'number') S.partnerReadyBars1m = Math.max(1, Math.min(40, Math.round(partnerReadyBars1m)));
      const partnerReadyBars3m = await storage.get(PARTNER_READY_3M_BARS_KEY);
      if (typeof partnerReadyBars3m === 'number') S.partnerReadyBars3m = Math.max(1, Math.min(40, Math.round(partnerReadyBars3m)));
      const partnerReadyBars5m = await storage.get(PARTNER_READY_5M_BARS_KEY);
      if (typeof partnerReadyBars5m === 'number') S.partnerReadyBars5m = Math.max(1, Math.min(40, Math.round(partnerReadyBars5m)));
      const partnerReadyBars15m = await storage.get(PARTNER_READY_15M_BARS_KEY);
      if (typeof partnerReadyBars15m === 'number') S.partnerReadyBars15m = Math.max(1, Math.min(40, Math.round(partnerReadyBars15m)));
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
      const biasPointMinStrength = await storage.get(BIAS_POINT_MIN_STRENGTH_KEY);
      if (typeof biasPointMinStrength === 'string') S.biasPointMinStrength = ['low','medium','high'].includes(biasPointMinStrength) ? biasPointMinStrength : 'medium';
      const conflictStrength = await storage.get(CONFLICT_STRENGTH_KEY);
      if (typeof conflictStrength === 'number') S.conflictStrength = clamp01(conflictStrength);
      const engineGuardEnabled = await storage.get(ENGINE_GUARD_ENABLED_KEY);
      if (typeof engineGuardEnabled === 'boolean') S.engineGuardEnabled = engineGuardEnabled;
      const engineGuardPanelOpen = await storage.get(ENGINE_GUARD_PANEL_OPEN_KEY);
      if (typeof engineGuardPanelOpen === 'boolean') S.engineGuardPanelOpen = engineGuardPanelOpen;
      const engineGuardImpulseEnabled = await storage.get(ENGINE_GUARD_IMPULSE_ENABLED_KEY);
      if (typeof engineGuardImpulseEnabled === 'boolean') S.engineGuardImpulseEnabled = engineGuardImpulseEnabled;
      const engineGuardNoiseEnabled = await storage.get(ENGINE_GUARD_NOISE_ENABLED_KEY);
      if (typeof engineGuardNoiseEnabled === 'boolean') S.engineGuardNoiseEnabled = engineGuardNoiseEnabled;
      const engineGuardImpulse = await storage.get(ENGINE_GUARD_IMPULSE_KEY);
      if (typeof engineGuardImpulse === 'number') S.engineGuardImpulse = Math.max(0.20, Math.min(1.00, Number(engineGuardImpulse)));
      const engineGuardNoise = await storage.get(ENGINE_GUARD_NOISE_KEY);
      if (typeof engineGuardNoise === 'number') S.engineGuardNoise = Math.max(0.30, Math.min(1.00, Number(engineGuardNoise)));
      const engineGuardStabilizerSec = await storage.get(ENGINE_GUARD_STABILIZER_SEC_KEY);
      if (typeof engineGuardStabilizerSec === 'number') S.engineGuardStabilizerSec = Math.max(0, Math.min(20, Math.round(Number(engineGuardStabilizerSec))));
      S.engineGuardEnabled = !!(S.engineGuardImpulseEnabled || S.engineGuardNoiseEnabled || Number(S.engineGuardStabilizerSec || 0) > 0);
      const proPrecalcEnabled = await storage.get(PRO_PRECALC_ENABLED_KEY);
      if (typeof proPrecalcEnabled === 'boolean') S.proPrecalcEnabled = proPrecalcEnabled;
      const proDriftEnabled = await storage.get(PRO_DRIFT_ENABLED_KEY);
      if (typeof proDriftEnabled === 'boolean') S.driftProtectionEnabled = proDriftEnabled;
      const proSpikeEnabled = await storage.get(PRO_SPIKE_ENABLED_KEY);
      if (typeof proSpikeEnabled === 'boolean') S.spikeProtectionEnabled = proSpikeEnabled;
      const proDojiEnabled = await storage.get(PRO_DOJI_ENABLED_KEY);
      if (typeof proDojiEnabled === 'boolean') S.filterDojiEnabled = proDojiEnabled;
      const proDojiSensitivity = await storage.get(PRO_DOJI_SENSITIVITY_KEY);
      if (typeof proDojiSensitivity === 'number') S.dojiSensitivity = Math.max(0.01, Math.min(0.5, Number(proDojiSensitivity)));
      const proSrEnabled = await storage.get(PRO_SR_ENABLED_KEY);
      if (typeof proSrEnabled === 'boolean') S.filterSrEnabled = proSrEnabled;
      const proSrLookback = await storage.get(PRO_SR_LOOKBACK_KEY);
      if (typeof proSrLookback === 'number') S.srLookback = Math.max(5, Math.min(120, Math.round(Number(proSrLookback))));
    
    // --- NEW FILTERS (Advanced) ---
    S.filterSpreadEnabled = !!(await storage.get(FILTER_SPREAD_ENABLED_KEY, false));
    S.filterSpreadThreshold = clamp(parseNumberFlexible(await storage.get(FILTER_SPREAD_THRESHOLD_KEY, 20)) || 20, 0, 100);

    S.filterDriftEnabled = !!(await storage.get(FILTER_DRIFT_ENABLED_KEY, false));
    S.filterDriftThreshold = clamp(parseNumberFlexible(await storage.get(FILTER_DRIFT_THRESHOLD_KEY, 10)) || 10, 0, 100);

    S.filterFlipDelayEnabled = !!(await storage.get(FILTER_FLIPDELAY_ENABLED_KEY, false));
    S.filterFlipDelaySec = clamp(parseNumberFlexible(await storage.get(FILTER_FLIPDELAY_SEC_KEY, 20)) || 20, 0, 300);

    S.impulseCapEnabled = !!(await storage.get(FILTER_IMPULSECAP_ENABLED_KEY, false));
    S.impulseCapMaxPerCandle = clamp(parseNumberFlexible(await storage.get(FILTER_IMPULSECAP_MAX_KEY, 2)) || 2, 1, 5);
    S.deadMarketEnabled = !!(await storage.get(FILTER_DEAD_MARKET_ENABLED_KEY, false));
    S.deadMarketMinMove = Math.max(0.00001, Number(parseNumberFlexible(await storage.get(FILTER_DEAD_MARKET_MIN_MOVE_KEY, 0.00010)) || 0.00010));
    S.deadMarketMinLatencyMs = clamp(parseNumberFlexible(await storage.get(FILTER_DEAD_MARKET_MIN_LATENCY_MS_KEY, 1500)) || 1500, 200, 10000);
    S.deadMarketPanelOpen = !!(await storage.get(FILTER_DEAD_MARKET_PANEL_OPEN_KEY, false));
    S.cseaSeFilterEnabled = !!(await storage.get(FILTER_CSEA_SE_ENABLED_KEY, false));


    S.rangeOscPenaltyEnabled = !!(await storage.get(RANGE_OSC_PENALTY_ENABLED_KEY, true));
    S.rangeOscPenaltyPct = clamp(parseNumberFlexible(await storage.get(RANGE_OSC_PENALTY_PCT_KEY, 20)) || 20, 0, 50);
    // paint UI (if present)
    const SPREAD_ENABLED = $id('iaa-spread-enabled');
    const SPREAD_THRESHOLD = $id('iaa-spread-threshold');
    const SPREAD_BAR = $id('iaa-spread-bar');

    const DRIFT_ENABLED = $id('iaa-drift-enabled');
    const DRIFT_THRESHOLD = $id('iaa-drift-threshold');
    const DRIFT_BAR = $id('iaa-drift-bar');

    const FLIPDELAY_ENABLED = $id('iaa-flipdelay-enabled');
    const FLIPDELAY_SEC = $id('iaa-flipdelay-sec');

    const IMPULSECAP_ENABLED = $id('iaa-impulsecap-enabled');
    const IMPULSECAP_MAX = $id('iaa-impulsecap-max');
    const IMPULSECAP_BAR = $id('iaa-impulsecap-bar');
    const DEADMARKET_ENABLED = $id('iaa-deadmarket-enabled');
    const DEADMARKET_MIN_MOVE = $id('iaa-deadmarket-min-move');
    const DEADMARKET_MIN_LATENCY = $id('iaa-deadmarket-min-latency');
    const DEADMARKET_BODY = $id('iaa-deadmarket-body');
    const DEADMARKET_PANEL = $id('iaa-deadmarket-panel');
    const DEADMARKET_TOGGLE = $id('iaa-deadmarket-toggle');
    const CSEA_SE_ENABLED = $id('iaa-csea-se-enabled');


    const RANGE_OSC_PENALTY_ENABLED = $id('iaa-range-osc-penalty-enabled');
    const RANGE_OSC_PENALTY = $id('iaa-range-osc-penalty');
    const paintBar = (el, v, min, max)=>{
      if (!el) return;
      const pct = Math.max(0, Math.min(1, (v-min)/(max-min)));
      const blocks = 10;
      const full = Math.round(pct*blocks);
      const bar = '█'.repeat(full) + '░'.repeat(Math.max(0, blocks-full));
      let color = '#93c5fd'; // soft blue
      if (pct >= 0.66) color = '#fca5a5'; // soft red
      else if (pct >= 0.33) color = '#fde68a'; // soft yellow
      else color = '#86efac'; // soft green
      el.textContent = bar + ' ' + v;
      el.style.color = color;
    };

    if (SPREAD_ENABLED) SPREAD_ENABLED.checked = S.filterSpreadEnabled;
    if (SPREAD_THRESHOLD) SPREAD_THRESHOLD.value = String(S.filterSpreadThreshold);
    paintBar(SPREAD_BAR, S.filterSpreadThreshold, 0, 100);

    if (DRIFT_ENABLED) DRIFT_ENABLED.checked = S.filterDriftEnabled;
    if (DRIFT_THRESHOLD) DRIFT_THRESHOLD.value = String(S.filterDriftThreshold);
    paintBar(DRIFT_BAR, S.filterDriftThreshold, 0, 100);

    if (FLIPDELAY_ENABLED) FLIPDELAY_ENABLED.checked = S.filterFlipDelayEnabled;
    if (FLIPDELAY_SEC) FLIPDELAY_SEC.value = String(S.filterFlipDelaySec);

    if (IMPULSECAP_ENABLED) IMPULSECAP_ENABLED.checked = S.impulseCapEnabled;
    if (IMPULSECAP_MAX) IMPULSECAP_MAX.value = String(S.impulseCapMaxPerCandle);
    paintBar(IMPULSECAP_BAR, S.impulseCapMaxPerCandle, 1, 5);
    if (DEADMARKET_ENABLED) DEADMARKET_ENABLED.checked = !!S.deadMarketEnabled;
    if (DEADMARKET_MIN_MOVE) DEADMARKET_MIN_MOVE.value = Number(S.deadMarketMinMove || 0.00010).toFixed(5);
    if (DEADMARKET_MIN_LATENCY) DEADMARKET_MIN_LATENCY.value = String(Math.round(Number(S.deadMarketMinLatencyMs || 1500)));
    if (DEADMARKET_BODY) DEADMARKET_BODY.style.display = '';
    if (DEADMARKET_PANEL) DEADMARKET_PANEL.style.display = S.deadMarketPanelOpen ? 'block' : 'none';
    if (DEADMARKET_TOGGLE) DEADMARKET_TOGGLE.textContent = S.deadMarketPanelOpen ? '▾' : '▸';
    if (CSEA_SE_ENABLED) CSEA_SE_ENABLED.checked = !!S.cseaSeFilterEnabled;


    if (RANGE_OSC_PENALTY_ENABLED) RANGE_OSC_PENALTY_ENABLED.checked = !!S.rangeOscPenaltyEnabled;
    if (RANGE_OSC_PENALTY) RANGE_OSC_PENALTY.value = String(S.rangeOscPenaltyPct);
    const hookCheckbox = (el, onChange)=>{
      if (!el) return;
      el.addEventListener('change', ()=>{ onChange(); persistSettings(); });
    };
    const hookInput = (el, onChange)=>{
      if (!el) return;
      el.addEventListener('input', ()=>{ onChange(); persistSettings(); });
    };

    hookCheckbox(SPREAD_ENABLED, ()=>{ S.filterSpreadEnabled = !!SPREAD_ENABLED.checked; });
    hookInput(SPREAD_THRESHOLD, ()=>{
      S.filterSpreadThreshold = clamp(parseNumberFlexible(SPREAD_THRESHOLD.value) || 0, 0, 100);
      paintBar(SPREAD_BAR, S.filterSpreadThreshold, 0, 100);
    });

    hookCheckbox(DRIFT_ENABLED, ()=>{ S.filterDriftEnabled = !!DRIFT_ENABLED.checked; });
    hookInput(DRIFT_THRESHOLD, ()=>{
      S.filterDriftThreshold = clamp(parseNumberFlexible(DRIFT_THRESHOLD.value) || 0, 0, 100);
      paintBar(DRIFT_BAR, S.filterDriftThreshold, 0, 100);
    });

    hookCheckbox(FLIPDELAY_ENABLED, ()=>{ S.filterFlipDelayEnabled = !!FLIPDELAY_ENABLED.checked; });
    hookInput(FLIPDELAY_SEC, ()=>{ S.filterFlipDelaySec = clamp(parseNumberFlexible(FLIPDELAY_SEC.value) || 0, 0, 300); });

    // "Дръж таба активен" (checkbox lives in the existing settings UI)
    // NOTE: keep the reference local here to avoid relying on a later-scoped const.
    const keepTabActiveEl = $id('iaa-killer-keep-alive');
    if (keepTabActiveEl) keepTabActiveEl.checked = !!S.killerKeepAliveEnabled;
    hookCheckbox(keepTabActiveEl, ()=>{ S.killerKeepAliveEnabled = !!keepTabActiveEl.checked; S.killerKeepAliveEnabled = S.killerKeepAliveEnabled; try{ if (typeof persistSettings==='function') persistSettings(); }catch(e){} });
  // Delegated listener: settings UI may re-render; bind by id too
  if (!window.__iaa_keepAliveDelegated) {
    window.__iaa_keepAliveDelegated = true;
    document.addEventListener('change', (ev) => {
      const el = ev && ev.target;
      if (!el || el.id !== 'iaa-killer-keep-alive') return;
      S.killerKeepAliveEnabled = !!el.checked;
      S.killerKeepAliveEnabled = S.killerKeepAliveEnabled;
      try { persistSettings(); } catch (e) {}
    }, true);
  }

    hookCheckbox(IMPULSECAP_ENABLED, ()=>{ S.impulseCapEnabled = !!IMPULSECAP_ENABLED.checked; });
    hookInput(IMPULSECAP_MAX, ()=>{
      S.impulseCapMaxPerCandle = clamp(parseNumberFlexible(IMPULSECAP_MAX.value) || 2, 1, 5);
      paintBar(IMPULSECAP_BAR, S.impulseCapMaxPerCandle, 1, 5);
    });
    hookCheckbox(DEADMARKET_ENABLED, ()=>{ S.deadMarketEnabled = !!DEADMARKET_ENABLED.checked; });
    hookInput(DEADMARKET_MIN_MOVE, ()=>{
      const v = parseNumberFlexible(DEADMARKET_MIN_MOVE.value);
      S.deadMarketMinMove = Math.max(0.00001, Number.isFinite(v) ? Number(v) : 0.00010);
      DEADMARKET_MIN_MOVE.value = Number(S.deadMarketMinMove).toFixed(5);
    });
    hookInput(DEADMARKET_MIN_LATENCY, ()=>{
      const v = parseNumberFlexible(DEADMARKET_MIN_LATENCY.value);
      S.deadMarketMinLatencyMs = clamp(Number.isFinite(v) ? Number(v) : 1500, 200, 10000);
      DEADMARKET_MIN_LATENCY.value = String(Math.round(S.deadMarketMinLatencyMs));
    });
    hookCheckbox(CSEA_SE_ENABLED, ()=>{ S.cseaSeFilterEnabled = !!CSEA_SE_ENABLED.checked; });

    hookCheckbox(RANGE_OSC_PENALTY_ENABLED, ()=>{ S.rangeOscPenaltyEnabled = !!RANGE_OSC_PENALTY_ENABLED.checked; });
    hookInput(RANGE_OSC_PENALTY, ()=>{ S.rangeOscPenaltyPct = clamp(parseNumberFlexible(RANGE_OSC_PENALTY.value) || 0, 0, 50); });
}

    async function persistSettings(){
      storage.set(BASE_AMOUNT_KEY, S.baseAmount ?? 100);
      storage.set(EXPIRY_KEY, S.expirySetting);
      storage.set(ANALYSIS_ENABLED_KEY, S.analysisEnabled);
      storage.set(ANALYSIS_CONFIDENCE_KEY, S.analysisConfidenceThreshold);
      storage.set(TRADE_INTERVAL_MIN_KEY, S.tradeIntervalMin);
      storage.set(MAX_СДЕЛКИ_PER_MIN_KEY, S.maxTradesPerMinute);
      storage.set(MAX_OPEN_СДЕЛКИ_KEY, S.maxOpenTrades);
      storage.set(MAX_SESSION_ЗАГУБИ_KEY, Math.max(0, Math.round(S.maxSessionLossCents || 0)));
      storage.set(MAX_CONSECUTIVE_ЗАГУБИES_KEY, Math.max(0, Math.round(S.maxConsecutiveLosses || 0)));
      storage.set(ENTRYПЕЧАЛБИ_TF_ENABLED_KEY, !!S.entryWindowTfEnabled);
      storage.set(ENTRYПЕЧАЛБИ_1M_SEC_KEY, Number.isFinite(S.entryWindowSec1m) ? S.entryWindowSec1m : 15);
      storage.set(ENTRYПЕЧАЛБИ_3M_SEC_KEY, Number.isFinite(S.entryWindowSec3m) ? S.entryWindowSec3m : 35);
      storage.set(ENTRYПЕЧАЛБИ_5M_SEC_KEY, Number.isFinite(S.entryWindowSec5m) ? S.entryWindowSec5m : 150);
      storage.set(PAYOUT_MIN_KEY, S.payoutMin);
      storage.set(PAYOUT_MAX_KEY, S.payoutMax);
      storage.set(PAYOUT_REQUIRED_KEY, S.payoutRequired);
      storage.set(DYNAMIC_TIME_KEY, S.dynamicExpiryEnabled);
      storage.set(DYNAMIC_MODE_KEY, getDynamicMode());
      storage.set(DYNAMIC_MIN_SEC_KEY, S.dynamicMinSec);
      storage.set(DYNAMIC_MAX_SEC_KEY, S.dynamicMaxSec);
      storage.set(DYNAMIC_ALLOW_NO_TRADE_KEY, !!S.dynamicAllowNoTrade);
      storage.set(DYNAMIC_EXPIRY_STEP_SEC_KEY, S.dynamicExpiryStepSec);
      storage.set(DYNAMIC_ENTRY_STEP_SEC_KEY, S.dynamicEntryStepSec);
      storage.set(DYNAMIC_LOOKBACK_SEC_KEY, S.dynamicLookbackSec);
      storage.set(DYNAMIC_MIN_SAMPLES_KEY, S.dynamicMinSamples);
      storage.set(DYNAMIC_MIN_WINRATE_KEY, S.dynamicMinWinrate);
      storage.set(DYNAMIC_CHOP_PENALTY_KEY, S.dynamicChopPenalty);
      storage.set(DYNAMIC_LATE_PENALTY_KEY, S.dynamicLatePenalty);
      storage.set(DYNAMIC_STAKE_SCALE_ENABLED_KEY, !!S.dynamicStakeScaleEnabled);
      storage.set(DYNAMIC_STAKE_MULT8_KEY, S.dynamicStakeMult8);
      storage.set(DYNAMIC_STAKE_MULT9_KEY, S.dynamicStakeMult9);
      storage.set(DYNAMIC_STAKE_BOOST_KEY, S.dynamicStakeBoostWr);
      storage.set(DYNAMIC_STAKE_BOOST_MIN_SAMPLES_KEY, S.dynamicStakeBoostMinSamples);
      storage.set(DYNAMIC_STAKE_LOSS_REDUCE_KEY, S.dynamicStakeLossReduce);
      storage.set(DYNAMIC_TWO_STAGE_SEARCH_KEY, !!S.dynamicTwoStageEnabled);
      storage.set(DYNAMIC_FINE_STEP_KEY, Math.max(1, Math.min(10, Math.round(S.dynamicFineStepSec || 1))));
      storage.set(DYNAMIC_CANDLE_SYNC_KEY, !!S.dynamicCandleSyncEnabled);
      storage.set(DYNAMIC_LATENCY_COMP_KEY, Math.max(0, Math.min(5000, Math.round(S.dynamicLatencyCompMs || 800))));
      storage.set(DYNAMIC_PRE_CALC_KEY, !!S.dynamicPreCalcEnabled);
      storage.set(DYNAMIC_VOLATILITY_ADAPTIVE_KEY, !!S.dynamicVolatilityAdaptive);
      storage.set(DYNAMIC_CORE_COLLAPSED_KEY, !!S.dynamicCoreCollapsed);
      storage.set(DYNAMIC_STAKE_COLLAPSED_KEY, !!S.dynamicStakeCollapsed);
      storage.set(KILLER_DYNAMIC_COLLAPSED_KEY, !!S.killerDynamicCollapsed);
      storage.set(KILLER_ENABLED_KEY, !!S.killerEnabled);
      storage.set(KILLER_HUD_ENABLED_KEY, !!S.killerHudEnabled);
      storage.set(KILLER_MIN_CONFLUENCE_KEY, S.killerMinConfluence);
      storage.set(KILLER_DOM_THRESHOLD_KEY, S.killerDominanceThreshold);
      storage.set(KILLER_PERFECT_TIME_KEY, !!S.killerPerfectTimeEnabled);
      storage.set(KILLER_PT_MODE_KEY, ['soft','hard','adaptive'].includes(String(S.killerPerfectTimeMode || 'hard')) ? String(S.killerPerfectTimeMode) : 'hard');
      storage.set(KILLER_ADX_DYNAMIC_KEY, !!S.killerAdxDynamicEnabled);
      storage.set(KILLER_CANDLE_HARDSTOP_KEY, !!S.killerCandleAgainstHardStop);
      storage.set(KILLER_SIGNAL_COOLDOWN_SEC_KEY, S.killerSignalCooldownSec);
      storage.set(KILLER_USE_STRATEGY_VOTES_KEY, !!S.killerUseStrategyVotes);
      storage.set(KILLER_STRATEGY_AGREEMENT_KEY, S.killerStrategyAgreementMin);
      storage.set(BIAS_ENABLED_KEY, !!S.biasEnabled);
      storage.set(BIAS_MODE_KEY, ['points','hybrid'].includes(S.biasMode) ? S.biasMode : 'points');
      storage.set(BIAS_STRONG_THRESHOLD_KEY, Math.max(0.20, Math.min(0.80, Number(S.biasStrongThreshold || 0.45))));
      storage.set(STABILITY_ENABLED_KEY, !!S.stabilityEnabled);
      storage.set(STABILITY_MAX_GAP_MS_KEY, Math.max(1000, Math.min(8000, Math.round(Number(S.stabilityMaxGapMs || 3500)))));
      storage.set(TOLERANCE_MODE_KEY, ['confidence','pt','either','off'].includes(S.toleranceMode) ? S.toleranceMode : 'either');
      storage.set(TOLERANCE_CONFIDENCE_KEY, Math.max(0.60, Math.min(0.95, Number(S.toleranceConfidence || 0.75))));
      storage.set(KILLER_THRESHOLD_MODE_KEY, ['7of11','8of11','9of11'].includes(S.killerThresholdMode) ? S.killerThresholdMode : '8of11');
      storage.set(SUPPORTING_FILTERS_ENABLED_KEY, !!S.supportingFiltersEnabled);
      storage.set(CHOP_V2_ENABLED_KEY, !!S.chopV2Enabled);
      storage.set(CHOP_V2_STRENGTH_KEY, Math.max(1, Math.min(100, Math.round(S.chopV2StrengthPct || 50))));
      storage.set(CHOP_V5_HARDSTOP_KEY, !!S.chopV5HardStopEnabled);
      storage.set(CHOP_V5_PANEL_OPEN_KEY, !!S.chopV5PanelOpen);
      storage.set(KILLER_HUD_POS_KEY, S.killerHudPos || { x: null, y: null });
      storage.set(IDLE_SWITCH_ENABLED_KEY, S.idleSwitchEnabled);
      storage.set(IDLE_SWITCH_MIN_KEY, S.idleSwitchMinutes);
      storage.set(MAX_TRADE_AMOUNT_KEY, S.maxTradeAmountCents);
      storage.set(MAX_TRADE_MULTIPLIER_KEY, S.maxTradeAmountMultiplier);
      storage.set(ANALYSIS_ПЕЧАЛБИDOW_SEC_KEY, S.analysisWindowSec);
      storage.set(ANALYSIS_WARMUP_MIN_KEY, S.analysisWarmupMin);
      storage.set(SELF_TRADE_ENABLED_KEY, S.selfTradeEnabled);
      storage.set(BUY_SELL_METHOD_KEY, S.buySellMethod);
      storage.set(XPATH_SELECTORS_KEY, S.xpathSelectors);
      storage.set(MODE_KEY, getActiveMode());
      storage.set(KILLER_KEEP_ALIVE_KEY, S.killerKeepAliveEnabled);
      storage.set(KEEP_ALIVE_KEY, !!(S.keepAliveEnabled || S.killerKeepAliveEnabled));
      storage.set(FILTERMODE_ENABLED_KEY, !!S.filterModeEnabled);
      storage.set(FILTERMODE_AUTO_KEY, !!S.filterModeAutoEnabled);
      storage.set(FILTERMODE_MANUAL_KEY, S.filterModeManual || 'soft');
      // Auto параметрите са сесийни (reset при reload) – не ги пазим в storage.
      storage.set(KILLER_BASE_AMOUNT_KEY, S.killerBaseAmount);
      storage.set(KILLER_THRESHOLD_KEY, S.killerThreshold);
      storage.set(KILLER_THRESHOLD_OTC_KEY, S.killerThresholdOtc);
      storage.set(KILLER_THRESHOLD_REAL_KEY, S.killerThresholdReal);
      storage.set(KILLER_VWAP_DEV_KEY, S.killerVwapDeviation);
      storage.set(KILLER_VWAP_LOOKBACK_KEY, S.killerVwapLookbackMin);
      storage.set(KILLER_MOMENTUM_KEY, S.killerMomentumThreshold);
      storage.set(KILLER_VOLUME_THRESHOLD_KEY, S.killerVolumeThreshold);
      storage.set(KILLER_EMA_FAST_KEY, S.killerEmaFast);
      storage.set(KILLER_EMA_SLOW_KEY, S.killerEmaSlow);
      storage.set(KILLER_RSI_OVERSOLD_KEY, S.killerRsiOversold);
      storage.set(KILLER_RSI_OVERBOUGHT_KEY, S.killerRsiOverbought);
      storage.set(KILLER_VWAP_WEIGHT_KEY, S.killerVwapWeight);
      storage.set(KILLER_MOMENTUM_WEIGHT_KEY, S.killerMomentumWeight);
      storage.set(KILLER_VOLUME_WEIGHT_KEY, S.killerVolumeWeight);
      storage.set(KILLER_VWAP_ENABLED_KEY, S.killerVwapEnabled);
      storage.set(KILLER_MOMENTUM_ENABLED_KEY, S.killerMomentumEnabled);
      storage.set(KILLER_VOLUME_ENABLED_KEY, S.killerVolumeEnabled);
      storage.set(KILLER_TIMEFRAMES_KEY, S.killerEnabledTimeframes);
      storage.set(FEATURE_VOLUME_REJECTION_KEY, S.featureVolumeRejection);
      storage.set(FEATURE_VWAP_ANALYSIS_KEY, S.featureVwapAnalysis);
      storage.set(FEATURE_SESSION_BOOST_KEY, S.featureSessionBoost);      storage.set(PHASE_CATCH_MOVE_KEY, !!S.phaseCatchMoveEnabled);
      storage.set(PHASE_RELOAD_KILLER_KEY, !!S.phaseReloadKillerEnabled);
      storage.set(FEATURE_TIMEFRAMES_KEY, S.killerEnabledTimeframes);      storage.set(STRATEGY_CONFIG_KEY, S.strategyConfigs);
      storage.set(RSI_DIVERGENCE_LOOKBACK_KEY, S.rsiDivergenceLookback);
      storage.set(RSI_DIVERGENCE_MIN_DELTA_KEY, S.rsiDivergenceMinDelta);
      storage.set(RSI_DIVERGENCE_RSI_ПЕЧАЛБИDOW_KEY, S.rsiDivergenceRsiWindow);
      storage.set(CANDLE_PATTERN_MIN_CONF_KEY, S.candlestickPatternMinConfidence);
      storage.set(CANDLE_PATTERN_ENABLED_KEY, S.candlestickPatternEnabled);
      storage.set(CANDLE_PATTERN_WEIGHT_KEY, S.candlestickPatternWeight);
      storage.set(EMA_RSI_FAST_KEY, S.emaRsiFast);
      storage.set(EMA_RSI_SLOW_KEY, S.emaRsiSlow);
      storage.set(EMA_RSI_RSI_ПЕЧАЛБИDOW_KEY, S.emaRsiWindow);
      storage.set(EMA_RSI_OVERSOLD_KEY, S.emaRsiOversold);
      storage.set(EMA_RSI_OVERBOUGHT_KEY, S.emaRsiOverbought);
      storage.set(PARTNER_READY_1M_BARS_KEY, S.partnerReadyBars1m);
      storage.set(PARTNER_READY_3M_BARS_KEY, S.partnerReadyBars3m);
      storage.set(PARTNER_READY_5M_BARS_KEY, S.partnerReadyBars5m);
      storage.set(PARTNER_READY_15M_BARS_KEY, S.partnerReadyBars15m);
      storage.set(REGIME_STRENGTH_KEY, S.regimeStrength);
      storage.set(CONFIRMATION_STRENGTH_KEY, S.confirmationStrength);
      storage.set(BIAS_STRENGTH_KEY, S.biasStrength);
      storage.set(BIAS_TF_1M_KEY, !!S.biasTimeframes['1m']);
      storage.set(BIAS_TF_3M_KEY, !!S.biasTimeframes['3m']);
      storage.set(BIAS_TF_5M_KEY, !!S.biasTimeframes['5m']);
      storage.set(BIAS_POINT_MIN_STRENGTH_KEY, ['low','medium','high'].includes(String(S.biasPointMinStrength||'')) ? String(S.biasPointMinStrength) : 'medium');
      storage.set(CONFLICT_STRENGTH_KEY, S.conflictStrength);
      storage.set(ENGINE_GUARD_ENABLED_KEY, !!S.engineGuardEnabled);
      storage.set(ENGINE_GUARD_PANEL_OPEN_KEY, !!S.engineGuardPanelOpen);
      storage.set(ENGINE_GUARD_IMPULSE_ENABLED_KEY, !!S.engineGuardImpulseEnabled);
      storage.set(ENGINE_GUARD_NOISE_ENABLED_KEY, !!S.engineGuardNoiseEnabled);
      storage.set(ENGINE_GUARD_IMPULSE_KEY, Number(S.engineGuardImpulse || 0.70));
      storage.set(ENGINE_GUARD_NOISE_KEY, Number(S.engineGuardNoise || 0.55));
      storage.set(ENGINE_GUARD_STABILIZER_SEC_KEY, Math.round(Number(S.engineGuardStabilizerSec || 0)));
      storage.set(PRO_PRECALC_ENABLED_KEY, !!S.proPrecalcEnabled);
      storage.set(PRO_DRIFT_ENABLED_KEY, !!S.driftProtectionEnabled);
      storage.set(PRO_SPIKE_ENABLED_KEY, !!S.spikeProtectionEnabled);
      storage.set(PRO_DOJI_ENABLED_KEY, !!S.filterDojiEnabled);
      storage.set(PRO_DOJI_SENSITIVITY_KEY, Number(S.dojiSensitivity || 0.15));
      storage.set(PRO_SR_ENABLED_KEY, !!S.filterSrEnabled);
      storage.set(PRO_SR_LOOKBACK_KEY, Math.max(5, Math.min(120, Math.round(Number(S.srLookback || 20)))));
      await storage.set(FILTER_SPREAD_ENABLED_KEY, !!S.filterSpreadEnabled);
      await storage.set(FILTER_SPREAD_THRESHOLD_KEY, Number(S.filterSpreadThreshold || 0));

      await storage.set(FILTER_DRIFT_ENABLED_KEY, !!S.filterDriftEnabled);
      await storage.set(FILTER_DRIFT_THRESHOLD_KEY, Number(S.filterDriftThreshold || 0));

      await storage.set(FILTER_FLIPDELAY_ENABLED_KEY, !!S.filterFlipDelayEnabled);
      await storage.set(FILTER_FLIPDELAY_SEC_KEY, Number(S.filterFlipDelaySec || 0));

      await storage.set(FILTER_IMPULSECAP_ENABLED_KEY, !!S.impulseCapEnabled);
      await storage.set(FILTER_IMPULSECAP_MAX_KEY, Number(S.impulseCapMaxPerCandle || 2));
      await storage.set(FILTER_DEAD_MARKET_ENABLED_KEY, !!S.deadMarketEnabled);
      await storage.set(FILTER_DEAD_MARKET_MIN_MOVE_KEY, Number(S.deadMarketMinMove || 0.00010));
      await storage.set(FILTER_DEAD_MARKET_MIN_LATENCY_MS_KEY, Math.round(Number(S.deadMarketMinLatencyMs || 1500)));
      await storage.set(FILTER_DEAD_MARKET_PANEL_OPEN_KEY, !!S.deadMarketPanelOpen);
      await storage.set(FILTER_CSEA_SE_ENABLED_KEY, !!S.cseaSeFilterEnabled);



      await storage.set(RANGE_OSC_PENALTY_ENABLED_KEY, !!S.rangeOscPenaltyEnabled);
      await storage.set(RANGE_OSC_PENALTY_PCT_KEY, Number(S.rangeOscPenaltyPct || 0));
    }
    function captureSettingsSnapshot(){}


    function restoreSettingsSnapshot(){}


    function renderSettingsPanel(){

      const modeKiller = $id('iaa-mode-killer');
      if (modeKiller) modeKiller.style.flex = '1 1 100%';
      const killerPanel = $id('iaa-settings-killer');
      const killerSettingsBody = $id('iaa-killer-settings-body');
      const killerCollapse = $id('iaa-killer-collapse');
      const killerWeightsToggle = $id('iaa-killer-weights-toggle');
      const killerWeightsBody = $id('iaa-killer-weights-body');
      const newFiltersBody = $id('iaa-newfilters-body');
      const newFiltersToggle = $id('iaa-newfilters-toggle');

      const dynamicCoreBody = $id('iaa-dynamic-core-body');
      const dynamicStakeToggle = $id('iaa-dynamic-stake-toggle');
      const dynamicStakeBody = $id('iaa-dynamic-stake-body');
      const killerDynamicBody = $id('iaa-killer-dynamic-body');

      if (newFiltersToggle && newFiltersBody) {
        // Single binding (onclick) to avoid double-toggle after re-renders.
        newFiltersToggle.onclick = () => {
          S.killerNewFiltersCollapsed = !S.killerNewFiltersCollapsed;
          persistSettings();
          newFiltersBody.style.display = S.killerNewFiltersCollapsed ? 'none' : '';
          newFiltersToggle.textContent = S.killerNewFiltersCollapsed ? '▸' : '▾';
        };
        // Initial paint
        newFiltersBody.style.display = S.killerNewFiltersCollapsed ? 'none' : '';
        newFiltersToggle.textContent = S.killerNewFiltersCollapsed ? '▸' : '▾';
      }

      if (dynamicCoreBody) dynamicCoreBody.style.display = '';
      if (killerDynamicBody) killerDynamicBody.style.display = '';

      const killerSmartToggle = $id('iaa-killer-smart-toggle');
      const killerSmartBody = $id('iaa-killer-smart-body');
      const killerEngineToggle = $id('iaa-killer-engine-toggle');
      const killerEngineBody = $id('iaa-killer-engine-body');
      const killerRiskToggle = $id('iaa-killer-risk-toggle');
      const killerRiskBody = $id('iaa-killer-risk-body');
      const killerThreshold = $id('iaa-killer-threshold');
      const killerThresholdOtc = $id('iaa-killer-threshold-otc');
      const killerThresholdReal = $id('iaa-killer-threshold-real');
      const killerBase = $id('iaa-killer-base');
      const killerMinPayout = $id('iaa-killer-min-payout');
      const KILLER_MIN_PAYOUT = killerMinPayout;
      const KILLER_MIN_PAYOUT_ENABLED = $id('iaa-killer-min-payout-enabled');

      const ENTRYПЕЧАЛБИ_ENABLED = $id('iaa-entrywin-enabled');
      const ENTRYПЕЧАЛБИ_1M = $id('iaa-entrywin-1m');
      const ENTRYПЕЧАЛБИ_3M = $id('iaa-entrywin-3m');
      const ENTRYПЕЧАЛБИ_5M = $id('iaa-entrywin-5m');
      const killerWarmup = $id('iaa-killer-warmup');
      const killerMaxSessionLoss = $id('iaa-killer-max-session-loss');
      const killerMaxLossStreak = $id('iaa-killer-max-loss-streak');
      const killerEmaFast = $id('iaa-killer-ema-fast');
      const killerEmaSlow = $id('iaa-killer-ema-slow');
      const killerRsiOversold = $id('iaa-killer-rsi-oversold');
      const killerRsiOverbought = $id('iaa-killer-rsi-overbought');
      const killerVwap = $id('iaa-killer-vwap');
      const killerMomentum = $id('iaa-killer-momentum');
      const killerVwapLookback = $id('iaa-killer-vwap-lookback');
      const killerVolumeThreshold = $id('iaa-killer-volume-threshold');
      const killerVwapWeight = $id('iaa-killer-vwap-weight');
      const killerMomentumWeight = $id('iaa-killer-momentum-weight');
      const killerVolumeWeight = $id('iaa-killer-volume-weight');
      const killerVwapEnabled = $id('iaa-killer-vwap-enabled');
      const killerMomentumEnabled = $id('iaa-killer-momentum-enabled');
      const killerVolumeEnabled = $id('iaa-killer-volume-enabled');
      const chopV2Enabled = $id('iaa-chop-v5-enabled');
                  const killerTf1m = $id('iaa-killer-tf-1m');
      const killerTf3m = $id('iaa-killer-tf-3m');
      const killerTf5m = $id('iaa-killer-tf-5m');
                  const killerKeepAlive = $id('iaa-killer-keep-alive');
      if (killerKeepAlive) killerKeepAlive.checked = !!S.killerKeepAliveEnabled;
      const keepAliveLabel = $id('iaa-killer-keepalive-label');
      if (keepAliveLabel) keepAliveLabel.style.color = S.killerKeepAliveEnabled ? '#22c55e' : UI_WARM_RED;
      const dynamicTimeToggleSettings = $id('iaa-dynamic-time-toggle-settings');
      const dynamicEnabledSettings = $id('iaa-dynamic-enabled-settings');
      const dynamicModeSettings = $id('iaa-dynamic-mode');
      const dynamicExpiryStepSettings = $id('iaa-dynamic-expiry-step-sec');
      const dynamicTwoStageSettings = $id('iaa-dynamic-two-stage-enabled');
      const dynamicFineStepSettings = $id('iaa-dynamic-fine-step');
      const dynamicMinSecSettings = $id('iaa-dynamic-min-sec');
      const dynamicMaxSecSettings = $id('iaa-dynamic-max-sec');
      const dynamicEntryStepSettings = $id('iaa-dynamic-entry-step-sec');
      const dynamicLookbackSettings = $id('iaa-dynamic-lookback-sec');
      const dynamicMinSamplesSettings = $id('iaa-dynamic-min-samples');
      const dynamicMinWinrateSettings = $id('iaa-dynamic-min-winrate');
      const dynamicChopPenaltySettings = $id('iaa-dynamic-chop-penalty');
      const dynamicLatePenaltySettings = $id('iaa-dynamic-late-penalty');
      const dynamicCandleSyncSettings = $id('iaa-dynamic-candle-sync-enabled');
      const dynamicLatencyCompSettings = $id('iaa-dynamic-latency-comp');
      const dynamicNoTradeSettings = $id('iaa-dynamic-no-trade');
      const dynamicPreCalcSettings = $id('iaa-dynamic-pre-calc-enabled');
      const dynamicVolatilityAdaptiveSettings = $id('iaa-dynamic-volatility-adaptive');
      const dynamicStakeScaleEnabledSettings = $id('iaa-dynamic-stake-scale-enabled');
      const dynamicStakeMult8Settings = $id('iaa-dynamic-stake-mult8');
      const dynamicStakeMult9Settings = $id('iaa-dynamic-stake-mult9');
      const dynamicStakeBoostSettings = $id('iaa-dynamic-stake-boost');
      const dynamicStakeBoostMinSamplesSettings = $id('iaa-dynamic-stake-boost-min-samples');
      const dynamicStakeLossReduceSettings = $id('iaa-dynamic-stake-loss-reduce');
      const featureVolumeRejection = $id('iaa-feature-volume-rejection');
      const featureVwapAnalysis = $id('iaa-feature-vwap-analysis');
      const featureSessionBoost = $id('iaa-feature-session-boost');
      const phaseCatchMove = $id('iaa-phase-catch-move');
      const phaseReloadSnipe = $id('iaa-phase-reload-snipe');            const featureTf1m = $id('iaa-feature-tf-1m');
      const featureTf3m = $id('iaa-feature-tf-3m');
      const featureTf5m = $id('iaa-feature-tf-5m');
      const featureTf15m = $id('iaa-feature-tf-15m');
            const idleSwitchEnabled = $id('iaa-idle-switch-enabled');
      const idleSwitchMin = $id('iaa-idle-switch-min');
      const emaRsiPullbackEnabled = $id('iaa-strategy-ema-rsi-pullback-enabled');
      const scalpMicrotrendEnabled = $id('iaa-strategy-scalp-microtrend-enabled');
      const continuationEnabled = $id('iaa-strategy-continuation-enabled');
      const continuationMaturity = $id('iaa-strategy-continuation-maturity');
      const partnerReady1m = $id('iaa-partner-ready-1m');
      const partnerReady3m = $id('iaa-partner-ready-3m');
      const partnerReady5m = $id('iaa-partner-ready-5m');
      const partnerReady15m = $id('iaa-partner-ready-15m');
      const emaRsiFast = $id('iaa-ema-rsi-fast');
      const emaRsiSlow = $id('iaa-ema-rsi-slow');
      const emaRsiWindow = $id('iaa-ema-rsi-window');
      const emaRsiOversold = $id('iaa-ema-rsi-oversold');
      const emaRsiOverbought = $id('iaa-ema-rsi-overbought');
      const candlePatternEnabled = $id('iaa-candle-pattern-enabled');
      const candlePatternMinConf = $id('iaa-candle-pattern-min-conf');
      const candlePatternWeight = $id('iaa-candle-pattern-weight');
      const hideFieldRow = (el) => { const row = el?.closest?.('.iaa-field-row'); if (row) row.style.display = 'none'; };
      hideFieldRow(emaRsiFast); hideFieldRow(emaRsiSlow); hideFieldRow(emaRsiWindow); hideFieldRow(emaRsiOversold); hideFieldRow(emaRsiOverbought);
      const maxTradesPerMinute = $id('iaa-max-trades-per-minute');
      const maxOpenTrades = $id('iaa-max-open-trades');
      const regimeStrength = $id('iaa-regime-strength');
      const confirmationStrength = $id('iaa-confirmation-strength');
      const biasStrength = $id('iaa-bias-strength');
      const biasTf1m = $id('iaa-bias-tf-1m');
      const biasTf3m = $id('iaa-bias-tf-3m');
      const biasTf5m = $id('iaa-bias-tf-5m');
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
      if (killerThreshold) killerThreshold.value = Math.round(((S.killerThreshold ?? 0.7) * 100));
      if (killerBase) killerBase.value = (S.killerBaseAmount ?? 10000) / 100;
      if (killerMinPayout) killerMinPayout.value = Math.round(S.killerMinPayout ?? 85);
      const killerMinPayoutEnabled = $id('iaa-killer-min-payout-enabled');
      if (killerMinPayoutEnabled) killerMinPayoutEnabled.checked = (S.killerMinPayoutEnabled ?? true);
      if (killerMinPayout && killerMinPayoutEnabled) killerMinPayout.disabled = !killerMinPayoutEnabled.checked;
      if (ENTRYПЕЧАЛБИ_ENABLED) ENTRYПЕЧАЛБИ_ENABLED.checked = !!S.entryWindowTfEnabled;
      if (ENTRYПЕЧАЛБИ_1M) ENTRYПЕЧАЛБИ_1M.value = Number.isFinite(S.entryWindowSec1m) ? S.entryWindowSec1m : 15;
      if (ENTRYПЕЧАЛБИ_3M) ENTRYПЕЧАЛБИ_3M.value = Number.isFinite(S.entryWindowSec3m) ? S.entryWindowSec3m : 35;
      if (ENTRYПЕЧАЛБИ_5M) ENTRYПЕЧАЛБИ_5M.value = Number.isFinite(S.entryWindowSec5m) ? S.entryWindowSec5m : 150;
      if (killerWarmup) killerWarmup.value = S.killerWarmupMin ?? 10;
      if (killerMaxSessionLoss) killerMaxSessionLoss.value = (S.maxSessionLossCents || 0) / 100;
      if (killerMaxLossStreak) killerMaxLossStreak.value = S.maxConsecutiveLosses || 0;
      if (killerVwap) killerVwap.value = Number((((S.killerVwapDeviation ?? KILLER_5S_DEFAULTS.vwapDeviation) * 100)).toFixed(2));
      if (killerMomentum) killerMomentum.value = Number((((S.killerMomentumThreshold ?? KILLER_5S_DEFAULTS.momentumThreshold) * 100)).toFixed(2));
      if (killerVwapLookback) killerVwapLookback.value = S.killerVwapLookbackMin ?? KILLER_5S_DEFAULTS.vwapLookbackMin;
      if (killerVolumeThreshold) killerVolumeThreshold.value = S.killerVolumeThreshold ?? KILLER_5S_DEFAULTS.volumeThreshold;
      if (killerVwapEnabled) killerVwapEnabled.checked = !!S.killerVwapEnabled;
      if (killerMomentumEnabled) killerMomentumEnabled.checked = !!S.killerMomentumEnabled;
      if (killerVolumeEnabled) killerVolumeEnabled.checked = !!S.killerVolumeEnabled;
      if (chopV2Enabled) chopV2Enabled.checked = !!S.chopV2Enabled;
      if (killerVwapWeight) killerVwapWeight.value = Math.round(((S.killerVwapWeight ?? 0.55) * 100));
      if (killerMomentumWeight) killerMomentumWeight.value = Math.round(((S.killerMomentumWeight ?? 0.35) * 100));
      if (killerVolumeWeight) killerVolumeWeight.value = Math.round(((S.killerVolumeWeight ?? 0.10) * 100));
      if (killerEmaFast) killerEmaFast.value = S.killerEmaFast ?? KILLER_5S_DEFAULTS.emaFast;
      if (killerEmaSlow) killerEmaSlow.value = S.killerEmaSlow ?? KILLER_5S_DEFAULTS.emaSlow;
            if (killerTf1m) killerTf1m.checked = S.killerEnabledTimeframes['1m'];
      if (killerTf3m) killerTf3m.checked = S.killerEnabledTimeframes['3m'];
      if (killerTf5m) killerTf5m.checked = S.killerEnabledTimeframes['5m'];
      if (killerKeepAlive) killerKeepAlive.checked = S.killerKeepAliveEnabled;
      if (dynamicEnabledSettings) dynamicEnabledSettings.checked = !!S.dynamicExpiryEnabled;
      if (dynamicModeSettings) dynamicModeSettings.value = getDynamicMode();
      if (dynamicExpiryStepSettings) dynamicExpiryStepSettings.value = Number.isFinite(S.dynamicExpiryStepSec) ? S.dynamicExpiryStepSec : 5;
      if (dynamicTwoStageSettings) dynamicTwoStageSettings.checked = !!S.dynamicTwoStageEnabled;
      if (dynamicFineStepSettings) dynamicFineStepSettings.value = Number.isFinite(S.dynamicFineStepSec) ? S.dynamicFineStepSec : 1;
      if (dynamicMinSecSettings) dynamicMinSecSettings.value = Number.isFinite(S.dynamicMinSec) ? S.dynamicMinSec : 15;
      if (dynamicMaxSecSettings) dynamicMaxSecSettings.value = Number.isFinite(S.dynamicMaxSec) ? S.dynamicMaxSec : 300;
      if (dynamicEntryStepSettings) dynamicEntryStepSettings.value = Number.isFinite(S.dynamicEntryStepSec) ? S.dynamicEntryStepSec : 5;
      if (dynamicLookbackSettings) dynamicLookbackSettings.value = Number.isFinite(S.dynamicLookbackSec) ? S.dynamicLookbackSec : 600;
      if (dynamicMinSamplesSettings) dynamicMinSamplesSettings.value = Number.isFinite(S.dynamicMinSamples) ? S.dynamicMinSamples : 40;
      if (dynamicMinWinrateSettings) dynamicMinWinrateSettings.value = Math.round(clamp01(S.dynamicMinWinrate ?? 0.55) * 100);
      if (dynamicChopPenaltySettings) dynamicChopPenaltySettings.value = Math.round(Math.max(0, Number(S.dynamicChopPenalty ?? 0.03)) * 100);
      if (dynamicLatePenaltySettings) dynamicLatePenaltySettings.value = Math.round(Math.max(0, Number(S.dynamicLatePenalty ?? 0.02)) * 100);
      if (dynamicCandleSyncSettings) dynamicCandleSyncSettings.checked = !!S.dynamicCandleSyncEnabled;
      if (dynamicLatencyCompSettings) dynamicLatencyCompSettings.value = Number.isFinite(S.dynamicLatencyCompMs) ? S.dynamicLatencyCompMs : 800;
      if (dynamicNoTradeSettings) dynamicNoTradeSettings.checked = !!S.dynamicAllowNoTrade;
      if (dynamicPreCalcSettings) dynamicPreCalcSettings.checked = !!S.dynamicPreCalcEnabled;
      if (dynamicVolatilityAdaptiveSettings) dynamicVolatilityAdaptiveSettings.checked = !!S.dynamicVolatilityAdaptive;
      if (dynamicStakeScaleEnabledSettings) dynamicStakeScaleEnabledSettings.checked = !!S.dynamicStakeScaleEnabled;
      if (dynamicStakeMult8Settings) dynamicStakeMult8Settings.value = Number(S.dynamicStakeMult8 ?? 0.15).toFixed(2);
      if (dynamicStakeMult9Settings) dynamicStakeMult9Settings.value = Number(S.dynamicStakeMult9 ?? 0.30).toFixed(2);
      if (dynamicStakeBoostSettings) dynamicStakeBoostSettings.value = Number(S.dynamicStakeBoostWr ?? 0.05).toFixed(2);
      if (dynamicStakeBoostMinSamplesSettings) dynamicStakeBoostMinSamplesSettings.value = Math.round(Number(S.dynamicStakeBoostMinSamples ?? 60));
      if (dynamicStakeLossReduceSettings) dynamicStakeLossReduceSettings.value = Math.round(Math.max(0, Number(S.dynamicStakeLossReduce ?? 0.10)) * 100);
      const killerEnabledSettings = $id('iaa-killer-enabled');
      const killerHudEnabledSettings = $id('iaa-killer-hud-enabled');
      const killerMinConfluenceSettings = $id('iaa-killer-threshold-mode');
      const killerDomThresholdSettings = $id('iaa-killer-dominance-threshold');
      const killerPerfectTimeSettings = $id('iaa-killer-perfect-time');
      const ptModeSoftSettings = $id('iaa-pt-mode-soft');
      const ptModeHardSettings = $id('iaa-pt-mode-hard');
      const ptModeAdaptiveSettings = $id('iaa-pt-mode-adaptive');
      const ptModesRowSettings = $id('iaa-pt-modes-row');
      const killerCooldownSettings = $id('iaa-killer-cooldown-sec');
      const killerAdxDynamicSettings = $id('iaa-killer-adx-dynamic');
      const killerCandleHardStopSettings = $id('iaa-killer-candle-hardstop');
      const killerUseStrategyVotesSettings = $id('iaa-killer-use-strategy-votes');
      const killerStrategyAgreementSettings = $id('iaa-killer-strategy-agreement');
      const supportingFiltersEnabledSettings = $id('iaa-supporting-filters-enabled');
      const chopV2EnabledSettings = $id('iaa-chop-v5-enabled');
      const chopV2StrengthSettings = $id('iaa-chop-v5-strength');
      const chopV5HardstopSettings = $id('iaa-chop-v5-hardstop');
      const chopV5ToggleSettings = $id('iaa-chop-v5-toggle');
      const chopV5PanelSettings = $id('iaa-chop-v5-panel');
      const biasEnabledSettings = $id('iaa-bias-enabled');
      const biasModeSettings = $id('iaa-bias-mode');
      const biasPointMinStrengthSettings = $id('iaa-bias-point-min-strength');
      const biasStrongThresholdSettings = $id('iaa-bias-strong-threshold');
      const stabilityEnabledSettings = $id('iaa-stability-enabled');
      const stabilityMaxGapMsSettings = $id('iaa-stability-max-gap-ms');
      const toleranceModeSettings = $id('iaa-tolerance-mode');
      const toleranceConfidenceSettings = $id('iaa-tolerance-confidence');
      const engineGuardToggleSettings = $id('iaa-engine-guard-toggle');
      const engineGuardPanelSettings = $id('iaa-engine-guard-panel');
      const engineGuardImpulseEnabledSettings = $id('iaa-engine-impulse-enabled');
      const engineGuardNoiseEnabledSettings = $id('iaa-engine-noise-enabled');
      const engineGuardImpulseSettings = $id('iaa-engine-impulse');
      const engineGuardNoiseSettings = $id('iaa-engine-noise');
      const engineGuardStabilizerSettings = $id('iaa-engine-stabilizer-sec');
      const proFiltersToggleSettings = $id('iaa-pro-filters-toggle');
      const proFiltersPanelSettings = $id('iaa-pro-filters-panel');
      const proPrecalcEnabledSettings = $id('iaa-pro-precalc-enabled');
      const proDriftEnabledSettings = $id('iaa-pro-drift-enabled');
      const proSpikeEnabledSettings = $id('iaa-pro-spike-enabled');
      const proDojiEnabledSettings = $id('iaa-pro-doji-enabled');
      const proDojiSensitivitySettings = $id('iaa-pro-doji-sensitivity');
      const proSrEnabledSettings = $id('iaa-pro-sr-enabled');
      const proSrLookbackSettings = $id('iaa-pro-sr-lookback');
      if (killerEnabledSettings) { killerEnabledSettings.checked = !!S.killerEnabled; killerEnabledSettings.disabled = false; killerEnabledSettings.title = "Вкл./изкл. KILLER филтъра"; }
      if (killerHudEnabledSettings) killerHudEnabledSettings.checked = !!S.killerHudEnabled;
      if (killerMinConfluenceSettings) killerMinConfluenceSettings.value = ['7of11','8of11','9of11'].includes(S.killerThresholdMode) ? S.killerThresholdMode : '8of11';
      if (killerDomThresholdSettings) killerDomThresholdSettings.value = Math.max(50, Math.min(90, Math.round(S.killerDominanceThreshold || 68)));
      if (killerPerfectTimeSettings) killerPerfectTimeSettings.checked = !!S.killerPerfectTimeEnabled;
      if (ptModeSoftSettings) ptModeSoftSettings.checked = String(S.killerPerfectTimeMode || 'hard') === 'soft';
      if (ptModeHardSettings) ptModeHardSettings.checked = String(S.killerPerfectTimeMode || 'hard') === 'hard';
      if (ptModeAdaptiveSettings) ptModeAdaptiveSettings.checked = String(S.killerPerfectTimeMode || 'hard') === 'adaptive';
      if (ptModesRowSettings) { const en = !!S.killerPerfectTimeEnabled; ptModesRowSettings.style.opacity = en ? '1' : '0.45'; ptModesRowSettings.style.pointerEvents = en ? 'auto' : 'none'; }
      if (killerCooldownSettings) killerCooldownSettings.value = Math.max(0, Math.min(30, Math.round(S.killerSignalCooldownSec || 5)));
      if (killerAdxDynamicSettings) killerAdxDynamicSettings.checked = !!S.killerAdxDynamicEnabled;
      if (killerCandleHardStopSettings) killerCandleHardStopSettings.checked = !!S.killerCandleAgainstHardStop;
      if (killerUseStrategyVotesSettings) killerUseStrategyVotesSettings.checked = !!S.killerUseStrategyVotes;
      if (killerStrategyAgreementSettings) killerStrategyAgreementSettings.value = Math.max(1, Math.min(3, Math.round(S.killerStrategyAgreementMin || 1)));
      if (supportingFiltersEnabledSettings) supportingFiltersEnabledSettings.checked = !!S.supportingFiltersEnabled;
      if (chopV2EnabledSettings) chopV2EnabledSettings.checked = !!S.chopV2Enabled;
      if (chopV2StrengthSettings) chopV2StrengthSettings.value = Math.max(1, Math.min(100, Math.round(S.chopV2StrengthPct || 50)));
      if (chopV5HardstopSettings) chopV5HardstopSettings.checked = !!S.chopV5HardStopEnabled;
      if (chopV5PanelSettings) chopV5PanelSettings.style.display = S.chopV5PanelOpen ? 'block' : 'none';
      if (chopV5ToggleSettings) chopV5ToggleSettings.textContent = S.chopV5PanelOpen ? '▾' : '▸';
      if (biasEnabledSettings) biasEnabledSettings.checked = !!S.biasEnabled;
      if (biasModeSettings) biasModeSettings.value = ['points','hybrid'].includes(S.biasMode) ? S.biasMode : 'points';
      if (biasPointMinStrengthSettings) biasPointMinStrengthSettings.value = ['low','medium','high'].includes(String(S.biasPointMinStrength||'medium')) ? String(S.biasPointMinStrength) : 'medium';
      if (biasStrongThresholdSettings) biasStrongThresholdSettings.value = Number(S.biasStrongThreshold || 0.45).toFixed(2);
      if (stabilityEnabledSettings) stabilityEnabledSettings.checked = !!S.stabilityEnabled;
      if (stabilityMaxGapMsSettings) stabilityMaxGapMsSettings.value = Math.max(1000, Math.min(8000, Math.round(Number(S.stabilityMaxGapMs || 3500))));
      if (toleranceModeSettings) toleranceModeSettings.value = ['confidence','pt','either','off'].includes(S.toleranceMode) ? S.toleranceMode : 'either';
      if (toleranceConfidenceSettings) toleranceConfidenceSettings.value = Number(S.toleranceConfidence || 0.75).toFixed(2);
      if (engineGuardPanelSettings) engineGuardPanelSettings.style.display = S.engineGuardPanelOpen ? 'block' : 'none';
      if (engineGuardToggleSettings) engineGuardToggleSettings.textContent = S.engineGuardPanelOpen ? '▾' : '▸';
      if (engineGuardImpulseEnabledSettings) engineGuardImpulseEnabledSettings.checked = !!S.engineGuardImpulseEnabled;
      if (engineGuardNoiseEnabledSettings) engineGuardNoiseEnabledSettings.checked = !!S.engineGuardNoiseEnabled;
      if (engineGuardImpulseSettings) engineGuardImpulseSettings.value = Number(S.engineGuardImpulse ?? 0.70).toFixed(2);
      if (engineGuardNoiseSettings) engineGuardNoiseSettings.value = Number(S.engineGuardNoise ?? 0.55).toFixed(2);
      if (engineGuardStabilizerSettings) engineGuardStabilizerSettings.value = String(Math.max(0, Math.min(20, Math.round(Number(S.engineGuardStabilizerSec ?? 3)))));
      if (proFiltersPanelSettings) proFiltersPanelSettings.style.display = S.proFiltersPanelOpen ? 'block' : 'none';
      if (proFiltersToggleSettings) proFiltersToggleSettings.textContent = S.proFiltersPanelOpen ? '▾' : '▸';
      if (proPrecalcEnabledSettings) proPrecalcEnabledSettings.checked = !!S.proPrecalcEnabled;
      if (proDriftEnabledSettings) proDriftEnabledSettings.checked = !!S.driftProtectionEnabled;
      if (proSpikeEnabledSettings) proSpikeEnabledSettings.checked = !!S.spikeProtectionEnabled;
      if (proDojiEnabledSettings) proDojiEnabledSettings.checked = !!S.filterDojiEnabled;
      if (proDojiSensitivitySettings) proDojiSensitivitySettings.value = String(Math.round(Math.max(0.01, Math.min(0.5, Number(S.dojiSensitivity || 0.15))) * 100));
      if (proSrEnabledSettings) proSrEnabledSettings.checked = !!S.filterSrEnabled;
      if (proSrLookbackSettings) proSrLookbackSettings.value = String(Math.max(5, Math.min(120, Math.round(Number(S.srLookback || 20)))));
      const biasBody = $id('iaa-bias-body'); const biasPanel = $id('iaa-bias-panel'); const biasToggle = $id('iaa-bias-toggle');
      const stabBody = $id('iaa-stability-body'); const stabPanel = $id('iaa-stability-panel'); const stabToggle = $id('iaa-stability-toggle');
      if (biasBody) biasBody.style.display = ''; if (stabBody) stabBody.style.display = '';
      if (biasPanel) biasPanel.style.display = (S.biasPanelOpen ? 'block' : 'none'); if (biasToggle) biasToggle.textContent = S.biasPanelOpen ? '▾' : '▸';
      if (stabPanel) stabPanel.style.display = (S.stabilityPanelOpen ? 'block' : 'none'); if (stabToggle) stabToggle.textContent = S.stabilityPanelOpen ? '▾' : '▸';
      if (featureVolumeRejection) featureVolumeRejection.checked = !!S.featureVolumeRejection;
      if (featureVwapAnalysis) featureVwapAnalysis.checked = !!S.featureVwapAnalysis;
      if (featureSessionBoost) featureSessionBoost.checked = !!S.featureSessionBoost;
      if (phaseCatchMove) phaseCatchMove.checked = !!S.phaseCatchMoveEnabled;
      if (phaseReloadSnipe) phaseReloadSnipe.checked = !!S.phaseReloadKillerEnabled;      if (featureTf1m) featureTf1m.checked = !!S.killerEnabledTimeframes?.['1m'];
      if (featureTf3m) featureTf3m.checked = !!S.killerEnabledTimeframes?.['3m'];
      if (featureTf5m) featureTf5m.checked = !!S.killerEnabledTimeframes?.['5m'];
      if (featureTf15m) featureTf15m.checked = !!S.killerEnabledTimeframes?.['15m'];
      if (emaRsiPullbackEnabled) emaRsiPullbackEnabled.checked = isStrategyEnabled('ema_rsi_pullback');
      if (scalpMicrotrendEnabled) scalpMicrotrendEnabled.checked = isStrategyEnabled('scalp_microtrend');
      if (continuationEnabled) continuationEnabled.checked = isStrategyEnabled('continuation');
      if (continuationMaturity) continuationMaturity.value = String(Math.max(10, Math.min(100, Math.round(Number(getStrategyConfig('continuation')?.maxTrendMaturity ?? 65)))));
      if (partnerReady1m) partnerReady1m.value = S.partnerReadyBars1m ?? 10;
      if (partnerReady3m) partnerReady3m.value = S.partnerReadyBars3m ?? 6;
      if (partnerReady5m) partnerReady5m.value = S.partnerReadyBars5m ?? 3;
      if (partnerReady15m) partnerReady15m.value = S.partnerReadyBars15m ?? 2;
      if (emaRsiFast) emaRsiFast.value = S.emaRsiFast ?? 8;
      if (emaRsiSlow) emaRsiSlow.value = S.emaRsiSlow ?? 21;
      if (emaRsiWindow) emaRsiWindow.value = S.emaRsiWindow ?? 14;
      if (emaRsiOversold) emaRsiOversold.value = S.emaRsiOversold ?? 35;
      if (emaRsiOverbought) emaRsiOverbought.value = S.emaRsiOverbought ?? 65;
      if (candlePatternEnabled) candlePatternEnabled.checked = !!S.candlestickPatternEnabled;
      if (candlePatternMinConf) candlePatternMinConf.value = Math.round((S.candlestickPatternMinConfidence ?? 0.6) * 100);
      if (candlePatternWeight) candlePatternWeight.value = Math.round((S.candlestickPatternWeight ?? 0.25) * 100);
      if (maxTradesPerMinute) maxTradesPerMinute.value = S.maxTradesPerMinute ?? 5;
      if (maxOpenTrades) maxOpenTrades.value = S.maxOpenTrades ?? 5;
      if (regimeStrength) regimeStrength.value = (S.regimeStrength ?? 0.6).toFixed(2);
      if (confirmationStrength) confirmationStrength.value = (S.confirmationStrength ?? 0.7).toFixed(2);
      if (biasStrength) biasStrength.value = (S.biasStrength ?? 0.6).toFixed(2);
      if (biasTf1m) biasTf1m.checked = !!S.biasTimeframes?.['1m'];
      if (biasTf3m) biasTf3m.checked = !!S.biasTimeframes?.['3m'];
      if (biasTf5m) biasTf5m.checked = !!S.biasTimeframes?.['5m'];
      if (conflictStrength) conflictStrength.value = (S.conflictStrength ?? 0.6).toFixed(2);
      const vwapMax = (KILLER_5S_DEFAULTS.vwapDeviation || 0.0012) * 2;
      const momentumMax = (KILLER_5S_DEFAULTS.momentumThreshold || 0.0014) * 2;
      if (killerThreshold) applyStrictnessColor(killerThreshold, parseNumberFlexible(killerThreshold.value), { min: 0, max: 1, highIsStrict: true });
      if (killerVwap) applyStrictnessColor(killerVwap, parseNumberFlexible(killerVwap.value), { min: 0, max: vwapMax, highIsStrict: true });
      if (killerMomentum) applyStrictnessColor(killerMomentum, parseNumberFlexible(killerMomentum.value), { min: 0, max: momentumMax, highIsStrict: true });
      if (killerVwapWeight) applyStrictnessColor(killerVwapWeight, parseNumberFlexible(killerVwapWeight.value), { min: 1, max: 100, highIsStrict: true });
      if (killerMomentumWeight) applyStrictnessColor(killerMomentumWeight, parseNumberFlexible(killerMomentumWeight.value), { min: 1, max: 100, highIsStrict: false });
      if (killerVolumeWeight) applyStrictnessColor(killerVolumeWeight, parseNumberFlexible(killerVolumeWeight.value), { min: 1, max: 100, highIsStrict: false });
      if (killerVolumeThreshold) applyStrictnessColor(killerVolumeThreshold, parseNumberFlexible(killerVolumeThreshold.value), { min: 0, max: 1, highIsStrict: true });
      if (regimeStrength) applyStrictnessColor(regimeStrength, parseNumberFlexible(regimeStrength.value), { min: 0, max: 1, highIsStrict: true });
      if (confirmationStrength) applyStrictnessColor(confirmationStrength, parseNumberFlexible(confirmationStrength.value), { min: 0, max: 1, highIsStrict: true });
      if (biasStrength) applyStrictnessColor(biasStrength, parseNumberFlexible(biasStrength.value), { min: 0, max: 1, highIsStrict: true });
      if (conflictStrength) applyStrictnessColor(conflictStrength, parseNumberFlexible(conflictStrength.value), { min: 0, max: 1, highIsStrict: true });
      // Mini bars (проба само на 2 реда)
      if (killerThreshold) setMiniBar('iaa-bar-threshold', parseNumberFlexible(killerThreshold.value), 1, 100, 10, { highIsStrict: true });
      if (killerVwap) setMiniBar('iaa-bar-vwapdev', parseNumberFlexible(killerVwap.value), 0, 0.30, 10, { highIsStrict: true });
      applySettingsInputColors();

      if (killerSettingsBody) killerSettingsBody.style.display = S.killerSettingsCollapsed ? 'none' : 'block';
      if (killerCollapse) killerCollapse.textContent = S.killerSettingsCollapsed ? '▸' : '▾';
      if (killerWeightsBody) killerWeightsBody.style.display = S.killerWeightsCollapsed ? 'none' : 'block';
      if (killerWeightsToggle) killerWeightsToggle.textContent = S.killerWeightsCollapsed ? '▸' : '▾';
      if (newFiltersBody) newFiltersBody.style.display = S.killerNewFiltersCollapsed ? 'none' : 'block';
      if (newFiltersToggle) newFiltersToggle.textContent = S.killerNewFiltersCollapsed ? '▸' : '▾';
      if (dynamicCoreBody) dynamicCoreBody.style.display = 'block';
      if (dynamicStakeBody) dynamicStakeBody.style.display = S.dynamicStakeCollapsed ? 'none' : 'block';
      if (dynamicStakeToggle) dynamicStakeToggle.textContent = S.dynamicStakeCollapsed ? '▸' : '▾';
      if (killerDynamicBody) killerDynamicBody.style.display = 'block';
      if (killerSmartBody) killerSmartBody.style.display = S.killerSmartCollapsed ? 'none' : 'block';
      if (killerSmartToggle) killerSmartToggle.textContent = S.killerSmartCollapsed ? '▸' : '▾';
      if (killerEngineBody) killerEngineBody.style.display = S.killerEngineCollapsed ? 'none' : 'block';
      if (killerEngineToggle) killerEngineToggle.textContent = S.killerEngineCollapsed ? '▸' : '▾';
      if (killerRiskBody) killerRiskBody.style.display = S.killerRiskCollapsed ? 'none' : 'block';
      if (killerRiskToggle) killerRiskToggle.textContent = S.killerRiskCollapsed ? '▸' : '▾';
      if (killerPanel) killerPanel.style.display = 'block';
      const tabBodies = {
        basic: $id('iaa-tab-basic'),
        advanced: $id('iaa-tab-advanced'),
        features: $id('iaa-tab-features'),
        analyses: $id('iaa-tab-analyses'),
        dynamic: $id('iaa-tab-dynamic')
      };
      if (!tabBodies[S.killerSettingsTab]) {
        S.killerSettingsTab = 'basic';
      }
      $$('.iaa-tab-btn').forEach((btn) => {
        const tab = btn.getAttribute('data-tab');
        const isActive = tab === S.killerSettingsTab;
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



    
    function openMousePanel(){
      try { if (typeof renderMousePanel === 'function') renderMousePanel(); } catch(e){}
      showPopup('iaa-mouse-panel');
    }
    function openKillerPanel(){
      // Killer HUD is opened ONLY via the 🔫 button on the main panel (no settings toggle).
      S.killerHudEnabled = true;
      try { if (typeof renderKillerHud === 'function') renderKillerHud(); } catch(e){}
      showPopup('iaa-killer-panel');
    }


// --- UI helper: position a popup near an anchor element (fallback if earlier helper isn't in scope)
function placePopupNear(popupId, anchorEl){
  try{
    const pop = document.getElementById(popupId);
    if(!pop || !anchorEl) return;
    pop.style.position = 'fixed';
    pop.style.left = '0px';
    pop.style.top  = '0px';
    pop.style.display = 'block';
    const ar = anchorEl.getBoundingClientRect();
    // Measure after display
    const pr = pop.getBoundingClientRect();
    const margin = 8;
    let left = ar.left;
    let top  = ar.bottom + margin;
    // Flip above if needed
    if(top + pr.height > window.innerHeight - margin){
      top = ar.top - pr.height - margin;
    }
    // Clamp
    left = Math.max(margin, Math.min(left, window.innerWidth - pr.width - margin));
    top  = Math.max(margin, Math.min(top,  window.innerHeight - pr.height - margin));
    pop.style.left = Math.round(left) + 'px';
    pop.style.top  = Math.round(top)  + 'px';
  }catch(e){}
}

function handlePanelPopupAction(action) {
      const showPopup = (popupId) => {
        const popup = $id(popupId);
        if (popup) popup.style.display = 'block';
      };
      const hidePopups = () => {
        const settings = $id('iaa-settings-panel');
        const mouse = $id('iaa-mouse-panel');
        const debug = $id('iaa-debug-panel');
        const calibration = $id('iaa-calibration-panel');
        const killer = $id('iaa-killer-panel');
        if (settings) settings.style.display = 'none';
        if (mouse) mouse.style.display = 'none';
        if (debug) debug.style.display = 'none';
        if (calibration) calibration.style.display = 'none';
        if (killer) killer.style.display = 'none';
        S.settingsPanelOpen = false;
        S.mousePanelOpen = false;
        S.calibrationPanelOpen = false;
        S.strategiesPanelOpen = false;
      };

      if (action === 'settings') {
        if (S.settingsPanelOpen) hidePopups();
        else { hidePopups(); showPopup('iaa-settings-panel'); S.settingsPanelOpen = true; captureSettingsSnapshot(); renderSettingsPanel(); }
        return;
      }
      if (action === 'mouse') {
        if (S.mousePanelOpen) hidePopups();
        else { hidePopups(); showPopup('iaa-mouse-panel'); S.mousePanelOpen = true; renderMousePanel(); }
        return;
      }
      if (action === 'debug') {
        const debug = $id('iaa-debug-panel');
        if (!debug) return;
        if (debug.style.display === 'block') hidePopups();
        else {
          hidePopups();
          debug.style.display = 'block';
          setDebugTab(S.debugTab || 'status');
        }
        return;
      }
      if (action === 'killer') { return; }
    }

    function rebindPanelPopupButtons() {
      const clearInline = (id) => {
        const el = $id(id);
        if (el) el.onclick = null;
      };
      clearInline('iaa-settings-toggle');
      clearInline('iaa-mouse-toggle');
      clearInline('iaa-debug-toggle');
      clearInline('iaa-killer-toggle');
    }

    function ensurePanelHandlers(){
      rebindPanelPopupButtons();
      const toggleBtn = $id('iaa-toggle');
      const autoBtn = $id('iaa-auto');
      const gridToggle = $id('iaa-grid-toggle');
      const dynamicTimeToggle = $id('iaa-dynamic-time-toggle');
      const dynamicTimeToggleSettings = $id('iaa-dynamic-time-toggle-settings');
      const panelEl = $id('iaa-panel');
      if (panelEl && !panelEl.dataset.popupDelegated) {
        panelEl.dataset.popupDelegated = '1';
        panelEl.addEventListener('click', (event) => {
          const target = event.target;
          if (!(target instanceof Element)) return;
          if (target.closest('#iaa-settings-toggle')) { event.preventDefault(); event.stopImmediatePropagation(); handlePanelPopupAction('settings'); return; }
          if (target.closest('#iaa-mouse-toggle')) { event.preventDefault(); event.stopImmediatePropagation(); handlePanelPopupAction('mouse'); return; }
          if (target.closest('#iaa-debug-toggle')) { event.preventDefault(); event.stopImmediatePropagation(); handlePanelPopupAction('debug'); return; }
          if (target.closest('#iaa-killer-toggle')) { event.preventDefault(); event.stopImmediatePropagation(); handlePanelPopupAction('killer'); }
        }, true);
      }

      const settingsToggleBtn = $id('iaa-settings-toggle');
      if (settingsToggleBtn && !settingsToggleBtn.dataset.boundPopupClick) {
        settingsToggleBtn.dataset.boundPopupClick = '1';
        settingsToggleBtn.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          handlePanelPopupAction('settings');
        });
      }

      const mouseToggleBtn = $id('iaa-mouse-toggle');
      if (mouseToggleBtn && !mouseToggleBtn.dataset.boundPopupClick) {
        mouseToggleBtn.dataset.boundPopupClick = '1';
        mouseToggleBtn.onclick = (event) => {
          if (event) {
            event.preventDefault();
            event.stopPropagation();
          }
          handlePanelPopupAction('mouse');
          return false;
        };
      }
      const killerToggleBtn = $id('iaa-killer-toggle');
      if (killerToggleBtn && !killerToggleBtn.dataset.boundPopupClick) {
        killerToggleBtn.dataset.boundPopupClick = '1';
        killerToggleBtn.onclick = (event) => {
          if (event) {
            event.preventDefault();
            event.stopPropagation();
          }
          handlePanelPopupAction('killer');
          return false;
        };
      }

      const settingsPanel = $id('iaa-settings-panel');
      if (settingsPanel && !settingsPanel.dataset.tabDelegated) {
        settingsPanel.dataset.tabDelegated = '1';
        settingsPanel.addEventListener('click', (event) => {
          const target = event.target;
          if (!(target instanceof Element)) return;
          const tabBtn = target.closest('.iaa-tab-btn');
          if (!tabBtn) return;
          const tab = tabBtn.getAttribute('data-tab');
          if (!tab) return;
          event.preventDefault();
          event.stopPropagation();
          S.killerSettingsTab = tab;
          renderSettingsPanel();
        });
      }

      $$('.iaa-tab-btn').forEach((btn) => {
        if (btn.dataset.boundTabClick) return;
        btn.dataset.boundTabClick = '1';
        btn.addEventListener('click', (event) => {
          const tab = btn.getAttribute('data-tab');
          if (!tab) return;
          event.preventDefault();
          event.stopPropagation();
          S.killerSettingsTab = tab;
          renderSettingsPanel();
        });
      });

      

const renderFilterModeIndicator = () => {
  if (!el) return;
  el.innerHTML = '';
  el.style.display = 'none';
};

const syncFilterModeUI = () => {
  if (cbEnabled && !cbEnabled.dataset.boundChange) {
    cbEnabled.dataset.boundChange = '1';
    cbEnabled.addEventListener('change', () => {
      S.filterModeEnabled = !!cbEnabled.checked;
      // Safety: когато е ИЗКЛ, не позволяваме режими
      if (!S.filterModeEnabled) {
        S.filterModeCurrent = 'off';
      } else {
        S.filterModeCurrent = (S.filterModeAutoEnabled ? 'auto' : (S.filterModeManual || 'soft'));
      }
      if (wrap) {
        const disabled = !S.filterModeEnabled;
        wrap.style.opacity = disabled ? '0.45' : '1';
        wrap.style.pointerEvents = disabled ? 'none' : 'auto';
        wrap.style.filter = disabled ? 'grayscale(0.25)' : 'none';
      }
      persistSettings();
    });
  }
  if (inFlips && !inFlips.dataset.boundChange) {
    inFlips.dataset.boundChange = '1';
    inFlips.addEventListener('change', () => {
      S.filterAutoFlipThreshold = clampInt(inFlips.value, 1, 20, 3);
      inFlips.value = String(S.filterAutoFlipThreshold);
      persistSettings();
    });
  }
  if (inDrops && !inDrops.dataset.boundChange) {
    inDrops.dataset.boundChange = '1';
    inDrops.addEventListener('change', () => {
      S.filterAutoDropThreshold = clampInt(inDrops.value, 1, 20, 2);
      inDrops.value = String(S.filterAutoDropThreshold);
      persistSettings();
    });
  }
};

const closeSettingsPanel = () => {
        const panel = $id('iaa-settings-panel');
        if (panel) panel.style.display = 'none';
        S.settingsPanelOpen = false;
      };

      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
          S.running = !S.running;
          
          /* IAA_SESSION_RESET_ON_START */
          try{
            S.sessionStats = S.sessionStats || { pnl:0, w:0, l:0, t:0, ws:0, deals:0 };
            if (S.running){
              // session begins when bot STARTs
              S.sessionStartMs = Date.now();
              S.sessionStats.pnl = 0; S.sessionStats.w = 0; S.sessionStats.l = 0; S.sessionStats.t = 0;
              S.wsDealSeen = Object.create(null);
        S.wsDealSeenId = Object.create(null);
        S.wsDealCloseSigSeen = Object.create(null); // id->1
              S.wsDealSeenCount = 0;
            }
          }catch(e){}
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
            (S.recentSignalKeys instanceof Set ? S.recentSignalKeys.clear() : (S.recentSignalKeys = new Set()));
            S.analysisReadyAt = S.analysisEnabled
              ? Date.now() + Math.max(1, S.analysisWarmupMin) * 60 * 1000
              : 0;
            S.killerWarmupUntil = Date.now();
            S.readinessStartedAt = Date.now();
            S.priceHistory = [];
            S.currentAssetPrice = null;
            S.lastPriceAt = 0;
            S.killerLastTradeByTf = {};
            S.killerNextTradeByTf = {};
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
            try { sessionResetAndStart(); } catch (e) {}

            if (getEffectiveKeepAliveEnabled()) {
              startKeepAlive();
            }
          } else {
            clearInterval(S.loop);
            S.loop = null;
            stopKeepAlive();
            stopPriceMonitoring();
            S.assetSelecting = false;
            S.assetSelectedForSignal = false;
            S.assetSelectionAttempted = false;
            S.forceImmediate = false;
            S.activeTrades = [];
            S.killerLastDecision = null;
            S.killerWarmupUntil = 0;
            S.killerTfStatus = {};
            S.tradeQualityScore = null;
            resetExecutionState();
            stopCountdown();
            setUIState('IDLE');
            renderWarmup(0);
            renderKillerMatrix();
            renderPendingTrades();
            try { sessionStop(); } catch (e) {}
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
          gridToggle.textContent = S.gridCollapsed ? '▸ Детайли' : '';
        };
        applyGridState();
        gridToggle.addEventListener('click', () => {
          S.gridCollapsed = !S.gridCollapsed;
          applyGridState();
        });
      }

      const dynamicEnabledInput = $id('iaa-dynamic-enabled-settings');
      const dynamicModeInput = $id('iaa-dynamic-mode');
      const dynamicExpiryStepInput = $id('iaa-dynamic-expiry-step-sec');
      const dynamicTwoStageInput = $id('iaa-dynamic-two-stage-enabled');
      const dynamicFineStepInput = $id('iaa-dynamic-fine-step');
      const dynamicMinSecInput = $id('iaa-dynamic-min-sec');
      const dynamicMaxSecInput = $id('iaa-dynamic-max-sec');
      const dynamicEntryStepInput = $id('iaa-dynamic-entry-step-sec');
      const dynamicLookbackInput = $id('iaa-dynamic-lookback-sec');
      const dynamicMinSamplesInput = $id('iaa-dynamic-min-samples');
      const dynamicMinWinrateInput = $id('iaa-dynamic-min-winrate');
      const dynamicChopPenaltyInput = $id('iaa-dynamic-chop-penalty');
      const dynamicLatePenaltyInput = $id('iaa-dynamic-late-penalty');
      const dynamicCandleSyncInput = $id('iaa-dynamic-candle-sync-enabled');
      const dynamicLatencyCompInput = $id('iaa-dynamic-latency-comp');
      const dynamicNoTradeInput = $id('iaa-dynamic-no-trade');
      const dynamicPreCalcInput = $id('iaa-dynamic-pre-calc-enabled');
      const dynamicVolatilityAdaptiveInput = $id('iaa-dynamic-volatility-adaptive');
      const dynamicStakeScaleEnabledInput = $id('iaa-dynamic-stake-scale-enabled');
      const dynamicStakeMult8Input = $id('iaa-dynamic-stake-mult8');
      const dynamicStakeMult9Input = $id('iaa-dynamic-stake-mult9');
      const dynamicStakeBoostInput = $id('iaa-dynamic-stake-boost');
      const dynamicStakeBoostMinSamplesInput = $id('iaa-dynamic-stake-boost-min-samples');
      const dynamicStakeLossReduceInput = $id('iaa-dynamic-stake-loss-reduce');

      if (dynamicTimeToggle) {
        dynamicTimeToggle.checked = !!S.dynamicExpiryEnabled;
        dynamicTimeToggle.addEventListener('change', () => {
          S.dynamicExpiryEnabled = !!dynamicTimeToggle.checked;
          if (dynamicTimeToggleSettings) dynamicTimeToggleSettings.checked = S.dynamicExpiryEnabled;
          if (dynamicEnabledInput) dynamicEnabledInput.checked = S.dynamicExpiryEnabled;
          persistSettings();
        });
      }

      const applyDynamicUiState = () => {
        const enabled = !!S.dynamicExpiryEnabled;
        const mode = getDynamicMode();
        const controls = [
          dynamicModeInput,
          dynamicExpiryStepInput,
          dynamicTwoStageInput,
          dynamicFineStepInput,
          dynamicMinSecInput,
          dynamicMaxSecInput,
          dynamicEntryStepInput,
          dynamicLookbackInput,
          dynamicMinSamplesInput,
          dynamicMinWinrateInput,
          dynamicChopPenaltyInput,
          dynamicLatePenaltyInput,
          dynamicCandleSyncInput,
          dynamicLatencyCompInput,
          dynamicNoTradeInput,
          dynamicPreCalcInput,
          dynamicVolatilityAdaptiveInput,
          dynamicStakeScaleEnabledInput,
          dynamicStakeMult8Input,
          dynamicStakeMult9Input,
          dynamicStakeBoostInput,
          dynamicStakeBoostMinSamplesInput,
          dynamicStakeLossReduceInput
        ];
        controls.forEach((el) => { if (el) el.disabled = !enabled; });
        if (dynamicModeInput) dynamicModeInput.disabled = !enabled;
        if (!enabled) return;
        S.dynamicMode = (mode === 'dynamic' || mode === 'hybrid') ? mode : 'off';
      };

      if (dynamicEnabledInput) {
        dynamicEnabledInput.addEventListener('change', () => {
          S.dynamicExpiryEnabled = !!dynamicEnabledInput.checked;
          if (dynamicTimeToggleSettings) dynamicTimeToggleSettings.checked = S.dynamicExpiryEnabled;
          if (dynamicTimeToggle) dynamicTimeToggle.checked = S.dynamicExpiryEnabled;
          applyDynamicUiState();
          persistSettings();
        });
      }
      if (dynamicModeInput) {
        dynamicModeInput.addEventListener('change', () => {
          const mode = String(dynamicModeInput.value || 'off').toLowerCase();
          S.dynamicMode = (mode === 'dynamic' || mode === 'hybrid') ? mode : 'off';
          persistSettings();
        });
      }
      if (dynamicExpiryStepInput) dynamicExpiryStepInput.addEventListener('input', () => { const d = parseNumberFlexible(dynamicExpiryStepInput.value); S.dynamicExpiryStepSec = Math.max(1, Math.min(30, Math.round(Number.isFinite(d) ? d : 5))); persistSettings(); });
      if (dynamicTwoStageInput) dynamicTwoStageInput.addEventListener('change', () => { S.dynamicTwoStageEnabled = !!dynamicTwoStageInput.checked; persistSettings(); });
      if (dynamicFineStepInput) dynamicFineStepInput.addEventListener('input', () => { const d = parseNumberFlexible(dynamicFineStepInput.value); S.dynamicFineStepSec = Math.max(1, Math.min(10, Math.round(Number.isFinite(d) ? d : 1))); persistSettings(); });
      if (dynamicMinSecInput) dynamicMinSecInput.addEventListener('input', () => { const d = parseNumberFlexible(dynamicMinSecInput.value); S.dynamicMinSec = Math.max(3, Math.min(3600, Math.round(Number.isFinite(d) ? d : 15))); persistSettings(); });
      if (dynamicMaxSecInput) dynamicMaxSecInput.addEventListener('input', () => { const d = parseNumberFlexible(dynamicMaxSecInput.value); S.dynamicMaxSec = Math.max(3, Math.min(3600, Math.round(Number.isFinite(d) ? d : 300))); persistSettings(); });
      if (dynamicEntryStepInput) dynamicEntryStepInput.addEventListener('input', () => { const d = parseNumberFlexible(dynamicEntryStepInput.value); S.dynamicEntryStepSec = Math.max(1, Math.min(30, Math.round(Number.isFinite(d) ? d : 5))); persistSettings(); });
      if (dynamicLookbackInput) dynamicLookbackInput.addEventListener('input', () => { const d = parseNumberFlexible(dynamicLookbackInput.value); S.dynamicLookbackSec = Math.max(60, Math.min(3600, Math.round(Number.isFinite(d) ? d : 600))); persistSettings(); });
      if (dynamicMinSamplesInput) dynamicMinSamplesInput.addEventListener('input', () => { const d = parseNumberFlexible(dynamicMinSamplesInput.value); S.dynamicMinSamples = Math.max(5, Math.min(1000, Math.round(Number.isFinite(d) ? d : 40))); persistSettings(); });
      if (dynamicMinWinrateInput) dynamicMinWinrateInput.addEventListener('input', () => { const d = parseNumberFlexible(dynamicMinWinrateInput.value); S.dynamicMinWinrate = clamp01((Number.isFinite(d) ? d : 55) / 100); persistSettings(); });
      if (dynamicChopPenaltyInput) dynamicChopPenaltyInput.addEventListener('input', () => { const d = parseNumberFlexible(dynamicChopPenaltyInput.value); S.dynamicChopPenalty = Math.max(0, Math.min(1, (Number.isFinite(d) ? d : 3) / 100)); persistSettings(); });
      if (dynamicLatePenaltyInput) dynamicLatePenaltyInput.addEventListener('input', () => { const d = parseNumberFlexible(dynamicLatePenaltyInput.value); S.dynamicLatePenalty = Math.max(0, Math.min(1, (Number.isFinite(d) ? d : 2) / 100)); persistSettings(); });
      if (dynamicCandleSyncInput) dynamicCandleSyncInput.addEventListener('change', () => { S.dynamicCandleSyncEnabled = !!dynamicCandleSyncInput.checked; persistSettings(); });
      if (dynamicLatencyCompInput) dynamicLatencyCompInput.addEventListener('input', () => { const d = parseNumberFlexible(dynamicLatencyCompInput.value); S.dynamicLatencyCompMs = Math.max(0, Math.min(5000, Math.round(Number.isFinite(d) ? d : 800))); persistSettings(); });
      if (dynamicNoTradeInput) dynamicNoTradeInput.addEventListener('change', () => { S.dynamicAllowNoTrade = !!dynamicNoTradeInput.checked; persistSettings(); });
      if (dynamicPreCalcInput) dynamicPreCalcInput.addEventListener('change', () => { S.dynamicPreCalcEnabled = !!dynamicPreCalcInput.checked; persistSettings(); });
      if (dynamicVolatilityAdaptiveInput) dynamicVolatilityAdaptiveInput.addEventListener('change', () => { S.dynamicVolatilityAdaptive = !!dynamicVolatilityAdaptiveInput.checked; persistSettings(); });
      if (dynamicStakeScaleEnabledInput) dynamicStakeScaleEnabledInput.addEventListener('change', () => { S.dynamicStakeScaleEnabled = !!dynamicStakeScaleEnabledInput.checked; persistSettings(); });
      if (dynamicStakeMult8Input) dynamicStakeMult8Input.addEventListener('input', () => { const d = parseNumberFlexible(dynamicStakeMult8Input.value); S.dynamicStakeMult8 = Math.max(0, Math.min(2, Number.isFinite(d) ? d : 0.15)); persistSettings(); });
      if (dynamicStakeMult9Input) dynamicStakeMult9Input.addEventListener('input', () => { const d = parseNumberFlexible(dynamicStakeMult9Input.value); S.dynamicStakeMult9 = Math.max(0, Math.min(2, Number.isFinite(d) ? d : 0.30)); persistSettings(); });
      if (dynamicStakeBoostInput) dynamicStakeBoostInput.addEventListener('input', () => { const d = parseNumberFlexible(dynamicStakeBoostInput.value); S.dynamicStakeBoostWr = Math.max(0, Math.min(1, Number.isFinite(d) ? d : 0.05)); persistSettings(); });
      if (dynamicStakeBoostMinSamplesInput) dynamicStakeBoostMinSamplesInput.addEventListener('input', () => { const d = parseNumberFlexible(dynamicStakeBoostMinSamplesInput.value); S.dynamicStakeBoostMinSamples = Math.max(1, Math.min(2000, Math.round(Number.isFinite(d) ? d : 60))); persistSettings(); });
      if (dynamicStakeLossReduceInput) dynamicStakeLossReduceInput.addEventListener('input', () => { const d = parseNumberFlexible(dynamicStakeLossReduceInput.value); S.dynamicStakeLossReduce = Math.max(0, Math.min(1, (Number.isFinite(d) ? d : 10) / 100)); persistSettings(); });
      // --- KILLER settings (bind after elements exist) ---
      const killerEnabledSettings = $id('iaa-killer-enabled');
      const killerHudEnabledSettings = $id('iaa-killer-hud-enabled');
      const killerMinConfluenceSettings = $id('iaa-killer-threshold-mode');
      const killerDomThresholdSettings = $id('iaa-killer-dominance-threshold');
      const killerPerfectTimeSettings = $id('iaa-killer-perfect-time');
      const ptModeSoftSettings = $id('iaa-pt-mode-soft');
      const ptModeHardSettings = $id('iaa-pt-mode-hard');
      const ptModeAdaptiveSettings = $id('iaa-pt-mode-adaptive');
      const ptModesRowSettings = $id('iaa-pt-modes-row');
      const killerCooldownSettings = $id('iaa-killer-cooldown-sec');
      const killerAdxDynamicSettings = $id('iaa-killer-adx-dynamic');
      const killerCandleHardstopSettings = $id('iaa-killer-candle-hardstop');
      const killerUseStrategyVotesSettings = $id('iaa-killer-use-strategy-votes');
      const killerStrategyAgreementSettings = $id('iaa-killer-strategy-agreement');
      const supportingFiltersEnabledSettings = $id('iaa-supporting-filters-enabled');
      const chopV2EnabledSettings = $id('iaa-chop-v5-enabled');
      const chopV2StrengthSettings = $id('iaa-chop-v5-strength');
      const chopV5HardstopSettings = $id('iaa-chop-v5-hardstop');
      const chopV5ToggleSettings = $id('iaa-chop-v5-toggle');
      const chopV5PanelSettings = $id('iaa-chop-v5-panel');
      const biasEnabledSettings = $id('iaa-bias-enabled');
      const biasModeSettings = $id('iaa-bias-mode');
      const biasPointMinStrengthSettings = $id('iaa-bias-point-min-strength');
      const biasStrongThresholdSettings = $id('iaa-bias-strong-threshold');
      const stabilityEnabledSettings = $id('iaa-stability-enabled');
      const stabilityMaxGapMsSettings = $id('iaa-stability-max-gap-ms');
      const toleranceModeSettings = $id('iaa-tolerance-mode');
      const toleranceConfidenceSettings = $id('iaa-tolerance-confidence');
      const biasToggleBtn = $id('iaa-bias-toggle');
      const biasPanel = $id('iaa-bias-panel');
      const stabilityToggleBtn = $id('iaa-stability-toggle');
      const stabilityPanel = $id('iaa-stability-panel');
      const deadMarketToggleBtn = $id('iaa-deadmarket-toggle');
      const deadMarketPanel = $id('iaa-deadmarket-panel');

      bindSettingsListenersOnce();
      bindOnce(killerEnabledSettings, 'change', () => { S.killerEnabled = !!killerEnabledSettings.checked; void persistSettings(); });
      if (killerHudEnabledSettings) killerHudEnabledSettings.addEventListener('change', () => { S.killerHudEnabled = !!killerHudEnabledSettings.checked; void persistSettings(); });
      if (killerMinConfluenceSettings) killerMinConfluenceSettings.addEventListener('change', () => { const v = String(killerMinConfluenceSettings.value || '8of11'); S.killerThresholdMode = ['7of11','8of11','9of11'].includes(v) ? v : '8of11'; S.killerMinConfluence = getScoreThresholdPoints(); void persistSettings(); });
      if (killerDomThresholdSettings) killerDomThresholdSettings.addEventListener('input', () => { const v = parseNumberFlexible(killerDomThresholdSettings.value); S.killerDominanceThreshold = Math.max(50, Math.min(90, Math.round(Number.isFinite(v) ? v : 68))); void persistSettings(); });
      const syncPtModeUi = () => {
        const en = !!S.killerPerfectTimeEnabled;
        if (ptModesRowSettings) { ptModesRowSettings.style.opacity = en ? '1' : '0.45'; ptModesRowSettings.style.pointerEvents = en ? 'auto' : 'none'; }
        if (!en) return;
        const mode = ['soft','hard','adaptive'].includes(String(S.killerPerfectTimeMode || 'hard')) ? String(S.killerPerfectTimeMode) : 'hard';
        if (ptModeSoftSettings) ptModeSoftSettings.checked = mode === 'soft';
        if (ptModeHardSettings) ptModeHardSettings.checked = mode === 'hard';
        if (ptModeAdaptiveSettings) ptModeAdaptiveSettings.checked = mode === 'adaptive';
      };
      if (killerPerfectTimeSettings) killerPerfectTimeSettings.addEventListener('change', () => { S.killerPerfectTimeEnabled = !!killerPerfectTimeSettings.checked; syncPtModeUi(); void persistSettings(); });
      const selectPtMode = (mode) => {
        S.killerPerfectTimeMode = mode;
        syncPtModeUi();
        void persistSettings();
      };
      if (ptModeSoftSettings) ptModeSoftSettings.addEventListener('change', () => { if (!S.killerPerfectTimeEnabled) return; if (ptModeSoftSettings.checked) selectPtMode('soft'); else syncPtModeUi(); });
      if (ptModeHardSettings) ptModeHardSettings.addEventListener('change', () => { if (!S.killerPerfectTimeEnabled) return; if (ptModeHardSettings.checked) selectPtMode('hard'); else syncPtModeUi(); });
      if (ptModeAdaptiveSettings) ptModeAdaptiveSettings.addEventListener('change', () => { if (!S.killerPerfectTimeEnabled) return; if (ptModeAdaptiveSettings.checked) selectPtMode('adaptive'); else syncPtModeUi(); });
      syncPtModeUi();
      if (killerCooldownSettings) killerCooldownSettings.addEventListener('input', () => { const v = parseNumberFlexible(killerCooldownSettings.value); S.killerSignalCooldownSec = Math.max(0, Math.min(30, Math.round(Number.isFinite(v) ? v : 5))); void persistSettings(); });
      if (killerAdxDynamicSettings) killerAdxDynamicSettings.addEventListener('change', () => { S.killerAdxDynamicEnabled = !!killerAdxDynamicSettings.checked; void persistSettings(); });
      if (killerCandleHardstopSettings) killerCandleHardstopSettings.addEventListener('change', () => { S.killerCandleAgainstHardStop = !!killerCandleHardstopSettings.checked; void persistSettings(); });
      if (killerUseStrategyVotesSettings) killerUseStrategyVotesSettings.addEventListener('change', () => { S.killerUseStrategyVotes = !!killerUseStrategyVotesSettings.checked; void persistSettings(); });
      if (killerStrategyAgreementSettings) killerStrategyAgreementSettings.addEventListener('change', () => { const v = parseNumberFlexible(killerStrategyAgreementSettings.value); S.killerStrategyAgreementMin = Math.max(1, Math.min(3, Math.round(Number.isFinite(v) ? v : 1))); void persistSettings(); });
      safeBindOnce(supportingFiltersEnabledSettings, 'change', () => { S.supportingFiltersEnabled = !!supportingFiltersEnabledSettings.checked; void persistSettings(); });
      if (typeof chopV2EnabledSettings !== 'undefined' && chopV2EnabledSettings) safeBindOnce(chopV2EnabledSettings, 'change', () => { S.chopV2Enabled = !!chopV2EnabledSettings.checked; void persistSettings(); });
      if (chopV2StrengthSettings) safeBindOnce(chopV2StrengthSettings, 'input', () => { const v = parseNumberFlexible(chopV2StrengthSettings.value); S.chopV2StrengthPct = Math.max(1, Math.min(100, Math.round(Number.isFinite(v) ? v : 50))); chopV2StrengthSettings.value = String(S.chopV2StrengthPct); void persistSettings(); });
      if (chopV5HardstopSettings) safeBindOnce(chopV5HardstopSettings, 'change', () => { S.chopV5HardStopEnabled = !!chopV5HardstopSettings.checked; void persistSettings(); });
      safeBindOnce(chopV5ToggleSettings, 'click', () => { S.chopV5PanelOpen = !S.chopV5PanelOpen; if (chopV5PanelSettings) chopV5PanelSettings.style.display = S.chopV5PanelOpen ? 'block' : 'none'; if (chopV5ToggleSettings) chopV5ToggleSettings.textContent = S.chopV5PanelOpen ? '▾' : '▸'; void persistSettings(); });
      safeBindOnce(biasEnabledSettings, 'change', () => { S.biasEnabled = !!biasEnabledSettings.checked; void persistSettings(); });
      safeBindOnce(biasModeSettings, 'change', () => { const v = String(biasModeSettings.value || 'points'); S.biasMode = ['points','hybrid'].includes(v) ? v : 'points'; void persistSettings(); });
      safeBindOnce(biasPointMinStrengthSettings, 'change', () => { const v = String(biasPointMinStrengthSettings.value || 'medium'); S.biasPointMinStrength = ['low','medium','high'].includes(v) ? v : 'medium'; void persistSettings(); });
      safeBindOnce(biasStrongThresholdSettings, 'input', () => { const v = parseNumberFlexible(biasStrongThresholdSettings.value); S.biasStrongThreshold = Math.max(0.20, Math.min(0.80, Number.isFinite(v) ? v : 0.45)); void persistSettings(); });
      safeBindOnce(stabilityEnabledSettings, 'change', () => { S.stabilityEnabled = !!stabilityEnabledSettings.checked; void persistSettings(); });
      safeBindOnce(stabilityMaxGapMsSettings, 'input', () => { const v = parseNumberFlexible(stabilityMaxGapMsSettings.value); S.stabilityMaxGapMs = Math.max(1000, Math.min(8000, Math.round(Number.isFinite(v) ? v : 3500))); void persistSettings(); });
      safeBindOnce(toleranceModeSettings, 'change', () => { const v = String(toleranceModeSettings.value || 'either'); S.toleranceMode = ['confidence','pt','either','off'].includes(v) ? v : 'either'; void persistSettings(); });
      safeBindOnce(toleranceConfidenceSettings, 'input', () => { const v = parseNumberFlexible(toleranceConfidenceSettings.value); S.toleranceConfidence = Math.max(0.60, Math.min(0.95, Number.isFinite(v) ? v : 0.75)); void persistSettings(); });
      const engineGuardToggleBtn = $id('iaa-engine-guard-toggle');
      const engineGuardPanel = $id('iaa-engine-guard-panel');
      const engineImpulseEnabledInput = $id('iaa-engine-impulse-enabled');
      const engineNoiseEnabledInput = $id('iaa-engine-noise-enabled');
      const engineImpulseInput = $id('iaa-engine-impulse');
      const engineNoiseInput = $id('iaa-engine-noise');
      const engineStabilizerInput = $id('iaa-engine-stabilizer-sec');
      const proFiltersToggleBtn = $id('iaa-pro-filters-toggle');
      const proFiltersPanel = $id('iaa-pro-filters-panel');
      const proPrecalcInput = $id('iaa-pro-precalc-enabled');
      const proDriftInput = $id('iaa-pro-drift-enabled');
      const proSpikeInput = $id('iaa-pro-spike-enabled');
      const proDojiInput = $id('iaa-pro-doji-enabled');
      const proDojiSensInput = $id('iaa-pro-doji-sensitivity');
      const proSrInput = $id('iaa-pro-sr-enabled');
      const proSrLookbackInput = $id('iaa-pro-sr-lookback');
      safeBindOnce(engineGuardToggleBtn, 'click', () => {
        S.engineGuardPanelOpen = !S.engineGuardPanelOpen;
        if (engineGuardPanel) engineGuardPanel.style.display = S.engineGuardPanelOpen ? 'block' : 'none';
        if (engineGuardToggleBtn) engineGuardToggleBtn.textContent = S.engineGuardPanelOpen ? '▾' : '▸';
        void persistSettings();
      });
      safeBindOnce(engineImpulseEnabledInput, 'change', () => {
        S.engineGuardImpulseEnabled = !!engineImpulseEnabledInput.checked;
        S.engineGuardEnabled = !!(S.engineGuardImpulseEnabled || S.engineGuardNoiseEnabled || Number(S.engineGuardStabilizerSec || 0) > 0);
        void persistSettings();
      });
      safeBindOnce(engineNoiseEnabledInput, 'change', () => {
        S.engineGuardNoiseEnabled = !!engineNoiseEnabledInput.checked;
        S.engineGuardEnabled = !!(S.engineGuardImpulseEnabled || S.engineGuardNoiseEnabled || Number(S.engineGuardStabilizerSec || 0) > 0);
        void persistSettings();
      });
      safeBindOnce(engineImpulseInput, 'input', () => { const v = parseNumberFlexible(engineImpulseInput.value); if (Number.isFinite(v)) S.engineGuardImpulse = Math.max(0.20, Math.min(1.00, Number(v))); void persistSettings(); });
      safeBindOnce(engineNoiseInput, 'input', () => { const v = parseNumberFlexible(engineNoiseInput.value); if (Number.isFinite(v)) S.engineGuardNoise = Math.max(0.30, Math.min(1.00, Number(v))); void persistSettings(); });
      safeBindOnce(engineStabilizerInput, 'input', () => {
        const v = parseNumberFlexible(engineStabilizerInput.value);
        if (Number.isFinite(v)) S.engineGuardStabilizerSec = Math.max(0, Math.min(20, Math.round(Number(v))));
        S.engineGuardEnabled = !!(S.engineGuardImpulseEnabled || S.engineGuardNoiseEnabled || Number(S.engineGuardStabilizerSec || 0) > 0);
        void persistSettings();
      });
      safeBindOnce(proFiltersToggleBtn, 'click', () => {
        S.proFiltersPanelOpen = !S.proFiltersPanelOpen;
        if (proFiltersPanel) proFiltersPanel.style.display = S.proFiltersPanelOpen ? 'block' : 'none';
        if (proFiltersToggleBtn) proFiltersToggleBtn.textContent = S.proFiltersPanelOpen ? '▾' : '▸';
        void persistSettings();
      });
      safeBindOnce(proPrecalcInput, 'change', () => {
        S.proPrecalcEnabled = !!proPrecalcInput.checked;
        if (!S.proPrecalcEnabled) {
          S.preCalculatedSignal = null;
          logConsoleLine('⚪ Предварителен анализ: ИЗКЛ');
        }
        void persistSettings();
      });
      safeBindOnce(proDriftInput, 'change', () => { S.driftProtectionEnabled = !!proDriftInput.checked; void persistSettings(); });
      safeBindOnce(proSpikeInput, 'change', () => { S.spikeProtectionEnabled = !!proSpikeInput.checked; if (!S.spikeProtectionEnabled) { S.blockBuy = false; S.blockSell = false; } void persistSettings(); });
      safeBindOnce(proDojiInput, 'change', () => { S.filterDojiEnabled = !!proDojiInput.checked; void persistSettings(); });
      safeBindOnce(proDojiSensInput, 'change', () => {
        const v = parseNumberFlexible(proDojiSensInput.value);
        S.dojiSensitivity = Math.max(0.01, Math.min(0.5, (Number.isFinite(v) ? Number(v) : 15) / 100));
        if (proDojiSensInput) proDojiSensInput.value = String(Math.round(S.dojiSensitivity * 100));
        void persistSettings();
      });
      safeBindOnce(proSrInput, 'change', () => { S.filterSrEnabled = !!proSrInput.checked; void persistSettings(); });
      safeBindOnce(proSrLookbackInput, 'change', () => {
        const v = parseNumberFlexible(proSrLookbackInput.value);
        S.srLookback = Math.max(5, Math.min(120, Math.round(Number.isFinite(v) ? v : 20)));
        if (proSrLookbackInput) proSrLookbackInput.value = String(S.srLookback);
        void persistSettings();
      });
      safeBindOnce(biasToggleBtn, 'click', () => { S.biasPanelOpen = !S.biasPanelOpen; if (biasPanel) biasPanel.style.display = S.biasPanelOpen ? 'block' : 'none'; if (biasToggleBtn) biasToggleBtn.textContent = S.biasPanelOpen ? '▾' : '▸'; });
      safeBindOnce(stabilityToggleBtn, 'click', () => { S.stabilityPanelOpen = !S.stabilityPanelOpen; if (stabilityPanel) stabilityPanel.style.display = S.stabilityPanelOpen ? 'block' : 'none'; if (stabilityToggleBtn) stabilityToggleBtn.textContent = S.stabilityPanelOpen ? '▾' : '▸'; });
      safeBindOnce(deadMarketToggleBtn, 'click', () => { S.deadMarketPanelOpen = !S.deadMarketPanelOpen; if (deadMarketPanel) deadMarketPanel.style.display = S.deadMarketPanelOpen ? 'block' : 'none'; if (deadMarketToggleBtn) deadMarketToggleBtn.textContent = S.deadMarketPanelOpen ? '▾' : '▸'; void persistSettings(); });
      applyDynamicUiState();
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
      const ANALYSIS_ПЕЧАЛБИDOW = $id('iaa-analysis-window');
      const ANALYSIS_WARMUP = $id('iaa-analysis-warmup');
      const SELF_TRADE_ENABLED = $id('iaa-self-trade-enabled');
      const SETTINGS_SAVE = $id('iaa-settings-save');
      const SETTINGS_CANCEL = $id('iaa-settings-cancel');
      const KILLER_MAX_SESSION_ЗАГУБИ = $id('iaa-killer-max-session-loss');
      const KILLER_MAX_ЗАГУБИ_STREAK = $id('iaa-killer-max-loss-streak');
      const MODE_KILLER = $id('iaa-mode-killer');
      const KILLER_THRESHOLD = $id('iaa-killer-threshold');
      const KILLER_THRESHOLD_OTC = $id('iaa-killer-threshold-otc');
      const KILLER_THRESHOLD_REAL = $id('iaa-killer-threshold-real');
      const KILLER_BASE = $id('iaa-killer-base');
      const KILLER_MIN_PAYOUT = $id('iaa-killer-min-payout');
      const DYNAMIC_ENABLED_SETTINGS = $id('iaa-dynamic-enabled-settings');
      const DYNAMIC_MODE_SETTINGS = $id('iaa-dynamic-mode');
      const DYNAMIC_MIN_SEC_SETTINGS = $id('iaa-dynamic-min-sec');
      const DYNAMIC_MAX_SEC_SETTINGS = $id('iaa-dynamic-max-sec');
      const DYNAMIC_NO_TRADE_SETTINGS = $id('iaa-dynamic-no-trade');
      const KILLER_ENABLED_SETTINGS = $id('iaa-killer-enabled');
      const KILLER_HUD_ENABLED_SETTINGS = $id('iaa-killer-hud-enabled');
      const KILLER_MIN_CONFLUENCE_SETTINGS = $id('iaa-killer-threshold-mode');
      const KILLER_DOM_THRESHOLD_SETTINGS = $id('iaa-killer-dominance-threshold');
      const KILLER_PERFECT_TIME_SETTINGS = $id('iaa-killer-perfect-time');
      const KILLER_COOLDOWN_SETTINGS = $id('iaa-killer-cooldown-sec');
      const KILLER_ADX_DYNAMIC_SETTINGS = $id('iaa-killer-adx-dynamic');
      const KILLER_CANDLE_HARDSTOP_SETTINGS = $id('iaa-killer-candle-hardstop');
      const KILLER_USE_STRATEGY_VOTES_SETTINGS = $id('iaa-killer-use-strategy-votes');
      const KILLER_STRATEGY_AGREEMENT_SETTINGS = $id('iaa-killer-strategy-agreement');
      const ENTRYПЕЧАЛБИ_ENABLED = $id('iaa-entrywin-enabled');
      const ENTRYПЕЧАЛБИ_1M = $id('iaa-entrywin-1m');
      const ENTRYПЕЧАЛБИ_3M = $id('iaa-entrywin-3m');
      const ENTRYПЕЧАЛБИ_5M = $id('iaa-entrywin-5m');
      const KILLER_WARMUP = $id('iaa-killer-warmup');
      const KILLER_EMA_FAST = $id('iaa-killer-ema-fast');
      const KILLER_EMA_SLOW = $id('iaa-killer-ema-slow');
      const KILLER_RSI_OVERSOLD = $id('iaa-killer-rsi-oversold');
      const KILLER_RSI_OVERBOUGHT = $id('iaa-killer-rsi-overbought');
      const KILLER_VWAP = $id('iaa-killer-vwap');
      const KILLER_MOMENTUM = $id('iaa-killer-momentum');
      const KILLER_VWAP_LOOKBACK = $id('iaa-killer-vwap-lookback');
      const KILLER_VOLUME_THRESHOLD = $id('iaa-killer-volume-threshold');
      const KILLER_VWAP_WEIGHT = $id('iaa-killer-vwap-weight');
      const KILLER_MOMENTUM_WEIGHT = $id('iaa-killer-momentum-weight');
      const KILLER_VOLUME_WEIGHT = $id('iaa-killer-volume-weight');
      const KILLER_VWAP_ENABLED = $id('iaa-killer-vwap-enabled');
      const KILLER_MOMENTUM_ENABLED = $id('iaa-killer-momentum-enabled');
      const KILLER_VOLUME_ENABLED = $id('iaa-killer-volume-enabled');
      const CHOP_V2_ENABLED = $id('iaa-chop-v5-enabled');
      const CHOP_V2_STRENGTH = $id('iaa-chop-v5-strength');
      const KILLER_SETTINGS_COLLAPSE = $id('iaa-killer-collapse');
      const KILLER_VWAP_TOGGLE = $id('iaa-killer-vwap-toggle');
      const KEEP_TAB_ACTIVE = $id('iaa-killer-keep-alive');
      const KILLER_WEIGHTS_TOGGLE = $id('iaa-killer-weights-toggle');
      const KILLER_SMART_TOGGLE = $id('iaa-killer-smart-toggle');
      const KILLER_ENGINE_TOGGLE = $id('iaa-killer-engine-toggle');
      const KILLER_RISK_TOGGLE = $id('iaa-killer-risk-toggle');
                  const KILLER_TF_1M = $id('iaa-killer-tf-1m');
      const KILLER_TF_3M = $id('iaa-killer-tf-3m');
      const KILLER_TF_5M = $id('iaa-killer-tf-5m');
                  const KILLER_KEEP_ALIVE = $id('iaa-killer-keep-alive');
      const FEATURE_VOLUME_REJECTION = $id('iaa-feature-volume-rejection');
      const FEATURE_VWAP_ANALYSIS = $id('iaa-feature-vwap-analysis');
      const FEATURE_SESSION_BOOST = $id('iaa-feature-session-boost');
      const CANDLE_PATTERN_ENABLED = $id('iaa-candle-pattern-enabled');
      const CANDLE_PATTERN_MIN_CONF = $id('iaa-candle-pattern-min-conf');
      const CANDLE_PATTERN_WEIGHT = $id('iaa-candle-pattern-weight');      const FEATURE_TF_1M = $id('iaa-feature-tf-1m');
      const FEATURE_TF_3M = $id('iaa-feature-tf-3m');
      const FEATURE_TF_5M = $id('iaa-feature-tf-5m');
      const FEATURE_TF_15M = $id('iaa-feature-tf-15m');      const IDLE_SWITCH_ENABLED = $id('iaa-idle-switch-enabled');
            const IDLE_SWITCH_MIN = $id('iaa-idle-switch-min');
      const STRATEGY_EMA_RSI_PULLBACK = $id('iaa-strategy-ema-rsi-pullback-enabled');
      const STRATEGY_SCALP_MICROTREND = $id('iaa-strategy-scalp-microtrend-enabled');
      const STRATEGY_CONTINUATION = $id('iaa-strategy-continuation-enabled');
      const STRATEGY_CONTINUATION_MATURITY = $id('iaa-strategy-continuation-maturity');
      const PARTNER_READY_1M = $id('iaa-partner-ready-1m');
      const PARTNER_READY_3M = $id('iaa-partner-ready-3m');
      const PARTNER_READY_5M = $id('iaa-partner-ready-5m');
      const PARTNER_READY_15M = $id('iaa-partner-ready-15m');
      const EMA_RSI_FAST = $id('iaa-ema-rsi-fast');
      const EMA_RSI_SLOW = $id('iaa-ema-rsi-slow');
      const EMA_RSI_ПЕЧАЛБИDOW = $id('iaa-ema-rsi-window');
      const EMA_RSI_OVERSOLD = $id('iaa-ema-rsi-oversold');
      const EMA_RSI_OVERBOUGHT = $id('iaa-ema-rsi-overbought');
      const MAX_СДЕЛКИ_PER_MIN = $id('iaa-max-trades-per-minute');
      const MAX_OPEN_СДЕЛКИ = $id('iaa-max-open-trades');
      const STRATEGY_DOWNLOAD = $id('iaa-strategy-download');
      const REGIME_STRENGTH = $id('iaa-regime-strength');
      const CONFIRMATION_STRENGTH = $id('iaa-confirmation-strength');
      const BIAS_STRENGTH = $id('iaa-bias-strength');
      const BIAS_TF_1M = $id('iaa-bias-tf-1m');
      const BIAS_TF_3M = $id('iaa-bias-tf-3m');
      const BIAS_TF_5M = $id('iaa-bias-tf-5m');
            const CONFLICT_STRENGTH = $id('iaa-conflict-strength');

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
      if (KILLER_MAX_SESSION_ЗАГУБИ) {
        KILLER_MAX_SESSION_ЗАГУБИ.addEventListener('input', () => {
          const d = parseNumberFlexible(KILLER_MAX_SESSION_ЗАГУБИ.value) || 0;
          S.maxSessionLossCents = Math.max(0, Math.round(d)) * 100;
          persistSettings();
        });
      }
      if (KILLER_MAX_ЗАГУБИ_STREAK) {
        KILLER_MAX_ЗАГУБИ_STREAK.addEventListener('input', () => {
          const d = parseNumberFlexible(KILLER_MAX_ЗАГУБИ_STREAK.value) || 0;
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
      if (ANALYSIS_ПЕЧАЛБИDOW) {
        ANALYSIS_ПЕЧАЛБИDOW.addEventListener('input',()=>{ 
          const d = parseNumberFlexible(ANALYSIS_ПЕЧАЛБИDOW.value) || 300;
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
      if (KILLER_THRESHOLD) {
        KILLER_THRESHOLD.addEventListener('input', () => {
          const d = parseNumberFlexible(KILLER_THRESHOLD.value) || 0;
          const pct = Math.max(1, Math.min(100, Math.round(d)));
          S.killerThreshold = pct / 100;
          applyStrictnessColor(KILLER_THRESHOLD, pct, { min: 1, max: 100, highIsStrict: true });
          setMiniBar('iaa-bar-threshold', pct, 1, 100, 10, { highIsStrict: true });
          persistSettings();
        });
      }
      if (KILLER_BASE) {
        KILLER_BASE.addEventListener('input', () => {
          const d = parseNumberFlexible(KILLER_BASE.value) || 1;
          S.killerBaseAmount = Math.max(1, Math.round(d)) * 100;
          persistSettings();
        });
      }
      if (KILLER_MIN_PAYOUT) {
        KILLER_MIN_PAYOUT.addEventListener('input', () => {
          const d = parseNumberFlexible(KILLER_MIN_PAYOUT.value);
          const v = Number.isFinite(d) ? Math.round(d) : 70;
          const clamped = Math.max(60, Math.min(92, v));
          KILLER_MIN_PAYOUT.value = String(clamped);
          S.killerMinPayout = clamped;
          persistSettings();
        });
}
      if (ENTRYПЕЧАЛБИ_ENABLED || ENTRYПЕЧАЛБИ_1M || ENTRYПЕЧАЛБИ_3M || ENTRYПЕЧАЛБИ_5M) {
        const updateEntryWinUi = () => {
          const en = !!(ENTRYПЕЧАЛБИ_ENABLED && ENTRYПЕЧАЛБИ_ENABLED.checked);
          S.entryWindowTfEnabled = en;
          if (ENTRYПЕЧАЛБИ_1M) ENTRYПЕЧАЛБИ_1M.disabled = !en;
          if (ENTRYПЕЧАЛБИ_3M) ENTRYПЕЧАЛБИ_3M.disabled = !en;
          if (ENTRYПЕЧАЛБИ_5M) ENTRYПЕЧАЛБИ_5M.disabled = !en;
          persistSettings();
        };
        const commitEntryValue = (el, fallback) => {
          if (!el) return fallback;
          const d = parseNumberFlexible(el.value);
          const v = Math.max(0, Math.min(999, Math.round(Number.isFinite(d) ? d : fallback)));
          el.value = String(v);
          return v;
        };
        if (ENTRYПЕЧАЛБИ_ENABLED) ENTRYПЕЧАЛБИ_ENABLED.addEventListener('change', updateEntryWinUi);
        if (ENTRYПЕЧАЛБИ_1M) {
          ENTRYПЕЧАЛБИ_1M.addEventListener('change', () => { S.entryWindowSec1m = commitEntryValue(ENTRYПЕЧАЛБИ_1M, 15); persistSettings(); });
          ENTRYПЕЧАЛБИ_1M.addEventListener('blur', () => { S.entryWindowSec1m = commitEntryValue(ENTRYПЕЧАЛБИ_1M, 15); persistSettings(); });
        }
        if (ENTRYПЕЧАЛБИ_3M) {
          ENTRYПЕЧАЛБИ_3M.addEventListener('change', () => { S.entryWindowSec3m = commitEntryValue(ENTRYПЕЧАЛБИ_3M, 35); persistSettings(); });
          ENTRYПЕЧАЛБИ_3M.addEventListener('blur', () => { S.entryWindowSec3m = commitEntryValue(ENTRYПЕЧАЛБИ_3M, 35); persistSettings(); });
        }
        if (ENTRYПЕЧАЛБИ_5M) {
          ENTRYПЕЧАЛБИ_5M.addEventListener('change', () => { S.entryWindowSec5m = commitEntryValue(ENTRYПЕЧАЛБИ_5M, 0); persistSettings(); });
          ENTRYПЕЧАЛБИ_5M.addEventListener('blur', () => { S.entryWindowSec5m = commitEntryValue(ENTRYПЕЧАЛБИ_5M, 0); persistSettings(); });
        }
        updateEntryWinUi();
      }
if (true) {
        const _payoutEnabledEl = $id('iaa-killer-min-payout-enabled');
        const _payoutEl = $id('iaa-killer-min-payout');
        if (_payoutEnabledEl) {
          const update = () => {
            const en = !!_payoutEnabledEl.checked;
            S.killerMinPayoutEnabled = en;
            if (_payoutEl) _payoutEl.disabled = !en;
            persistSettings();
          };
          _payoutEnabledEl.addEventListener('change', update);
          update();
        }
      }
      if (MAX_СДЕЛКИ_PER_MIN) {
        MAX_СДЕЛКИ_PER_MIN.addEventListener('input', () => {
          const d = parseNumberFlexible(MAX_СДЕЛКИ_PER_MIN.value) || 0;
          S.maxTradesPerMinute = Math.max(0, Math.round(d));
          persistSettings();
        });
      }
      if (MAX_OPEN_СДЕЛКИ) {
        MAX_OPEN_СДЕЛКИ.addEventListener('input', () => {
          const d = parseNumberFlexible(MAX_OPEN_СДЕЛКИ.value) || 1;
          S.maxOpenTrades = Math.max(1, Math.round(d));
          persistSettings();
        });
      }
      if (KILLER_WARMUP) {
        KILLER_WARMUP.addEventListener('input', () => {
          const d = parseNumberFlexible(KILLER_WARMUP.value) || 10;
          S.killerWarmupMin = Math.max(1, Math.min(30, Math.round(d)));
          persistSettings();
        });
      }
      if (KILLER_EMA_FAST) {
        KILLER_EMA_FAST.addEventListener('input', () => {
          const d = parseNumberFlexible(KILLER_EMA_FAST.value) || KILLER_5S_DEFAULTS.emaFast;
          S.killerEmaFast = Math.max(2, Math.min(30, Math.round(d)));
          persistSettings();
        });
      }
      if (KILLER_EMA_SLOW) {
        KILLER_EMA_SLOW.addEventListener('input', () => {
          const d = parseNumberFlexible(KILLER_EMA_SLOW.value) || KILLER_5S_DEFAULTS.emaSlow;
          S.killerEmaSlow = Math.max(5, Math.min(60, Math.round(d)));
          persistSettings();
        });
      }
      if (KILLER_VWAP) {
        const update = () => {
          const pct = parseNumberFlexible(KILLER_VWAP.value);
          const fallback = Number((KILLER_5S_DEFAULTS.vwapDeviation * 100).toFixed(2));
          const v = Number.isFinite(pct) ? pct : fallback;
          const clamped = Math.max(0, Math.min(0.30, Math.round(v * 100) / 100));
          KILLER_VWAP.value = clamped.toFixed(2);
          S.killerVwapDeviation = clamped / 100;
          applyStrictnessColor(KILLER_VWAP, clamped, { min: 0, max: 0.30, highIsStrict: true });
          setMiniBar('iaa-bar-vwapdev', clamped, 0, 0.30, 10, { highIsStrict: true });
          persistSettings();
        };
        KILLER_VWAP.addEventListener('input', update);
        KILLER_VWAP.addEventListener('change', update);
      }
      if (KILLER_VWAP_LOOKBACK) {
        KILLER_VWAP_LOOKBACK.addEventListener('input', () => {
          const d = parseNumberFlexible(KILLER_VWAP_LOOKBACK.value) || KILLER_5S_DEFAULTS.vwapLookbackMin;
          S.killerVwapLookbackMin = Math.max(1, Math.round(d));
          persistSettings();
        });
      }
            if (KILLER_MOMENTUM) {
        const update = () => {
          const pct = parseNumberFlexible(KILLER_MOMENTUM.value);
          const fallback = Number((KILLER_5S_DEFAULTS.momentumThreshold * 100).toFixed(2));
          const v = Number.isFinite(pct) ? pct : fallback;
          const clamped = Math.max(0, Math.min(0.30, Math.round(v * 100) / 100));
          KILLER_MOMENTUM.value = clamped.toFixed(2);
          S.killerMomentumThreshold = clamped / 100;
          applyStrictnessColor(KILLER_MOMENTUM, clamped, { min: 0, max: 0.30, highIsStrict: true });
          persistSettings();
        };
        KILLER_MOMENTUM.addEventListener('input', update);
        KILLER_MOMENTUM.addEventListener('change', update);
      }


if (KILLER_VOLUME_THRESHOLD) {
        KILLER_VOLUME_THRESHOLD.addEventListener('input', () => {
          const d = parseNumberFlexible(KILLER_VOLUME_THRESHOLD.value) || 0;
          S.killerVolumeThreshold = Math.max(0, d);
          persistSettings();
        });
      }
      if (KILLER_VWAP_ENABLED) {
        KILLER_VWAP_ENABLED.addEventListener('change', () => {
          S.killerVwapEnabled = KILLER_VWAP_ENABLED.checked;
          persistSettings();
        });
      }
      if (KILLER_MOMENTUM_ENABLED) {
        KILLER_MOMENTUM_ENABLED.addEventListener('change', () => {
          S.killerMomentumEnabled = KILLER_MOMENTUM_ENABLED.checked;
          persistSettings();
        });
      }
      if (KILLER_VOLUME_ENABLED) {
        KILLER_VOLUME_ENABLED.addEventListener('change', () => {
          S.killerVolumeEnabled = KILLER_VOLUME_ENABLED.checked;
          persistSettings();
        });
      }
      safeBindOnce(CHOP_V2_ENABLED, 'change', () => {
        S.chopV2Enabled = !!CHOP_V2_ENABLED.checked;
        persistSettings();
      });
      if (CHOP_V2_STRENGTH) {
        const update = () => {
          const d = parseNumberFlexible(CHOP_V2_STRENGTH.value);
          S.chopV2StrengthPct = Math.max(1, Math.min(100, Math.round(Number.isFinite(d) ? d : 50)));
          CHOP_V2_STRENGTH.value = String(S.chopV2StrengthPct);
          persistSettings();
        };
        CHOP_V2_STRENGTH.addEventListener('input', update);
        CHOP_V2_STRENGTH.addEventListener('change', update);
      }
      if (KILLER_VWAP_WEIGHT) {
        const update = () => {
          const d = parseNumberFlexible(KILLER_VWAP_WEIGHT.value);
          const pct = Math.max(1, Math.min(100, Math.round(Number.isFinite(d) ? d : 55)));
          S.killerVwapWeight = pct / 100;
          KILLER_VWAP_WEIGHT.value = String(pct);
          applyStrictnessColor(KILLER_VWAP_WEIGHT, pct, { min: 1, max: 100, highIsStrict: true });
          persistSettings();
        };
        KILLER_VWAP_WEIGHT.addEventListener('input', update);
        KILLER_VWAP_WEIGHT.addEventListener('change', update);
      }
      if (KILLER_MOMENTUM_WEIGHT) {
        const update = () => {
          const d = parseNumberFlexible(KILLER_MOMENTUM_WEIGHT.value);
          const pct = Math.max(1, Math.min(100, Math.round(Number.isFinite(d) ? d : 35)));
          S.killerMomentumWeight = pct / 100;
          KILLER_MOMENTUM_WEIGHT.value = String(pct);
          applyStrictnessColor(KILLER_MOMENTUM_WEIGHT, pct, { min: 1, max: 100, highIsStrict: false });
          persistSettings();
        };
        KILLER_MOMENTUM_WEIGHT.addEventListener('input', update);
        KILLER_MOMENTUM_WEIGHT.addEventListener('change', update);
      }
      if (KILLER_VOLUME_WEIGHT) {
        const update = () => {
          const d = parseNumberFlexible(KILLER_VOLUME_WEIGHT.value);
          const pct = Math.max(1, Math.min(100, Math.round(Number.isFinite(d) ? d : 10)));
          S.killerVolumeWeight = pct / 100;
          KILLER_VOLUME_WEIGHT.value = String(pct);
          applyStrictnessColor(KILLER_VOLUME_WEIGHT, pct, { min: 1, max: 100, highIsStrict: false });
          persistSettings();
        };
        KILLER_VOLUME_WEIGHT.addEventListener('input', update);
        KILLER_VOLUME_WEIGHT.addEventListener('change', update);
      }
      if (KILLER_SETTINGS_COLLAPSE) {
        KILLER_SETTINGS_COLLAPSE.addEventListener('click', () => {
          S.killerSettingsCollapsed = !S.killerSettingsCollapsed;
          renderSettingsPanel();
        });
      }
      if (KILLER_WEIGHTS_TOGGLE) {
        KILLER_WEIGHTS_TOGGLE.addEventListener('click', () => {
          S.killerWeightsCollapsed = !S.killerWeightsCollapsed;
          renderSettingsPanel();
        });
      }

      const DYNAMIC_STAKE_TOGGLE = $id('iaa-dynamic-stake-toggle');
      if (DYNAMIC_STAKE_TOGGLE) {
        DYNAMIC_STAKE_TOGGLE.addEventListener('click', (e) => {
          e.preventDefault(); e.stopPropagation();
          S.dynamicStakeCollapsed = !S.dynamicStakeCollapsed;
          persistSettings();
          renderSettingsPanel();
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
      if (CANDLE_PATTERN_ENABLED) {
        CANDLE_PATTERN_ENABLED.addEventListener('change', () => {
          S.candlestickPatternEnabled = CANDLE_PATTERN_ENABLED.checked;
          persistSettings();
        });
      }
      if (CANDLE_PATTERN_MIN_CONF) {
        CANDLE_PATTERN_MIN_CONF.addEventListener('input', () => {
          const d = parseNumberFlexible(CANDLE_PATTERN_MIN_CONF.value) || 0;
          S.candlestickPatternMinConfidence = clamp01((Math.max(1, Math.min(100, Math.round(d))) || 60) / 100);
          CANDLE_PATTERN_MIN_CONF.value = String(Math.round(S.candlestickPatternMinConfidence * 100));
          persistSettings();
        });
      }
      if (CANDLE_PATTERN_WEIGHT) {
        CANDLE_PATTERN_WEIGHT.addEventListener('input', () => {
          const d = parseNumberFlexible(CANDLE_PATTERN_WEIGHT.value) || 0;
          S.candlestickPatternWeight = clamp01((Math.max(1, Math.min(100, Math.round(d))) || 25) / 100);
          CANDLE_PATTERN_WEIGHT.value = String(Math.round(S.candlestickPatternWeight * 100));
          persistSettings();
        });
      }       const PHASE_CATCH_MOVE = $id('iaa-phase-catch-move');
       const PHASE_RELOAD_SNIPE = $id('iaa-phase-reload-snipe');       if (PHASE_CATCH_MOVE) PHASE_CATCH_MOVE.addEventListener('change', () => { S.phaseCatchMoveEnabled = PHASE_CATCH_MOVE.checked; persistSettings(); });
       if (PHASE_RELOAD_SNIPE) PHASE_RELOAD_SNIPE.addEventListener('change', () => { S.phaseReloadKillerEnabled = PHASE_RELOAD_SNIPE.checked; persistSettings(); });
      if (FEATURE_TF_1M) {
        FEATURE_TF_1M.addEventListener('change', () => {
          S.killerEnabledTimeframes['1m'] = FEATURE_TF_1M.checked;
          S.killerEnabledTimeframes['1m'] = FEATURE_TF_1M.checked;
          persistSettings();
          renderKillerMatrix();
        });
      }
      if (FEATURE_TF_3M) {
        FEATURE_TF_3M.addEventListener('change', () => {
          S.killerEnabledTimeframes['3m'] = FEATURE_TF_3M.checked;
          S.killerEnabledTimeframes['3m'] = FEATURE_TF_3M.checked;
          persistSettings();
          renderKillerMatrix();
        });
      }
      if (FEATURE_TF_5M) {
        FEATURE_TF_5M.addEventListener('change', () => {
          S.killerEnabledTimeframes['5m'] = FEATURE_TF_5M.checked;
          S.killerEnabledTimeframes['5m'] = FEATURE_TF_5M.checked;
          persistSettings();
          renderKillerMatrix();
        });
      }
      if (FEATURE_TF_15M) {
        FEATURE_TF_15M.addEventListener('change', () => {
          S.killerEnabledTimeframes['15m'] = FEATURE_TF_15M.checked;
          S.killerEnabledTimeframes['15m'] = FEATURE_TF_15M.checked;
          persistSettings();
          renderKillerMatrix();
        });
      }
      if (STRATEGY_EMA_RSI_PULLBACK) {
        STRATEGY_EMA_RSI_PULLBACK.addEventListener('change', () => {
          const current = getStrategyConfig('ema_rsi_pullback');
          S.strategyConfigs = { ...S.strategyConfigs, ema_rsi_pullback: { ...current, enabled: STRATEGY_EMA_RSI_PULLBACK.checked } };
          if (!STRATEGY_EMA_RSI_PULLBACK.checked && S.currentStrategyKey === 'ema_rsi_pullback') { S.currentStrategyKey = null; S.killerLastDecision = null; }
          persistSettings();
          renderStrategiesPanel();
        });
      }
      if (STRATEGY_SCALP_MICROTREND) {
        STRATEGY_SCALP_MICROTREND.addEventListener('change', () => {
          const current = getStrategyConfig('scalp_microtrend');
          S.strategyConfigs = { ...S.strategyConfigs, scalp_microtrend: { ...current, enabled: STRATEGY_SCALP_MICROTREND.checked } };
          if (!STRATEGY_SCALP_MICROTREND.checked && S.currentStrategyKey === 'scalp_microtrend') { S.currentStrategyKey = null; S.killerLastDecision = null; }
          persistSettings();
          renderStrategiesPanel();
        });
      }
      if (STRATEGY_CONTINUATION) {
        STRATEGY_CONTINUATION.addEventListener('change', () => {
          const current = getStrategyConfig('continuation');
          S.strategyConfigs = { ...S.strategyConfigs, continuation: { ...current, enabled: STRATEGY_CONTINUATION.checked } };
          if (!STRATEGY_CONTINUATION.checked && S.currentStrategyKey === 'continuation') { S.currentStrategyKey = null; S.killerLastDecision = null; }
          persistSettings();
          renderStrategiesPanel();
        });
      }
      if (STRATEGY_CONTINUATION_MATURITY) {
        const onMaturity = () => {
          const d = parseNumberFlexible(STRATEGY_CONTINUATION_MATURITY.value);
          const v = Math.max(10, Math.min(100, Math.round(Number.isFinite(d) ? d : 65)));
          STRATEGY_CONTINUATION_MATURITY.value = String(v);
          const current = getStrategyConfig('continuation');
          S.strategyConfigs = { ...S.strategyConfigs, continuation: { ...current, maxTrendMaturity: v } };
          persistSettings();
        };
        STRATEGY_CONTINUATION_MATURITY.addEventListener('input', onMaturity);
        STRATEGY_CONTINUATION_MATURITY.addEventListener('change', onMaturity);
      }
      if (PARTNER_READY_1M) {
        PARTNER_READY_1M.addEventListener('input', () => {
          const d = parseNumberFlexible(PARTNER_READY_1M.value) || 10;
          S.partnerReadyBars1m = Math.max(1, Math.min(40, Math.round(d)));
          PARTNER_READY_1M.value = String(S.partnerReadyBars1m);
          persistSettings();
        });
      }
      if (PARTNER_READY_3M) {
        PARTNER_READY_3M.addEventListener('input', () => {
          const d = parseNumberFlexible(PARTNER_READY_3M.value) || 6;
          S.partnerReadyBars3m = Math.max(1, Math.min(40, Math.round(d)));
          PARTNER_READY_3M.value = String(S.partnerReadyBars3m);
          persistSettings();
        });
      }
      if (PARTNER_READY_5M) {
        PARTNER_READY_5M.addEventListener('input', () => {
          const d = parseNumberFlexible(PARTNER_READY_5M.value) || 3;
          S.partnerReadyBars5m = Math.max(1, Math.min(40, Math.round(d)));
          PARTNER_READY_5M.value = String(S.partnerReadyBars5m);
          persistSettings();
        });
      }
      if (PARTNER_READY_15M) {
        PARTNER_READY_15M.addEventListener('input', () => {
          const d = parseNumberFlexible(PARTNER_READY_15M.value) || 2;
          S.partnerReadyBars15m = Math.max(1, Math.min(40, Math.round(d)));
          PARTNER_READY_15M.value = String(S.partnerReadyBars15m);
          persistSettings();
        });
      }
      if (EMA_RSI_FAST) {
        EMA_RSI_FAST.addEventListener('input', () => {
          const d = parseNumberFlexible(EMA_RSI_FAST.value) || 8;
          S.emaRsiFast = Math.max(2, Math.min(30, Math.round(d)));
          EMA_RSI_FAST.value = String(S.emaRsiFast);
          persistSettings();
        });
      }
      if (EMA_RSI_SLOW) {
        EMA_RSI_SLOW.addEventListener('input', () => {
          const d = parseNumberFlexible(EMA_RSI_SLOW.value) || 21;
          S.emaRsiSlow = Math.max(3, Math.min(60, Math.round(d)));
          EMA_RSI_SLOW.value = String(S.emaRsiSlow);
          persistSettings();
        });
      }
      if (EMA_RSI_ПЕЧАЛБИDOW) {
        EMA_RSI_ПЕЧАЛБИDOW.addEventListener('input', () => {
          const d = parseNumberFlexible(EMA_RSI_ПЕЧАЛБИDOW.value) || 14;
          S.emaRsiWindow = Math.max(5, Math.min(30, Math.round(d)));
          EMA_RSI_ПЕЧАЛБИDOW.value = String(S.emaRsiWindow);
          persistSettings();
        });
      }
      if (EMA_RSI_OVERSOLD) {
        EMA_RSI_OVERSOLD.addEventListener('input', () => {
          const d = parseNumberFlexible(EMA_RSI_OVERSOLD.value) || 35;
          S.emaRsiOversold = Math.max(10, Math.min(50, Math.round(d)));
          EMA_RSI_OVERSOLD.value = String(S.emaRsiOversold);
          persistSettings();
        });
      }
      if (EMA_RSI_OVERBOUGHT) {
        EMA_RSI_OVERBOUGHT.addEventListener('input', () => {
          const d = parseNumberFlexible(EMA_RSI_OVERBOUGHT.value) || 65;
          S.emaRsiOverbought = Math.max(50, Math.min(90, Math.round(d)));
          EMA_RSI_OVERBOUGHT.value = String(S.emaRsiOverbought);
          persistSettings();
        });
      }      if (STRATEGY_DOWNLOAD) {
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
      installWebSocketPriceTap();
      await restoreSettings();
      S.wsTapInstalled = true;
      if (WS_FEED_BUFFER.packetsSeen) S.wsPacketsSeen = WS_FEED_BUFFER.packetsSeen;
      S.wsBridgeFramesSeen = WS_FEED_BUFFER.bridgeFramesSeen || 0;
      S.wsBridgeListener = !!window.__iaaBridgeListenerReady;
      S.wsBridgeInjected = !!window.__iaaBridgeInjectOk;
      S.wsBridgeReady = !!WS_FEED_BUFFER.bridgeReady;
      S.lastPriceRejectReason = WS_FEED_BUFFER.lastRejectReason || null;
      S.lastFeedSource = WS_FEED_BUFFER.lastSource || null;
      if (Number.isFinite(WS_FEED_BUFFER.lastPrice)) {
        S.wsLastPrice = WS_FEED_BUFFER.lastPrice;
        S.wsLastPriceDecimals = WS_FEED_BUFFER.lastDecimals;
        S.wsLastPriceAt = WS_FEED_BUFFER.lastAt || Date.now();
      }
      ensurePanelInit();
  // ---- Robust popup openers (fix lost handlers after panel re-renders) ----
  function __iaaTogglePopup(popupId){
    const el = document.getElementById(popupId);
    if (!el) return;
    const isOpen = (el.style.display === 'block');
    // close any other open popups
    ['iaa-settings-panel','iaa-killer-panel','iaa-mouse-panel'].forEach(id=>{
      const p = document.getElementById(id);
      if (p && id !== popupId) { p.style.display = 'none'; p.setAttribute('aria-hidden','true'); }
    });
    if (isOpen) {
      el.style.display = 'none';
      el.setAttribute('aria-hidden','true');
      return;
    }
    // sync UI values right before showing settings
    if (popupId === 'iaa-settings-panel') {
      try { if (typeof applyDynamicUiState === 'function') applyDynamicUiState(); } catch(_){}
      try { if (typeof applyAnalysisUiState === 'function') applyAnalysisUiState(); } catch(_){}
      try { if (typeof applyStrategyUiState === 'function') applyStrategyUiState(); } catch(_){}
    }
    el.style.display = 'block';
    el.setAttribute('aria-hidden','false');
  }

  if (false && !window.__iaaPopupDelegatesBound) {
    window.__iaaPopupDelegatesBound = true;
    document.addEventListener('click', (e)=>{
      const mouseBtn = e.target && e.target.closest && e.target.closest('#iaa-mouse-toggle');
      if (mouseBtn) {
        e.preventDefault(); e.stopPropagation();
        __iaaTogglePopup('iaa-mouse-panel');
        return;
      }
      const killerBtn = e.target && e.target.closest && e.target.closest('#iaa-killer-toggle');
      if (killerBtn) {
        e.preventDefault(); e.stopPropagation();
        __iaaTogglePopup('iaa-killer-panel');
        return;
      }
    }, true);
  }

      ensureMouseHandlers();
      installPageDebugBridge();
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
    api.debugLog = debugLog;
    api.logConsole = logConsoleLine;
    api.formatStatus = formatStatus;

    return api;
  })();

  /* ========================= AUTO-START ========================= */
  (function(){
    const start = () => {
      getSession().then((sess) => {
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
      }).catch(() => {
        injectLoginPanel();
      });
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', start);
    } else {
      start();
    }
  })();
})()
    function escapeHtml(s){
      return String(s ?? '').replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
    }

;


/* IAA PO PRICE BRIDGE */
(function(){
  if (window.__iaaPriceBridgeInstalled) return;
  window.__iaaPriceBridgeInstalled = true;

  window.addEventListener("message", function(e){
    const d = e && e.data;
    if (!d) return;
    const t = d.__iaaType;
    if (t !== "IAA_PO_PRICE" && t !== "IAA_WS_PRICE") return;

    const bot = window.InfinityBot && window.InfinityBot.S ? window.InfinityBot.S : null;
    if (!bot) return;

    const price = Number(d.price);
    if (!Number.isFinite(price)) return;

    const now = Date.now();
    bot.wsLastPrice = price;
    bot.wsLastPriceAt = now;
    bot.currentAssetPrice = price;
    bot.lastPriceAt = now;
    bot.feedState = "READY";
    bot.lastFeedSource = "ws";
    try { bot.wsPacketsSeen = (bot.wsPacketsSeen||0) + 1;
    try{ bot.sessionStats = bot.sessionStats || {pnl:0,w:0,l:0,t:0,ws:0}; bot.sessionStats.ws = (bot.sessionStats.ws||0)+1; }catch(e){} } catch {}
  }, false);
})();


// sessionStats


/* IAA PNL LINE (separate element) */
(function(){
  if (window.__iaaPnlLineInstalled) return;
  window.__iaaPnlLineInstalled = true;

  function n(x){ x = Number(x); return Number.isFinite(x) ? x : 0; }
  function fmtMoney(x){ return (Math.round(n(x)*100)/100).toFixed(2); }
  function wr(w,t){ return t>0 ? Math.round((w/t)*1000)/10 : 0; }

  function ensure(){
    const feed = document.getElementById("iaa-feed-cloud");
    if (!feed) return null;
    let pnl = document.getElementById("iaa-pnl-cloud");
    if (pnl) return pnl;

    pnl = document.createElement("div");
    pnl.id = "iaa-pnl-cloud";
    pnl.style.marginTop = "6px";
    pnl.style.fontSize = "12px";
    pnl.style.lineHeight = "1.2";
    pnl.style.userSelect = "text";
    feed.insertAdjacentElement("afterend", pnl);
    return pnl;
  }

  setInterval(() => {
    const S = window.InfinityBot && window.InfinityBot.S ? window.InfinityBot.S : null;
    if (!S) return;

    // gate WS PnL until START
    if (!S.wsDealPnLEnabled) return;
    const el = ensure();
    if (!el) return;

    S.sessionStats = S.sessionStats || { pnl:0, w:0, l:0, t:0, ws:0 };

    const pnl = n(S.sessionStats.pnl);
    const w = n(S.sessionStats.w);
    const l = n(S.sessionStats.l);
    const t = n(S.sessionStats.t);
    const ws = n(S.wsPacketsSeen || S.sessionStats.ws || 0);
    const wrp = wr(w,t);

    const pnlColor = pnl >= 0 ? "#22c55e" : "#ef4444";
    const wrColor = "#60a5fa";
    const tColor = "#eab308";
    const wsColor = "#9ca3af";

    el.innerHTML =
      `<span style="color:${pnlColor};font-weight:800;">PnL ${(pnl>=0?"+":"-")}$${fmtMoney(Math.abs(pnl))}</span>` +
      ` • <span style="color:#22c55e;font-weight:800;">W ${w}</span>` +
      ` • <span style="color:#ef4444;font-weight:800;">L ${l}</span>` +
      ` • <span style="color:${wrColor};font-weight:800;">WR ${wrp}%</span>` +
      ` • <span style="color:${tColor};font-weight:800;">T ${t}</span>` +
      ` • <span style="color:${wsColor};font-weight:800;">WS ${ws}</span>`;
  }, 800);
})();




/* IAA PNL KILL OBSERVER */
(function(){
  try{
    if (window.__iaaPnlKillObserver) return;
    window.__iaaPnlKillObserver = true;

    const kill = ()=>{
      const a = document.getElementById("iaa-session-mini");
      if (a) a.remove();
      const b = document.getElementById("iaa-pnl-line");
      if (b) b.remove();
    };
    kill();

    const mo = new MutationObserver(()=>kill());
    mo.observe(document.documentElement || document.body, { childList:true, subtree:true });
  }catch(e){}
})();




/* IAA PO DEAL BRIDGE v3 (WS, session-gated, deduped) */
(function(){
  if (window.__iaaDealBridgeInstalledV3) return;
  window.__iaaDealBridgeInstalledV3 = true;

  function fmtMoney(x){
    const n = Number(x);
    if (!Number.isFinite(n)) return "0.00";
    return (Math.round(n*100)/100).toFixed(2);
  }

  function logOutcome(isWin, pnl, tf, tradeId){
    // Final outcome console owner: finalizeTradeOutcome -> logTradeOutcome.
    // WS bridge keeps stats/dedupe only.
    return;
  }

  function toArray(payload){
    if (!payload) return [];
    if (Array.isArray(payload)) return payload;
    if (payload.deals && Array.isArray(payload.deals)) return payload.deals;
    if (payload.data && Array.isArray(payload.data)) return payload.data;
    if (payload.items && Array.isArray(payload.items)) return payload.items;
    return [payload];
  }

  function extractTf(d){
    const v = d.period ?? d.tf ?? d.timeframe ?? d.duration ?? d.expiry ?? d.exp ?? "";
    if (v === 60) return "1m";
    if (v === 180) return "3m";
    if (v === 300) return "5m";
    if (v === 900) return "15m";
    return String(v || "");
  }

  // Prefer PO's profit field (net profit). If only payout+stake present, use payout-stake.
  function extractNetPnl(d){
    const profit = Number(d.profit ?? d.pnl ?? d.profit_amount ?? d.win_amount ?? d.winAmount ?? d.result_amount ?? d.resultAmount);
    if (Number.isFinite(profit)) return profit;

    const stake  = Number(d.stake ?? d.amount ?? d.bet ?? d.invest ?? d.sum ?? d.open_amount ?? d.openAmount);
    const payout = Number(d.payout ?? d.payout_amount ?? d.payoutAmount ?? d.close_amount ?? d.closeAmount);
    if (Number.isFinite(payout) && Number.isFinite(stake)) return payout - stake;

    // flags fallback
    const winFlag = (d.isWin === true) || (d.win === 1) || (String(d.result||"").toLowerCase()==="win");
    const loseFlag = (d.isWin === false) || (d.win === 0) || (String(d.result||"").toLowerCase()==="lose");
    if (winFlag && Number.isFinite(stake)) return stake;
    if (loseFlag && Number.isFinite(stake)) return -stake;

    return null;
  }

  function getCloseMs(d){
    const v = d.closeTimestamp ?? d.closeTime ?? d.close_time ?? d.closedAt ?? d.finishedAt ?? d.ts ?? d.timestamp ?? null;
    const n = Number(v);
    // normalize seconds to ms if needed
    if (!Number.isFinite(n)) return null;
    if (n > 0 && n < 2e10) return n; // ms
    if (n > 0 && n < 2e10/1000) return n*1000; // sec -> ms (rare)
    return n;
  }

  function dealKey(d, pnl){
    const id = d.id ?? d.deal_id ?? d.dealId ?? d.ticket ?? d.order_id ?? d.orderId ?? d.uid ?? "";
    if (id) return "id:" + String(id);

    const asset = d.asset ?? d.symbol ?? d.pair ?? "";
    const closeMs = getCloseMs(d) || 0;
    const openMs = Number(d.openTimestamp ?? d.openTime ?? d.open_time ?? d.openedAt ?? d.createdAt ?? 0) || 0;
    const stake  = Number(d.stake ?? d.amount ?? d.bet ?? d.invest ?? d.sum ?? d.open_amount ?? d.openAmount);
    const pnlCents = Number.isFinite(pnl) ? Math.round(pnl*100) : 0;
    const stakeCents = Number.isFinite(stake) ? Math.round(stake*100) : 0;
    const dir = d.direction ?? d.side ?? d.action ?? d.type ?? "";

    return `k:${asset}|${openMs}|${closeMsEff}|${pnlCents}|${stakeCents}|${dir}`;
  }

  function getS(){
    return (window.InfinityBot && window.InfinityBot.S) ? window.InfinityBot.S : null;
  }

  function ensureSessionDefaults(S){
    if (!S.sessionStats) S.sessionStats = { pnl:0, w:0, l:0, t:0, ws:(S.wsPacketsSeen||0), deals:0 };
    if (typeof S.wsDealPnLEnabled !== "boolean") S.wsDealPnLEnabled = false;
    if (!S.wsDealSeen) S.wsDealSeen = Object.create(null);
        S.wsDealSeenId = Object.create(null);
        S.wsDealCloseSigSeen = Object.create(null);
  }

  // Reset on START click
  (function(){
    if (window.__iaaWsDealStartHookV3) return;
    window.__iaaWsDealStartHookV3 = true;

    document.addEventListener("click", function(ev){
      const t = ev && ev.target;
      if (!t) return;
      const id = t.id || "";
      const txt = (t.textContent || "").trim().toUpperCase();
      if (id === "iaa-toggle" || txt === "START") {
        const S = getS(); if (!S) return;
        S.sessionStartMs = Date.now();
        S.wsDealPnLEnabled = true;
        S.wsDealSeen = Object.create(null);
        S.wsDealSeenId = Object.create(null);
        S.wsDealCloseSigSeen = Object.create(null);
        S.wsDealSeenIdV17 = Object.create(null);
        S.sessionStats = { pnl:0, w:0, l:0, t:0, ws:(S.wsPacketsSeen||0), deals:0 };
      }
    }, true);
  })();

  window.addEventListener("message", function(e){
    const msg = e && e.data;
    if (!msg || msg.__iaaType !== "IAA_PO_DEAL_EVENT") return;

    const S = getS();
    if (!S) return;
    ensureSessionDefaults(S);
    S.wsDealSeenIdV17 = S.wsDealSeenIdV17 || Object.create(null);

    // gate until START
    if (!S.wsDealPnLEnabled) return;

    const ev = String(msg.event || "");
    const evLower = ev.toLowerCase();
    // accept all deal events; we filter by payload fields instead of event name
    const arr = toArray(msg.payload);
    for (const d of arr){
      const pnl = extractNetPnl(d);
      if (pnl == null) continue;

      const closeMs = getCloseMs(d);
      const now = Date.now();
      // Guard against phantom/open snapshots: count only closed deals with close timestamp.
      if (!closeMs) continue;
      if (closeMs < now - 24*60*60*1000 || closeMs > now + 60*1000) continue;
      if (S.sessionStartMs && closeMs < S.sessionStartMs) continue;

      const key = dealKey(d, pnl);

      // DEDUPE v22 (kill x2 close notifications)
      S.wsDealSeen = S.wsDealSeen || Object.create(null);
      S.wsDealSeenId = S.wsDealSeenId || Object.create(null);
      S.wsDealCloseSigSeen = S.wsDealCloseSigSeen || Object.create(null);

      const _id = d.id ?? d.deal_id ?? d.dealId ?? d.ticket ?? d.order_id ?? d.orderId ?? d.uid ?? "";
      if (_id) {
        if (S.wsDealSeenId[_id]) continue;
        S.wsDealSeenId[_id] = true;
      }

      const stake = Number(d.stake ?? d.amount ?? d.bet ?? d.invest ?? d.sum ?? d.open_amount ?? d.openAmount);
      const stakeC = Number.isFinite(stake) ? Math.round(stake*100) : 0;
      const pnlC = Number.isFinite(pnl) ? Math.round(pnl*100) : 0;
      const asset = d.asset ?? d.symbol ?? d.pair ?? "";
      const closeSig = `c:${asset}|${stakeC}|${pnlC}`;
      const prevAt = Number(S.wsDealCloseSigSeen[closeSig] || 0);
      if (prevAt && (now2 - prevAt) < 20000) continue; // 20s window kills duplicates
      S.wsDealCloseSigSeen[closeSig] = now2;

      if (S.wsDealSeen[key]) continue;
      S.wsDealSeen[key] = true;

      const tf = extractTf(d);
      const tradeId = d.id ?? d.deal_id ?? d.dealId ?? d.ticket ?? d.order_id ?? d.orderId ?? d.uid ?? "";
      const isWin = pnl > 0;
      const isLoss = pnl < 0;

      S.sessionStats.pnl += pnl;
      S.sessionStats.t += 1;
      if (isWin) S.sessionStats.w += 1;
      else if (isLoss) S.sessionStats.l += 1;

      
      // WS outcome history for HTML/export/debug
      try{
        S.wsOutcomeHistory = S.wsOutcomeHistory || [];
        S.wsOutcomeHistory.push({ ts: Date.now(), id: tradeId ? String(tradeId) : "", tf: tf || "", pnl: pnl });
        if (S.wsOutcomeHistory.length > 5000) S.wsOutcomeHistory.splice(0, S.wsOutcomeHistory.length - 5000);
      }catch(e){}

      // Final outcome console owner: finalizeTradeOutcome -> logTradeOutcome.
      // WS bridge keeps stats/dedupe only.
}
  }, false);
})();



/* IAA PO DEAL PAYLOAD BRIDGE (binary JSON array) */
(function(){
  if (window.__iaaDealPayloadBridgeInstalled) return;
  window.__iaaDealPayloadBridgeInstalled = true;

  function fmtMoney(x){
    const n = Number(x);
    if (!Number.isFinite(n)) return "0.00";
    return (Math.round(n*100)/100).toFixed(2);
  }
  function logOutcome(isWin, pnl, tf, tradeId){
    // Final outcome console owner: finalizeTradeOutcome -> logTradeOutcome.
    // WS bridge keeps stats/dedupe only.
    return;
  }

  function tfFromDeal(d){
    const v = d.period ?? d.tf ?? d.timeframe ?? d.duration ?? d.expiry ?? d.exp ?? 60;
    if (v === 60) return "1m";
    if (v === 180) return "3m";
    if (v === 300) return "5m";
    if (v === 900) return "15m";
    return String(v||"?");
  }

  window.addEventListener("message", function(e){
    const msg = e && e.data;
    if (!msg || msg.__iaaType !== "IAA_PO_DEAL_PAYLOAD") return;

    const arr = msg.payload;
    const S = window.InfinityBot && window.InfinityBot.S ? window.InfinityBot.S : null;
    if (!S || !Array.isArray(arr)) return;
    if (!S.running || !S.wsDealPnLEnabled) return;

    const startMs = Number(S.sessionStartMs || 0);
    if (!startMs) return;

    S.sessionStats = S.sessionStats || { pnl:0, w:0, l:0, t:0, ws:0, deals:0 };
    S._dealSeen = S._dealSeen || Object.create(null);
    S.wsDealSeen = S.wsDealSeen || Object.create(null);

    for (const d of arr){
      if (!d || typeof d !== "object") continue;
      const id = d.id || d.deal_id || d.dealId || d.ticket || d.order_id || d.orderId;
      if (!id) continue;

      const closeTs = Number(d.closeTimestamp ?? d.closeTs ?? d.close_time ?? d.closeTime ?? 0);
      if (!closeTs) continue; // only closed deals
      if (closeTs < startMs) continue;

      const key = String(id);
      const sharedKey = `id:${key}`;
      if (S._dealSeen[key] || S.wsDealSeen[sharedKey]) continue;
      S._dealSeen[key] = 1;
      S.wsDealSeen[sharedKey] = 1;

      const profit = Number(d.profit);
      const amount = Number(d.amount);
      if (!Number.isFinite(amount)) continue;

      // PO convention: profit is payout amount (e.g. 0.78 on stake 1) or profit? In HAR it's 0.78 with amount 1 => win pnl +0.78; lose profit 0 => pnl -amount.
      let pnl;
      if (Number.isFinite(profit) && profit > 0) pnl = profit;
      else pnl = -amount;

      const isWin = pnl > 0;
      const tf = tfFromDeal(d);

      S.sessionStats.pnl += pnl;
      S.sessionStats.t += 1;
      if (isWin) S.sessionStats.w += 1; else S.sessionStats.l += 1;

      logOutcome(isWin, pnl, tf, key);
    }
  }, false);
})();


/* IAA SUPPRESS LEGACY DEAL LOGS */
(function(){
  try{
    if (window.__iaaSuppressLegacyDealLogs) return;
    window.__iaaSuppressLegacyDealLogs = true;
    const orig = console.log;
    console.log = function(){
      try{
        const s = arguments && arguments[0];
        if (typeof s === "string" && (s.includes("🎉 СДЕЛКА") || s.includes("🛑 СДЕЛКА"))) {
          // legacy logs suppressed
          return;
        }
      }catch(e){}
      return orig.apply(console, arguments);
    };
  }catch(e){}
})();




/* IAA WS DEAL PNL v1 */
(function(){
  if (window.__iaaWsDealPnlInstalled) return;
  window.__iaaWsDealPnlInstalled = true;

  function num(x){ x = Number(x); return Number.isFinite(x) ? x : null; }
  function fmtMoney(x){
    const n = Number(x);
    if (!Number.isFinite(n)) return "0.00";
    return (Math.round(n*100)/100).toFixed(2);
  }
  function tfLabelFromPeriod(v){
    const n = Number(v);
    if (n === 60) return "1m";
    if (n === 180) return "3m";
    if (n === 300) return "5m";
    if (n === 900) return "15m";
    return v ? String(v) : "?";
  }
  function logOutcome(isWin, pnl, tf, tradeId){
    // Final outcome console owner: finalizeTradeOutcome -> logTradeOutcome.
    // WS bridge keeps stats/dedupe only.
    return;
  }

  function normalizeDeals(payload){
    if (!payload) return [];
    if (Array.isArray(payload)) return payload;
    if (payload.deals && Array.isArray(payload.deals)) return payload.deals;
    if (payload.data && Array.isArray(payload.data)) return payload.data;
    if (payload.items && Array.isArray(payload.items)) return payload.items;
    return [payload];
  }

  function extractCloseMs(d){
    const t = num(d.closeTimestamp ?? d.close_time ?? d.closeTime ?? d.closed_at ?? d.closedAt ?? d.finishTimestamp ?? d.finishedAt ?? d.endTimestamp ?? d.endTime);
    if (t == null) return null;
    // some are seconds, some ms
    return t < 2e12 ? Math.floor(t*1000) : Math.floor(t);
  }

  function extractPnl(d){
    // PO typically has profit: numeric (+ for win, -stake for loss)
    const profit = num(d.profit ?? d.pnl ?? d.profit_amount ?? d.result_amount ?? d.resultAmount);
    if (profit != null) return profit;

    const stake = num(d.amount ?? d.stake ?? d.bet ?? d.invest ?? d.sum);
    const payout = num(d.payout ?? d.payout_amount ?? d.close_amount ?? d.closeAmount);
    if (stake != null && payout != null) return payout - stake;

    // fallback flags
    const winFlag = (d.isWin === true) || (d.win === 1) || (String(d.result||"").toLowerCase()==="win");
    const loseFlag = (d.isWin === false) || (d.win === 0) || (String(d.result||"").toLowerCase()==="lose");
    if (stake != null && winFlag) return stake;
    if (stake != null && loseFlag) return -stake;

    return null;
  }

  function handleDeals(payload){
    const S = window.InfinityBot && window.InfinityBot.S ? window.InfinityBot.S : null;
    if (!S || !S.running) return;

    const startMs = Number(S.sessionStartMs || 0);
    if (!startMs) return;

    S.sessionStats = S.sessionStats || { pnl:0, w:0, l:0, t:0, ws:0, deals:0 };
    S.wsDealSeen = S.wsDealSeen || Object.create(null);

    const arr = normalizeDeals(payload);
    for (const d of arr){
      const id = d.id ?? d.deal_id ?? d.dealId ?? d.ticket ?? d.order_id ?? d.orderId ?? d.uid ?? null;
      const closeMs = extractCloseMs(d);
      if (closeMs != null && closeMs < startMs) continue; // ignore history before START

      // must look like a closed result: either close time exists or profit exists
      const pnl = extractPnl(d);
      if (pnl == null) continue;

      const key = id != null ? "id:" + String(id) : (closeMs != null ? "t:"+closeMs+":"+String(pnl) : null);
      if (!key) continue;
      if (S.wsDealSeen[key]) continue;
      S.wsDealSeen[key] = 1;
      S.wsDealSeenCount = (S.wsDealSeenCount||0) + 1;

      S.sessionStats.pnl += pnl;
      S.sessionStats.t += 1;
      if (pnl > 0) S.sessionStats.w += 1; else S.sessionStats.l += 1;

      const tf = tfLabelFromPeriod(d.period ?? d.tf ?? d.timeframe ?? d.duration ?? "");
      logOutcome(pnl > 0, pnl, tf, id);
    }
  }

  window.addEventListener("message", function(e){
    const d = e && e.data;
    if (!d) return;
    if (d.__iaaType === "IAA_PO_DEAL_EVENT" || d.__iaaType === "IAA_PO_DEAL_PAYLOAD") {
      handleDeals(d.payload);
    }
  }, false);
})();







/* IAA REPORT DATA HOOK */
(function(){
  try{
    if (window.__iaaReportDataHookInstalled) return;
    window.__iaaReportDataHookInstalled = true;
    setInterval(() => {
      const S = (window.InfinityBot && window.InfinityBot.S) ? window.InfinityBot.S : null;
      if (!S) return;
      window.__IAA_SESSION_STATS__ = S.sessionStats || null;
      window.__IAA_WS_OUTCOMES__ = S.wsOutcomeHistory || null;
    }, 1000);
  }catch(e){}
})();
