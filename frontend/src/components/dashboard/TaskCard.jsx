import API from "../../api";

function TaskCard({ task, fetchTasks }) {
  const getColor = () => {
    if (task.status === "pending") return "orange";
    if (task.status === "in_review") return "blue";
    if (task.status === "completed") return "green";
    if (task.status === "rejected") return "red";
    return "gray";
  };

  // 🔥 SUBMIT TASK
  const submitTask = async () => {
    const submission = prompt("Enter your work (link or text)");

    if (!submission) return;

    try {
      await API.put(`/tasks/${task._id}/submit`, {
        submission,
      });

      alert("Task submitted");

      fetchTasks();
    } catch (err) {
      console.error(err);
      alert("Submit failed");
    }
  };

  return (
    <div className="task-card">
      <div className="task-info">
        <h4>{task.title}</h4>
        <p>Assigned to: {task.assigned_to}</p>
      </div>

      <span className="badge" style={{ background: getColor() }}>
        {task.status}
      </span>

      {/* 🔥 ACTION BUTTON */}
      {task.status === "pending" && (
        <button className="action-btn" onClick={submitTask}>
          Submit
        </button>
      )}

      {task.status !== "pending" && (
        <button className="action-btn">
          View
        </button>
      )}
    </div>
  );
}

export default TaskCard;