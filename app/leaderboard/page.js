import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "AI Football App",
  description: "AI Football Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen bg-gray-100">

        {/* Sidebar */}
        <div className="w-60 bg-gray-900 text-white p-6">

          {/* Logo */}
          <h2 className="text-xl font-bold mb-8">
            ⚽ AI Football
          </h2>

          {/* Menu */}
          <nav className="space-y-4 text-sm">

            <Link
              href="/"
              className="block hover:text-blue-400"
            >
              🏠 Dashboard
            </Link>

            <Link
              href="/progress"
              className="block hover:text-blue-400"
            >
              📈 Progress
            </Link>

            <Link
              href="/chat"
              className="block hover:text-blue-400"
            >
              💬 Chat
            </Link>

            <Link
              href="/leaderboard"
              className="block hover:text-blue-400"
            >
              🏆 Leaderboard
            </Link>

          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {children}
        </div>

      </body>
    </html>
  );
}
