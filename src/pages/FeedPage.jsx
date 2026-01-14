import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadPosts, savePosts } from "../services/localFeedService";
import { getStoredUser } from "../services/authenticationService";

export default function FeedPage() {
  const navigate = useNavigate();

  const user = useMemo(() => getStoredUser(), []);
  const username = useMemo(() => getUsername(user), [user]);

  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);

  const [openReplyFor, setOpenReplyFor] = useState(null);
  const [replyTextByPost, setReplyTextByPost] = useState({});

  const fileRef = useRef(null);

  useEffect(() => {
    (async () => {
      const saved = await loadPosts();

      // 🔧 μικρό "migration": αν παλιά posts δεν είχαν replies / likedBy / likesCount, τα συμπληρώνουμε
      const normalized = (Array.isArray(saved) ? saved : []).map((p) => ({
        ...p,
        likesCount: p?.likesCount ?? 0,
        likedBy: Array.isArray(p?.likedBy) ? p.likedBy : [],
        replies: Array.isArray(p?.replies) ? p.replies : [],
      }));

      setPosts(normalized);
      await savePosts(normalized);
    })();
  }, []);

  async function persist(updated) {
    setPosts(updated);
    await savePosts(updated);
  }

  async function handleCreatePost(e) {
    e.preventDefault();

    if (!username) {
      alert("Κάνε login για να ανεβάσεις post.");
      return;
    }

    const clean = text.trim();
    if (!clean && !file) return;

    let media = null;
    if (file) {
      const maxBytes = 15 * 1024 * 1024;
      if (file.size > maxBytes) {
        alert("Το αρχείο είναι πολύ μεγάλο. Βάλε μέχρι 15MB.");
        return;
      }
      const base64 = await fileToBase64(file);
      media = { name: file.name, type: file.type, dataUrl: base64 };
    }

    const newPost = {
      id: Date.now(),
      text: clean,
      createdAt: new Date().toISOString(),
      author: username,
      likesCount: 0,
      likedBy: [],
      replies: [], // ✅ replies εδώ
      media,
    };

    const updated = [newPost, ...posts];
    await persist(updated);

    setText("");
    setFile(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function toggleLike(postId) {
    if (!username) {
      alert("Κάνε login για να κάνεις like.");
      return;
    }

    const updated = posts.map((p) => {
      if (p.id !== postId) return p;

      const likedBy = Array.isArray(p.likedBy) ? p.likedBy : [];
      const already = likedBy.includes(username);

      if (already) {
        const newLikedBy = likedBy.filter((u) => u !== username);
        return {
          ...p,
          likedBy: newLikedBy,
          likesCount: Math.max(0, (p.likesCount || 0) - 1),
        };
      } else {
        return {
          ...p,
          likedBy: [username, ...likedBy],
          likesCount: (p.likesCount || 0) + 1,
        };
      }
    });

    await persist(updated);
  }

  async function deletePost(postId) {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    if (!username || post.author !== username) {
      alert("Μόνο ο δημιουργός μπορεί να σβήσει αυτό το post.");
      return;
    }

    const updated = posts.filter((p) => p.id !== postId);
    await persist(updated);
  }

  async function addReply(postId) {
    if (!username) {
      alert("Κάνε login για να απαντήσεις.");
      return;
    }

    const clean = (replyTextByPost[postId] || "").trim();
    if (!clean) return;

    const updated = posts.map((p) => {
      if (p.id !== postId) return p;

      const replies = Array.isArray(p.replies) ? p.replies : [];
      const newReply = {
        id: Date.now(),
        text: clean,
        createdAt: new Date().toISOString(),
        author: username,
      };

      return { ...p, replies: [...replies, newReply] };
    });

    await persist(updated);

    setReplyTextByPost((prev) => ({ ...prev, [postId]: "" }));
    setOpenReplyFor(null);
  }

  async function deleteReply(postId, replyId) {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    const reply = (post.replies || []).find((r) => r.id === replyId);
    if (!reply) return;

    if (!username || reply.author !== username) {
      alert("Μόνο ο δημιουργός του reply μπορεί να το σβήσει.");
      return;
    }

    const updated = posts.map((p) => {
      if (p.id !== postId) return p;
      return {
        ...p,
        replies: (p.replies || []).filter((r) => r.id !== replyId),
      };
    });

    await persist(updated);
  }

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: 16 }}>
      <div style={topBar}>
        <button type="button" onClick={() => navigate("/")} style={btnGhost}>
          ← Back
        </button>
        <h2 style={{ margin: 0 }}>Feed</h2>
        <div style={{ width: 70 }} />
      </div>

      <div style={{ fontSize: 13, opacity: 0.85, margin: "10px 0 12px" }}>
        Logged in as: <b>{username || "Guest"}</b>
      </div>

      <form onSubmit={handleCreatePost} style={cardStyle}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Γράψε κάτι..."
          style={textareaStyle}
          maxLength={700}
        />

        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {/* 🔥 κρυφό file input */}
          <input
            ref={fileRef}
            type="file"
            accept="image/*,video/*"
            style={{ display: "none" }}
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            style={btnSecondary}
          >
            📎 Choose file
          </button>

          {file ? (
            <div style={filePill}>
              <span
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {file.name}
              </span>
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  if (fileRef.current) fileRef.current.value = "";
                }}
                style={xBtn}
                aria-label="Remove file"
              >
                ✕
              </button>
            </div>
          ) : (
            <div style={{ fontSize: 12, opacity: 0.7 }}>No file selected</div>
          )}

          <div style={{ flex: 1 }} />

          <button type="submit" style={btnPrimary}>
            🚀 Post
          </button>
        </div>
      </form>

      <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
        {posts.length === 0 ? (
          <div style={{ opacity: 0.7 }}>No posts yet.</div>
        ) : (
          posts.map((p) => {
            const liked = username && (p.likedBy || []).includes(username);
            const isOwner = username && p.author === username;
            const replies = Array.isArray(p.replies) ? p.replies : [];
            const isReplyOpen = openReplyFor === p.id;

            return (
              <div key={p.id} style={cardStyle}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 10,
                  }}
                >
                  <div style={{ fontSize: 12, opacity: 0.85 }}>
                    <b>{p.author}</b> • {new Date(p.createdAt).toLocaleString()}
                  </div>

                  {isOwner && (
                    <button
                      type="button"
                      onClick={() => deletePost(p.id)}
                      style={btnDanger}
                    >
                      Delete
                    </button>
                  )}
                </div>

                {p.text && (
                  <div style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>
                    {p.text}
                  </div>
                )}

                {p.media?.type?.startsWith("image/") && (
                  <img
                    src={p.media.dataUrl}
                    alt=""
                    style={{ marginTop: 10, width: "100%", borderRadius: 12 }}
                  />
                )}

                {p.media?.type?.startsWith("video/") && (
                  <video
                    src={p.media.dataUrl}
                    controls
                    style={{ marginTop: 10, width: "100%", borderRadius: 12 }}
                  />
                )}

                <div
                  style={{
                    marginTop: 10,
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggleLike(p.id)}
                    style={{
                      ...btnSecondary,
                      opacity: username ? 1 : 0.6,
                      background: liked
                        ? "rgba(138,180,248,0.22)"
                        : "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.15)",
                    }}
                  >
                    {liked ? "❤️ Liked" : "🤍 Like"}
                  </button>

                  <div style={{ fontSize: 13, opacity: 0.85 }}>
                    {p.likesCount || 0} likes
                  </div>

                  <div style={{ flex: 1 }} />

                  <button
                    type="button"
                    onClick={() => setOpenReplyFor(isReplyOpen ? null : p.id)}
                    style={btnGhost}
                  >
                    💬 Reply
                  </button>
                </div>

                {/* Replies list */}
                {replies.length > 0 && (
                  <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
                    {replies.map((r) => {
                      const canDelete = username && r.author === username;
                      return (
                        <div key={r.id} style={replyBubble}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              gap: 10,
                            }}
                          >
                            <div style={{ fontSize: 12, opacity: 0.85 }}>
                              <b>{r.author}</b> •{" "}
                              {new Date(r.createdAt).toLocaleString()}
                            </div>
                            {canDelete && (
                              <button
                                type="button"
                                onClick={() => deleteReply(p.id, r.id)}
                                style={miniDanger}
                              >
                                Delete
                              </button>
                            )}
                          </div>
                          <div style={{ marginTop: 6, whiteSpace: "pre-wrap" }}>
                            {r.text}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Reply composer */}
                {isReplyOpen && (
                  <div style={{ marginTop: 12 }}>
                    <textarea
                      value={replyTextByPost[p.id] || ""}
                      onChange={(e) =>
                        setReplyTextByPost((prev) => ({
                          ...prev,
                          [p.id]: e.target.value,
                        }))
                      }
                      placeholder="Γράψε απάντηση..."
                      style={{
                        ...textareaStyle,
                        minHeight: 60,
                        marginBottom: 8,
                      }}
                      maxLength={500}
                    />
                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                        justifyContent: "flex-end",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenReplyFor(null)}
                        style={btnGhost}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => addReply(p.id)}
                        style={btnPrimary}
                      >
                        Send reply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function getUsername(user) {
  return (
    user?.username ||
    user?.name ||
    user?.email ||
    user?.user?.username ||
    user?.user?.name ||
    user?.user?.email ||
    ""
  );
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const topBar = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
  marginBottom: 6,
};

const cardStyle = {
  padding: 12,
  borderRadius: 14,
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.10)",
  color: "white",
  backdropFilter: "blur(6px)",
};

const textareaStyle = {
  width: "100%",
  minHeight: 70,
  resize: "vertical",
  padding: 10,
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.15)",
  background: "rgba(255,255,255,0.05)",
  color: "white",
  outline: "none",
  marginBottom: 10,
};

const btnBase = {
  padding: "9px 14px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.14)",
  cursor: "pointer",
  color: "white",
};

const btnPrimary = {
  ...btnBase,
  border: "1px solid rgba(138,180,248,0.45)",
  background: "rgba(138,180,248,0.22)",
  fontWeight: 700,
};

const btnSecondary = {
  ...btnBase,
  background: "rgba(255,255,255,0.07)",
};

const btnGhost = {
  ...btnBase,
  background: "transparent",
};

const btnDanger = {
  ...btnBase,
  background: "rgba(255,90,90,0.22)",
  border: "1px solid rgba(255,90,90,0.35)",
};

const filePill = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  maxWidth: 320,
  padding: "7px 10px",
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.06)",
  fontSize: 12,
  opacity: 0.95,
};

const xBtn = {
  border: "none",
  background: "transparent",
  color: "white",
  cursor: "pointer",
  opacity: 0.9,
  fontSize: 12,
};

const replyBubble = {
  padding: 10,
  borderRadius: 12,
  background: "rgba(0,0,0,0.18)",
  border: "1px solid rgba(255,255,255,0.10)",
};

const miniDanger = {
  border: "none",
  background: "rgba(255,90,90,0.18)",
  color: "white",
  cursor: "pointer",
  padding: "6px 10px",
  borderRadius: 10,
  fontSize: 12,
};
