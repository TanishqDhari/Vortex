export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-gray-800 bg-gray-900/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-8 w-48 bg-gray-800 rounded animate-pulse mb-2" />
              <div className="h-4 w-32 bg-gray-800 rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-4">
              <div className="h-10 w-64 bg-gray-800 rounded animate-pulse" />
              <div className="h-10 w-10 bg-gray-800 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Loading */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 w-24 bg-gray-800 rounded animate-pulse mb-2" />
                  <div className="h-8 w-20 bg-gray-800 rounded animate-pulse mb-1" />
                  <div className="h-3 w-28 bg-gray-800 rounded animate-pulse" />
                </div>
                <div className="h-12 w-12 bg-gray-800 rounded-lg animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        {/* Content Loading */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg">
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-6 w-40 bg-gray-800 rounded animate-pulse mb-2" />
                <div className="h-4 w-64 bg-gray-800 rounded animate-pulse" />
              </div>
              <div className="h-10 w-24 bg-gray-800 rounded animate-pulse" />
            </div>
          </div>
          <div className="p-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-4 border-b border-gray-800 last:border-0">
                <div className="h-8 w-8 bg-gray-800 rounded-full animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 w-32 bg-gray-800 rounded animate-pulse mb-1" />
                  <div className="h-3 w-48 bg-gray-800 rounded animate-pulse" />
                </div>
                <div className="h-6 w-16 bg-gray-800 rounded animate-pulse" />
                <div className="h-6 w-16 bg-gray-800 rounded animate-pulse" />
                <div className="h-8 w-8 bg-gray-800 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
