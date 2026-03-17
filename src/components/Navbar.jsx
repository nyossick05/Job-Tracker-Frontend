import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => navigate("/")}>
        <span className="brand-bracket">[</span>
        <span className="brand-text">JobTracker</span>
        <span className="brand-bracket">]</span>
      </div>

      <div className="navbar-right">
        <span className="navbar-user">
          {localStorage.getItem("username") || "user"}
        </span>
        <button className="btn btn-ghost btn-sm" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
}