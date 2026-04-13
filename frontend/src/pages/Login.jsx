import AuthForm from "../components/AuthForm";
import API from "../api";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleLogin = async (data) => {
    try {
      const res = await API.post("/login", data);

      // ✅ store token
      localStorage.setItem("token", res.data.token);

      // ✅ store role
      localStorage.setItem("role", res.data.role);

      // ✅ store email (for user dashboard filtering)
      localStorage.setItem("email", data.email);

      // 🔥 ROLE BASED REDIRECT
      if (res.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/user");
      }

    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <AuthForm type="login" onSubmit={handleLogin} />

        <p className="switch-text">
          Don’t have an account?{" "}
          <span onClick={() => navigate("/register")}>
            Register here
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;