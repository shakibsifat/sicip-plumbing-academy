import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SICIP Plumbing Academy",
  description: "Plumbing & Pipe Fittings Digital Learning and Examination Platform",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="bn"><body>{children}</body></html>;
}
