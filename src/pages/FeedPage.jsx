import React, { useEffect, useState } from "react";
import { postsService } from "../services/postsService";

const BACKEND = "http://localhost:8080/api";
const mediaUrl = (mediaId) => `${BACKEND}/media/${mediaId}`;
const formatDate = (ms) => (ms ? new Date(ms).toLocaleString() : "");

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await postsService.getPosts(0, 10);
      setPosts(Array.isArray(data?.content) ? data.content : []);
    } catch (e) {
      const status = e?.response?.status;
      const msg =
        e?.response?.data?.message || e?.message || "Failed to load feed";

      setError(status ? `${msg} (status ${status})` : msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) return <div style={{ padding: 20 }}>Loading feed...</div>;

  if (error) {
    return (
      <div style={{ padding: 20 }}>
        <div style={{ marginBottom: 10 }}>Error: {error}</div>
        <button onClick={fetchPosts}>Retry</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 16 }}>Feed</h1>

      {posts.length === 0 ? (
        <div style={{ marginTop: 10, opacity: 0.8 }}>No posts yet.</div>
      ) : (
        posts.map((p) => (
          <div
            key={p.id || p._id}
            style={{
              border: "1px solid #ddd",
              padding: 12,
              marginTop: 12,
              borderRadius: 12,
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: 700 }}>
                  {p.userName || p.username || p.email || "User"}
                </div>
                <div style={{ fontSize: 12, opacity: 0.75 }}>
                  {formatDate(p.createdAt)}
                </div>
              </div>

              <div style={{ fontSize: 12, opacity: 0.85 }}>
                Avg: {p.avgRating ?? 0} ({p.ratingCount ?? 0})
              </div>
            </div>

            {/* Caption */}
            {p.caption && <div style={{ marginTop: 8 }}>{p.caption}</div>}

            {/* Media */}
            {p.mediaId && p.mediaId !== "dummy" && (
              <div style={{ marginTop: 10 }}>
                {p.mediaType === "VIDEO" ? (
                  <video
                    controls
                    style={{
                      width: "100%",
                      maxWidth: 800,
                      borderRadius: 12,
                      display: "block",
                    }}
                  >
                    <source src={mediaUrl(p.mediaId)} />
                  </video>
                ) : (
                  <img
                    src={mediaUrl(p.mediaId)}
                    alt="post media"
                    style={{
                      width: "100%",
                      maxWidth: 800,
                      borderRadius: 12,
                      display: "block",
                    }}
                  />
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
