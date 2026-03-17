import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/client";
import "./Auth.css";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginUser(form.username, form.password);
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("username", form.username);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="auth-header">
          <div className="auth-logo">
            <span className="brand-bracket">[</span>
            <span>JT</span>
            <span className="brand-bracket">]</span>
          </div>
          <h1>Welcome back</h1>
          <p>Sign in to your job tracker</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-msg">{error}</div>}

          <div className="field">
            <label>Username</label>
            <input
              type="text"
              placeholder="your username"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>

          <div className="field">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button className="btn btn-primary full-width" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in →"}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}