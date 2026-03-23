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

  const password = form.password;

  // 🔐 Password checks
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

  // 🔍 Validation
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
      newErrors.email = "Enter valid email (example@gmail.com)";
    }

    if (!form.password) {
      newErrors.password = "Password can't be blank";
    } else if (type === "register") {
      // Only strict rules for REGISTER
      if (!checks.length) {
        newErrors.password = "8–15 characters required";
      } else if (!checks.upper) {
        newErrors.password = "Must include uppercase";
      } else if (!checks.lower) {
        newErrors.password = "Must include lowercase";
      } else if (!checks.number) {
        newErrors.password = "Must include number";
      } else if (!checks.symbol) {
        newErrors.password = "Must include symbol";
      }
    }

    setErrors(newErrors);

    // 🔄 Shake animation
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

      {/* Username */}
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

      {/* Email */}
      <input
        className={errors.email ? "error" : ""}
        placeholder="Email"
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />
      {errors.email && <p className="error-text">{errors.email}</p>}

      {/* Password */}
      <div className="password-box">
        <input
          type="password"
          className={errors.password ? "error" : ""}
          placeholder="Password"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        {/* ✅ ONLY SHOW IN REGISTER */}
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