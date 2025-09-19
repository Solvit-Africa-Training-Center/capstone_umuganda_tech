const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-200 font-poppins px-4">
      <h2 className="text-5xl font-bold text-indigo-600 mb-4">404</h2>
      <h3 className="text-2xl font-semibold text-gray-800 mb-2">
        Page Not Found
      </h3>
      <p className="text-gray-600 text-center max-w-xl">
        Sorry! The page you are looking for does not exist or has been moved.
      </p>
      <a
        href="/"
        className="mt-6 inline-block bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
      >
        Go Home
      </a>
    </div>
  );
};

export default NotFound;