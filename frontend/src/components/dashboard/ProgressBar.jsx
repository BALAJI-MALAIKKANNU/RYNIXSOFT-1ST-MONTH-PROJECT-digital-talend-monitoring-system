function ProgressBar({ completed, submitted, total }) {
  const percent = total ? Math.round(((completed + submitted) / total) * 100) : 0;

  return (
    <div className="progress-box">
      <div className="progress-header">
        <span>Your Progress</span>
        <span>{percent}%</span>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${percent}%` }}
        />
      </div>

      <small>{completed + submitted} of {total} tasks done</small>
    </div>
  );
}

export default ProgressBar;