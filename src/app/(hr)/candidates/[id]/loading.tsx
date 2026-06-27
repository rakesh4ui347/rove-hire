export default function Loading() {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-6 w-32 rounded bg-gray-200" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="h-48 rounded-xl bg-gray-100" />
            <div className="h-64 rounded-xl bg-gray-100" />
          </div>
          <div className="space-y-6">
            <div className="h-40 rounded-xl bg-gray-100" />
            <div className="h-56 rounded-xl bg-gray-100" />
          </div>
        </div>
      </div>
    );
  }