import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import Sidebar from "./components/Sidebar";
// import RightSidebar from "./components/RightSidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full">
        <aside className="basis-[30%]">
          <Sidebar />
        </aside>

        <main className="basis-[40%]">
          {children}
        </main>

        <aside className="basis-[30%]">
          <RightSidebar />
        </aside>
      </body>
    </html>
  );
}
