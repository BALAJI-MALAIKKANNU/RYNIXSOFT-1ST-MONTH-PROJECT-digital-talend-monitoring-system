function FilterTabs({ active, setActive, counts }) {
  const tabs = [
    { key: "all", label: "All", count: counts.total },
    { key: "pending", label: "Pending", count: counts.pending },
    { key: "submitted", label: "In Review", count: counts.submitted },
    { key: "completed", label: "Completed", count: counts.completed },
  ];

  return (
    <div className="tabs">
      {tabs.map((t) => (
        <button
          key={t.key}
          className={active === t.key ? "tab active" : "tab"}
          onClick={() => setActive(t.key)}
        >
          {t.label} ({t.count})
        </button>
      ))}
    </div>
  );
}

export default FilterTabs;