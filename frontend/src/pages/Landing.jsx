import { useNavigate } from "react-router-dom";
import "../styles/landing.css";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">

      {/* 🔥 HERO SECTION */}
      <section className="hero">
        <h1>Digital Talent Management System</h1>
        <p>
          Manage tasks, track progress, and boost team productivity — all in one place.
        </p>

        <div className="hero-buttons">
          <button onClick={() => navigate("/login")}>Login</button>
          <button className="secondary" onClick={() => navigate("/register")}>
            Register
          </button>
        </div>
      </section>

      {/* 🚀 FEATURES */}
      <section className="features">
        <h2>Core Features</h2>

        <div className="feature-cards">
          <div className="card">
            <h3>📋 Task Management</h3>
            <p>Create, assign, and track tasks efficiently.</p>
          </div>

          <div className="card">
            <h3>👥 Role Control</h3>
            <p>Separate admin and user access securely.</p>
          </div>

          <div className="card">
            <h3>📊 Analytics</h3>
            <p>Track performance with real-time insights.</p>
          </div>
        </div>
      </section>

      {/* ⚙️ HOW IT WORKS */}
      <section className="steps">
        <h2>How It Works</h2>

        <div className="steps-container">
          <div className="step">
            <span>1</span>
            <p>Register your account</p>
          </div>

          <div className="step">
            <span>2</span>
            <p>Get assigned tasks</p>
          </div>

          <div className="step">
            <span>3</span>
            <p>Submit & track progress</p>
          </div>
        </div>
      </section>

      {/* 🔥 CTA SECTION */}
      <section className="cta">
        <h2>Start Managing Your Tasks Today 🚀</h2>
        <button onClick={() => navigate("/register")}>
          Get Started
        </button>
      </section>

      {/* 📌 FOOTER */}
      <footer className="footer">
        <p>© 2026 DTMS — Digital Talent Management System</p>
        <p>Built by Balaji</p>
      </footer>

    </div>
  );
}

export default Landing;