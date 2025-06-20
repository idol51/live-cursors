export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-600 via-gray-900 to-black">
      <div className="text-center space-y-4 animate-fade-in">
        <img
          src="/logo-nobg.png" // 👈 use your background here
          alt="Waiting for server"
          className="w-72 mx-auto rounded-xl"
        />
        <h1 className="text-xl font-semibold text-white animate-pulse">
          Waiting for connection...
        </h1>
        <div className="w-full h-2 bg-white rounded-full overflow-hidden">
          <div className="h-full w-full animate-loading-bar bg-gradient-to-r from-amber-200 via-amber-500 to-amber-200" />
        </div>
      </div>
    </div>
  );
}
