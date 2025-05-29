import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeToggle from '../components/ThemeToggle';
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Boven.Net",
  description: "Aplikasi Cari Nama  Boven Digoel",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
        <div className="container mx-auto p-4">
          {/* Header Desktop */}
          <div className="hidden md:flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Boven.Net Search</h1>
            <ThemeToggle />
          </div>
          
          {children}
        </div>
      </body>
    </html>
  );
}
