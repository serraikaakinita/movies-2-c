import React, { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://movies2cbackend-production.up.railway.app/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        setError("Λάθος email ή password");
        return;
      }

      const data = await response.json();
      console.log("Login success:", data);

      // Αποθήκευση token
      localStorage.setItem("token", data.token);

      // Redirect πίσω στην αρχική σελίδα
      window.location.href = "/";
    } catch (err) {
      console.error("Login error:", err);
      setError("Πρόβλημα στον server");
    }
  };

  return (
    <div
      style={{
        color: "white",
        fontSize: "20px",
        textAlign: "center",
        marginTop: "100px",
        backgroundColor: "black",
        height: "100vh",
        width: "100vw",
      }}
    >
      <h1 style={{ fontSize: "40px" }}>Login</h1>

      <form
        onSubmit={handleLogin}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "300px",
          margin: "30px auto",
        }}
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: "10px", margin: "10px 0" }}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: "10px", margin: "10px 0" }}
          required
        />

        <button
          type="submit"
          style={{
            padding: "10px",
            background: "#ff4757",
            border: "none",
            color: "white",
            cursor: "pointer",
            borderRadius: "5px",
            fontSize: "16px",
          }}
        >
          Login
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
