// == POCKET OPTION PRICE INJECTOR ==
// Runs in page context and forwards decoded OTC prices to content script via postMessage.
(function () {
  const PRICE_EVENT = 'IAA_PO_PRICE';
  const FRAME_EVENT = 'IAA_WS_BRIDGE_FRAME';
  const READY_EVENT = 'IAA_WS_BRIDGE_READY';
  const STATUS_EVENT = 'IAA_WS_BRIDGE_STATUS';

  if (window.__iaaPoInjectInstalled) return;
  window.__iaaPoInjectInstalled = true;

  const emitToBridge = (payload) => {
    try { window.postMessage(payload, '*'); } catch {}
    try {
      if (window.top && window.top !== window) {
        window.top.postMessage(payload, '*');
      }
    } catch {}
  };

  const postStatus = (status, detail = '') => {
    emitToBridge({ __iaaType: STATUS_EVENT, source: 'ws', status: String(status || 'unknown'), detail: String(detail || ''), ts: Date.now() });
  };

  const postReady = () => {
    emitToBridge({ __iaaType: READY_EVENT, source: 'ws' });
  };

  const postFrame = (payload) => {
    try {
      const txt = typeof payload === 'string' ? payload : JSON.stringify(payload);
      if (!txt) return;
      emitToBridge({ __iaaType: FRAME_EVENT, source: 'ws', payload: txt });
    } catch {}
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
      return null;
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
    if (!Number.isFinite(Number(raw))) return;
    const priced = inferPrice(raw, Number(window.__iaaLastPostedPrice));
    if (!priced) return;
    window.__iaaLastPostedPrice = priced.value;
    try {
      emitToBridge({
        __iaaType: PRICE_EVENT,
        source: 'ws',
        asset: normalizedAsset || '',
        raw: Number(raw),
        price: priced.value,
        decimals: priced.decimals,
        scale: priced.scale,
        ts: Number.isFinite(Number(ts)) ? Number(ts) : Date.now()
      });
    } catch {}
  };

  const looksAsset = (v) => typeof v === 'string' && /[A-Za-z]{3,}/.test(v);

  const parseSocketNode = (node) => {
    if (!node) return;

    const maybeTuple = (arr) => {
      if (!Array.isArray(arr) || arr.length < 3) return;
      if (!looksAsset(arr[0])) return;
      const ts = Number(arr[1]);
      const raw = Number(arr[2]);
      if (!Number.isFinite(raw)) return;
      postPrice(arr[0], raw, ts);
    };

    const walk = (n) => {
      if (!n) return;
      if (Array.isArray(n)) {
        maybeTuple(n);
        if (n.length >= 2 && typeof n[0] === 'string' && looksAsset(n[0])) {
          for (let i = n.length - 1; i >= 1; i -= 1) {
            const val = n[i];
            if (typeof val === 'number') {
              postPrice(n[0], val);
              break;
            }
          }
        }
        for (const child of n) walk(child);
        return;
      }
      if (typeof n === 'object') {
        const nodeAsset = n.asset || n.symbol || n.pair || n.instrument;
        const ts = Number(n.timestamp || n.ts || n.time || n.t) || Date.now();
        if (typeof nodeAsset === 'string' && looksAsset(nodeAsset)) {
          if (Number.isFinite(Number(n.priceInt))) postPrice(nodeAsset, Number(n.priceInt), ts);
          if (Number.isFinite(Number(n.price))) postPrice(nodeAsset, Number(n.price), ts);
          if (Number.isFinite(Number(n.value))) postPrice(nodeAsset, Number(n.value), ts);
          if (Number.isFinite(Number(n.last))) postPrice(nodeAsset, Number(n.last), ts);
          if (Number.isFinite(Number(n.close))) postPrice(nodeAsset, Number(n.close), ts);
        }
        for (const v of Object.values(n)) walk(v);
      }
    };

    walk(node);
  };

  const parseSocketPacket = (text) => {
    if (!text || typeof text !== 'string') return;
    const normalized = text.trim();
    if (!normalized) return;

    postFrame(normalized);
    postStatus('frame_seen', normalized.slice(0, 48));

    const payloads = [];
    const tryPush = (chunk) => {
      try { payloads.push(JSON.parse(chunk)); } catch {}
    };

    if (normalized.startsWith('{') || normalized.startsWith('[')) {
      tryPush(normalized);
    } else {
      const jsonPart = normalized.replace(/^\d+-?/, '');
      if (jsonPart.startsWith('{') || jsonPart.startsWith('[')) tryPush(jsonPart);
    }

    for (const payload of payloads) parseSocketNode(payload);
  };

  const handleData = (data) => {
    const decoded = toText(data);
    if (decoded && typeof decoded.then === 'function') {
      decoded.then(parseSocketPacket).catch(() => {});
      return;
    }
    if (typeof decoded === 'string') {
      parseSocketPacket(decoded);
      return;
    }
    if (data && typeof data === 'object') {
      postFrame(data);
      parseSocketNode(data);
    }
  };


  const wrapMessageListener = (listener) => {
    if (!listener) return listener;
    if (listener.__iaaWrapped) return listener.__iaaWrapped;
    let wrapped;
    if (typeof listener === 'function') {
      wrapped = function(event) {
        try { handleData(event && event.data); } catch {}
        return listener.apply(this, arguments);
      };
    } else if (typeof listener.handleEvent === 'function') {
      wrapped = {
        handleEvent(event) {
          try { handleData(event && event.data); } catch {}
          return listener.handleEvent.apply(listener, arguments);
        }
      };
    } else {
      return listener;
    }
    try { listener.__iaaWrapped = wrapped; } catch {}
    return wrapped;
  };


  const tapSocketInstance = (ws) => {
    try {
      if (!ws || ws.__iaaTapped) return false;
      ws.__iaaTapped = true;
      ws.addEventListener('message', (event) => {
        try { handleData(event && event.data); } catch {}
      });
      postStatus('socket_tapped', 'existing_or_new');
      return true;
    } catch {
      return false;
    }
  };

  const tapExistingSocketsFromWindow = () => {
    let tapped = 0;
    try {
      const wsCtor = window.WebSocket;
      if (!wsCtor) return 0;
      const keys = Object.getOwnPropertyNames(window);
      for (const key of keys) {
        let v;
        try { v = window[key]; } catch { continue; }
        if (!v || typeof v !== 'object') continue;
        try {
          if (v instanceof wsCtor) {
            if (tapSocketInstance(v)) tapped += 1;
            continue;
          }
        } catch {}
        if (Array.isArray(v)) {
          for (const item of v) {
            try { if (item instanceof wsCtor && tapSocketInstance(item)) tapped += 1; } catch {}
          }
        }
      }
    } catch {}
    if (tapped > 0) postStatus('existing_sockets_tapped', String(tapped));
    return tapped;
  };

  const hookWebSocket = () => {
    const OriginalWebSocket = window.WebSocket;
    if (!OriginalWebSocket || window.__iaaPoWsHooked) return;
    window.__iaaPoWsHooked = true;

    try {
      const etProto = window.EventTarget && window.EventTarget.prototype;
      if (etProto && typeof etProto.addEventListener === 'function' && !etProto.__iaaWsAddPatched) {
        const origAdd = etProto.addEventListener;
        etProto.addEventListener = function(type, listener, options) {
          if (type === 'message' && this instanceof OriginalWebSocket) {
            return origAdd.call(this, type, wrapMessageListener(listener), options);
          }
          return origAdd.call(this, type, listener, options);
        };
        etProto.__iaaWsAddPatched = true;
      }
      if (etProto && typeof etProto.dispatchEvent === 'function' && !etProto.__iaaWsDispatchPatched) {
        const origDispatch = etProto.dispatchEvent;
        etProto.dispatchEvent = function(event) {
          try {
            if (this instanceof OriginalWebSocket && event && event.type === 'message') {
              handleData(event.data);
            }
          } catch {}
          return origDispatch.apply(this, arguments);
        };
        etProto.__iaaWsDispatchPatched = true;
      }
    } catch {}

    try {
      const proto = OriginalWebSocket.prototype;
      if (proto && typeof proto.addEventListener === 'function' && !proto.__iaaPoAddEventPatched) {
        const origAdd = proto.addEventListener;
        proto.addEventListener = function(type, listener, options) {
          if (type === 'message') {
            return origAdd.call(this, type, wrapMessageListener(listener), options);
          }
          return origAdd.call(this, type, listener, options);
        };
        proto.__iaaPoAddEventPatched = true;
      }
      if (proto && !proto.__iaaPoOnMessagePatched) {
        const desc = Object.getOwnPropertyDescriptor(proto, 'onmessage');
        if (desc && desc.set && desc.get) {
          Object.defineProperty(proto, 'onmessage', {
            configurable: true,
            enumerable: desc.enumerable,
            get: function() { return desc.get.call(this); },
            set: function(handler) { return desc.set.call(this, wrapMessageListener(handler)); }
          });
          proto.__iaaPoOnMessagePatched = true;
        }
      }
    } catch {}

    window.WebSocket = function (...args) {
      const ws = new OriginalWebSocket(...args);
      tapSocketInstance(ws);
      return ws;
    };
    window.WebSocket.prototype = OriginalWebSocket.prototype;
    window.WebSocket.OPEN = OriginalWebSocket.OPEN;
    window.WebSocket.CLOSED = OriginalWebSocket.CLOSED;
    window.WebSocket.CLOSING = OriginalWebSocket.CLOSING;
    window.WebSocket.CONNECTING = OriginalWebSocket.CONNECTING;
  };

  const hookSocketIoDecoded = () => {
    try {
      const io = window.io;
      if (!io) return false;
      let patched = false;

      const mgrProto = io.Manager && io.Manager.prototype;
      if (mgrProto && typeof mgrProto.ondecoded === 'function' && !mgrProto.__iaaPatched) {
        const orig = mgrProto.ondecoded;
        mgrProto.ondecoded = function(packet) {
          try {
            if (packet && typeof packet === 'object') {
              postFrame(packet);
              if (packet.data != null) parseSocketNode(packet.data);
              else parseSocketNode(packet);
            }
          } catch {}
          return orig.apply(this, arguments);
        };
        mgrProto.__iaaPatched = true;
        patched = true;
      }

      const sockProto = io.Socket && io.Socket.prototype;
      if (sockProto && typeof sockProto.onevent === 'function' && !sockProto.__iaaPatched) {
        const orig = sockProto.onevent;
        sockProto.onevent = function(packet) {
          try {
            if (packet && typeof packet === 'object') {
              postFrame(packet);
              if (packet.data != null) parseSocketNode(packet.data);
              else parseSocketNode(packet);
            }
          } catch {}
          return orig.apply(this, arguments);
        };
        sockProto.__iaaPatched = true;
        patched = true;
      }

      return patched;
    } catch {
      return false;
    }
  };


  const looksRelevantTransportText = (text = '', url = '') => {
    const hay = `${url} ${text}`.toLowerCase();
    return /(socket\.io|transport=polling|updatestream|loadhistory|quote|price|tick|candle|asset|symbol|pair|openorder|closeorder|balance)/.test(hay);
  };

  const hookHttpTransport = () => {
    let hooked = false;

    try {
      if (typeof window.fetch === 'function' && !window.__iaaPoFetchHooked) {
        window.__iaaPoFetchHooked = true;
        const origFetch = window.fetch;
        window.fetch = async function(...args) {
          const res = await origFetch.apply(this, args);
          try {
            const url = String(args?.[0]?.url || args?.[0] || '');
            const clone = res?.clone?.();
            if (clone) {
              clone.text().then((txt) => {
                if (!txt || txt.length > 350000) return;
                if (!looksRelevantTransportText(txt, url)) return;
                emitToBridge({ __iaaType: FRAME_EVENT, source: 'http', payload: txt });
                parseSocketPacket(txt);
              }).catch(() => {});
            }
          } catch {}
          return res;
        };
        hooked = true;
      }
    } catch {}

    try {
      if (window.XMLHttpRequest && !window.__iaaPoXhrHooked) {
        window.__iaaPoXhrHooked = true;
        const origOpen = XMLHttpRequest.prototype.open;
        const origSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.open = function(method, url, ...rest) {
          try { this.__iaaUrl = String(url || ''); } catch {}
          return origOpen.call(this, method, url, ...rest);
        };
        XMLHttpRequest.prototype.send = function(...args) {
          this.addEventListener('load', () => {
            try {
              const txt = typeof this.responseText === 'string' ? this.responseText : '';
              if (!txt || txt.length > 350000) return;
              if (!looksRelevantTransportText(txt, this.__iaaUrl || '')) return;
              emitToBridge({ __iaaType: FRAME_EVENT, source: 'http', payload: txt });
              parseSocketPacket(txt);
            } catch {}
          });
          return origSend.apply(this, args);
        };
        hooked = true;
      }
    } catch {}

    if (hooked) postStatus('http_hook', 'installed');
    return hooked;
  };

  postStatus('inject_boot', 'start');
  hookWebSocket();
  postStatus('ws_hook', 'installed');
  hookHttpTransport();
  try { tapExistingSocketsFromWindow(); } catch {}

  // Socket.IO may be initialized after this script; retry patching briefly.
  let tries = 0;
  const timer = setInterval(() => {
    tries += 1;
    const done = hookSocketIoDecoded();
    try { tapExistingSocketsFromWindow(); } catch {}
    if (done) postStatus('socket_io_hook', 'installed');
    if (done || tries >= 30) clearInterval(timer);
  }, 1000);

  postReady();
  postStatus('inject_ready', 'posted_ready_event');
})();
