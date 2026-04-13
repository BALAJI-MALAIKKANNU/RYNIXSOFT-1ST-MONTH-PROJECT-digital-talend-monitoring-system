import { useEffect, useState } from "react";
import API from "../api";
import "../styles/admin.css";

function AdminDashboard() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [taskRes, userRes, analyticsRes] = await Promise.all([
        API.get("/tasks"),
        API.get("/users"),
        API.get("/analytics"),
      ]);

      setTasks(taskRes.data);
      setUsers(userRes.data);
      setAnalytics(analyticsRes.data);
    } catch {
      alert("Error loading dashboard");
    } finally {
      setLoading(false);
    }
  };

  // CREATE TASK
  const createTask = async () => {
    if (!title || !description || !assignedTo) {
      return alert("All fields required");
    }

    try {
      await API.post("/tasks", {
        title,
        description,
        assigned_to: assignedTo,
      });

      setTitle("");
      setDescription("");
      setAssignedTo("");
      fetchAll();
    } catch {
      alert("Error creating task");
    }
  };

  // DELETE TASK
  const deleteTask = async (id) => {
    if (!window.confirm("Delete task?")) return;

    try {
      await API.delete(`/tasks/${id}`);
      fetchAll();
    } catch {
      alert("Error deleting task");
    }
  };

  // REVIEW TASK
  const reviewTask = async (id, status) => {
    try {
      await API.put(`/tasks/${id}/review`, { status });
      fetchAll();
    } catch {
      alert("Error updating task");
    }
  };

  // 🏆 LEADERBOARD
  const leaderboard = {};
  tasks.forEach((task) => {
    if (task.status === "completed") {
      leaderboard[task.assigned_to] =
        (leaderboard[task.assigned_to] || 0) + 1;
    }
  });

  const leaderboardData = Object.entries(leaderboard)
    .map(([user, count]) => ({ user, count }))
    .sort((a, b) => b.count - a.count);

  if (loading) return <h2>Loading...</h2>;

  return (
    <div className="admin-container">

      {/* HEADER */}
      <div className="admin-header">
        <h1>Admin Dashboard 🚀</h1>
        <button
          className="logout-btn"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </div>

      {/* STATS */}
      <div className="stats-grid">
        <div className="stat-card">Total {analytics.total || 0}</div>
        <div className="stat-card green">
          Completed {analytics.completed || 0}
        </div>
        <div className="stat-card orange">
          Pending {analytics.pending || 0}
        </div>
        <div className="stat-card blue">
          Review {analytics.in_review || 0}
        </div>
      </div>

      {/* SAFE ANALYTICS (NO CRASH) */}
      <div className="chart-card">
        <h3>Task Analytics</h3>

        <div className="fake-chart">
          <div>Completed: {analytics.completed || 0}</div>
          <div>Pending: {analytics.pending || 0}</div>
          <div>In Review: {analytics.in_review || 0}</div>
        </div>
      </div>

      {/* LEADERBOARD */}
      <div className="leaderboard">
        <h3>Top Performers 🏆</h3>

        {leaderboardData.length === 0 && <p>No data yet</p>}

        {leaderboardData.map((u, i) => (
          <div key={i} className="leader-row">
            <span>
              {i + 1}. {u.user}
            </span>
            <b>{u.count}</b>
          </div>
        ))}
      </div>

      {/* MAIN GRID */}
      <div className="main-grid">

        {/* CREATE TASK */}
        <div className="card form">
          <h2>Create Task</h2>

          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
          >
            <option value="">Select User</option>
            {users.map((u) => (
              <option key={u._id} value={u.email}>
                {u.email}
              </option>
            ))}
          </select>

          <button className="primary-btn" onClick={createTask}>
            Create Task
          </button>
        </div>

        {/* TASK LIST */}
        <div>
          <h2>Tasks</h2>

          {tasks.map((task) => (
            <div key={task._id} className="task-card">

              <div className="task-header">
                <div>
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                </div>

                <span className={`badge ${task.status}`}>
                  {task.status}
                </span>
              </div>

              {task.submission && (
                <div className="submission">
                  <b>Submission:</b>
                  <p>{task.submission}</p>
                </div>
              )}

              <div className="actions">

                {task.status === "in_review" && (
                  <>
                    <button
                      className="approve"
                      onClick={() => reviewTask(task._id, "completed")}
                    >
                      Approve
                    </button>

                    <button
                      className="reject"
                      onClick={() => reviewTask(task._id, "rejected")}
                    >
                      Reject
                    </button>
                  </>
                )}

                <button
                  className="delete"
                  onClick={() => deleteTask(task._id)}
                >
                  Delete
                </button>

              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;

