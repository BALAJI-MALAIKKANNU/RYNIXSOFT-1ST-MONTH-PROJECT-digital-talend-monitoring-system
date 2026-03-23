import AuthForm from "../components/AuthForm";
import API from "../api";

function Register({ switchPage }) {
  const handleRegister = async (data) => {
    try {
      const res = await API.post("/register", data);
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className="auth-wrapper">
      <AuthForm type="register" onSubmit={handleRegister} />

      <p className="switch-text">
        Already have an account?{" "}
        <span onClick={switchPage}>Login here</span>
      </p>
    </div>
  );
}

export default Register;