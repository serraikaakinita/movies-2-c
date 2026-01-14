import { useEffect, useRef, useState } from "react";

const BACKEND_URL = "https://movies2cbackend-production.up.railway.app";

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Γεια! 👋 Πες μου τι ψάχνεις (π.χ. «δράση το 2020», «θρίλερ με ανατροπές», «κάτι σαν John Wick»).",
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const listRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setTimeout(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
    }, 0);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, open]);

  async function send(e) {
    e.preventDefault();
    const clean = input.trim();
    if (!clean || sending) return;

    const next = [...messages, { role: "user", text: clean }];
    setMessages(next);
    setInput("");
    setSending(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: clean }),
      });

      const data = await res.json().catch(() => ({}));
      const reply =
        data?.reply ||
        (res.ok
          ? "Δεν πήρα απάντηση από τον server."
          : "Σφάλμα από τον server.");

      setMessages([...next, { role: "assistant", text: reply }]);
    } catch {
      setMessages([
        ...next,
        {
          role: "assistant",
          text: "Δεν μπορώ να συνδεθώ τώρα. Δοκίμασε ξανά.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          position: "fixed",
          right: 18,
          bottom: 18,
          width: 56,
          height: 56,
          borderRadius: "999px",
          border: "none",
          cursor: "pointer",
          zIndex: 9999,
          boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
          fontSize: 22,
        }}
        aria-label="AI Assistant"
        title="AI Assistant"
      >
        🤖
      </button>

      {/* Popup */}
      {open && (
        <div
          style={{
            position: "fixed",
            right: 18,
            bottom: 86,
            width: 340,
            maxWidth: "calc(100vw - 36px)",
            height: 440,
            maxHeight: "calc(100vh - 120px)",
            borderRadius: 14,
            background: "rgba(20, 20, 20, 0.95)",
            color: "white",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "10px 12px",
              borderBottom: "1px solid rgba(255,255,255,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <div style={{ fontWeight: 700 }}>AI Assistant</div>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "transparent",
                color: "white",
                border: "none",
                cursor: "pointer",
                fontSize: 18,
              }}
              aria-label="Close"
              title="Close"
            >
              ✕
            </button>
          </div>

          <div
            ref={listRef}
            style={{
              padding: 12,
              flex: 1,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                  padding: "10px 12px",
                  borderRadius: 12,
                  background:
                    m.role === "user"
                      ? "rgba(138,180,248,0.25)"
                      : "rgba(255,255,255,0.08)",
                  whiteSpace: "pre-wrap",
                }}
              >
                {m.text}
              </div>
            ))}
          </div>

          <form
            onSubmit={send}
            style={{
              padding: 10,
              borderTop: "1px solid rgba(255,255,255,0.12)",
              display: "flex",
              gap: 8,
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Γράψε εδώ..."
              disabled={sending}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.14)",
                background: "rgba(255,255,255,0.06)",
                color: "white",
                outline: "none",
              }}
            />
            <button
              type="submit"
              disabled={sending}
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                border: "none",
                cursor: sending ? "not-allowed" : "pointer",
              }}
            >
              {sending ? "..." : "Send"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
