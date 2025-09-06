import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TabTitleHandler from "@/components/Tabhandler";

export const metadata = {
  title: "Karan | Designer & Developer",
  description: "Freelance Next.js Designer & Developer | Building fast, SEO-friendly, and visually stunning web applications that convert users and drive growth.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <TabTitleHandler />
        {children}
      </body>
    </html>
  );
}
