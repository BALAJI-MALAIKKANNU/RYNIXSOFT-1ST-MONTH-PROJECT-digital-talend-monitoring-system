import TaskCard from "./TaskCard";

function TaskList({ tasks }) {
  if (!tasks.length) return <p>No tasks found</p>;

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskCard key={task._id} task={task} />
      ))}
    </div>
  );
}

export default TaskList;