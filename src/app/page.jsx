"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const handleLoginNavigation = () => {
    router.push("/login"); // Navigate to the login page
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to the Villain Hub</h1>
        <p className="text-lg mb-6">
          Ready to log your most nefarious deeds and climb the leaderboard?
        </p>
        <button
          onClick={handleLoginNavigation}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Go to Login
        </button>
      </div>
    </main>
  );
}
