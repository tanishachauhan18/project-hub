import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ProjectHub – Academic Collaboration & Management Platform",
  description: "Seamless solutions for your academic growth. Centralized SaaS platform connecting Students, Faculty Guides, and Academic Administrators.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600;1,700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-white text-slate-800 selection:bg-[#008766] selection:text-white">
        {children}
      </body>
    </html>
  );
}
