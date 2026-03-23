import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const [page, setPage] = useState("login");

  return (
    <div className="app-container">
      {page === "login" ? (
        <Login switchPage={() => setPage("register")} />
      ) : (
        <Register switchPage={() => setPage("login")} />
      )}
    </div>
  );
}

export default App;