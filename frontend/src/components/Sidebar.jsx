import { Link } from "react-router-dom";

function Sidebar() {
  const role = localStorage.getItem("role");

  return (
    <div className="sidebar">
      <h2>DTMS</h2>

      <Link to="/">Home</Link>

      {role === "admin" && (
        <>
          <Link to="/admin">Dashboard</Link>
        </>
      )}

      {role === "user" && (
        <>
          <Link to="/user">My Tasks</Link>
        </>
      )}
    </div>
  );
}

export default Sidebar;