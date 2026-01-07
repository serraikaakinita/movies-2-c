import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import SearchedMoviesView from "../ui/components/SearchedMoviesView";
import "./Profile.css";

import {
  authFetch,
  Logout,
  clearSession,
  getStoredUser,
  getToken,
  isTokenExpired,
} from "../services/authenticationService";

import { useFavorites } from "../context/FavoritesContext";

const FALLBACK_AVATAR =
  "https://api.dicebear.com/7.x/identicon/svg?seed=movies2c";

export default function Profile() {
  const navigate = useNavigate();

  const { favorites } = useFavorites();
  const favouritesCount = favorites.length;

  const [user, setUser] = useState(() => {
    const stored = getStoredUser();
    return stored
      ? {
          ...stored,
          avatar: stored.avatar || FALLBACK_AVATAR,
          bio: stored.bio || "",
        }
      : { userName: "", email: "", avatar: FALLBACK_AVATAR, bio: "" };
  });

  const [tempUser, setTempUser] = useState(user);
  const [isEditing, setIsEditing] = useState(false);

  const token = getToken();
  const isAuthed = useMemo(
    () => Boolean(token) && !isTokenExpired(token),
    [token]
  );

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");



  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioDraft, setBioDraft] = useState(user.bio || "");
  const [bioError, setBioError] = useState("");
  const [bioSuccess, setBioSuccess] = useState("");

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingBio, setIsSavingBio] = useState(false);

  const username = user.userName || user.username || "Guest";
  const handle = user.username
    ? `@${user.username}`
    : `@${username.toLowerCase().replace(/\s+/g, "")}`;

  const initial = username[0]?.toUpperCase() ?? "U";
  const hasBio = Boolean(user.bio && user.bio.trim());

  useEffect(() => {
    if (!isAuthed) {
      clearSession();
      navigate("/login", { replace: true });
    }
  }, [isAuthed, navigate]);


  useEffect(() => {
    if (!isAuthed) return;

    (async () => {
      try {
        const res = await authFetch("/api/users/me");
        if (!res.ok) throw new Error("Failed to fetch profile");
        const me = await res.json();

        setUser((prev) => ({
          ...prev,
          ...me,
          avatar: prev.avatar || FALLBACK_AVATAR,
          bio: me.bio ?? prev.bio ?? "",
        }));

        setTempUser((prev) => ({
          ...prev,
          ...me,
          bio: me.bio ?? prev.bio ?? "",
        }));

        setBioDraft(me.bio ?? "");
      } catch {
        clearSession();
        navigate("/login", { replace: true });
      }
    })();
  }, [isAuthed, navigate]);

  useEffect(() => {
    if (!user || !user.email) return;
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  const handleEditClick = () => {
    setTempUser(user);
    setIsEditing(true);
    setPasswordError("");
    setPasswordSuccess("");
  };

  const handleCancel = () => {
    setTempUser(user);
    setIsEditing(false);
    setPasswordError("");
    setPasswordSuccess("");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSave = async () => {
    setPasswordError("");
    setPasswordSuccess("");
    setBioSuccess("");
    setIsSavingProfile(true);

    const wantsPasswordChange =
      oldPassword.trim() || newPassword.trim() || confirmPassword.trim();

    if (wantsPasswordChange && newPassword !== confirmPassword) {
      setPasswordError("New password does not match the confirmation.");
      setIsSavingProfile(false);
      return;
    }

    try {
      const body = {
        userName: tempUser.userName,
        email: tempUser.email,
        ...(wantsPasswordChange && {
          oldPassword,
          newPassword,
        }),
      };

      const res = await authFetch("/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(await res.text());

      const updated = await res.json();
      const merged = { ...user, ...updated };

      setUser(merged);
      localStorage.setItem("user", JSON.stringify(merged));
      setIsEditing(false);

      if (wantsPasswordChange) {
        setPasswordSuccess("Password changed successfully!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      setPasswordError(err.message || "Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChange = (e) => {
    setTempUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogout = async () => {
    await Logout();
    navigate("/login", { replace: true });
  };

  const startBioEdit = () => {
    setBioError("");
    setBioSuccess("");
    setIsEditingBio(true);
    setBioDraft(user.bio || "");
  };

  const cancelBioEdit = () => {
    setIsEditingBio(false);
    setBioError("");
    setBioSuccess("");
    setBioDraft(user.bio || "");
  };

  const handleSaveBio = async () => {
    const trimmed = (bioDraft || "").trim();
    setBioError("");
    setBioSuccess("");
    setIsSavingBio(true);

    try {
      const res = await authFetch("/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio: trimmed }),
      });

      if (!res.ok) throw new Error(await res.text());

      const updated = await res.json();
      const merged = { ...user, ...updated, bio: trimmed };

      setUser(merged);
      localStorage.setItem("user", JSON.stringify(merged));
      setIsEditingBio(false);
      setBioSuccess("Bio updated successfully!");
    } catch (err) {
      setBioError(err.message || "Failed to update bio");
    } finally {
      setIsSavingBio(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-shell">
        {/* TOPBAR */}
        <header className="profile-topbar">
          <div className="profile-pill">
            Signed in as <strong>{handle}</strong>
          </div>
          <button
            className="profile-btn ghost small"
            onClick={handleLogout}
            type="button"
          >
            ● Log-Out
          </button>
        </header>

        {/* HERO */}
        <section className="profile-hero">
          <div className="profile-hero-inner">
            <div className="profile-avatar" aria-hidden="true">
              {initial}
            </div>

            <div className="profile-title">
              <div className="profile-name-row">
                <h1 className="profile-name">{username}</h1>
                <span className="profile-handle">{handle}</span>
              </div>

              <p className="profile-email">{user.email}</p>

              {/* BIO */}
              <div className="profile-meta-bio">
                {isEditingBio ? (
                  <>
                    <textarea
                      className="profile-input profile-textarea"
                      value={bioDraft}
                      onChange={(e) => setBioDraft(e.target.value)}
                      maxLength={240}
                      placeholder="Tell the world what kind of movie fan you are..."
                    />
                    <div className="profile-bio-actions">
                      <div className="profile-bio-buttons">
                        <button
                          className="profile-btn primary small"
                          onClick={handleSaveBio}
                          type="button"
                          disabled={isSavingBio}
                        >
                          {isSavingBio ? "Saving..." : "Save bio"}
                        </button>
                        <button
                          className="profile-btn ghost small"
                          onClick={cancelBioEdit}
                          type="button"
                          disabled={isSavingBio}
                        >
                          Cancel
                        </button>
                      </div>
                      <span className="profile-bio-counter">
                        {bioDraft.length}/240
                      </span>
                    </div>
                    {bioError && (
                      <div className="profile-error">{bioError}</div>
                    )}
                    {bioSuccess && (
                      <div className="profile-success">{bioSuccess}</div>
                    )}
                  </>
                ) : hasBio ? (
                  <div className="profile-bio-row">
                    <span className="bio-text">
                      {user.bio}
                      <button
                        className="profile-bio-edit-inline"
                        onClick={startBioEdit}
                        type="button"
                        aria-label="Edit bio"
                      >
                        ✏️
                      </button>
                    </span>
                  </div>
                ) : (
                  <button className="profile-bio-add-btn" onClick={startBioEdit}>
                    + Add bio
                  </button>
                )}
              </div>

              <div className="profile-meta">
                <span className="profile-chip">🎬 Member</span>
              </div>
            </div>
          </div>
        </section>

        {/* MAIN */}
        <main className="profile-main">
          <section className="profile-panel profile-grid">
            {/* LEFT: DETAILS */}
            <div className="profile-card profile-details">
              <div className="profile-card-header">
                <div>
                  <h2>Your details</h2>
                  <p className="profile-muted">
                    Update your display name, email and password.
                  </p>
                </div>

                {!isEditing ? (
                  <button
                    className="profile-btn primary small"
                    onClick={handleEditClick}
                    type="button"
                  >
                    Edit profile
                  </button>
                ) : (
                  <div className="profile-edit-actions">
                    <button
                      className="profile-btn ghost small"
                      onClick={handleCancel}
                      type="button"
                      disabled={isSavingProfile}
                    >
                      Cancel
                    </button>
                    <button
                      className="profile-btn primary small"
                      onClick={handleSave}
                      type="button"
                      disabled={isSavingProfile}
                    >
                      {isSavingProfile ? "Saving..." : "Save changes"}
                    </button>
                  </div>
                )}
              </div>

              <div className="profile-field-group">
                <label htmlFor="display-name">Display name</label>
                <input
                  id="display-name"
                  className="profile-input"
                  name="userName"
                  value={tempUser.userName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Your name as other users see it"
                />
              </div>

              <div className="profile-field-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  className="profile-input"
                  name="email"
                  type="email"
                  value={tempUser.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="you@example.com"
                />
              </div>

              <div className="profile-divider" />

              <h3 className="profile-subtitle">Change password</h3>
              <p className="profile-muted">
                Leave all fields empty if you don&apos;t want to change your
                password.
              </p>

              <div className="profile-field-inline">
                <input
                  type="password"
                  placeholder="Current password"
                  className="profile-input"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  disabled={!isEditing}
                />
                <input
                  type="password"
                  placeholder="New password"
                  className="profile-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={!isEditing}
                />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  className="profile-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              {passwordError && (
                <div className="profile-error">{passwordError}</div>
              )}
              {passwordSuccess && (
                <div className="profile-success">{passwordSuccess}</div>
              )}
            </div>

            {/* RIGHT: STATS */}
            <aside className="profile-card profile-stats">
              <div className="profile-card-header">
                <h2>Overview</h2>
                <span className="profile-tag">Your activity</span>
              </div>

              <div className="profile-stats-grid">
                <div className="profile-stat">
                  <span className="profile-stat-label">Favorites</span>
                  <span className="profile-stat-value">
                    {favouritesCount}
                  </span>
                </div>

                <div className="profile-stat">
                  <span className="profile-stat-label">Member since</span>
                  <span className="profile-stat-value">
                    {user?.date ? new Date(user.date).toLocaleDateString("el-GR") : "—"} </span>
                </div>
              </div>
            </aside>
          </section>

          {/* FAVOURITES */}
          <section className="profile-panel profile-favorites">
            <div className="profile-card profile-fav-card">
              <div className="profile-card-header">
                <div>
                  <h2>Your favourite movies</h2>
                  <p className="profile-muted">
                    Your saved favourites appear here so you can revisit them
                    anytime.
                  </p>
                </div>
              </div>

              {favouritesCount > 0 ? (
                <SearchedMoviesView
                  movies={favorites.map((f) => ({
                    id: f.movieId,
                    title: f.title,
                    poster_path: f.posterPath,
                    overview: f.overview,
                    release_date: f.releaseDate,
                    vote_average: f.voteAverage,
                  }))}
                />
              ) : (
                <p className="empty-state">
                  No favourites added yet. Start exploring and tap the ♥ button
                  on movies you love.
                </p>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
