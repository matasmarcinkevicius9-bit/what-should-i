import type { Metadata, Viewport } from "next";
import { Anton, Archivo, Monoton, Space_Mono } from "next/font/google";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AboutButton } from "@/components/AboutButton";
import "./globals.css";

const THEME_INIT_SCRIPT = `(function(){try{var s=localStorage.getItem("what-should-i:theme");var d=s?s==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d);}catch(e){}})();`;

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
});

const monoton = Monoton({
  variable: "--font-monoton",
  weight: "400",
  subsets: ["latin"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "What Should I",
  description: "Maintain a list, spin the wheel, let it decide.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#efe9d8" },
    { media: "(prefers-color-scheme: dark)", color: "#09090a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${monoton.variable} ${archivo.variable} ${spaceMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <AboutButton />
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
