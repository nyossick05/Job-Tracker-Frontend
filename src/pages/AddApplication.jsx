import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createApplication } from "../api/client";
import "./AddApplication.css";

const STATUSES = ["Applied", "Interview", "Offer", "Rejected"];

export default function AddApplication() {
  const [form, setForm] = useState({
    company_name: "",
    position: "",
    status: "Applied",
    deadline: "",
    notes: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        ...form,
        deadline: form.deadline || null,
        notes: form.notes || null,
      };
      await createApplication(payload);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  return (
    <div className="add-page">
      <div className="add-container">
        <div className="add-header">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate("/")}>
            ← Back
          </button>
          <h1>New Application</h1>
          <p>Track a new job application</p>
        </div>

        <form onSubmit={handleSubmit} className="add-form card">
          {error && <div className="error-msg">{error}</div>}

          <div className="form-grid">
            <div className="field">
              <label>Company Name *</label>
              <input
                type="text"
                placeholder="Google, Meta, Stripe..."
                value={form.company_name}
                onChange={e => setForm({ ...form, company_name: e.target.value })}
                required
              />
            </div>

            <div className="field">
              <label>Position *</label>
              <input
                type="text"
                placeholder="Software Engineer, PM..."
                value={form.position}
                onChange={e => setForm({ ...form, position: e.target.value })}
                required
              />
            </div>

            <div className="field">
              <label>Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div className="field">
              <label>Deadline / Follow-up Date</label>
              <input
                type="date"
                value={form.deadline}
                onChange={e => setForm({ ...form, deadline: e.target.value })}
              />
            </div>

            <div className="field full">
              <label>Notes</label>
              <input
                type="text"
                placeholder="Referral from John, remote-friendly, great benefits..."
                value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })}
              />
            </div>
          </div>

          <div className="form-actions">
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Application →"}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => navigate("/")}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}