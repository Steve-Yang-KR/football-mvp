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
          <h2 className="text-xl font-bold mb-6">⚽ AI Football</h2>

          <nav className="space-y-4">
            <Link href="/" className="block hover:text-blue-400">
              🏠 Dashboard
            </Link>

            <Link href="/requests" className="block hover:text-blue-400">
              📋 Requests
            </Link>

            <Link href="/progress" className="block hover:text-blue-400">
              📈 Progress
            </Link>
            <Link href="/chat" className="block hover:text-blue-400">
              💬 Chat
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
