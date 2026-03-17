import { useState } from "react";
import { updateApplication, deleteApplication } from "../api/client";
import "./ApplicationCard.css";

const STATUS_COLORS = {
  Applied: { bg: "rgba(83, 82, 237, 0.15)", color: "#7c7bff", border: "rgba(83, 82, 237, 0.3)" },
  Interview: { bg: "rgba(255, 165, 2, 0.15)", color: "#ffa502", border: "rgba(255, 165, 2, 0.3)" },
  Offer: { bg: "rgba(46, 213, 115, 0.15)", color: "#2ed573", border: "rgba(46, 213, 115, 0.3)" },
  Rejected: { bg: "rgba(255, 71, 87, 0.15)", color: "#ff4757", border: "rgba(255, 71, 87, 0.3)" },
};

const STATUSES = ["Applied", "Interview", "Offer", "Rejected"];

export default function ApplicationCard({ app, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    company_name: app.company_name,
    position: app.position,
    status: app.status,
    deadline: app.deadline || "",
    notes: app.notes || "",
  });
  const [loading, setLoading] = useState(false);

  const statusStyle = STATUS_COLORS[app.status] || STATUS_COLORS["Applied"];

  async function handleSave() {
    setLoading(true);
    try {
      const updated = await updateApplication(app.id, form);
      onUpdate(updated);
      setEditing(false);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  async function handleDelete() {
    if (!confirm(`Delete application to ${app.company_name}?`)) return;
    try {
      await deleteApplication(app.id);
      onDelete(app.id);
    } catch (e) {
      console.error(e);
    }
  }

  if (editing) {
    return (
      <div className="app-card editing">
        <div className="edit-grid">
          <div className="field">
            <label>Company</label>
            <input value={form.company_name} onChange={e => setForm({ ...form, company_name: e.target.value })} />
          </div>
          <div className="field">
            <label>Position</label>
            <input value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} />
          </div>
          <div className="field">
            <label>Status</label>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Deadline</label>
            <input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
          </div>
          <div className="field full">
            <label>Notes</label>
            <input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Any notes..." />
          </div>
        </div>
        <div className="card-actions">
          <button className="btn btn-primary" onClick={handleSave} disabled={loading}>Save</button>
          <button className="btn btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-card">
      <div className="card-top">
        <div>
          <div className="company-name">{app.company_name}</div>
          <div className="position">{app.position}</div>
        </div>
        <span className="status-badge" style={{ background: statusStyle.bg, color: statusStyle.color, border: `1px solid ${statusStyle.border}` }}>
          {app.status}
        </span>
      </div>

      <div className="card-meta">
        <span className="meta-item">
          Applied {new Date(app.applied_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </span>
        {app.deadline && (
          <span className="meta-item deadline">
            ⏰ Due {new Date(app.deadline + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        )}
      </div>

      {app.notes && <div className="card-notes">{app.notes}</div>}

      <div className="card-actions">
        <button className="btn btn-ghost btn-sm" onClick={() => setEditing(true)}>Edit</button>
        <button className="btn btn-danger btn-sm" onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
}