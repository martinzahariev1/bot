(() => {
  'use strict';

  const IAA_PAGE_BRIDGE_MODE = false;
  const BUILD_ID = '20260225-1200-expiryfix';
  console.log(`[BUILD] ${BUILD_ID}`);

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
    httpFramesSeen: 0,
    bridgeReady: false
  });
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
  const KILLER_ENABLED_KEY = 'IAA_KILLER_ENABLED';
  const KILLER_HUD_ENABLED_KEY = 'IAA_KILLER_HUD_ENABLED';
  const KILLER_MIN_CONFLUENCE_KEY = 'IAA_KILLER_MIN_CONFLUENCE';
  const KILLER_DOM_THRESHOLD_KEY = 'IAA_KILLER_DOM_THRESHOLD';
  const KILLER_PERFECT_TIME_KEY = 'IAA_KILLER_PERFECT_TIME';
  const KILLER_ADX_DYNAMIC_KEY = 'IAA_KILLER_ADX_DYNAMIC';
  const KILLER_CANDLE_HARDSTOP_KEY = 'IAA_KILLER_CANDLE_HARDSTOP';
  const KILLER_SIGNAL_COOLDOWN_SEC_KEY = 'IAA_KILLER_SIGNAL_COOLDOWN_SEC';
  const KILLER_USE_STRATEGY_VOTES_KEY = 'IAA_KILLER_USE_STRATEGY_VOTES';
  const KILLER_STRATEGY_AGREEMENT_KEY = 'IAA_KILLER_STRATEGY_AGREEMENT';
  const KILLER_DYNAMIC_COLLAPSED_KEY = 'IAA_KILLER_DYNAMIC_COLLAPSED';
  const DYNAMIC_CORE_COLLAPSED_KEY = 'IAA_DYNAMIC_CORE_COLLAPSED';
  const DYNAMIC_STAKE_COLLAPSED_KEY = 'IAA_DYNAMIC_STAKE_COLLAPSED';
  const KILLER_HUD_POS_KEY = 'IAA_KILLER_HUD_POS';
  const SNIPER_BASE_AMOUNT_KEY = 'IAA_SNIPER_BASE_AMOUNT_CENTS';
  const SNIPER_THRESHOLD_KEY = 'IAA_SNIPER_THRESHOLD';
  const SNIPER_THRESHOLD_OTC_KEY = 'IAA_SNIPER_THRESHOLD_OTC';
  const SNIPER_THRESHOLD_REAL_KEY = 'IAA_SNIPER_THRESHOLD_REAL';
  const SNIPER_MIN_PAYOUT_KEY = 'IAA_SNIPER_MIN_PAYOUT';
  const SNIPER_ENTRY_ПЕЧАЛБИDOW_SEC_KEY = 'IAA_SNIPER_ENTRY_ПЕЧАЛБИDOW_SEC';
  const ENTRY_WIN_TF_ENABLED_KEY = 'IAA_ENTRY_WIN_TF_ENABLED';
  const ENTRY_WIN_1M_SEC_KEY = 'IAA_ENTRY_WIN_1M_SEC';
  const ENTRY_WIN_3M_SEC_KEY = 'IAA_ENTRY_WIN_3M_SEC';
  const ENTRY_WIN_5M_SEC_KEY = 'IAA_ENTRY_WIN_5M_SEC';
  const EARLY_ENTRY_1M_ENABLED_KEY = 'IAA_EARLY_ENTRY_1M_ENABLED';
  const EARLY_ENTRY_3M_ENABLED_KEY = 'IAA_EARLY_ENTRY_3M_ENABLED';
  const EARLY_ENTRY_5M_ENABLED_KEY = 'IAA_EARLY_ENTRY_5M_ENABLED';
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
  const FILTERMODE_ENABLED_KEY = 'IAA_FILTERMODE_ENABLED';
  const FILTERMODE_AUTO_KEY = 'IAA_FILTERMODE_AUTO';
  const FILTERMODE_MANUAL_KEY = 'IAA_FILTERMODE_MANUAL';
  const FILTERMODE_AUTO_WINDOW_KEY = 'IAA_FILTERMODE_AUTO_WINDOW_MIN';
  const FILTERMODE_AUTO_FLIPS_KEY = 'IAA_FILTERMODE_AUTO_FLIPS';
  const FILTERMODE_AUTO_DROPS_KEY = 'IAA_FILTERMODE_AUTO_DROPS';
  const LOG_VERBOSITY_KEY = 'IAA_LOG_VERBOSITY';

  // Backwards/forwards-compat keys (some parts of the UI/logic refer to older names)
  // Keep ONE source of truth to avoid "... is not defined" crashes.
  const FILTERMODE_MODE_KEY = FILTERMODE_MANUAL_KEY; // stores current manual mode: 'soft' | 'auto' | 'strict'
  const FILTERMODE_AUTO_WINDOW_MIN_KEY = FILTERMODE_AUTO_WINDOW_KEY;
  const FILTERMODE_AUTO_FLIP_THRESH_KEY = FILTERMODE_AUTO_FLIPS_KEY;
  const FILTERMODE_AUTO_DROP_THRESH_KEY = FILTERMODE_AUTO_DROPS_KEY;
  const SNIPER_VWAP_WEIGHT_KEY = 'IAA_SNIPER_VWAP_WEIGHT';
  const SNIPER_MOMENTUM_WEIGHT_KEY = 'IAA_SNIPER_MOMENTUM_WEIGHT';
  const SNIPER_VOLUME_WEIGHT_KEY = 'IAA_SNIPER_VOLUME_WEIGHT';
  const SNIPER_VWAP_ENABLED_KEY = 'IAA_SNIPER_VWAP_ENABLED';
  const SNIPER_MOMENTUM_ENABLED_KEY = 'IAA_SNIPER_MOMENTUM_ENABLED';
  const SNIPER_VOLUME_ENABLED_KEY = 'IAA_SNIPER_VOLUME_ENABLED';
  const SNIPER_CHOP_ENABLED_KEY = 'IAA_SNIPER_CHOP_ENABLED';
  const SNIPER_TIMEFRAMES_KEY = 'IAA_SNIPER_TIMEFRAMES_V1';

  const FILTER_SPREAD_ENABLED_KEY = 'IAA_FILTER_SPREAD_ENABLED';
  const FILTER_SPREAD_THRESHOLD_KEY = 'IAA_FILTER_SPREAD_THRESHOLD';
  const FILTER_DRIFT_ENABLED_KEY = 'IAA_FILTER_DRIFT_ENABLED';
  const FILTER_DRIFT_THRESHOLD_KEY = 'IAA_FILTER_DRIFT_THRESHOLD';
  const FILTER_FLIPDELAY_ENABLED_KEY = 'IAA_FILTER_FLIPDELAY_ENABLED';
  const FILTER_FLIPDELAY_SEC_KEY = 'IAA_FILTER_FLIPDELAY_SEC';
  const FILTER_IMPULSECAP_ENABLED_KEY = 'IAA_FILTER_IMPULSECAP_ENABLED';
  const FILTER_IMPULSECAP_MAX_KEY = 'IAA_FILTER_IMPULSECAP_MAX';


  const RANGE_OSC_PENALTY_ENABLED_KEY = 'IAA_RANGE_OSC_PENALTY_ENABLED';
  const RANGE_OSC_PENALTY_PCT_KEY = 'IAA_RANGE_OSC_PENALTY_PCT';
  const FEATURE_VOLUME_REJECTION_KEY = 'IAA_FEATURE_VOLUME_REJECTION';
  const FEATURE_VWAP_ANALYSIS_KEY = 'IAA_FEATURE_VWAP_ANALYSIS';
  const FEATURE_SESSION_BOOST_KEY = 'IAA_FEATURE_SESSION_BOOST';
  const FEATURE_TIMEFRAMES_KEY = 'IAA_FEATURE_TIMEFRAMES_V1';
  const PHASE_CATCH_MOVE_KEY = 'IAA_PHASE_CATCH_MOVE';
  const PHASE_RELOAD_SNIPER_KEY = 'IAA_PHASE_RELOAD_SNIPER';
  const AI_VISION_ENABLED_KEY = 'IAA_AI_VISION_ENABLED';
  const AI_VISION_MORNING_STAR_KEY = 'IAA_AI_VISION_MORNING_STAR';
  const AI_VISION_EVENING_STAR_KEY = 'IAA_AI_VISION_EVENING_STAR';
  const AI_VISION_REQUIRE_MATCH_KEY = 'IAA_AI_VISION_REQUIRE_MATCH';
  const STRATEGY_AUTO_SWITCH_KEY = 'IAA_STRATEGY_AUTO_SWITCH';
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
  const BIAS_TF_30M_KEY = 'IAA_BIAS_TF_30M';
  const CONFLICT_STRENGTH_KEY = 'IAA_CONFLICT_STRENGTH';
  const SNIPER_5S_DEFAULTS = {
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
    autoSwitch: true,
    wrWeight: 0.6,
    pnlWeight: 0.4,
    learningTrades: 12,
    lossStreakLimit: 3,
    configs: {
      scalp_microtrend: { enabled: true, priority: 1, label: 'SCALP Microtrend' },
      ema_rsi_pullback: { enabled: true, priority: 0.95, label: 'EMA+RSI Pullback' },
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

    if (source === 'http') {
      WS_FEED_BUFFER.httpFramesSeen = (WS_FEED_BUFFER.httpFramesSeen || 0) + 1;
    } else if (source === 'bridge') {
      WS_FEED_BUFFER.bridgeFramesSeen = (WS_FEED_BUFFER.bridgeFramesSeen || 0) + 1;
    }

    const botState = window.InfinityBot?.S;
    if (botState) {
      botState.wsPacketsSeen = WS_FEED_BUFFER.packetsSeen;
      botState.wsBridgeFramesSeen = WS_FEED_BUFFER.bridgeFramesSeen || 0;
      botState.httpFramesSeen = WS_FEED_BUFFER.httpFramesSeen || 0;
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
      if (!data) return;
      if (typeof data.__iaaType !== 'string') {
        // Fallback: some page internals post raw payloads without our marker.
        // Try to decode an int-based OTC price from generic payload.
        try {
          const candidate = extractPriceFromWsPayload(data);
          if (candidate && Number.isFinite(candidate.value)) {
            applyPriceFromNumericSample(candidate.value, candidate.decimals || 5, 'bridge', candidate.asset || '', candidate.timestamp || Date.now());
          }
        } catch {}
        return;
      }
      if (data.__iaaType === 'IAA_WS_BRIDGE_READY') {
        WS_FEED_BUFFER.bridgeReady = true;
        const st = window.InfinityBot?.S;
        if (st) st.wsBridgeReady = true;
        return;
      }
      if (data.__iaaType === PO_PRICE_EVENT) {
        const raw = Number(data.raw);
        const scaled = Number(data.price);
        const ts = Number(data.ts) || Date.now();
        const asset = String(data.asset || '').trim();
        if (!asset || !Number.isFinite(raw) || !Number.isFinite(scaled)) return;
        WS_FEED_BUFFER.bridgeReady = true;
        const readyState = window.InfinityBot?.S;
        if (readyState) readyState.wsBridgeReady = true;
        applyPriceFromNumericSample(scaled, 5, 'bridge', asset, ts);
        return;
      }
      if (data.__iaaType !== 'IAA_WS_BRIDGE_FRAME' || typeof data.payload !== 'string') return;
      const source = data.source === 'http' ? 'http' : 'ws';
      if (source === 'http') {
        WS_FEED_BUFFER.httpFramesSeen = (WS_FEED_BUFFER.httpFramesSeen || 0) + 1;
      } else {
        WS_FEED_BUFFER.bridgeFramesSeen = (WS_FEED_BUFFER.bridgeFramesSeen || 0) + 1;
      }
      try {
        handleWsPriceSample(data.payload);
      } catch {}
    }, false);
  }

  function ensurePageWsBridgeInjected() {
    if (window.__iaaBridgeInjectAttempted) return;
    window.__iaaBridgeInjectAttempted = true;
    window.__iaaBridgeInjectOk = false;
    window.__iaaBridgeInjectError = null;

    try {
      const src = chrome?.runtime?.getURL?.('inject.js');
      if (!src) {
        window.__iaaBridgeInjectError = 'inject_url_unavailable';
        return;
      }
      if (document.querySelector('script[data-iaa-bridge="inject-js"]')) {
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
        script.remove();
      }, { once: true });
      (document.documentElement || document.head || document.body)?.appendChild(script);
    } catch (err) {
      window.__iaaBridgeInjectOk = false;
      window.__iaaBridgeInjectError = `inject_exception:${String(err?.message || err || 'unknown')}`;
    }
  }

  function installHttpPriceTap() {
    // Disabled: price source is DOM selector only.
    return;

    if (window.__iaaHttpTapped) return;
    window.__iaaHttpTapped = true;
    const looksRelevant = (text = '', url = '') => {
      const hay = `${url} ${text}`.toLowerCase();
      return /(quote|price|tick|candle|history|stream|asset|symbol|pair|loadhistory|updatestream|socket\.io)/.test(hay);
    };

    try {
      const origFetch = window.fetch;
      if (typeof origFetch === 'function' && !window.__iaaContentFetchTapped) {
        window.__iaaContentFetchTapped = true;
        window.fetch = async function(...args) {
          const res = await origFetch.apply(this, args);
          try {
            const url = String(args?.[0]?.url || args?.[0] || '');
            const clone = res?.clone?.();
            if (clone) {
              clone.text().then((txt) => {
                if (!txt || txt.length > 350000) return;
                if (!looksRelevant(txt, url)) return;
                const candidate = extractPriceFromWsPayload(txt);
                if (candidate?.value) applyPriceFromNumericSample(candidate.value, candidate.decimals || 5, 'http', candidate.asset || '', candidate.timestamp || Date.now());
              }).catch(() => {});
            }
          } catch {}
          return res;
        };
      }
    } catch {}

    try {
      if (!window.__iaaContentXhrTapped) {
        window.__iaaContentXhrTapped = true;
        const origOpen = XMLHttpRequest.prototype.open;
        const origSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.open = function(method, url, ...rest) {
          this.__iaaUrl = String(url || '');
          return origOpen.call(this, method, url, ...rest);
        };
        XMLHttpRequest.prototype.send = function(...args) {
          this.addEventListener('load', () => {
            try {
              const txt = typeof this.responseText === 'string' ? this.responseText : '';
              if (!txt || txt.length > 350000) return;
              if (!looksRelevant(txt, this.__iaaUrl || '')) return;
              const candidate = extractPriceFromWsPayload(txt);
              if (candidate?.value) applyPriceFromNumericSample(candidate.value, candidate.decimals || 5, 'http', candidate.asset || '', candidate.timestamp || Date.now());
            } catch {}
          });
          return origSend.apply(this, args);
        };
      }
    } catch {}
  }

  function installWebSocketPriceTap() {
    // Disabled: price source is DOM selector only.
    return;

    if (window.__iaaWsTapped) return;
    window.__iaaWsTapped = true;
    ensurePageWsBridgeListener();
    ensurePageWsBridgeInjected();
    const OriginalWebSocket = window.WebSocket;
    if (!OriginalWebSocket) return;

    try {
      const proto = OriginalWebSocket.prototype;
      if (proto && typeof proto.dispatchEvent === 'function' && !proto.__iaaDispatchTapped) {
        const originalDispatch = proto.dispatchEvent;
        proto.dispatchEvent = function(event) {
          if (event?.type === 'message') {
            try { handleWsMessageData(event.data); } catch {}
          }
          return originalDispatch.apply(this, arguments);
        };
        proto.__iaaDispatchTapped = true;
      }
    } catch {
      // ignore prototype hook errors
    }

    window.WebSocket = function (...args) {
      const ws = new OriginalWebSocket(...args);
      ws.addEventListener('message', (event) => {
        try {
          handleWsMessageData(event?.data);
        } catch {
          // ignore ws parse errors
        }
      });
      return ws;
    };
    window.WebSocket.prototype = OriginalWebSocket.prototype;
    window.WebSocket.OPEN = OriginalWebSocket.OPEN;
    window.WebSocket.CLOSED = OriginalWebSocket.CLOSED;
    window.WebSocket.CLOSING = OriginalWebSocket.CLOSING;
    window.WebSocket.CONNECTING = OriginalWebSocket.CONNECTING;
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
      scanLoop: null,
      execLoop: null,
      settleLoop: null,
      executionQueue: [],
      execWorkerBusy: false,
      scanBusy: false,
      settleBusy: false,
      maxExecutionQueueLen: 3,
      queueMetrics: { queueLen: 0, avgExecMs: 0, avgSettleMs: 0, scanCycleMs: 0, _execN: 0, _settleN: 0, _scanN: 0 },
      metrics: { queueLen: 0, avgExecMs: 0, avgSettleMs: 0, scanCycleMs: 0 },
      stabilityCache: {},
      lastPrice:null, priceHistory:[],
      lastPriceAt: 0,
      lastAssetLabel: null,
      lastAssetLabelNormalized: null,
      sniperFastWarmupUntil: 0,
      activeTrades: [], tradeLockUntil:0, tradeCount:0,
      lastTradeAttemptCycleId: null,
      scanCycleId: 0,
      reservedTradeSlotAt: 0,
      lastTradeSignalKey: '',
      lastTradeSignalAt: 0,
      autoTrade:true,
      mode: 'sniper',

      // money
      currentAmount:null, baseAmount:null, tradeProfitLoss:0, balance:0,
      lastTradeOutcome:null, botStartTime:0, expirySetting:'1M',
      botStartBalance: null,
      forceAssetSelect: false,

      // balance observer
      balObs: null,
      balanceBeforeTrade: null,
      // balance event ledger
      lastBalanceCents: null,
      balanceEventSeq: 0,
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
      httpFramesSeen: 0,
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
      sniperKeepAliveEnabled: false,
      keepAliveInterval: null,
      keepAliveActive: false,
      sniperKeepAliveEnabled: false,
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
      unresolvedTrades: 0,
      unresolvedStreak: 0,
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
      dynamicCoreCollapsed: false,
      dynamicStakeCollapsed: true,
      killerDynamicCollapsed: true,
      killerEnabled: false,
      killerHudEnabled: false,
      killerMinConfluence: 6,
      killerDominanceThreshold: 68,
      killerPerfectTimeEnabled: true,
      killerAdxDynamicEnabled: true,
      killerCandleAgainstHardStop: true,
      killerSignalCooldownSec: 5,
      killerUseStrategyVotes: true,
      killerStrategyAgreementMin: 1,
      killerEdgeState: {},
      killerHudPos: { x: null, y: null },
      killerSnapshot: null,
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
      logVerbosity: 'normal',
      logSpamCache: Object.create(null),
      /* ---------- Sniper mode ---------- */
      sniperBaseAmount: SNIPER_5S_DEFAULTS.baseAmountCents,
      sniperThreshold: SNIPER_5S_DEFAULTS.threshold,
      sniperThresholdOtc: SNIPER_5S_DEFAULTS.threshold,
      sniperThresholdReal: SNIPER_5S_DEFAULTS.threshold,
      sniperMinPayout: SNIPER_5S_DEFAULTS.minPayout,
      sniperEntryWindowSec: SNIPER_5S_DEFAULTS.entryWindowSec,
      entryWindowTfEnabled: true,
      entryWindowSec1m: 20,
      entryWindowSec3m: 45,
      entryWindowSec5m: 150,
      earlyEntry1mEnabled: true,
      earlyEntry3mEnabled: true,
      earlyEntry5mEnabled: true,
      entryWindowSec15m: 120,
      tfFirstSeenCandleStart: {},
      tfSync: {},
      lastMinimalHeartbeatAt: 0,
      entryTimingLogCache: {},
      gateBlockEvents: [],
      lastGateBlockerSummary: '—',
      lastGateBlockerReason: '—',
      tfDirectionMemory: {},
      tfDirLockMs1m: 8000,
      tfDirLockMs3m: 12000,
      tfDirLockMsDefault: 10000,
      domHysteresisDelta: 10,
      biasHysteresis: { dir: null, lastDomPct: 0 },
      hybridAllow1m: true,
      sniperWarmupMin: SNIPER_5S_DEFAULTS.warmupMin,
      sniperVwapDeviation: SNIPER_5S_DEFAULTS.vwapDeviation,
      sniperVwapLookbackMin: SNIPER_5S_DEFAULTS.vwapLookbackMin,
      sniperMomentumThreshold: SNIPER_5S_DEFAULTS.momentumThreshold,
      sniperChopThreshold: SNIPER_5S_DEFAULTS.chopThreshold,
      sniperVwapEnabled: false,
      sniperMomentumEnabled: false,
      sniperVolumeEnabled: false,
      sniperChopEnabled: true,
      sniperNoTradeInChop: false,
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
      sniperEnabledTimeframes: { ...SNIPER_5S_DEFAULTS.timeframes },
      featureVolumeRejection: FEATURE_DEFAULTS.volumeRejection,
      featureVwapAnalysis: FEATURE_DEFAULTS.vwapAnalysis,
      featureSessionBoost: FEATURE_DEFAULTS.sessionBoost,
      aiVisionEnabled: false,
      aiVisionMorningStar: true,
      aiVisionEveningStar: true,
      aiVisionRequireMatch: false,
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
      sniperInFlightKey: null,
      sniperInFlightUntil: 0,
      sniperTfStatus: {},
      strategyStats: {},
      sniperSettingsCollapsed: false,
      sniperWeightsCollapsed: false,
      sniperSmartCollapsed: false,
      sniperEngineCollapsed: false,
      sniperRiskCollapsed: false,
      sniperNewFiltersCollapsed: true,
      sniperSettingsTab: 'basic',
      debugTab: 'status',
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
      if (typeof S.sniperVwapEnabled !== 'boolean') S.sniperVwapEnabled = false;
      if (typeof S.sniperMomentumEnabled !== 'boolean') S.sniperMomentumEnabled = false;
      if (typeof S.sniperVolumeEnabled !== 'boolean') S.sniperVolumeEnabled = false;
      if (typeof S.sniperChopEnabled !== 'boolean') S.sniperChopEnabled = true;
      if (typeof S.sniperNoTradeInChop !== 'boolean') S.sniperNoTradeInChop = false;
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
      S.sniperEnabledTimeframes = { ...defaults.timeframes };
      if (typeof S.featureVolumeRejection !== 'boolean') S.featureVolumeRejection = FEATURE_DEFAULTS.volumeRejection;
      if (typeof S.featureVwapAnalysis !== 'boolean') S.featureVwapAnalysis = false;
      if (typeof S.featureSessionBoost !== 'boolean') S.featureSessionBoost = FEATURE_DEFAULTS.sessionBoost;
      if (typeof S.aiVisionEnabled !== 'boolean') S.aiVisionEnabled = true;
      if (typeof S.aiVisionMorningStar !== 'boolean') S.aiVisionMorningStar = true;
      if (typeof S.aiVisionEveningStar !== 'boolean') S.aiVisionEveningStar = true;
      if (typeof S.aiVisionRequireMatch !== 'boolean') S.aiVisionRequireMatch = false;
      if (!S.sniperEnabledTimeframes) S.sniperEnabledTimeframes = { ...FEATURE_DEFAULTS.timeframes };
      if (typeof S.autoSwitchStrategy !== 'boolean') S.autoSwitchStrategy = STRATEGY_DEFAULTS.autoSwitch;
      if (!Number.isFinite(S.strategyWeightWr)) S.strategyWeightWr = STRATEGY_DEFAULTS.wrWeight;
      if (!Number.isFinite(S.strategyWeightPnl)) S.strategyWeightPnl = STRATEGY_DEFAULTS.pnlWeight;
      if (!Number.isFinite(S.strategyLearningTrades)) S.strategyLearningTrades = STRATEGY_DEFAULTS.learningTrades;
      if (!Number.isFinite(S.strategyLossStreakLimit)) S.strategyLossStreakLimit = STRATEGY_DEFAULTS.lossStreakLimit;
      if (!S.strategyConfigs) S.strategyConfigs = { ...STRATEGY_DEFAULTS.configs };
      if (typeof S.candlestickPatternEnabled !== 'boolean') S.candlestickPatternEnabled = true;
      if (!Number.isFinite(S.candlestickPatternWeight)) S.candlestickPatternWeight = 0.25;
      if (typeof S.phaseCatchMoveEnabled !== 'boolean') S.phaseCatchMoveEnabled = false;
      if (typeof S.phaseReloadSniperEnabled !== 'boolean') S.phaseReloadSniperEnabled = false;
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
      diagnostics: 'ℹA|{dir} {conf}%|праг {thr}%|{strategy}|{skip}',
      diagnostics_score: 'ℹS|🔎|{points}|{strategy}|{reason}',
      trade_attempt: 'Опит за сделка: {asset} {direction} {expiry}',
      trade_buttons_missing: 'Пропуск: липсват бутони',
      trade_amount_missing: 'Пропуск: липсва поле за сума',
      trade_clicked: 'Клик: {direction} {amount}',
      asset_selected: 'Избран актив: {asset}',
      asset_select_failed: 'Провал при избор на актив',
      payout_missing: 'Липсва изплащане',
      analysis_ready_selftrade_off: 'Анализът е готов, но самостоятелните сделки са изключени.',
      switching_asset: 'Смяна на актив',
      identifying_pattern: 'Търсене на входен модел',
      pattern_identified: 'Моделът е открит',
      trade_executed: 'СДЕЛКА!!!',
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
      ai: 'AI',
      ai_off: 'AI: AI Vision OFF',
      ai_no_pattern: 'AI: няма pattern',
      ai_against: 'AI: pattern против посоката',
      ai_stale: 'AI: pattern stale',
      ai_required: 'AI: изисква се pattern за вход',
      spread_low: 'Spread: слаб bias',
      drift: 'Drift: signal умира',
      flip_delay: 'Flip delay',
      impulse_cap: 'Impulse cap',

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
      return 'sniper';
    }

    function isSniperMode() {
      return getActiveMode() === 'sniper';
    }

    function getEffectiveKeepAliveEnabled() {
      return isSniperMode() ? S.sniperKeepAliveEnabled : S.sniperKeepAliveEnabled;
    }

    function setMode() {
      S.mode = 'sniper';
      stopCountdown();
      S.forceImmediate = false;
      S.sniperWarmupUntil = Date.now();
      S.sniperLastTradeByTf = {};
      S.sniperNextTradeByTf = {};
      S.sniperTfStatus = {};
      refreshUI('legacy_direct_render_replaced');
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
        if (messageText.startsWith('ℹ') || lower.startsWith('diag') || lower.startsWith('диагн')) {
          msgClass += ' iaa-console-msg--diag';
        } else if (lower.includes('signal') || lower.includes('сигнал')) {
          msgClass += ' iaa-console-msg--signal';
        } else if (lower.startsWith('опит за сделка')) {
          msgClass += ' iaa-console-msg--attempt';
        } else if (lower.startsWith('клик:')) {
          msgClass += ' iaa-console-msg--click';
        } else if (lower.startsWith('сделка!!!') || lower.startsWith('сделка')) {
          msgClass += ' iaa-console-msg--trade';
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

    function compactRecheckMessage(message){
      if (!message) return null;
      // Example:
      // [SCAN V5] ПРОПУСК: 1m повторна проверка (посока SELL→BUY, увереност 38% < праг 100%, увереност 94%→38%)
      if (!/повторна проверка/i.test(message)) return null;

      // TF
      const tfMatch = message.match(/ПРОПУСК:\s*([0-9]+m)\s+повторна проверка/i);
      const tf = tfMatch ? tfMatch[1].toUpperCase() : 'TF';

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
      if (message.startsWith('Клик:')) {
        // Expect: "Клик: SELL $1.00 | увереност=97%"
        return message
          .replace(/\bBUY\b/, '<span class="iaa-log-buy">BUY</span>')
          .replace(/\bSELL\b/, '<span class="iaa-log-sell">SELL</span>');
      }
      return message;
    }

    function logConsoleLine(message){
      if (!message) return;
      // Compact spammy re-check logs
      const compact = compactRecheckMessage(message);
      if (compact) message = compact;

      message = stylizeConsoleMessage(message);

      const now = Date.now();
      const isOutcomeMessage = /^✅|^❌|^⚪/.test(message);
      if (!isOutcomeMessage && S.lastConsoleMessage === message && now - S.lastConsoleAt < 1500) return;
      S.lastConsoleMessage = message;
      S.lastConsoleAt = now;

      const stamp = new Date().toLocaleTimeString();
      S.consoleLines.push(`[${stamp}] ${message}`);
      if (S.consoleLines.length > 200) S.consoleLines.shift();
      try { sessionRecordLog(message, `[${stamp}] ${message}`); } catch (e) {}
      renderConsole();
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
          settledTrades: [],
          unresolvedTrades: [],
          stats: { wins: 0, losses: 0, pnlCents: 0, unresolved: 0 },
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
      sess.settledTrades = [];
      sess.unresolvedTrades = [];
      sess["stats"] = { wins: 0, losses: 0, pnlCents: 0, unresolved: 0 };
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
      if (/СДЕЛКА!!!/i.test(txt)) bump('Вход');
    }

    function sessionRecordTrade(trade, outcome, profitCents) {
      const now = Date.now();
      const tradeId = trade?.id || trade?.tradeId || null;
      const rawConfidence = Number.isFinite(trade?.confidence)
        ? trade.confidence
        : (Number.isFinite(trade?.expectedConfidence)
          ? trade.expectedConfidence
          : (Number.isFinite(trade?.entryContext?.confidencePct) ? (trade.entryContext.confidencePct / 100) : null));
      const normalizedConfidence = Number.isFinite(rawConfidence)
        ? (rawConfidence > 1 ? (rawConfidence <= 100 ? (rawConfidence / 100) : 1) : Math.max(0, Math.min(1, rawConfidence)))
        : null;

      const entry = {
        id: tradeId,
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
        payoutSnapshot: Number.isFinite(trade?.payoutPercentSnapshot) ? trade.payoutPercentSnapshot : null,
        expirySeconds: Number.isFinite(trade?.expiryMs) ? Math.round(trade.expiryMs / 1000) : null,
        dynamicMode: trade?.dynamicMode || null,
        dynamicSimWinrate: Number.isFinite(trade?.dynamicSimWinrate) ? trade.dynamicSimWinrate : null,
        dynamicSimSamples: Number.isFinite(trade?.dynamicSimSamples) ? trade.dynamicSimSamples : null,
        stakeCents: Number.isFinite(trade?.stakeCents) ? trade.stakeCents : null,
        stakeMultiplier: Number.isFinite(trade?.stakeMultiplier) ? trade.stakeMultiplier : null,
        scoreBreakdown: Array.isArray(trade?.entryContext?.scoreCard?.breakdown) ? trade.entryContext.scoreCard.breakdown.slice(0, 10) : [],
        hardStopsHit: Array.isArray(trade?.hardStopsHit) ? trade.hardStopsHit.slice(0, 10) : [],
        timeIntoCandleSec: Number.isFinite(trade?.entryContext?.entryMeta?.timeInCandle) ? trade.entryContext.entryMeta.timeInCandle : null,
        entryWindowSec: Number.isFinite(trade?.entryContext?.entryMeta?.entryWindowSec) ? trade.entryContext.entryMeta.entryWindowSec : null,
        biasStrength: Number.isFinite(trade?.entryContext?.entryMeta?.biasStrength) ? trade.entryContext.entryMeta.biasStrength : null,
        regimeStrength: Number.isFinite(trade?.entryContext?.entryMeta?.regimeStrength) ? trade.entryContext.entryMeta.regimeStrength : null,
        spikeFlag: !!trade?.entryContext?.entryMeta?.volatility?.spikeFlag,
        stablePass: !!trade?.entryContext?.entryMeta?.stablePass,
        passesCount: Number(trade?.entryContext?.entryMeta?.passesCount || 0),
        settleReason: trade?.outcomeMethod || null,
        evidenceDelta: Number.isFinite(trade?.evidence?.matchedEvent?.delta) ? trade.evidence.matchedEvent.delta : (Number.isFinite(trade?.evidence?.balanceDelta) ? trade.evidence.balanceDelta : null),
        driftSec: Number.isFinite(trade?.driftSec) ? trade.driftSec : null,
        mismatch: !!trade?.evidence?.mismatch,
        platformOutcomeBadge: trade?.platformOutcomeBadge || null,
        outcome,
        outcomeMethod: trade?.outcomeMethod || null,
        evidenceSummary: String(trade?.evidence?.summary || (Number.isFinite(trade?.evidence?.matchedEvent?.delta) ? `Δ=${trade.evidence.matchedEvent.delta}` : (Number.isFinite(trade?.evidence?.balanceDelta) ? `Δ=${trade.evidence.balanceDelta}` : '—'))),
        profitCents: Number.isFinite(profitCents) ? profitCents : null
      };
      return entry;
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

      // Console line (extra, not replacing anything)
      if (!shouldLogKillerConsole()) return;
      if (!shouldLogKillerLine(tf, verdict, reason || '')) return;
      const domPct = Number.isFinite(dom) ? Math.round(dom) : '—';
      const thrPct = Number.isFinite(thr) ? Math.round(thr) : '—';
      const maxPts = Number.isFinite(snapshot?.maxPoints) ? snapshot.maxPoints : 8;
      const confTxt = (Number.isFinite(conf) && Number.isFinite(min)) ? `${conf}/${maxPts} (мин ${min})` : '—';
      const ptOk = computePerfectTimeOk({ verdict, reason });
      const ptTxt = S.killerPerfectTimeEnabled ? (ptOk ? 'PT ✓' : 'PT ✗') : 'PT —';
      const adxTxt = Number.isFinite(adx) ? `ADX ${Math.round(adx)}` : 'ADX —';
      const why = verdict === 'PASS' ? 'READY' : `WAIT: ${reason || '—'}`;
      const whyShort = verdict === 'PASS' ? 'READY' : `WAIT:${reason || '—'}`;
      const pointsTxt = Array.isArray(snapshot?.checks)
        ? snapshot.checks.map((c) => `${c.key}${Number(c.points || 0) > 0 ? ` +${Number(c.points || 0)}` : ''}`).join(' • ')
        : '';
      const cWhy = verdict === 'PASS' ? '#22c55e' : '#f59e0b';
      const cDom = (Number.isFinite(dom) && Number.isFinite(thr) && dom >= thr) ? '#22c55e' : '#f59e0b';
      const cConf = (Number.isFinite(conf) && Number.isFinite(min) && conf >= min) ? '#22c55e' : '#f59e0b';
      logSpamControlled('scan', `killer:${tf}:${verdict}`, `🔫 ${tf}|<span style="color:${cWhy};font-weight:800;">${whyShort}</span>|<span style="color:${cConf};font-weight:800;">CONF ${confTxt}</span>|<span style="color:${cDom};font-weight:800;">DOM ${domPct}%(thr ${thrPct}%)</span>|<span style="color:#a5b4fc;font-weight:700;">${adxTxt}</span>|<span style="color:#e5e7eb;">${ptTxt}</span>${pointsTxt ? `|<span style="color:#93c5fd;">${pointsTxt}</span>` : ''}`);
    }

    function exportSessionHtml() {
      const sess = _sessionEnsure();
      
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

      const settled = sess.settledTrades || [];
      const unresolved = sess.unresolvedTrades || [];
      const trades = [...settled, ...unresolved];
      const wins = settled.filter(t => (t.outcome === 'ПЕЧАЛБИ' || t.outcome === 'WIN')).length;
      const losses = settled.filter(t => (t.outcome === 'ЗАГУБИ' || t.outcome === 'LOSS')).length;
      const neu = settled.filter(t=>t.outcome==='EVEN').length;
      const unresolvedCount = unresolved.length;
      const wrBase = Math.max(1, wins + losses);
      const winrate = ((wins/wrBase)*100);

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
        <div class="pill"><span>WR 7/9</span><b>${wr7.wr!=null?wr7.wr.toFixed(1)+'%':'—'} (${wr7.totalN})</b></div>
        <div class="pill"><span>WR 8/9</span><b>${wr8.wr!=null?wr8.wr.toFixed(1)+'%':'—'} (${wr8.totalN})</b></div>
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

  <h2>АНАЛИЗ ПО ПРАГ (7/9 vs 8/9)</h2>
  <div class="card"><table><thead><tr><th>Праг</th><th>Trades</th><th>WR</th><th>PnL</th><th>AvgPoints</th><th>AvgExpirySec</th></tr></thead><tbody>
  ${thresholdRows.map(r=>`<tr><td>${r.thr}/9</td><td>${r.trades}</td><td>${r.wr.toFixed(1)}%</td><td>${_fmtMoney(r.pnl)}</td><td>${r.avgPts.toFixed(2)}</td><td>${r.avgExp.toFixed(1)}</td></tr>`).join('')}
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
  <div class="card"><table><thead><tr><th>Time</th><th>Strategy</th><th>Regime</th><th>Points/Thr</th><th>Dir</th><th>ExpSec</th><th>DynMode</th><th>Stake</th><th>Method</th><th>Evidence</th><th>SettleReason</th><th>DriftSec</th><th>Stability</th><th>Outcome</th><th>PnL</th></tr></thead><tbody>
  ${trades.slice(-30).reverse().map(t=>`<tr><td>${t.time||'—'}</td><td>${t.strategyKey||'—'}</td><td>${t.regime||'—'}</td><td>${t.points||'—'}/${t.threshold||'—'}${Number(t.threshold)===8?` <span style="color:#f59e0b;font-weight:700;">STRICT</span>`:''}</td><td>${t.direction||'—'}</td><td>${t.expirySeconds||'—'}</td><td>${t.dynamicMode||'fixed'}</td><td>${Number.isFinite(t.stakeCents)?_fmtMoney(t.stakeCents):'—'}</td><td>${t.outcomeMethod||'—'}</td><td>${t.evidenceSummary || (Number.isFinite(t.evidenceDelta)?_fmtMoney(t.evidenceDelta):'—')} ${t.mismatch?'<span style=\"color:#ef4444;font-weight:700;\">MISMATCH</span>':''}</td><td>${t.settleReason||'—'}</td><td>${Number.isFinite(t.driftSec)?t.driftSec.toFixed(1):'—'}</td><td>${t.stablePass?`${t.passesCount||2}/2`:'false'}</td><td>${t.outcome==='UNRESOLVED'?`<span class="muted">UNRESOLVED</span>`:t.outcome||'—'}</td><td>${_fmtMoney(t.profitCents)}</td></tr>`).join('')}
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




    function getLogVerbosity() {
      const v = String(S.logVerbosity || 'normal').toLowerCase();
      return ['minimal', 'normal', 'detailed'].includes(v) ? v : 'normal';
    }

    function canEmitRateLimitedLog(key, cooldownMs) {
      const now = Date.now();
      const cache = S.logSpamCache || (S.logSpamCache = Object.create(null));
      const prev = Number(cache[key] || 0);
      if (prev && (now - prev) < Math.max(500, Number(cooldownMs) || 1000)) return false;
      cache[key] = now;
      return true;
    }

    function getSpamCooldownMs(category) {
      const verbosity = getLogVerbosity();
      if (category === 'gates') return verbosity === 'minimal' ? 30000 : 5000;
      if (category === 'status_wait') return verbosity === 'minimal' ? 30000 : 1000;
      return verbosity === 'minimal' ? 10000 : 2000;
    }

    function logSpamControlled(category, key, message, options = {}) {
      const stateKey = `spam:${category}:${key}`;
      const cooldownMs = getSpamCooldownMs(category);
      if (options.stateValue !== undefined) {
        const cache = S.logSpamStateCache || (S.logSpamStateCache = Object.create(null));
        const prevValue = cache[stateKey];
        cache[stateKey] = options.stateValue;
        if (prevValue !== undefined && prevValue !== options.stateValue) {
          logConsoleLine(message);
          return true;
        }
      }
      if (!canEmitRateLimitedLog(stateKey, cooldownMs)) return false;
      logConsoleLine(message);
      return true;
    }

    const entryTimingFailLogState = new Map();

    function normalizeEntryTimingReasonKey(reason = '') {
      const raw = String(reason || '').toUpperCase();
      if (!raw) return 'UNKNOWN';
      if (raw.includes('OUTSIDE_WINDOW') || raw.includes('КЪСЕН ВХОД')) return 'OUTSIDE_WINDOW';
      if (raw.includes('SYNC_WAIT_NEXT_CANDLE') || raw.includes('СИНХР.')) return 'SYNC_WAIT_NEXT_CANDLE';
      if (raw.includes('DISABLED_FOR_TF') || raw.includes('ИЗКЛЮЧЕН ЗА TF')) return 'DISABLED_FOR_TF';
      if (raw.includes('NAN_TIME') || raw.includes('NAN')) return 'NAN_TIME';
      if (raw.includes('LATE_BUT_ALLOWED_STRONG') || raw.includes('ДОПУСНАТ')) return 'LATE_BUT_ALLOWED_STRONG';
      return raw.replace(/\d+/g, '').slice(0, 40).trim() || 'UNKNOWN';
    }

    function shouldLogEntryTimingFail(tf, reason = '') {
      const verbosity = getLogVerbosity();
      const cooldownMs = verbosity === 'minimal' ? 30000 : (verbosity === 'normal' ? 5000 : 1500);
      const reasonKey = normalizeEntryTimingReasonKey(reason);
      const key = `${String(tf || 'na').toLowerCase()}|${reasonKey}`;
      const now = Date.now();
      const prev = Number(entryTimingFailLogState.get(key) || 0);
      if (prev && (now - prev) < cooldownMs) return false;
      entryTimingFailLogState.set(key, now);
      return true;
    }

    const gateFailSummaryLogState = new Map();
    const syncLogState = new Map();

    function shouldLogGateFailSummary(tf, topReasonKey = 'UNKNOWN') {
      const verbosity = getLogVerbosity();
      const cooldownMs = verbosity === 'minimal' ? 30000 : (verbosity === 'normal' ? 5000 : 1500);
      const key = `${String(tf || 'na').toLowerCase()}|${String(topReasonKey || 'UNKNOWN').toUpperCase()}`;
      const now = Date.now();
      const prev = Number(gateFailSummaryLogState.get(key) || 0);
      if (prev && (now - prev) < cooldownMs) return false;
      gateFailSummaryLogState.set(key, now);
      return true;
    }

    function shouldLogSyncEvent(tf, kind = 'OK') {
      const verbosity = getLogVerbosity();
      const cooldownMs = verbosity === 'minimal' ? 30000 : (verbosity === 'normal' ? 10000 : 2000);
      const key = `${String(tf || 'na').toLowerCase()}|${String(kind || 'OK').toUpperCase()}`;
      const now = Date.now();
      const prev = Number(syncLogState.get(key) || 0);
      if (prev && (now - prev) < cooldownMs) return false;
      syncLogState.set(key, now);
      return true;
    }

    function shouldLogKillerLine(tf, verdict, reason = '') {
      const verbosity = getLogVerbosity();
      const tfKey = String(tf || 'na').toLowerCase();
      const verdictKey = String(verdict || 'WAIT').toUpperCase();
      const reasonKey = normalizeEntryTimingReasonKey(reason || verdictKey);
      const stateKey = `${tfKey}|${verdictKey}|${reasonKey}`;
      const cache = S.killerTfLogState || (S.killerTfLogState = Object.create(null));
      const now = Date.now();
      const prev = cache[tfKey] || { t: 0, key: '' };
      const changed = prev.key !== stateKey;
      const cooldownMs = verbosity === 'minimal' ? 30000 : (verbosity === 'normal' ? 5000 : 1500);
      if (!changed && (now - Number(prev.t || 0)) < cooldownMs) return false;
      cache[tfKey] = { t: now, key: stateKey };
      return true;
    }

    function shouldLogScoreEvent(tf, kind, reason) {
      const verbosity = getLogVerbosity();
      if (verbosity === 'minimal') return false;
      if (verbosity === 'detailed') return true;
      const key = `score:${tf || 'na'}:${kind || 'score'}:${String(reason || '').slice(0, 80)}`;
      return canEmitRateLimitedLog(key, 12000);
    }

    function shouldLogKillerConsole() {
      return getLogVerbosity() !== 'minimal';
    }

    function logDiagnostics() {
      const now = Date.now();
      // Диагностиката да е синхронизирана с минутната свещ (а не 60s от старта), за да не дава фалшиви "късен вход" по средата на свещта.
      const minuteKey = Math.floor(now / 60000);
      if (S.lastDiagnosticsMinuteKey === minuteKey) return;
      const msIntoMinute = now - minuteKey * 60000;
      // Печатаме ~1-3.5s след началото на минутата (след като платформата/DOM обнови стойностите)
      if (msIntoMinute < 900 || msIntoMinute > 3500) return;
      if (!isSniperMode() && !S.analysisEnabled) return;
      S.lastDiagnosticsMinuteKey = minuteKey;
      S.lastDiagnosticsAt = now;
      const auto = S.autoTrade ? 'on' : 'off';
      const analysis = isSniperMode() ? 'sniper' : (S.analysisEnabled ? 'on' : 'off');
      const dir = S.analysisDirection || '-';
      const conf = typeof S.analysisConfidence === 'number' ? Math.round(S.analysisConfidence * 100) : '-';
      const thr = isSniperMode()
        ? (typeof S.sniperThreshold === 'number' ? Math.round(S.sniperThreshold * 100) : '-')
        : (typeof S.analysisConfidenceThreshold === 'number' ? Math.round(S.analysisConfidenceThreshold * 100) : '-');
      if (isSniperMode() && S.lastScoreSnapshot) {
        if (getLogVerbosity() === 'minimal' && !String(S.lastScoreSnapshot?.result || '').includes('READY') && !String(S.lastScoreSnapshot?.result || '').includes('HARD')) return;
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
      if (isSniperMode()) {
        const snap = S.lastScoreSnapshot || {
          result: 'ANALYZE',
          points: null,
          maxPoints: 9,
          threshold: getScoreThresholdPoints(),
          strategyKey: S.currentStrategyKey || null,
          reason: S.lastSkipReason ? translateSkipReason(S.lastSkipReason) : 'Изчакване за score'
        };
        const strategyLabel = snap.strategyKey ? getStrategyDisplayLabel(snap.strategyKey) : '—';
        const pointsLabel = Number.isFinite(snap.points) && Number.isFinite(snap.maxPoints)
          ? `${snap.points}/${snap.maxPoints} (праг ${snap.threshold}/${snap.maxPoints})`
          : `—/${snap.maxPoints || 9} (праг ${snap.threshold || 7}/${snap.maxPoints || 9})`;
        const reason = snap.reason || (S.lastSkipReason ? translateSkipReason(S.lastSkipReason) : '-');
        logConsoleLine(formatStatus('diagnostics_score', {
          result: snap.result || 'ANALYZE',
          points: pointsLabel,
          strategy: strategyLabel,
          reason
        }));
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
        volumeOk: meta.volumeOk ?? null,
        entryMeta: meta || null
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

  const tfLabel = (trade.tfLabel || trade.tf || trade.expiryLabel || trade.expiry || '').toString().toUpperCase();

  if (out === 'ПЕЧАЛБИ') {
    logConsoleLine(`✅ ПЕЧЕЛИВША СДЕЛКА (${money(pc)}) [${tfLabel}]`);
  } else if (out === 'ЗАГУБИ') {
    logConsoleLine(`❌ ГУБЕЩА СДЕЛКА (${money(pc)}) [${tfLabel}]`);
  } else if (out === 'EVEN') {
    // Neutral trade should never print stake or 100x amounts; it is 0 PnL by definition.
    logConsoleLine(`➖ НЕУТРАЛНА СДЕЛКА ($0.00) [${tfLabel}]`);
  } else if (String(out).toUpperCase() === 'UNRESOLVED') {
    logConsoleLine(`⚪ НЕПОТВЪРДЕН РЕЗУЛТАТ (UNRESOLVED) [${tfLabel}]`);
  } else {
    // Fallback
    logConsoleLine(`ℹ РЕЗУЛТАТ: ${out} (${money(pc)}) [${tfLabel}]`);
  }
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

    function refreshUI(reason = '', payload = null) {
      renderSniperMatrix();
      renderPendingTrades();
      updateProfitDisplay();
      renderTradeStats();
      if (S.debugOpen) renderDebugInfo();
      if (reason) S.lastUiRefreshReason = reason;
      S.lastUiRefreshPayload = payload || null;
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

    function recordGateBlockers(tfKey, failedGates = [], reasons = {}) {
      if (!Array.isArray(failedGates) || !failedGates.length) return;
      const now = Date.now();
      S.gateBlockEvents = Array.isArray(S.gateBlockEvents) ? S.gateBlockEvents : [];
      for (const gate of failedGates) {
        S.gateBlockEvents.push({
          t: now,
          tf: String(tfKey || '').toLowerCase(),
          gate: String(gate || ''),
          reason: String(reasons?.[gate] || '')
        });
      }
      if (S.gateBlockEvents.length > 2000) {
        S.gateBlockEvents.splice(0, S.gateBlockEvents.length - 2000);
      }
    }

    function computeTopBlockers(windowMs = 300000) {
      const now = Date.now();
      const events = (Array.isArray(S.gateBlockEvents) ? S.gateBlockEvents : []).filter((e) => (now - Number(e.t || 0)) <= windowMs);
      const mapLabel = (gate) => {
        if (gate === 'EntryTimingGate') return 'Вход TF';
        if (gate === 'PerfectTimeGate') return 'PT';
        if (gate === 'BiasConflictGate') return 'Bias';
        if (gate === 'StabilityGate') return 'Stability';
        if (gate === 'ConfluenceGate') return 'CONF';
        if (gate === 'DominanceGate') return 'DOM';
        return gate || '—';
      };
      const counts = Object.create(null);
      for (const e of events) {
        const label = mapLabel(String(e.gate || ''));
        counts[label] = (counts[label] || 0) + 1;
      }
      const total = Object.values(counts).reduce((a, b) => a + b, 0);
      if (!total) return { summary: 'PT 0% • Bias 0% • Вход TF 0%', last: 'Последно: —' };
      const pct = (k) => Math.round(((counts[k] || 0) / total) * 100);
      const top = `PT ${pct('PT')}% • Bias ${pct('Bias')}% • Вход TF ${pct('Вход TF')}%`;
      const lastEv = events[events.length - 1] || null;
      const last = lastEv ? `Последно: ${mapLabel(lastEv.gate)}${lastEv.reason ? ` (${lastEv.reason})` : ''}` : 'Последно: —';
      return { summary: top, last };
    }

    function updateDebugPanelBlockers() {
      const now = Date.now();
      if ((now - Number(S.lastBlockersUpdateAt || 0)) < 1000) return;
      S.lastBlockersUpdateAt = now;
      const topEl = $id('dbg-top-blockers');
      if (!topEl) return;
      const data = computeTopBlockers(300000);
      topEl.textContent = `${data.summary} | ${data.last}`;
      S.lastGateBlockerSummary = data.summary;
      S.lastGateBlockerReason = data.last;
    }

    function getDebugInfoLines() {
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
        { key: 'анализ', value: isSniperMode() ? 'Снайпер' : (S.analysisEnabled ? 'Да' : 'Не'), severity: '' },
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
        { key: 'пропуски (топ)', value: getTopSkipReasonsLabel(), severity: '' },
        { key: 'queueLen', value: String(S.metrics?.queueLen ?? S.queueMetrics?.queueLen ?? 0), severity: '' },
        { key: 'avgExecMs', value: `${Math.round(S.metrics?.avgExecMs || S.queueMetrics?.avgExecMs || 0)}ms`, severity: '' },
        { key: 'avgSettleMs', value: `${Math.round(S.metrics?.avgSettleMs || S.queueMetrics?.avgSettleMs || 0)}ms`, severity: '' },
        { key: 'scanCycleMs', value: `${Math.round(S.metrics?.scanCycleMs || S.queueMetrics?.scanCycleMs || 0)}ms`, severity: '' }
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
      const scannerLine = '<div class="iaa-debug-line"><span class="iaa-debug-key" style="color:#ef4444;font-weight:700;">[SCAN V5]</span><span class="iaa-debug-value" style="color:#ef4444;font-weight:700;">RUNNING</span></div>';
      content.innerHTML = scannerLine + '<div class="iaa-debug-line iaa-debug-blockers"><span class="iaa-debug-key dbg-red">ЗАЩО НЕ ВЛИЗА:</span><span class="iaa-debug-value dbg-red" id="dbg-top-blockers">PT 0% • Bias 0% • Вход TF 0% | Последно: —</span></div>' + lines.map((line) => {
        const severityClass = line.severity ? ` iaa-debug-value--${line.severity}` : '';
        return `<div class="iaa-debug-line"><span class="iaa-debug-key">${line.key}:</span><span class="iaa-debug-value${severityClass}">${line.value}</span></div>`;
      }).join('');
      updateDebugPanelBlockers();
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
      applyById('iaa-sniper-threshold', { min: 1, max: 100, highIsStrict: true });
      applyById('iaa-sniper-vwap', { min: 0, max: 0.30, highIsStrict: true });
      applyById('iaa-sniper-momentum', { min: 0, max: 0.30, highIsStrict: true });
      applyById('iaa-sniper-vwap-weight', { min: 1, max: 100, highIsStrict: true });
      applyById('iaa-sniper-momentum-weight', { min: 1, max: 100, highIsStrict: false });
      applyById('iaa-sniper-volume-weight', { min: 1, max: 100, highIsStrict: false });
      applyById('iaa-sniper-chop', { min: 1, max: 100, highIsStrict: true });
      applyById('iaa-candle-pattern-min-conf', { min: 1, max: 100, highIsStrict: true });
      applyById('iaa-candle-pattern-weight', { min: 1, max: 100, highIsStrict: false });
      applyById('iaa-entrywin-1m', { min: 0, max: 60, highIsStrict: false });
      applyById('iaa-entrywin-3m', { min: 0, max: 180, highIsStrict: false });
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
        httpFramesSeen: S.httpFramesSeen || 0,
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
        sniperThreshold: S.sniperThreshold,
        sniperVwapWeight: S.sniperVwapWeight,
        sniperMomentumWeight: S.sniperMomentumWeight,
        sniperVolumeWeight: S.sniperVolumeWeight,
        sniperVwapDeviation: S.sniperVwapDeviation,
        sniperMomentumThreshold: S.sniperMomentumThreshold,
        sniperChopThreshold: S.sniperChopThreshold,
        sniperEntryWindowSec: S.sniperEntryWindowSec,
        sniperTfStatus: S.sniperTfStatus
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

    function renderSniperMatrix () {
      const tfs = ['1m', '3m', '5m', '15m'];
      tfs.forEach(tf => {
        const textEl = $id(`iaa-tf-${tf}`);
        const dotEl = $id(`iaa-tf-dot-${tf}`);
        const cell = document.querySelector(`.iaa-tf-cell[data-tf="${tf}"]`);
        if (!textEl || !dotEl || !cell) return;
        dotEl.className = 'iaa-tf-dot';

        const enabled = !isSniperMode() || !!S.sniperEnabledTimeframes?.[tf];
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
        } else if (['weak', 'late', 'chop', 'vwap', 'momentum', 'payout', 'tf_wait', 'warmup', 'nodata', 'trend', 'volume', 'ai', 'ai_off', 'ai_no_pattern', 'ai_against', 'ai_required'].includes(status.state)) {
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
      if(!exp) return null; const e=String(exp).toUpperCase();
      if(/^(M1|1M|60S)$/.test(e)) return '1M';
      if(/^(M3|3M|180S)$/.test(e)) return '3M';
      if(/^(M5|5M|300S)$/.test(e)) return '5M';
      if(/^(M15|15M|900S)$/.test(e)) return '15M';
      return '1M';
    }

    function getSignalLateToleranceMs(expiry) {
      const norm = normalizeExpiry(expiry);
      if (norm === '15M') return 180000;
      if (norm === '5M') return 120000;
      if (norm === '3M') return 90000;
      return 60000;
    }

    function getSignalMaxFutureMs(expiry) {
      const norm = normalizeExpiry(expiry);
      if (norm === '15M') return 12 * 60 * 60 * 1000;
      if (norm === '5M') return 6 * 60 * 60 * 1000;
      if (norm === '3M') return 4 * 60 * 60 * 1000;
      return 2 * 60 * 60 * 1000;
    }

    function secsFromTF(tf){
      const norm = normalizeExpiry(tf);
      if (norm === '15M') return 900;
      if (norm === '5M') return 300;
      if (norm === '3M') return 180;
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

    function tryConsumeTradeRateSlot() {
      const limit = Number.isFinite(S.maxTradesPerMinute) ? Math.max(0, Math.round(S.maxTradesPerMinute)) : 0;
      if (!limit) return { ok: true, token: null };
      const now = Date.now();
      S.tradeTimestamps = (S.tradeTimestamps || []).filter(ts => now - ts < 60000);
      if (S.tradeTimestamps.length >= limit) return { ok: false, reason: 'MAX_RATE' };
      S.tradeTimestamps.push(now);
      return { ok: true, token: now };
    }

    function rollbackTradeRateSlot(token) {
      if (!Number.isFinite(token)) return;
      S.tradeTimestamps = (S.tradeTimestamps || []).filter((ts) => Number(ts) !== Number(token));
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
      const interval = norm === '15M' ? 15 : (norm === '5M' ? 5 : (norm === '3M' ? 3 : 1));
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
      const enabled = Object.keys(S.sniperEnabledTimeframes || {}).filter((tf) => !!S.sniperEnabledTimeframes[tf]);
      if (!enabled.length) return 0;
      let requiredMs = 0;
      for (const tf of enabled) {
        const tfMs = SNIPER_TF_MS[tf];
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
      // Single source of truth for live price:
      // #pending-trades_open-price > div.current-time > span
      const p = getRealtimeOpenPriceMenuValue();
      if (Number.isFinite(p)) {
        S.currentAssetPrice = p;
        S.lastPriceAt = Date.now();
        S.feedState = 'READY';
        S.lastFeedSource = 'dom_open_price';
        appendPriceHistoryTick(S, p, S.lastPriceAt, 'dom_open_price');
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
      const sniperWindowMs = Math.max(1, S.sniperWarmupMin || 0) * 60 * 1000;
      const readinessWindowMs = getMinHistoryWindowForReadinessMs();
      return Math.max(baseWindowMs, reversalWindowMs, sniperWindowMs, readinessWindowMs);
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
    function classifyBalanceEventType(delta) {
      if (delta > 0) return 'CREDIT';
      if (delta < 0) return 'DEBIT';
      return 'ZERO';
    }

    function appendBalanceEvent(curBalance, deltaCents) {
      if (!Number.isFinite(deltaCents) || deltaCents === 0) return null;
      S.balanceEvents = Array.isArray(S.balanceEvents) ? S.balanceEvents : [];
      const ev = {
        t: Date.now(),
        seq: ++S.balanceEventSeq,
        balanceCents: curBalance,
        deltaCents,
        type: classifyBalanceEventType(deltaCents),
        used: false
      };
      S.balanceEvents.push(ev);
      const activeTrades = Array.isArray(S.activeTrades) ? S.activeTrades : [];
      for (const t of activeTrades) {
        if (!t || t.outcomeChecked) continue;
        const inWindow = Number.isFinite(t.settleWindowStart) && Number.isFinite(t.settleWindowEnd) && ev.t >= t.settleWindowStart && ev.t <= t.settleWindowEnd;
        const tol = Math.max(5, Math.round(Math.abs(Number(t.stakeCents || 0)) * 0.05));
        const absDelta = Math.abs(Number(ev.deltaCents || 0));
        const expected = Math.abs(Number(t.expectedGrossCents || t.expectedProfitCents || 0));
        if (!inWindow && absDelta > Math.max(5, tol) && expected > 0) {
          t.exclusiveSession = false;
          t.noNoiseSession = false;
        }
      }
      const maxEv = Math.max(2000, Number(S.maxBalanceEvents || 0) || Number(S.balanceEventsMax || 500));
      if (S.balanceEvents.length > maxEv) S.balanceEvents.splice(0, S.balanceEvents.length - maxEv);
      return ev;
    }

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

        appendBalanceEvent(cur, delta);
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

          appendBalanceEvent(cur, delta);

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
    }

    /* ========================= KEEP ALIVE SYSTEM ========================= */
    async function performKeepAlive() {
      if (S.keepAliveActive) return;
      if (false || false || hasActiveTrade() || false) return;
      const overlayOpen = (() => {
        const isOpen = (id) => {
          const p = $id(id);
          return !!(p && p.style.display === 'block');
        };
        return isOpen('iaa-settings-panel') || isOpen('iaa-debug-panel') || isOpen('iaa-mouse-panel') || isOpen('iaa-calibration-panel');
      })();
      if (overlayOpen) {
        document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 8, clientY: 8 }));
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
          setStatusOverlay('Изпращане на сделка...');
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

    /* ========================= ENHANCED TRADE EXECUTION WITH EXACT TIMING ========================= */
    function markOtherTradesNonExclusive() {
      const active = Array.isArray(S.activeTrades) ? S.activeTrades : [];
      for (const t of active) {
        if (!t || t.outcomeChecked) continue;
        t.exclusiveSession = false;
      }
    }

    function attachTradeBaseline(trade, signal, entryContext) {
      const now = Date.now();
      const payoutSnapshot = Number.isFinite(trade.payoutPercent) ? trade.payoutPercent : Number(S.lastPayoutPercent || 0);
      trade.id = trade.id || ('T' + now.toString(36) + '_' + Math.random().toString(16).slice(2));
      trade.state = 'CLICKED';
      trade.clickedAt = now;
      trade.balanceBeforeClickCents = Number.isFinite(trade.balanceBefore) ? trade.balanceBefore : readBalanceCents();
      trade.payoutPercentSnapshot = payoutSnapshot;
      trade.expectedProfitCents = Math.floor(Number(trade.stakeCents || 0) * (payoutSnapshot / 100));
      trade.expectedGrossCents = Number(trade.stakeCents || 0) + Math.max(0, Number(trade.expectedProfitCents || 0));
      trade.asset = trade.asset || signal?.asset || getCurrentAssetLabel();
      trade.tf = trade.tf || trade.expiry || signal?.expiry || '';
      trade.direction = trade.direction || signal?.direction || '';
      trade.expirySec = Number.isFinite(trade.expiryMs) ? Math.round(trade.expiryMs / 1000) : null;
      trade.tradeKey = `${trade.asset}|${trade.tf}|${trade.direction}|${trade.clickedAt}`;
      trade.uiExpirySecondsAtOpen = readUiRemainingSeconds();
      trade.uiExpiryReadAtMs = Date.now();
      if (Number.isFinite(trade.uiExpirySecondsAtOpen)) trade.uiExpectedEndMs = trade.uiExpiryReadAtMs + trade.uiExpirySecondsAtOpen * 1000 + 1000;
      trade.settleAttempts = 0;
      trade.lastSettleTryAt = 0;
      trade.recheckAttempts = 0;
      trade.exclusiveSession = true;
      trade.noNoiseSession = true;
      trade.entryContext = entryContext || trade.entryContext || null;
      trade.settleWindowStart = null;
      trade.settleWindowEnd = null;
      markOtherTradesNonExclusive();
    }

    function enqueueExecutionCandidate(candidate) {
      S.executionQueue = Array.isArray(S.executionQueue) ? S.executionQueue : [];
      const cycleId = Number(candidate?.scanCycleId || candidate?.signal?.scanCycleId || 0);
      if (cycleId) {
        const alreadyQueued = S.executionQueue.some((q) => Number(q?.scanCycleId || q?.signal?.scanCycleId || 0) === cycleId);
        if (alreadyQueued) return false;
      }
      const maxLen = Math.max(1, Number(S.maxExecutionQueueLen || 3));
      const threshold = Number(candidate?.score?.threshold || candidate?.decision?.scoreCard?.threshold || 0);
      const points = Number(candidate?.score?.points || candidate?.points || 0);
      const isStrict = points >= (threshold + 1);
      if (S.executionQueue.length > 3 && !isStrict) {
        logConsoleLine('BACKPRESSURE_DROP');
        return false;
      }
      if (S.executionQueue.length > 3 && isStrict) logConsoleLine('BACKPRESSURE_STRICT_ENQUEUE');
      if (S.executionQueue.length >= maxLen && !isStrict) {
        logConsoleLine(`[EXEC QUEUE] DROP: queue backpressure (${S.executionQueue.length}/${maxLen})`);
        return false;
      }
      S.executionQueue.push(candidate);
      S.queueMetrics.queueLen = S.executionQueue.length;
      S.metrics.queueLen = S.queueMetrics.queueLen;
      return true;
    }

    function mapTfToExpirySec(tfKey = '') {
      const k = String(tfKey || '').toLowerCase();
      if (k === '1m') return 60;
      if (k === '3m') return 180;
      if (k === '5m') return 300;
      if (k === '15m') return 900;
      return null;
    }

    function mapTfToExpiryLabel(tfKey = '') {
      const sec = mapTfToExpirySec(tfKey);
      if (sec === 60) return '1M';
      if (sec === 180) return '3M';
      if (sec === 300) return '5M';
      if (sec === 900) return '15M';
      return null;
    }

    function isCandidateEntryWindowValid(candidate) {
      if (!candidate) return false;
      const now = Date.now();
      if (Number.isFinite(candidate.validUntilMs) && now > candidate.validUntilMs) return false;
      const tfKey = String(candidate?.tf || candidate?.decision?.tfKey || '').toLowerCase();
      const windowMs = Number(candidate?.decision?.windowMs || SNIPER_TF_MS[tfKey] || 0);
      if (!windowMs) return true;
      const timing = computeEntryTiming(tfKey, windowMs, now);
      if (!timing.entryWindowOk) return false;
      return true;
    }


    function readCurrentExpirySecFromUI() {
      const sec = readDynamicExpirySeconds();
      if (Number.isFinite(sec) && sec >= 0) return Math.round(sec);
      return NaN;
    }

    async function setExpiryInUI(targetExpirySec) {
      const sec = Math.max(0, Math.round(Number(targetExpirySec) || 0));
      if (sec > 300) return false;
      const opened = await iaaOpenExpiryMenu(getExpiryScopeFromAsset(getCurrentAssetLabel()));
      if (!opened) return false;
      return !!(await setDynamicExpiryTime(sec));
    }

    function resolveTargetExpirySecForSignal(signal, fallbackExpiry) {
      const tfKey = String(signal?.tfKey || signal?.expiry || fallbackExpiry || '').toLowerCase();
      const mapped = mapTfToExpirySec(tfKey);
      if (Number.isFinite(mapped)) return mapped;
      const byExpiry = secsFromTF(signal?.expiry || fallbackExpiry || '1M');
      return Number.isFinite(byExpiry) ? Math.round(byExpiry) : 60;
    }

    async function enforceConfirmedExpiryBeforeTrade(signal, targetExpirySec) {
      const target = Math.round(Number(targetExpirySec) || 0);
      if (!Number.isFinite(target) || target <= 0) return { ok: false, reason: 'NO_EXPIRY_UI' };
      if (getDynamicMode() === 'off' && target > 300) return { ok: false, reason: 'EXPIRY_TOO_LONG' };
      const expiryKey = target === 60 ? '1M' : (target === 180 ? '3M' : (target === 300 ? '5M' : null));
      if (!expiryKey) return { ok: false, reason: 'EXPIRY_TOO_LONG' };
      const ensured = await ensurePlatformExpiry(expiryKey);
      if (!ensured) return { ok: false, reason: 'NO_EXPIRY_UI' };
      await delay(120);
      const current = readCurrentExpirySecFromUI();
      if (!Number.isFinite(current)) return { ok: false, reason: 'NO_EXPIRY_UI' };
      if (Math.abs(current - target) > 1) {
        return { ok: false, reason: `EXPIRY_MISMATCH want=${target} got=${current}`, current, target };
      }
      return { ok: true, current, target };
    }

    function verifyExpiryMatchNow(targetSec) {
      const current = readCurrentExpirySecFromUI();
      if (!Number.isFinite(current)) return { ok: false, reason: 'NO_EXPIRY_UI' };
      if (Math.abs(Number(current) - Number(targetSec)) > 1) return { ok: false, reason: `EXPIRY_MISMATCH want=${targetSec} got=${current}`, current };
      return { ok: true, current };
    }

    async function runExecutionQueueWorker() {
      if (!S.running || S.execWorkerBusy) return;
      const q = Array.isArray(S.executionQueue) ? S.executionQueue : [];
      S.queueMetrics.queueLen = q.length;
      if (!q.length) return;
      const candidate = q.shift();
      S.queueMetrics.queueLen = q.length;
      if (!candidate || !candidate.signal) return;
      if (!isCandidateEntryWindowValid(candidate)) {
        logConsoleLine(`[EXEC] EXPIRED(EXEC_DELAY) tf=${candidate?.tf || candidate?.decision?.tfKey || 'n/a'} createdAt=${Number(candidate?.createdAtMs||0)} validUntil=${Number(candidate?.validUntilMs||0)} now=${Date.now()}`);
        return;
      }
      if (String(candidate?.gates?.verdict || '') !== 'PASS') return;
      if (Number(candidate?.score?.points || 0) < Number(candidate?.score?.threshold || 0)) return;
      S.execWorkerBusy = true;
      const started = Date.now();
      try {
        const tfLabel = String(candidate?.tf || candidate?.decision?.tfKey || "").toLowerCase();
        const mappedExpiry = mapTfToExpiryLabel(tfLabel);
        const mappedSec = mapTfToExpirySec(tfLabel);
        if (mappedExpiry) candidate.signal.expiry = mappedExpiry;
        if (Number.isFinite(mappedSec)) candidate.signal.expirySec = mappedSec;
        await executeTradeOrder(candidate.signal);
      } finally {
        const dt = Date.now() - started;
        const n = (S.queueMetrics._execN || 0) + 1;
        S.queueMetrics._execN = n;
        S.queueMetrics.avgExecMs = ((S.queueMetrics.avgExecMs || 0) * (n - 1) + dt) / n;
        S.metrics.avgExecMs = S.queueMetrics.avgExecMs;
        S.execWorkerBusy = false;
      }
    }

    async function executeTradeOrder(signal) {
      if (S.executing) return false;
      if (S.tradeMutex?.active) return false;
      if (!canOpenAnotherTrade()) {
        setSkipReason('MaxOpen');
        return false;
      }
      const execKey = signalExecKey(signal);
      const nowExec = Date.now();
      if (nowExec < Number(S.tradeLockUntil || 0)) { if (canEmitRateLimitedLog('exec_skip_trade_lock', 2000)) logConsoleLine('[EXEC_SKIP] reason=TRADE_LOCK'); return false; }
      const scanCycleId = Number(signal?.scanCycleId || S.scanCycleId || 0);
      if (scanCycleId && Number(S.lastTradeAttemptCycleId || 0) === scanCycleId) { if (canEmitRateLimitedLog('exec_skip_trade_lock_cycle', 2000)) logConsoleLine('[EXEC_SKIP] reason=TRADE_LOCK'); return false; }
      let rateSlot = null;
      const tfForKey = String(signal?.tfKey || signal?.expiry || 'na').toLowerCase();
      const candleStartForKey = Number(signal?.entryMeta?.candleStartMs || signal?.candleStartMs || 0);
      const dedupeKey = `${String(signal?.asset || getCurrentAssetLabel() || '—')}|${String(signal?.direction || '').toUpperCase()}|${tfForKey}|${candleStartForKey || 'na'}`;
      if (String(S.lastTradeSignalKey || '') === dedupeKey && (nowExec - Number(S.lastTradeSignalAt || 0)) < 120000) { if (canEmitRateLimitedLog(`exec_dup_${tfForKey}`, 2500)) logConsoleLine(`[EXEC_SKIP] reason=DUP_SIGNAL key=${dedupeKey}`); return false; }
      if (!isSniperMode() && S.lastExecutedKey === execKey && nowExec < Number(S.tradeLockUntil || 0)) return false;
      if (!S.baseAmount) {
        setSkipReason('Amount');
        return false;
      }
      const enforceAnalysis = !isSniperMode() && S.analysisEnabled;
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
      S.tradeLockUntil = Date.now() + 2500;
      S.lastTradeAttemptCycleId = scanCycleId || Date.now();
      S.executing = true;
      S.executionAttempts = 1;
      S.executionStartTime = Date.now();
      const mutexId = `m-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      S.tradeMutex = { active: true, id: mutexId, startedAt: Date.now() };

      let resolvedExpiry = normalizeExpiry(signal.expiry) || S.expirySetting;
      const targetExpirySec = resolveTargetExpirySecForSignal(signal, resolvedExpiry);
      const preflight = await enforceConfirmedExpiryBeforeTrade(signal, targetExpirySec);
      if (!preflight.ok) {
        const why = String(preflight.reason || 'EXPIRY_FAIL');
        if (why.startsWith('EXPIRY_MISMATCH')) {
          logConsoleLine(`[SKIP] EXPIRY_MISMATCH want=${targetExpirySec} got=${Number(preflight.current || readCurrentExpirySecFromUI() || 'NaN')}`);
          recordGateBlockers(signal?.tfKey || signal?.expiry || 'na', ['EntryTimingGate'], { EntryTimingGate: why });
        } else if (why === 'EXPIRY_TOO_LONG') {
          logConsoleLine('[SKIP] EXPIRY_TOO_LONG');
          recordGateBlockers(signal?.tfKey || signal?.expiry || 'na', ['EntryTimingGate'], { EntryTimingGate: 'EXPIRY_TOO_LONG' });
        }
        if (canEmitRateLimitedLog(`exec_abort_${why.slice(0,40)}`, 2500)) logConsoleLine(`[EXEC_ABORT] reason=${why}`);
        return false;
      }
      rateSlot = tryConsumeTradeRateSlot();
      if (!rateSlot.ok) {
        setSkipReason('MaxRate');
        return false;
      }
      const inferredTf = String(signal?.expiry || '').toLowerCase();
      const assetScope = getExpiryScopeFromAsset(signal.asset);
      const useDynamicExpiry = shouldUseDynamicExpiry(signal, assetScope);
      const entryContext = buildEntryContext(signal, resolvedExpiry);
      const confidenceLabel = getExecutionConfidenceLabel(signal);
      if (signal?.strategyKey) {
        S.lastStrategyKey = signal.strategyKey;
      }

      try {
        S.engineState = 'PREP_UI';
        logConsoleLine(`[EXEC] CLICK asset=${signal.asset || getCurrentAssetLabel() || '—'} tf=${String(signal?.expiry || signal?.tf || 'n/a').toLowerCase()} expirySec=${Number(signal?.expirySec || secsFromTF(resolvedExpiry) || 0)}`);
        if (!useDynamicExpiry || assetScope !== 'OTC') {
          const expiryOk = await withTimeout(() => ensurePlatformExpiry(resolvedExpiry), Number(S.uiExpiryTimeoutMs || 2200), 'настройка на expiry');
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
          ? getDynamicExpiryPlan(signal.expiry || resolvedExpiry, S.analysisConfidence, assetScope, { signal })
          : null;
        if (S.dynamicStakeScaleEnabled && !Number.isFinite(signal?.overrideAmountCents)) {
          const pts = Number(signal?.entryMeta?.scoreCard?.points || 0);
          const simWr = Number(dynamicPlanPreview?.best?.stats?.winrate || 0);
          const simSamples = Number(dynamicPlanPreview?.best?.stats?.samples || 0);
          if (pts >= 9) { stakeMultiplier += Number(S.dynamicStakeMult9 || 0.30); stakeReasonBg = '9/9'; }
          else if (pts >= 8) { stakeMultiplier += Number(S.dynamicStakeMult8 || 0.15); stakeReasonBg = '8/9'; }
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
        const shouldBurst = false;
        const baseBurst = 1;
        const burstCount = 1;
        const payoutPercent = getCurrentPayoutPercent();

        let dynamicApplied = false;
        if (useDynamicExpiry && assetScope === 'OTC') {
          const plan = getDynamicExpiryPlan(signal.expiry || resolvedExpiry, S.analysisConfidence, assetScope, { signal });
          dynamicPlanUsed = plan;
          if (!plan.seconds.length) {
            if (plan.noTrade) {
              setSkipReason('Dynamic no edge');
              logConsoleLine('[DYNAMIC SIM] Няма edge → пропуск.');
              return false;
            }
            if (plan.fallbackFixed) {
              const expiryOk = await withTimeout(() => ensurePlatformExpiry(resolvedExpiry), Number(S.uiExpiryTimeoutMs || 2200), 'настройка на expiry');
              if (!expiryOk) {
                setSkipReason('Expiry');
                return false;
              }
              logConsoleLine('[DYNAMIC SIM] Fallback към фиксирано време.');
            } else {
              setSkipReason('Dynamic no edge');
              logConsoleLine('[DYNAMIC SIM] Няма edge → no-trade.');
              return false;
            }
          }
          if (assetScope === 'OTC') {
            const opened = await iaaOpenExpiryMenu(assetScope);
            if (!opened) {
              setSkipReason('Expiry');
              return false;
            }
            if (!plan.seconds.length) return false;

            for (const seconds of plan.seconds.slice(0, 1)) {
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
              const verifyDyn = verifyExpiryMatchNow(finalSeconds);
              if (!verifyDyn.ok) {
                logConsoleLine(`[SKIP] EXPIRY_MISMATCH want=${finalSeconds} got=${Number(verifyDyn.current || 'NaN')}`);
                recordGateBlockers(signal?.tfKey || signal?.expiry || 'na', ['EntryTimingGate'], { EntryTimingGate: String(verifyDyn.reason || 'EXPIRY_MISMATCH') });
                return false;
              }
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
              source: isSniperMode() ? 'sniper' : 'signal',
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


              attachTradeBaseline(trade, signal, entryContext);
          S.activeTrades.push(trade);
              S.pendingTradeConfirmations.push({ trade, at: Date.now() });
          refreshUI('trade_placed');
              dynamicApplied = true;
              {
                const clickMessage = formatStatus('trade_clicked', { direction: dir.toUpperCase(), amount: `$${(amountCents / 100).toFixed(2)}` });
                logConsoleLine(confidenceLabel ? `${clickMessage} | ${confidenceLabel}` : clickMessage);
              }
              await delay(140);
            }
            if (dynamicApplied && plan.best?.breakdown) {
              const b = plan.best.breakdown;
              logConsoleLine(`[DYNAMIC SIM] ${plan.best.seconds}s | score=${(b.total * 100).toFixed(1)}% | WR=${((b.winrate || 0) * 100).toFixed(1)}% | chop-${((b.penaltyChop || 0) * 100).toFixed(1)} late-${((b.penaltyLate || 0) * 100).toFixed(1)}`);
            }
          } else {
            if (!plan.expiries.length) return false;
            for (const expiry of plan.expiries.slice(0, 1)) {
              const expiryOk = await withTimeout(() => ensurePlatformExpiry(expiry), Number(S.uiExpiryTimeoutMs || 2200), 'настройка на expiry');
              if (!expiryOk) {
                setSkipReason('Expiry');
                return false;
              }
              const targetPlanSec = secsFromTF(expiry);
              const verifyPlan = verifyExpiryMatchNow(targetPlanSec);
              if (!verifyPlan.ok) {
                logConsoleLine(`[SKIP] EXPIRY_MISMATCH want=${targetPlanSec} got=${Number(verifyPlan.current || 'NaN')}`);
                recordGateBlockers(signal?.tfKey || signal?.expiry || 'na', ['EntryTimingGate'], { EntryTimingGate: String(verifyPlan.reason || 'EXPIRY_MISMATCH') });
                return false;
              }
              logConsoleLine(formatStatus('trade_attempt', {
                asset: signal.asset,
                direction: signal.direction.toUpperCase(),
                expiry
              }));
              const clickTarget = (dir === 'buy' || dir === 'call' || dir === 'up') ? up : dn;
              if (!clickTarget) return false;
              const verifyPlanBeforeClick = verifyExpiryMatchNow(secsFromTF(expiry));
              if (!verifyPlanBeforeClick.ok) {
                logConsoleLine(`[SKIP] EXPIRY_MISMATCH want=${secsFromTF(expiry)} got=${Number(verifyPlanBeforeClick.current || 'NaN')}`);
                recordGateBlockers(signal?.tfKey || signal?.expiry || 'na', ['EntryTimingGate'], { EntryTimingGate: String(verifyPlanBeforeClick.reason || 'EXPIRY_MISMATCH') });
                return false;
              }
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
                source: isSniperMode() ? 'sniper' : 'signal',
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
              attachTradeBaseline(trade, signal, entryContext);
          S.activeTrades.push(trade);
              S.pendingTradeConfirmations.push({ trade, at: Date.now() });
          refreshUI('trade_placed');
              {
                const clickMessage = formatStatus('trade_clicked', { direction: dir.toUpperCase(), amount: `$${(amountCents / 100).toFixed(2)}` });
                logConsoleLine(confidenceLabel ? `${clickMessage} | ${confidenceLabel}` : clickMessage);
              }
              await delay(140);
            }
          }
        } else {
          logConsoleLine(formatStatus('trade_attempt', { asset: signal.asset, direction: signal.direction.toUpperCase(), expiry: resolvedExpiry }));
          logConsoleLine(`[EXEC] CLICK asset=${signal.asset || getCurrentAssetLabel() || '—'} tf=${String(signal?.tfKey || signal?.entryMeta?.strategyKey || signal?.rawText || '').toString()} expirySec=${Number(secsFromTF(resolvedExpiry) || signal?.expirySec || 0)}`);
          const verifyStatic = verifyExpiryMatchNow(secsFromTF(resolvedExpiry));
          if (!verifyStatic.ok) {
            logConsoleLine(`[SKIP] EXPIRY_MISMATCH want=${secsFromTF(resolvedExpiry)} got=${Number(verifyStatic.current || 'NaN')}`);
            recordGateBlockers(signal?.tfKey || signal?.expiry || 'na', ['EntryTimingGate'], { EntryTimingGate: String(verifyStatic.reason || 'EXPIRY_MISMATCH') });
            return false;
          }
          let clicked = false;
          if ((dir === 'buy' || dir === 'call' || dir === 'up') && up) {
            simulateClick(up);
            clicked = true;
          } else if ((dir === 'sell' || dir === 'put' || dir === 'down') && dn) {
            simulateClick(dn);
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
            source: isSniperMode() ? 'sniper' : 'signal',
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
          attachTradeBaseline(trade, signal, entryContext);
          S.activeTrades.push(trade);
          S.pendingTradeConfirmations.push({ trade, at: Date.now() });
          refreshUI('trade_placed');
          {
            const clickMessage = formatStatus('trade_clicked', { direction: dir.toUpperCase(), amount: `$${(amountCents / 100).toFixed(2)}` });
            logConsoleLine(confidenceLabel ? `${clickMessage} | ${confidenceLabel}` : clickMessage);
          }
        }

        if (!isSniperMode()) {
          S.tradeLockUntil = Date.now() + 2500;
        }
        if (!isSniperMode()) {
          const intervalMin = getActiveTradeIntervalMin();
          S.nextTradeAllowedAt = Date.now() + intervalMin * 60 * 1000;
        }
        S.lastTradeTime = Date.now();
        S.tradeCount++;
        S.lastExecutedKey = execKey;
        S.lastTradeSignalKey = dedupeKey;
        S.lastTradeSignalAt = Date.now();
        S.finalizedTradeId = null;

        // Update UI to show trade executed
        setUIState('EXECUTING', { cycleStep: S.cycleStep });

        S.engineState = 'CONFIRM';
        return true;
      } catch (error) {
        rollbackTradeRateSlot(rateSlot?.token);
        if (String(error?.message || '').startsWith('timeout:')) {
          logConsoleLine(`[EXEC] Твърд стоп: UI timeout (${String(error.message).replace('timeout:', '')})`);
          setSkipReason('UI timeout');
        }
        return false;
      } finally {
        if (!S.engineState || S.engineState !== 'CONFIRM') rollbackTradeRateSlot(rateSlot?.token);
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

    function getTradeToleranceCents(trade) {
      const stakeCents = Number(trade?.stakeCents || trade?.totalAmountCents || trade?.amountCents || 0);
      return Math.max(5, Math.round(stakeCents * 0.05));
    }

    function getTradeExpectedValues(trade) {
      const stakeCents = Number(trade?.stakeCents || trade?.totalAmountCents || trade?.amountCents || 0);
      const payoutPct = Number.isFinite(trade?.payoutPercentSnapshot) ? trade.payoutPercentSnapshot : Number(trade?.payoutPercent || 0);
      const expectedProfitCents = payoutPct > 0 ? Math.floor(stakeCents * (payoutPct / 100)) : null;
      const expectedGrossCents = Number.isFinite(expectedProfitCents) ? stakeCents + expectedProfitCents : null;
      return { stakeCents, expectedProfitCents, expectedGrossCents };
    }

    function buildTradeSettleWindow(trade) {
      const expectedEnd = Number(trade?.expectedEnd || 0);
      let start = expectedEnd - 2000;
      let end = expectedEnd + 25000;
      let widenLevel = 0;
      const lagSec = Number(S.lastSignalLagSec || 0);
      const isOtc = /otc/i.test(String(trade?.asset || ''));
      if (lagSec >= 3 || isOtc || (trade?.openConfirmedAt && Math.abs(trade.openConfirmedAt - trade.clickedAt) > 2000)) {
        end += 10000;
        widenLevel = 1;
      }
      if ((lagSec >= 5 || isOtc) && (S.activeTrades || []).length <= 1) {
        end += 20000;
        widenLevel = 2;
      }
      trade.settleWindowStart = start;
      trade.settleWindowEnd = end;
      trade.settleWindowUsed = { start, end, widenLevel };
      return trade.settleWindowUsed;
    }

    function findBestBalanceEventForTrade(trade) {
      const evs = Array.isArray(S.balanceEvents) ? S.balanceEvents : [];
      const settleStart = Number(trade?.settleWindowStart || 0);
      const settleEnd = Number(trade?.settleWindowEnd || 0);
      const { expectedProfitCents, expectedGrossCents } = getTradeExpectedValues(trade);
      const tol = getTradeToleranceCents(trade);
      let candidate = null;

      for (const e of evs) {
        if (!e || e.used || e.type !== 'CREDIT') continue;
        if (e.t < settleStart) continue;
        if (settleEnd && e.t > settleEnd) continue;
        if (Number.isFinite(trade?.linkedDebitSeq) && Number(e.seq || 0) <= Number(trade.linkedDebitSeq || 0)) continue;
        if (!Number.isFinite(trade?.linkedDebitSeq) && Number.isFinite(trade?.debitDetectedAt) && e.t <= trade.debitDetectedAt) continue;
        const credit = Number(e.deltaCents || 0);
        const passGross = Number.isFinite(expectedGrossCents) && Math.abs(credit - expectedGrossCents) <= tol;
        const passProfit = Number.isFinite(expectedProfitCents) && Math.abs(credit - expectedProfitCents) <= tol;
        if (!passGross && !passProfit) continue;
        candidate = e;
        break;
      }
      return candidate;
    }

    function resolveLedgerProfitCents(trade, creditCents) {
      const { stakeCents, expectedProfitCents, expectedGrossCents } = getTradeExpectedValues(trade);
      const credit = Number(creditCents || 0);
      const tol = getTradeToleranceCents(trade);
      if (!Number.isFinite(credit) || credit <= 0) return { profitCents: -Math.max(0, stakeCents), mode: 'invalid_credit' };
      if (Number.isFinite(expectedGrossCents) && Math.abs(credit - expectedGrossCents) <= tol) {
        return { profitCents: credit - stakeCents, mode: 'gross_credit' };
      }
      if (Number.isFinite(expectedProfitCents) && Math.abs(credit - expectedProfitCents) <= tol) {
        return { profitCents: credit, mode: 'profit_credit' };
      }
      return { profitCents: NaN, mode: 'credit_mismatch' };
    }

    function detectOutcomeByResultDelta(trade, epsilonCents = 3) {
      if (!trade || !trade.exclusiveSession || !trade.noNoiseSession || (S.activeTrades || []).length > 1) return null;
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

    async function readStableBalanceCents() {
      const samples = [];
      const delays = [0, 250, 500];
      for (const ms of delays) {
        if (ms > 0) await sleep(ms);
        const v = readBalanceCents();
        if (Number.isFinite(v)) samples.push(v);
      }
      if (!samples.length) return null;
      const sorted = samples.slice().sort((a,b)=>a-b);
      return sorted[Math.floor(sorted.length/2)];
    }

    function finalizeTradeOutcome(trade, outcome, profitCents, settledAt = Date.now(), method = '', evidence = null) {
      if (!trade || !outcome) return;
      if (trade.outcomeChecked) return;
      trade.outcomeChecked = true;
      trade.state = outcome === 'UNRESOLVED' ? 'UNRESOLVED' : 'SETTLED';
      trade.outcome = outcome;
      trade.settledAt = settledAt;
      trade.profitCents = profitCents;
      trade.outcomeMethod = method || trade.outcomeMethod || 'UNKNOWN';
      trade.evidence = evidence || null;

      logConsoleLine(`[SETTLE] ${trade.outcome} via ${trade.outcomeMethod} | evidence=${JSON.stringify(trade.evidence || {})}`);

      const sess = _sessionEnsure();
      const entry = sessionRecordTrade(trade, outcome, profitCents);
      sess.settledTrades = Array.isArray(sess.settledTrades) ? sess.settledTrades : [];
      sess.unresolvedTrades = Array.isArray(sess.unresolvedTrades) ? sess.unresolvedTrades : [];
      sess.stats = (sess.stats && typeof sess.stats === 'object') ? sess.stats : { wins: 0, losses: 0, pnlCents: 0, unresolved: 0 };
      const normalizedOutcome =
        entry.outcome === 'ПЕЧАЛБИ' ? 'WIN' :
        entry.outcome === 'ЗАГУБИ' ? 'LOSS' :
        entry.outcome;
      if (normalizedOutcome === 'UNRESOLVED') {
        sess.unresolvedTrades.push(entry);
        sess.stats.unresolved = Number(sess.stats.unresolved || 0) + 1;
      } else {
        sess.settledTrades.push(entry);
        if (normalizedOutcome === 'WIN') sess.stats.wins = Number(sess.stats.wins || 0) + 1;
        if (normalizedOutcome === 'LOSS') sess.stats.losses = Number(sess.stats.losses || 0) + 1;
        if (Number.isFinite(entry.profitCents)) sess.stats.pnlCents = Number(sess.stats.pnlCents || 0) + Number(entry.profitCents || 0);
      }
      if (entry.tradeId) sess.tradeIds[entry.tradeId] = true;
      const key = entry.strategyKey || '—';
      if (!sess.strategies[key]) sess.strategies[key] = { trades: 0, wins: 0, losses: 0, neutral: 0, pnlCents: 0, confSum: 0, confN: 0 };
      const st = sess.strategies[key];
      st.trades += 1;
      if (normalizedOutcome === 'WIN') st.wins += 1;
      else if (normalizedOutcome === 'LOSS') st.losses += 1;
      else st.neutral += 1;
      if (Number.isFinite(entry.profitCents)) st.pnlCents += entry.profitCents;
      if (Number.isFinite(entry.confidence)) { st.confSum += entry.confidence; st.confN += 1; }

      if (outcome === 'UNRESOLVED') {
        S.unresolvedTrades = (S.unresolvedTrades || 0) + 1;
        S.unresolvedStreak = (S.unresolvedStreak || 0) + 1;
        if ((S.unresolvedStreak || 0) >= 3 && S.running) {
          S.running = false;
          stopEngineLoops();
          logConsoleLine('[RISK] Пауза: UNRESOLVED streak >= 3');
        }

      } else {
        S.unresolvedStreak = 0;
        recordTradeOutcomeStats(trade, outcome, profitCents);
        recordTradeHistoryEntry(trade, outcome, profitCents);

        recordTradeOutcomeForRisk(outcome, profitCents);
        applyRiskLimits();
      }
      try { logTradeOutcome(trade, outcome, profitCents); } catch (e) { console.warn('[IAA] logTradeOutcome failed', e); }
      refreshUI('trade_finalized');
    }

    async function confirmTradeByBalance(trade, clickedAt) {
      const stakeCents = Math.max(0, Number(trade?.stakeCents || 0));
      if (!Number.isFinite(trade.balanceBeforeClickCents)) trade.balanceBeforeClickCents = readBalanceCents();
      const before = trade.balanceBeforeClickCents;
      if (!Number.isFinite(before) || stakeCents <= 0) {
        trade.openConfirmed = false;
        trade.openConfirmedBy = 'NO_BASELINE_OR_STAKE';
        return false;
      }

      const checks = [0, 300, 700, 1200];
      const toleranceCents = Math.max(2, Math.round(stakeCents * 0.03));
      const minDebit = Math.max(0, stakeCents - toleranceCents);
      for (const ms of checks) {
        if (ms > 0) await sleep(ms);
        const now = readBalanceCents();
        const debit = Number.isFinite(now) ? (before - now) : NaN;
        if (Number.isFinite(debit) && debit >= minDebit) {
          trade.openConfirmed = true;
          trade.state = 'OPEN_CONFIRMED';
          trade.openConfirmedAt = Date.now();
          trade.debitDetectedAt = Date.now();
          trade.debitAmountCents = debit;
          trade.openConfirmedBy = 'BALANCE_DELTA_TOLERANT';
          trade.balanceAfterOpen = now;
          trade.openAt = clickedAt || Date.now();
          const evs = Array.isArray(S.balanceEvents) ? S.balanceEvents : [];
          for (let i = evs.length - 1; i >= 0; i -= 1) {
            const ev = evs[i];
            if (ev && ev.type === 'DEBIT' && ev.t >= Number(clickedAt || trade.clickedAt || 0) - 2000) {
              trade.linkedDebitSeq = ev.seq;
              break;
            }
          }
          return true;
        }
      }

      trade.openConfirmed = false;
      trade.state = 'OPEN_UNCONFIRMED';
      trade.openConfirmedBy = 'BALANCE_DELTA_TIMEOUT';
      return false;
    }

    async function processPendingTradeConfirmations() {
      const pending = Array.isArray(S.pendingTradeConfirmations) ? S.pendingTradeConfirmations : [];
      if (!pending.length) return;

      const remaining = [];
      for (const item of pending) {
        if (!item || !item.trade) continue;
        if ((Date.now() - Number(item.at || 0)) > 3200) {
          item.trade.state = 'OPEN_UNCONFIRMED';
          continue;
        }
        const ok = await confirmTradeByBalance(item.trade, item.at);
        if (!ok) remaining.push(item);
      }
      S.pendingTradeConfirmations = remaining;
    }

    function runSettlementRegressionHarness() {
      if (!S.debugHarnessEnabled && !C.DEBUG) return [];
      const tests = [];
      const logTest = (name, pass) => logConsoleLine(`[HARNESS] ${pass ? 'PASS' : 'FAIL'} ${name}`);
      const mkTrade = (stake, payout) => ({ stakeCents: stake, payoutPercentSnapshot: payout, expectedProfitCents: Math.floor(stake * payout / 100), expectedGrossCents: stake + Math.floor(stake * payout / 100) });

      {
        const trade = mkTrade(100, 92);
        const out = resolveLedgerProfitCents(trade, 192);
        const pass = Number(out.profitCents) === 92;
        tests.push({ name: 'clean WIN gross credit', pass });
        logTest('clean WIN gross credit', pass);
      }
      {
        const tradeA = mkTrade(100, 92);
        tradeA.linkedDebitSeq = 10;
        tradeA.settleWindowStart = 0;
        tradeA.settleWindowEnd = Date.now() + 5000;
        S.balanceEvents = [
          { seq: 9, t: Date.now(), deltaCents: 192, type: 'CREDIT', used: false },
          { seq: 11, t: Date.now() + 10, deltaCents: 192, type: 'CREDIT', used: false }
        ];
        const ev = findBestBalanceEventForTrade(tradeA);
        const pass = Number(ev?.seq) === 11;
        tests.push({ name: 'overlap seq pairing', pass });
        logTest('overlap seq pairing', pass);
      }
      {
        const trade = mkTrade(100, 92);
        const out = resolveLedgerProfitCents(trade, 96);
        const pass = !Number.isFinite(out.profitCents);
        tests.push({ name: 'mismatch credit unresolved', pass });
        logTest('mismatch credit unresolved', pass);
      }
      return tests;
    }

    function readUiRemainingSeconds() {
      try {
        const nodes = Array.from(document.querySelectorAll('span, div'));
        for (const n of nodes) {
          const t = (n.textContent || '').trim();
          if (!t) continue;
          const mmss = t.match(/^(\d{1,2}):(\d{2})$/);
          if (mmss) return Number(mmss[1]) * 60 + Number(mmss[2]);
          const sec = t.match(/^(\d{1,4})\s*s(ec)?$/i);
          if (sec) return Number(sec[1]);
        }
      } catch {}
      return null;
    }

    function readUiExpirySecondsAtOpen() {
      return readUiRemainingSeconds();
    }

    function detectOutcomeFromClosedTradesHistory(trade) {
      try {
        const rows = Array.from(document.querySelectorAll('tr, .deal, .history-item')).slice(-40);
        const dir = String(trade?.direction || '').toUpperCase();
        for (let i = rows.length - 1; i >= 0; i -= 1) {
          const txt = (rows[i]?.innerText || '').replace(/\s+/g, ' ').trim();
          if (!txt) continue;
          if (dir && !txt.toUpperCase().includes(dir)) continue;
          if (/win|печалб|profit/i.test(txt)) return { outcome: 'ПЕЧАЛБИ', profitCents: Number(trade?.expectedProfitCents || 0), method: 'HISTORY_CLOSED_TRADES' };
          if (/loss|загуб/i.test(txt)) return { outcome: 'ЗАГУБИ', profitCents: -Math.abs(Number(trade?.stakeCents || 0)), method: 'HISTORY_CLOSED_TRADES' };
        }
      } catch {}
      return null;
    }

    async function finalizeActiveTrades() {
      if (!S.activeTrades || !S.activeTrades.length) return;

      const now = Date.now();
      const remaining = [];
      const tradesSorted = [...S.activeTrades].sort((a, b) => (a.expectedEnd || 0) - (b.expectedEnd || 0));

      for (const trade of tradesSorted) {
        if (!trade) continue;
        trade.settleAttempts = Number(trade.settleAttempts || 0);
        trade.lastSettleTryAt = now;
        if (!trade.state) trade.state = 'CREATED';
        if (trade.state === 'CREATED') trade.state = 'CLICKED';

        const expiryMs = trade.expiryMs || secsFromTF(trade.expiry) * 1000;
        const lagSec = Number(S.lastSignalLagSec || 0);
        const isOtcTrade = /otc/i.test(String(trade?.asset || ''));
        const driftBufferMs = (lagSec >= 3 || isOtcTrade) ? 4000 : 1500;
        const baseTs = Number(trade.openConfirmedAt || trade.clickedAt || trade.startTime || now);
        const computedExpectedEnd = baseTs + expiryMs + driftBufferMs;
        const uiExpectedEndMs = Number.isFinite(trade.uiExpirySecondsAtOpen) ? (Number(trade.uiExpiryReadAtMs || baseTs) + Number(trade.uiExpirySecondsAtOpen) * 1000) : null;
        trade.uiExpectedEndMs = Number.isFinite(uiExpectedEndMs) ? uiExpectedEndMs : null;
        trade.expectedEnd = Number.isFinite(uiExpectedEndMs) ? (uiExpectedEndMs + driftBufferMs) : computedExpectedEnd;
        trade.driftSec = Number.isFinite(uiExpectedEndMs) ? ((uiExpectedEndMs - computedExpectedEnd) / 1000) : null;
        if (!trade.openConfirmedAt && !trade.clickedAt) trade.expectedEndWarning = 'NO_OPEN_CONFIRM_OR_CLICK_TIME';
        const settleWindow = buildTradeSettleWindow(trade);

        if (now < settleWindow.start) {
          remaining.push(trade);
          continue;
        }

        trade.state = 'SETTLING';
        trade.settleAttempts += 1;

        const historyOutcome = detectOutcomeFromClosedTradesHistory(trade);
        if (historyOutcome) {
          finalizeTradeOutcome(trade, historyOutcome.outcome, historyOutcome.profitCents, now, historyOutcome.method, { source: 'history' });
          continue;
        }

        if (!trade.openConfirmed && !trade.confirmedAt) {
          await confirmTradeByBalance(trade, trade.clickedAt || trade.startTime);
        }

        const ev = findBestBalanceEventForTrade(trade);
        if (ev) {
          markBalanceEventUsed(ev);
          const resolved = resolveLedgerProfitCents(trade, ev.deltaCents);
          const profitCents = Number(resolved?.profitCents);
          if (Number(ev.deltaCents || 0) > 0 && profitCents < 0) {
            finalizeTradeOutcome(trade, 'UNRESOLVED', 0, ev.t, 'LEDGER_MISMATCH_POSITIVE_CREDIT', {
              matchedEvent: { seq: ev.seq, time: ev.t, delta: ev.deltaCents },
              expectedProfitCents: trade.expectedProfitCents,
              expectedGrossCents: trade.expectedGrossCents
            });
            continue;
          }
          if (!Number.isFinite(profitCents)) {
            remaining.push(trade);
            continue;
          }
          const outcome = profitCents > 0 ? 'ПЕЧАЛБИ' : (profitCents < 0 ? 'ЗАГУБИ' : 'EVEN');
          const stableBalance = trade.exclusiveSession ? await readStableBalanceCents() : null;
          const balanceDelta = Number.isFinite(stableBalance) && Number.isFinite(trade.balanceBeforeClickCents)
            ? (stableBalance - trade.balanceBeforeClickCents)
            : null;
          const method = (!trade.openConfirmed && !trade.confirmedAt) ? 'LEDGER_NO_OPEN_CONFIRM' : `BALANCE_LEDGER:${resolved?.mode || 'unknown'}`;
          finalizeTradeOutcome(trade, outcome, profitCents, ev.t, method, {
            matchedEvent: { seq: ev.seq, time: ev.t, delta: ev.deltaCents },
            baseline: trade.balanceBeforeClickCents,
            expectedGrossCents: trade.expectedGrossCents,
            expectedProfitCents: trade.expectedProfitCents,
            finalBalanceSnapshot: stableBalance,
            balanceDelta,
            computedProfitCents: profitCents,
            mismatch: !((Number.isFinite(trade.expectedGrossCents) && Math.abs(Number(ev.deltaCents || 0) - trade.expectedGrossCents) <= getTradeToleranceCents(trade)) || (Number.isFinite(trade.expectedProfitCents) && Math.abs(Number(ev.deltaCents || 0) - trade.expectedProfitCents) <= getTradeToleranceCents(trade)))
          });
          continue;
        }

        const deltaOutcome = detectOutcomeByResultDelta(trade);
        if (deltaOutcome && now >= trade.expectedEnd) {
          finalizeTradeOutcome(trade, deltaOutcome.outcome, deltaOutcome.profitCents, now, deltaOutcome.method, {
            baseline: trade.balanceBeforeClickCents,
            computedProfitCents: deltaOutcome.profitCents
          });
          continue;
        }

        if (Number.isFinite(trade.clickedAt) && now - trade.clickedAt > (expiryMs + 10000) && now <= settleWindow.end) {
          trade.settleWindowEnd += 10000;
          trade.driftWarning = 'DYNAMIC_DRIFT_WIDEN';
        }

        if (now > settleWindow.end) {
          const rechecks = Number(trade.recheckAttempts || 0);
          if (rechecks < 3) {
            trade.recheckAttempts = rechecks + 1;
            trade.settleWindowEnd += 7000;
            remaining.push(trade);
            continue;
          }
          finalizeTradeOutcome(trade, 'UNRESOLVED', 0, now, 'SETTLEMENT_TIMEOUT', {
            baseline: trade.balanceBeforeClickCents,
            expectedGrossCents: trade.expectedGrossCents,
            expectedProfitCents: trade.expectedProfitCents
          });
          continue;
        }

        remaining.push(trade);
      }

      S.activeTrades = remaining;
      refreshUI('legacy_direct_render_replaced');
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
document.addEventListener('keydown', (e) => {
  if (!e.shiftKey) return;
  if (e.code !== 'KeyW') return; // работи независимо от кирилица/латиница

  if (!S._calTarget) {
    logConsoleLine('Калибрация: избери таргет от панела (OPEN / 1m / 3m / 5m / 15m).');
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
    M1: ['1m', '01:00', '1:00', '1 min', '1мин', '1 minute', '01 мин'],
    M3: ['3m', '03:00', '3:00', '3 min', '3мин', '3 minutes', '03 мин'],
    M5: ['5m', '05:00', '5:00', '5 min', '5мин', '5 minutes', '05 мин'],
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
      if (n === '1M') return 'M1';
      if (n === '3M') return 'M3';
      if (n === '5M') return 'M5';
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

    function getDynamicExpiryPlan(expiry, confidence, scope, options = {}) {
      const signal = options.signal || {};
      const entryMeta = signal.entryMeta || {};
      const regimeState = String(entryMeta?.regime?.state || entryMeta?.regime || '').toLowerCase();
      const minSec = Math.max(5, Math.round(S.dynamicMinSec || 15));
      const maxSec = Math.max(minSec, Math.round(S.dynamicMaxSec || 300));
      const expiryStep = Math.max(1, Math.round(S.dynamicExpiryStepSec || 5));
      const minSamples = Math.max(5, Math.round(S.dynamicMinSamples || 40));
      const minWinrate = clamp01(S.dynamicMinWinrate ?? 0.55);
      const lookbackSec = Math.max(120, Math.round(S.dynamicLookbackSec || 600));
      const chopPenalty = Math.max(0, Number(S.dynamicChopPenalty || 0.03));
      const latePenalty = Math.max(0, Number(S.dynamicLatePenalty || 0.02));
      const timeInCandle = Number.isFinite(entryMeta?.timeInCandle) ? entryMeta.timeInCandle : null;
      const entryWindowSec = Number.isFinite(entryMeta?.entryWindowSec) ? entryMeta.entryWindowSec : null;
      const isLate = timeInCandle != null && entryWindowSec != null && timeInCandle > entryWindowSec;

      S.dynamicSimCache = S.dynamicSimCache || {};
      const cacheKey = [signal.asset || S.lastAssetLabel || '—', signal.direction || '—', regimeState || '—', minSec, maxSec, expiryStep, lookbackSec].join('|');
      const now = Date.now();
      if (S.dynamicSimCache[cacheKey] && now - (S.dynamicSimCache[cacheKey].at || 0) < 1000) {
        return S.dynamicSimCache[cacheKey].plan;
      }

      const scored = [];
      for (let sec = minSec; sec <= maxSec; sec += expiryStep) {
        const stats = simulateBinaryWinrate(signal.direction, sec, lookbackSec);
        if (stats.samples < minSamples) continue;
        let penalties = 0;
        if (regimeState === 'chop' || regimeState === 'volatility') penalties += chopPenalty;
        if (sec < 30 && regimeState !== 'trend') penalties += 0.02;
        if (isLate) penalties += latePenalty;
        const totalScore = stats.winrate - penalties;
        scored.push({
          seconds: sec,
          stats,
          breakdown: {
            total: totalScore,
            winrate: stats.winrate,
            penaltyChop: (regimeState === 'chop' || regimeState === 'volatility') ? chopPenalty : 0,
            penaltyLate: isLate ? latePenalty : 0
          }
        });
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
        ? { expiries: expiryLabelFromSeconds(chosenSec) ? [expiryLabelFromSeconds(chosenSec)] : [], seconds: [], best, scored }
        : { expiries: [], seconds: [chosenSec], best, scored };
      S.dynamicSimCache[cacheKey] = { at: now, plan };
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

      if (false && scope === 'OTC') {
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

    /* ========================= SNIPER ANALYSIS HELPERS ========================= */
    const SNIPER_TF_MS = {
      '1m': 60000,
      '3m': 180000,
      '5m': 300000,
      '15m': 900000
    };

    function getSniperTimeframes() {
      const enabled = Object.keys(SNIPER_TF_MS).filter(tf => S.sniperEnabledTimeframes[tf]);
      if (!enabled.length) {
        return Object.keys(SNIPER_TF_MS);
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

    function getTimeInCandleSec(windowMs, nowMs = Date.now()) {
      const timing = computeEntryTiming('', windowMs, nowMs);
      return timing.timeInCandleSec;
    }

    function getCandleStart(windowMs, nowMs = Date.now()) {
      const ms = Number(windowMs || 0);
      const now = Number(nowMs);
      if (!Number.isFinite(ms) || ms <= 0 || !Number.isFinite(now)) return NaN;
      return Math.floor(now / ms) * ms;
    }

    function isEarlyEntryEnabledForTf(tfKey) {
      const tf = String(tfKey || '').toLowerCase();
      if (tf === '1m') return Number(S.entryWindowSec1m || 0) > 0;
      if (tf === '3m') return Number(S.entryWindowSec3m || 0) > 0;
      if (tf === '5m') return Number(S.entryWindowSec5m || 0) > 0;
      if (tf === '15m') return false;
      return false;
    }

    function getEntryWindowLimitSec(tfKey, windowMs) {
      const key = String(tfKey || '').toLowerCase();
      const defaults = { '1m': 35, '3m': 90, '5m': 150, '15m': 120 };
      const byTf = {
        '1m': Number.isFinite(S.entryWindowSec1m) ? S.entryWindowSec1m : defaults['1m'],
        '3m': Number.isFinite(S.entryWindowSec3m) ? S.entryWindowSec3m : defaults['3m'],
        '5m': Number.isFinite(S.entryWindowSec5m) ? S.entryWindowSec5m : defaults['5m'],
        '15m': Number.isFinite(S.entryWindowSec15m) ? S.entryWindowSec15m : defaults['15m']
      };
      const baseLimit = Number(byTf[key] ?? 0);
      const cap = Math.floor(Math.max(0, Number(windowMs || 0)) / 1000);
      if (!Number.isFinite(baseLimit)) return 0;
      return Math.max(0, Math.min(cap, Math.round(baseLimit)));
    }

    function getLateToleranceSec(tfKey) {
      const tf = String(tfKey || '').toLowerCase();
      if (tf === '1m') return 10;
      if (tf === '3m') return 15;
      if (tf === '5m') return 20;
      return 0;
    }

    function markTfSyncPending(tfKey, nowMs = Date.now()) {
      const tf = String(tfKey || '').toLowerCase();
      const windowMs = Number(SNIPER_TF_MS[tf] || 0);
      if (!tf || !windowMs) return;
      const candleStartMs = getCandleStart(windowMs, nowMs);
      S.tfSync = S.tfSync || {};
      S.tfSync[tf] = { firstSeenCandleStartMs: candleStartMs, synced: false, loggedSyncWaitForCandleStartMs: null, loggedSyncedForCandleStartMs: null };
    }

    function computeEntryTiming(tfKey, windowMs, nowMs = Date.now(), signalCtx = null) {
      const tf = String(tfKey || '').toLowerCase();
      const now = Number(nowMs);
      const candleStartMs = getCandleStart(windowMs, now);
      let timeInCandleSec = Number.isFinite(now) && Number.isFinite(candleStartMs)
        ? (now - candleStartMs) / 1000
        : NaN;
      const earlyEntryEnabled = isEarlyEntryEnabledForTf(tf);
      let entryWindowLimitSec = getEntryWindowLimitSec(tf, windowMs);
      if (!Number.isFinite(entryWindowLimitSec)) entryWindowLimitSec = 0;
      const hasNaNTime = !Number.isFinite(timeInCandleSec);
      if (hasNaNTime) timeInCandleSec = 999999;

      S.tfSync = S.tfSync || {};
      let sync = S.tfSync[tf] || null;
      if (!sync && earlyEntryEnabled) {
        sync = { firstSeenCandleStartMs: candleStartMs, synced: false, loggedSyncWaitForCandleStartMs: null, loggedSyncedForCandleStartMs: null };
        S.tfSync[tf] = sync;
      }
      let syncWaitNextCandle = false;
      if (earlyEntryEnabled && sync && !sync.synced) {
        if (Number(sync.firstSeenCandleStartMs) === Number(candleStartMs)) {
          syncWaitNextCandle = true;
          if (Number(sync.loggedSyncWaitForCandleStartMs) !== Number(candleStartMs)) {
            sync.loggedSyncWaitForCandleStartMs = Number(candleStartMs);
          }
        } else {
          sync.synced = true;
          if (Number(sync.loggedSyncedForCandleStartMs) !== Number(candleStartMs)) {
            const tfUpper = String(tf || '').toUpperCase();
            if (shouldLogSyncEvent(tf, 'OK')) logConsoleLine(`[SYNC] TF=${tfUpper} OK (нова свещ)`);
            sync.loggedSyncedForCandleStartMs = Number(candleStartMs);
          }
        }
      }

      const eps = 1e-6;
      let lateBySec = Math.max(0, timeInCandleSec - entryWindowLimitSec);
      let lateButStrong = false;
      if (earlyEntryEnabled && !syncWaitNextCandle && !hasNaNTime && lateBySec > eps) {
        const tolerance = getLateToleranceSec(tf);
        const confMatched = Number(signalCtx?.confirmationMatched || 0) >= 7;
        const adxStrong = Number(signalCtx?.adx || 0) >= 25;
        const dom = Number(signalCtx?.dominance || 0);
        const domThr = Number(signalCtx?.dominanceThreshold || 0);
        const domStrong = Number.isFinite(dom) && Number.isFinite(domThr) && dom >= (domThr + 10);
        if (lateBySec <= tolerance && confMatched && adxStrong && domStrong) {
          lateButStrong = true;
          logConsoleLine(`[ENTRY_WIN] tf=${tf} късен вход +${Math.round(lateBySec)}s, но допуснат (силен сигнал)`);
        }
      }

      const entryWindowOk = !earlyEntryEnabled
        || syncWaitNextCandle
        || lateButStrong
        || (!hasNaNTime && (entryWindowLimitSec <= 0 || timeInCandleSec <= (entryWindowLimitSec + eps)));
      const reasonCode = !earlyEntryEnabled
        ? 'DISABLED_FOR_TF'
        : syncWaitNextCandle
          ? 'SYNC_WAIT_NEXT_CANDLE'
          : hasNaNTime
            ? 'NAN_TIME'
            : lateButStrong
              ? 'LATE_BUT_ALLOWED_STRONG'
              : (entryWindowOk ? 'PASS' : 'OUTSIDE_WINDOW');
      const reason = (reasonCode === 'DISABLED_FOR_TF') ? 'РАНЕН ВХОД ИЗКЛЮЧЕН ЗА TF'
        : (reasonCode === 'SYNC_WAIT_NEXT_CANDLE') ? 'СИНХР.: ЧАКАМ НОВА СВЕЩ'
          : (reasonCode === 'NAN_TIME') ? 'ГРЕШЕН ТАЙМИНГ (NaN)'
            : (reasonCode === 'LATE_BUT_ALLOWED_STRONG') ? 'КЪСЕН ВХОД, НО ДОПУСНАТ (силен сигнал)'
              : (entryWindowOk ? 'PASS' : `КЪСЕН ВХОД (${Math.round(timeInCandleSec)}>${Math.round(entryWindowLimitSec)})`);

      return {
        nowMs: now,
        candleStartMs,
        timeInCandleSec,
        entryWindowLimitSec,
        entryWindowOk,
        earlyEntryEnabled,
        syncWaitNextCandle,
        hasNaNTime,
        lateBySec,
        lateButStrong,
        reasonCode,
        reason,
        nanReason: hasNaNTime ? 'NAN_TIME' : null
      };
    }

    function applyTfEntrySync(tfKey, entryTiming) {
      const tf = String(tfKey || '').toLowerCase();
      if (!tf) return true;
      S.tfFirstSeenCandleStart = S.tfFirstSeenCandleStart || {};
      const seen = S.tfFirstSeenCandleStart[tf];
      const cur = Number(entryTiming?.candleStartMs);
      if (!Number.isFinite(cur)) return false;
      if (!seen) {
        S.tfFirstSeenCandleStart[tf] = { first: cur, synced: false };
        // sync log handled in computeEntryTiming
        return false;
      }
      if (!seen.synced) {
        if (cur === Number(seen.first)) return false;
        seen.synced = true;
      }
      return true;
    }

    function applyDirectionLock(tfKey, decision, scoreCard, killerSnapshotTf) {
      if (!decision?.direction) return decision;
      const tf = String(tfKey || '').toLowerCase();
      const now = Date.now();
      const lockMs = (tf === '1m') ? Number(S.tfDirLockMs1m || 8000)
        : (tf === '3m') ? Number(S.tfDirLockMs3m || 12000)
        : Number(S.tfDirLockMsDefault || 10000);
      S.tfDirectionMemory = S.tfDirectionMemory || {};
      const prev = S.tfDirectionMemory[tf];
      const conf = Number(decision.confidence || 0);
      const points = Number(scoreCard?.points || decision?.scoreCard?.points || 0);
      const threshold = Number(scoreCard?.threshold || decision?.scoreCard?.threshold || 0);
      const dom = Number(killerSnapshotTf?.dominance || 0);
      const domThr = Number(killerSnapshotTf?.dominanceThreshold || 0);
      if (prev && prev.dir && prev.dir !== decision.direction && (now - Number(prev.atMs || 0)) < lockMs) {
        const strongOverride = (conf >= Number(prev.conf || 0) + 0.10) || (points >= threshold + 1) || (dom >= domThr + 15);
        if (!strongOverride) {
          logConsoleLine(`[DIR_LOCK] tf=${tf} prev=${prev.dir} new=${decision.direction} reason=lock_ms override=false`);
          decision.direction = prev.dir;
          decision.confidence = Math.max(0, conf - 0.04);
        }
      }
      S.tfDirectionMemory[tf] = { dir: decision.direction, atMs: now, conf: Number(decision.confidence || 0) };
      return decision;
    }

    function applyDominanceHysteresis(snapshot) {
      if (!snapshot || !snapshot.direction) return snapshot;
      const delta = Math.max(0, Number(S.domHysteresisDelta || 10));
      const thr = Number(snapshot.dominanceThreshold || 0);
      const dom = Number(snapshot.dominance || 0);
      const dir = String(snapshot.direction || '');
      S.biasHysteresis = S.biasHysteresis || { dir: null, lastDomPct: 0 };
      const prevDir = S.biasHysteresis.dir;
      if (!prevDir) {
        S.biasHysteresis = { dir, lastDomPct: dom };
        return snapshot;
      }
      if (prevDir !== dir && dom < (thr + delta)) {
        if (String(getLogVerbosity()).toLowerCase() === 'detailed' && canEmitRateLimitedLog('dom_hys_keep', 30000)) logConsoleLine(`[DOM_HYS] keep=${prevDir} dom=${Math.round(dom)} thr=${Math.round(thr)} delta=${Math.round(delta)}`);
        snapshot.direction = prevDir;
        snapshot.passDominance = dom >= thr;
      } else if (prevDir !== dir && dom >= (thr + delta)) {
        if (String(getLogVerbosity()).toLowerCase() === 'detailed' && canEmitRateLimitedLog('dom_hys_flip', 30000)) logConsoleLine(`[DOM_HYS] flip ${prevDir}->${dir} dom=${Math.round(dom)} thr=${Math.round(thr)} delta=${Math.round(delta)}`);
        S.biasHysteresis = { dir, lastDomPct: dom };
      } else {
        S.biasHysteresis = { dir: prevDir, lastDomPct: dom };
      }
      return snapshot;
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

    

    function clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    }

    function mapChopUiPctToThreshold(uiPct) {
      const pct = clamp(Number(uiPct) || 1, 1, 100);
      const tMin = 0.001;
      const tMax = 0.03;
      const ratio = (pct - 1) / 99;
      return tMin + (tMax - tMin) * ratio;
    }

    function mapChopThresholdToUiPct(threshold) {
      const t = clamp(Number(threshold) || 0.001, 0.001, 0.03);
      const ratio = (t - 0.001) / (0.03 - 0.001);
      return Math.round(1 + ratio * 99);
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

    function computeKillerSnapshot(tf, decision, regime, confirmation, strategyDecisions = []) {
      if (!decision || !decision.direction) return null;
      const dir = decision.direction;
      const trendDir = decision.trendDir || calcTrendDirection(SNIPER_TF_MS[tf]);
      const candle = getCandleAt(Date.now(), SNIPER_TF_MS[tf]);
      const candleDir = candle ? (candle.close > candle.open ? 'BUY' : candle.close < candle.open ? 'SELL' : null) : null;
      const stoch = calcStochDecision(SNIPER_TF_MS[tf]);
      const momentum = Number.isFinite(decision.momentum) ? decision.momentum : 0;
      const adx = calcAdxProxy(regime, decision);

      const chopThreshold = Math.max(0, Number.isFinite(S.sniperChopThreshold) ? S.sniperChopThreshold : 0.7);
      const chopPass = Number.isFinite(decision.rangePct) ? decision.rangePct >= chopThreshold : true;

      const strategyEnabled = !!decision.strategyKey && isStrategyEnabled(decision.strategyKey);
      const strategyPoints = strategyEnabled ? (decision.strategyKey === 'candlestick_pattern' ? 1 : 2) : 0;

      const checks = [];
      checks.push({ key: 'STRAT', ok: strategyPoints > 0, points: strategyPoints, buy: strategyPoints > 0, sell: strategyPoints > 0 });

      const trdOk = !!decision.trendAligned;
      checks.push({ key: 'TRD', ok: trdOk, points: trdOk ? 1 : 0, buy: trdOk, sell: trdOk });

      const macdBuy = momentum > 0;
      const macdSell = momentum < 0;
      const macdOk = dir === 'BUY' ? macdBuy : macdSell;
      checks.push({ key: 'MACD', ok: macdOk, points: macdOk ? 1 : 0, buy: macdBuy, sell: macdSell });

      const stoBuy = stoch?.direction === 'BUY';
      const stoSell = stoch?.direction === 'SELL';
      const stoOk = dir === 'BUY' ? stoBuy : stoSell;
      checks.push({ key: 'STO', ok: stoOk, points: stoOk ? 1 : 0, buy: stoBuy, sell: stoSell });

      const volOk = !!decision.volumeOk;
      checks.push({ key: 'VOL', ok: volOk, points: volOk ? 1 : 0, buy: volOk, sell: volOk });

      const adxOk = adx >= 18;
      checks.push({ key: 'ADX', ok: adxOk, points: adxOk ? 1 : 0, buy: adxOk, sell: adxOk });

      const confOk = chopPass;
      checks.push({ key: 'CONF', ok: confOk, points: confOk ? 1 : 0, buy: confOk, sell: confOk });

      // Directional dominance uses only directional votes (avoids permanent 50/50 from neutral checks).
      const directionalVotes = [];
      if (trendDir > 0) directionalVotes.push('BUY');
      if (trendDir < 0) directionalVotes.push('SELL');
      if (macdBuy) directionalVotes.push('BUY');
      if (macdSell) directionalVotes.push('SELL');
      if (stoBuy) directionalVotes.push('BUY');
      if (stoSell) directionalVotes.push('SELL');
      if (candleDir === 'BUY' || candleDir === 'SELL') directionalVotes.push(candleDir);
      const buyVotes = directionalVotes.filter((v) => v === 'BUY').length;
      const sellVotes = directionalVotes.filter((v) => v === 'SELL').length;
      const totalVotes = Math.max(1, buyVotes + sellVotes);
      const longPct = Math.round((buyVotes / totalVotes) * 100);
      const shortPct = Math.round((sellVotes / totalVotes) * 100);
      const dominance = dir === 'BUY' ? longPct : shortPct;

      const strategyVotes = { buy: 0, sell: 0 };
      for (const st of strategyDecisions || []) {
        if (!st?.direction || !isStrategyEnabled(st.strategyKey)) continue;
        if (st.direction === 'BUY') strategyVotes.buy += 1;
        if (st.direction === 'SELL') strategyVotes.sell += 1;
      }
      const strategyAgreement = dir === 'BUY' ? strategyVotes.buy : strategyVotes.sell;

      let confluence = checks.reduce((acc, c) => acc + (Number.isFinite(c.points) ? c.points : (c.ok ? 1 : 0)), 0);
      if (S.killerUseStrategyVotes && strategyAgreement > 0) {
        confluence = Math.min(8, confluence + 1);
      }

      const dominanceThreshold = getKillerDominanceThreshold(adx);
      const maxPoints = 8;
      const minConfluence = Math.max(6, Math.min(7, Math.round(S.killerMinConfluence ?? 6)));
      const candleAgainst = !!(candleDir && candleDir !== dir);

      const snapshot = {
        tf,
        direction: dir,
        confluence,
        minConfluence,
        maxPoints,
        longPct,
        shortPct,
        dominance,
        dominanceThreshold,
        adx,
        checks,
        strategyVotes,
        strategyAgreement,
        candleAgainst,
        passConfluence: confluence >= minConfluence,
        passDominance: dominance >= dominanceThreshold
      };
      return applyDominanceHysteresis(snapshot);
    }

    function computePerfectTimeOk(ctx = {}) {
      if (!S.killerPerfectTimeEnabled) return true;
      const gate = ctx?.perfectTimeOk;
      if (typeof gate === 'boolean') return gate;
      const verdict = String(ctx?.verdict || '').toUpperCase();
      const reason = String(ctx?.reason || '');
      if (verdict === 'PASS') return true;
      if (reason === 'PerfectTime' || reason === 'NOT_PERFECT_TIME') return false;
      return true;
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
        <div class="iaa-killer-row"><span class="iaa-killer-key">CONF</span><span class="iaa-killer-val">${snap.confluence || 0}/${snap.maxPoints || 8} (мин ${snap.minConfluence || 6})</span></div>
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
      return !!S.autoSwitchStrategy;
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

    function calcCandlestickPatternDecision(windowMs) {
      const base = calcCandlestickDecision(windowMs);
      if (!base || !base.direction) return null;
      const minConf = clamp01(Number.isFinite(S.candlestickPatternMinConfidence) ? S.candlestickPatternMinConfidence : 0.6);
      if (base.confidence < minConf) return null;
      return { ...base, strategyKey: 'candlestick_pattern' };
    }


    function calcAiVisionDecision(windowMs) {
      return null;
      const c0 = getCandleAtOffset(windowMs, 0);
      const c1 = getCandleAtOffset(windowMs, 1);
      const c2 = getCandleAtOffset(windowMs, 2);
      if (!c0 || !c1 || !c2) return null;
      const b0 = Math.abs(c0.close - c0.open);
      const b1 = Math.abs(c1.close - c1.open);
      const b2 = Math.abs(c2.close - c2.open);
      const r1 = Math.max(c1.high - c1.low, 1e-8);
      const c2Bull = c2.close > c2.open;
      const c0Bull = c0.close > c0.open;
      const c2Bear = c2.close < c2.open;
      const c0Bear = c0.close < c0.open;
      const middleSmall = b1 / r1 < 0.35;
      const starGapDown = Math.max(c1.open, c1.close) < c2.close;
      const starGapUp = Math.min(c1.open, c1.close) > c2.close;
      const midC2 = c2.open + (c2.close - c2.open) * 0.5;
      let pattern = null;
      let direction = null;
      if (c2Bear && middleSmall && c0Bull && starGapDown && c0.close > midC2) {
        pattern = 'MORNING_STAR';
        direction = 'BUY';
      }
      if (c2Bull && middleSmall && c0Bear && starGapUp && c0.close < midC2) {
        pattern = 'EVENING_STAR';
        direction = 'SELL';
      }
      if (!pattern) return null;
      const confidence = clamp01(0.62 + Math.min(0.2, (b0 + b2) / Math.max(c2.open || c0.open || 1, 1e-8)) * 8);
      return { pattern, direction, confidence };
    }

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

      if (emaFastVal > emaSlowVal && rsi <= oversold) {
        const confidence = clamp01(0.55 + (oversold - rsi) / Math.max(oversold, 1) * 0.35);
        return {
          strategyKey: 'ema_rsi_pullback',
          direction: 'BUY',
          confidence,
          rangePct,
          trendDir,
          trendAligned: trendDir === 0 || trendDir >= 0,
          volumeOk: true
        };
      }
      if (emaFastVal < emaSlowVal && rsi >= overbought) {
        const confidence = clamp01(0.55 + (rsi - overbought) / Math.max(100 - overbought, 1) * 0.35);
        return {
          strategyKey: 'ema_rsi_pullback',
          direction: 'SELL',
          confidence,
          rangePct,
          trendDir,
          trendAligned: trendDir === 0 || trendDir <= 0,
          volumeOk: true
        };
      }
      const momentum = prices[prices.length - 1] - prices[Math.max(0, prices.length - 4)];
      if (emaFastVal > emaSlowVal && rsi >= 52 && momentum > 0) {
        const last = prices[prices.length - 1];
        const distPct = Math.abs(last - emaFastVal) / Math.max(last, 1e-8);
        const pullbackOk = distPct <= Math.max(0.0006, rangePct * 0.6);
        if (!pullbackOk) return null;

        return {
          strategyKey: 'ema_rsi_pullback',
          direction: 'BUY',
          confidence: clamp01(0.5 + (rsi - 50) / 100 + Math.min(0.15, Math.abs(momentum) / Math.max(prices[prices.length - 1], 1e-8) * 90)),
          rangePct,
          trendDir,
          trendAligned: trendDir === 0 || trendDir >= 0,
          volumeOk: true
        };
      }
      if (emaFastVal < emaSlowVal && rsi <= 48 && momentum < 0) {
        const last = prices[prices.length - 1];
        const distPct = Math.abs(last - emaFastVal) / Math.max(last, 1e-8);
        const pullbackOk = distPct <= Math.max(0.0006, rangePct * 0.6);
        if (!pullbackOk) return null;

        return {
          strategyKey: 'ema_rsi_pullback',
          direction: 'SELL',
          confidence: clamp01(0.5 + (50 - rsi) / 100 + Math.min(0.15, Math.abs(momentum) / Math.max(prices[prices.length - 1], 1e-8) * 90)),
          rangePct,
          trendDir,
          trendAligned: trendDir === 0 || trendDir <= 0,
          volumeOk: true
        };
      }
      return null;
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

    function getPartnerTfReadiness() {
      const checks = [];
      if (S.sniperEnabledTimeframes?.['1m']) {
        const req1 = Math.max(1, Math.round(S.partnerReadyBars1m || 10));
        const bars1 = countReadyBars(SNIPER_TF_MS['1m']);
        checks.push(['1m', bars1, req1]);
      }
      if (S.sniperEnabledTimeframes?.['3m']) {
        const req3 = Math.max(1, Math.round(S.partnerReadyBars3m || 6));
        const bars3 = countReadyBars(SNIPER_TF_MS['3m']);
        checks.push(['3m', bars3, req3]);
      }
      if (S.sniperEnabledTimeframes?.['5m']) {
        const req5 = Math.max(1, Math.round(S.partnerReadyBars5m || 3));
        const bars5 = countReadyBars(SNIPER_TF_MS['5m']);
        checks.push(['5m', bars5, req5]);
      }
      if (S.sniperEnabledTimeframes?.['15m']) {
        const req15 = Math.max(1, Math.round(S.partnerReadyBars15m || 2));
        const bars15 = countReadyBars(SNIPER_TF_MS['15m']);
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
      const vwap = calcSniperVwap(windowMs * 2);
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
      let direction = null;
      let reason = 'RangeRevert';
      let confidence = 0;
      const prev = prices[prices.length - 2];
      if (prev <= bb.lower && last >= bb.lower && last > prev && stoch <= 30) {
        direction = 'BUY';
        confidence = Math.min(0.98, 0.72 + ((bb.lower - last) / Math.max(last, 1e-8)) * 45 + (30 - stoch) / 100);
        reason = 'RangeRevert(LowerBB)';
      } else if (prev >= bb.upper && last <= bb.upper && last < prev && stoch >= 70) {
        direction = 'SELL';
        confidence = Math.min(0.98, 0.72 + ((last - bb.upper) / Math.max(last, 1e-8)) * 45 + (stoch - 70) / 100);
        reason = 'RangeRevert(UpperBB)';
      } else {
        const momentum = prices[prices.length - 1] - prices[Math.max(0, prices.length - 4)];
        if (emaFastVal > emaSlowVal && stoch >= 52 && momentum > 0) {
          direction = 'BUY';
          confidence = 0.54 + Math.min(0.18, Math.abs(momentum) / Math.max(last, 1e-8) * 80);
          reason = 'MicroTrendFollow(BUY)';
        } else if (emaFastVal < emaSlowVal && stoch <= 48 && momentum < 0) {
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
      const trendStrength = Math.abs(emaFastVal - emaSlowVal) / Math.max(last, 1e-8);
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

    function getStrategyDecisions(tfKey) {
      const windowMs = SNIPER_TF_MS[tfKey];
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

    function getSniperThresholdForScope() {
      return Number.isFinite(S.sniperThreshold) ? S.sniperThreshold : SNIPER_5S_DEFAULTS.threshold;
    }

    function getScoreThresholdPoints() {
      const strictByConfluence = Math.round(S.killerMinConfluence || 6) >= 7;
      return strictByConfluence ? 8 : 7;
    }

    function evaluateMandatoryGates(ctx = {}) {
      const {
        decision,
        regime,
        payoutOk,
        entryWindowOk,
        biasDirection,
        analysisUpdatedSec,
        tfKey,
        timeInCandle,
        entryWindowLimit,
        perfectTimeOk,
        earlyEntryEnabled,
        syncWaitNextCandle
      } = ctx;
      const regimeState = String(regime?.state || '').toLowerCase();
      const feedState = String(S.feedState || '').toUpperCase();
      const staleFeed = ['NO_FEED', 'STALE'].includes(feedState);
      const timeIsFinite = Number.isFinite(timeInCandle);
      const limitIsFinite = Number.isFinite(entryWindowLimit);
      const timingLeft = timeIsFinite ? Math.round(Number(timeInCandle)) : 'NaN';
      const timingRight = limitIsFinite ? Math.round(Number(entryWindowLimit)) : 'NaN';
      const timingNanFlag = (!timeIsFinite) ? '|NAN_TIME' : (!limitIsFinite) ? '|NAN_LIMIT' : '';
      const timingReason = (String(decision?.entryTimingReasonCode || '') === 'DISABLED_FOR_TF')
        ? 'РАНЕН ВХОД ИЗКЛЮЧЕН ЗА TF'
        : (String(decision?.entryTimingReasonCode || '') === 'SYNC_WAIT_NEXT_CANDLE')
          ? 'СИНХР.: ЧАКАМ НОВА СВЕЩ'
          : (String(decision?.entryTimingReasonCode || '') === 'NAN_TIME' || !timeIsFinite)
            ? 'ГРЕШЕН ТАЙМИНГ (NaN)'
            : (String(decision?.entryTimingReasonCode || '') === 'LATE_BUT_ALLOWED_STRONG')
              ? 'КЪСЕН ВХОД, НО ДОПУСНАТ (силен сигнал)'
              : `КЪСЕН ВХОД (${timingLeft}>${timingRight}${timingNanFlag})`;
      const reasons = {
        RegimeGate: !(S.sniperNoTradeInChop && regimeState === 'chop') ? 'PASS' : 'CHOP',
        VolatilitySpikeGate: !(decision?.spikeFlag || decision?.volatilitySpike) ? 'PASS' : 'SPIKE',
        EntryTimingGate: (!earlyEntryEnabled || syncWaitNextCandle || !!entryWindowOk) ? 'PASS' : timingReason,
        PerfectTimeGate: !!perfectTimeOk ? 'PASS' : 'НЯМА PT',
        BiasConflictGate: !(biasDirection && decision?.direction && biasDirection !== decision.direction) ? 'PASS' : `Bias конфликт (${biasDirection}→${decision?.direction})`,
        StalenessGate: !(Number.isFinite(analysisUpdatedSec) && analysisUpdatedSec > 15) ? 'PASS' : `STALE_${Math.round(analysisUpdatedSec)}s`,
        PayoutFloorGate: !!payoutOk ? 'PASS' : 'LOW_PAYOUT',
        FeedTickRateGate: !staleFeed ? 'PASS' : feedState
      };
      const failed = Object.keys(reasons).filter((k) => reasons[k] !== 'PASS');
      const timingBucket = Number.isFinite(timeInCandle) ? Math.floor(Number(timeInCandle) / 5) : -1;
      const gateHash = [
        `tf=${String(tfKey || decision?.tfKey || '').toLowerCase()}`,
        `reg=${regimeState || 'na'}`,
        `spk=${decision?.spikeFlag || decision?.volatilitySpike ? 1 : 0}`,
        `tim=${timingBucket}`,
        `bias=${biasDirection || 'na'}`,
        `pay=${payoutOk ? 1 : 0}`,
        `feed=${staleFeed ? 0 : 1}`
      ].join('|');
      return {
        verdict: failed.length ? 'FAIL' : 'PASS',
        failed,
        reasons,
        gateHash
      };
    }

    function runEntryTimingRegressionHarness() {
      const tfList = ['1m', '3m', '5m', '15m'];
      const toWindowMs = (tf) => Number(SNIPER_TF_MS[tf] || 0);
      logConsoleLine('[ENTRY_TIMING_HARNESS] START');
      for (const tf of tfList) {
        const windowMs = toWindowMs(tf);
        const baseNow = Number.isFinite(windowMs) && windowMs > 0 ? (Math.floor(Date.now() / windowMs) * windowMs) : Date.now();
        const limit = getEntryWindowLimitSec(tf, windowMs);
        const nowPass = baseNow + Math.max(0, (limit - 1)) * 1000;
        const casePass = computeEntryTiming(tf, windowMs, nowPass);
        const passOk = casePass.entryWindowOk === true;
        logConsoleLine(`[ENTRY_TIMING_HARNESS] ${passOk ? 'PASS' : 'FAIL'} tf=${tf} case=LIMIT_MINUS_1 t=${Number(casePass.timeInCandleSec).toFixed(3)} limit=${Number(casePass.entryWindowLimitSec).toFixed(3)} ok=${casePass.entryWindowOk}`);

        const nowFail = baseNow + (limit + 1) * 1000;
        const caseFail = computeEntryTiming(tf, windowMs, nowFail);
        const failReason = `OUTSIDE_WINDOW:${Number.isFinite(caseFail.timeInCandleSec) ? Math.round(caseFail.timeInCandleSec) : 'NaN'}>${Number.isFinite(caseFail.entryWindowLimitSec) ? Math.round(caseFail.entryWindowLimitSec) : 'NaN'}`;
        const failOk = caseFail.entryWindowOk === false;
        logConsoleLine(`[ENTRY_TIMING_HARNESS] ${failOk ? 'PASS' : 'FAIL'} tf=${tf} case=LIMIT_PLUS_1 reason=${failReason} ok=${caseFail.entryWindowOk}`);

        const caseNaN = computeEntryTiming(tf, windowMs, Number.NaN);
        const nanOk = caseNaN.entryWindowOk === false && caseNaN.nanReason === 'NAN_TIME';
        logConsoleLine(`[ENTRY_TIMING_HARNESS] ${nanOk ? 'PASS' : 'FAIL'} tf=${tf} case=NAN_NOW reason=${caseNaN.nanReason || 'NONE'} t=${Number.isFinite(caseNaN.timeInCandleSec) ? Number(caseNaN.timeInCandleSec).toFixed(3) : 'NaN'} ok=${caseNaN.entryWindowOk}`);
      }
      logConsoleLine('[ENTRY_TIMING_HARNESS] END');
    }

    function runUiPersistenceHarness() {
      const sample = {
        minPayout: Number(S.sniperMinPayout || 0),
        early1m: !!S.earlyEntry1mEnabled,
        early3m: !!S.earlyEntry3mEnabled,
        early5m: !!S.earlyEntry5mEnabled,
        win1m: Number(S.entryWindowSec1m || 0),
        win3m: Number(S.entryWindowSec3m || 0),
        win5m: Number(S.entryWindowSec5m || 0),
        maxOpen: Number(S.maxOpenTrades || 0),
        maxPerMin: Number(S.maxTradesPerMinute || 0),
        catchMove: !!S.phaseCatchMoveEnabled,
        reload: !!S.phaseReloadSniperEnabled,
        chop: !!S.sniperChopEnabled
      };
      logConsoleLine(`[UI_PERSIST_HARNESS] STATE ${JSON.stringify(sample)}`);
      return sample;
    }

    function runDirectionLockHarness() {
      const tf = '1m';
      S.tfDirectionMemory = {};
      S.domHysteresisDelta = Number.isFinite(S.domHysteresisDelta) ? S.domHysteresisDelta : 10;
      const now = Date.now();
      const d1 = { direction: 'BUY', confidence: 0.62 };
      applyDirectionLock(tf, d1, { points: 7, threshold: 7 }, { dominance: 66, dominanceThreshold: 62 });
      S.tfDirectionMemory[tf] = { dir: 'BUY', atMs: now, conf: 0.62 };
      const d2 = { direction: 'SELL', confidence: 0.64 };
      applyDirectionLock(tf, d2, { points: 7, threshold: 7 }, { dominance: 65, dominanceThreshold: 62 });
      const lockOk = d2.direction === 'BUY';
      logConsoleLine(`[DIR_LOCK_HARNESS] ${lockOk ? 'PASS' : 'FAIL'} case=lock_hold dir=${d2.direction}`);

      const snapKeep = applyDominanceHysteresis({ direction: 'BUY', dominance: 67, dominanceThreshold: 62, passDominance: true });
      const keepOk = snapKeep.direction === 'BUY';
      logConsoleLine(`[DOM_HYS_HARNESS] ${keepOk ? 'PASS' : 'FAIL'} case=keep dir=${snapKeep.direction}`);

      S.biasHysteresis = { dir: 'BUY', lastDomPct: 67 };
      const snapFlip = applyDominanceHysteresis({ direction: 'SELL', dominance: 78, dominanceThreshold: 62, passDominance: true });
      const flipOk = snapFlip.direction === 'SELL';
      logConsoleLine(`[DOM_HYS_HARNESS] ${flipOk ? 'PASS' : 'FAIL'} case=flip dir=${snapFlip.direction}`);
    }

    function computeSignalStability(assetLabel, decision, mandatoryGates, scoreCard) {
      const key = `${assetLabel}|${decision?.tfKey || ''}|${decision?.strategyKey || ''}|${decision?.direction || ''}`;
      S.stabilityCache = S.stabilityCache || {};
      const prev = S.stabilityCache[key] || { passesCount: 0, gateHash: '', direction: '', lastAt: 0 };
      const scorePass = !!scoreCard && Number(scoreCard.points || 0) >= Number(scoreCard.threshold || 0);
      const passNow = String(mandatoryGates?.verdict || '') === 'PASS' && scorePass;
      const now = Date.now();
      let passesCount = passNow ? (prev.passesCount + 1) : 0;
      if (prev.direction && prev.direction !== decision?.direction) passesCount = passNow ? 1 : 0;
      if (prev.gateHash && prev.gateHash !== mandatoryGates?.gateHash) passesCount = passNow ? 1 : 0;
      if (prev.lastAt && (now - prev.lastAt > 1200)) passesCount = passNow ? 1 : 0;
      const stablePass = passNow && passesCount >= 2;
      S.stabilityCache[key] = {
        passesCount,
        gateHash: mandatoryGates?.gateHash || '',
        direction: decision?.direction || '',
        lastAt: now
      };
      return { key, passesCount, stablePass };
    }

    function evaluateScoreDecision(ctx = {}) {
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
      let points = 0;
      const maxPoints = 9;

      if (!decision || !decision.direction) {
        hardFails.push('Няма сигнал от стратегия');
      } else {
        points += 2;
        breakdown.push(`Стратегия сигнал: +2 (${decision.strategyKey || 'unknown'})`);
      }

      const regimeState = String(regime?.state || '').toLowerCase();
      const regimeFit = regimeState === 'trend' || regimeState === 'range';
      if (regimeFit) {
        points += 1;
        breakdown.push(`Режим подходящ: +1 (${regimeState.toUpperCase()})`);
      } else {
        breakdown.push(`Режим подходящ: 0 (${regimeState || 'N/A'})`);
      }
      if (noTradeInChop && regimeState === 'chop') {
        hardFails.push('CHOP – без сделки');
      }

      if (killerAlignmentOk) {
        points += 1;
        breakdown.push(`Killer: +1 (CONF ${killerSnapshot?.confluence || 0}/${killerSnapshot?.maxPoints || 8})`);
      } else {
        breakdown.push('Killer: 0');
      }

      const structureOk = !!decision?.trendAligned;
      if (structureOk) {
        points += 1;
        breakdown.push('Структура: +1');
      } else {
        breakdown.push('Структура: 0');
      }

      const volatilityOk = Number.isFinite(decision?.rangePct)
        ? decision.rangePct >= Math.max(0, Number(S.sniperChopThreshold || 0))
        : true;
      if (volatilityOk) {
        points += 1;
        breakdown.push('Волатилност: +1');
      } else {
        breakdown.push('Волатилност: 0');
      }

      if (entryWindowOk) {
        points += 1;
        breakdown.push('Тайминг: +1');
      } else {
        breakdown.push('Тайминг: 0');
      }

      if (spreadOk) {
        points += 1;
        breakdown.push('Spread/Liquidity: +1');
      } else {
        breakdown.push('Spread/Liquidity: 0');
      }

      if (patternSupport) {
        points += 1;
        breakdown.push('Pattern: +1');
      } else {
        breakdown.push('Pattern: 0');
      }

      if (!payoutOk) {
        hardFails.push('PAYOUT под минималния праг');
      }
      if (counterCandleHardStop) {
        hardFails.push('Силна контра-свещ срещу входа');
      }

      const threshold = getScoreThresholdPoints();
      return {
        hardFailReason: hardFails.length ? hardFails.join(' | ') : null,
        points,
        maxPoints,
        threshold,
        breakdown
      };
    }

    function getSniperBaseAmountCents() {
      return Number.isFinite(S.sniperBaseAmount)
        ? S.sniperBaseAmount
        : SNIPER_5S_DEFAULTS.baseAmountCents;
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
    async function runSniperTick() {
      S.engineState = 'ANALYZE';
      const now = Date.now();
      const prevStatus = S.sniperTfStatus || {};
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
        for (const tf of Object.keys(SNIPER_TF_MS)) {
          if (!S.sniperEnabledTimeframes[tf]) {
            feedStatuses[tf] = { state: 'off', confidence: null, direction: null };
            continue;
          }
          feedStatuses[tf] = { state: 'nodata', detail: 'feed stale >5s', confidence: null, direction: null };
        }
        S.analysisUpdatedAt = now;
        S.analysisConfidence = 0;
        S.analysisDirection = null;
        S.tradeQualityScore = 0;
        S.sniperTfStatus = feedStatuses;
        setStatusOverlay(formatStatus('sniper_no_feed'), '', false);
        refreshUI('no_feed');
        return;
      }

      S.feedState = 'READY';
      const canTrade = S.autoTrade;

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
        refreshUI('no_timeframes');
        return;
      }

      const payoutOk = getSniperMinPayoutOk();
      const assetScope = getExpiryScopeFromAsset(getCurrentAssetLabel());
      const requiredThreshold = clamp01(getSniperThresholdForScope(assetScope));
      const partnerReady = getPartnerTfReadiness();
      const minReadyCount = Math.max(1, Math.round(S.tfReadyMinCount || 1));

      let best = null;
      let bestCandidate = null;
      let killerBest = null;
      const killerByTf = {};
      const decisionsByTf = {};
      const allowLateEntries = requiredThreshold === 0;
      const tfStatus = {};
      S.lastScoreSnapshot = null;
      for (const tf of timeframes) {
        const windowMs = SNIPER_TF_MS[tf];
        let entryTiming = computeEntryTiming(tf, windowMs);
        const syncReady = !entryTiming.syncWaitNextCandle;
        const candleStart = entryTiming.candleStartMs;
        const timeInCandle = entryTiming.timeInCandleSec;
        const entryWindowLimit = entryTiming.entryWindowLimitSec;
        const readiness = partnerReady.details?.[tf];
        if (readiness && !readiness.ready) {
          const confPrev = getPrevStatus(tf)?.confidence ?? null;
          const dirPrev = getPrevStatus(tf)?.direction ?? null;
          tfStatus[tf] = { state: 'tf_wait', detail: `${readiness.bars}/${readiness.required}`, confidence: confPrev, direction: dirPrev };
          continue;
        }

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
          decision.timeInCandleSec = timeInCandle;
          decision.entryWindowLimitSec = entryWindowLimit;
          decision.candleStartMs = candleStart;
          // backward-compatible aliases
          decision.timeInCandle = timeInCandle;
          decision.entryWindowSec = entryWindowLimit;
          decision.candleStart = candleStart;
        }
        const aiVision = calcAiVisionDecision(windowMs);
        if (decision) {
          decision.aiVision = aiVision;
          if (S.aiVisionEnabled) {
            if (aiVision && aiVision.direction === decision.direction) {
              decision.confidence = Math.min(1, decision.confidence + 0.06);
            } else if (S.aiVisionRequireMatch) {
                            const aiState = (!S.aiVisionEnabled) ? 'ai_off' : (!aiVision ? 'ai_no_pattern' : (aiVision.direction !== decision.direction ? 'ai_against' : 'ai_required'));
              tfStatus[tf] = { state: aiState, confidence: decision.confidence, direction: decision.direction };
              decisionsByTf[tf] = decision;
              continue;
            } else {
              decision.confidence = Math.max(0, decision.confidence - 0.03);
            }
          }
        }
        decisionsByTf[tf] = decision;
        if (!decision) {
          tfStatus[tf] = { state: 'nodata', detail: 'липсва решение от стратегия', confidence: null, direction: null };
          continue;
        }
        if (!decision.direction) {
          tfStatus[tf] = {
            state: 'nodata',
            detail: 'няма посока от стратегия',
            confidence: decision?.confidence ?? null,
            direction: null
          };
          continue;
        }
        if (!syncReady) {
          tfStatus[tf] = { state: 'sync_wait', detail: 'СИНХР.: ЧАКАМ НОВА СВЕЩ', confidence: decision?.confidence ?? null, direction: decision?.direction || null };
          continue;
        }

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
        entryTiming = computeEntryTiming(tf, windowMs, Date.now(), {
          confirmationMatched: Number(confirmation?.matched || 0),
          adx: Number(killerSnapshotTf?.adx || 0),
          dominance: Number(killerSnapshotTf?.dominance || 0),
          dominanceThreshold: Number(killerSnapshotTf?.dominanceThreshold || 0)
        });
        decision.entryTimingReason = entryTiming.reason;
        decision.entryTimingReasonCode = entryTiming.reasonCode;
        decision.timeInCandleSec = entryTiming.timeInCandleSec;
        decision.entryWindowLimitSec = entryTiming.entryWindowLimitSec;
        decision.candleStartMs = entryTiming.candleStartMs;
        decision.timeInCandle = entryTiming.timeInCandleSec;
        decision.entryWindowSec = entryTiming.entryWindowLimitSec;
        decision.candleStart = entryTiming.candleStartMs;
        applyDirectionLock(tf, decision, decision?.scoreCard || null, killerSnapshotTf);
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
            decision.confidence = Math.max(0, decision.confidence - (S.rangeOscPenaltyEnabled ? (clamp(parseNumberFlexible(S.rangeOscPenaltyPct) || 0, 0, 50) / 100) : 0));
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
        if (S.phaseCatchMoveEnabled || S.phaseReloadSniperEnabled) {
          const stats = getTfConfidenceStats(tf);
          const hasMomentum = decision.momentum != null ? Math.abs(decision.momentum) > 0 : true;
          if (stats) {
            if (S.phaseCatchMoveEnabled && regime?.state === 'trend' && decision.trendAligned && hasMomentum) {
              const near = decision.confidence >= Math.max(0, requiredThreshold - 0.12);
              const rising = stats.slope >= 0.18;
              if (near && rising) { decision.confidence = Math.min(1, decision.confidence + 0.08); }
            }
            if (S.phaseReloadSniperEnabled && stats.peakDir && stats.peakDir === decision.direction) {
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
          killerAlignmentOk = !!(killerSnapshotTf.passConfluence && killerSnapshotTf.passDominance && strategyGateOk);
          perfectTimeOk = killerEdgeTriggered(tf, decision.direction, killerAlignmentOk);
          if (!killerAlignmentOk) {
            try {
              const reason = !killerSnapshotTf.passConfluence ? 'Confluence' : (!killerSnapshotTf.passDominance ? 'Dominance' : (!strategyGateOk ? 'Strategy' : ''));
              sessionRecordKiller(tf, killerSnapshotTf, 'WAIT', reason);
            } catch (e) {}
          } else if (!perfectTimeOk) {
            try { sessionRecordKiller(tf, killerSnapshotTf, 'WAIT', 'PerfectTime'); } catch (e) {}
          }
        }

        if (S.killerEnabled && killerAlignmentOk && perfectTimeOk) { try { sessionRecordKiller(tf, killerSnapshotTf, 'PASS', ''); } catch (e) {} }

        if (String(decision.tfKey || '') === '1m' && getDynamicMode() === 'hybrid' && !S.hybridAllow1m) {
          tfStatus[tf] = { state: 'risk', confidence: decision.confidence, direction: displayDir };
          if (shouldLogScoreEvent(tf, 'hard', '1m disabled in hybrid by setting')) logConsoleLine('[GATES] 1m е изключен в Hybrid (setting)');
          continue;
        }
        const entryWindowOk = !!entryTiming.entryWindowOk;
        const combinedTimingOk = entryWindowOk && perfectTimeOk;
        const spreadMetric = Number.isFinite(S.lastGlobalSpread) ? S.lastGlobalSpread : 0;
        const spreadOk = !S.filterSpreadEnabled || !Number.isFinite(S.filterSpreadThreshold) || spreadMetric >= S.filterSpreadThreshold;
        const patternSupport = !S.candlestickPatternEnabled || decision.strategyKey === 'candlestick_pattern';
        const analysisUpdatedSec = Number.isFinite(S.lastPriceAt) && S.lastPriceAt > 0 ? ((Date.now() - S.lastPriceAt) / 1000) : null;
        const mandatoryGates = evaluateMandatoryGates({
          decision,
          regime,
          payoutOk,
          entryWindowOk: entryTiming.entryWindowOk,
          perfectTimeOk,
          biasDirection,
          analysisUpdatedSec,
          tfKey: tf,
          timeInCandle: entryTiming.timeInCandleSec,
          entryWindowLimit: entryTiming.entryWindowLimitSec,
          earlyEntryEnabled: entryTiming.earlyEntryEnabled,
          syncWaitNextCandle: !syncReady
        });
        decision.mandatoryGates = mandatoryGates;
        if (mandatoryGates.verdict !== 'PASS') {
          const failedGates = (mandatoryGates.failed || []).map((g) => `${g}:${mandatoryGates?.reasons?.[g] || 'FAIL'}`);
          const reason = `ГЕЙТОВЕ: ${failedGates.join(' | ')}`;
          recordGateBlockers(tf, mandatoryGates.failed || [], mandatoryGates.reasons || {});
          const topGate = String((mandatoryGates.failed || [])[0] || 'UNKNOWN');
          const topReasonRaw = String(mandatoryGates?.reasons?.[topGate] || 'UNKNOWN');
          const topReasonKey = normalizeEntryTimingReasonKey(topReasonRaw || topGate);
          if ((mandatoryGates.failed || []).includes('EntryTimingGate') && shouldLogEntryTimingFail(tf, mandatoryGates?.reasons?.EntryTimingGate || '')) {
            logConsoleLine(`[GATE_FAIL EntryTiming] tf=${tf} nowMs=${entryTiming.nowMs} candleStartMs=${entryTiming.candleStartMs} timeInCandleSec=${Number.isFinite(entryTiming.timeInCandleSec) ? Number(entryTiming.timeInCandleSec).toFixed(3) : 'NaN'} entryWindowLimitSec=${Number.isFinite(entryTiming.entryWindowLimitSec) ? Number(entryTiming.entryWindowLimitSec).toFixed(3) : 'NaN'} entryWindowOk=${!!entryTiming.entryWindowOk}`);
          }
          S.lastScoreSnapshot = {
            result: 'SKIP(GATES)',
            points: 0,
            maxPoints: 9,
            threshold: getScoreThresholdPoints(),
            strategyKey: decision.strategyKey,
            reason
          };
          if (shouldLogGateFailSummary(tf, `${topGate}|${topReasonKey}`)) {
            if (getLogVerbosity() === 'minimal') {
              const blockers = computeTopBlockers(300000);
              logSpamControlled('status_wait', `wait:blockers:${tf}`, `СТАТУС: WAIT | топ блокери: ${blockers.summary} | ${blockers.last}`, { stateValue: `${blockers.summary}|${blockers.last}` });
            } else {
              logSpamControlled('gates', `gates:${tf}`, reason);
            }
          }
          tfStatus[tf] = { state: 'risk', confidence: decision.confidence, direction: displayDir };
          continue;
        }
        S.engineState = 'SCORE';
        const tfPolicy = (String(decision.tfKey || '').toLowerCase() === '5m') ? 'SOFT_5M' : 'BASELINE';
        const scoreCard = evaluateScoreDecision({
          decision,
          regime,
          payoutOk,
          entryWindowOk: combinedTimingOk,
          spreadOk,
          killerSnapshot: killerSnapshotTf,
          killerAlignmentOk,
          patternSupport,
          noTradeInChop: !!S.sniperNoTradeInChop,
          counterCandleHardStop: !!decision.counterCandleHardStop
        });
        decision.scoreCard = scoreCard;
        if (tfPolicy === 'SOFT_5M') scoreCard.threshold = Math.max(6, Number(scoreCard.threshold || 7) - 1);

        if (scoreCard.hardFailReason) {
          const reason = scoreCard.hardFailReason;
          S.lastScoreSnapshot = {
            result: 'SKIP(HARD)',
            points: scoreCard.points,
            maxPoints: scoreCard.maxPoints,
            threshold: scoreCard.threshold,
            strategyKey: decision.strategyKey,
            reason
          };
          if (shouldLogScoreEvent(tf, 'hard', reason)) logConsoleLine(`[СКОР] Твърд стоп: ${reason}`);
          tfStatus[tf] = { state: 'risk', confidence: decision.confidence, direction: displayDir };
          continue;
        }
        if (scoreCard.points < scoreCard.threshold) {
          const reason = `Недостатъчно точки: ${scoreCard.points}/${scoreCard.maxPoints} (праг ${scoreCard.threshold}/${scoreCard.maxPoints})`;
          S.lastScoreSnapshot = {
            result: 'SKIP(SCORE)',
            points: scoreCard.points,
            maxPoints: scoreCard.maxPoints,
            threshold: scoreCard.threshold,
            strategyKey: decision.strategyKey,
            reason
          };
          if (shouldLogScoreEvent(tf, 'score', reason)) logConsoleLine(`[СКОР] ${reason}`);
          tfStatus[tf] = { state: 'risk', confidence: decision.confidence, direction: displayDir };
          continue;
        }

        const stability = computeSignalStability(getCurrentAssetLabel() || '—', decision, decision.mandatoryGates, scoreCard);
        decision.stablePass = !!stability.stablePass;
        decision.passesCount = Number(stability.passesCount || 0);
        if (!decision.stablePass) {
          const reason = `Stability FAIL: ${decision.passesCount}/2`;
          S.lastScoreSnapshot = {
            result: 'SKIP(STABILITY)',
            points: scoreCard.points,
            maxPoints: scoreCard.maxPoints,
            threshold: scoreCard.threshold,
            strategyKey: decision.strategyKey,
            reason
          };
          if (shouldLogScoreEvent(tf, 'score', reason)) logConsoleLine(`[STABILITY] ${reason}`);
          tfStatus[tf] = { state: 'risk', confidence: decision.confidence, direction: displayDir };
          continue;
        }


        logSpamControlled('decision', `decision:${String(decision.tfKey || tf).toLowerCase()}`, `[DECISION] tf=${String(decision.tfKey || tf).toLowerCase()} dir=${decision.direction || 'N/A'} conf=${Number(decision.confidence || 0).toFixed(2)} momentum=${Number(decision.momentum || 0).toFixed(4)} bias=${biasDirection || 'NONE'} flipGuard=OK`);
        S.lastScoreSnapshot = {
          result: 'READY',
          points: scoreCard.points,
          maxPoints: scoreCard.maxPoints,
          threshold: scoreCard.threshold,
          strategyKey: decision.strategyKey,
          reason: 'Готов за вход'
        };

        if (!best || decision.confidence > best.confidence) {
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
        .filter((tf) => ['ready', 'risk'].includes(tfStatus[tf]?.state) && decisionsByTf[tf]?.direction)
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

      for (const tf of Object.keys(SNIPER_TF_MS)) {
        const prev = getPrevStatus(tf);
        if (!S.sniperEnabledTimeframes[tf]) {
          tfStatus[tf] = { state: 'off', confidence: null, direction: null };
        } else if (!tfStatus[tf]) {
          tfStatus[tf] = { state: 'late', confidence: prev.confidence ?? null, direction: prev.direction ?? null };
        }
      }
      S.sniperTfStatus = tfStatus;
      if (killerBest) {
        S.killerSnapshot = {
          longPct: killerBest.longPct,
          shortPct: killerBest.shortPct,
          confluence: killerBest.confluence,
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
        S.killerSnapshot = { signal: 'WAIT', longPct: 50, shortPct: 50, confluence: 0, minConfluence: Math.max(6, Math.min(7, Math.round(S.killerMinConfluence || 6))), adx: null };
      }
      refreshUI('scan_update');
      renderKillerHud();
      if (!best) {
        S.analysisConfidence = bestCandidate ? bestCandidate.confidence : 0;
        S.analysisDirection = bestCandidate ? bestCandidate.direction : null;
        S.tradeQualityScore = bestCandidate ? Math.round((bestCandidate.confidence || 0) * 100) : 0;
        S.currentStrategyKey = bestCandidate?.strategyKey || null;
        S.sniperLastDecision = null;
        S.analysisUpdatedAt = now;
        const notReady = Object.entries(partnerReady.details || {}).filter(([,d]) => !d.ready);
        const readyCount = Object.entries(partnerReady.details || {}).filter(([,d]) => !!d.ready).length;
        if (readyCount < minReadyCount && notReady.length) {
          const tfNotReadySummary = notReady.map(([tf, d]) => `${tf}=${d.bars}/${d.required}`).join(' ');
          setStatusOverlay(`Снайпер: TF not ready ${tfNotReadySummary}`, '', false);
        } else {
          setStatusOverlay('Снайпер: няма чист вход', '', false);
        }
        if (String(getLogVerbosity()).toLowerCase() === 'minimal') {
          const t = Date.now();
          if (!Number.isFinite(S.lastMinimalHeartbeatAt) || (t - Number(S.lastMinimalHeartbeatAt)) > 30000) {
            S.lastMinimalHeartbeatAt = t;
            logSpamControlled('status_wait', 'wait:tf', `СТАТУС: WAIT | TF=1m/3m/5m | причина=тайминг/PT/гейтове`, { stateValue: 'TF_WAIT' });
          }
        }
        refreshUI('scan_wait');
        return;
      }

      if (S.lastStrategyDirection && best.direction && S.lastStrategyDirection !== best.direction) {
        const sinceFlip = now - (S.lastStrategyDirectionAt || 0);
        if (sinceFlip < Math.max(500, S.strategyFlipCooldownMs || 2500)) {
          logConsoleLine(`[FLIP_BLOCKED] prev=${S.lastStrategyDirection} new=${best.direction} reason=cooldown`);
          best.direction = S.lastStrategyDirection;
          best.confidence = Math.max(0, (best.confidence || 0) - 0.08);
        }
      }
      if (best.direction) {
        S.lastStrategyDirection = best.direction;
        S.lastStrategyDirectionAt = now;
      }
      S.analysisConfidence = best.confidence;
      S.analysisDirection = best.direction;
      S.analysisUpdatedAt = now;
      S.tradeQualityScore = Math.round((best.confidence || 0) * 100);
      S.sniperLastDecision = best;
      S.currentStrategyKey = best.strategyKey || null;
      S.lastDecisionSnapshot = {
        at: now,
        direction: best.direction || null,
        confidence: Number(best.confidence || 0),
        strategyKey: best.strategyKey || null,
        tfStatus: { ...tfStatus }
      };

      if (!canTrade) {
        setStatusOverlay('Снайпер: изчакване', '', false);
        refreshUI('scan_wait');
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
      const preferRank = (tf) => (tf === '1m' ? 1 : tf === '3m' ? 2 : tf === '5m' ? 3 : tf === '15m' ? 4 : 9);
      const ordered = [...readySignals].sort((a, b) => {
        const ra = preferRank(String(a?.tfKey || '').toLowerCase());
        const rb = preferRank(String(b?.tfKey || '').toLowerCase());
        if (ra !== rb) return ra - rb;
        return (Number(b?.confidence || 0) - Number(a?.confidence || 0));
      });
      const primary1m = ordered.find((x) => String(x?.tfKey || '').toLowerCase() === '1m');
      const primary3m = ordered.find((x) => String(x?.tfKey || '').toLowerCase() === '3m');
      let pickedPrimary = null;
      if (primary1m) pickedPrimary = primary1m;
      else if (primary3m) pickedPrimary = primary3m;
      const prioritized = pickedPrimary ? [pickedPrimary, ...ordered.filter((x) => x !== pickedPrimary)] : ordered;
      if (prioritized.length) {
        const cands = prioritized.map((x) => String(x?.tfKey || '').toLowerCase()).join(',');
        const chosen = String(prioritized[0]?.tfKey || '').toLowerCase();
        const reason = (chosen === '1m' || chosen === '3m') ? 'prefer_primary' : 'fallback_higher_tf';
        logSpamControlled('decision', 'tf_pick', `[TF_PICK] chosen=${chosen} reason=${reason} candidates=${cands}`, { stateValue: `${chosen}|${reason}` });
      }

      const maxConcurrentSniperTrades = Math.max(1, Math.round(S.maxOpenTrades || timeframes.length));
      const availableSlots = Math.max(0, maxConcurrentSniperTrades - S.activeTrades.length);
      if (!availableSlots) {
        setStatusOverlay('Снайпер: изчакване', '', false);
        return;
      }

      const signalsToExecute = prioritized.slice(0, availableSlots);

      for (let i = 0; i < signalsToExecute.length; i += 1) {
        const decision = signalsToExecute[i];

        // Non-blocking scan: no sleep in SCAN loop. Recompute immediately.
        // Recompute decision using the currently enabled strategy (not a fixed strategy),
        // and use the same threshold scaling as the main scan (0..1).
        const assetScopePre = getExpiryScopeFromAsset(getCurrentAssetLabel());
        const requiredThresholdPre = clamp01(getSniperThresholdForScope(assetScopePre));
        const strategyDecisionsPre = getStrategyDecisions(decision.tfKey);
        const latestPre = selectBestStrategyDecision(strategyDecisionsPre);

        if (!latestPre || !latestPre.direction || latestPre.direction !== decision.direction || Number(latestPre.confidence || 0) < requiredThresholdPre) {
                    const preReasonParts = [];
          if (!latestPre || !latestPre.direction) preReasonParts.push('няма сигнал');
          else {
            if (latestPre.direction !== decision.direction) preReasonParts.push(`посока ${decision.direction}→${latestPre.direction}`);
            const preConf = Number(latestPre.confidence || 0);
            const oldConf = Number(decision.confidence || 0);
            if (preConf + 1e-9 < requiredThresholdPre) preReasonParts.push(`увереност ${Math.round(preConf*100)}% < праг ${Math.round(requiredThresholdPre*100)}%`);
            if (Math.abs(preConf - oldConf) >= 0.08) preReasonParts.push(`увереност ${Math.round(oldConf*100)}%→${Math.round(preConf*100)}%`);
          }
          const preReason = preReasonParts.length ? preReasonParts.join(', ') : 'промяна след повторна проверка';
          logSpamControlled('scan', 'scan:precheck', `[SCAN V5] ПРОПУСК: ${decision.tfKey} повторна проверка (${preReason})`);
          continue;
        }

        // Non-blocking SCAN: sequencing delay handled by EXEC queue worker/TTL guards.

        const assetLabel = getCurrentAssetLabel() || '—';
        const assetSearch = assetLabel.replace(/\(OTC\)/i, '').replace(/\//g, '').trim();
        
      // --- NEW FILTERS (Advanced) ---
      // Spread filter (global BUY vs SELL bias)
      if (S.filterSpreadEnabled && typeof S.filterSpreadThreshold === 'number') {
        const sp = (typeof S.lastGlobalSpread === 'number') ? S.lastGlobalSpread : 0;
        if (sp < S.filterSpreadThreshold) {
          setSkipReason('spread_low');
          continue;
        }
      }

      // Flip delay: block immediate opposite direction after a recent trade
      if (S.filterFlipDelayEnabled && S.lastTradeDirection && decision.direction && decision.direction !== S.lastTradeDirection) {
        const dt = Date.now() - (S.lastTradeAt || 0);
        if (dt >= 0 && dt < (S.filterFlipDelaySec * 1000)) {
          setSkipReason('flip_delay');
          continue;
        }
      }

      // Drift detector: if confidence is sliding down (last 4 ticks) on this TF, skip
      if (S.filterDriftEnabled) {
        const tf = decision.tfKey || decision.timeframe;
        const arr = (S._tfConfSeries && tf && S._tfConfSeries[tf]) ? S._tfConfSeries[tf] : [];
        if (arr.length >= 4) {
          const a = arr.slice(-4);
          const isDown = (a[0] > a[1]) && (a[1] > a[2]) && (a[2] > a[3]);
          const drop = a[0] - a[3];
          const driftThreshold = Math.max(0, (Number(S.filterDriftThreshold) || 0) / 100);
          if (driftThreshold > 0 && isDown && drop >= driftThreshold) {
            setSkipReason('drift');
            continue;
          }
        }
      }

      // Impulse Entry Cap: per TF + direction per candle (1m/3m/5m)
      if (S.impulseCapEnabled) {
        const tf = decision.tfKey || decision.timeframe;
        const tfMs = (tf === '1m') ? 60_000 : (tf === '3m') ? 180_000 : (tf === '5m') ? 300_000 : 0;
        if (tfMs) {
          const candleId = Math.floor(Date.now() / tfMs);
          S._impulseCap = S._impulseCap || {};
          const key = tf + '|' + decision.direction;
          const obj = (S._impulseCap[key] = S._impulseCap[key] || { candleId, count: 0 });
          if (obj.candleId !== candleId) { obj.candleId = candleId; obj.count = 0; }
          if (obj.count >= S.impulseCapMaxPerCandle) {
            setSkipReason('impulse_cap');
            continue;
          }
          // reserve slot (increment only when trade actually starts sending)
          obj.count++;
        }
      }
const signal = {
          asset: assetLabel,
          assetSearch,
          isOTC: /OTC/i.test(assetLabel || ''),
          direction: decision.direction,
          strategyKey: decision.strategyKey,
          confidence: decision.confidence,
          entryMeta: {
            strategyKey: decision.strategyKey,
            scoreCard: decision.scoreCard || null,
            regime: decision.regime,
            regimeStrength: decision.regimeStrength,
            biasDir: decision.biasDir,
            biasStrength: decision.biasStrength,
            confirmation: decision.confirmation,
            candleStartMs: decision.candleStartMs,
            timeInCandleSec: decision.timeInCandleSec,
            entryWindowLimitSec: decision.entryWindowLimitSec,
            // backward-compatible aliases
            timeInCandle: decision.timeInCandle,
            entryWindowSec: decision.entryWindowSec,
            rangePct: decision.rangePct,
            trendDir: decision.trendDir,
            trendAligned: decision.trendAligned,
            volumeOk: decision.volumeOk,
            payoutPercent: decision.payoutPercent,
            volatility: {
              atr: decision.atr || null,
              rangePct: decision.rangePct,
              spikeFlag: !!(decision.spikeFlag || decision.volatilitySpike)
            },
            mandatoryGates: decision.mandatoryGates || null,
            stablePass: !!decision.stablePass,
            passesCount: Number(decision.passesCount || 0)
          },
          expiry: decision.tfKey.toUpperCase(),
          minute: getCurrentMinute(),
          time: fmtHHMMSSUTCm3(new Date()),
          targetTsMs: now,
          rawText: `[sniper:${decision.tfKey}]`
        };
        if (S.burstEnabled && decision.confidence >= S.burstConfidenceThreshold) {
          signal.burstCount = Math.max(1, Math.min(S.burstTradeCount, 5));
        }

        const prevBase = S.baseAmount;
        S.baseAmount = getSniperBaseAmountCents();
        S.assetSelectedForSignal = true;
        S.assetSelectionAttempted = true;

        const inFlightKey = `${signal.asset}|${decision.tfKey}|${signal.direction}|${decision.candleStart}|${signal.expiry}`;
        if (S.sniperInFlightKey === inFlightKey && Date.now() < (S.sniperInFlightUntil || 0)) {
          logSpamControlled('scan', 'scan:inflight', '[SCAN V5] ПРОПУСК: In-flight (двоен вход)');
          continue;
        }
        S.sniperInFlightKey = inFlightKey;
        S.sniperInFlightUntil = Date.now() + 1500;
        if (decision.aiVision?.pattern) logConsoleLine(`[AI VISION] Patterns: ${decision.aiVision.pattern}`);
        
        // -------- Confirm Delay (delay_ms) + stability check (NO cooldown) --------

        // 1) Quick stability: streak (default 2 ticks)
        const minStreak = Math.max(1, Number.isFinite(S.confirmStreakMin) ? S.confirmStreakMin : 2);
        if ((decision._dirStreak || 0) < minStreak) {
          logSpamControlled('scan', 'scan:unstable_dir', `[SCAN V5] ПРОПУСК: Нестабилна посока (streak=${decision._dirStreak || 0}/${minStreak})`);
          S.sniperInFlightUntil = 0;
          S.baseAmount = prevBase;
          S.assetSelectedForSignal = false;
          S.assetSelectionAttempted = false;
          continue;
        }

        // 2) Anti-flip voting: require 2-of-3 recent directions to match current (keeps bot active)
        const __hist = (S.__tfDirHist && S.__tfDirHist[decision.tfKey]) ? S.__tfDirHist[decision.tfKey] : [];
        const __recent = __hist.slice(-3);
        const __need = (__recent.length >= 3) ? 2 : Math.min(2, __recent.length); // 1→1, 2→2, 3→2
        const __match = __recent.filter(x => x && x.dir === decision.direction).length;
        if (__need > 0 && __match < __need) {
          logSpamControlled('scan', 'scan:flip_noise', `[SCAN V5] ПРОПУСК: Flip шум (vote=${__match}/${__recent.length}, need=${__need}, dir=${decision.direction})`);
          S.sniperInFlightUntil = 0;
          S.baseAmount = prevBase;
          S.assetSelectedForSignal = false;
          S.assetSelectionAttempted = false;
          continue;
        }

        const confirmDelayMs = Math.max(0, Math.min(2000, Number.isFinite(S.confirmDelayMs) ? S.confirmDelayMs : 600));
        if (confirmDelayMs > 0) {
          // Non-blocking scan: emulate delay via re-validation without waiting.

          // Re-check entry window after delay (we do NOT modify your entry-window settings).
          if (S.entryWindowTfEnabled) {
            const timing2 = computeEntryTiming(decision.tfKey, decision.windowMs);
            const t2 = timing2.timeInCandleSec;
            const limit2 = timing2.entryWindowLimitSec;
            if (!timing2.entryWindowOk) {
              const t2Label = Number.isFinite(t2) ? Math.round(t2) : 'NaN';
              const l2Label = Number.isFinite(limit2) ? Math.round(limit2) : 'NaN';
              logSpamControlled('scan', 'scan:entry_window_delay', `[SCAN V5] ПРОПУСК: Извън Entry Window след delay (${decision.tfKey} t=${t2Label}s > ${l2Label}s${timing2.hasNaNTime ? ' NAN_TIME' : ''})`);
              S.sniperInFlightUntil = 0;
              S.baseAmount = prevBase;
              S.assetSelectedForSignal = false;
              S.assetSelectionAttempted = false;
              continue;
            }
          }

          // Re-check direction & confidence after delay (dogonvane само ако не е flip).
          const strategyDecisions2 = getStrategyDecisions(decision.tfKey);
          let decision2 = selectBestStrategyDecision(strategyDecisions2);

          // OPTION 2 (по‑практична): ако след delay няма сигнал, НЕ режем автоматично.
          // При бинарна търговия 0.3–0.8s често са шум в детектора; ако посоката не е flip‑нала,
          // оставяме предишния сигнал, но пазим останалите гейтове (Entry Window + праг + anti‑flip + drop guard).
          if (!decision2 || !decision2.direction) {
            // Ползваме предишния сигнал като fallback (без "догонване" при липсващ сигнал).
            decision2 = { ...decision };
            logSpamControlled('scan', 'scan:no_signal_delay', `[SCAN V5] INFO: Няма сигнал след delay (${decision.tfKey}) → fallback към предишния сигнал`);
          }
          if (decision2.direction !== decision.direction) {
            logSpamControlled('scan', 'scan:flip_after_delay', `[SCAN V5] ПРОПУСК: Flip след delay (${decision.tfKey} ${decision.direction}→${decision2.direction})`);
            S.sniperInFlightUntil = 0;
            S.baseAmount = prevBase;
            S.assetSelectedForSignal = false;
            S.assetSelectionAttempted = false;
            continue;
          }

          // Confidence drop guard after delay (prevents chasing collapsing signals)
          const __baseConf = (decision.confidence || 0);
          const __conf2 = (decision2.confidence || 0);
          const __drop = __baseConf - __conf2;
          if (__drop > 0.20) {
            logSpamControlled('scan', 'scan:conf_drop_sharp', `[SCAN V5] ПРОПУСК: Рязък спад в увереността след delay (${decision.tfKey} ${Math.round(__baseConf*100)}%→${Math.round(__conf2*100)}%)`);
            S.sniperInFlightUntil = 0;
            S.baseAmount = prevBase;
            S.assetSelectedForSignal = false;
            S.assetSelectionAttempted = false;
            continue;
          }

          const thr = getSniperThresholdForScope();
          if ((decision2.confidence || 0) < thr) {
            logSpamControlled('scan', 'scan:conf_drop', `[SCAN V5] ПРОПУСК: Увереност падна след delay (${decision.tfKey} ${(decision2.confidence || 0).toFixed(2)} < ${thr.toFixed(2)})`);
            S.sniperInFlightUntil = 0;
            S.baseAmount = prevBase;
            S.assetSelectedForSignal = false;
            S.assetSelectionAttempted = false;
            continue;
          }
        }
        // ------------------------------------------------------------------------
        const entryWindowSec = Number(signal?.entryMeta?.entryWindowLimitSec ?? signal?.entryMeta?.entryWindowSec ?? 0);
        const candleStart = Number(decision?.candleStartMs ?? decision?.candleStart ?? now);
        const validUntil = entryWindowSec > 0 ? (candleStart + entryWindowSec * 1000) : (Date.now() + 2000);
        const candidate = {
          id: `cand_${Date.now().toString(36)}_${Math.random().toString(16).slice(2,8)}`,
          scanCycleId: Number(S.scanCycleId || 0),
          createdAtMs: Date.now(),
          asset: signal?.asset || getCurrentAssetLabel() || '',
          tf: decision?.tfKey || '',
          direction: decision?.direction || '',
          strategyKey: decision?.strategyKey || '',
          candleStartMs: candleStart,
          entryWindowSec,
          validUntilMs: validUntil,
          gates: { verdict: decision?.mandatoryGates?.verdict || 'FAIL', failed: decision?.mandatoryGates?.failed || [], reasons: decision?.mandatoryGates?.reasons || {}, gateHash: decision?.mandatoryGates?.gateHash || '' },
          score: { points: Number(decision?.scoreCard?.points || 0), threshold: Number(decision?.scoreCard?.threshold || 0), breakdown: decision?.scoreCard?.breakdown || [] },
          stability: { stablePass: !!decision?.stablePass, passesCount: Number(decision?.passesCount || 0) },
          snapshot: { confidence: Number(decision?.confidence || 0), dom: Number(S.killerSnapshot?.longPct || 0), regimeSummary: String(decision?.regime?.state || ''), payout: Number(S.lastPayoutPercent || 0), timeInCandleSec: Number(signal?.entryMeta?.timeInCandleSec ?? signal?.entryMeta?.timeInCandle ?? 0), analysisUpdatedSec: Number((Date.now()-Number(S.analysisUpdatedAt||Date.now()))/1000) },
          signal,
          decision,
          points: Number(decision?.scoreCard?.points || 0)
        };
        candidate.signal.scanCycleId = candidate.scanCycleId;
        if (Date.now() > validUntil) {
          logSpamControlled('scan', 'scan:expired', `[SCAN V5] EXPIRED(SCAN) tf=${decision?.tfKey || candidate?.tf || 'n/a'} t=${Math.round(Number(signal?.entryMeta?.timeInCandleSec ?? signal?.entryMeta?.timeInCandle ?? 0))}s window=${Math.round(Number(entryWindowSec || 0))}s`);
          S.sniperInFlightUntil = 0;
          S.baseAmount = prevBase;
          S.assetSelectedForSignal = false;
          S.assetSelectionAttempted = false;
          continue;
        }
        const queued = enqueueExecutionCandidate(candidate);
        S.sniperInFlightUntil = 0;
        S.baseAmount = prevBase;
        S.assetSelectedForSignal = false;
        S.assetSelectionAttempted = false;
        if (queued) {
          logSpamControlled('scan', 'scan:ready', `[SCAN V5] READY → ${signal.direction} ${signal.expiry} (${Math.round((signal.confidence || 0) * 100)}%)`);
          setStatusOverlay(formatStatus('sniper_ready'), '', false);
        }
      }
    }

    /* ========================= FIXED TICK LOOP WITH CONTINUOUS COUNTDOWN ========================= */
    async function tick() {
      if (!S.running) {
        clearInterval(S.scanLoop);
        S.scanLoop = null;
        stopKeepAlive();
        stopPriceMonitoring();
        return;
      }

      // SCAN loop lock only (does not block EXEC/SETTLE loops).
      if (S.scanBusy) return;
      S.scanBusy = true;
      S.scanCycleId = Number(S.scanCycleId || 0) + 1;
      const __scanStarted = Date.now();
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
          S.sniperLastDecision = null;
          S.sniperTfStatus = {};
          if (isSniperMode()) {
            S.sniperWarmupUntil = Date.now();
            S.priceHistory = [];
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
      if (warm < 1) { refreshUI('warmup'); return; }

      if (isSniperMode()) {
        await runSniperTick();
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


      // legacy direct-exec branch removed; SCAN remains analyze/enqueue only.


      refreshUI('tick');
    
      } finally {
        const dt = Date.now() - __scanStarted;
        const n = (S.queueMetrics._scanN || 0) + 1;
        S.queueMetrics._scanN = n;
        S.queueMetrics.scanCycleMs = ((S.queueMetrics.scanCycleMs || 0) * (n - 1) + dt) / n;
        S.metrics.scanCycleMs = S.queueMetrics.scanCycleMs;
        S.scanBusy = false;
      }
}

    async function settleLoopTick() {
      if (!S.running || S.settleBusy) return;
      S.settleBusy = true;
      const started = Date.now();
      try {
        await processPendingTradeConfirmations();
        if (hasActiveTrade()) await finalizeActiveTrades();
      } finally {
        const dt = Date.now() - started;
        const n = (S.queueMetrics._settleN || 0) + 1;
        S.queueMetrics._settleN = n;
        S.queueMetrics.avgSettleMs = ((S.queueMetrics.avgSettleMs || 0) * (n - 1) + dt) / n;
        S.metrics.avgSettleMs = S.queueMetrics.avgSettleMs;
        S.settleBusy = false;
      }
    }

    function startEngineLoops() {
      clearInterval(S.scanLoop);
      clearInterval(S.execLoop);
      clearInterval(S.settleLoop);
      S.scanLoop = setInterval(tick, 250);
      S.execLoop = setInterval(() => { runExecutionQueueWorker(); }, 90);
      S.settleLoop = setInterval(() => { settleLoopTick(); }, 750);
    }

    function stopEngineLoops() {
      clearInterval(S.scanLoop); S.scanLoop = null;
      clearInterval(S.execLoop); S.execLoop = null;
      clearInterval(S.settleLoop); S.settleLoop = null;
      S.executionQueue = [];
      S.execWorkerBusy = false;
      S.scanBusy = false;
      S.settleBusy = false;
      if (S.queueMetrics) S.queueMetrics.queueLen = 0;
      if (S.metrics) S.metrics.queueLen = 0;
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
        #iaa-debug-copy{ padding:4px 8px; border-radius:6px; border:1px solid rgba(255,255,255,.35); background:none; color:#f9fafb; font-size:10px; cursor:pointer; letter-spacing:.08em; font-weight:700; }
        #iaa-debug-copy:hover{ color:#ffffff; border-color:rgba(255,255,255,.55); }
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
        .iaa-entry-row{ display:grid; grid-template-columns:minmax(64px,auto) auto auto; column-gap:10px; row-gap:8px; align-items:center; }
        .iaa-entry-row .iaa-field-label{ min-width:64px; }
        .iaa-tfgrp{ display:inline-flex; align-items:center; gap:6px; white-space:nowrap; }
        .iaa-tfsec{ width:58px; padding:2px 6px; }
        .iaa-tfgrp-5m{ grid-column:2 / 3; }
        #iaa-recheck-settlement{ color:#f9fafb; font-size:10px; font-weight:700; background:none; }
        #iaa-recheck-settlement:hover{ color:#ffffff; }
        .dbg-red{ color:#ff5a5a; font-weight:700; }
        .dbg-small{ font-size:11px; font-weight:600; }
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
    <div class="k">Изтичане</div><div id="iaa-exp" class="v">1M</div>
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
        <div id="iaa-last-trade-card" style="font-size:11px;color:#cbd5e1;margin-top:4px;">Bot PnL: — | Platform: —</div>

        <div class="iaa-controls">
          <button id="iaa-mouse-toggle" class="iaa-control-btn" title="Mouse Mapping">🖱</button>
          <button id="iaa-settings-toggle" class="iaa-control-btn" title="Settings">⚙</button>
          
          <button id="iaa-debug-toggle" class="iaa-control-btn" title="Проверка">🧪</button>
        </div>

        <div id="iaa-debug-panel">
          <div class="iaa-debug-header">
            <span>Проверка</span>
            <div class="iaa-debug-actions">
              <button id="iaa-debug-copy" title="Копирай проверка">КОПИРАЙ</button>
              <button id="iaa-recheck-settlement" title="Проверка на последната unresolved сделка">Проверка</button>
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
<div id="iaa-settings-sniper" style="display:block;">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin:8px 0;">
              <div style="font-weight:700;color:#e5e7eb;">Настройки</div>
              <button id="iaa-sniper-collapse" type="button" class="iaa-toggle-btn">▾</button>
            </div>
            <div id="iaa-sniper-settings-body">
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
                  <input type="number" inputmode="decimal" id="iaa-sniper-threshold" min="1" max="100" step="1" value="65">
                </div>
                <div class="iaa-subtitle" style="color:${UI_WARM_RED};">Време за готовност/История</div>
                <div class="iaa-grid-2">
                  <div class="iaa-field-row iaa-compact-row" title="Минимални готови барове за 1m потвърждение.">
                    <span class="iaa-field-label">1M свещи</span>
                    <input type="number" id="iaa-partner-ready-1m" min="1" max="40" step="1" value="10">
                  </div>
                  <div class="iaa-field-row iaa-compact-row" title="Минимални готови барове за 3m потвърждение.">
                    <span class="iaa-field-label">3M свещи</span>
                    <input type="number" id="iaa-partner-ready-3m" min="1" max="40" step="1" value="6">
                  </div>
                  <div class="iaa-field-row iaa-compact-row" title="Минимални готови барове за 5m потвърждение.">
                    <span class="iaa-field-label">5M свещи</span>
                    <input type="number" id="iaa-partner-ready-5m" min="1" max="40" step="1" value="3">
                  </div>
                  <div class="iaa-field-row iaa-compact-row" title="Минимални готови барове за 15m потвърждение.">
                    <span class="iaa-field-label">15M свещи</span>
                    <input type="number" id="iaa-partner-ready-15m" min="1" max="40" step="1" value="2">
                  </div>
                </div>
                <div class="iaa-field-row" title="Базова сума на сделката в долари.">
                  <span class="iaa-field-label">Базова сума ($)</span>
                  <input type="number" id="iaa-sniper-base" min="1" step="1" value="100">
                </div>
                <div class="iaa-field-row iaa-field-toggle" title="Когато е OFF ботът не променя сумата в платформата и използва текущата зададена сума.">
                  <span class="iaa-field-label">Синхронизирай сума с платформата</span>
                  <label class="iaa-checkbox"><input type="checkbox" id="iaa-amount-sync-enabled" checked> </label>
                </div>
                <div class="iaa-field-row iaa-field-toggle" title="Минимален payout за допускане на сделка. (60–92%)">
  <span class="iaa-field-label">Мин. Payout %</span>
  <label class="iaa-checkbox"><input type="checkbox" id="iaa-sniper-min-payout-enabled" checked> </label>
  <input type="number" id="iaa-sniper-min-payout" min="60" max="92" step="1" value="70">
</div>
                <div class="iaa-field-row iaa-field-toggle iaa-max-row iaa-entry-row" title="Вход TF: секунди за 1m/3m/5m (0=изкл.).">
                  <span class="iaa-field-label">Вход TF</span>
                  <span class="iaa-tfgrp"><span class="iaa-mini-label">1M</span><input type="number" class="iaa-tfsec" id="iaa-entrywin-1m" min="0" max="60" step="1" value="35"></span>
                  <span class="iaa-tfgrp"><span class="iaa-mini-label">3M</span><input type="number" class="iaa-tfsec" id="iaa-entrywin-3m" min="0" max="180" step="1" value="90"></span>
                  <span class="iaa-tfgrp iaa-tfgrp-5m"><span class="iaa-mini-label">5M</span><input type="number" class="iaa-tfsec" id="iaa-entrywin-5m" min="0" max="300" step="1" value="150"></span>
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
                <label class="iaa-checkbox" title="Предотвратява приспиване на таба."><input type="checkbox" id="iaa-sniper-keep-alive"> <span id="iaa-sniper-keepalive-label">Дръж таба активен</span></label>
</div>

              <div id="iaa-tab-advanced" class="iaa-tab-body" style="display:none;">
                 <div class="iaa-field-row" title="Контролира детайлността на конзолния лог.">
                  <span class="iaa-field-label">Ниво на лог (verbosity)</span>
                  <select id="iaa-log-verbosity">
                    <option value="minimal">Минимален</option>
                    <option value="normal">Нормален</option>
                    <option value="detailed">Детайлен</option>
                  </select>
                </div>
                <div class="iaa-subtitle iaa-subtitle-new" style="color:${UI_WARM_RED};" title="Нови опции за тайминг (влизане по-рано и след pullback).">TIMING</div>
                 <label class="iaa-checkbox iaa-new-setting" title="Catch the move: позволява по-ранен вход когато увереността расте бързо и има тренд. Не променя стратегията, само тайминга."><input type="checkbox" id="iaa-phase-catch-move"> Catch the move</label>
                 <label class="iaa-checkbox iaa-new-setting" title="Snipe after reload: позволява вход след кратък pullback/колебание, когато сигналът се върне в посоката на тренда. Не променя стратегията, само тайминга."><input type="checkbox" id="iaa-phase-reload-snipe"> Snipe after reload</label>
                 <div class="iaa-field-row iaa-field-toggle" title="Филтър за ниска волатилност (chop).">
                  <label title="Филтър за ниска волатилност (chop)."><input type="checkbox" id="iaa-sniper-chop-enabled"> Chop Вкл/Изкл</label>
                  <input type="number" id="iaa-sniper-chop" min="1" max="100" step="1" value="70">
                </div>
                                <div class="iaa-field-row"><span class="iaa-field-label" style="color:${UI_WARM_RED};">НОВИ • ФИЛТРИ</span><button id="iaa-newfilters-toggle" type="button" class="iaa-toggle-btn">${S.sniperNewFiltersCollapsed ? '▸' : '▾'}</button></div>
                <div id="iaa-newfilters-body" style="${S.sniperNewFiltersCollapsed ? 'display:none;' : ''}">


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


        </div>

                <div class="iaa-field-row" title="Лимит за максимална загуба за сесия.">
                  <span class="iaa-field-label">Стоп при загуба (€)</span>
                  <input type="number" id="iaa-sniper-max-session-loss" min="0" step="1" value="0">
                </div>
                <div class="iaa-field-row" title="Лимит за поредни загуби преди пауза.">
                  <span class="iaa-field-label">Поредни загуби</span>
                  <input type="number" id="iaa-sniper-max-loss-streak" min="0" step="1" value="0">
                </div>
              </div>
              </div>

              <div id="iaa-tab-features" class="iaa-tab-body" style="display:none;">
                
                
              </div>

              <div id="iaa-tab-analyses" class="iaa-tab-body" style="display:none;">
                <div class="iaa-subtitle" style="color:${UI_WARM_RED};">Стратегии</div>
                <label class="iaa-checkbox"><input type="checkbox" id="iaa-strategy-ema-rsi-pullback-enabled"> EMA+RSI Pullback</label>
                <label class="iaa-checkbox"><input type="checkbox" id="iaa-strategy-scalp-microtrend-enabled"> SCALP Microtrend</label>

                
                <label class="iaa-checkbox"><input type="checkbox" id="iaa-candle-pattern-enabled"> Candlestick Pattern On/Off</label>
                <div class="iaa-field-row iaa-field-toggle" title="Ако последната свещ е срещу посоката на входа, сигналът се блокира.">
                    <span class="iaa-field-label">Свещ срещу входа = твърд стоп</span>
                    <label class="iaa-checkbox"><input type="checkbox" id="iaa-killer-candle-hardstop"></label>
                  </div>
                <div id="iaa-killer-dynamic-body">
                  <div class="iaa-field-row iaa-field-toggle" title="Включва/изключва KILLER логиката. При OFF ботът работи по текущите филтри.">
                    <span class="iaa-field-label" style="color:${UI_WARM_RED};">KILLER активен</span>
                    <label class="iaa-checkbox"><input type="checkbox" id="iaa-killer-enabled"></label>
                  </div>
<div class="iaa-field-row" title="Минимален брой съвпадения (CONFLUENCE), за да се счита сигналът за валиден.">
                    <span class="iaa-field-label">Режим строгост (точки)</span>
                    <select id="iaa-killer-min-confluence" style="font-size:11px;">
                      <option value="6">Нормален (7/9)</option>
                      <option value="7">Строг (8/9)</option>
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
                    <span class="iaa-field-label" style="color:${UI_WARM_RED};">Dynamic активен</span>
                    <label class="iaa-checkbox"><input type="checkbox" id="iaa-dynamic-enabled-settings"></label>
                  </div>
                  <div class="iaa-field-row" title="Режим на Dynamic: Изкл / Само Dynamic / Hybrid (умно превключване).">
                    <span class="iaa-field-label">Режим Dynamic</span>
                    <select id="iaa-dynamic-mode">
                      <option value="off">Изкл</option>
                      <option value="dynamic">Само Dynamic</option>
                      <option value="hybrid">Хибрид</option>
                    </select>
                  </div>
                  <div class="iaa-field-row" title="Стъпка за избор на expiry секунди.">
                    <span class="iaa-field-label">Dynamic стъпка за expiry (сек)</span>
                    <input type="number" id="iaa-dynamic-expiry-step-sec" min="1" max="30" step="1" value="5">
                  </div>
                  <div class="iaa-field-row" title="Минимално и максимално позволено време за Dynamic (секунди).">
                    <span class="iaa-field-label">Диапазон (сек)</span>
                    <span class="iaa-mini-label">мин</span>
                    <input type="number" id="iaa-dynamic-min-sec" min="3" max="3600" step="1" value="15">
                    <span class="iaa-mini-label">/</span>
                    <input type="number" id="iaa-dynamic-max-sec" min="3" max="3600" step="1" value="300">
                  </div>
                  <div class="iaa-field-row" title="Стъпка за вход в симулацията назад.">
                    <span class="iaa-field-label">Dynamic стъпка за вход симулация (сек)</span>
                    <input type="number" id="iaa-dynamic-entry-step-sec" min="1" max="30" step="1" value="5">
                  </div>
                  <div class="iaa-field-row" title="Прозорец за симулация назад във времето.">
                    <span class="iaa-field-label">Dynamic прозорец за симулация назад (сек)</span>
                    <input type="number" id="iaa-dynamic-lookback-sec" min="60" max="3600" step="5" value="600">
                  </div>
                  <div class="iaa-field-row" title="Минимален брой проби за валиден SIM резултат.">
                    <span class="iaa-field-label">Dynamic минимален брой проби</span>
                    <input type="number" id="iaa-dynamic-min-samples" min="5" max="1000" step="1" value="40">
                  </div>
                  <div class="iaa-field-row" title="Минимален winrate за избор на expiry от SIM.">
                    <span class="iaa-field-label">Dynamic минимален winrate %</span>
                    <input type="number" id="iaa-dynamic-min-winrate" min="1" max="100" step="1" value="55">
                  </div>
                  <div class="iaa-field-row" title="Penalty при CHOP режим.">
                    <span class="iaa-field-label">Dynamic penalty за CHOP %</span>
                    <input type="number" id="iaa-dynamic-chop-penalty" min="0" max="100" step="1" value="3">
                  </div>
                  <div class="iaa-field-row" title="Penalty при късен вход спрямо entry window.">
                    <span class="iaa-field-label">Dynamic penalty за late entry %</span>
                    <input type="number" id="iaa-dynamic-late-penalty" min="0" max="100" step="1" value="2">
                  </div>
                  <label class="iaa-checkbox" title="Разрешава пропуск на сделката при липса на edge."><input type="checkbox" id="iaa-dynamic-no-trade" checked> Dynamic отказ ако няма edge</label>
                  <div class="iaa-field-row" style="margin-top:10px;"><span class="iaa-field-label" style="color:${UI_WARM_RED};">Скалиране на stake</span><button id="iaa-dynamic-stake-toggle" type="button" class="iaa-toggle-btn">▾</button></div>
                  <div id="iaa-dynamic-stake-body">
                  <label class="iaa-checkbox"><input type="checkbox" id="iaa-dynamic-stake-scale-enabled"> Скалиране по точки</label>
                  <div class="iaa-field-row"><span class="iaa-field-label">Множител при 8/9</span><input type="number" id="iaa-dynamic-stake-mult8" min="0" max="2" step="0.01" value="0.15"></div>
                  <div class="iaa-field-row"><span class="iaa-field-label">Множител при 9/9</span><input type="number" id="iaa-dynamic-stake-mult9" min="0" max="2" step="0.01" value="0.30"></div>
                  <div class="iaa-field-row"><span class="iaa-field-label">Dynamic boost при WR >= 60%</span><input type="number" id="iaa-dynamic-stake-boost" min="0" max="1" step="0.01" value="0.05"></div>
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
      const recheckSettlementBtn = $id('iaa-recheck-settlement');
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
      if (recheckSettlementBtn) {
        recheckSettlementBtn.addEventListener('click', async () => {
          try {
            const res = await manualRecheckSettlement();
            if (!res?.ok) { logConsoleLine('[SETTLE] Няма UNRESOLVED за recheck'); return; }
            logConsoleLine('MANUAL_RECHECK:OK');
            refreshUI('manual_recheck');
            logConsoleLine('[SETTLE] Manual recheck изпълнен');
          } catch (e) { logConsoleLine('[SETTLE] Manual recheck error'); }
        });
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

    
    async function manualRecheckSettlement(tradeId = null) {
      const unresolvedActive = (S.activeTrades || []).slice().reverse().find(t => t && (t.state === 'UNRESOLVED' || t.outcome === 'UNRESOLVED'));
      let unresolved = unresolvedActive;
      const sess = _sessionEnsure();
      const unresolvedSess = (sess.unresolvedTrades || []).slice().reverse()[0] || null;
      const fallbackId = unresolvedSess?.tradeId || unresolvedSess?.id || null;
      const targetId = tradeId || fallbackId;
      if (!unresolved && targetId) unresolved = (S.trades || []).find(t => t && (t.id === targetId || t.tradeId === targetId));
      if (!unresolved) unresolved = (S.trades || []).slice().reverse().find(t => t && t.outcome === 'UNRESOLVED');
      if (!unresolved) return { ok: false, reason: 'NOT_FOUND' };
      unresolved.outcomeChecked = false;
      unresolved.recheckAttempts = Number(unresolved.recheckAttempts || 0);
      S.activeTrades = S.activeTrades || [];
      if (!S.activeTrades.find(t => t.id === unresolved.id)) S.activeTrades.push(unresolved);
      await finalizeActiveTrades();
      return { ok: true, tradeId: unresolved.id };
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
    function renderPendingTrades (){
      const execEl = $id('iaa-exec');
      if (null && execEl) execEl.textContent = fmtHHMMSSLocal(new Date(null.targetTsMs));
      else if (execEl) execEl.textContent = '—';

      renderChip(null);
      const expEl = $id('iaa-exp');
      if (expEl) expEl.textContent = getLiveExpiryLabel(null || null) || '—';

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
      const lastTradeCard = $id('iaa-last-trade-card');
      if (lastTradeCard) {
        const all = Array.isArray(S.trades) ? S.trades : [];
        const last = all.length ? all[all.length - 1] : null;
        if (last) {
          const botPnl = Number.isFinite(last.profitCents) ? last.profitCents : 0;
          const platformBadge = last.platformOutcomeBadge || '—';
          lastTradeCard.innerHTML = `Bot PnL: <b>${formatOutcomeAmount(botPnl)}</b> <span style="opacity:.75; margin-left:8px;">Platform: <b>${platformBadge}</b></span>`;
        } else {
          lastTradeCard.textContent = 'Bot PnL: — | Platform: —';
        }
      }

      const feedEl = $id('iaa-feed-cloud');
      if (feedEl) {
        const price = Number.isFinite(S.currentAssetPrice) ? String(S.currentAssetPrice) : '—';
        const historyLen = S.priceHistory?.length || 0;
        const acceptedTicks = Number.isFinite(S.historyAcceptedTicks) ? S.historyAcceptedTicks : 0;
        const duplicateTicks = Number.isFinite(S.historyDuplicateTicks) ? S.historyDuplicateTicks : 0;
        const wsSeen = Number.isFinite(S.wsPacketsSeen) ? S.wsPacketsSeen : 0;
        const bridgeSeen = Number.isFinite(S.wsBridgeFramesSeen) ? S.wsBridgeFramesSeen : 0;
        const httpSeen = Number.isFinite(S.httpFramesSeen) ? S.httpFramesSeen : 0;
        const bridgeState = S.wsBridgeReady ? 'ON' : 'OFF';
        const source = S.lastFeedSource || 'none';
        feedEl.innerHTML = `Цена: ${price} • История: ${historyLen} (✓${acceptedTicks}/dup:${duplicateTicks})`;
        feedEl.title = `Историята се пази до ${PRICE_HISTORY_MAX_POINTS} точки (лимит по брой, не по време).`;
      }
    }

    async function loadSettings(){
      const base = await storage.get(BASE_AMOUNT_KEY);
      if (typeof base === 'number' && base > 0) S.baseAmount = base;
      const ex  = await storage.get(EXPIRY_KEY); if (typeof ex === 'string') S.expirySetting = normalizeExpiry(ex) || '1M';
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
      if (typeof keepAlive === 'boolean') { S.keepAliveEnabled = keepAlive; S.sniperKeepAliveEnabled = keepAlive; }
      const analysisConfidence = await storage.get(ANALYSIS_CONFIDENCE_KEY); if (typeof analysisConfidence === 'number') S.analysisConfidenceThreshold = analysisConfidence;
      const tradeIntervalMin = await storage.get(TRADE_INTERVAL_MIN_KEY); if (typeof tradeIntervalMin === 'number') S.tradeIntervalMin = tradeIntervalMin;
      const maxTradesPerMinute = await storage.get(MAX_СДЕЛКИ_PER_MIN_KEY); if (typeof maxTradesPerMinute === 'number') S.maxTradesPerMinute = maxTradesPerMinute; else if (!Number.isFinite(S.maxTradesPerMinute)) S.maxTradesPerMinute = 5;
      const maxOpenTrades = await storage.get(MAX_OPEN_СДЕЛКИ_KEY); if (typeof maxOpenTrades === 'number') S.maxOpenTrades = maxOpenTrades; else if (!Number.isFinite(S.maxOpenTrades)) S.maxOpenTrades = 5;
      const ewEnabled = await storage.get(ENTRY_WIN_TF_ENABLED_KEY);
      if (typeof ewEnabled === 'boolean') S.entryWindowTfEnabled = ewEnabled;
      const ew1m = await storage.get(ENTRY_WIN_1M_SEC_KEY);
      if (typeof ew1m === 'number') S.entryWindowSec1m = Math.max(0, Math.min(60, Math.round(ew1m)));
      const ew3m = await storage.get(ENTRY_WIN_3M_SEC_KEY);
      if (typeof ew3m === 'number') S.entryWindowSec3m = Math.max(0, Math.min(180, Math.round(ew3m)));
      const ew5m = await storage.get(ENTRY_WIN_5M_SEC_KEY);
      if (typeof ew5m === 'number') S.entryWindowSec5m = Math.max(0, Math.min(300, Math.round(ew5m)));
      const early1m = await storage.get(EARLY_ENTRY_1M_ENABLED_KEY);
      if (typeof early1m === 'boolean') S.earlyEntry1mEnabled = early1m;
      const early3m = await storage.get(EARLY_ENTRY_3M_ENABLED_KEY);
      if (typeof early3m === 'boolean') S.earlyEntry3mEnabled = early3m;
      const early5m = await storage.get(EARLY_ENTRY_5M_ENABLED_KEY);
      if (typeof early5m === 'boolean') S.earlyEntry5mEnabled = early5m;
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
      const logVerbosity = await storage.get(LOG_VERBOSITY_KEY); if (typeof logVerbosity === 'string') S.logVerbosity = ['minimal','normal','detailed'].includes(logVerbosity) ? logVerbosity : 'normal';
      // Legacy VWAP/Momentum/Volume weighting path is disabled in the score-first core.
      S.sniperVwapEnabled = false;
      S.sniperMomentumEnabled = false;
      S.sniperVolumeEnabled = false;
      S.featureVwapAnalysis = false;
      S.sniperVwapWeight = 0;
      S.sniperMomentumWeight = 0;
      S.sniperVolumeWeight = 0;
      const dynamicCoreCollapsed = await storage.get(DYNAMIC_CORE_COLLAPSED_KEY); if (typeof dynamicCoreCollapsed === 'boolean') S.dynamicCoreCollapsed = dynamicCoreCollapsed;
      const dynamicStakeCollapsed = await storage.get(DYNAMIC_STAKE_COLLAPSED_KEY); if (typeof dynamicStakeCollapsed === 'boolean') S.dynamicStakeCollapsed = dynamicStakeCollapsed;
      const killerDynamicCollapsed = await storage.get(KILLER_DYNAMIC_COLLAPSED_KEY); if (typeof killerDynamicCollapsed === 'boolean') S.killerDynamicCollapsed = killerDynamicCollapsed;
      const killerEnabled = await storage.get(KILLER_ENABLED_KEY); if (typeof killerEnabled === 'boolean') S.killerEnabled = killerEnabled;
      const killerHudEnabled = await storage.get(KILLER_HUD_ENABLED_KEY); if (typeof killerHudEnabled === 'boolean') S.killerHudEnabled = killerHudEnabled;
      const killerMinConfluence = await storage.get(KILLER_MIN_CONFLUENCE_KEY); if (typeof killerMinConfluence === 'number') S.killerMinConfluence = Math.max(6, Math.min(7, Math.round(killerMinConfluence)));
      const killerDomThreshold = await storage.get(KILLER_DOM_THRESHOLD_KEY); if (typeof killerDomThreshold === 'number') S.killerDominanceThreshold = Math.max(50, Math.min(90, Math.round(killerDomThreshold)));
      const killerPerfectTime = await storage.get(KILLER_PERFECT_TIME_KEY); if (typeof killerPerfectTime === 'boolean') S.killerPerfectTimeEnabled = killerPerfectTime;
      const killerAdxDynamic = await storage.get(KILLER_ADX_DYNAMIC_KEY); if (typeof killerAdxDynamic === 'boolean') S.killerAdxDynamicEnabled = killerAdxDynamic;
      const killerCandleHardStop = await storage.get(KILLER_CANDLE_HARDSTOP_KEY); if (typeof killerCandleHardStop === 'boolean') S.killerCandleAgainstHardStop = killerCandleHardStop;
      const killerSignalCooldownSec = await storage.get(KILLER_SIGNAL_COOLDOWN_SEC_KEY); if (typeof killerSignalCooldownSec === 'number') S.killerSignalCooldownSec = Math.max(0, Math.min(30, Math.round(killerSignalCooldownSec)));
      const killerUseStrategyVotes = await storage.get(KILLER_USE_STRATEGY_VOTES_KEY); if (typeof killerUseStrategyVotes === 'boolean') S.killerUseStrategyVotes = killerUseStrategyVotes;
      const killerStrategyAgreement = await storage.get(KILLER_STRATEGY_AGREEMENT_KEY); if (typeof killerStrategyAgreement === 'number') S.killerStrategyAgreementMin = Math.max(1, Math.min(3, Math.round(killerStrategyAgreement)));
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

      S.mode = 'sniper';
      applySniperDefaults();
      const sniperBaseAmount = await storage.get(SNIPER_BASE_AMOUNT_KEY);
      if (typeof sniperBaseAmount === 'number') S.sniperBaseAmount = sniperBaseAmount;
      const sniperThreshold = await storage.get(SNIPER_THRESHOLD_KEY);
      if (typeof sniperThreshold === 'number') {
        const v = sniperThreshold > 1 ? (sniperThreshold / 100) : sniperThreshold;
        S.sniperThreshold = clamp01(v);
      }
      const sniperThresholdOtc = await storage.get(SNIPER_THRESHOLD_OTC_KEY);
      if (typeof sniperThresholdOtc === 'number') {
        const v = sniperThresholdOtc > 1 ? (sniperThresholdOtc / 100) : sniperThresholdOtc;
        S.sniperThresholdOtc = clamp01(v);
      }
      const sniperThresholdReal = await storage.get(SNIPER_THRESHOLD_REAL_KEY);
      if (typeof sniperThresholdReal === 'number') {
        const v = sniperThresholdReal > 1 ? (sniperThresholdReal / 100) : sniperThresholdReal;
        S.sniperThresholdReal = clamp01(v);
      }
      const sniperChopThreshold = await storage.get(SNIPER_CHOP_KEY);
      if (typeof sniperChopThreshold === 'number') S.sniperChopThreshold = sniperChopThreshold;
      // Legacy migration: old versions used pct/100 directly (e.g. 70% => 0.7, too strict for rangePct).
      if (Number.isFinite(S.sniperChopThreshold) && S.sniperChopThreshold > 0.06) {
        S.sniperChopThreshold = mapChopUiPctToThreshold(Math.round(S.sniperChopThreshold * 100));
      }
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
      if (typeof sniperVwapWeight === 'number') S.sniperVwapWeight = sniperVwapWeight > 1 ? clamp01(sniperVwapWeight / 100) : clamp01(sniperVwapWeight);
      const sniperMomentumWeight = await storage.get(SNIPER_MOMENTUM_WEIGHT_KEY);
      if (typeof sniperMomentumWeight === 'number') S.sniperMomentumWeight = sniperMomentumWeight > 1 ? clamp01(sniperMomentumWeight / 100) : clamp01(sniperMomentumWeight);
      const sniperVolumeWeight = await storage.get(SNIPER_VOLUME_WEIGHT_KEY);
      if (typeof sniperVolumeWeight === 'number') S.sniperVolumeWeight = sniperVolumeWeight > 1 ? clamp01(sniperVolumeWeight / 100) : clamp01(sniperVolumeWeight);
      const sniperVwapEnabled = await storage.get(SNIPER_VWAP_ENABLED_KEY);
      if (typeof sniperVwapEnabled === 'boolean') S.sniperVwapEnabled = sniperVwapEnabled;
      const sniperMomentumEnabled = await storage.get(SNIPER_MOMENTUM_ENABLED_KEY);
      if (typeof sniperMomentumEnabled === 'boolean') S.sniperMomentumEnabled = sniperMomentumEnabled;
      const sniperVolumeEnabled = await storage.get(SNIPER_VOLUME_ENABLED_KEY);
      if (typeof sniperVolumeEnabled === 'boolean') S.sniperVolumeEnabled = sniperVolumeEnabled;
      const sniperChopEnabled = await storage.get(SNIPER_CHOP_ENABLED_KEY);
      if (typeof sniperChopEnabled === 'boolean') S.sniperChopEnabled = sniperChopEnabled;
      const savedTimeframes = await storage.get(SNIPER_TIMEFRAMES_KEY);
      if (savedTimeframes && typeof savedTimeframes === 'object') {
        S.sniperEnabledTimeframes = Object.assign({}, S.sniperEnabledTimeframes, savedTimeframes);
        delete S.sniperEnabledTimeframes['15s'];
        delete S.sniperEnabledTimeframes['30m'];
        delete S.sniperEnabledTimeframes['3s'];
        delete S.sniperEnabledTimeframes['30s'];
      }
      const featureVolumeRejection = await storage.get(FEATURE_VOLUME_REJECTION_KEY);
      if (typeof featureVolumeRejection === 'boolean') S.featureVolumeRejection = featureVolumeRejection;
      const featureVwapAnalysis = await storage.get(FEATURE_VWAP_ANALYSIS_KEY);
      if (typeof featureVwapAnalysis === 'boolean') S.featureVwapAnalysis = featureVwapAnalysis;
      const featureSessionBoost = await storage.get(FEATURE_SESSION_BOOST_KEY);
      if (typeof featureSessionBoost === 'boolean') S.featureSessionBoost = featureSessionBoost;
      const aiVisionEnabled = await storage.get(AI_VISION_ENABLED_KEY); if (typeof aiVisionEnabled === 'boolean') S.aiVisionEnabled = aiVisionEnabled;
      const aiVisionMorning = await storage.get(AI_VISION_MORNING_STAR_KEY); if (typeof aiVisionMorning === 'boolean') S.aiVisionMorningStar = aiVisionMorning;
      const aiVisionEvening = await storage.get(AI_VISION_EVENING_STAR_KEY); if (typeof aiVisionEvening === 'boolean') S.aiVisionEveningStar = aiVisionEvening;
      const aiVisionRequire = await storage.get(AI_VISION_REQUIRE_MATCH_KEY); if (typeof aiVisionRequire === 'boolean') S.aiVisionRequireMatch = aiVisionRequire;
      const phaseCatch = await storage.get(PHASE_CATCH_MOVE_KEY); if (typeof phaseCatch === 'boolean') S.phaseCatchMoveEnabled = phaseCatch;
      const phaseReload = await storage.get(PHASE_RELOAD_SNIPER_KEY); if (typeof phaseReload === 'boolean') S.phaseReloadSniperEnabled = phaseReload;
      const featureTimeframes = await storage.get(FEATURE_TIMEFRAMES_KEY);
      if (featureTimeframes && typeof featureTimeframes === 'object') {
        S.sniperEnabledTimeframes = Object.assign({}, S.sniperEnabledTimeframes, featureTimeframes);
        // Remove deprecated TFs
        delete S.sniperEnabledTimeframes['15s'];
        delete S.sniperEnabledTimeframes['30m'];
        delete S.sniperEnabledTimeframes['3s'];
        delete S.sniperEnabledTimeframes['30s'];
      }
      const autoSwitchStrategy = await storage.get(STRATEGY_AUTO_SWITCH_KEY);
      if (typeof autoSwitchStrategy === 'boolean') S.autoSwitchStrategy = autoSwitchStrategy;
      const strategyWrWeight = await storage.get(STRATEGY_WR_WEIGHT_KEY);
      if (typeof strategyWrWeight === 'number') S.strategyWeightWr = strategyWrWeight;
      const strategyPnlWeight = await storage.get(STRATEGY_PNL_WEIGHT_KEY);
      if (typeof strategyPnlWeight === 'number') S.strategyWeightPnl = strategyPnlWeight;
      const strategyLearningTrades = await storage.get(STRATEGY_LEARNING_СДЕЛКИ_KEY);
      if (typeof strategyLearningTrades === 'number') S.strategyLearningTrades = strategyLearningTrades;
      const strategyLossStreakLimit = await storage.get(STRATEGY_ЗАГУБИ_STREAK_LIMIT_KEY);
      if (typeof strategyLossStreakLimit === 'number') S.strategyLossStreakLimit = strategyLossStreakLimit;
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
      const conflictStrength = await storage.get(CONFLICT_STRENGTH_KEY);
      if (typeof conflictStrength === 'number') S.conflictStrength = clamp01(conflictStrength);
    
    // --- NEW FILTERS (Advanced) ---
    S.filterSpreadEnabled = !!(await storage.get(FILTER_SPREAD_ENABLED_KEY, false));
    S.filterSpreadThreshold = clamp(parseNumberFlexible(await storage.get(FILTER_SPREAD_THRESHOLD_KEY, 20)) || 20, 0, 100);

    S.filterDriftEnabled = !!(await storage.get(FILTER_DRIFT_ENABLED_KEY, false));
    S.filterDriftThreshold = clamp(parseNumberFlexible(await storage.get(FILTER_DRIFT_THRESHOLD_KEY, 10)) || 10, 0, 100);

    S.filterFlipDelayEnabled = !!(await storage.get(FILTER_FLIPDELAY_ENABLED_KEY, false));
    S.filterFlipDelaySec = clamp(parseNumberFlexible(await storage.get(FILTER_FLIPDELAY_SEC_KEY, 20)) || 20, 0, 300);

    S.impulseCapEnabled = !!(await storage.get(FILTER_IMPULSECAP_ENABLED_KEY, false));
    S.impulseCapMaxPerCandle = clamp(parseNumberFlexible(await storage.get(FILTER_IMPULSECAP_MAX_KEY, 2)) || 2, 1, 5);


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
    const keepTabActiveEl = $id('iaa-sniper-keep-alive');
    if (keepTabActiveEl) keepTabActiveEl.checked = !!S.sniperKeepAliveEnabled;
    hookCheckbox(keepTabActiveEl, ()=>{ S.sniperKeepAliveEnabled = !!keepTabActiveEl.checked; S.sniperKeepAliveEnabled = S.sniperKeepAliveEnabled; try{ if (typeof persistSettings==='function') persistSettings(); }catch(e){} });
  // Delegated listener: settings UI may re-render; bind by id too
  if (!window.__iaa_keepAliveDelegated) {
    window.__iaa_keepAliveDelegated = true;
    document.addEventListener('change', (ev) => {
      const el = ev && ev.target;
      if (!el || el.id !== 'iaa-sniper-keep-alive') return;
      S.sniperKeepAliveEnabled = !!el.checked;
      S.sniperKeepAliveEnabled = S.sniperKeepAliveEnabled;
      try { persistSettings(); } catch (e) {}
    }, true);
  }


    hookCheckbox(IMPULSECAP_ENABLED, ()=>{ S.impulseCapEnabled = !!IMPULSECAP_ENABLED.checked; });
    hookInput(IMPULSECAP_MAX, ()=>{
      S.impulseCapMaxPerCandle = clamp(parseNumberFlexible(IMPULSECAP_MAX.value) || 2, 1, 5);


    hookCheckbox(RANGE_OSC_PENALTY_ENABLED, ()=>{ S.rangeOscPenaltyEnabled = !!RANGE_OSC_PENALTY_ENABLED.checked; });
    hookInput(RANGE_OSC_PENALTY, ()=>{ S.rangeOscPenaltyPct = clamp(parseNumberFlexible(RANGE_OSC_PENALTY.value) || 0, 0, 50); });
      paintBar(IMPULSECAP_BAR, S.impulseCapMaxPerCandle, 1, 5);
    });
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
      storage.set(ENTRY_WIN_TF_ENABLED_KEY, !!S.entryWindowTfEnabled);
      storage.set(ENTRY_WIN_1M_SEC_KEY, Number.isFinite(S.entryWindowSec1m) ? S.entryWindowSec1m : 35);
      storage.set(ENTRY_WIN_3M_SEC_KEY, Number.isFinite(S.entryWindowSec3m) ? S.entryWindowSec3m : 90);
      storage.set(ENTRY_WIN_5M_SEC_KEY, Number.isFinite(S.entryWindowSec5m) ? S.entryWindowSec5m : 150);
      storage.set(EARLY_ENTRY_1M_ENABLED_KEY, !!S.earlyEntry1mEnabled);
      storage.set(EARLY_ENTRY_3M_ENABLED_KEY, !!S.earlyEntry3mEnabled);
      storage.set(EARLY_ENTRY_5M_ENABLED_KEY, !!S.earlyEntry5mEnabled);
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
      storage.set(LOG_VERBOSITY_KEY, S.logVerbosity || 'normal');
      storage.set(DYNAMIC_CORE_COLLAPSED_KEY, !!S.dynamicCoreCollapsed);
      storage.set(DYNAMIC_STAKE_COLLAPSED_KEY, !!S.dynamicStakeCollapsed);
      storage.set(KILLER_DYNAMIC_COLLAPSED_KEY, !!S.killerDynamicCollapsed);
      storage.set(KILLER_ENABLED_KEY, !!S.killerEnabled);
      storage.set(KILLER_HUD_ENABLED_KEY, !!S.killerHudEnabled);
      storage.set(KILLER_MIN_CONFLUENCE_KEY, S.killerMinConfluence);
      storage.set(KILLER_DOM_THRESHOLD_KEY, S.killerDominanceThreshold);
      storage.set(KILLER_PERFECT_TIME_KEY, !!S.killerPerfectTimeEnabled);
      storage.set(KILLER_ADX_DYNAMIC_KEY, !!S.killerAdxDynamicEnabled);
      storage.set(KILLER_CANDLE_HARDSTOP_KEY, !!S.killerCandleAgainstHardStop);
      storage.set(KILLER_SIGNAL_COOLDOWN_SEC_KEY, S.killerSignalCooldownSec);
      storage.set(KILLER_USE_STRATEGY_VOTES_KEY, !!S.killerUseStrategyVotes);
      storage.set(KILLER_STRATEGY_AGREEMENT_KEY, S.killerStrategyAgreementMin);
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
      storage.set(SNIPER_KEEP_ALIVE_KEY, S.sniperKeepAliveEnabled);
      storage.set(KEEP_ALIVE_KEY, !!(S.keepAliveEnabled || S.sniperKeepAliveEnabled));
      storage.set(FILTERMODE_ENABLED_KEY, !!S.filterModeEnabled);
      storage.set(FILTERMODE_AUTO_KEY, !!S.filterModeAutoEnabled);
      storage.set(FILTERMODE_MANUAL_KEY, S.filterModeManual || 'soft');
      // Auto параметрите са сесийни (reset при reload) – не ги пазим в storage.
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
      storage.set(SNIPER_TIMEFRAMES_KEY, S.sniperEnabledTimeframes);
      storage.set(FEATURE_VOLUME_REJECTION_KEY, S.featureVolumeRejection);
      storage.set(FEATURE_VWAP_ANALYSIS_KEY, S.featureVwapAnalysis);
      storage.set(FEATURE_SESSION_BOOST_KEY, S.featureSessionBoost);
      storage.set(AI_VISION_ENABLED_KEY, S.aiVisionEnabled);
      storage.set(AI_VISION_MORNING_STAR_KEY, S.aiVisionMorningStar);
      storage.set(AI_VISION_EVENING_STAR_KEY, S.aiVisionEveningStar);
      storage.set(AI_VISION_REQUIRE_MATCH_KEY, S.aiVisionRequireMatch);
      storage.set(PHASE_CATCH_MOVE_KEY, !!S.phaseCatchMoveEnabled);
      storage.set(PHASE_RELOAD_SNIPER_KEY, !!S.phaseReloadSniperEnabled);
      storage.set(FEATURE_TIMEFRAMES_KEY, S.sniperEnabledTimeframes);
      storage.set(STRATEGY_AUTO_SWITCH_KEY, S.autoSwitchStrategy);
      storage.set(STRATEGY_WR_WEIGHT_KEY, S.strategyWeightWr);
      storage.set(STRATEGY_PNL_WEIGHT_KEY, S.strategyWeightPnl);
      storage.set(STRATEGY_LEARNING_СДЕЛКИ_KEY, S.strategyLearningTrades);
      storage.set(STRATEGY_ЗАГУБИ_STREAK_LIMIT_KEY, S.strategyLossStreakLimit);
      storage.set(STRATEGY_CONFIG_KEY, S.strategyConfigs);
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
      storage.set(CONFLICT_STRENGTH_KEY, S.conflictStrength);
      await storage.set(FILTER_SPREAD_ENABLED_KEY, !!S.filterSpreadEnabled);
      await storage.set(FILTER_SPREAD_THRESHOLD_KEY, Number(S.filterSpreadThreshold || 0));

      await storage.set(FILTER_DRIFT_ENABLED_KEY, !!S.filterDriftEnabled);
      await storage.set(FILTER_DRIFT_THRESHOLD_KEY, Number(S.filterDriftThreshold || 0));

      await storage.set(FILTER_FLIPDELAY_ENABLED_KEY, !!S.filterFlipDelayEnabled);
      await storage.set(FILTER_FLIPDELAY_SEC_KEY, Number(S.filterFlipDelaySec || 0));

      await storage.set(FILTER_IMPULSECAP_ENABLED_KEY, !!S.impulseCapEnabled);
      await storage.set(FILTER_IMPULSECAP_MAX_KEY, Number(S.impulseCapMaxPerCandle || 2));



      await storage.set(RANGE_OSC_PENALTY_ENABLED_KEY, !!S.rangeOscPenaltyEnabled);
      await storage.set(RANGE_OSC_PENALTY_PCT_KEY, Number(S.rangeOscPenaltyPct || 0));
      refreshUI('settingsChange');
    }
    function captureSettingsSnapshot(){}


    function restoreSettingsSnapshot(){}


    function renderSettingsPanel(){

      const modeSniper = $id('iaa-mode-sniper');
      if (modeSniper) modeSniper.style.flex = '1 1 100%';
      const sniperPanel = $id('iaa-settings-sniper');
      const sniperSettingsBody = $id('iaa-sniper-settings-body');
      const sniperCollapse = $id('iaa-sniper-collapse');
      const sniperWeightsToggle = $id('iaa-sniper-weights-toggle');
      const sniperWeightsBody = $id('iaa-sniper-weights-body');
      const newFiltersBody = $id('iaa-newfilters-body');
      const newFiltersToggle = $id('iaa-newfilters-toggle');

      const dynamicCoreBody = $id('iaa-dynamic-core-body');
      const dynamicStakeToggle = $id('iaa-dynamic-stake-toggle');
      const dynamicStakeBody = $id('iaa-dynamic-stake-body');
      const killerDynamicBody = $id('iaa-killer-dynamic-body');

      if (newFiltersToggle && newFiltersBody) {
        // Single binding (onclick) to avoid double-toggle after re-renders.
        newFiltersToggle.onclick = () => {
          S.sniperNewFiltersCollapsed = !S.sniperNewFiltersCollapsed;
          persistSettings();
          newFiltersBody.style.display = S.sniperNewFiltersCollapsed ? 'none' : '';
          newFiltersToggle.textContent = S.sniperNewFiltersCollapsed ? '▸' : '▾';
        };
        // Initial paint
        newFiltersBody.style.display = S.sniperNewFiltersCollapsed ? 'none' : '';
        newFiltersToggle.textContent = S.sniperNewFiltersCollapsed ? '▸' : '▾';
      }

      if (dynamicCoreBody) dynamicCoreBody.style.display = '';
      if (killerDynamicBody) killerDynamicBody.style.display = '';

      const sniperSmartToggle = $id('iaa-sniper-smart-toggle');
      const sniperSmartBody = $id('iaa-sniper-smart-body');
      const sniperEngineToggle = $id('iaa-sniper-engine-toggle');
      const sniperEngineBody = $id('iaa-sniper-engine-body');
      const sniperRiskToggle = $id('iaa-sniper-risk-toggle');
      const sniperRiskBody = $id('iaa-sniper-risk-body');
      const sniperThreshold = $id('iaa-sniper-threshold');
      const sniperThresholdOtc = $id('iaa-sniper-threshold-otc');
      const sniperThresholdReal = $id('iaa-sniper-threshold-real');
      const sniperBase = $id('iaa-sniper-base');
      const sniperMinPayout = $id('iaa-sniper-min-payout');
      const SNIPER_MIN_PAYOUT = sniperMinPayout;
      const SNIPER_MIN_PAYOUT_ENABLED = $id('iaa-sniper-min-payout-enabled');

      const ENTRY_WIN_ENABLED = $id('iaa-entrywin-enabled');
      const ENTRY_WIN_TF_1M = $id('iaa-entrywin-tf-1m');
      const ENTRY_WIN_TF_3M = $id('iaa-entrywin-tf-3m');
      const ENTRY_WIN_TF_5M = $id('iaa-entrywin-tf-5m');
      const ENTRY_WIN_1M = $id('iaa-entrywin-1m');
      const ENTRY_WIN_3M = $id('iaa-entrywin-3m');
      const ENTRY_WIN_5M = $id('iaa-entrywin-5m');
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
                  const sniperTf1m = $id('iaa-sniper-tf-1m');
      const sniperTf3m = $id('iaa-sniper-tf-3m');
      const sniperTf5m = $id('iaa-sniper-tf-5m');
                  const sniperKeepAlive = $id('iaa-sniper-keep-alive');
      if (sniperKeepAlive) sniperKeepAlive.checked = !!S.sniperKeepAliveEnabled;
      const keepAliveLabel = $id('iaa-sniper-keepalive-label');
      if (keepAliveLabel) keepAliveLabel.style.color = S.sniperKeepAliveEnabled ? '#22c55e' : UI_WARM_RED;
      const dynamicTimeToggleSettings = $id('iaa-dynamic-time-toggle-settings');
      const dynamicEnabledSettings = $id('iaa-dynamic-enabled-settings');
      const dynamicModeSettings = $id('iaa-dynamic-mode');
      const dynamicExpiryStepSettings = $id('iaa-dynamic-expiry-step-sec');
      const dynamicMinSecSettings = $id('iaa-dynamic-min-sec');
      const dynamicMaxSecSettings = $id('iaa-dynamic-max-sec');
      const dynamicEntryStepSettings = $id('iaa-dynamic-entry-step-sec');
      const dynamicLookbackSettings = $id('iaa-dynamic-lookback-sec');
      const dynamicMinSamplesSettings = $id('iaa-dynamic-min-samples');
      const dynamicMinWinrateSettings = $id('iaa-dynamic-min-winrate');
      const dynamicChopPenaltySettings = $id('iaa-dynamic-chop-penalty');
      const dynamicLatePenaltySettings = $id('iaa-dynamic-late-penalty');
      const dynamicNoTradeSettings = $id('iaa-dynamic-no-trade');
      const dynamicStakeScaleEnabledSettings = $id('iaa-dynamic-stake-scale-enabled');
      const dynamicStakeMult8Settings = $id('iaa-dynamic-stake-mult8');
      const dynamicStakeMult9Settings = $id('iaa-dynamic-stake-mult9');
      const dynamicStakeBoostSettings = $id('iaa-dynamic-stake-boost');
      const dynamicStakeBoostMinSamplesSettings = $id('iaa-dynamic-stake-boost-min-samples');
      const dynamicStakeLossReduceSettings = $id('iaa-dynamic-stake-loss-reduce');
      const logVerbositySettings = $id('iaa-log-verbosity');
      const featureVolumeRejection = $id('iaa-feature-volume-rejection');
      const featureVwapAnalysis = $id('iaa-feature-vwap-analysis');
      const featureSessionBoost = $id('iaa-feature-session-boost');
      const phaseCatchMove = $id('iaa-phase-catch-move');
      const phaseReloadSnipe = $id('iaa-phase-reload-snipe');
      const aiVisionEnabled = $id('iaa-ai-vision-enabled');
      const aiVisionMorningStar = $id('iaa-ai-vision-morning-star');
      const aiVisionEveningStar = $id('iaa-ai-vision-evening-star');
      const aiVisionRequireMatch = $id('iaa-ai-vision-require-match');
            const featureTf1m = $id('iaa-feature-tf-1m');
      const featureTf3m = $id('iaa-feature-tf-3m');
      const featureTf5m = $id('iaa-feature-tf-5m');
      const featureTf15m = $id('iaa-feature-tf-15m');
            const idleSwitchEnabled = $id('iaa-idle-switch-enabled');
      const idleSwitchMin = $id('iaa-idle-switch-min');
      const strategyAutoSwitch = $id('iaa-strategy-auto-switch');
      const strategyWeightWr = $id('iaa-strategy-weight-wr');
      const strategyWeightPnl = $id('iaa-strategy-weight-pnl');
      const strategyLearningTrades = $id('iaa-strategy-learning-trades');
      const strategyLossStreak = $id('iaa-strategy-loss-streak');
      const emaRsiPullbackEnabled = $id('iaa-strategy-ema-rsi-pullback-enabled');
      const scalpMicrotrendEnabled = $id('iaa-strategy-scalp-microtrend-enabled');
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
      if (sniperThreshold) sniperThreshold.value = Math.round(((S.sniperThreshold ?? 0.7) * 100));
      if (sniperBase) sniperBase.value = (S.sniperBaseAmount ?? 10000) / 100;
      if (sniperMinPayout) sniperMinPayout.value = Math.round(S.sniperMinPayout ?? 85);
      const sniperMinPayoutEnabled = $id('iaa-sniper-min-payout-enabled');
      if (sniperMinPayoutEnabled) sniperMinPayoutEnabled.checked = (S.sniperMinPayoutEnabled ?? true);
      if (sniperMinPayout && sniperMinPayoutEnabled) sniperMinPayout.disabled = !sniperMinPayoutEnabled.checked;
      if (ENTRY_WIN_ENABLED) ENTRY_WIN_ENABLED.checked = !!S.entryWindowTfEnabled;
      if (ENTRY_WIN_TF_1M) ENTRY_WIN_TF_1M.checked = !!S.earlyEntry1mEnabled;
      if (ENTRY_WIN_TF_3M) ENTRY_WIN_TF_3M.checked = !!S.earlyEntry3mEnabled;
      if (ENTRY_WIN_TF_5M) ENTRY_WIN_TF_5M.checked = !!S.earlyEntry5mEnabled;
      if (ENTRY_WIN_1M) ENTRY_WIN_1M.value = Number.isFinite(S.entryWindowSec1m) ? S.entryWindowSec1m : 35;
      if (ENTRY_WIN_3M) ENTRY_WIN_3M.value = Number.isFinite(S.entryWindowSec3m) ? S.entryWindowSec3m : 90;
      if (ENTRY_WIN_5M) ENTRY_WIN_5M.value = Number.isFinite(S.entryWindowSec5m) ? S.entryWindowSec5m : 150;
      if (sniperChop) sniperChop.value = mapChopThresholdToUiPct(S.sniperChopThreshold ?? SNIPER_5S_DEFAULTS.chopThreshold);
      if (sniperWarmup) sniperWarmup.value = S.sniperWarmupMin ?? 10;
      if (sniperMaxSessionLoss) sniperMaxSessionLoss.value = (S.maxSessionLossCents || 0) / 100;
      if (sniperMaxLossStreak) sniperMaxLossStreak.value = S.maxConsecutiveLosses || 0;
      if (sniperVwap) sniperVwap.value = Number((((S.sniperVwapDeviation ?? SNIPER_5S_DEFAULTS.vwapDeviation) * 100)).toFixed(2));
      if (sniperMomentum) sniperMomentum.value = Number((((S.sniperMomentumThreshold ?? SNIPER_5S_DEFAULTS.momentumThreshold) * 100)).toFixed(2));
      if (sniperVwapLookback) sniperVwapLookback.value = S.sniperVwapLookbackMin ?? SNIPER_5S_DEFAULTS.vwapLookbackMin;
      if (sniperVolumeThreshold) sniperVolumeThreshold.value = S.sniperVolumeThreshold ?? SNIPER_5S_DEFAULTS.volumeThreshold;
      if (sniperVwapEnabled) sniperVwapEnabled.checked = !!S.sniperVwapEnabled;
      if (sniperMomentumEnabled) sniperMomentumEnabled.checked = !!S.sniperMomentumEnabled;
      if (sniperVolumeEnabled) sniperVolumeEnabled.checked = !!S.sniperVolumeEnabled;
      if (sniperChopEnabled) sniperChopEnabled.checked = !!S.sniperChopEnabled;
      if (sniperVwapWeight) sniperVwapWeight.value = Math.round(((S.sniperVwapWeight ?? 0.55) * 100));
      if (sniperMomentumWeight) sniperMomentumWeight.value = Math.round(((S.sniperMomentumWeight ?? 0.35) * 100));
      if (sniperVolumeWeight) sniperVolumeWeight.value = Math.round(((S.sniperVolumeWeight ?? 0.10) * 100));
      if (sniperEmaFast) sniperEmaFast.value = S.sniperEmaFast ?? SNIPER_5S_DEFAULTS.emaFast;
      if (sniperEmaSlow) sniperEmaSlow.value = S.sniperEmaSlow ?? SNIPER_5S_DEFAULTS.emaSlow;
            if (sniperTf1m) sniperTf1m.checked = S.sniperEnabledTimeframes['1m'];
      if (sniperTf3m) sniperTf3m.checked = S.sniperEnabledTimeframes['3m'];
      if (sniperTf5m) sniperTf5m.checked = S.sniperEnabledTimeframes['5m'];
      if (sniperKeepAlive) sniperKeepAlive.checked = S.sniperKeepAliveEnabled;
      if (dynamicEnabledSettings) dynamicEnabledSettings.checked = !!S.dynamicExpiryEnabled;
      if (dynamicModeSettings) dynamicModeSettings.value = getDynamicMode();
      if (dynamicExpiryStepSettings) dynamicExpiryStepSettings.value = Number.isFinite(S.dynamicExpiryStepSec) ? S.dynamicExpiryStepSec : 5;
      if (dynamicMinSecSettings) dynamicMinSecSettings.value = Number.isFinite(S.dynamicMinSec) ? S.dynamicMinSec : 15;
      if (dynamicMaxSecSettings) dynamicMaxSecSettings.value = Number.isFinite(S.dynamicMaxSec) ? S.dynamicMaxSec : 300;
      if (dynamicEntryStepSettings) dynamicEntryStepSettings.value = Number.isFinite(S.dynamicEntryStepSec) ? S.dynamicEntryStepSec : 5;
      if (dynamicLookbackSettings) dynamicLookbackSettings.value = Number.isFinite(S.dynamicLookbackSec) ? S.dynamicLookbackSec : 600;
      if (dynamicMinSamplesSettings) dynamicMinSamplesSettings.value = Number.isFinite(S.dynamicMinSamples) ? S.dynamicMinSamples : 40;
      if (dynamicMinWinrateSettings) dynamicMinWinrateSettings.value = Math.round(clamp01(S.dynamicMinWinrate ?? 0.55) * 100);
      if (dynamicChopPenaltySettings) dynamicChopPenaltySettings.value = Math.round(Math.max(0, Number(S.dynamicChopPenalty ?? 0.03)) * 100);
      if (dynamicLatePenaltySettings) dynamicLatePenaltySettings.value = Math.round(Math.max(0, Number(S.dynamicLatePenalty ?? 0.02)) * 100);
      if (dynamicNoTradeSettings) dynamicNoTradeSettings.checked = !!S.dynamicAllowNoTrade;
      if (dynamicStakeScaleEnabledSettings) dynamicStakeScaleEnabledSettings.checked = !!S.dynamicStakeScaleEnabled;
      if (dynamicStakeMult8Settings) dynamicStakeMult8Settings.value = Number(S.dynamicStakeMult8 ?? 0.15).toFixed(2);
      if (dynamicStakeMult9Settings) dynamicStakeMult9Settings.value = Number(S.dynamicStakeMult9 ?? 0.30).toFixed(2);
      if (dynamicStakeBoostSettings) dynamicStakeBoostSettings.value = Number(S.dynamicStakeBoostWr ?? 0.05).toFixed(2);
      if (dynamicStakeBoostMinSamplesSettings) dynamicStakeBoostMinSamplesSettings.value = Math.round(Number(S.dynamicStakeBoostMinSamples ?? 60));
      if (dynamicStakeLossReduceSettings) dynamicStakeLossReduceSettings.value = Math.round(Math.max(0, Number(S.dynamicStakeLossReduce ?? 0.10)) * 100);
      if (logVerbositySettings) {
        logVerbositySettings.value = getLogVerbosity();
        if (!logVerbositySettings.dataset.bound) {
          logVerbositySettings.dataset.bound = '1';
          logVerbositySettings.addEventListener('change', () => {
            const v = String(logVerbositySettings.value || 'normal');
            S.logVerbosity = ['minimal', 'normal', 'detailed'].includes(v) ? v : 'normal';
            persistSettings();
          });
        }
      }
      const killerEnabledSettings = $id('iaa-killer-enabled');
      const killerHudEnabledSettings = $id('iaa-killer-hud-enabled');
      const killerMinConfluenceSettings = $id('iaa-killer-min-confluence');
      const killerDomThresholdSettings = $id('iaa-killer-dominance-threshold');
      const killerPerfectTimeSettings = $id('iaa-killer-perfect-time');
      const killerCooldownSettings = $id('iaa-killer-cooldown-sec');
      const killerAdxDynamicSettings = $id('iaa-killer-adx-dynamic');
      const killerCandleHardStopSettings = $id('iaa-killer-candle-hardstop');
      const killerUseStrategyVotesSettings = $id('iaa-killer-use-strategy-votes');
      const killerStrategyAgreementSettings = $id('iaa-killer-strategy-agreement');
      if (killerEnabledSettings) killerEnabledSettings.checked = !!S.killerEnabled;
      if (killerHudEnabledSettings) killerHudEnabledSettings.checked = !!S.killerHudEnabled;
      if (killerMinConfluenceSettings) killerMinConfluenceSettings.value = Math.max(6, Math.min(7, Math.round(S.killerMinConfluence || 6)));
      if (killerDomThresholdSettings) killerDomThresholdSettings.value = Math.max(50, Math.min(90, Math.round(S.killerDominanceThreshold || 68)));
      if (killerPerfectTimeSettings) killerPerfectTimeSettings.checked = !!S.killerPerfectTimeEnabled;
      if (killerCooldownSettings) killerCooldownSettings.value = Math.max(0, Math.min(30, Math.round(S.killerSignalCooldownSec || 5)));
      if (killerAdxDynamicSettings) killerAdxDynamicSettings.checked = !!S.killerAdxDynamicEnabled;
      if (killerCandleHardStopSettings) killerCandleHardStopSettings.checked = !!S.killerCandleAgainstHardStop;
      if (killerUseStrategyVotesSettings) killerUseStrategyVotesSettings.checked = !!S.killerUseStrategyVotes;
      if (killerStrategyAgreementSettings) killerStrategyAgreementSettings.value = Math.max(1, Math.min(3, Math.round(S.killerStrategyAgreementMin || 1)));
      if (featureVolumeRejection) featureVolumeRejection.checked = !!S.featureVolumeRejection;
      if (featureVwapAnalysis) featureVwapAnalysis.checked = !!S.featureVwapAnalysis;
      if (featureSessionBoost) featureSessionBoost.checked = !!S.featureSessionBoost;
      if (phaseCatchMove) phaseCatchMove.checked = !!S.phaseCatchMoveEnabled;
      if (phaseReloadSnipe) phaseReloadSnipe.checked = !!S.phaseReloadSniperEnabled;
      if (aiVisionEnabled) aiVisionEnabled.checked = !!S.aiVisionEnabled;
      if (aiVisionMorningStar) aiVisionMorningStar.checked = !!S.aiVisionMorningStar;
      if (aiVisionEveningStar) aiVisionEveningStar.checked = !!S.aiVisionEveningStar;
      if (aiVisionRequireMatch) aiVisionRequireMatch.checked = !!S.aiVisionRequireMatch;
      if (featureTf1m) featureTf1m.checked = !!S.sniperEnabledTimeframes?.['1m'];
      if (featureTf3m) featureTf3m.checked = !!S.sniperEnabledTimeframes?.['3m'];
      if (featureTf5m) featureTf5m.checked = !!S.sniperEnabledTimeframes?.['5m'];
      if (featureTf15m) featureTf15m.checked = !!S.sniperEnabledTimeframes?.['15m'];
      if (emaRsiPullbackEnabled) emaRsiPullbackEnabled.checked = isStrategyEnabled('ema_rsi_pullback');
      if (scalpMicrotrendEnabled) scalpMicrotrendEnabled.checked = isStrategyEnabled('scalp_microtrend');
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
      const vwapMax = (SNIPER_5S_DEFAULTS.vwapDeviation || 0.0012) * 2;
      const momentumMax = (SNIPER_5S_DEFAULTS.momentumThreshold || 0.0014) * 2;
      if (sniperThreshold) applyStrictnessColor(sniperThreshold, parseNumberFlexible(sniperThreshold.value), { min: 0, max: 1, highIsStrict: true });
      if (sniperVwap) applyStrictnessColor(sniperVwap, parseNumberFlexible(sniperVwap.value), { min: 0, max: vwapMax, highIsStrict: true });
      if (sniperMomentum) applyStrictnessColor(sniperMomentum, parseNumberFlexible(sniperMomentum.value), { min: 0, max: momentumMax, highIsStrict: true });
      if (sniperVwapWeight) applyStrictnessColor(sniperVwapWeight, parseNumberFlexible(sniperVwapWeight.value), { min: 1, max: 100, highIsStrict: true });
      if (sniperMomentumWeight) applyStrictnessColor(sniperMomentumWeight, parseNumberFlexible(sniperMomentumWeight.value), { min: 1, max: 100, highIsStrict: false });
      if (sniperVolumeWeight) applyStrictnessColor(sniperVolumeWeight, parseNumberFlexible(sniperVolumeWeight.value), { min: 1, max: 100, highIsStrict: false });
      if (sniperChop) applyStrictnessColor(sniperChop, parseNumberFlexible(sniperChop.value), { min: 1, max: 100, highIsStrict: true });
      if (sniperVolumeThreshold) applyStrictnessColor(sniperVolumeThreshold, parseNumberFlexible(sniperVolumeThreshold.value), { min: 0, max: 1, highIsStrict: true });
      if (regimeStrength) applyStrictnessColor(regimeStrength, parseNumberFlexible(regimeStrength.value), { min: 0, max: 1, highIsStrict: true });
      if (confirmationStrength) applyStrictnessColor(confirmationStrength, parseNumberFlexible(confirmationStrength.value), { min: 0, max: 1, highIsStrict: true });
      if (biasStrength) applyStrictnessColor(biasStrength, parseNumberFlexible(biasStrength.value), { min: 0, max: 1, highIsStrict: true });
      if (conflictStrength) applyStrictnessColor(conflictStrength, parseNumberFlexible(conflictStrength.value), { min: 0, max: 1, highIsStrict: true });
      // Mini bars (проба само на 2 реда)
      if (sniperThreshold) setMiniBar('iaa-bar-threshold', parseNumberFlexible(sniperThreshold.value), 1, 100, 10, { highIsStrict: true });
      if (sniperVwap) setMiniBar('iaa-bar-vwapdev', parseNumberFlexible(sniperVwap.value), 0, 0.30, 10, { highIsStrict: true });
      applySettingsInputColors();

      if (sniperSettingsBody) sniperSettingsBody.style.display = S.sniperSettingsCollapsed ? 'none' : 'block';
      if (sniperCollapse) sniperCollapse.textContent = S.sniperSettingsCollapsed ? '▸' : '▾';
      if (sniperWeightsBody) sniperWeightsBody.style.display = S.sniperWeightsCollapsed ? 'none' : 'block';
      if (sniperWeightsToggle) sniperWeightsToggle.textContent = S.sniperWeightsCollapsed ? '▸' : '▾';
      if (newFiltersBody) newFiltersBody.style.display = S.sniperNewFiltersCollapsed ? 'none' : 'block';
      if (newFiltersToggle) newFiltersToggle.textContent = S.sniperNewFiltersCollapsed ? '▸' : '▾';
      if (dynamicCoreBody) dynamicCoreBody.style.display = 'block';
      if (dynamicStakeBody) dynamicStakeBody.style.display = S.dynamicStakeCollapsed ? 'none' : 'block';
      if (dynamicStakeToggle) dynamicStakeToggle.textContent = S.dynamicStakeCollapsed ? '▸' : '▾';
      if (killerDynamicBody) killerDynamicBody.style.display = 'block';
      if (sniperSmartBody) sniperSmartBody.style.display = S.sniperSmartCollapsed ? 'none' : 'block';
      if (sniperSmartToggle) sniperSmartToggle.textContent = S.sniperSmartCollapsed ? '▸' : '▾';
      if (sniperEngineBody) sniperEngineBody.style.display = S.sniperEngineCollapsed ? 'none' : 'block';
      if (sniperEngineToggle) sniperEngineToggle.textContent = S.sniperEngineCollapsed ? '▸' : '▾';
      if (sniperRiskBody) sniperRiskBody.style.display = S.sniperRiskCollapsed ? 'none' : 'block';
      if (sniperRiskToggle) sniperRiskToggle.textContent = S.sniperRiskCollapsed ? '▸' : '▾';
      if (sniperPanel) sniperPanel.style.display = 'block';
      const tabBodies = {
        basic: $id('iaa-tab-basic'),
        advanced: $id('iaa-tab-advanced'),
        features: $id('iaa-tab-features'),
        analyses: $id('iaa-tab-analyses'),
        dynamic: $id('iaa-tab-dynamic')
      };
      if (!tabBodies[S.sniperSettingsTab]) {
        S.sniperSettingsTab = 'basic';
      }
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
          S.sniperSettingsTab = tab;
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
          S.sniperSettingsTab = tab;
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
          toggleBtn.classList.toggle('stop', S.running);
          toggleBtn.classList.toggle('is-running', S.running);
          toggleBtn.classList.toggle('is-stopped', !S.running);
          const dotEl = $id('iaa-dot');
          if (dotEl) {
            dotEl.style.background = S.running ? '#22c55e' : '#ef4444';
            dotEl.style.boxShadow = S.running ? '0 0 8px rgba(34,197,94,.85)' : '0 0 8px rgba(239,68,68,.85)';
          }
          if (S.running) { 
            startEngineLoops(); 
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
            S.sniperWarmupUntil = Date.now();
            S.priceHistory = [];
            S.currentAssetPrice = null;
            S.lastPriceAt = 0;
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
            refreshUI('start/stop');
            
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
            stopEngineLoops();
            stopKeepAlive();
            stopPriceMonitoring();
            S.assetSelecting = false;
            S.assetSelectedForSignal = false;
            S.assetSelectionAttempted = false;
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
            refreshUI('legacy_direct_render_replaced');
            try { sessionStop(); } catch (e) {}
            logConsoleLine(formatStatus('bot_stopped'));
            refreshUI('start/stop');
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
      const dynamicMinSecInput = $id('iaa-dynamic-min-sec');
      const dynamicMaxSecInput = $id('iaa-dynamic-max-sec');
      const dynamicEntryStepInput = $id('iaa-dynamic-entry-step-sec');
      const dynamicLookbackInput = $id('iaa-dynamic-lookback-sec');
      const dynamicMinSamplesInput = $id('iaa-dynamic-min-samples');
      const dynamicMinWinrateInput = $id('iaa-dynamic-min-winrate');
      const dynamicChopPenaltyInput = $id('iaa-dynamic-chop-penalty');
      const dynamicLatePenaltyInput = $id('iaa-dynamic-late-penalty');
      const dynamicNoTradeInput = $id('iaa-dynamic-no-trade');
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
          dynamicMinSecInput,
          dynamicMaxSecInput,
          dynamicEntryStepInput,
          dynamicLookbackInput,
          dynamicMinSamplesInput,
          dynamicMinWinrateInput,
          dynamicChopPenaltyInput,
          dynamicLatePenaltyInput,
          dynamicNoTradeInput,
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
      if (dynamicMinSecInput) dynamicMinSecInput.addEventListener('input', () => { const d = parseNumberFlexible(dynamicMinSecInput.value); S.dynamicMinSec = Math.max(3, Math.min(3600, Math.round(Number.isFinite(d) ? d : 15))); persistSettings(); });
      if (dynamicMaxSecInput) dynamicMaxSecInput.addEventListener('input', () => { const d = parseNumberFlexible(dynamicMaxSecInput.value); S.dynamicMaxSec = Math.max(3, Math.min(3600, Math.round(Number.isFinite(d) ? d : 300))); persistSettings(); });
      if (dynamicEntryStepInput) dynamicEntryStepInput.addEventListener('input', () => { const d = parseNumberFlexible(dynamicEntryStepInput.value); S.dynamicEntryStepSec = Math.max(1, Math.min(30, Math.round(Number.isFinite(d) ? d : 5))); persistSettings(); });
      if (dynamicLookbackInput) dynamicLookbackInput.addEventListener('input', () => { const d = parseNumberFlexible(dynamicLookbackInput.value); S.dynamicLookbackSec = Math.max(60, Math.min(3600, Math.round(Number.isFinite(d) ? d : 600))); persistSettings(); });
      if (dynamicMinSamplesInput) dynamicMinSamplesInput.addEventListener('input', () => { const d = parseNumberFlexible(dynamicMinSamplesInput.value); S.dynamicMinSamples = Math.max(5, Math.min(1000, Math.round(Number.isFinite(d) ? d : 40))); persistSettings(); });
      if (dynamicMinWinrateInput) dynamicMinWinrateInput.addEventListener('input', () => { const d = parseNumberFlexible(dynamicMinWinrateInput.value); S.dynamicMinWinrate = clamp01((Number.isFinite(d) ? d : 55) / 100); persistSettings(); });
      if (dynamicChopPenaltyInput) dynamicChopPenaltyInput.addEventListener('input', () => { const d = parseNumberFlexible(dynamicChopPenaltyInput.value); S.dynamicChopPenalty = Math.max(0, Math.min(1, (Number.isFinite(d) ? d : 3) / 100)); persistSettings(); });
      if (dynamicLatePenaltyInput) dynamicLatePenaltyInput.addEventListener('input', () => { const d = parseNumberFlexible(dynamicLatePenaltyInput.value); S.dynamicLatePenalty = Math.max(0, Math.min(1, (Number.isFinite(d) ? d : 2) / 100)); persistSettings(); });
      if (dynamicNoTradeInput) dynamicNoTradeInput.addEventListener('change', () => { S.dynamicAllowNoTrade = !!dynamicNoTradeInput.checked; persistSettings(); });
      if (dynamicStakeScaleEnabledInput) dynamicStakeScaleEnabledInput.addEventListener('change', () => { S.dynamicStakeScaleEnabled = !!dynamicStakeScaleEnabledInput.checked; persistSettings(); });
      if (dynamicStakeMult8Input) dynamicStakeMult8Input.addEventListener('input', () => { const d = parseNumberFlexible(dynamicStakeMult8Input.value); S.dynamicStakeMult8 = Math.max(0, Math.min(2, Number.isFinite(d) ? d : 0.15)); persistSettings(); });
      if (dynamicStakeMult9Input) dynamicStakeMult9Input.addEventListener('input', () => { const d = parseNumberFlexible(dynamicStakeMult9Input.value); S.dynamicStakeMult9 = Math.max(0, Math.min(2, Number.isFinite(d) ? d : 0.30)); persistSettings(); });
      if (dynamicStakeBoostInput) dynamicStakeBoostInput.addEventListener('input', () => { const d = parseNumberFlexible(dynamicStakeBoostInput.value); S.dynamicStakeBoostWr = Math.max(0, Math.min(1, Number.isFinite(d) ? d : 0.05)); persistSettings(); });
      if (dynamicStakeBoostMinSamplesInput) dynamicStakeBoostMinSamplesInput.addEventListener('input', () => { const d = parseNumberFlexible(dynamicStakeBoostMinSamplesInput.value); S.dynamicStakeBoostMinSamples = Math.max(1, Math.min(2000, Math.round(Number.isFinite(d) ? d : 60))); persistSettings(); });
      if (dynamicStakeLossReduceInput) dynamicStakeLossReduceInput.addEventListener('input', () => { const d = parseNumberFlexible(dynamicStakeLossReduceInput.value); S.dynamicStakeLossReduce = Math.max(0, Math.min(1, (Number.isFinite(d) ? d : 10) / 100)); persistSettings(); });
      // --- KILLER settings (bind after elements exist) ---
      const killerEnabledSettings = $id('iaa-killer-enabled');
      const killerHudEnabledSettings = $id('iaa-killer-hud-enabled');
      const killerMinConfluenceSettings = $id('iaa-killer-min-confluence');
      const killerDomThresholdSettings = $id('iaa-killer-dominance-threshold');
      const killerPerfectTimeSettings = $id('iaa-killer-perfect-time');
      const killerCooldownSettings = $id('iaa-killer-cooldown-sec');
      const killerAdxDynamicSettings = $id('iaa-killer-adx-dynamic');
      const killerCandleHardstopSettings = $id('iaa-killer-candle-hardstop');
      const killerUseStrategyVotesSettings = $id('iaa-killer-use-strategy-votes');
      const killerStrategyAgreementSettings = $id('iaa-killer-strategy-agreement');

      if (killerEnabledSettings) killerEnabledSettings.addEventListener('change', () => { S.killerEnabled = !!killerEnabledSettings.checked; void persistSettings(); });
      if (killerHudEnabledSettings) killerHudEnabledSettings.addEventListener('change', () => { S.killerHudEnabled = !!killerHudEnabledSettings.checked; void persistSettings(); });
      if (killerMinConfluenceSettings) killerMinConfluenceSettings.addEventListener('change', () => { const v = parseNumberFlexible(killerMinConfluenceSettings.value); S.killerMinConfluence = Math.max(6, Math.min(7, Math.round(Number.isFinite(v) ? v : 6))); void persistSettings(); });
      if (killerDomThresholdSettings) killerDomThresholdSettings.addEventListener('input', () => { const v = parseNumberFlexible(killerDomThresholdSettings.value); S.killerDominanceThreshold = Math.max(50, Math.min(90, Math.round(Number.isFinite(v) ? v : 68))); void persistSettings(); });
      if (killerPerfectTimeSettings) killerPerfectTimeSettings.addEventListener('change', () => { S.killerPerfectTimeEnabled = !!killerPerfectTimeSettings.checked; void persistSettings(); });
      if (killerCooldownSettings) killerCooldownSettings.addEventListener('input', () => { const v = parseNumberFlexible(killerCooldownSettings.value); S.killerSignalCooldownSec = Math.max(0, Math.min(30, Math.round(Number.isFinite(v) ? v : 5))); void persistSettings(); });
      if (killerAdxDynamicSettings) killerAdxDynamicSettings.addEventListener('change', () => { S.killerAdxDynamicEnabled = !!killerAdxDynamicSettings.checked; void persistSettings(); });
      if (killerCandleHardstopSettings) killerCandleHardstopSettings.addEventListener('change', () => { S.killerCandleAgainstHardStop = !!killerCandleHardstopSettings.checked; void persistSettings(); });
      if (killerUseStrategyVotesSettings) killerUseStrategyVotesSettings.addEventListener('change', () => { S.killerUseStrategyVotes = !!killerUseStrategyVotesSettings.checked; void persistSettings(); });
      if (killerStrategyAgreementSettings) killerStrategyAgreementSettings.addEventListener('change', () => { const v = parseNumberFlexible(killerStrategyAgreementSettings.value); S.killerStrategyAgreementMin = Math.max(1, Math.min(3, Math.round(Number.isFinite(v) ? v : 1))); void persistSettings(); });
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
      const SNIPER_MAX_SESSION_ЗАГУБИ = $id('iaa-sniper-max-session-loss');
      const SNIPER_MAX_ЗАГУБИ_STREAK = $id('iaa-sniper-max-loss-streak');
      const MODE_SNIPER = $id('iaa-mode-sniper');
      const SNIPER_THRESHOLD = $id('iaa-sniper-threshold');
      const SNIPER_THRESHOLD_OTC = $id('iaa-sniper-threshold-otc');
      const SNIPER_THRESHOLD_REAL = $id('iaa-sniper-threshold-real');
      const SNIPER_BASE = $id('iaa-sniper-base');
      const SNIPER_MIN_PAYOUT = $id('iaa-sniper-min-payout');
      const DYNAMIC_ENABLED_SETTINGS = $id('iaa-dynamic-enabled-settings');
      const DYNAMIC_MODE_SETTINGS = $id('iaa-dynamic-mode');
      const DYNAMIC_MIN_SEC_SETTINGS = $id('iaa-dynamic-min-sec');
      const DYNAMIC_MAX_SEC_SETTINGS = $id('iaa-dynamic-max-sec');
      const DYNAMIC_NO_TRADE_SETTINGS = $id('iaa-dynamic-no-trade');
      const KILLER_ENABLED_SETTINGS = $id('iaa-killer-enabled');
      const KILLER_HUD_ENABLED_SETTINGS = $id('iaa-killer-hud-enabled');
      const KILLER_MIN_CONFLUENCE_SETTINGS = $id('iaa-killer-min-confluence');
      const KILLER_DOM_THRESHOLD_SETTINGS = $id('iaa-killer-dominance-threshold');
      const KILLER_PERFECT_TIME_SETTINGS = $id('iaa-killer-perfect-time');
      const KILLER_COOLDOWN_SETTINGS = $id('iaa-killer-cooldown-sec');
      const KILLER_ADX_DYNAMIC_SETTINGS = $id('iaa-killer-adx-dynamic');
      const KILLER_CANDLE_HARDSTOP_SETTINGS = $id('iaa-killer-candle-hardstop');
      const KILLER_USE_STRATEGY_VOTES_SETTINGS = $id('iaa-killer-use-strategy-votes');
      const KILLER_STRATEGY_AGREEMENT_SETTINGS = $id('iaa-killer-strategy-agreement');
      const entryWinEnabledEl = $id('iaa-entrywin-enabled');
      const entryWinTf1mEl = $id('iaa-entrywin-tf-1m');
      const entryWinTf3mEl = $id('iaa-entrywin-tf-3m');
      const entryWinTf5mEl = $id('iaa-entrywin-tf-5m');
      const entryWin1mEl = $id('iaa-entrywin-1m');
      const entryWin3mEl = $id('iaa-entrywin-3m');
      const entryWin5mEl = $id('iaa-entrywin-5m');
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
      const SNIPER_SETTINGS_COLLAPSE = $id('iaa-sniper-collapse');
      const SNIPER_VWAP_TOGGLE = $id('iaa-sniper-vwap-toggle');
      const KEEP_TAB_ACTIVE = $id('iaa-sniper-keep-alive');
      const SNIPER_WEIGHTS_TOGGLE = $id('iaa-sniper-weights-toggle');
      const SNIPER_SMART_TOGGLE = $id('iaa-sniper-smart-toggle');
      const SNIPER_ENGINE_TOGGLE = $id('iaa-sniper-engine-toggle');
      const SNIPER_RISK_TOGGLE = $id('iaa-sniper-risk-toggle');
                  const SNIPER_TF_1M = $id('iaa-sniper-tf-1m');
      const SNIPER_TF_3M = $id('iaa-sniper-tf-3m');
      const SNIPER_TF_5M = $id('iaa-sniper-tf-5m');
                  const SNIPER_KEEP_ALIVE = $id('iaa-sniper-keep-alive');
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
      const STRATEGY_AUTO_SWITCH = $id('iaa-strategy-auto-switch');
      const STRATEGY_WEIGHT_WR = $id('iaa-strategy-weight-wr');
      const STRATEGY_WEIGHT_PNL = $id('iaa-strategy-weight-pnl');
      const STRATEGY_LEARNING = $id('iaa-strategy-learning-trades');
      const STRATEGY_ЗАГУБИ_STREAK = $id('iaa-strategy-loss-streak');
      const STRATEGY_EMA_RSI_PULLBACK = $id('iaa-strategy-ema-rsi-pullback-enabled');
      const STRATEGY_SCALP_MICROTREND = $id('iaa-strategy-scalp-microtrend-enabled');
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
      const STRATEGY_AUTO_SWITCH_PANEL = $id('iaa-strategy-auto-switch-panel');
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
      if (SNIPER_MAX_SESSION_ЗАГУБИ) {
        SNIPER_MAX_SESSION_ЗАГУБИ.addEventListener('input', () => {
          const d = parseNumberFlexible(SNIPER_MAX_SESSION_ЗАГУБИ.value) || 0;
          S.maxSessionLossCents = Math.max(0, Math.round(d)) * 100;
          persistSettings();
        });
      }
      if (SNIPER_MAX_ЗАГУБИ_STREAK) {
        SNIPER_MAX_ЗАГУБИ_STREAK.addEventListener('input', () => {
          const d = parseNumberFlexible(SNIPER_MAX_ЗАГУБИ_STREAK.value) || 0;
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
      if (MODE_SNIPER) {
        MODE_SNIPER.addEventListener('click', () => {
          setMode('sniper');
          logConsoleLine('Режим: СНАЙПЕР');
        });
      }
      if (SNIPER_THRESHOLD) {
        SNIPER_THRESHOLD.addEventListener('input', () => {
          const d = parseNumberFlexible(SNIPER_THRESHOLD.value) || 0;
          const pct = Math.max(1, Math.min(100, Math.round(d)));
          S.sniperThreshold = pct / 100;
          applyStrictnessColor(SNIPER_THRESHOLD, pct, { min: 1, max: 100, highIsStrict: true });
          setMiniBar('iaa-bar-threshold', pct, 1, 100, 10, { highIsStrict: true });
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
          const d = parseNumberFlexible(SNIPER_MIN_PAYOUT.value);
          const v = Number.isFinite(d) ? Math.round(d) : 70;
          const clamped = Math.max(60, Math.min(92, v));
          SNIPER_MIN_PAYOUT.value = String(clamped);
          S.sniperMinPayout = clamped;
          persistSettings();
        });
}
      if (entryWinEnabledEl || entryWin1mEl || entryWin3mEl || entryWin5mEl) {
        const bindOnce = (el, evt, fn) => {
          if (!el) return;
          const key = `bound_${evt}`;
          if (el.dataset[key]) return;
          el.dataset[key] = '1';
          el.addEventListener(evt, fn);
        };
        const updateEntryWinUi = () => {
          const en = !!(entryWinEnabledEl ? entryWinEnabledEl.checked : true);
          S.entryWindowTfEnabled = en;
          if (entryWin1mEl) entryWin1mEl.disabled = !en;
          if (entryWin3mEl) entryWin3mEl.disabled = !en;
          if (entryWin5mEl) entryWin5mEl.disabled = !en;
          persistSettings();
        };
        bindOnce(entryWinEnabledEl, 'change', updateEntryWinUi);
                bindOnce(entryWin1mEl, 'input', () => {
          const d = parseNumberFlexible(entryWin1mEl.value);
          S.entryWindowSec1m = Math.max(0, Math.min(60, Math.round(Number.isFinite(d) ? d : 35)));
          if (S.entryWindowSec1m > 0) markTfSyncPending('1m');
          persistSettings();
        });
        bindOnce(entryWin3mEl, 'input', () => {
          const d = parseNumberFlexible(entryWin3mEl.value);
          S.entryWindowSec3m = Math.max(0, Math.min(180, Math.round(Number.isFinite(d) ? d : 90)));
          if (S.entryWindowSec3m > 0) markTfSyncPending('3m');
          persistSettings();
        });
        bindOnce(entryWin5mEl, 'input', () => {
          const d = parseNumberFlexible(entryWin5mEl.value);
          S.entryWindowSec5m = Math.max(0, Math.min(300, Math.round(Number.isFinite(d) ? d : 150)));
          if (S.entryWindowSec5m > 0) markTfSyncPending('5m');
          persistSettings();
        });
        updateEntryWinUi();
      }
if (true) {
        const _payoutEnabledEl = $id('iaa-sniper-min-payout-enabled');
        const _payoutEl = $id('iaa-sniper-min-payout');
        if (_payoutEnabledEl) {
          const update = () => {
            const en = !!_payoutEnabledEl.checked;
            S.sniperMinPayoutEnabled = en;
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
      if (SNIPER_VWAP) {
        const update = () => {
          const pct = parseNumberFlexible(SNIPER_VWAP.value);
          const fallback = Number((SNIPER_5S_DEFAULTS.vwapDeviation * 100).toFixed(2));
          const v = Number.isFinite(pct) ? pct : fallback;
          const clamped = Math.max(0, Math.min(0.30, Math.round(v * 100) / 100));
          SNIPER_VWAP.value = clamped.toFixed(2);
          S.sniperVwapDeviation = clamped / 100;
          applyStrictnessColor(SNIPER_VWAP, clamped, { min: 0, max: 0.30, highIsStrict: true });
          setMiniBar('iaa-bar-vwapdev', clamped, 0, 0.30, 10, { highIsStrict: true });
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
          const pct = parseNumberFlexible(SNIPER_MOMENTUM.value);
          const fallback = Number((SNIPER_5S_DEFAULTS.momentumThreshold * 100).toFixed(2));
          const v = Number.isFinite(pct) ? pct : fallback;
          const clamped = Math.max(0, Math.min(0.30, Math.round(v * 100) / 100));
          SNIPER_MOMENTUM.value = clamped.toFixed(2);
          S.sniperMomentumThreshold = clamped / 100;
          applyStrictnessColor(SNIPER_MOMENTUM, clamped, { min: 0, max: 0.30, highIsStrict: true });
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
          const pct = Math.max(1, Math.min(100, Math.round(normalized || 0)));
          S.sniperChopThreshold = mapChopUiPctToThreshold(pct);
          SNIPER_CHOP.value = String(pct);
          applyStrictnessColor(SNIPER_CHOP, pct, { min: 1, max: 100, highIsStrict: true });
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
          const pct = Math.max(1, Math.min(100, Math.round(Number.isFinite(d) ? d : 55)));
          S.sniperVwapWeight = pct / 100;
          SNIPER_VWAP_WEIGHT.value = String(pct);
          applyStrictnessColor(SNIPER_VWAP_WEIGHT, pct, { min: 1, max: 100, highIsStrict: true });
          persistSettings();
        };
        SNIPER_VWAP_WEIGHT.addEventListener('input', update);
        SNIPER_VWAP_WEIGHT.addEventListener('change', update);
      }
      if (SNIPER_MOMENTUM_WEIGHT) {
        const update = () => {
          const d = parseNumberFlexible(SNIPER_MOMENTUM_WEIGHT.value);
          const pct = Math.max(1, Math.min(100, Math.round(Number.isFinite(d) ? d : 35)));
          S.sniperMomentumWeight = pct / 100;
          SNIPER_MOMENTUM_WEIGHT.value = String(pct);
          applyStrictnessColor(SNIPER_MOMENTUM_WEIGHT, pct, { min: 1, max: 100, highIsStrict: false });
          persistSettings();
        };
        SNIPER_MOMENTUM_WEIGHT.addEventListener('input', update);
        SNIPER_MOMENTUM_WEIGHT.addEventListener('change', update);
      }
      if (SNIPER_VOLUME_WEIGHT) {
        const update = () => {
          const d = parseNumberFlexible(SNIPER_VOLUME_WEIGHT.value);
          const pct = Math.max(1, Math.min(100, Math.round(Number.isFinite(d) ? d : 10)));
          S.sniperVolumeWeight = pct / 100;
          SNIPER_VOLUME_WEIGHT.value = String(pct);
          applyStrictnessColor(SNIPER_VOLUME_WEIGHT, pct, { min: 1, max: 100, highIsStrict: false });
          persistSettings();
        };
        SNIPER_VOLUME_WEIGHT.addEventListener('input', update);
        SNIPER_VOLUME_WEIGHT.addEventListener('change', update);
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
      }
      const AI_VISION_ENABLED = $id('iaa-ai-vision-enabled');
      const AI_VISION_MORNING = $id('iaa-ai-vision-morning-star');
      const AI_VISION_EVENING = $id('iaa-ai-vision-evening-star');
      const AI_VISION_REQUIRE = $id('iaa-ai-vision-require-match');
      if (AI_VISION_ENABLED) AI_VISION_ENABLED.addEventListener('change', () => { S.aiVisionEnabled = AI_VISION_ENABLED.checked; persistSettings(); });
       const PHASE_CATCH_MOVE = $id('iaa-phase-catch-move');
       const PHASE_RELOAD_SNIPE = $id('iaa-phase-reload-snipe');
      if (AI_VISION_MORNING) AI_VISION_MORNING.addEventListener('change', () => { S.aiVisionMorningStar = AI_VISION_MORNING.checked; persistSettings(); });
      if (AI_VISION_EVENING) AI_VISION_EVENING.addEventListener('change', () => { S.aiVisionEveningStar = AI_VISION_EVENING.checked; persistSettings(); });
      if (AI_VISION_REQUIRE) AI_VISION_REQUIRE.addEventListener('change', () => { S.aiVisionRequireMatch = AI_VISION_REQUIRE.checked; persistSettings(); });
       if (PHASE_CATCH_MOVE) PHASE_CATCH_MOVE.addEventListener('change', () => { S.phaseCatchMoveEnabled = PHASE_CATCH_MOVE.checked; persistSettings(); });
       if (PHASE_RELOAD_SNIPE) PHASE_RELOAD_SNIPE.addEventListener('change', () => { S.phaseReloadSniperEnabled = PHASE_RELOAD_SNIPE.checked; persistSettings(); });
      if (FEATURE_TF_1M) {
        FEATURE_TF_1M.addEventListener('change', () => {
          S.sniperEnabledTimeframes['1m'] = FEATURE_TF_1M.checked;
          S.sniperEnabledTimeframes['1m'] = FEATURE_TF_1M.checked;
          persistSettings();
          refreshUI('legacy_direct_render_replaced');
        });
      }
      if (FEATURE_TF_3M) {
        FEATURE_TF_3M.addEventListener('change', () => {
          S.sniperEnabledTimeframes['3m'] = FEATURE_TF_3M.checked;
          S.sniperEnabledTimeframes['3m'] = FEATURE_TF_3M.checked;
          persistSettings();
          refreshUI('legacy_direct_render_replaced');
        });
      }
      if (FEATURE_TF_5M) {
        FEATURE_TF_5M.addEventListener('change', () => {
          S.sniperEnabledTimeframes['5m'] = FEATURE_TF_5M.checked;
          S.sniperEnabledTimeframes['5m'] = FEATURE_TF_5M.checked;
          persistSettings();
          refreshUI('legacy_direct_render_replaced');
        });
      }
      if (FEATURE_TF_15M) {
        FEATURE_TF_15M.addEventListener('change', () => {
          S.sniperEnabledTimeframes['15m'] = FEATURE_TF_15M.checked;
          S.sniperEnabledTimeframes['15m'] = FEATURE_TF_15M.checked;
          persistSettings();
          refreshUI('legacy_direct_render_replaced');
        });
      }
      if (STRATEGY_EMA_RSI_PULLBACK) {
        STRATEGY_EMA_RSI_PULLBACK.addEventListener('change', () => {
          const current = getStrategyConfig('ema_rsi_pullback');
          S.strategyConfigs = { ...S.strategyConfigs, ema_rsi_pullback: { ...current, enabled: STRATEGY_EMA_RSI_PULLBACK.checked } };
          if (!STRATEGY_EMA_RSI_PULLBACK.checked && S.currentStrategyKey === 'ema_rsi_pullback') { S.currentStrategyKey = null; S.sniperLastDecision = null; }
          persistSettings();
          renderStrategiesPanel();
        });
      }
      if (STRATEGY_SCALP_MICROTREND) {
        STRATEGY_SCALP_MICROTREND.addEventListener('change', () => {
          const current = getStrategyConfig('scalp_microtrend');
          S.strategyConfigs = { ...S.strategyConfigs, scalp_microtrend: { ...current, enabled: STRATEGY_SCALP_MICROTREND.checked } };
          if (!STRATEGY_SCALP_MICROTREND.checked && S.currentStrategyKey === 'scalp_microtrend') { S.currentStrategyKey = null; S.sniperLastDecision = null; }
          persistSettings();
          renderStrategiesPanel();
        });
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
      installHttpPriceTap();
      await loadSettings();
      S.wsTapInstalled = true;
      if (WS_FEED_BUFFER.packetsSeen) S.wsPacketsSeen = WS_FEED_BUFFER.packetsSeen;
      S.wsBridgeFramesSeen = WS_FEED_BUFFER.bridgeFramesSeen || 0;
      S.httpFramesSeen = WS_FEED_BUFFER.httpFramesSeen || 0;
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
    api.runEntryTimingRegressionHarness = runEntryTimingRegressionHarness;
    api.runDirectionLockHarness = runDirectionLockHarness;
    api.runUiPersistenceHarness = runUiPersistenceHarness;

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
