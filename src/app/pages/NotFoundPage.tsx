import { Link } from "react-router";

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <h1 className="text-6xl mb-4">404</h1>
      <h2 className="text-2xl mb-4">Page Not Found</h2>
      <p className="text-white/60 mb-6">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded"
      >
        Go Home
      </Link>
    </div>
  );
}
