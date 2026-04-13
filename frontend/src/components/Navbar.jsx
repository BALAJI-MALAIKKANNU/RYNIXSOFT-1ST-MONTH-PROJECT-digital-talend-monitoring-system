function Navbar() {
  const email = localStorage.getItem("email");

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="navbar">
      <div>
        <h3>Dashboard</h3>
      </div>

      <div className="nav-right">
        <span>{new Date().toLocaleDateString()}</span>
        <span>{email}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Navbar;