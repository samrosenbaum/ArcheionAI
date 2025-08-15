import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <Skeleton className="w-32 h-6" />
            </div>
            <div className="flex items-center space-x-4">
              <Skeleton className="w-24 h-8" />
              <Skeleton className="w-20 h-8" />
              <Skeleton className="w-8 h-8 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg border">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="w-24 h-4" />
                <Skeleton className="w-4 h-4" />
              </div>
              <Skeleton className="w-16 h-8 mb-2" />
              <Skeleton className="w-20 h-3" />
            </div>
          ))}
        </div>

        {/* Quick Actions Skeleton */}
        <div className="bg-white p-6 rounded-lg border mb-8">
          <div className="mb-4">
            <Skeleton className="w-32 h-6 mb-2" />
            <Skeleton className="w-48 h-4" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Document Categories Skeleton */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg border">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <Skeleton className="w-40 h-6 mb-2" />
                  <Skeleton className="w-64 h-4" />
                </div>
                <div className="flex space-x-2">
                  <Skeleton className="w-16 h-8" />
                  <Skeleton className="w-16 h-8" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="border p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Skeleton className="w-10 h-10 rounded-lg" />
                        <div>
                          <Skeleton className="w-24 h-4 mb-1" />
                          <Skeleton className="w-32 h-3" />
                        </div>
                      </div>
                      <Skeleton className="w-6 h-6" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <Skeleton className="w-16 h-3 mb-1" />
                        <Skeleton className="w-8 h-4" />
                      </div>
                      <div>
                        <Skeleton className="w-20 h-3 mb-1" />
                        <Skeleton className="w-16 h-4" />
                      </div>
                    </div>
                    <div className="pt-3 border-t">
                      <Skeleton className="w-32 h-3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="space-y-6">
            {/* AI Insights Skeleton */}
            <div className="bg-white p-6 rounded-lg border">
              <div className="mb-4">
                <Skeleton className="w-24 h-6 mb-2" />
                <Skeleton className="w-48 h-4" />
              </div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="border rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <Skeleton className="w-12 h-5" />
                      <Skeleton className="w-16 h-4" />
                    </div>
                    <Skeleton className="w-full h-4 mb-1" />
                    <Skeleton className="w-3/4 h-3 mb-2" />
                    <Skeleton className="w-20 h-4" />
                  </div>
                ))}
              </div>
              <Skeleton className="w-full h-8 mt-4" />
            </div>

            {/* Recent Activity Skeleton */}
            <div className="bg-white p-6 rounded-lg border">
              <Skeleton className="w-32 h-6 mb-4" />
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <Skeleton className="w-2 h-2 rounded-full mt-2 flex-shrink-0" />
                    <div className="flex-1">
                      <Skeleton className="w-32 h-4 mb-1" />
                      <Skeleton className="w-24 h-3 mb-1" />
                      <div className="flex items-center justify-between">
                        <Skeleton className="w-16 h-5" />
                        <Skeleton className="w-12 h-3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="my-4 border-t" />
              <Skeleton className="w-full h-8" />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
