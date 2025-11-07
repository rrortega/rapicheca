export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header simple */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard
            </h1>
            <a
              href="/login"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Ir a Login
            </a>
          </div>
        </div>
      </header>

      {/* Main content simple */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Dashboard del Sistema
              </h2>
              <p className="text-gray-500">
                Esta es la página del dashboard sin autenticación.
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Para una versión completa con autenticación, implementar ProtectedRoute.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
