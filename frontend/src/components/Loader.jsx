function Loader({ label = "Loading...", fullScreen = false }) {
  const containerClass = fullScreen
    ? "flex min-h-screen items-center justify-center"
    : "flex items-center justify-center py-10";

  return (
    <div className={containerClass}>
      <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-3 shadow-panel">
        <span className="h-3 w-3 animate-pulse rounded-full bg-brand-500" />
        <span className="text-sm font-medium text-slate-600">{label}</span>
      </div>
    </div>
  );
}

export default Loader;
