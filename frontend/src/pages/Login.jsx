import AuthForm from "../components/AuthForm";
import API from "../api";

function Login({ switchPage }) {
  const handleLogin = async (data) => {
    try {
      const res = await API.post("/login", data);
      alert(res.data.message);

      // optional: store token
      localStorage.setItem("token", res.data.token);

    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-wrapper">
      <AuthForm type="login" onSubmit={handleLogin} />

      <p className="switch-text">
        Don’t have an account?{" "}
        <span onClick={switchPage}>Register here</span>
      </p>
    </div>
  );
}

export default Login;