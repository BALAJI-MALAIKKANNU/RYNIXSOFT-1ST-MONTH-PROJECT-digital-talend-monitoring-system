function EmptyState({ type }) {
  if (type === "noTasks") {
    return <div className="empty">No tasks yet — check back soon</div>;
  }

  if (type === "allDone") {
    return <div className="empty success">All done! 🎉</div>;
  }

  return null;
}

export default EmptyState;