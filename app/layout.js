import "./globals.css";

export const metadata = {
  title: "AI Football App",
  description: "AI Football Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
