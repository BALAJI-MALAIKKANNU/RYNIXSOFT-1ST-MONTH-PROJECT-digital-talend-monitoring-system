import { useState } from "react";
import "./auth.css";

function AuthForm({ type, onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [shake, setShake] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const password = form.password;

  const checks = {
    length: password.length >= 8 && password.length <= 15,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[!@#$%^&*]/.test(password),
  };

  const strength = Object.values(checks).filter(Boolean).length;

  const getStrengthLabel = () => {
    if (strength <= 2) return "Weak";
    if (strength <= 4) return "Medium";
    return "Strong";
  };

  const validate = () => {
    let newErrors = {};

    if (type === "register") {
      if (!form.name) {
        newErrors.name = "Username can't be blank";
      } else if (form.name.length > 15) {
        newErrors.name = "Max 15 characters allowed";
      }
    }

    if (!form.email) {
      newErrors.email = "Email can't be blank";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter valid email";
    }

    if (!form.password) {
      newErrors.password = "Password can't be blank";
    } else if (type === "register") {
      if (!checks.length) newErrors.password = "8–15 characters required";
      else if (!checks.upper) newErrors.password = "Must include uppercase";
      else if (!checks.lower) newErrors.password = "Must include lowercase";
      else if (!checks.number) newErrors.password = "Must include number";
      else if (!checks.symbol) newErrors.password = "Must include symbol";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(form);
    }
  };

  return (
    <div className={`container ${shake ? "shake" : ""}`}>
      <h2>{type === "login" ? "Login" : "Register"}</h2>

      {type === "register" && (
        <>
          <input
            className={errors.name ? "error" : ""}
            placeholder="Username"
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />
          {errors.name && <p className="error-text">{errors.name}</p>}
        </>
      )}

      <input
        className={errors.email ? "error" : ""}
        placeholder="Email"
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />
      {errors.email && <p className="error-text">{errors.email}</p>}

      {/* 🔐 PASSWORD */}
      <div className="password-box">
        <input
          type={showPassword ? "text" : "password"}
          className={errors.password ? "error" : ""}
          placeholder="Password"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        {/* 👁️ SVG ICON */}
        <span
          className="eye-icon"
          onMouseDown={() => setShowPassword(true)}
          onMouseUp={() => setShowPassword(false)}
          onMouseLeave={() => setShowPassword(false)}
        >
          {showPassword ? (
            // OPEN EYE
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M2 12C2 12 5 6 12 6C19 6 22 12 22 12C22 12 19 18 12 18C5 18 2 12 2 12Z"
                stroke="#1e293b" strokeWidth="2"/>
              <circle cx="12" cy="12" r="3"
                stroke="#1e293b" strokeWidth="2"/>
            </svg>
          ) : (
            // CLOSED EYE
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M3 3L21 21" stroke="#1e293b" strokeWidth="2"/>
              <path d="M10.5 10.5C10.1 10.9 10 11.4 10 12C10 13.1 10.9 14 12 14C12.6 14 13.1 13.9 13.5 13.5"
                stroke="#1e293b" strokeWidth="2"/>
              <path d="M9.9 5.1C10.6 5 11.3 5 12 5C19 5 22 12 22 12"
                stroke="#1e293b" strokeWidth="2"/>
              <path d="M6.6 6.6C4.5 8 3 10 2 12C2 12 5 18 12 18"
                stroke="#1e293b" strokeWidth="2"/>
            </svg>
          )}
        </span>

        {type === "register" && (
          <>
            <div className="strength-bar">
              <div className={`strength-fill strength-${strength}`}></div>
            </div>

            <span className="strength-text">
              {getStrengthLabel()}
            </span>

            <div className="rules">
              <p className={checks.length ? "valid" : ""}>✔ 8–15 Characters</p>
              <p className={checks.upper ? "valid" : ""}>✔ Uppercase Letter</p>
              <p className={checks.lower ? "valid" : ""}>✔ Lowercase Letter</p>
              <p className={checks.number ? "valid" : ""}>✔ Number</p>
              <p className={checks.symbol ? "valid" : ""}>✔ Special Symbol</p>
            </div>
          </>
        )}

        {errors.password && <p className="error-text">{errors.password}</p>}
      </div>

      <button onClick={handleSubmit}>
        {type === "login" ? "Login" : "Register"}
      </button>
    </div>
  );
}

export default AuthForm;