import { useEffect, useState } from "react";
import API from "../api";
import "../styles/dashboard.css";
import StatsRow from "../components/dashboard/StatsRow";
import ProgressBar from "../components/dashboard/ProgressBar";
import FilterTabs from "../components/dashboard/FilterTabs";
import TaskList from "../components/dashboard/TaskList";

function UserDashboard() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await API.get("/tasks");
    setTasks(res.data);
  };

  const filteredTasks =
    filter === "all"
      ? tasks
      : tasks.filter((t) => t.status === filter);

  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === "pending").length,
    submitted: tasks.filter((t) => t.status === "submitted").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  return (
    <div className="dashboard-container">

      <StatsRow stats={stats} onFilter={setFilter} />

      <ProgressBar {...stats} />

      <FilterTabs active={filter} setActive={setFilter} counts={stats} />

      <TaskList tasks={filteredTasks} />

    </div>
  );
}

export default UserDashboard;