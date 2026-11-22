import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "Afro Egypt Fleet",
  description: "Fleet odometer management system"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
