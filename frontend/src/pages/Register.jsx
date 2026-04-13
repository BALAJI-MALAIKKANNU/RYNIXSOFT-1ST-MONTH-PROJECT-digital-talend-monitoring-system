import AuthForm from "../components/AuthForm";
import API from "../api";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const handleRegister = async (data) => {
    try {
      const res = await API.post("/register", data);
      alert(res.data.message);

      navigate("/login");

    } catch (err) {
      alert(err.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <AuthForm type="register" onSubmit={handleRegister} />

        <p className="switch-text">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;