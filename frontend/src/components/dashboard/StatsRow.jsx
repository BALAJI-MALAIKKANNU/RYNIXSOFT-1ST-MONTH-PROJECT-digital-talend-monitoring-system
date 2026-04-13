function StatsRow({ stats, onFilter }) {
  const items = [
    { label: "My Tasks", value: stats.total, color: "#3b82f6", key: "all" },
    { label: "Pending", value: stats.pending, color: "#f59e0b", key: "pending" },
    { label: "Submitted", value: stats.submitted, color: "#0ea5e9", key: "submitted" },
    { label: "Completed", value: stats.completed, color: "#22c55e", key: "completed" },
  ];

  return (
    <div className="stats-row">
      {items.map((item) => (
        <div
          key={item.label}
          className="stat-card"
          onClick={() => onFilter(item.key)}
          style={{ borderLeft: `4px solid ${item.color}` }}
        >
          <h2 style={{ color: item.color }}>{item.value}</h2>
          <p>{item.label}</p>
        </div>
      ))}
    </div>
  );
}

export default StatsRow;