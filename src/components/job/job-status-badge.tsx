interface JobStatusBadgeProps {
    status: "OPEN" | "CLOSED";
  }
  
  export function JobStatusBadge({
    status,
  }: JobStatusBadgeProps) {
    const isOpen = status === "OPEN";
  
    return (
      <div
        className={`flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ${
          isOpen
            ? "bg-emerald-50 text-emerald-700"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        <div className={`h-2 w-2 rounded-full ${isOpen ? "bg-green-500" : "bg-gray-500"}`} />
        {isOpen ? "Open" : "Closed"}
      </div>
    );
  }