// == POCKET OPTION PRICE INJECTOR ==
// Runs in page context and forwards decoded OTC prices to content script via postMessage.
(function () {
  const PRICE_EVENT = 'IAA_PO_PRICE';
  const FRAME_EVENT = 'IAA_WS_BRIDGE_FRAME';
  const READY_EVENT = 'IAA_WS_BRIDGE_READY';

  if (window.__iaaPoInjectInstalled) return;
  window.__iaaPoInjectInstalled = true;

  const postReady = () => {
    try { window.postMessage({ __iaaType: READY_EVENT, source: 'ws' }, '*'); } catch {}
  };

  const toText = (data) => {
    try {
      if (data == null) return null;
      if (typeof data === 'string') return data;
      if (data instanceof ArrayBuffer) return new TextDecoder('utf-8').decode(new Uint8Array(data));
      if (ArrayBuffer.isView(data)) {
        return new TextDecoder('utf-8').decode(new Uint8Array(data.buffer, data.byteOffset, data.byteLength));
      }
      if (typeof Blob !== 'undefined' && data instanceof Blob) return data.text();
      return String(data);
    } catch {
      return null;
    }
  };

  const inferPrice = (raw, prevPrice = null) => {
    const n = Number(raw);
    if (!Number.isFinite(n) || n <= 0) return null;
    const candidates = [];
    const push = (value, decimals, scale) => {
      if (!Number.isFinite(value) || value <= 0 || value > 1000000) return;
      candidates.push({ value, decimals: Math.max(0, Math.min(8, decimals)), scale });
    };
    if (n < 10000) {
      const d = String(n).includes('.') ? String(n).split('.')[1].length : 0;
      push(n, d, 1);
    } else {
      for (const scale of [1, 10, 100, 1000, 10000, 100000, 1000000]) {
        push(n / scale, Math.round(Math.log10(scale || 1)), scale);
      }
    }
    const valid = candidates.filter((c) => c.value >= 0.00001 && c.value <= 10000);
    const scoped = valid.length ? valid : candidates;
    if (!scoped.length) return null;
    if (Number.isFinite(prevPrice) && prevPrice > 0) {
      scoped.sort((a, b) => Math.abs(a.value - prevPrice) - Math.abs(b.value - prevPrice));
      return scoped[0];
    }
    scoped.sort((a, b) => Math.abs(a.value - 1) - Math.abs(b.value - 1));
    return scoped[0];
  };

  const postPrice = (asset, raw, ts = Date.now()) => {
    const normalizedAsset = typeof asset === 'string' ? asset.trim() : '';
    if (!normalizedAsset) return;
    if (!Number.isFinite(Number(raw))) return;
    const priced = inferPrice(raw, Number(window.__iaaLastPostedPrice));
    if (!priced) return;
    window.__iaaLastPostedPrice = priced.value;
    try {
      window.postMessage({
        __iaaType: PRICE_EVENT,
        source: 'ws',
        asset: normalizedAsset,
        raw: Number(raw),
        price: priced.value,
        decimals: priced.decimals,
        scale: priced.scale,
        ts: Number.isFinite(Number(ts)) ? Number(ts) : Date.now()
      }, '*');
    } catch {}
  };

  const looksAsset = (v) => typeof v === 'string' && /[A-Za-z]{3,}/.test(v);

  const parseSocketPacket = (text) => {
    if (!text || typeof text !== 'string') return;
    const normalized = text.trim();
    if (!normalized) return;

    try {
      window.postMessage({ __iaaType: FRAME_EVENT, source: 'ws', payload: normalized }, '*');
    } catch {}

    const payloads = [];
    const tryPush = (chunk) => {
      try { payloads.push(JSON.parse(chunk)); } catch {}
    };

    const pushFromPossiblyFramed = (s) => {
      if (!s || typeof s !== 'string') return;
      let t = s.trim();
      if (!t) return;

      // 1) Remove engine.io length prefixes like: 451-....
      // May appear multiple times in some transports; peel in a loop.
      for (let i = 0; i < 3; i++) {
        const peeled = t.replace(/^\d+-/, '');
        if (peeled === t) break;
        t = peeled.trim();
      }

      // 2) If we still have a socket.io packet type prefix like 42 or 43, peel it:
      // Examples:
      // 42["event", {...}]
      // 43["event", {...}]
      // 42[ ... ]
      if (/^(42|43)\s*\[/.test(t)) {
        t = t.replace(/^(42|43)\s*/, '').trim(); // leaves leading '['
      }

      // 3) Sometimes we have: 451-42["event",...]
      // After peeling length prefix we get 42["..."]; step (2) handles it.

      // 4) Accept raw JSON array/object
      if (t.startsWith('{') || t.startsWith('[')) {
        tryPush(t);
        return;
      }

      // 5) Last resort: find an embedded JSON start (42[ or [ or {)
      const idx42 = t.indexOf('42[');
      if (idx42 >= 0) {
        const sub = t.slice(idx42);
        const peeled2 = sub.replace(/^(42|43)\s*/, '').trim();
        if (peeled2.startsWith('[') || peeled2.startsWith('{')) tryPush(peeled2);
      } else {
        const idxArr = t.indexOf('[');
        const idxObj = t.indexOf('{');
        const idx = (idxArr >= 0 && idxObj >= 0) ? Math.min(idxArr, idxObj) : Math.max(idxArr, idxObj);
        if (idx >= 0) {
          const sub = t.slice(idx).trim();
          if (sub.startsWith('[') || sub.startsWith('{')) tryPush(sub);
        }
      }
    };

    pushFromPossiblyFramed(normalized);

    if (!payloads.length) return;

    const looksAsset = (v) => typeof v === 'string' && /[A-Za-z]{3,}/.test(v);

    const maybeTuple = (node) => {
      if (!Array.isArray(node) || node.length < 3) return;
      if (!looksAsset(node[0])) return;
      const ts = Number(node[1]);
      const raw = Number(node[2]);
      if (!Number.isFinite(raw)) return;
      postPrice(node[0], raw, ts);
    };

    const walk = (node) => {
      if (!node) return;
      if (Array.isArray(node)) {
        // Special fast-path: raw tick batches like [[asset,ts,price],...]
        if (node.length && Array.isArray(node[0]) && node[0].length >= 3 && looksAsset(node[0][0])) {
          for (const row of node) maybeTuple(row);
        } else {
          maybeTuple(node);
        }

        // Also handle [asset, ..., price] patterns
        if (node.length >= 2 && typeof node[0] === 'string' && looksAsset(node[0])) {
          for (let i = node.length - 1; i >= 1; i -= 1) {
            const val = node[i];
            if (typeof val === 'number') {
              postPrice(node[0], val);
              break;
            }
          }
        }
        for (const child of node) walk(child);
      } else if (typeof node === 'object') {
        const nodeAsset = node.asset || node.symbol || node.pair || node.instrument;
        const ts = Number(node.timestamp || node.ts || node.time || node.t) || Date.now();
        if (typeof nodeAsset === 'string' && looksAsset(nodeAsset)) {
          if (Number.isFinite(Number(node.priceInt))) postPrice(nodeAsset, Number(node.priceInt), ts);
          if (Number.isFinite(Number(node.price))) postPrice(nodeAsset, Number(node.price), ts);
          if (Number.isFinite(Number(node.value))) postPrice(nodeAsset, Number(node.value), ts);
          if (Number.isFinite(Number(node.last))) postPrice(nodeAsset, Number(node.last), ts);
          if (Number.isFinite(Number(node.close))) postPrice(nodeAsset, Number(node.close), ts);
        }
        for (const v of Object.values(node)) walk(v);
      }
    };

    for (const payload of payloads) walk(payload);
  };

  const handleData = (data) => {
    const decoded = toText(data);
    if (decoded && typeof decoded.then === 'function') {
      decoded.then(parseSocketPacket).catch(() => {});
      return;
    }
    if (decoded != null) parseSocketPacket(decoded);
  };

  const hookWebSocket = () => {
    const OriginalWebSocket = window.WebSocket;
    if (!OriginalWebSocket || window.__iaaPoWsHooked) return;
    window.__iaaPoWsHooked = true;

    try {
      const proto = OriginalWebSocket.prototype;
      if (proto && typeof proto.dispatchEvent === 'function' && !proto.__iaaPoDispatchHooked) {
        const originalDispatch = proto.dispatchEvent;
        proto.dispatchEvent = function (event) {
          if (event && event.type === 'message') {
            try { handleData(event.data); } catch {}
          }
          return originalDispatch.apply(this, arguments);
        };
        proto.__iaaPoDispatchHooked = true;
      }
    } catch {}

    window.WebSocket = function (...args) {
      const ws = new OriginalWebSocket(...args);
      ws.addEventListener('message', (event) => {
        try { handleData(event && event.data); } catch {}
      });
      return ws;
    };
    window.WebSocket.prototype = OriginalWebSocket.prototype;
    window.WebSocket.OPEN = OriginalWebSocket.OPEN;
    window.WebSocket.CLOSED = OriginalWebSocket.CLOSED;
    window.WebSocket.CLOSING = OriginalWebSocket.CLOSING;
    window.WebSocket.CONNECTING = OriginalWebSocket.CONNECTING;
  };

  hookWebSocket();
  postReady();
})();
