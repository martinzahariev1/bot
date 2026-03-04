// === IAA PocketOption WS Hook (v3, robust) ===
(function(){
  const VERSION = 3;
  if (window.__iaaPoInjectVersion && window.__iaaPoInjectVersion >= VERSION) return;
  window.__iaaPoInjectVersion = VERSION;
  window.__iaaPoInjectInstalled = true;

  const decoder = new TextDecoder("utf-8");

  function decode(data){
    try{
      if (typeof data === "string") return data;
      if (data instanceof ArrayBuffer) return decoder.decode(new Uint8Array(data));
      if (ArrayBuffer.isView(data)) return decoder.decode(new Uint8Array(data.buffer));
      if (typeof Blob !== "undefined" && data instanceof Blob){
        return data.arrayBuffer().then(buf=>decoder.decode(new Uint8Array(buf)));
      }
    }catch(e){}
    return null;
  }

  function stripFraming(text){
    if (!text) return null;
    let t = String(text).trim();
    // engine.io length prefix: 451-
    t = t.replace(/^\\d+-/, "");
    // socket.io packet type 42/43
    if (t.startsWith("42") || t.startsWith("43")) t = t.slice(2);
    return t.trim();
  }

  function emit(asset, ts, price){
    try{
      window.__iaaLastPostedPrice = price;
      window.postMessage({ __iaaType:"IAA_PO_PRICE", asset, ts, price }, "*");
    }catch(e){}
  }

  function parseText(text){
    if (!text) return;
    const cleaned = stripFraming(text);
    if (!cleaned) return;

    // raw batch [[asset, ts, price], ...]
    if (cleaned.startsWith("[[")) {
      try{
        const arr = JSON.parse(cleaned);
        if (Array.isArray(arr) && arr.length){
          const row = arr[0];
          if (Array.isArray(row) && row.length >= 3){
            const asset = String(row[0]||"");
            const ts = Number(row[1]);
            const price = Number(row[2]);
            if (Number.isFinite(price)) emit(asset, ts, price);
          }
        }
      }catch(e){}
      return;
    }

    // socket.io event ["updateStream", [[...]]]
    if (cleaned.startsWith("[")) {
      try{
        const arr = JSON.parse(cleaned);
        if (Array.isArray(arr) && arr.length >= 2){
          const evt = arr[0];
          const payload = arr[1];
          if (Array.isArray(payload) && Array.isArray(payload[0]) && payload[0].length >= 3){
            const row = payload[0];
            const asset = String(row[0]||"");
            const ts = Number(row[1]);
            const price = Number(row[2]);
            if (Number.isFinite(price)) emit(asset, ts, price);
          }
        }
      }catch(e){}
      return;
    }

    // If it contains 42[ somewhere
    const idx = cleaned.indexOf("42[");
    if (idx >= 0) parseText(cleaned.slice(idx));
  }

  function handleMessageData(data){
    const out = decode(data);
    if (out && typeof out.then === "function") out.then(parseText);
    else parseText(out);
  }

  const WS = window.WebSocket;
  if (!WS) return;

  // Patch constructor to wrap onmessage set even if assigned early
  try{
    const NativeWS = WS;
    function WrappedWebSocket(url, protocols){
      const ws = protocols !== undefined ? new NativeWS(url, protocols) : new NativeWS(url);
      try{
        ws.addEventListener("message", (ev)=>{ try{ handleMessageData(ev.data);}catch(e){} }, { passive:true });
      }catch(e){}
      return ws;
    }
    WrappedWebSocket.prototype = NativeWS.prototype;
    // keep static props
    Object.setPrototypeOf(WrappedWebSocket, NativeWS);
    window.WebSocket = WrappedWebSocket;
  }catch(e){}

  // Also patch prototype addEventListener
  try{
    const add = WS.prototype.addEventListener;
    WS.prototype.addEventListener = function(type, listener, ...rest){
      if (type === "message"){
        const wrapped = function(ev){
          try{ handleMessageData(ev.data);}catch(e){}
          return listener.apply(this, arguments);
        };
        return add.call(this, type, wrapped, ...rest);
      }
      return add.call(this, type, listener, ...rest);
    };
  }catch(e){}

  // Patch onmessage setter if available
  try{
    const desc = Object.getOwnPropertyDescriptor(WS.prototype, "onmessage");
    if (desc && desc.set){
      Object.defineProperty(WS.prototype, "onmessage", {
        set(fn){
          const wrapped = function(ev){
            try{ handleMessageData(ev.data);}catch(e){}
            return fn.call(this, ev);
          };
          return desc.set.call(this, wrapped);
        },
        get: desc.get,
        configurable: true,
        enumerable: true
      });
    }
  }catch(e){}

  window.__iaaPoWsHooked = true;
})();
