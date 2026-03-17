import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getApplications } from "../api/client";
import ApplicationCard from "../components/ApplicationCard";
import "./Dashboard.css";

const STATUSES = ["All", "Applied", "Interview", "Offer", "Rejected"];

export default function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const data = await getApplications();
        setApplications(data);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
    load();
  }, []);

  const filtered = filter === "All" ? applications : applications.filter(a => a.status === filter);

  const counts = {
    All: applications.length,
    Applied: applications.filter(a => a.status === "Applied").length,
    Interview: applications.filter(a => a.status === "Interview").length,
    Offer: applications.filter(a => a.status === "Offer").length,
    Rejected: applications.filter(a => a.status === "Rejected").length,
  };

  function handleUpdate(updated) {
    setApplications(prev => prev.map(a => a.id === updated.id ? updated : a));
  }

  function handleDelete(id) {
    setApplications(prev => prev.filter(a => a.id !== id));
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Applications</h1>
          <p className="header-sub">{applications.length} total tracked</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/add")}>
          + New Application
        </button>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-num">{counts.Applied}</div>
          <div className="stat-label">Applied</div>
        </div>
        <div className="stat-card interview">
          <div className="stat-num">{counts.Interview}</div>
          <div className="stat-label">Interview</div>
        </div>
        <div className="stat-card offer">
          <div className="stat-num">{counts.Offer}</div>
          <div className="stat-label">Offers</div>
        </div>
        <div className="stat-card rejected">
          <div className="stat-num">{counts.Rejected}</div>
          <div className="stat-label">Rejected</div>
        </div>
      </div>

      <div className="filter-row">
        {STATUSES.map(s => (
          <button
            key={s}
            className={`filter-btn ${filter === s ? "active" : ""}`}
            onClick={() => setFilter(s)}
          >
            {s}
            <span className="filter-count">{counts[s]}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="empty-state">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          {filter === "All" ? (
            <>
              <div className="empty-icon">📋</div>
              <p>No applications yet</p>
              <button className="btn btn-primary" onClick={() => navigate("/add")}>
                Add your first application
              </button>
            </>
          ) : (
            <p>No {filter.toLowerCase()} applications</p>
          )}
        </div>
      ) : (
        <div className="apps-grid">
          {filtered.map(app => (
            <ApplicationCard
              key={app.id}
              app={app}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}